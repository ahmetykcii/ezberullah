// VELUNO engine — saf (DOM'suz) mantık: SRS, hakimiyet puanı, soru üretimi, cevap kontrolü.
// Node veya macOS jsc ile test edilebilir (bkz. tests/run-tests.mjs).

export const DAY = 86400000;
export const INTERVALS = [1, 3, 7, 14, 30]; // gün
export const STAGES = [
  'Kelimeyi Öğren',
  'Çoktan Seçmeli Soru',
  'İngilizce Kelimeyi Yaz',
  'Eksik Harfleri Tamamla',
  'Örnek Cümlede Boşluk Doldur',
  'Kelimeyi Cümlede Kullan',
];
export const STAGE_TYPES = [null, 'card', 'mc', 'typing', 'missing', 'sentence', 'production'];

export const norm = (s) => String(s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
export const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function shuffle(a, rnd = Math.random) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

/* ---------- Kelime hazırlık / taslak kontrolü ---------- */
export function blankSentence(word) {
  const s = word?.exampleSentence || '';
  const w = word?.word || '';
  if (!s.trim() || !w.trim()) return null;
  const cands = [w];
  if (w.length > 4) cands.push(w.slice(0, -1));
  for (const c of cands) {
    const m = s.match(new RegExp('\\b' + escRe(c) + '\\w*', 'i'));
    if (m) return { text: s.replace(m[0], '_____'), answer: m[0] };
  }
  return null;
}

/**
 * Bir kelimenin 6 aşamalı öğrenme ve sınav sistemine girmeye hazır olup olmadığını kontrol eder.
 * 5. aşama (Örnek Cümlede Boşluk Doldur) için kelimenin geçtiği geçerli bir İngilizce örnek cümle şarttır.
 */
export function isWordReady(word) {
  if (!word || word.isDraft) return false;
  if (!word.word || !Array.isArray(word.meanings) || !word.meanings.some((m) => String(m).trim())) return false;
  if (!word.partOfSpeech || !word.exampleTranslation || !String(word.exampleTranslation).trim()) return false;
  return !!blankSentence(word);
}

/* ---------- Kelime ilerlemesi ---------- */
// currentStage: başarıyla geçilen en yüksek aşama (0–6). Havuz (currentStatus) bundan bağımsızdır:
// NEW | LEARNING | REVIEW | MASTERED
export function newProgress(id) {
  return {
    id, currentStage: 0, currentStatus: 'NEW', learningComplete: false, completedAt: null,
    lastReviewedAt: null, nextReviewAt: null, reviewCount: 0, correctCount: 0, incorrectCount: 0,
    consecutiveCorrect: 0, masteryScore: 0, reviewInterval: 0, srsStep: 0, mistakeHistory: [], stageStats: {},
  };
}

export const poolOf = (p) => (!p ? 'NEW' : p.currentStatus || 'NEW');
export const isDue = (p, now = Date.now()) =>
  !!p && p.learningComplete && (p.currentStatus === 'REVIEW' || (p.nextReviewAt ?? 0) <= now);

/**
 * Hakimiyet puanı (0–100), açıklanabilir formül:
 *  30 puan  : doğru cevap oranı (Laplace düzeltmeli)
 *  20 puan  : üst üste doğru (8'e kadar)
 *  50 puan  : başarılı aralıklı tekrar adımı (5 adımda tam puan)
 *  - ceza   : son 30 gündeki hatalar (hata başına 5, en çok 25)
 * Cevap süresi puana katılmaz. Hiç cevap yoksa 0.
 */
export function masteryScore(p, now = Date.now()) {
  const tot = p.correctCount + p.incorrectCount;
  if (!tot) return 0;
  const acc = ((p.correctCount + 1) / (tot + 2)) * 30;
  const seq = Math.min(1, p.consecutiveCorrect / 8) * 20;
  const srs = Math.min(1, p.srsStep / 5) * 50;
  const recent = (p.mistakeHistory || []).filter((m) => now - m.at < 30 * DAY).length;
  const penalty = Math.min(25, recent * 5);
  return Math.max(0, Math.min(100, Math.round(acc + seq + srs - penalty)));
}
export function masteryLabel(s) {
  return s <= 20 ? 'Bilmiyor' : s <= 40 ? 'Öğreniyor' : s <= 60 ? 'Gelişiyor' : s <= 80 ? 'İyi' : 'Çok iyi';
}
export const isMastered = (p) => p.srsStep >= 4 && p.consecutiveCorrect >= 3 && masteryScore(p) >= 60;

export function markSeen(p, now = Date.now()) {
  p.currentStage = Math.max(p.currentStage, 1);
  if (p.currentStatus === 'NEW') p.currentStatus = 'LEARNING';
  p.lastReviewedAt = now;
  return p;
}

/**
 * Bir cevabı ilerlemeye işler.
 * mode: 'learn' (aşama ilerletir) | 'review' (SRS adımı) | 'practice' (sadece sayaçlar; yanlışta REVIEW)
 * Önceki geçmiş asla silinmez; mistakeHistory sadece eklenir.
 */
export function applyAnswer(p, correct, { mode = 'practice', stage = 0, qtype = '' } = {}, now = Date.now()) {
  const wasComplete = p.learningComplete;
  p.lastReviewedAt = now;
  p.reviewCount++;
  const key = qtype || String(stage);
  const ss = (p.stageStats[key] = p.stageStats[key] || { c: 0, w: 0 });
  if (correct) {
    p.correctCount++; p.consecutiveCorrect++; ss.c++;
  } else {
    p.incorrectCount++; p.consecutiveCorrect = 0; ss.w++;
    p.mistakeHistory.push({ at: now, stage, qtype, mode });
    if (p.mistakeHistory.length > 200) p.mistakeHistory.shift();
    p.currentStatus = 'REVIEW';
  }
  if (mode === 'learn') {
    if (correct) {
      p.currentStage = Math.max(p.currentStage, stage);
      if (p.currentStatus === 'NEW') p.currentStatus = 'LEARNING';
      if (stage >= 6 && !p.learningComplete) {
        p.learningComplete = true; p.completedAt = now; p.srsStep = 0; p.reviewInterval = 1;
        p.nextReviewAt = now + DAY; p.currentStatus = 'LEARNING';
      }
    } else {
      p.nextReviewAt = now; // sonraki oturumda öncelikli
    }
  } else if (mode === 'review' && wasComplete) {
    if (correct) p.srsStep = Math.min(5, p.srsStep + 1);
    else p.srsStep = Math.max(0, p.srsStep - 2);
    p.reviewInterval = correct ? INTERVALS[Math.min(p.srsStep, 4)] : 1;
    p.nextReviewAt = now + p.reviewInterval * DAY;
    if (correct) p.currentStatus = isMastered(p) ? 'MASTERED' : 'LEARNING';
  } else if (!correct && wasComplete) {
    p.srsStep = Math.max(0, p.srsStep - 1);
    p.nextReviewAt = Math.min(p.nextReviewAt ?? now + DAY, now + DAY);
    p.reviewInterval = 1;
  }
  p.masteryScore = masteryScore(p, now);
  return p;
}

/* ---------- Soru üretimi ---------- */
export function maskWord(w, rnd = Math.random) {
  const idx = [];
  [...w].forEach((c, i) => { if (/[a-z]/i.test(c)) idx.push(i); });
  const n = Math.max(1, Math.min(idx.length - 1, idx.length <= 4 ? 1 : idx.length <= 6 ? 2 : idx.length <= 9 ? 3 : 4));
  const hide = new Set(shuffle(idx, rnd).slice(0, n));
  return { masked: [...w].map((c, i) => (hide.has(i) ? '_' : c)).join(''), hidden: hide.size };
}

export function stemRe(word) {
  const w = word.word;
  const stem = w.length > 4 ? w.slice(0, -1) : w;
  return new RegExp('\\b' + escRe(stem), 'i');
}

export function buildQuestion(word, type, all = [], rnd = Math.random) {
  const base = { wordId: word.id, word, type };
  const answers = [word.word, ...(word.alternativeAnswers || [])];
  const meaning = (word.meanings || []).join(', ');
  if (type === 'mc') {
    const correct = word.meanings[0];
    const own = new Set(word.meanings.map(norm));
    const ok = (w) => w.id !== word.id && w.meanings?.[0] && !w.meanings.some((m) => own.has(norm(m)));
    const activePool = all.filter((w) => !w.isDraft && ok(w));
    const pool = activePool.length >= 3 ? activePool : all.filter(ok);
    const order = [
      ...shuffle(pool.filter((w) => w.partOfSpeech === word.partOfSpeech && w.level === word.level), rnd),
      ...shuffle(pool.filter((w) => w.partOfSpeech === word.partOfSpeech), rnd),
      ...shuffle(pool, rnd),
    ];
    const seen = new Set([norm(correct)]);
    const bad = [];
    for (const w of order) {
      const m = w.meanings[0];
      if (bad.length < 3 && !seen.has(norm(m))) { bad.push(m); seen.add(norm(m)); }
    }
    if (bad.length >= 1) {
      const options = shuffle([correct, ...bad], rnd);
      return { ...base, prompt: word.word, options, answerIndex: options.indexOf(correct), display: correct };
    }
    type = 'typing';
    base.type = 'typing';
  }
  if (type === 'sentence') {
    const b = blankSentence(word);
    if (b) return { ...base, prompt: b.text, hint: word.exampleTranslation, meaning, answers: [...new Set([b.answer, ...answers])], display: b.answer };
    base.type = type = 'typing';
  }
  if (type === 'missing') {
    if ([...word.word].filter((c) => /[a-z]/i.test(c)).length >= 3) {
      const m = maskWord(word.word, rnd);
      return { ...base, prompt: m.masked, meaning, pos: word.partOfSpeech, answers, display: word.word };
    }
    base.type = type = 'typing';
  }
  if (type === 'production') return { ...base, prompt: word.word, meaning, display: word.exampleSentence };
  if (type === 'listening') return { ...base, prompt: word.word, answers, display: word.word };
  return { ...base, type: 'typing', prompt: meaning, pos: word.partOfSpeech, hintLen: word.word.length, answers, display: word.word };
}

export function checkProduction(word, input) {
  const s = String(input || '');
  const words = s.trim().split(/\s+/).filter(Boolean);
  return words.length >= 4 && stemRe(word).test(s);
}

export function checkAnswer(q, input) {
  if (q.type === 'mc') return input === q.answerIndex;
  if (q.type === 'production') return checkProduction(q.word, input);
  const n = norm(input);
  return n.length > 0 && q.answers.some((a) => norm(a) === n);
}

/* ---------- Kuyruk seçimi ---------- */
// Öğrenme grubu: yalnızca hazır (taslak olmayan, geçerli örnek cümleli) kelimeler alınır.
// Aday havuzu önce rastgele karıştırılır (alfabetik sıra önlenir); ardından öncelik korunur:
// En çok 2 "hatalı" (REVIEW) kelime + devam edenler (LEARNING) + yeni kelimeler (NEW).
export function learnBatch(words, progress, size = 5, rnd = Math.random) {
  const c = shuffle(words.filter((w) => isWordReady(w) && !progress[w.id]?.learningComplete), rnd);
  const st = (w) => progress[w.id]?.currentStatus || 'NEW';
  const failing = c.filter((w) => st(w) === 'REVIEW').sort((a, b) => progress[b.id].incorrectCount - progress[a.id].incorrectCount).slice(0, 2);
  const inprog = c.filter((w) => st(w) === 'LEARNING');
  const fresh = c.filter((w) => st(w) === 'NEW');
  return [...failing, ...inprog, ...fresh].slice(0, size);
}

export function learnItems(batch, progress, rnd = Math.random) {
  const items = [];
  for (let s = 1; s <= 6; s++) {
    const order = s === 1 ? batch : shuffle(batch, rnd);
    for (const w of order) {
      const cs = progress[w.id]?.currentStage || 0;
      if (s === 1 || cs < s) items.push({ wordId: w.id, stage: s, type: STAGE_TYPES[s] });
    }
  }
  return items;
}

export function reviewType(p, rnd = Math.random) {
  const step = p?.srsStep || 0;
  if (step === 0) return 'mc';
  if (step === 1) return 'typing';
  if (step === 2) return 'sentence';
  return ['typing', 'sentence', 'missing'][Math.floor(rnd() * 3)];
}

export function dayKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
