// Öğrenme motoru arayüzü: ortak "oturum çalıştırıcı" (runner) + 6 aşamalı Kelime Öğren akışı.
// Tüm modlar (learn, review, exam) bu çalıştırıcıyı kullanır; oturum her cevapta kaydedilir ve yenilemede devam eder.
import { state, getMeta, setMeta, getSettings, getProgress, saveProgress } from './storage.js';
import * as E from './engine.js';
import { $, $$, esc, toast, speak, sfx, ring, hasModal, closeTopModal } from './ui.js';
import { LEVELS, LEVEL_NAMES, posLabel, statusLabel } from './vocabulary.js';
import { bumpDaily, levelStats } from './statistics.js';

export const handlers = {}; // kind -> { onAnswer(item, ok, info), onDone(results, sess) }
let cur = null;
let answered = false;
let shownAt = 0;
let curQ = null;
const view = () => document.getElementById('view');

export const sessionActive = () => !!cur;
export function abortSession() { cur = null; document.body.classList.remove('focus', 'kb-open'); }

export async function startSession(s) {
  cur = { feedback: true, params: {}, idx: 0, results: [], ...s };
  await persist();
  renderItem();
}
export async function resumeSaved() {
  const s = getMeta('activeSession');
  if (!s || !handlers[s.kind]) return false;
  await startSession(s);
  return true;
}
const persist = () => setMeta('activeSession', cur ? { kind: cur.kind, title: cur.title, items: cur.items, idx: cur.idx, results: cur.results, params: cur.params, feedback: cur.feedback } : null);

async function finish() {
  const s = cur;
  const out = await handlers[s.kind].onDone(s.results, s);
  cur = null;
  document.body.classList.remove('focus');
  await setMeta('activeSession', null);
  if (out) { view().innerHTML = out.html; if (out.mount) out.mount(view()); }
}
export const summaryHtml = ({ title, big, sub, extra = '', actions = '' }) =>
  `<div class="summary card"><h2>${esc(title)}</h2><div class="big-num">${big}</div><p class="muted">${sub}</p>${extra}<div class="row gap center">${actions}<a class="btn primary" href="#/dashboard">Ana Sayfa</a></div></div>`;

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
  const label = item.stage ? `Aşama ${item.stage}/6 · ${E.STAGES[item.stage - 1]}` : TYPE_LABEL[item.type];
  curQ = item.type === 'card' ? null : E.buildQuestion(word, item.type, state.words);
  if (curQ && curQ.type !== item.type) item.type = curQ.type;
  view().innerHTML = `<div class="quiz"><div class="quiz-head">
    <button class="btn ghost sm" id="q-exit">← Çık</button>
    <div class="progress" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
    <span class="muted nowrap">${cur.idx + 1}/${n}</span>
    <button class="btn ghost sm" id="q-focus" aria-pressed="${document.body.classList.contains('focus')}">Odak Modu</button></div>
    <div class="qcard" id="qcard"><div class="chip">${esc(label)}</div><div id="qbody">${bodyHtml(item, word)}</div><div id="fb"></div></div>
    <p class="muted center small kbd-hint">Enter: gönder / devam · 1–4: seçenek · Boşluk: dinle · Esc: Odak Modundan çık</p></div>`;
  $('#q-exit').onclick = () => {
    abortSession();
    if (location.hash === '#/dashboard') window.dispatchEvent(new HashChangeEvent('hashchange'));
    else location.hash = '#/dashboard';
    toast('Oturum kaydedildi; Ana Sayfadan kaldığınız yerden devam edebilirsiniz.');
  };
  $('#q-focus').onclick = toggleFocus;
  wire(item, word);
}

export function toggleFocus() {
  const on = document.body.classList.toggle('focus');
  const b = $('#q-focus'); if (b) b.setAttribute('aria-pressed', on);
}

const speakBtn = (t) => `<span class="row gap center"><button type="button" class="btn ghost sm" data-speak="${esc(t)}" aria-label="Dinle">🔊 Dinle</button><button type="button" class="btn ghost sm" data-speak="${esc(t)}" data-slow="1" aria-label="Yavaş dinle">🐢 Yavaş</button></span>`;
const inputForm = (ph) => `<form id="ans" autocomplete="off"><input id="inp" class="input lg" placeholder="${ph}" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" inputmode="text" aria-label="Cevabınız"><button class="btn primary" type="submit">Kontrol Et</button></form>`;

function bodyHtml(item, w) {
  const q = curQ;
  if (item.type === 'card') {
    const fam = w.wordFamily?.length ? `<div><span class="muted">Kelime ailesi:</span> ${esc(w.wordFamily.join(', '))}</div>` : '';
    const syn = w.synonyms?.length ? `<div><span class="muted">Eş anlamlılar:</span> ${esc(w.synonyms.join(', '))}</div>` : '';
    return `<h2 class="word">${esc(w.word)}</h2>${w.pronunciation ? `<div class="muted">${esc(w.pronunciation)}</div>` : ''}${speakBtn(w.word)}
      <div class="meaning">${esc(w.meanings.join(' · '))}</div><div class="chip alt">${esc(posLabel(w.partOfSpeech))}</div>
      ${w.exampleSentence ? `<blockquote>${esc(w.exampleSentence)}<small>${esc(w.exampleTranslation || '')}</small></blockquote>` : ''}${syn}${fam}
      <div class="row center"><button type="button" class="btn primary" id="next">Hazırım, Devam Et →</button></div>`;
  }
  if (item.type === 'mc') return `<h2 class="word">${esc(q.prompt)}</h2>${speakBtn(q.prompt)}<p class="muted">Doğru Türkçe anlamı seçin</p><div class="options">${q.options.map((o, i) => `<button type="button" class="opt" data-i="${i}"><kbd>${i + 1}</kbd> ${esc(o)}</button>`).join('')}</div>`;
  if (item.type === 'typing') return `<p class="muted">İngilizce karşılığını yazın (${esc(posLabel(q.pos))}, ${q.hintLen} harf)</p><h2 class="word">${esc(q.prompt)}</h2>${inputForm('İngilizce kelimeyi yazın…')}`;
  if (item.type === 'missing') return `<p class="muted">Eksik harfleri tamamlayıp kelimeyi yazın · ${esc(posLabel(q.pos))}</p><h2 class="word mono">${esc(q.prompt)}</h2><div class="meaning">${esc(q.meaning)}</div>${inputForm('Kelimenin tamamını yazın…')}`;
  if (item.type === 'sentence') return `<p class="muted">Boşluğa gelecek İngilizce kelimeyi yazın</p><h2 class="sent">${esc(q.prompt)}</h2><div class="muted">${esc(q.hint || '')}</div><div class="meaning">${esc(q.meaning)}</div>${inputForm('Eksik kelimeyi yazın…')}`;
  if (item.type === 'listening') return `<p class="muted">Duyduğunuz İngilizce kelimeyi yazın</p>${speakBtn(q.prompt)}${inputForm('Duyduğunuz kelimeyi yazın…')}`;
  if (item.type === 'production') return `<p class="muted">Standart Mod (çevrimdışı): hedef kelimeyi içeren en az 4 kelimelik kendi İngilizce cümlenizi yazın. Bu mod dil bilgisini değerlendirmez; kelimenin cümlede kullanıldığını kontrol eder.</p><h2 class="word">${esc(q.prompt)}</h2><div class="meaning">${esc(q.meaning)}</div>${inputForm('İngilizce cümlenizi yazın…')}`;
  return '';
}

function wire(item, word) {
  shownAt = Date.now();
  $$('[data-speak]').forEach((b) => { b.onclick = () => speak(b.dataset.speak, !!b.dataset.slow); });
  if (item.type === 'card') { $('#next').onclick = () => submit(true, ''); $('#next').focus(); return; }
  if (item.type === 'mc') $$('.opt').forEach((b) => { b.onclick = () => { b.classList.add('picked'); submit(+b.dataset.i, +b.dataset.i); }; });
  else { $('#ans').onsubmit = (e) => { e.preventDefault(); const v = $('#inp').value; if (v.trim()) submit(v, v); }; $('#inp').focus(); }
  if (item.type === 'listening') speak(word.word);
}

async function submit(input, shown) {
  if (answered || !cur) return;
  answered = true;
  const item = cur.items[cur.idx];
  const word = state.wordMap.get(item.wordId);
  const isCard = item.type === 'card';
  const ok = isCard ? true : E.checkAnswer(curQ, input);
  const elapsed = Math.min(60, (Date.now() - shownAt) / 1000);
  const r = (await handlers[cur.kind].onAnswer(item, ok, { elapsed, q: curQ, word, input })) || {};
  cur.results.push({ wordId: item.wordId, type: item.type, stage: item.stage || 0, correct: ok, input: String(shown), t: Math.round(elapsed), card: isCard });
  cur.idx++;
  if (r.drop) cur.items = cur.items.slice(0, cur.idx).concat(cur.items.slice(cur.idx).filter((x) => x.wordId !== item.wordId));
  await persist();
  if (isCard) return renderItem();
  if (!cur.feedback) return renderItem();
  showFeedback(ok, word, item, r);
}

function showFeedback(ok, word, item) {
  const qc = $('#qcard');
  qc.classList.add(ok ? 'correct' : 'wrong');
  sfx(ok ? 'ok' : 'bad');
  if (item.type === 'mc') $$('.opt').forEach((b, i) => { b.disabled = true; if (i === curQ.answerIndex) b.classList.add('right'); else if (!ok && b.classList.contains('picked')) b.classList.add('bad'); });
  $$('#qbody input,#qbody form button').forEach((e) => (e.disabled = true));
  const ans = item.type === 'production' ? `Örnek cümle: ${word.exampleSentence}` : `Doğru cevap: ${curQ.display}`;
  $('#fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}" role="status"><b>${ok ? '✓ Doğru!' : '✗ Yanlış'}</b> ${ok && item.type !== 'production' ? '' : esc(ans)}
    ${!ok && cur.kind === 'learn' ? `<div class="small">Kelime "${statusLabel('REVIEW')}" havuzuna alındı ve bu oturumdan çıkarıldı; bir sonraki oturumda öncelikli olarak gösterilecek.</div>` : ''}</div>
    <div class="row center"><button type="button" class="btn primary" id="cont">Devam Et →</button></div>`;
  $('#cont').onclick = renderItem; $('#cont').focus();
}

/* ---------- Klavye ---------- */
export function initKeys() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (hasModal()) return void closeTopModal();
      if (document.body.classList.contains('focus')) { document.body.classList.remove('focus'); const b = $('#q-focus'); if (b) b.setAttribute('aria-pressed', 'false'); }
      return;
    }
    if (!cur || !getSettings().shortcuts || hasModal() || e.repeat) return;
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    const item = cur.items[cur.idx];
    if (e.key === 'Enter') {
      if (answered) { const c = $('#cont'); if (c) { e.preventDefault(); c.click(); } }
      else if (item?.type === 'card') { e.preventDefault(); submit(true, ''); }
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
    if (!was && p.learningComplete) { d.newWords = 1; d.done = 1; }
    await bumpDaily(d);
    return { drop: !ok };
  },
  async onDone(results) {
    const q = results.filter((r) => !r.card);
    const ok = q.filter((r) => r.correct).length;
    const done = new Set(q.filter((r) => r.stage === 6 && r.correct).map((r) => r.wordId)).size;
    const failed = [...new Set(q.filter((r) => !r.correct).map((r) => state.wordMap.get(r.wordId)?.word))].filter(Boolean);
    return { html: summaryHtml({ title: 'Öğrenme Oturumu Tamamlandı', big: `${done} kelime`, sub: `6 aşamayı tamamladınız · ${ok}/${q.length} doğru cevap`,
      extra: failed.length ? `<p>Tekrar Edilecek havuzuna alınanlar: <b>${esc(failed.join(', '))}</b></p>` : '', actions: '<a class="btn" href="#/learn">Yeni Grup Başlat</a>' }) };
  },
};

export async function startLearn(level, focus = false) {
  const words = state.words.filter((w) => w.level === level);
  const batch = E.learnBatch(words, state.progress, +getSettings().batchSize || 5);
  if (!batch.length) return toast(`${level} seviyesindeki öğrenmeye hazır tüm kelimeler 6 aşamayı tamamladı. Akıllı Tekrar bölümüne geçebilirsiniz.`);
  if (focus) document.body.classList.add('focus');
  await startSession({ kind: 'learn', title: `${level} Kelime Öğren`, items: E.learnItems(batch, state.progress) });
}

export function renderLearn(v) {
  v.innerHTML = `<h1>Kelime Öğren</h1><p class="muted">Her kelime 6 aşamadan geçer: 1) Kelimeyi Öğren → 2) Çoktan Seçmeli Soru → 3) İngilizce Kelimeyi Yaz → 4) Eksik Harfleri Tamamla → 5) Örnek Cümlede Boşluk Doldur → 6) Kelimeyi Cümlede Kullan.</p>
  <label class="check"><input type="checkbox" id="focus-opt"> Odak Modu ile başla (kenar çubuğu gizlenir; Esc ile çıkılır)</label>
  <div class="grid levels">${LEVELS.map((l) => { const s = levelStats(l); return `<div class="card level"><div class="row between"><div><h2>${l}</h2><span class="muted">${LEVEL_NAMES[l]}</span></div>${ring(s.completion, 72)}</div>
    <p class="muted">${s.completed}/${s.total} kelime tamamlandı · ${s.NEW} yeni · ${s.LEARNING + s.REVIEW} devam eden${s.drafts ? ` · ${s.drafts} taslak` : ''}</p><button class="btn primary block" data-l="${l}">Öğrenmeye Devam Et</button></div>`; }).join('')}</div>
  <div class="card"><h3>6. Aşama: Cümlede Kullanma Modu</h3><p class="muted">Standart Mod (ücretsiz ve çevrimdışı): kelimeyi kendi İngilizce cümlenizde kullanırsınız; kelimenin cümlede geçtiği ve cümle uzunluğu kontrol edilir. Eksik bilgili (taslak) kelimeler Kelime Havuzum'dan tamamlandığında otomatik olarak bu döngüye dahil edilir.</p></div>`;
  $$('[data-l]', v).forEach((b) => { b.onclick = () => startLearn(b.dataset.l, $('#focus-opt').checked); });
}
