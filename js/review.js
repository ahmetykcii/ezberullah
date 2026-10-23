// Tekrar modları (Akıllı Tekrar, Hızlı Tekrar, Yanlışlarım, Yazarak Çalışma, Dinleyerek Çalışma) ve sınav tarihine göre çalışma planı.
import { state, getSettings, getProgress, saveProgress, getMeta } from './storage.js';
import * as E from './engine.js';
import { $$, esc, toast, confirmDialog, ICONS } from './ui.js';
import { LEVELS, LEVEL_NAMES } from './vocabulary.js';
import { handlers, startSession, summaryHtml } from './learning.js';
import { bumpDaily, getMistakeAnalytics, openMistakeAnalysis } from './statistics.js';

const wordsOf = (level) => state.words.filter((w) => E.isWordReady(w) && (!level || w.level === level));
const seen = (w) => (state.progress[w.id]?.currentStage || 0) >= 1;
const P = (w) => state.progress[w.id];

export const MODES = {
  smart: { name: 'Akıllı Tekrar', desc: 'Aralıklı tekrar (1-3-7-14-30 gün) zamanı gelen kelimeler.', icon: '🧠' },
  quick: { name: 'Hızlı Tekrar', desc: 'Öğrendiğiniz kelimelerden hızlı çoktan seçmeli tekrar.', icon: '⚡' },
  mistakes: { name: 'Yanlışlarım', desc: 'En çok yanlış yaptığınız kelimeler.', icon: '🎯' },
  writing: { name: 'Yazarak Çalışma', desc: 'Türkçe anlamdan İngilizce kelimeyi yazın.', icon: '✍️' },
  listening: { name: 'Dinleyerek Çalışma', desc: 'Seslendirilen kelimeyi duyup yazın.', icon: '🎧' },
};

export function candidates(mode, level = '', now = Date.now(), rnd = Math.random) {
  const ws = E.shuffle(wordsOf(level), rnd);
  if (mode === 'smart') return ws.filter((w) => E.isDue(P(w), now)).sort((a, b) => (P(b).currentStatus === 'REVIEW') - (P(a).currentStatus === 'REVIEW') || (P(a).nextReviewAt || 0) - (P(b).nextReviewAt || 0));
  if (mode === 'mistakes') return ws.filter((w) => P(w)?.incorrectCount > 0).sort((a, b) => P(b).incorrectCount - P(a).incorrectCount || (P(b).mistakeHistory.at(-1)?.at || 0) - (P(a).mistakeHistory.at(-1)?.at || 0));
  return ws.filter(seen);
}

export function reviewItems(mode, level = '', n = 15, rnd = Math.random) {
  const picked = candidates(mode, level, Date.now(), rnd).slice(0, mode === 'smart' ? 20 : n);
  const c = E.shuffle(picked, rnd);
  const mix = E.shuffle(['mc', 'typing', 'sentence', 'missing'], rnd);
  return c.map((w, i) => ({
    wordId: w.id,
    type: mode === 'smart' ? E.reviewType(P(w), rnd) : mode === 'quick' ? 'mc' : mode === 'writing' ? 'typing' : mode === 'listening' ? 'listening' : mix[i % 4],
  }));
}

handlers.review = {
  async onAnswer(item, ok, { elapsed }) {
    const p = getProgress(item.wordId);
    const wasLearned = p.learningComplete;
    const due = E.isDue(p);
    E.applyAnswer(p, ok, { mode: due ? 'review' : 'practice', qtype: item.type });
    await saveProgress(p);
    const d = { seconds: Math.round(elapsed), [ok ? 'correct' : 'wrong']: 1, reviews: 1, done: 1 };
    if (wasLearned) { d.rt = 1; if (ok) d.rc = 1; }
    await bumpDaily(d);
    return {};
  },
  async onDone(results, sess) {
    await bumpDaily({ sessionsCompleted: 1 });
    const ok = results.filter((r) => r.correct).length;
    const bad = [...new Set(results.filter((r) => !r.correct).map((r) => state.wordMap.get(r.wordId)?.word))].filter(Boolean);
    return { html: summaryHtml({ title: `${sess.title} Tamamlandı`, big: `${ok}/${results.length}`, sub: 'doğru cevap',
      verdict: bad.length ? '' : 'Hiç hata yok', extra: bad.length ? `<p>Tekrar edilmesi gerekenler: <b>${esc(bad.join(', '))}</b></p>` : '', actions: '<a class="btn primary" href="#/review">Tekrara Dön</a>' }) };
  },
};

export async function startReview(mode, level = '') {
  const saved = getMeta('activeSession');
  if (saved && saved.idx < (saved.items?.length || 0)) {
    const ok = await confirmDialog(`Yarım kalan bir oturumunuz var: "${saved.title}" (${saved.idx}/${saved.items.length}). Yeni bir tekrar oturumu başlatılsın mı?`, { okLabel: 'Yeni Oturumu Başlat', cancelLabel: 'Vazgeç', danger: true });
    if (!ok) return;
  }
  const items = reviewItems(mode, level);
  if (!items.length) return toast(mode === 'smart' ? 'Şu an tekrar zamanı gelen kelime yok.' : mode === 'mistakes' ? 'Henüz yanlış yaptığınız kelime yok.' : 'Önce Kelime Öğren bölümünden birkaç kelime öğrenin.');
  await startSession({ kind: 'review', title: MODES[mode].name, items });
}

/** Sınav tarihine göre plan: kalan gün, öğrenilmemiş kelimeler, önerilen günlük hedef. */
export function studyPlan(now = Date.now(), examDate = getSettings().examDate) {
  if (!examDate) return null;
  const end = new Date(examDate + 'T23:59:59').getTime();
  const days = Math.ceil((end - now) / E.DAY);
  if (Number.isNaN(days)) return null;
  if (days < 0) return { past: true };
  const readyWords = state.words.filter((w) => E.isWordReady(w));
  const unlearned = readyWords.filter((w) => !P(w)?.learningComplete).length;
  const learned = readyWords.length - unlearned;
  const reserve = days > 8 ? Math.ceil(days * 0.3) : Math.min(days, 2); // son günler yalnızca tekrar + test
  const learnDays = Math.max(0, days - reserve);
  const newPerDay = learnDays ? Math.ceil(unlearned / learnDays) : 0;
  const reviewPerDay = Math.ceil((learned + Math.min(unlearned, newPerDay * learnDays)) / Math.max(1, days));
  const phase = days <= 3 ? 'Son sprint: yalnızca tekrar ve sınavlar' : days <= reserve ? 'Tekrar ve test ağırlıklı dönem' : 'Yeni kelime öğrenme dönemi';
  return { days, unlearned, newPerDay, reviewPerDay, suggested: newPerDay + reviewPerDay, phase, reserve };
}

export function renderReview(v) {
  const due = candidates('smart', '').length;
  const mist = getMistakeAnalytics(10).totalMistakeWords;
  const others = Object.entries(MODES).filter(([k]) => k !== 'smart');
  let lv = '';
  v.innerHTML = `<div class="page review-page">
    <h1>Tekrar</h1>
    <div class="big-count" aria-live="polite">${due}</div>
    <p class="lead">${due ? 'kelime tekrar bekliyor. Zamanında tekrar, öğrendiklerini kalıcı hâle getirir.' : 'Şu an tekrar bekleyen kelime yok. Yeni kelimeler öğrendikçe burada görünür.'}</p>
    <button class="btn primary xl block" id="go" ${due ? '' : 'disabled'}>Tekrara Başla</button>
    <div class="quiet-links">
      ${mist ? `<button type="button" class="text-btn" id="mist">Zorlandığın Kelimeler (${mist})</button>` : ''}
    </div>
    <details class="more">
      <summary>Diğer tekrar modları</summary>
      <div class="more-body">
        <div class="seg sm" role="group" aria-label="Seviye">${['', ...LEVELS].map((l) => `<button type="button" class="seg-btn ${l === lv ? 'active' : ''}" data-lv="${l}">${l || 'Tümü'}</button>`).join('')}</div>
        <ul class="list flush" id="modes"></ul>
      </div>
    </details>
  </div>`;
  $$('#go', v)[0].onclick = () => startReview('smart');
  const mb = $$('#mist', v)[0]; if (mb) mb.onclick = () => openMistakeAnalysis();
  const draw = () => {
    $$('[data-lv]', v).forEach((b) => b.classList.toggle('active', b.dataset.lv === lv));
    $$('#modes', v)[0].innerHTML = others.map(([k, m]) => {
      const n = candidates(k, lv).length;
      return `<li class="list-row"><div class="row-main"><b>${m.name}</b><span class="muted small">${m.desc}</span></div><span class="muted small">${n}</span><button class="btn sm" data-m="${k}" ${n ? '' : 'disabled'}>Başlat</button></li>`;
    }).join('');
    $$('[data-m]', v).forEach((b) => { b.onclick = () => startReview(b.dataset.m, lv); });
  };
  $$('[data-lv]', v).forEach((b) => { b.onclick = () => { lv = b.dataset.lv; draw(); }; });
  draw();
}
