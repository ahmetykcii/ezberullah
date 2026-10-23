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
import { handlers } from '../js/learning.js';
import '../js/review.js';
import { buildExamItems } from '../js/exams.js';
import { studyPlan, candidates, reviewItems } from '../js/review.js';
import { levelStats, streak, streakStats, todayLearnedCount, getMistakeAnalytics, bumpDaily } from '../js/statistics.js';
import { DEFAULT_SETTINGS, getSettings, setSetting, getMeta, setMeta, getGrammarProgress, saveGrammarProgress } from '../js/storage.js';
import { resumeSaved } from '../js/learning.js';
import * as G from '../js/grammar.js';
import '../js/vocab-ui.js';
import { resolveTheme } from '../js/app.js';

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
  for (const label of ['Ana Sayfa', 'Kelime Öğren', 'Tekrar', 'Grammar', 'Kelime Havuzum', 'Sınavlar', 'İstatistikler', 'Ayarlar']) {
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
await test('6 aşama tamamlanınca learningComplete olur ama MASTERED olmaz', () => {
  const p = E.newProgress('t1'); const t0 = 1e12;
  for (let s = 2; s <= 6; s++) E.applyAnswer(p, true, { mode: 'learn', stage: s }, t0);
  ok(p.learningComplete); eq(p.currentStage, 6); ok(p.currentStatus === 'LEARNING'); eq(p.nextReviewAt, t0 + E.DAY);
});
await test('3. aşamada hata → REVIEW, hata kaydı, aşama ilerlemez, geçmiş silinmez', () => {
  const p = E.newProgress('t2'); E.markSeen(p); E.applyAnswer(p, true, { mode: 'learn', stage: 2 });
  E.applyAnswer(p, false, { mode: 'learn', stage: 3, qtype: 'typing' });
  eq(p.currentStatus, 'REVIEW'); eq(p.incorrectCount, 1); eq(p.correctCount, 1); eq(p.currentStage, 2);
  eq(p.mistakeHistory.length, 1); eq(p.mistakeHistory[0].stage, 3);
});
await test('SRS: başarılı tekrar aralığı uzatır (1→3→7→14→30), hata kısaltır', () => {
  const p = E.newProgress('t3'); let now = 1e12;
  for (let s = 2; s <= 6; s++) E.applyAnswer(p, true, { mode: 'learn', stage: s }, now);
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
  const items = E.learnItems(b, prog); ok(items.some((i) => i.stage === 6));
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
  ok(E.learnBatch(state.words.filter((w) => w.level === 'B2'), state.progress, 500).some((w) => w.id === r.word.id), 'tamamlanan kelime learnBatch içine girmeli');
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
await test('Learn handler: 6 aşama, yanlış → REVIEW + drop, günlük istatistik kaydı', async () => {
  const w = data.A2[0];
  const item = (stage, type) => ({ wordId: w.id, stage, type });
  await handlers.learn.onAnswer(item(1, 'card'), true, { elapsed: 1 });
  await handlers.learn.onAnswer(item(2, 'mc'), true, { elapsed: 3 });
  const r = await handlers.learn.onAnswer(item(3, 'typing'), false, { elapsed: 5 });
  ok(r.drop === true);
  let p = getProgress(w.id); eq(p.currentStatus, 'REVIEW'); eq(p.currentStage, 2); eq(p.incorrectCount, 1);
  await handlers.learn.onAnswer(item(3, 'typing'), true, { elapsed: 2 }); await handlers.learn.onAnswer(item(4, 'missing'), true, { elapsed: 2 });
  await handlers.learn.onAnswer(item(5, 'sentence'), true, { elapsed: 2 }); await handlers.learn.onAnswer(item(6, 'production'), true, { elapsed: 2 });
  p = getProgress(w.id); ok(p.learningComplete); eq(p.currentStatus, 'LEARNING'); eq(p.incorrectCount, 1, 'geçmiş korunmalı'); eq(p.mistakeHistory.length, 1);
  const day = Object.values(state.daily)[0]; ok(day.correct >= 5 && day.wrong === 1 && day.newWords === 1 && day.seconds > 0);
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

out('6) A2 + B1 Veri Paketi Entegrasyonu (1.306 Aktif + 14 Taslak | Toplam 1.320 Kayıt), Cevap Kuralları ve Önbellek');
await test('1.306 aktif kelime ve 14 taslak kelime (toplam 1.320 yerleşik kayıt) doğrulandı', () => {
  eq(data.A2.length, 496); eq(data.A2.filter((w) => !w.isDraft).length, 484); eq(data.A2.filter((w) => w.isDraft).length, 12);
  eq(data.B1.length, 563); eq(data.B1.filter((w) => !w.isDraft).length, 561); eq(data.B1.filter((w) => w.isDraft).length, 2);
  eq(data.B2.length, 261); eq(data.B2.filter((w) => !w.isDraft).length, 261); eq(data.B2.filter((w) => w.isDraft).length, 0);
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
await test('Service Worker önbellek sürümü (veluno-v4.1.0) ve önbellek dosya listesi güncellendi', async () => {
  const sw = await readText('service-worker.js');
  ok(sw.includes("const VERSION = 'veluno-v4.1.0';"), 'SW sürümü veluno-v4.1.0 olmalı');
  for (const f of ['index.html', 'manifest.webmanifest', 'manifest.json', 'css/style.css', 'js/app.js', 'js/grammar-data.js', 'js/grammar.js', 'data/a2.json', 'data/b1.json', 'data/b2.json', 'assets/icons/icon.svg', 'assets/icons/logo-full.svg', 'assets/icons/apple-touch-icon.png', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/icon-maskable-512.png']) {
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

  ok(appCode.includes('<h1 class="hero-title" aria-label="VELUNO">VELUNO</h1>'), 'Ana sayfada VELUNO başlığı bulunmalı');
  ok(appCode.includes('<span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span>'), 'Ana sayfada küçük harfli ahmet ❤️ sude imzası dokunulmadan korunmalı');
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
await test('yeni A2 pilot kelimeleri öğrenme oturumlarında (learnBatch + 6 aşama: mc, typing, missing, sentence, production) tam uyumlu çalışır', async () => {
  // İlk 46 kelimeyi tamamlanmış varsayalım ki learnBatch doğrudan yeni pilot kelimeleri seçsin
  const customProg = {};
  for (let i = 0; i < 46; i++) {
    customProg[data.A2[i].id] = { ...E.newProgress(data.A2[i].id), learningComplete: true, currentStatus: 'LEARNING', currentStage: 6 };
  }
  const batch = E.learnBatch(data.A2, customProg, 5);
  eq(batch.length, 5);
  ok(batch.every((w) => !customProg[w.id]?.learningComplete), 'Tamamlanmış ilk 46 kelime dışındaki yeni kelimeler seçilmeli');
  const items = E.learnItems(batch, customProg);
  eq(items.length, 30); // 5 kelime x 6 aşama

  // Yeni pilot kelimelerden biriyle (a2-abroad-047) gerçek 6 aşamalı oturum ve soru doğrulaması
  const pw = data.A2[46]; // a2-abroad-047
  eq(pw.id, 'a2-abroad-047');
  for (const t of ['mc', 'typing', 'missing', 'sentence', 'production']) {
    const q = E.buildQuestion(pw, t, data.A2);
    eq(q.type, t);
    if (t === 'mc') ok(E.checkAnswer(q, q.answerIndex));
    else if (t === 'production') ok(E.checkAnswer(q, `They want to live ${pw.word} next year.`));
    else ok(E.checkAnswer(q, pw.word));
  }

  // Oturum ilerlemesini kaydet
  const item = (stage, type) => ({ wordId: pw.id, stage, type });
  await handlers.learn.onAnswer(item(1, 'card'), true, { elapsed: 1 });
  await handlers.learn.onAnswer(item(2, 'mc'), true, { elapsed: 2 });
  await handlers.learn.onAnswer(item(3, 'typing'), true, { elapsed: 2 });
  await handlers.learn.onAnswer(item(4, 'missing'), true, { elapsed: 2 });
  await handlers.learn.onAnswer(item(5, 'sentence'), true, { elapsed: 2 });
  await handlers.learn.onAnswer(item(6, 'production'), true, { elapsed: 2 });
  const p = getProgress(pw.id);
  ok(p.learningComplete && p.currentStage === 6 && p.correctCount === 5, 'Pilot kelime 6 aşamayı tamamlamalı');
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

  // 3) learnItems: 2..6 aşamalarında grup içindeki kelime sırası da karıştırılır
  const sampleBatch = E.learnBatch(data.A2, {}, 5);
  const lItems = E.learnItems(sampleBatch, {});
  eq(lItems.length, 30);
  const stageOrders = [1, 2, 3, 4, 5, 6].map((s) => lItems.filter((i) => i.stage === s).map((i) => i.wordId).join(','));
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
  const testDate = '2026-10-23';
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
  const nextDate = '2026-10-24';
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

await test('v3.1 Ana sayfa (Learning Home): tek ana eylem, günlük hedef, devam et ve ahmet ❤️ sude imzasının korunması', async () => {
  const appCode = await readText('js/app.js');
  const css = await readText('css/style.css');

  ok(appCode.includes('Bugünkü Hedefin:'), 'Ana sayfada Günlük Hedef satırı bulunmalı');
  ok(appCode.includes('[5, 10, 15, 20]') && appCode.includes('data-set-goal='), 'Günlük hedef seçenekleri (5, 10, 15, 20, Özel) bulunmalı');
  ok(appCode.includes('Günlük Seri:'), 'Ana sayfada tek satırlık seri bilgisi bulunmalı');
  ok(appCode.includes('Öğrenmeye Devam Et') && appCode.includes('Kaldığın Yerden Devam Et'), 'Ana sayfada birincil eylem bulunmalı');
  ok(appCode.includes('ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude'), 'ahmet ❤️ sude özel imzası korunmalı');
  ok(appCode.includes('<h1 class="hero-title" aria-label="VELUNO">VELUNO</h1>'), 'Ana sayfada VELUNO başlığı bulunmalı');
  ok(!appCode.includes('class="grid stats"') && !appCode.includes('smart-grid'), 'Ana sayfada dashboard kart ızgarası kalmamalı');
  ok(css.includes('.today{') && css.includes('.cta-block{'), 'Learning Home CSS kuralları bulunmalı');
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

await test('v3.1 Gezinme: mobil alt menüde 5 bölüm, SVG ikonlar, emoji yok, "Diğer" sayfası ile ikincil bölümlere erişim', async () => {
  const html = await readText('index.html');
  const appCode = await readText('js/app.js');
  const bottom = html.slice(html.indexOf('<nav id="bottomnav"'), html.indexOf('</nav>', html.indexOf('<nav id="bottomnav"')));
  eq((bottom.match(/data-nav=/g) || []).length, 5, 'Alt menüde tam 5 bölüm olmalı');
  ok(bottom.includes('data-nav="more"'), 'Alt menüde Diğer bulunmalı');
  ok(!/[\u{1F300}-\u{1FAFF}\u2699\u2600-\u27BF]/u.test(html.slice(html.indexOf('<aside'), html.indexOf('<div id="modal-root"'))), 'Navigasyonda emoji kullanılmamalı');
  ok(bottom.includes('<svg viewBox="0 0 24 24"'), 'Alt menü SVG ikon kullanmalı');
  for (const r of ['dashboard', 'learn', 'review', 'grammar', 'more', 'vocabulary', 'exams', 'statistics', 'settings']) ok(appCode.includes(`${r}:`), `Rota korunmalı: ${r}`);
  for (const r of ['vocabulary', 'exams', 'statistics', 'settings']) ok(appCode.includes(`item('#/${r}'`), `Diğer sayfasından erişilebilmeli: ${r}`);
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

await test('v2.2 [18] Vocabulary sisteminin (1.320 kelime, SRS, günlük hedef, streak) Grammar işlemlerinden etkilenmemesi', () => {
  const allData = [...data.A2, ...data.B1, ...data.B2];
  eq(allData.length, 1320, 'Veri dosyalarındaki 1.320 yerleşik kelime kaydı eksiksiz korunmalı');
  eq(allData.filter((w) => !w.isDraft).length, 1306, 'Veri dosyalarındaki 1.306 aktif kelime sayısı doğrulanmalı');
  eq(allData.filter((w) => w.isDraft).length, 14, 'Veri dosyalarındaki 14 taslak kelime sayısı doğrulanmalı');
  eq(state.words.length, 1320, 'state.words içindeki toplam kelime sayısı değişmemeli');
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

await test('v3.2 [14] Veri ve İmza Bütünlüğü: 1.320 kelime (1.306 aktif + 14 taslak), 38 grammar konusu, 760 soru ve "ahmet ❤️ sude" imzası aynen korunur', async () => {
  const allDataWords = [...data.A2, ...data.B1, ...data.B2];
  eq(allDataWords.length, 1320, 'Toplam 1.320 kelime korunmalı');
  eq(allDataWords.filter((w) => !w.isDraft).length, 1306, '1.306 aktif kelime korunmalı');
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

await test('v4.0 [9] PWA ve Çevrimdışı Uyumluluk: Service Worker sürümü veluno-v4.1.0 olarak güncellenmiştir', async () => {
  const sw = await readText('service-worker.js');
  ok(sw.includes("const VERSION = 'veluno-v4.1.0';"), 'SW sürümü veluno-v4.1.0 olmalı');
});

out('\n10) VELUNO v4.1 — Vocabulary Expansion / Phase D (375 Taslak Aktivasyonu & 1.306 Aktif Kelime)');

await test('v4.1 [1] 375 Taslak Kelimenin Eksiksiz İçerikle Aktifleşmesi (Hedef: 1.306 Aktif Kelime)', () => {
  const allDataWords = [...data.A2, ...data.B1, ...data.B2];
  eq(allDataWords.length, 1320, 'Toplam kelime sayısı 1.320 olarak korunmalı');
  const activeWords = allDataWords.filter((w) => !w.isDraft);
  const draftWords = allDataWords.filter((w) => w.isDraft);
  eq(activeWords.length, 1306, 'Toplam 1.306 aktif kelime bulunmalı');
  eq(draftWords.length, 14, 'Toplam 14 taslak kelime korunmalı');

  const a2Active = data.A2.filter((w) => !w.isDraft);
  const b1Active = data.B1.filter((w) => !w.isDraft);
  const b2Active = data.B2.filter((w) => !w.isDraft);
  eq(a2Active.length, 484, 'A2 seviyesinde 484 aktif kelime olmalı');
  eq(b1Active.length, 561, 'B1 seviyesinde 561 aktif kelime olmalı');
  eq(b2Active.length, 261, 'B2 seviyesinde 261 aktif kelime olmalı');

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

await test('v4.1 [3] 1.306 Aktif Kelimenin Tamamı 6 Aşamalı Öğrenme, SRS ve Sınav Sistemleriyle Tam Uyumlu', () => {
  const allActive = [...data.A2, ...data.B1, ...data.B2].filter((w) => !w.isDraft);
  eq(allActive.length, 1306);
  for (const w of allActive) {
    ok(w.exampleSentence && w.exampleSentence.length >= 15, `${w.id} örnek cümle yeterli uzunlukta olmalı`);
    ok(w.exampleTranslation && w.exampleTranslation.length >= 10, `${w.id} çeviri yeterli uzunlukta olmalı`);
    ok(isWordReady(w), `${w.id} hazır olmalı`);
    ok(E.blankSentence(w), `${w.id} boşluk cümlesi üretebilmeli`);
  }
});

out(`\n${pass} geçti, ${fail} başarısız`);
if (fail) { if (typeof process !== 'undefined') process.exit(1); else throw new Error('Testler başarısız'); }
