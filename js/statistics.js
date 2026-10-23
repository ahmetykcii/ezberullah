// İstatistikler: günlük kayıtlar, seri, özetler, grafikler, 365 günlük takvim. Tüm değerler gerçek kayıtlardan hesaplanır.
import { state, saveData, getSettings } from './storage.js';
import { GRAMMAR_TOPICS } from './grammar-data.js';
import { dayKey, poolOf, isDue, isWordReady } from './engine.js';
import { LEVELS, LEVEL_NAMES, posLabel, statusLabel } from './vocabulary.js';
import { esc, fmtTime, ring, openModal, $ } from './ui.js';

const blank = (date) => ({
  date, seconds: 0, correct: 0, wrong: 0, newWords: 0, reviews: 0, done: 0, rt: 0, rc: 0,
  learnedWordIds: [], sessionsCompleted: 0,
});
export const today = () => {
  const k = dayKey();
  const d = state.daily[k] || blank(k);
  if (!Array.isArray(d.learnedWordIds)) d.learnedWordIds = [];
  return d;
};

export function todayLearnedCount(d = today()) {
  if (Array.isArray(d?.learnedWordIds) && d.learnedWordIds.length > 0) return d.learnedWordIds.length;
  return d?.newWords || 0;
}

/** bumpDaily: günlük kaydı artırır ve kaydeder. rt/rc: önceden öğrenilmiş kelimelerin tekrar sonuçları. */
export async function bumpDaily(delta) {
  const d = { ...today() };
  if (!Array.isArray(d.learnedWordIds)) d.learnedWordIds = [];
  if (delta.learnedWordId) {
    if (!d.learnedWordIds.includes(delta.learnedWordId)) {
      d.learnedWordIds.push(delta.learnedWordId);
      d.newWords = d.learnedWordIds.length;
    }
    delete delta.learnedWordId;
  }
  for (const [k, v] of Object.entries(delta)) {
    if (k === 'learnedWordIds') continue;
    d[k] = (d[k] || 0) + v;
  }
  await saveData('daily', d);
}

export function streakStats(now = new Date()) {
  const days = state.daily;
  const isDayActive = (k) => {
    const d = days[k];
    return !!(d && ((d.correct || 0) + (d.wrong || 0) > 0 || (d.newWords || 0) > 0 || (d.reviews || 0) > 0 || (d.sessionsCompleted || 0) > 0));
  };
  const todayK = dayKey(now);
  const todayActive = isDayActive(todayK);

  // Mevcut seri hesabı:
  // Bugün henüz çalışılmadıysa dünden itibaren geriye say (dünün serisi korunur).
  // Dün de çalışılmadıysa seri bozulmuştur (0 gün).
  const d = new Date(now);
  if (!todayActive) d.setDate(d.getDate() - 1);
  let current = 0;
  while (isDayActive(dayKey(d))) {
    current++;
    d.setDate(d.getDate() - 1);
  }

  // En uzun seri hesabı:
  const activeKeys = Object.keys(days).filter(isDayActive).sort();
  let longest = 0;
  let running = 0;
  let prevDate = null;
  for (const k of activeKeys) {
    const [y, m, dt] = k.split('-').map(Number);
    const thisDate = new Date(y, m - 1, dt);
    if (prevDate) {
      const step = new Date(prevDate);
      step.setDate(step.getDate() + 1);
      if (dayKey(step) === k) {
        running++;
      } else {
        running = 1;
      }
    } else {
      running = 1;
    }
    if (running > longest) longest = running;
    prevDate = thisDate;
  }
  if (current > longest) longest = current;

  return { current, longest, todayActive };
}

export function streak(now = new Date()) {
  return streakStats(now).current;
}

export function getMistakeAnalytics(limit = 10) {
  const readyWords = state.words.filter((w) => isWordReady(w) && !w.isDraft);
  const items = [];
  for (const w of readyWords) {
    const p = state.progress[w.id];
    if (!p || (p.incorrectCount || 0) <= 0) continue;
    const errors = p.incorrectCount || 0;
    const corrects = p.correctCount || 0;
    const total = errors + corrects;
    const accuracy = total > 0 ? Math.round((corrects / total) * 100) : null;
    items.push({
      id: w.id,
      word: w.word,
      meaning: Array.isArray(w.meanings) ? w.meanings[0] : (w.meanings || ''),
      allMeanings: Array.isArray(w.meanings) ? w.meanings.join(' · ') : (w.meanings || ''),
      level: w.level,
      partOfSpeech: w.partOfSpeech || 'noun',
      exampleSentence: w.exampleSentence || '',
      exampleTranslation: w.exampleTranslation || '',
      incorrectCount: errors,
      correctCount: corrects,
      totalAnswers: total,
      accuracy,
      lastReviewedAt: p.lastReviewedAt || null,
      lastMistakeAt: p.mistakeHistory?.at(-1)?.at || p.lastReviewedAt || null,
    });
  }
  items.sort((a, b) => b.incorrectCount - a.incorrectCount || (b.lastMistakeAt || 0) - (a.lastMistakeAt || 0));
  return {
    totalMistakeWords: items.length,
    top10: items.slice(0, limit),
  };
}
export const totalSeconds = () => Object.values(state.daily).reduce((a, d) => a + (d.seconds || 0), 0);

export function levelStats(level, now = Date.now()) {
  const allWs = level ? state.words.filter((w) => w.level === level) : state.words;
  const ws = allWs.filter((w) => isWordReady(w));
  const drafts = allWs.length - ws.length;
  const s = { total: ws.length, drafts, NEW: 0, LEARNING: 0, REVIEW: 0, MASTERED: 0, due: 0, completed: 0 };
  for (const w of ws) {
    const p = state.progress[w.id];
    s[poolOf(p)]++;
    if (p?.learningComplete) s.completed++;
    if (isDue(p, now)) s.due++;
  }
  s.completion = s.total ? (s.completed / s.total) * 100 : 0;   // Öğrenme Tamamlanma Oranı: 6 aşamayı bitirenler
  s.mastery = s.total ? (s.MASTERED / s.total) * 100 : 0;       // Kalıcı Öğrenme Oranı: MASTERED havuzu
  return s;
}

function lastDays(n) {
  const out = [];
  const d = new Date(); d.setDate(d.getDate() - n + 1);
  for (let i = 0; i < n; i++) { out.push(state.daily[dayKey(d)] || blank(dayKey(d))); d.setDate(d.getDate() + 1); }
  return out;
}

function bars(days) {
  const max = Math.max(1, ...days.map((d) => d.correct + d.wrong));
  return `<div class="bars" style="--n:${days.length}" role="img" aria-label="Günlük cevap sayıları">${days.map((d) => {
    return `<div class="bar" title="${d.date}: ${d.correct} doğru, ${d.wrong} yanlış"><i class="b-w" style="height:${(d.wrong / max) * 100}%"></i><i class="b-c" style="height:${(d.correct / max) * 100}%"></i></div>`;
  }).join('')}</div>
  <div class="legend"><span class="dot c"></span>Doğru <span class="dot w"></span>Yanlış</div>`;
}

function heatmap() {
  const cells = [];
  const end = new Date();
  const start = new Date(end); start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // pazartesi hizası
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const r = state.daily[dayKey(d)];
    const n = r ? r.correct + r.wrong : 0;
    const lv = n === 0 ? 0 : n < 10 ? 1 : n < 25 ? 2 : n < 50 ? 3 : 4;
    cells.push(`<i class="hm l${lv}" title="${dayKey(d)}: ${n} cevap"></i>`);
  }
  return `<div class="heat" role="img" aria-label="Son 365 günlük çalışma takvimi">${cells.join('')}</div>`;
}

/** Zorlandığın kelimeler analizi (en çok hata yapılan ilk 10) — Tekrar ve İstatistikler ekranlarından açılır. */
export function openMistakeAnalysis() {
  const m = getMistakeAnalytics(10);
  openModal({
    title: 'Zorlandığın Kelimeler', wide: true,
    html: m.totalMistakeWords ? `<p class="muted small">En çok hata yaptığın ilk 10 kelime (gerçek çalışma geçmişine dayalıdır).</p>
      <ul class="list flush">${m.top10.map((x) => `<li class="list-row"><div class="row-main"><b>${esc(x.word)}</b><span class="muted small">${esc(x.meaning)}</span></div><span class="muted small">${x.incorrectCount} hata${x.accuracy !== null ? ` · %${x.accuracy}` : ''}</span></li>`).join('')}</ul>
      <div class="row end"><button class="btn primary" id="mm-review">Bu Kelimeleri Tekrar Et</button></div>` : '<p class="muted">Henüz zorlandığın bir kelime yok.</p>',
    onMount(b, api) {
      const r = $('#mm-review', b);
      if (r) r.onclick = async () => { api.close(); const { startReview } = await import('./review.js'); startReview('mistakes'); };
    },
  });
}

export function renderStats(view) {
  const all = levelStats('');
  const rows = Object.values(state.daily);
  const correct = rows.reduce((a, d) => a + d.correct, 0), wrong = rows.reduce((a, d) => a + d.wrong, 0);
  const rt = rows.reduce((a, d) => a + (d.rt || 0), 0), rc = rows.reduce((a, d) => a + (d.rc || 0), 0);
  const posMap = {};
  for (const w of state.words) {
    const p = state.progress[w.id];
    if (!p || p.correctCount + p.incorrectCount === 0) continue;
    const e = (posMap[w.partOfSpeech || 'other'] = posMap[w.partOfSpeech || 'other'] || { c: 0, w: 0 });
    e.c += p.correctCount; e.w += p.incorrectCount;
  }
  const pos = Object.entries(posMap).filter(([, e]) => e.c + e.w >= 5).map(([k, e]) => [k, e.w / (e.c + e.w), e.c + e.w]).sort((a, b) => b[1] - a[1]);
  const acc = correct + wrong ? Math.round((correct / (correct + wrong)) * 100) : null;
  const goal = getSettings().dailyGoal || 10;
  const tw = todayLearnedCount(today());
  const gDone = Object.values(state.grammarProgress || {}).filter((g) => g && g.completed).length;
  const gTotal = GRAMMAR_TOPICS.length;
  const gPct = gTotal ? (gDone / gTotal) * 100 : 0;
  const mist = getMistakeAnalytics(10);
  const metric = (label, value, pct, sub = '') => `<li class="metric"><div class="metric-head"><span>${label}</span><b>${value}</b></div><div class="progress thin"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>${sub ? `<span class="muted small">${sub}</span>` : ''}</li>`;
  view.innerHTML = `<div class="page">
  <h1>İstatistikler</h1>
  <ul class="metrics">
    ${metric('Genel İlerleme', `%${Math.round(all.completion)}`, all.completion, `${all.completed}/${all.total} kelime 6 aşamayı tamamladı`)}
    ${metric('Bugünkü Hedef', `${tw}/${goal}`, (tw / goal) * 100, 'Yeni öğrenilen kelime')}
    ${metric('Öğrenilen Kelimeler', all.completed, all.completion, LEVELS.map((l) => `${l}: ${levelStats(l).completed}`).join(' · '))}
    ${metric('Grammar', `${gDone}/${gTotal}`, gPct, 'Tamamlanan konu')}
  </ul>
  <div class="mini-facts"><span>Günlük Seri <b>${streak()} gün</b></span><span>Başarı <b>${acc === null ? '—' : '%' + acc}</b></span><span>Toplam Süre <b>${fmtTime(totalSeconds())}</b></span></div>

  <details class="more"><summary>Öğrenme geçmişi</summary><div class="more-body">
    <div class="seg sm" id="range" role="group">${[7, 30, 90].map((n, i) => `<button class="seg-btn ${i ? '' : 'active'}" data-n="${n}">${n} gün</button>`).join('')}</div>
    <div id="chart">${bars(lastDays(7))}</div></div></details>
  <details class="more"><summary>Seviye ayrıntıları</summary><div class="more-body">
    ${LEVELS.map((l) => { const s = levelStats(l); return `<div class="hbar"><span>${l}</span><div class="progress thin"><i style="width:${s.completion}%"></i></div><small class="muted">${LEVEL_NAMES[l]} · Tamamlanma %${Math.round(s.completion)} · Kalıcı öğrenme %${Math.round(s.mastery)}</small></div>`; }).join('')}
    <p class="muted small">${correct} doğru · ${wrong} yanlış cevap kaydedildi.</p></div></details>
  <details class="more"><summary>Zorlandığın kelimeler${mist.totalMistakeWords ? ` (${mist.totalMistakeWords})` : ''}</summary><div class="more-body">
    ${mist.totalMistakeWords ? `<ul class="list flush">${mist.top10.slice(0, 5).map((x) => `<li class="list-row"><div class="row-main"><b>${esc(x.word)}</b><span class="muted small">${esc(x.meaning)}</span></div><span class="muted small">${x.incorrectCount}×</span></li>`).join('')}</ul><button class="btn sm" id="mist-all">Tüm analizi gör</button>` : '<p class="muted">Henüz yanlış yapılan kelime yok.</p>'}
    ${pos.length ? `<h3 class="sub-h">Zorlanılan kelime türleri</h3>${pos.slice(0, 5).map(([k, r, n]) => `<div class="hbar"><span>${esc(posLabel(k))}</span><div class="progress thin bad"><i style="width:${r * 100}%"></i></div><small class="muted">%${Math.round(r * 100)} hata (${n} cevap)</small></div>`).join('')}` : ''}</div></details>
  <details class="more"><summary>Hafıza performansı</summary><div class="more-body">${rt >= 20 ? `<div class="row gap">${ring((rc / rt) * 100, 88)}<p>Önceden öğrenilmiş kelimelerin <b>${rt}</b> tekrar cevabından <b>${rc}</b> tanesi doğru.</p></div>` : `<p class="muted">Tahmini hatırlama başarısı için yeterli veri yok: ${rt}/20 tekrar cevabı.</p>`}</div></details>
  <details class="more"><summary>Çalışma takvimi</summary><div class="more-body">${heatmap()}<div class="legend">Az <i class="hm l0"></i><i class="hm l1"></i><i class="hm l2"></i><i class="hm l3"></i><i class="hm l4"></i> Çok</div></div></details>
  <div id="plan"></div>
  </div>`;
  view.querySelectorAll('#range .seg-btn').forEach((b) => {
    b.onclick = () => {
      view.querySelectorAll('#range .seg-btn').forEach((x) => x.classList.toggle('active', x === b));
      view.querySelector('#chart').innerHTML = bars(lastDays(+b.dataset.n));
    };
  });
  const ma = view.querySelector('#mist-all'); if (ma) ma.onclick = openMistakeAnalysis;
  import('./review.js').then(({ studyPlan }) => {
    const p = studyPlan(); const box = view.querySelector('#plan');
    if (box && p && !p.past) box.innerHTML = `<details class="more"><summary>Sınav planı · ${p.days} gün kaldı</summary><div class="more-body"><p class="muted">${esc(p.phase)}</p><p>Öğrenilmemiş <b>${p.unlearned}</b> · Yeni/gün <b>${p.newPerDay}</b> · Tekrar/gün <b>${p.reviewPerDay}</b> · Önerilen günlük hedef <b>${p.suggested}</b></p></div></details>`;
  }).catch(() => {});
}
