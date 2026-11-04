// LEXORA — Kelime Defterim (Notebook / Personal Word Lists)
// Kullanıcıların kendi İngilizce kelime listelerini oluşturmasını, tek tek veya toplu kelime eklemesini,
// ve mevcut 6 aşamalı öğrenme motoru ile SRS aralıklı tekrar sistemi üzerinden çalışmalarını sağlar.

import { state, saveData, setMeta, getSettings, getProgress, saveProgress } from './storage.js';
import * as E from './engine.js';
import { $, $$, esc, openModal, toast, confirmDialog, speak, ICONS } from './ui.js';
import { prepareWordInfo } from './vocabulary.js';
import { blankSentence, isWordReady } from './engine.js';
import { getCurrentUser } from './auth.js';
import { startSession } from './learning.js';
import { bumpDaily } from './statistics.js';

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

/* ---------- Çalışma Seçenekleri (Study Options) ---------- */

/** 1) Bu listeyi çalış */
export async function startStudyList(listId) {
  const stats = getListStats(listId);
  const allLists = getAllNotebookLists();
  const list = allLists.find((l) => l.id === listId);
  if (!list || !stats.words.length) {
    toast('Bu listede henüz kelime yok. Lütfen önce kelime ekleyin.');
    return false;
  }

  const unlearned = stats.words.filter((w) => !state.progress[w.id]?.learningComplete);

  if (unlearned.length > 0) {
    const batch = E.learnBatch(stats.words, state.progress, +getSettings().batchSize || 5);
    await startSession({
      kind: 'learn',
      title: `${list.name} — Kelime Öğren`,
      items: E.learnItems(batch, state.progress),
      params: { isNotebook: true, listId: list.id, mode: 'list' },
    });
    return true;
  }

  // Listedeki bütün kelimeler 5 aşamayı tamamlamışsa tekrar modu başlat
  toast('Listedeki tüm kelimeler 5 aşamayı tamamladı! Tekrar oturumu başlatılıyor…', 'success');
  const items = stats.words.map((w, i) => ({
    wordId: w.id,
    type: ['mc', 'typing', 'sentence', 'missing'][i % 4],
  }));
  await startSession({
    kind: 'review',
    title: `${list.name} — Tekrar`,
    items: E.shuffle(items),
    params: { isNotebook: true, listId: list.id, mode: 'list' },
  });
  return true;
}

/** 2) Bütün kişisel kelimelerimi çalış */
export async function startStudyAll(userId = getActiveUserId()) {
  const words = getUserNotebookWords(userId);
  if (!words.length) {
    toast('Henüz kişisel kelimeniz bulunmuyor. Önce bir liste oluşturup kelime ekleyin.');
    return false;
  }

  const unlearned = words.filter((w) => !state.progress[w.id]?.learningComplete);
  if (unlearned.length > 0) {
    const batch = E.learnBatch(words, state.progress, +getSettings().batchSize || 5);
    await startSession({
      kind: 'learn',
      title: 'Tüm Kelimelerim — Kelime Öğren',
      items: E.learnItems(batch, state.progress),
      params: { isNotebook: true, mode: 'all' },
    });
    return true;
  }

  // Tüm kelimeler öğrenildiyse genel tekrar oturumu
  toast('Tüm kişisel kelimeleriniz 5 aşamayı tamamladı! Genel tekrar başlatılıyor…', 'success');
  const items = words.map((w, i) => ({
    wordId: w.id,
    type: ['mc', 'typing', 'sentence', 'missing'][i % 4],
  }));
  await startSession({
    kind: 'review',
    title: 'Tüm Kişisel Kelimeler — Tekrar',
    items: E.shuffle(items).slice(0, 20),
    params: { isNotebook: true, mode: 'all' },
  });
  return true;
}

/** 3) Yalnızca bilmediklerimi çalış */
export async function startStudyUnknown(userId = getActiveUserId()) {
  const words = getUserNotebookWords(userId);
  if (!words.length) {
    toast('Henüz kişisel kelimeniz bulunmuyor.');
    return false;
  }

  // Henüz öğrenilmemiş, hata yapılmış (REVIEW) veya hakimiyet puanı düşük olanlar
  const candidates = words.filter((w) => {
    const p = getProgress(w.id);
    return !p.learningComplete || p.currentStatus === 'REVIEW' || (p.masteryScore || 0) < 60;
  });

  if (!candidates.length) {
    toast('Tebrikler! Şu an zorlandığınız veya bilmediğiniz kişisel bir kelime bulunmuyor. 🎉', 'success');
    return false;
  }

  const unlearned = candidates.filter((w) => !state.progress[w.id]?.learningComplete);
  if (unlearned.length > 0) {
    const batch = E.learnBatch(candidates, state.progress, +getSettings().batchSize || 5);
    await startSession({
      kind: 'learn',
      title: 'Zorlandığım Kelimeler — 5 Aşama',
      items: E.learnItems(batch, state.progress),
      params: { isNotebook: true, mode: 'unknown' },
    });
    return true;
  }

  // Daha önce 5 aşamayı bitirmiş ama tekrar havuzunda olanlar için odaklı tekrar
  const items = candidates.map((w, i) => ({
    wordId: w.id,
    type: ['typing', 'sentence', 'missing', 'mc'][i % 4],
  }));
  await startSession({
    kind: 'review',
    title: 'Zorlandığım Kelimeler — Odaklı Tekrar',
    items: E.shuffle(items).slice(0, 15),
    params: { isNotebook: true, mode: 'unknown' },
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
          <span class="muted small">${stats.completed}/${stats.total} kelime 5 aşamayı tamamladı (%${stats.completion})</span>
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
              : (p.currentStatus === 'REVIEW' ? 'Tekrar Bekliyor' : (p.currentStage > 0 ? `Aşama ${p.currentStage}/6` : 'Yeni'));

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

      $('#btn-modal-study-list', b).onclick = async () => {
        api.close();
        await startStudyList(listId);
      };
    },
  });
}

/* ---------- Ana Kelime Defterim Sayfası (Notebook View) ---------- */
export function renderNotebook(v) {
  const userId = getActiveUserId();
  const summary = getUserNotebookSummary(userId);
  const lists = getUserNotebookLists(userId);

  const listCardsHtml = lists.length
    ? lists
        .map((list) => {
          const stats = getListStats(list.id);
          const hasWords = stats.total > 0;
          return `
            <div class="notebook-card" data-list-id="${list.id}" style="background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px;margin-bottom:14px">
              <div class="row between wrap gap" style="margin-bottom:8px">
                <div style="flex:1">
                  <h3 style="margin:0 0 4px;font-size:1.1rem;display:flex;align-items:center;gap:8px">
                    <span>${esc(list.name)}</span>
                    <span class="chip" style="font-size:0.75rem">${stats.total} kelime</span>
                  </h3>
                  <div class="muted small">
                    ${stats.completed}/${stats.total} tamamlandı (%${stats.completion})
                    ${stats.due ? ` · <span class="warn-t"><b>${stats.due} tekrar zamanı geldi</b></span>` : ''}
                  </div>
                </div>
                <div class="row gap">
                  <button type="button" class="btn sm primary" data-act="study-list" data-id="${list.id}" ${hasWords ? '' : 'disabled'}>
                    🚀 Bu Listeyi Çalış
                  </button>
                  <button type="button" class="btn sm" data-act="view-list" data-id="${list.id}">
                    Kelimeleri Gör
                  </button>
                  <button type="button" class="btn sm ghost" data-act="edit-list" data-id="${list.id}" title="Listeyi Düzenle">
                    ✏️
                  </button>
                  <button type="button" class="btn sm ghost" data-act="del-list" data-id="${list.id}" title="Listeyi Sil" style="color:var(--no)">
                    🗑️
                  </button>
                </div>
              </div>
              <div class="progress thin" style="margin-top:10px">
                <i style="width:${stats.completion}%"></i>
              </div>
            </div>
          `;
        })
        .join('')
    : `
      <div class="center" style="padding:2.5rem 1rem;background:var(--card);border:1px dashed var(--bd);border-radius:14px">
        <p class="lead" style="margin-bottom:8px">Henüz bir kelime listeniz bulunmuyor.</p>
        <p class="muted small" style="margin-bottom:16px">Dersleriniz, sınavlarınız veya günlük çalışmalarınız için hemen ilk listenizi oluşturun.</p>
        <button type="button" class="btn primary" id="btn-empty-create-list">＋ İlk Listeni Oluştur</button>
      </div>
    `;

  v.innerHTML = `
    <div class="page notebook-page">
      <div class="row between wrap gap" style="margin-bottom:16px;align-items:flex-start">
        <div>
          <h1 style="margin:0 0 4px">Kelime Defterim</h1>
          <p class="lead" style="margin:0">Kişisel kelime listelerin, 5 aşamalı öğrenme ve akıllı tekrar.</p>
        </div>
        <div class="row gap wrap">
          <button type="button" class="btn primary" id="btn-top-add-word">＋ Kelime Ekle</button>
          <button type="button" class="btn" id="btn-top-new-list">＋ Yeni Liste</button>
        </div>
      </div>

      <!-- ÇALIŞMA SEÇENEKLERİ (STUDY OPTIONS BANNER) -->
      <section class="notebook-study-banner" style="background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:16px;margin-bottom:20px">
        <div class="row between wrap gap" style="margin-bottom:12px">
          <div>
            <h2 style="font-size:1.05rem;margin:0 0 4px">Kişisel Çalışma Seçenekleri</h2>
            <div class="muted small">
              Toplam <b>${summary.totalWords}</b> kelime · <b>${summary.completedWords}</b> öğrenildi · <b>${summary.dueWords}</b> tekrar bekliyor
            </div>
          </div>
          <div class="progress thin" style="max-width:180px;min-width:120px">
            <i style="width:${summary.completion}%"></i>
          </div>
        </div>

        <div class="notebook-study-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px">
          <button type="button" class="btn" id="btn-study-all" ${summary.totalWords ? '' : 'disabled'} style="flex-direction:column;padding:12px 10px;height:auto">
            <span style="font-size:1.2rem;margin-bottom:4px">⚡</span>
            <b>Bütün Kelimelerimi Çalış</b>
            <span class="muted small" style="font-size:0.75rem">${summary.totalWords} kelime</span>
          </button>

          <button type="button" class="btn" id="btn-study-unknown" ${summary.totalWords ? '' : 'disabled'} style="flex-direction:column;padding:12px 10px;height:auto">
            <span style="font-size:1.2rem;margin-bottom:4px">🎯</span>
            <b>Yalnızca Bilmediklerimi Çalış</b>
            <span class="muted small" style="font-size:0.75rem">Öğrenilmemiş & Hatalı</span>
          </button>

          <button type="button" class="btn primary" id="btn-study-due" ${summary.dueWords ? '' : 'disabled'} style="flex-direction:column;padding:12px 10px;height:auto">
            <span style="font-size:1.2rem;margin-bottom:4px">🧠</span>
            <b>Tekrar Zamanı Gelenler</b>
            <span class="muted small" style="font-size:0.75rem;color:var(--on-ac)">${summary.dueWords ? `${summary.dueWords} kelime bekliyor` : 'Şu an yok'}</span>
          </button>
        </div>
      </section>

      <!-- LİSTELER BAŞLIĞI & KARTLAR -->
      <div class="row between wrap gap" style="margin-bottom:12px">
        <h2 style="font-size:1.15rem;margin:0">Listelerim (${summary.listCount})</h2>
      </div>

      <div class="notebook-lists-wrap">
        ${listCardsHtml}
      </div>
    </div>
  `;

  // Buton Olayları (Event Bindings)
  const refresh = () => renderNotebook(v);

  const topNewList = $('#btn-top-new-list', v);
  if (topNewList) topNewList.onclick = () => openListModal(null, refresh);

  const emptyCreate = $('#btn-empty-create-list', v);
  if (emptyCreate) emptyCreate.onclick = () => openListModal(null, refresh);

  const topAddWord = $('#btn-top-add-word', v);
  if (topAddWord) topAddWord.onclick = () => openAddWordModal({ onSaved: refresh });

  // Çalışma Seçenekleri Butonları
  const studyAllBtn = $('#btn-study-all', v);
  if (studyAllBtn) studyAllBtn.onclick = () => startStudyAll(userId);

  const studyUnknownBtn = $('#btn-study-unknown', v);
  if (studyUnknownBtn) studyUnknownBtn.onclick = () => startStudyUnknown(userId);

  const studyDueBtn = $('#btn-study-due', v);
  if (studyDueBtn) studyDueBtn.onclick = () => startStudyDue(userId);

  // Kart Butonları
  $$('[data-act="study-list"]', v).forEach((btn) => {
    btn.onclick = () => startStudyList(btn.dataset.id);
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
}
