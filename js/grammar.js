// VELUNO — Grammar Academy: konu yönetimi, ders ekranı, 5 soruluk akıllı mini sınav ve bağımsız ilerleme sistemi.
import { GRAMMAR_LEVELS, GRAMMAR_TOPICS, GRAMMAR_QUESTIONS } from './grammar-data.js';
import { getGrammarProgress, saveGrammarProgress } from './storage.js';
import { shuffle } from './engine.js';
import { bumpDaily } from './statistics.js';
import { $, $$, esc, toast, speak, sfx, ICONS, successMark } from './ui.js';

export { GRAMMAR_LEVELS, GRAMMAR_TOPICS, GRAMMAR_QUESTIONS };

export const MINI_QUIZ_SIZE = 5;
export const PASS_SCORE = 80; // 5 soruda en az 4 doğru (%80)

const DIFF_LABELS = { easy: 'Kolay', medium: 'Orta', hard: 'Zor' };

/* ---------- Saf Veri & Doğrulama Fonksiyonları ---------- */

export function getTopicsByLevel(level) {
  return GRAMMAR_TOPICS.filter((t) => !level || t.level === level).sort((a, b) => a.order - b.order);
}

export function getTopicById(topicId) {
  return GRAMMAR_TOPICS.find((t) => t.id === topicId) || null;
}

export function validateGrammarQuestion(q) {
  const errs = [];
  if (!q || typeof q !== 'object') return ['Soru nesnesi geçersiz'];
  if (!q.id || typeof q.id !== 'string') errs.push('Soru ID eksik');
  if (!q.topicId || typeof q.topicId !== 'string') errs.push('Konu ID (topicId) eksik');
  if (!['A2', 'B1', 'B2'].includes(q.level)) errs.push('Geçersiz seviye');
  if (!q.question || typeof q.question !== 'string' || !q.question.trim()) errs.push('Soru metni eksik');
  if (!Array.isArray(q.options) || q.options.length !== 4) errs.push('4 seçenek bulunmalı');
  else {
    const trimmed = q.options.map((o) => String(o ?? '').trim());
    if (trimmed.some((o) => !o)) errs.push('Boş seçenek olamaz');
    if (new Set(trimmed).size !== 4) errs.push('Seçenekler birbirinden farklı olmalı');
  }
  if (!q.correctAnswer || typeof q.correctAnswer !== 'string') errs.push('Doğru cevap (correctAnswer) eksik');
  else if (Array.isArray(q.options) && !q.options.includes(q.correctAnswer)) errs.push('Doğru cevap seçenekler içinde yer almıyor');
  if (!q.explanation || typeof q.explanation !== 'string' || !q.explanation.trim()) errs.push('Türkçe çözüm açıklaması eksik');
  if (!['easy', 'medium', 'hard'].includes(q.difficulty)) errs.push('Zorluk derecesi geçersiz');
  return errs;
}

export function getQuestionsForTopic(topicId, pool = GRAMMAR_QUESTIONS) {
  if (!topicId || !Array.isArray(pool)) return [];
  return pool.filter((q) => q && q.topicId === topicId && validateGrammarQuestion(q).length === 0);
}

export function isTopicReady(topicOrId, pool = GRAMMAR_QUESTIONS) {
  const t = typeof topicOrId === 'string' ? getTopicById(topicOrId) : topicOrId;
  if (!t || t.status !== 'ready' || !t.content) return false;
  const c = t.content;
  if (!c.intro || !Array.isArray(c.sections) || !c.sections.length) return false;
  if (!Array.isArray(c.formulas) || !c.formulas.length) return false;
  if (!Array.isArray(c.examples) || !c.examples.length) return false;
  if (!Array.isArray(c.keyRules) || !c.keyRules.length) return false;
  if (!Array.isArray(c.commonMistakes) || !c.commonMistakes.length) return false;
  if (!Array.isArray(c.examTips) || !c.examTips.length) return false;
  return getQuestionsForTopic(t.id, pool).length >= MINI_QUIZ_SIZE;
}

export function canStartGrammarQuiz(topicId, pool = GRAMMAR_QUESTIONS) {
  return isTopicReady(topicId, pool);
}

/**
 * Konu havuzundan rastgele 5 benzersiz soru seçer, hem soru sırasını hem de A/B/C/D şıklarını karıştırır.
 * Havuzda 5'ten az geçerli soru varsa veya konu hazır değilse boş dizi döner.
 */
export function buildGrammarMiniQuiz(topicId, count = MINI_QUIZ_SIZE, rnd = Math.random, pool = GRAMMAR_QUESTIONS) {
  if (!canStartGrammarQuiz(topicId, pool)) return [];
  const valid = getQuestionsForTopic(topicId, pool);
  if (valid.length < count) return [];
  const picked = shuffle(valid, rnd).slice(0, count);
  return picked.map((q) => {
    const shuffledOptions = shuffle(q.options, rnd);
    const answerIndex = shuffledOptions.indexOf(q.correctAnswer);
    return {
      id: q.id,
      topicId: q.topicId,
      level: q.level,
      question: q.question,
      options: shuffledOptions,
      answerIndex,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
    };
  });
}

export function checkGrammarAnswer(quizItem, choice) {
  if (!quizItem) return false;
  if (typeof choice === 'number') return choice === quizItem.answerIndex && quizItem.options[choice] === quizItem.correctAnswer;
  if (typeof choice === 'string') return choice.trim() === quizItem.correctAnswer.trim();
  return false;
}

export function calculateQuizScore(correctCount, totalCount = MINI_QUIZ_SIZE) {
  if (!totalCount || totalCount <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((correctCount / totalCount) * 100)));
}

/**
 * Mini sınav sonucunu Grammar ilerleme sistemine kaydeder.
 * Kural: 5 soruda en az 4 doğru (%80) yapıldığında konu Tamamlandı (completed: true) olur.
 * Daha sonraki düşük puanlar kazanılmış tamamlanma rozetini silmez.
 */
export async function recordGrammarQuizResult(topicId, { correct, total = MINI_QUIZ_SIZE, elapsedSeconds = 0 }, now = Date.now()) {
  const score = calculateQuizScore(correct, total);
  const wrong = Math.max(0, total - correct);
  const prev = getGrammarProgress(topicId);
  const updated = {
    topicId,
    attempts: (prev.attempts || 0) + 1,
    totalQuestions: (prev.totalQuestions || 0) + total,
    correctAnswers: (prev.correctAnswers || 0) + correct,
    wrongAnswers: (prev.wrongAnswers || 0) + wrong,
    lastScore: score,
    bestScore: prev.bestScore === null || prev.bestScore === undefined ? score : Math.max(prev.bestScore, score),
    completed: Boolean(prev.completed || score >= PASS_SCORE),
    lastStudiedAt: now,
  };
  await saveGrammarProgress(updated);
  if (elapsedSeconds > 0 || total > 0) {
    await bumpDaily({
      seconds: Math.round(elapsedSeconds),
      correct,
      wrong,
      sessionsCompleted: 1,
    });
  }
  return { progress: updated, score, passed: score >= PASS_SCORE };
}

export function grammarLevelStats(level) {
  const topics = getTopicsByLevel(level);
  let completedCount = 0;
  let readyCount = 0;
  let totalQuestionsSolved = 0;
  for (const t of topics) {
    if (isTopicReady(t)) readyCount++;
    const gp = getGrammarProgress(t.id);
    if (gp.completed) completedCount++;
    totalQuestionsSolved += gp.totalQuestions || 0;
  }
  const total = topics.length;
  const pct = total ? Math.round((completedCount / total) * 100) : 0;
  return { level, total, readyCount, completedCount, pct, totalQuestionsSolved };
}

export function grammarOverallStats() {
  const byLevel = {
    A2: grammarLevelStats('A2'),
    B1: grammarLevelStats('B1'),
    B2: grammarLevelStats('B2'),
  };
  const totalTopics = GRAMMAR_TOPICS.length;
  const readyTopics = GRAMMAR_TOPICS.filter((t) => isTopicReady(t)).length;
  const completedTopics = byLevel.A2.completedCount + byLevel.B1.completedCount + byLevel.B2.completedCount;
  const pct = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;
  return {
    totalTopics,
    readyTopics,
    completedTopics,
    pct,
    totalQuestionBank: GRAMMAR_QUESTIONS.length,
    levels: byLevel,
  };
}

/* ---------- Arayüz (UI) Durumu ve Render Fonksiyonları — Learning Journey ---------- */

let uiState = {
  selectedLevel: 'A2',
  activeTopicId: null,
  mode: 'list', // 'list' | 'lesson' | 'quiz' | 'result'
  quiz: null,
};

const setFocus = (on) => { if (typeof document !== 'undefined') document.body.classList.toggle('focus', on); };
const pad = (n) => String(n).padStart(2, '0');

/** Grammar ekranını konu listesine (öğrenme yolculuğuna) döndürür. */
export function resetGrammarView() {
  uiState.mode = 'list';
  uiState.quiz = null;
  uiState.activeTopicId = null;
  setFocus(false);
}

/** Ana sayfanın "devam et" önerisi için: ilk hazır ve tamamlanmamış ders. */
export function nextGrammarTopic() {
  const levels = ['A2', 'B1', 'B2'];
  for (const lv of levels) {
    for (const t of getTopicsByLevel(lv)) {
      if (isTopicReady(t) && !getGrammarProgress(t.id).completed) return t;
    }
  }
  return null;
}

function fmtDateShort(ts) {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

export function openGrammarLesson(topicId, container = typeof document !== 'undefined' ? document.getElementById('view') : null) {
  const topic = getTopicById(topicId);
  if (!topic || !isTopicReady(topic)) {
    if (typeof document !== 'undefined') toast('Bu ders henüz hazır değil.', 'info');
    return false;
  }
  uiState.selectedLevel = topic.level;
  uiState.activeTopicId = topic.id;
  uiState.mode = 'lesson';
  uiState.quiz = null;
  setFocus(false);
  if (container) {
    renderGrammar(container);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }
  return true;
}

export function startGrammarQuizUI(topicId, container = typeof document !== 'undefined' ? document.getElementById('view') : null) {
  const topic = getTopicById(topicId);
  if (!topic || !canStartGrammarQuiz(topicId)) {
    if (typeof document !== 'undefined') toast('Bu konunun mini sınavı henüz aktif değil.', 'error');
    return false;
  }
  const items = buildGrammarMiniQuiz(topicId, MINI_QUIZ_SIZE);
  if (items.length < MINI_QUIZ_SIZE) {
    if (typeof document !== 'undefined') toast('Sınav başlatılamadı: yeterli sayıda geçerli soru yok.', 'error');
    return false;
  }
  uiState.selectedLevel = topic.level;
  uiState.activeTopicId = topicId;
  uiState.mode = 'quiz';
  uiState.quiz = {
    topicId,
    items,
    idx: 0,
    answered: false,
    pickedIndex: null,
    results: [],
    startedAt: Date.now(),
  };
  if (container) {
    renderGrammar(container);
    window.scrollTo(0, 0);
  }
  return true;
}

export function renderGrammar(v) {
  if (!v) return;
  setFocus(uiState.mode === 'quiz');
  if (uiState.mode === 'lesson' && uiState.activeTopicId) {
    return renderLessonView(v, uiState.activeTopicId);
  }
  if (uiState.mode === 'quiz' && uiState.quiz) {
    return renderQuizView(v);
  }
  if (uiState.mode === 'result' && uiState.quiz) {
    return renderQuizResultView(v);
  }
  renderGrammarHome(v);
}

function renderGrammarHome(v) {
  const activeLv = ['A2', 'B1', 'B2'].includes(uiState.selectedLevel) ? uiState.selectedLevel : 'A2';
  const lvMeta = GRAMMAR_LEVELS.find((l) => l.id === activeLv);
  const topics = getTopicsByLevel(activeLv);
  const lvStat = grammarLevelStats(activeLv);
  const firstOpen = topics.find((t) => isTopicReady(t) && !getGrammarProgress(t.id).completed);

  v.innerHTML = `
    <div class="page">
      <h1>Grammar</h1>
      <p class="lead">Dil bilgisini adım adım öğren.</p>
      <div class="seg" role="group" aria-label="Seviye">
        ${GRAMMAR_LEVELS.map((lv) => `<button type="button" class="seg-btn ${lv.id === activeLv ? 'active' : ''}" data-g-level="${lv.id}" aria-pressed="${lv.id === activeLv}">${lv.id}</button>`).join('')}
      </div>
      <p class="path-meta muted small">${esc(lvMeta.name)} · ${lvStat.completedCount}/${lvStat.total} tamamlandı</p>
      <ol class="path" aria-label="${activeLv} öğrenme yolu">
        ${topics.map((t) => {
          const ready = isTopicReady(t);
          const done = ready && getGrammarProgress(t.id).completed;
          const active = firstOpen && firstOpen.id === t.id;
          const state = done ? 'done' : active ? 'active' : ready ? 'ready' : 'locked';
          const node = done ? ICONS.check : ready ? pad(t.order) : ICONS.lock;
          const label = `${pad(t.order)} — ${t.title}`;
          return `<li class="step ${state}">
            <button type="button" class="step-btn" ${ready ? `data-open-lesson="${t.id}"` : 'disabled aria-disabled="true"'} aria-label="${esc(label)}${done ? ' (tamamlandı)' : ''}">
              <span class="step-node" aria-hidden="true">${node}</span>
              <span class="step-text"><span class="step-no">${pad(t.order)}</span><span class="step-title">${esc(t.title)}</span></span>
              ${active ? '<span class="step-cta">Başla</span>' : ''}
            </button>
          </li>`;
        }).join('')}
      </ol>
    </div>`;

  $$('[data-g-level]', v).forEach((b) => {
    b.onclick = () => {
      uiState.selectedLevel = b.dataset.gLevel;
      renderGrammarHome(v);
    };
  });
  $$('[data-open-lesson]', v).forEach((b) => {
    b.onclick = () => openGrammarLesson(b.dataset.openLesson, v);
  });
}

function renderLessonView(v, topicId) {
  const topic = getTopicById(topicId);
  if (!topic || !isTopicReady(topic)) {
    uiState.mode = 'list';
    return renderGrammarHome(v);
  }
  const gp = getGrammarProgress(topic.id);
  const c = topic.content;

  v.innerHTML = `
    <article class="lesson">
      <nav class="lesson-nav"><button type="button" class="back-link" id="g-back-list">${ICONS.back}<span>Grammar</span></button>${gp.completed ? `<span class="done-tag">${ICONS.check}Tamamlandı</span>` : ''}</nav>
      <header class="lesson-head">
        <div class="eyebrow">${topic.level} · ${pad(topic.order)}</div>
        <h1>${esc(topic.title)}</h1>
        <p class="lead">${esc(c.intro)}</p>
      </header>

      <section class="l-sec">
        <h2>Konu Anlatımı</h2>
        ${c.sections.map((s) => `<h3>${esc(s.heading)}</h3><p class="g-preline">${esc(s.body)}</p>`).join('')}
      </section>

      <section class="l-sec">
        <h2>Formüller</h2>
        <dl class="formulas">
          ${c.formulas.map((f) => `<div class="formula"><dt>${esc(f.label)}</dt><dd><code>${esc(f.pattern)}</code>${f.note ? `<small class="muted">${esc(f.note)}</small>` : ''}</dd></div>`).join('')}
        </dl>
      </section>

      <section class="l-sec">
        <h2>Örnek Cümleler</h2>
        <ul class="examples">
          ${c.examples.map((ex) => `<li><div><b>${esc(ex.en)}</b><span class="tr">${esc(ex.tr)}</span>${ex.note ? `<small class="muted">${esc(ex.note)}</small>` : ''}</div><button type="button" class="speak-btn sm" data-speak-en="${esc(ex.en)}" aria-label="Cümleyi dinle">${ICONS.speaker}</button></li>`).join('')}
        </ul>
      </section>

      <section class="l-sec">
        <h2>Önemli Kurallar</h2>
        <ul class="note">${c.keyRules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
      </section>

      <section class="l-sec">
        <h2>Sık Yapılan Hatalar</h2>
        <ul class="mistakes">
          ${c.commonMistakes.map((m) => `<li><div class="m-wrong">${esc(m.wrong)}</div><div class="m-right">${esc(m.right)}</div><p class="muted small">${esc(m.explanation)}</p></li>`).join('')}
        </ul>
      </section>

      <details class="more">
        <summary>Sınav Taktikleri</summary>
        <div class="more-body"><ul class="plain">${c.examTips.map((tip) => `<li>${esc(tip)}</li>`).join('')}</ul></div>
      </details>

      <div class="lesson-cta">
        <button type="button" class="btn primary xl block" id="g-bottom-quiz">Mini Sınava Geç</button>
        <p class="muted small center">5 soru · tamamlamak için en az 4 doğru${gp.bestScore !== null ? ` · En yüksek: %${gp.bestScore}` : ''}</p>
      </div>
    </article>
  `;

  $('#g-back-list', v).onclick = () => {
    uiState.mode = 'list';
    renderGrammarHome(v);
    window.scrollTo(0, 0);
  };
  $('#g-bottom-quiz', v).onclick = () => startGrammarQuizUI(topic.id, v);
  $$('[data-speak-en]', v).forEach((b) => {
    b.onclick = () => speak(b.dataset.speakEn);
  });
}

function renderQuizView(v) {
  const qState = uiState.quiz;
  const topic = getTopicById(qState.topicId);
  const item = qState.items[qState.idx];
  const total = qState.items.length;
  const pct = Math.round((qState.idx / total) * 100);
  const nextPct = Math.round(((qState.idx + (qState.answered ? 1 : 0)) / total) * 100);
  const picked = qState.pickedIndex;
  const good = qState.answered && picked === item.answerIndex;

  v.innerHTML = `
    <div class="run">
      <div class="run-top">
        <button type="button" class="icon-btn" id="g-quiz-exit" aria-label="Derse dön">${ICONS.close}</button>
        <div class="progress thin"><i style="width:${pct}%"></i></div>
        <span class="run-count">${qState.idx + 1}/${total}</span>
      </div>
      <div class="run-body ${qState.answered ? (good ? 'correct' : 'wrong') : ''}" id="g-qcard">
        <div class="run-label"><span>${esc(topic.title)}</span></div>
        <h2 class="sent g-q-stem">${esc(item.question)}</h2>
        <div class="options" id="g-options">
          ${item.options.map((opt, i) => {
            let cls = 'opt';
            if (qState.answered) {
              if (i === item.answerIndex) cls += ' right';
              else if (i === picked) cls += ' bad picked';
            }
            return `<button type="button" class="${cls}" data-g-opt="${i}" ${qState.answered ? 'disabled' : ''}><span class="opt-n">${['A', 'B', 'C', 'D'][i]}</span><span>${esc(opt)}</span></button>`;
          }).join('')}
        </div>
        ${qState.answered ? `
          <div class="feedback ${good ? 'ok' : 'no'}" role="status">
            <b>${good ? 'Doğru' : 'Yanlış'}</b>
            ${good ? '' : `<span>Doğru cevap: ${esc(item.correctAnswer)}</span>`}
            <small>${esc(item.explanation)}</small>
          </div>
          <button type="button" class="btn primary xl block" id="g-quiz-next">${qState.idx + 1 < total ? 'Devam' : 'Sonucu Gör'}</button>
        ` : ''}
      </div>
    </div>
  `;
  if (qState.answered) {
    const bar = $('.progress i', v);
    if (bar) { bar.style.width = pct + '%'; requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = nextPct + '%'; })); }
  }

  $('#g-quiz-exit', v).onclick = () => {
    uiState.mode = 'lesson';
    renderGrammar(v);
  };

  if (!qState.answered) {
    $$('[data-g-opt]', v).forEach((b) => {
      b.onclick = () => {
        if (qState.answered) return;
        const p = +b.dataset.gOpt;
        const isCorrect = checkGrammarAnswer(item, p);
        qState.answered = true;
        qState.pickedIndex = p;
        qState.results.push({
          questionId: item.id,
          pickedIndex: p,
          pickedText: item.options[p],
          correctAnswer: item.correctAnswer,
          correct: isCorrect,
        });
        sfx(isCorrect ? 'ok' : 'bad');
        renderQuizView(v);
        const nextBtn = $('#g-quiz-next', v);
        if (nextBtn) nextBtn.focus();
      };
    });
  } else {
    const nextBtn = $('#g-quiz-next', v);
    if (nextBtn) {
      nextBtn.onclick = async () => {
        if (qState.idx + 1 < total) {
          qState.idx++;
          qState.answered = false;
          qState.pickedIndex = null;
          renderQuizView(v);
        } else {
          const correctCount = qState.results.filter((r) => r.correct).length;
          const elapsed = Math.min(300, Math.max(1, (Date.now() - qState.startedAt) / 1000));
          const summary = await recordGrammarQuizResult(qState.topicId, {
            correct: correctCount,
            total,
            elapsedSeconds: elapsed,
          });
          qState.summary = summary;
          uiState.mode = 'result';
          renderGrammar(v);
        }
      };
    }
  }
}

function renderQuizResultView(v) {
  const qState = uiState.quiz;
  const topic = getTopicById(qState.topicId);
  const total = qState.items.length;
  const correctCount = qState.results.filter((r) => r.correct).length;
  const score = qState.summary ? qState.summary.score : calculateQuizScore(correctCount, total);
  const passed = score >= PASS_SCORE;
  const gp = getGrammarProgress(qState.topicId);

  v.innerHTML = `
    <div class="summary">
      ${passed ? successMark() : ''}
      <h2>${esc(topic.title)}</h2>
      <div class="big-num">%${score}</div>
      <p class="verdict">${passed ? (gp.completed ? 'Konu tamamlandı' : 'Başarılı') : 'Bir tur daha çalış'}</p>
      <p class="muted">${correctCount} doğru · ${total - correctCount} yanlış${passed ? '' : ' · tamamlamak için en az 4 doğru gerekir'}</p>
      <details class="more">
        <summary>Cevap analizi</summary>
        <div class="more-body">
          <ul class="list flush">
            ${qState.items.map((it, idx) => {
              const r = qState.results[idx];
              return `<li class="g-ans ${r?.correct ? 'ok' : 'no'}"><b>${idx + 1}. ${esc(it.question)}</b><span>Cevabın: ${esc(r?.pickedText || '—')}${r?.correct ? '' : ` · Doğru: ${esc(it.correctAnswer)}`}</span><small class="muted">${esc(it.explanation)}</small></li>`;
            }).join('')}
          </ul>
        </div>
      </details>
      <div class="sum-actions">
        ${passed
          ? '<button type="button" class="btn primary" id="g-back-home">Grammar Yoluna Dön</button><button type="button" class="btn ghost" id="g-retry-quiz">Yeni Mini Sınav</button>'
          : '<button type="button" class="btn primary" id="g-retry-quiz">Yeni Mini Sınav</button><button type="button" class="btn ghost" id="g-back-home">Grammar Yoluna Dön</button>'}
        <button type="button" class="btn ghost" id="g-back-lesson">Ders Anlatımı</button>
      </div>
    </div>
  `;

  $('#g-retry-quiz', v).onclick = () => startGrammarQuizUI(topic.id, v);
  $('#g-back-lesson', v).onclick = () => openGrammarLesson(topic.id, v);
  $('#g-back-home', v).onclick = () => {
    uiState.mode = 'list';
    uiState.quiz = null;
    setFocus(false);
    renderGrammarHome(v);
    window.scrollTo(0, 0);
  };
}
