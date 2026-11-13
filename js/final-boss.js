// VELUNO — Kelime Defterim Final Boss Sınav Sistemi
// Her kişisel kelime listesinin sonunda tüm duraklar (Learned/Mastered) tamamlandığında açılır.
// - Listedeki BÜTÜN kelimeleri kapsar; ilk tur puanı (0-100) yalnızca ilk denemeden hesaplanır.
// - İlk turda yanlış yapılan kelimeler telafi edilmeden liste başarıyla tamamlanmış sayılmaz.
// - Mevcut SRS ilerlemesini (state.progress) ve sabit durakları kesinlikle değiştirmez.

import { state, getMeta, setMeta } from './storage.js';
import * as E from './engine.js';
import { $, esc, openModal, toast, successMark } from './ui.js';
import { getListPathStops, summarizePath } from './paths.js';
import { handlers, startSession, abortSession } from './learning.js';
import { bumpDaily } from './statistics.js';

export const FINAL_BOSS_META_KEY = 'finalBossProgress';
const EVAL_TYPES = ['mc', 'typing', 'missing', 'sentence'];
const REMED_TYPES = ['typing', 'mc', 'missing'];

/* ---------- Veri Katmanı ---------- */
export function getAllFinalBossRecords() {
  const raw = getMeta(FINAL_BOSS_META_KEY);
  return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
}

export function getFinalBossRecord(listId) {
  if (!listId) return null;
  const all = getAllFinalBossRecords();
  const rec = all[listId];
  return rec && typeof rec === 'object' ? rec : null;
}

async function saveFinalBossRecord(listId, rec) {
  const all = { ...getAllFinalBossRecords(), [listId]: rec };
  await setMeta(FINAL_BOSS_META_KEY, all);
  return rec;
}

export async function removeFinalBossRecord(listId) {
  if (!listId) return false;
  const all = { ...getAllFinalBossRecords() };
  if (!(listId in all)) return false;
  delete all[listId];
  await setMeta(FINAL_BOSS_META_KEY, all);
  return true;
}

/* ---------- Açılma & Tamamlanma Kontrolleri ---------- */
export function getListActiveWordIds(list) {
  if (!list || !Array.isArray(list.wordIds)) return [];
  return [...new Set(list.wordIds.filter((id) => state.wordMap.has(id)))];
}

/** Listedeki tüm duraklar (Learned/Mastered) tamamlandı mı? */
export function canUnlockFinalBoss(list, progress = state.progress) {
  if (!list || !list.id) return { unlocked: false, totalWords: 0, doneWords: 0, totalStops: 0, doneStops: 0 };
  const stops = getListPathStops(list);
  const sum = summarizePath(stops, progress);
  return {
    unlocked: sum.totalWords > 0 && sum.allDone,
    totalWords: sum.totalWords,
    doneWords: sum.doneWords,
    totalStops: sum.totalStops,
    doneStops: sum.doneStops,
  };
}

/**
 * Final Boss güncel liste kapsamı için başarıyla tamamlanmış mı?
 * Liste sonradan yeni kelimelerle genişletildiyse, eski başarı güncel listeyi tamamlanmış saymaz.
 */
export function isFinalBossPassedForList(list, progress = state.progress, records = getAllFinalBossRecords()) {
  if (!list || !list.id) return false;
  const unlock = canUnlockFinalBoss(list, progress);
  if (!unlock.unlocked) return false;
  const rec = records[list.id];
  if (!rec || !rec.lastPassedAttempt || !rec.lastPassedAttempt.passed) return false;
  const currentIds = getListActiveWordIds(list);
  if (!currentIds.length) return false;
  const passedSet = new Set(Array.isArray(rec.lastPassedAttempt.wordIds) ? rec.lastPassedAttempt.wordIds : []);
  return currentIds.every((id) => passedSet.has(id));
}

/* ---------- Sınav Oluşturma & Puanlama ---------- */
export function buildRound1Items(wordIds, rnd = Math.random) {
  const shuffled = E.shuffle([...wordIds], rnd);
  return shuffled.map((wordId, idx) => ({
    wordId,
    type: EVAL_TYPES[idx % EVAL_TYPES.length],
    phase: 'round1',
  }));
}

export function buildRemediationQueue(wrongWordIds, rnd = Math.random) {
  const unique = [...new Set((Array.isArray(wrongWordIds) ? wrongWordIds : []).filter((id) => state.wordMap.has(id)))];
  const shuffled = E.shuffle(unique, rnd);
  return shuffled.map((wordId, idx) => ({
    wordId,
    type: REMED_TYPES[idx % REMED_TYPES.length],
    phase: 'remediation',
  }));
}

export function createFinalBossAttempt(list, rnd = Math.random, now = Date.now()) {
  const wordIds = getListActiveWordIds(list);
  const round1Items = buildRound1Items(wordIds, rnd);
  return {
    attemptId: `fb_${now}_${Math.floor(rnd() * 10000)}`,
    startedAt: new Date(now).toISOString(),
    phase: 'round1',
    wordIds,
    round1Items,
    round1Idx: 0,
    round1Results: {},
    wrongWordIds: [],
    remediationQueue: [],
    remediationIdx: 0,
    firstRoundScore: null,
    firstRoundCorrect: 0,
    firstRoundWrong: 0,
    completedAt: null,
  };
}

export function computeFirstRoundScore(correctCount, totalCount) {
  if (!totalCount || totalCount <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((correctCount / totalCount) * 100)));
}

/**
 * Bir Final Boss cevabını kalıcı olarak kaydeder.
 * - SRS ilerlemesine (state.progress) KESİNLİKLE dokunmaz.
 * - İlk tur puanı yalnızca ilk tur bitiminde belirlenir; telafi doğru cevapları puanı yükseltmez.
 */
export async function recordFinalBossAnswer(listId, userId, { wordId, correct, phase }, now = Date.now()) {
  const rec = getFinalBossRecord(listId) || {
    listId,
    userId,
    activeAttempt: null,
    attempts: [],
    bestScore: null,
    lastPassedAttempt: null,
  };
  const att = rec.activeAttempt;
  if (!att) return rec;

  if (phase === 'round1') {
    if (!(wordId in att.round1Results)) {
      att.round1Results[wordId] = Boolean(correct);
      if (!correct && !att.wrongWordIds.includes(wordId)) {
        att.wrongWordIds.push(wordId);
      }
    }
    att.round1Idx = Math.min(att.round1Items.length, att.round1Idx + 1);

    if (att.round1Idx >= att.round1Items.length) {
      const total = att.wordIds.length;
      const correctCount = Object.values(att.round1Results).filter(Boolean).length;
      const wrongCount = Math.max(0, total - correctCount);
      att.firstRoundCorrect = correctCount;
      att.firstRoundWrong = wrongCount;
      att.firstRoundScore = computeFirstRoundScore(correctCount, total);

      if (att.wrongWordIds.length === 0) {
        finalizePassedAttempt(rec, att, now);
      } else {
        att.phase = 'remediation';
        att.remediationQueue = [];
        att.remediationIdx = 0;
      }
    }
  } else if (phase === 'remediation') {
    if (correct) {
      att.wrongWordIds = att.wrongWordIds.filter((id) => id !== wordId);
    } else if (!att.wrongWordIds.includes(wordId)) {
      att.wrongWordIds.push(wordId);
    }
    att.remediationIdx = Math.min(att.remediationQueue.length, att.remediationIdx + 1);

    if (att.remediationIdx >= att.remediationQueue.length && att.wrongWordIds.length === 0) {
      finalizePassedAttempt(rec, att, now);
    }
  }

  rec.userId = userId;
  await saveFinalBossRecord(listId, rec);
  return rec;
}

function finalizePassedAttempt(rec, att, now = Date.now()) {
  att.phase = 'completed';
  att.completedAt = new Date(now).toISOString();
  const summary = {
    attemptId: att.attemptId,
    startedAt: att.startedAt,
    completedAt: att.completedAt,
    wordIds: [...att.wordIds],
    totalWords: att.wordIds.length,
    firstRoundCorrect: att.firstRoundCorrect,
    firstRoundWrong: att.firstRoundWrong,
    score: att.firstRoundScore,
    passed: true,
  };
  rec.attempts = Array.isArray(rec.attempts) ? [...rec.attempts, summary] : [summary];
  rec.bestScore = rec.bestScore == null ? summary.score : Math.max(rec.bestScore, summary.score);
  rec.lastPassedAttempt = summary;
}

/* ---------- Oturum Başlatma ---------- */
export async function startFinalBossExam(list, { restart = false, originHash = '#/notebook', rnd = Math.random } = {}) {
  const unlock = canUnlockFinalBoss(list);
  if (!unlock.unlocked) {
    toast(`Final Boss açılmadı. Önce tüm durakları tamamlayın (${unlock.doneStops}/${unlock.totalStops}).`);
    return false;
  }

  const userId = list.userId || 'guest';
  let rec = getFinalBossRecord(list.id) || {
    listId: list.id,
    userId,
    activeAttempt: null,
    attempts: [],
    bestScore: null,
    lastPassedAttempt: null,
  };

  if (restart || !rec.activeAttempt || rec.activeAttempt.phase === 'completed') {
    rec.activeAttempt = createFinalBossAttempt(list, rnd);
    await saveFinalBossRecord(list.id, rec);
  } else {
    // Mevcut aktif denemeden listeden silinmiş kelimeleri temizle
    const validSet = new Set(getListActiveWordIds(list));
    rec.activeAttempt.wrongWordIds = rec.activeAttempt.wrongWordIds.filter((id) => validSet.has(id));
    await saveFinalBossRecord(list.id, rec);
  }

  const att = rec.activeAttempt;
  if (att.phase === 'remediation') {
    return startFinalBossRemediation(list, { originHash, rnd });
  }

  const remainingItems = att.round1Items.slice(att.round1Idx);
  if (!remainingItems.length) {
    return startFinalBossRemediation(list, { originHash, rnd });
  }

  await startSession({
    kind: 'finalBoss',
    title: `${list.name} — Final Boss (${att.wordIds.length} Kelime)`,
    items: remainingItems,
    params: {
      isNotebook: true,
      isFinalBoss: true,
      listId: list.id,
      userId,
      phase: 'round1',
      attemptId: att.attemptId,
      originHash,
    },
  });
  return true;
}

export async function startFinalBossRemediation(list, { originHash = '#/notebook', rnd = Math.random } = {}) {
  const rec = getFinalBossRecord(list.id);
  const att = rec?.activeAttempt;
  if (!att || !att.wrongWordIds.length) {
    toast('Telafi edilecek hatalı kelime kalmadı.');
    return false;
  }

  const queue = buildRemediationQueue(att.wrongWordIds, rnd);
  att.phase = 'remediation';
  att.remediationQueue = queue;
  att.remediationIdx = 0;
  await saveFinalBossRecord(list.id, rec);

  await startSession({
    kind: 'finalBoss',
    title: `${list.name} — Final Boss Telafi (${queue.length} Kelime)`,
    items: queue,
    params: {
      isNotebook: true,
      isFinalBoss: true,
      listId: list.id,
      userId: list.userId || 'guest',
      phase: 'remediation',
      attemptId: att.attemptId,
      originHash,
    },
  });
  return true;
}

/* ---------- Runner İşleyicisi ---------- */
handlers.finalBoss = {
  async onAnswer(item, ok, { elapsed }) {
    const sess = (await import('./learning.js')).getCurrentSession();
    const listId = sess?.params?.listId;
    const userId = sess?.params?.userId || 'guest';
    const phase = item?.phase || sess?.params?.phase || 'round1';
    if (listId) {
      await recordFinalBossAnswer(listId, userId, { wordId: item.wordId, correct: ok, phase });
    }
    // SRS ilerlemesine dokunma; yalnızca çalışma süresini kaydet
    await bumpDaily({ seconds: Math.round(elapsed) });
    return {};
  },

  async onDone(results, sess) {
    const listId = sess?.params?.listId;
    const originHash = sess?.params?.originHash || '#/notebook';
    const allLists = getMeta('notebookLists') || [];
    const list = allLists.find((l) => l.id === listId);
    const rec = getFinalBossRecord(listId);
    const att = rec?.activeAttempt;

    if (!att) {
      return {
        html: `<div class="summary"><h2>Final Boss</h2><p class="muted">Sınav kaydı bulunamadı.</p><div class="sum-actions"><a class="btn primary" href="${esc(originHash)}">Listeye Dön</a></div></div>`,
      };
    }

    const totalWords = att.wordIds.length;
    const score = att.firstRoundScore ?? 0;
    const correct1 = att.firstRoundCorrect;
    const wrong1 = att.firstRoundWrong;
    const unresolved = att.wrongWordIds.length;
    const passed = att.phase === 'completed' && unresolved === 0;

    const statusBadge = passed
      ? `<p class="verdict fb-verdict-pass">Final Boss Tamamlandı — ${score}/100</p>`
      : `<p class="verdict fb-verdict-pending">Henüz tamamlanmadı · ${unresolved} hatalı kelime telafi bekliyor</p>`;

    const statsHtml = `
      <div class="fb-result-grid">
        <div><b>${score}/100</b><span>İlk Tur Puanı</span></div>
        <div><b>${totalWords}</b><span>Toplam Kelime</span></div>
        <div><b>${correct1}</b><span>İlk Tur Doğru</span></div>
        <div><b>${wrong1}</b><span>İlk Tur Yanlış</span></div>
        <div><b>${unresolved}</b><span>Kalan Hatalı</span></div>
        <div><b>${passed ? 'Başarılı' : 'Bekliyor'}</b><span>Durum</span></div>
      </div>
    `;

    const actionsHtml = `
      ${unresolved > 0 ? `<button type="button" class="btn primary block" id="fb-remediate">Hatalı Kelimeleri Tekrar Çalış (${unresolved})</button>` : ''}
      <button type="button" class="btn ${passed ? 'primary' : ''}" id="fb-retry">Final Boss'u Yeniden Dene</button>
      <a class="btn ghost" href="${esc(originHash)}" id="fb-back">Listeye Dön</a>
    `;

    return {
      html: `<div class="summary fb-summary">
        ${passed ? successMark() : ''}
        <h2>${esc(list?.name || 'Liste')} — Final Boss</h2>
        <div class="big-num">${score}/100</div>
        ${statusBadge}
        ${statsHtml}
        <div class="sum-actions fb-sum-actions">${actionsHtml}</div>
      </div>`,
      mount(v) {
        const remBtn = $('#fb-remediate', v);
        if (remBtn && list) {
          remBtn.onclick = async () => {
            await startFinalBossRemediation(list, { originHash });
          };
        }
        const retryBtn = $('#fb-retry', v);
        if (retryBtn && list) {
          retryBtn.onclick = async () => {
            await startFinalBossExam(list, { restart: true, originHash });
          };
        }
        const backBtn = $('#fb-back', v);
        if (backBtn) {
          backBtn.onclick = (e) => {
            e.preventDefault();
            if (location.hash === originHash) window.dispatchEvent(new HashChangeEvent('hashchange'));
            else location.hash = originHash;
          };
        }
      },
    };
  },
};

/* ---------- Modal Arayüzü ---------- */
export function openFinalBossModal({ list, originHash = '#/notebook', onChanged = null } = {}) {
  if (!list) return;
  const unlock = canUnlockFinalBoss(list);
  const rec = getFinalBossRecord(list.id);
  const att = rec?.activeAttempt;
  const passedCurrent = isFinalBossPassedForList(list);
  const activeCount = getListActiveWordIds(list).length;

  let bodyHtml = '';
  let footerHtml = '';

  if (!unlock.unlocked) {
    bodyHtml = `
      <p class="muted">Final Boss, bu listedeki <b>bütün duraklar</b> tamamlandığında açılır.</p>
      <div class="stop-stats">
        <div><b>${unlock.doneStops}/${unlock.totalStops}</b><span>Tamamlanan Durak</span></div>
        <div><b>${unlock.doneWords}/${unlock.totalWords}</b><span>Öğrenilen Kelime</span></div>
      </div>
    `;
    footerHtml = `<div class="row end"><button type="button" class="btn primary" data-x>Kapat</button></div>`;
  } else {
    const hasActiveRound1 = att && att.phase === 'round1' && att.round1Idx > 0 && att.round1Idx < att.round1Items.length;
    const hasRemediation = att && att.phase === 'remediation' && att.wrongWordIds.length > 0;

    let statusNote = `<p class="muted small">Bu listedeki <b>${activeCount}</b> kelimenin tamamı sorulur. 100 üzerinden puan yalnızca ilk tur sonuçlarından hesaplanır.</p>`;
    if (passedCurrent && rec?.lastPassedAttempt) {
      statusNote = `<p class="fb-pass-note">✓ Final Boss Tamamlandı — Son Geçerli Puan: <b>${rec.lastPassedAttempt.score}/100</b>${rec.bestScore != null ? ` · En İyi: <b>${rec.bestScore}/100</b>` : ''}</p>`;
    } else if (hasRemediation) {
      statusNote = `<p class="fb-pending-note">İlk tur puanı: <b>${att.firstRoundScore}/100</b> · Telafi bekleyen <b>${att.wrongWordIds.length}</b> hatalı kelime var.</p>`;
    } else if (hasActiveRound1) {
      statusNote = `<p class="fb-pending-note">Devam eden sınav: <b>${att.round1Idx}/${att.round1Items.length}</b> soru yanıtlandı.</p>`;
    }

    bodyHtml = `
      <p class="muted small stop-ctx">${esc(list.name)}</p>
      <div class="stop-stats">
        <div><b>${activeCount}</b><span>Sınav Kelimesi</span></div>
        <div><b>${rec?.bestScore != null ? `${rec.bestScore}/100` : '—'}</b><span>En İyi Puan</span></div>
      </div>
      ${statusNote}
    `;

    if (hasRemediation) {
      footerHtml = `
        <div class="stop-actions">
          <button type="button" class="btn primary block" id="fb-modal-remediate">Hatalı Kelimeleri Tekrar Çalış (${att.wrongWordIds.length})</button>
          <div class="stop-actions-row">
            <button type="button" class="btn ghost" data-x>Kapat</button>
            <button type="button" class="btn" id="fb-modal-restart">Final Boss'u Yeniden Dene</button>
          </div>
        </div>
      `;
    } else if (hasActiveRound1) {
      footerHtml = `
        <div class="stop-actions">
          <button type="button" class="btn primary block" id="fb-modal-resume">Kaldığın Yerden Devam Et (${att.round1Idx}/${att.round1Items.length})</button>
          <div class="stop-actions-row">
            <button type="button" class="btn ghost" data-x>Kapat</button>
            <button type="button" class="btn" id="fb-modal-restart">Baştan Başla</button>
          </div>
        </div>
      `;
    } else {
      footerHtml = `
        <div class="stop-actions">
          <button type="button" class="btn bronze block" id="fb-modal-start">${passedCurrent ? "Final Boss'u Yeniden Dene" : `Final Boss'u Başlat (${activeCount} Kelime)`}</button>
          <div class="stop-actions-row">
            <button type="button" class="btn ghost" data-x>Kapat</button>
          </div>
        </div>
      `;
    }
  }

  openModal({
    title: 'Final Boss',
    html: `<div class="stop-detail fb-modal">${bodyHtml}${footerHtml}</div>`,
    onMount(b, api) {
      const closeBtn = $('[data-x]', b);
      if (closeBtn) closeBtn.onclick = api.close;
      const startBtn = $('#fb-modal-start', b);
      if (startBtn) {
        startBtn.onclick = async () => {
          api.close();
          const started = await startFinalBossExam(list, { restart: true, originHash });
          if (!started && typeof onChanged === 'function') onChanged();
        };
      }
      const resumeBtn = $('#fb-modal-resume', b);
      if (resumeBtn) {
        resumeBtn.onclick = async () => {
          api.close();
          const started = await startFinalBossExam(list, { restart: false, originHash });
          if (!started && typeof onChanged === 'function') onChanged();
        };
      }
      const remBtn = $('#fb-modal-remediate', b);
      if (remBtn) {
        remBtn.onclick = async () => {
          api.close();
          const started = await startFinalBossRemediation(list, { originHash });
          if (!started && typeof onChanged === 'function') onChanged();
        };
      }
      const restartBtn = $('#fb-modal-restart', b);
      if (restartBtn) {
        restartBtn.onclick = async () => {
          api.close();
          const started = await startFinalBossExam(list, { restart: true, originHash });
          if (!started && typeof onChanged === 'function') onChanged();
        };
      }
    },
  });
}
