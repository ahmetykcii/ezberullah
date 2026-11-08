// VELUNO v5.0 — Yolum ekranı, kıvrımlı öğrenme yolları, durak detay paneli ve ana sayfa önizlemeleri.
// Bütün ilerleme gerçek öğrenme kayıtlarından (state.progress) okunur; bu modül hiçbir ilerleme kaydı YAZMAZ.
import { state, getMeta, setMeta, getSettings } from './storage.js';
import { $, $$, esc, openModal, toast } from './ui.js';
import { LEVELS, LEVEL_NAMES } from './vocabulary.js';
import { getUserNotebookLists, getActiveUserId, openStageSelectionModal } from './notebook.js';
import { startLearn } from './learning.js';
import {
  STOP_SIZE, summarizePath, ensureListPaths, getListPathStops, getLevelPathStops, wordPathState, computeStopProgress,
} from './paths.js';

const ROW = 96;            // durak satır yüksekliği (px)
const PAD = 28;            // tuval üst/alt boşluğu
const WINDOW_RADIUS = 15;  // ilk açılışta geçerli durağın iki yanında çizilen durak sayısı
const WINDOW_STEP = 30;    // "daha fazla göster" ile eklenen durak sayısı

/* ---------- Tercihler (yalnızca görünüm tercihi; öğrenme verisi değildir) ---------- */
export function getPathTab() {
  return getMeta('pathTab') === 'builtin' ? 'builtin' : 'notebook';
}
function prefListMap() {
  const m = getMeta('pathListByUser');
  return m && typeof m === 'object' && !Array.isArray(m) ? m : {};
}
/** Kullanıcının tercih ettiği / son çalıştığı kişisel liste. */
export function getPreferredNotebookList(userId = getActiveUserId()) {
  const lists = getUserNotebookLists(userId);
  if (!lists.length) return null;
  const pref = prefListMap()[userId];
  const found = lists.find((l) => l.id === pref);
  if (found) return found;
  return [...lists].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))[0];
}
export async function setPreferredNotebookList(listId, userId = getActiveUserId()) {
  await setMeta('pathListByUser', { ...prefListMap(), [userId]: listId });
}
export function getPreferredLevel() {
  const l = getMeta('learnLevel');
  return LEVELS.includes(l) ? l : LEVELS[0];
}

/* ---------- Yol özetleri ---------- */
export function notebookPathSummary(list) {
  return summarizePath(list ? getListPathStops(list) : [], state.progress);
}
export function levelPathSummary(level) {
  return summarizePath(getLevelPathStops(level), state.progress);
}

const STATE_TEXT = { done: 'Tamamlandı', active: 'Devam ediyor', todo: 'Henüz başlanmadı', empty: 'Boş' };
const STATE_ICON = { done: '✓', active: '◐', todo: '○', empty: '·' };

const reduceMotion = () => {
  const s = getSettings();
  return !!s.reducedMotion || !s.animations
    || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
};

/* ---------- Geometri (ekran genişliğine duyarlı: x yüzde, y piksel) ---------- */
export const stopX = (i) => 50 + Math.sin(i * 0.9) * 28; // %22 – %78 arası yumuşak kıvrım

function segmentPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(1)}`;
  for (let k = 1; k < points.length; k++) {
    const a = points[k - 1], b = points[k];
    const my = (a.y + b.y) / 2;
    d += ` C ${a.x.toFixed(2)} ${my.toFixed(1)}, ${b.x.toFixed(2)} ${my.toFixed(1)}, ${b.x.toFixed(2)} ${b.y.toFixed(1)}`;
  }
  return d;
}

/** Durak penceresi [lo, hi] için kıvrımlı yol HTML'i (yalnızca görünen duraklar DOM'a eklenir). */
export function pathCanvasHtml(summary, lo, hi, kind) {
  const n = hi - lo + 1;
  if (n <= 0) return '';
  const H = PAD * 2 + n * ROW;
  const yOf = (i) => PAD + (hi - i) * ROW + ROW / 2; // 1. durak en altta → yol yukarı doğru ilerler
  const pts = [];
  for (let i = lo; i <= hi; i++) pts.push({ i, x: stopX(i), y: yOf(i) });
  const track = segmentPath(pts);
  // Tamamlanan bölümler: alt durağı tamamlanmış ardışık parçalar
  let doneD = '';
  for (let k = 1; k < pts.length; k++) {
    const prev = summary.stops[pts[k - 1].i];
    if (prev && prev.progress.state === 'done') doneD += ' ' + segmentPath([pts[k - 1], pts[k]]);
  }
  const nodes = pts.map(({ i, x, y }) => {
    const s = summary.stops[i];
    const st = s.progress.state;
    const isCur = i === summary.currentIndex && !summary.allDone;
    const side = x > 50 ? 'left' : 'right';
    return `<button type="button" class="pstop is-${st} ${isCur ? 'is-current' : ''}" data-stop-index="${i}" style="left:${x.toFixed(2)}%;top:${y}px;--p:${s.progress.pct}"
        aria-label="Durak ${s.number}: ${s.progress.done}/${s.progress.total} kelime tamamlandı, ${STATE_TEXT[st]}">
        <span class="pstop-core" aria-hidden="true">${st === 'done' ? '✓' : s.number}</span>
        <span class="pstop-label ${side}" aria-hidden="true"><b>Durak ${s.number}</b><small>${STATE_ICON[st]} ${s.progress.done}/${s.progress.total} · ${STATE_TEXT[st]}</small>${isCur ? '<em>Buradasın</em>' : ''}</span>
      </button>`;
  }).join('');
  return `<div class="path-canvas path-${kind}" style="height:${H}px">
      <svg class="path-svg" viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path class="path-track" d="${track}" vector-effect="non-scaling-stroke"/>
        ${doneD ? `<path class="path-done" d="${doneD.trim()}" vector-effect="non-scaling-stroke"/>` : ''}
      </svg>
      ${nodes}
    </div>`;
}

/** Ana sayfa için kısa yol önizlemesi (en çok 5 durak; geçerli durak ortada). */
export function miniPathHtml(summary, kind) {
  if (!summary.totalStops) return '';
  const cur = Math.max(0, summary.currentIndex);
  let lo = Math.max(0, cur - 2);
  const hi = Math.min(summary.totalStops - 1, lo + 4);
  lo = Math.max(0, hi - 4);
  const idx = [];
  for (let i = lo; i <= hi; i++) idx.push(i);
  const W = 100, H = 64;
  const step = idx.length > 1 ? 80 / (idx.length - 1) : 0;
  const pts = idx.map((i, k) => ({ i, x: idx.length > 1 ? 10 + k * step : 50, y: i % 2 === 0 ? 42 : 22 }));
  const segs = (filterDone) => {
    let d = '';
    for (let k = 1; k < pts.length; k++) {
      const a = pts[k - 1], b = pts[k];
      if (filterDone && summary.stops[a.i].progress.state !== 'done') continue;
      const mx = (a.x + b.x) / 2;
      d += ` M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
    }
    return d.trim();
  };
  const doneD = segs(true);
  return `<div class="mini-path path-${kind}" role="img" aria-label="Öğrenme yolu önizlemesi: ${summary.doneStops}/${summary.totalStops} durak tamamlandı">
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path class="path-track" d="${segs(false)}" vector-effect="non-scaling-stroke"/>
        ${doneD ? `<path class="path-done" d="${doneD}" vector-effect="non-scaling-stroke"/>` : ''}
      </svg>
      ${pts.map(({ i, x, y }) => {
        const s = summary.stops[i];
        const isCur = i === summary.currentIndex && !summary.allDone;
        return `<span class="mini-stop is-${s.progress.state} ${isCur ? 'is-current' : ''}" style="left:${x}%;top:${(y / H) * 100}%;--p:${s.progress.pct}">${s.progress.state === 'done' ? '✓' : s.number}</span>`;
      }).join('')}
    </div>`;
}

/* ---------- Durak detay paneli ---------- */
const WORD_STATE = {
  mastered: { t: 'Kalıcı öğrenildi', c: 'ok', i: '★' },
  learned: { t: 'Öğrenildi', c: 'ok', i: '✓' },
  'learned-review': { t: 'Öğrenildi · tekrar zamanı', c: 'ok', i: '✓' },
  review: { t: 'Tekrar edilecek', c: 'warn', i: '↻' },
  learning: { t: 'Öğreniliyor', c: 'mid', i: '◐' },
  new: { t: 'Yeni', c: 'new', i: '○' },
};

export function openStopDetail({ kind, stop, list = null, level = null, onChanged = null }) {
  const ids = (stop.wordIds || []).filter((id) => state.wordMap.has(id));
  const pr = computeStopProgress(ids, state.progress);
  const rows = ids.map((id) => {
    const w = state.wordMap.get(id);
    const ws = WORD_STATE[wordPathState(state.progress[id])] || WORD_STATE.new;
    return `<li class="stop-word"><span class="stop-word-main"><b>${esc(w.word)}</b><span class="muted small">${esc((w.meanings || []).join(', '))}</span></span><span class="stop-chip ${ws.c}"><span aria-hidden="true">${ws.i}</span> ${ws.t}</span></li>`;
  }).join('');
  const ctx = kind === 'notebook' ? esc(list?.name || 'Kelime Defterim') : `${esc(level)} — ${esc(LEVEL_NAMES[level] || '')}`;
  openModal({
    title: `Durak ${stop.number}`,
    html: `<div class="stop-detail path-${kind}">
        <p class="muted small stop-ctx">${ctx}</p>
        <div class="stop-stats">
          <div><b>${pr.total}</b><span>Kelime</span></div>
          <div><b>${pr.done}</b><span>Öğrenildi / Kalıcı</span></div>
          <div><b>%${pr.pct}</b><span>${STATE_TEXT[pr.state]}</span></div>
        </div>
        <div class="progress stop-bar" role="progressbar" aria-valuenow="${pr.pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pr.pct}%"></i></div>
        <ul class="stop-words">${rows || '<li class="muted small">Bu durakta kelime yok.</li>'}</ul>
        <p class="muted small stop-note">Çalışma, bu duraktaki ${ids.length} kelimenin tamamıyla (öğrenilmiş olanlar dahil) mevcut öğrenme akışında başlar. Paneli açmak ilerlemeni değiştirmez.</p>
        <div class="row end gap"><button type="button" class="btn ghost" data-x>Kapat</button><button type="button" class="btn primary" id="stop-study" ${ids.length ? '' : 'disabled'}>Bu Duraktaki Kelimeleri Çalış</button></div>
      </div>`,
    onMount(b, api) {
      $('[data-x]', b).onclick = api.close;
      $('#stop-study', b).onclick = async () => {
        api.close();
        if (kind === 'notebook') {
          await setPreferredNotebookList(list.id, list.userId);
          openStageSelectionModal({ listId: list.id, mode: 'list', userId: list.userId, pathStop: { wordIds: ids, stopId: stop.id, number: stop.number } });
        } else {
          await startLearn(level, { skipModal: true, explicitWordIds: ids, pathStop: { stopId: stop.id, number: stop.number } });
        }
        if (typeof onChanged === 'function') onChanged();
      };
    },
  });
}

/* ---------- Yolum ekranı ---------- */
export function renderPath(v) {
  const userId = getActiveUserId();
  let tab = getPathTab();
  let level = getPreferredLevel();
  let win = null; // { key, lo, hi }

  const draw = async (opts = {}) => {
    const lists = getUserNotebookLists(userId);
    if (tab === 'notebook' && lists.length) await ensureListPaths(lists); // ilk kurulum / migration (idempotent)
    const list = tab === 'notebook' ? getPreferredNotebookList(userId) : null;
    const summary = tab === 'notebook' ? notebookPathSummary(list) : levelPathSummary(level);
    const kind = tab === 'notebook' ? 'notebook' : 'builtin';
    const key = tab === 'notebook' ? `nb:${list?.id || ''}` : `lv:${level}`;
    const n = summary.totalStops;
    const cur = Math.max(0, summary.currentIndex);
    if (!win || win.key !== key || opts.recenter) {
      win = { key, lo: Math.max(0, cur - WINDOW_RADIUS), hi: Math.min(n - 1, cur + WINDOW_RADIUS) };
    }
    win.lo = Math.max(0, Math.min(win.lo, n - 1));
    win.hi = Math.min(n - 1, Math.max(win.hi, win.lo));

    const tabs = `<div class="seg full path-tabs" role="tablist" aria-label="Yol türü">
        <button type="button" role="tab" class="seg-btn ${tab === 'notebook' ? 'active' : ''}" aria-selected="${tab === 'notebook'}" data-path-tab="notebook">Kelime Defterim</button>
        <button type="button" role="tab" class="seg-btn ${tab === 'builtin' ? 'active' : ''}" aria-selected="${tab === 'builtin'}" data-path-tab="builtin">Hazır Kelimeler</button>
      </div>`;

    let picker = '';
    if (tab === 'notebook' && lists.length > 1) {
      picker = `<label class="path-picker"><span class="sr-only">Liste seç</span><select class="input" id="path-list">${lists.map((l) => `<option value="${esc(l.id)}" ${list && l.id === list.id ? 'selected' : ''}>${esc(l.name)} (${(l.wordIds || []).length})</option>`).join('')}</select></label>`;
    } else if (tab === 'builtin') {
      picker = `<div class="seg sm path-levels" role="group" aria-label="Seviye">${LEVELS.map((l) => `<button type="button" class="seg-btn ${l === level ? 'active' : ''}" data-path-level="${l}">${l}</button>`).join('')}</div>`;
    }

    let body = '';
    if (tab === 'notebook' && !lists.length) {
      body = `<div class="path-empty"><b>Henüz kişisel listen yok</b><p class="muted small">Kelime Defterim'de bir liste oluşturup kelime ekle; her 10 kelime yolunda bir durak olur.</p><a class="btn primary" href="#/notebook">Liste Oluştur</a></div>`;
    } else if (!n) {
      body = tab === 'notebook'
        ? `<div class="path-empty"><b>${esc(list?.name || 'Liste')} henüz boş</b><p class="muted small">Kelime ekledikçe yolun burada oluşacak. Her durak en fazla ${STOP_SIZE} kelimeden oluşur.</p><a class="btn primary" href="#/notebook">Kelime Ekle</a></div>`
        : `<div class="path-empty"><b>${esc(level)} için hazır kelime bulunamadı</b></div>`;
    } else {
      const head = `<div class="path-summary">
          <div><b>${summary.doneStops}/${summary.totalStops}</b><span>durak tamamlandı</span></div>
          <div><b>${summary.doneWords}/${summary.totalWords}</b><span>kelime öğrenildi</span></div>
          <div><b>%${summary.pct}</b><span>${summary.allDone ? 'Tamamlandı' : summary.doneWords ? 'Devam ediyor' : 'Başlangıç'}</span></div>
        </div>
        ${n > 6 ? `<button type="button" class="btn sm path-jump" id="path-jump">Kaldığım Yere Git</button>` : ''}`;
      const more = win.hi < n - 1 ? `<button type="button" class="btn ghost block path-more" id="path-more-up">Sonraki durakları göster (${n - 1 - win.hi} durak daha)</button>` : '';
      const less = win.lo > 0 ? `<button type="button" class="btn ghost block path-more" id="path-more-down">Önceki durakları göster (${win.lo} durak)</button>` : '';
      body = `${head}<div class="path-wrap">${more}${pathCanvasHtml(summary, win.lo, win.hi, kind)}${less}</div>
        <p class="muted small path-legend"><span class="lg done">✓ Tamamlandı</span><span class="lg active">◐ Devam ediyor</span><span class="lg todo">○ Henüz başlanmadı</span></p>`;
    }

    v.innerHTML = `<div class="page path-page">
        <div class="page-head"><h1>Yolum</h1></div>
        ${tabs}
        <div class="path-toolbar">${picker}</div>
        ${body}
      </div>`;

    $$('[data-path-tab]', v).forEach((b) => { b.onclick = async () => { tab = b.dataset.pathTab; await setMeta('pathTab', tab); win = null; draw(); }; });
    $$('[data-path-level]', v).forEach((b) => { b.onclick = async () => { level = b.dataset.pathLevel; await setMeta('learnLevel', level); win = null; draw(); }; });
    const sel = $('#path-list', v);
    if (sel) sel.onchange = async () => { await setPreferredNotebookList(sel.value, userId); win = null; draw(); };
    const up = $('#path-more-up', v);
    if (up) up.onclick = () => { win.hi = Math.min(n - 1, win.hi + WINDOW_STEP); draw(); };
    const down = $('#path-more-down', v);
    if (down) down.onclick = () => { win.lo = Math.max(0, win.lo - WINDOW_STEP); draw({ keepScroll: true }); };
    const jump = $('#path-jump', v);
    if (jump) jump.onclick = () => { draw({ recenter: true, scrollToCurrent: true }); };
    $$('[data-stop-index]', v).forEach((b) => {
      b.onclick = () => {
        const s = summary.stops[Number(b.dataset.stopIndex)];
        if (!s) return;
        openStopDetail({ kind, stop: s, list, level });
      };
    });
    if (opts.scrollToCurrent || opts.initial) {
      const target = $('.pstop.is-current', v) || $(`[data-stop-index="${cur}"]`, v);
      if (target && typeof target.scrollIntoView === 'function') {
        requestAnimationFrame(() => target.scrollIntoView({ block: 'center', behavior: opts.initial || reduceMotion() ? 'auto' : 'smooth' }));
      }
    }
  };
  draw({ initial: true }).catch((e) => { console.error(e); toast('Yol yüklenemedi: ' + e.message, 'error'); });
}
