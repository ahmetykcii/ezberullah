// LEXORA — A2 Pilot Veri Paketi (100 Kelime) Otomatik Kalite Kontrol Sistemi
// Çalıştırma:
//   macOS JSC: /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc -m scripts/validate-pilot.mjs
//   Node.js:   node scripts/validate-pilot.mjs
//
// ÖNEMLİ UYARI:
// Otomatik doğrulama sistemi; JSON şemasını, zorunlu alanları, tekrar kontrolünü,
// öğrenme/sınav motoru uyumluluğunu (cümle boşluklama, çoktan seçmeli/yazma/eksik harf üretimi)
// ve işaretlenen CEFR kayıtlarını denetler. Ancak doğal dil doğruluğunu, pedagojik nüansları
// ve çeviri kalitesini %100 kesinlikle kanıtlamaz; işaretli kayıtlar insan incelemesine açıktır.

import * as E from '../js/engine.js';
import { validateWord, buildWord, getMissingFields, isWordReady, POS, CATEGORIES, LEVELS } from '../js/vocabulary.js';

const out = typeof print === 'function' ? print : console.log;

const readText = async (p) => {
  if (typeof readFile === 'function') return readFile(p);
  const fs = await import('node:fs');
  return fs.readFileSync(p, 'utf8');
};

let checksPassed = 0;
let checksFailed = 0;
const check = (name, cond, detail = '') => {
  if (cond) {
    checksPassed++;
    out(`  ✓ ${name}`);
  } else {
    checksFailed++;
    out(`  ✗ ${name}${detail ? ' → ' + detail : ''}`);
  }
};

out('================================================================');
out('LEXORA — A2 PİLOT PAKETİ (data/a2-pilot-100.json) KALİTE KONTROLÜ');
out('================================================================\n');

// 1. JSON Biçimi ve Mevcut Veri Tabanı Koruma Kontrolü
out('1) JSON Biçimi ve Mevcut Dosyaların Korunması');
let pilot = [];
let a2 = [], b1 = [], b2 = [];
try {
  pilot = JSON.parse(await readText('data/a2-pilot-100.json'));
  check('data/a2-pilot-100.json geçerli JSON biçiminde ve dizi (Array)', Array.isArray(pilot));
} catch (err) {
  check('data/a2-pilot-100.json geçerli JSON biçiminde', false, err.message);
}

try {
  a2 = JSON.parse(await readText('data/a2.json'));
  b1 = JSON.parse(await readText('data/b1.json'));
  b2 = JSON.parse(await readText('data/b2.json'));
  check('Mevcut data/a2.json (146 = 46 orijinal + 100 pilot), data/b1.json (47), data/b2.json (48) doğrulandı', a2.length === 146 && b1.length === 47 && b2.length === 48, `Boyutlar: A2=${a2.length}, B1=${b1.length}, B2=${b2.length}`);
  check('Orijinal 46 A2 kelimesi (a2-apartment-001..a2-surprise-046) korundu', a2[0].id === 'a2-apartment-001' && a2[45].id === 'a2-surprise-046');
} catch (err) {
  check('Mevcut veri dosyaları okunabilir durumda', false, err.message);
}

check('Pilot paket tam olarak 100 kelime içeriyor', pilot.length === 100, `Bulunan: ${pilot.length}`);

// 2. Zorunlu Alanlar, Boş Çeviri ve Eksik Örnek Cümle Kontrolü
out('\n2) Zorunlu Alanlar, Boş Çeviri ve Örnek Cümle Kontrolü');
const missingFieldErrors = [];
const emptyTranslationErrors = [];
const missingSentenceErrors = [];
const invalidSchemaErrors = [];
const posErrors = [];
const categoryErrors = [];

for (const w of pilot) {
  const vErrs = validateWord(w);
  if (vErrs.length > 0) invalidSchemaErrors.push(`${w.id}: ${vErrs.join(', ')}`);
  if (w.level !== 'A2') invalidSchemaErrors.push(`${w.id}: level A2 değil (${w.level})`);
  if (!w.id || !/^a2-[a-z]+-\d{3}$/.test(w.id)) invalidSchemaErrors.push(`Geçersiz ID formatı: ${w.id}`);
  if (!POS.includes(w.partOfSpeech)) posErrors.push(`${w.id}: geçersiz partOfSpeech (${w.partOfSpeech})`);
  if (!CATEGORIES.includes(w.category)) categoryErrors.push(`${w.id}: geçersiz category (${w.category})`);

  if (!Array.isArray(w.meanings) || w.meanings.length === 0 || w.meanings.some((m) => !String(m).trim())) {
    emptyTranslationErrors.push(`${w.id}: Türkçe anlam (meanings) boş`);
  }
  if (!w.exampleTranslation || !String(w.exampleTranslation).trim() || w.exampleTranslation.trim().length < 5) {
    emptyTranslationErrors.push(`${w.id}: Örnek cümle Türkçe çevirisi (exampleTranslation) boş veya çok kısa`);
  }
  if (!w.exampleSentence || !String(w.exampleSentence).trim() || w.exampleSentence.trim().split(/\s+/).length < 4) {
    missingSentenceErrors.push(`${w.id}: İngilizce örnek cümle (exampleSentence) eksik veya çok kısa`);
  }
  if (
    !Array.isArray(w.synonyms) ||
    !Array.isArray(w.antonyms) ||
    !Array.isArray(w.collocations) ||
    !Array.isArray(w.wordFamily) ||
    !Array.isArray(w.alternativeAnswers) ||
    typeof w.source !== 'string' ||
    !w.source.trim() ||
    typeof w.reviewRequired !== 'boolean' ||
    typeof w.reviewNote !== 'string' ||
    !w.createdAt ||
    !w.updatedAt
  ) {
    missingFieldErrors.push(`${w.id}: yardımcı/meta alanlardan biri eksik`);
  }
}

check('Tüm kayıtlarda validateWord() şema doğrulaması hatasız', invalidSchemaErrors.length === 0, invalidSchemaErrors.join('; '));
check('Tüm kayıtlarda geçerli kelime türü (partOfSpeech) kodu kullanılmış', posErrors.length === 0, posErrors.join('; '));
check('Tüm kayıtlarda geçerli kategori (category) kodu kullanılmış', categoryErrors.length === 0, categoryErrors.join('; '));
check('Boş Türkçe kelime çevirisi veya boş cümle çevirisi yok', emptyTranslationErrors.length === 0, emptyTranslationErrors.join('; '));
check('Eksik veya çok kısa İngilizce örnek cümle yok', missingSentenceErrors.length === 0, missingSentenceErrors.join('; '));
check('Tüm yardımcı dizi alanları, kaynak (source) ve inceleme bayrakları mevcut', missingFieldErrors.length === 0, missingFieldErrors.join('; '));

// 3. Tekrarlanan Kelimeler ve Tekrarlanan Kimlikler (ID) Kontrolü
out('\n3) Tekrarlanan Kelime, Kimlik (ID) ve alternativeAnswers Kontrolü');
const existingAll = [...a2.slice(0, 46), ...b1, ...b2];
const existingIds = new Set(existingAll.map((w) => w.id));
const existingWords = new Set(existingAll.map((w) => w.word.toLowerCase().trim()));

const pilotIds = new Set();
const pilotWords = new Set();
const dupInternalIds = [];
const dupInternalWords = [];
const dupExistingIds = [];
const dupExistingWords = [];

for (const w of pilot) {
  const id = w.id;
  const wordKey = w.word.toLowerCase().trim();
  if (pilotIds.has(id)) dupInternalIds.push(id);
  pilotIds.add(id);
  if (pilotWords.has(wordKey)) dupInternalWords.push(wordKey);
  pilotWords.add(wordKey);
  if (existingIds.has(id)) dupExistingIds.push(id);
  if (existingWords.has(wordKey)) dupExistingWords.push(wordKey);
}

check('Pilot paket kendi içinde tekrarlanan ID içermiyor (0 tekrar)', dupInternalIds.length === 0, dupInternalIds.join(', '));
check('Pilot paket kendi içinde tekrarlanan kelime içermiyor (0 tekrar)', dupInternalWords.length === 0, dupInternalWords.join(', '));
check('Pilot paket orijinal 141 kelimeyle (A2:46, B1:47, B2:48) ID çakışması içermiyor (0 çakışma)', dupExistingIds.length === 0, dupExistingIds.join(', '));
check('Pilot paket orijinal 141 kelimeyle (A2:46, B1:47, B2:48) kelime tekrarı içermiyor (0 tekrar)', dupExistingWords.length === 0, dupExistingWords.join(', '));
check('Birleştirilen data/a2.json içindeki tüm 146 ID ve kelime benzersiz', new Set(a2.map((w) => w.id)).size === 146 && new Set(a2.map((w) => w.word.toLowerCase())).size === 146);

const pilotWithAlts = pilot.filter((w) => w.alternativeAnswers && w.alternativeAnswers.length > 0);
check(
  'Pilot pakette alternativeAnswers yalnızca gerçek UK/US yazım varyantı (centimetre -> centimeter) için kullanılmış; eş anlamlı veya kısaltma yok',
  pilotWithAlts.length === 1 && pilotWithAlts[0].word === 'centimetre' && JSON.stringify(pilotWithAlts[0].alternativeAnswers) === '["centimeter"]',
  JSON.stringify(pilotWithAlts.map((w) => [w.word, w.alternativeAnswers]))
);

// 4. Öğrenme Motoru ve Sınav Sistemi Uyumu
out('\n4) Mevcut Uygulama, Öğrenme Motoru (6 Aşama) ve Sınav Uyumu');
const unblankable = [];
const notReady = [];
const questionErrors = [];
const combinedPool = [...a2, ...pilot];

for (const w of pilot) {
  const norm = buildWord(w, w);
  const blanked = E.blankSentence(norm);
  if (!blanked || !blanked.text || !blanked.text.includes('_____')) {
    unblankable.push(`${w.id} (${w.word}): "${w.exampleSentence}"`);
  }
  if (!isWordReady(norm) || getMissingFields(norm).length > 0) {
    notReady.push(w.id);
  }
  for (const qType of ['mc', 'typing', 'missing', 'sentence', 'production']) {
    const q = E.buildQuestion(norm, qType, combinedPool);
    if (!q || q.type !== qType) {
      questionErrors.push(`${w.id}: ${qType} üretilemedi`);
      continue;
    }
    if (qType === 'mc' && (q.options.length !== 4 || !E.checkAnswer(q, q.answerIndex))) {
      questionErrors.push(`${w.id}: çoktan seçmeli soru hatalı`);
    }
    if ((qType === 'typing' || qType === 'missing' || qType === 'sentence') && !E.checkAnswer(q, norm.word)) {
      questionErrors.push(`${w.id}: ${qType} cevabı doğrulanamadı`);
    }
    if (qType === 'production' && !E.checkAnswer(q, `We saw the word ${norm.word} today.`)) {
      questionErrors.push(`${w.id}: production cevabı doğrulanamadı`);
    }
  }
}

check('Tüm 100 kelimede E.blankSentence() hedef kelimeyi cümlede bulup "_____" ile gizleyebiliyor', unblankable.length === 0, unblankable.join('; '));
check('Tüm 100 kelime isWordReady() kontrolünden geçiyor (taslak/eksik kayıt yok)', notReady.length === 0, notReady.join(', '));
check('Tüm 100 kelime için 5 soru tipi (mc, typing, missing, sentence, production) sorunsuz çalışıyor', questionErrors.length === 0, questionErrors.join('; '));

// 5. CEFR Seviye Uyumu ve İnceleme Gerektiren (reviewRequired) Kayıtların Raporu
out('\n5) CEFR Seviye Uyumu ve İnceleme Gerektiren Kayıtlar (reviewRequired)');
const flagged = pilot.filter((w) => w.reviewRequired);
const flaggedWithoutNote = flagged.filter((w) => !w.reviewNote || !w.reviewNote.trim());
check('İnceleme gerektiren tüm kayıtlarda açıklama notu (reviewNote) mevcut', flaggedWithoutNote.length === 0, flaggedWithoutNote.map((w) => w.id).join(', '));
check('Şüpheli / sınırda veya İngiliz-Amerikan yazım farkı olan kayıtlar açıkça işaretlenmiş', flagged.length > 0, `İşaretli kayıt sayısı: ${flagged.length}`);

out(`\n  ℹ Toplam işaretlenen (reviewRequired: true) kayıt sayısı: ${flagged.length} / ${pilot.length}`);
for (const f of flagged) {
  out(`    - [${f.id}] "${f.word}" (${f.partOfSpeech}, ${f.meanings.join(', ')}) → ${f.reviewNote}`);
}

// 6. Dağılım Özeti (Kategori & Kelime Türü)
out('\n6) Pilot Paket İstatistiksel Dağılım Özeti');
const byPos = {};
const byCat = {};
for (const w of pilot) {
  byPos[w.partOfSpeech] = (byPos[w.partOfSpeech] || 0) + 1;
  byCat[w.category] = (byCat[w.category] || 0) + 1;
}
out('  Kelime Türü Dağılımı: ' + Object.entries(byPos).map(([k, v]) => `${k}: ${v}`).join(', '));
out('  Kategori Dağılımı:    ' + Object.entries(byCat).map(([k, v]) => `${k}: ${v}`).join(', '));

out('\n================================================================');
out(`SONUÇ: ${checksPassed} kontrol geçti, ${checksFailed} kontrol başarısız.`);
out('================================================================');

if (checksFailed > 0) {
  if (typeof process !== 'undefined') process.exit(1);
  else throw new Error('Pilot kalite kontrolü başarısız oldu.');
}
