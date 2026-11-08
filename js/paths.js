// VELUNO v5.0 — Öğrenme Yolları veri katmanı (Ember Soft).
// - Kişisel listeler: her liste için KALICI durak kayıtları (meta: 'notebookPaths').
//   Duraklar bir kez oluşturulur; yeni kelime son durağın boş kapasitesine ya da yeni durağa eklenir,
//   silinen kelimeler diğer durakları KAYDIRMAZ. Senkronizasyon idempotenttir.
// - Hazır A2/B1/B2: her seviye için kelime kimliğine göre sabit sıralı, 10'arlık türetilmiş duraklar (kalıcı kayıt gerekmez).
// - İlerleme YALNIZCA mevcut öğrenme kayıtlarından okunur: progress.learningComplete (Öğrenildi) veya
//   progress.currentStatus === 'MASTERED' (Kalıcı Öğrenilen). Yeni bir "öğrenildi" sistemi YOKTUR.
import { state, saveData } from './storage.js';
import { isWordReady } from './engine.js';

export const STOP_SIZE = 10;
export const PATHS_META_KEY = 'notebookPaths';
export const PATH_SCHEMA = 1;

/* ---------- Gerçek ilerleme ölçütü ---------- */
/** Kelime tamamlanmış mı? (Mevcut sistemdeki Learned = learningComplete, Mastered = currentStatus 'MASTERED') */
export function isWordCompleted(p) {
  return !!p && (p.learningComplete === true || p.currentStatus === 'MASTERED');
}

/** Kelimenin durak içindeki görsel durumu (yalnızca okuma). */
export function wordPathState(p) {
  if (!p) return 'new';
  if (p.currentStatus === 'MASTERED') return 'mastered';
  if (p.learningComplete) return p.currentStatus === 'REVIEW' ? 'learned-review' : 'learned';
  if (p.currentStatus === 'REVIEW') return 'review';
  if ((p.currentStage || 0) > 0 || p.currentStatus === 'LEARNING' || (p.correctCount || 0) + (p.incorrectCount || 0) > 0) return 'learning';
  return 'new';
}

/** Bir durağın ilerlemesini hesaplar. state: 'done' | 'active' | 'todo' | 'empty' */
export function computeStopProgress(wordIds, progress = state.progress) {
  const ids = Array.isArray(wordIds) ? wordIds : [];
  let done = 0;
  let started = 0;
  for (const id of ids) {
    const p = progress[id];
    if (isWordCompleted(p)) done++;
    else if (wordPathState(p) !== 'new') started++;
  }
  const total = ids.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  let st = 'todo';
  if (!total) st = 'empty';
  else if (done === total) st = 'done';
  else if (done > 0 || started > 0) st = 'active';
  return { total, done, pct, state: st };
}

/** Bir yolun (durak dizisi) özetini ve "kaldığım yer" durağını hesaplar. */
export function summarizePath(stops, progress = state.progress) {
  const list = (Array.isArray(stops) ? stops : []).map((s, i) => ({ ...s, number: i + 1, progress: computeStopProgress(s.wordIds, progress) }));
  const totalWords = list.reduce((a, s) => a + s.progress.total, 0);
  const doneWords = list.reduce((a, s) => a + s.progress.done, 0);
  const doneStops = list.filter((s) => s.progress.state === 'done').length;
  let currentIndex = list.findIndex((s) => s.progress.state !== 'done');
  if (currentIndex < 0) currentIndex = list.length ? list.length - 1 : -1;
  return {
    stops: list,
    totalStops: list.length,
    doneStops,
    totalWords,
    doneWords,
    pct: totalWords ? Math.round((doneWords / totalWords) * 100) : 0,
    currentIndex,
    allDone: list.length > 0 && doneStops === list.length,
  };
}

/* ---------- Kişisel liste yolları (kalıcı) ---------- */
export function getAllPaths() {
  const raw = state.meta?.[PATHS_META_KEY];
  return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
}

async function saveAllPaths(paths) {
  state.meta[PATHS_META_KEY] = paths;
  await saveData('meta', { key: PATHS_META_KEY, value: paths });
}

function newPathRecord(list) {
  const now = new Date().toISOString();
  return { listId: list.id, userId: list.userId, schema: PATH_SCHEMA, nextSeq: 1, stops: [], createdAt: now, updatedAt: now };
}

/** Eski / yarım kalmış yol kaydını güvenli biçimde normalize eder (veri kaybı olmadan). */
export function normalizePathRecord(rec, list) {
  const base = rec && typeof rec === 'object' ? rec : newPathRecord(list);
  const seen = new Set();
  const stops = [];
  let maxSeq = 0;
  for (const s of Array.isArray(base.stops) ? base.stops : []) {
    if (!s || typeof s !== 'object') continue;
    const ids = [];
    for (const id of Array.isArray(s.wordIds) ? s.wordIds : []) {
      if (typeof id !== 'string' || seen.has(id)) continue; // bir kelime bir listede yalnızca bir durakta bulunur
      seen.add(id);
      ids.push(id);
    }
    const m = /_s(\d+)$/.exec(String(s.id || ''));
    if (m) maxSeq = Math.max(maxSeq, Number(m[1]));
    stops.push({ id: typeof s.id === 'string' && s.id ? s.id : null, wordIds: ids.slice(0, STOP_SIZE), createdAt: s.createdAt || null });
    // Kapasiteyi aşan (bozuk) kayıtların fazlası atılmaz: sonraki senkronizasyonda yeni duraklara eklenir
  }
  let nextSeq = Math.max(Number(base.nextSeq) || 1, maxSeq + 1);
  for (const s of stops) {
    if (!s.id) s.id = `${list.id}_s${nextSeq++}`;
  }
  return { ...base, listId: list.id, userId: list.userId, schema: PATH_SCHEMA, nextSeq, stops };
}

/**
 * SAF senkronizasyon: listenin güncel wordIds dizisine göre yol kaydını günceller.
 * Kurallar:
 *  - Listede artık olmayan kelimeler bulundukları duraktan çıkarılır; diğer kelimeler KAYDIRILMAZ.
 *  - Tamamen boşalan duraklar kaldırılır (boş durak gösterilmez; durak kimlikleri asla yeniden kullanılmaz).
 *  - Yeni kelimeler son durağın boş kapasitesine, o doluysa yeni duraklara (en çok 10) eklenir.
 *  - Aynı girdiyle tekrar çalıştırıldığında hiçbir değişiklik yapmaz (idempotent).
 */
export function syncPathRecord(rec, list, now = new Date().toISOString()) {
  const before = JSON.stringify(rec || null);
  const path = normalizePathRecord(rec ? JSON.parse(JSON.stringify(rec)) : null, list);
  const listIds = [...new Set((Array.isArray(list.wordIds) ? list.wordIds : []).filter((x) => typeof x === 'string'))];
  const inList = new Set(listIds);

  for (const s of path.stops) s.wordIds = s.wordIds.filter((id) => inList.has(id));
  path.stops = path.stops.filter((s) => s.wordIds.length > 0);

  const placed = new Set(path.stops.flatMap((s) => s.wordIds));
  const fresh = listIds.filter((id) => !placed.has(id));
  for (const id of fresh) {
    let last = path.stops[path.stops.length - 1];
    if (!last || last.wordIds.length >= STOP_SIZE) {
      last = { id: `${list.id}_s${path.nextSeq++}`, wordIds: [], createdAt: now };
      path.stops.push(last);
    }
    last.wordIds.push(id);
  }
  const changed = JSON.stringify({ ...path, updatedAt: rec?.updatedAt }) !== before
    || !rec;
  if (changed) path.updatedAt = now;
  return { path, changed };
}

/** Bellekteki listeler için yolları senkronlar (ilk kurulum / migration dahil) ve gerekirse kaydeder. Idempotent. */
export async function ensureListPaths(lists) {
  const all = { ...getAllPaths() };
  let dirty = false;
  for (const list of Array.isArray(lists) ? lists : []) {
    if (!list || !list.id) continue;
    const { path, changed } = syncPathRecord(all[list.id] || null, list);
    if (changed) { all[list.id] = path; dirty = true; }
  }
  if (dirty) await saveAllPaths(all);
  return all;
}

/** Tek bir liste için yolu senkronlar (kelime ekleme/silme sonrasında çağrılır). */
export async function syncListPath(list) {
  if (!list || !list.id) return null;
  const all = { ...getAllPaths() };
  const { path, changed } = syncPathRecord(all[list.id] || null, list);
  if (changed) { all[list.id] = path; await saveAllPaths(all); }
  return all[list.id] || path;
}

/** Liste silindiğinde YALNIZCA o listenin yol kaydını kaldırır; diğer listeler etkilenmez. */
export async function removeListPath(listId) {
  const all = { ...getAllPaths() };
  if (!(listId in all)) return false;
  delete all[listId];
  await saveAllPaths(all);
  return true;
}

/** Yolu okur; kayıt yoksa ya da liste değiştiyse bellekte senkron hesaplar (kaydetme işini ensureListPaths yapar). */
export function getListPathStops(list) {
  if (!list) return [];
  const { path } = syncPathRecord(getAllPaths()[list.id] || null, list);
  return path.stops;
}

/* ---------- Hazır A2/B1/B2 yolları (türetilmiş, sabit sıralı) ---------- */
export function getLevelPathWordIds(level, words = state.words) {
  return words
    .filter((w) => w && w.level === level && isWordReady(w))
    .map((w) => w.id)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

export function getLevelPathStops(level, words = state.words) {
  const ids = getLevelPathWordIds(level, words);
  const stops = [];
  for (let i = 0; i < ids.length; i += STOP_SIZE) {
    stops.push({ id: `${level}_s${stops.length + 1}`, wordIds: ids.slice(i, i + STOP_SIZE) });
  }
  return stops;
}

/** Durak sayısı = ceil(kelime / 10) */
export const stopCountFor = (n) => Math.ceil(Math.max(0, n) / STOP_SIZE);
