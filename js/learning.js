// Öğrenme motoru arayüzü: ortak "oturum çalıştırıcı" (runner) + 4 aşamalı Kelime Öğren akışı.
// Tüm modlar (learn, review, exam) bu çalıştırıcıyı kullanır; oturum her cevapta kaydedilir ve yenilemede devam eder.
import { state, getMeta, setMeta, getSettings, getProgress, saveProgress } from './storage.js';
import * as E from './engine.js';
import { $, $$, esc, toast, speak, sfx, openModal, hasModal, closeTopModal, confirmDialog, ICONS, successMark } from './ui.js';
import { LEVELS, LEVEL_NAMES, posLabel, statusLabel } from './vocabulary.js';
import { bumpDaily, levelStats } from './statistics.js';
import { pathCanvasHtml, levelPathSummary, openStopDetail, WINDOW_RADIUS, WINDOW_STEP, reduceMotion } from './path-ui.js';
import { mascotHtml, reactLearningMascot } from './mascot.js';

export const handlers = {}; // kind -> { onAnswer(item, ok, info), onDone(results, sess) }
let cur = null;
let answered = false;
let shownAt = 0;
let curQ = null;
const view = () => document.getElementById('view');

export const sessionActive = () => !!cur;
export const getCurrentSession = () => cur;
const setFocusMode = (on) => { if (typeof document !== 'undefined') document.body.classList.toggle('focus', on); };
let lastPct = 0;
export function abortSession() { cur = null; if (typeof document !== 'undefined') document.body.classList.remove('focus', 'kb-open'); }

export function getStudyGroupRotation(scopeKey) {
  const all = getMeta('studyGroupRotation') || {};
  const list = all[scopeKey];
  return Array.isArray(list) ? list : [];
}

export async function saveStudyGroupRotation(scopeKey, wordIds) {
  const all = { ...(getMeta('studyGroupRotation') || {}) };
  all[scopeKey] = [...new Set(Array.isArray(wordIds) ? wordIds : [])];
  await setMeta('studyGroupRotation', all);
}

export async function startSession(s) {
  const isLearn = s.kind === 'learn';
  const cleanItems = Array.isArray(s.items)
    ? s.items.filter((it) => {
        if (!it || it.type === 'production') return false;
        if (isLearn && (it.type === 'sentence' || (it.stage && it.stage > 4))) return false;
        return true;
      })
    : [];
  const safeIdx = Math.min(s.idx || 0, cleanItems.length);
  const rawParams = { ...(s.params || {}) };
  if (isLearn) {
    const inferredWordIds = Array.isArray(rawParams.groupWordIds) && rawParams.groupWordIds.length
      ? [...new Set(rawParams.groupWordIds)]
      : [...new Set(cleanItems.map((it) => it.wordId))];
    const normStages = Array.isArray(rawParams.selectedStages) && rawParams.selectedStages.length
      ? E.normalizeSelectedStages(rawParams.selectedStages)
      : [1, 2, 3, 4];
    rawParams.groupSize = E.normalizeGroupSize(rawParams.groupSize || s.groupSize || inferredWordIds.length || E.DEFAULT_GROUP_SIZE);
    rawParams.groupWordIds = inferredWordIds;
    rawParams.selectedStages = normStages;
    const summary = E.computeGroupEvalSummary({
      groupWordIds: inferredWordIds,
      selectedStages: normStages,
      results: Array.isArray(s.results) ? s.results : [],
      evalState: rawParams.groupEval || null,
    });
    rawParams.groupEval = {
      groupWordIds: summary.groupWordIds,
      evalStages: summary.evalStages,
      byWord: summary.byWord,
    };
  }
  cur = { feedback: true, idx: safeIdx, results: [], level: s.level || rawParams.level || getMeta('learnLevel') || 'A2', ...s, params: rawParams, items: cleanItems, idx: safeIdx };
  lastPct = cur.items.length ? (cur.idx / cur.items.length) * 100 : 0;
  setFocusMode(true); // oturum boyunca tek soruya odaklanan, menüsüz ekran
  await persist();
  renderItem();
}
export async function resumeSaved(targetLevel = null) {
  let s = null;
  if (targetLevel) {
    const byLevel = getMeta('activeSessionsByLevel') || {};
    s = byLevel[targetLevel];
  }
  if (!s) s = getMeta('activeSession');
  if (!s || !handlers[s.kind]) return false;
  await startSession(s);
  return true;
}
const persist = async () => {
  if (!cur) {
    await setMeta('activeSession', null);
    return;
  }
  const sessionData = {
    kind: cur.kind,
    title: cur.title,
    level: cur.level || cur.params?.level || getMeta('learnLevel') || 'A2',
    items: cur.items,
    idx: cur.idx,
    results: cur.results,
    params: cur.params,
    feedback: cur.feedback,
  };
  await setMeta('activeSession', sessionData);
  if (sessionData.kind === 'learn' && sessionData.level && !sessionData.params?.isNotebook) {
    const byLevel = getMeta('activeSessionsByLevel') || {};
    byLevel[sessionData.level] = sessionData;
    await setMeta('activeSessionsByLevel', byLevel);
  }
};

async function finish() {
  const s = cur;
  const out = await handlers[s.kind].onDone(s.results, s);
  const finLevel = s.level || s.params?.level;
  cur = null;
  setFocusMode(false);
  await setMeta('activeSession', null);
  if (s.kind === 'learn' && finLevel && !s.params?.isNotebook) {
    const byLevel = getMeta('activeSessionsByLevel') || {};
    if (byLevel[finLevel]) {
      delete byLevel[finLevel];
      await setMeta('activeSessionsByLevel', byLevel);
    }
  }
  // Kelime Defterim: "Eşini Bul" diğer aşamalarla birlikte seçildiyse, oturumun sonunda hafıza oyunu başlar.
  if (s.params?.isNotebook && s.params?.matchAfter && typeof sessionHooks.afterLearn === 'function') {
    try { await sessionHooks.afterLearn(s); return; } catch (e) { console.warn('Eşini Bul başlatılamadı:', e); }
  }
  if (out && view()) { view().innerHTML = out.html; if (out.mount) out.mount(view()); }
}
/** Oturum sonrası kancalar (ör. Kelime Defterim → Eşini Bul). Döngüsel içe aktarmayı önlemek için kayıt usulü. */
export const sessionHooks = {};
export const summaryHtml = ({ title, big, sub, extra = '', actions = '', verdict = '', mark = true }) =>
  `<div class="summary">
    <div class="siyami-summary-badge" aria-hidden="true"><img class="siyami-img" src="assets/mascot/siyami-complete.png" alt="" loading="lazy"/></div>
    ${mark ? successMark() : ''}<h2>${esc(title)}</h2><div class="big-num">${big}</div>${verdict ? `<p class="verdict">${verdict}</p>` : ''}<p class="muted">${sub}</p>${extra ? `<details class="more"><summary>Ayrıntılar</summary><div class="more-body">${extra}</div></details>` : ''}<div class="sum-actions">${actions}<a class="btn ghost" href="#/notebook">Defterim</a></div></div>`;

const TYPE_LABEL = {
  card: 'Kelimeyi Öğren',
  mc: 'Çoktan Seçmeli Soru',
  typing: 'İngilizce Kelimeyi Yaz',
  missing: 'Eksik Harfleri Tamamla',
  sentence: 'Örnek Cümlede Boşluk Doldur',
  listening: 'Dinleyerek Yaz',
};

function renderItem() {
  answered = false;
  if (!cur) return;
  if (cur.idx >= cur.items.length) return finish();
  const item = cur.items[cur.idx];
  const word = state.wordMap.get(item.wordId);
  if (!word) { cur.idx++; return renderItem(); } // silinmiş kelime
  const n = cur.items.length, pct = (cur.idx / n) * 100;
  const label = item.stage ? E.STAGES[item.stage - 1] : TYPE_LABEL[item.type];
  const selectedStages = cur.params?.selectedStages;
  const totalSteps = item.totalSteps || (Array.isArray(selectedStages) && selectedStages.length ? selectedStages.length : 4);
  const stepIdx = item.stepIndex || (Array.isArray(selectedStages) && selectedStages.includes(item.stage) ? selectedStages.indexOf(item.stage) + 1 : item.stage) || 1;
  const stageText = item.stage ? `Aşama ${stepIdx}/${totalSteps}` : '';
  const dots = item.stage
    ? `<span class="stage-dots" role="img" aria-label="Aşama ${stepIdx}/${totalSteps}">${Array.from({ length: totalSteps }, (_, i) => `<i class="${i + 1 <= stepIdx ? 'on' : ''}"></i>`).join('')}</span>`
    : '';
  if (item.type === 'card') {
    curQ = null;
  } else {
    if (!item.q) {
      const built = E.buildQuestion(word, item.type, state.words);
      const { word: _w, ...rest } = built;
      item.q = rest;
    }
    curQ = { ...item.q, word };
  }
  if (curQ && curQ.type !== item.type) item.type = curQ.type;
  if (typeof document === 'undefined' || !view()) return;
  view().innerHTML = `<div class="run">
    <div class="run-top">
      <button class="icon-btn" id="q-exit" aria-label="Çık">${ICONS.close}</button>
      <div class="progress thin" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${lastPct}%"></i></div>
      <span class="run-count">${cur.idx + 1}/${n}</span>
    </div>
    <div class="run-body" id="qcard">
      <div class="run-label">
        <span class="run-label-main">${dots}${stageText ? `<span class="stage-step-text">${stageText}</span>` : ''}<span>${esc(label)}</span></span>
        <span class="siyami-run-slot" id="siyami-learning-slot" aria-hidden="true" title="Siyami"><span class="siyami-run-avatar"><img class="siyami-img" src="assets/mascot/siyami-idle.png" alt="" loading="lazy"/></span></span>
      </div>
      <div id="qbody">${bodyHtml(item, word)}</div>
      <div id="fb"></div>
    </div>
  </div>`;
  const bar = $('.progress i');
  if (bar) requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = pct + '%'; }));
  lastPct = pct;
  $('#q-exit').onclick = () => {
    const isNotebook = cur?.params?.isNotebook;
    const originHash = cur?.params?.pathStop?.originHash;
    abortSession();
    if (originHash === '#/path') {
      if (location.hash === '#/path') window.dispatchEvent(new HashChangeEvent('hashchange'));
      else location.hash = '#/path';
      toast(isNotebook ? 'Oturum kaydedildi; Defterim ekranından devam edebilirsiniz.' : 'Oturum kaydedildi; Hazır Kelime Havuzu ekranından kaldığınız yerden devam edebilirsiniz.');
    } else if (isNotebook) {
      if (location.hash === '#/notebook') window.dispatchEvent(new HashChangeEvent('hashchange'));
      else location.hash = '#/notebook';
      toast('Oturum kaydedildi; Defterim ekranından devam edebilirsiniz.');
    } else {
      if (location.hash === '#/learn') window.dispatchEvent(new HashChangeEvent('hashchange'));
      else location.hash = '#/learn';
      toast('Oturum kaydedildi; Hazır Kelime Havuzu ekranından kaldığınız yerden devam edebilirsiniz.');
    }
  };
  wire(item, word);
}

export function toggleFocus() { setFocusMode(!document.body.classList.contains('focus')); }

const speakBtn = (t) => `<span class="speak-row"><button type="button" class="speak-btn" data-speak="${esc(t)}" aria-label="Dinle">${ICONS.speaker}</button></span>`;
const inputForm = (ph) => `<form id="ans" autocomplete="off"><input id="inp" class="input lg" placeholder="${ph}" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" inputmode="text" aria-label="Cevabınız"><button class="btn primary xl block" type="submit">Kontrol Et</button></form>`;

function cardDetails(w) {
  const fam = w.wordFamily?.length ? `<div class="kv"><span>Kelime ailesi</span>${esc(w.wordFamily.join(', '))}</div>` : '';
  const syn = w.synonyms?.length ? `<div class="kv"><span>Eş anlamlılar</span>${esc(w.synonyms.join(', '))}</div>` : '';
  return `<div class="meaning">${esc(w.meanings.join(' · '))}</div><div class="pos">${esc(posLabel(w.partOfSpeech))}</div>
    ${w.exampleSentence ? `<blockquote>${esc(w.exampleSentence)}<small>${esc(w.exampleTranslation || '')}</small></blockquote>` : ''}${syn}${fam}`;
}

function bodyHtml(item, w) {
  const q = curQ;
  if (item.type === 'card') {
    return `<h2 class="word">${esc(w.word)}</h2>${w.pronunciation ? `<div class="muted">${esc(w.pronunciation)}</div>` : ''}${speakBtn(w.word)}
      <div id="reveal-area"><button type="button" class="btn primary xl block" id="reveal">Anlamı Göster</button></div>`;
  }
  if (item.type === 'mc') return `<h2 class="word">${esc(q.prompt)}</h2>${speakBtn(q.prompt)}<p class="hint">Doğru Türkçe anlamı seç</p><div class="options">${q.options.map((o, i) => `<button type="button" class="opt" data-i="${i}"><span class="opt-n">${i + 1}</span><span>${esc(o)}</span></button>`).join('')}</div>`;
  if (item.type === 'typing') return `<p class="hint">İngilizce karşılığını yaz · ${esc(posLabel(q.pos))}, ${q.hintLen} harf</p><h2 class="word">${esc(q.prompt)}</h2>${inputForm('İngilizce kelimeyi yazın…')}`;
  if (item.type === 'missing') return `<p class="hint">Eksik harfleri tamamla · ${esc(posLabel(q.pos))}</p><h2 class="word mono">${esc(q.prompt)}</h2><div class="meaning">${esc(q.meaning)}</div>${inputForm('Kelimenin tamamını yazın…')}`;
  if (item.type === 'sentence') return `<p class="hint">Boşluğa gelecek kelimeyi yaz</p><h2 class="sent">${esc(q.prompt)}</h2><div class="muted small">${esc(q.hint || '')}</div><div class="meaning">${esc(q.meaning)}</div>${inputForm('Eksik kelimeyi yazın…')}`;
  if (item.type === 'listening') return `<p class="hint">Duyduğun İngilizce kelimeyi yaz</p>${speakBtn(q.prompt)}${inputForm('Duyduğunuz kelimeyi yazın…')}`;
  return '';
}

function wire(item, word) {
  shownAt = Date.now();
  $$('[data-speak]').forEach((b) => { b.onclick = () => speak(b.dataset.speak, !!b.dataset.slow); });
  if (item.type === 'card') {
    const rv = $('#reveal');
    rv.onclick = () => {
      $('#reveal-area').innerHTML = `${cardDetails(word)}<button type="button" class="btn primary xl block" id="next">Devam Et</button>`;
      const nx = $('#next'); nx.onclick = () => submit(true, ''); nx.focus();
    };
    rv.focus();
    return;
  }
  if (item.type === 'mc') $$('.opt').forEach((b) => { b.onclick = () => { b.classList.add('picked'); submit(+b.dataset.i, +b.dataset.i); }; });
  else { $('#ans').onsubmit = (e) => { e.preventDefault(); const v = $('#inp').value; if (v.trim()) submit(v, v); }; $('#inp').focus(); }
  if (item.type === 'listening') speak(word.word);
}

async function submit(input, shown, meta = {}) {
  if (answered || !cur) return;
  answered = true;
  const item = cur.items[cur.idx];
  const word = state.wordMap.get(item.wordId);
  const isCard = item.type === 'card';
  const ok = isCard ? true : meta.customOk !== undefined ? meta.customOk : E.checkAnswer(curQ, input);
  const elapsed = Math.min(60, (Date.now() - shownAt) / 1000);
  const r = (await handlers[cur.kind].onAnswer(item, ok, { elapsed, q: curQ, word, input })) || {};
  cur.results.push({ wordId: item.wordId, type: item.type, stage: item.stage || 0, correct: ok, input: String(shown), t: Math.round(elapsed), card: isCard });
  cur.idx++;
  if (r.drop) cur.items = cur.items.slice(0, cur.idx).concat(cur.items.slice(cur.idx).filter((x) => x.wordId !== item.wordId));
  await persist();
  if (isCard) return renderItem();
  if (!cur.feedback) return renderItem();
  showFeedback(ok, word, item, r);
}

function showFeedback(ok, word, item, r) {
  const qc = $('#qcard');
  qc.classList.add(ok ? 'correct' : 'wrong');
  sfx(ok ? 'ok' : 'bad');
  try { reactLearningMascot(ok ? 'correct' : 'wrong'); } catch (_) {}
  if (item.type === 'mc') $$('.opt').forEach((b, i) => { b.disabled = true; if (i === curQ.answerIndex) b.classList.add('right'); else if (!ok && b.classList.contains('picked')) b.classList.add('bad'); });
  $$('#qbody input,#qbody form button').forEach((e) => (e.disabled = true));
  const ans = `Doğru cevap: ${curQ.display}`;
  const feedbackText = `<div class="feedback ${ok ? 'ok' : 'no'}" role="status"><b>${ok ? 'Doğru' : 'Yanlış'}</b><span>${esc(ans)}</span>
    ${!ok && cur.kind === 'learn' ? `<small>Kelime "${statusLabel('REVIEW')}" havuzuna alındı; sonraki oturumda öncelikli gösterilecek.</small>` : ''}</div>`;
  $('#fb').innerHTML = `${feedbackText}<button type="button" class="btn primary xl block" id="cont">Devam</button>`;
  $('#cont').onclick = renderItem; $('#cont').focus();
}

/* ---------- Klavye ---------- */
export function initKeys() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (hasModal()) return void closeTopModal();
      return;
    }
    if (!cur || !getSettings().shortcuts || hasModal() || e.repeat) return;
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    const item = cur.items[cur.idx];
    if (e.key === 'Enter') {
      if (answered) { const c = $('#cont'); if (c) { e.preventDefault(); c.click(); } }
      else if (item?.type === 'card') { const t = $('#reveal') || $('#next'); if (t) { e.preventDefault(); t.click(); } }
    } else if (!typing && !answered && item?.type === 'mc' && /^[1-4]$/.test(e.key)) {
      const b = $$('.opt')[+e.key - 1]; if (b) { b.classList.add('picked'); b.click(); }
    } else if (!typing && e.key === ' ' && item && document.activeElement?.tagName !== 'BUTTON') {
      e.preventDefault();
      const w = state.wordMap.get(item.wordId); if (w) speak(w.word);
    }
  });
}

/* ---------- Kelime Öğren sayfası ---------- */
handlers.learn = {
  async onAnswer(item, ok, { elapsed, customStages = null } = {}) {
    const p = getProgress(item.wordId);
    const activeCustomStages = customStages || cur?.params?.selectedStages || null;
    if (cur?.params?.groupEval) {
      E.recordGroupEvalAnswer(cur.params.groupEval, {
        wordId: item.wordId,
        stage: item.stage,
        type: item.type,
        correct: Boolean(ok),
      });
    }
    if (item.type === 'card') { E.markSeen(p); await saveProgress(p); return {}; }
    const was = p.learningComplete;
    E.applyAnswer(p, ok, { mode: 'learn', stage: item.stage, qtype: item.type, customStages: activeCustomStages });
    await saveProgress(p);
    const d = { seconds: Math.round(elapsed), [ok ? 'correct' : 'wrong']: 1 };
    if (!was && p.learningComplete) { d.learnedWordId = item.wordId; d.done = 1; }
    await bumpDaily(d);
    return { drop: !ok };
  },
  async onDone(results, sess) {
    await bumpDaily({ sessionsCompleted: 1 });
    const customStages = Array.isArray(sess?.params?.selectedStages) && sess.params.selectedStages.length
      ? E.normalizeSelectedStages(sess.params.selectedStages)
      : [1, 2, 3, 4];
    const stageCount = customStages.length;
    const lastStage = customStages[customStages.length - 1] || 4;
    const q = results.filter((r) => !r.card);
    const ok = q.filter((r) => r.correct).length;
    const isCardOnly = stageCount === 1 && customStages[0] === 1;
    const evalSummary = E.computeGroupEvalSummary({
      groupWordIds: sess?.params?.groupWordIds || [],
      selectedStages: customStages,
      results,
      evalState: sess?.params?.groupEval || null,
    });
    const done = isCardOnly
      ? new Set(results.filter((r) => r.card).map((r) => r.wordId)).size
      : evalSummary.hasEvalStages
        ? evalSummary.passedWordIds.length
        : new Set(q.filter((r) => r.stage === lastStage && r.correct).map((r) => r.wordId)).size;
    const failed = [...new Set(q.filter((r) => !r.correct).map((r) => state.wordMap.get(r.wordId)?.word))].filter(Boolean);
    const isNb = Boolean(sess?.params?.isNotebook);
    const returnUrl = isNb ? '#/notebook' : '#/learn';
    const returnLabel = isNb ? 'Defterime Dön' : 'Kelime Öğren\'e Dön';
    const groupSize = E.normalizeGroupSize(sess?.params?.groupSize || E.DEFAULT_GROUP_SIZE);
    const subText = isCardOnly
      ? `1 aşamayı tamamladın · Kelime kartları incelendi`
      : `${stageCount} aşamayı tamamladın · ${ok}/${q.length} doğru cevap`;
    // v5.0: Yolum durağından başlatılan oturumda genel grup rotasyonu yerine yola dönüş sunulur
    const fromPath = Boolean(sess?.params?.pathStop);
    const nextGroupBtn = fromPath
      ? `<a class="btn primary" href="#/path" id="btn-back-to-path">Yoluma Dön</a>`
      : `<button type="button" class="btn primary" id="btn-next-study-group">Sonraki Gruba Geç (${groupSize} Kelime)</button>`;
    return {
      html: summaryHtml({
        title: 'Oturum Tamamlandı',
        big: `${done} kelime`,
        sub: subText,
        extra: failed.length ? `<p>Tekrar Edilecek havuzuna alınanlar: <b>${esc(failed.join(', '))}</b></p>` : '',
        actions: `${nextGroupBtn}<a class="btn ghost" href="${returnUrl}">${returnLabel}</a>`,
      }),
      mount(v) {
        const nxt = $('#btn-next-study-group', v);
        if (nxt) {
          nxt.onclick = async () => {
            if (isNb && typeof sessionHooks.startNextNotebookGroup === 'function') {
              await sessionHooks.startNextNotebookGroup(sess.params);
            } else {
              const lv = sess?.level || sess?.params?.level || getMeta('learnLevel') || 'A2';
              await startLearn(lv, { groupSize, skipModal: true });
            }
          };
        }
      },
    };
  },
};

export function openGroupSizeModal({ level = 'A2', defaultSize = E.DEFAULT_GROUP_SIZE, onStart = null } = {}) {
  let chosenSize = E.normalizeGroupSize(defaultSize);
  const sizeButtonsHtml = E.GROUP_SIZES.map((sz) => `
    <button type="button" class="nb-size-option ${sz === chosenSize ? 'active' : ''}" data-group-size="${sz}" aria-pressed="${sz === chosenSize}">
      <b>${sz} kelime</b>
      <span class="muted small">${sz === 5 ? 'Varsayılan · Hızlı tur' : sz === 10 ? 'Dengeli çalışma' : sz === 15 ? 'Yoğun pratik' : 'Kapsamlı grup'}</span>
    </button>
  `).join('');

  openModal({
    title: `${level} — Çalışma Grubu Büyüklüğü`,
    html: `
      <div class="nb-stage-modal">
        <p class="nb-group-question"><b>Kaç kelimelik gruplarla çalışmak istiyorsun?</b></p>
        <p class="muted small nb-stage-sub">${level} (${LEVEL_NAMES[level] || ''}) seviyesinde 4 aşamalı standart öğrenme oturumu seçtiğin kelime sayısıyla başlatılacak.</p>
        <div class="nb-size-grid" role="radiogroup" aria-label="Kaç kelimelik gruplarla çalışmak istiyorsun?">
          ${sizeButtonsHtml}
        </div>
        <div class="nb-stage-actions">
          <button type="button" class="btn ghost" data-x>Vazgeç</button>
          <button type="button" class="btn primary xl" id="group-size-start">Çalışmaya Başla</button>
        </div>
      </div>
    `,
    onMount(b, api) {
      $('[data-x]', b).onclick = api.close;
      const sizeBtns = $$('[data-group-size]', b);
      const syncSize = () => {
        sizeBtns.forEach((btn) => {
          const on = Number(btn.dataset.groupSize) === chosenSize;
          btn.classList.toggle('active', on);
          btn.setAttribute('aria-pressed', String(on));
        });
      };
      sizeBtns.forEach((btn) => {
        btn.onclick = () => {
          chosenSize = E.normalizeGroupSize(btn.dataset.groupSize);
          syncSize();
        };
      });
      $('#group-size-start', b).onclick = async () => {
        const finalSize = E.normalizeGroupSize(chosenSize);
        api.close();
        if (typeof onStart === 'function') {
          await onStart(finalSize);
        } else {
          await startLearn(level, { groupSize: finalSize, skipModal: true });
        }
      };
    },
  });
  return true;
}

export async function startLearn(level, options = null) {
  const byLevel = getMeta('activeSessionsByLevel') || {};
  const savedSame = byLevel[level] || (getMeta('activeSession')?.level === level && !getMeta('activeSession')?.params?.isNotebook ? getMeta('activeSession') : null);
  const hasExplicitSize = typeof options === 'number' || (options && typeof options === 'object' && (options.groupSize != null || options.skipModal));

  if (!hasExplicitSize && savedSame && savedSame.idx < (savedSame.items?.length || 0)) {
    const ok = await confirmDialog(`"${level}" seviyesinde yarım kalan bir oturumun var (${savedSame.idx}/${savedSame.items.length}). Yeni bir öğrenme oturumu başlatılsın mı?`, { okLabel: 'Yeni Oturumu Başlat', cancelLabel: 'Vazgeç', danger: true });
    if (!ok) return false;
  }

  const words = state.words.filter((w) => w.level === level);

  // v5.0: Yolum → hazır seviye durağı. Havuz YALNIZCA durağın kelimeleridir; öğrenilmiş/kalıcı kelimeler de dahildir.
  // Genel grup rotasyonu (studyGroupRotation) ve 5/10/15/20 grup seçimi bu akışta kullanılmaz/değiştirilmez.
  if (options && typeof options === 'object' && Array.isArray(options.explicitWordIds) && options.explicitWordIds.length) {
    const allowed = new Set(options.explicitWordIds);
    const byId = new Map(words.filter((w) => allowed.has(w.id) && E.isWordReady(w)).map((w) => [w.id, w]));
    const batch = options.explicitWordIds.map((id) => byId.get(id)).filter(Boolean);
    if (!batch.length) {
      toast('Bu durakta çalışılacak kelime bulunamadı.', 'error');
      return false;
    }
    const groupWordIds = batch.map((w) => w.id);
    const selectedStages = [1, 2, 3, 4];
    const pathStop = options.pathStop && typeof options.pathStop === 'object' ? { ...options.pathStop, level } : { level };
    await setMeta('learnLevel', level);
    await startSession({
      kind: 'learn',
      title: `${level} — Durak ${pathStop.number || ''} (${batch.length} Kelime)`,
      level,
      params: {
        level,
        groupSize: E.normalizeGroupSize(batch.length),
        groupWordIds,
        selectedStages,
        groupEval: E.createGroupEvaluation(groupWordIds, selectedStages),
        pathStop,
      },
      items: E.learnItems(batch, state.progress, Math.random, selectedStages),
    });
    return true;
  }

  const availCheck = E.selectStudyGroup(words, state.progress, E.DEFAULT_GROUP_SIZE);
  if (!availCheck.batch.length) {
    toast(`${level} seviyesindeki öğrenmeye hazır tüm kelimeler 4 aşamayı tamamladı. Akıllı Tekrar bölümüne geçebilirsiniz.`);
    return false;
  }

  if (!hasExplicitSize && typeof document !== 'undefined' && document.getElementById('modal-root')) {
    return openGroupSizeModal({
      level,
      defaultSize: E.DEFAULT_GROUP_SIZE,
      onStart: async (chosenSize) => {
        await startLearn(level, { groupSize: chosenSize, skipModal: true });
      },
    });
  }

  const groupSize = E.normalizeGroupSize(typeof options === 'number' ? options : options?.groupSize || E.DEFAULT_GROUP_SIZE);
  const scopeKey = `level:${level}`;
  const seenWordIds = getStudyGroupRotation(scopeKey);
  const group = E.selectStudyGroup(words, state.progress, groupSize, { seenWordIds });
  if (!group.batch.length) {
    toast(`${level} seviyesindeki öğrenmeye hazır tüm kelimeler 4 aşamayı tamamladı. Akıllı Tekrar bölümüne geçebilirsiniz.`);
    return false;
  }
  await saveStudyGroupRotation(scopeKey, group.nextSeenIds);
  const groupWordIds = group.batch.map((w) => w.id);
  const selectedStages = [1, 2, 3, 4];
  await setMeta('learnLevel', level);
  await startSession({
    kind: 'learn',
    title: `${level} Kelime Öğren (${group.batch.length} Kelime)`,
    level,
    params: {
      level,
      groupSize,
      groupWordIds,
      selectedStages,
      groupEval: E.createGroupEvaluation(groupWordIds, selectedStages),
    },
    items: E.learnItems(group.batch, state.progress, Math.random, selectedStages),
  });
  return true;
}

export function renderLearn(v) {
  let lv = LEVELS.includes(getMeta('learnLevel')) ? getMeta('learnLevel') : LEVELS[0];
  let win = null;

  const draw = (opts = {}) => {
    const s = levelStats(lv);
    const pathSum = levelPathSummary(lv);
    const n = pathSum.totalStops;
    const curIdx = Math.max(0, pathSum.currentIndex);
    const key = `lv:${lv}`;
    if (!win || win.key !== key || opts.recenter) {
      win = { key, lo: Math.max(0, curIdx - WINDOW_RADIUS), hi: Math.min(n - 1, curIdx + WINDOW_RADIUS) };
    }
    win.lo = Math.max(0, Math.min(win.lo, Math.max(0, n - 1)));
    win.hi = Math.min(Math.max(0, n - 1), Math.max(win.hi, win.lo));

    const byLevel = getMeta('activeSessionsByLevel') || {};
    const activeSaved = byLevel[lv];
    const hasSaved = !!(activeSaved && activeSaved.idx < (activeSaved.items?.length || 0));

    const prevBtn = win.lo > 0 ? `<button type="button" class="btn ghost block path-more" id="lv-path-prev">Önceki durakları göster (${win.lo} durak)</button>` : '';
    const nextBtn = win.hi < n - 1 ? `<button type="button" class="btn ghost block path-more" id="lv-path-next">Sonraki durakları göster (${n - 1 - win.hi} durak daha)</button>` : '';

    v.innerHTML = `<div class="page learn-pool-page">
      <div class="learn-top-bar">
        <h1>Hazır Kelime Havuzu</h1>
        <div class="seg sm" role="group" aria-label="Seviye">${LEVELS.map((l) => `<button type="button" class="seg-btn ${l === lv ? 'active' : ''}" data-l="${l}">${l}</button>`).join('')}</div>
      </div>
      <div class="nb-progress-strip">
        <span class="nb-progress-text"><b>${lv} (${LEVEL_NAMES[lv]})</b> · <b>${s.completed}/${s.total}</b> kelime · <b>${pathSum.doneStops}/${pathSum.totalStops}</b> durak (%${Math.round(s.completion)})</span>
        <div class="progress thin" role="progressbar" aria-valuenow="${Math.round(s.completion)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${s.completion}%"></i></div>
        ${n > 6 ? `<button type="button" class="text-btn small" id="lv-path-jump">Kaldığım Yere Git</button>` : ''}
      </div>
      <div class="learn-cta-row">
        ${hasSaved ? `
          <button type="button" class="btn bronze block" id="resume">Kaldığın Yerden Devam Et — ${lv} (${activeSaved.idx}/${activeSaved.items.length})</button>
          <button type="button" class="btn sm ghost" id="discard">Vazgeç</button>
        ` : ''}
        <button type="button" class="btn ${hasSaved ? '' : 'bronze xl'} block" id="go">${lv} Öğrenmeye Başla</button>
      </div>
      ${n ? `<div class="path-wrap lv-vertical-path">${prevBtn}${pathCanvasHtml(pathSum, win.lo, win.hi, 'builtin')}${nextBtn}</div>` : ''}
    </div>`;

    $$('[data-l]', v).forEach((b) => {
      b.onclick = async () => {
        lv = b.dataset.l;
        await setMeta('learnLevel', lv);
        const byL = getMeta('activeSessionsByLevel') || {};
        await setMeta('activeSession', byL[lv] || null);
        win = null;
        draw();
      };
    });
    $('#go', v).onclick = () => startLearn(lv);
    const rs = $('#resume', v);
    if (rs) rs.onclick = async () => { if (!(await resumeSaved(lv))) toast('Oturum devam ettirilemedi.', 'error'); };
    const dc = $('#discard', v);
    if (dc) {
      dc.onclick = async () => {
        if (await confirmDialog('Yarım kalan oturum silinsin mi? (Verdiğiniz cevaplar zaten kaydedildi.)', { danger: true })) {
          await setMeta('activeSession', null);
          const byL = getMeta('activeSessionsByLevel') || {};
          if (byL[lv]) {
            delete byL[lv];
            await setMeta('activeSessionsByLevel', byL);
          }
          draw();
        }
      };
    }
    const prevEl = $('#lv-path-prev', v);
    if (prevEl) prevEl.onclick = () => { win.lo = Math.max(0, win.lo - WINDOW_STEP); draw({ keepScroll: true }); };
    const nextEl = $('#lv-path-next', v);
    if (nextEl) nextEl.onclick = () => { win.hi = Math.min(n - 1, win.hi + WINDOW_STEP); draw(); };
    const jumpEl = $('#lv-path-jump', v);
    if (jumpEl) jumpEl.onclick = () => { draw({ recenter: true, scrollToCurrent: true }); };
    $$('[data-stop-index]', v).forEach((b) => {
      b.onclick = () => {
        const st = pathSum.stops[Number(b.dataset.stopIndex)];
        if (!st) return;
        openStopDetail({ kind: 'builtin', stop: st, level: lv, onChanged: () => draw() });
      };
    });
    if (opts.scrollToCurrent) {
      const target = $('.pstop.is-current', v) || $(`[data-stop-index="${curIdx}"]`, v);
      if (target && typeof target.scrollIntoView === 'function') {
        requestAnimationFrame(() => target.scrollIntoView({ block: 'center', behavior: reduceMotion() ? 'auto' : 'smooth' }));
      }
    }
  };
  draw();
}
