// Sınav sistemi: Mini Sınav, 50/100 Kelime Sınavı, Yanlış Kelimeler Sınavı, Seviye Bitirme Sınavı (40 soru, %80 geçme).
import { state, saveData, getProgress, saveProgress, getMeta } from './storage.js';
import * as E from './engine.js';
import { $$, esc, fmtTime, openModal, confirmDialog } from './ui.js';
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
    const list = rec.wrongWords.length ? `<p>Yanlış yapılan kelimeler: <b>${esc(rec.wrongWords.map((w) => w.word).join(', '))}</b><br><span class="muted">Bu kelimeler Tekrar Edilecek havuzuna alındı ve öncelikli tekrar listesinde.</span></p>` : '<p>Hiç yanlış yok! 🎉</p>';
    return { html: summaryHtml({ title: rec.name, big: `%${score}`, sub: `${correct} doğru · ${total - correct} yanlış · ${fmtTime(rec.seconds)}${isFinal ? ` · ${rec.passed ? '✅ Geçtiniz' : `❌ Geçme puanı %${PASS}`}` : ''}`, extra: list, actions: '<a class="btn" href="#/exams">Sınavlar</a>' }) };
  },
};

export function renderExams(v) {
  const sel = `<select id="ex-lvl" class="input sm" aria-label="Seviye"><option value="">Tüm Seviyeler</option>${LEVELS.map((l) => `<option value="${l}">${l} — ${LEVEL_NAMES[l]}</option>`).join('')}</select>`;
  const hist = [...state.exams].reverse();
  v.innerHTML = `<div class="row between"><h1>Sınavlar</h1>${sel}</div><div class="grid modes" id="ex-modes"></div>
  <div class="card"><h3>Sınav Geçmişi</h3>${hist.length ? `<div class="table">${hist.map((h) => `<button class="row-item" data-h="${h.id}"><span><b>${esc(h.name)}</b><small class="muted"> ${new Date(h.date).toLocaleString('tr-TR')}</small></span><span>${h.level}</span><span class="chip ${h.passed ? '' : 'bad'}">%${h.score}</span><span class="muted">${h.correct}✓ ${h.wrong}✗ · ${fmtTime(h.seconds)}</span></button>`).join('')}</div>` : '<p class="muted">Henüz sınav çözülmedi.</p>'}</div>`;
  const draw = () => {
    const lv = $$('#ex-lvl', v)[0].value;
    const ex = Object.entries(EXAMS).map(([k, e]) => ({ k, l: lv, ...e, lock: e.check(lv) }));
    const fin = LEVELS.filter((l) => !lv || l === lv).map((l) => {
      const lvReady = readyWords(l);
      const lvDone = lvReady.filter((w) => state.progress[w.id]?.learningComplete).length;
      return {
        k: 'final', l, name: `${l} — ${LEVEL_NAMES[l]} Bitirme Sınavı`,
        desc: '40 soru: 10 çoktan seçmeli, 10 yazma, 10 boşluk doldurma, 10 cümle tamamlama. Geçme: %80.',
        lock: finalReady(l) ? null : `Önce ${l} seviyesindeki tüm kelimelerin 6 aşamasını tamamlayın (${lvDone}/${lvReady.length})`,
      };
    });
    const card = (e) => `<div class="card"><h3>${e.name}</h3><p class="muted">${e.desc}</p>${e.lock ? `<p class="small lock">🔒 ${esc(e.lock)}</p>` : ''}<button class="btn primary sm" data-k="${e.k}" data-l="${e.l || ''}" ${e.lock ? 'disabled' : ''}>Sınava Başla</button></div>`;
    $$('#ex-modes', v)[0].innerHTML = `${ex.map(card).join('')}${fin.map(card).join('')}`;
    $$('[data-k]', v).forEach((b) => { b.onclick = () => startExam(b.dataset.k, b.dataset.l); });
  };
  $$('#ex-lvl', v)[0].onchange = draw; draw();
  $$('[data-h]', v).forEach((b) => { b.onclick = () => { const h = state.exams.find((x) => x.id === b.dataset.h); openModal({ title: h.name, html: `<p><b>%${h.score}</b> — ${h.correct} doğru, ${h.wrong} yanlış, ${fmtTime(h.seconds)}</p><p>Yanlış kelimeler: ${h.wrongWords.length ? esc(h.wrongWords.map((w) => w.word).join(', ')) : '—'}</p>` }); }; });
}
