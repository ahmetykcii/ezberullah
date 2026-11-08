// LEXORA — Kelime Defterim (Notebook / Personal Word Lists)
// Kullanıcıların kendi İngilizce kelime listelerini oluşturmasını, tek tek veya toplu kelime eklemesini,
// ve 4 aşamalı özelleştirilebilir öğrenme motoru ile SRS aralıklı tekrar sistemi üzerinden çalışmalarını sağlar.

import { state, saveData, setMeta, getSettings, getProgress, saveProgress } from './storage.js';
import * as E from './engine.js';
import { $, $$, esc, openModal, toast, confirmDialog, speak, ICONS } from './ui.js';
import { prepareWordInfo } from './vocabulary.js';
import { blankSentence, isWordReady } from './engine.js';
import { getCurrentUser } from './auth.js';
import { startSession, resumeSaved, sessionHooks, getStudyGroupRotation, saveStudyGroupRotation } from './learning.js';
import { bumpDaily } from './statistics.js';
import { startMemoryGame, MEMORY_STAGE } from './memory-game.js';
import { syncListPath, removeListPath, ensureListPaths, STOP_SIZE } from './paths.js';
import {
  pathCanvasHtml, openStopDetail, notebookPathSummary, getPreferredNotebookList, setPreferredNotebookList,
  WINDOW_RADIUS, WINDOW_STEP, reduceMotion,
} from './path-ui.js';

/* ---------- Kullanıcı Kimlik Kapsamı (User Scoping) ---------- */
export function getActiveUserId() {
  const u = getCurrentUser();
  return u && u.uid ? u.uid : 'guest';
}

/* ---------- Veri Erişimi (Data Access) ---------- */
export function getAllNotebookLists() {
  return Array.isArray(state.meta?.notebookLists) ? [...state.meta.notebookLists] : [];
}

export function getUserNotebookLists(userId = getActiveUserId()) {
  return getAllNotebookLists().filter((l) => l && l.userId === userId);
}

export async function saveAllNotebookLists(lists) {
  state.meta.notebookLists = lists;
  await saveData('meta', { key: 'notebookLists', value: lists });
  return lists;
}

export function getAllNotebookWords() {
  return Array.isArray(state.meta?.notebookWords) ? [...state.meta.notebookWords] : [];
}

export function getUserNotebookWords(userId = getActiveUserId()) {
  return getAllNotebookWords().filter((w) => w && w.userId === userId);
}

export async function saveAllNotebookWords(words) {
  state.meta.notebookWords = words;
  for (const w of words) {
    if (w && w.id) state.wordMap.set(w.id, w);
  }
  await saveData('meta', { key: 'notebookWords', value: words });
  return words;
}

/* ---------- Liste Yönetimi (List Management) ---------- */
export async function createNotebookList(name, userId = getActiveUserId()) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return { ok: false, error: 'Liste adı boş olamaz.' };
  const all = getAllNotebookLists();
  const userLists = all.filter((l) => l.userId === userId);
  if (userLists.some((l) => l.name.toLowerCase() === trimmed.toLowerCase())) {
    return { ok: false, error: 'Bu isimde bir liste zaten mevcut.' };
  }
  const now = new Date().toISOString();
  const id = `list_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const newList = {
    id,
    userId,
    name: trimmed,
    wordIds: [],
    createdAt: now,
    updatedAt: now,
  };
  all.push(newList);
  await saveAllNotebookLists(all);
  await syncListPath(newList);
  return { ok: true, list: newList };
}

export async function updateNotebookList(listId, { name } = {}) {
  const all = getAllNotebookLists();
  const idx = all.findIndex((l) => l.id === listId);
  if (idx < 0) return { ok: false, error: 'Liste bulunamadı.' };
  const list = all[idx];
  if (name !== undefined) {
    const trimmed = String(name || '').trim();
    if (!trimmed) return { ok: false, error: 'Liste adı boş olamaz.' };
    const userLists = all.filter((l) => l.userId === list.userId && l.id !== listId);
    if (userLists.some((l) => l.name.toLowerCase() === trimmed.toLowerCase())) {
      return { ok: false, error: 'Bu isimde bir listeniz zaten var.' };
    }
    list.name = trimmed;
  }
  list.updatedAt = new Date().toISOString();
  all[idx] = list;
  await saveAllNotebookLists(all);
  return { ok: true, list };
}

export async function deleteNotebookList(listId) {
  const all = getAllNotebookLists();
  const target = all.find((l) => l.id === listId);
  if (!target) return { ok: false, error: 'Liste bulunamadı.' };
  const userId = target.userId;
  const remaining = all.filter((l) => l.id !== listId);
  await saveAllNotebookLists(remaining);
  // v5.0: yalnızca bu listenin öğrenme yolu kaldırılır; diğer listelerin durakları etkilenmez
  await removeListPath(listId);

  // Bu kullanıcının kalan listelerinde geçmeyen kelimeleri temizle
  const otherLists = remaining.filter((l) => l.userId === userId);
  const activeWordIds = new Set(otherLists.flatMap((l) => l.wordIds || []));
  const allWords = getAllNotebookWords();
  const keptWords = allWords.filter((w) => w.userId !== userId || activeWordIds.has(w.id));
  await saveAllNotebookWords(keptWords);

  return { ok: true };
}

/* ---------- Kelime Hazırlama & Zenginleştirme (Word Preparation) ---------- */
export async function buildPersonalWord(rawWord, rawMeanings, userId = getActiveUserId()) {
  const word = String(rawWord || '').trim();
  const meanings = Array.isArray(rawMeanings)
    ? rawMeanings.map((m) => String(m).trim()).filter(Boolean)
    : String(rawMeanings || '').split(/[;,|]/).map((m) => m.trim()).filter(Boolean);

  const cleanWord = word.toLowerCase();
  const id = `nw_${userId}_${cleanWord.replace(/[^a-z0-9]+/g, '-')}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
  const now = new Date().toISOString();

  // 1) Sözlükte bilinen kelime mi kontrol et
  let partOfSpeech = 'other';
  let exampleSentence = '';
  let exampleTranslation = '';
  let synonyms = [];
  let wordFamily = [];
  let collocations = [];
  let alternativeAnswers = [];
  let category = 'Daily Life';

  try {
    const info = await prepareWordInfo(word, { meanings: meanings.join('; ') });
    if (info && info.found && info.data) {
      if (info.data.partOfSpeech) partOfSpeech = info.data.partOfSpeech;
      if (info.data.exampleSentence) exampleSentence = info.data.exampleSentence;
      if (info.data.exampleTranslation) exampleTranslation = info.data.exampleTranslation;
      if (Array.isArray(info.data.synonyms)) synonyms = [...info.data.synonyms];
      if (Array.isArray(info.data.wordFamily)) wordFamily = [...info.data.wordFamily];
      if (Array.isArray(info.data.collocations)) collocations = [...info.data.collocations];
      if (Array.isArray(info.data.alternativeAnswers)) alternativeAnswers = [...info.data.alternativeAnswers];
      if (info.data.category) category = info.data.category;
    }
  } catch {
    /* çevrimdışı fallback */
  }

  // 2) Eğer örnek cümle yoksa veya kelime cümlede geçmiyorsa otomatik geçerli cümle oluştur
  const testCandidate = { word, exampleSentence };
  if (!exampleSentence || !blankSentence(testCandidate)) {
    // Kelimenin türüne göre temiz ve doğal cümle şablonu
    const trSample = meanings[0] || 'kelime';
    const isVerb = meanings.some((m) => /mak$|mek$/i.test(m.trim()));
    if (isVerb) partOfSpeech = 'verb';
    exampleSentence = `I practice using ${word} in my daily English studies.`;
    exampleTranslation = `Günlük İngilizce çalışmalarımda ${word} (${trSample}) kelimesini kullanma pratiği yapıyorum.`;
  }

  const personalWord = {
    id,
    userId,
    word,
    meanings: meanings.length ? meanings : [word],
    partOfSpeech,
    pronunciation: '',
    exampleSentence,
    exampleTranslation,
    synonyms,
    antonyms: [],
    collocations,
    wordFamily,
    alternativeAnswers,
    category,
    isDraft: false,
    isNotebook: true,
    custom: true,
    createdAt: now,
    updatedAt: now,
  };

  return personalWord;
}

/* ---------- Kelime Ekleme & Bağlama (Adding Words) ---------- */
export async function addWordToNotebook({ word, meanings, listId, userId = getActiveUserId() }) {
  const trimmedWord = String(word || '').trim();
  if (!trimmedWord) return { ok: false, error: 'İngilizce kelime boş olamaz.' };
  if (!/^[A-Za-z][A-Za-z '’\-.]*$/.test(trimmedWord)) {
    return { ok: false, error: 'İngilizce kelime yalnızca Latin harfleri içermelidir.' };
  }
  const mList = Array.isArray(meanings)
    ? meanings.map((m) => String(m).trim()).filter(Boolean)
    : String(meanings || '').split(/[;,|]/).map((m) => m.trim()).filter(Boolean);
  if (!mList.length) return { ok: false, error: 'En az bir Türkçe anlam girilmelidir.' };

  const allLists = getAllNotebookLists();
  const list = allLists.find((l) => l.id === listId && l.userId === userId);
  if (!list) return { ok: false, error: 'Hedef liste bulunamadı.' };

  const allWords = getAllNotebookWords();
  const userWords = allWords.filter((w) => w.userId === userId);

  // Çoklu liste & tekil kelime modeli:
  // Eğer kullanıcı bu kelimeyi daha önce başka bir listeye eklediyse, aynı kelime kaydını kullan
  // Böylece öğrenme ilerlemesi ve SRS durumu listeler arasında tekilleşir ve korunur!
  let targetWord = userWords.find((w) => w.word.toLowerCase() === trimmedWord.toLowerCase());
  let isNewWord = false;

  if (targetWord) {
    if (list.wordIds.includes(targetWord.id)) {
      return { ok: false, error: `"${trimmedWord}" kelimesi bu listede zaten mevcut.` };
    }
  } else {
    targetWord = await buildPersonalWord(trimmedWord, mList, userId);
    allWords.push(targetWord);
    isNewWord = true;
  }

  list.wordIds.push(targetWord.id);
  list.updatedAt = new Date().toISOString();

  if (isNewWord) {
    await saveAllNotebookWords(allWords);
  }
  await saveAllNotebookLists(allLists);
  // v5.0: yeni kelime, listenin sabit yolunda son durağın boş kapasitesine veya yeni bir durağa yerleşir
  await syncListPath(list);

  // WordMap'e kaydet (çalıştırıcıların kelimeyi doğrudan bulabilmesi için)
  state.wordMap.set(targetWord.id, targetWord);

  return { ok: true, word: targetWord, list };
}

/* ---------- Toplu Kelime Ayrıştırıcı (Bulk Parser) ---------- */
export function parseBulkWords(rawText, currentListWordIds = [], existingUserWords = []) {
  const lines = String(rawText || '').split(/\r?\n/);
  const results = [];
  const seenInBatch = new Set();
  const existingWordMap = new Map(existingUserWords.map((w) => [w.word.toLowerCase(), w]));
  const currentListSet = new Set(currentListWordIds);

  let lineNum = 0;
  for (const line of lines) {
    lineNum++;
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Ayraç kontrolü: '-' (kısa çizgi), '–' (en-dash), '—' (em-dash), ':', '=', veya sekme (\t)
    let sepIndex = -1;
    let sepLength = 1;
    const match = trimmed.match(/\s*(?:[-–—:=]|\t)\s*/);
    if (match && match.index !== undefined) {
      sepIndex = match.index;
      sepLength = match[0].length;
    }

    if (sepIndex < 0) {
      results.push({
        lineNum,
        rawLine: trimmed,
        word: trimmed,
        meanings: '',
        status: 'error',
        message: 'Ayraç bulunamadı (Örn: word - anlam)',
      });
      continue;
    }

    const wordPart = trimmed.slice(0, sepIndex).trim();
    const meaningPart = trimmed.slice(sepIndex + sepLength).trim();

    if (!wordPart || !meaningPart) {
      results.push({
        lineNum,
        rawLine: trimmed,
        word: wordPart,
        meanings: meaningPart,
        status: 'error',
        message: !wordPart ? 'İngilizce kelime boş' : 'Türkçe anlam boş',
      });
      continue;
    }

    if (!/^[A-Za-z][A-Za-z '’\-.]*$/.test(wordPart)) {
      results.push({
        lineNum,
        rawLine: trimmed,
        word: wordPart,
        meanings: meaningPart,
        status: 'error',
        message: 'İngilizce kelime yalnızca harf içermeli',
      });
      continue;
    }

    const normKey = wordPart.toLowerCase();

    // Metin içi tekrar kontrolü
    if (seenInBatch.has(normKey)) {
      results.push({
        lineNum,
        rawLine: trimmed,
        word: wordPart,
        meanings: meaningPart,
        status: 'dup',
        message: 'Metin içinde tekrar eden kelime',
      });
      continue;
    }
    seenInBatch.add(normKey);

    // Mevcut listede var mı kontrolü
    const existingWord = existingWordMap.get(normKey);
    if (existingWord && currentListSet.has(existingWord.id)) {
      results.push({
        lineNum,
        rawLine: trimmed,
        word: wordPart,
        meanings: meaningPart,
        status: 'dup',
        message: 'Bu kelime bu listede zaten mevcut',
      });
      continue;
    }

    results.push({
      lineNum,
      rawLine: trimmed,
      word: wordPart,
      meanings: meaningPart,
      status: 'ok',
      message: existingWord ? 'Hazır (Mevcut kelime eşleştirilecek)' : 'Hazır',
    });
  }

  return results;
}

/* ---------- Toplu Kelime Ekleme (Bulk Add) ---------- */
export async function bulkAddWordsToNotebook({ items, listId, userId = getActiveUserId() }) {
  if (!Array.isArray(items) || !items.length) {
    return { ok: false, error: 'Eklenecek kelime bulunamadı.' };
  }

  const allLists = getAllNotebookLists();
  const list = allLists.find((l) => l.id === listId && l.userId === userId);
  if (!list) return { ok: false, error: 'Hedef liste bulunamadı.' };

  const allWords = getAllNotebookWords();
  const userWords = allWords.filter((w) => w.userId === userId);
  const userWordMap = new Map(userWords.map((w) => [w.word.toLowerCase(), w]));

  const addedWords = [];
  let newWordsCount = 0;

  for (const item of items) {
    if (item.status === 'error' || item.status === 'dup') continue;
    const wStr = String(item.word || '').trim();
    const mStr = String(item.meanings || '').trim();
    if (!wStr || !mStr) continue;

    const normKey = wStr.toLowerCase();
    let wordObj = userWordMap.get(normKey);

    if (!wordObj) {
      wordObj = await buildPersonalWord(wStr, mStr, userId);
      allWords.push(wordObj);
      userWordMap.set(normKey, wordObj);
      newWordsCount++;
    }

    if (!list.wordIds.includes(wordObj.id)) {
      list.wordIds.push(wordObj.id);
      addedWords.push(wordObj);
      state.wordMap.set(wordObj.id, wordObj);
    }
  }

  list.updatedAt = new Date().toISOString();

  if (newWordsCount > 0) {
    await saveAllNotebookWords(allWords);
  }
  await saveAllNotebookLists(allLists);
  await syncListPath(list);

  return { ok: true, addedCount: addedWords.length, list };
}

/* ---------- Kelime Silme (Remove Word from List) ---------- */
export async function removeWordFromNotebookList(listId, wordId, userId = getActiveUserId()) {
  const allLists = getAllNotebookLists();
  const list = allLists.find((l) => l.id === listId && l.userId === userId);
  if (!list) return { ok: false, error: 'Liste bulunamadı.' };

  list.wordIds = (list.wordIds || []).filter((id) => id !== wordId);
  list.updatedAt = new Date().toISOString();
  await saveAllNotebookLists(allLists);
  // v5.0: kelime yalnızca kendi durağından çıkarılır; diğer duraklar geriye kaydırılmaz
  await syncListPath(list);

  // Bu kelime kullanıcının başka bir listesinde var mı?
  const otherLists = allLists.filter((l) => l.userId === userId && l.id !== listId);
  const stillReferenced = otherLists.some((l) => (l.wordIds || []).includes(wordId));

  if (!stillReferenced) {
    const allWords = getAllNotebookWords();
    const keptWords = allWords.filter((w) => w.id !== wordId);
    await saveAllNotebookWords(keptWords);
  }

  return { ok: true };
}

/* ---------- İlerleme & İstatistik Hesaplamaları (Progress & Stats) ---------- */
export function getListStats(listId) {
  const allLists = getAllNotebookLists();
  const list = allLists.find((l) => l.id === listId);
  if (!list) return { total: 0, completed: 0, due: 0, review: 0, mastered: 0, completion: 0, avgMastery: 0, words: [] };

  const wordIds = list.wordIds || [];
  const words = [];
  let completed = 0;
  let due = 0;
  let review = 0;
  let mastered = 0;
  let totalMastery = 0;

  const now = Date.now();
  for (const wid of wordIds) {
    const w = state.wordMap.get(wid);
    if (!w) continue;
    words.push(w);
    const p = getProgress(wid);
    if (p.learningComplete) completed++;
    if (E.isMastered(p)) mastered++;
    if (p.currentStatus === 'REVIEW') review++;
    if (E.isDue(p, now)) due++;
    totalMastery += p.masteryScore || 0;
  }

  const total = words.length;
  const completion = total ? Math.round((completed / total) * 100) : 0;
  const avgMastery = total ? Math.round(totalMastery / total) : 0;

  return { total, completed, due, review, mastered, completion, avgMastery, words };
}

export function getUserNotebookSummary(userId = getActiveUserId()) {
  const lists = getUserNotebookLists(userId);
  const words = getUserNotebookWords(userId);
  const now = Date.now();

  let completed = 0;
  let due = 0;
  let review = 0;
  let mastered = 0;

  for (const w of words) {
    const p = getProgress(w.id);
    if (p.learningComplete) completed++;
    if (E.isMastered(p)) mastered++;
    if (p.currentStatus === 'REVIEW') review++;
    if (E.isDue(p, now)) due++;
  }

  const total = words.length;
  const completion = total ? Math.round((completed / total) * 100) : 0;

  return {
    listCount: lists.length,
    totalWords: total,
    completedWords: completed,
    dueWords: due,
    reviewWords: review,
    masteredWords: mastered,
    completion,
  };
}

/* ---------- Çalışma Aşaması Seçenekleri (Stage Selection Config) ---------- */
// 1–4: standart öğrenme aşamaları (hazır A2/B1/B2 sistemiyle aynı motor).
// 5: Eşini Bul — yalnızca Kelime Defterim'e özgü hafıza oyunu; varsayılan olarak SEÇİLİ DEĞİL.
export const NOTEBOOK_STAGE_OPTIONS = [
  {
    stage: 1,
    type: 'card',
    icon: '📖',
    title: 'Kelimeyi Öğren',
    desc: 'Kelime kartı, Türkçe anlamı ve örnek cümlesi',
    defaultSelected: true,
  },
  {
    stage: 2,
    type: 'mc',
    icon: '🎯',
    title: 'Çoktan Seçmeli Test',
    desc: 'Doğru Türkçe anlamı seçenekler arasından bulma',
    defaultSelected: true,
  },
  {
    stage: 3,
    type: 'typing',
    icon: '✍️',
    title: 'İngilizce Kelimeyi Yaz',
    desc: 'Türkçe anlamı verilen kelimenin İngilizcesini yazma',
    defaultSelected: true,
  },
  {
    stage: 4,
    type: 'missing',
    icon: '🧩',
    title: 'Eksik Harfleri Tamamla',
    desc: 'İngilizce kelimedeki eksik harfleri tamamlama',
    defaultSelected: true,
  },
  {
    stage: 5,
    type: 'match',
    icon: '🧠',
    title: 'Eşini Bul — Hafıza Oyunu',
    desc: 'İngilizce kelimeleri Türkçe anlamlarıyla kapalı kartlar arasında eşleştir',
    defaultSelected: false,
  },
];

export const NOTEBOOK_DEFAULT_STAGES = NOTEBOOK_STAGE_OPTIONS.filter((o) => o.defaultSelected).map((o) => o.stage);

/**
 * Kelime Defterim aşama ve grup büyüklüğü seçimini doğrular.
 * Dönüş: { ok, stages (1–4 öğrenme aşamaları), includeMatch (5. aşama seçili mi), all (tüm seçim), groupSize, error }
 */
export function resolveNotebookStages(options) {
  let raw;
  let rawGroupSize = E.DEFAULT_GROUP_SIZE;
  if (options === undefined || options === null) {
    raw = [1, 2, 3, 4];
  } else if (Array.isArray(options)) {
    raw = options;
  } else {
    raw = options.stages !== undefined && options.stages !== null ? options.stages : [1, 2, 3, 4];
    if (options.groupSize !== undefined && options.groupSize !== null) {
      rawGroupSize = options.groupSize;
    }
  }
  const groupSize = E.normalizeGroupSize(rawGroupSize);
  if (!Array.isArray(raw)) {
    return { ok: false, stages: [], includeMatch: false, all: [], groupSize, error: 'En az bir çalışma aşaması seçmelisiniz.' };
  }
  const includeMatch = raw.map(Number).includes(MEMORY_STAGE);
  const learnStages = E.normalizeSelectedStages(raw);
  if (!learnStages.length && !includeMatch) {
    return { ok: false, stages: [], includeMatch: false, all: [], groupSize, error: 'En az bir çalışma aşaması seçmelisiniz.' };
  }
  return {
    ok: true,
    stages: learnStages,
    includeMatch,
    all: includeMatch ? [...learnStages, MEMORY_STAGE] : learnStages,
    groupSize,
    error: null,
  };
}
const resolveRequestedStages = resolveNotebookStages;

const isUnknownCandidate = (w) => {
  const p = getProgress(w.id);
  return !p.learningComplete || p.currentStatus === 'REVIEW' || (p.masteryScore || 0) < 60;
};

/** Eşini Bul için GÜNCEL kelime kaynağı (her turda yeniden okunur → ekleme/düzenleme/silme anında yansır). */
export function memoryWordsGetter(mode, listId, userId = getActiveUserId()) {
  if (mode === 'list') return () => getListStats(listId).words.filter((w) => w && w.userId === userId);
  if (mode === 'unknown') return () => getUserNotebookWords(userId).filter(isUnknownCandidate);
  return () => getUserNotebookWords(userId);
}

function notebookScopeKey(mode, listId, userId) {
  return `nb:${userId}:${mode === 'list' ? `list:${listId}` : mode}`;
}

export async function selectNotebookStudyGroup(words, { userId = getActiveUserId(), mode = 'list', listId = null, groupSize = E.DEFAULT_GROUP_SIZE, explicitWordIds = null } = {}) {
  const normSize = E.normalizeGroupSize(groupSize);
  const scopeKey = notebookScopeKey(mode, listId, userId);
  if (Array.isArray(explicitWordIds) && explicitWordIds.length) {
    const allowed = new Set(explicitWordIds);
    const byId = new Map((Array.isArray(words) ? words : []).filter((w) => w && allowed.has(w.id)).map((w) => [w.id, w]));
    const batch = explicitWordIds.map((id) => byId.get(id)).filter(Boolean);
    return { batch, groupSize: normSize, scopeKey };
  }
  const seenWordIds = getStudyGroupRotation(scopeKey);
  const group = E.selectStudyGroup(words, state.progress, normSize, {
    seenWordIds,
    allowCompletedFallback: true,
  });
  if (group.batch.length) {
    await saveStudyGroupRotation(scopeKey, group.nextSeenIds);
  }
  return { ...group, groupSize: normSize, scopeKey };
}

function restartNotebookStudy({ mode = 'list', listId = null, userId = getActiveUserId(), stages = [1, 2, 3, 4], groupSize = E.DEFAULT_GROUP_SIZE, explicitWordIds = null } = {}) {
  const opts = { stages, groupSize, explicitWordIds };
  if (mode === 'all') return startStudyAll(userId, opts);
  if (mode === 'unknown') return startStudyUnknown(userId, opts);
  return startStudyList(listId, opts);
}

function memoryContext(mode, listId, userId, stageCount, fromSession, extra = {}) {
  const list = mode === 'list' ? getAllNotebookLists().find((l) => l.id === listId) : null;
  const title = list ? list.name : mode === 'unknown' ? 'Zorlandığım Kelimeler' : 'Tüm Kelimelerim';
  return {
    getWords: memoryWordsGetter(mode, listId, userId),
    userId,
    scopeKey: mode === 'list' ? `list:${listId}` : mode,
    title,
    stageCount,
    fromSession,
    ...extra,
  };
}

/**
 * Kelime Defterim Hafıza Oyununu başlatır.
 * - Değerlendirme aşamalı bir oturumdan gelindiyse (hasEvalStages: true), yalnızca o grupta tüm seçili değerlendirme
 *   aşamalarını hatasız tamamlayan kelimeler (eligibleWordIds) kullanılır.
 * - Yalnızca Eşini Bul (veya Kelimeyi Öğren + Eşini Bul) seçildiyse seçilen çalışma grubunun kelimeleri kullanılır.
 * - SRS ilerlemesi hiçbir koşulda değişmez.
 */
export async function startNotebookMemoryGame({
  mode = 'list',
  listId = null,
  userId = getActiveUserId(),
  priorityIds = [],
  eligibleWordIds = null,
  failedWordIds = [],
  hasEvalStages = false,
  groupSize = E.DEFAULT_GROUP_SIZE,
  allStages = [MEMORY_STAGE],
  stageCount = 1,
  fromSession = false,
  pathStop = null,
} = {}) {
  const normSize = E.normalizeGroupSize(groupSize);
  const res = await startMemoryGame(
    memoryContext(mode, listId, userId, stageCount, fromSession, {
      priorityIds,
      eligibleWordIds,
      failedWordIds,
      hasEvalStages,
      groupSize: normSize,
      onRetryFailed: async (fIds) => {
        const retryIds = Array.isArray(fIds) && fIds.length ? fIds : failedWordIds;
        await restartNotebookStudy({ mode, listId, userId, stages: allStages, groupSize: normSize, explicitWordIds: retryIds });
      },
      onNextGroup: async () => {
        // v5.0: Yolum durağından başlatılan çalışmalarda genel grup rotasyonuna geçilmez; yola dönülür
        if (pathStop) { if (typeof location !== 'undefined') location.hash = '#/path'; return; }
        await restartNotebookStudy({ mode, listId, userId, stages: allStages, groupSize: normSize });
      },
    })
  );
  return res.ok;
}

// Diğer aşamalarla birlikte seçildiyse: öğrenme oturumu bittiğinde yalnızca o grupta hatasız bilinen kelimelerle oyun başlar.
sessionHooks.afterLearn = async (sess) => {
  const m = sess.params?.matchAfter || {};
  const evalSummary = E.computeGroupEvalSummary({
    groupWordIds: sess.params?.groupWordIds || [...new Set((sess.items || []).map((it) => it.wordId))],
    selectedStages: sess.params?.selectedStages || [],
    results: sess.results || [],
    evalState: sess.params?.groupEval || null,
  });
  await startNotebookMemoryGame({
    mode: m.mode || sess.params?.mode || 'list',
    listId: m.listId ?? sess.params?.listId ?? null,
    userId: m.userId || sess.params?.userId || getActiveUserId(),
    priorityIds: evalSummary.eligibleWordIds,
    eligibleWordIds: evalSummary.eligibleWordIds,
    failedWordIds: evalSummary.failedWordIds,
    hasEvalStages: evalSummary.hasEvalStages,
    groupSize: m.groupSize || sess.params?.groupSize || E.DEFAULT_GROUP_SIZE,
    allStages: m.allStages || [...(sess.params?.selectedStages || []), MEMORY_STAGE],
    stageCount: m.stageCount || ((sess.params?.selectedStages?.length || 0) + 1),
    fromSession: true,
    pathStop: m.pathStop || sess.params?.pathStop || null,
  });
};

sessionHooks.startNextNotebookGroup = async (params = {}) => {
  await restartNotebookStudy({
    mode: params.mode || 'list',
    listId: params.listId || null,
    userId: params.userId || getActiveUserId(),
    stages: params.selectedStages || [1, 2, 3, 4],
    groupSize: params.groupSize || E.DEFAULT_GROUP_SIZE,
  });
};

function matchAfterParam(stageCheck, mode, listId, userId, pathStop = null) {
  return stageCheck.includeMatch
    ? {
        mode,
        listId,
        userId,
        groupSize: stageCheck.groupSize,
        allStages: stageCheck.all,
        stageCount: stageCheck.all.length,
        pathStop,
      }
    : null;
}

/* ---------- Çalışma Seçenekleri (Study Options) ---------- */

/** 1) Bu listeyi çalış */
export async function startStudyList(listId, options = null) {
  const stageCheck = resolveRequestedStages(options);
  if (!stageCheck.ok) {
    toast(stageCheck.error || 'En az bir çalışma aşaması seçmelisiniz.', 'error');
    return false;
  }
  const selectedStages = stageCheck.stages;
  const groupSize = stageCheck.groupSize;

  const stats = getListStats(listId);
  const allLists = getAllNotebookLists();
  const list = allLists.find((l) => l.id === listId);
  if (!list || !stats.words.length) {
    toast('Bu listede henüz kelime yok. Lütfen önce kelime ekleyin.');
    return false;
  }

  const userId = list.userId;
  const group = await selectNotebookStudyGroup(stats.words, {
    userId,
    mode: 'list',
    listId: list.id,
    groupSize,
    explicitWordIds: options?.explicitWordIds || null,
  });
  const groupWordIds = group.batch.map((w) => w.id);
  // v5.0: Yolum durağından gelindiyse kelime havuzu yalnızca o durağın kelimeleridir (explicitWordIds)
  const pathStop = options?.pathStop && typeof options.pathStop === 'object' ? { ...options.pathStop } : null;
  if (!groupWordIds.length) {
    toast('Bu çalışma için kelime bulunamadı.', 'error');
    return false;
  }

  // Yalnızca Eşini Bul (5. aşama) seçildiyse: değerlendirme aşaması yoktur; seçilen çalışma grubundaki kelimelerle doğrudan oyun başlar
  if (!selectedStages.length) {
    return startNotebookMemoryGame({
      mode: 'list',
      listId: list.id,
      userId,
      priorityIds: groupWordIds,
      eligibleWordIds: groupWordIds,
      hasEvalStages: false,
      groupSize,
      allStages: [MEMORY_STAGE],
      stageCount: 1,
      fromSession: false,
      pathStop,
    });
  }

  const items = E.learnItems(group.batch, state.progress, Math.random, selectedStages);
  if (!items.length) {
    toast('Seçilen aşamalar için çalışma öğesi oluşturulamadı.', 'error');
    return false;
  }

  await startSession({
    kind: 'learn',
    title: pathStop
      ? `${list.name} — Durak ${pathStop.number || ''} (${group.batch.length} Kelime)`
      : `${list.name} — Kelime Öğren (${group.batch.length} Kelime)`,
    items,
    params: {
      isNotebook: true,
      listId: list.id,
      mode: 'list',
      userId,
      groupSize,
      groupWordIds,
      selectedStages,
      groupEval: E.createGroupEvaluation(groupWordIds, selectedStages),
      matchAfter: matchAfterParam(stageCheck, 'list', list.id, userId, pathStop),
      ...(pathStop ? { pathStop } : {}),
    },
  });
  return true;
}

/** 2) Bütün kişisel kelimelerimi çalış */
export async function startStudyAll(userId = getActiveUserId(), options = null) {
  const stageCheck = resolveRequestedStages(options);
  if (!stageCheck.ok) {
    toast(stageCheck.error || 'En az bir çalışma aşaması seçmelisiniz.', 'error');
    return false;
  }
  const selectedStages = stageCheck.stages;
  const groupSize = stageCheck.groupSize;

  const words = getUserNotebookWords(userId);
  if (!words.length) {
    toast('Henüz kişisel kelimeniz bulunmuyor. Önce bir liste oluşturup kelime ekleyin.');
    return false;
  }

  const group = await selectNotebookStudyGroup(words, {
    userId,
    mode: 'all',
    groupSize,
    explicitWordIds: options?.explicitWordIds || null,
  });
  const groupWordIds = group.batch.map((w) => w.id);

  if (!selectedStages.length) {
    return startNotebookMemoryGame({
      mode: 'all',
      userId,
      priorityIds: groupWordIds,
      eligibleWordIds: groupWordIds,
      hasEvalStages: false,
      groupSize,
      allStages: [MEMORY_STAGE],
      stageCount: 1,
      fromSession: false,
    });
  }

  await startSession({
    kind: 'learn',
    title: `Tüm Kelimelerim — Kelime Öğren (${group.batch.length} Kelime)`,
    items: E.learnItems(group.batch, state.progress, Math.random, selectedStages),
    params: {
      isNotebook: true,
      mode: 'all',
      userId,
      groupSize,
      groupWordIds,
      selectedStages,
      groupEval: E.createGroupEvaluation(groupWordIds, selectedStages),
      matchAfter: matchAfterParam(stageCheck, 'all', null, userId),
    },
  });
  return true;
}

/** 3) Yalnızca bilmediklerimi çalış */
export async function startStudyUnknown(userId = getActiveUserId(), options = null) {
  const stageCheck = resolveRequestedStages(options);
  if (!stageCheck.ok) {
    toast(stageCheck.error || 'En az bir çalışma aşaması seçmelisiniz.', 'error');
    return false;
  }
  const selectedStages = stageCheck.stages;
  const groupSize = stageCheck.groupSize;

  const words = getUserNotebookWords(userId);
  if (!words.length) {
    toast('Henüz kişisel kelimeniz bulunmuyor.');
    return false;
  }

  // Henüz öğrenilmemiş, hata yapılmış (REVIEW) veya hakimiyet puanı düşük olanlar
  const candidates = words.filter(isUnknownCandidate);

  if (!candidates.length) {
    toast('Tebrikler! Şu an zorlandığınız veya bilmediğiniz kişisel bir kelime bulunmuyor. 🎉', 'success');
    return false;
  }

  const group = await selectNotebookStudyGroup(candidates, {
    userId,
    mode: 'unknown',
    groupSize,
    explicitWordIds: options?.explicitWordIds || null,
  });
  const groupWordIds = group.batch.map((w) => w.id);

  if (!selectedStages.length) {
    return startNotebookMemoryGame({
      mode: 'unknown',
      userId,
      priorityIds: groupWordIds,
      eligibleWordIds: groupWordIds,
      hasEvalStages: false,
      groupSize,
      allStages: [MEMORY_STAGE],
      stageCount: 1,
      fromSession: false,
    });
  }

  await startSession({
    kind: 'learn',
    title: `Zorlandığım Kelimeler — ${stageCheck.all.length} Aşama (${group.batch.length} Kelime)`,
    items: E.learnItems(group.batch, state.progress, Math.random, selectedStages),
    params: {
      isNotebook: true,
      mode: 'unknown',
      userId,
      groupSize,
      groupWordIds,
      selectedStages,
      groupEval: E.createGroupEvaluation(groupWordIds, selectedStages),
      matchAfter: matchAfterParam(stageCheck, 'unknown', null, userId),
    },
  });
  return true;
}

/** 4) Tekrar zamanı gelenleri çalış (SRS) */
export async function startStudyDue(userId = getActiveUserId()) {
  const words = getUserNotebookWords(userId);
  if (!words.length) {
    toast('Henüz kişisel kelimeniz bulunmuyor.');
    return false;
  }

  const now = Date.now();
  const dueWords = words.filter((w) => E.isDue(getProgress(w.id), now));

  if (!dueWords.length) {
    toast('Harika! Şu an aralıklı tekrar (SRS) zamanı gelen bir kelimeniz yok. 🎉', 'success');
    return false;
  }

  const items = dueWords.map((w) => ({
    wordId: w.id,
    type: E.reviewType(getProgress(w.id)),
  }));

  await startSession({
    kind: 'review',
    title: 'Kişisel Kelimeler — Akıllı Tekrar (SRS)',
    items: E.shuffle(items).slice(0, 20),
    params: { isNotebook: true, mode: 'due' },
  });
  return true;
}

/* ---------- Arayüz Modalları (UI Modals) ---------- */

/** Çalışma Aşamalarını ve Grup Büyüklüğünü Seç Modalı (Kelime Defterim v4.6.1) */
export function openStageSelectionModal({ listId = null, mode = 'list', userId = getActiveUserId(), defaultGroupSize = E.DEFAULT_GROUP_SIZE, onStart = null, pathStop = null } = {}) {
  let contextLabel = 'Seçili kelimelerin';
  // v5.0: Yolum durağı modu — grup büyüklüğü sorulmaz; durağın TÜM kelimeleri çalışılır (10 kelimelik durak kapasitesi ≠ 5/10/15/20 grup seçimi)
  const stopIds = pathStop && Array.isArray(pathStop.wordIds) ? pathStop.wordIds.filter((id) => state.wordMap.has(id)) : null;
  if (pathStop && mode === 'list' && listId) {
    const list = getAllNotebookLists().find((l) => l.id === listId);
    if (!list || !stopIds || !stopIds.length) {
      toast('Bu durakta çalışılacak kelime bulunamadı.');
      return false;
    }
    contextLabel = `<b>${esc(list.name)} · Durak ${esc(pathStop.number || '')}</b> (${stopIds.length} kelimenin tamamı)`;
  } else if (mode === 'list' && listId) {
    const stats = getListStats(listId);
    const list = getAllNotebookLists().find((l) => l.id === listId);
    if (!list || !stats.words.length) {
      toast('Bu listede henüz kelime yok. Lütfen önce kelime ekleyin.');
      return false;
    }
    contextLabel = `<b>${esc(list.name)}</b> (${stats.total} kelime)`;
  } else if (mode === 'all') {
    const words = getUserNotebookWords(userId);
    if (!words.length) {
      toast('Henüz kişisel kelimeniz bulunmuyor. Önce bir liste oluşturup kelime ekleyin.');
      return false;
    }
    contextLabel = `<b>Tüm Kişisel Kelimelerim</b> (${words.length} kelime)`;
  } else if (mode === 'unknown') {
    const words = getUserNotebookWords(userId);
    if (!words.length) {
      toast('Henüz kişisel kelimeniz bulunmuyor.');
      return false;
    }
    const candidates = words.filter((w) => {
      const p = getProgress(w.id);
      return !p.learningComplete || p.currentStatus === 'REVIEW' || (p.masteryScore || 0) < 60;
    });
    if (!candidates.length) {
      toast('Tebrikler! Şu an zorlandığınız veya bilmediğiniz kişisel bir kelime bulunmuyor. 🎉', 'success');
      return false;
    }
    contextLabel = `<b>Yalnızca Bilmediklerim</b> (${candidates.length} kelime)`;
  }

  // Varsayılan: 5 kelime grup büyüklüğü; ilk 4 aşama seçili; 5. aşama (Eşini Bul) seçili DEĞİL
  let chosenGroupSize = E.normalizeGroupSize(defaultGroupSize);
  const selected = new Set(NOTEBOOK_DEFAULT_STAGES);
  const TOTAL_OPTIONS = NOTEBOOK_STAGE_OPTIONS.length;

  const sizeButtonsHtml = E.GROUP_SIZES.map((sz) => `
    <button type="button" class="nb-size-option ${sz === chosenGroupSize ? 'active' : ''}" data-group-size="${sz}" aria-pressed="${sz === chosenGroupSize}">
      <b>${sz} kelime</b>
    </button>
  `).join('');

  const cardsHtml = NOTEBOOK_STAGE_OPTIONS.map((opt) => `
    <label class="nb-stage-card ${opt.defaultSelected ? 'active' : ''} ${opt.stage === MEMORY_STAGE ? 'nb-stage-game' : ''}" data-stage-card="${opt.stage}">
      <input type="checkbox" class="nb-stage-check" data-stage-input="${opt.stage}" value="${opt.stage}" ${opt.defaultSelected ? 'checked' : ''}>
      <span class="nb-stage-ic" aria-hidden="true">${opt.icon}</span>
      <span class="nb-stage-info">
        <span class="nb-stage-head">
          <b class="nb-stage-title">${esc(opt.title)}</b>
          <span class="nb-stage-step">${opt.stage}. Aşama</span>
        </span>
        <span class="nb-stage-desc muted small">${esc(opt.desc)}</span>
      </span>
      <span class="nb-stage-box" aria-hidden="true">✓</span>
    </label>
  `).join('');

  openModal({
    title: 'Çalışma Aşamalarını Seç',
    html: `
      <div class="nb-stage-modal">
        <p class="muted small nb-stage-sub">${contextLabel} için çalışma grubunu ve uygulanacak aşamaları seçin.</p>

        <div class="nb-group-section" ${stopIds ? 'hidden' : ''}>
          <div class="nb-group-head">
            <span class="nb-group-question"><b>Kaç kelimelik gruplarla çalışmak istiyorsun?</b></span>
            <span class="nb-group-badge" id="nb-group-size-label">Grup Büyüklüğü: ${chosenGroupSize} kelime</span>
          </div>
          <div class="nb-size-grid compact" role="radiogroup" aria-label="Grup Büyüklüğü">
            ${sizeButtonsHtml}
          </div>
        </div>

        <div class="nb-stage-toolbar">
          <span class="nb-stage-counter" id="nb-stage-counter" aria-live="polite">${selected.size} / ${TOTAL_OPTIONS} aşama seçili</span>
          <button type="button" class="text-btn" id="nb-stage-select-all">Tümünü Seç</button>
        </div>
        <div class="nb-stage-grid" role="group" aria-label="Çalışma Aşamaları">
          ${cardsHtml}
        </div>
        <p class="muted small nb-stage-hint">🧠 Eşini Bul yalnızca Kelime Defterim'e özeldir. Diğer aşamalarla seçilirse o grupta hatasız tamamladığın kelimelerle oynanır; tek başına seçilirse doğrudan seçilen kelime grubuyla başlar.</p>
        <div class="err small" id="nb-stage-err" role="alert"></div>
        <div class="nb-stage-actions">
          <button type="button" class="btn ghost" data-x>Vazgeç</button>
          <button type="button" class="btn primary xl" id="nb-stage-start">Çalışmaya Başla</button>
        </div>
      </div>
    `,
    onMount(b, api) {
      $('[data-x]', b).onclick = api.close;
      const counterEl = $('#nb-stage-counter', b);
      const sizeLabelEl = $('#nb-group-size-label', b);
      const selectAllBtn = $('#nb-stage-select-all', b);
      const errEl = $('#nb-stage-err', b);
      const startBtn = $('#nb-stage-start', b);
      const inputs = $$('[data-stage-input]', b);
      const sizeBtns = $$('[data-group-size]', b);

      const syncSizeUI = () => {
        if (sizeLabelEl) sizeLabelEl.textContent = `Grup Büyüklüğü: ${chosenGroupSize} kelime`;
        sizeBtns.forEach((btn) => {
          const on = Number(btn.dataset.groupSize) === chosenGroupSize;
          btn.classList.toggle('active', on);
          btn.setAttribute('aria-pressed', String(on));
        });
      };

      sizeBtns.forEach((btn) => {
        btn.onclick = () => {
          chosenGroupSize = E.normalizeGroupSize(btn.dataset.groupSize);
          syncSizeUI();
        };
      });

      const syncUI = () => {
        const count = selected.size;
        counterEl.textContent = `${count} / ${TOTAL_OPTIONS} aşama seçili`;
        inputs.forEach((inp) => {
          const st = Number(inp.dataset.stageInput);
          const on = selected.has(st);
          inp.checked = on;
          const card = inp.closest('[data-stage-card]');
          if (card) card.classList.toggle('active', on);
        });
        if (count === 0) {
          startBtn.disabled = true;
          errEl.textContent = 'En az bir aşama seçilmeden çalışma başlatılamaz.';
        } else {
          startBtn.disabled = false;
          errEl.textContent = '';
        }
        selectAllBtn.textContent = count === TOTAL_OPTIONS ? 'Tümünü Seç ✓' : 'Tümünü Seç';
      };

      inputs.forEach((inp) => {
        inp.onchange = () => {
          const st = Number(inp.dataset.stageInput);
          if (inp.checked) selected.add(st);
          else selected.delete(st);
          syncUI();
        };
      });

      selectAllBtn.onclick = () => {
        NOTEBOOK_STAGE_OPTIONS.forEach((o) => selected.add(o.stage));
        syncUI();
      };

      startBtn.onclick = async () => {
        const check = resolveNotebookStages({ stages: [...selected], groupSize: chosenGroupSize });
        if (!check.ok) {
          errEl.textContent = check.error;
          startBtn.disabled = true;
          return;
        }
        const stages = check.all; // 1–4 öğrenme aşamaları + (seçildiyse) 5. aşama Eşini Bul
        const groupSize = check.groupSize;
        api.close();
        if (stopIds) {
          await startStudyList(listId, {
            stages,
            groupSize: E.normalizeGroupSize(stopIds.length),
            explicitWordIds: stopIds,
            pathStop: { listId, stopId: pathStop.stopId || null, number: pathStop.number || null, originHash: pathStop.originHash || '' },
          });
          return;
        }
        if (typeof onStart === 'function') {
          await onStart(stages, groupSize);
          return;
        }
        if (mode === 'all') {
          await startStudyAll(userId, { stages, groupSize });
        } else if (mode === 'unknown') {
          await startStudyUnknown(userId, { stages, groupSize });
        } else {
          await startStudyList(listId, { stages, groupSize });
        }
      };

      syncSizeUI();
      syncUI();
    },
  });
  return true;
}

/** Liste Oluşturma / Düzenleme Modalı */
export function openListModal(existingList = null, onSaved = () => {}) {
  const isEdit = Boolean(existingList && existingList.id);
  openModal({
    title: isEdit ? 'Listeyi Düzenle' : 'Yeni Kelime Listesi',
    html: `
      <form id="nb-list-form" class="grid form" autocomplete="off">
        <label>Liste Adı *
          <input class="input" id="nb-list-name" required placeholder="Örn: Unit 5 - Education" value="${esc(existingList?.name || '')}">
        </label>
        <div class="err span2" id="nb-list-err" role="alert"></div>
        <div class="row end span2 gap">
          <button type="button" class="btn ghost" data-x>Vazgeç</button>
          <button type="submit" class="btn primary">${isEdit ? 'Güncelle' : 'Oluştur'}</button>
        </div>
      </form>
    `,
    onMount(b, api) {
      $('[data-x]', b).onclick = api.close;
      const inp = $('#nb-list-name', b);
      inp.focus();
      $('#nb-list-form', b).onsubmit = async (e) => {
        e.preventDefault();
        const errEl = $('#nb-list-err', b);
        errEl.textContent = '';
        const nameVal = inp.value.trim();
        const res = isEdit
          ? await updateNotebookList(existingList.id, { name: nameVal })
          : await createNotebookList(nameVal);

        if (!res.ok) {
          errEl.textContent = res.error;
          return;
        }
        api.close();
        toast(isEdit ? 'Liste adı güncellendi.' : `"${esc(nameVal)}" listesi oluşturuldu.`, 'success');
        onSaved(res.list);
      };
    },
  });
}

/** Kelime Ekleme Modalı (Tek Tek & Toplu Ekleme Sekmeli) */
export function openAddWordModal({ defaultListId = null, onSaved = () => {} } = {}) {
  const userId = getActiveUserId();
  const lists = getUserNotebookLists(userId);

  if (!lists.length) {
    openListModal(null, (newList) => {
      openAddWordModal({ defaultListId: newList.id, onSaved });
    });
    return;
  }

  const listOptions = lists
    .map((l) => `<option value="${l.id}" ${l.id === defaultListId ? 'selected' : ''}>${esc(l.name)} (${(l.wordIds || []).length} kelime)</option>`)
    .join('');

  openModal({
    title: 'Kişisel Kelime Ekle',
    wide: true,
    html: `
      <div class="notebook-add-tabs seg full" role="tablist">
        <button type="button" class="seg-btn active" id="tab-single" role="tab" aria-selected="true">Tek Tek Ekle</button>
        <button type="button" class="seg-btn" id="tab-bulk" role="tab" aria-selected="false">Toplu Ekle (Yapıştır)</button>
      </div>

      <div class="notebook-target-list-box" style="margin:16px 0 12px;background:var(--surf);padding:12px;border-radius:12px">
        <label style="font-weight:600;font-size:0.9rem;display:flex;flex-direction:column;gap:6px">
          Hedef Liste:
          <select class="input" id="nb-target-list">${listOptions}</select>
        </label>
      </div>

      <!-- TEK TEK EKLEME PANELİ -->
      <form id="panel-single" class="grid form" autocomplete="off">
        <p class="muted small span2" style="margin:0 0 6px">
          Yalnızca İngilizce kelimeyi ve Türkçe anlamını girmeniz yeterlidir. Lexora örnek cümleyi ve öğrenme altyapısını otomatik hazırlar.
        </p>
        <label>İngilizce Kelime *
          <input class="input" id="single-word" required placeholder="Örn: achieve" autocapitalize="off" autocorrect="off">
        </label>
        <label>Türkçe Karşılığı *
          <input class="input" id="single-meaning" required placeholder="Örn: başarmak, elde etmek">
        </label>
        <div class="err span2" id="single-err" role="alert"></div>
        <div class="row end span2 gap">
          <button type="button" class="btn ghost" data-x>Vazgeç</button>
          <button type="submit" class="btn primary">Listeye Ekle</button>
        </div>
      </form>

      <!-- TOPLU EKLEME PANELİ -->
      <div id="panel-bulk" hidden>
        <p class="muted small" style="margin:0 0 8px">
          Kelimelerinizi ve Türkçe anlamlarını aralarında <b>-</b>, <b>:</b> veya sekme boşluğu olacak şekilde aşağıya yapıştırın:
        </p>
        <textarea class="input" id="bulk-textarea" rows="7" style="font-family:monospace;font-size:0.9rem;width:100%;margin-bottom:10px" placeholder="achieve - başarmak&#10;improve - geliştirmek&#10;require - gerektirmek"></textarea>

        <div class="row between wrap gap" style="margin-bottom:12px">
          <button type="button" class="btn primary" id="btn-parse-bulk">Kelimeleri Ayrıştır ve Önizle</button>
          <span class="muted small" id="bulk-counter"></span>
        </div>

        <div id="bulk-preview-wrap" hidden>
          <h4 style="margin:14px 0 8px;font-size:0.95rem">Ayrıştırılan Kelimeler (Önizleme & Düzenleme)</h4>
          <p class="muted small" style="margin:0 0 8px">Kaydetmeden önce kelimeleri veya anlamları düzenleyebilir, istemediklerinizi silebilirsiniz.</p>
          <div class="bulk-preview-table-container" style="max-height:220px;overflow-y:auto;border:1px solid var(--bd);border-radius:10px;margin-bottom:14px">
            <table class="bulk-table" style="width:100%;border-collapse:collapse;font-size:0.85rem">
              <thead>
                <tr style="background:var(--surf);text-align:left;border-bottom:1px solid var(--bd)">
                  <th style="padding:6px 10px">#</th>
                  <th style="padding:6px 10px">İngilizce</th>
                  <th style="padding:6px 10px">Türkçe Anlam</th>
                  <th style="padding:6px 10px">Durum</th>
                  <th style="padding:6px 10px;text-align:center">Sil</th>
                </tr>
              </thead>
              <tbody id="bulk-tbody"></tbody>
            </table>
          </div>
          <div class="err" id="bulk-err" role="alert" style="margin-bottom:8px"></div>
          <div class="row end gap">
            <button type="button" class="btn ghost" data-x>Vazgeç</button>
            <button type="button" class="btn primary" id="btn-confirm-bulk">Kelimeleri Listeye Kaydet</button>
          </div>
        </div>
      </div>
    `,
    onMount(b, api) {
      $('[data-x]', b).onclick = api.close;

      const tabSingle = $('#tab-single', b);
      const tabBulk = $('#tab-bulk', b);
      const panelSingle = $('#panel-single', b);
      const panelBulk = $('#panel-bulk', b);
      const targetListSelect = $('#nb-target-list', b);

      tabSingle.onclick = () => {
        tabSingle.classList.add('active');
        tabBulk.classList.remove('active');
        panelSingle.hidden = false;
        panelBulk.hidden = true;
      };

      tabBulk.onclick = () => {
        tabBulk.classList.add('active');
        tabSingle.classList.remove('active');
        panelSingle.hidden = true;
        panelBulk.hidden = false;
        $('#bulk-textarea', b).focus();
      };

      // Tek Tek Ekleme İşleyicisi
      panelSingle.onsubmit = async (e) => {
        e.preventDefault();
        const errEl = $('#single-err', b);
        errEl.textContent = '';
        const wVal = $('#single-word', b).value.trim();
        const mVal = $('#single-meaning', b).value.trim();
        const lId = targetListSelect.value;

        const res = await addWordToNotebook({
          word: wVal,
          meanings: mVal,
          listId: lId,
          userId,
        });

        if (!res.ok) {
          errEl.textContent = res.error;
          return;
        }

        api.close();
        toast(`"${esc(wVal)}" listeye eklendi.`, 'success');
        onSaved();
      };

      // Toplu Ayrıştırma ve Önizleme
      let parsedItems = [];
      const renderPreviewRows = () => {
        const tbody = $('#bulk-tbody', b);
        const validCount = parsedItems.filter((i) => i.status === 'ok').length;
        const dupCount = parsedItems.filter((i) => i.status === 'dup').length;
        const errCount = parsedItems.filter((i) => i.status === 'error').length;

        $('#bulk-counter', b).textContent = `${validCount} hazır, ${dupCount} tekrar, ${errCount} hatalı`;

        tbody.innerHTML = parsedItems
          .map((item, index) => {
            const isOk = item.status === 'ok';
            const isDup = item.status === 'dup';
            const badgeClass = isOk ? 'chip ok' : (isDup ? 'chip alt' : 'chip bad');
            const badgeLabel = isOk ? 'Hazır' : (isDup ? 'Tekrar' : 'Hatalı');

            return `
              <tr style="border-bottom:1px solid var(--bd)" data-row="${index}">
                <td style="padding:6px 10px;color:var(--tx-sec)">${index + 1}</td>
                <td style="padding:6px 10px">
                  <input class="input sm" data-field="word" value="${esc(item.word)}" style="min-width:110px">
                </td>
                <td style="padding:6px 10px">
                  <input class="input sm" data-field="meanings" value="${esc(item.meanings)}" style="min-width:140px">
                </td>
                <td style="padding:6px 10px">
                  <span class="${badgeClass}" title="${esc(item.message)}" style="font-size:0.75rem">${badgeLabel}</span>
                </td>
                <td style="padding:6px 10px;text-align:center">
                  <button type="button" class="icon-btn sm" data-del-row="${index}" title="Kaldır" style="color:var(--no);min-width:32px;min-height:32px">✕</button>
                </td>
              </tr>
            `;
          })
          .join('');

        // Hücre düzenlemelerini dinle
        $$('[data-field]', tbody).forEach((input) => {
          input.oninput = (e) => {
            const rowIdx = parseInt(e.target.closest('tr').dataset.row, 10);
            const field = e.target.dataset.field;
            parsedItems[rowIdx][field] = e.target.value;
            // Yeniden doğrula
            if (field === 'word') {
              const clean = e.target.value.trim();
              if (!/^[A-Za-z][A-Za-z '’\-.]*$/.test(clean)) {
                parsedItems[rowIdx].status = 'error';
                parsedItems[rowIdx].message = 'Geçersiz harf';
              } else {
                parsedItems[rowIdx].status = 'ok';
                parsedItems[rowIdx].message = 'Hazır';
              }
            }
          };
        });

        // Satır silme butonları
        $$('[data-del-row]', tbody).forEach((btn) => {
          btn.onclick = () => {
            const rIdx = parseInt(btn.dataset.delRow, 10);
            parsedItems.splice(rIdx, 1);
            renderPreviewRows();
          };
        });
      };

      $('#btn-parse-bulk', b).onclick = () => {
        const text = $('#bulk-textarea', b).value;
        const lId = targetListSelect.value;
        const targetList = getUserNotebookLists(userId).find((l) => l.id === lId);
        const existingWords = getUserNotebookWords(userId);

        parsedItems = parseBulkWords(text, targetList?.wordIds || [], existingWords);

        if (!parsedItems.length) {
          toast('Lütfen önce ayrıştırılacak kelimeleri yapıştırın.');
          return;
        }

        $('#bulk-preview-wrap', b).hidden = false;
        renderPreviewRows();
      };

      // Toplu Kaydetme
      $('#btn-confirm-bulk', b).onclick = async () => {
        const validItems = parsedItems.filter((i) => i.status === 'ok');
        const bulkErr = $('#bulk-err', b);
        bulkErr.textContent = '';

        if (!validItems.length) {
          bulkErr.textContent = 'Kaydedilecek geçerli bir kelime bulunamadı.';
          return;
        }

        const lId = targetListSelect.value;
        const res = await bulkAddWordsToNotebook({
          items: parsedItems,
          listId: lId,
          userId,
        });

        if (!res.ok) {
          bulkErr.textContent = res.error;
          return;
        }

        api.close();
        toast(`${res.addedCount} kelime başarıyla eklendi.`, 'success');
        onSaved();
      };
    },
  });
}

/** Liste İçi Kelimeleri Görüntüleme & Yönetme Modalı */
export function openListWordsModal(listId, onUpdated = () => {}) {
  const userId = getActiveUserId();
  const lists = getUserNotebookLists(userId);
  const list = lists.find((l) => l.id === listId);
  if (!list) return;

  const stats = getListStats(listId);

  openModal({
    title: `${esc(list.name)} (${stats.total} Kelime)`,
    wide: true,
    html: `
      <div class="row between wrap gap" style="margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--bd)">
        <div>
          <span class="muted small">${stats.completed}/${stats.total} kelime 4 aşamayı tamamladı (%${stats.completion})</span>
          ${stats.due ? ` · <span class="warn-t small"><b>${stats.due} kelime tekrar bekliyor</b></span>` : ''}
        </div>
        <div class="row gap">
          <button type="button" class="btn sm primary" id="btn-modal-add-word">＋ Kelime Ekle</button>
          <button type="button" class="btn sm" id="btn-modal-study-list" ${stats.total ? '' : 'disabled'}>🚀 Listeyi Çalış</button>
        </div>
      </div>

      <div style="margin-bottom:12px">
        <input class="input sm" id="nb-filter-words" placeholder="Bu listede kelime ara…" style="width:100%">
      </div>

      <div id="nb-words-list-container" style="max-height:360px;overflow-y:auto">
        <ul class="list" id="nb-words-ul" style="margin:0"></ul>
      </div>

      <div class="row end" style="margin-top:14px">
        <button type="button" class="btn primary" data-x>Kapat</button>
      </div>
    `,
    onMount(b, api) {
      $('[data-x]', b).onclick = api.close;

      const renderWordsList = (q = '') => {
        const query = q.toLowerCase().trim();
        const filtered = stats.words.filter((w) => {
          if (!query) return true;
          return w.word.toLowerCase().includes(query) || (w.meanings || []).some((m) => m.toLowerCase().includes(query));
        });

        const ul = $('#nb-words-ul', b);
        if (!filtered.length) {
          ul.innerHTML = `<li class="list-row"><span class="muted small center" style="width:100%">${query ? 'Aramanıza uygun kelime bulunamadı.' : 'Bu listede henüz kelime yok.'}</span></li>`;
          return;
        }

        ul.innerHTML = filtered
          .map((w) => {
            const p = getProgress(w.id);
            const statusText = p.learningComplete
              ? (E.isMastered(p) ? 'Kalıcı Öğrenilen' : 'Öğrenildi')
              : (p.currentStatus === 'REVIEW' ? 'Tekrar Bekliyor' : (p.currentStage > 0 ? `Aşama ${Math.min(p.currentStage, 4)}/4` : 'Yeni'));

            const statusClass = p.learningComplete
              ? 'ok-t'
              : (p.currentStatus === 'REVIEW' ? 'warn-t' : '');

            return `
              <li class="list-row" style="align-items:center" data-word-id="${w.id}">
                <button type="button" class="speak-btn" data-spk="${esc(w.word)}" aria-label="Dinle" style="margin-right:4px">${ICONS.speaker}</button>
                <div class="row-main">
                  <b>${esc(w.word)}</b>
                  <span class="muted small">${esc(w.meanings.join(', '))}</span>
                  ${w.exampleSentence ? `<span class="muted small" style="font-style:italic">"${esc(w.exampleSentence)}"</span>` : ''}
                </div>
                <div class="row gap" style="align-items:center">
                  <span class="row-value ${statusClass}" style="font-size:0.75rem;font-weight:600;white-space:nowrap">${statusText}</span>
                  <button type="button" class="icon-btn sm" data-remove-word="${w.id}" title="Bu listeden kaldır" style="color:var(--no);min-width:32px;min-height:32px">✕</button>
                </div>
              </li>
            `;
          })
          .join('');

        // Dinleme butonları
        $$('[data-spk]', ul).forEach((btn) => {
          btn.onclick = () => speak(btn.dataset.spk);
        });

        // Kelime silme butonları
        $$('[data-remove-word]', ul).forEach((btn) => {
          btn.onclick = async () => {
            const wid = btn.dataset.removeWord;
            const targetW = stats.words.find((x) => x.id === wid);
            const ok = await confirmDialog(`"${targetW?.word}" kelimesi "${list.name}" listesinden kaldırılsın mı?`, { danger: true });
            if (!ok) return;

            await removeWordFromNotebookList(listId, wid, userId);
            toast('Kelime listeden kaldırıldı.');
            api.close();
            openListWordsModal(listId, onUpdated);
            onUpdated();
          };
        });
      };

      renderWordsList();

      $('#nb-filter-words', b).oninput = (e) => {
        renderWordsList(e.target.value);
      };

      $('#btn-modal-add-word', b).onclick = () => {
        api.close();
        openAddWordModal({
          defaultListId: listId,
          onSaved: () => {
            openListWordsModal(listId, onUpdated);
            onUpdated();
          },
        });
      };

      $('#btn-modal-study-list', b).onclick = () => {
        api.close();
        openStageSelectionModal({ listId, mode: 'list', userId });
      };
    },
  });
}

/* ---------- Kompakt Çalışma Seçenekleri Menüsü (v5.0 Mobil Revizyon) ---------- */
export function openNotebookStudyMenuModal({ activeList = null, userId = getActiveUserId(), onUpdated = () => {} } = {}) {
  const summary = getUserNotebookSummary(userId);
  const listStats = activeList ? getListStats(activeList.id) : { total: 0 };
  openModal({
    title: 'Çalışma Seçenekleri',
    html: `
      <div class="nb-study-sheet">
        <ul class="list nb-study-menu-list">
          ${activeList ? `
            <li>
              <button type="button" class="list-row linkrow" id="btn-study-active-list" data-act="study-list" data-id="${activeList.id}" ${listStats.total ? '' : 'disabled'}>
                <div class="row-main">
                  <b>${esc(activeList.name)} Listesini Çalış</b>
                  <span class="muted small">${listStats.total} kelime · Grup ve aşama seç</span>
                </div>
                ${ICONS.chev}
              </button>
            </li>
          ` : ''}
          <li>
            <button type="button" class="list-row linkrow" id="btn-study-all" ${summary.totalWords ? '' : 'disabled'}>
              <div class="row-main">
                <b>Bütün Kelimelerimi Çalış</b>
                <span class="muted small">${summary.totalWords} kişisel kelime</span>
              </div>
              ${ICONS.chev}
            </button>
          </li>
          <li>
            <button type="button" class="list-row linkrow" id="btn-study-unknown" ${summary.totalWords ? '' : 'disabled'}>
              <div class="row-main">
                <b>Yalnızca Bilmediklerimi Çalış</b>
                <span class="muted small">Öğrenilmemiş veya hatalı kelimeler</span>
              </div>
              ${ICONS.chev}
            </button>
          </li>
          <li>
            <button type="button" class="list-row linkrow" id="btn-study-due" ${summary.dueWords ? '' : 'disabled'}>
              <div class="row-main">
                <b>Tekrar Zamanı Gelenler</b>
                <span class="muted small">${summary.dueWords ? `${summary.dueWords} kelime tekrar bekliyor` : 'Şu an bekleyen tekrar yok'}</span>
              </div>
              ${ICONS.chev}
            </button>
          </li>
          ${activeList ? `
            <li>
              <button type="button" class="list-row linkrow" id="btn-menu-view-words">
                <div class="row-main">
                  <b>Listedeki Kelimeleri Gör ve Yönet</b>
                  <span class="muted small">${esc(activeList.name)} (${listStats.total} kelime)</span>
                </div>
                ${ICONS.chev}
              </button>
            </li>
          ` : ''}
        </ul>
        <div class="row end"><button type="button" class="btn ghost" data-x>Kapat</button></div>
      </div>
    `,
    onMount(b, api) {
      $('[data-x]', b).onclick = api.close;
      const studyActive = $('#btn-study-active-list', b);
      if (studyActive && activeList) {
        studyActive.onclick = () => { api.close(); openStageSelectionModal({ listId: activeList.id, mode: 'list', userId }); };
      }
      const studyAllBtn = $('#btn-study-all', b);
      if (studyAllBtn) studyAllBtn.onclick = () => { api.close(); openStageSelectionModal({ mode: 'all', userId }); };
      const studyUnknownBtn = $('#btn-study-unknown', b);
      if (studyUnknownBtn) studyUnknownBtn.onclick = () => { api.close(); openStageSelectionModal({ mode: 'unknown', userId }); };
      const studyDueBtn = $('#btn-study-due', b);
      if (studyDueBtn) studyDueBtn.onclick = () => { api.close(); startStudyDue(userId); };
      const viewWordsBtn = $('#btn-menu-view-words', b);
      if (viewWordsBtn && activeList) {
        viewWordsBtn.onclick = () => { api.close(); openListWordsModal(activeList.id, onUpdated); };
      }
    },
  });
}

/* ---------- Ana Kelime Defterim Sayfası — Dikey Öğrenme Yolu (v5.0 Mobil Revizyon) ---------- */
export function renderNotebook(v) {
  const userId = getActiveUserId();
  let win = null; // { key, lo, hi }

  const draw = async (opts = {}) => {
    const lists = getUserNotebookLists(userId);
    if (lists.length) await ensureListPaths(lists); // kalıcı durakları garanti et (idempotent)
    const activeList = getPreferredNotebookList(userId);
    const pathSum = notebookPathSummary(activeList);
    const n = pathSum.totalStops;
    const cur = Math.max(0, pathSum.currentIndex);
    const key = `nb:${activeList?.id || ''}`;
    if (!win || win.key !== key || opts.recenter) {
      win = { key, lo: Math.max(0, cur - WINDOW_RADIUS), hi: Math.min(n - 1, cur + WINDOW_RADIUS) };
    }
    win.lo = Math.max(0, Math.min(win.lo, Math.max(0, n - 1)));
    win.hi = Math.min(Math.max(0, n - 1), Math.max(win.hi, win.lo));

    const listSelectHtml = lists.length
      ? `<div class="nb-list-bar">
          <select class="input sm nb-list-select" id="nb-active-list" aria-label="Kişisel liste seç">
            ${lists.map((l) => `<option value="${esc(l.id)}" ${activeList && l.id === activeList.id ? 'selected' : ''}>${esc(l.name)} (${(l.wordIds || []).length})</option>`).join('')}
          </select>
          ${activeList ? `
            <button type="button" class="icon-btn nb-list-btn nb-list-edit" data-act="edit-list" data-id="${activeList.id}" aria-label="Listeyi düzenle" title="Listeyi Düzenle">${ICONS.edit}</button>
            <button type="button" class="icon-btn nb-list-btn nb-list-del" data-act="del-list" data-id="${activeList.id}" aria-label="Listeyi sil" title="Listeyi Sil">${ICONS.trash}</button>
          ` : ''}
        </div>`
      : '';

    const progressStripHtml = activeList && pathSum.totalWords
      ? `<div class="nb-progress-strip">
          <span class="nb-progress-text"><b>${pathSum.doneWords}/${pathSum.totalWords}</b> kelime · <b>${pathSum.doneStops}/${pathSum.totalStops}</b> durak (%${pathSum.pct})</span>
          <div class="progress thin" role="progressbar" aria-valuenow="${pathSum.pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pathSum.pct}%"></i></div>
          ${n > 6 ? `<button type="button" class="text-btn small" id="nb-path-jump">Kaldığım Yere Git</button>` : ''}
        </div>`
      : '';

    const activeSaved = state.meta?.activeSession;
    const hasSaved = !!(activeSaved && activeSaved.params?.isNotebook && (activeSaved.params?.userId || 'guest') === userId && activeSaved.idx < (activeSaved.items?.length || 0));
    const savedStripHtml = hasSaved
      ? `<div class="nb-resume-row"><button type="button" class="btn sm primary block" id="nb-resume">Kaldığın Yerden Devam Et (${activeSaved.idx}/${activeSaved.items.length})</button><button type="button" class="btn sm ghost" id="nb-discard">Vazgeç</button></div>`
      : '';

    let bodyHtml = '';
    if (!lists.length) {
      bodyHtml = `
        <div class="path-empty">
          <img src="assets/mascot/siyami-hello.png" alt="" class="siyami-empty-cat" loading="lazy"/>
          <b>Henüz bir kelime listen yok</b>
          <button type="button" class="btn primary" id="btn-empty-create-list">＋ İlk Listeni Oluştur</button>
        </div>
      `;
    } else if (!n) {
      bodyHtml = `
        <div class="path-empty">
          <img src="assets/mascot/siyami-curious.png" alt="" class="siyami-empty-cat" loading="lazy"/>
          <b>${esc(activeList.name)} listesinde henüz kelime yok</b>
          <span class="muted small">Her ${STOP_SIZE} kelime dikey yolunda bir durak oluşturur.</span>
          <button type="button" class="btn primary" id="btn-empty-add-word">＋ Kelime Ekle</button>
        </div>
      `;
    } else {
      const prevBtn = win.lo > 0 ? `<button type="button" class="btn ghost block path-more" id="nb-path-prev">Önceki durakları göster (${win.lo} durak)</button>` : '';
      const nextBtn = win.hi < n - 1 ? `<button type="button" class="btn ghost block path-more" id="nb-path-next">Sonraki durakları göster (${n - 1 - win.hi} durak daha)</button>` : '';
      bodyHtml = `
        <div class="path-wrap nb-vertical-path">
          ${prevBtn}
          ${pathCanvasHtml(pathSum, win.lo, win.hi, 'notebook')}
          ${nextBtn}
        </div>
      `;
    }

    v.innerHTML = `
      <div class="page notebook-page">
        <header class="nb-header">
          <div class="nb-brand-row">
            <span class="hero-title" aria-label="VELUNO">VELUNO</span>
            <span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span>
          </div>
          <div class="nb-top-bar">
            <h1>Kelime Defterim</h1>
            <div class="nb-top-actions">
              <button type="button" class="btn sm primary" id="btn-top-add-word" aria-label="Kelime Ekle">＋ Kelime</button>
              <button type="button" class="btn sm" id="btn-open-study-menu" aria-label="Çalışma seçenekleri">Çalış ▾</button>
              <button type="button" class="btn sm ghost" id="btn-top-new-list" aria-label="Yeni liste oluştur">＋ Liste</button>
            </div>
          </div>
          ${listSelectHtml}
          ${progressStripHtml}
          ${savedStripHtml}
        </header>
        ${bodyHtml}
      </div>
    `;

    const refresh = () => { win = null; draw(); };

    const nbResume = $('#nb-resume', v);
    if (nbResume) nbResume.onclick = () => resumeSaved();
    const nbDiscard = $('#nb-discard', v);
    if (nbDiscard) nbDiscard.onclick = async () => { await setMeta('activeSession', null); draw(); };

    const topNewList = $('#btn-top-new-list', v);
    if (topNewList) topNewList.onclick = () => openListModal(null, async (created) => {
      if (created?.id) await setPreferredNotebookList(created.id, userId);
      refresh();
    });

    const emptyCreate = $('#btn-empty-create-list', v);
    if (emptyCreate) emptyCreate.onclick = () => openListModal(null, async (created) => {
      if (created?.id) await setPreferredNotebookList(created.id, userId);
      refresh();
    });

    const topAddWord = $('#btn-top-add-word', v);
    if (topAddWord) topAddWord.onclick = () => openAddWordModal({ defaultListId: activeList?.id || null, onSaved: refresh });

    const emptyAddWord = $('#btn-empty-add-word', v);
    if (emptyAddWord) emptyAddWord.onclick = () => openAddWordModal({ defaultListId: activeList?.id || null, onSaved: refresh });

    const studyMenuBtn = $('#btn-open-study-menu', v);
    if (studyMenuBtn) studyMenuBtn.onclick = () => openNotebookStudyMenuModal({ activeList, userId, onUpdated: refresh });

    const listSel = $('#nb-active-list', v);
    if (listSel) {
      listSel.onchange = async () => {
        await setPreferredNotebookList(listSel.value, userId);
        win = null;
        draw();
      };
    }

    const prevEl = $('#nb-path-prev', v);
    if (prevEl) prevEl.onclick = () => { win.lo = Math.max(0, win.lo - WINDOW_STEP); draw({ keepScroll: true }); };
    const nextEl = $('#nb-path-next', v);
    if (nextEl) nextEl.onclick = () => { win.hi = Math.min(n - 1, win.hi + WINDOW_STEP); draw(); };
    const jumpEl = $('#nb-path-jump', v);
    if (jumpEl) jumpEl.onclick = () => { draw({ recenter: true, scrollToCurrent: true }); };

    $$('[data-stop-index]', v).forEach((b) => {
      b.onclick = () => {
        const s = pathSum.stops[Number(b.dataset.stopIndex)];
        if (!s || !activeList) return;
        openStopDetail({ kind: 'notebook', stop: s, list: activeList, onChanged: refresh });
      };
    });

    $$('[data-act="view-list"]', v).forEach((btn) => {
      btn.onclick = () => openListWordsModal(btn.dataset.id, refresh);
    });

    $$('[data-act="edit-list"]', v).forEach((btn) => {
      btn.onclick = () => {
        const targetList = lists.find((l) => l.id === btn.dataset.id);
        if (targetList) openListModal(targetList, refresh);
      };
    });

    $$('[data-act="del-list"]', v).forEach((btn) => {
      btn.onclick = async () => {
        const targetList = lists.find((l) => l.id === btn.dataset.id);
        if (!targetList) return;
        const ok = await confirmDialog(`"${targetList.name}" listesi silinsin mi? (Bu listedeki kelimeler başka listelerde bulunmuyorsa silinecektir.)`, { danger: true });
        if (!ok) return;
        await deleteNotebookList(targetList.id);
        toast(`"${esc(targetList.name)}" listesi silindi.`);
        refresh();
      };
    });

    if (opts.scrollToCurrent || (opts.initial && cur > 2)) {
      const target = $('.pstop.is-current', v) || $(`[data-stop-index="${cur}"]`, v);
      if (target && typeof target.scrollIntoView === 'function') {
        requestAnimationFrame(() => target.scrollIntoView({ block: 'center', behavior: opts.initial || reduceMotion() ? 'auto' : 'smooth' }));
      }
    }
  };

  draw({ initial: true }).catch((e) => { console.error(e); toast('Defterim yüklenemedi: ' + e.message, 'error'); });
}
