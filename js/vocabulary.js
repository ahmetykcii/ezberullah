// Kelime yönetimi: doğrulama, ekleme/düzenleme/silme, filtreleme, otomatik bilgi hazırlama, tohum veri, karıştırılan kelimeler.
import { state, saveData, saveMany, deleteData, getMeta, setMeta } from './storage.js';
import { norm, blankSentence, isWordReady } from './engine.js';

export const LEVELS = ['A2', 'B1', 'B2'];
export const LEVEL_NAMES = {
  A2: 'Temel Seviye',
  B1: 'Orta Seviye',
  B2: 'Orta Üstü Seviye',
};

export const STATUS_LABELS = {
  NEW: 'Yeni',
  LEARNING: 'Öğreniliyor',
  REVIEW: 'Tekrar Edilecek',
  MASTERED: 'Kalıcı Öğrenilen',
};
export const statusLabel = (code) => STATUS_LABELS[code] || code || 'Yeni';

export const CATEGORIES = [
  'Education', 'Environment', 'Technology', 'Health', 'Society',
  'Science', 'Business', 'Psychology', 'Daily Life', 'Academic Vocabulary',
];
export const CATEGORY_LABELS = {
  Education: 'Eğitim',
  Environment: 'Çevre',
  Technology: 'Teknoloji',
  Health: 'Sağlık',
  Society: 'Toplum',
  Science: 'Bilim',
  Business: 'İş Dünyası',
  Psychology: 'Psikoloji',
  'Daily Life': 'Günlük Yaşam',
  'Academic Vocabulary': 'Akademik Kelimeler',
  'General Vocabulary': 'Genel Kelimeler',
  'Confusing Words': 'Karıştırılan Kelimeler',
};
export const categoryLabel = (code) => CATEGORY_LABELS[code] || code || 'Günlük Yaşam';

export const POS = [
  'noun', 'verb', 'adjective', 'adverb', 'phrasal verb',
  'preposition', 'conjunction', 'pronoun', 'determiner', 'expression', 'idiom',
];
export const POS_LABELS = {
  noun: 'İsim',
  verb: 'Fiil',
  adjective: 'Sıfat',
  adverb: 'Zarf',
  'phrasal verb': 'Öbek Fiil',
  preposition: 'Edat',
  conjunction: 'Bağlaç',
  pronoun: 'Zamir',
  determiner: 'Belirteç',
  expression: 'İfade',
  idiom: 'Deyim',
  phrase: 'İfade',
  other: 'Diğer',
};
export const posLabel = (code) => POS_LABELS[code] || code || '—';

export const toList = (v) => (Array.isArray(v) ? v : String(v ?? '').split(/[;|]/)).map((x) => String(x).trim()).filter(Boolean);

/** Kelimenin öğrenme sistemine hazır olması için eksik olan bilgileri listeler. */
export function getMissingFields(w) {
  const missing = [];
  if (!w) return ['Kelime kaydı yok'];
  if (!w.partOfSpeech) missing.push('Kelime türü');
  if (!w.exampleSentence || !w.exampleSentence.trim()) {
    missing.push('İngilizce örnek cümle (5. aşama boşluk doldurma için zorunlu)');
  } else if (!blankSentence(w)) {
    missing.push(`Örnek cümle "${w.word}" kelimesini içermeli (5. aşama boşluk doldurma için)`);
  }
  if (!w.exampleTranslation || !w.exampleTranslation.trim()) {
    missing.push('Örnek cümlenin Türkçe çevirisi');
  }
  return missing;
}

/** Kelime nesnesini doğrular; hata mesajları dizisi döner (boşsa geçerli). */
export function validateWord(w) {
  const e = [];
  if (!w || typeof w !== 'object') return ['Geçersiz kayıt'];
  if (!LEVELS.includes(w.level)) e.push('Seviye A2, B1 veya B2 olmalı');
  if (typeof w.word !== 'string' || !w.word.trim()) e.push('İngilizce kelime boş olamaz');
  else if (!/^[A-Za-z][A-Za-z '’\-.]*$/.test(w.word.trim())) e.push('İngilizce kelime yalnızca harf içermeli');
  if (!Array.isArray(w.meanings) || !w.meanings.some((m) => String(m).trim())) e.push('En az bir Türkçe anlam gerekli');
  return e;
}

export function buildWord(f, existing = null) {
  const src = f || {};
  const now = new Date().toISOString();
  const word = String(src.word || '').trim();
  const level = String(src.level || 'A2').toUpperCase().trim();
  const id = existing?.id || `u-${level.toLowerCase()}-${word.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
  const obj = {
    id, level, word,
    meanings: toList(src.meanings),
    partOfSpeech: String(src.partOfSpeech ?? existing?.partOfSpeech ?? '').trim().toLowerCase(),
    pronunciation: String(src.pronunciation ?? existing?.pronunciation ?? '').trim(),
    exampleSentence: String(src.exampleSentence ?? existing?.exampleSentence ?? '').trim(),
    exampleTranslation: String(src.exampleTranslation ?? existing?.exampleTranslation ?? '').trim(),
    synonyms: toList(src.synonyms ?? existing?.synonyms),
    antonyms: toList(src.antonyms ?? existing?.antonyms),
    collocations: toList(src.collocations ?? existing?.collocations),
    wordFamily: toList(src.wordFamily ?? existing?.wordFamily),
    category: String(src.category || existing?.category || '').trim() || 'Daily Life',
    alternativeAnswers: toList(src.alternativeAnswers ?? existing?.alternativeAnswers),
    custom: existing ? !!existing.custom : true,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  // Taslak durumu: açıkça belirtilmişse veya 5. aşama için geçerli örnek cümle yoksa taslak olarak işaretlenir
  const ready = !!blankSentence(obj);
  obj.isDraft = src.isDraft === true ? true : !ready;
  return obj;
}

/** Aynı seviye + aynı kelime + ortak anlam => tekrar. */
export function findDuplicate(w, list = state.words, ignoreId = null) {
  const ms = new Set(w.meanings.map(norm));
  return list.find((x) => x.id !== ignoreId && x.level === w.level && norm(x.word) === norm(w.word) && x.meanings.some((m) => ms.has(norm(m))));
}

export async function addWord(f) {
  const w = buildWord(f);
  const errs = validateWord(w);
  if (errs.length) return { ok: false, errors: errs };
  if (findDuplicate(w)) return { ok: false, errors: ['Bu kelime aynı seviye ve anlamla zaten kayıtlı'] };
  await saveData('words', w);
  return { ok: true, word: w, isDraft: w.isDraft, missing: getMissingFields(w) };
}

export async function editWord(id, f) {
  const old = state.wordMap.get(id);
  if (!old) return { ok: false, errors: ['Kelime bulunamadı'] };
  const w = { ...buildWord({ ...old, ...f, isDraft: f?.isDraft }, old), id };
  const errs = validateWord(w);
  if (errs.length) return { ok: false, errors: errs };
  if (findDuplicate(w, state.words, id)) return { ok: false, errors: ['Bu kelime aynı seviye ve anlamla zaten kayıtlı'] };
  await saveData('words', w);
  return { ok: true, word: w, isDraft: w.isDraft, missing: getMissingFields(w) };
}

export async function removeWord(id) {
  const w = state.wordMap.get(id);
  if (!w) return;
  if (!w.custom) await setMeta('deletedIds', [...new Set([...(getMeta('deletedIds', [])), id])]);
  await deleteData('words', id);
  await deleteData('progress', id);
}

/* ---------- Ücretsiz Otomatik Kelime Hazırlama (Modüler Yapı) ---------- */
// Gelecekte isteğe bağlı AI sağlayıcısı registerAutoFillProvider ile bağlanabilir.
// İlk sürüm tamamen ücretsizdir ve yalnızca yerel doğrulanmış veritabanını kullanır; bilgi uydurmaz.
let customAutoFillProvider = null;
export function registerAutoFillProvider(fn) {
  customAutoFillProvider = typeof fn === 'function' ? fn : null;
}

let builtinDictionaryCache = null;
async function loadBuiltinDictionary() {
  if (builtinDictionaryCache) return builtinDictionaryCache;
  const all = [...state.words];
  if (typeof fetch === 'function') {
    for (const lv of LEVELS) {
      try {
        const r = await fetch(`data/${lv.toLowerCase()}.json`);
        if (r.ok) {
          const arr = await r.json();
          for (const w of arr) if (!all.some((x) => x.id === w.id)) all.push(w);
        }
      } catch { /* çevrimdışı veya test ortamı */ }
    }
  }
  builtinDictionaryCache = all;
  return all;
}

/**
 * Girilen İngilizce kelimeyi yerel veritabanında arar.
 * Bulunursa doğrulanmış bilgileri döner; bulunamazsa uydurma veri üretmez ve eksik alanları bildirir.
 */
export async function prepareWordInfo(rawWord, currentFields = {}) {
  const q = norm(rawWord);
  if (!q) {
    return { found: false, data: {}, missing: ['Önce İngilizce kelimeyi girin'], message: 'Lütfen önce İngilizce kelimeyi yazın.' };
  }
  const pool = await loadBuiltinDictionary();
  const match = pool.find((w) => norm(w.word) === q || (w.alternativeAnswers || []).some((a) => norm(a) === q));
  if (match) {
    const data = {
      level: currentFields.level || match.level,
      meanings: currentFields.meanings?.trim() ? toList(currentFields.meanings) : [...(match.meanings || [])],
      partOfSpeech: match.partOfSpeech || '',
      pronunciation: match.pronunciation || '',
      exampleSentence: match.exampleSentence || '',
      exampleTranslation: match.exampleTranslation || '',
      synonyms: [...(match.synonyms || [])],
      antonyms: [...(match.antonyms || [])],
      collocations: [...(match.collocations || [])],
      wordFamily: [...(match.wordFamily || [])],
      category: match.category || currentFields.category || 'Daily Life',
      alternativeAnswers: [...(match.alternativeAnswers || [])],
    };
    const preview = buildWord({ ...currentFields, ...data, word: rawWord });
    const missing = getMissingFields(preview);
    return {
      found: true,
      source: 'local',
      data,
      missing,
      message: 'Kelime yerel veri tabanında bulundu ve doğrulanmış bilgiler dolduruldu.',
    };
  }
  if (customAutoFillProvider) {
    const ext = await customAutoFillProvider(rawWord, currentFields);
    if (ext && ext.found) return ext;
  }
  const preview = buildWord({ ...currentFields, word: rawWord });
  const missing = getMissingFields(preview);
  return {
    found: false,
    source: 'none',
    data: {},
    missing,
    message: 'Bu kelime yerel veri tabanında bulunamadı. Doğrulanmamış bilgi üretilmedi; aşağıdaki eksik alanları kendiniz doldurabilir veya kelimeyi taslak olarak kaydedebilirsiniz.',
  };
}

/** Yerleşik kelimeleri ekler (yalnızca eksik id'ler veya aktifleşen taslaklar; kullanıcı kelimeleri/düzenlemeleri korunur). */
export async function seedBuiltIn(loader) {
  const load = loader || (async (lv) => { const r = await fetch(`data/${lv.toLowerCase()}.json`); if (!r.ok) throw new Error(r.status); return r.json(); });
  const deleted = new Set(getMeta('deletedIds', []));
  const add = [];
  const errors = [];
  for (const lv of LEVELS) {
    try {
      const list = await load(lv);
      for (const w of list) {
        if (deleted.has(w.id)) continue;
        const existing = state.wordMap.get(w.id);
        const ready = isWordReady({ ...w, isDraft: false }) && !w.isDraft;
        if (existing) {
          if (!existing.custom && existing.isDraft && ready) {
            add.push({ ...w, custom: false, isDraft: false });
          }
          continue;
        }
        const errs = validateWord(w);
        if (errs.length) { errors.push(`${w.id}: ${errs[0]}`); continue; }
        add.push({ ...w, custom: false, isDraft: !ready });
      }
    } catch (e) {
      if (!state.words.some((w) => w.level === lv)) errors.push(`${lv} kelime verisi yüklenemedi`);
    }
  }
  if (add.length) await saveMany('words', add);
  return { added: add.length, errors };
}

export function filterWords({ q = '', level = '', category = '', status = '', pos = '' } = {}, progress = state.progress) {
  const s = norm(q);
  return state.words.filter((w) => {
    if (level && w.level !== level) return false;
    if (category && w.category !== category) return false;
    if (pos && w.partOfSpeech !== pos) return false;
    if (status === 'DRAFT') {
      if (isWordReady(w)) return false;
    } else if (status) {
      if (!isWordReady(w) || (progress[w.id]?.currentStatus || 'NEW') !== status) return false;
    }
    if (s && !(norm(w.word).includes(s) || w.meanings.some((m) => norm(m).includes(s)))) return false;
    return true;
  });
}

export { isWordReady };

/* ---------- Karıştırılan kelimeler ---------- */
export const CONFUSING = [
  { title: 'Affect / Effect', note: 'Affect genellikle fiil, effect genellikle isimdir.',
    items: [{ w: 'affect', pos: 'verb', tr: 'etkilemek', ex: 'Stress can affect your sleep.' }, { w: 'effect', pos: 'noun', tr: 'etki, sonuç', ex: 'Exercise has a positive effect on health.' }],
    quiz: [{ s: 'Lack of sleep can ___ your memory.', opts: ['affect', 'effect'], a: 'affect' }, { s: 'The medicine had no ___ on her headache.', opts: ['affect', 'effect'], a: 'effect' }] },
  { title: 'Advice / Advise', note: 'Advice isimdir (tavsiye), advise fiildir (tavsiye etmek).',
    items: [{ w: 'advice', pos: 'noun', tr: 'tavsiye', ex: 'She gave me some good advice.' }, { w: 'advise', pos: 'verb', tr: 'tavsiye etmek', ex: 'I advise you to study early.' }],
    quiz: [{ s: 'Can you give me some ___?', opts: ['advice', 'advise'], a: 'advice' }, { s: 'Doctors ___ people to drink more water.', opts: ['advice', 'advise'], a: 'advise' }] },
  { title: 'Economic / Economical', note: 'Economic ekonomiyle ilgilidir; economical tasarruflu demektir.',
    items: [{ w: 'economic', pos: 'adjective', tr: 'ekonomik (ekonomiyle ilgili)', ex: 'The country faces serious economic problems.' }, { w: 'economical', pos: 'adjective', tr: 'tasarruflu', ex: 'This car is very economical.' }],
    quiz: [{ s: 'The government announced a new ___ policy.', opts: ['economic', 'economical'], a: 'economic' }, { s: 'Small cars are more ___ to run.', opts: ['economic', 'economical'], a: 'economical' }] },
  { title: 'Accept / Except', note: 'Accept kabul etmek; except hariç demektir.',
    items: [{ w: 'accept', pos: 'verb', tr: 'kabul etmek', ex: 'She accepted the job offer.' }, { w: 'except', pos: 'preposition', tr: 'hariç', ex: 'Everyone came except Tom.' }],
    quiz: [{ s: 'I cannot ___ this expensive gift.', opts: ['accept', 'except'], a: 'accept' }, { s: 'All the shops are open ___ on Sunday.', opts: ['accept', 'except'], a: 'except' }] },
  { title: 'Rise / Raise', note: 'Rise nesnesiz fiildir (kendiliğinden yükselmek); raise nesne alır (yükseltmek).',
    items: [{ w: 'rise', pos: 'verb', tr: 'yükselmek', ex: 'Prices rise every year.' }, { w: 'raise', pos: 'verb', tr: 'yükseltmek, kaldırmak', ex: 'Please raise your hand if you know the answer.' }],
    quiz: [{ s: 'The sun ___ in the east.', opts: ['rises', 'raises'], a: 'rises' }, { s: 'Please ___ your hand if you have a question.', opts: ['rise', 'raise'], a: 'raise' }] },
  { title: 'Lose / Loose', note: 'Lose fiildir (kaybetmek); loose sıfattır (gevşek).',
    items: [{ w: 'lose', pos: 'verb', tr: 'kaybetmek', ex: "Don't lose your keys." }, { w: 'loose', pos: 'adjective', tr: 'gevşek, bol', ex: 'These trousers are too loose.' }],
    quiz: [{ s: "Be careful not to ___ your phone.", opts: ['lose', 'loose'], a: 'lose' }, { s: 'The screw is ___, so the shelf is shaking.', opts: ['lose', 'loose'], a: 'loose' }] },
  { title: 'Borrow / Lend', note: 'Borrow ödünç almak; lend ödünç vermektir.',
    items: [{ w: 'borrow', pos: 'verb', tr: 'ödünç almak', ex: 'Can I borrow your pen?' }, { w: 'lend', pos: 'verb', tr: 'ödünç vermek', ex: 'Could you lend me your pen?' }],
    quiz: [{ s: 'Could you ___ me ten pounds?', opts: ['borrow', 'lend'], a: 'lend' }, { s: 'I need to ___ a book from the library.', opts: ['borrow', 'lend'], a: 'borrow' }] },
  { title: 'Than / Then', note: 'Than karşılaştırma için; then "sonra" anlamındadır.',
    items: [{ w: 'than', pos: 'conjunction', tr: '-den daha', ex: 'She is taller than me.' }, { w: 'then', pos: 'adverb', tr: 'sonra, o zaman', ex: 'First eat your dinner, then do your homework.' }],
    quiz: [{ s: 'My brother is older ___ me.', opts: ['than', 'then'], a: 'than' }, { s: 'We had lunch and ___ went for a walk.', opts: ['than', 'then'], a: 'then' }] },
];
