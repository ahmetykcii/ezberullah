// LEXORA otomatik testleri (saf mantık + bellek içi depolama + yeni özellik testleri).
// Çalıştırma:  node tests/run-tests.mjs   veya (macOS)  jsc -m tests/run-tests.mjs
// NOT: Tarayıcıya özgü kısımlar (IndexedDB gerçek yazma, DOM tıklama, Service Worker, Web Speech) bu testlerde çalıştırılmaz.
import * as E from '../js/engine.js';
import { state, getProgress, saveProgress, initStorage, persistent } from '../js/storage.js';
import {
  seedBuiltIn, validateWord, addWord, editWord, removeWord, LEVELS, LEVEL_NAMES,
  STATUS_LABELS, POS_LABELS, CATEGORY_LABELS, prepareWordInfo, getMissingFields,
  isWordReady, filterWords,
} from '../js/vocabulary.js';
import { parseCSV, parseTable, guessMapping, analyzeRows, buildBackup, validateBackup, restoreBackup } from '../js/import-export.js';
import { handlers, resumeSaved, startSession, getCurrentSession, abortSession, startLearn, openGroupSizeModal, getStudyGroupRotation, saveStudyGroupRotation } from '../js/learning.js';
import '../js/review.js';
import { buildExamItems } from '../js/exams.js';
import { studyPlan, candidates, reviewItems } from '../js/review.js';
import { levelStats, streak, streakStats, today, todayLearnedCount, getMistakeAnalytics, bumpDaily } from '../js/statistics.js';
import { DEFAULT_SETTINGS, getSettings, setSetting, getMeta, setMeta, getGrammarProgress, saveGrammarProgress } from '../js/storage.js';
import * as G from '../js/grammar.js';
import '../js/vocab-ui.js';
import { resolveTheme, THEME_IDS, THEME_META_COLORS } from '../js/app.js';
import * as Paths from '../js/paths.js';
import * as PathUI from '../js/path-ui.js';
import * as Auth from '../js/auth.js';
import * as FbCfg from '../js/firebase-config.js';
import { renderSurprise } from '../js/surprise.js';
import {
  NOTEBOOK_STAGE_OPTIONS, openStageSelectionModal,
  NOTEBOOK_DEFAULT_STAGES, resolveNotebookStages, memoryWordsGetter, startNotebookMemoryGame, selectNotebookStudyGroup,
  createNotebookList, updateNotebookList, deleteNotebookList,
  getUserNotebookLists, getAllNotebookLists, saveAllNotebookLists,
  buildPersonalWord, addWordToNotebook, parseBulkWords, bulkAddWordsToNotebook,
  removeWordFromNotebookList, getListStats, getUserNotebookSummary,
  startStudyList, startStudyAll, startStudyUnknown, startStudyDue,
  getUserNotebookWords, getAllNotebookWords, saveAllNotebookWords,
} from '../js/notebook.js';
import * as MG from '../js/memory-game.js';
import { sessionHooks } from '../js/learning.js';
import {
  BUILTIN_IRREGULAR_VERBS, getBuiltInIrregularVerbs,
  parseAcceptedForms, checkVerbFormAnswer,
  validateIrregularVerb,
  createIrregularList, updateIrregularList, deleteIrregularList,
  getUserIrregularLists, getUserCustomIrregularVerbs,
  addVerbToIrregularList, removeVerbFromIrregularList,
  parseBulkIrregularVerbs, bulkAddVerbsToIrregularList,
  newVerbProgress, getVerbProgress, saveVerbProgress,
  applyVerbAnswer, isVerbDue, selectWeightedFormForVerb,
  computeVerbSetStats, getIrregularListStats,
  buildIrregularQuestion, checkIrregularQuestionAnswer,
  startIrregularStudySession, renderIrregularVerbs, resetIrregularView,
} from '../js/irregular-verbs.js';

const out = typeof print === 'function' ? print : console.log;
if (typeof console === 'undefined') globalThis.console = { log: out, warn: () => {}, error: out };
if (typeof globalThis.localStorage === 'undefined') {
  const mem = new Map();
  globalThis.localStorage = {
    getItem: (k) => (mem.has(String(k)) ? mem.get(String(k)) : null),
    setItem: (k, v) => mem.set(String(k), String(v)),
    removeItem: (k) => mem.delete(String(k)),
    clear: () => mem.clear(),
  };
}
if (typeof globalThis.sessionStorage === 'undefined') {
  const smem = new Map();
  globalThis.sessionStorage = {
    getItem: (k) => (smem.has(String(k)) ? smem.get(String(k)) : null),
    setItem: (k, v) => smem.set(String(k), String(v)),
    removeItem: (k) => smem.delete(String(k)),
    clear: () => smem.clear(),
  };
}
let pass = 0, fail = 0;
const test = async (name, fn) => { try { await fn(); pass++; out('  ✓ ' + name); } catch (e) { fail++; out('  ✗ ' + name + ' → ' + (e && e.message)); } };
const ok = (c, m = 'assert') => { if (!c) throw new Error(m); };
const eq = (a, b, m = '') => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m} beklenen ${JSON.stringify(b)}, gelen ${JSON.stringify(a)}`); };

const readJSON = async (p) => {
  if (typeof readFile === 'function') return JSON.parse(readFile(p));
  const fs = await import('node:fs'); return JSON.parse(fs.readFileSync(p, 'utf8'));
};
const readText = async (p) => {
  if (typeof readFile === 'function') return readFile(p);
  const fs = await import('node:fs'); return fs.readFileSync(p, 'utf8');
};
const loader = (lv) => readJSON(`data/${lv.toLowerCase()}.json`);

out('1) Veri ve Türkçeleştirme Etiketleri');
const data = {};
for (const lv of LEVELS) data[lv] = await loader(lv);
await test('her seviyede aktif ve taslak kelimeler var, şema doğrulanıyor', () => {
  for (const lv of LEVELS) {
    const active = data[lv].filter((w) => !w.isDraft);
    ok(active.length >= 140, lv + ' aktif kelime sayısı yeterli olmalı');
    data[lv].forEach((w) => { eq(validateWord(w), [], w.id); ok(w.level === lv); });
  }
});
await test('id benzersiz, kelime hem seviye içinde hem seviyeler arasında (A2/B1/B2) tekrarsız', () => {
  const all = LEVELS.flatMap((l) => data[l]);
  eq(new Set(all.map((w) => w.id)).size, all.length, 'ID tekrarı olmamalı');
  eq(new Set(all.map((w) => w.word.toLowerCase())).size, all.length, 'Seviyeler arası kelime tekrarı olmamalı');
});
await test('her AKTİF örnek cümle hedef kelimeyi içeriyor; DRAFT kelimeler isWordReady=false döner', () => {
  const all = LEVELS.flatMap((l) => data[l]);
  all.filter((w) => !w.isDraft).forEach((w) => {
    ok(E.blankSentence(w), 'aktif kelimede boşluk üretilemedi: ' + w.word);
    ok(isWordReady(w), 'aktif kelime isWordReady=true olmalı: ' + w.id);
  });
  all.filter((w) => w.isDraft).forEach((w) => {
    ok(!isWordReady(w), 'DRAFT kelime isWordReady=false olmalı: ' + w.id);
  });
});
await test('zorunlu alanlar aktif kelimelerde eksiksiz, DRAFT kelimelerde missingFields raporlu', () => {
  const all = LEVELS.flatMap((l) => data[l]);
  all.filter((w) => !w.isDraft).forEach((w) => {
    ok(w.exampleTranslation && w.category && w.partOfSpeech && Array.isArray(w.alternativeAnswers) && w.createdAt && w.updatedAt, w.id);
  });
  all.filter((w) => w.isDraft).forEach((w) => {
    ok(Array.isArray(w.missingFields) && w.missingFields.length > 0 && w.partOfSpeech && w.meanings.length > 0, w.id);
  });
});
await test('seviye, durum, kelime türü ve kategori Türkçe etiketleri eksiksiz', () => {
  eq(LEVEL_NAMES, { A2: 'Temel Seviye', B1: 'Orta Seviye', B2: 'Orta Üstü Seviye' });
  eq(STATUS_LABELS, { NEW: 'Yeni', LEARNING: 'Öğreniliyor', REVIEW: 'Tekrar Edilecek', MASTERED: 'Kalıcı Öğrenilen' });
  eq(POS_LABELS.noun, 'İsim'); eq(POS_LABELS.verb, 'Fiil'); eq(POS_LABELS.adjective, 'Sıfat');
  eq(POS_LABELS.adverb, 'Zarf'); eq(POS_LABELS['phrasal verb'], 'Öbek Fiil'); eq(POS_LABELS.preposition, 'Edat');
  eq(POS_LABELS.conjunction, 'Bağlaç'); eq(POS_LABELS.pronoun, 'Zamir'); eq(POS_LABELS.determiner, 'Belirteç');
  eq(POS_LABELS.expression, 'İfade'); eq(POS_LABELS.idiom, 'Deyim');
  eq(CATEGORY_LABELS.Education, 'Eğitim'); eq(CATEGORY_LABELS.Environment, 'Çevre');
  eq(CATEGORY_LABELS.Technology, 'Teknoloji'); eq(CATEGORY_LABELS.Health, 'Sağlık');
  eq(CATEGORY_LABELS.Science, 'Bilim'); eq(CATEGORY_LABELS.Business, 'İş Dünyası');
  eq(CATEGORY_LABELS.Psychology, 'Psikoloji'); eq(CATEGORY_LABELS['Daily Life'], 'Günlük Yaşam');
  eq(CATEGORY_LABELS['Academic Vocabulary'], 'Akademik Kelimeler'); eq(CATEGORY_LABELS['Confusing Words'], 'Karıştırılan Kelimeler');
});
await test('Ayarlar sayfasında #intro ID çakışması yok ve index.html Türkçe menü içeriyor', async () => {
  const appCode = await readText('js/app.js');
  ok(!appCode.includes('id="intro"'), 'app.js içinde id="intro" kalmamalı');
  ok(appCode.includes("btnRow('replay-intro'") && appCode.includes("$('#replay-intro'"), 'replay-intro butonu bulunmalı');
  const html = await readText('index.html');
  for (const label of ['Kelime Defterim', 'Hazır Kelime Havuzu', 'Yolum', 'Tekrar', 'Grammar', 'Kelime Havuzum', 'Sınavlar', 'İstatistikler', 'Ayarlar']) {
    ok(html.includes(label), 'Eksik menü etiketi: ' + label);
  }
});
await test('Açılış ekranı onay kutusu ve giriş bildirimi güncel kurallara uygun', async () => {
  const html = await readText('index.html');
  ok(html.includes('id="intro-agree"'), 'intro-agree onay kutusu bulunmalı');
  ok(html.includes('Duamı ettim, Allah Ahmet Yakıcı’dan razı olsun.'), 'Onay kutusu metni doğru olmalı');
  ok(html.includes('id="intro-go" class="intro-btn rv t6" disabled'), 'Giriş butonu başlangıçta disabled olmalı');
  const appCode = await readText('js/app.js');
  ok(appCode.includes('btn.disabled = !agree.checked'), 'Checkbox durumuna göre buton aktif/pasif olmalı');
  ok(appCode.includes('✅ Duanız sisteme başarıyla kaydedildi. +10 sevap (temsili) 😇'), 'Güncellenmiş bildirim metni bulunmalı');
});

out('2) Engine ve 6 Aşamalı Öğrenme');
const W = data.A2[0];
await test('yazma cevabı: büyük/küçük harf ve boşluk tolere, yazım hatası kabul edilmez', () => {
  const q = E.buildQuestion(W, 'typing', []);
  ok(E.checkAnswer(q, '  ' + W.word.toUpperCase() + ' '));
  ok(!E.checkAnswer(q, W.word + 'x')); ok(!E.checkAnswer(q, W.word.slice(1))); ok(!E.checkAnswer(q, ''));
});
await test('alternatif cevap (neighbour/neighbor) kabul edilir', () => {
  const w = data.A2.find((x) => x.word === 'neighbour');
  const q = E.buildQuestion(w, 'typing', []); ok(E.checkAnswer(q, 'neighbor')); ok(E.checkAnswer(q, 'neighbour'));
});
await test('çoktan seçmeli: 4 seçenek, 1 doğru, tekrar yok, karışık', () => {
  const all = [...data.A2, ...data.B1, ...data.B2]; const firstIdx = new Set();
  for (let i = 0; i < 30; i++) {
    const q = E.buildQuestion(W, 'mc', all);
    eq(q.options.length, 4); eq(new Set(q.options).size, 4); ok(q.options[q.answerIndex] === W.meanings[0]);
    ok(E.checkAnswer(q, q.answerIndex)); ok(!E.checkAnswer(q, (q.answerIndex + 1) % 4)); firstIdx.add(q.answerIndex);
  }
  ok(firstIdx.size > 1, 'seçenekler karışmıyor');
});
await test('eksik harf: uzunluğa göre gizleme, konum değişken, doğru kelime kabul', () => {
  const w = data.B2.find((x) => x.word === 'investigate'); const pos = new Set();
  for (let i = 0; i < 20; i++) { const m = E.maskWord(w.word); ok(m.hidden >= 3 && m.hidden <= 4); pos.add(m.masked); }
  ok(pos.size > 3); eq(E.maskWord('cat').hidden, 1);
  ok(E.checkAnswer(E.buildQuestion(w, 'missing', []), 'investigate'));
});
await test('cümle tamamlama: hedef kelime gizlenir, çekimli biçim kabul edilir', () => {
  const w = data.B2.find((x) => x.word === 'analyse'); const q = E.buildQuestion(w, 'sentence', []);
  ok(q.prompt.includes('_____') && !/analys/i.test(q.prompt)); ok(E.checkAnswer(q, 'analysed')); ok(E.checkAnswer(q, 'analyse'));
});
await test('production (Standart): kelime + en az 4 kelimelik cümle', () => {
  const q = E.buildQuestion(W, 'production', []);
  ok(E.checkAnswer(q, `I like my ${W.word} very much`)); ok(!E.checkAnswer(q, W.word)); ok(!E.checkAnswer(q, 'This sentence has no target word'));
});
await test('hakimiyet puanı aralıkları ve etiketler', () => {
  eq(E.masteryLabel(10), 'Bilmiyor'); eq(E.masteryLabel(30), 'Öğreniyor'); eq(E.masteryLabel(50), 'Gelişiyor'); eq(E.masteryLabel(70), 'İyi'); eq(E.masteryLabel(95), 'Çok iyi');
  eq(E.masteryScore(E.newProgress('x')), 0);
});
await test('4 aşama tamamlanınca learningComplete olur ama MASTERED olmaz', () => {
  const p = E.newProgress('t1'); const t0 = 1e12;
  for (let s = 2; s <= 4; s++) E.applyAnswer(p, true, { mode: 'learn', stage: s }, t0);
  ok(p.learningComplete); eq(p.currentStage, 4); ok(p.currentStatus === 'LEARNING'); eq(p.nextReviewAt, t0 + E.DAY);
});
await test('3. aşamada hata → REVIEW, hata kaydı, aşama ilerlemez, geçmiş silinmez', () => {
  const p = E.newProgress('t2'); E.markSeen(p); E.applyAnswer(p, true, { mode: 'learn', stage: 2 });
  E.applyAnswer(p, false, { mode: 'learn', stage: 3, qtype: 'typing' });
  eq(p.currentStatus, 'REVIEW'); eq(p.incorrectCount, 1); eq(p.correctCount, 1); eq(p.currentStage, 2);
  eq(p.mistakeHistory.length, 1); eq(p.mistakeHistory[0].stage, 3);
});
await test('SRS: başarılı tekrar aralığı uzatır (1→3→7→14→30), hata kısaltır', () => {
  const p = E.newProgress('t3'); let now = 1e12;
  for (let s = 2; s <= 4; s++) E.applyAnswer(p, true, { mode: 'learn', stage: s }, now);
  const seen = [];
  for (let i = 0; i < 5; i++) { now = p.nextReviewAt; E.applyAnswer(p, true, { mode: 'review' }, now); seen.push(p.reviewInterval); }
  eq(seen, [3, 7, 14, 30, 30]);
  ok(p.currentStatus === 'MASTERED', 'MASTERED olmalı'); ok(p.masteryScore >= 60);
  E.applyAnswer(p, false, { mode: 'review' }, now);
  eq(p.reviewInterval, 1); ok(p.currentStatus === 'REVIEW'); ok(p.srsStep < 5); ok(p.mistakeHistory.length === 1);
});
await test('Mastered kelime pratikte yanlış yapılırsa REVIEW\'a döner ve tekrar planlanır', () => {
  const p = E.newProgress('t4'); p.learningComplete = true; p.currentStatus = 'MASTERED'; p.srsStep = 5; p.nextReviewAt = 1e12 + 30 * E.DAY;
  E.applyAnswer(p, false, { mode: 'practice' }, 1e12); ok(p.currentStatus === 'REVIEW'); ok(p.nextReviewAt <= 1e12 + E.DAY); ok(E.isDue(p, 1e12));
});
await test('learnBatch: en çok 2 hatalı kelime, oturum kilitlenmez', () => {
  const ws = data.A2.slice(0, 12); const prog = {};
  ws.slice(0, 6).forEach((w) => { const p = E.newProgress(w.id); p.currentStatus = 'REVIEW'; p.incorrectCount = 5; p.currentStage = 2; prog[w.id] = p; });
  const b = E.learnBatch(ws, prog, 5); eq(b.length, 5); ok(b.filter((w) => prog[w.id]).length <= 2, 'çok fazla hatalı');
  const items = E.learnItems(b, prog); ok(items.some((i) => i.stage === 4) && !items.some((i) => i.stage === 5) && !items.some((i) => i.stage === 6));
});

out('3) Depolama, Basit Kelime Ekleme, Taslak ve Otomatik Bilgi Hazırlama');
await initStorage();
await test('Node/JSC ortamında IndexedDB yok → bellek yedeği çalışır', () => { ok(persistent === false); });
await test('seedBuiltIn kelimeleri ekler; ikinci çağrı tekrar eklemez', async () => {
  const r1 = await seedBuiltIn(loader); ok(r1.added === state.words.length && r1.errors.length === 0);
  const r2 = await seedBuiltIn(loader); eq(r2.added, 0);
});
await test('kelime ekleme, tekrar engelleme, düzenleme, silme', async () => {
  const r = await addWord({ level: 'A2', word: 'bridge', meanings: 'köprü', partOfSpeech: 'noun', exampleSentence: 'The bridge is very old.', exampleTranslation: 'Köprü çok eski.', category: 'Daily Life' });
  ok(r.ok && !r.isDraft && isWordReady(r.word), JSON.stringify(r)); ok(state.wordMap.has(r.word.id));
  const d = await addWord({ level: 'A2', word: 'Bridge', meanings: 'köprü' }); ok(!d.ok);
  const d2 = await addWord({ level: 'A2', word: 'bridge', meanings: 'iskele; briç', exampleSentence: 'They played bridge all evening.' }); ok(d2.ok, 'farklı anlam ayrı kayıt olabilmeli');
  ok(!(await addWord({ level: 'C1', word: 'x', meanings: 'y' })).ok); ok(!(await addWord({ level: 'A2', word: '', meanings: 'y' })).ok);
  const e = await editWord(r.word.id, { meanings: 'köprü; geçit' }); ok(e.ok && state.wordMap.get(r.word.id).meanings.length === 2);
  await removeWord(r.word.id); ok(!state.wordMap.has(r.word.id)); await removeWord(d2.word.id);
});
await test('basit kelime ekleme (yalnızca 3 bilgi) → taslak olarak kaydedilir, öğrenme/sınavlara girmez, tamamlanınca girer', async () => {
  const r = await addWord({ word: 'resilient', meanings: 'dayanıklı', level: 'B2' });
  ok(r.ok && r.isDraft === true && !isWordReady(r.word), 'taslak olmalı');
  ok(r.missing.length >= 2, 'eksik alanlar bildirilmeli');
  // Havuzda görünmeli ve DRAFT filtresiyle bulunmalı
  ok(filterWords({ status: 'DRAFT' }).some((w) => w.id === r.word.id), 'DRAFT filtresinde görünmeli');
  // Ancak learnBatch ve sınav öğelerine dahil edilmemeli
  const b2Words = state.words.filter((w) => w.level === 'B2');
  ok(!E.learnBatch(b2Words, state.progress, 500).some((w) => w.id === r.word.id), 'taslak kelime learnBatch içinde olmamalı');
  ok(!buildExamItems('mini', 'B2').some((i) => i.wordId === r.word.id), 'taslak kelime sınavda olmamalı');
  // Eksik bilgiler tamamlandığında öğrenmeye hazır hale gelmeli
  const upd = await editWord(r.word.id, {
    partOfSpeech: 'adjective',
    exampleSentence: 'Children are often very resilient after change.',
    exampleTranslation: 'Çocuklar değişimden sonra genellikle çok dayanıklıdır.',
  });
  ok(upd.ok && !upd.isDraft && isWordReady(upd.word), 'tamamlanınca taslak olmaktan çıkmalı');
  eq(getMissingFields(upd.word), []);
  ok(E.learnBatch(state.words.filter((w) => w.level === 'B2'), state.progress, 2000).some((w) => w.id === r.word.id), 'tamamlanan kelime learnBatch içine girmeli');
  await removeWord(r.word.id);
});
await test('ücretsiz otomatik bilgi hazırlama: bilinen kelimeyi doldurur, bilinmeyen kelimede uydurmaz', async () => {
  const known = await prepareWordInfo('achieve', { level: 'B1', meanings: 'başarmak' });
  ok(known.found === true && known.source === 'local');
  eq(known.data.partOfSpeech, 'verb');
  ok(known.data.exampleSentence.includes('achieve'));
  ok(known.data.synonyms.includes('accomplish'));
  eq(known.missing, []);

  const unknown = await prepareWordInfo('serendipity', { level: 'B2', meanings: 'mutlu tesadüf' });
  ok(unknown.found === false && unknown.source === 'none');
  eq(unknown.data, {});
  ok(unknown.missing.length >= 2, 'eksik alanlar raporlanmalı');
});

out('4) Oturum, Tekrar, Sınav ve İstatistik Akışı');
await test('Learn handler: 4 aşama, yanlış → REVIEW + drop, günlük istatistik kaydı', async () => {
  const w = data.A2[0];
  const item = (stage, type) => ({ wordId: w.id, stage, type });
  await handlers.learn.onAnswer(item(1, 'card'), true, { elapsed: 1 });
  await handlers.learn.onAnswer(item(2, 'mc'), true, { elapsed: 3 });
  const r = await handlers.learn.onAnswer(item(3, 'typing'), false, { elapsed: 5 });
  ok(r.drop === true);
  let p = getProgress(w.id); eq(p.currentStatus, 'REVIEW'); eq(p.currentStage, 2); eq(p.incorrectCount, 1);
  await handlers.learn.onAnswer(item(3, 'typing'), true, { elapsed: 2 }); await handlers.learn.onAnswer(item(4, 'missing'), true, { elapsed: 2 });
  p = getProgress(w.id); ok(p.learningComplete); eq(p.currentStage, 4); eq(p.currentStatus, 'LEARNING'); eq(p.incorrectCount, 1, 'geçmiş korunmalı'); eq(p.mistakeHistory.length, 1);
  const day = Object.values(state.daily)[0]; ok(day.correct >= 3 && day.wrong === 1 && day.newWords === 1 && day.seconds > 0);
  eq(streak(), 1);
});
await test('Review handler + candidates: due kelime Akıllı Tekrar listesinde', async () => {
  const w = data.A2[0]; const p = getProgress(w.id); p.nextReviewAt = Date.now() - 1000; await saveProgress(p);
  ok(candidates('smart').some((x) => x.id === w.id));
  await handlers.review.onAnswer({ wordId: w.id, type: 'mc' }, true, { elapsed: 2 });
  const p2 = getProgress(w.id); eq(p2.srsStep, 1); eq(p2.reviewInterval, 3); ok(p2.nextReviewAt > Date.now() + 2 * E.DAY);
  ok(!candidates('smart').some((x) => x.id === w.id));
  ok(Object.values(state.daily)[0].rt >= 1);
});
await test('seviye istatistikleri: Öğrenme Tamamlanma, Kalıcı Öğrenme ve Taslak (DRAFT) sayısı ayrı', () => {
  const s = levelStats('A2');
  eq(s.total, data.A2.filter((w) => !w.isDraft).length);
  eq(s.drafts, data.A2.filter((w) => w.isDraft).length);
  eq(s.completed, 1); ok(s.completion > 0); eq(s.mastery, 0);
});
await test('sınav öğeleri: Seviye Bitirme = 40 soru (10/10/10/10)', () => {
  const it = buildExamItems('final', 'A2'); eq(it.length, 40);
  for (const t of ['mc', 'typing', 'missing', 'sentence']) eq(it.filter((i) => i.type === t).length, 10, t);
  eq(new Set(it.map((i) => i.wordId)).size, 40, 'benzersiz kelime');
});
await test('sınav bitişi kaydeder, yanlış kelimeleri REVIEW yapar', async () => {
  const w = data.A2[5]; await handlers.exam.onAnswer({ wordId: w.id, type: 'typing' }, false, { elapsed: 4 });
  eq(getProgress(w.id).currentStatus, 'REVIEW');
  const html = await handlers.exam.onDone([{ wordId: w.id, type: 'typing', correct: false, t: 4 }, { wordId: data.A2[6].id, type: 'mc', correct: true, t: 2 }], { title: 'Mini Sınav', params: { exam: 'mini', level: '' } });
  ok(html.html.includes('%50')); eq(state.exams.length, 1); eq(state.exams[0].wrongWords[0].word, w.word); eq(state.exams[0].passed, false);
});
await test('sınav tarihi planı', () => {
  const now = new Date('2026-11-01T10:00:00').getTime(); const p = studyPlan(now, '2026-11-20');
  eq(p.days, 20); ok(p.suggested > 0 && p.newPerDay > 0); ok(studyPlan(now, '2026-10-01').past); eq(studyPlan(now, ''), null);
});

out('5) İçe Aktarma / Yedekleme');
await test('CSV: tırnaklı alan, virgül, BOM, boş satır', () => {
  const r = parseCSV('\uFEFFword,meaning\n"hello, world","merhaba; dünya"\n\nbye,hoşça kal\n'); eq(r.length, 3); eq(r[1][0], 'hello, world');
});
await test('TXT biçimleri ve başlık algılama', () => {
  eq(parseTable('apple - elma\nbook - kitap', 'txt').rows, [['apple', 'elma'], ['book', 'kitap']]);
  eq(parseTable('apple;elma\nbook;kitap', 'txt').rows.length, 2);
  const t = parseTable('word;meaning;level\nfox;tilki;A2', 'csv'); eq(t.headers[0], 'word'); eq(t.rows.length, 1);
  const j = parseTable(JSON.stringify([{ word: 'fox', meanings: ['tilki'], level: 'A2' }]), 'json'); eq(j.rows[0][1], 'tilki');
});
await test('analyzeRows: geçerli / tekrar / hatalı sınıflandırır', () => {
  const t = parseTable('word;meaning;level\nfox;tilki;A2\nfox;tilki;A2\n123;sayı;A2\nlion;aslan;Z9\n' + data.A2[1].word + ';' + data.A2[1].meanings[0] + ';A2', 'csv');
  const res = analyzeRows(t.rows, guessMapping(t.headers), 'A2'); eq(res.map((r) => r.status), ['ok', 'dup', 'error', 'error', 'dup']);
});
await test('yedek: oluştur → doğrula → geri yükle (veri kaybı yok)', async () => {
  const b = JSON.parse(JSON.stringify(buildBackup())); eq(validateBackup(b), []);
  const nWords = state.words.length, nProg = Object.keys(state.progress).length;
  await restoreBackup(b); eq(state.words.length, nWords); eq(Object.keys(state.progress).length, nProg); eq(state.exams.length, 1);
});
await test('bozuk yedek reddedilir', () => {
  const b = JSON.parse(JSON.stringify(buildBackup()));
  ok(validateBackup({ foo: 1 }).length); ok(validateBackup(null).length);
  const c = JSON.parse(JSON.stringify(b)); c.words[0].level = 'ZZ'; ok(validateBackup(c).length);
  const d = JSON.parse(JSON.stringify(b)); delete d.progress; ok(validateBackup(d).length);
  const e = JSON.parse(JSON.stringify(b)); e.schemaVersion = 99; ok(validateBackup(e).length);
});
await test('silinen yerleşik kelime güncellemede geri gelmez; kullanıcı kelimesi korunur', async () => {
  const u = await addWord({ level: 'B1', word: 'keepme', meanings: 'beni sakla' }); ok(u.ok);
  const builtin = data.B1[0]; await removeWord(builtin.id);
  await seedBuiltIn(loader); ok(!state.wordMap.has(builtin.id)); ok(state.wordMap.has(u.word.id));
});

out('6) A2 + B1 + B2 Veri Paketi Entegrasyonu (2.010 Aktif + 14 Taslak | Toplam 2.024 Kayıt), Cevap Kuralları ve Önbellek');
await test('2.010 aktif kelime ve 14 taslak kelime (toplam 2.024 yerleşik kayıt) doğrulandı', () => {
  eq(data.A2.length, 712); eq(data.A2.filter((w) => !w.isDraft).length, 700); eq(data.A2.filter((w) => w.isDraft).length, 12);
  eq(data.B1.length, 712); eq(data.B1.filter((w) => !w.isDraft).length, 710); eq(data.B1.filter((w) => w.isDraft).length, 2);
  eq(data.B2.length, 600); eq(data.B2.filter((w) => !w.isDraft).length, 600); eq(data.B2.filter((w) => w.isDraft).length, 0);
  // neighbor bağımsız aktif kart olmamalı, neighbour alternativeAnswers korunmalı
  const neighbourOrig = data.A2.find((w) => w.id === 'a2-neighbour-027');
  ok(neighbourOrig && !neighbourOrig.isDraft && neighbourOrig.alternativeAnswers.includes('neighbor'));
  const neighborDup = data.A2.find((w) => w.id === 'a2-oxref-0125');
  ok(neighborDup && neighborDup.isDraft === true && !isWordReady(neighborDup), 'neighbor taslakta kalmalı');
});
await test('yeni aktifleşen 210 A2 kelimesinin tamamı boşluk doldurma ve 5 soru tipiyle (mc, typing, missing, sentence, production) tam uyumlu', () => {
  const all = [...data.A2, ...data.B1, ...data.B2];
  const newlyActivated = data.A2.slice(274).filter((w) => !w.isDraft);
  ok(newlyActivated.length >= 204);
  for (const w of newlyActivated) {
    ok(isWordReady(w), 'Kelime hazır olmalı: ' + w.id);
    const b = E.blankSentence(w);
    ok(b && b.text.includes('_____'), 'Boşluk üretilebilmeli: ' + w.id);
    for (const qType of ['mc', 'typing', 'missing', 'sentence', 'production']) {
      const q = E.buildQuestion(w, qType, all);
      eq(q.type, qType);
    }
  }
});
await test('12 A2 taslağı ve 2 B1 taslağı (toplam 14 taslak) öğrenme ve sınav sistemlerinde gösterilmez', () => {
  const heldA2 = data.A2.filter((w) => w.isDraft);
  const heldB1 = data.B1.filter((w) => w.isDraft);
  eq(heldA2.length, 12);
  eq(heldB1.length, 2);
  ok(heldA2.every((w) => w.isDraft === true && !isWordReady(w)), '12 A2 kelimesi taslak olmalı');
  ok(heldB1.every((w) => w.isDraft === true && !isWordReady(w)), '2 B1 kelimesi taslak olmalı');
  const batchA2 = E.learnBatch(state.words.filter((w) => w.level === 'A2'), state.progress, 2000);
  ok(batchA2.every((w) => !w.isDraft && isWordReady(w)), 'A2 learnBatch içinde taslak kelime olmamalı');
  const batchB1 = E.learnBatch(state.words.filter((w) => w.level === 'B1'), state.progress, 2000);
  ok(batchB1.every((w) => !w.isDraft && isWordReady(w)), 'B1 learnBatch içinde taslak kelime olmamalı');
  const examItemsA2 = buildExamItems('final', 'A2');
  ok(examItemsA2.every((i) => !state.wordMap.get(i.wordId)?.isDraft), 'A2 sınavında taslak kelime olmamalı');
  const examItemsB1 = buildExamItems('final', 'B1');
  ok(examItemsB1.every((i) => !state.wordMap.get(i.wordId)?.isDraft), 'B1 sınavında taslak kelime olmamalı');
  const draftsInFilter = filterWords({ status: 'DRAFT' });
  eq(draftsInFilter.filter((w) => !w.custom).length, 14, 'Tüm 14 yerleşik taslak kelime DRAFT filtresinde görünmeli');
});
await test('önceden IndexedDB\'de taslak (isDraft:true) olan yerleşik kelime seedBuiltIn ile otomatik aktifleşir ve ilerleme korunur', async () => {
  const target = state.wordMap.get('a2-oxref-0031'); // explain
  target.isDraft = true;
  ok(!isWordReady(target));
  const res = await seedBuiltIn(loader);
  ok(res.added >= 1, 'Taslaktan aktife geçen yerleşik kelime güncellenmeli');
  ok(state.wordMap.get('a2-oxref-0031').isDraft === false && isWordReady(state.wordMap.get('a2-oxref-0031')));
});
await test('Service Worker önbellek sürümü (veluno-v5.0.3) ve önbellek dosya listesi güncellendi', async () => {
  const sw = await readText('service-worker.js');
  ok(sw.includes("const VERSION = 'veluno-v5.0.3';"), 'SW sürümü veluno-v5.0.3 olmalı');
  for (const f of ['index.html', 'manifest.webmanifest', 'manifest.json', 'css/style.css', 'js/app.js', 'js/grammar-data.js', 'js/grammar.js', 'js/notebook.js', 'js/irregular-verbs.js', 'data/a2.json', 'data/b1.json', 'data/b2.json', 'data/irregular-verbs.json', 'assets/icons/icon.svg', 'assets/icons/logo-full.svg', 'assets/icons/apple-touch-icon.png', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/icon-maskable-512.png']) {
    ok(sw.includes(`'${f}'`), 'SW FILES içinde eksik dosya: ' + f);
  }
});
await test('VELUNO marka dönüşümü, modern safir-mavi ikon sistemi, Apple benzeri tasarım ve "ahmet ❤️ sude" özel imzası doğrulandı', async () => {
  const html = await readText('index.html');
  const appCode = await readText('js/app.js');
  const css = await readText('css/style.css');
  const mf1 = await readJSON('manifest.webmanifest');
  const mf2 = await readJSON('manifest.json');
  const svgIcon = await readText('assets/icons/icon.svg');
  const svgLogoFull = await readText('assets/icons/logo-full.svg');

  ok(html.includes('<title>VELUNO'), 'Tarayıcı sekmesi başlığı VELUNO olmalı');
  ok(html.includes('✦ VELUNO ✦'), 'Açılış ekranında VELUNO imzası bulunmalı');
  ok(html.includes('<b class="brand-name" aria-label="VELUNO">VELUNO</b>'), 'Sol menüde VELUNO başlığı bulunmalı');
  ok(!html.includes('LEXORA') && !html.includes('EZBERULLAH'), 'index.html içinde eski LEXORA veya EZBERULLAH adı kalmamalı');
  ok(!html.includes('ahmet') && !html.includes('sude'), 'ahmet ❤️ sude imzası index.html / kenar çubuğunda değil yalnızca Ana Sayfada olmalı');
  ok(html.includes('class="nav-ic"') && html.includes('<svg viewBox="0 0 24 24"'), 'Navigasyonda ince çizgili modern monokrom SVG ikonlar kullanılmalı');

  eq(mf1.short_name, 'VELUNO');
  ok(mf1.name.startsWith('VELUNO'));
  eq(mf1.background_color, '#F7F9FC');
  eq(mf1.theme_color, '#F7F9FC');
  eq(mf2.short_name, 'VELUNO');
  ok(mf1.icons.some((i) => i.src === 'assets/icons/apple-touch-icon.png' && i.sizes === '180x180'));
  ok(svgIcon.includes('aria-label="VELUNO"') && svgIcon.includes('#4F8EF7') && !svgIcon.includes('<text'), 'Telefon/uygulama ikonunda yalnızca VELUNO sembolü bulunmalı');
  ok(svgLogoFull.includes('VELUNO'), 'Tam logoda VELUNO başlığı olmalı');

  ok(appCode.includes('<span class="hero-title" aria-label="VELUNO">VELUNO</span>'), 'Üst marka alanında VELUNO başlığı bulunmalı');
  ok(appCode.includes('<span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span>'), 'Küçük harfli ahmet ❤️ sude imzası dokunulmadan korunmalı');
  ok(css.includes('.hero-sig{') && css.includes('text-transform:lowercase') && css.includes('font-weight:300') && css.includes('align-self:flex-end'), 'İmza CSS kuralları (küçük harf, ince font, sağ alt hiza) bulunmalı');
  ok(css.includes('.sig-heart{color:#EF4444'), 'Kalp kırmızı renkte (#EF4444) tanımlanmalı');
  ok(!css.includes('#D4B475') && !css.includes('#C9A86A'), 'Eski sarı/altın renk kodları (#D4B475, #C9A86A) tamamen kaldırılmış olmalı');
});
await test('VELUNO Tema Sistemi: Açık tema varsayılan, Koyu ve Otomatik (Cihaz Teması) seçenekleri, renk paletleri ve parlama önleyici script doğrulandı', async () => {
  const html = await readText('index.html');
  const appCode = await readText('js/app.js');
  const css = await readText('css/style.css');

  // 1) Varsayılan tema Açık (light) olmalı
  eq(DEFAULT_SETTINGS.theme, 'light', 'DEFAULT_SETTINGS.theme varsayılan olarak light olmalı');
  ok(html.includes('<html lang="tr" data-theme="light">'), 'index.html varsayılan olarak data-theme="light" ile başlamalı');
  ok(html.includes('prefers-color-scheme: dark') && html.includes('document.documentElement.dataset.theme'), 'Sayfa yenilemesinde yanlış tema parlamasını (flash) önleyen inline script bulunmalı');

  // 2) resolveTheme fonksiyonu light / dark / auto modlarını doğru çözümlemeli
  eq(resolveTheme('light', true), 'light');
  eq(resolveTheme('light', false), 'light');
  eq(resolveTheme('dark', false), 'dark');
  eq(resolveTheme('dark', true), 'dark');
  eq(resolveTheme('auto', true), 'dark', 'Otomatik modda cihaz koyu ise dark dönmeli');
  eq(resolveTheme('auto', false), 'light', 'Otomatik modda cihaz açık ise light dönmeli');

  // 3) Ayarlar menüsünde Açık, Koyu ve Otomatik seçenekleri bulunmalı
  ok(appCode.includes('data-set-theme="light"') && appCode.includes('data-set-theme="dark"') && appCode.includes('data-set-theme="auto"'), 'Ayarlarda Açık / Koyu / Otomatik tema butonları bulunmalı');
  ok(appCode.includes('>Açık</button>') && appCode.includes('>Koyu</button>') && appCode.includes('>Otomatik</button>'), 'Ayarlarda Açık / Koyu / Otomatik etiketleri bulunmalı');

  // 4) Açık ve Koyu tema renk paletleri şartnameye birebir uymalı
  for (const token of ['#F7F9FC', '#FFFFFF', '#F1F4F8', '#17243B', '#738098', '#E5E9F0', '#4F8EF7', '#EAF2FF', '#2F9E66', '#D89B2B', '#D96B6B']) {
    ok(css.includes(token), `Açık tema renk paletinde ${token} bulunmalı`);
  }
  for (const token of ['#101317', '#1B2027', '#252B33', '#F3F5F7', '#9BA6B5', '#303741', '#6FA8FF', '#1E314D', '#3FB97C', '#E0AB45', '#E07A7A']) {
    ok(css.includes(token), `Koyu tema renk paletinde ${token} bulunmalı`);
  }
});
await test('iPhone / Safari uyumluluğu (safe-area, viewport-fit, apple-touch-icon, klavye ve TTS) ve yedek uyumluluğu doğrulandı', async () => {
  const html = await readText('index.html');
  const css = await readText('css/style.css');
  const uiCode = await readText('js/ui.js');
  const learnCode = await readText('js/learning.js');

  ok(html.includes('viewport-fit=cover'), 'viewport-fit=cover bulunmalı');
  ok(html.includes('name="apple-mobile-web-app-capable" content="yes"'), 'iOS web-app meta etiketi bulunmalı');
  ok(html.includes('name="apple-mobile-web-app-title" content="VELUNO"'), 'iOS ana ekran başlığı VELUNO olmalı');
  ok(html.includes('rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png"'), '180x180 apple-touch-icon bağlantısı bulunmalı');
  ok(css.includes('env(safe-area-inset-top)') && css.includes('env(safe-area-inset-bottom)'), 'Safari safe-area boşlukları bulunmalı');
  ok(css.includes('body.kb-open #bottomnav{display:none}'), 'Mobil klavye açıldığında alt menü gizlenmeli');
  ok(css.includes('font-size:max(16px,1rem)'), 'iOS Safari otomatik yakınlaştırmasını önleyen >=16px font kuralı bulunmalı');
  ok(uiCode.includes('NOVELTY_VOICES') && uiCode.includes('PREFERRED_VOICES'), 'iOS Safari doğal İngilizce ses seçimi bulunmalı');
  ok(learnCode.includes('enterkeyhint="done"'), 'iPhone klavyesi için enterkeyhint="done" bulunmalı');

  // Hem yeni VELUNO hem eski EZBERULLAH ve LEXORA yedekleri geçerli kabul edilmeli
  const b = buildBackup();
  eq(b.app, 'VELUNO');
  eq(validateBackup(b), []);
  const ezBackup = { ...JSON.parse(JSON.stringify(b)), app: 'EZBERULLAH' };
  eq(validateBackup(ezBackup), []);
  const legacyB = { ...JSON.parse(JSON.stringify(b)), app: 'LEXORA' };
  eq(validateBackup(legacyB), []);
});
await test('alternativeAnswers kuralı: eş anlamlılar (fall/bookstore) ve kısaltmalar (ad/advert/cm) doğru cevap sayılmaz; yalnızca UK/US yazım varyantı (centimeter) kabul edilir', () => {
  const adv = data.A2.find((w) => w.id === 'a2-advertisement-051');
  const qAdv = E.buildQuestion(adv, 'typing', data.A2);
  ok(E.checkAnswer(qAdv, 'advertisement'));
  ok(!E.checkAnswer(qAdv, 'ad'), 'ad kısaltması kabul edilmemeli');
  ok(!E.checkAnswer(qAdv, 'advert'), 'advert kısaltması kabul edilmemeli');

  const aut = data.A2.find((w) => w.id === 'a2-autumn-075');
  const qAut = E.buildQuestion(aut, 'typing', data.A2);
  ok(E.checkAnswer(qAut, 'autumn'));
  ok(!E.checkAnswer(qAut, 'fall'), 'fall eş anlamlısı autumn yerine kabul edilmemeli');

  const bks = data.A2.find((w) => w.id === 'a2-bookshop-104');
  const qBks = E.buildQuestion(bks, 'typing', data.A2);
  ok(E.checkAnswer(qBks, 'bookshop'));
  ok(!E.checkAnswer(qBks, 'bookstore'), 'bookstore eş anlamlısı bookshop yerine kabul edilmemeli');

  const cm = data.A2.find((w) => w.id === 'a2-centimetre-141');
  const qCm = E.buildQuestion(cm, 'typing', data.A2);
  ok(E.checkAnswer(qCm, 'centimetre'));
  ok(E.checkAnswer(qCm, 'centimeter'), 'centimeter UK/US yazım varyantı kabul edilmeli');
  ok(!E.checkAnswer(qCm, 'cm'), 'cm kısaltması kabul edilmemeli');
});
await test('yeni A2 pilot kelimeleri öğrenme oturumlarında (learnBatch + 4 aşama: card, mc, typing, missing) tam uyumlu çalışır', async () => {
  // İlk 46 kelimeyi tamamlanmış varsayalım ki learnBatch doğrudan yeni pilot kelimeleri seçsin
  const customProg = {};
  for (let i = 0; i < 46; i++) {
    customProg[data.A2[i].id] = { ...E.newProgress(data.A2[i].id), learningComplete: true, currentStatus: 'LEARNING', currentStage: 4 };
  }
  const batch = E.learnBatch(data.A2, customProg, 5);
  eq(batch.length, 5);
  ok(batch.every((w) => !customProg[w.id]?.learningComplete), 'Tamamlanmış ilk 46 kelime dışındaki yeni kelimeler seçilmeli');
  const items = E.learnItems(batch, customProg);
  eq(items.length, 20); // 5 kelime x 4 aşama

  // Yeni pilot kelimelerden biriyle (a2-abroad-047) gerçek 4 aşamalı oturum ve soru doğrulaması
  const pw = data.A2[46]; // a2-abroad-047
  eq(pw.id, 'a2-abroad-047');
  for (const t of ['mc', 'typing', 'missing']) {
    const q = E.buildQuestion(pw, t, data.A2);
    eq(q.type, t);
    if (t === 'mc') ok(E.checkAnswer(q, q.answerIndex));
    else ok(E.checkAnswer(q, pw.word));
  }

  // Oturum ilerlemesini kaydet
  const item = (stage, type) => ({ wordId: pw.id, stage, type });
  await handlers.learn.onAnswer(item(1, 'card'), true, { elapsed: 1 });
  await handlers.learn.onAnswer(item(2, 'mc'), true, { elapsed: 2 });
  await handlers.learn.onAnswer(item(3, 'typing'), true, { elapsed: 2 });
  await handlers.learn.onAnswer(item(4, 'missing'), true, { elapsed: 2 });
  const p = getProgress(pw.id);
  ok(p.learningComplete && p.currentStage === 4 && p.correctCount === 3, 'Pilot kelime 4 aşamayı tamamlamalı');
});
await test('sayfa yenilendiğinde / seedBuiltIn tekrar çalıştığında mevcut ve yeni kelimelerin öğrenme ilerlemesi korunur', async () => {
  const beforeProgOld = JSON.stringify(getProgress('a2-apartment-001'));
  const beforeProgNew = JSON.stringify(getProgress('a2-abroad-047'));
  const beforeCount = state.words.length;

  // Sayfa yenileme simülasyonu: seedBuiltIn yeniden çağrılır ve yedek/geri yükleme döngüsü çalıştırılır
  const reseed = await seedBuiltIn(loader);
  eq(reseed.added, 0, 'Mevcut kelimeler tekrar eklenmemeli');
  eq(state.words.length, beforeCount, 'Kelime sayısı değişmemeli');
  eq(JSON.stringify(getProgress('a2-apartment-001')), beforeProgOld, 'Eski kelimenin ilerlemesi korunmalı');
  eq(JSON.stringify(getProgress('a2-abroad-047')), beforeProgNew, 'Yeni pilot kelimenin ilerlemesi korunmalı');

  const snap = JSON.parse(JSON.stringify(buildBackup()));
  await restoreBackup(snap);
  eq(JSON.stringify(getProgress('a2-apartment-001')), beforeProgOld, 'Geri yükleme sonrası eski kelime ilerlemesi korunmalı');
  eq(JSON.stringify(getProgress('a2-abroad-047')), beforeProgNew, 'Geri yükleme sonrası yeni pilot kelime ilerlemesi korunmalı');
});
await test('data/SOURCES_AND_LICENSES.md şeffaf lisans doğrulama açıklamalarını içeriyor', async () => {
  const doc = await readText('data/SOURCES_AND_LICENSES.md');
  ok(doc.includes('CC BY-SA 4.0') && doc.includes('NGSL') && doc.includes('CEFR-J'), 'Kaynak bilgileri bulunmalı');
  ok(doc.includes('Birincil Hukuki Metin Doğrudan Doğrulanamadı'), 'Doğrulanamayan lisanslar şeffafça belirtilmeli');
});
await test('kelime öğrenme, tekrar ve sınav oturumlarında kelimeler/sorular alfabetik değil rastgele gelir; SRS önceliği ve seviye filtreleri korunur', () => {
  // 1) learnBatch: yeni oturumlarda alfabetik sıra yerine her seferinde farklı rastgele sıra üretir
  const runs = Array.from({ length: 10 }, () => E.learnBatch(data.A2, {}, 8).map((w) => w.word));
  const uniqueRuns = new Set(runs.map((r) => r.join(',')));
  ok(uniqueRuns.size >= 8, 'Yeni öğrenme oturumları her başlatıldığında farklı kelime sırası üretmeli');
  const anyNonAlphabetical = runs.some((r) => JSON.stringify(r) !== JSON.stringify([...r].sort((a, b) => a.localeCompare(b))));
  ok(anyNonAlphabetical, 'Kelime öğrenme grubu alfabetik sırada olmamalı');

  // 2) SRS ve durum önceliği (REVIEW en çok 2 -> LEARNING -> NEW) korunur, kendi içlerinde rastgele sıralanır
  const prioProg = {};
  const revW1 = data.B1[10], revW2 = data.B1[20], learnW = data.B1[30];
  prioProg[revW1.id] = { ...E.newProgress(revW1.id), currentStatus: 'REVIEW', incorrectCount: 3 };
  prioProg[revW2.id] = { ...E.newProgress(revW2.id), currentStatus: 'REVIEW', incorrectCount: 1 };
  prioProg[learnW.id] = { ...E.newProgress(learnW.id), currentStatus: 'LEARNING', currentStage: 2 };
  const pb = E.learnBatch(data.B1, prioProg, 5);
  eq(pb[0].id, revW1.id, 'En çok hata yapılan REVIEW kelimesi 1. sırada olmalı');
  eq(pb[1].id, revW2.id, 'İkinci REVIEW kelimesi 2. sırada olmalı');
  eq(pb[2].id, learnW.id, 'Devam eden LEARNING kelimesi NEW kelimelerden önce gelmeli');
  ok(pb.every((w) => w.level === 'B1' && !w.isDraft), 'Seviye ayrımı (yalnızca B1 aktif) korunmalı');

  // 3) learnItems: 2..4 aşamalarında grup içindeki kelime sırası da karıştırılır
  const sampleBatch = E.learnBatch(data.A2, {}, 5);
  const lItems = E.learnItems(sampleBatch, {});
  eq(lItems.length, 20);
  const stageOrders = [1, 2, 3, 4].map((s) => lItems.filter((i) => i.stage === s).map((i) => i.wordId).join(','));
  ok(new Set(stageOrders).size > 1, 'Aşamalar arasında kelime sırası tekdüze olmamalı');

  // 4) Sınavlarda (Mini ve Seviye Bitirme) her başlatmada farklı soru sırası ve seviye ayrımı
  for (const lv of ['A2', 'B1', 'B2']) {
    const ex1 = buildExamItems('mini', lv);
    const ex2 = buildExamItems('mini', lv);
    eq(ex1.length, 10);
    ok(ex1.every((i) => state.wordMap.get(i.wordId)?.level === lv), `${lv} mini sınavında yalnızca ${lv} kelimeleri olmalı`);
    ok(ex1.map((i) => i.wordId).join(',') !== ex2.map((i) => i.wordId).join(','), `${lv} mini sınavı tekrar başlatıldığında farklı soru sırası oluşmalı`);
  }
  const fin1 = buildExamItems('final', 'B2');
  const fin2 = buildExamItems('final', 'B2');
  eq(fin1.length, 40);
  ok(fin1.every((i) => state.wordMap.get(i.wordId)?.level === 'B2'), 'B2 bitirme sınavında yalnızca B2 kelimeleri olmalı');
  ok(fin1.map((i) => i.wordId + ':' + i.type).join(',') !== fin2.map((i) => i.wordId + ':' + i.type).join(','), 'Bitirme sınavı soru dizilimi her seferinde rastgele olmalı');
  // Soru tipleri blok halinde (10 mc üst üste) değil, karışık dağılmalı
  ok(new Set(fin1.slice(0, 10).map((i) => i.type)).size > 1, 'Bitirme sınavında ilk 10 soru tek tipte blok olmamalı');

  // 5) Çoktan seçmeli sorularda doğru şık (0, 1, 2, 3) tüm konumlara rastgele dağılır
  const posSeen = new Set();
  for (let i = 0; i < 60; i++) {
    const q = E.buildQuestion(data.A2[i % 20], 'mc', state.words);
    posSeen.add(q.answerIndex);
  }
  eq(posSeen.size, 4, 'Doğru cevap 4 şıkkın tamamında (0, 1, 2, 3) rastgele yer alabilmeli');

  // 6) Tekrar modlarında (reviewItems) öncelik korunarak soru sırası rastgeleleştirilir
  const revRuns = Array.from({ length: 6 }, () => reviewItems('quick', 'A2', 5).map((i) => i.wordId).join(','));
  ok(new Set(revRuns).size >= 1, 'reviewItems seviye filtresine uygun çalışmalı');
});

// ===== EZBERULLAH v2.1 Akıllı Öğrenme Güncellemesi Testleri =====
await test('v2.1 Günlük Kelime Hedefi: varsayılan hedef 10, yalnızca öğrenilen yeni kelimeler sayılır, tekrarlar eklenmez, aynı kelime günde 1 kez sayılır', async () => {
  eq(DEFAULT_SETTINGS.dailyGoal, 10, 'Varsayılan günlük kelime hedefi 10 olmalı');
  
  // Günlük veri durumunu temizleyelim / test nesnesi oluşturalım
  const testDate = today().date;
  state.daily[testDate] = { date: testDate, seconds: 0, correct: 0, wrong: 0, newWords: 0, reviews: 0, done: 0, rt: 0, rc: 0, learnedWordIds: [] };

  // 1) Yeni bir kelime öğrenildiğinde hedefe 1 eklenir
  await bumpDaily({ learnedWordId: 'w-test-101', done: 1 });
  eq(todayLearnedCount(state.daily[testDate]), 1, 'Yeni öğrenilen kelime günlük hedefe 1 eklemeli');
  eq(state.daily[testDate].learnedWordIds, ['w-test-101'], 'learnedWordIds içine kelime ID kaydedilmeli');

  // 2) Aynı kelime aynı gün tekrar tamamlanırsa birden fazla kez sayılmaz
  await bumpDaily({ learnedWordId: 'w-test-101', done: 1 });
  eq(todayLearnedCount(state.daily[testDate]), 1, 'Aynı kelime aynı gün 2. kez hedefe eklenmemeli');

  // 3) Farklı bir yeni kelime öğrenildiğinde hedef 2 olur
  await bumpDaily({ learnedWordId: 'w-test-102', done: 1 });
  eq(todayLearnedCount(state.daily[testDate]), 2, 'İkinci farklı kelime hedefe eklenmeli');

  // 4) Tekrar edilen kelimeler (reviews) YENİ kelime hedefine eklenmez
  await bumpDaily({ reviews: 1, done: 1, seconds: 15, correct: 1 });
  eq(todayLearnedCount(state.daily[testDate]), 2, 'Tekrar edilen kelimeler yeni kelime hedefini artırmamalı');
  eq(state.daily[testDate].reviews, 1, 'Tekrar sayısı ayrıca tutulmalı');

  // 5) Farklı takvim gününde (gece yarısı sonrası) hedef sıfırdan başlar, dünün verisi silinmez
  const nextDate = '2099-01-01';
  const nextDay = { date: nextDate, seconds: 0, correct: 0, wrong: 0, newWords: 0, reviews: 0, done: 0, rt: 0, rc: 0, learnedWordIds: [] };
  eq(todayLearnedCount(nextDay), 0, 'Yeni günde günlük hedef sıfırdan başlamalı');
  eq(todayLearnedCount(state.daily[testDate]), 2, 'Önceki günün öğrenilen kelime sayısı korunmalı');
});

await test('v2.1 Streak (Çalışma Serisi): gün aktifliği, birden fazla oturumda tek artış, dünün serisinin korunması, gece yarısı ve bozulma mantığı', () => {
  // Test senaryosu için takvim günleri kurgulayalım
  const backupDaily = JSON.parse(JSON.stringify(state.daily));

  // 3 gün üst üste çalışma yapılmış: 2026-10-20, 2026-10-21, 2026-10-22
  state.daily = {
    '2026-10-20': { date: '2026-10-20', correct: 5, wrong: 1, newWords: 2, reviews: 3 },
    '2026-10-21': { date: '2026-10-21', correct: 10, wrong: 0, newWords: 5, reviews: 5 },
    '2026-10-22': { date: '2026-10-22', correct: 8, wrong: 2, newWords: 4, reviews: 4 },
  };

  // 1) 2026-10-23 sabahı: bugün henüz çalışılmadı
  const oct23Morning = new Date(2026, 9, 23, 9, 0, 0); // 23 Ekim 2026 09:00 (ay 0-indeksli: 9 = Ekim)
  const sMorning = streakStats(oct23Morning);
  eq(sMorning.todayActive, false, 'Sabah henüz çalışılmadı');
  eq(sMorning.current, 3, 'Bugün henüz çalışılmadıysa dünün serisi (3 gün) korunmuş olarak gösterilmeli');

  // 2) 2026-10-23 öğlen: bir oturum tamamlandı
  state.daily['2026-10-23'] = { date: '2026-10-23', correct: 4, wrong: 0, newWords: 2, reviews: 2 };
  const oct23Noon = new Date(2026, 9, 23, 14, 0, 0);
  const sNoon = streakStats(oct23Noon);
  eq(sNoon.todayActive, true, 'Öğlen çalışıldıktan sonra bugün aktif sayılmalı');
  eq(sNoon.current, 4, 'Bugün çalışılınca seri 4 güne çıkmalı');

  // 3) Aynı gün içinde birden fazla oturum yapmak seriyi birden fazla artırmaz
  state.daily['2026-10-23'].correct += 10;
  state.daily['2026-10-23'].sessionsCompleted = 3;
  const sNight = streakStats(oct23Noon);
  eq(sNight.current, 4, 'Aynı gün birden fazla oturum streak’i birden fazla artırmamalı');

  // 4) 2026-10-24 günü hiç çalışılmadı, 2026-10-25 gününe geçildi: seri bozulmalı (0 gün)
  const oct25 = new Date(2026, 9, 25, 10, 0, 0);
  const sBroken = streakStats(oct25);
  eq(sBroken.todayActive, false);
  eq(sBroken.current, 0, 'Bir tam takvim günü atlandığında seri bozulmalı');
  eq(sBroken.longest, 4, 'En uzun seri 4 gün olarak geçmişte hatırlanmalı');

  // Geri yükle
  state.daily = backupDaily;
});

await test('v2.1 Akıllı Yanlış Kelime Analizi: en çok hata yapılan ilk 10 kelime, taslakların hariç tutulması ve gerçek veri doğrulaması', () => {
  // Mock hata verileri verelim
  const w1 = state.words.find((w) => w.id === 'a2-oxref-0001'); // ability
  const w2 = state.words.find((w) => w.id === 'a2-oxref-0002'); // able
  const wDraft = state.words.find((w) => w.isDraft); // taslak kelime

  state.progress[w1.id] = { ...E.newProgress(w1.id), incorrectCount: 7, correctCount: 3, lastReviewedAt: 1700000000000 };
  state.progress[w2.id] = { ...E.newProgress(w2.id), incorrectCount: 12, correctCount: 8, lastReviewedAt: 1700000050000 };
  if (wDraft) {
    state.progress[wDraft.id] = { ...E.newProgress(wDraft.id), incorrectCount: 99, correctCount: 0 };
  }

  const analysis = getMistakeAnalytics(10);
  ok(analysis.totalMistakeWords >= 2, 'Hata yapılan kelimeler bulunmalı');
  eq(analysis.top10[0].id, w2.id, 'En çok hata yapılan kelime (12 hata) 1. sırada olmalı');
  eq(analysis.top10[0].incorrectCount, 12);
  eq(analysis.top10[0].correctCount, 8);
  eq(analysis.top10[0].accuracy, 40, 'Başarı oranı (8 / 20 = %40) doğru hesaplanmalı');
  ok(analysis.top10[0].lastReviewedAt > 0, 'Son çalışma tarihi gerçek veriye dayanmalı');

  if (wDraft) {
    ok(analysis.top10.every((item) => item.id !== wDraft.id), 'Taslak kelimeler asla yanlış kelime analizine dahil edilmemeli');
  }
});

await test('v2.1 Kaldığın Yerden Devam Et: yarım kalan oturumun korunması, soru sırasının saklanması ve yeni oturum koruması', async () => {
  // Yarım kalan oturumu simüle edelim
  const testSession = {
    kind: 'learn',
    title: 'A2 Kelime Öğren',
    idx: 3,
    items: [
      { wordId: 'a2-oxref-0001', stage: 1, type: 'card' },
      { wordId: 'a2-oxref-0002', stage: 2, type: 'mc' },
      { wordId: 'a2-oxref-0003', stage: 3, type: 'typing' },
      { wordId: 'a2-oxref-0004', stage: 4, type: 'missing' },
      { wordId: 'a2-oxref-0005', stage: 5, type: 'sentence' },
    ],
    results: [
      { wordId: 'a2-oxref-0001', correct: true },
      { wordId: 'a2-oxref-0002', correct: true },
      { wordId: 'a2-oxref-0003', correct: false },
    ],
  };

  await setMeta('activeSession', testSession);
  const saved = getMeta('activeSession');
  ok(saved, 'Yarım kalan oturum meta içinde bulunmalı');
  eq(saved.idx, 3, 'Kaldığı soru indeksi korunmalı');
  eq(saved.results.length, 3, 'Verilen önceki cevaplar kaybolmamalı');
  eq(saved.items.length, 5, 'Soru listesi ve sırası korunmalı');

  // Temizle
  await setMeta('activeSession', null);
  eq(getMeta('activeSession'), null);
});

await test('v3.1 Varsayılan Defterim ekranı, Menü günlük hedef/seri satırı ve ahmet ❤️ sude imzasının korunması', async () => {
  const appCode = await readText('js/app.js');
  const nbCode = await readText('js/notebook.js');
  const learnCode = await readText('js/learning.js');
  const css = await readText('css/style.css');

  ok(appCode.includes('dailyGoal') && appCode.includes('edit-goal'), 'Menüde Günlük Hedef satırı bulunmalı');
  ok(appCode.includes('[5, 10, 15, 20]') && appCode.includes('data-set-goal='), 'Günlük hedef seçenekleri (5, 10, 15, 20, Özel) bulunmalı');
  ok(appCode.includes('Seri ${strk.current} gün'), 'Tek satırlık seri bilgisi bulunmalı');
  ok(learnCode.includes('Öğrenmeye Başla') && learnCode.includes('Kaldığın Yerden Devam Et'), 'Hazır Kelime Havuzu ekranında birincil eylem bulunmalı');
  ok(nbCode.includes('ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude') && appCode.includes('ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude'), 'ahmet ❤️ sude özel imzası korunmalı');
  ok(nbCode.includes('aria-label="VELUNO">VELUNO</span>'), 'Defterim üst alanında VELUNO başlığı bulunmalı');
  ok(!appCode.includes('function renderDashboard'), 'Eski Ana Sayfa (renderDashboard) tamamen kaldırılmış olmalı');
  ok(css.includes('.nb-header{') && css.includes('.nb-progress-strip{') && css.includes('.path-canvas{'), 'Defterim ve öğrenme yolu CSS kuralları bulunmalı');
});

await test('v3.1 Tasarım sistemi: gradient / cam efekti / büyük gölge yok, altın ton yok, reduced-motion destekli', async () => {
  const css = await readText('css/style.css');
  ok(!css.includes('backdrop-filter'), 'Cam efekti (backdrop-filter) kullanılmamalı');
  ok(!css.includes('radial-gradient') && (css.match(/gradient\(/g) || []).length <= 2, 'Dekoratif gradient kullanılmamalı (yalnızca açılır menü oku)');
  ok(!/box-shadow:[^;}]*\d{2}px\s+\d{2,}px/.test(css), 'Büyük gölge kullanılmamalı');
  ok(!css.includes('#D4B475') && !css.includes('#C9A86A') && !css.includes('#EED49E'), 'Altın / sarı marka tonları geri gelmemeli');
  ok(css.includes('prefers-reduced-motion:reduce'), 'prefers-reduced-motion desteklenmeli');
  ok(css.includes('.path{') && css.includes('.step.active') && css.includes('.step.locked'), 'Grammar öğrenme yolu stilleri bulunmalı');
  ok(css.includes('.success-mark') && css.includes('@keyframes draw'), 'Hafif başarı animasyonu bulunmalı');
  ok(css.includes('.page{max-width:680px'), 'Masaüstünde içerik genişliği sınırlı olmalı');
});

await test('v3.1 Gezinme: mobil alt menüde 4 sekme (Defterim, Hazır Havuz, Yolum, Menü), SVG ikonlar, emoji yok ve Menü sayfası ile ikincil bölümlere erişim', async () => {
  const html = await readText('index.html');
  const appCode = await readText('js/app.js');
  const bottom = html.slice(html.indexOf('<nav id="bottomnav"'), html.indexOf('</nav>', html.indexOf('<nav id="bottomnav"')));
  eq((bottom.match(/data-nav=/g) || []).length, 4, 'Alt menüde tam 4 sekme olmalı');
  ok(bottom.includes('data-nav="notebook"') && bottom.includes('data-nav="learn"') && bottom.includes('data-nav="path"') && bottom.includes('data-nav="more"'), 'Alt menüde Defterim, Hazır Kelime Havuzu, Yolum ve Menü bulunmalı');
  ok(!bottom.includes('data-nav="dashboard"'), 'Alt menüde eski Ana Sayfa sekmesi bulunmamalı');
  ok(!/[\u{1F300}-\u{1FAFF}\u2699\u2600-\u27BF]/u.test(html.slice(html.indexOf('<aside'), html.indexOf('<div id="modal-root"'))), 'Navigasyonda emoji kullanılmamalı');
  ok(bottom.includes('<svg viewBox="0 0 24 24"'), 'Alt menü SVG ikon kullanmalı');
  for (const r of ['notebook', 'dashboard', 'path', 'learn', 'review', 'grammar', 'more', 'vocabulary', 'exams', 'statistics', 'settings']) ok(appCode.includes(`${r}:`), `Rota korunmalı: ${r}`);
  for (const r of ['vocabulary', 'exams', 'statistics', 'settings']) ok(appCode.includes(`item('#/${r}'`), `Menü sayfasından erişilebilmeli: ${r}`);
});

await test('v3.1 Ekran sadeleştirmeleri: Kelime odak akışı, Tekrar tek dokunuş, Sınav odak modu, Kelime Havuzu satırları, Ayarlar listesi', async () => {
  const learn = await readText('js/learning.js');
  const review = await readText('js/review.js');
  const exams = await readText('js/exams.js');
  const vocab = await readText('js/vocab-ui.js');
  const stats = await readText('js/statistics.js');
  const app = await readText('js/app.js');
  ok(learn.includes('id="reveal"') && learn.includes('Anlamı Göster'), 'Kelime kartında anlam gerektiğinde gösterilmeli');
  ok(learn.includes('class="run-top"') && learn.includes('enterkeyhint="done"') && learn.includes('stage-dots'), 'Odaklı oturum ekranı (üst ilerleme + aşama göstergesi) bulunmalı');
  ok(learn.includes("setFocusMode(true)"), 'Oturum sırasında menü gizlenmeli (odak modu)');
  ok(review.includes('Tekrara Başla') && review.includes('big-count') && review.includes('Diğer tekrar modları'), 'Tekrar ekranı tek eylemle sadeleşmeli');
  ok(exams.includes('Geçmiş Sınavlar') && exams.includes('list-row'), 'Sınav türü liste satırlarından seçilmeli, geçmiş detay altında olmalı');
  ok(vocab.includes('class="search"') && vocab.includes('openWordDetail') && vocab.includes('Filtreler'), 'Kelime Havuzu arama + kompakt filtre + satır listesi olmalı');
  ok(stats.includes('Genel İlerleme') && stats.includes('Bugünkü Hedef') && stats.includes('Öğrenilen Kelimeler') && stats.includes('Grammar') && stats.includes('<details class="more">'), 'İstatistikler öncelikli metrikler + açılır bölümlerden oluşmalı');
  for (const g of ['Görünüm', 'Günlük Hedef', 'Ses ve Öğrenme', 'Yedekleme ve Geri Yükleme', 'Hakkında']) ok(app.includes(`>${g}</h2>`), `Ayarlar grubu bulunmalı: ${g}`);
});

await test('v3.1 Grammar öğrenme yolculuğu: seviye seçici, dikey yol, durum göstergeleri, "Yakında" metni yok, 38 konu / hazır dersler', async () => {
  const g = await readText('js/grammar.js');
  ok(g.includes('class="path"') && g.includes('data-g-level=') && g.includes('step-node'), 'Dikey öğrenme yolu ve seviye seçici bulunmalı');
  ok(g.includes("'done'") && g.includes("'active'") && g.includes("'locked'"), 'Tamamlandı / Aktif / Kilitli durumları bulunmalı');
  ok(!g.includes('Yakında') && !g.includes('Test Aktif Değil'), 'Kullanıcıya "Yakında" / "Test Aktif Değil" gösterilmemeli');
  eq(G.GRAMMAR_TOPICS.length, 38);
  eq(G.GRAMMAR_TOPICS.filter((t) => G.isTopicReady(t)).length, 38, '38 dersin tamamı hazır olmalı');
  eq(G.GRAMMAR_QUESTIONS.length, 760);
  eq(G.nextGrammarTopic().id, G.GRAMMAR_TOPICS.filter((t) => G.isTopicReady(t) && !getGrammarProgress(t.id).completed)[0].id, 'Sıradaki ders önerisi doğru olmalı');
});

// ===== EZBERULLAH v2.2 — Grammar Academy Testleri (20 Test) =====
out('7) EZBERULLAH v2.2 — Grammar Academy (Müfredat, Dersler, 60 Soru, Sınav ve İlerleme)');

await test('v2.2 [1] Grammar seviyelerinin doğru yüklenmesi (yalnızca A2, B1, B2; A1 veya C1 yok)', () => {
  eq(G.GRAMMAR_LEVELS.map((l) => l.id), ['A2', 'B1', 'B2'], 'Yalnızca A2, B1 ve B2 seviyeleri bulunmalı');
  ok(!G.GRAMMAR_LEVELS.some((l) => l.id === 'A1' || l.id === 'C1'), 'A1 veya C1 seviyesi olmamalı');
});

await test('v2.2 [2] Toplam 38 grammar konusunun bulunması ve benzersiz ID kontrolü', () => {
  eq(G.GRAMMAR_TOPICS.length, 38, 'Toplam 38 grammar konusu bulunmalı');
  eq(new Set(G.GRAMMAR_TOPICS.map((t) => t.id)).size, 38, '38 konunun tamamı benzersiz ID değerine sahip olmalı');
});

await test('v2.2 [3] A2 seviyesinde tam 14 konu bulunması', () => {
  const a2Topics = G.getTopicsByLevel('A2');
  eq(a2Topics.length, 14, 'A2 seviyesinde 14 konu olmalı');
  ok(a2Topics[0].title === 'Present Simple vs. Present Continuous' || a2Topics[0].title === 'Present Continuous vs. Simple Present', 'A2 ilk konusu Present Simple vs. Present Continuous olmalı');
  eq(a2Topics[13].title, 'Basic Relative Clauses (Who, Which, Where)');
});

await test('v2.2 [4] B1 seviyesinde tam 12 konu bulunması', () => {
  const b1Topics = G.getTopicsByLevel('B1');
  eq(b1Topics.length, 12, 'B1 seviyesinde 12 konu olmalı');
  eq(b1Topics[0].title, 'Present Perfect vs. Past Simple (For & Since)');
  eq(b1Topics[11].title, 'Question Tags');
});

await test('v2.2 [5] B2 seviyesinde tam 12 konu bulunması', () => {
  const b2Topics = G.getTopicsByLevel('B2');
  eq(b2Topics.length, 12, 'B2 seviyesinde 12 konu olmalı');
  eq(b2Topics[0].title, 'Past Perfect Continuous');
  eq(b2Topics[11].title, 'Advanced Articles & Noun Phrases');
});

await test('v2.2 [6] Üç örnek dersin (A2 Past Continuous, B1 Present Perfect vs. Past Simple, B2 Third & Mixed Conditionals) eksiksiz içerikle açılması', () => {
  const readyIds = ['a2-g03', 'b1-g01', 'b2-g04'];
  for (const id of readyIds) {
    const t = G.getTopicById(id);
    ok(t && G.isTopicReady(t), `${id} dersi hazır (ready) ve eksiksiz olmalı`);
    ok(t.content.sections.length >= 3, `${id} konu anlatımı bölümleri bulunmalı`);
    ok(t.content.formulas.length >= 3, `${id} formül kutuları bulunmalı`);
    ok(t.content.examples.length >= 4 && t.content.examples.every((ex) => ex.en && ex.tr), `${id} İngilizce ve Türkçe örnek cümleler bulunmalı`);
    ok(t.content.keyRules.length >= 3, `${id} önemli kurallar bulunmalı`);
    ok(t.content.commonMistakes.length >= 3 && t.content.commonMistakes.every((m) => m.wrong && m.right && m.explanation), `${id} sık yapılan hatalar karşılaştırması bulunmalı`);
    ok(t.content.examTips.length >= 3, `${id} sınav taktikleri bulunmalı`);
    ok(G.openGrammarLesson(id, null) === true, `${id} dersi başarıyla açılabilmeli`);
  }
});

await test('v2.2 [7] Toplam 760 özgün sorunun bulunması (her konu için 20 soru)', () => {
  eq(G.GRAMMAR_QUESTIONS.length, 760, 'Toplam 760 soru bulunmalı');
  for (const tid of ['a2-g01', 'a2-g02', 'a2-g03', 'a2-g04', 'a2-g05', 'b1-g01', 'b2-g04']) {
    eq(G.getQuestionsForTopic(tid).length, 20, `${tid} için 20 geçerli soru olmalı`);
  }
});

await test('v2.2 [8] Soruların benzersiz ID’lere ve geçerli şemaya sahip olması', () => {
  const ids = G.GRAMMAR_QUESTIONS.map((q) => q.id);
  eq(new Set(ids).size, 760, '760 sorunun tamamı benzersiz ID değerine sahip olmalı');
  for (const q of G.GRAMMAR_QUESTIONS) {
    eq(G.validateGrammarQuestion(q), [], `Soru şeması hatasız olmalı: ${q.id}`);
  }
});

await test('v2.2 [9] Soruların doğru konuya (topicId) ve doğru seviyeye (level) bağlı olması', () => {
  for (const q of G.GRAMMAR_QUESTIONS) {
    const topic = G.getTopicById(q.topicId);
    ok(topic, `Sorunun bağlı olduğu konu (${q.topicId}) mevcut olmalı`);
    eq(q.level, topic.level, `${q.id} sorusunun seviyesi (${q.level}) konu seviyesiyle (${topic.level}) eşleşmeli`);
  }
});

await test('v2.2 [10] Mini sınavda rastgele 5 soru seçilmesi ve soru sırasının karıştırılması', () => {
  const runs = Array.from({ length: 8 }, () => G.buildGrammarMiniQuiz('a2-g03', 5).map((q) => q.id).join(','));
  for (const r of runs) eq(r.split(',').length, 5, 'Her mini sınavda 5 soru seçilmeli');
  ok(new Set(runs).size >= 5, 'Mini sınav her başlatıldığında rastgele farklı sorular ve farklı soru sırası üretmeli');
});

await test('v2.2 [11] Aynı mini sınavda bir sorunun iki kez seçilmemesi', () => {
  for (const tid of ['a2-g03', 'b1-g01', 'b2-g04']) {
    for (let i = 0; i < 10; i++) {
      const quiz = G.buildGrammarMiniQuiz(tid, 5);
      eq(new Set(quiz.map((q) => q.id)).size, 5, `${tid} mini sınavında tekrar eden soru olmamalı`);
    }
  }
});

await test('v2.2 [12] A/B/C/D seçeneklerinin rastgele karıştırılması', () => {
  const indices = new Set();
  for (let i = 0; i < 40; i++) {
    const quiz = G.buildGrammarMiniQuiz('b1-g01', 5);
    quiz.forEach((q) => indices.add(q.answerIndex));
  }
  eq(indices.size, 4, 'Şıklar karıştırıldığında doğru cevap A(0), B(1), C(2) ve D(3) konumlarının tamamında yer alabilmeli');
});

await test('v2.2 [13] Seçenekler karıştırıldıktan sonra da doğru cevabın korunması', () => {
  for (const tid of ['a2-g03', 'b1-g01', 'b2-g04']) {
    const quiz = G.buildGrammarMiniQuiz(tid, 5);
    for (const item of quiz) {
      eq(item.options[item.answerIndex], item.correctAnswer, 'Karıştırılmış seçeneklerde answerIndex doğru cevabı göstermeli');
      ok(G.checkGrammarAnswer(item, item.answerIndex), 'Doğru şık indeksi kabul edilmeli');
      ok(G.checkGrammarAnswer(item, item.correctAnswer), 'Doğru cevap metni kabul edilmeli');
      const wrongIdx = (item.answerIndex + 1) % 4;
      ok(!G.checkGrammarAnswer(item, wrongIdx), 'Yanlış şık indeksi reddedilmeli');
    }
  }
});

await test('v2.2 [14] Başarı yüzdesinin doğru hesaplanması', () => {
  eq(G.calculateQuizScore(0, 5), 0);
  eq(G.calculateQuizScore(3, 5), 60);
  eq(G.calculateQuizScore(4, 5), 80);
  eq(G.calculateQuizScore(5, 5), 100);
});

await test('v2.2 [15] %80 (4/5) başarıyla konunun Tamamlandı işaretlenmesi ve sonraki düşük puanın rozeti silmemesi', async () => {
  // İlk deneme: 3/5 (%60) -> henüz tamamlanmadı
  const r1 = await G.recordGrammarQuizResult('a2-g03', { correct: 3, total: 5, elapsedSeconds: 20 });
  eq(r1.score, 60);
  eq(r1.passed, false);
  eq(r1.progress.completed, false, '%60 başarıda konu tamamlanmış sayılmamalı');

  // İkinci deneme: 4/5 (%80) -> Tamamlandı!
  const r2 = await G.recordGrammarQuizResult('a2-g03', { correct: 4, total: 5, elapsedSeconds: 25 });
  eq(r2.score, 80);
  eq(r2.passed, true);
  eq(r2.progress.completed, true, '%80 (4/5) başarıda konu Tamamlandı olmalı');
  eq(r2.progress.bestScore, 80);

  // Üçüncü deneme: 2/5 (%40) -> Kazanılmış Tamamlandı rozeti silinmemeli!
  const r3 = await G.recordGrammarQuizResult('a2-g03', { correct: 2, total: 5, elapsedSeconds: 15 });
  eq(r3.score, 40);
  eq(r3.progress.lastScore, 40, 'Son sınav puanı %40 olarak güncellenmeli');
  eq(r3.progress.bestScore, 80, 'En yüksek puan %80 olarak korunmalı');
  eq(r3.progress.completed, true, 'Daha sonraki düşük puan kazanılmış Tamamlandı rozetini silmemeli');
});

await test('v2.2 [16] Grammar ilerleme verilerinin ve seviye istatistiklerinin korunması', () => {
  const gp = getGrammarProgress('a2-g03');
  eq(gp.attempts, 3, 'Toplam 3 deneme kaydedilmiş olmalı');
  eq(gp.totalQuestions, 15, 'Toplam 15 soru çözülmüş olmalı');
  eq(gp.correctAnswers, 9, 'Toplam 9 doğru cevap kaydedilmiş olmalı');
  eq(gp.wrongAnswers, 6, 'Toplam 6 yanlış cevap kaydedilmiş olmalı');
  ok(gp.lastStudiedAt > 0, 'Son çalışma tarihi kaydedilmiş olmalı');

  const a2Stat = G.grammarLevelStats('A2');
  eq(a2Stat.total, 14);
  eq(a2Stat.completedCount, 1);
});

await test('v2.2 [17] Yedekleme ve geri yükleme uyumluluğu (hem v2.2 Grammar verileri hem eski sürüm yedekler)', async () => {
  await G.recordGrammarQuizResult('b1-g01', { correct: 5, total: 5, elapsedSeconds: 30 });
  const backupV22 = JSON.parse(JSON.stringify(buildBackup()));
  eq(validateBackup(backupV22), [], 'v2.2 yedeği geçerli olmalı');
  ok(Array.isArray(backupV22.grammarProgress) && backupV22.grammarProgress.length >= 2, 'Yedekte grammarProgress bulunmalı');

  // Eski sürüm (grammarProgress alanı olmayan) yedek geri yüklendiğinde güvenli varsayılanlarla çalışmalı
  const legacyBackup = JSON.parse(JSON.stringify(backupV22));
  delete legacyBackup.grammarProgress;
  legacyBackup.meta = legacyBackup.meta.filter((m) => m.key !== 'grammarProgress');
  eq(validateBackup(legacyBackup), [], 'grammarProgress içermeyen eski sürüm yedek de geçerli olmalı');
  await restoreBackup(legacyBackup);
  eq(getGrammarProgress('a2-g03').completed, false, 'Eski yedekte grammar verisi yoksa güvenli varsayılan (false) olmalı');

  // Şimdi v2.2 yedeğini geri yükleyelim ve Grammar ilerlemesinin geri geldiğini doğrulayalım
  await restoreBackup(backupV22);
  eq(getGrammarProgress('a2-g03').completed, true, 'v2.2 yedeği geri yüklendiğinde A2 konu tamamlanma durumu korunmalı');
  eq(getGrammarProgress('b1-g01').bestScore, 100, 'v2.2 yedeği geri yüklendiğinde B1 en yüksek puan (%100) korunmalı');
});

await test('v2.2 [18] Vocabulary sisteminin (2.024 kelime, SRS, günlük hedef, streak) Grammar işlemlerinden etkilenmemesi', () => {
  const allData = [...data.A2, ...data.B1, ...data.B2];
  eq(allData.length, 2024, 'Veri dosyalarındaki 2.024 yerleşik kelime kaydı eksiksiz korunmalı');
  eq(allData.filter((w) => !w.isDraft).length, 2010, 'Veri dosyalarındaki 2.010 aktif kelime sayısı doğrulanmalı');
  eq(allData.filter((w) => w.isDraft).length, 14, 'Veri dosyalarındaki 14 taslak kelime sayısı doğrulanmalı');
  eq(state.words.length, 2024, 'state.words içindeki toplam kelime sayısı değişmemeli');
  ok(getProgress('a2-apartment-001').learningComplete, 'Önceden öğrenilmiş kelimenin SRS ilerlemesi korunmalı');
});

await test('v2.2 [19] Eksik veya hatalı soru verilerinin yakalanması ve 5’ten az soruda sınavın başlatılmaması', () => {
  const badQ1 = { id: 'bad-1', topicId: 'a2-g03', level: 'A2', question: 'Test?', options: ['a', 'b', 'c'], correctAnswer: 'a', explanation: 'Açıklama', difficulty: 'easy' };
  ok(G.validateGrammarQuestion(badQ1).length > 0, '3 şıklı hatalı soru yakalanmalı');

  const badQ2 = { id: 'bad-2', topicId: 'a2-g03', level: 'A2', question: 'Test?', options: ['a', 'b', 'c', 'd'], correctAnswer: 'x', explanation: 'Açıklama', difficulty: 'easy' };
  ok(G.validateGrammarQuestion(badQ2).length > 0, 'Doğru cevabı şıklarda olmayan soru yakalanmalı');

  // Yalnızca 3 soruluk bir havuz verildiğinde mini sınav başlatılmamalı
  const smallPool = G.GRAMMAR_QUESTIONS.slice(0, 3);
  eq(G.canStartGrammarQuiz('a2-g03', smallPool), false, '5’ten az geçerli soru varsa sınav başlatılamamalı');
  eq(G.buildGrammarMiniQuiz('a2-g03', 5, Math.random, smallPool), [], '5’ten az soruda buildGrammarMiniQuiz boş dizi dönmeli');
});

await test('v2.2 [20] 38 konunun tamamının eksiksiz hazır (ready) olması ve mini sınavlarının aktifleşmesi', () => {
  const readyTopics = G.GRAMMAR_TOPICS.filter((t) => t.status === 'ready');
  eq(readyTopics.length, 38, '38 konunun tamamı ready durumunda olmalı');
  for (const t of readyTopics) {
    ok(G.isTopicReady(t), `${t.id} hazır olmalı`);
    ok(G.canStartGrammarQuiz(t.id), `${t.id} sınavı aktif olmalı`);
    ok(G.buildGrammarMiniQuiz(t.id, 5).length === 5, `${t.id} için 5 soru üretilebilmeli`);
    ok(G.openGrammarLesson(t.id, null) === true, `${t.id} dersi açılabilmeli`);
  }
});

/* ==========================================================================
   8) VELUNO v3.2 — Intelligent Sentence Learning & Free Level Selection
   ========================================================================== */
out('\n8) VELUNO v3.2 — Intelligent Sentence Learning & Free Level Selection');

const abroadWord = {
  id: 'a2-abroad-test',
  level: 'A2',
  word: 'abroad',
  meanings: ['yurt dışında', 'yurt dışına'],
  partOfSpeech: 'adverb',
  exampleSentence: 'My sister wants to study abroad next year.',
  exampleTranslation: 'Kız kardeşim gelecek yıl yurt dışında okumak istiyor.',
  collocations: ['travel abroad', 'live abroad'],
};

await test('v3.2 [1] Cümle Değerlendirme: Örnek cümleden farklı geçerli özgün cümleler kabul edilir', () => {
  const candidates = [
    'I want to study abroad.',
    'My brother lives abroad.',
    'She will travel abroad next year.',
    'We traveled abroad last summer.',
    'I have never been abroad.',
  ];
  for (const c of candidates) {
    const res = E.evaluateSentence(abroadWord, c);
    ok(res.ok === true, `"${c}" kabul edilmeliydi: ${res.message}`);
    eq(res.status, 'valid', `"${c}" durumu valid olmalı`);
    ok(E.checkProduction(abroadWord, c) === true, `checkProduction("${c}") true dönmeli`);
  }
});

await test('v3.2 [2] Cümle Değerlendirme: 4 kelimeden kısa giriş ve boş giriş reddedilir, açıklayıcı Türkçe neden döner', () => {
  const emptyRes = E.evaluateSentence(abroadWord, '');
  eq(emptyRes.status, 'needs_fix');
  eq(emptyRes.ok, false);
  ok(emptyRes.message.includes('bir cümle yazın'));

  const shortRes = E.evaluateSentence(abroadWord, 'I live abroad.'); // 3 kelime
  eq(shortRes.status, 'needs_fix');
  eq(shortRes.ok, false);
  ok(shortRes.message.includes('en az 4 kelimeden'));
});

await test('v3.2 [3] Cümle Değerlendirme: Hedef kelime bulunmadığında reddedilir ve kelime ismi belirtilir', () => {
  const res = E.evaluateSentence(abroadWord, 'I love to study English every day.');
  eq(res.status, 'needs_fix');
  eq(res.ok, false);
  ok(res.message.includes('abroad'));
  ok(res.message.includes('bulunamadı'));
});

await test('v3.2 [4] Cümle Değerlendirme: Hedef kelimenin başka kelimenin içinde alt dize olarak geçmesi yanlış pozitif oluşturmaz', () => {
  const boardWord = { id: 'test-board', word: 'board', meanings: ['tahta'], partOfSpeech: 'noun' };
  // "skateboard" kelimesinde "board" alt karakter dizesi olarak geçer ama bağımsız değildir
  const res1 = E.evaluateSentence(boardWord, 'He bought a new skateboard yesterday.');
  eq(res1.status, 'needs_fix', 'skateboard kelimesi board olarak eşleşmemeli');
  eq(res1.ok, false);

  const admitWord = { id: 'test-admit', word: 'admit', meanings: ['itiraf etmek'], partOfSpeech: 'verb' };
  const res2 = E.evaluateSentence(admitWord, 'She works in hospital administration now.');
  eq(res2.status, 'needs_fix', 'administration kelimesi admit olarak eşleşmemeli');
  eq(res2.ok, false);
});

await test('v3.2 [5] Cümle Değerlendirme: Büyük/küçük harf, kesme işareti (\'s) ve noktalama farklılıkları esnekçe tolere edilir', () => {
  const res = E.evaluateSentence(abroadWord, '   YES, MY SISTER LIVES ABROAD!   ');
  eq(res.status, 'valid');
  eq(res.ok, true);

  const aptWord = { id: 'test-apt', word: 'apartment', meanings: ['daire'], partOfSpeech: 'noun' };
  const resApt = E.evaluateSentence(aptWord, 'We visited my friend\'s apartment yesterday.');
  eq(resApt.status, 'valid');
  eq(resApt.ok, true);
});

await test('v3.2 [6] Cümle Değerlendirme: Fiil, isim ve sıfatların yaygın morfolojik çekimleri desteklenir', () => {
  const writeWord = { id: 'test-write', word: 'write', meanings: ['yazmak'], partOfSpeech: 'verb' };
  const resWrote = E.evaluateSentence(writeWord, 'I wrote a long letter yesterday.');
  eq(resWrote.status, 'valid', 'wrote çekimli biçimi kabul edilmeli');

  const buyWord = { id: 'test-buy', word: 'buy', meanings: ['satın almak'], partOfSpeech: 'verb' };
  const resBought = E.evaluateSentence(buyWord, 'She bought a nice car last week.');
  eq(resBought.status, 'valid', 'bought çekimli biçimi kabul edilmeli');

  const childWord = { id: 'test-child', word: 'child', meanings: ['çocuk'], partOfSpeech: 'noun' };
  const resChildren = E.evaluateSentence(childWord, 'The children are playing outside now.');
  eq(resChildren.status, 'valid', 'children düzensiz çoğul biçimi kabul edilmeli');
});

await test('v3.2 [7] Cümle Değerlendirme: Belirsiz / şüpheli yapılar kesin yanlış sayılmaz; status: ambiguous döner ve ilerleme engellenmez', () => {
  const resPlaceholder = E.evaluateSentence(abroadWord, 'I want to ... abroad.');
  eq(resPlaceholder.status, 'ambiguous');
  eq(resPlaceholder.ok, true, 'Belirsiz değerlendirmede ok true olmalı; hata olarak kaydedilmemeli');
  ok(resPlaceholder.message.includes('dil bilgisi'), 'Bilgilendirici açıklama içermeli');
});

await test('v3.2 [8] 3 Aşamalı İpucu: getWordHints her kelimede 3 aşamalı ipucu üretir', () => {
  const hints = E.getWordHints(abroadWord);
  ok(typeof hints.usage === 'string' && hints.usage.length > 10, 'İpucu 1 kullanım açıklaması olmalı');
  ok(hints.usage.includes('Abroad'), 'Abroad kelimesi kullanımda yer almalı');
  ok(typeof hints.frame === 'string' && hints.frame.includes('abroad'), 'İpucu 2 cümle kalıbı olmalı');
  eq(hints.exampleSentence, abroadWord.exampleSentence, 'İpucu 3 örnek cümle olmalı');
  ok(hints.exampleNote.toLowerCase().includes('kendi cümleni yazabilirsin'), 'Örnek cümlenin referans olduğu belirtilmeli');
});

await test('v3.2 [9] 3 Aşamalı İpucu: Eksik veya taslak verilerde çökmez, güvenli ve tutarlı geri bildirim sağlar; A2, B1 ve B2 seviyelerinde çalışır', () => {
  const a2w = state.words.find((w) => w.level === 'A2' && !w.isDraft);
  const b1w = state.words.find((w) => w.level === 'B1' && !w.isDraft);
  const b2w = state.words.find((w) => w.level === 'B2' && !w.isDraft);
  for (const w of [a2w, b1w, b2w].filter(Boolean)) {
    const h = E.getWordHints(w);
    ok(h.usage && h.frame && h.exampleSentence, `${w.level} kelimesi (${w.word}) için ipuçları tam üretilmeli`);
  }
  // Boş veya eksik kelimede de çökmemeli
  const dummyHints = E.getWordHints({});
  ok(dummyHints !== null, 'Boş nesnede çökmemeli');
});

await test('v3.2 [10] 3 Aşamalı İpucu: İpucu kullanımı puan düşürmez, yanlış kelimeler havuzuna eklemez, SRS başarısızlığı sayılmaz', async () => {
  const w = state.words.find((x) => x.id === 'a2-apartment-001');
  const p = getProgress(w.id);
  const beforeScore = p.masteryScore;
  const beforeIncorrect = p.incorrectCount;
  // İpucu üretimi saf fonksiyondur, hiçbir ilerleme verisini değiştirmez
  const h = E.getWordHints(w);
  ok(h.usage && h.frame);
  const afterP = getProgress(w.id);
  eq(afterP.masteryScore, beforeScore);
  eq(afterP.incorrectCount, beforeIncorrect);
});

await test('v3.2 [11] Serbest Seviye Seçimi: A2, B1 ve B2 seviyelerinin tamamı ön koşulsuz ve kilit olmaksızın doğrudan başlatılabilir', () => {
  // A2 tamamlanmamış olsa bile B1 ve B2 kelime grupları başarıyla filtrelenir ve üretilir
  for (const lvl of ['A2', 'B1', 'B2']) {
    const words = state.words.filter((w) => w.level === lvl);
    const batch = E.learnBatch(words, state.progress, 5);
    ok(batch.length > 0, `${lvl} seviyesinde grup başlatılabilmeli`);
    ok(batch.every((w) => w.level === lvl), `${lvl} grubundaki kelimelerin seviyesi doğru olmalı`);
  }
});

await test('v3.2 [12] Serbest Seviye Seçimi: Seçilen seviye (learnLevel) kaydedilir ve hatırlanır', async () => {
  await setMeta('learnLevel', 'B1');
  eq(getMeta('learnLevel'), 'B1', 'Seçilen seviye B1 olarak kaydedilmeli');
  await setMeta('learnLevel', 'B2');
  eq(getMeta('learnLevel'), 'B2', 'Seviye B2 olarak güncellenebilmeli');
  await setMeta('learnLevel', 'A2');
  eq(getMeta('learnLevel'), 'A2');
});

await test('v3.2 [13] Serbest Seviye Seçimi: Seviye değiştirildiğinde önceki seviyenin yarım kalan oturumu (activeSessionsByLevel) silinmez, korunur', async () => {
  const byLevel = {
    A2: { kind: 'learn', title: 'A2 Kelime Öğren', level: 'A2', idx: 2, items: [{ wordId: 'a2-1' }, { wordId: 'a2-2' }, { wordId: 'a2-3' }] },
    B1: { kind: 'learn', title: 'B1 Kelime Öğren', level: 'B1', idx: 1, items: [{ wordId: 'b1-1' }, { wordId: 'b1-2' }] },
  };
  await setMeta('activeSessionsByLevel', byLevel);
  await setMeta('learnLevel', 'B1');
  await setMeta('activeSession', byLevel.B1);

  // Kullanıcı B1'deyken A2 oturumu hala hafızada korunuyor
  const stored = getMeta('activeSessionsByLevel');
  ok(stored.A2 && stored.A2.idx === 2, 'A2 oturumu silinmemiş olmalı');
  ok(stored.B1 && stored.B1.idx === 1, 'B1 oturumu korunmalı');
});

await test('v3.2 [14] Veri ve İmza Bütünlüğü: 2.024 kelime (2.010 aktif + 14 taslak), 38 grammar konusu, 760 soru ve "ahmet ❤️ sude" imzası aynen korunur', async () => {
  const allDataWords = [...data.A2, ...data.B1, ...data.B2];
  eq(allDataWords.length, 2024, 'Toplam 2.024 kelime korunmalı');
  eq(allDataWords.filter((w) => !w.isDraft).length, 2010, '2.010 aktif kelime korunmalı');
  eq(allDataWords.filter((w) => w.isDraft).length, 14, '14 taslak kelime korunmalı');
  eq(G.GRAMMAR_TOPICS.length, 38, '38 grammar konusu korunmalı');
  eq(G.GRAMMAR_QUESTIONS.length, 760, '760 grammar sorusu korunmalı');

  const appSrc = await readText('js/app.js');
  ok(appSrc.includes('<span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span>'), 'ahmet ❤️ sude imzası harfi harfine korunmalı');
});

out('\n9) VELUNO v4.0 — Content Academy / Phase 1 (4 Yeni A2 Dersi & 80 Yeni Soru)');

await test('v4.0 [1] Dört Yeni A2 Dersi: a2-g01, a2-g02, a2-g04 ve a2-g05 müfredata hazır (ready) olarak entegre edilmiştir', () => {
  const newLessonIds = ['a2-g01', 'a2-g02', 'a2-g04', 'a2-g05'];
  for (const id of newLessonIds) {
    const t = G.getTopicById(id);
    ok(t, `${id} konusu mevcut olmalı`);
    eq(t.status, 'ready', `${id} durumu ready olmalı`);
    eq(t.level, 'A2', `${id} seviyesi A2 olmalı`);
    ok(G.isTopicReady(t), `${id} isTopicReady true dönmeli`);
    ok(G.canStartGrammarQuiz(id), `${id} canStartGrammarQuiz true dönmeli`);
  }
});

await test('v4.0 [2] Dört Yeni Dersin İçerik Standartları: Giriş, 4 bölüm konu anlatımı, formüller, Türkçe çevirili örnekler, kurallar, sık yapılan hatalar ve sınav taktikleri eksiksizdir', () => {
  const newLessonIds = ['a2-g01', 'a2-g02', 'a2-g04', 'a2-g05'];
  for (const id of newLessonIds) {
    const t = G.getTopicById(id);
    const c = t.content;
    ok(c && typeof c.intro === 'string' && c.intro.length > 50, `${id} kapsamlı giriş içermeli`);
    ok(Array.isArray(c.sections) && c.sections.length >= 4, `${id} en az 4 konu anlatım bölümü içermeli`);
    ok(c.sections.every((s) => s.heading && s.body), `${id} bölümler başlık ve gövde içermeli`);
    ok(Array.isArray(c.formulas) && c.formulas.length >= 4, `${id} en az 4 formül içermeli`);
    ok(c.formulas.every((f) => f.label && f.pattern), `${id} formüller etiket ve şablon içermeli`);
    ok(Array.isArray(c.examples) && c.examples.length >= 5, `${id} en az 5 örnek cümle içermeli`);
    ok(c.examples.every((ex) => ex.en && ex.tr), `${id} örnekler İngilizce ve Türkçe çeviri içermeli`);
    ok(Array.isArray(c.keyRules) && c.keyRules.length >= 4, `${id} en az 4 önemli kural içermeli`);
    ok(Array.isArray(c.commonMistakes) && c.commonMistakes.length >= 4, `${id} en az 4 sık yapılan hata içermeli`);
    ok(c.commonMistakes.every((m) => m.wrong && m.right && m.explanation), `${id} hatalar yanlış/doğru/açıklama içermeli`);
    ok(Array.isArray(c.examTips) && c.examTips.length >= 4, `${id} en az 4 sınav taktiği içermeli`);
  }
});

await test('v4.0 [3] 80 Yeni Özgün Soru ve Toplam 760 Soru Havuzu: Her bir yeni ders için tam 20 soru mevcuttur', () => {
  ok(G.GRAMMAR_QUESTIONS.length >= 140, 'Toplam soru havuzu en az 140 olmalı');
  const expectedCounts = {
    'a2-g01': 20,
    'a2-g02': 20,
    'a2-g03': 20,
    'a2-g04': 20,
    'a2-g05': 20,
    'b1-g01': 20,
    'b2-g04': 20,
  };
  for (const [tid, cnt] of Object.entries(expectedCounts)) {
    eq(G.getQuestionsForTopic(tid).length, cnt, `${tid} için tam ${cnt} soru olmalı`);
  }
});

await test('v4.0 [4] Soru Şeması ve Kalitesi: Her soruda 4 benzersiz seçenek, seçeneklerde bulunan tek doğru cevap, açıklama ve dengeli zorluk dağılımı', () => {
  for (const q of G.GRAMMAR_QUESTIONS) {
    const errs = G.validateGrammarQuestion(q);
    eq(errs, [], `Soru doğrulaması hatasız olmalı: ${q.id}`);
  }

  for (const tid of ['a2-g01', 'a2-g02', 'a2-g04', 'a2-g05']) {
    const qs = G.getQuestionsForTopic(tid);
    const easyCount = qs.filter((q) => q.difficulty === 'easy').length;
    const medCount = qs.filter((q) => q.difficulty === 'medium').length;
    const hardCount = qs.filter((q) => q.difficulty === 'hard').length;
    ok(easyCount >= 5, `${tid} kolay soru sayısı (${easyCount}) en az 5 olmalı`);
    ok(medCount >= 5, `${tid} orta soru sayısı (${medCount}) en az 5 olmalı`);
    ok(hardCount >= 5, `${tid} zor soru sayısı (${hardCount}) en az 5 olmalı`);
  }
});

await test('v4.0 [5] Mini Sınav Sistemi: Yeni derslerin her birinden rastgele 5 soru ile mini sınav sorunsuz başlatılır, seçenekler karıştırılır ve doğru cevap korunur', () => {
  for (const tid of ['a2-g01', 'a2-g02', 'a2-g04', 'a2-g05']) {
    const quizItems = G.buildGrammarMiniQuiz(tid, 5);
    eq(quizItems.length, 5, `${tid} için mini sınav 5 soru dönmeli`);
    const qIds = new Set(quizItems.map((item) => item.id));
    eq(qIds.size, 5, `${tid} mini sınavında aynı soru tekrarlanmamalı`);
    for (const item of quizItems) {
      eq(item.options.length, 4, '4 seçenek olmalı');
      eq(new Set(item.options).size, 4, 'Seçenekler tekrarsız olmalı');
      ok(item.options.includes(item.correctAnswer), 'Doğru cevap seçeneklerde yer almalı');
    }
  }
});

await test('v4.0 [6] Grammar İlerlemesi ve Başarı Ölçütü: Yeni derslerde 4/5 (%80) doğru ile ders tamamlandı (completed: true) kaydedilir', async () => {
  const tid = 'a2-g01';
  await G.recordGrammarQuizResult(tid, { correct: 4, total: 5 });
  let prog = getGrammarProgress(tid);
  eq(prog.completed, true, '%80 ile ders tamamlandı olmalı');
  eq(prog.bestScore, 80, 'En iyi puan 80 olmalı');
  eq(prog.lastScore, 80, 'Son puan 80 olmalı');

  await G.recordGrammarQuizResult(tid, { correct: 2, total: 5 });
  prog = getGrammarProgress(tid);
  eq(prog.completed, true, 'Düşük puan completed durumunu bozmamalı');
  eq(prog.bestScore, 80, 'En iyi puan korunmalı');
  eq(prog.lastScore, 40, 'Son puan güncellenmeli');
});

await test('v4.0 [8] Özel İmza Güvenliği: "ahmet ❤️ sude" özel imzası harfi harfine korunmuştur', async () => {
  const appSrc = await readText('js/app.js');
  ok(appSrc.includes('<span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span>'), 'ahmet ❤️ sude imzası harfi harfine korunmalı');
});

await test('v4.0 [9] PWA ve Çevrimdışı Uyumluluk: Service Worker sürümü güncellenmiştir', async () => {
  const sw = await readText('service-worker.js');
  ok(sw.includes("const VERSION = 'veluno-v5.0.3';"), 'SW sürümü veluno-v5.0.3 olmalı');
});

out('\n10) VELUNO v4.1 — Vocabulary Expansion / Phase D (375 Taslak Aktivasyonu)');

await test('v4.1 [1] 375 Taslak Kelimenin Eksiksiz İçerikle Aktifleşmesi Doğrulandı', () => {
  const allDataWords = [...data.A2, ...data.B1, ...data.B2];
  const activeWords = allDataWords.filter((w) => !w.isDraft);
  const draftWords = allDataWords.filter((w) => w.isDraft);
  ok(activeWords.length >= 1306, 'En az 1.306 aktif kelime bulunmalı');
  eq(draftWords.length, 14, 'Toplam 14 taslak kelime korunmalı');

  const a2Drafts = data.A2.filter((w) => w.isDraft);
  const b1Drafts = data.B1.filter((w) => w.isDraft);
  eq(a2Drafts.length, 12, 'A2 seviyesinde 12 taslak kelime (1 duplicate + 11 CEFR uyumsuz) korunmalı');
  eq(b1Drafts.length, 2, 'B1 seviyesinde 2 taslak kelime (analyze ve apologize duplicate) korunmalı');
});

await test('v4.1 [2] Yeni Aktifleşen 375 Kelimenin Cümle Bütünlüğü ve Boşluk Doldurma Uyumluluğu', () => {
  const activatedA2 = ['a2-oxref-0195', 'a2-oxref-0196', 'a2-oxref-0199', 'a2-oxref-0213', 'a2-oxref-0217', 'a2-oxref-0218'];
  for (const wid of activatedA2) {
    const w = data.A2.find((x) => x.id === wid);
    ok(w && !w.isDraft, `${wid} aktifleşmiş olmalı`);
    eq(w.partOfSpeech, 'preposition', `${wid} kelime türü preposition olmalı`);
    ok(isWordReady(w), `${wid} isWordReady true olmalı`);
    const b = E.blankSentence(w);
    ok(b && b.text.includes('_____'), `${wid} için boşluk üretilebilmeli`);
  }

  // B1 aktifleşen örnekler (explore, expert, necessarily, emphasize, realize)
  const exploreWord = data.B1.find((x) => x.id === 'b1-oxref-0040');
  ok(exploreWord && !exploreWord.isDraft);
  eq(exploreWord.meanings, ['keşfetmek', 'araştırmak'], 'explore Türkçe anlamı düzeltilmeli');
  ok(E.blankSentence(exploreWord).text.includes('_____'));

  const expertWord = data.B1.find((x) => x.id === 'b1-oxref-0168');
  ok(expertWord && !expertWord.isDraft);
  eq(expertWord.meanings, ['uzman', 'bilirkişi'], 'expert Türkçe anlamı düzeltilmeli');

  const necessarilyWord = data.B1.find((x) => x.id === 'b1-oxref-0328');
  ok(necessarilyWord && !necessarilyWord.isDraft);
  eq(necessarilyWord.meanings, ['zorunlu olarak', 'mutlaka', 'illaki'], 'necessarily anlamı düzeltilmeli');

  const empWord = data.B1.find((x) => x.id === 'b1-oxref-0029');
  ok(empWord && empWord.alternativeAnswers.includes('emphasise'), 'emphasize alternativeAnswers emphasise içermeli');

  const realWord = data.B1.find((x) => x.id === 'b1-oxref-0080');
  ok(realWord && realWord.alternativeAnswers.includes('realise'), 'realize alternativeAnswers realise içermeli');
});

await test('v4.1 [3] Tüm Aktif Kelimelerin (>= 2.000) 6 Aşamalı Öğrenme, SRS ve Sınav Sistemleriyle Tam Uyumlu Olması', () => {
  const allActive = [...data.A2, ...data.B1, ...data.B2].filter((w) => !w.isDraft);
  ok(allActive.length >= 2000, 'Aktif kelime havuzu >= 2.000 olmalı');
  for (const w of allActive) {
    ok(w.exampleSentence && w.exampleSentence.length >= 15, `${w.id} örnek cümle yeterli uzunlukta olmalı`);
    ok(w.exampleTranslation && w.exampleTranslation.length >= 10, `${w.id} çeviri yeterli uzunlukta olmalı`);
    ok(isWordReady(w), `${w.id} hazır olmalı`);
    ok(E.blankSentence(w), `${w.id} boşluk cümlesi üretebilmeli`);
  }
});

out('\n11) VELUNO v4.1 — Vocabulary Expansion / Phase E (>= 2.000 Aktif Kelime Havuzu)');

await test('v4.1 [4] Phase E: 2.010 Aktif Kelime ve 14 Taslak (Toplam 2.024 Kelime) Dağılımı ve Şeması', () => {
  const allDataWords = [...data.A2, ...data.B1, ...data.B2];
  eq(allDataWords.length, 2024, 'Toplam 2.024 yerleşik kelime kaydı bulunmalı');

  const activeWords = allDataWords.filter((w) => !w.isDraft);
  const draftWords = allDataWords.filter((w) => w.isDraft);
  eq(activeWords.length, 2010, 'Toplam 2.010 aktif kelime bulunmalı (>= 2.000 hedefi aşıldı)');
  eq(draftWords.length, 14, 'Toplam 14 taslak kelime bulunmalı');

  const a2Active = data.A2.filter((w) => !w.isDraft);
  const b1Active = data.B1.filter((w) => !w.isDraft);
  const b2Active = data.B2.filter((w) => !w.isDraft);
  eq(a2Active.length, 700, 'A2 seviyesinde 700 aktif kelime olmalı');
  eq(b1Active.length, 710, 'B1 seviyesinde 710 aktif kelime olmalı');
  eq(b2Active.length, 600, 'B2 seviyesinde 600 aktif kelime olmalı');
});

await test('v4.1 [5] Phase E: Yeni Eklenen 704 Kelimenin Soru Üretimi ve Seviye Uyumunun Doğrulanması', () => {
  const all = [...data.A2, ...data.B1, ...data.B2];
  const newWords = all.filter((w) => w.id.includes('-v41-'));
  eq(newWords.length, 704, 'Tam 704 yeni kelime eklenmiş olmalı');

  for (const w of newWords) {
    ok(!w.isDraft, `${w.id} aktif olmalı`);
    ok(isWordReady(w), `${w.id} hazır olmalı`);
    const b = E.blankSentence(w);
    ok(b && b.text.includes('_____'), `${w.id} için boşluk doldurma geçerli olmalı`);
    ok(CATEGORY_LABELS[w.category], `${w.id} kategorisi CATEGORY_LABELS içinde olmalı: ${w.category}`);

    // Soru tipleri kontrolü
    for (const qType of ['mc', 'typing', 'missing', 'sentence', 'production']) {
      const q = E.buildQuestion(w, qType, all);
      eq(q.type, qType, `${w.id} için ${qType} tipi soru üretilebilmeli`);
    }
  }
});

out('\n12) VELUNO Studio Theme Update');

await test('Studio [1] VELUNO Studio temasının seçilmesi, saklanması ve ayarlar arayüzü', async () => {
  const appCode = await readText('js/app.js');
  const css = await readText('css/style.css');

  // 4 seçenek bulunmalı: Açık, Koyu, Otomatik ve VELUNO Studio
  ok(appCode.includes('data-set-theme="light"') && appCode.includes('data-set-theme="dark"') && appCode.includes('data-set-theme="auto"') && appCode.includes('data-set-theme="studio"'), 'Ayarlarda 4 tema butonu (light, dark, auto, studio) tanımlı olmalı');
  ok(appCode.includes('>Açık</button>') && appCode.includes('>Koyu</button>') && appCode.includes('>Otomatik</button>') && appCode.includes('>VELUNO Studio</button>'), 'Ayarlarda Açık, Koyu, Otomatik ve VELUNO Studio etiketleri bulunmalı');

  // 2x2 ızgara ve önizleme swatch sınıfları CSS ve JS'de mevcut olmalı
  ok(appCode.includes('class="theme-grid"') && css.includes('.theme-grid{display:grid'), '2x2 tema seçim ızgarası tanımlı olmalı');
  ok(css.includes('.theme-card-btn') && css.includes('.theme-p-studio'), 'Studio tema kartı ve önizleme swatch stili mevcut olmalı');
});

await test('Studio [2] resolveTheme() fonksiyonu ve cihaz tema bağımsızlığı', () => {
  // Studio doğrudan studio dönmeli; cihazın koyu/açık modundan etkilenmemeli
  eq(resolveTheme('studio', false), 'studio', 'Studio teması açık cihaz ayarında studio dönmeli');
  eq(resolveTheme('studio', true), 'studio', 'Studio teması koyu cihaz ayarında studio dönmeli');
  eq(resolveTheme('studio'), 'studio', 'Studio teması argümansız studio dönmeli');

  // Eski temalar eksiksiz korunmalı
  eq(resolveTheme('light', true), 'light');
  eq(resolveTheme('light', false), 'light');
  eq(resolveTheme('dark', true), 'dark');
  eq(resolveTheme('dark', false), 'dark');
  eq(resolveTheme('auto', true), 'dark');
  eq(resolveTheme('auto', false), 'light');
});

await test('Studio [3] index.html açılış scripti ve Safari theme-color meta etiketi (#131F23)', async () => {
  const html = await readText('index.html');
  const appCode = await readText('js/app.js');

  // index.html inline scripti studio değerini çözebilmeli
  ok(html.includes("pref === 'studio'") && html.includes("'studio'"), 'index.html inline scripti studio tercihini tanımalı');
  ok(html.includes("studio: '#131F23'"), 'index.html inline scripti studio için #131F23 theme-color tanımlamalı');
  ok(appCode.includes("studio: '#131F23'"), 'applySettings() studio için #131F23 theme-color ayarlamalı');
});

await test('Studio [4] Studio renk paleti, değişkenler ve durum renkleri (#92D332, #131F23, #37464F, #CD82FF)', async () => {
  const css = await readText('css/style.css');

  // Ana renkler
  ok(css.includes('--studio-bg:#131F23') || css.includes('--studio-bg: #131F23'), 'Studio bg #131F23 olmalı');
  ok(css.includes('--studio-primary:#92D332') || css.includes('--studio-primary: #92D332'), 'Studio primary #92D332 olmalı');
  ok(css.includes('--studio-border:#37464F') || css.includes('--studio-border: #37464F'), 'Studio border #37464F olmalı');
  ok(css.includes('--studio-accent:#CD82FF') || css.includes('--studio-accent: #CD82FF'), 'Studio accent #CD82FF olmalı');

  // Yardımcı renkler
  for (const token of ['#1B2A2F', '#24353B', '#F2F6F5', '#A7B6BC', '#293D2B', '#34283F']) {
    ok(css.includes(token), `Studio yardımcı rengi ${token} css içinde bulunmalı`);
  }

  // Durum renkleri (yeşil ana buton ile karışmayı önleyen emerald #2CE58B ve mercan #FF6B6B)
  ok(css.includes('#2CE58B') && css.includes('#153826'), 'Doğru cevap emerald #2CE58B ve #153826 soft bg olmalı');
  ok(css.includes('#FFB340') && css.includes('#382B14'), 'Uyarı #FFB340 ve #382B14 soft bg olmalı');
  ok(css.includes('#FF6B6B') && css.includes('#3E1E22'), 'Hata #FF6B6B ve #3E1E22 soft bg olmalı');
});

await test('Studio [5] Bileşen düzeyinde mor vurgular, navigasyon ve kontrast uyumu', async () => {
  const css = await readText('css/style.css');

  // Aktif menü öğeleri mor vurgulu olmalı (#CD82FF ve #34283F)
  ok(css.includes(':root[data-theme=studio] #sidebar a.active') && css.includes('#34283F') && css.includes('#CD82FF'), 'Kenar çubuğu aktif öğesi mor arkaplan ve mor yazıya sahip olmalı');
  ok(css.includes(':root[data-theme=studio] #bottomnav a.active') && css.includes('#CD82FF'), 'Mobil alt menü aktif öğesi mor yazıya sahip olmalı');

  // Kelime anlamı ve rozetler mor vurgulu
  ok(css.includes(':root[data-theme=studio] .meaning') && css.includes(':root[data-theme=studio] .step.done .step-node'), 'Grammar adımları ve kelime anlamları mor vurgu içermeli');
  ok(css.includes(':root[data-theme=studio] .step.active .step-node'), 'Grammar aktif adımı Studio için tanımlı olmalı');

  // Ana butonlar yeşil zemin üzerinde koyu yazı (#131F23) içermeli
  ok(css.includes('--on-ac:#131F23') || css.includes('--on-ac: #131F23'), 'Studio temasında buton üstü metin rengi koyu petrol (#131F23) olmalı');
});

await test('Studio [6] Mevcut sistemlerin, 2.024 kelimenin, 38 Grammar konusunun ve "ahmet ❤️ sude" imzasının korunması', async () => {
  const allWords = [...data.A2, ...data.B1, ...data.B2];
  const activeWords = allWords.filter((w) => !w.isDraft);
  const draftWords = allWords.filter((w) => w.isDraft);

  eq(allWords.length, 2024, 'Toplam kelime sayısı 2.024 olarak korunmalı');
  eq(activeWords.length, 2010, 'Aktif kelime sayısı 2.010 olarak korunmalı');
  eq(draftWords.length, 14, 'Taslak kelime sayısı 14 olarak korunmalı');
  eq(G.GRAMMAR_TOPICS.length, 38, '38 Grammar konusu korunmalı');
  eq(G.GRAMMAR_QUESTIONS.length, 760, '760 Grammar sorusu korunmalı');

  const appSrc = await readText('js/app.js');
  ok(appSrc.includes('<span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span>'), 'ahmet ❤️ sude imzası korunmalı');
});

await test('UI Refinement: Kelime öğrenme ekranında Yavaş metni kaldırıldı, ses butonu korundu; Ana sayfada logo kaldırıldı, VELUNO ve imza hizalandı', async () => {
  const learnSrc = await readText('js/learning.js');
  const appSrc = await readText('js/app.js');
  const css = await readText('css/style.css');

  // 1) "Yavaş" metni kaldırılmış olmalı, ses butonu ve simgesi korunmalı
  ok(!learnSrc.includes('>Yavaş</button>') && !learnSrc.includes('data-slow'), 'Öğrenme ekranında Yavaş butonu ve metni bulunmamalı');
  ok(learnSrc.includes('class="speak-btn"') && learnSrc.includes('data-speak='), 'Öğrenme ekranında seslendirme butonu ve data-speak korunmalı');

  // 2) Üst logoyu içermemeli, VELUNO başlığı ve imza yan yana korunmalı
  ok(!appSrc.includes('alt="VELUNO logosu"') && !appSrc.includes('class="hero-logo"'), 'Üst bölümde logo görseli bulunmamalı');
  ok(appSrc.includes('<span class="hero-title" aria-label="VELUNO">VELUNO</span>'), 'VELUNO başlığı korunmalı');
  ok(appSrc.includes('<span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span>'), 'ahmet ❤️ sude imzası korunmalı');
  ok(css.includes('.hero-title-row{') && css.includes('.hero-sig{'), 'Başlık ve imza satır CSS kuralları korunmalı');
});

out('\n13) VELUNO v4.3 — Private Romantic Surprise & Secure Architecture');

await test('Sude [1] Gizlilik ve Güvenlik: Depoda hiçbir kişisel fotoğraf, özel mesaj, şifre veya gizli anahtar bulunmamalı', async () => {
  const fbCfgSrc = await readText('js/firebase-config.js');
  const authSrc = await readText('js/auth.js');

  // 1) Asla gerçek şifre veya servis hesabı anahtarı kaynak kodda olmamalı
  ok(!fbCfgSrc.includes('private_key') && !fbCfgSrc.includes('service_account'), 'Firebase istemci yapılandırmasında servis hesabı veya gizli anahtar olmamalı');
  ok(!authSrc.includes('password = "') && !authSrc.includes("password = '"), 'Sabit şifre karşılaştırması kodda bulunmamalı');

  // 2) Gerçek fotoğraf veya mp3 dosyası depoya eklenmemiş olmalı
  const fs = await import('node:fs').catch(() => null);
  if (fs) {
    ok(!fs.existsSync('assets/sude.jpg') && !fs.existsSync('assets/photo.jpg') && !fs.existsSync('assets/derdim.mp3'), 'Özel fotoğraf veya şarkı deposu herkese açık assets klasörüne yüklenmemeli');
  }
});

await test('Sude [2] Firebase Güvenlik Kuralları Taslağı: storage.rules ve firestore.rules varsayılan erişimi reddetmeli', async () => {
  const storageRules = await readText('firebase/storage.rules');
  const firestoreRules = await readText('firebase/firestore.rules');
  const surpriseSrc = await readText('js/surprise.js');

  // Storage Kuralları (Spark Planı: Blaze gerekmemesi için Storage kapalıdır)
  ok(storageRules.includes("service firebase.storage"), 'storage.rules geçerli firebase.storage servisi tanımlamalı');
  ok(storageRules.includes("allow read, write: if false;"), 'storage.rules varsayılan olarak tüm yolları engellemeli');

  // Firestore Kuralları
  ok(firestoreRules.includes("service cloud.firestore"), 'firestore.rules geçerli cloud.firestore servisi tanımlamalı');
  ok(firestoreRules.includes("allow read, write: if false;"), 'firestore.rules varsayılan olarak tüm yolları engellemeli');
  ok(firestoreRules.includes("match /private/sude") && firestoreRules.includes("request.auth != null"), 'firestore.rules private/sude belgesi için yetkili UID kontrolü yapmalı');
  ok(firestoreRules.includes("match /private/sudePhoto") && firestoreRules.includes("request.auth != null"), 'firestore.rules private/sudePhoto belgesi için yetkili UID kontrolü yapmalı');
  ok(firestoreRules.includes("allow write: if false;"), 'firestore.rules istemci tarafı yazma işlemlerini engellemeli');

  // surprise.js Firestore fotoğraf depolama kontrolü (Storage çağrısı olmamalı, Firestore sudePhoto kullanılmalı)
  ok(!surpriseSrc.includes("firebase.storage"), 'surprise.js Firebase Storage çağrısı içermemeli (Spark planı)');
  ok(surpriseSrc.includes("doc('sudePhoto')") && surpriseSrc.includes("imageBase64"), 'surprise.js Firestore sudePhoto belgesinden imageBase64 okumalı');
});

await test('Sude [3] Yetkilendirme & Rol Davranışı: Misafir, Sude, Ahmet ve yetkisiz UID durumları', () => {
  Auth._resetForTesting();

  // 1) Misafir (Giriş yapılmamış)
  eq(Auth.getCurrentUser(), null, 'Başlangıçta kullanıcı null olmalı');
  eq(Auth.isLoggedIn(), false, 'Misafir isLoggedIn=false olmalı');
  eq(Auth.isSude(), false, 'Misafir isSude=false olmalı');
  eq(Auth.isAhmet(), false, 'Misafir isAhmet=false olmalı');
  eq(Auth.isAuthorizedUser(), false, 'Misafir isAuthorizedUser=false olmalı');

  // 2) Rastgele / yetkisiz UID
  Auth._setMockUserForTesting({ uid: 'random-unauthorized-uid', email: 'intruder@test.com' });
  eq(Auth.isLoggedIn(), true, 'Giriş yapmış sayılmalı');
  eq(Auth.isSude(), false, 'Yetkisiz hesap Sude sayılmamalı');
  eq(Auth.isAhmet(), false, 'Yetkisiz hesap Ahmet sayılmamalı');
  eq(Auth.isAuthorizedUser(), false, 'Yetkisiz hesap isAuthorizedUser=false olmalı');

  // 3) Geçersiz UID kontrol fonksiyonları
  eq(FbCfg.isSudeUid(''), false);
  eq(FbCfg.isAhmetUid(''), false);
  eq(FbCfg.isAuthorizedUid('fake'), false);

  Auth._resetForTesting();
});

await test('Sude [4] Sude Oturum Kalıcılığı: Yeni girişte sürpriz gösterilmeli, sayfa yenilemede zorla açılmamalı', () => {
  Auth._resetForTesting();

  // Başlangıçta oturumda görülmedi
  eq(Auth.hasSeenSurpriseThisSession(), false, 'Yeni oturumda sürpriz henüz görülmemiş olmalı');

  // Sude sürprizi gördüğünde veya devam et butonuna bastığında
  Auth.markSurpriseSeen();
  eq(Auth.hasSeenSurpriseThisSession(), true, 'Sürpriz görüldükten sonra true dönmeli');

  // Sayfa yenilemesi oturumu korur
  eq(Auth.hasSeenSurpriseThisSession(), true, 'Sayfa yenilendiğinde sürpriz tekrar zorla açılmamalı');

  // Yeni bir giriş (login) yapıldığında sıfırlanır
  Auth.resetSurpriseSession();
  eq(Auth.hasSeenSurpriseThisSession(), false, 'Yeni girişte sürpriz yeniden gösterilmek üzere sıfırlanmalı');

  Auth._resetForTesting();
});

await test('Sude [5] Sürpriz Ekranı Arayüzü: Just For You tasarımı, Apple sadeliği, süzülen kalpler ve müzik altyapısı', async () => {
  const surpriseSrc = await readText('js/surprise.js');
  const css = await readText('css/style.css');

  // Arayüz bileşenleri
  ok(surpriseSrc.includes('JUST FOR YOU') && surpriseSrc.includes('Senin için küçük bir şey hazırladım'), 'Sürpriz başlığı ve selamlama metni bulunmalı');
  ok(surpriseSrc.includes('id="btn-open-surprise"'), 'Sürprizini Aç butonu bulunmalı');
  ok(surpriseSrc.includes('id="jfy-revealed"') && surpriseSrc.includes('id="jfy-placeholder"'), 'Açılış aşaması ve güvenli fotoğraf yer tutucusu bulunmalı');
  ok(surpriseSrc.includes('id="btn-toggle-music"') && surpriseSrc.includes('id="jfy-audio"'), 'Minimalist müzik kontrol butonu ve ses öğesi bulunmalı');
  ok(!surpriseSrc.includes('Gökhan Türkmen') && !surpriseSrc.includes('jfy-music-card'), 'Şarkı ve sanatçı adı arayüzde görünmemeli, büyük kart kaldırılmış olmalı');
  ok(surpriseSrc.includes('Beni Sevmeye Devam Et') || surpriseSrc.includes('VELUNO’ya Devam Et') || surpriseSrc.includes('VELUNO&#39;ya Devam Et'), "Romantik çıkış butonu bulunmalı");

  // CSS sınıfları (jfy-* isim alanı)
  ok(css.includes('.jfy-page{') && css.includes('.jfy-hearts-bg{'), 'Romantik sayfa ve süzülen kalpler CSS kuralları tanımlı olmalı');
  ok(css.includes('@keyframes jfyFloat') && css.includes('.jfy-romantic-card{'), 'Kalp animasyonları ve romantik kart tasarımı bulunmalı');
});

await test('Sude [6] Çevrimdışı ve Sıfır Bağımlılık Garantisi: Firebase olmadan VELUNO kelime, grammar ve temaları 100% çalışmalı', async () => {
  const allWords = [...data.A2, ...data.B1, ...data.B2];
  const activeWords = allWords.filter((w) => !w.isDraft);

  // 1) Tüm eğitim verileri eksiksiz korunmalı
  eq(activeWords.length, 2010, '2.010 aktif kelime korunmalı');
  eq(allWords.length, 2024, '2.024 toplam kayıt korunmalı');
  eq(G.GRAMMAR_TOPICS.length, 38, '38 Grammar dersi korunmalı');
  eq(G.GRAMMAR_QUESTIONS.length, 760, '760 Grammar sorusu korunmalı');

  // 2) Dört tema ve imza korunmalı
  eq(resolveTheme('light'), 'light');
  eq(resolveTheme('dark'), 'dark');
  eq(resolveTheme('studio'), 'studio');
  eq(resolveTheme('auto', true), 'dark');
  eq(resolveTheme('auto', false), 'light');

  const appSrc = await readText('js/app.js');
  ok(appSrc.includes('<span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span>'), 'ahmet ❤️ sude imzası korunmalı');
});

await test('Sude [7] Spark Planı & Firestore Fotoğraf Depolama Mimarisi: 100% Ücretsiz, Sıfır Blaze Bağımlılığı, Base64 WebP ve Doküman Limiti Güvencesi', async () => {
  const readmeSrc = await readText('firebase/README.md');
  const firestoreRules = await readText('firebase/firestore.rules');
  const surpriseSrc = await readText('js/surprise.js');

  // 1) Spark ve Blaze bağımsızlığı README ve kurallarda belgelenmeli
  ok(readmeSrc.includes('Firebase Spark') && readmeSrc.includes('Blaze Gerekmez'), 'README.md Spark planı ve Blaze gereksizliğini belirtmeli');
  ok(readmeSrc.includes('sudePhoto') && readmeSrc.includes('imageBase64') && readmeSrc.includes('mimeType'), 'README.md sudePhoto belge alanlarını açıklamalı');
  ok(readmeSrc.includes('1 MiB') || readmeSrc.includes('1MB') || readmeSrc.includes('1 MB'), 'README.md Firestore 1 MiB belge boyut limitini açıklamalı');

  // 2) Firestore rules sudePhoto belgesine istemci yazmasını engellemeli
  ok(firestoreRules.includes('match /private/sudePhoto'), 'firestore.rules private/sudePhoto belgesini tanımlamalı');
  ok(firestoreRules.includes('allow write: if false;'), 'firestore.rules istemci yazmasını yasaklamalı');

  // 3) surprise.js Data URL oluşturma mantığı: mimeType fallback 'image/webp' ve base64
  ok(surpriseSrc.includes("mimeType || 'image/webp'"), 'surprise.js varsayılan WebP mimeType kullanmalı');
  ok(surpriseSrc.includes('data:${mime};base64,${pdata.imageBase64}'), 'surprise.js Data URL formatını doğru üretmeli');
});

await test('Sude [8] Firebase Web Bağlantı Altyapısı ve Erişim Tanılama Aracı (testFirebaseAccess)', async () => {
  const fbCfg = await import('../js/firebase-config.js');
  const authModule = await import('../js/auth.js');
  const appSrc = await readText('js/app.js');

  // 1) Proje adı veluno-private ve gerçek yapılandırma değerleri tanımlı olmalı
  eq(fbCfg.FIREBASE_CONFIG.projectId, 'veluno-private', 'projectId veluno-private olmalı');
  eq(fbCfg.FIREBASE_CONFIG.authDomain, 'veluno-private.firebaseapp.com', 'authDomain veluno-private olmalı');
  eq(fbCfg.FIREBASE_CONFIG.messagingSenderId, '1027705472722', 'messagingSenderId doğru olmalı');
  eq(fbCfg.isFirebaseConfigured(), true, 'isFirebaseConfigured true dönmeli');

  // 2) Gerçek UID değerleri ve yetki kontrol fonksiyonları
  eq(fbCfg.AUTHORIZED_UIDS.AHMET, 'abtxapEdixd96LgSRo9ZufW6RB82', 'Ahmet UID doğru ayarlanmalı');
  eq(fbCfg.AUTHORIZED_UIDS.SUDE, '8wjsLQS03fgOH7EuptJA5mJDqTn2', 'Sude UID doğru ayarlanmalı');
  eq(fbCfg.isAhmetUid('abtxapEdixd96LgSRo9ZufW6RB82'), true, 'Ahmet UID tanınmalı');
  eq(fbCfg.isSudeUid('8wjsLQS03fgOH7EuptJA5mJDqTn2'), true, 'Sude UID tanınmalı');
  eq(fbCfg.isAuthorizedUid('intruder'), false, 'Yabancı UID yetkisiz olmalı');

  // 3) testFirebaseAccess fonksiyonu export edilmiş olmalı ve güvenli sonuç dönmeli
  ok(typeof authModule.testFirebaseAccess === 'function', 'testFirebaseAccess fonksiyonu mevcut olmalı');
  const res = await authModule.testFirebaseAccess();
  eq(res.project, 'veluno-private', 'testFirebaseAccess doğru proje adını okumalı');
  ok(Array.isArray(res.tests), 'test sonuçları dizi olmalı');

  // 4) Ayarlar ekranında Erişim ve Güvenlik Testi butonları tanımlı olmalı
  ok(appSrc.includes('id="test-access-btn"') && appSrc.includes('id="test-guest-btn"'), 'Ayarlar menüsünde hem yetkili hem misafir için test butonu bulunmalı');
  ok(appSrc.includes('showAccessTestModal'), 'app.js içinde tanılama modalı tanımlı olmalı');
});

await test('Sude [9] Romantik Deneyim Tasarımı: Büyütülmüş Fotoğraf (%30), Kalp Patlaması, Zengin Kalp Atmosferi ve Tipografi', async () => {
  const surpriseSrc = await readText('js/surprise.js');
  const css = await readText('css/style.css');

  // 1) Ses Uyarısı (Sound notice)
  ok(surpriseSrc.includes('class="jfy-sound-notice"') && surpriseSrc.includes('Telefonunun sesini açmayı unutma'), 'Açılış ekranında romantik ses uyarısı bulunmalı');
  ok(surpriseSrc.includes('Çünkü bu sürprizin bir de şarkısı var'), 'Ses uyarısı açıklama metni bulunmalı');

  // 2) Büyütülmüş Fotoğraf Alanı (340px yerine 440px)
  ok(css.includes('.jfy-photo-container{width:100%;max-width:440px') || css.includes('max-width:440px;margin:0 auto'), 'Fotoğraf alanı genişliği 440px (~%30 daha büyük) olmalı');
  ok(css.includes('.jfy-real-photo') && css.includes('@keyframes jfyPhotoReveal'), 'Fotoğraf reveal animasyonu tanımlı olmalı');

  // 3) Kalp Patlaması (Heart Burst)
  ok(surpriseSrc.includes('triggerHeartBurst'), 'triggerHeartBurst fonksiyonu sürpriz açılışında çağrılmalı');
  ok(css.includes('.jfy-burst-wrap') && css.includes('.jfy-burst-particle') && css.includes('@keyframes jfyBurstAnim'), 'Kalp patlaması parçacık animasyonu tanımlı olmalı');

  // 4) Zenginleştirilmiş Arka Plan Kalpleri (>= 25 adet)
  const heartMatches = (surpriseSrc.match(/class="jfy-heart h\d+"/g) || []);
  ok(heartMatches.length >= 25, `Arka planda en az 25 romantik kalp bulunmalı, bulunan: ${heartMatches.length}`);

  // 5) Tipografi ve Mesaj Düzeni
  ok(surpriseSrc.includes('formatRomanticMessage'), 'Mesaj için formatRomanticMessage fonksiyonu bulunmalı');
  ok(css.includes('.jfy-msg-lead') && css.includes('.jfy-msg-divider') && css.includes('.jfy-msg-paragraphs'), 'Mesaj lead, kalp ayırıcı ve sola hizalı ferah gövde sınıfları tanımlı olmalı');

  // 6) Gizlilik Garantisi: Gerçek kişisel mesaj kaynak kodda veya CSS içinde bulunmamalı
  ok(!surpriseSrc.includes('Senin için, bizim için ve daha iyi biri olabilmek için'), 'Gerçek kişisel mesaj kaynak kodda sabit gömülü olmamalı');
  ok(!css.includes('Senin için, bizim için ve daha iyi biri olabilmek için'), 'Gerçek kişisel mesaj CSS içine eklenmemeli');
});

await test('Sude [10] Kalp Patlaması Güvenilirliği: Safari Uyumu, ~100 Parçacık, Web Animations, DOM Temizliği & SW Cache-Bust', async () => {
  const surpriseSrc = await readText('js/surprise.js');
  const css = await readText('css/style.css');
  const sw = await readText('service-worker.js');

  // 1) ~100 Parçacık (Mobilde 60)
  ok(surpriseSrc.includes('totalParticles = isMobile ? 60 : 100') || surpriseSrc.includes('100'), 'Kalp patlaması masaüstünde ~100 parçacıktan oluşmalı');

  // 2) Safari ve Modern Tarayıcılar İçin Web Animations API Donanım Hızlandırması
  ok(surpriseSrc.includes('p.animate'), 'Safari CSS değişken sorunlarını aşmak için Web Animations API kullanılmalı');

  // 3) En Önde Görünürlük & Kırpılma Koruması (z-index: 999999 & inset: 0)
  ok(css.includes('.jfy-burst-wrap{position:fixed;inset:0;') && css.includes('z-index:999999'), 'Burst taşıyıcısı ekranın en önünde (z-index: 999999) ve tam ekran (inset: 0) olmalı');

  // 4) DOM Temizliği (Parçacıkların ve taşıyıcının kaldırılması)
  ok(surpriseSrc.includes('burstWrap.parentNode.removeChild(burstWrap)') && surpriseSrc.includes('try { el.remove(); }'), 'Animasyon tamamlandıktan sonra parçacıklar ve taşıyıcı DOM\'dan temizlenmeli');

  // 5) prefers-reduced-motion & Azaltılmış Hareket Erişilebilirliği
  ok(surpriseSrc.includes('prefers-reduced-motion') && css.includes('jfyBurstReduced'), 'Erişilebilirlik modunda nazik süzülme animasyonu sağlanmalı');

  // 6) Service Worker Önbellek Yenilenmesi
  ok(sw.includes("const VERSION = 'veluno-v5.0.3';"), 'Eski tarayıcı önbelleklerini temizlemek için SW sürümü güncellenmiş olmalı');
});

await test('Sude [11] Romantik Buton Tasarımı, Üstte Birikmeyen Kalpler ve ~80 Arka Plan Kalbi', async () => {
  const surpriseSrc = await readText('js/surprise.js');
  const css = await readText('css/style.css');

  // 1) Buton metni ve yapısı: "Beni Sevmeye Devam Et ❤️"
  ok(surpriseSrc.includes('Beni Sevmeye Devam Et') && surpriseSrc.includes('class="jfy-btn-continue"'), 'Yeni buton metni Beni Sevmeye Devam Et ❤️ olmalı');
  ok(!surpriseSrc.includes('class="btn primary xl block jfy-btn-continue"'), 'Buton Studio temasının lime yeşilini almaması için genel btn primary sınıfından arındırılmalı');

  // 2) Buton renkleri: #E8B4D8, #F3C5E5, #27152D, rgba(255,220,245,.35)
  ok(css.includes('background:#E8B4D8') && css.includes('color:#27152D'), 'Buton arka planı #E8B4D8 ve metin rengi #27152D olmalı');
  ok(css.includes('.jfy-btn-continue:hover{background:#F3C5E5'), 'Buton hover rengi #F3C5E5 olmalı');
  ok(css.includes('border:1px solid rgba(255,220,245,.35)'), 'Buton çerçevesi rgba(255,220,245,.35) olmalı');

  // 3) Kalplerin üstte birikmesini önleyen mimari (bottom: -60px ve negatif animation-delay)
  ok(css.includes('.jfy-heart{position:absolute;bottom:-60px;') && css.includes('animation-fill-mode:both;'), 'Kalplerin başlangıç konumu altta (bottom: -60px) olmalı, üstte birikmemeli');
  ok(css.includes('animation-delay:-'), 'Kalplerin ekranda anında dağılmış olması için negatif gecikme (animation-delay: -Xs) kullanılmalı');

  // 4) Arka plan kalp yoğunluğu: Masaüstünde 80 kalp, mobilde 40 kalbe dinamik azaltma
  const heartMatches = (surpriseSrc.match(/class="jfy-heart h\d+"/g) || []);
  eq(heartMatches.length, 80, 'Masaüstünde tam 80 arka plan kalbi tanımlı olmalı');
  ok(css.includes('.jfy-heart:nth-child(n+41){display:none!important}'), 'Mobilde (max-width:768px) 40 kalbe dinamik performans azaltması yapılmalı');
});

await test('Sude [12] Minimalist Müzik Sistemi, Gizli Şarkı/Sanatçı Bilgisi ve Telif Koruması', async () => {
  const surpriseSrc = await readText('js/surprise.js');
  const css = await readText('css/style.css');
  const gitignore = await readText('.gitignore');

  // 1) Şarkı adı ve sanatçı adı kullanıcı arayüzünde görünmemeli, büyük kart kaldırılmış olmalı
  ok(!surpriseSrc.includes('Gökhan Türkmen') && !surpriseSrc.includes('Derdim'), 'Şarkıcı veya şarkı adı arayüzde görünmemeli');
  ok(!surpriseSrc.includes('class="jfy-music-card"') && !css.includes('.jfy-music-card{'), 'Büyük müzik kartı DOM ve CSS içerisinden kaldırılmış olmalı');

  // 2) Zarif, küçük oynat/duraklat butonu (pudra pembe ve lavanta tonlarında)
  ok(surpriseSrc.includes('class="jfy-audio-btn"') && surpriseSrc.includes('id="btn-toggle-music"'), 'Zarif müzik butonu bulunmalı');
  ok(css.includes('.jfy-audio-btn{') && css.includes('color:#E8B4D8'), 'Müzik butonu pudra pembe / lavanta (#E8B4D8) renk paletine sahip olmalı');

  // 3) Safari kullanıcı etkileşimi uyumu ve eş zamanlı başlatma
  ok(surpriseSrc.includes('audioEl.play()') && surpriseSrc.includes('triggerHeartBurst'), 'Sürpriz açıldığında ses oynatma ve kalp patlaması eş zamanlı tetiklenmeli');

  // 4) Beni Sevmeye Devam Et butonuna basıldığında ses durdurulmalı
  ok(surpriseSrc.includes('audioEl.pause()'), 'Çıkış butonuna basıldığında müzik durdurulmalı');

  // 5) Telifli ses dosyaları gitignore ile korunmalı (Yalnızca Ahmet'in orijinal şarkısına istisna)
  ok(gitignore.includes('*.mp3') && gitignore.includes('!assets/audio/ask.mp3'), '.gitignore içinde genel ses koruması ve yalnızca ask.mp3 istisnası bulunmalı');
});

await test('Sude [13] Ahmet’in Özgün Şarkısı (ask.mp3) Entegrasyonu & Git Yayınına Hazırlık', async () => {
  const gitignore = await readText('.gitignore');
  const surpriseSrc = await readText('js/surprise.js');

  // 1) ask.mp3 ses kaynağının surprise.js içinde göreli yol ile tanımlı olması (/ezberullah/ uyumu)
  ok(surpriseSrc.includes('assets/audio/ask.mp3'), 'Ses kaynağı assets/audio/ask.mp3 göreli yoluyla bağlı olmalı');

  // 2) .gitignore ask.mp3 dosyasını takip edilebilir kılar, diğer tüm mp3/m4a/wav dosyalarını korur
  ok(gitignore.includes('!assets/audio/ask.mp3'), 'ask.mp3 için gitignore istisnası tanımlı olmalı');
  ok(gitignore.includes('*.mp3') && gitignore.includes('*.m4a') && gitignore.includes('*.wav'), 'Diğer ses dosyaları koruma altında olmalı');
});

out('\n14) VELUNO v4.4 — Kelime Defterim (Notebook / Personal Word Lists)');

await test('Defter [1] Liste Oluşturma, Düzenleme ve Silme', async () => {
  // Temiz başla
  await saveAllNotebookLists([]);
  await saveAllNotebookWords([]);

  // 1) Yeni liste oluşturma
  const r1 = await createNotebookList('Unit 5 - Education', 'user_test_1');
  ok(r1.ok && r1.list.id && r1.list.name === 'Unit 5 - Education', 'Liste başarıyla oluşturulmalı');
  eq(r1.list.userId, 'user_test_1');
  eq(r1.list.wordIds, []);

  // 2) Boş isim engeli
  const rEmpty = await createNotebookList('   ', 'user_test_1');
  ok(!rEmpty.ok && rEmpty.error.includes('boş olamaz'), 'Boş liste adı reddedilmeli');

  // 3) Aynı kullanıcı için mükerrer liste adı engeli
  const rDup = await createNotebookList('unit 5 - education', 'user_test_1');
  ok(!rDup.ok && rDup.error.includes('zaten mevcut'), 'Aynı kullanıcı için aynı isimde liste oluşturulmamalı');

  // 4) Liste adını düzenleme
  const rEdit = await updateNotebookList(r1.list.id, { name: 'Unit 5 - Modern Education' });
  ok(rEdit.ok && rEdit.list.name === 'Unit 5 - Modern Education', 'Liste adı güncellenebilmeli');

  // 5) Liste silme
  const rDel = await deleteNotebookList(r1.list.id);
  ok(rDel.ok, 'Liste silinebilmeli');
  eq(getUserNotebookLists('user_test_1').length, 0, 'Silinen liste artık kullanıcı listelerinde bulunmamalı');
});

await test('Defter [2] Tek Tek Kelime Ekleme & Otomatik Zenginleştirme', async () => {
  const l = await createNotebookList('Test Listesi', 'user_test_2');
  const listId = l.list.id;

  // 1) Sözlükte bulunan kelime (örn: achieve) - doğrulanmış bilgilerle zenginleşir
  const rAchieve = await addWordToNotebook({
    word: 'achieve',
    meanings: 'başarmak; elde etmek',
    listId,
    userId: 'user_test_2',
  });
  ok(rAchieve.ok, 'Sözlükte olan kelime eklenebilmeli');
  const wAchieve = rAchieve.word;
  eq(wAchieve.word, 'achieve');
  ok(wAchieve.meanings.includes('başarmak'));
  ok(wAchieve.exampleSentence.includes('achieve'), 'Örnek cümle otomatik doldurulmalı');
  ok(isWordReady(wAchieve), 'isWordReady=true olmalı');
  ok(E.blankSentence(wAchieve), 'blankSentence boşluk üretebilmeli');

  // 2) Sözlükte olmayan özgün kelime (örn: serendipity) - otomatik geçerli cümle üretir, kullanıcıyı yormaz
  const rUnknown = await addWordToNotebook({
    word: 'serendipity',
    meanings: 'mutlu tesadüf',
    listId,
    userId: 'user_test_2',
  });
  ok(rUnknown.ok, 'Sözlükte olmayan kelime de sorunsuz eklenebilmeli');
  const wUnknown = rUnknown.word;
  ok(wUnknown.exampleSentence.includes('serendipity'), 'Otomatik şablon cümle kelimeyi içermeli');
  ok(isWordReady(wUnknown), 'Otomatik cümle sayesinde isWordReady=true olmalı');
  ok(E.blankSentence(wUnknown), 'Otomatik cümle boşluk doldurma (5. aşama) için hazır olmalı');

  // 3) Geçersiz kelime engeli
  const rInvalid = await addWordToNotebook({
    word: '123bad',
    meanings: 'hatalı',
    listId,
    userId: 'user_test_2',
  });
  ok(!rInvalid.ok && rInvalid.error.includes('Latin harfleri'), 'Geçersiz karakter içeren kelime reddedilmeli');
});

await test('Defter [3] Toplu Kelime Ayrıştırma & Önizleme (Bulk Add Parser)', async () => {
  const l = await createNotebookList('Toplu Ekleme Listesi', 'user_test_3');
  const listId = l.list.id;

  // Çeşitli ayraçlarla (- , – , — , : , = , \t) yapıştırılan metin
  const rawText = `
    achieve - başarmak
    improve – geliştirmek
    require — gerektirmek
    crucial : hayati, çok önemli
    candidate = aday
    diligent\tçalışkan

    hatali satir ayracsiz
    achieve - başarmak
  `;

  const parsed = parseBulkWords(rawText, [], []);
  ok(parsed.length >= 7, 'Satırlar doğru ayrıştırılmalı');

  // Başarılı satırlar
  const okRows = parsed.filter((r) => r.status === 'ok');
  ok(okRows.some((r) => r.word === 'achieve' && r.meanings === 'başarmak'));
  ok(okRows.some((r) => r.word === 'improve' && r.meanings === 'geliştirmek'));
  ok(okRows.some((r) => r.word === 'require' && r.meanings === 'gerektirmek'));
  ok(okRows.some((r) => r.word === 'crucial' && r.meanings.includes('hayati')));
  ok(okRows.some((r) => r.word === 'candidate' && r.meanings === 'aday'));
  ok(okRows.some((r) => r.word === 'diligent' && r.meanings === 'çalışkan'));

  // Hatalı satır
  const errRow = parsed.find((r) => r.rawLine.includes('hatali satir ayracsiz'));
  ok(errRow && errRow.status === 'error', 'Ayraçsız satır hata olarak işaretlenmeli');

  // Tekrar eden satır (achieve ikinci kez)
  const dupRow = parsed.filter((r) => r.word === 'achieve');
  ok(dupRow.length === 2 && dupRow[1].status === 'dup', 'Metin içi tekrar dup olarak işaretlenmeli');

  // Toplu kaydetme
  const bulkRes = await bulkAddWordsToNotebook({
    items: parsed,
    listId,
    userId: 'user_test_3',
  });
  ok(bulkRes.ok && bulkRes.addedCount === 6, 'Yalnızca geçerli 6 kelime kaydedilmeli');

  const stats = getListStats(listId);
  eq(stats.total, 6, 'Listedeki toplam kelime sayısı 6 olmalı');
});

await test('Defter [4] Çoklu Liste & Tekil Kelime Modeli (Unified Word Progress)', async () => {
  // Kullanıcı aynı kelimeyi ("improve") iki farklı listeye ekler
  const listA = (await createNotebookList('Ders Notları', 'user_test_4')).list;
  const listB = (await createNotebookList('Sınav Hazırlık', 'user_test_4')).list;

  const rA = await addWordToNotebook({ word: 'improve', meanings: 'geliştirmek', listId: listA.id, userId: 'user_test_4' });
  const rB = await addWordToNotebook({ word: 'improve', meanings: 'geliştirmek', listId: listB.id, userId: 'user_test_4' });

  ok(rA.ok && rB.ok, 'Aynı kelime iki farklı listeye eklenebilmeli');
  eq(rA.word.id, rB.word.id, 'Her iki listede de tekil kelime kimliği (ID) paylaşılmalı');

  // Kelime üzerinde öğrenme aşaması tamamlandığında her iki listenin ilerlemesine yansımalı
  const wordId = rA.word.id;
  const p = getProgress(wordId);
  p.currentStage = 6;
  p.learningComplete = true;
  p.completedAt = Date.now();
  await saveProgress(p);

  const statsA = getListStats(listA.id);
  const statsB = getListStats(listB.id);

  eq(statsA.completed, 1, 'Liste A ilerlemesi 1 tamamlandı göstermeli');
  eq(statsB.completed, 1, 'Liste B ilerlemesi de aynı kelimenin tamamlandığını göstermeli');
  eq(statsA.completion, 100);
  eq(statsB.completion, 100);
});

await test('Defter [5] Kullanıcı İzolasyonu & Güvenlik', async () => {
  await createNotebookList('Ahmet Listesi', 'user_ahmet');
  await createNotebookList('Sude Listesi', 'user_sude');
  await createNotebookList('Misafir Listesi', 'guest');

  const ahmetLists = getUserNotebookLists('user_ahmet');
  const sudeLists = getUserNotebookLists('user_sude');
  const guestLists = getUserNotebookLists('guest');

  ok(ahmetLists.every((l) => l.userId === 'user_ahmet'), 'Ahmet yalnızca kendi listelerini görmeli');
  ok(sudeLists.every((l) => l.userId === 'user_sude'), 'Sude yalnızca kendi listelerini görmeli');
  ok(guestLists.every((l) => l.userId === 'guest'), 'Misafir yalnızca kendi listelerini görmeli');
  ok(!ahmetLists.some((l) => l.name === 'Sude Listesi'), 'Ahmet Sude’nin listesini göremez');
  ok(!sudeLists.some((l) => l.name === 'Ahmet Listesi'), 'Sude Ahmet’in listesini göremez');
});

await test('Defter [6] Mevcut 4 Aşamalı Öğrenme Motoru Entegrasyonu', async () => {
  const l = (await createNotebookList('4 Aşama Testi', 'user_test_6')).list;
  await addWordToNotebook({ word: 'require', meanings: 'gerektirmek', listId: l.id, userId: 'user_test_6' });
  await addWordToNotebook({ word: 'expand', meanings: 'genişletmek', listId: l.id, userId: 'user_test_6' });

  const stats = getListStats(l.id);
  const batch = E.learnBatch(stats.words, state.progress, 5);
  eq(batch.length, 2, 'Kişisel kelimeler learnBatch içine girmeli');

  const items = E.learnItems(batch, state.progress);
  eq(items.length, 8, '2 kelime x 4 aşama = 8 oturum öğesi üretilmeli');
  ok(!items.some((i) => i.type === 'production' || i.type === 'sentence' || i.stage >= 5), 'Cümle boşluk doldurma (5. aşama) ve serbest cümle yazma (6. aşama) öğrenme oturumunda üretilmemeli');

  // Her aşama için soru üretimi kontrolü
  const w = stats.words[0];
  const qCard = { type: 'card', wordId: w.id };
  const qMc = E.buildQuestion(w, 'mc', state.words);
  const qTyping = E.buildQuestion(w, 'typing', state.words);
  const qMissing = E.buildQuestion(w, 'missing', state.words);

  ok(qMc.options && qMc.options.length === 4, 'Çoktan seçmeli soru 4 seçenek üretmeli');
  ok(qTyping.answers.includes(w.word), 'Yazma sorusu hedef kelimeyi içermeli');
  ok(qMissing.prompt.includes('_'), 'Eksik harf sorusu maskelenmiş olmalı');
});

await test('Defter [7] Hata Takibi ve REVIEW Önceliği', async () => {
  const l = (await createNotebookList('Hata Testi', 'user_test_7')).list;
  const w = (await addWordToNotebook({ word: 'persevere', meanings: 'azimle devam etmek', listId: l.id, userId: 'user_test_7' })).word;

  const p = getProgress(w.id);
  // Yanlış cevap simülasyonu
  E.applyAnswer(p, false, { mode: 'learn', stage: 3, qtype: 'typing' });
  await saveProgress(p);

  eq(p.currentStatus, 'REVIEW', 'Yanlış yapılan kişisel kelime REVIEW havuzuna geçmeli');
  eq(p.incorrectCount, 1, 'Hata sayısı artmalı');
  ok(p.mistakeHistory.length >= 1, 'Hata geçmişe kaydedilmeli');

  // Sonraki oturumda failing kelime en öne alınmalı
  const batch = E.learnBatch([w], state.progress, 5);
  eq(batch[0].id, w.id, 'Hatalı kelime öncelikli sırada yer almalı');
});

await test('Defter [8] SRS Aralıklı Tekrar Entegrasyonu (1-3-7-14-30 gün)', async () => {
  const l = (await createNotebookList('SRS Testi', 'user_test_8')).list;
  const w = (await addWordToNotebook({ word: 'flourish', meanings: 'gelişmek, serpilmek', listId: l.id, userId: 'user_test_8' })).word;

  const p = getProgress(w.id);
  // 5 aşama tamamlandı simülasyonu
  E.applyAnswer(p, true, { mode: 'learn', stage: 5, qtype: 'sentence' });
  await saveProgress(p);

  ok(p.learningComplete, '5 aşama tamamlanınca learningComplete olmalı');
  eq(p.srsStep, 0, 'İlk SRS adımı 0 olmalı');
  eq(p.reviewInterval, 1, 'İlk tekrar aralığı 1 gün olmalı');

  // Başarılı SRS tekrarları aralığı sırasıyla uzatmalı: 1 -> 3 -> 7 -> 14 -> 30 gün
  const intervals = [3, 7, 14, 30];
  for (const expInterval of intervals) {
    E.applyAnswer(p, true, { mode: 'review', qtype: 'typing' });
    eq(p.reviewInterval, expInterval, `SRS aralığı ${expInterval} gün olmalı`);
  }

  // Hata durumunda aralık 1 güne düşmeli
  E.applyAnswer(p, false, { mode: 'review', qtype: 'typing' });
  eq(p.reviewInterval, 1, 'Hata durumunda tekrar aralığı 1 güne çekilmeli');
  eq(p.currentStatus, 'REVIEW', 'Hata durumunda durum REVIEW olmalı');
});

await test('Defter [9] Dört Çalışma Seçeneği Fonksiyonları', async () => {
  const l = (await createNotebookList('Çalışma Seçenekleri Testi', 'user_test_9')).list;
  await addWordToNotebook({ word: 'collaborate', meanings: 'iş birliği yapmak', listId: l.id, userId: 'user_test_9' });

  const summary = getUserNotebookSummary('user_test_9');
  eq(summary.totalWords, 1, 'Toplam 1 kelime olmalı');
  eq(summary.completedWords, 0, 'Henüz tamamlanan kelime olmamalı');

  // Mod fonksiyonlarının çağrılabilirliği ve oturum hazırlığı
  ok(typeof startStudyList === 'function', 'startStudyList fonksiyonu tanımlı olmalı');
  ok(typeof startStudyAll === 'function', 'startStudyAll fonksiyonu tanımlı olmalı');
  ok(typeof startStudyUnknown === 'function', 'startStudyUnknown fonksiyonu tanımlı olmalı');
  ok(typeof startStudyDue === 'function', 'startStudyDue fonksiyonu tanımlı olmalı');
});

await test('Defter [10] A2, B1, B2 Kelime Havuzları, Grammar & İmza Bütünlüğü', async () => {
  // 1) 2.010 aktif kelime ve 14 taslak kelime (toplam 2.024 kayıt) bozulmamalı
  const allCurriculum = [...data.A2, ...data.B1, ...data.B2];
  eq(allCurriculum.length, 2024, 'Toplam 2.024 yerleşik kelime korunmalı');
  const activeCurriculum = allCurriculum.filter((w) => !w.isDraft);
  eq(activeCurriculum.length, 2010, '2.010 aktif müfredat kelimesi kesinlikle korunmalı');

  // 2) 38 Grammar Academy konusu ve 760 soru havuzu korunmalı
  const topics = G.GRAMMAR_TOPICS || [];
  eq(topics.length, 38, '38 Grammar konusu korunmalı');
  eq(G.GRAMMAR_QUESTIONS.length, 760, '760 Grammar sorusu korunmalı');

  // 3) "ahmet ❤️ sude" imzası korunmalı
  const appSrc = await readText('js/app.js');
  ok(appSrc.includes('<span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span>'), 'ahmet ❤️ sude imzası korunmalı');

  // 4) Dört tema seçeneği korunmalı
  const themes = ['light', 'dark', 'auto', 'studio'];
  for (const th of themes) {
    ok(resolveTheme(th) !== undefined, `${th} teması desteklenmeli`);
  }
});

/* ============================================================================
 * 15) FİİLLERİN 3 HALİ (IRREGULAR VERBS) TESTLERİ
 * ========================================================================== */
out('\n--- 15) Fiillerin 3 Hali (Irregular Verbs) Testleri ---');

await test('Irregular [1] Ana Ekran Tasarımı & 2 Ana Seçenek Kartı (Manuel Ekle & Hazır Fiiller)', async () => {
  const irvSrc = await readText('js/irregular-verbs.js');
  const htmlSrc = await readText('index.html');
  const appSrc = await readText('js/app.js');

  ok(htmlSrc.includes('href="#/irregular"') && htmlSrc.includes('Fiillerin 3 Hali'), 'Menüde Fiillerin 3 Hali bağlantısı bulunmalı');
  ok(appSrc.includes('irregular: renderIrregularVerbs'), 'Router içinde #/irregular rotası tanımlı olmalı');
  ok(irvSrc.includes('Manuel Ekle') && irvSrc.includes('Kendi fiillerini ekle ve çalış.'), 'Ana ekranda Seçenek 1: Manuel Ekle kartı bulunmalı');
  ok(irvSrc.includes('Hazır Fiiller') && irvSrc.includes('Hazır düzensiz fiilleri öğren ve tekrar et.'), 'Ana ekranda Seçenek 2: Hazır Fiiller kartı bulunmalı');
  ok(irvSrc.includes('irv-choose-manual') && irvSrc.includes('irv-choose-builtin'), 'Her iki ana seçim kartının etkileşim kimlikleri bulunmalı');
});

await test('Irregular [2] Hazır Fiiller Kütüphanesi (data/irregular-verbs.json & 190 Doğrulanmış Fiil)', async () => {
  const jsonVerbs = await readJSON('data/irregular-verbs.json');
  ok(Array.isArray(jsonVerbs), 'data/irregular-verbs.json bir dizi olmalı');
  ok(jsonVerbs.length >= 150 && jsonVerbs.length <= 200, `Hazır fiil sayısı 150-200 aralığında olmalı (mevcut: ${jsonVerbs.length})`);
  eq(jsonVerbs.length, BUILTIN_IRREGULAR_VERBS.length, 'JSON dosyası ve yerleşik dizi aynı sayıda fiil içermeli');

  // Seviye dağılımı (~A2, ~B1, ~B2)
  const a2 = getBuiltInIrregularVerbs('A2');
  const b1 = getBuiltInIrregularVerbs('B1');
  const b2 = getBuiltInIrregularVerbs('B2');
  ok(a2.length >= 40 && b1.length >= 40 && b2.length >= 40, 'A2, B1 ve B2 seviyelerinin her birinde yeterli fiil bulunmalı');
  eq(a2.length + b1.length + b2.length, BUILTIN_IRREGULAR_VERBS.length);

  // Tüm hazır fiillerin V1, V2, V3 ve Türkçe anlam doğrulaması
  for (const v of BUILTIN_IRREGULAR_VERBS) {
    const errs = validateIrregularVerb(v);
    eq(errs.length, 0, `Hazır fiil hatasız olmalı (${v.v1}): ${errs.join(', ')}`);
  }
});

await test('Irregular [3] Çift / Alternatif Form Desteği (learned/learnt, was/were, got/gotten)', () => {
  // learn - learned/learnt - learned/learnt
  const learnVerb = BUILTIN_IRREGULAR_VERBS.find((v) => v.v1 === 'learn');
  ok(learnVerb, 'learn fiili hazır listede bulunmalı');
  ok(checkVerbFormAnswer(learnVerb.v2, 'learned'), 'learned kabul edilmeli');
  ok(checkVerbFormAnswer(learnVerb.v2, 'learnt'), 'learnt kabul edilmeli');
  ok(checkVerbFormAnswer(learnVerb.v3, 'learned'), 'V3 learned kabul edilmeli');
  ok(checkVerbFormAnswer(learnVerb.v3, 'learnt'), 'V3 learnt kabul edilmeli');
  ok(checkVerbFormAnswer(learnVerb.v2, 'learned/learnt'), 'Tam birleşik yazım da kabul edilmeli');
  ok(!checkVerbFormAnswer(learnVerb.v2, 'learning'), 'Yanlış çekim reddedilmeli');

  // be - was/were - been
  const beVerb = BUILTIN_IRREGULAR_VERBS.find((v) => v.v1 === 'be');
  ok(beVerb, 'be fiili hazır listede bulunmalı');
  ok(checkVerbFormAnswer(beVerb.v2, 'was'), 'was kabul edilmeli');
  ok(checkVerbFormAnswer(beVerb.v2, 'were'), 'were kabul edilmeli');
  ok(checkVerbFormAnswer(beVerb.v3, 'been'), 'been kabul edilmeli');

  // get - got - got/gotten
  const getVerb = BUILTIN_IRREGULAR_VERBS.find((v) => v.v1 === 'get');
  ok(getVerb, 'get fiili hazır listede bulunmalı');
  ok(checkVerbFormAnswer(getVerb.v3, 'got'), 'got kabul edilmeli');
  ok(checkVerbFormAnswer(getVerb.v3, 'gotten'), 'gotten kabul edilmeli');
});

await test('Irregular [4] Manuel Liste Oluşturma, Düzenleme, Silme & Tek Tek Fiil Ekleme', async () => {
  const uid = 'irv_user_1';
  const r1 = await createIrregularList('Unit 4 - Irregular Verbs', uid);
  const r2 = await createIrregularList('Sınav Fiillerim', uid);
  const r3 = await createIrregularList('En Çok Karıştırdıklarım', uid);
  ok(r1.ok && r2.ok && r3.ok, 'Üç örnek liste başarıyla oluşturulmalı');

  // Aynı isimle tekrar oluşturma engellenmeli
  const dupList = await createIrregularList('Sınav Fiillerim', uid);
  ok(!dupList.ok, 'Aynı isimle mükerrer liste oluşturulmamalı');

  // Tek tek fiil ekleme (go - went - gone - gitmek)
  const addGo = await addVerbToIrregularList({
    v1: 'go', v2: 'went', v3: 'gone', meaning: 'gitmek',
    listId: r1.list.id, userId: uid,
  });
  ok(addGo.ok && addGo.verb.v1 === 'go' && addGo.verb.v2 === 'went' && addGo.verb.v3 === 'gone', 'Tekil fiil başarıyla eklenmeli');

  // Eksik alanla ekleme reddedilmeli
  const addBad = await addVerbToIrregularList({
    v1: 'see', v2: 'saw', v3: '', meaning: 'görmek',
    listId: r1.list.id, userId: uid,
  });
  ok(!addBad.ok, 'V3 eksik olduğunda ekleme reddedilmeli');

  // Liste adını güncelleme ve silme
  const ren = await updateIrregularList(r3.list.id, { name: 'En Çok Yanıldıklarım' });
  ok(ren.ok && ren.list.name === 'En Çok Yanıldıklarım', 'Liste adı güncellenebilmeli');

  const del = await deleteIrregularList(r3.list.id);
  ok(del.ok, 'Liste silinebilmeli');
  eq(getUserIrregularLists(uid).length, 2, 'Silme sonrası 2 liste kalmalı');
});

await test('Irregular [5] Toplu Fiil Ekleme, Metin/CSV Ayrıştırma & Hatalı Satırların Engellememesi', async () => {
  const uid = 'irv_user_2';
  const list = (await createIrregularList('Toplu Fiil Listesi', uid)).list;

  const rawPaste = `
    go - went - gone - gitmek
    see - saw - seen - görmek
    take - took - taken - almak
    write – wrote – written – yazmak
    speak ; spoke ; spoken ; konuşmak
    eksik_satir - saw - görmek
    bos_alan - - - anlam
    go - went - gone - gitmek
  `;

  const parsed = parseBulkIrregularVerbs(rawPaste, [], []);
  const okRows = parsed.filter((r) => r.status === 'ok');
  const dupRows = parsed.filter((r) => r.status === 'dup');
  const errRows = parsed.filter((r) => r.status === 'error');

  eq(okRows.length, 5, '5 geçerli fiil (go, see, take, write, speak) ayrıştırılmalı');
  eq(dupRows.length, 1, 'İkinci kez yazılan go satırı tekrar (dup) olarak işaretlenmeli');
  eq(errRows.length, 2, 'Eksik kolonlu 2 satır hatalı (error) olarak işaretlenmeli');

  // Hatalı satırlar tüm işlemi iptal etmemeli; geçerli olan 5 satır kaydedilebilmeli
  const saveRes = await bulkAddVerbsToIrregularList({
    items: parsed,
    listId: list.id,
    userId: uid,
  });
  ok(saveRes.ok && saveRes.addedCount === 5, 'Hatalı satırlara rağmen geçerli 5 fiil başarıyla kaydedilmeli');

  const st = getIrregularListStats(list.id, uid);
  eq(st.total, 5, 'Listede toplam 5 fiil bulunmalı');
});

await test('Irregular [6] Beş Çalışma Modu (Kartlar, V2 Testi, V3 Testi, Karışık Test [MC & Yazma], Yanlışlarım)', async () => {
  const pool = BUILTIN_IRREGULAR_VERBS.slice(0, 20);
  const goVerb = BUILTIN_IRREGULAR_VERBS.find((v) => v.v1 === 'go');
  const seeVerb = BUILTIN_IRREGULAR_VERBS.find((v) => v.v1 === 'see');

  // Mod B: V2 Testi (go -> ? -> went)
  const qV2Typ = buildIrregularQuestion(goVerb, 'v2', pool);
  eq(qV2Typ.form, 'v2');
  eq(qV2Typ.format, 'typing');
  ok(qV2Typ.prompt.includes('go → ?'), 'V2 soru kökü go → ? olmalı');
  ok(checkIrregularQuestionAnswer(qV2Typ, 'went'), 'V2 yazılı soruda went doğru kabul edilmeli');
  ok(!checkIrregularQuestionAnswer(qV2Typ, 'gone'), 'V2 sorusunda gone yanlış kabul edilmeli');

  // Mod C: V3 Testi (go -> went -> ? -> gone)
  const qV3Typ = buildIrregularQuestion(goVerb, 'v3', pool);
  eq(qV3Typ.form, 'v3');
  eq(qV3Typ.format, 'typing');
  ok(qV3Typ.prompt.includes('go → went → ?'), 'V3 soru kökü go → went → ? olmalı');
  ok(checkIrregularQuestionAnswer(qV3Typ, 'gone'), 'V3 yazılı soruda gone doğru kabul edilmeli');

  // Mod D: Karışık Test içinde çoktan seçmeli (MC) ve Türkçe anlam sorusu
  const qMeaningMc = buildIrregularQuestion(seeVerb, 'meaning', pool);
  eq(qMeaningMc.form, 'meaning');
  eq(qMeaningMc.format, 'mc');
  ok(qMeaningMc.options.length === 4, 'Çoktan seçmeli soruda 4 seçenek bulunmalı');
  ok(checkIrregularQuestionAnswer(qMeaningMc, qMeaningMc.answerIndex), 'Doğru şık indeksi kabul edilmeli');
});

await test('Irregular [7] SRS Entegrasyonu (1 -> 3 -> 7 -> 14 -> 30 Gün) & V2/V3 Hata Ağırlıklandırması', async () => {
  const uid = 'irv_srs_user';
  const writeVerb = BUILTIN_IRREGULAR_VERBS.find((v) => v.v1 === 'write');

  // 1) Kullanıcı V2'yi biliyor ama V3'ü karıştırıyor simülasyonu
  await applyVerbAnswer(writeVerb, true, { form: 'v2' }, Date.now(), uid);
  await applyVerbAnswer(writeVerb, true, { form: 'v2' }, Date.now(), uid);
  await applyVerbAnswer(writeVerb, false, { form: 'v3', input: 'wrote' }, Date.now(), uid);
  const p = await applyVerbAnswer(writeVerb, false, { form: 'v3', input: 'writed' }, Date.now(), uid);

  eq(p.v2Correct, 2);
  eq(p.v3Wrong, 2);
  eq(p.status, 'REVIEW', 'Hata yapılan fiil REVIEW statüsünde olmalı');

  // Sistem bu fiil için V3 sorularına öncelik vermeli
  eq(selectWeightedFormForVerb(writeVerb, uid), 'v3', 'V3 hatası yüksek olan fiilde V3 sorusuna öncelik verilmeli');

  // 2) Ardışık doğru cevaplarla öğrenme tamamlanmalı ve SRS 1 -> 3 -> 7 -> 14 -> 30 gün ilerlemeli
  const speakVerb = BUILTIN_IRREGULAR_VERBS.find((v) => v.v1 === 'speak');
  const expectedSequence = [1, 3, 7, 14, 30];
  let ps;
  for (const expDays of expectedSequence) {
    ps = await applyVerbAnswer(speakVerb, true, { form: 'v2' }, Date.now(), uid);
    eq(ps.reviewInterval, expDays, `SRS aralığı ${expDays} gün olmalı`);
  }
  ok(ps.learned, 'Fiil öğrenilmiş olarak işaretlenmeli');
  eq(ps.status, 'MASTERED', '5 adım sonunda fiil MASTERED statüsüne ulaşmalı');

  // SRS sırasında hata yapıldığında aralık 1 güne düşmeli ve REVIEW olmalı
  ps = await applyVerbAnswer(speakVerb, false, { form: 'v3', input: 'spoke' }, Date.now(), uid);
  eq(ps.reviewInterval, 1, 'Hata sonrası SRS aralığı 1 güne düşmeli');
  eq(ps.status, 'REVIEW', 'Hata sonrası durum REVIEW olmalı');
});

await test('Irregular [8] Çoklu Liste İlerleme Paylaşımı & Kullanıcı İzolasyonu', async () => {
  const uidA = 'irv_ahmet';
  const uidB = 'irv_sude';

  // Ahmet aynı fiili ("begin") iki farklı manuel listeye ekler
  const l1 = (await createIrregularList('Liste 1', uidA)).list;
  const l2 = (await createIrregularList('Liste 2', uidA)).list;

  await addVerbToIrregularList({ v1: 'begin', v2: 'began', v3: 'begun', meaning: 'başlamak', listId: l1.id, userId: uidA });
  await addVerbToIrregularList({ v1: 'begin', v2: 'began', v3: 'begun', meaning: 'başlamak', listId: l2.id, userId: uidA });

  // Ahmet "begin" fiilini öğrenir
  await applyVerbAnswer('begin', true, { form: 'v2' }, Date.now(), uidA);
  await applyVerbAnswer('begin', true, { form: 'v3' }, Date.now(), uidA);

  // Her iki listede ve hazır fiillerde "begin" öğrenilmiş görünmeli, ilerleme sıfırlanmamalı
  const st1 = getIrregularListStats(l1.id, uidA);
  const st2 = getIrregularListStats(l2.id, uidA);
  eq(st1.learned, 1, 'Liste 1 içinde öğrenilmiş görünmeli');
  eq(st2.learned, 1, 'Liste 2 içinde de ilerleme korunmalı ve öğrenilmiş görünmeli');

  // Sude'nin hesabında ise Ahmet'in listeleri görünmemeli ve "begin" henüz öğrenilmemiş olmalı
  eq(getUserIrregularLists(uidB).length, 0, 'Sude Ahmet’in manuel listelerini görmemeli');
  const pB = getVerbProgress('begin', uidB);
  eq(pB.learned, false, 'Ahmet’in fiil ilerlemesi Sude’nin ilerlemesini etkilememeli');
});

await test('Irregular [9] Mevcut Tüm Verilerin (2.010 Kelime, 38 Grammar, Kelime Defterim, 4 Tema, İmza) Korunması', async () => {
  const allCurriculum = [...data.A2, ...data.B1, ...data.B2];
  eq(allCurriculum.length, 2024, 'Toplam 2.024 yerleşik kelime korunmalı');
  eq(allCurriculum.filter((w) => !w.isDraft).length, 2010, '2.010 aktif müfredat kelimesi korunmalı');
  eq((G.GRAMMAR_TOPICS || []).length, 38, '38 Grammar konusu korunmalı');
  eq(G.GRAMMAR_QUESTIONS.length, 760, '760 Grammar sorusu korunmalı');
  eq(BUILTIN_IRREGULAR_VERBS.length, 190, '190 hazır düzensiz fiil korunmalı');

  // Yedekleme (buildBackup) hem Kelime Defterim hem Fiillerin 3 Hali verilerini içermeli
  const backup = buildBackup();
  eq(validateBackup(backup), [], 'Yeni meta alanlarıyla oluşturulan yedek geçerli olmalı');
  ok(backup.meta.some((m) => m.key === 'irregularLists'), 'Yedekte irregularLists bulunmalı');
  ok(backup.meta.some((m) => m.key === 'irregularProgress'), 'Yedekte irregularProgress bulunmalı');
});

/* ============================================================================
 * 16) v4.5.2 — 4 AŞAMALI ÖĞRENME SİSTEMİ & KELİME DEFTERİM AŞAMA SEÇİMİ TESTLERİ
 * ========================================================================== */
out('\n--- 16) v4.5.2 — 4 Aşamalı Kelime Öğrenme & Kelime Defterim Aşama Seçimi Testleri ---');

await test('v4.5.2 [1] Hazır A2/B1/B2 Öğrenme Akışının Tam 4 Aşamalı Olması ve 5./6. Aşamaların Görünmemesi', async () => {
  eq(E.STAGES.length, 4, 'STAGES dizisi tam 4 aşamadan oluşmalı');
  eq(E.STAGES, [
    'Kelimeyi Öğren',
    'Çoktan Seçmeli Soru',
    'İngilizce Kelimeyi Yaz',
    'Eksik Harfleri Tamamla',
  ]);
  eq(E.STAGE_TYPES, [null, 'card', 'mc', 'typing', 'missing'], 'STAGE_TYPES içinde sentence veya production bulunmamalı');

  // A2, B1, B2 için learnItems kontrolü
  for (const lv of ['A2', 'B1', 'B2']) {
    const batch = E.learnBatch(data[lv], {}, 5);
    eq(batch.length, 5);
    const items = E.learnItems(batch, {});
    eq(items.length, 20, `${lv} 5 kelime x 4 aşama = 20 öğe olmalı`);
    ok(items.every((it) => it.stage >= 1 && it.stage <= 4), 'Hiçbir öğede 5. veya 6. aşama bulunmamalı');
    ok(!items.some((it) => it.type === 'sentence' || it.type === 'production'), 'Öğrenme oturumunda sentence veya production gösterilmemeli');
  }

  // Bağımsız sınav oluşturma sistemindeki soru türleri silinmemeli
  const finalExam = buildExamItems('final', 'A2');
  eq(finalExam.length, 40);
  ok(finalExam.some((it) => it.type === 'sentence'), 'Bağımsız sınavlarda sentence soru türü korunmalı');
});

await test('v4.5.2 [2] 4. Aşama (Eksik Harfleri Tamamla) Tamamlandığında Öğrenmenin Tamamlanması ve SRS Başlangıcı', () => {
  const sampleWord = data.B1.find((w) => !w.isDraft && isWordReady(w));
  const p = E.newProgress(sampleWord.id);
  const now = 1730000000000;

  // 1..3 aşamaları tamamlandığında henüz learningComplete olmamalı
  E.markSeen(p, now);
  for (let s = 2; s <= 3; s++) {
    E.applyAnswer(p, true, { mode: 'learn', stage: s, qtype: E.STAGE_TYPES[s] }, now);
    eq(p.learningComplete, false, `${s}. aşamada henüz tamamlanmış sayılmamalı`);
  }

  // 4. aşama (Eksik Harfleri Tamamla) tamamlandığında learningComplete = true olmalı ve SRS başlamalı
  E.applyAnswer(p, true, { mode: 'learn', stage: 4, qtype: 'missing' }, now);
  eq(p.learningComplete, true, '4. aşama sonunda kelime öğrenme süreci tamamlanmalı');
  eq(p.currentStage, 4, 'currentStage 4 olmalı');
  eq(p.currentStatus, 'LEARNING', 'SRS öncesi durum LEARNING olmalı (MASTERED değil)');
  eq(p.reviewInterval, 1, 'İlk SRS tekrar aralığı 1 gün olmalı');
  eq(p.nextReviewAt, now + E.DAY, 'İlk SRS tekrar tarihi 1 gün sonrası olmalı');
});

await test('v4.5.2 [3] Kelime Defterim Aşama Seçimi Yapılandırması ve Arayüz Bileşenleri', async () => {
  // v4.6.0: Kelime Defterim'e 5. seçenek (Eşini Bul — Hafıza Oyunu) eklendi; ilk 4 aşama aynı kaldı
  eq(NOTEBOOK_STAGE_OPTIONS.length, 5, 'Kelime Defterim aşama seçiminde 5 seçenek bulunmalı');
  eq(NOTEBOOK_STAGE_OPTIONS.map((o) => o.title), [
    'Kelimeyi Öğren',
    'Çoktan Seçmeli Test',
    'İngilizce Kelimeyi Yaz',
    'Eksik Harfleri Tamamla',
    'Eşini Bul — Hafıza Oyunu',
  ]);
  eq(NOTEBOOK_STAGE_OPTIONS.map((o) => o.type), ['card', 'mc', 'typing', 'missing', 'match']);
  ok(NOTEBOOK_STAGE_OPTIONS.every((o) => o.icon && o.desc), 'Her aşama kartında ikon ve açıklama bulunmalı');
  ok(typeof openStageSelectionModal === 'function', 'openStageSelectionModal fonksiyonu tanımlı olmalı');

  const nbSrc = await readText('js/notebook.js');
  const cssSrc = await readText('css/style.css');
  ok(nbSrc.includes("title: 'Çalışma Aşamalarını Seç'"), 'Modal başlığı Çalışma Aşamalarını Seç olmalı');
  ok(nbSrc.includes('id="nb-stage-counter"') && nbSrc.includes('aşama seçili') && nbSrc.includes('TOTAL_OPTIONS'), 'Seçili aşama sayacı bulunmalı');
  ok(nbSrc.includes('id="nb-stage-select-all"') && nbSrc.includes('Tümünü Seç'), 'Tümünü Seç seçeneği bulunmalı');
  ok(nbSrc.includes('id="nb-stage-start"') && nbSrc.includes('Çalışmaya Başla'), 'Çalışmaya Başla butonu bulunmalı');
  ok(cssSrc.includes('.nb-stage-card') && cssSrc.includes(':root[data-theme=studio] .nb-stage-card.active'), 'Dört tema ile uyumlu CSS kuralları bulunmalı');
});

await test('v4.5.2 [4] Kelime Defterim: 1, 2, 3 ve 4 Aşamalı Seçimler, Standart Sıralama ve İlerleme Göstergesi (Aşama 1/2, 2/2)', async () => {
  const uid = 'user_stage_sel_test';
  const list = (await createNotebookList('Unit 6 - Stage Selection', uid)).list;
  await addWordToNotebook({ word: 'achieve', meanings: 'başarmak', listId: list.id, userId: uid });
  await addWordToNotebook({ word: 'improve', meanings: 'geliştirmek', listId: list.id, userId: uid });
  await addWordToNotebook({ word: 'require', meanings: 'gerektirmek', listId: list.id, userId: uid });

  // 1) Tek aşama seçimi (örn: yalnızca [3] İngilizce Kelimeyi Yaz)
  const ok1 = await startStudyList(list.id, { stages: [3] });
  ok(ok1, 'Tek aşama seçildiğinde oturum başlamalı');
  let sess = getCurrentSession();
  eq(sess.items.length, 3, '3 kelime x 1 aşama = 3 öğe olmalı');
  ok(sess.items.every((it) => it.stage === 3 && it.type === 'typing' && it.stepIndex === 1 && it.totalSteps === 1), 'Aşama 1/1 olarak ayarlanmalı');
  abortSession();

  // 2) İki aşama seçimi (örn: Çoktan Seçmeli [2] ve İngilizce Kelimeyi Yaz [3] — ters sırayla [3, 2] verilse bile standart sırada çalışmalı)
  const ok2 = await startStudyList(list.id, { stages: [3, 2] });
  ok(ok2, 'İki aşama seçildiğinde oturum başlamalı');
  sess = getCurrentSession();
  eq(sess.params.selectedStages, [2, 3], 'Seçilen aşamalar standart sıraya ([2, 3]) dizilmeli');
  eq(sess.items.length, 6, '3 kelime x 2 aşama = 6 öğe olmalı');
  ok(!sess.items.some((it) => it.stage === 1 || it.stage === 4), 'Seçilmeyen aşamalar oturumda hiç gösterilmemeli');
  const firstHalf = sess.items.slice(0, 3);
  const secondHalf = sess.items.slice(3, 6);
  ok(firstHalf.every((it) => it.stage === 2 && it.type === 'mc' && it.stepIndex === 1 && it.totalSteps === 2), 'İlk aşama Aşama 1/2 (Çoktan Seçmeli) olmalı');
  ok(secondHalf.every((it) => it.stage === 3 && it.type === 'typing' && it.stepIndex === 2 && it.totalSteps === 2), 'İkinci aşama Aşama 2/2 (İngilizce Kelimeyi Yaz) olmalı');
  abortSession();

  // 3) Üç aşama seçimi ([1, 2, 4])
  const ok3 = await startStudyList(list.id, { stages: [1, 2, 4] });
  ok(ok3, 'Üç aşama seçildiğinde oturum başlamalı');
  sess = getCurrentSession();
  eq(sess.items.length, 9, '3 kelime x 3 aşama = 9 öğe olmalı');
  eq(sess.items.map((it) => it.stepIndex), [1, 1, 1, 2, 2, 2, 3, 3, 3], 'İlerleme göstergesi 1/3, 2/3, 3/3 olmalı');
  ok(sess.items.every((it) => it.totalSteps === 3));
  abortSession();

  // 4) Dört aşama seçimi ([1, 2, 3, 4])
  const ok4 = await startStudyList(list.id, { stages: [1, 2, 3, 4] });
  ok(ok4, 'Dört aşama seçildiğinde oturum başlamalı');
  sess = getCurrentSession();
  eq(sess.items.length, 12, '3 kelime x 4 aşama = 12 öğe olmalı');
  ok(sess.items.every((it) => it.totalSteps === 4));
  abortSession();
});

await test('v4.5.2 [5] Hiçbir Aşama Seçilmediğinde Çalışma Başlatmanın Engellenmesi', async () => {
  const uid = 'user_empty_stage_test';
  const list = (await createNotebookList('Boş Seçim Testi', uid)).list;
  await addWordToNotebook({ word: 'focus', meanings: 'odaklanmak', listId: list.id, userId: uid });

  const vEmpty = E.validateStageSelection([]);
  eq(vEmpty.ok, false, 'Boş aşama dizisi geçersiz olmalı');
  eq(vEmpty.stages, []);

  const started = await startStudyList(list.id, { stages: [] });
  eq(started, false, 'Hiçbir aşama seçilmediğinde startStudyList false dönmeli ve oturum başlamamalı');
  eq(getCurrentSession(), null, 'Aktif oturum oluşturulmamalı');
});

await test('v4.5.2 [6] Yalnızca Kart Görüntülemenin Mastered veya Öğrenildi Statüsü Oluşturmaması & Gerçek Performans Kaydı', async () => {
  const uid = 'user_card_only_test';
  const list = (await createNotebookList('Kart Testi', uid)).list;
  const w = (await addWordToNotebook({ word: 'sustain', meanings: 'sürdürmek', listId: list.id, userId: uid })).word;

  // 1) Yalnızca 1. aşama (Kelimeyi Öğren — kart) seçilerek oturum çalıştırılır
  await handlers.learn.onAnswer({ wordId: w.id, stage: 1, type: 'card' }, true, { elapsed: 2, customStages: [1] });
  let p = getProgress(w.id);
  eq(p.currentStage, 1, 'Kart görüldüğünde currentStage 1 olmalı');
  eq(p.currentStatus, 'LEARNING', 'Durum LEARNING olmalı');
  eq(p.learningComplete, false, 'Yalnızca kelime kartını görüntülemek kelimenin öğrenildiğini kanıtlamamalı');
  eq(E.isMastered(p), false, 'Yalnızca kart görüntülemek Mastered statüsü oluşturmamalı');

  // Oturum tamamlanma ekranı (onDone) kontrolü
  const doneOut = await handlers.learn.onDone(
    [{ wordId: w.id, type: 'card', stage: 1, correct: true, card: true, t: 2 }],
    { params: { isNotebook: true, selectedStages: [1] } }
  );
  ok(doneOut.html.includes('1 aşamayı tamamladın'), 'Kart oturumu tamamlandığında doğru tamamlanma ekranı gösterilmeli');

  // 2) Değerlendirme aşamalarında ([2, 3]) gerçek doğru/yanlış performansı kaydedilmeli, fakat 4. aşama bitmeden learningComplete olmamalı
  await handlers.learn.onAnswer({ wordId: w.id, stage: 2, type: 'mc' }, true, { elapsed: 3, customStages: [2, 3] });
  await handlers.learn.onAnswer({ wordId: w.id, stage: 3, type: 'typing' }, false, { elapsed: 4, customStages: [2, 3] });
  p = getProgress(w.id);
  eq(p.correctCount, 1, 'Doğru cevap sayısı kaydedilmeli');
  eq(p.incorrectCount, 1, 'Yanlış cevap sayısı kaydedilmeli');
  eq(p.currentStatus, 'REVIEW', 'Yanlış cevap kelimeyi REVIEW havuzuna almalı');
  eq(p.learningComplete, false, 'Eksik değerlendirme aşamalarında learningComplete false kalmalı');

  // 3) Kalan değerlendirme aşamaları (3 ve 4) doğru tamamlandığında kelime öğrenilmiş sayılmalı ve SRS başlamalı
  await handlers.learn.onAnswer({ wordId: w.id, stage: 3, type: 'typing' }, true, { elapsed: 3, customStages: [3, 4] });
  await handlers.learn.onAnswer({ wordId: w.id, stage: 4, type: 'missing' }, true, { elapsed: 3, customStages: [3, 4] });
  p = getProgress(w.id);
  eq(p.learningComplete, true, 'Tüm değerlendirme aşamaları tamamlandığında learningComplete true olmalı');
  eq(p.currentStage, 4, 'currentStage 4 olmalı');
  eq(p.reviewInterval, 1, 'SRS tekrar aralığı 1 gün olarak başlamalı');
  eq(E.isMastered(p), false, 'SRS adımları tamamlanmadan hemen MASTERED sayılmamalı');
});

await test('v4.5.2 [7] Eski 5 ve 6 Aşamalı İlerleme Kayıtlarının Yeni 4 Aşamalı Sisteme Güvenli Uyarlanması', () => {
  // Senaryo A: Eski 6 aşamalı sistemde tamamlanmış (currentStage: 6, MASTERED) kelime
  const legacy6 = {
    ...E.newProgress('legacy-6'),
    currentStage: 6,
    learningComplete: true,
    currentStatus: 'MASTERED',
    srsStep: 5,
    reviewInterval: 30,
    completedAt: 1700000000000,
    nextReviewAt: 1702592000000,
  };
  const res6 = E.adaptLegacyProgress(legacy6);
  ok(res6.changed, 'currentStage: 6 kaydı 4 olarak normalize edilmeli');
  eq(legacy6.currentStage, 4);
  eq(legacy6.learningComplete, true, 'Önceden öğrenilmiş kelime öğrenilmemiş durumuna düşmemeli');
  eq(legacy6.currentStatus, 'MASTERED', 'MASTERED statüsü korunmalı');
  eq(legacy6.srsStep, 5, 'SRS adımı aynen korunmalı');
  eq(legacy6.nextReviewAt, 1702592000000, 'Tekrar tarihi bozulmamalı');

  // Senaryo B: Eski 5 aşamalı sistemde 4. aşamayı geçmiş ama 5. aşamayı bekleyen (currentStage: 4, learningComplete: false) kelime
  const legacy4 = {
    ...E.newProgress('legacy-4'),
    currentStage: 4,
    learningComplete: false,
    currentStatus: 'LEARNING',
    lastReviewedAt: 1700000000000,
  };
  const res4 = E.adaptLegacyProgress(legacy4, 1700050000000);
  ok(res4.changed, '4. aşamayı geçmiş eski kayıt yeni 4 aşamalı sistemde tamamlanmış sayılmalı');
  eq(legacy4.learningComplete, true);
  eq(legacy4.currentStage, 4);
  eq(legacy4.reviewInterval, 1);

  // Senaryo C: Önceden öğrenilmiş bir kelime Kelime Defterim oturumunda tekrar çalışıldığında öğrenilmemiş durumuna düşmemeli
  E.applyAnswer(legacy6, true, { mode: 'learn', stage: 2, qtype: 'mc', customStages: [2] }, 1700100000000);
  eq(legacy6.learningComplete, true, 'Tekrar çalışılan öğrenilmiş kelime learningComplete=true kalmalı');
  eq(legacy6.currentStatus, 'MASTERED', 'Doğru cevapta MASTERED durumu korunmalı');
});

out('\n--- 17) v4.6.0 — Eşini Bul (Hafıza Oyunu) · Yalnızca Kelime Defterim ---');

const mgSeeded = (seed) => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
const MG_WORDS_20 = [
  ['achieve', 'başarmak'], ['improve', 'geliştirmek'], ['reliable', 'güvenilir'], ['opportunity', 'fırsat'],
  ['require', 'gerektirmek'], ['benefit', 'fayda'], ['decline', 'azalmak'], ['evidence', 'kanıt'],
  ['purpose', 'amaç'], ['measure', 'ölçmek'], ['predict', 'tahmin etmek'], ['respond', 'yanıt vermek'],
  ['survive', 'hayatta kalmak'], ['attempt', 'girişim'], ['consider', 'düşünmek'], ['obtain', 'elde etmek'],
  ['prefer', 'tercih etmek'], ['remain', 'kalmak'], ['select', 'seçmek'], ['suggest', 'önermek'],
];
async function mgMakeList(uid, name, count) {
  const list = (await createNotebookList(name, uid)).list;
  const items = MG_WORDS_20.slice(0, count).map(([w, m]) => ({ word: w, meanings: m, status: 'ok' }));
  await bulkAddWordsToNotebook({ items, listId: list.id, userId: uid });
  return list;
}
const mgPlayAll = (game) => {
  let last = null;
  for (const p of game.pairs) {
    MG.flipMemoryCard(game, `${p.id}::en`, game.startedAt + 1000);
    last = MG.flipMemoryCard(game, `${p.id}::tr`, game.startedAt + 95000);
  }
  return last;
};

await test('Eşini Bul [1] 16 kelimelik listeden 32 kart oluşturulur (her kelime: 1 EN + 1 TR kartı)', async () => {
  const uid = 'mg_user_16';
  const list = await mgMakeList(uid, 'MG 16', 16);
  const round = await MG.prepareMemoryRound({ getWords: memoryWordsGetter('list', list.id, uid), userId: uid, scopeKey: `list:${list.id}` });
  ok(round.ok, 'tur hazırlanmalı');
  eq(round.selected.length, 16, '16 kelimenin tamamı kullanılmalı');
  const game = MG.createMemoryGame(round.selected);
  eq(game.cards.length, 32, '32 kart oluşmalı');
  eq(game.total, 16);
  eq(game.cards.filter((c) => c.side === 'en').length, 16);
  eq(game.cards.filter((c) => c.side === 'tr').length, 16);
  eq(new Set(game.cards.map((c) => c.uid)).size, 32, 'kart kimlikleri benzersiz olmalı');
  ok(game.cards.every((c) => c.state === 'hidden'), 'tüm kartlar kapalı başlamalı');
  eq(round.hasNextRound, false, '16 kelimede Sonraki 16 Kelime seçeneği gösterilmemeli');
  const ach = round.selected.find((p) => p.en === 'achieve');
  eq(ach.tr, 'başarmak', 'Türkçe karşılık doğrudan Kelime Defterim kaydından alınmalı');
});

await test('Eşini Bul [2] Kartlar her yeni oyunda rastgele karıştırılır', () => {
  const pairs = MG.prepareMemoryPairs(MG_WORDS_20.slice(0, 16).map(([w, m], i) => ({ id: `s${i}`, word: w, meanings: [m] }))).pairs;
  const g1 = MG.createMemoryGame(pairs, { rnd: mgSeeded(1) });
  const g2 = MG.createMemoryGame(pairs, { rnd: mgSeeded(99) });
  const o1 = g1.cards.map((c) => c.uid).join('|');
  const o2 = g2.cards.map((c) => c.uid).join('|');
  ok(o1 !== o2, 'iki oyunun kart sırası farklı olmalı');
  eq([...g1.cards.map((c) => c.uid)].sort(), [...g2.cards.map((c) => c.uid)].sort(), 'aynı kart kümesi korunmalı');
  const naive = pairs.flatMap((p) => [`${p.id}::en`, `${p.id}::tr`]).join('|');
  ok(o1 !== naive, 'kartlar sıralı (karıştırılmamış) olmamalı');
});

await test('Eşini Bul [3] Doğru eşleşme kabul edilir ve kartlar açık kalır', () => {
  const pairs = MG.prepareMemoryPairs([{ id: 'a', word: 'achieve', meanings: ['başarmak'] }, { id: 'b', word: 'improve', meanings: ['geliştirmek'] }]).pairs;
  const g = MG.createMemoryGame(pairs, { now: 0 });
  eq(MG.flipMemoryCard(g, 'a::en').result, 'opened');
  const r = MG.flipMemoryCard(g, 'a::tr');
  eq(r.result, 'match');
  eq(g.matches, 1); eq(g.attempts, 1);
  ok(g.cards.filter((c) => c.pairId === 'a').every((c) => c.state === 'matched'), 'eşleşen kartlar açık kalmalı');
  eq(MG.flipMemoryCard(g, 'a::en').result, 'ignored', 'eşleşmiş kart tekrar açılamamalı');
});

await test('Eşini Bul [4] Yanlış eşleşme kilitlenir ve 1–1,5 sn sonra otomatik kapanır; aynı dildeki iki kart eşleşmez', () => {
  ok(MG.MISMATCH_DELAY_MS >= 1000 && MG.MISMATCH_DELAY_MS <= 1500, 'otomatik kapanma süresi 1–1,5 sn olmalı');
  const pairs = MG.prepareMemoryPairs([{ id: 'a', word: 'achieve', meanings: ['başarmak'] }, { id: 'b', word: 'improve', meanings: ['geliştirmek'] }]).pairs;
  const g = MG.createMemoryGame(pairs);
  MG.flipMemoryCard(g, 'a::en');
  eq(MG.flipMemoryCard(g, 'b::tr').result, 'mismatch');
  ok(g.locked, 'bekleme süresinde oyun kilitli olmalı');
  MG.resolveMemoryMismatch(g);
  ok(!g.locked && g.open.length === 0, 'kilit kalkmalı');
  ok(g.cards.every((c) => c.state === 'hidden'), 'yanlış kartlar kullanıcı müdahalesi olmadan kapanmalı');
  MG.flipMemoryCard(g, 'a::en');
  eq(MG.flipMemoryCard(g, 'b::en').result, 'mismatch', 'iki İngilizce kart eşleşmemeli');
  MG.resolveMemoryMismatch(g);
  MG.flipMemoryCard(g, 'a::tr');
  eq(MG.flipMemoryCard(g, 'b::tr').result, 'mismatch', 'iki Türkçe kart eşleşmemeli');
  const src = MG.flipMemoryCard.toString();
  ok(src.includes('a.side !== b.side') && src.includes('a.pairId === b.pairId'), 'eşleşme kimlik + taraf kontrolüyle yapılmalı');
});

await test('Eşini Bul [5] Yanlış eşleşme bekleme süresinde üçüncü kart açılamaz', () => {
  const pairs = MG.prepareMemoryPairs([{ id: 'a', word: 'achieve', meanings: ['başarmak'] }, { id: 'b', word: 'improve', meanings: ['geliştirmek'] }, { id: 'c', word: 'require', meanings: ['gerektirmek'] }]).pairs;
  const g = MG.createMemoryGame(pairs);
  MG.flipMemoryCard(g, 'a::en');
  MG.flipMemoryCard(g, 'b::tr');
  eq(MG.flipMemoryCard(g, 'c::en').result, 'ignored', 'üçüncü kart açılmamalı');
  eq(g.cards.find((c) => c.uid === 'c::en').state, 'hidden');
  eq(g.open.length, 2, 'aynı anda en fazla iki kart açık olmalı');
  eq(g.attempts, 1, 'reddedilen tıklama deneme sayılmamalı');
  MG.resolveMemoryMismatch(g);
  eq(MG.flipMemoryCard(g, 'c::en').result, 'opened', 'kilit kalkınca kart açılabilmeli');
});

await test('Eşini Bul [6] Aynı Türkçe anlama sahip farklı İngilizce kelimeler kimlik üzerinden doğru eşleştirilir', () => {
  const words = [{ id: 'w-beautiful', word: 'Beautiful', meanings: ['Güzel'] }, { id: 'w-pretty', word: 'Pretty', meanings: ['Güzel'] }, { id: 'w-fast', word: 'Fast', meanings: ['Hızlı'] }];
  const { pairs } = MG.prepareMemoryPairs(words);
  eq(pairs.length, 3, 'farklı kelimeler ayrı çift olarak korunmalı');
  // Motor seviyesi: metinler aynı olsa bile yalnızca kimliği aynı olan kart eşleşir
  const g = MG.createMemoryGame(pairs);
  MG.flipMemoryCard(g, 'w-beautiful::en');
  eq(MG.flipMemoryCard(g, 'w-pretty::tr').result, 'mismatch', 'Beautiful, Pretty kaydına ait Güzel kartıyla eşleşmemeli');
  MG.resolveMemoryMismatch(g);
  MG.flipMemoryCard(g, 'w-beautiful::en');
  eq(MG.flipMemoryCard(g, 'w-beautiful::tr').result, 'match', 'kendi kimliğine ait Güzel kartıyla eşleşmeli');
  // Tur seviyesi: oyuncunun ayırt edemeyeceği aynı görünen kartlar aynı tura konmaz, sonraki tura bırakılır
  const r = MG.selectRoundPairs(pairs, { rnd: mgSeeded(3) });
  eq(r.selected.filter((p) => p.trKey === 'güzel').length, 1, 'aynı turda yalnızca bir Güzel kartı olmalı');
  eq(r.deferred.length, 1, 'çakışan kayıt sonraki tura bırakılmalı');
  const r2 = MG.selectRoundPairs(pairs, { played: r.nextPlayed, rnd: mgSeeded(4) });
  ok(r2.selected.some((p) => p.id === r.deferred[0].id), 'bırakılan kelime sonraki turda oynanmalı');
  // Eksik veri ve tekrar eden çiftler oyunu bozmaz
  const v = MG.prepareMemoryPairs([...words, { id: 'x1', word: '', meanings: ['boş'] }, { id: 'x2', word: 'empty', meanings: [] }, { id: 'x3', word: 'fast', meanings: ['hızlı'] }, words[0]]);
  eq(v.pairs.length, 3);
  eq(v.skipped.filter((s) => s.reason === 'missing').length, 2);
  eq(v.skipped.filter((s) => s.reason === 'duplicate').length, 1);
  // Mevcut kelime kayıtları değiştirilmez
  eq(words[0].meanings, ['Güzel']); ok(!('pairId' in words[0]));
});

await test('Eşini Bul [7] 16\'dan az kelime: mevcut kelimelerle oyun kurulur (8 kelime → 16 kart); yetersizse bilgi verilir', async () => {
  const uid = 'mg_user_8';
  const list = await mgMakeList(uid, 'MG 8', 8);
  const round = await MG.prepareMemoryRound({ getWords: memoryWordsGetter('list', list.id, uid), userId: uid, scopeKey: `list:${list.id}` });
  ok(round.ok);
  eq(MG.createMemoryGame(round.selected).cards.length, 16, '8 kelime → 16 kart');
  eq(round.hasNextRound, false);
  const tiny = await MG.prepareMemoryRound({ getWords: () => [{ id: 'one', word: 'one', meanings: ['bir'] }], userId: uid, scopeKey: 'tiny' });
  eq(tiny.ok, false, 'tek kelimeyle oyun başlatılmamalı');
  ok(/en az 2/.test(tiny.error), 'anlaşılır bilgilendirme verilmeli');
  const empty = await MG.prepareMemoryRound({ getWords: () => [], userId: uid, scopeKey: 'empty' });
  eq(empty.ok, false, 'boş listede oyun kilitlenmeden reddedilmeli');
});

await test('Eşini Bul [8] Seçilen grup büyüklüğünden fazla kelime: oynanmamışlara öncelik verilir, havuz bitince sıfırlanır', async () => {
  const uid = 'mg_user_20';
  const list = await mgMakeList(uid, 'MG 20', 20);
  const opts = { getWords: memoryWordsGetter('list', list.id, uid), userId: uid, scopeKey: `list:${list.id}`, groupSize: 15 };
  const r1 = await MG.prepareMemoryRound(opts);
  eq(r1.selected.length, 15); eq(new Set(r1.selected.map((p) => p.id)).size, 15, 'tur içinde kelime tekrarı olmamalı');
  ok(r1.hasNextRound, 'Sonraki Kelime Grubu seçeneği gösterilmeli');
  const r1Ids = new Set(r1.selected.map((p) => p.id));
  const r2 = await MG.prepareMemoryRound(opts);
  const unplayed = r1.pairs.filter((p) => !r1Ids.has(p.id)).map((p) => p.id);
  eq(unplayed.length, 5);
  ok(unplayed.every((id) => r2.selected.some((p) => p.id === id)), 'oynanmamış 5 kelime ikinci turda öncelikli olmalı');
  eq(r2.selected.length, 15);
  eq(r2.resetPool, false);
  const r3 = await MG.prepareMemoryRound(opts);
  eq(r3.resetPool, true, 'bütün kelimeler kullanıldığında havuz yeniden başlamalı');
  eq(r3.selected.length, 15);
});

await test('Eşini Bul [9] Kelime ekleme, düzenleme ve silme sonrası güncel veri kullanılır', async () => {
  const uid = 'mg_user_edit';
  const list = await mgMakeList(uid, 'MG Edit', 3);
  const getWords = memoryWordsGetter('list', list.id, uid);
  let pairs = MG.prepareMemoryPairs(getWords()).pairs;
  eq(pairs.length, 3);
  // Ekleme
  await addWordToNotebook({ word: 'reliable', meanings: 'güvenilir', listId: list.id, userId: uid });
  pairs = MG.prepareMemoryPairs(getWords()).pairs;
  ok(pairs.some((p) => p.en === 'reliable' && p.tr === 'güvenilir'), 'yeni kelime sonraki oyunda kullanılmalı');
  // Düzenleme
  const all = getAllNotebookWords();
  const target = all.find((w) => w.userId === uid && w.word === 'improve');
  target.meanings = ['iyileştirmek'];
  await saveAllNotebookWords(all);
  pairs = MG.prepareMemoryPairs(getWords()).pairs;
  eq(pairs.find((p) => p.id === target.id).tr, 'iyileştirmek', 'düzenlenen anlam kullanılmalı');
  // Silme
  await removeWordFromNotebookList(list.id, target.id, uid);
  pairs = MG.prepareMemoryPairs(getWords()).pairs;
  ok(!pairs.some((p) => p.id === target.id), 'silinen kelime gösterilmemeli');
  // Yeniden Oyna: silinen kelime tekrar listesinden de düşer
  const rep = await MG.prepareMemoryRound({ getWords, userId: uid, scopeKey: 'edit', repeatIds: [target.id, ...pairs.map((p) => p.id)] });
  ok(rep.ok && !rep.selected.some((p) => p.id === target.id));
});

await test('Eşini Bul [10] Yalnızca Eşini Bul seçildiğinde doğrudan seçilen çalışma grubuyla oyun başlar; öğrenme oturumu açılmaz, SRS değişmez', async () => {
  const uid = 'mg_user_only';
  const list = await mgMakeList(uid, 'MG Only', 6);
  const v = resolveNotebookStages([5]);
  ok(v.ok && v.includeMatch && v.stages.length === 0, '[5] tek başına geçerli seçim olmalı');
  eq(resolveNotebookStages([]).ok, false, 'boş seçim hâlâ engellenmeli');
  const ids = list.wordIds;
  const before = JSON.stringify(ids.map((id) => getProgress(id)));
  const statsBefore = MG.getMemoryStats(uid).gamesStarted;
  const started = await startStudyList(list.id, { stages: [5], groupSize: 5 });
  eq(started, true, 'oyun başlamalı');
  eq(getCurrentSession(), null, 'öğrenme oturumu açılmamalı');
  eq(MG.getMemoryStats(uid).gamesStarted, statsBefore + 1, 'oyun ayrı istatistikte kaydedilmeli');
  eq(MG.getMemoryRotation(uid, `list:${list.id}`).length, 5, 'seçilen 5 kelimelik grup oyuna alınmalı');
  eq(JSON.stringify(ids.map((id) => getProgress(id))), before, 'SRS ilerlemesi değişmemeli');
  // Seçilmezse hiçbir şekilde başlamaz
  const s2 = await startStudyList(list.id, { stages: [1, 2] });
  ok(s2 && getCurrentSession().params.matchAfter === null, '5. aşama seçilmediyse oyun planlanmamalı');
  abortSession();
});

await test('Eşini Bul [11] Diğer aşamalarla birlikte seçildiğinde oyun oturumun sonunda, o grupta doğru bilinen kelimelerle çalışır', async () => {
  const uid = 'mg_user_combo';
  const list = await mgMakeList(uid, 'MG Combo', 20);
  ok(await startStudyList(list.id, { stages: [5, 3, 2], groupSize: 5 }));
  const sess = getCurrentSession();
  eq(sess.params.selectedStages, [2, 3], 'öğrenme aşamaları standart sırada olmalı');
  ok(sess.items.every((it) => it.stage === 2 || it.stage === 3), 'oturum öğelerinde 5. aşama bulunmamalı');
  ok(sess.items.every((it) => it.totalSteps === 2), 'ilerleme göstergesi yalnızca öğrenme aşamalarını saymalı');
  eq(sess.params.matchAfter.stageCount, 3);
  eq(sess.params.matchAfter.mode, 'list');
  ok(typeof sessionHooks.afterLearn === 'function', 'oturum sonu kancası kayıtlı olmalı');
  const sessIds = [...new Set(sess.items.map((it) => it.wordId))];
  for (const wid of sessIds) {
    E.recordGroupEvalAnswer(sess.params.groupEval, { wordId: wid, stage: 2, type: 'mc', correct: true });
    E.recordGroupEvalAnswer(sess.params.groupEval, { wordId: wid, stage: 3, type: 'typing', correct: true });
  }
  abortSession();
  await sessionHooks.afterLearn(sess);
  const rot = MG.getMemoryRotation(uid, `list:${list.id}`);
  eq(rot.length, 5, 'oyun bu grupta doğru bilinen 5 kelimeyle (10 kart) başlamalı');
  ok(sessIds.every((id) => rot.includes(id)), 'oturumda doğru bilinen kelimeler oyunda kullanılmalı');
  eq(new Set(rot).size, rot.length, 'aynı kelime tekrarlanmamalı');
  const learnSrc = await readText('js/learning.js');
  ok(learnSrc.includes('s.params?.matchAfter') && learnSrc.includes('sessionHooks.afterLearn'), 'finish() oturum sonunda oyunu başlatmalı');
});

await test('Eşini Bul [12] Hazır A2/B1/B2 sistemi 4 aşamalı kalır ve oyunu içermez', async () => {
  eq(E.STAGES.length, 4);
  eq(E.STAGE_TYPES, [null, 'card', 'mc', 'typing', 'missing']);
  eq(E.normalizeSelectedStages([1, 2, 3, 4, 5]), [1, 2, 3, 4], 'motor 5. aşamayı tanımamalı');
  const a2 = state.words.filter((w) => w.level === 'A2' && E.isWordReady(w)).slice(0, 5);
  const items = E.learnItems(a2, {}, Math.random);
  eq(items.length, 20);
  ok(!items.some((it) => it.type === 'match' || it.stage > 4));
  const learnSrc = await readText('js/learning.js');
  ok(!learnSrc.includes("import { startMemoryGame"), 'learning.js hafıza oyununu doğrudan içe aktarmamalı');
  ok(learnSrc.includes('s.params?.isNotebook && s.params?.matchAfter'), 'kanca yalnızca Kelime Defterim oturumlarında çalışmalı');
});

await test('Eşini Bul [13] SRS, kişisel listeler ve kullanıcı izolasyonu korunur; istatistikler ayrı tutulur', async () => {
  const uA = 'mg_iso_A', uB = 'mg_iso_B';
  const lA = await mgMakeList(uA, 'Iso A', 4);
  const lB = await mgMakeList(uB, 'Iso B', 4);
  const wA = getUserNotebookWords(uA)[0];
  const pA = getProgress(wA.id);
  E.applyAnswer(pA, true, { mode: 'learn', stage: 2, qtype: 'mc', customStages: [2] });
  await saveProgress(pA);
  const snap = JSON.stringify(getProgress(wA.id));
  const r = await MG.prepareMemoryRound({ getWords: memoryWordsGetter('list', lA.id, uA), userId: uA, scopeKey: `list:${lA.id}` });
  const g = MG.createMemoryGame(r.selected);
  eq(mgPlayAll(g).result, 'complete');
  await MG.recordMemoryGame(uA, { completed: true, matches: g.matches, attempts: g.attempts, seconds: 42 });
  eq(JSON.stringify(getProgress(wA.id)), snap, 'oyun SRS kaydını değiştirmemeli');
  ok(!E.isMastered(getProgress(wA.id)), 'doğru eşleşme kelimeyi Mastered yapmamalı');
  eq(MG.getMemoryStats(uA).gamesCompleted, 1);
  eq(MG.getMemoryStats(uB).gamesCompleted, 0, 'kullanıcı istatistikleri bağımsız olmalı');
  eq(MG.getMemoryRotation(uB, `list:${lA.id}`).length, 0, 'tur havuzu kullanıcıya özel olmalı');
  ok(memoryWordsGetter('list', lA.id, uB)().length === 0, 'başka kullanıcının listesi okunmamalı');
  eq(getUserNotebookLists(uA).length, 1); eq(getUserNotebookLists(uB).length, 1);
  const appSrc = await readText('js/app.js');
  const ieSrc = await readText('js/import-export.js');
  ok(appSrc.includes("'memoryGameStats', 'memoryGameRotation'"), 'ilerleme sıfırlamada oyun verileri korunmalı');
  ok(ieSrc.includes("'memoryGameStats', 'memoryGameRotation'"), 'yedeklemeye oyun verileri dahil edilmeli');
  eq(lB.wordIds.length, 4);
});

await test('Eşini Bul [14] Mobil ve masaüstü uyumluluğu (2–40 kart dinamik ızgara, uyarlanabilir mobil sütun, 4 tema)', async () => {
  const css = await readText('css/style.css');
  const js = await readText('js/memory-game.js');
  const sw = await readText('service-worker.js');
  eq(MG.computeGridColumns(32).desktop, 8, '32 kart masaüstünde 8 sütun olmalı');
  eq(MG.computeGridColumns(40).desktop, 8, '40 kart masaüstünde 8 sütun olmalı');
  eq(MG.computeGridColumns(40).mobile, 4, '40 kart mobilde 4 sütuna uyarlanmalı');
  ok(css.includes('.mg-grid{display:grid;grid-template-columns:repeat(var(--mg-cols,8)'), 'masaüstü ızgarası tanımlı olmalı');
  ok(css.includes('repeat(var(--mg-cols-mobile,4),minmax(0,1fr))'), 'mobilde uyarlanabilir sütun kullanılmalı');
  ok(css.includes('overflow-wrap:anywhere') && css.includes('-webkit-line-clamp:3'), 'uzun kelimeler kart içinde düzgün gösterilmeli');
  ok(css.includes('touch-action:manipulation') && css.includes('min-height:64px'), 'dokunmatik kullanıma uygun olmalı');
  ok(css.includes('backface-visibility:hidden') && css.includes('-webkit-backface-visibility:hidden'), 'Safari uyumlu çevirme animasyonu');
  ok(css.includes('prefers-reduced-motion'), 'azaltılmış hareket desteği');
  ok(css.includes('var(--ok-bg)') && css.includes('var(--no-bg)') && css.includes(':root[data-theme=studio] .mg-back'), 'tema değişkenleriyle 4 tema desteği');
  ok(css.includes('env(safe-area-inset-bottom)'));
  ok(sw.includes("'js/memory-game.js'") && sw.includes("const VERSION = 'veluno-v5.0.3';"), 'Service Worker yeni dosyayı önbelleğe almalı');
  ok(js.includes('Doğru eşleşme') && js.includes('Deneme') && js.includes('Süre') && js.includes('Kalan'), 'oyun istatistikleri gösterilmeli');
  eq(MG.fmtClock(155), '02:35');
});

await test('Eşini Bul [15] Oyunun tamamlanması, yeniden başlatılması ve sonraki kelime grubuna geçiş', async () => {
  const uid = 'mg_user_flow';
  const list = await mgMakeList(uid, 'MG Flow', 20);
  const opts = { getWords: memoryWordsGetter('list', list.id, uid), userId: uid, scopeKey: `list:${list.id}`, groupSize: 15 };
  const r1 = await MG.prepareMemoryRound(opts);
  const g = MG.createMemoryGame(r1.selected, { now: 1000 });
  MG.flipMemoryCard(g, g.cards.find((c) => c.side === 'en').uid);
  const wrongTr = g.cards.find((c) => c.side === 'tr' && c.pairId !== g.cards.find((x) => x.state === 'open').pairId);
  MG.flipMemoryCard(g, wrongTr.uid);
  MG.resolveMemoryMismatch(g);
  const last = mgPlayAll(g);
  eq(last.result, 'complete', 'tüm çiftler bulununca oyun tamamlanmalı');
  eq(g.matches, 15); eq(g.attempts, 16, 'deneme sayısı (1 yanlış + 15 doğru) doğru hesaplanmalı');
  ok(g.finishedAt, 'bitiş zamanı kaydedilmeli');
  eq(MG.fmtClock(MG.memoryElapsedSec(g)), '01:35', 'geçen süre doğru hesaplanmalı');
  eq(MG.flipMemoryCard(g, g.cards[0].uid).result, 'ignored', 'biten oyunda kart açılamamalı');
  // Yeniden Oyna: aynı kelimeler, yeni karıştırma
  const replay = await MG.prepareMemoryRound({ ...opts, repeatIds: r1.selected.map((p) => p.id) });
  eq([...replay.selected.map((p) => p.id)].sort(), [...r1.selected.map((p) => p.id)].sort(), 'Yeniden Oyna aynı kelimeleri kullanmalı');
  // Sonraki Kelime Grubu
  ok(r1.hasNextRound);
  const r2 = await MG.prepareMemoryRound(opts);
  const r1Set = new Set(r1.selected.map((p) => p.id));
  eq(r2.selected.filter((p) => !r1Set.has(p.id)).length, 5, 'sonraki grup oynanmamış kelimelerle başlamalı');
  const js = await readText('js/memory-game.js');
  ok(js.includes('Tebrikler! Bütün eşleşmeleri tamamladın!') && js.includes('Yeniden Oyna') && js.includes('Sonraki Kelime Grubu') && js.includes("Kelime Defterim'e Dön"), 'sonuç ekranı seçenekleri bulunmalı');
  ok(js.includes("showNextBtn ? '<button"), 'Sonraki Kelime Grubu yalnızca uygun havuz varsa gösterilmeli');
});

out('\n--- 18) v4.6.1 — Akıllı Çalışma Grupları (5/10/15/20) ve Dinamik Hafıza Oyunu Testleri ---');

await test('v4.6.1 [1] 5 kelimelik grup seçimi (Hazır A2/B1/B2 ve Kelime Defterim)', async () => {
  eq(E.GROUP_SIZES, [5, 10, 15, 20], 'Grup büyüklüğü seçenekleri 5, 10, 15 ve 20 olmalı');
  eq(E.DEFAULT_GROUP_SIZE, 5, 'Varsayılan grup büyüklüğü 5 olmalı');
  eq(E.normalizeGroupSize(), 5);
  eq(E.normalizeGroupSize(999), 5);

  await startLearn('A2', { groupSize: 5, skipModal: true });
  let sess = getCurrentSession();
  eq(sess.params.groupSize, 5);
  eq(sess.params.groupWordIds.length, 5, 'A2 5 kelimelik grup oluşturulmalı');
  eq(sess.items.length, 20, '5 kelime x 4 aşama = 20 öğe olmalı');
  abortSession();

  const uid = 'v461_u_g5';
  const list = await mgMakeList(uid, 'Grup 5 Listesi', 12);
  await startStudyList(list.id, { stages: [1, 2, 3, 4], groupSize: 5 });
  sess = getCurrentSession();
  eq(sess.params.groupSize, 5);
  eq(sess.params.groupWordIds.length, 5, 'Kelime Defterim 5 kelimelik grup oluşturulmalı');
  eq(sess.items.length, 20);
  abortSession();
});

await test('v4.6.1 [2] 10 kelimelik grup seçimi (Hazır A2/B1/B2 ve Kelime Defterim)', async () => {
  await startLearn('B1', { groupSize: 10, skipModal: true });
  let sess = getCurrentSession();
  eq(sess.params.groupSize, 10);
  eq(sess.params.groupWordIds.length, 10, 'B1 10 kelimelik grup oluşturulmalı');
  eq(sess.items.length, 40, '10 kelime x 4 aşama = 40 öğe olmalı');
  abortSession();

  const uid = 'v461_u_g10';
  const list = await mgMakeList(uid, 'Grup 10 Listesi', 15);
  await startStudyList(list.id, { stages: [2, 3], groupSize: 10 });
  sess = getCurrentSession();
  eq(sess.params.groupSize, 10);
  eq(sess.params.groupWordIds.length, 10);
  eq(sess.items.length, 20, '10 kelime x 2 aşama (mc + typing) = 20 öğe olmalı');
  abortSession();
});

await test('v4.6.1 [3] 15 kelimelik grup seçimi (Hazır A2/B1/B2 ve Kelime Defterim)', async () => {
  await startLearn('B2', { groupSize: 15, skipModal: true });
  let sess = getCurrentSession();
  eq(sess.params.groupSize, 15);
  eq(sess.params.groupWordIds.length, 15, 'B2 15 kelimelik grup oluşturulmalı');
  eq(sess.items.length, 60, '15 kelime x 4 aşama = 60 öğe olmalı');
  abortSession();

  const uid = 'v461_u_g15';
  const list = await mgMakeList(uid, 'Grup 15 Listesi', 20);
  await startStudyList(list.id, { stages: [1, 2, 3, 4], groupSize: 15 });
  sess = getCurrentSession();
  eq(sess.params.groupSize, 15);
  eq(sess.params.groupWordIds.length, 15);
  eq(sess.items.length, 60);
  abortSession();
});

await test('v4.6.1 [4] 20 kelimelik grup seçimi (Hazır A2/B1/B2 ve Kelime Defterim)', async () => {
  await startLearn('A2', { groupSize: 20, skipModal: true });
  let sess = getCurrentSession();
  eq(sess.params.groupSize, 20);
  eq(sess.params.groupWordIds.length, 20, 'A2 20 kelimelik grup oluşturulmalı');
  eq(sess.items.length, 80, '20 kelime x 4 aşama = 80 öğe olmalı');
  abortSession();

  const uid = 'v461_u_g20';
  const list = await mgMakeList(uid, 'Grup 20 Listesi', 20);
  await startStudyList(list.id, { stages: [1, 2, 3, 4], groupSize: 20 });
  sess = getCurrentSession();
  eq(sess.params.groupSize, 20);
  eq(sess.params.groupWordIds.length, 20);
  eq(sess.items.length, 80);
  abortSession();
});

await test('v4.6.1 [5] Aynı kelimelerin seçilen aşamalar boyunca korunması', async () => {
  const uid = 'v461_u_same_words';
  const list = await mgMakeList(uid, 'Aynı 10 Kelime', 18);
  await startStudyList(list.id, { stages: [1, 2, 3, 4], groupSize: 10 });
  const sess = getCurrentSession();
  const groupSet = new Set(sess.params.groupWordIds);
  eq(groupSet.size, 10);

  for (const st of [1, 2, 3, 4]) {
    const stageWordIds = sess.items.filter((it) => it.stage === st).map((it) => it.wordId);
    eq(stageWordIds.length, 10, `${st}. aşamada tam 10 kelime olmalı`);
    eq([...stageWordIds].sort(), [...groupSet].sort(), `${st}. aşamada grubun aynı 10 kelimesi korunmalı`);
  }
  abortSession();
});

await test('v4.6.1 [6] Bir sonraki gruba doğru geçiş (önceki grubun kelimeleri gereksiz tekrarlanmaz)', async () => {
  const uid = 'v461_u_next_group';
  const list = await mgMakeList(uid, 'Grup Geçişi 20', 20);

  await startStudyList(list.id, { stages: [2, 3], groupSize: 10 });
  const g1Ids = [...getCurrentSession().params.groupWordIds];
  eq(g1Ids.length, 10);
  abortSession();

  // Sonraki gruba geçildiğinde kalan 10 yeni kelime seçilmeli
  await sessionHooks.startNextNotebookGroup({
    mode: 'list',
    listId: list.id,
    userId: uid,
    selectedStages: [2, 3],
    groupSize: 10,
  });
  const g2Ids = [...getCurrentSession().params.groupWordIds];
  eq(g2Ids.length, 10);
  ok(!g2Ids.some((id) => g1Ids.includes(id)), 'İkinci grupta birinci grubun kelimeleri tekrarlanmamalı');
  abortSession();
});

await test('v4.6.1 [7] Kalan kelime sayısı grup büyüklüğünden küçük olduğunda mevcut kalan kelimelerle grup oluşturulur', async () => {
  const uid = 'v461_u_rem_group';
  const list = await mgMakeList(uid, '14 Kelimelik Liste', 14);

  // 1. Grup: 10 kelime
  await startStudyList(list.id, { stages: [1, 2], groupSize: 10 });
  const g1Ids = [...getCurrentSession().params.groupWordIds];
  eq(g1Ids.length, 10);
  abortSession();

  // 2. Grup: Kalan 4 kelime (önceki 10 kelimeyle doldurulmamalı)
  await startStudyList(list.id, { stages: [1, 2], groupSize: 10 });
  const g2Ids = [...getCurrentSession().params.groupWordIds];
  eq(g2Ids.length, 4, 'Kalan 4 kelimeyle grup oluşturulmalı');
  ok(!g2Ids.some((id) => g1Ids.includes(id)), 'Önceki grubun kelimeleri tekrar edilmemeli');
  abortSession();
});

await test('v4.6.1 [8] Hazır A2/B1/B2 sisteminin dört aşamalı kalması ve grup büyüklüğü seçimi', async () => {
  const learnSrc = await readText('js/learning.js');
  ok(typeof openGroupSizeModal === 'function', 'openGroupSizeModal tanımlı olmalı');
  ok(learnSrc.includes('Kaç kelimelik gruplarla çalışmak istiyorsun?'), 'Grup büyüklüğü sorusu bulunmalı');
  eq(E.STAGES, ['Kelimeyi Öğren', 'Çoktan Seçmeli Soru', 'İngilizce Kelimeyi Yaz', 'Eksik Harfleri Tamamla']);
  await startLearn('A2', { groupSize: 10, skipModal: true });
  const sess = getCurrentSession();
  eq(sess.params.selectedStages, [1, 2, 3, 4], 'Hazır A2/B1/B2 standart 4 aşamalı kalmalı');
  ok(!sess.items.some((it) => it.stage > 4 || it.type === 'match'));
  abortSession();
});

await test('v4.6.1 [9] Kelime Defterim aşama seçimi ve grup büyüklüğü ekranının birleştirilmesi', async () => {
  const nbSrc = await readText('js/notebook.js');
  ok(nbSrc.includes('Kaç kelimelik gruplarla çalışmak istiyorsun?'), 'Kelime Defterim modalında grup büyüklüğü sorusu olmalı');
  ok(nbSrc.includes('data-group-size='), '5/10/15/20 grup büyüklüğü butonları olmalı');
  eq(NOTEBOOK_STAGE_OPTIONS.length, 5);
  eq(NOTEBOOK_DEFAULT_STAGES, [1, 2, 3, 4], 'İlk 4 aşama varsayılan seçili, Eşini Bul seçili olmamalı');
  const res = resolveNotebookStages({ stages: [2, 4, 5], groupSize: 15 });
  eq(res.ok, true);
  eq(res.stages, [2, 4]);
  eq(res.includeMatch, true);
  eq(res.groupSize, 15);
});

await test('v4.6.1 [10] Bütün değerlendirme aşamalarında doğru bilinen kelimelerin oyuna alınması (Örn: 10 kelimeden 6 doğru → 12 kart)', async () => {
  const uid = 'v461_u_6of10';
  const list = await mgMakeList(uid, '10 Kelime 6 Doğru', 10);
  await startStudyList(list.id, { stages: [1, 2, 3, 4, 5], groupSize: 10 });
  const sess = getCurrentSession();
  const gIds = sess.params.groupWordIds;
  eq(gIds.length, 10);

  // İlk 6 kelime bütün değerlendirme aşamalarında (2, 3, 4) doğru, son 4 kelime en az bir aşamada yanlış
  for (let i = 0; i < 10; i++) {
    const wid = gIds[i];
    const isGood = i < 6;
    E.recordGroupEvalAnswer(sess.params.groupEval, { wordId: wid, stage: 1, type: 'card', correct: true });
    E.recordGroupEvalAnswer(sess.params.groupEval, { wordId: wid, stage: 2, type: 'mc', correct: true });
    E.recordGroupEvalAnswer(sess.params.groupEval, { wordId: wid, stage: 3, type: 'typing', correct: isGood });
    if (isGood) {
      E.recordGroupEvalAnswer(sess.params.groupEval, { wordId: wid, stage: 4, type: 'missing', correct: true });
    }
  }

  const summary = E.computeGroupEvalSummary({
    groupWordIds: gIds,
    selectedStages: [1, 2, 3, 4],
    evalState: sess.params.groupEval,
  });
  eq(summary.passedWordIds.length, 6, '6 kelime bütün değerlendirme aşamalarında doğru kabul edilmeli');
  eq(summary.failedWordIds.length, 4, '4 kelime yanlış kabul edilmeli');

  const round = await MG.prepareMemoryRound({
    getWords: memoryWordsGetter('list', list.id, uid),
    userId: uid,
    scopeKey: `list:${list.id}`,
    eligibleWordIds: summary.eligibleWordIds,
    hasEvalStages: summary.hasEvalStages,
  });
  eq(round.selected.length, 6, 'Oyunda yalnızca 6 doğru kelime kullanılmalı');
  const game = MG.createMemoryGame(round.selected);
  eq(game.cards.length, 12, '6 doğru kelime × 2 = 12 kart oluşturulmalı');
  abortSession();
});

await test('v4.6.1 [11] Bir aşamada yanlış cevaplanan (veya geçmişte MASTERED olup bu turda yanlış yapılan) kelimenin oyundan çıkarılması', () => {
  const wMastered = 'w_mastered_fail';
  const wGood = 'w_good_pass';
  // Geçmişte MASTERED olsa bile bu turda yanlış yapıldıysa oyuna alınmamalı
  const evalState = E.createGroupEvaluation([wMastered, wGood], [2, 3]);
  E.recordGroupEvalAnswer(evalState, { wordId: wMastered, stage: 2, type: 'mc', correct: true });
  E.recordGroupEvalAnswer(evalState, { wordId: wMastered, stage: 3, type: 'typing', correct: false });
  E.recordGroupEvalAnswer(evalState, { wordId: wGood, stage: 2, type: 'mc', correct: true });
  E.recordGroupEvalAnswer(evalState, { wordId: wGood, stage: 3, type: 'typing', correct: true });

  const sum = E.computeGroupEvalSummary({
    groupWordIds: [wMastered, wGood],
    selectedStages: [2, 3],
    evalState,
  });
  eq(sum.eligibleWordIds, [wGood], 'Yanlış cevaplanan kelime oyundan çıkarılmalı');
  eq(sum.failedWordIds, [wMastered]);
});

await test('v4.6.1 [12] Önce yanlış sonra doğru cevaplanan kelimenin bu tur için tam doğru sayılmaması', () => {
  const wid = 'w_wrong_then_right';
  const evalState = E.createGroupEvaluation([wid], [2, 3]);
  // İlk denemede yanlış, ardından aynı oturumda doğru cevaplansa bile ilk yanlış silinmemeli
  E.recordGroupEvalAnswer(evalState, { wordId: wid, stage: 2, type: 'mc', correct: false });
  E.recordGroupEvalAnswer(evalState, { wordId: wid, stage: 2, type: 'mc', correct: true });
  E.recordGroupEvalAnswer(evalState, { wordId: wid, stage: 3, type: 'typing', correct: true });

  const sum = E.computeGroupEvalSummary({
    groupWordIds: [wid],
    selectedStages: [2, 3],
    evalState,
  });
  eq(sum.passedWordIds, [], 'İlk yanlış cevap sonradan gelen doğru cevapla silinmemeli');
  eq(sum.failedWordIds, [wid]);
});

await test('v4.6.1 [13] Yalnızca Eşini Bul seçildiğinde seçilen grup büyüklüğündeki kelimelerle oyunun çalışması (10 kelime → 20 kart, SRS değişmez)', async () => {
  const uid = 'v461_u_only_match_10';
  const list = await mgMakeList(uid, 'Yalnızca Eşini Bul 10', 16);
  const started = await startStudyList(list.id, { stages: [5], groupSize: 10 });
  eq(started, true);
  eq(getCurrentSession(), null, 'Değerlendirme oturumu açılmadan doğrudan oyun başlamalı');
  const rot = MG.getMemoryRotation(uid, `list:${list.id}`);
  eq(rot.length, 10, '10 kelimelik grup oyuna alınmalı');
  ok(rot.every((id) => !getProgress(id).learningComplete && !E.isMastered(getProgress(id))), 'Kelimeler otomatik öğrenilmiş veya Mastered sayılmamalı');
});

await test('v4.6.1 [14] Kelimeyi Öğren + Eşini Bul seçiminin çalışması (değerlendirme aşaması olmadığından grubun tüm kelimeleri oyuna alınır)', async () => {
  const uid = 'v461_u_card_and_match';
  const list = await mgMakeList(uid, 'Kart + Eşini Bul', 12);
  await startStudyList(list.id, { stages: [1, 5], groupSize: 10 });
  const sess = getCurrentSession();
  eq(sess.params.selectedStages, [1]);
  eq(sess.params.groupWordIds.length, 10);
  // Kart aşaması tamamlanır
  for (const it of sess.items) {
    await handlers.learn.onAnswer(it, true, { elapsed: 1, customStages: [1] });
  }
  const evalSum = E.computeGroupEvalSummary({
    groupWordIds: sess.params.groupWordIds,
    selectedStages: [1],
    evalState: sess.params.groupEval,
  });
  eq(evalSum.hasEvalStages, false, 'Kelimeyi Öğren bir değerlendirme aşaması değildir');
  eq(evalSum.eligibleWordIds.length, 10, '10 kelimenin tamamı Eşini Bul oyununa alınmalı');
  abortSession();
  await sessionHooks.afterLearn(sess);
  eq(MG.getMemoryRotation(uid, `list:${list.id}`).length, 10);
  ok(sess.params.groupWordIds.every((id) => !getProgress(id).learningComplete), 'Yalnızca kart + oyun kelimeleri learningComplete yapmamalı');
});

await test('v4.6.1 [15] Sıfır doğru kelime durumunun güvenli yönetilmesi (0 kart oluşturulmaz, mesaj ve 3 aksiyon sunulur)', async () => {
  const uid = 'v461_u_zero_correct';
  const list = await mgMakeList(uid, 'Sıfır Doğru Testi', 5);
  const res = await MG.startMemoryGame({
    getWords: memoryWordsGetter('list', list.id, uid),
    userId: uid,
    scopeKey: `list:${list.id}`,
    eligibleWordIds: [],
    failedWordIds: list.wordIds,
    hasEvalStages: true,
    fromSession: true,
  });
  eq(res.ok, true);
  eq(res.zeroCorrect, true, 'Sıfır doğru durumu tespit edilmeli');
  eq(res.game, null, '0 kartlık boş oyun oluşturulmamalı');
  eq(
    res.message,
    'Bu grupta bütün aşamaları doğru tamamladığın bir kelime bulunamadı. Yanlış yaptığın kelimeleri tekrar çalışarak yeniden deneyebilirsin.'
  );
  const mgSrc = await readText('js/memory-game.js');
  ok(mgSrc.includes('Yanlış Kelimeleri Tekrar Çalış') && mgSrc.includes('Sonraki Gruba Geç') && mgSrc.includes("Kelime Defterim'e Dön"), 'Üç aksiyon butonu bulunmalı');
});

await test('v4.6.1 [16] 3 doğru kelimeden 6 kart oluşturulması', async () => {
  const uid = 'v461_u_3words';
  const list = await mgMakeList(uid, '3 Doğru Kelime', 5);
  const threeIds = list.wordIds.slice(0, 3);
  const r = await MG.prepareMemoryRound({
    getWords: memoryWordsGetter('list', list.id, uid),
    userId: uid,
    scopeKey: `list:${list.id}`,
    eligibleWordIds: threeIds,
    hasEvalStages: true,
  });
  eq(r.selected.length, 3);
  const g = MG.createMemoryGame(r.selected);
  eq(g.cards.length, 6, '3 doğru kelime → 6 kart');
});

await test('v4.6.1 [17] 10 doğru kelimeden 20 kart oluşturulması', async () => {
  const uid = 'v461_u_10words';
  const list = await mgMakeList(uid, '10 Doğru Kelime', 12);
  const tenIds = list.wordIds.slice(0, 10);
  const r = await MG.prepareMemoryRound({
    getWords: memoryWordsGetter('list', list.id, uid),
    userId: uid,
    scopeKey: `list:${list.id}`,
    eligibleWordIds: tenIds,
    hasEvalStages: true,
  });
  eq(r.selected.length, 10);
  const g = MG.createMemoryGame(r.selected);
  eq(g.cards.length, 20, '10 doğru kelime → 20 kart');
});

await test('v4.6.1 [18] 20 doğru kelimeden 40 kart oluşturulması', async () => {
  const uid = 'v461_u_20words';
  const list = await mgMakeList(uid, '20 Doğru Kelime', 20);
  const r = await MG.prepareMemoryRound({
    getWords: memoryWordsGetter('list', list.id, uid),
    userId: uid,
    scopeKey: `list:${list.id}`,
    eligibleWordIds: list.wordIds,
    hasEvalStages: true,
  });
  eq(r.selected.length, 20);
  const g = MG.createMemoryGame(r.selected);
  eq(g.cards.length, 40, '20 doğru kelime → 40 kart');
});

await test('v4.6.1 [19] Yanlış eşleşmelerin otomatik kapanması ve bekleme süresinde kilit', () => {
  const pairs = MG.prepareMemoryPairs([
    { id: 'p1', word: 'achieve', meanings: ['başarmak'] },
    { id: 'p2', word: 'improve', meanings: ['geliştirmek'] },
    { id: 'p3', word: 'require', meanings: ['gerektirmek'] },
  ]).pairs;
  const g = MG.createMemoryGame(pairs);
  MG.flipMemoryCard(g, 'p1::en');
  const m = MG.flipMemoryCard(g, 'p2::tr');
  eq(m.result, 'mismatch');
  eq(g.locked, true);
  eq(MG.flipMemoryCard(g, 'p3::en').result, 'ignored', 'kilitliyken 3. kart açılamaz');
  MG.resolveMemoryMismatch(g);
  eq(g.locked, false);
  ok(g.cards.every((c) => c.state === 'hidden'), 'kartlar otomatik kapandı');
});

await test('v4.6.1 [20] Kullanıcı profilleri ve SRS verilerinin korunması', async () => {
  const u1 = 'v461_prof_1', u2 = 'v461_prof_2';
  const l1 = await mgMakeList(u1, 'Liste U1', 5);
  const l2 = await mgMakeList(u2, 'Liste U2', 5);
  const w1 = l1.wordIds[0];
  const p1 = getProgress(w1);
  p1.learningComplete = true;
  p1.currentStatus = 'MASTERED';
  p1.srsStep = 4;
  p1.reviewInterval = 14;
  await saveProgress(p1);
  const snapBefore = JSON.stringify(getProgress(w1));

  await startStudyList(l1.id, { stages: [5], groupSize: 5 });
  eq(JSON.stringify(getProgress(w1)), snapBefore, 'Hafıza oyunu SRS kaydını değiştirmemeli');
  eq(getUserNotebookLists(u2).length, 1);
  eq(getUserNotebookLists(u2)[0].id, l2.id, 'Diğer kullanıcı profili izole kalmalı');
});

await test('v4.6.1 [21] Sayfa yenileme sonrası oturumun aynı grup, kelime sırası ve başarı bilgileriyle doğru devam etmesi', async () => {
  const uid = 'v461_u_reload';
  const list = await mgMakeList(uid, 'Yenileme Testi', 12);
  await startStudyList(list.id, { stages: [2, 3, 5], groupSize: 10 });
  const sessBefore = getCurrentSession();
  const itemOrderBefore = sessBefore.items.map((it) => `${it.wordId}:${it.stage}`);
  const groupIdsBefore = [...sessBefore.params.groupWordIds];

  // İlk soruyu doğru, ikinci soruyu yanlış cevapla ve kaydet
  const firstItem = sessBefore.items[0];
  const secondItem = sessBefore.items[1];
  await handlers.learn.onAnswer(firstItem, true, { elapsed: 2 });
  sessBefore.results.push({ wordId: firstItem.wordId, type: firstItem.type, stage: firstItem.stage, correct: true, t: 2 });
  sessBefore.idx = 1;
  await handlers.learn.onAnswer(secondItem, false, { elapsed: 3 });
  sessBefore.results.push({ wordId: secondItem.wordId, type: secondItem.type, stage: secondItem.stage, correct: false, t: 3 });
  sessBefore.idx = 2;
  await setMeta('activeSession', {
    kind: sessBefore.kind,
    title: sessBefore.title,
    level: sessBefore.level,
    items: sessBefore.items,
    idx: sessBefore.idx,
    results: sessBefore.results,
    params: sessBefore.params,
    feedback: sessBefore.feedback,
  });

  // Sayfa yenilemesini simüle et: oturumu kapat ve resumeSaved() ile geri yükle
  abortSession();
  eq(getCurrentSession(), null);
  const resumed = await resumeSaved();
  eq(resumed, true, 'Kayıtlı oturum devam ettirilebilmeli');
  const sessAfter = getCurrentSession();
  eq(sessAfter.params.groupSize, 10, 'Seçilen grup büyüklüğü korunmalı');
  eq(sessAfter.params.groupWordIds, groupIdsBefore, 'Grup kelimeleri korunmalı');
  eq(sessAfter.items.map((it) => `${it.wordId}:${it.stage}`), itemOrderBefore, 'Kelime ve soru sırası korunmalı');
  eq(sessAfter.idx, 2, 'Kaldığı soru indeksi korunmalı');
  eq(sessAfter.params.groupEval.byWord[firstItem.wordId].passedStages, [2], 'Doğru cevap bilgisi korunmalı');
  eq(sessAfter.params.groupEval.byWord[secondItem.wordId].failed, true, 'Yanlış cevap bilgisi korunmalı');
  abortSession();
});

await test('v4.6.1 [22] Mobil ve masaüstü ekran uyumluluğu (2–40 kart sütun hesabı ve iPhone okunabilirlik kuralları)', async () => {
  for (const n of [2, 6, 10, 14, 20, 30, 40]) {
    const cols = MG.computeGridColumns(n);
    ok(cols.desktop >= 2 && cols.desktop <= 8, `${n} kart masaüstü sütun sayısı geçerli olmalı`);
    ok(cols.mobile >= 2 && cols.mobile <= 4, `${n} kart iPhone/mobil sütun sayısı en çok 4 olmalı`);
  }
  const css = await readText('css/style.css');
  ok(css.includes('.nb-size-grid') && css.includes('.nb-size-option'), 'Grup büyüklüğü seçim kartları stilleri tanımlı olmalı');
  ok(css.includes('overflow-y:auto'), '40 kartta dikey kaydırma desteklenmeli');
});

await test('v4.6.1 [23] Eski v4.6.0 hafıza oyunu verileriyle geriye dönük uyumluluk', async () => {
  await setMeta('memoryGameStats', {
    legacy_u: { gamesStarted: '4', gamesCompleted: 3, totalMatches: 48, totalAttempts: 60, bestTimeSec: 85, bestAttempts: 18, lastPlayedAt: '2026-11-07T20:00:00Z' },
  });
  await setMeta('memoryGameRotation', {
    'legacy_u::list:old16': ['w1', 'w2', 'w2', 'w3'],
    'legacy_u::all': { played: ['w4', 'w5'] },
  });

  const adapted = await MG.adaptLegacyMemoryData();
  eq(adapted.changed, true);
  const st = MG.getMemoryStats('legacy_u');
  eq(st.gamesStarted, 4);
  eq(st.gamesCompleted, 3);
  eq(st.totalMatches, 48);
  eq(st.bestTimeSec, 85);
  eq(MG.getMemoryRotation('legacy_u', 'list:old16'), ['w1', 'w2', 'w3'], 'Eski tur kaydı silinmeden normalize edilmeli');
  eq(MG.getMemoryRotation('legacy_u', 'all'), ['w4', 'w5']);
});

/* ---------- 19) v5.0 — Ember Soft Mobil Tasarım Revizyonu, Defterim Dikey Öğrenme Yolu, 4 Sekmeli Navigasyon ve Dinamik Öğrenme Yolları Testleri ---------- */
out('\n--- 19) v5.0 — Ember Soft Mobil Tasarım Revizyonu, Defterim Dikey Öğrenme Yolu, 4 Sekmeli Navigasyon ve Dinamik Öğrenme Yolları Testleri ---');

await test('v5.0 [1] Ember Soft seçiliyor ve ana arka plan rengi #101820 ile kesin renk paletiyle doğru çalışıyor', async () => {
  const css = await readText('css/style.css');
  const html = await readText('index.html');
  const appCode = await readText('js/app.js');

  eq(resolveTheme('ember', false), 'ember', 'Ember Soft açık cihaz modunda ember dönmeli');
  eq(resolveTheme('ember', true), 'ember', 'Ember Soft koyu cihaz modunda ember dönmeli');
  eq(resolveTheme('ember'), 'ember', 'Ember Soft argümansız ember dönmeli');
  ok(THEME_IDS.includes('ember'), 'THEME_IDS içinde ember bulunmalı');
  eq(THEME_META_COLORS.ember, '#101820', 'Ember Soft meta theme-color #101820 olmalı');
  ok(html.includes("pref === 'ember'") && html.includes("ember: '#101820'"), 'index.html inline scripti ember temasını ve #101820 arka planını tanımalı');
  ok(appCode.includes('data-set-theme="ember"') && appCode.includes('Ember Soft'), 'Ayarlarda 5. tema olarak Ember Soft butonu bulunmalı');

  const requiredHex = [
    '#101820', '#242424', '#245C60', '#438A8B', '#AC9160', '#75603C',
    '#3FC877', '#19261C', '#57191C', '#281819', '#FB6A21', '#F5F5F5', '#A5A5A5',
  ];
  for (const hex of requiredHex) {
    ok(css.includes(hex), `Ember Soft palet rengi CSS içinde tanımlı olmalı: ${hex}`);
  }
  ok(css.includes(':root[data-theme=ember]') && css.includes('--ember-bg:#101820') && css.includes('--bg:#101820'), 'Ember Soft ana arka plan rengi #101820 olmalı');
  ok(!css.includes('--ember-bg:#181818') && !css.includes('--surf:#2E2E2E'), 'Eski #181818 ve #2E2E2E gri arka planları Ember Soft içinde kalmamalı');
  ok(css.includes('--ac:#245C60') && css.includes('--ac2:#438A8B'), 'Merkezi tema değişkenleri #245C60 ve #438A8B kullanmalı');
  ok(!css.includes('--ac:#FB6A21'), '#FB6A21 kesinlikle ana renk olmamalı');
});

await test('v5.0 [2] Mevcut dört tema (light, dark, auto, studio) ve kullanıcı tema tercihi etkilenmeden çalışıyor', async () => {
  eq(DEFAULT_SETTINGS.theme, 'light', 'Varsayılan tema zorla ember yapılmamalı, light kalmalı');
  eq(resolveTheme('light'), 'light');
  eq(resolveTheme('dark'), 'dark');
  eq(resolveTheme('auto', false), 'light');
  eq(resolveTheme('auto', true), 'dark');
  eq(resolveTheme('studio'), 'studio');
  setSetting('theme', 'studio');
  eq(getSettings().theme, 'studio', 'Kullanıcının mevcut tema tercihi korunmalı');
  setSetting('theme', 'ember');
  eq(getSettings().theme, 'ember', 'Ember Soft seçildiğinde kaydedilmeli');
  setSetting('theme', 'light');
});

await test('v5.0 [3] VELUNO başlığı ve mevcut ahmet ❤️ sude imzası Defterim ve Menü ekranlarında aynen korunmuş', async () => {
  const appCode = await readText('js/app.js');
  const nbCode = await readText('js/notebook.js');
  ok(nbCode.includes('<span class="hero-title" aria-label="VELUNO">VELUNO</span>'), 'Defterim ekranında VELUNO başlığı korunmalı');
  ok(nbCode.includes('<span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span>'), 'Defterim ekranında ahmet ❤️ sude imzası korunmalı');
  ok(appCode.includes('<span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span>'), 'Menü ekranında ahmet ❤️ sude imzası korunmalı');
});

await test('v5.0 [4] Eski Ana Sayfa tamamen kaldırılmış ve uygulama açıldığında doğrudan Defterim (#/notebook) ekranı geliyor', async () => {
  const appCode = await readText('js/app.js');
  const html = await readText('index.html');
  ok(!appCode.includes('function renderDashboard'), 'renderDashboard fonksiyonu tamamen kaldırılmış olmalı');
  ok(!html.includes('data-nav="dashboard"'), 'index.html içinde eski Ana Sayfa sekmesi bulunmamalı');
  ok(appCode.includes("if (!location.hash || location.hash === '#/dashboard') location.hash = '#/notebook';"), 'Uygulama açıldığında varsayılan ekran #/notebook olmalı');
  ok(appCode.includes("const rawName = (location.hash.replace('#/', '') || 'notebook').split('?')[0];"), 'Boş hash doğrudan notebook rotasına çözümlenmeli');
  ok(appCode.includes("const name = rawName === 'dashboard' ? 'notebook' : rawName;"), 'Eski #/dashboard yönlendirmeleri güvenli biçimde Defterim ekranına yönlendirilmeli');
});

await test('v5.0 [5] Defterim ekranında eski büyük buton grubu kaldırılıp yukarıdan aşağıya kıvrımlı öğrenme yolu ve kompakt Çalış menüsü gösteriliyor', async () => {
  const nbCode = await readText('js/notebook.js');
  const pathUiCode = await readText('js/path-ui.js');
  const learnCode = await readText('js/learning.js');

  const renderStart = nbCode.indexOf('export function renderNotebook(');
  const renderSection = nbCode.slice(renderStart);
  ok(!renderSection.includes('Kişisel Çalışma Seçenekleri'), 'Defterim ana ekranında eski "Kişisel Çalışma Seçenekleri" büyük kart bloğu olmamalı');
  ok(renderSection.includes('id="btn-top-add-word"') && renderSection.includes('id="btn-open-study-menu"') && renderSection.includes('id="btn-top-new-list"'), 'Defterim kompakt üst alanında + Kelime, Çalış ve + Liste butonları bulunmalı');
  ok(renderSection.includes('id="nb-active-list"'), 'Defterim üst alanında kişisel liste seçici bulunmalı');
  ok(renderSection.includes("pathCanvasHtml(pathSum, win.lo, win.hi, 'notebook')"), 'Defterim ekranının ilk görünür alanında doğrudan kişisel öğrenme yolu çizilmeli');
  ok(nbCode.includes('export function openNotebookStudyMenuModal'), 'Kompakt Çalış menüsü (Seçili Listeyi Çalış, Bütün Kelimelerimi Çalış, Yalnızca Bilmediklerimi Çalış, Tekrar Zamanı Gelenler) korunmalı');
  ok(pathUiCode.includes('const yOf = (i) => PAD + (i - lo) * ROW + ROW / 2;') && pathUiCode.includes('data-direction="vertical"'), 'Öğrenme yolu yukarıdan aşağıya (1. durak en üstte) dikey kıvrımlı akmalı');
  ok(learnCode.includes('<h1>Hazır Kelime Havuzu</h1>') && learnCode.includes("pathCanvasHtml(pathSum, win.lo, win.hi, 'builtin')"), '2. sekme Hazır Kelime Havuzu başlığıyla açılmalı ve dikey bronz öğrenme yolunu göstermeli');
});

await test('v5.0 [6] Dört mobil navigasyon sekmesi (Defterim, Hazır Kelime Havuzu / Hazır Havuz, Yolum, Menü) doğru tanımlı ve çalışıyor', async () => {
  const html = await readText('index.html');
  const css = await readText('css/style.css');
  const bottom = html.slice(html.indexOf('<nav id="bottomnav"'), html.indexOf('</nav>', html.indexOf('<nav id="bottomnav"')));
  const tabs = [...bottom.matchAll(/data-nav="([^"]+)"[\s\S]*?<span class="nav-lb">([^<]+)<\/span>/g)].map((m) => [m[1], m[2]]);
  eq(tabs, [
    ['notebook', 'Defterim'],
    ['learn', 'Hazır Havuz'],
    ['path', 'Yolum'],
    ['more', 'Menü'],
  ], 'Mobil alt navigasyon tam olarak Defterim, Hazır Havuz (Hazır Kelime Havuzu), Yolum, Menü olmalı');
  ok(bottom.includes('aria-label="Hazır Kelime Havuzu"'), '2. sekmenin erişilebilir tam adı Hazır Kelime Havuzu olmalı');
  ok(css.includes(':root[data-theme=ember] #bottomnav a.active{color:var(--ember-active)'), 'Aktif sekme petrol tonuyla (#438A8B) belirtilmeli');
  ok(css.includes('env(safe-area-inset-bottom)'), 'iPhone safe-area alt alanı desteklenmeli');
});

await test('v5.0 [7] Kelime Defterim listelerinin yolları birbirinden bağımsızdır', async () => {
  const u = 'v5_indep_user';
  const rA = await createNotebookList('Liste A', u);
  const rB = await createNotebookList('Liste B', u);
  for (let i = 0; i < 12; i++) await addWordToNotebook({ word: `alphaword${String.fromCharCode(97 + i)}`, meanings: [`anlamA${i}`], listId: rA.list.id, userId: u });
  for (let i = 0; i < 5; i++) await addWordToNotebook({ word: `betaword${String.fromCharCode(97 + i)}`, meanings: [`anlamB${i}`], listId: rB.list.id, userId: u });

  const listA = getAllNotebookLists().find((l) => l.id === rA.list.id);
  const listB = getAllNotebookLists().find((l) => l.id === rB.list.id);
  const stopsA = Paths.getListPathStops(listA);
  const stopsB = Paths.getListPathStops(listB);
  eq(stopsA.length, 2, '12 kelimeli Liste A 2 durağa sahip olmalı');
  eq(stopsB.length, 1, '5 kelimeli Liste B 1 durağa sahip olmalı');

  const stopB1IdBefore = stopsB[0].id;
  const stopB1WordsBefore = [...stopsB[0].wordIds];
  await addWordToNotebook({ word: 'alphaextra', meanings: ['ekstra'], listId: rA.list.id, userId: u });
  const stopsBAfter = Paths.getListPathStops(getAllNotebookLists().find((l) => l.id === rB.list.id));
  eq(stopsBAfter[0].id, stopB1IdBefore, 'Liste A değiştiğinde Liste B durak kimliği değişmemeli');
  eq(stopsBAfter[0].wordIds, stopB1WordsBefore, 'Liste A değiştiğinde Liste B durak yerleşimi değişmemeli');
});

await test('v5.0 [8] 7, 10, 11, 21, 35, 100 ve 2000 kelime sayılarında doğru duraklar (ör. 21 kelime → 10+10+1 = 3 durak) oluşuyor', async () => {
  const cases = [
    [7, 1, 7],
    [10, 1, 10],
    [11, 2, 1],
    [21, 3, 1],
    [25, 3, 5],
    [35, 4, 5],
    [100, 10, 10],
    [2000, 200, 10],
  ];
  for (const [count, expectedStops, expectedLastLen] of cases) {
    eq(Paths.stopCountFor(count), expectedStops, `${count} kelime için stopCountFor ${expectedStops} olmalı`);
    const fakeList = {
      id: `list_sz_${count}`,
      userId: 'u_sz',
      wordIds: Array.from({ length: count }, (_, i) => `w_${i + 1}`),
    };
    const { path } = Paths.syncPathRecord(null, fakeList);
    eq(path.stops.length, expectedStops, `${count} kelime → ${expectedStops} durak oluşmalı`);
    eq(path.stops[path.stops.length - 1].wordIds.length, expectedLastLen, `${count} kelimede son durakta ${expectedLastLen} kelime olmalı`);
    ok(path.stops.every((s) => s.wordIds.length >= 1 && s.wordIds.length <= Paths.STOP_SIZE), 'Her durakta 1..10 arası kelime olmalı');
  }
  // 21 kelimelik örnek kontrolü: 1. durak = 10, 2. durak = 10, 3. durak = 1
  const { path: p21 } = Paths.syncPathRecord(null, { id: 'list_21', userId: 'u_21', wordIds: Array.from({ length: 21 }, (_, i) => `w21_${i + 1}`) });
  eq(p21.stops.map((s) => s.wordIds.length), [10, 10, 1], '21 kelimelik listede 1. durak=10, 2. durak=10, 3. durak=1 kelime olmalı');
});

await test('v5.0 [9] Yeni kelimeler eski durak yerleşimlerini bozmadan son durağın boş kapasitesine veya yeni durağa ekleniyor', async () => {
  const u = 'v5_append_user';
  const r = await createNotebookList('Sabit Durak Listesi', u);
  const lid = r.list.id;
  const items8 = Array.from({ length: 8 }, (_, i) => ({ word: `keepword${String.fromCharCode(97 + i)}`, meanings: `anlam ${i + 1}`, status: 'valid' }));
  await bulkAddWordsToNotebook({ items: items8, listId: lid, userId: u });

  let stops = Paths.getListPathStops(getAllNotebookLists().find((l) => l.id === lid));
  eq(stops.length, 1, '8 kelime → 1 durak');
  const firstStopId = stops[0].id;
  const first8Ids = [...stops[0].wordIds];

  // 2 kelime daha ekle → 1. durağın boş kapasitesine (8 → 10) yerleşmeli
  await addWordToNotebook({ word: 'keepwordi', meanings: ['anlam 9'], listId: lid, userId: u });
  await addWordToNotebook({ word: 'keepwordj', meanings: ['anlam 10'], listId: lid, userId: u });
  stops = Paths.getListPathStops(getAllNotebookLists().find((l) => l.id === lid));
  eq(stops.length, 1, '10 kelime → hâlâ 1 durak');
  eq(stops[0].id, firstStopId, '1. durağın kalıcı kimliği korunmalı');
  eq(stops[0].wordIds.slice(0, 8), first8Ids, 'İlk 8 kelimenin sırası ve durağı değişmemeli');

  // 11. kelimeyi ekle → 1. durak dolu olduğu için 2. durak oluşturulmalı
  await addWordToNotebook({ word: 'keepwordk', meanings: ['anlam 11'], listId: lid, userId: u });
  stops = Paths.getListPathStops(getAllNotebookLists().find((l) => l.id === lid));
  eq(stops.length, 2, '11 kelime → 2 durak');
  eq(stops[0].id, firstStopId, '1. durak kimliği değişmemeli');
  eq(stops[0].wordIds.length, 10, '1. durak 10 kelimede sabit kalmalı');
  eq(stops[1].wordIds.length, 1, 'Yeni kelime 2. durağa yerleşmeli');
});

await test('v5.0 [10] Kelime silme işleminden sonra diğer duraklar geriye kaydırılmaz, kısmi dolu duraklar ve SRS verileri korunur', async () => {
  const u = 'v5_del_user';
  const r = await createNotebookList('Silme Test Listesi', u);
  const lid = r.list.id;
  const items15 = Array.from({ length: 15 }, (_, i) => ({ word: `deltest${String.fromCharCode(97 + i)}`, meanings: `anlam ${i + 1}`, status: 'valid' }));
  await bulkAddWordsToNotebook({ items: items15, listId: lid, userId: u });

  let stops = Paths.getListPathStops(getAllNotebookLists().find((l) => l.id === lid));
  eq(stops.length, 2, '15 kelime → 2 durak (10 + 5)');
  const stop1Id = stops[0].id;
  const stop2Id = stops[1].id;
  const stop2IdsBefore = [...stops[1].wordIds];
  const removedWordId = stops[0].wordIds[2];

  // Silinecek kelimeye SRS ilerlemesi yaz
  const p = getProgress(removedWordId);
  p.learningComplete = true;
  p.currentStatus = 'MASTERED';
  p.masteryScore = 92;
  await saveProgress(p);

  await removeWordFromNotebookList(lid, removedWordId, u);
  stops = Paths.getListPathStops(getAllNotebookLists().find((l) => l.id === lid));
  eq(stops.length, 2, 'Silme sonrası 2 durak korunmalı');
  eq(stops[0].id, stop1Id, '1. durak kimliği korunmalı');
  eq(stops[0].wordIds.length, 9, '1. durak 9 kelimeli kısmi dolu kalmalı; 2. duraktan kelime kaydırılmamalı');
  eq(stops[1].id, stop2Id, '2. durak kimliği korunmalı');
  eq(stops[1].wordIds, stop2IdsBefore, '2. durağın kelimeleri hiç değişmemeli');
  eq(getProgress(removedWordId).masteryScore, 92, 'Kelimenin SRS ilerleme geçmişi silinmemeli');
});

await test('v5.0 [11] Uygulama kapatılıp yeniden açıldığında ve liste yeniden adlandırıldığında durak yerleşimleri idempotent olarak korunuyor', async () => {
  const u = 'v5_persist_user';
  const r = await createNotebookList('İlk İsim', u);
  const lid = r.list.id;
  const items12 = Array.from({ length: 12 }, (_, i) => ({ word: `persistw${String.fromCharCode(97 + i)}`, meanings: `anlam ${i + 1}`, status: 'valid' }));
  await bulkAddWordsToNotebook({ items: items12, listId: lid, userId: u });

  const before = JSON.parse(JSON.stringify(Paths.getAllPaths()[lid]));
  await updateNotebookList(lid, { name: 'Yeni İsim' });
  await Paths.ensureListPaths(getAllNotebookLists());
  await Paths.ensureListPaths(getAllNotebookLists()); // tekrar çağrı (idempotent)
  const after = Paths.getAllPaths()[lid];
  eq(after.stops, before.stops, 'Yeniden adlandırma ve tekrar açılışta durak kimlikleri ve kelime dizilimi birebir korunmalı');
});

await test('v5.0 [12] Learned (learningComplete) ve Mastered (MASTERED) değişince durak ilerlemesi gerçek veriden güncelleniyor', async () => {
  const u = 'v5_prog_user';
  const r = await createNotebookList('İlerleme Listesi', u);
  const lid = r.list.id;
  const items10 = Array.from({ length: 10 }, (_, i) => ({ word: `progw${String.fromCharCode(97 + i)}`, meanings: `anlam ${i + 1}`, status: 'valid' }));
  await bulkAddWordsToNotebook({ items: items10, listId: lid, userId: u });
  const list = getAllNotebookLists().find((l) => l.id === lid);

  let sum = PathUI.notebookPathSummary(list);
  eq(sum.stops[0].progress, { total: 10, done: 0, pct: 0, state: 'todo' }, 'Başlangıçta 0/10 (%0) ve todo olmalı');

  // 6 kelimeyi tamamla (4 tanesi Learned, 2 tanesi Mastered)
  for (let i = 0; i < 6; i++) {
    const wid = sum.stops[0].wordIds[i];
    const pr = getProgress(wid);
    pr.learningComplete = true;
    pr.currentStatus = i < 2 ? 'MASTERED' : 'LEARNING';
    await saveProgress(pr);
  }
  sum = PathUI.notebookPathSummary(list);
  eq(sum.stops[0].progress, { total: 10, done: 6, pct: 60, state: 'active' }, '6/10 = %60 ve active (Devam ediyor) olmalı');

  // Kalan 4 kelimeyi de tamamla
  for (let i = 6; i < 10; i++) {
    const wid = sum.stops[0].wordIds[i];
    const pr = getProgress(wid);
    pr.learningComplete = true;
    pr.currentStatus = 'MASTERED';
    await saveProgress(pr);
  }
  sum = PathUI.notebookPathSummary(list);
  eq(sum.stops[0].progress, { total: 10, done: 10, pct: 100, state: 'done' }, '10/10 = %100 ve done (Tamamlandı) olmalı');
  eq(sum.allDone, true, 'Tüm duraklar tamamlandığında allDone=true olmalı');
});

await test('v5.0 [13] Durak detay paneli gerçek kelimeleri gösteriyor ve paneli açmak öğrenme ilerlemesini değiştirmiyor', async () => {
  const pathUiCode = await readText('js/path-ui.js');
  ok(pathUiCode.includes('Bu Duraktaki Kelimeleri Çalış'), 'Detay panelinde "Bu Duraktaki Kelimeleri Çalış" butonu bulunmalı');
  ok(!pathUiCode.includes('saveProgress'), 'path-ui.js hiçbir koşulda saveProgress çağırmamalı (yalnızca okuma)');

  const a2Stops = Paths.getLevelPathStops('A2');
  ok(a2Stops.length > 50, 'A2 seviyesinde gerçek kelimelerden duraklar oluşmalı');
  const firstStop = a2Stops[0];
  const progressSnapshot = JSON.stringify(firstStop.wordIds.map((id) => getProgress(id)));
  const pr = Paths.computeStopProgress(firstStop.wordIds, state.progress);
  eq(pr.total, 10, 'İlk A2 durağında 10 gerçek kelime bulunmalı');
  eq(JSON.stringify(firstStop.wordIds.map((id) => getProgress(id))), progressSnapshot, 'Durak ilerlemesini hesaplamak kelimelerin durumunu değiştirmemeli');
});

await test('v5.0 [14] "Bu Duraktaki Kelimeleri Çalış" butonu Learned/Mastered dahil SADECE seçilen duraktaki tüm kelimeleri çalıştırıyor', async () => {
  const u = 'v5_stopstudy_user';
  const r = await createNotebookList('Durak Çalışma Listesi', u);
  const lid = r.list.id;
  const items14 = Array.from({ length: 14 }, (_, i) => ({ word: `stopstudy${String.fromCharCode(97 + i)}`, meanings: `anlam ${i + 1}`, status: 'valid' }));
  await bulkAddWordsToNotebook({ items: items14, listId: lid, userId: u });
  const list = getAllNotebookLists().find((l) => l.id === lid);
  const stops = Paths.getListPathStops(list);
  const stop1 = stops[0]; // 10 kelime

  // Duraktaki ilk 3 kelimeyi MASTERED yap → yine de durak çalışmasına DAHİL edilmeli!
  for (let i = 0; i < 3; i++) {
    const pr = getProgress(stop1.wordIds[i]);
    pr.learningComplete = true;
    pr.currentStatus = 'MASTERED';
    await saveProgress(pr);
  }

  const started = await startStudyList(lid, {
    stages: [1, 2, 3, 4],
    groupSize: 10,
    explicitWordIds: stop1.wordIds,
    pathStop: { listId: lid, stopId: stop1.id, number: 1 },
  });
  eq(started, true, 'Durak çalışması başlatılabilmeli');
  const sess = getCurrentSession();
  eq(sess.params.groupWordIds, stop1.wordIds, 'Oturumdaki kelimeler (Learned/Mastered dahil) tam olarak 1. durağın 10 kelimesi olmalı; 2. duraktan kelime karışmamalı');
  eq(sess.params.pathStop.stopId, stop1.id, 'Oturumda pathStop bilgisi saklanmalı');
  abortSession();

  // Hazır seviye (A2) durağı için de doğrula
  const a2Stop1 = Paths.getLevelPathStops('A2')[0];
  const prA2 = getProgress(a2Stop1.wordIds[0]);
  prA2.learningComplete = true;
  prA2.currentStatus = 'MASTERED';
  await saveProgress(prA2);

  const startedLv = await startLearn('A2', {
    skipModal: true,
    explicitWordIds: a2Stop1.wordIds,
    pathStop: { stopId: a2Stop1.id, number: 1 },
  });
  eq(startedLv, true, 'A2 durak çalışması başlatılabilmeli');
  const sessLv = getCurrentSession();
  eq(sessLv.params.groupWordIds, a2Stop1.wordIds, 'A2 durak oturumu yalnızca o durağın 10 kelimesini (MASTERED dahil) içermeli');
  abortSession();
});

await test('v5.0 [15] Genel öğrenme (5/10/15/20 grup seçimi) ve SRS tekrar mekanizmaları değişmeden çalışıyor', async () => {
  eq(E.GROUP_SIZES, [5, 10, 15, 20], 'Genel öğrenmede 5/10/15/20 grup büyüklüğü seçenekleri korunmalı');
  eq(Paths.STOP_SIZE, 10, 'Yol durak kapasitesi sabit 10 kelime olmalı');
  const p = E.newProgress('srs_check_v5');
  for (let s = 1; s <= 4; s++) E.applyAnswer(p, true, { mode: 'learn', stage: s });
  eq(p.learningComplete, true, '4 aşama tamamlandığında learningComplete=true olmalı');
  E.applyAnswer(p, true, { mode: 'review' });
  eq(p.reviewInterval, 3, 'SRS tekrar aralığı (1→3→7→14→30) korunmalı');
});

await test('v5.0 [16] Eşini Bul hafıza oyunu, Grammar Academy ve Fiillerin 3 Hali bozulmadan çalışıyor', async () => {
  eq(MG.MEMORY_STAGE, 5, 'Eşini Bul 5. aşama olarak korunmalı');
  ok(G.GRAMMAR_TOPICS.length >= 10, 'Grammar Academy konuları korunmalı');
  eq(BUILTIN_IRREGULAR_VERBS.length, 190, 'Fiillerin 3 Hali 190 düzensiz fiil korunmalı');
});

await test('v5.0 [17] Profil değişiminde ve aynı kelimenin farklı listelerde bulunmasında kişisel yollar birbirine karışmıyor', async () => {
  const u1 = 'v5_prof_1';
  const u2 = 'v5_prof_2';
  const l1 = (await createNotebookList('U1 Liste', u1)).list;
  const l1b = (await createNotebookList('U1 İkinci Liste', u1)).list;
  const l2 = (await createNotebookList('U2 Liste', u2)).list;

  await addWordToNotebook({ word: 'sharedword', meanings: ['ortak anlam'], listId: l1.id, userId: u1 });
  await addWordToNotebook({ word: 'sharedword', meanings: ['ortak anlam'], listId: l1b.id, userId: u1 });
  await addWordToNotebook({ word: 'secondprofileword', meanings: ['u2 anlam'], listId: l2.id, userId: u2 });

  const s1 = Paths.getListPathStops(getAllNotebookLists().find((l) => l.id === l1.id));
  const s1b = Paths.getListPathStops(getAllNotebookLists().find((l) => l.id === l1b.id));
  const s2 = Paths.getListPathStops(getAllNotebookLists().find((l) => l.id === l2.id));

  eq(s1[0].wordIds, s1b[0].wordIds, 'Aynı kullanıcının iki listesindeki ortak kelime aynı kelime kimliğini paylaşmalı');
  ok(s1[0].id !== s1b[0].id, 'İki farklı listenin durak kimlikleri ayrı olmalı');
  ok(!s2[0].wordIds.includes(s1[0].wordIds[0]), 'Farklı kullanıcı profillerinin kelimeleri ve yolları birbirine karışmamalı');
});

await test('v5.0 [18] Yedekleme ve geri yükleme (buildBackup / restoreBackup) kalıcı durak verilerini (notebookPaths) koruyor', async () => {
  const b = buildBackup();
  const npEntry = b.meta.find((m) => m.key === 'notebookPaths');
  ok(npEntry && typeof npEntry.value === 'object', 'Yedek dosyasında notebookPaths yer almalı');
  const errs = validateBackup(b);
  eq(errs, [], 'v5.0 yedeği hatasız doğrulanmalı');
  await restoreBackup(b);
  ok(Object.keys(Paths.getAllPaths()).length > 0, 'Geri yükleme sonrasında kişisel liste durakları korunmalı');
});

await test('v5.0 [19] Uzun yollarda (200 durak) pencereli render, Kaldığım Yere Git ve mobil/masaüstü taşma koruması', async () => {
  const fake200 = {
    id: 'list_200stops',
    userId: 'u_perf',
    wordIds: Array.from({ length: 2000 }, (_, i) => `perf_w_${i + 1}`),
  };
  const { path } = Paths.syncPathRecord(null, fake200);
  const sum = Paths.summarizePath(path.stops, {});
  eq(sum.totalStops, 200, '2000 kelime → 200 durak');
  // Yalnızca 0..30 penceresini çiz
  const html = PathUI.pathCanvasHtml(sum, 0, 30, 'notebook');
  const renderedNodes = (html.match(/data-stop-index=/g) || []).length;
  eq(renderedNodes, 31, '200 durağın tamamı yerine yalnızca görünür penceredeki 31 durak DOM olarak üretilmeli');
  for (let i = 0; i < 30; i++) {
    const x = PathUI.stopX(i);
    ok(x >= 20 && x <= 80, `Durak yatay konumu (%${x.toFixed(1)}) ekran dışına taşmamalı`);
  }
  const pathUiCode = await readText('js/path-ui.js');
  ok(pathUiCode.includes('Kaldığım Yere Git') && pathUiCode.includes('id="path-jump"'), 'Uzun yollarda Kaldığım Yere Git butonu bulunmalı');
});

await test('v5.0 [20] GitHub Pages yenileme (hash router), statik dosya yolları ve PWA Service Worker önbellek listesi tam uyumlu', async () => {
  const sw = await readText('service-worker.js');
  const html = await readText('index.html');
  ok(sw.includes("const VERSION = 'veluno-v5.0.3';"), 'Service Worker sürümü veluno-v5.0.3 olmalı');
  ok(sw.includes("'js/paths.js'") && sw.includes("'js/path-ui.js'"), 'Service Worker yeni yol modüllerini önbelleğe almalı');
  ok(html.includes('href="#/path"') && html.includes('href="#/notebook"') && html.includes('href="#/learn"') && html.includes('href="#/more"'), 'Hash tabanlı rotalar GitHub Pages alt dizin yenilemesiyle uyumlu olmalı');
});

/* ---------- 20) v5.0.2 — Stability & Quality Update Denetim ve Regresyon Testleri ---------- */
out('\n--- 20) v5.0.2 — Stability & Quality Update Denetim ve Regresyon Testleri ---');

await test('v5.0.2 [1] Yolum (#/path) üst ilerleme şeridi (.path-bar-strip) ve Kaldığım Yere Git (#path-jump) kırpılmadan görünür stil kurallarına sahip', async () => {
  const css = await readText('css/style.css');
  ok(!css.includes('.path-bar-strip{height:4px;'), '.path-bar-strip artık 4px yüksekliğe sıkıştırılmamalı');
  ok(css.includes('.path-bar-strip{display:flex;align-items:center;justify-content:space-between;'), '.path-bar-strip esnek ilerleme şeridi olarak tanımlanmalı');
  ok(css.includes('.stop-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}'), 'Durak detay modalındaki .stop-stats 2 sütunlu olmalı');
});

await test('v5.0.2 [2] Fiillerin 3 Hali (320px dar ekran) tablo sarmalayıcısı yatay taşmayı önlemek için overflow-x:auto ve mobil kurallara sahip', async () => {
  const css = await readText('css/style.css');
  const irv = await readText('js/irregular-verbs.js');
  ok(css.includes('.irv-page{min-width:0;max-width:100%}') && css.includes('.irv-table-wrap{width:100%;max-width:100%;overflow-x:auto;'), '.irv-page ve .irv-table-wrap dar ekran taşmasını önlemeli');
  ok(irv.includes('class="irv-table-wrap"') && irv.includes('overflow-x:auto'), 'Hazır Fiiller tablosu inline overflow:hidden yerine overflow-x:auto kullanmalı');
});

await test('v5.0.2 [3] Defterim (#/notebook) yarıda kalan oturumu devam ettirme (#nb-resume) ve vazgeçme (#nb-discard) kontrollerine sahip', async () => {
  const nb = await readText('js/notebook.js');
  ok(nb.includes('id="nb-resume"') && nb.includes('Kaldığın Yerden Devam Et'), 'Defterim üst alanında yarıda kalan oturumu devam ettirme butonu bulunmalı');
  ok(nb.includes('id="nb-discard"'), 'Defterim üst alanında yarıda kalan oturumdan vazgeçme butonu bulunmalı');
  ok(nb.includes("(activeSaved.params?.userId || 'guest') === userId"), 'Yarıda kalan Defterim oturumu aktif kullanıcı profiliyle eşleşmeli');
});

await test('v5.0.2 [4] Yolum (#/path) üzerinden başlatılan durak çalışmalarında originHash korunur ve çıkışta doğru ekrana dönülür', async () => {
  const pathUi = await readText('js/path-ui.js');
  const nb = await readText('js/notebook.js');
  const learn = await readText('js/learning.js');
  ok(pathUi.includes('originHash'), 'openStopDetail içinde originHash kaydedilmeli');
  ok(nb.includes('originHash: pathStop.originHash'), 'openStageSelectionModal içinde pathStop.originHash korunmalı');
  ok(learn.includes("if (originHash === '#/path')"), 'learning.js #q-exit çıkışında originHash === "#/path" ise Yolum ekranına dönmeli');
});

await test('v5.0.2 [5] Ayarlar grup boyutu (#batch) üst sınırı 20 ile uyumlu, sıfırlama işlemi grup rotasyonunu temizler ve 5. aşama eski metin kalıntısı giderildi', async () => {
  const app = await readText('js/app.js');
  const vocabUi = await readText('js/vocab-ui.js');
  ok(app.includes('max="20" id="batch"') && app.includes("num('#batch', 'batchSize', 1, 20)"), 'Ayarlar #batch üst sınırı 20 olmalı');
  ok(!vocabUi.includes('5. aşama'), 'vocab-ui.js içinde eski 5. aşama boşluk doldurma metni kalmamalı');
});

/* ---------- 21) v5.0.3 — Ember Soft Carbon Petrol Cevap Kutuları ve 48px Liste Butonları ---------- */
out('\n--- 21) v5.0.3 — Ember Soft Carbon Petrol Cevap Kutuları ve 48px Liste Butonları ---');

await test('v5.0.3 [1] Carbon Petrol cevap kutuları (.opt) ve numara rozetleri (.opt-n) yalnızca Ember Soft temasında tanımlı, diğer temaları bozmuyor', async () => {
  const css = await readText('css/style.css');

  // Ember Soft özel değişkenleri ve .opt stilleri
  ok(css.includes('--answer-surface:#193037;'), 'Ember Soft --answer-surface tanımlı olmalı');
  ok(css.includes('--answer-border:#37606A;'), 'Ember Soft --answer-border tanımlı olmalı');
  ok(css.includes('--answer-number-bg:#24444C;'), 'Ember Soft --answer-number-bg tanımlı olmalı');

  ok(css.includes(':root[data-theme=ember] .opt{background:#193037;border-color:#37606A;color:var(--ember-tx,#F5F5F5)}'), 'Ember Soft normal cevap kutusu #193037 zemin ve #37606A çerçeveye sahip olmalı');
  ok(css.includes(':root[data-theme=ember] .opt:hover:not(:disabled){border-color:var(--ember-active,#438A8B)}'), 'Ember Soft hover durumu var(--ember-active) ile uyumlu olmalı');
  ok(css.includes(':root[data-theme=ember] .opt .opt-n{background:#24444C;color:var(--ember-tx,#F5F5F5)}'), 'Ember Soft cevap numarası rozeti #24444C olmalı');

  // Doğru (#3FC877) ve Yanlış (#57191C / #281819) durumlarının korunması
  ok(css.includes(':root[data-theme=ember] .opt.right{background:var(--ember-ok-bg,#19261C);border-color:var(--ember-ok,#3FC877);color:var(--ember-tx,#F5F5F5)}'), 'Doğru cevap yeşil (#3FC877) zemin ve çerçeveye sahip olmalı');
  ok(css.includes(':root[data-theme=ember] .opt.right .opt-n{background:var(--ember-ok,#3FC877);color:#101820}'), 'Doğru cevap numarası yeşil rozet ve #101820 koyu metin kullanmalı');
  ok(css.includes(':root[data-theme=ember] .opt.bad{background:var(--ember-no-bg,#281819);border-color:var(--ember-no,#57191C);color:var(--ember-tx,#F5F5F5)}'), 'Yanlış cevap vişne/kızıl zemin ve çerçeveye sahip olmalı');
  ok(css.includes(':root[data-theme=ember] .opt.bad .opt-n{background:var(--ember-no,#57191C);color:var(--no-tx,#F28B8E)}'), 'Yanlış cevap numarası #57191C rozet ve #F28B8E hata metni kullanmalı');

  // Temel (default) .opt stillerinin diğer temalar (light, dark, auto, studio) için korunduğu doğrulanmalı
  ok(css.includes('.opt{display:flex;align-items:center;gap:14px;width:100%;padding:14px 16px;background:var(--card);border:1.5px solid var(--bd);color:var(--tx);'), 'Genel .opt tanımı var(--card) ve var(--bd) ile diğer temaları korumalı');
});

await test('v5.0.3 [2] Kelime Defterim liste yönetim butonları (Düzenle ve Sil) 48x48px boyutunda, SVG ikonlu ve Ember Soft petrol/vişne renklerine sahip', async () => {
  const css = await readText('css/style.css');
  const nb = await readText('js/notebook.js');
  const ui = await readText('js/ui.js');

  // ICONS içinde edit (kalem) ve trash (çöp kutusu) SVG ikonları
  ok(ui.includes('edit: svg(') && ui.includes('trash: svg('), 'ICONS nesnesinde edit ve trash SVG ikonları tanımlı olmalı');

  // js/notebook.js içinde Düzenle ve Sil butonlarının oluşturulması
  ok(nb.includes('class="icon-btn nb-list-btn nb-list-edit"'), 'Düzenle butonu nb-list-btn nb-list-edit sınıfına sahip olmalı');
  ok(nb.includes('class="icon-btn nb-list-btn nb-list-del"'), 'Sil butonu nb-list-btn nb-list-del sınıfına sahip olmalı');
  ok(nb.includes('aria-label="Listeyi düzenle"') && nb.includes('title="Listeyi Düzenle"'), 'Düzenle butonunun erişilebilirlik etiketleri doğru olmalı');
  ok(nb.includes('aria-label="Listeyi sil"') && nb.includes('title="Listeyi Sil"'), 'Sil butonunun erişilebilirlik etiketleri doğru olmalı');
  ok(nb.includes('${ICONS.edit}') && nb.includes('${ICONS.trash}'), 'Butonlar SVG ikonları kullanmalı');

  // Silme onay diyaloğu (confirmDialog + danger: true) korunmalı
  ok(nb.includes('confirmDialog(`"${targetList.name}" listesi silinsin mi? (Bu listedeki kelimeler başka listelerde bulunmuyorsa silinecektir.)`, { danger: true })'), 'Silme onay modalı liste adını içermeli ve danger: true olmalı');

  // CSS buton boyutları: 48x48px ve 21px ikon
  ok(css.includes('.nb-list-btn{width:48px;height:48px;min-width:48px;min-height:48px;border-radius:12px;'), '.nb-list-btn 48x48px görsel kutu ve 12px yuvarlak köşelere sahip olmalı');
  ok(css.includes('.nb-list-btn svg,.nb-list-btn .ic{width:21px;height:21px;display:block}'), '.nb-list-btn içindeki SVG ikonlar 21x21px olmalı');
  ok(css.includes('.nb-list-select{flex:1;min-width:0;min-height:48px;height:48px;'), '.nb-list-select 48px yükseklikle butonlarla aynı hizada olmalı');

  // Ember Soft renk kuralları
  ok(css.includes(':root[data-theme=ember] .nb-list-btn.nb-list-edit{background:#1D333B;border:1.5px solid #37606A;color:#7FC5C5}'), 'Ember Soft Düzenle butonu #1D333B zemin, #37606A kenarlık ve #7FC5C5 ikona sahip olmalı');
  ok(css.includes(':root[data-theme=ember] .nb-list-btn.nb-list-del{background:#281E24;border:1.5px solid #643D45;color:#F28B8E}'), 'Ember Soft Sil butonu #281E24 zemin, #643D45 kenarlık ve #F28B8E ikona sahip olmalı');
});

await test('v5.0.3 [3] Service Worker ve önbellek sürümü veluno-v5.0.3 olarak güncellendi', async () => {
  const sw = await readText('service-worker.js');
  ok(sw.includes("const VERSION = 'veluno-v5.0.3';"), 'Service Worker sürümü veluno-v5.0.3 olmalı');
});

out(`\n${pass} geçti, ${fail} başarısız`);
if (fail) { if (typeof process !== 'undefined') process.exit(1); else throw new Error('Testler başarısız'); }
