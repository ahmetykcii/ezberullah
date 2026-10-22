// Sınav sistemi: Mini Sınav, 50/100 Kelime Sınavı, Yanlış Kelimeler Sınavı, Seviye Bitirme Sınavı (40 soru, %80 geçme).
import { state, saveData, getProgress, saveProgress } from './storage.js';
import * as E from './engine.js';
import { $$, esc, fmtTime, openModal } from './ui.js';
import { LEVELS, LEVEL_NAMES } from './vocabulary.js';
import { handlers, startSession, summaryHtml } from './learning.js';
import { bumpDaily } from './statistics.js';

export const PASS = 80;
const readyWords = () => state.words.filter((w) => E.isWordReady(w));
const studied = () => readyWords().filter((w) => (state.progress[w.id]?.currentStage || 0) >= 1);
const mistaken = () => readyWords().filter((w) => state.progress[w.id]?.incorrectCount > 0);
export const finalReady = (lv) => {
  const ws = readyWords().filter((w) => w.level === lv);
  return ws.length > 0 && ws.every((w) => state.progress[w.id]?.learningComplete);
};

export const EXAMS = {
  mini: { name: 'Mini Sınav', desc: '10 soru. Her zaman erişilebilir.', check: () => (readyWords().length ? null : 'Kelime yok') },
  w50: { name: '50 Kelime Sınavı', desc: '50 çalışılmış kelime ile 50 soru.', check: () => (studied().length >= 50 ? null : `${studied().length}/50 kelime çalışıldı`) },
  w100: { name: '100 Kelime Sınavı', desc: '100 çalışılmış kelime ile 100 soru.', check: () => (studied().length >= 100 ? null : `${studied().length}/100 kelime çalışıldı`) },
  mistakes: { name: 'Yanlış Kelimeler Sınavı', desc: 'Yanlış yaptığınız kelimelerden en çok 20 soru.', check: () => (mistaken().length ? null : 'Henüz yanlış kelime yok') },
};

export function buildExamItems(kind, level) {
  const cyc = ['mc', 'typing', 'sentence', 'missing'];
  if (kind === 'final') {
    const ws = E.shuffle(readyWords().filter((w) => w.level === level));
    return ['mc', 'typing', 'sentence', 'missing'].flatMap((t, g) => Array.from({ length: 10 }, (_, i) => ({ wordId: ws[(g * 10 + i) % ws.length].id, type: t })));
  }
  const n = { mini: 10, w50: 50, w100: 100, mistakes: 20 }[kind];
  let pool = kind === 'mistakes' ? mistaken() : studied();
  if (kind === 'mini' && pool.length < n) pool = [...pool, ...E.shuffle(readyWords().filter((w) => !pool.includes(w)))];
  return E.shuffle(pool).slice(0, n).map((w, i) => ({ wordId: w.id, type: cyc[i % 3] }));
}

export async function startExam(kind, level = '') {
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
    const list = rec.wrongWords.length ? `<p>Yanlış yapılan kelimeler: <b>${esc(rec.wrongWords.map((w) => w.word).join(', '))}</b><br><span class="muted">Bu kelimeler Tekrar Edilecek havuzuna alındı ve öncelikli tekrar listesinde.</span></p>` : '<p>Hiç yanlış yok! 🎉</p>';
    return { html: summaryHtml({ title: rec.name, big: `%${score}`, sub: `${correct} doğru · ${total - correct} yanlış · ${fmtTime(rec.seconds)}${isFinal ? ` · ${rec.passed ? '✅ Geçtiniz' : `❌ Geçme puanı %${PASS}`}` : ''}`, extra: list, actions: '<a class="btn" href="#/exams">Sınavlar</a>' }) };
  },
};

export function renderExams(v) {
  const ex = Object.entries(EXAMS).map(([k, e]) => ({ k, ...e, lock: e.check() }));
  const fin = LEVELS.map((l) => {
    const lvReady = readyWords().filter((w) => w.level === l);
    const lvDone = lvReady.filter((w) => state.progress[w.id]?.learningComplete).length;
    return {
      k: 'final', l, name: `${l} — ${LEVEL_NAMES[l]} Bitirme Sınavı`,
      desc: '40 soru: 10 çoktan seçmeli, 10 yazma, 10 boşluk doldurma, 10 cümle tamamlama. Geçme: %80.',
      lock: finalReady(l) ? null : `Önce ${l} seviyesindeki tüm kelimelerin 6 aşamasını tamamlayın (${lvDone}/${lvReady.length})`,
    };
  });
  const card = (e) => `<div class="card"><h3>${e.name}</h3><p class="muted">${e.desc}</p>${e.lock ? `<p class="small lock">🔒 ${esc(e.lock)}</p>` : ''}<button class="btn primary sm" data-k="${e.k}" data-l="${e.l || ''}" ${e.lock ? 'disabled' : ''}>Sınava Başla</button></div>`;
  const hist = [...state.exams].reverse();
  v.innerHTML = `<h1>Sınavlar</h1><div class="grid modes">${ex.map(card).join('')}${fin.map(card).join('')}</div>
  <div class="card"><h3>Sınav Geçmişi</h3>${hist.length ? `<div class="table">${hist.map((h) => `<button class="row-item" data-h="${h.id}"><span><b>${esc(h.name)}</b><small class="muted"> ${new Date(h.date).toLocaleString('tr-TR')}</small></span><span>${h.level}</span><span class="chip ${h.passed ? '' : 'bad'}">%${h.score}</span><span class="muted">${h.correct}✓ ${h.wrong}✗ · ${fmtTime(h.seconds)}</span></button>`).join('')}</div>` : '<p class="muted">Henüz sınav çözülmedi.</p>'}</div>`;
  $$('[data-k]', v).forEach((b) => { b.onclick = () => startExam(b.dataset.k, b.dataset.l); });
  $$('[data-h]', v).forEach((b) => { b.onclick = () => { const h = state.exams.find((x) => x.id === b.dataset.h); openModal({ title: h.name, html: `<p><b>%${h.score}</b> — ${h.correct} doğru, ${h.wrong} yanlış, ${fmtTime(h.seconds)}</p><p>Yanlış kelimeler: ${h.wrongWords.length ? esc(h.wrongWords.map((w) => w.word).join(', ')) : '—'}</p>` }); }; });
}
