// İstatistikler: günlük kayıtlar, seri, özetler, grafikler, 365 günlük takvim. Tüm değerler gerçek kayıtlardan hesaplanır.
import { state, saveData } from './storage.js';
import { dayKey, poolOf, isDue, isWordReady } from './engine.js';
import { LEVELS, LEVEL_NAMES, posLabel, statusLabel } from './vocabulary.js';
import { esc, fmtTime, ring } from './ui.js';

const blank = (date) => ({ date, seconds: 0, correct: 0, wrong: 0, newWords: 0, reviews: 0, done: 0, rt: 0, rc: 0 });
export const today = () => state.daily[dayKey()] || blank(dayKey());

/** bumpDaily: günlük kaydı artırır ve kaydeder. rt/rc: önceden öğrenilmiş kelimelerin tekrar sonuçları. */
export async function bumpDaily(delta) {
  const d = { ...today() };
  for (const [k, v] of Object.entries(delta)) d[k] = (d[k] || 0) + v;
  await saveData('daily', d);
}

export function streak() {
  const days = state.daily;
  const active = (k) => days[k] && days[k].correct + days[k].wrong > 0;
  const d = new Date();
  if (!active(dayKey(d))) d.setDate(d.getDate() - 1); // bugün henüz çalışılmadıysa dünden say
  let n = 0;
  while (active(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
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
  const top = state.words.filter((w) => state.progress[w.id]?.incorrectCount > 0).sort((a, b) => state.progress[b.id].incorrectCount - state.progress[a.id].incorrectCount).slice(0, 10);
  const acc = correct + wrong ? Math.round((correct / (correct + wrong)) * 100) : null;
  const card = (t, v) => `<div class="stat"><span class="muted">${t}</span><b>${v}</b></div>`;
  view.innerHTML = `<h1>İstatistikler</h1>
  <div class="grid stats">${card('Toplam Kelime', all.total)}${card('Öğrenilen (6 Aşama)', all.completed)}${card(statusLabel('MASTERED'), all.MASTERED)}${card(statusLabel('REVIEW'), all.REVIEW)}${card(statusLabel('NEW'), all.NEW)}
  ${card('Başarı Oranı', acc === null ? '—' : acc + '%')}${card('Toplam Çalışma Süresi', fmtTime(totalSeconds()))}${card('Günlük Seri', streak() + ' gün')}</div>
  <div class="card"><div class="row between"><h3>Öğrenme Geçmişi</h3><div class="tabs" id="range">${[7, 30, 90].map((n, i) => `<button class="tab ${i ? '' : 'on'}" data-n="${n}">Son ${n} Gün</button>`).join('')}</div></div><div id="chart">${bars(lastDays(7))}</div></div>
  <div class="grid two">
   <div class="card"><h3>Seviye İlerlemesi</h3>${LEVELS.map((l) => { const s = levelStats(l); return `<div class="hbar"><span>${l}</span><div class="progress"><i style="width:${s.completion}%"></i></div><small>${LEVEL_NAMES[l]} · Öğrenme Tamamlanma Oranı %${Math.round(s.completion)} · Kalıcı Öğrenme Oranı %${Math.round(s.mastery)}</small></div>`; }).join('')}</div>
   <div class="card"><h3>Doğru / Yanlış Oranı</h3>${correct + wrong ? `<div class="progress big"><i style="width:${(correct / (correct + wrong)) * 100}%"></i></div><p class="muted">${correct} doğru · ${wrong} yanlış</p>` : '<p class="muted">Henüz cevap kaydı yok.</p>'}</div>
   <div class="card"><h3>En Çok Zorlanılan Kelime Türleri</h3>${pos.length ? pos.slice(0, 5).map(([k, r, n]) => `<div class="hbar"><span>${esc(posLabel(k))}</span><div class="progress bad"><i style="width:${r * 100}%"></i></div><small>%${Math.round(r * 100)} hata (${n} cevap)</small></div>`).join('') : '<p class="muted">Yeterli veri yok (tür başına en az 5 cevap gerekir).</p>'}</div>
   <div class="card"><h3>En Çok Yanlış Yapılan Kelimeler</h3>${top.length ? `<ol class="plain">${top.map((w) => `<li><b>${esc(w.word)}</b> <span class="muted">${esc(w.meanings[0])}</span> <span class="chip bad">${state.progress[w.id].incorrectCount}×</span></li>`).join('')}</ol>` : '<p class="muted">Henüz yanlış yapılan kelime yok.</p>'}</div>
  </div>
  <div class="card"><h3>Hafıza Performansı</h3>${rt >= 20 ? `<div class="row gap">${ring((rc / rt) * 100, 96)}<p>Önceden öğrenilmiş kelimelerin <b>${rt}</b> tekrar cevabından <b>${rc}</b> tanesi doğru. Bu, gerçek tekrar sonuçlarına dayalı tahmini hatırlama başarınızdır.</p></div>` : `<p class="muted">Tahmini hatırlama başarısı için yeterli veri yok: ${rt}/20 tekrar cevabı kaydedildi. Akıllı Tekrar çözdükçe burada görünecek.</p>`}</div>
  <div class="card"><h3>Çalışma Takvimi (365 Gün)</h3>${heatmap()}<div class="legend">Az <i class="hm l0"></i><i class="hm l1"></i><i class="hm l2"></i><i class="hm l3"></i><i class="hm l4"></i> Çok</div></div>`;
  view.querySelectorAll('#range .tab').forEach((b) => {
    b.onclick = () => {
      view.querySelectorAll('#range .tab').forEach((x) => x.classList.toggle('on', x === b));
      view.querySelector('#chart').innerHTML = bars(lastDays(+b.dataset.n));
    };
  });
}
