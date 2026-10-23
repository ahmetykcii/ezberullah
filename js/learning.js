// Öğrenme motoru arayüzü: ortak "oturum çalıştırıcı" (runner) + 6 aşamalı Kelime Öğren akışı.
// Tüm modlar (learn, review, exam) bu çalıştırıcıyı kullanır; oturum her cevapta kaydedilir ve yenilemede devam eder.
import { state, getMeta, setMeta, getSettings, getProgress, saveProgress } from './storage.js';
import * as E from './engine.js';
import { $, $$, esc, toast, speak, sfx, hasModal, closeTopModal, confirmDialog, ICONS, successMark } from './ui.js';
import { LEVELS, LEVEL_NAMES, posLabel, statusLabel } from './vocabulary.js';
import { bumpDaily, levelStats } from './statistics.js';

export const handlers = {}; // kind -> { onAnswer(item, ok, info), onDone(results, sess) }
let cur = null;
let answered = false;
let shownAt = 0;
let curQ = null;
const view = () => document.getElementById('view');

export const sessionActive = () => !!cur;
const setFocusMode = (on) => { if (typeof document !== 'undefined') document.body.classList.toggle('focus', on); };
let lastPct = 0;
export function abortSession() { cur = null; if (typeof document !== 'undefined') document.body.classList.remove('focus', 'kb-open'); }

export async function startSession(s) {
  cur = { feedback: true, params: {}, idx: 0, results: [], level: s.level || s.params?.level || getMeta('learnLevel') || 'A2', ...s };
  lastPct = cur.items.length ? (cur.idx / cur.items.length) * 100 : 0;
  setFocusMode(true); // oturum boyunca tek soruya odaklanan, menüsüz ekran
  await persist();
  renderItem();
}
export async function resumeSaved(targetLevel = null) {
  let s = null;
  if (targetLevel) {
    const byLevel = getMeta('activeSessionsByLevel') || {};
    s = byLevel[targetLevel];
  }
  if (!s) s = getMeta('activeSession');
  if (!s || !handlers[s.kind]) return false;
  await startSession(s);
  return true;
}
const persist = async () => {
  if (!cur) {
    await setMeta('activeSession', null);
    return;
  }
  const sessionData = {
    kind: cur.kind,
    title: cur.title,
    level: cur.level || cur.params?.level || getMeta('learnLevel') || 'A2',
    items: cur.items,
    idx: cur.idx,
    results: cur.results,
    params: cur.params,
    feedback: cur.feedback,
  };
  await setMeta('activeSession', sessionData);
  if (sessionData.kind === 'learn' && sessionData.level) {
    const byLevel = getMeta('activeSessionsByLevel') || {};
    byLevel[sessionData.level] = sessionData;
    await setMeta('activeSessionsByLevel', byLevel);
  }
};

async function finish() {
  const s = cur;
  const out = await handlers[s.kind].onDone(s.results, s);
  const finLevel = s.level || s.params?.level;
  cur = null;
  setFocusMode(false);
  await setMeta('activeSession', null);
  if (s.kind === 'learn' && finLevel) {
    const byLevel = getMeta('activeSessionsByLevel') || {};
    if (byLevel[finLevel]) {
      delete byLevel[finLevel];
      await setMeta('activeSessionsByLevel', byLevel);
    }
  }
  if (out) { view().innerHTML = out.html; if (out.mount) out.mount(view()); }
}
export const summaryHtml = ({ title, big, sub, extra = '', actions = '', verdict = '', mark = true }) =>
  `<div class="summary">${mark ? successMark() : ''}<h2>${esc(title)}</h2><div class="big-num">${big}</div>${verdict ? `<p class="verdict">${verdict}</p>` : ''}<p class="muted">${sub}</p>${extra ? `<details class="more"><summary>Ayrıntılar</summary><div class="more-body">${extra}</div></details>` : ''}<div class="sum-actions">${actions}<a class="btn ghost" href="#/dashboard">Ana Sayfa</a></div></div>`;

const TYPE_LABEL = {
  card: 'Kelimeyi Öğren',
  mc: 'Çoktan Seçmeli Soru',
  typing: 'İngilizce Kelimeyi Yaz',
  missing: 'Eksik Harfleri Tamamla',
  sentence: 'Örnek Cümlede Boşluk Doldur',
  production: 'Kelimeyi Cümlede Kullan',
  listening: 'Dinleyerek Yaz',
};

function renderItem() {
  answered = false;
  if (!cur) return;
  if (cur.idx >= cur.items.length) return finish();
  const item = cur.items[cur.idx];
  const word = state.wordMap.get(item.wordId);
  if (!word) { cur.idx++; return renderItem(); } // silinmiş kelime
  const n = cur.items.length, pct = (cur.idx / n) * 100;
  const label = item.stage ? E.STAGES[item.stage - 1] : TYPE_LABEL[item.type];
  const dots = item.stage ? `<span class="stage-dots" role="img" aria-label="Aşama ${item.stage}/6">${[1, 2, 3, 4, 5, 6].map((i) => `<i class="${i <= item.stage ? 'on' : ''}"></i>`).join('')}</span>` : '';
  if (item.type === 'card') {
    curQ = null;
  } else {
    if (!item.q) {
      const built = E.buildQuestion(word, item.type, state.words);
      const { word: _w, ...rest } = built;
      item.q = rest;
    }
    curQ = { ...item.q, word };
  }
  if (curQ && curQ.type !== item.type) item.type = curQ.type;
  view().innerHTML = `<div class="run">
    <div class="run-top">
      <button class="icon-btn" id="q-exit" aria-label="Çık">${ICONS.close}</button>
      <div class="progress thin" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${lastPct}%"></i></div>
      <span class="run-count">${cur.idx + 1}/${n}</span>
    </div>
    <div class="run-body" id="qcard">
      <div class="run-label">${dots}<span>${esc(label)}</span></div>
      <div id="qbody">${bodyHtml(item, word)}</div>
      <div id="fb"></div>
    </div>
  </div>`;
  const bar = $('.progress i');
  if (bar) requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = pct + '%'; }));
  lastPct = pct;
  $('#q-exit').onclick = () => {
    abortSession();
    if (location.hash === '#/dashboard') window.dispatchEvent(new HashChangeEvent('hashchange'));
    else location.hash = '#/dashboard';
    toast('Oturum kaydedildi; Ana Sayfadan kaldığınız yerden devam edebilirsiniz.');
  };
  wire(item, word);
}

export function toggleFocus() { setFocusMode(!document.body.classList.contains('focus')); }

const speakBtn = (t) => `<span class="speak-row"><button type="button" class="speak-btn" data-speak="${esc(t)}" aria-label="Dinle">${ICONS.speaker}</button><button type="button" class="text-btn" data-speak="${esc(t)}" data-slow="1" aria-label="Yavaş dinle">Yavaş</button></span>`;
const inputForm = (ph) => `<form id="ans" autocomplete="off"><input id="inp" class="input lg" placeholder="${ph}" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" inputmode="text" aria-label="Cevabınız"><button class="btn primary xl block" type="submit">Kontrol Et</button></form>`;

function cardDetails(w) {
  const fam = w.wordFamily?.length ? `<div class="kv"><span>Kelime ailesi</span>${esc(w.wordFamily.join(', '))}</div>` : '';
  const syn = w.synonyms?.length ? `<div class="kv"><span>Eş anlamlılar</span>${esc(w.synonyms.join(', '))}</div>` : '';
  return `<div class="meaning">${esc(w.meanings.join(' · '))}</div><div class="pos">${esc(posLabel(w.partOfSpeech))}</div>
    ${w.exampleSentence ? `<blockquote>${esc(w.exampleSentence)}<small>${esc(w.exampleTranslation || '')}</small></blockquote>` : ''}${syn}${fam}`;
}

function bodyHtml(item, w) {
  const q = curQ;
  if (item.type === 'card') {
    return `<h2 class="word">${esc(w.word)}</h2>${w.pronunciation ? `<div class="muted">${esc(w.pronunciation)}</div>` : ''}${speakBtn(w.word)}
      <div id="reveal-area"><button type="button" class="btn primary xl block" id="reveal">Anlamı Göster</button></div>`;
  }
  if (item.type === 'mc') return `<h2 class="word">${esc(q.prompt)}</h2>${speakBtn(q.prompt)}<p class="hint">Doğru Türkçe anlamı seç</p><div class="options">${q.options.map((o, i) => `<button type="button" class="opt" data-i="${i}"><span class="opt-n">${i + 1}</span><span>${esc(o)}</span></button>`).join('')}</div>`;
  if (item.type === 'typing') return `<p class="hint">İngilizce karşılığını yaz · ${esc(posLabel(q.pos))}, ${q.hintLen} harf</p><h2 class="word">${esc(q.prompt)}</h2>${inputForm('İngilizce kelimeyi yazın…')}`;
  if (item.type === 'missing') return `<p class="hint">Eksik harfleri tamamla · ${esc(posLabel(q.pos))}</p><h2 class="word mono">${esc(q.prompt)}</h2><div class="meaning">${esc(q.meaning)}</div>${inputForm('Kelimenin tamamını yazın…')}`;
  if (item.type === 'sentence') return `<p class="hint">Boşluğa gelecek kelimeyi yaz</p><h2 class="sent">${esc(q.prompt)}</h2><div class="muted small">${esc(q.hint || '')}</div><div class="meaning">${esc(q.meaning)}</div>${inputForm('Eksik kelimeyi yazın…')}`;
  if (item.type === 'listening') return `<p class="hint">Duyduğun İngilizce kelimeyi yaz</p>${speakBtn(q.prompt)}${inputForm('Duyduğunuz kelimeyi yazın…')}`;
  if (item.type === 'production') {
    return `<p class="hint">Bu kelimeyi içeren, en az 4 kelimelik kendi cümleni yaz</p>
      <h2 class="word">${esc(q.prompt)}</h2>
      <div class="meaning">${esc(q.meaning)}</div>
      <div class="hint-wrap" id="hint-area">
        <button type="button" class="btn text-btn sm hint-toggle" id="btn-show-hint">💡 İpucu Göster</button>
        <div id="hint-content" class="hint-content" style="display:none;"></div>
      </div>
      <form id="ans" autocomplete="off">
        <input id="inp" class="input lg" placeholder="İngilizce cümlenizi yazın…" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" inputmode="text" aria-label="Cevabınız">
        <div id="prod-msg" class="prod-msg" role="status" aria-live="polite"></div>
        <button class="btn primary xl block" type="submit" id="btn-submit">Kontrol Et</button>
      </form>`;
  }
  return '';
}

function wire(item, word) {
  shownAt = Date.now();
  $$('[data-speak]').forEach((b) => { b.onclick = () => speak(b.dataset.speak, !!b.dataset.slow); });
  if (item.type === 'card') {
    const rv = $('#reveal');
    rv.onclick = () => {
      $('#reveal-area').innerHTML = `${cardDetails(word)}<button type="button" class="btn primary xl block" id="next">Devam Et</button>`;
      const nx = $('#next'); nx.onclick = () => submit(true, ''); nx.focus();
    };
    rv.focus();
    return;
  }
  if (item.type === 'mc') $$('.opt').forEach((b) => { b.onclick = () => { b.classList.add('picked'); submit(+b.dataset.i, +b.dataset.i); }; });
  else if (item.type === 'production') {
    let hintLevel = 0;
    const hints = E.getWordHints(word);
    const renderHintView = () => {
      const c = $('#hint-content');
      if (!c) return;
      c.style.display = 'block';
      let html = '';
      if (hintLevel >= 1) {
        html += `<div class="hint-step"><span class="hint-badge">İpucu 1 / 3 · Kullanım</span><p>${esc(hints.usage)}</p></div>`;
      }
      if (hintLevel >= 2) {
        html += `<div class="hint-step"><span class="hint-badge">İpucu 2 / 3 · Cümle Kalıbı</span><p class="hint-frame"><code>${esc(hints.frame)}</code></p><small class="muted">Boşluğu kendi cümlenle tamamlayabilirsin.</small></div>`;
      }
      if (hintLevel >= 3) {
        html += `<div class="hint-step"><span class="hint-badge">İpucu 3 / 3 · Örnek Cümle</span><blockquote>${esc(hints.exampleSentence)}<small>${esc(hints.exampleTranslation || '')}</small></blockquote><p class="muted small">${esc(hints.exampleNote)}</p></div>`;
      }
      if (hintLevel < 3) {
        const nextLabel = hintLevel === 1 ? 'Sonraki İpucu (Cümle Kalıbı) ➔' : 'Sonraki İpucu (Örnek Cümle) ➔';
        html += `<button type="button" class="btn text-btn sm" id="btn-next-hint">${nextLabel}</button>`;
      }
      c.innerHTML = html;
      const bnh = $('#btn-next-hint');
      if (bnh) {
        bnh.onclick = () => {
          hintLevel++;
          renderHintView();
        };
      }
    };
    const bsh = $('#btn-show-hint');
    if (bsh) {
      bsh.onclick = () => {
        bsh.style.display = 'none';
        hintLevel = 1;
        renderHintView();
      };
    }
    $('#ans').onsubmit = (e) => {
      e.preventDefault();
      const v = $('#inp').value;
      const res = E.evaluateSentence(word, v);
      const msgEl = $('#prod-msg');
      if (res.status === 'needs_fix') {
        if (msgEl) {
          msgEl.innerHTML = `<div class="eval-note error" role="alert">${esc(res.message)}</div>`;
        }
        $('#inp').focus();
        return;
      }
      if (res.status === 'ambiguous') {
        if (msgEl) {
          msgEl.innerHTML = `<div class="eval-note warn" role="alert">
            <p>${esc(res.message)}</p>
            <div class="ambiguous-actions">
              <button type="button" class="btn primary sm" id="btn-force-pass">Yine de Devam Et</button>
              <button type="button" class="btn ghost sm" id="btn-re-edit">Cümleyi Düzenle</button>
            </div>
          </div>`;
          $('#btn-force-pass').onclick = () => {
            submit(v, v, { customOk: true, evalResult: res });
          };
          $('#btn-re-edit').onclick = () => {
            msgEl.innerHTML = '';
            $('#inp').focus();
          };
        }
        return;
      }
      submit(v, v, { customOk: true, evalResult: res });
    };
    $('#inp').focus();
  }
  else { $('#ans').onsubmit = (e) => { e.preventDefault(); const v = $('#inp').value; if (v.trim()) submit(v, v); }; $('#inp').focus(); }
  if (item.type === 'listening') speak(word.word);
}

async function submit(input, shown, meta = {}) {
  if (answered || !cur) return;
  answered = true;
  const item = cur.items[cur.idx];
  const word = state.wordMap.get(item.wordId);
  const isCard = item.type === 'card';
  const ok = isCard ? true : meta.customOk !== undefined ? meta.customOk : E.checkAnswer(curQ, input);
  const elapsed = Math.min(60, (Date.now() - shownAt) / 1000);
  const r = (await handlers[cur.kind].onAnswer(item, ok, { elapsed, q: curQ, word, input })) || {};
  cur.results.push({ wordId: item.wordId, type: item.type, stage: item.stage || 0, correct: ok, input: String(shown), t: Math.round(elapsed), card: isCard });
  cur.idx++;
  if (r.drop) cur.items = cur.items.slice(0, cur.idx).concat(cur.items.slice(cur.idx).filter((x) => x.wordId !== item.wordId));
  await persist();
  if (isCard) return renderItem();
  if (!cur.feedback) return renderItem();
  showFeedback(ok, word, item, r, meta.evalResult);
}

function showFeedback(ok, word, item, r, evalResult) {
  const qc = $('#qcard');
  qc.classList.add(ok ? 'correct' : 'wrong');
  sfx(ok ? 'ok' : 'bad');
  if (item.type === 'mc') $$('.opt').forEach((b, i) => { b.disabled = true; if (i === curQ.answerIndex) b.classList.add('right'); else if (!ok && b.classList.contains('picked')) b.classList.add('bad'); });
  $$('#qbody input,#qbody form button').forEach((e) => (e.disabled = true));
  let feedbackText = '';
  if (item.type === 'production') {
    feedbackText = `<div class="feedback ok" role="status"><b>${ok ? 'Harika' : 'Değerlendirme'}</b><span>${esc(evalResult?.message || 'Cümlen gerekli kontrolleri geçti.')}</span></div>`;
  } else {
    const ans = `Doğru cevap: ${curQ.display}`;
    feedbackText = `<div class="feedback ${ok ? 'ok' : 'no'}" role="status"><b>${ok ? 'Doğru' : 'Yanlış'}</b><span>${esc(ans)}</span>
      ${!ok && cur.kind === 'learn' ? `<small>Kelime "${statusLabel('REVIEW')}" havuzuna alındı; sonraki oturumda öncelikli gösterilecek.</small>` : ''}</div>`;
  }
  $('#fb').innerHTML = `${feedbackText}<button type="button" class="btn primary xl block" id="cont">Devam</button>`;
  $('#cont').onclick = renderItem; $('#cont').focus();
}

/* ---------- Klavye ---------- */
export function initKeys() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (hasModal()) return void closeTopModal();
      return;
    }
    if (!cur || !getSettings().shortcuts || hasModal() || e.repeat) return;
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    const item = cur.items[cur.idx];
    if (e.key === 'Enter') {
      if (answered) { const c = $('#cont'); if (c) { e.preventDefault(); c.click(); } }
      else if (item?.type === 'card') { const t = $('#reveal') || $('#next'); if (t) { e.preventDefault(); t.click(); } }
    } else if (!typing && !answered && item?.type === 'mc' && /^[1-4]$/.test(e.key)) {
      const b = $$('.opt')[+e.key - 1]; if (b) { b.classList.add('picked'); b.click(); }
    } else if (!typing && e.key === ' ' && item && item.type !== 'production' && document.activeElement?.tagName !== 'BUTTON') {
      e.preventDefault();
      const w = state.wordMap.get(item.wordId); if (w) speak(w.word);
    }
  });
}

/* ---------- Kelime Öğren sayfası ---------- */
handlers.learn = {
  async onAnswer(item, ok, { elapsed }) {
    const p = getProgress(item.wordId);
    if (item.type === 'card') { E.markSeen(p); await saveProgress(p); return {}; }
    const was = p.learningComplete;
    E.applyAnswer(p, ok, { mode: 'learn', stage: item.stage, qtype: item.type });
    await saveProgress(p);
    const d = { seconds: Math.round(elapsed), [ok ? 'correct' : 'wrong']: 1 };
    if (!was && p.learningComplete) { d.learnedWordId = item.wordId; d.done = 1; }
    await bumpDaily(d);
    return { drop: !ok };
  },
  async onDone(results) {
    await bumpDaily({ sessionsCompleted: 1 });
    const q = results.filter((r) => !r.card);
    const ok = q.filter((r) => r.correct).length;
    const done = new Set(q.filter((r) => r.stage === 6 && r.correct).map((r) => r.wordId)).size;
    const failed = [...new Set(q.filter((r) => !r.correct).map((r) => state.wordMap.get(r.wordId)?.word))].filter(Boolean);
    return { html: summaryHtml({ title: 'Oturum Tamamlandı', big: `${done} kelime`, sub: `6 aşamayı tamamladın · ${ok}/${q.length} doğru cevap`,
      extra: failed.length ? `<p>Tekrar Edilecek havuzuna alınanlar: <b>${esc(failed.join(', '))}</b></p>` : '', actions: '<a class="btn primary" href="#/learn">Yeni Grup Başlat</a>' }) };
  },
};

export async function startLearn(level, focus = false) {
  const byLevel = getMeta('activeSessionsByLevel') || {};
  const savedSame = byLevel[level] || (getMeta('activeSession')?.level === level ? getMeta('activeSession') : null);
  if (savedSame && savedSame.idx < (savedSame.items?.length || 0)) {
    const ok = await confirmDialog(`"${level}" seviyesinde yarım kalan bir oturumun var (${savedSame.idx}/${savedSame.items.length}). Yeni bir öğrenme oturumu başlatılsın mı?`, { okLabel: 'Yeni Oturumu Başlat', cancelLabel: 'Vazgeç', danger: true });
    if (!ok) return;
  }
  const words = state.words.filter((w) => w.level === level);
  const batch = E.learnBatch(words, state.progress, +getSettings().batchSize || 5);
  if (!batch.length) return toast(`${level} seviyesindeki öğrenmeye hazır tüm kelimeler 6 aşamayı tamamladı. Akıllı Tekrar bölümüne geçebilirsiniz.`);
  await setMeta('learnLevel', level);
  await startSession({ kind: 'learn', title: `${level} Kelime Öğren`, level, params: { level }, items: E.learnItems(batch, state.progress) });
}

export function renderLearn(v) {
  let lv = LEVELS.includes(getMeta('learnLevel')) ? getMeta('learnLevel') : LEVELS[0];
  const draw = () => {
    const s = levelStats(lv);
    v.innerHTML = `<div class="page">
      <h1>Kelime Öğren</h1>
      <p class="lead">Seviyeni seç, kısa bir grupla başla.</p>
      <div class="seg" role="group" aria-label="Seviye">${LEVELS.map((l) => `<button type="button" class="seg-btn ${l === lv ? 'active' : ''}" data-l="${l}">${l}</button>`).join('')}</div>
      <div class="level-line">
        <div class="level-name">${lv} — ${LEVEL_NAMES[lv]}</div>
        <div class="progress thin"><i style="width:${s.completion}%"></i></div>
        <div class="muted small">${s.completed}/${s.total} kelime tamamlandı</div>
      </div>
      <button class="btn primary xl block" id="go">${lv} Öğrenmeye Başla</button>
      <details class="more">
        <summary>6 aşamalı öğrenme nasıl işler?</summary>
        <div class="more-body">
          <ol class="plain"><li>Kelimeyi öğren</li><li>Çoktan seçmeli soru</li><li>İngilizce kelimeyi yaz</li><li>Eksik harfleri tamamla</li><li>Örnek cümlede boşluk doldur</li><li>Kelimeyi cümlede kullan</li></ol>
          <p class="muted small">Altıncı aşamada hazır örnek cümleyi ezberlemek zorunda değilsin; kendi cümleni yazabilir veya 3 aşamalı ipucundan (kullanım, cümle kalıbı, örnek cümle) yararlanabilirsin.</p>
        </div>
      </details>
    </div>`;
    $$('[data-l]', v).forEach((b) => { b.onclick = () => { lv = b.dataset.l; setMeta('learnLevel', lv); draw(); }; });
    $('#go', v).onclick = () => startLearn(lv);
  };
  draw();
}
