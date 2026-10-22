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
import { studyPlan, candidates } from '../js/review.js';
import { levelStats, streak } from '../js/statistics.js';
import '../js/vocab-ui.js';
import '../js/app.js';

const out = typeof print === 'function' ? print : console.log;
if (typeof console === 'undefined') globalThis.console = { log: out, warn: () => {}, error: out };
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
  ok(appCode.includes('id="replay-intro"'), 'replay-intro butonu bulunmalı');
  const html = await readText('index.html');
  for (const label of ['Ana Sayfa', 'Kelime Öğren', 'Akıllı Tekrar', 'Kelime Havuzum', 'Sınavlar', 'İstatistikler', 'Ayarlar']) {
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

out('6) A2 + B1 Veri Paketi Entegrasyonu (931 Aktif + 389 Taslak | Toplam 1.320 Kayıt), Cevap Kuralları ve Önbellek');
await test('mevcut 931 aktif kelime ve 18 A2 taslağı korundu; 371 yeni B1 taslak kelime eklendi', () => {
  eq(data.A2.length, 496); eq(data.A2.filter((w) => !w.isDraft).length, 478); eq(data.A2.filter((w) => w.isDraft).length, 18);
  eq(data.B1.length, 563); eq(data.B1.filter((w) => !w.isDraft).length, 192); eq(data.B1.filter((w) => w.isDraft).length, 371);
  eq(data.B2.length, 261); eq(data.B2.filter((w) => !w.isDraft).length, 261); eq(data.B2.filter((w) => w.isDraft).length, 0);
  // neighbor bağımsız aktif kart olmamalı, neighbour alternativeAnswers korunmalı
  const neighbourOrig = data.A2.find((w) => w.id === 'a2-neighbour-027');
  ok(neighbourOrig && !neighbourOrig.isDraft && neighbourOrig.alternativeAnswers.includes('neighbor'));
  const neighborDup = data.A2.find((w) => w.id === 'a2-oxref-0125');
  ok(neighborDup && neighborDup.isDraft === true && !isWordReady(neighborDup), 'neighbor taslakta kalmalı');
});
await test('yeni aktifleşen 204 A2 kelimesinin tamamı boşluk doldurma ve 5 soru tipiyle (mc, typing, missing, sentence, production) tam uyumlu', () => {
  const all = [...data.A2, ...data.B1, ...data.B2];
  const newlyActivated = data.A2.slice(274).filter((w) => !w.isDraft);
  eq(newlyActivated.length, 204);
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
await test('18 A2 taslağı ve 371 B1 taslağı (toplam 389 taslak) öğrenme ve sınav sistemlerinde gösterilmez', () => {
  const heldA2 = data.A2.filter((w) => w.isDraft);
  const heldB1 = data.B1.filter((w) => w.isDraft);
  eq(heldA2.length, 18);
  eq(heldB1.length, 371);
  ok(heldA2.every((w) => w.isDraft === true && !isWordReady(w)), '18 A2 kelimesi taslak olmalı');
  ok(heldB1.every((w) => w.isDraft === true && !isWordReady(w)), '371 B1 kelimesi taslak olmalı');
  const batchA2 = E.learnBatch(state.words.filter((w) => w.level === 'A2'), state.progress, 2000);
  ok(batchA2.every((w) => !w.isDraft && isWordReady(w)), 'A2 learnBatch içinde taslak kelime olmamalı');
  const batchB1 = E.learnBatch(state.words.filter((w) => w.level === 'B1'), state.progress, 2000);
  ok(batchB1.every((w) => !w.isDraft && isWordReady(w)), 'B1 learnBatch içinde taslak kelime olmamalı');
  const examItemsA2 = buildExamItems('final', 'A2');
  ok(examItemsA2.every((i) => !state.wordMap.get(i.wordId)?.isDraft), 'A2 sınavında taslak kelime olmamalı');
  const examItemsB1 = buildExamItems('final', 'B1');
  ok(examItemsB1.every((i) => !state.wordMap.get(i.wordId)?.isDraft), 'B1 sınavında taslak kelime olmamalı');
  const draftsInFilter = filterWords({ status: 'DRAFT' });
  eq(draftsInFilter.filter((w) => !w.custom).length, 389, 'Tüm 389 yerleşik taslak kelime DRAFT filtresinde görünmeli');
});
await test('önceden IndexedDB\'de taslak (isDraft:true) olan yerleşik kelime seedBuiltIn ile otomatik aktifleşir ve ilerleme korunur', async () => {
  const target = state.wordMap.get('a2-oxref-0031'); // explain
  target.isDraft = true;
  ok(!isWordReady(target));
  const res = await seedBuiltIn(loader);
  ok(res.added >= 1, 'Taslaktan aktife geçen yerleşik kelime güncellenmeli');
  ok(state.wordMap.get('a2-oxref-0031').isDraft === false && isWordReady(state.wordMap.get('a2-oxref-0031')));
});
await test('Service Worker önbellek sürümü (ezberullah-v2.0.0) ve önbellek dosya listesi güncellendi', async () => {
  const sw = await readText('service-worker.js');
  ok(sw.includes("const VERSION = 'ezberullah-v2.0.0';"), 'SW sürümü ezberullah-v2.0.0 olmalı');
  for (const f of ['index.html', 'manifest.webmanifest', 'manifest.json', 'css/style.css', 'js/app.js', 'data/a2.json', 'data/b1.json', 'data/b2.json', 'assets/icons/icon.svg', 'assets/icons/apple-touch-icon.png', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/icon-maskable-512.png']) {
    ok(sw.includes(`'${f}'`), 'SW FILES içinde eksik dosya: ' + f);
  }
});
await test('EZBERULLAH marka dönüşümü, yeni ikonlar ve "ahmet ❤️ sude" özel imzası doğrulandı', async () => {
  const html = await readText('index.html');
  const appCode = await readText('js/app.js');
  const css = await readText('css/style.css');
  const mf1 = await readJSON('manifest.webmanifest');
  const mf2 = await readJSON('manifest.json');
  const svgIcon = await readText('assets/icons/icon.svg');

  ok(html.includes('<title>EZBERULLAH'), 'Tarayıcı sekmesi başlığı EZBERULLAH olmalı');
  ok(html.includes('✦ EZBERULLAH ✦'), 'Açılış ekranında EZBERULLAH imzası bulunmalı');
  ok(html.includes('<b class="brand-name">EZBERULLAH</b>'), 'Sol menüde EZBERULLAH başlığı bulunmalı');
  ok(!html.includes('LEXORA'), 'index.html içinde eski LEXORA adı kalmamalı');
  ok(!html.includes('ahmet') && !html.includes('sude'), 'ahmet ❤️ sude imzası index.html / kenar çubuğunda değil yalnızca Ana Sayfada olmalı');

  eq(mf1.short_name, 'EZBERULLAH');
  ok(mf1.name.startsWith('EZBERULLAH'));
  eq(mf2.short_name, 'EZBERULLAH');
  ok(mf1.icons.some((i) => i.src === 'assets/icons/apple-touch-icon.png' && i.sizes === '180x180'));
  ok(svgIcon.includes('aria-label="EZBERULLAH"'), 'Yeni SVG ikonu EZBERULLAH olmalı');

  ok(appCode.includes('<h1 class="hero-title">EZBERULLAH</h1>'), 'Ana sayfada büyük EZBERULLAH başlığı bulunmalı');
  ok(appCode.includes('<span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span>'), 'Ana sayfada küçük harfli ahmet ❤️ sude imzası bulunmalı');
  ok(css.includes('.hero-sig{') && css.includes('text-transform:lowercase') && css.includes('font-weight:300') && css.includes('align-self:flex-end'), 'İmza CSS kuralları (küçük harf, ince font, sağ alt hiza) bulunmalı');
  ok(css.includes('.sig-heart{color:#EF4444'), 'Kalp kırmızı renkte (#EF4444) tanımlanmalı');
});
await test('iPhone / Safari uyumluluğu (safe-area, viewport-fit, apple-touch-icon, klavye ve TTS) doğrulandı', async () => {
  const html = await readText('index.html');
  const css = await readText('css/style.css');
  const uiCode = await readText('js/ui.js');
  const learnCode = await readText('js/learning.js');

  ok(html.includes('viewport-fit=cover'), 'viewport-fit=cover bulunmalı');
  ok(html.includes('name="apple-mobile-web-app-capable" content="yes"'), 'iOS web-app meta etiketi bulunmalı');
  ok(html.includes('name="apple-mobile-web-app-title" content="EZBERULLAH"'), 'iOS ana ekran başlığı EZBERULLAH olmalı');
  ok(html.includes('rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png"'), '180x180 apple-touch-icon bağlantısı bulunmalı');
  ok(css.includes('env(safe-area-inset-top)') && css.includes('env(safe-area-inset-bottom)'), 'Safari safe-area boşlukları bulunmalı');
  ok(css.includes('body.kb-open #bottomnav{display:none}'), 'Mobil klavye açıldığında alt menü gizlenmeli');
  ok(css.includes('font-size:max(16px,1rem)'), 'iOS Safari otomatik yakınlaştırmasını önleyen >=16px font kuralı bulunmalı');
  ok(uiCode.includes('NOVELTY_VOICES') && uiCode.includes('PREFERRED_VOICES'), 'iOS Safari doğal İngilizce ses seçimi bulunmalı');
  ok(learnCode.includes('enterkeyhint="done"'), 'iPhone klavyesi için enterkeyhint="done" bulunmalı');

  // Hem yeni EZBERULLAH hem eski LEXORA yedekleri geçerli kabul edilmeli
  const b = buildBackup();
  eq(b.app, 'EZBERULLAH');
  eq(validateBackup(b), []);
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
  ok(batch.every((w) => parseInt(w.id.split('-').pop(), 10) >= 47), 'Yeni pilot kelimeler seçilmeli');
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

out(`\n${pass} geçti, ${fail} başarısız`);
if (fail) { if (typeof process !== 'undefined') process.exit(1); else throw new Error('Testler başarısız'); }
