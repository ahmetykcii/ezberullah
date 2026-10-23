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

/* ---------- Cümle Değerlendirme & Çok Aşamalı İpucu Sistemi (v3.2) ---------- */
const IRREGULAR_VERBS = {
  be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'],
  go: ['goes', 'went', 'gone', 'going'],
  have: ['has', 'had', 'having'],
  do: ['does', 'did', 'done', 'doing'],
  see: ['sees', 'saw', 'seen', 'seeing'],
  take: ['takes', 'took', 'taken', 'taking'],
  make: ['makes', 'made', 'making'],
  get: ['gets', 'got', 'gotten', 'getting'],
  write: ['writes', 'wrote', 'written', 'writing'],
  buy: ['buys', 'bought', 'buying'],
  think: ['thinks', 'thought', 'thinking'],
  bring: ['brings', 'brought', 'bringing'],
  speak: ['speaks', 'spoke', 'spoken', 'speaking'],
  eat: ['eats', 'ate', 'eaten', 'eating'],
  drink: ['drinks', 'drank', 'drunk', 'drinking'],
  run: ['runs', 'ran', 'running'],
  come: ['comes', 'came', 'coming'],
  give: ['gives', 'gave', 'given', 'giving'],
  find: ['finds', 'found', 'finding'],
  tell: ['tells', 'told', 'telling'],
  leave: ['leaves', 'left', 'leaving'],
  feel: ['feels', 'felt', 'feeling'],
  hear: ['hears', 'heard', 'hearing'],
  meet: ['meets', 'met', 'meeting'],
  pay: ['pays', 'paid', 'paying'],
  say: ['says', 'said', 'saying'],
  sell: ['sells', 'sold', 'selling'],
  send: ['sends', 'sent', 'sending'],
  sleep: ['sleeps', 'slept', 'sleeping'],
  spend: ['spends', 'spent', 'spending'],
  teach: ['teaches', 'taught', 'teaching'],
  understand: ['understands', 'understood', 'understanding'],
  wear: ['wears', 'wore', 'worn', 'wearing'],
  win: ['wins', 'won', 'winning'],
  know: ['knows', 'knew', 'known', 'knowing'],
  choose: ['chooses', 'chose', 'chosen', 'choosing'],
  drive: ['drives', 'drove', 'driven', 'driving'],
  fly: ['flies', 'flew', 'flown', 'flying'],
  grow: ['grows', 'grew', 'grown', 'growing'],
  keep: ['keeps', 'kept', 'keeping'],
  lose: ['loses', 'lost', 'losing'],
  read: ['reads', 'reading'],
  rise: ['rises', 'rose', 'risen', 'rising'],
  sit: ['sits', 'sat', 'sitting'],
  swim: ['swims', 'swam', 'swum', 'swimming'],
  build: ['builds', 'built', 'building'],
  catch: ['catches', 'caught', 'catching'],
  fall: ['falls', 'fell', 'fallen', 'falling'],
  break: ['breaks', 'broke', 'broken', 'breaking'],
  begin: ['begins', 'began', 'begun', 'beginning'],
  forget: ['forgets', 'forgot', 'forgotten', 'forgetting'],
  hide: ['hides', 'hid', 'hidden', 'hiding'],
  hold: ['holds', 'held', 'holding'],
  lead: ['leads', 'led', 'leading'],
  lend: ['lends', 'lent', 'lending'],
  lie: ['lies', 'lay', 'lain', 'lying'],
  ride: ['rides', 'rode', 'ridden', 'riding'],
  ring: ['rings', 'rang', 'rung', 'ringing'],
  set: ['sets', 'setting'],
  shake: ['shakes', 'shook', 'shaken', 'shaking'],
  shine: ['shines', 'shone', 'shining'],
  shoot: ['shoots', 'shot', 'shooting'],
  show: ['shows', 'showed', 'shown', 'showing'],
  shut: ['shuts', 'shutting'],
  sing: ['sings', 'sang', 'sung', 'singing'],
  sink: ['sinks', 'sank', 'sunk', 'sinking'],
  stand: ['stands', 'stood', 'standing'],
  steal: ['steals', 'stole', 'stolen', 'stealing'],
  throw: ['throws', 'threw', 'thrown', 'throwing'],
  wake: ['wakes', 'woke', 'woken', 'waking'],
};

const IRREGULAR_NOUNS = {
  child: ['children'],
  man: ['men'],
  woman: ['women'],
  foot: ['feet'],
  tooth: ['teeth'],
  person: ['people', 'persons'],
  mouse: ['mice'],
};

/**
 * Hedef kelimenin geçerli morfolojik çekimlerini, UK/US alternatiflerini ve ailesini döndürür.
 */
export function getWordForms(word) {
  const forms = new Set();
  const base = String(word?.word || '').trim().toLowerCase();
  if (!base) return forms;
  forms.add(base);

  (word.alternativeAnswers || []).forEach((a) => {
    if (a && typeof a === 'string') forms.add(a.trim().toLowerCase());
  });
  (word.wordFamily || []).forEach((f) => {
    if (f && typeof f === 'string') forms.add(f.trim().toLowerCase());
  });

  const bases = [...forms];
  for (const b of bases) {
    if (b.length < 2) continue;
    if (b.endsWith('y') && !/[aeiou]y$/i.test(b)) {
      forms.add(b.slice(0, -1) + 'ies');
      forms.add(b.slice(0, -1) + 'ied');
    } else if (b.endsWith('s') || b.endsWith('sh') || b.endsWith('ch') || b.endsWith('x') || b.endsWith('z')) {
      forms.add(b + 'es');
    } else {
      forms.add(b + 's');
    }

    if (b.endsWith('e')) {
      forms.add(b + 'd');
    } else if (!b.endsWith('y')) {
      forms.add(b + 'ed');
      if (/[aeiou][bdfgklmnprstvz]$/i.test(b) && !/[aeiou]{2}[a-z]$/i.test(b)) {
        forms.add(b + b.slice(-1) + 'ed');
      }
    }

    if (b.endsWith('ie')) {
      forms.add(b.slice(0, -2) + 'ying');
    } else if (b.endsWith('e') && !b.endsWith('ee')) {
      forms.add(b.slice(0, -1) + 'ing');
    } else {
      forms.add(b + 'ing');
      if (/[aeiou][bdfgklmnprstvz]$/i.test(b) && !/[aeiou]{2}[a-z]$/i.test(b)) {
        forms.add(b + b.slice(-1) + 'ing');
      }
    }

    if (b.endsWith('e')) {
      forms.add(b + 'r');
      forms.add(b + 'st');
    } else if (b.endsWith('y') && !/[aeiou]y$/i.test(b)) {
      forms.add(b.slice(0, -1) + 'ier');
      forms.add(b.slice(0, -1) + 'iest');
    }
  }

  if (IRREGULAR_VERBS[base]) {
    IRREGULAR_VERBS[base].forEach((irr) => forms.add(irr));
  }
  for (const [irrBase, irrForms] of Object.entries(IRREGULAR_VERBS)) {
    if (irrForms.includes(base)) {
      forms.add(irrBase);
      irrForms.forEach((f) => forms.add(f));
    }
  }

  if (IRREGULAR_NOUNS[base]) {
    IRREGULAR_NOUNS[base].forEach((n) => forms.add(n));
  }
  for (const [nBase, nForms] of Object.entries(IRREGULAR_NOUNS)) {
    if (nForms.includes(base)) {
      forms.add(nBase);
      nForms.forEach((f) => forms.add(f));
    }
  }

  return forms;
}

/**
 * Cümle içindeki kelimeleri tokenize eder ve hedef kelimenin (veya çekiminin)
 * bağımsız bir kelime olarak geçip geçmediğini denetler (alt karakter eşleşmelerini önler).
 */
export function findTargetWordInSentence(word, sentence) {
  const forms = getWordForms(word);
  const rawTokens = String(sentence || '').trim().split(/\s+/).filter(Boolean);
  const cleanTokens = rawTokens
    .map((t) => t.replace(/^[^a-zA-Z0-9']+|[^a-zA-Z0-9']+$/g, '').toLowerCase())
    .filter(Boolean);

  for (const token of cleanTokens) {
    if (forms.has(token)) return { found: true, matchedToken: token, cleanTokens };
    if (token.endsWith("'s") && forms.has(token.slice(0, -2))) {
      return { found: true, matchedToken: token, cleanTokens };
    }
  }

  const base = String(word?.word || '').trim().toLowerCase();
  if (base.includes(' ')) {
    const normSent = cleanTokens.join(' ');
    if (normSent.includes(base)) return { found: true, matchedToken: base, cleanTokens };
  }

  return { found: false, matchedToken: null, cleanTokens };
}

/**
 * v3.2 Cümle Değerlendirme Algoritması:
 * 1) Biçimsel kontroller (boşluk, 4 kelime şartı, hedef kelime varlığı, anlamsız tekrar).
 * 2) 3 farklı durum: 'valid' (onaylandı), 'needs_fix' (düzeltme gerekli), 'ambiguous' (belirsiz / şüpheli).
 * 3) Çevrimdışı PWA sınırlarına sadık, dürüst ve kullanıcı dostu Türkçe geri bildirim.
 */
export function evaluateSentence(word, input) {
  const s = String(input || '').trim();
  if (!s) {
    return {
      status: 'needs_fix',
      reason: 'empty',
      ok: false,
      message: 'Lütfen bir cümle yazın.',
    };
  }

  const { found, matchedToken, cleanTokens } = findTargetWordInSentence(word, s);

  if (cleanTokens.length < 4) {
    return {
      status: 'needs_fix',
      reason: 'too_short',
      ok: false,
      message: 'Cümlen en az 4 kelimeden oluşmalıdır.',
      tokenCount: cleanTokens.length,
    };
  }

  if (!found) {
    return {
      status: 'needs_fix',
      reason: 'word_missing',
      ok: false,
      message: `"${word?.word || ''}" kelimesi veya uygun çekimli bir biçimi cümlende bulunamadı.`,
    };
  }

  const uniqueTokens = new Set(cleanTokens);
  if (uniqueTokens.size < 3) {
    return {
      status: 'needs_fix',
      reason: 'repetitive',
      ok: false,
      message: 'Lütfen anlamlı bir İngilizce cümle oluşturun; farklı kelimelerle tam bir ifade yazın.',
    };
  }

  // Belirsizlik kontrolü: tam dil bilgisi motoru olmadan şüpheli yapılar tespit edilirse
  // kullanıcıya kesin yanlış demeden düzenleme veya devam etme özgürlüğü verilir.
  const hasPlaceholder = /[\.]{3,}|_{2,}|\[\.\.\.\]|\.\.\./.test(s);
  const suspiciousAdverb = /\b(want|needs?|likes?|loves?)\s+abroad\b/i.test(s);

  if (hasPlaceholder || suspiciousAdverb) {
    return {
      status: 'ambiguous',
      ok: true,
      reason: 'grammar_uncertain',
      message: 'Cümlen biçimsel kontrolleri geçti ancak dil bilgisi yapısı tam olarak doğrulanamadı. Cümleni düzenleyebilir veya bu şekilde devam edebilirsin.',
      matchedToken,
    };
  }

  return {
    status: 'valid',
    ok: true,
    reason: 'valid',
    message: 'Cümlen gerekli kontrolleri geçti.',
    matchedToken,
  };
}

const CURATED_HINTS = {
  abroad: {
    usage: 'Abroad genellikle yurt dışında bulunmayı veya yurt dışına gitmeyi anlatırken kullanılır.',
    frame: 'I want to … abroad.',
  },
  apartment: {
    usage: 'Apartment (daire), genellikle yaşamak veya kiralamak bağlamında bir isim olarak kullanılır.',
    frame: 'They live in a(n) … apartment.',
  },
  borrow: {
    usage: 'Borrow bir fiildir; birinden geçici olarak bir şey ödünç almak anlamına gelir (genellikle "borrow ... from" şeklinde kullanılır).',
    frame: 'Can I borrow your … ?',
  },
  achieve: {
    usage: 'Achieve bir fiildir; çaba göstererek bir hedefe veya başarıya ulaşmayı ifade eder.',
    frame: 'She worked hard to achieve her … .',
  },
};

/**
 * v3.2 Üç Aşamalı Akıllı İpucu Üreteci:
 * İpucu 1: Kelimenin Kullanımı (Türkçe bağlam açıklaması)
 * İpucu 2: Cümle Kalıbı (İngilizce tamamlama şablonu)
 * İpucu 3: Örnek Cümle (Referans amaçlı, cevap anahtarı değildir uyarısıyla)
 */
export function getWordHints(word) {
  if (!word) return { usage: '', frame: '', exampleSentence: '', exampleTranslation: '', exampleNote: '' };
  const w = String(word.word || '').trim();
  const lower = w.toLowerCase();
  const meanings = Array.isArray(word.meanings) ? word.meanings.filter(Boolean) : [];
  const mStr = meanings.slice(0, 2).join(', ') || 'anlamı';
  const pos = String(word.partOfSpeech || '').toLowerCase();
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

  let usage = word.usageHint || CURATED_HINTS[lower]?.usage || '';
  if (!usage) {
    if (pos === 'verb') {
      usage = `${cap(w)} bir eylemi anlatan fiildir ("${mStr}"); cümlede bir özneyle (örneğin I, you, she) birlikte kullanılır.`;
    } else if (pos === 'noun') {
      usage = `${cap(w)} bir isimdir ("${mStr}"); cümlede özne veya nesne olarak (örneğin a/an, the ile) kullanılabilir.`;
    } else if (pos === 'adjective') {
      usage = `${cap(w)} bir sıfattır ("${mStr}"); bir ismi nitelemek için veya "is/are/was" gibi yardımcı fiillerden sonra kullanılır.`;
    } else if (pos === 'adverb') {
      usage = `${cap(w)} bir zarftır ("${mStr}"); eylemin nasıl, nerede veya ne zaman gerçekleştiğini belirtmek için kullanılır.`;
    } else if (pos === 'preposition') {
      usage = `${cap(w)} bir edattır ("${mStr}"); zaman, konum veya yön belirtirken bir isimden önce kullanılır.`;
    } else {
      usage = `${cap(w)} ("${mStr}"), cümlede hedeflenen anlamı ifade etmek üzere uygun bağlamda kullanılır.`;
    }
    if (Array.isArray(word.collocations) && word.collocations[0]) {
      usage += ` Genellikle "${word.collocations[0]}" gibi ifadelerle birlikte görülür.`;
    }
  }

  let frame = word.sentenceFrame || CURATED_HINTS[lower]?.frame || '';
  if (!frame) {
    if (Array.isArray(word.collocations) && word.collocations[0]) {
      frame = `I want to ${word.collocations[0]} …`;
    } else if (pos === 'verb') {
      frame = `I usually ${w} … (veya: She wants to ${w} …)`;
    } else if (pos === 'noun') {
      frame = `I have a(n) … ${w}.`;
    } else if (pos === 'adjective') {
      frame = `It is very ${w} because …`;
    } else if (pos === 'adverb') {
      frame = `I would like to … ${w}.`;
    } else {
      frame = `I think … ${w} is important.`;
    }
  }

  return {
    usage,
    frame,
    exampleSentence: word.exampleSentence || '',
    exampleTranslation: word.exampleTranslation || '',
    exampleNote: 'Bu yalnızca bir örnek cümledir. Kendi cümleni yazabilirsin; aynısını yazmak zorunda değilsin.',
  };
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
  return evaluateSentence(word, input).ok;
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
