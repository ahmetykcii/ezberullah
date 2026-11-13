// LEXORA (VELUNO) — Eşini Bul (Dinamik Hafıza ve Eşleştirme Oyunu · v4.6.1)
// Yalnızca Kelime Defterim'de kullanılır. Hazır A2/B1/B2 4 aşamalı öğrenme sistemine dahil DEĞİLDİR.
//
// Tasarım ilkeleri (v4.6.1):
// - Sabit 16 kelime sınırı kaldırılmıştır. Oyun kartı sayısı = Doğru bilinen (veya seçilen gruptaki) kelime sayısı × 2.
// - Değerlendirme aşamaları (mc, typing, missing) seçildiyse yalnızca o gruptaki tüm seçili değerlendirme aşamalarını
//   hatasız tamamlayan kelimeler oyuna alınır.
// - Yalnızca Eşini Bul (veya Kelimeyi Öğren + Eşini Bul) seçildiyse seçilen çalışma grubundaki kelimelerle oyun kurulur.
// - Sıfır doğru kelime durumunda 0 kartlık oyun açılmaz; kullanıcıya bilgilendirme ve aksiyon seçenekleri sunulur.
// - Eşleştirme, ekrandaki metinler üzerinden DEĞİL, benzersiz kelime kayıt kimliği (pairId = word.id) üzerinden yapılır.
// - Oyun SRS ilerlemesini (state.progress) hiçbir koşulda değiştirmez; performans ayrı "memoryGameStats" meta kaydında tutulur.

import { getMeta, setMeta } from './storage.js';
import * as E from './engine.js';
import { $, $$, esc, toast, sfx, ICONS } from './ui.js';
import { bumpDaily } from './statistics.js';

export const MEMORY_STAGE = 5;
export const MEMORY_MIN_PAIRS = 1;        // 1 doğru kelime = 2 karttan 20 doğru kelime = 40 karta kadar dinamik
export const MISMATCH_DELAY_MS = 1200;    // yanlış eşleşmede kartların otomatik kapanma süresi (1,2 sn)
export const ZERO_CORRECT_MESSAGE =
  'Bu grupta bütün aşamaları doğru tamamladığın bir kelime bulunamadı. Yanlış yaptığın kelimeleri tekrar çalışarak yeniden deneyebilirsin.';

/* ---------- Yardımcılar ---------- */
const textKey = (s) => String(s ?? '').toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ').trim();

function defaultShuffle(a, rnd = Math.random) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

/** Türkçe kart metni: kelimenin güncel anlamlarından (en çok 3) oluşturulur. */
export function meaningText(word) {
  const m = Array.isArray(word?.meanings)
    ? word.meanings
    : String(word?.meanings ?? word?.meaning ?? '').split(/[;,|]/);
  return m.map((x) => String(x ?? '').trim()).filter(Boolean).slice(0, 3).join(', ');
}

/**
 * Kelime Defterim kayıtlarını oyun çiftlerine dönüştürür.
 * - İngilizcesi veya Türkçesi eksik kayıtlar atlanır (reason: 'missing').
 * - Aynı kimlik birden fazla kez geçiyorsa tek sayılır.
 * - Aynı İngilizce–Türkçe çift farklı kimliklerle tekrar ediyorsa yalnızca ilki kullanılır (reason: 'duplicate').
 */
export function prepareMemoryPairs(words) {
  const pairs = [];
  const skipped = [];
  const seenIds = new Set();
  const seenCombo = new Set();
  for (const w of Array.isArray(words) ? words : []) {
    if (!w || !w.id) continue;
    if (seenIds.has(w.id)) continue;
    seenIds.add(w.id);
    const en = String(w.word ?? '').trim();
    const tr = meaningText(w);
    if (!en || !tr) {
      skipped.push({ id: w.id, word: en || '(boş)', reason: 'missing' });
      continue;
    }
    const combo = `${textKey(en)}\u0000${textKey(tr)}`;
    if (seenCombo.has(combo)) {
      skipped.push({ id: w.id, word: en, reason: 'duplicate' });
      continue;
    }
    seenCombo.add(combo);
    pairs.push({ id: w.id, en, tr, enKey: textKey(en), trKey: textKey(tr) });
  }
  return { pairs, skipped };
}

/**
 * Bir tur için uygun çiftleri seçer (sabit 16 sınırı yoktur; size verilmezse tüm uygun çiftleri kullanır).
 * Öncelik: (1) oturumdaki kelimeler (priorityIds) → (2) henüz oynanmamışlar → (3) daha önce oynananlar.
 * Tüm kelimeler oynanmışsa havuz sıfırlanır (resetPool: true).
 * Aynı görünen İngilizce veya Türkçe metne sahip çiftler aynı tura konmaz (oyuncunun ayırt edemeyeceği durum
 * oluşmaz); çakışanlar sonraki turlara bırakılır (deferred).
 */
export function selectRoundPairs(pairs, { played = [], size = null, priorityIds = [], rnd = Math.random } = {}) {
  const all = Array.isArray(pairs) ? pairs : [];
  const limit = size != null && Number(size) > 0 ? Number(size) : all.length;
  const validIds = new Set(all.map((p) => p.id));
  let playedSet = new Set((played || []).filter((id) => validIds.has(id)));
  let resetPool = false;
  if (all.length && all.every((p) => playedSet.has(p.id))) {
    playedSet = new Set();
    resetPool = true;
  }
  const prio = new Set((priorityIds || []).filter((id) => validIds.has(id)));
  const prioList = defaultShuffle(all.filter((p) => prio.has(p.id)), rnd);
  const unplayed = defaultShuffle(all.filter((p) => !prio.has(p.id) && !playedSet.has(p.id)), rnd);
  const playedList = defaultShuffle(all.filter((p) => !prio.has(p.id) && playedSet.has(p.id)), rnd);
  const ordered = [...prioList, ...unplayed, ...playedList];

  const selected = [];
  const deferred = [];
  const usedEn = new Set();
  const usedTr = new Set();
  for (const p of ordered) {
    if (selected.length >= limit) break;
    if (usedEn.has(p.enKey) || usedTr.has(p.trKey)) { deferred.push(p); continue; }
    usedEn.add(p.enKey);
    usedTr.add(p.trKey);
    selected.push(p);
  }
  const nextPlayed = [...new Set([...playedSet, ...selected.map((p) => p.id)])];
  return { selected, deferred, resetPool, nextPlayed };
}

/**
 * Verilen kart dizisi ve sütun sayısı için eşler arası mesafe ve komşuluk istatistiklerini hesaplar.
 * - orthogonalAdjacent: yatay veya dikey komşu (Manhattan mesafesi === 1) çift sayısı
 * - diagonalAdjacent: çapraz komşu (|dr| === 1 && |dc| === 1) çift sayısı
 * - minManhattan / avgManhattan: eşler arası minimum ve ortalama Manhattan mesafesi
 * - penalty: yerleşim maliyeti (düşük = daha uzak ve zor yerleşim)
 */
export function scoreMemoryLayout(cards, cols) {
  const C = Math.max(2, Number(cols) || 2);
  const pos = new Map();
  let orthogonalAdjacent = 0;
  let diagonalAdjacent = 0;
  let totalManhattan = 0;
  let minManhattan = Infinity;
  let pairCount = 0;
  let penalty = 0;

  for (let i = 0; i < cards.length; i++) {
    const pid = cards[i]?.pairId;
    if (!pid) continue;
    if (!pos.has(pid)) {
      pos.set(pid, i);
    } else {
      const a = pos.get(pid);
      const b = i;
      const dr = Math.abs(Math.floor(a / C) - Math.floor(b / C));
      const dc = Math.abs((a % C) - (b % C));
      const manhattan = dr + dc;
      pairCount++;
      totalManhattan += manhattan;
      if (manhattan < minManhattan) minManhattan = manhattan;
      if (manhattan === 1) {
        orthogonalAdjacent++;
        penalty += 1000; // Yatay/dikey komşuluğa yüksek ceza
      } else if (dr === 1 && dc === 1) {
        diagonalAdjacent++;
        penalty += 140; // Çapraz yakınlığa daha düşük ceza
      }
      if (Math.abs(a - b) === 1 && manhattan > 1) {
        penalty += 25; // Satır sonu-başı doğrusal ardışıklık için hafif ceza
      }
      penalty -= manhattan * 12; // Büyük Manhattan mesafesini ödüllendir
    }
  }

  return {
    penalty,
    orthogonalAdjacent,
    diagonalAdjacent,
    totalManhattan,
    minManhattan: pairCount ? minManhattan : 0,
    avgManhattan: pairCount ? totalManhattan / pairCount : 0,
    pairCount,
  };
}

function combinedLayoutPenalty(cards, colCounts) {
  let sum = 0;
  for (const c of colCounts) sum += scoreMemoryLayout(cards, c).penalty;
  return sum;
}

/**
 * 2 × N kart oluşturur ve İngilizce–Türkçe eşlerini mümkün olduğunca uzak hücrelere yerleştirir.
 * - Birden fazla rastgele aday yerleşim üretir, Manhattan mesafesi ve komşuluk cezalarıyla değerlendirir.
 * - Hem masaüstü hem mobil sütun düzenlerinde yakın eşleşmeleri en aza indiren yerleşimi seçer.
 * - Küçük tahtalarda (ör. 2 veya 3 çift) matematiksel olarak mümkün olan en iyi yerleşimi kullanır.
 */
export function buildMemoryCards(pairs, rnd = Math.random) {
  const base = [];
  for (const p of pairs) {
    base.push({ uid: `${p.id}::en`, pairId: p.id, side: 'en', text: p.en, state: 'hidden' });
    base.push({ uid: `${p.id}::tr`, pairId: p.id, side: 'tr', text: p.tr, state: 'hidden' });
  }
  if (base.length <= 2) return defaultShuffle(base, rnd);

  const cols = computeGridColumns(base.length);
  const colCounts = [...new Set([cols.mobile, cols.desktop].filter((c) => c >= 2))];
  const CANDIDATES = 48;

  let best = defaultShuffle(base, rnd);
  let bestScore = combinedLayoutPenalty(best, colCounts);

  for (let k = 1; k < CANDIDATES; k++) {
    const cand = defaultShuffle(base, rnd);
    const sc = combinedLayoutPenalty(cand, colCounts);
    if (sc < bestScore) {
      best = cand;
      bestScore = sc;
    }
  }

  // Eğer hala yatay/dikey komşu eş varsa sınırlı sayıda rastgele takas ile iyileştir
  if (colCounts.some((c) => scoreMemoryLayout(best, c).orthogonalAdjacent > 0) && base.length >= 6) {
    const MAX_SWAPS = 24;
    for (let s = 0; s < MAX_SWAPS; s++) {
      const i = Math.floor(rnd() * best.length);
      const j = Math.floor(rnd() * best.length);
      if (i === j || best[i].pairId === best[j].pairId) continue;
      [best[i], best[j]] = [best[j], best[i]];
      const sc = combinedLayoutPenalty(best, colCounts);
      if (sc < bestScore) {
        bestScore = sc;
      } else {
        [best[i], best[j]] = [best[j], best[i]];
      }
    }
  }

  return best;
}

export function createMemoryGame(pairs, { rnd = Math.random, now = Date.now() } = {}) {
  const safePairs = Array.isArray(pairs) ? [...pairs] : [];
  return {
    pairs: safePairs,
    cards: buildMemoryCards(safePairs, rnd),
    open: [],
    locked: false,
    attempts: 0,
    matches: 0,
    total: safePairs.length,
    startedAt: now,
    finishedAt: null,
  };
}

/**
 * 2 ile 40 kart arasında ekran boyutuna göre ideal sütun sayısını hesaplar.
 * Özellikle iPhone/mobil ekranlarda 40 kartın küçülüp okunamaz olmasını önlemek için en fazla 4 sütun + dikey kaydırma kullanır.
 */
export function computeGridColumns(cardCount) {
  const n = Math.max(2, Number(cardCount) || 2);
  if (n <= 4) return { desktop: 2, tablet: 2, mobile: 2 };
  if (n <= 8) return { desktop: 4, tablet: 4, mobile: 2 };
  if (n <= 12) return { desktop: 6, tablet: 4, mobile: 3 };
  if (n <= 16) return { desktop: 4, tablet: 4, mobile: 4 };
  if (n <= 20) return { desktop: 5, tablet: 5, mobile: 4 };
  if (n <= 24) return { desktop: 6, tablet: 6, mobile: 4 };
  if (n <= 30) return { desktop: 6, tablet: 5, mobile: 4 };
  return { desktop: 8, tablet: 5, mobile: 4 };
}

/**
 * Bir kartı açar. Dönüş: 'ignored' | 'opened' | 'match' | 'mismatch' | 'complete'
 * - Yanlış eşleşme bekleme süresinde (locked) başka kart açılamaz.
 * - Aynı anda en fazla iki kart açık olabilir.
 * - Eşleşme yalnızca pairId aynı VE taraflar farklı (en ↔ tr) ise kabul edilir.
 */
export function flipMemoryCard(game, uid, now = Date.now()) {
  if (!game || game.finishedAt || game.locked) return { result: 'ignored' };
  const card = game.cards.find((c) => c.uid === uid);
  if (!card || card.state !== 'hidden') return { result: 'ignored' };
  if (game.open.length >= 2) return { result: 'ignored' };
  card.state = 'open';
  game.open.push(card.uid);
  if (game.open.length < 2) return { result: 'opened' };

  game.attempts++;
  const [a, b] = game.open.map((id) => game.cards.find((c) => c.uid === id));
  const isMatch = a.pairId === b.pairId && a.side !== b.side;
  if (isMatch) {
    a.state = 'matched';
    b.state = 'matched';
    game.open = [];
    game.matches++;
    if (game.matches >= game.total) {
      game.finishedAt = now;
      return { result: 'complete', cards: [a.uid, b.uid] };
    }
    return { result: 'match', cards: [a.uid, b.uid] };
  }
  game.locked = true;
  return { result: 'mismatch', cards: [a.uid, b.uid] };
}

/** Yanlış eşleşmeden sonra açık kartları otomatik kapatır ve kilidi kaldırır. */
export function resolveMemoryMismatch(game) {
  if (!game) return;
  for (const id of game.open) {
    const c = game.cards.find((x) => x.uid === id);
    if (c && c.state === 'open') c.state = 'hidden';
  }
  game.open = [];
  game.locked = false;
}

export function memoryElapsedSec(game, now = Date.now()) {
  if (!game) return 0;
  const end = game.finishedAt || now;
  return Math.max(0, Math.round((end - game.startedAt) / 1000));
}

export const fmtClock = (sec) => {
  const s = Math.max(0, Math.round(sec || 0));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

/* ---------- Ayrı istatistik, tur havuzu ve eski v4.6.0 veri uyumluluğu (SRS'ten bağımsız) ---------- */
// meta.memoryGameStats    = { [userId]: { gamesStarted, gamesCompleted, totalMatches, totalAttempts, bestTimeSec, bestAttempts, lastPlayedAt } }
// meta.memoryGameRotation = { [`${userId}::${scopeKey}`]: [wordId, ...] }  — oynanan kelimeler (tur havuzu)

/**
 * Eski v4.6.0 hafıza oyunu kayıtlarını (sabit 16 kelimelik tur rotasyonu ve istatistikleri)
 * hiçbir veriyi silmeden v4.6.1 dinamik grup sistemine uyarlar.
 */
export async function adaptLegacyMemoryData() {
  let changed = false;
  const rawStats = getMeta('memoryGameStats');
  if (rawStats && typeof rawStats === 'object') {
    const cleanStats = {};
    for (const [uid, st] of Object.entries(rawStats)) {
      if (!st || typeof st !== 'object') continue;
      cleanStats[uid] = {
        gamesStarted: Math.max(0, Number(st.gamesStarted) || 0),
        gamesCompleted: Math.max(0, Number(st.gamesCompleted) || 0),
        totalMatches: Math.max(0, Number(st.totalMatches) || 0),
        totalAttempts: Math.max(0, Number(st.totalAttempts) || 0),
        bestTimeSec: st.bestTimeSec != null && Number.isFinite(Number(st.bestTimeSec)) ? Number(st.bestTimeSec) : null,
        bestAttempts: st.bestAttempts != null && Number.isFinite(Number(st.bestAttempts)) ? Number(st.bestAttempts) : null,
        lastPlayedAt: st.lastPlayedAt || null,
      };
    }
    await setMeta('memoryGameStats', cleanStats);
    changed = true;
  }

  const rawRot = getMeta('memoryGameRotation');
  if (rawRot && typeof rawRot === 'object') {
    const cleanRot = {};
    for (const [k, val] of Object.entries(rawRot)) {
      if (Array.isArray(val)) {
        cleanRot[k] = [...new Set(val.filter((id) => typeof id === 'string' && id.trim()))];
      } else if (val && typeof val === 'object' && Array.isArray(val.played)) {
        cleanRot[k] = [...new Set(val.played.filter((id) => typeof id === 'string' && id.trim()))];
      }
    }
    await setMeta('memoryGameRotation', cleanRot);
    changed = true;
  }
  return { changed };
}

export function getMemoryRotation(userId, scopeKey) {
  const all = getMeta('memoryGameRotation') || {};
  const v = all[`${userId}::${scopeKey}`];
  if (Array.isArray(v)) return v;
  if (v && typeof v === 'object' && Array.isArray(v.played)) return v.played;
  return [];
}

export async function saveMemoryRotation(userId, scopeKey, ids) {
  const all = { ...(getMeta('memoryGameRotation') || {}) };
  all[`${userId}::${scopeKey}`] = [...new Set((Array.isArray(ids) ? ids : []).filter(Boolean))];
  await setMeta('memoryGameRotation', all);
}

export function getMemoryStats(userId) {
  const all = getMeta('memoryGameStats') || {};
  const raw = all[userId] || {};
  return {
    gamesStarted: Math.max(0, Number(raw.gamesStarted) || 0),
    gamesCompleted: Math.max(0, Number(raw.gamesCompleted) || 0),
    totalMatches: Math.max(0, Number(raw.totalMatches) || 0),
    totalAttempts: Math.max(0, Number(raw.totalAttempts) || 0),
    bestTimeSec: raw.bestTimeSec != null ? Number(raw.bestTimeSec) : null,
    bestAttempts: raw.bestAttempts != null ? Number(raw.bestAttempts) : null,
    lastPlayedAt: raw.lastPlayedAt || null,
  };
}

export async function recordMemoryGame(userId, { completed = false, matches = 0, attempts = 0, seconds = 0, started = false } = {}) {
  const all = { ...(getMeta('memoryGameStats') || {}) };
  const s = getMemoryStats(userId);
  if (started) s.gamesStarted++;
  if (completed) {
    s.gamesCompleted++;
    s.totalMatches += matches;
    s.totalAttempts += attempts;
    if (s.bestTimeSec == null || seconds < s.bestTimeSec) s.bestTimeSec = seconds;
    if (s.bestAttempts == null || attempts < s.bestAttempts) s.bestAttempts = attempts;
  }
  s.lastPlayedAt = new Date().toISOString();
  all[userId] = s;
  await setMeta('memoryGameStats', all);
  return s;
}

/**
 * Bir oyun turu hazırlar (UI'den bağımsız; testlerde de kullanılır).
 * - eligibleWordIds verildiyse (oturum sonu veya grup bazlı oyun): YALNIZCA bu gruptaki kelimeler kullanılır;
 *   grup dışından kelime eklenmez.
 * - hasEvalStages === true ve eligibleWordIds boşsa: Sıfır doğru kelime durumu (zeroCorrect: true) döner.
 * - groupSize verildiyse (yalnızca Eşini Bul seçildiğinde): seçilen grup büyüklüğü kadar kelime kullanılır.
 */
export async function prepareMemoryRound({
  getWords,
  userId = 'guest',
  scopeKey = 'all',
  priorityIds = [],
  eligibleWordIds = null,
  hasEvalStages = false,
  groupSize = null,
  minPairs = null,
  rnd = Math.random,
  repeatIds = null,
} = {}) {
  const allWords = typeof getWords === 'function' ? getWords() : (Array.isArray(getWords) ? getWords : []);
  const { pairs: allPoolPairs, skipped: allSkipped } = prepareMemoryPairs(allWords);

  // 1) Değerlendirme aşamalı bir oturum sonunda hiçbir kelime tam doğru cevaplanamadıysa:
  if (hasEvalStages && Array.isArray(eligibleWordIds) && eligibleWordIds.length === 0) {
    return {
      ok: true,
      zeroCorrect: true,
      pairs: allPoolPairs,
      skipped: allSkipped,
      selected: [],
      deferred: [],
      resetPool: false,
      poolSize: allPoolPairs.length,
      hasNextRound: allPoolPairs.length > 0,
      message: ZERO_CORRECT_MESSAGE,
    };
  }

  // 2) Grup bazlı filtreleme: eligibleWordIds verildiyse yalnızca o grubun kelimeleri kullanılır
  const hasExplicitGroup = Array.isArray(eligibleWordIds) && eligibleWordIds.length > 0;
  const effectiveMinPairs = minPairs != null ? minPairs : (hasExplicitGroup ? 1 : 2);

  let sourceWords = allWords;
  if (hasExplicitGroup) {
    const allowed = new Set(eligibleWordIds);
    const byId = new Map(allWords.filter((w) => w && allowed.has(w.id)).map((w) => [w.id, w]));
    sourceWords = eligibleWordIds.map((id) => byId.get(id)).filter(Boolean);
  }

  const { pairs, skipped } = prepareMemoryPairs(sourceWords);
  if (pairs.length < effectiveMinPairs) {
    return {
      ok: false,
      zeroCorrect: false,
      pairs,
      skipped,
      error: `Eşini Bul oyunu için en az ${effectiveMinPairs} geçerli kelime (İngilizce + Türkçe anlam) gerekir.`,
    };
  }

  let selected = [];
  let deferred = [];
  let resetPool = false;

  if (Array.isArray(repeatIds) && repeatIds.length) {
    // Yeniden Oyna: aynı kelimeler (güncel verilerle), yeni karıştırma
    const byId = new Map(pairs.map((p) => [p.id, p]));
    const repPairs = repeatIds.map((id) => byId.get(id)).filter(Boolean);
    const r = selectRoundPairs(repPairs, { size: repPairs.length, rnd });
    selected = r.selected;
    deferred = r.deferred;
    if (selected.length < effectiveMinPairs) {
      return prepareMemoryRound({ getWords, userId, scopeKey, priorityIds, eligibleWordIds, hasEvalStages, groupSize, minPairs, rnd });
    }
  } else if (hasExplicitGroup) {
    // Oturumdan gelen grup kelimeleri: tamamı (çakışmayanlar) kullanılır, dışarıdan kelime alınmaz
    const r = selectRoundPairs(pairs, { size: pairs.length, priorityIds: eligibleWordIds, rnd });
    selected = r.selected;
    deferred = r.deferred;
    const played = getMemoryRotation(userId, scopeKey);
    await saveMemoryRotation(userId, scopeKey, [...played, ...selected.map((p) => p.id)]);
  } else {
    // Doğrudan Eşini Bul seçimi: seçilen grup büyüklüğü (5 / 10 / 15 / 20) veya mevcut kelime sayısı kadar
    const targetSize = groupSize != null ? E.normalizeGroupSize(groupSize) : pairs.length;
    const played = getMemoryRotation(userId, scopeKey);
    const r = selectRoundPairs(pairs, { played, size: targetSize, priorityIds, rnd });
    selected = r.selected;
    deferred = r.deferred;
    resetPool = r.resetPool;
    await saveMemoryRotation(userId, scopeKey, r.nextPlayed);
  }

  return {
    ok: true,
    zeroCorrect: false,
    pairs,
    skipped,
    selected,
    deferred,
    resetPool,
    poolSize: allPoolPairs.length,
    hasNextRound: allPoolPairs.length > selected.length,
  };
}

/* ---------- Arayüz ---------- */
let activeTimer = null;
let activeMismatch = null;
const view = () => (typeof document !== 'undefined' ? document.getElementById('view') : null);

function clearTimers() {
  if (activeTimer) { clearInterval(activeTimer); activeTimer = null; }
  if (activeMismatch) { clearTimeout(activeMismatch); activeMismatch = null; }
}

function leaveGame(returnHash = '#/notebook') {
  clearTimers();
  if (typeof document !== 'undefined') document.body.classList.remove('focus');
  if (typeof location !== 'undefined') {
    if (location.hash === returnHash) window.dispatchEvent(new HashChangeEvent('hashchange'));
    else location.hash = returnHash;
  }
}

/**
 * Eşini Bul oyununu başlatır.
 */
export async function startMemoryGame(opts = {}) {
  const {
    userId = 'guest',
    scopeKey = 'all',
    title = 'Eşini Bul',
    priorityIds = [],
    eligibleWordIds = null,
    failedWordIds = [],
    hasEvalStages = false,
    groupSize = null,
    fromSession = false,
    stageCount = 1,
    onRetryFailed = null,
    onNextGroup = null,
    rnd = Math.random,
  } = opts;

  const round = await prepareMemoryRound({
    ...opts,
    userId,
    scopeKey,
    priorityIds,
    eligibleWordIds,
    hasEvalStages,
    groupSize,
    rnd,
  });

  if (!round.ok) {
    toast(round.error, 'error');
    if (view()) leaveGame();
    return { ok: false, error: round.error };
  }

  const ctx = {
    ...opts,
    userId,
    scopeKey,
    title,
    eligibleWordIds,
    failedWordIds,
    hasEvalStages,
    groupSize,
    fromSession,
    stageCount,
    onRetryFailed,
    onNextGroup,
  };

  if (round.zeroCorrect) {
    if (view()) renderZeroCorrect(round, ctx);
    return {
      ok: true,
      zeroCorrect: true,
      game: null,
      round,
      message: ZERO_CORRECT_MESSAGE,
    };
  }

  const game = createMemoryGame(round.selected, { rnd });
  await recordMemoryGame(userId, { started: true });
  if (view()) renderGame(game, round, ctx);
  return { ok: true, zeroCorrect: false, game, round };
}

function renderZeroCorrect(round, ctx) {
  clearTimers();
  const v = view();
  if (!v) return;
  if (typeof document !== 'undefined') document.body.classList.add('focus');

  v.innerHTML = `<div class="summary mg-result mg-zero-state" data-memory-zero>
    <div class="mg-trophy" aria-hidden="true">${ICONS.target}</div>
    <h2>Eşini Bul — Hafıza Oyunu</h2>
    <p class="mg-zero-msg">${esc(ZERO_CORRECT_MESSAGE)}</p>
    <div class="sum-actions">
      <button type="button" class="btn primary" id="mg-retry-failed">Yanlış Kelimeleri Tekrar Çalış</button>
      <button type="button" class="btn primary" id="mg-next-group">Sonraki Gruba Geç</button>
      <button type="button" class="btn ghost" id="mg-back">Kelime Defterim'e Dön</button>
    </div>
  </div>`;

  const retryBtn = $('#mg-retry-failed', v);
  if (retryBtn) {
    retryBtn.onclick = async () => {
      clearTimers();
      if (typeof ctx.onRetryFailed === 'function') {
        await ctx.onRetryFailed(ctx.failedWordIds);
      } else {
        leaveGame();
      }
    };
  }

  const nextBtn = $('#mg-next-group', v);
  if (nextBtn) {
    nextBtn.onclick = async () => {
      clearTimers();
      if (typeof ctx.onNextGroup === 'function') {
        await ctx.onNextGroup();
      } else {
        await startMemoryGame({ ...ctx, eligibleWordIds: null, hasEvalStages: false, fromSession: false });
      }
    };
  }

  const backBtn = $('#mg-back', v);
  if (backBtn) backBtn.onclick = () => leaveGame();
}

function infoNote(round, ctx) {
  const notes = [];
  if (ctx?.hasEvalStages && Array.isArray(ctx?.eligibleWordIds)) {
    const totalGroup = (ctx.eligibleWordIds.length || 0) + (ctx.failedWordIds?.length || 0);
    if (ctx.failedWordIds?.length > 0 && round.selected.length > 0) {
      notes.push(`Bu gruptaki ${totalGroup} kelimeden tüm değerlendirme aşamalarını hatasız tamamladığın ${round.selected.length} kelime (${round.selected.length * 2} kart) oyuna alındı.`);
    }
  }
  const missing = round.skipped.filter((s) => s.reason === 'missing').length;
  const dup = round.skipped.filter((s) => s.reason === 'duplicate').length;
  if (missing) notes.push(`${missing} kelime İngilizce veya Türkçe bilgisi eksik olduğu için oyuna alınmadı.`);
  if (dup) notes.push(`${dup} tekrarlanan kelime çifti yalnızca bir kez kullanıldı.`);
  if (round.deferred.length) notes.push(`Aynı görünen anlama sahip ${round.deferred.length} kelime karışıklık olmaması için bu tur dışında tutuldu (oyunda ${round.selected.length} uygun çift gösteriliyor).`);
  if (round.resetPool) notes.push('Listedeki bütün kelimeler oynandı; kelime havuzu yeniden başlatıldı.');
  return notes.length ? `<p class="mg-note muted small" role="note">${notes.map(esc).join(' ')}</p>` : '';
}

function renderGame(game, round, ctx) {
  clearTimers();
  const v = view();
  if (!v) return;
  if (typeof document !== 'undefined') document.body.classList.add('focus');
  const n = game.cards.length;
  const gridCols = computeGridColumns(n);

  v.innerHTML = `<div class="mg" data-memory-game data-card-count="${n}">
    <div class="run-top mg-top">
      <button class="icon-btn" id="mg-exit" aria-label="Oyundan çık">✕</button>
      <h2 class="mg-title">${ICONS.grid} Eşini Bul (${game.total} Kelime · ${n} Kart)</h2>
      <span class="mg-scope muted small">${esc(ctx.title)}</span>
    </div>
    <div class="mg-stats" role="status" aria-live="polite">
      <div class="mg-stat"><span>Doğru eşleşme</span><b id="mg-matches">0/${game.total}</b></div>
      <div class="mg-stat"><span>Deneme</span><b id="mg-attempts">0</b></div>
      <div class="mg-stat"><span>Süre</span><b id="mg-time">00:00</b></div>
      <div class="mg-stat"><span>Kalan</span><b id="mg-left">${game.total}</b></div>
    </div>
    ${infoNote(round, ctx)}
    <div class="mg-grid" id="mg-grid" data-cols="${gridCols.desktop}" style="--mg-cols:${gridCols.desktop};--mg-cols-tablet:${gridCols.tablet};--mg-cols-mobile:${gridCols.mobile}" role="grid" aria-label="Hafıza kartları">
      ${game.cards.map((c, i) => `
        <button type="button" class="mg-card" data-uid="${esc(c.uid)}" data-side="${c.side}" aria-label="Kapalı kart ${i + 1}">
          <span class="mg-inner">
            <span class="mg-face mg-back" aria-hidden="true">?</span>
            <span class="mg-face mg-front"><small class="mg-lang">${c.side === 'en' ? 'EN' : 'TR'}</small><span class="mg-text">${esc(c.text)}</span></span>
          </span>
        </button>`).join('')}
    </div>
  </div>`;

  const grid = $('#mg-grid', v);
  const tick = () => {
    if (!document.body.contains(grid)) { clearTimers(); return; } // başka sayfaya geçildi
    const t = $('#mg-time', v);
    if (t) t.textContent = fmtClock(memoryElapsedSec(game));
  };
  activeTimer = setInterval(tick, 1000);

  const sync = () => {
    $$('.mg-card', grid).forEach((el) => {
      const c = game.cards.find((x) => x.uid === el.dataset.uid);
      if (!c) return;
      el.classList.toggle('open', c.state === 'open');
      el.classList.toggle('matched', c.state === 'matched');
      el.disabled = c.state === 'matched';
      el.setAttribute('aria-label', c.state === 'hidden' ? 'Kapalı kart' : `${c.side === 'en' ? 'İngilizce' : 'Türkçe'}: ${c.text}`);
    });
    grid.classList.toggle('locked', game.locked);
    $('#mg-matches', v).textContent = `${game.matches}/${game.total}`;
    $('#mg-attempts', v).textContent = String(game.attempts);
    $('#mg-left', v).textContent = String(game.total - game.matches);
  };

  grid.addEventListener('click', (e) => {
    const el = e.target.closest('.mg-card');
    if (!el) return;
    const res = flipMemoryCard(game, el.dataset.uid);
    if (res.result === 'ignored') return;
    sync();
    if (res.result === 'match' || res.result === 'complete') {
      try { sfx('ok'); } catch { /* */ }
      res.cards.forEach((id) => { const c = grid.querySelector(`[data-uid="${CSS.escape(id)}"]`); if (c) { c.classList.add('pop'); setTimeout(() => c.classList.remove('pop'), 500); } });
      if (res.result === 'complete') setTimeout(() => finishGame(game, round, ctx), 650);
    } else if (res.result === 'mismatch') {
      try { sfx('bad'); } catch { /* */ }
      res.cards.forEach((id) => { const c = grid.querySelector(`[data-uid="${CSS.escape(id)}"]`); if (c) c.classList.add('wrong'); });
      activeMismatch = setTimeout(() => {
        activeMismatch = null;
        $$('.mg-card.wrong', grid).forEach((c) => c.classList.remove('wrong'));
        resolveMemoryMismatch(game);
        sync();
      }, MISMATCH_DELAY_MS);
    }
  });

  $('#mg-exit', v).onclick = () => leaveGame();
}

async function finishGame(game, round, ctx) {
  clearTimers();
  const secs = memoryElapsedSec(game);
  await recordMemoryGame(ctx.userId, { completed: true, matches: game.matches, attempts: game.attempts, seconds: secs });
  // Oyun SRS'i değiştirmez; yalnızca günlük çalışma süresi ve (tek başına seçildiyse) oturum sayısı kaydedilir.
  try { await bumpDaily(ctx.fromSession ? { seconds: secs } : { seconds: secs, sessionsCompleted: 1 }); } catch { /* */ }
  const v = view();
  if (!v) return;
  const sessionNote = ctx.fromSession ? `<p class="muted small">Seçtiğin ${ctx.stageCount} aşamanın tamamı bitti. Çalışma oturumu tamamlandı.</p>` : '';
  const showNextBtn = Boolean(round.hasNextRound || typeof ctx.onNextGroup === 'function');
  v.innerHTML = `<div class="summary mg-result">
    <div class="mg-trophy" aria-hidden="true">${ICONS.star}</div>
    <h2>Tebrikler! Bütün eşleşmeleri tamamladın!</h2>
    <div class="mg-result-stats">
      <div><span>Eşleşme</span><b>${game.matches}/${game.total}</b></div>
      <div><span>Deneme</span><b>${game.attempts}</b></div>
      <div><span>Süre</span><b>${fmtClock(secs)}</b></div>
    </div>
    ${sessionNote}
    <div class="sum-actions">
      <button type="button" class="btn primary" id="mg-replay">Yeniden Oyna</button>
      ${showNextBtn ? '<button type="button" class="btn primary" id="mg-next">Sonraki Kelime Grubu</button>' : ''}
      <button type="button" class="btn ghost" id="mg-back">Kelime Defterim'e Dön</button>
    </div>
  </div>`;
  $('#mg-replay', v).onclick = () => startMemoryGame({ ...ctx, repeatIds: game.pairs.map((p) => p.id), fromSession: false });
  const nx = $('#mg-next', v);
  if (nx) {
    nx.onclick = async () => {
      if (typeof ctx.onNextGroup === 'function') {
        await ctx.onNextGroup();
      } else {
        await startMemoryGame({ ...ctx, eligibleWordIds: null, hasEvalStages: false, priorityIds: [], repeatIds: null, fromSession: false });
      }
    };
  }
  $('#mg-back', v).onclick = () => leaveGame();
}
