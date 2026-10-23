// İçe aktarma (CSV/TXT/JSON/XLSX), JSON yedekleme ve geri yükleme.
import { state, saveMany, replaceAll, getSettings, setAllSettings, getMeta } from './storage.js';
import { validateWord, buildWord, findDuplicate, LEVELS } from './vocabulary.js';
import { SCHEMA_VERSION } from './storage.js';
import { $, $$, esc, openModal, toast, confirmDialog } from './ui.js';

/* ---------- Ayrıştırma (saf fonksiyonlar) ---------- */
export function parseCSV(text, delim = ',') {
  const rows = []; let row = [], cur = '', q = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c;
    } else if (c === '"') q = true;
    else if (c === delim) { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; }
    else cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim() !== '')).map((r) => r.map((x) => x.trim()));
}
export function detectDelimiter(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim()).slice(0, 10);
  const cands = ['\t', ';', ',', ' - ', ' – ', '='];
  let best = ',', bestScore = 0;
  for (const d of cands) { const sc = lines.filter((l) => l.includes(d)).length; if (sc > bestScore) { best = d; bestScore = sc; } }
  return best;
}
const HEADER_WORDS = ['word', 'kelime', 'english', 'ingilizce', 'meaning', 'meanings', 'anlam', 'turkish', 'türkçe', 'level', 'seviye'];
export function parseTable(text, ext = 'csv') {
  let rows;
  if (ext === 'json') {
    let data = JSON.parse(text);
    if (data && !Array.isArray(data) && Array.isArray(data.words)) data = data.words;
    if (!Array.isArray(data)) throw new Error('JSON bir kelime listesi (dizi) olmalı');
    const keys = [...new Set(data.flatMap((o) => Object.keys(o || {})))];
    rows = [keys, ...data.map((o) => keys.map((k) => (Array.isArray(o?.[k]) ? o[k].join('; ') : String(o?.[k] ?? ''))))];
  } else {
    const d = detectDelimiter(text);
    rows = d.length > 1 ? text.split(/\r?\n/).filter((l) => l.trim()).map((l) => l.split(d).map((x) => x.trim())) : parseCSV(text, d);
    if (ext === 'txt' && d === ',') rows = text.split(/\r?\n/).filter((l) => l.trim()).map((l) => { const i = l.indexOf(','); return i < 0 ? [l.trim()] : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; });
  }
  if (!rows.length) throw new Error('Dosyada veri bulunamadı');
  const hasHeader = rows[0].some((c) => HEADER_WORDS.includes(c.toLowerCase())) || ext === 'json';
  const headers = hasHeader ? rows[0] : rows[0].map((_, i) => `Kolon ${i + 1}`);
  return { headers, rows: hasHeader ? rows.slice(1) : rows };
}

export const FIELDS = [
  ['word', 'İngilizce kelime *'], ['meanings', 'Türkçe anlam *'], ['level', 'Seviye'], ['partOfSpeech', 'Kelime türü'],
  ['exampleSentence', 'Örnek cümle'], ['exampleTranslation', 'Örnek çeviri'], ['category', 'Kategori'], ['alternativeAnswers', 'Alternatif cevaplar'], ['synonyms', 'Eş anlamlılar'],
];
const GUESS = { word: ['word', 'kelime', 'english', 'ingilizce'], meanings: ['meanings', 'meaning', 'anlam', 'turkish', 'türkçe', 'translation'], level: ['level', 'seviye'], partOfSpeech: ['partofspeech', 'pos', 'tür', 'type'],
  exampleSentence: ['examplesentence', 'example', 'örnek', 'sentence'], exampleTranslation: ['exampletranslation', 'çeviri'], category: ['category', 'kategori'], alternativeAnswers: ['alternativeanswers', 'alternatif'], synonyms: ['synonyms', 'eş anlamlılar'] };
export function guessMapping(headers) {
  const m = {};
  FIELDS.forEach(([k]) => { m[k] = headers.findIndex((h) => GUESS[k].includes(h.toLowerCase().replace(/[\s_-]/g, ''))); });
  if (m.word < 0 && headers.length >= 1 && headers.every((h) => /^Kolon/.test(h))) { m.word = 0; if (headers.length > 1) m.meanings = 1; }
  return m;
}

/** Satırları doğrular: valid / dup / error olarak sınıflandırır. */
export function analyzeRows(rows, map, defLevel, existing = state.words) {
  const seen = [];
  return rows.map((r, i) => {
    const f = {};
    FIELDS.forEach(([k]) => { f[k] = map[k] >= 0 ? r[map[k]] ?? '' : ''; });
    f.level = (f.level || defLevel || '').toString().toUpperCase().trim();
    const w = buildWord(f);
    const errs = validateWord(w);
    if (errs.length) return { line: i + 1, w, status: 'error', msg: errs.join(', ') };
    if (findDuplicate(w, existing)) return { line: i + 1, w, status: 'dup', msg: 'Zaten kayıtlı' };
    if (findDuplicate(w, seen)) return { line: i + 1, w, status: 'dup', msg: 'Dosyada tekrar' };
    seen.push(w);
    return { line: i + 1, w, status: 'ok', msg: '' };
  });
}

function loadScript(src) {
  return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('XLSX kütüphanesi yüklenemedi (internet gerekir)')); document.head.appendChild(s); });
}
async function readFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'xlsx' || ext === 'xls') {
    if (!window.XLSX) await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
    const wb = window.XLSX.read(await file.arrayBuffer());
    const rows = window.XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '' }).filter((r) => r.some((x) => String(x).trim())).map((r) => r.map((x) => String(x).trim()));
    if (!rows.length) throw new Error('Çalışma sayfası boş');
    const hasHeader = rows[0].some((c) => HEADER_WORDS.includes(c.toLowerCase()));
    return { headers: hasHeader ? rows[0] : rows[0].map((_, i) => `Kolon ${i + 1}`), rows: hasHeader ? rows.slice(1) : rows };
  }
  if (!['csv', 'txt', 'json'].includes(ext)) throw new Error('Desteklenen türler: CSV, TXT, JSON, XLSX');
  return parseTable(await file.text(), ext);
}

/* ---------- İçe aktarma sihirbazı ---------- */
export function openImportWizard(onDone) {
  openModal({
    title: 'Toplu kelime içe aktar', wide: true,
    html: `<div id="wz"><p class="muted">1) Dosya seçin (CSV, TXT, JSON, XLSX). TXT için satır başına <code>kelime - anlam</code> / <code>kelime;anlam</code> / <code>kelime,anlam</code> biçimi kullanılabilir. XLSX ilk kullanımda açık kaynak SheetJS kütüphanesini internetten yükler.</p>
      <input type="file" id="file" accept=".csv,.txt,.json,.xlsx,.xls" class="input"></div>`,
    onMount(b, api) {
      const wz = $('#wz', b);
      $('#file', b).onchange = async (e) => {
        const f = e.target.files[0]; if (!f) return;
        let t;
        try { t = await readFile(f); } catch (err) { return toast('Dosya okunamadı: ' + err.message, 'error'); }
        stepMap(t);
      };
      function stepMap(t) {
        const m = guessMapping(t.headers);
        wz.innerHTML = `<p class="muted">2) Kolonları eşleştirin · ${t.rows.length} satır okundu.</p><div class="grid form">
          ${FIELDS.map(([k, l]) => `<label>${l}<select class="input" data-f="${k}"><option value="-1">— yok —</option>${t.headers.map((h, i) => `<option value="${i}" ${m[k] === i ? 'selected' : ''}>${esc(h)}</option>`).join('')}</select></label>`).join('')}
          <label>Varsayılan seviye<select class="input" id="deflv">${LEVELS.map((l) => `<option>${l}</option>`).join('')}</select></label></div>
          <div class="row end"><button class="btn primary" id="prev">Önizle →</button></div>`;
        $('#prev', wz).onclick = () => {
          const map = {}; $$('[data-f]', wz).forEach((s) => (map[s.dataset.f] = +s.value));
          stepPreview(t, map, $('#deflv', wz).value);
        };
      }
      function stepPreview(t, map, lv) {
        const res = analyzeRows(t.rows, map, lv);
        const c = { ok: 0, dup: 0, error: 0 }; res.forEach((r) => c[r.status]++);
        wz.innerHTML = `<p>3) Önizleme: <span class="chip">${c.ok} eklenecek</span> <span class="chip alt">${c.dup} tekrar</span> <span class="chip bad">${c.error} hatalı</span></p>
          <div class="table scroll">${res.slice(0, 150).map((r) => `<div class="row-item ${r.status}"><span>${r.line}</span><span><b>${esc(r.w.word)}</b> ${esc(r.w.meanings.join('; '))}</span><span>${r.w.level}</span><span class="chip ${r.status === 'ok' ? '' : r.status === 'dup' ? 'alt' : 'bad'}">${r.status === 'ok' ? 'Hazır' : esc(r.msg)}</span></div>`).join('')}${res.length > 150 ? `<p class="muted">… ve ${res.length - 150} satır daha</p>` : ''}</div>
          <p class="muted small">Hatalı ve tekrarlayan satırlar atlanır. Mevcut ilerlemeniz etkilenmez.</p>
          <div class="row end"><button class="btn ghost" id="back">← Geri</button><button class="btn primary" id="go" ${c.ok ? '' : 'disabled'}>${c.ok} kelimeyi ekle</button></div>`;
        $('#back', wz).onclick = () => stepMap(t);
        $('#go', wz).onclick = async () => {
          const add = res.filter((r) => r.status === 'ok').map((r) => r.w);
          try { await saveMany('words', add); } catch (err) { return toast('Kayıt başarısız, hiçbir kelime eklenmedi: ' + err.message, 'error'); }
          wz.innerHTML = `<h3>✅ İçe aktarma tamamlandı</h3><p>${add.length} kelime eklendi, ${c.dup} tekrar ve ${c.error} hatalı satır atlandı.</p><div class="row end"><button class="btn primary" data-close2>Kapat</button></div>`;
          $('[data-close2]', wz).onclick = () => { api.close(); onDone && onDone(); };
          onDone && onDone();
        };
      }
    },
  });
}

/* ---------- Yedekleme ---------- */
export function buildBackup() {
  const meta = [];
  if (getMeta('deletedIds')) meta.push({ key: 'deletedIds', value: getMeta('deletedIds') });
  if (state.grammarProgress && Object.keys(state.grammarProgress).length) {
    meta.push({ key: 'grammarProgress', value: { ...state.grammarProgress } });
  }
  return {
    app: 'VELUNO', schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(),
    words: state.words, progress: Object.values(state.progress), exams: state.exams, daily: Object.values(state.daily),
    grammarProgress: Object.values(state.grammarProgress || {}),
    meta, settings: getSettings(),
  };
}
/** Geri yüklemeden önce doğrular. Hata listesi döner (boşsa geçerli). VELUNO, EZBERULLAH ve LEXORA yedeklerini destekler. */
export function validateBackup(o) {
  const e = [];
  if (!o || typeof o !== 'object' || (o.app !== 'VELUNO' && o.app !== 'EZBERULLAH' && o.app !== 'LEXORA')) return ['Bu bir VELUNO yedek dosyası değil'];
  if (typeof o.schemaVersion !== 'number') e.push('Şema sürümü eksik');
  else if (o.schemaVersion > SCHEMA_VERSION) e.push('Yedek daha yeni bir VELUNO sürümünden; uygulamayı güncelleyin');
  for (const k of ['words', 'progress', 'exams', 'daily', 'meta']) if (!Array.isArray(o[k])) e.push(`"${k}" listesi eksik veya hatalı`);
  if (o.grammarProgress !== undefined && !Array.isArray(o.grammarProgress) && typeof o.grammarProgress !== 'object') {
    e.push('"grammarProgress" alanı geçersiz');
  }
  if (e.length) return e;
  const bad = o.words.map((w) => [w?.id, validateWord(w)]).filter(([, er]) => er.length);
  if (bad.length) e.push(`${bad.length} kelime geçersiz (örn. ${bad[0][0]}: ${bad[0][1][0]})`);
  if (new Set(o.words.map((w) => w.id)).size !== o.words.length) e.push('Tekrarlanan kelime kimlikleri var');
  if (o.progress.some((p) => !p || typeof p.id !== 'string')) e.push('Bozuk ilerleme kaydı var');
  if (o.daily.some((d) => !d || typeof d.date !== 'string')) e.push('Bozuk günlük kayıt var');
  if (o.exams.some((x) => !x || typeof x.id !== 'string' || typeof x.date !== 'string')) e.push('Bozuk sınav kaydı var');
  if (Array.isArray(o.grammarProgress) && o.grammarProgress.some((gp) => !gp || typeof gp.topicId !== 'string')) {
    e.push('Bozuk grammar ilerleme kaydı var');
  }
  return e;
}
export async function restoreBackup(o) {
  await replaceAll({
    words: o.words, progress: o.progress, exams: o.exams, daily: o.daily,
    grammarProgress: o.grammarProgress,
    meta: [...o.meta, { key: 'schemaVersion', value: SCHEMA_VERSION }],
  });
  if (o.settings) setAllSettings(o.settings);
}
export function downloadFile(name, text, type = 'application/json') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
export function exportBackup() {
  downloadFile(`veluno-yedek-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(buildBackup(), null, 1));
  toast('Yedek dosyası indirildi.', 'success');
}
export function pickAndRestore() {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    let o;
    try { o = JSON.parse(await f.text()); } catch { return toast('Dosya geçerli bir JSON değil.', 'error'); }
    const errs = validateBackup(o);
    if (errs.length) return toast('Yedek doğrulanamadı: ' + errs[0], 'error', 6000);
    const ok = await confirmDialog(`Yedek geçerli: ${o.words.length} kelime, ${o.progress.length} ilerleme kaydı, ${o.exams.length} sınav. Geri yüklemek MEVCUT verilerin yerine geçer. Devam edilsin mi?`, { okLabel: 'Geri yükle', danger: true });
    if (!ok) return;
    try { await restoreBackup(o); toast('Yedek geri yüklendi. Sayfa yenileniyor…', 'success'); setTimeout(() => location.reload(), 900); }
    catch (err) { toast('Geri yükleme başarısız; mevcut veriler korundu: ' + err.message, 'error', 6000); }
  };
  inp.click();
}
