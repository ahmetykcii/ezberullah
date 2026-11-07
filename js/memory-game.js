// LEXORA (VELUNO) — Eşini Bul (Hafıza ve Eşleştirme Oyunu)
// Yalnızca Kelime Defterim'de kullanılır. Hazır A2/B1/B2 4 aşamalı öğrenme sistemine dahil DEĞİLDİR.
//
// Tasarım ilkeleri:
// - Eşleştirme, ekrandaki metinler üzerinden DEĞİL, benzersiz kelime kayıt kimliği (pairId = word.id) üzerinden yapılır.
// - Oyun SRS ilerlemesini (state.progress) hiçbir koşulda değiştirmez; performans ayrı "memoryGameStats" meta kaydında tutulur.
// - Saf (DOM'suz) mantık fonksiyonları dışa aktarılır ve tests/run-tests.mjs içinde test edilir.

import { getMeta, setMeta } from './storage.js';
import { $, $$, esc, toast, sfx } from './ui.js';
import { bumpDaily } from './statistics.js';

export const MEMORY_STAGE = 5;
export const MEMORY_ROUND_SIZE = 16;      // 16 kelime → 32 kart
export const MEMORY_MIN_PAIRS = 2;        // daha azıyla anlamlı bir oyun kurulamaz
export const MISMATCH_DELAY_MS = 1200;    // yanlış eşleşmede kartların otomatik kapanma süresi (1–1,5 sn)

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
 * Bir tur için en çok 16 çift seçer.
 * Öncelik: (1) oturumdaki kelimeler (priorityIds) → (2) henüz oynanmamışlar → (3) daha önce oynananlar.
 * Tüm kelimeler oynanmışsa havuz sıfırlanır (resetPool: true).
 * Aynı görünen İngilizce veya Türkçe metne sahip çiftler aynı tura konmaz (oyuncunun ayırt edemeyeceği durum
 * oluşmaz); çakışanlar sonraki turlara bırakılır (deferred).
 */
export function selectRoundPairs(pairs, { played = [], size = MEMORY_ROUND_SIZE, priorityIds = [], rnd = Math.random } = {}) {
  const all = Array.isArray(pairs) ? pairs : [];
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
    if (selected.length >= size) break;
    if (usedEn.has(p.enKey) || usedTr.has(p.trKey)) { deferred.push(p); continue; }
    usedEn.add(p.enKey);
    usedTr.add(p.trKey);
    selected.push(p);
  }
  const nextPlayed = [...new Set([...playedSet, ...selected.map((p) => p.id)])];
  return { selected, deferred, resetPool, nextPlayed };
}

/** 2 × N kart oluşturur ve karıştırır. Her kart, ait olduğu kelimenin kimliğini (pairId) taşır. */
export function buildMemoryCards(pairs, rnd = Math.random) {
  const cards = [];
  for (const p of pairs) {
    cards.push({ uid: `${p.id}::en`, pairId: p.id, side: 'en', text: p.en, state: 'hidden' });
    cards.push({ uid: `${p.id}::tr`, pairId: p.id, side: 'tr', text: p.tr, state: 'hidden' });
  }
  return defaultShuffle(cards, rnd);
}

export function createMemoryGame(pairs, { rnd = Math.random, now = Date.now() } = {}) {
  return {
    pairs: [...pairs],
    cards: buildMemoryCards(pairs, rnd),
    open: [],
    locked: false,
    attempts: 0,
    matches: 0,
    total: pairs.length,
    startedAt: now,
    finishedAt: null,
  };
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

/* ---------- Ayrı istatistik ve tur havuzu kaydı (SRS'ten bağımsız) ---------- */
// meta.memoryGameStats    = { [userId]: { gamesStarted, gamesCompleted, totalMatches, totalAttempts, bestTimeSec, bestAttempts, lastPlayedAt } }
// meta.memoryGameRotation = { [`${userId}::${scopeKey}`]: [wordId, ...] }  — oynanan kelimeler (tur havuzu)

export function getMemoryRotation(userId, scopeKey) {
  const all = getMeta('memoryGameRotation') || {};
  const v = all[`${userId}::${scopeKey}`];
  return Array.isArray(v) ? v : [];
}

export async function saveMemoryRotation(userId, scopeKey, ids) {
  const all = { ...(getMeta('memoryGameRotation') || {}) };
  all[`${userId}::${scopeKey}`] = [...new Set(ids)];
  await setMeta('memoryGameRotation', all);
}

export function getMemoryStats(userId) {
  const all = getMeta('memoryGameStats') || {};
  return { gamesStarted: 0, gamesCompleted: 0, totalMatches: 0, totalAttempts: 0, bestTimeSec: null, bestAttempts: null, lastPlayedAt: null, ...(all[userId] || {}) };
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
 * Bir tur hazırlar (UI'den bağımsız; testlerde de kullanılır).
 * getWords() her çağrıda GÜNCEL Kelime Defterim kayıtlarını döndürmelidir (ekleme/düzenleme/silme anında yansır).
 */
export async function prepareMemoryRound({ getWords, userId = 'guest', scopeKey = 'all', priorityIds = [], rnd = Math.random, repeatIds = null } = {}) {
  const words = typeof getWords === 'function' ? getWords() : [];
  const { pairs, skipped } = prepareMemoryPairs(words);
  if (pairs.length < MEMORY_MIN_PAIRS) {
    return { ok: false, pairs, skipped, error: `Eşini Bul oyunu için en az ${MEMORY_MIN_PAIRS} geçerli kelime (İngilizce + Türkçe anlam) gerekir.` };
  }
  let selected, deferred = [], resetPool = false;
  if (Array.isArray(repeatIds) && repeatIds.length) {
    // Yeniden Oyna: aynı kelimeler (güncel verilerle), yeni karıştırma
    const byId = new Map(pairs.map((p) => [p.id, p]));
    selected = repeatIds.map((id) => byId.get(id)).filter(Boolean);
    if (selected.length < MEMORY_MIN_PAIRS) return prepareMemoryRound({ getWords, userId, scopeKey, priorityIds, rnd });
  } else {
    const played = getMemoryRotation(userId, scopeKey);
    const r = selectRoundPairs(pairs, { played, priorityIds, rnd });
    selected = r.selected; deferred = r.deferred; resetPool = r.resetPool;
    await saveMemoryRotation(userId, scopeKey, r.nextPlayed);
  }
  return {
    ok: true,
    pairs,
    skipped,
    selected,
    deferred,
    resetPool,
    poolSize: pairs.length,
    hasNextRound: pairs.length > selected.length,
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
 * @param {object} opts
 *  - getWords: () => güncel kelime kayıtları (Kelime Defterim listesi / tüm kelimeler / bilinmeyenler)
 *  - userId, scopeKey, title
 *  - priorityIds: aynı oturumda önceki aşamalarda çalışılan kelimeler (önce bunlar kullanılır)
 *  - fromSession: diğer aşamalarla birlikte seçildiyse true (oturum sayacı tekrar artırılmaz)
 *  - stageCount: seçilen toplam aşama sayısı (sonuç ekranında gösterilir)
 */
export async function startMemoryGame(opts = {}) {
  const { userId = 'guest', scopeKey = 'all', title = 'Eşini Bul', priorityIds = [], fromSession = false, stageCount = 1, rnd = Math.random } = opts;
  const round = await prepareMemoryRound({ ...opts, userId, scopeKey, priorityIds, rnd });
  if (!round.ok) {
    toast(round.error, 'error');
    if (view()) leaveGame();
    return { ok: false, error: round.error };
  }
  const game = createMemoryGame(round.selected, { rnd });
  await recordMemoryGame(userId, { started: true });
  if (view()) renderGame(game, round, { ...opts, userId, scopeKey, title, fromSession, stageCount });
  return { ok: true, game, round };
}

function infoNote(round) {
  const notes = [];
  const missing = round.skipped.filter((s) => s.reason === 'missing').length;
  const dup = round.skipped.filter((s) => s.reason === 'duplicate').length;
  if (missing) notes.push(`${missing} kelime İngilizce veya Türkçe bilgisi eksik olduğu için oyuna alınmadı.`);
  if (dup) notes.push(`${dup} tekrarlanan kelime çifti yalnızca bir kez kullanıldı.`);
  if (round.deferred.length) notes.push(`Aynı görünen anlama sahip ${round.deferred.length} kelime karışıklık olmaması için sonraki tura bırakıldı.`);
  if (round.resetPool) notes.push('Listedeki bütün kelimeler oynandı; kelime havuzu yeniden başlatıldı.');
  return notes.length ? `<p class="mg-note muted small" role="note">${notes.map(esc).join(' ')}</p>` : '';
}

function renderGame(game, round, ctx) {
  clearTimers();
  const v = view();
  if (!v) return;
  if (typeof document !== 'undefined') document.body.classList.add('focus');
  const n = game.cards.length;
  const cols = n >= 32 ? 8 : n >= 24 ? 6 : n >= 12 ? 4 : Math.max(2, Math.ceil(n / 2));

  v.innerHTML = `<div class="mg" data-memory-game>
    <div class="run-top mg-top">
      <button class="icon-btn" id="mg-exit" aria-label="Oyundan çık">✕</button>
      <h2 class="mg-title">🧠 Eşini Bul</h2>
      <span class="mg-scope muted small">${esc(ctx.title)}</span>
    </div>
    <div class="mg-stats" role="status" aria-live="polite">
      <div class="mg-stat"><span>Doğru eşleşme</span><b id="mg-matches">0/${game.total}</b></div>
      <div class="mg-stat"><span>Deneme</span><b id="mg-attempts">0</b></div>
      <div class="mg-stat"><span>Süre</span><b id="mg-time">00:00</b></div>
      <div class="mg-stat"><span>Kalan</span><b id="mg-left">${game.total}</b></div>
    </div>
    ${infoNote(round)}
    <div class="mg-grid" id="mg-grid" data-cols="${cols}" style="--mg-cols:${cols}" role="grid" aria-label="Hafıza kartları">
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
  v.innerHTML = `<div class="summary mg-result">
    <div class="mg-trophy" aria-hidden="true">🎉</div>
    <h2>Tebrikler! Bütün eşleşmeleri tamamladın!</h2>
    <div class="mg-result-stats">
      <div><span>Eşleşme</span><b>${game.matches}/${game.total}</b></div>
      <div><span>Deneme</span><b>${game.attempts}</b></div>
      <div><span>Süre</span><b>${fmtClock(secs)}</b></div>
    </div>
    ${sessionNote}
    <div class="sum-actions">
      <button type="button" class="btn primary" id="mg-replay">Yeniden Oyna</button>
      ${round.hasNextRound ? '<button type="button" class="btn primary" id="mg-next">Sonraki 16 Kelime</button>' : ''}
      <button type="button" class="btn ghost" id="mg-back">Kelime Defterim'e Dön</button>
    </div>
  </div>`;
  $('#mg-replay', v).onclick = () => startMemoryGame({ ...ctx, repeatIds: game.pairs.map((p) => p.id), fromSession: false });
  const nx = $('#mg-next', v);
  if (nx) nx.onclick = () => startMemoryGame({ ...ctx, priorityIds: [], repeatIds: null, fromSession: false });
  $('#mg-back', v).onclick = () => leaveGame();
}
