// EZBERULLAH v2.2 — Grammar Academy: konu yönetimi, ders ekranı, 5 soruluk akıllı mini sınav ve bağımsız ilerleme sistemi.
import { GRAMMAR_LEVELS, GRAMMAR_TOPICS, GRAMMAR_QUESTIONS } from './grammar-data.js';
import { getGrammarProgress, saveGrammarProgress } from './storage.js';
import { shuffle } from './engine.js';
import { bumpDaily } from './statistics.js';
import { $, $$, esc, toast, speak, sfx } from './ui.js';

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

/* ---------- Arayüz (UI) Durumu ve Render Fonksiyonları ---------- */

let uiState = {
  selectedLevel: 'A2',
  activeTopicId: null,
  mode: 'list', // 'list' | 'lesson' | 'quiz' | 'result'
  quiz: null,
};

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
    if (typeof document !== 'undefined') toast('Bu ders henüz hazırlık aşamasındadır (Yakında).', 'info');
    return false;
  }
  uiState.selectedLevel = topic.level;
  uiState.activeTopicId = topic.id;
  uiState.mode = 'lesson';
  uiState.quiz = null;
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
  const overall = grammarOverallStats();
  const activeLv = ['A2', 'B1', 'B2'].includes(uiState.selectedLevel) ? uiState.selectedLevel : 'A2';
  const lvMeta = GRAMMAR_LEVELS.find((l) => l.id === activeLv);
  const topics = getTopicsByLevel(activeLv);
  const lvStat = overall.levels[activeLv];

  v.innerHTML = `
    <header class="g-hero card">
      <div class="g-hero-top">
        <div>
          <div class="g-eyebrow">EZBERULLAH EĞİTİM PLATFORMU</div>
          <h1 class="g-title">🎓 GRAMMAR ACADEMY</h1>
          <p class="g-subtitle">İngilizce Dil Bilgisini Adım Adım Öğren <span class="muted">· Detaylı Türkçe konu anlatımları, formüller, sınav taktikleri ve akıllı mini sınavlar.</span></p>
        </div>
        <div class="g-switch-actions">
          <a class="btn sm" href="#/dashboard">📖 Vocabulary (Kelime)</a>
        </div>
      </div>
      <div class="g-overall-bar">
        <div class="row between small">
          <span>Toplam Grammar İlerlemesi: <b>${overall.completedTopics}/${overall.totalTopics} Konu Tamamlandı</b></span>
          <span class="muted">${overall.readyTopics} aktif ders · ${overall.totalQuestionBank} özgün sınav sorusu</span>
        </div>
        <div class="progress"><i style="width:${overall.pct}%"></i></div>
      </div>
    </header>

    <section aria-label="Grammar Seviyeleri">
      <div class="grid g-levels-grid">
        ${GRAMMAR_LEVELS.map((lv) => {
          const st = overall.levels[lv.id];
          const isSel = lv.id === activeLv;
          return `
            <button type="button" class="card g-level-card ${isSel ? 'active' : ''}" data-g-level="${lv.id}" aria-pressed="${isSel}">
              <div class="row between">
                <span class="g-lv-badge">${lv.badge} — ${lv.name}</span>
                <span class="chip ${st.completedCount > 0 ? 'ok' : 'alt'}">${st.total} Konu</span>
              </div>
              <p class="muted small g-lv-desc">${esc(lv.description)}</p>
              <div class="g-lv-prog-text">
                <b>${lv.id} Grammar: ${st.completedCount}/${st.total} Konu Tamamlandı</b>
                <span class="muted small">%${st.pct}</span>
              </div>
              <div class="progress"><i style="width:${st.pct}%"></i></div>
            </button>
          `;
        }).join('')}
      </div>
    </section>

    <section aria-label="${activeLv} Grammar Konuları">
      <div class="row between wrap g-section-head">
        <div>
          <h2>${lvMeta.badge} — ${lvMeta.name} (${lvMeta.trName}) Müfredatı</h2>
          <p class="muted small">${activeLv} Grammar: ${lvStat.completedCount}/${lvStat.total} konu tamamlandı · Mini sınavda en az %80 (4/5) başarı sağlayan konular tamamlanmış sayılır.</p>
        </div>
      </div>

      <div class="grid g-topics-grid">
        ${topics.map((t) => {
          const ready = isTopicReady(t);
          const gp = getGrammarProgress(t.id);
          const qCount = getQuestionsForTopic(t.id).length;
          return `
            <article class="card g-topic-card ${ready ? 'is-ready' : 'is-soon'} ${gp.completed ? 'is-completed' : ''}">
              <div>
                <div class="row between g-topic-top">
                  <span class="chip alt sm">${t.level} · Konu ${t.order}</span>
                  <div class="row gap-xs">
                    ${gp.completed ? '<span class="chip ok">✅ Tamamlandı</span>' : ''}
                    ${ready ? `<span class="chip g-chip-gold">${qCount} Soru Havuzu</span>` : '<span class="chip alt">⏳ Yakında</span>'}
                  </div>
                </div>
                <h3 class="g-topic-title">${esc(t.title)}</h3>
                <p class="muted small g-topic-desc">${esc(t.description)}</p>
              </div>

              <div class="g-topic-footer">
                <div class="g-topic-metrics">
                  <div><span class="muted">Durum:</span> <b>${gp.completed ? 'Tamamlandı' : ready ? 'Ders Hazır' : 'Yakında'}</b></div>
                  <div><span class="muted">Son Sınav:</span> <b>${gp.lastScore !== null ? '%' + gp.lastScore : '—'}</b></div>
                  <div><span class="muted">En Yüksek:</span> <b>${gp.bestScore !== null ? '%' + gp.bestScore : '—'}</b></div>
                </div>
                <div class="row gap wrap g-topic-actions">
                  ${ready ? `
                    <button type="button" class="btn primary sm" data-open-lesson="${t.id}">📖 Derse Gir</button>
                    <button type="button" class="btn sm" data-start-gquiz="${t.id}">📝 Mini Sınav (5 Soru)</button>
                  ` : `
                    <button type="button" class="btn sm" disabled aria-disabled="true">⏳ Yakında</button>
                    <button type="button" class="btn ghost sm" disabled aria-disabled="true">Test Aktif Değil</button>
                  `}
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `;

  $$('[data-g-level]', v).forEach((b) => {
    b.onclick = () => {
      uiState.selectedLevel = b.dataset.gLevel;
      renderGrammarHome(v);
    };
  });
  $$('[data-open-lesson]', v).forEach((b) => {
    b.onclick = () => openGrammarLesson(b.dataset.openLesson, v);
  });
  $$('[data-start-gquiz]', v).forEach((b) => {
    b.onclick = () => startGrammarQuizUI(b.dataset.startGquiz, v);
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
  const qCount = getQuestionsForTopic(topic.id).length;

  v.innerHTML = `
    <div class="g-lesson-wrap">
      <div class="row between wrap g-lesson-nav">
        <button type="button" class="btn sm" id="g-back-list">← ${topic.level} Konu Listesine Dön</button>
        <div class="row gap">
          ${gp.completed ? '<span class="chip ok">✅ Tamamlandı</span>' : ''}
          <button type="button" class="btn primary sm" id="g-top-quiz">📝 Mini Sınava Başla (5 Soru)</button>
        </div>
      </div>

      <header class="card g-lesson-hero">
        <div class="row between wrap">
          <span class="chip g-chip-gold">${topic.level} · ${topic.order}. Konu</span>
          <span class="muted small">En Yüksek Başarı: <b>${gp.bestScore !== null ? '%' + gp.bestScore : 'Henüz çözülmedi'}</b> · Son Çalışma: ${fmtDateShort(gp.lastStudiedAt)}</span>
        </div>
        <h1 class="g-lesson-title">${esc(topic.title)}</h1>
        <p class="g-lesson-intro">${esc(c.intro)}</p>
      </header>

      <section class="card g-section">
        <h2>📘 1. Detaylı Konu Anlatımı</h2>
        <div class="g-sections-list">
          ${c.sections.map((s) => `
            <div class="g-sub-block">
              <h3>${esc(s.heading)}</h3>
              <p class="g-preline">${esc(s.body)}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="card g-section">
        <h2>📐 2. Grammar Formülleri (Yapı Tablosu)</h2>
        <div class="grid g-formula-grid">
          ${c.formulas.map((f) => `
            <div class="g-formula-box">
              <div class="g-formula-label">${esc(f.label)}</div>
              <pre class="g-formula-code">${esc(f.pattern)}</pre>
              ${f.note ? `<small class="muted">${esc(f.note)}</small>` : ''}
            </div>
          `).join('')}
        </div>
      </section>

      <section class="card g-section">
        <h2>💬 3. Örnek Cümleler ve Çevirileri</h2>
        <div class="g-examples-list">
          ${c.examples.map((ex) => `
            <div class="g-example-item">
              <div class="row between">
                <b class="g-ex-en">${esc(ex.en)}</b>
                <button type="button" class="btn ghost sm" data-speak-en="${esc(ex.en)}" aria-label="Cümleyi dinle">🔊 Dinle</button>
              </div>
              <div class="g-ex-tr">${esc(ex.tr)}</div>
              ${ex.note ? `<small class="g-ex-note">💡 ${esc(ex.note)}</small>` : ''}
            </div>
          `).join('')}
        </div>
      </section>

      <section class="card g-section">
        <h2>⭐ 4. Önemli Kurallar ve İpuçları</h2>
        <ul class="g-rules-list">
          ${c.keyRules.map((r) => `<li>${esc(r)}</li>`).join('')}
        </ul>
      </section>

      <section class="card g-section">
        <h2>⚠️ 5. Sık Yapılan Hatalar (Yanlış vs. Doğru)</h2>
        <div class="g-mistakes-list">
          ${c.commonMistakes.map((m) => `
            <div class="g-mistake-card">
              <div class="g-m-wrong">❌ <span>${esc(m.wrong)}</span></div>
              <div class="g-m-right">✅ <span>${esc(m.right)}</span></div>
              <p class="muted small g-m-exp"><b>Açıklama:</b> ${esc(m.explanation)}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="card g-section g-tips-card">
        <h2>🎯 6. Sınav Taktikleri</h2>
        <ul class="g-tips-list">
          ${c.examTips.map((tip) => `<li>${esc(tip)}</li>`).join('')}
        </ul>
      </section>

      <div class="card g-cta-card">
        <div>
          <h3>Konuyu Pekiştirmeye Hazır mısın?</h3>
          <p class="muted small">Bu konuya ait <b>${qCount} özgün soruluk</b> havuzdan rastgele seçilen 5 soruluk mini sınavı çözerek bilginizi ölçün. En az 4 doğru (%80) yaptığınızda konu <b>✅ Tamamlandı</b> rozeti kazanır.</p>
        </div>
        <button type="button" class="btn primary" id="g-bottom-quiz">📝 Mini Sınava Başla (5 Soru) →</button>
      </div>
    </div>
  `;

  $('#g-back-list', v).onclick = () => {
    uiState.mode = 'list';
    renderGrammarHome(v);
    window.scrollTo(0, 0);
  };
  $('#g-top-quiz', v).onclick = () => startGrammarQuizUI(topic.id, v);
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
  const pct = Math.round(((qState.idx + (qState.answered ? 1 : 0)) / total) * 100);
  const letters = ['A', 'B', 'C', 'D'];

  v.innerHTML = `
    <div class="quiz g-quiz-wrap">
      <div class="quiz-head">
        <button type="button" class="btn ghost sm" id="g-quiz-exit">← Derse Dön</button>
        <div class="progress"><i style="width:${pct}%"></i></div>
        <span class="muted small nowrap">${qState.idx + 1} / ${total}</span>
      </div>

      <div class="qcard ${qState.answered ? (qState.pickedIndex === item.answerIndex ? 'correct' : 'wrong') : ''}" id="g-qcard">
        <div class="row between" style="width:100%">
          <span class="chip alt">${esc(topic.level)} · ${esc(topic.title)}</span>
          <span class="chip alt sm">Zorluk: ${DIFF_LABELS[item.difficulty] || 'Orta'}</span>
        </div>

        <h2 class="sent g-q-stem">${esc(item.question)}</h2>

        <div class="options" id="g-options">
          ${item.options.map((opt, i) => {
            let cls = 'opt';
            if (qState.answered) {
              if (i === item.answerIndex) cls += ' right';
              else if (i === qState.pickedIndex) cls += ' bad picked';
            }
            return `
              <button type="button" class="${cls}" data-g-opt="${i}" ${qState.answered ? 'disabled' : ''}>
                <kbd>${letters[i]}</kbd> <span>${esc(opt)}</span>
              </button>
            `;
          }).join('')}
        </div>

        ${qState.answered ? `
          <div class="feedback ${qState.pickedIndex === item.answerIndex ? 'ok' : 'no'} g-q-feedback">
            <div><b>${qState.pickedIndex === item.answerIndex ? '✓ Doğru Cevap!' : `✗ Yanlış Cevap · Doğru Seçenek: ${letters[item.answerIndex]}) ${esc(item.correctAnswer)}`}</b></div>
            <p style="margin:.4rem 0 0;color:var(--tx)">💡 <b>Çözüm Açıklaması:</b> ${esc(item.explanation)}</p>
          </div>
          <div class="row end" style="width:100%">
            <button type="button" class="btn primary" id="g-quiz-next">
              ${qState.idx + 1 < total ? 'Sonraki Soru →' : 'Sınav Sonucunu Gör →'}
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  $('#g-quiz-exit', v).onclick = () => {
    uiState.mode = 'lesson';
    renderGrammar(v);
  };

  if (!qState.answered) {
    $$('[data-g-opt]', v).forEach((b) => {
      b.onclick = () => {
        if (qState.answered) return;
        const picked = +b.dataset.gOpt;
        const isCorrect = checkGrammarAnswer(item, picked);
        qState.answered = true;
        qState.pickedIndex = picked;
        qState.results.push({
          questionId: item.id,
          pickedIndex: picked,
          pickedText: item.options[picked],
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
          renderQuizResultView(v);
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
  const wrongCount = total - correctCount;
  const score = qState.summary ? qState.summary.score : calculateQuizScore(correctCount, total);
  const passed = score >= PASS_SCORE;
  const gp = getGrammarProgress(qState.topicId);

  v.innerHTML = `
    <div class="summary card g-result-card">
      <span class="chip ${passed ? 'ok' : 'alt'}">${passed ? '🎉 Mini Sınav Başarılı!' : '📚 Tekrar Çalışmanız Önerilir'}</span>
      <h2 style="margin-top:10px">${esc(topic.title)}</h2>
      <div class="big-num">%${score}</div>
      <p class="muted"><b>${correctCount} Doğru</b> · <b>${wrongCount} Yanlış</b> (Toplam ${total} Soru)</p>

      ${gp.completed ? `<div class="g-complete-banner">✅ Bu konu <b>Tamamlandı</b> rozetine sahip! (En Yüksek Başarı: %${gp.bestScore})</div>` : `<p class="muted small">Konuyu tamamlamak için 5 soruda en az 4 doğru (%80) yapmalısınız.</p>`}

      <div class="g-review-answers">
        <h3 style="text-align:left;margin-bottom:8px">Soru Özeti</h3>
        ${qState.items.map((it, idx) => {
          const r = qState.results[idx];
          return `
            <div class="g-ans-row ${r?.correct ? 'ok' : 'no'}">
              <div><b>${idx + 1}.</b> ${esc(it.question)}</div>
              <div class="small">
                Senin cevabın: <b>${esc(r?.pickedText || '—')}</b> ${r?.correct ? '✓' : `✗ (Doğru: <b>${esc(it.correctAnswer)}</b>)`}
              </div>
              <div class="muted small">${esc(it.explanation)}</div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="row gap center wrap" style="margin-top:18px">
        <button type="button" class="btn primary" id="g-retry-quiz">🔄 Yeni Mini Sınav Çöz</button>
        <button type="button" class="btn" id="g-back-lesson">📖 Ders Anlatımına Dön</button>
        <button type="button" class="btn ghost" id="g-back-home">🎓 Grammar Academy</button>
      </div>
    </div>
  `;

  $('#g-retry-quiz', v).onclick = () => startGrammarQuizUI(topic.id, v);
  $('#g-back-lesson', v).onclick = () => openGrammarLesson(topic.id, v);
  $('#g-back-home', v).onclick = () => {
    uiState.mode = 'list';
    uiState.quiz = null;
    renderGrammarHome(v);
  };
}
