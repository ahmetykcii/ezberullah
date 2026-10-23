// Kalıcı veri katmanı: IndexedDB (büyük veri) + localStorage (ayarlar). IndexedDB yoksa bellek içi yedek (uyarı ile).
import { newProgress } from './engine.js';

export const SCHEMA_VERSION = 1;
const DB_NAME = 'lexora-db';
const STORES = ['words', 'progress', 'exams', 'daily', 'meta'];
const KEYS = { words: 'id', progress: 'id', exams: 'id', daily: 'date', meta: 'key' };
export const state = { words: [], wordMap: new Map(), progress: {}, exams: [], daily: {}, meta: {}, grammarProgress: {} };
let idb = null;
export let persistent = false;

/* ---------- Ayarlar (localStorage) ---------- */
export const DEFAULT_SETTINGS = {
  dailyGoal: 10, theme: 'light', sound: true, ttsRate: 0.9, animations: true,
  reducedMotion: false, shortcuts: true, examDate: '', batchSize: 5, visuals: true,
};
const LS = 'lexora_settings';
export function getSettings() {
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(LS) || '{}') }; } catch { return { ...DEFAULT_SETTINGS }; }
}
export function setSetting(k, v) {
  const s = getSettings(); s[k] = v;
  try { localStorage.setItem(LS, JSON.stringify(s)); } catch (e) { fail(e); }
  return s;
}
export function setAllSettings(obj) {
  const s = { ...DEFAULT_SETTINGS, ...(obj || {}) };
  try { localStorage.setItem(LS, JSON.stringify(s)); } catch (e) { fail(e); }
}
function fail(e) {
  console.error(e);
  try { window.dispatchEvent(new CustomEvent('lexora:error', { detail: e?.message || String(e) })); } catch { /* node */ }
}

/* ---------- IndexedDB ---------- */
const req = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const txDone = (t) => new Promise((res, rej) => {
  t.oncomplete = () => res(); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error || new Error('İşlem iptal edildi'));
});
function openDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => { for (const s of STORES) r.result.createObjectStore(s, { keyPath: KEYS[s] }); };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
    r.onblocked = () => rej(new Error('Veritabanı başka bir sekme tarafından engelleniyor'));
  });
}

export async function initStorage() {
  try { idb = await openDB(); persistent = true; } catch (e) { console.warn('IndexedDB kullanılamıyor:', e); persistent = false; }
  await loadData();
  await migrate();
  return persistent;
}

/** loadData: kalıcı depodan bütün durumu belleğe yükler. */
export async function loadData() {
  let rows = STORES.map(() => []);
  if (persistent) {
    const t = idb.transaction(STORES, 'readonly');
    rows = await Promise.all(STORES.map((s) => req(t.objectStore(s).getAll())));
  }
  const [w, p, e, d, m] = rows;
  state.words = w; state.wordMap = new Map(w.map((x) => [x.id, x]));
  state.progress = Object.fromEntries(p.map((x) => [x.id, x]));
  state.exams = e.sort((a, b) => a.date.localeCompare(b.date));
  state.daily = Object.fromEntries(d.map((x) => [x.date, x]));
  state.meta = Object.fromEntries(m.map((x) => [x.key, x.value]));
  state.grammarProgress = state.meta.grammarProgress && typeof state.meta.grammarProgress === 'object' ? { ...state.meta.grammarProgress } : {};
}

function applyToState(store, obj) {
  if (store === 'words') {
    if (state.wordMap.has(obj.id)) state.words[state.words.findIndex((w) => w.id === obj.id)] = obj;
    else state.words.push(obj);
    state.wordMap.set(obj.id, obj);
  } else if (store === 'progress') state.progress[obj.id] = obj;
  else if (store === 'exams') {
    const i = state.exams.findIndex((x) => x.id === obj.id);
    if (i >= 0) state.exams[i] = obj; else state.exams.push(obj);
  } else if (store === 'daily') state.daily[obj.date] = obj;
  else if (store === 'meta') {
    state.meta[obj.key] = obj.value;
    if (obj.key === 'grammarProgress') state.grammarProgress = obj.value && typeof obj.value === 'object' ? { ...obj.value } : {};
  }
}
function removeFromState(store, key) {
  if (store === 'words') { state.words = state.words.filter((w) => w.id !== key); state.wordMap.delete(key); }
  else if (store === 'progress') delete state.progress[key];
  else if (store === 'daily') delete state.daily[key];
  else if (store === 'exams') state.exams = state.exams.filter((x) => x.id !== key);
  else if (store === 'meta') {
    delete state.meta[key];
    if (key === 'grammarProgress') state.grammarProgress = {};
  }
}

/** saveData: tek kayıt yazar (bellek anında, IndexedDB hemen ardından). Hata kullanıcıya bildirilir. */
export async function saveData(store, obj) {
  applyToState(store, obj);
  if (!persistent) return;
  try { await req(idb.transaction([store], 'readwrite').objectStore(store).put(obj)); } catch (e) { fail(e); }
}
/** Toplu yazım: tek işlemde (atomik). Başarısızsa durum değişmez ve hata fırlatılır. */
export async function saveMany(store, arr) {
  if (persistent) {
    const t = idb.transaction([store], 'readwrite');
    const os = t.objectStore(store);
    arr.forEach((o) => os.put(o));
    await txDone(t);
  }
  arr.forEach((o) => applyToState(store, o));
}
export async function deleteData(store, key) {
  removeFromState(store, key);
  if (!persistent) return;
  try { await req(idb.transaction([store], 'readwrite').objectStore(store).delete(key)); } catch (e) { fail(e); }
}
export const getMeta = (k, d = null) => (k in state.meta ? state.meta[k] : d);
export const setMeta = (key, value) => saveData('meta', { key, value });
export function getProgress(id) { return state.progress[id] || newProgress(id); }
export const saveProgress = (p) => saveData('progress', p);

/* ---------- Grammar İlerleme Kaydı (IndexedDB meta.grammarProgress içinde kalıcı) ---------- */
export function newGrammarProgress(topicId) {
  return {
    topicId,
    attempts: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    lastScore: null,
    bestScore: null,
    completed: false,
    lastStudiedAt: null,
  };
}
export function getGrammarProgress(topicId) {
  const cur = state.grammarProgress[topicId];
  return cur ? { ...newGrammarProgress(topicId), ...cur } : newGrammarProgress(topicId);
}
export async function saveGrammarProgress(gp) {
  if (!gp || typeof gp.topicId !== 'string') throw new Error('Geçersiz grammar ilerleme kaydı');
  const norm = { ...newGrammarProgress(gp.topicId), ...gp };
  state.grammarProgress[norm.topicId] = norm;
  await setMeta('grammarProgress', { ...state.grammarProgress });
  return norm;
}

/** Bütün depoları tek işlemde değiştirir (yedek geri yükleme / sıfırlama). */
export async function replaceAll(data) {
  const rawMeta = Array.isArray(data.meta) ? [...data.meta] : [];
  let gpMap = {};
  const metaGp = rawMeta.find((x) => x && x.key === 'grammarProgress')?.value;
  if (metaGp && typeof metaGp === 'object' && !Array.isArray(metaGp)) gpMap = { ...metaGp };
  if (Array.isArray(data.grammarProgress)) {
    for (const item of data.grammarProgress) {
      if (item && typeof item.topicId === 'string') gpMap[item.topicId] = { ...newGrammarProgress(item.topicId), ...item };
    }
  } else if (data.grammarProgress && typeof data.grammarProgress === 'object') {
    for (const [k, item] of Object.entries(data.grammarProgress)) {
      if (item && typeof item === 'object') gpMap[k] = { ...newGrammarProgress(k), ...item, topicId: k };
    }
  }
  const filteredMeta = rawMeta.filter((x) => x && x.key !== 'grammarProgress');
  if (Object.keys(gpMap).length > 0) filteredMeta.push({ key: 'grammarProgress', value: gpMap });
  const sets = { words: data.words || [], progress: data.progress || [], exams: data.exams || [], daily: data.daily || [], meta: filteredMeta };
  if (persistent) {
    const t = idb.transaction(STORES, 'readwrite');
    for (const s of STORES) { const os = t.objectStore(s); os.clear(); sets[s].forEach((o) => os.put(o)); }
    await txDone(t);
  }
  if (!persistent) {
    state.words = sets.words; state.wordMap = new Map(sets.words.map((x) => [x.id, x]));
    state.progress = Object.fromEntries(sets.progress.map((x) => [x.id, x]));
    state.exams = sets.exams; state.daily = Object.fromEntries(sets.daily.map((x) => [x.date, x]));
    state.meta = Object.fromEntries(sets.meta.map((x) => [x.key, x.value]));
    state.grammarProgress = { ...gpMap };
  } else await loadData();
}

/* ---------- Şema sürümleme / taşıma ---------- */
// MIGRATIONS[i]: i → i+1 sürümüne taşır. Gelecekte buraya eklenir; eski veriler korunur.
const MIGRATIONS = [];
export async function migrate() {
  const v = state.meta.schemaVersion || 0;
  if (v > SCHEMA_VERSION) console.warn('Veri şeması uygulamadan yeni; salt okunur davranılabilir.');
  for (let i = v; i < SCHEMA_VERSION; i++) if (MIGRATIONS[i]) await MIGRATIONS[i](state);
  const changed = [];
  for (const p of Object.values(state.progress)) {
    const n = { ...newProgress(p.id), ...p };
    if (Object.keys(n).length !== Object.keys(p).length) { state.progress[p.id] = n; changed.push(n); }
  }
  if (changed.length) await saveMany('progress', changed);
  if (v < SCHEMA_VERSION) await setMeta('schemaVersion', SCHEMA_VERSION);
}
