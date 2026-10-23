// Sınav sistemi: Mini Sınav, 50/100 Kelime Sınavı, Yanlış Kelimeler Sınavı, Seviye Bitirme Sınavı (40 soru, %80 geçme).
import { state, saveData, getProgress, saveProgress, getMeta } from './storage.js';
import * as E from './engine.js';
import { $$, esc, fmtTime, openModal, confirmDialog, ICONS } from './ui.js';
import { LEVELS, LEVEL_NAMES } from './vocabulary.js';
import { handlers, startSession, summaryHtml } from './learning.js';
import { bumpDaily } from './statistics.js';

export const PASS = 80;
const readyWords = (lv = '') => state.words.filter((w) => E.isWordReady(w) && (!lv || w.level === lv));
const studied = (lv = '') => readyWords(lv).filter((w) => (state.progress[w.id]?.currentStage || 0) >= 1);
const mistaken = (lv = '') => readyWords(lv).filter((w) => state.progress[w.id]?.incorrectCount > 0);
export const finalReady = (lv) => {
  const ws = readyWords(lv);
  return ws.length > 0 && ws.every((w) => state.progress[w.id]?.learningComplete);
};

export const EXAMS = {
  mini: { name: 'Mini Sınav', desc: '10 soru. Her zaman erişilebilir.', check: (lv = '') => (readyWords(lv).length ? null : 'Kelime yok') },
  w50: { name: '50 Kelime Sınavı', desc: '50 çalışılmış kelime ile 50 soru.', check: (lv = '') => (studied(lv).length >= 50 ? null : `${studied(lv).length}/50 kelime çalışıldı`) },
  w100: { name: '100 Kelime Sınavı', desc: '100 çalışılmış kelime ile 100 soru.', check: (lv = '') => (studied(lv).length >= 100 ? null : `${studied(lv).length}/100 kelime çalışıldı`) },
  mistakes: { name: 'Yanlış Kelimeler Sınavı', desc: 'Yanlış yaptığınız kelimelerden en çok 20 soru.', check: (lv = '') => (mistaken(lv).length ? null : 'Henüz yanlış kelime yok') },
};

export function buildExamItems(kind, level = '', rnd = Math.random) {
  const cyc = ['mc', 'typing', 'sentence', 'missing'];
  if (kind === 'final') {
    const ws = E.shuffle(readyWords(level), rnd);
    const items = cyc.flatMap((t, g) => Array.from({ length: 10 }, (_, i) => ({ wordId: ws[(g * 10 + i) % ws.length].id, type: t })));
    return E.shuffle(items, rnd);
  }
  const n = { mini: 10, w50: 50, w100: 100, mistakes: 20 }[kind];
  let pool = E.shuffle(kind === 'mistakes' ? mistaken(level) : studied(level), rnd);
  if (kind === 'mini' && pool.length < n) {
    const extra = E.shuffle(readyWords(level).filter((w) => !pool.includes(w)), rnd).slice(0, n - pool.length);
    pool = E.shuffle([...pool, ...extra], rnd);
  }
  const types = E.shuffle(cyc, rnd);
  return E.shuffle(pool.slice(0, n).map((w, i) => ({ wordId: w.id, type: types[i % types.length] })), rnd);
}

export async function startExam(kind, level = '') {
  const saved = getMeta('activeSession');
  if (saved && saved.idx < (saved.items?.length || 0)) {
    const ok = await confirmDialog(`Yarım kalan bir oturumunuz var: "${saved.title}" (${saved.idx}/${saved.items.length}). Yeni bir sınav başlatılsın mı?`, { okLabel: 'Yeni Sınavı Başlat', cancelLabel: 'Vazgeç', danger: true });
    if (!ok) return;
  }
  const title = kind === 'final' ? `${level} Seviye Bitirme Sınavı` : EXAMS[kind].name;
  await startSession({ kind: 'exam', title, items: buildExamItems(kind, level), feedback: false, params: { exam: kind, level, startedAt: Date.now() } });
}

handlers.exam = {
  async onAnswer(item, ok, { elapsed }) {
    const p = getProgress(item.wordId);
    const wasLearned = p.learningComplete;
    E.applyAnswer(p, ok, { mode: 'practice', qtype: item.type }); // yanlış → REVIEW; geçmiş silinmez
    await saveProgress(p);
    const d = { seconds: Math.round(elapsed), [ok ? 'correct' : 'wrong']: 1 };
    if (wasLearned) { d.rt = 1; if (ok) d.rc = 1; }
    await bumpDaily(d);
    return {};
  },
  async onDone(results, sess) {
    const correct = results.filter((r) => r.correct).length, total = results.length;
    const score = total ? Math.round((correct / total) * 100) : 0;
    const wrongIds = [...new Set(results.filter((r) => !r.correct).map((r) => r.wordId))];
    const isFinal = sess.params.exam === 'final';
    const rec = {
      id: 'ex-' + Date.now(), date: new Date().toISOString(), kind: sess.params.exam, name: sess.title, level: sess.params.level || 'Karışık',
      score, correct, wrong: total - correct, seconds: results.reduce((a, r) => a + (r.t || 0), 0),
      wrongWords: wrongIds.map((id) => ({ id, word: state.wordMap.get(id)?.word || id })), passed: score >= PASS,
    };
    await saveData('exams', rec);
    const list = rec.wrongWords.length ? `<p>Yanlış yapılan kelimeler: <b>${esc(rec.wrongWords.map((w) => w.word).join(', '))}</b></p><p class="muted small">Bu kelimeler Tekrar Edilecek havuzuna alındı ve öncelikli tekrar listesinde.</p>` : '<p>Hiç yanlış yok.</p>';
    const verdict = isFinal ? (rec.passed ? 'Geçtiniz' : `Geçme puanı %${PASS}`) : (rec.passed ? 'Başarılı' : 'Geliştirilebilir');
    return { html: summaryHtml({ title: rec.name, big: `%${score}`, verdict, mark: rec.passed, sub: `${correct} doğru · ${total - correct} yanlış · ${fmtTime(rec.seconds)}`, extra: list, actions: '<a class="btn primary" href="#/exams">Sınavlara Dön</a>' }) };
  },
};

export function renderExams(v) {
  let lv = '';
  const hist = [...state.exams].reverse();
  v.innerHTML = `<div class="page">
    <h1>Sınavlar</h1>
    <p class="lead">Bir sınav türü seç; başlamak için dokunman yeterli.</p>
    <div class="seg" role="group" aria-label="Seviye">${['', ...LEVELS].map((l) => `<button type="button" class="seg-btn" data-lv="${l}">${l || 'Tümü'}</button>`).join('')}</div>
    <ul class="list" id="ex-modes"></ul>
    <details class="more">
      <summary>Geçmiş Sınavlar${hist.length ? ` (${hist.length})` : ''}</summary>
      <div class="more-body">${hist.length ? `<ul class="list flush">${hist.map((h) => `<li><button class="list-row linkrow" data-h="${h.id}"><div class="row-main"><b>${esc(h.name)}</b><span class="muted small">${new Date(h.date).toLocaleDateString('tr-TR')} · ${h.level}</span></div><span class="score ${h.passed ? 'pass' : ''}">%${h.score}</span></button></li>`).join('')}</ul>` : '<p class="muted">Henüz sınav çözülmedi.</p>'}</div>
    </details>
  </div>`;
  const draw = () => {
    $$('[data-lv]', v).forEach((b) => b.classList.toggle('active', b.dataset.lv === lv));
    const ex = Object.entries(EXAMS).map(([k, e]) => ({ k, l: lv, ...e, lock: e.check(lv) }));
    const fin = LEVELS.filter((l) => !lv || l === lv).map((l) => {
      const lvReady = readyWords(l);
      const lvDone = lvReady.filter((w) => state.progress[w.id]?.learningComplete).length;
      return {
        k: 'final', l, name: `${l} Bitirme Sınavı`,
        desc: '40 soru · geçme %80',
        lock: finalReady(l) ? null : `Önce ${l} kelimelerinin 6 aşamasını tamamla (${lvDone}/${lvReady.length})`,
      };
    });
    const row = (e) => `<li><button class="list-row linkrow ${e.lock ? 'is-locked' : ''}" data-k="${e.k}" data-l="${e.l || ''}" ${e.lock ? 'disabled' : ''}>
      <div class="row-main"><b>${e.name}</b><span class="muted small">${esc(e.lock || e.desc)}</span></div>${e.lock ? ICONS.lock : ICONS.chev}</button></li>`;
    $$('#ex-modes', v)[0].innerHTML = [...ex, ...fin].map(row).join('');
    $$('[data-k]', v).forEach((b) => { b.onclick = () => startExam(b.dataset.k, b.dataset.l); });
  };
  $$('[data-lv]', v).forEach((b) => { b.onclick = () => { lv = b.dataset.lv; draw(); }; });
  $$('[data-h]', v).forEach((b) => { b.onclick = () => { const h = state.exams.find((x) => x.id === b.dataset.h); openModal({ title: h.name, html: `<p><b>%${h.score}</b> — ${h.correct} doğru, ${h.wrong} yanlış, ${fmtTime(h.seconds)}</p><p>Yanlış kelimeler: ${h.wrongWords.length ? esc(h.wrongWords.map((w) => w.word).join(', ')) : '—'}</p>` }); }; });
  draw();
}
