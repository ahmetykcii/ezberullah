# scripts/build_content_academy_phase1.py
# VELUNO v4.0 — Content Academy / Phase 1
# Injects the 4 new A2 lessons and 80 questions into js/grammar-data.js

import json

# 1. Lesson content for a2-g01: Present Simple vs. Present Continuous
a2_g01_content = {
    "intro": "Simple Present Tense (Geniş Zaman) ile Present Continuous Tense (Şimdiki Zaman) arasındaki fark, İngilizce dil bilgisinin en temel ve en sık test edilen konularından biridir. Simple Present; alışkanlıkları, rutinleri, doğa kanunlarını ve genel geçer doğruları ifade ederken; Present Continuous konuşma anında veya bu dönemde geçici olarak devam eden eylemleri anlatır.",
    "sections": [
        {
            "heading": "1. Simple Present Tense: Kullanım Alanları ve Cümle Yapısı",
            "body": "Geniş zaman; her gün, düzenli aralıklarla tekrarlanan alışkanlıklar ve genel doğrular için kullanılır. Olumlu cümlelerde 3. tekil şahıslarda (He, She, It) fiil sonuna -s, -es veya -ies takısı alır ('He works', 'She watches', 'He studies'). Olumsuz ve soru cümlelerinde 'do / does' yardımcı fiili devreye girer ve asıl fiil yalın (V1) kalır ('He doesn't work', 'Do you work?')."
        },
        {
            "heading": "2. Present Continuous Tense: Kullanım Alanları ve Cümle Yapısı",
            "body": "Şimdiki zaman; tam konuşma anında gerçekleşmekte olan olayları ('am/is/are + V-ing') ve bu sıralar geçici olarak süregelen durumları ifade eder. Cümlede özneye göre 'am', 'is' veya 'are' yardımcı fiili kullanılır ve ana fiilin sonuna '-ing' takısı eklenir ('I am studying now', 'She is staying with her aunt this week')."
        },
        {
            "heading": "3. Durum Fiilleri (Stative Verbs) Kuralı",
            "body": "Duyu (see, hear, smell, taste), duygu (like, love, hate, prefer), düşünce/zihin (know, understand, believe, remember, think) ve aidiyet/sahiplik (belong to, own, have) bildiren fiiller kural olarak '-ing' takısı almaz. Bu eylemler konuşma anında bile gerçekleşse Simple Present ile ifade edilir: 'I know the answer right now' (doğru) / 'I am knowing' (YANLIŞ)."
        },
        {
            "heading": "4. Zaman Belirteçleri Karşılaştırması",
            "body": "• Simple Present: always, usually, often, sometimes, rarely, never, every day/week, on Mondays, once a year.\n• Present Continuous: now, right now, at the moment, currently, at present, today, this week, Look!, Listen!, Be quiet!."
        }
    ],
    "formulas": [
        {
            "label": "Simple Present Olumlu (+)",
            "pattern": "I / You / We / They + V1\nHe / She / It + V(-s / -es / -ies)",
            "note": "Örn: She drinks coffee every morning. / They live in Ankara."
        },
        {
            "label": "Simple Present Olumsuz & Soru (- / ?)",
            "pattern": "Subject + don't / doesn't + V1\nDo / Does + Subject + V1?",
            "note": "Örn: He doesn't like tea. / Do you speak German?"
        },
        {
            "label": "Present Continuous Olumlu (+)",
            "pattern": "I + am + V-ing\nHe / She / It + is + V-ing\nYou / We / They + are + V-ing",
            "note": "Örn: Sude is writing an email now. / We are studying."
        },
        {
            "label": "Present Continuous Olumsuz & Soru (- / ?)",
            "pattern": "Subject + am/is/are + not + V-ing\nAm / Is / Are + Subject + V-ing?",
            "note": "Örn: I am not watching TV. / Are you listening to me?"
        },
        {
            "label": "Durum Fiili (Stative Verb) Kuralı",
            "pattern": "Stative Verb + V1 (Konuşma anında bile -ing ALMAZ)",
            "note": "Örn: I understand you now. (I am understanding DEĞİL)"
        }
    ],
    "examples": [
        {
            "en": "Water boils at 100 degrees Celsius.",
            "tr": "Su 100 santigrat derecede kaynar.",
            "note": "Bilimsel gerçek ve doğa kuralı (Simple Present)."
        },
        {
            "en": "Look! The water is boiling on the stove.",
            "tr": "Bak! Ocakta su kaynıyor.",
            "note": "Konuşma anında gerçekleşen eylem (Look! + is boiling)."
        },
        {
            "en": "Ahmet usually walks to work, but today he is taking the bus.",
            "tr": "Ahmet genellikle işe yürür ama bugün otobüse biniyor.",
            "note": "Genel rutin (walks) ile bugünkü geçici durumun (is taking) karşılaştırması."
        },
        {
            "en": "I don't understand this grammar rule right now.",
            "tr": "Şu anda bu dil bilgisi kuralını anlamıyorum.",
            "note": "'Understand' durum fiilidir; 'right now' olsa dahi Simple Present kullanılır."
        },
        {
            "en": "Sude is staying with her cousin in İzmir this week.",
            "tr": "Sude bu hafta İzmir'de kuzeniyle kalıyor.",
            "note": "'This week' ifadesi geçici durumu belirtir (Present Continuous)."
        }
    ],
    "keyRules": [
        "Sıklık zarfları (always, usually, often, sometimes, never) asıl fiilden önce, 'to be' (am/is/are) fiilinden sonra gelir: 'He often walks', 'He is always late'.",
        "'Look!', 'Listen!', 'Be quiet!' gibi ünlemler konuşma anını işaret ettiği için daima Present Continuous gerektirir.",
        "'Think' fiili 'fikir sahibi olmak / inanmak' anlamında durum fiilidir (-ing almaz: 'I think it's good'); ancak 'zihinde tartmak / düşünce sürecinde olmak' anlamında -ing alabilir ('I am thinking about moving').",
        "'Have' fiili sahiplik bildirdiğinde -ing almaz ('I have a car'); eylem bildiren deyimlerde -ing alabilir ('I am having lunch / a shower')."
    ],
    "commonMistakes": [
        {
            "wrong": "I am knowing the correct answer right now.",
            "right": "I know the correct answer right now.",
            "explanation": "'Know' bir durum fiilidir; konuşma anında bile olsa asla '-ing' almaz."
        },
        {
            "wrong": "She doesn't likes watching horror movies.",
            "right": "She doesn't like watching horror movies.",
            "explanation": "'Doesn't' yardımcı fiilinden sonra ana fiil mutlaka yalın (V1: like) olmalıdır; tekrar -s takısı almaz."
        },
        {
            "wrong": "Why you are laughing?",
            "right": "Why are you laughing?",
            "explanation": "Soru cümlelerinde yardımcı fiil (am/is/are) özneden önce gelmelidir."
        },
        {
            "wrong": "My brother is living with us, but next month he moves away.",
            "right": "My brother lives with us, but next month he is moving away.",
            "explanation": "Kalıcı durumlar için Simple Present (lives), yakın gelecek planları ve geçici durumlar için Present Continuous kullanılır."
        }
    ],
    "examTips": [
        "Seçeneklerde 'wanting, knowing, needing, believing, liking' gibi durum fiillerinin -ing almış hallerini görürseniz hemen eleyin.",
        "Cümle başında 'Look!' veya 'Listen!' varsa ve eylem fiili soruluyorsa öncelikle 'am/is/are + V-ing' şıkkını değerlendirin.",
        "Cümlede 'every day, usually, on Sundays' varsa doğrudan Simple Present (-s / don't / doesn't) arayın.",
        "3. tekil şahıs öznelerde (He, She, It) 'does/doesn't' yardımcı fiili kullanıldığında fiilin sonundaki -s takısının düştüğünü unutmayın."
    ]
}

# 2. Lesson content for a2-g02: Past Simple — Regular & Irregular Verbs
a2_g02_content = {
    "intro": "Past Simple Tense (Geçmiş Zaman), geçmişte belirli bir zamanda gerçekleşmiş ve tamamen sona ermiş eylemleri, olayları ve durumları anlatmak için kullanılır. İngilizce öğreniminin en kritik adımlarından biri, düzenli fiillere gelen '-ed' ek kuralları ile en yaygın düzensiz fiillerin (Irregular Verbs / V2) öğrenilmesidir.",
    "sections": [
        {
            "heading": "1. Past Simple Nedir ve Ne Zaman Kullanılır?",
            "body": "Geçmişte başlayıp bitmiş, şu anla doğrudan bağı kalmamış eylemler için kullanılır. Cümlede genellikle 'yesterday', 'last night/week/year', 'two days ago', 'in 2018' gibi bitmiş geçmiş zaman belirteçleri yer alır."
        },
        {
            "heading": "2. Düzenli Fiiller (Regular Verbs & -ed Kuralları)",
            "body": "Çoğu düzenli fiilin sonuna '-ed' eklenir (work -> worked, play -> played).\n• Sonu 'e' ile bitenlere sadece '-d' gelir (live -> lived).\n• Sonu 'sessiz + y' ile bitenlerde y düşer ve '-ied' gelir (study -> studied, cry -> cried).\n• 'Sessiz + sesli + sessiz' harfle biten tek heceli fiillerde son sessiz çiftleşir (stop -> stopped, plan -> planned)."
        },
        {
            "heading": "3. Düzensiz Fiiller (Irregular Verbs / V2)",
            "body": "Düzensiz fiiller '-ed' kuralına uymaz; kökten değişir veya özel bir forma bürünür: go -> went, see -> saw, buy -> bought, have -> had, eat -> ate, come -> came, do -> did, make -> made, write -> wrote, take -> took. Bu fiiller olumlu geçmiş cümlelerinde 2. halleriyle (V2) kullanılır."
        },
        {
            "heading": "4. Olumsuz ve Soru Cümlelerinde 'Did / Didn't' Kuralı",
            "body": "Past Simple olumsuz ve soru cümlelerinde geçmiş zaman anlamını 'did / didn't' yardımcı fiili üstlenir. Bu nedenle ana fiil mutlaka YALIN (V1) hâline döner: 'I went' (gittim) -> 'I didn't go' (gitmedim) -> 'Did you go?' (Gittin mi?)."
        },
        {
            "heading": "5. 'To Be' Fiilinin Geçmiş Hâli (Was / Were)",
            "body": "Eylem fiili içermeyen durum, sıfat ve konum cümlelerinde geçmiş zaman 'was' (I, He, She, It) ve 'were' (You, We, They) ile kurulur. 'Was/were' kullanılan isim-sıfat cümlelerinde 'did' KULLANILMAZ: 'She was tired' -> 'She wasn't tired' -> 'Was she tired?'."
        }
    ],
    "formulas": [
        {
            "label": "Olumlu Cümle (+)",
            "pattern": "Subject + V2 (Düzenli: V-ed / Düzensiz: V2)",
            "note": "Örn: We stayed in Ankara. / She bought a laptop."
        },
        {
            "label": "Olumsuz Cümle (-)",
            "pattern": "Subject + didn't + V1 (Yalın Fiil)",
            "note": "Örn: I didn't see Ahmet yesterday. (didn't saw DEĞİL)"
        },
        {
            "label": "Soru Cümlesi (?)",
            "pattern": "Did + Subject + V1 (Yalın Fiil)?",
            "note": "Örn: Did you finish the book? — Yes, I did. / No, I didn't."
        },
        {
            "label": "İsim/Sıfat Cümlesi (Was / Were)",
            "pattern": "I / He / She / It + was (wasn't) + Sıfat/İsim\nYou / We / They + were (weren't) + Sıfat/İsim",
            "note": "Örn: They were very happy. / Were you at home?"
        }
    ],
    "examples": [
        {
            "en": "We visited our grandparents in Ankara last weekend.",
            "tr": "Geçen hafta sonu Ankara'daki büyükanne ve büyükbabamızı ziyaret ettik.",
            "note": "Düzenli fiil (visit -> visited) ve zaman belirteci (last weekend)."
        },
        {
            "en": "She bought a new laptop two days ago.",
            "tr": "İki gün önce yeni bir dizüstü bilgisayar satın aldı.",
            "note": "Düzensiz fiil (buy -> bought) ve zaman belirteci (ago)."
        },
        {
            "en": "I didn't see Ahmet at the meeting yesterday.",
            "tr": "Dün toplantıda Ahmet'i görmedim.",
            "note": "'Didn't' sonrasında yalın fiil (see)."
        },
        {
            "en": "Did you finish your project on time?",
            "tr": "Projeyi zamanında bitirdin mi?",
            "note": "'Did' ile soru, fiil yalın (finish)."
        },
        {
            "en": "They were very tired after the long flight.",
            "tr": "Uzun uçuştan sonra çok yorgundular.",
            "note": "'To be' durum cümlesi (were + tired; did kullanılmaz)."
        }
    ],
    "keyRules": [
        "Cümlede 'did' veya 'didn't' varsa, ana fiile '-ed' eklenmez ve 2. hâli kullanılmaz; daima V1 (yalın) gelir ('did you go', 'didn't write').",
        "'Yesterday', '... ago', 'last...', 'in 2015', 'when I was young' gibi ifadeler geçmiş zamanın kesin göstergeleridir.",
        "'Was / were' ile fiilin 2. hali bir arada kullanılmaz ('She was went' KESİNLİKLE YANLIŞTIR).",
        "Özneyi soran 'Who' sorularında 'did' yardımcı fiili kullanılmaz, doğrudan V2 gelir: 'Who broke the window?' (Pencereyi kim kırdı?)."
    ],
    "commonMistakes": [
        {
            "wrong": "She didn't went to school yesterday.",
            "right": "She didn't go to school yesterday.",
            "explanation": "'Didn't' geçmiş anlamını zaten verir; arkasından gelen fiil mutlaka yalın (V1: go) olmalıdır."
        },
        {
            "wrong": "Did you saw the news last night?",
            "right": "Did you see the news last night?",
            "explanation": "'Did' ile başlayan soru cümlelerinde ana fiil 2. hal (saw) değil, yalın hal (see) olur."
        },
        {
            "wrong": "I was go to the cinema two days ago.",
            "right": "I went to the cinema two days ago.",
            "explanation": "Past Simple eylemlerinde 'was go' diye bir yapı yoktur; doğrudan fiilin 2. hali (went) kullanılır."
        },
        {
            "wrong": "They didn't was at home yesterday.",
            "right": "They weren't at home yesterday.",
            "explanation": "'To be' fiilinin geçmiş olumsuzu 'wasn't/weren't' ile yapılır; 'didn't was' kurulamaz."
        }
    ],
    "examTips": [
        "Soru ve olumsuz cümlelerde 'did / didn't' gördüyseniz seçeneklerdeki 2. hal fiilleri (went, bought, saw) hemen eleyin; yalın hal (V1) arayın.",
        "'Ago', 'yesterday' veya 'last week' gibi kesin geçmiş zaman belirteçlerinde Present Perfect (have/has V3) seçeneklerini doğrudan eleyin; Past Simple (V2) seçin.",
        "Fall (düşmek) -> fell ile feel (hissetmek) -> felt fiillerinin 2. hallerini karıştırmayın.",
        "Özne sorusu 'Who + V2' kalıbında 'Who did break...' değil, 'Who broke...' doğru yanıttır."
    ]
}

# 3. Lesson content for a2-g04: Future Tenses — Will / Going to / Present Continuous
a2_g04_content = {
    "intro": "İngilizcede geleceği anlatmak için tek bir zaman kipi yoktur. Gelecekteki olayın nasıl planlandığına, neye dayandığına ve konuşmacının niyetine göre üç temel yapı kullanılır: 'will', 'be going to' ve 'Present Continuous (am/is/are + V-ing)'. A2 seviyesinde bu üç yapının kullanım ayrımını kavramak, hem iletişimde hem de sınavlarda kritik bir kazanımdır.",
    "sections": [
        {
            "heading": "1. 'Will' (Future Simple): Anlık Kararlar, Tahminler ve Sözler",
            "body": "1) Konuşma anında, anlık olarak verilen kararlar ('The phone is ringing. I will answer it!').\n2) Geleceğe yönelik kişisel inanç, umut ve tahminler ('I think technology will improve our lives').\n3) Söz verme, teklif ve ricalar ('I promise I won't tell anyone', 'Will you help me?')."
        },
        {
            "heading": "2. 'Be Going to': Planlar, Niyetler ve Kanıtlı Tahminler",
            "body": "1) Önceden düşünülmüş, tasarlanmış niyetler ve planlar ('I am going to study medicine next year').\n2) Gözle görülür somut bir fiziksel kanıta dayanan tahminler ('Look at those black clouds! It is going to rain', 'Watch out! You are going to drop that plate')."
        },
        {
            "heading": "3. Present Continuous for Future (Kesinleşmiş Düzenlemeler)",
            "body": "Zamanı, yeri ve tarafları önceden kesin olarak ayarlanmış (arrangement) randevular, biletler ve rezervasyonlar için kullanılır: 'I am flying to Berlin on Friday; I have already bought my ticket.' (Cuma günü Berlin'e uçuyorum; biletimi çoktan aldım)."
        },
        {
            "heading": "4. Gelecek Zaman Karşılaştırma Matrisi",
            "body": "• Anlık ani karar: will\n• Önceden niyet/plan: be going to\n• Kesinleşmiş randevu/biletli plan: Present Continuous\n• Somut kanıtlı tahmin (kara bulutlar, sendeleme): be going to\n• Fikir/inanç tahmini (I think, probably): will"
        }
    ],
    "formulas": [
        {
            "label": "Will (+ / - / ?)",
            "pattern": "Subject + will / won't + V1\nWill + Subject + V1?",
            "note": "Örn: I will call you tonight. / Will you come with us?"
        },
        {
            "label": "Be Going To (+ / - / ?)",
            "pattern": "Subject + am / is / are + going to + V1\nAm / Is / Are + Subject + going to + V1?",
            "note": "Örn: She is going to buy a car. / Are you going to study?"
        },
        {
            "label": "Present Continuous (Gelecek Randevu)",
            "pattern": "Subject + am / is / are + V-ing + gelecek zaman zarfı",
            "note": "Örn: I am meeting the doctor tomorrow at 3 PM."
        },
        {
            "label": "Kanıt Belirten Kalıp",
            "pattern": "Look at... / Watch out! + Subject + is/are going to + V1",
            "note": "Örn: Look at the sky! It is going to snow."
        }
    ],
    "examples": [
        {
            "en": "Look at that boy on the wall! He is going to fall.",
            "tr": "Duvardaki şu çocuğa bak! Düşecek.",
            "note": "Gözle görülür somut kanıta dayalı tahmin (going to)."
        },
        {
            "en": "I think people will live on Mars in the future.",
            "tr": "Bence gelecekte insanlar Mars'ta yaşayacak.",
            "note": "'I think' ile kişisel inanç/tahmin (will)."
        },
        {
            "en": "I'm very cold. — Don't worry, I will close the window.",
            "tr": "Çok üşüdüm. — Merak etme, pencereyi kapatırım.",
            "note": "Konuşma anında verilen ani karar ve teklif (will)."
        },
        {
            "en": "We are going to buy a new house next year; we have already saved the money.",
            "tr": "Gelecek yıl yeni bir ev satın alacağız; parasını çoktan biriktirdik.",
            "note": "Önceden kararlaştırılmış niyet/plan (going to)."
        },
        {
            "en": "Sude is meeting her dentist at 4:30 PM on Thursday.",
            "tr": "Sude Perşembe günü 16:30'da diş hekimiyle buluşuyor.",
            "note": "Randevusu alınmış kesin düzenleme (Present Continuous)."
        }
    ],
    "keyRules": [
        "'I think, I believe, I hope, probably, perhaps' ifadeleri kişisel tahmin belirttiği için genellikle 'will' ile kullanılır.",
        "'Watch out!', 'Look out!', 'Look at...' gibi mevcut fiziksel kanıt içeren uyarılar her zaman 'be going to' gerektirir.",
        "Zaman bağlaçlarının (when, before, after, as soon as, until) bulunduğu yan cümleciklerde 'will' KULLANILMAZ; Simple Present kullanılır ('When I arrive home, I will call you').",
        "'Will' yardımcı fiilinden sonra gelen fiil asla '-s', '-ed' veya '-ing' almaz; mutlaka yalın (V1) kalır."
    ],
    "commonMistakes": [
        {
            "wrong": "I will go to the dentist tomorrow at 2 PM; I have an appointment.",
            "right": "I am going to the dentist tomorrow at 2 PM; I have an appointment.",
            "explanation": "Randevusu (appointment) alınmış kesin düzenlemelerde 'will' değil, Present Continuous veya 'going to' kullanılır."
        },
        {
            "wrong": "Look at the dark clouds! It will rain.",
            "right": "Look at the dark clouds! It is going to rain.",
            "explanation": "Gökyüzüne bakılarak yapılan gözlemsel ve somut kanıtlı tahminlerde 'will' değil, 'is going to' kullanılır."
        },
        {
            "wrong": "When you will come, we will start the meeting.",
            "right": "When you come, we will start the meeting.",
            "explanation": "Zaman bağlacı olan 'When' cümleciğinde 'will' kullanılmaz; Simple Present (come) kullanılır."
        },
        {
            "wrong": "She will visits her grandparents next Sunday.",
            "right": "She will visit her grandparents next Sunday.",
            "explanation": "'Will' yardımcı fiilinden sonra ana fiil daima yalın (V1) olmalıdır; -s takısı alamaz."
        }
    ],
    "examTips": [
        "Cümlede 'Look at...' veya 'Watch out!' gibi fiziksel bir belirti/kanıt veriliyorsa seçeneklerde hemen 'is/are going to' arayın.",
        "Cümle 'I think / I hope / I expect / Probably' ile başlıyorsa ve kanıt yoksa öncelikle 'will + V1' seçeneğini değerlendirin.",
        "'Will' sonrasındaki boşluklarda çekimli fiilleri (visited, goes, playing) hemen eleyin; yalnızca yalın fiil (V1) doğrudur.",
        "'When' veya 'As soon as' ile başlayan yan cümleciklerdeki boşluğa asla 'will' getirmeyin."
    ]
}

# 4. Lesson content for a2-g05: Present Perfect Simple
a2_g05_content = {
    "intro": "Present Perfect Simple Tense (Yakın Geçmiş / Etkisi Süren Zaman), geçmişte gerçekleşmiş ancak kesin zamanı belirtilmemiş ya da etkisi ve sonucu şu anda devam eden eylemleri anlatmak için kullanılır. 'Have/has + V3' yapısı ile 'ever, never, just, already, yet' zaman zarfları kavrandığında öğrenilmesi ve sorularda ayırt edilmesi son derece zevkli bir konudur.",
    "sections": [
        {
            "heading": "1. Present Perfect Nedir ve Ne Zaman Kullanılır?",
            "body": "1) Yaşam boyu edinilen deneyimler ('I have visited Italy twice').\n2) Geçmişte olmuş ama sonucu şu an devam eden eylemler ('I have lost my key; I can't open the door now').\n3) Henüz tamamlanmamış bir zaman diliminde gerçekleşen olaylar ('I have drunk three cups of coffee today')."
        },
        {
            "heading": "2. Cümle Yapısı (have/has + V3 / Past Participle)",
            "body": "Özneye göre 'have' (I, You, We, They) veya 'has' (He, She, It) yardımcı fiili gelir ve ana fiilin 3. hali (Past Participle / V3) kullanılır. Düzenli fiillerde V3 de -ed takısı alır (watched); düzensiz fiillerde ise 3. haller ezberlenmelidir (go -> gone, write -> written, see -> seen, break -> broken)."
        },
        {
            "heading": "3. Ever ve Never Kullanımı",
            "body": "Hayat tecrübelerini anlatırken kullanılır:\n• EVER (hiç): Soru cümlelerinde özne ile fiil arasında kullanılır ('Have you ever eaten sushi?').\n• NEVER (asla/hiç): Yapıca olumlu cümlelerde olumsuz anlam katar ('I have never seen a kangaroo'). 'Never' olan cümleye 'not' eklenmez!"
        },
        {
            "heading": "4. Just, Already ve Yet Kullanımı",
            "body": "• JUST (az önce / henüz): Kısa süre önce tamamlanan eylemler ('I have just finished lunch').\n• ALREADY (çoktan): Beklenenden önce biten eylemler ('She has already sent the email').\n• YET (henüz): Yalnızca olumsuz cümlelerin ve soru cümlelerinin EN SONUNDA kullanılır ('I haven't called him yet', 'Have you finished yet?')."
        },
        {
            "heading": "5. 'Been to' vs. 'Gone to' Ayrımı",
            "body": "Sınavlarda en sık sorulan ayrımlardan biridir:\n• 'Has gone to': Oraya gitti ve hâlâ orada (henüz dönmedi).\n• 'Has been to': Oraya gitti, bulundu ve geri döndü (deneyim sahibi oldu)."
        }
    ],
    "formulas": [
        {
            "label": "Olumlu Cümle (+)",
            "pattern": "I / You / We / They + have + V3\nHe / She / It + has + V3",
            "note": "Örn: We have finished our work. / She has visited Paris."
        },
        {
            "label": "Olumsuz Cümle (-)",
            "pattern": "Subject + haven't / hasn't + V3",
            "note": "Örn: I haven't seen that movie. / He hasn't called yet."
        },
        {
            "label": "Soru Cümlesi (?)",
            "pattern": "Have / Has + Subject + V3?",
            "note": "Örn: Have you ever been to London? / Has she arrived?"
        },
        {
            "label": "Zaman Zarfları Konumu",
            "pattern": "have/has + ever / never / just / already + V3\nhaven't/hasn't + V3 ... YET (Cümle sonunda)",
            "note": "Örn: I have already eaten. / I haven't eaten yet."
        }
    ],
    "examples": [
        {
            "en": "Have you ever traveled outside Turkey?",
            "tr": "Hiç Türkiye dışına seyahat ettin mi?",
            "note": "Hayat tecrübesi sorusu (ever + V3)."
        },
        {
            "en": "Ahmet has never tasted Mexican food before.",
            "tr": "Ahmet daha önce hiç Meksika yemeği tatmadı.",
            "note": "Olumlu yapıda olumsuz anlam (never + has tasted)."
        },
        {
            "en": "I have just arrived at the airport; my luggage is here.",
            "tr": "Havaalanına henüz/az önce vardım; bagajım burada.",
            "note": "Az önce tamamlanmış taze eylem (just + V3)."
        },
        {
            "en": "We haven't received the exam results yet.",
            "tr": "Sınav sonuçlarını henüz almadık.",
            "note": "Cümle sonunda 'yet' ve olumsuz yapı (haven't received)."
        },
        {
            "en": "Sude is not at home; she has gone to the library.",
            "tr": "Sude evde değil; kütüphaneye gitti.",
            "note": "Gitmiş ve henüz dönmemiş (has gone to)."
        }
    ],
    "keyRules": [
        "'Yesterday, last year, two days ago, in 2010' gibi kesin ve bitmiş zaman bildiren ifadeler Present Perfect ile KESİNLİKLE KULLANILMAZ; bu ifadelerle Past Simple (V2) kullanılır.",
        "'Yet' yalnızca olumsuz cümlelerin ve soru cümlelerinin cümlenin en sonunda yer alır ('yet' olumlu cümlede kullanılmaz).",
        "'Never' zaten olumsuzluk içerdiğinden cümledeki yardımcı fiil 'hasn't/haven't' değil, 'has/have' olmalıdır ('I have never...', 'I haven't never...' YANLIŞTIR).",
        "'Have/has' yardımcı fiilinden sonra fiilin 1. veya 2. hali değil, mutlaka 3. hali (V3 / Past Participle) gelmelidir."
    ],
    "commonMistakes": [
        {
            "wrong": "I have seen that movie yesterday.",
            "right": "I saw that movie yesterday.",
            "explanation": "'Yesterday' bitmiş kesin bir zamandır; Present Perfect ile değil, Past Simple (saw) ile kullanılır."
        },
        {
            "wrong": "I haven't never visited London.",
            "right": "I have never visited London.",
            "explanation": "'Never' zaten olumsuzluk anlamı katar; 'haven't' ile birlikte çift olumsuzluk oluşturulamaz."
        },
        {
            "wrong": "She has went to the supermarket.",
            "right": "She has gone to the supermarket.",
            "explanation": "'Have/has' sonrasında fiilin 2. hali (went) değil, 3. hali (gone) kullanılır."
        },
        {
            "wrong": "Have you already finished your homework yet?",
            "right": "Have you finished your homework yet?",
            "explanation": "Soru cümlesinde 'already' ve 'yet' aynı anda kullanılmaz; soru sonunda 'yet' yeterlidir."
        }
    ],
    "examTips": [
        "Cümle sonunda boşluk varsa ve cümle olumsuzsa ya da soruysa, aradığınız kelime çok büyük ihtimalle 'yet'tir.",
        "'Have you ...' ile başlayan tecrübe sorularında fiilden hemen önceki boşluk için ilk aranacak kelime 'ever'dır.",
        "Cümlede 'yesterday, ago, last...' varsa Present Perfect şıklarını (have/has + V3) doğrudan eleyin.",
        "Kişinin geri dönüp dönmediğine dikkat edin: Hâlâ oradaysa 'has gone', gidip döndüyse 'has been'."
    ]
}

print("Lesson content structures prepared successfully.")

# Questions for a2-g01 (Present Simple vs. Present Continuous) - 20 questions
a2_g01_questions = [
    {
        "id": "a2-g01-q01",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "Ahmet usually _____ black coffee in the morning, but today he is drinking green tea.",
        "options": ["drinks", "is drinking", "drink", "drank"],
        "correctAnswer": "drinks",
        "explanation": "'Usually' (genellikle) alışkanlık ve rutin bildirir; bu nedenle geniş zaman (Simple Present) kullanılır. Özne 'Ahmet' (3. tekil) olduğu için fiil -s takısı alarak 'drinks' olur.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g01-q02",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "Be quiet! The baby _____ in the bedroom right now.",
        "options": ["is sleeping", "sleeps", "sleep", "was sleeping"],
        "correctAnswer": "is sleeping",
        "explanation": "'Be quiet!' ünlemi ve 'right now' (şu anda) konuşma anında devam eden bir eylemi işaret eder. Tekil özne 'The baby' ile 'is sleeping' kullanılır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g01-q03",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "I _____ this math problem at all. Can you explain it to me once more?",
        "options": ["don't understand", "am not understanding", "doesn't understand", "not understand"],
        "correctAnswer": "don't understand",
        "explanation": "'Understand' bir durum fiilidir (stative verb) ve -ing takısı almaz. Konuşma anında dahi olsa Simple Present olumsuz kalıbı 'don't understand' kullanılır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g01-q04",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "Look! Sude _____ to catch the school bus across the street.",
        "options": ["is running", "runs", "are running", "run"],
        "correctAnswer": "is running",
        "explanation": "'Look!' (Bak!) ünlemi o anda gerçekleşen bir eylemi bildirir. 'Sude' tekil öznesi ile Present Continuous 'is running' kullanılır (run fiilinde n çiftleşir).",
        "difficulty": "easy"
    },
    {
        "id": "a2-g01-q05",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "Pure water _____ at 100 degrees Celsius under standard atmospheric pressure.",
        "options": ["boils", "is boiling", "boil", "boiled"],
        "correctAnswer": "boils",
        "explanation": "Bilimsel gerçekler, doğa yasaları ve genel geçer doğrular her zaman Simple Present Tense ile anlatılır. 'Water' sayılamaz tekil isim olduğu için 'boils' doğrudur.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g01-q06",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "What time _____ your father usually get home from work in the evening?",
        "options": ["does", "do", "is", "are"],
        "correctAnswer": "does",
        "explanation": "Simple Present soru cümlesinde 3. tekil şahıs ('your father' = he) için 'does' yardımcı fiili kullanılır; asıl fiil (get) yalın kalır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g01-q07",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "Listen! Somebody _____ the piano in the music room upstairs.",
        "options": ["is playing", "plays", "play", "are playing"],
        "correctAnswer": "is playing",
        "explanation": "'Listen!' (Dinle!) ünlemi konuşma anında sürmekte olan sesi ve eylemi belirtir. Tekil belgisiz zamir 'Somebody' ile 'is playing' kullanılır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g01-q08",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "I _____ a warm winter coat today because it is very cold outside.",
        "options": ["am wearing", "wear", "wears", "am wear"],
        "correctAnswer": "am wearing",
        "explanation": "'Today' (bugün) ifadesi genel bir alışkanlığı değil, bugüne özel geçici durumu anlatır. Bu nedenle Present Continuous 'am wearing' doğrudur.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g01-q09",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "This freshly baked bread _____ delicious! Did you make it yourself?",
        "options": ["smells", "is smelling", "smell", "are smelling"],
        "correctAnswer": "smells",
        "explanation": "'Smell' duyu bildiren bir durum fiilidir ve '... kokmak' anlamında durum belirttiğinde -ing almaz. 'This bread' tekil olduğu için 'smells' kullanılır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g01-q10",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "My brother is an engineer, but he _____ this week because he is on vacation.",
        "options": ["isn't working", "doesn't work", "don't work", "aren't working"],
        "correctAnswer": "isn't working",
        "explanation": "'This week' (bu hafta) geçici bir durumu ifade eder. Genel mesleği mühendislik olsa da bu haftaya özgü tatil durumu için Present Continuous 'isn't working' kullanılır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g01-q11",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "Why _____ you _____ at me like that? Is there something strange on my shirt?",
        "options": ["are / looking", "do / look", "are / look", "is / looking"],
        "correctAnswer": "are / looking",
        "explanation": "Konuşma anında devam eden bakma eylemini sormak için Present Continuous soru yapısı 'Why are you looking...?' kullanılır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g01-q12",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "Do you know who _____ this red backpack left on the chair?",
        "options": ["owns", "is owning", "own", "is own"],
        "correctAnswer": "owns",
        "explanation": "'Own' (sahip olmak) sahiplik bildiren bir durum fiilidir (stative verb) ve -ing takısı almaz. Tekil özne sorusu 'Who' ile 'owns' gelir.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g01-q13",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "I _____ you are completely right about this important decision.",
        "options": ["think", "am thinking", "thinks", "are thinking"],
        "correctAnswer": "think",
        "explanation": "'Think' fiili bir fikre veya düşünceye sahip olmak (bence / inanıyorum) anlamında kullanıldığında durum fiilidir ve -ing almaz ('I think').",
        "difficulty": "medium"
    },
    {
        "id": "a2-g01-q14",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "Please don't make any noise; Ali _____ an online exam in his study room.",
        "options": ["is taking", "takes", "take", "has taken"],
        "correctAnswer": "is taking",
        "explanation": "'Please don't make any noise' uyarısı konuşma anında devam eden bir eylemi gösterir. 'Ali' tekil öznesiyle 'is taking' kullanılır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g01-q15",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "I _____ about moving to a quieter town, but I haven't made a final choice yet.",
        "options": ["am thinking", "think", "thinks", "am thought"],
        "correctAnswer": "am thinking",
        "explanation": "'Think' fiili 'zihinde tartmak, üzerinde kafa yormak' şeklinde zihinsel bir süreç bildirdiğinde Present Continuous ile kullanılabilir ('I am thinking about moving').",
        "difficulty": "hard"
    },
    {
        "id": "a2-g01-q16",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "Ahmet cannot come to the phone right now because he _____ a shower.",
        "options": ["is having", "has", "have", "is have"],
        "correctAnswer": "is having",
        "explanation": "'Have' fiili sahiplik bildirdiğinde -ing almaz; ancak 'have a shower / lunch / breakfast' gibi eylem içeren kalıplarda konuşma anında 'is having' olarak kullanılır.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g01-q17",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "The global temperature of our planet _____ warmer every decade.",
        "options": ["is getting", "gets", "get", "are getting"],
        "correctAnswer": "is getting",
        "explanation": "Aşamalı olarak değişen ve gelişen trendleri (değişim süreçlerini) anlatmak için Present Continuous kullanılır ('is getting warmer').",
        "difficulty": "hard"
    },
    {
        "id": "a2-g01-q18",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "Emre is so careless! He always _____ his keys at the office, which drives me crazy.",
        "options": ["is leaving", "leaves", "leave", "left"],
        "correctAnswer": "is leaving",
        "explanation": "'Always' zarfı Present Continuous ('is always leaving') ile kullanıldığında, konuşmacıyı rahatsız eden, can sıkan tekrarlı davranışları eleştirmek için kullanılır.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g01-q19",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "Can you tell me which family that historic stone mansion _____ to?",
        "options": ["belongs", "is belonging", "belong", "belonged"],
        "correctAnswer": "belongs",
        "explanation": "'Belong to' (ait olmak) mutlak bir durum fiilidir; hiçbir zaman -ing takısı almaz. Tekil özne (that mansion) ile 'belongs' kullanılır.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g01-q20",
        "topicId": "a2-g01",
        "level": "A2",
        "question": "Although my cousins normally live in Bursa, they _____ with us in Istanbul for two weeks.",
        "options": ["are staying", "stay", "stays", "stayed"],
        "correctAnswer": "are staying",
        "explanation": "'Normally live in Bursa' kalıcı durumu (Simple Present), 'for two weeks' ise geçici bir süreyi ifade eder. Geçici durumlar için Present Continuous ('are staying') kullanılır.",
        "difficulty": "hard"
    }
]

# Questions for a2-g02 (Past Simple — Regular & Irregular Verbs) - 20 questions
a2_g02_questions = [
    {
        "id": "a2-g02-q01",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "We _____ in a cozy wooden cabin near the lake during our holiday last summer.",
        "options": ["stayed", "stay", "staying", "stays"],
        "correctAnswer": "stayed",
        "explanation": "'Last summer' (geçen yaz) geçmişte bitmiş bir zamanı belirtir. Düzenli fiil 'stay' sonuna -ed alarak 'stayed' olur.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g02-q02",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "I _____ a delicious carrot cake for my mother's birthday party yesterday.",
        "options": ["made", "make", "maked", "making"],
        "correctAnswer": "made",
        "explanation": "'Yesterday' geçmiş zaman gerektirir. 'Make' düzensiz bir fiildir; 2. hali (V2) 'made'dir ('maked' diye bir kelime yoktur).",
        "difficulty": "easy"
    },
    {
        "id": "a2-g02-q03",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "Did you _____ the ancient castle during your sightseeing trip in Rome?",
        "options": ["visit", "visited", "visiting", "visits"],
        "correctAnswer": "visit",
        "explanation": "Past Simple soru cümlelerinde 'Did' yardımcı fiili kullanıldığında ana fiil mutlaka YALIN (V1: visit) olmalıdır; -ed takısı almaz.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g02-q04",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "They _____ to the cinema with us last night because they were too exhausted.",
        "options": ["didn't go", "didn't went", "weren't go", "not went"],
        "correctAnswer": "didn't go",
        "explanation": "Past Simple olumsuz cümle yapısı 'didn't + yalın fiil (V1)' şeklindedir. 'Didn't' sonrası fiilin 2. hali (went) kullanılamaz; 'didn't go' doğrudur.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g02-q05",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "Sude accidentally _____ her leather wallet on the bus seat two hours ago.",
        "options": ["left", "leave", "leaved", "leaves"],
        "correctAnswer": "left",
        "explanation": "'Two hours ago' (iki saat önce) Past Simple gerektirir. 'Leave' düzensiz fiilinin 2. hali (V2) 'left'tir ('leaved' yanlıştır).",
        "difficulty": "easy"
    },
    {
        "id": "a2-g02-q06",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "Ahmet was very thirsty after the workout, so he _____ two full glasses of water.",
        "options": ["drank", "drink", "drinked", "drunk"],
        "correctAnswer": "drank",
        "explanation": "'Drink' düzensiz bir fiildir; Past Simple (V2) hali 'drank'tir. 'Drunk' 3. haldir (V3); 'drinked' ise kural dışı ve yanlıştır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g02-q07",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "The students _____ excited when they heard about the school trip to Cappadocia.",
        "options": ["were", "was", "are", "did"],
        "correctAnswer": "were",
        "explanation": "'The students' çoğul bir öznedir. Geçmiş zamanda durum (sıfat) cümlesi kurarken çoğul öznelerle 'were' kullanılır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g02-q08",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "I _____ to call you yesterday evening, but my phone battery suddenly died.",
        "options": ["tried", "tryed", "try", "was try"],
        "correctAnswer": "tried",
        "explanation": "Sonu 'sessiz + y' ile biten düzenli fiillerde -ed eklenirken 'y' harfi 'i'ye dönüşür: try -> tried ('tryed' yazımı yanlıştır).",
        "difficulty": "medium"
    },
    {
        "id": "a2-g02-q09",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "Where _____ you _____ that stylish winter jacket you wore yesterday?",
        "options": ["did / buy", "did / bought", "were / buy", "do / bought"],
        "correctAnswer": "did / buy",
        "explanation": "Past Simple soru cümlesinde 'Did + özne + V1 (yalın fiil)' kuralı geçerlidir. Bu nedenle 'did / buy' doğrudur.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g02-q10",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "The city bus suddenly _____ at the red light and all the passengers moved forward.",
        "options": ["stopped", "stoped", "stops", "stopping"],
        "correctAnswer": "stopped",
        "explanation": "'Sessiz + tek sesli + tek sessiz' ile biten tek heceli düzenli fiillerde -ed gelirken son harf çiftleşir: stop -> stopped.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g02-q11",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "We _____ any available tickets for the theatre because they were completely sold out.",
        "options": ["couldn't find", "couldn't found", "can't find", "didn't could find"],
        "correctAnswer": "couldn't find",
        "explanation": "Geçmişte yapabilirlik/bulabilirlik olumsuzu 'couldn't + V1' ile ifade edilir. 'Couldn't' sonrasında yalın fiil 'find' gelir.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g02-q12",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "My father _____ me how to ride a bicycle when I was seven years old.",
        "options": ["taught", "teached", "teach", "thought"],
        "correctAnswer": "taught",
        "explanation": "'Teach' (öğretmek) düzensiz bir fiildir ve 2. hali 'taught'tur ('teached' yanlıştır; 'thought' ise 'think'in geçmiş halidir).",
        "difficulty": "medium"
    },
    {
        "id": "a2-g02-q13",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "Why _____ you absent from the English class yesterday morning?",
        "options": ["were", "did", "was", "are"],
        "correctAnswer": "were",
        "explanation": "'Absent' (devamsız/yok) bir sıfattır, eylem fiili değildir. İsim ve sıfat sorularında 'did' değil, 'was/were' kullanılır: 'Why were you absent?'",
        "difficulty": "medium"
    },
    {
        "id": "a2-g02-q14",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "She slipped on the wet floor and _____ down, injuring her ankle.",
        "options": ["fell", "felt", "fall", "falled"],
        "correctAnswer": "fell",
        "explanation": "'Fall' (düşmek) fiilinin 2. hali 'fell'dir. 'Felt' ise 'feel' (hissetmek) fiilinin 2. halidir; karıştırılmamalıdır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g02-q15",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "Who _____ that magnificent stone bridge over the river in 1895?",
        "options": ["built", "did build", "builded", "was build"],
        "correctAnswer": "built",
        "explanation": "Özneyi soran 'Who' sorularında (Who + V2) yardımcı fiil 'did' kullanılmaz; fiilin 2. hali doğrudan yazılır: 'Who built the bridge?'",
        "difficulty": "hard"
    },
    {
        "id": "a2-g02-q16",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "The price of olive oil _____ noticeably in the local market last autumn.",
        "options": ["rose", "raised", "risen", "rised"],
        "correctAnswer": "rose",
        "explanation": "'Rise' (kendiliğinden yükselmek/artmak) geçişsiz düzensiz bir fiildir ve 2. hali 'rose'dur. 'Raise' nesne alan farklı bir fiildir.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g02-q17",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "Yesterday, Kemal woke up early, _____ a quick breakfast, and ran to the bus stop.",
        "options": ["ate", "eaten", "eats", "was eating"],
        "correctAnswer": "ate",
        "explanation": "Geçmişte art arda, kronolojik sırayla gerçekleşen tamamlanmış eylemler dizisinde tüm fiiller Past Simple (V2) olur: woke up, ate, ran.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g02-q18",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "I didn't like the documentary film because it _____ too slow and uninteresting.",
        "options": ["was", "were", "did", "is"],
        "correctAnswer": "was",
        "explanation": "Filmin niteliği anlatılmaktadır (slow and uninteresting - sıfat tamlaması). Tekil özne 'it' ile geçmiş zamanda 'was' kullanılır.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g02-q19",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "Kerem _____ twenty euros from his brother to purchase his school supplies.",
        "options": ["borrowed", "lent", "borrow", "borrowing"],
        "correctAnswer": "borrowed",
        "explanation": "'Borrow' (ödünç almak) düzenli bir fiildir (borrowed). 'Lend' (ödünç vermek) ise eylemin tersi yöndedir.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g02-q20",
        "topicId": "a2-g02",
        "level": "A2",
        "question": "How much _____ that vintage watch _____ when your grandfather bought it?",
        "options": ["did / cost", "did / costed", "was / cost", "does / costed"],
        "correctAnswer": "did / cost",
        "explanation": "'Cost' (mal olmak/fiyatında olmak) fiilinin üç hali de 'cost'tur ('costed' diye bir form yoktur). Soru 'Did + özne + cost' şeklinde kurulur.",
        "difficulty": "hard"
    }
]

# Questions for a2-g04 (Future Tenses — Will / Going to / Present Continuous) - 20 questions
a2_g04_questions = [
    {
        "id": "a2-g04-q01",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "Look at those dark black clouds gathering in the sky! It _____ rain very soon.",
        "options": ["is going to", "will", "rains", "shall"],
        "correctAnswer": "is going to",
        "explanation": "Gökyüzündeki kara bulutlar gibi gözle görülür somut bir kanıt olduğunda yapılan tahminler için 'is going to' kullanılır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g04-q02",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "The phone in the corridor is ringing. — Don't get up, I _____ answer it!",
        "options": ["will", "am going to", "am answering", "shall to"],
        "correctAnswer": "will",
        "explanation": "Konuşma anında, anlık olarak verilen ani kararlar için 'will' kullanılır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g04-q03",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "We _____ our flight tickets already; we are flying to Berlin on Friday morning.",
        "options": ["have bought", "will buy", "are buying", "buy"],
        "correctAnswer": "have bought",
        "explanation": "'Already' (çoktan) biletlerin önceden alındığını bildirir; bu sayede cuma günkü uçuş Present Continuous ile kesin düzenleme olarak anlatılmıştır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g04-q04",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "I promise I _____ tell your personal secret to anyone in the office.",
        "options": ["won't", "am not going to", "don't", "not will"],
        "correctAnswer": "won't",
        "explanation": "Söz verme (promise), güvence veya yemin durumlarında daima 'will / won't' kullanılır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g04-q05",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "Sude _____ a surgeon when she finishes medical school; that has been her dream for years.",
        "options": ["is going to be", "will be", "is being", "be"],
        "correctAnswer": "is going to be",
        "explanation": "Önceden belirlenmiş kariyer hedefi, plan ve niyetler için 'be going to' yapısı tercih edilir.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g04-q06",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "I think renewable energy sources _____ replace fossil fuels within fifty years.",
        "options": ["will", "are going to", "are replacing", "shall"],
        "correctAnswer": "will",
        "explanation": "'I think' (bence) ile ifade edilen kişisel inanç ve genel tahminlerde 'will' kullanılır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g04-q07",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "Watch out! You _____ spill that boiling tea onto your lap.",
        "options": ["are going to", "will", "shall", "spill"],
        "correctAnswer": "are going to",
        "explanation": "'Watch out!' (Dikkat et!) gibi anlık uyarılar ve fiziksel tehlike belirtileri 'be going to' gerektirir.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g04-q08",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "What _____ you _____ this weekend? Have you arranged anything special?",
        "options": ["are / going to do", "will / do", "do / do", "are / done"],
        "correctAnswer": "are / going to do",
        "explanation": "Bir kişinin hafta sonu için önceden tasarladığı plan ve niyetlerini sormak için 'What are you going to do?' kalıbı kullanılır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g04-q09",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "I _____ my dentist tomorrow at 4:30 PM; my appointment is written in my calendar.",
        "options": ["am seeing", "will see", "see", "saw"],
        "correctAnswer": "am seeing",
        "explanation": "Günü ve saati kesinleşmiş, randevusu alınmış (appointment) görüşmeler için Present Continuous ('am seeing') en doğru yapıdır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g04-q10",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "Don't carry that heavy box alone. Wait a second, I _____ you with it.",
        "options": ["will help", "am going to help", "help", "helped"],
        "correctAnswer": "will help",
        "explanation": "Konuşma anında yapılan teklif ve yardım etme kararları için 'will + V1' kullanılır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g04-q11",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "According to the official timetable, the express train to Ankara _____ at 08:30 tomorrow morning.",
        "options": ["leaves", "will leave", "is going to leave", "is leaving"],
        "correctAnswer": "leaves",
        "explanation": "Tren, uçak, sinema veya ders programı gibi resmi bir zaman çizelgesine (timetable/schedule) bağlı gelecek eylemler Simple Present ile ifade edilir.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g04-q12",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "As soon as I _____ at the office tomorrow, I will email you the updated contract.",
        "options": ["arrive", "will arrive", "arrived", "am going to arrive"],
        "correctAnswer": "arrive",
        "explanation": "'As soon as, when, before, after' gibi zaman bağlaçlarının bulunduğu yan cümleciklerde gelecek zaman için 'will' KULLANILMAZ; Simple Present (arrive) kullanılır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g04-q13",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "We have run out of milk. — Really? In that case, I _____ to the grocery store right now.",
        "options": ["will go", "am going", "go", "went"],
        "correctAnswer": "will go",
        "explanation": "Eksik konuşma anında fark edildiğinde verilen spontane ve anlık karar için 'will go' kullanılır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g04-q14",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "Climate scientists believe that global sea levels _____ rise significantly over the next century.",
        "options": ["will", "are going to", "are rising", "shall"],
        "correctAnswer": "will",
        "explanation": "Geleceğe dair genel tahmin ve öngörülerde 'believe that ... will' yapısı standarttır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g04-q15",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "Look at that exhausted athlete staggering on the track! He _____ finish the race.",
        "options": ["isn't going to", "won't", "doesn't", "not will"],
        "correctAnswer": "isn't going to",
        "explanation": "Koşucunun sendeleyen fiziksel durumu gözlemlenebilir bir kanıttır. Somut kanıta dayanan negatif tahmin 'isn't going to finish' ile ifade edilir.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g04-q16",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "We _____ married on the fifteenth of June; the wedding invitations have already been printed and mailed.",
        "options": ["are getting", "will get", "get", "got"],
        "correctAnswer": "are getting",
        "explanation": "Davetiyelerin çoktan basılıp postalanmış olması (invitations have been mailed), organizasyonun kesinleştirildiğini gösterir. Bu kesin düzenleme Present Continuous ('are getting married') gerektirir.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g04-q17",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "If you don't take an umbrella in this storm, you _____ get completely soaked.",
        "options": ["will", "are going to", "are", "shall to"],
        "correctAnswer": "will",
        "explanation": "First Conditional (Tip 1 Koşul) cümlelerinin ana cümlesinde gelecek zaman sonucu olarak 'will + V1' kullanılır.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g04-q18",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "I _____ an intensive German course next Monday; I have already paid the tuition fee.",
        "options": ["am starting", "will start", "start", "started"],
        "correctAnswer": "am starting",
        "explanation": "Kurs ücreti ödenmiş ve kayıt tamamlanmıştır; kesinleşmiş düzenleme için Present Continuous ('am starting') en uygunudur.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g04-q19",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "My stomach feels terrible after that seafood. I think I _____ be sick.",
        "options": ["am going to", "will", "shall", "am"],
        "correctAnswer": "am going to",
        "explanation": "Kişinin midesinin kötü olması fiziksel bir kanıttır; vücuttaki doğrudan belirtiye dayanan tahmin 'am going to be sick' şeklinde kurulur.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g04-q20",
        "topicId": "a2-g04",
        "level": "A2",
        "question": "The bags are all packed by the hallway because my parents _____ to Bodrum early tomorrow morning.",
        "options": ["are driving", "will drive", "drive", "drove"],
        "correctAnswer": "are driving",
        "explanation": "Bavullar çoktan toplandığı için eylem kesinleşmiş bir seyahat planıdır ve Present Continuous ('are driving') kullanılır.",
        "difficulty": "hard"
    }
]

# Questions for a2-g05 (Present Perfect Simple) - 20 questions
a2_g05_questions = [
    {
        "id": "a2-g05-q01",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "Have you _____ visited the historic Topkapı Palace in Istanbul?",
        "options": ["ever", "never", "already", "yet"],
        "correctAnswer": "ever",
        "explanation": "Hayat tecrübelerini sorarken soru cümlelerinde özne ile fiil arasında 'ever' (hiç) kullanılır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g05-q02",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "Ahmet has _____ tasted octopus; he really dislikes trying unfamiliar seafood.",
        "options": ["never", "ever", "yet", "already"],
        "correctAnswer": "never",
        "explanation": "Olumlu yapılı cümlede 'asla / hiçbir zaman / hiç' anlamını vermek için 'never' kullanılır ('has never tasted').",
        "difficulty": "easy"
    },
    {
        "id": "a2-g05-q03",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "I have _____ finished my biology assignment, so I can finally go out for a walk.",
        "options": ["just", "yet", "ever", "never"],
        "correctAnswer": "just",
        "explanation": "'Just', bir eylemin 'az önce / henüz' tamamlandığını ve sonucunun şu an taze olduğunu anlatır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g05-q04",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "The courier hasn't delivered the parcel we ordered last week _____.",
        "options": ["yet", "already", "just", "ever"],
        "correctAnswer": "yet",
        "explanation": "'Yet', olumsuz cümlelerin ve soru cümlelerinin EN SONUNDA 'henüz' anlamında kullanılır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g05-q05",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "She _____ three detailed reports to her manager so far this morning.",
        "options": ["has sent", "have sent", "sented", "has send"],
        "correctAnswer": "has sent",
        "explanation": "Üçüncü tekil özne 'She' ile 'has' kullanılır ve 'send' düzensiz fiilinin 3. hali (V3) 'sent'tir.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g05-q06",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "We _____ in this quiet coastal neighborhood since 2019.",
        "options": ["have lived", "has lived", "lived", "are living"],
        "correctAnswer": "have lived",
        "explanation": "'Since 2019' geçmişte başlayıp günümüze kadar devam eden durumu bildirir; çoğul özne 'We' ile 'have lived' kullanılır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g05-q07",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "Where is Caner? — He is not in the office; he _____ to the bank to deposit some money.",
        "options": ["has gone", "has been", "went", "have gone"],
        "correctAnswer": "has gone",
        "explanation": "Caner şu anda ofiste olmadığına ve bankaya gidip henüz dönmediğine göre 'has gone' kullanılır.",
        "difficulty": "easy"
    },
    {
        "id": "a2-g05-q08",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "I cannot open my front door right now because I _____ my apartment keys.",
        "options": ["have lost", "lost", "has lost", "am losing"],
        "correctAnswer": "have lost",
        "explanation": "Anahtar geçmişte kaybedilmiştir ancak kapıyı açamama sonucu ŞU ANDA geçerlidir; bu nedenle Present Perfect ('have lost') kullanılır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g05-q09",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "Have you cleaned the kitchen counter and washed the dishes _____?",
        "options": ["yet", "already", "never", "just"],
        "correctAnswer": "yet",
        "explanation": "Soru cümlelerinin sonunda 'yaptın mı / ettin mi?' anlamında 'yet' kullanılır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g05-q10",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "Sude has _____ submitted all her college applications, even though the deadline is next month.",
        "options": ["already", "yet", "ever", "since"],
        "correctAnswer": "already",
        "explanation": "Başvuruların beklenenden önce, 'çoktan' bitirildiğini olumlu cümlede vurgulamak için 'already' kullanılır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g05-q11",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "I have been to London several times, so I _____ the public transport system quite well.",
        "options": ["know", "have known", "knew", "am knowing"],
        "correctAnswer": "know",
        "explanation": "'Have been to London' geçmişteki deneyimi anlatır; bunun sonucu olarak şehri ŞU AN iyi tanıyorum/biliyorum derken Simple Present ('know') kullanılır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g05-q12",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "My grandparents _____ happily married for more than forty years.",
        "options": ["have been", "has been", "were", "are being"],
        "correctAnswer": "have been",
        "explanation": "'For more than forty years' (40 yıldan fazla süredir) geçmişten bugüne süren durumu belirtir. Çoğul özne 'My grandparents' ile 'have been' doğrudur.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g05-q13",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "Okan _____ a stylish new smartphone yesterday afternoon at the shopping mall.",
        "options": ["bought", "has bought", "have bought", "buys"],
        "correctAnswer": "bought",
        "explanation": "DİKKAT: Cümlede 'yesterday afternoon' (dün öğleden sonra) gibi net ve bitmiş geçmiş zaman ifadesi olduğunda Present Perfect KULLANILAMAZ; Past Simple ('bought') kullanılır.",
        "difficulty": "medium"
    },
    {
        "id": "a2-g05-q14",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "We _____ each other very well since our primary school days.",
        "options": ["have known", "have knew", "knew", "know"],
        "correctAnswer": "have known",
        "explanation": "'Since' ile geçmişten bugüne süregelen tanışıklık anlatılır. 'Know' fiilinin 3. hali (V3) 'known'dur ('have known').",
        "difficulty": "medium"
    },
    {
        "id": "a2-g05-q15",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "I _____ never _____ such a breathtaking sunset in my entire life.",
        "options": ["have / seen", "has / seen", "did / see", "have / saw"],
        "correctAnswer": "have / seen",
        "explanation": "Hayat boyu yapılan deneyim vurgusunda 'I have never seen...' kalıbı kullanılır ('see' fiilinin 3. hali 'seen'dir).",
        "difficulty": "hard"
    },
    {
        "id": "a2-g05-q16",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "My older sister _____ with high honors from university two years ago.",
        "options": ["graduated", "has graduated", "have graduated", "graduates"],
        "correctAnswer": "graduated",
        "explanation": "'Two years ago' (iki yıl önce) kesin bir geçmiş zaman belirtecidir; 'ago' olan cümlelerde Present Perfect kullanılmaz, Past Simple (V2: graduated) kullanılır.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g05-q17",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "Tolga is back home from his vacation in Antalya; he _____ a fantastic time there.",
        "options": ["had", "has had", "has", "have had"],
        "correctAnswer": "had",
        "explanation": "Tolga tatilden çoktan dönmüştür (is back); tatildeki harika zaman artık bitmiş bir geçmişe ait olduğu için 'had' kullanılır.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g05-q18",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "How many cups of espresso _____ you _____ so far today?",
        "options": ["have / drunk", "did / drink", "have / drank", "do / drink"],
        "correctAnswer": "have / drunk",
        "explanation": "'So far today' (bugün şu ana kadar) henüz bitmemiş bir zaman dilimini ifade eder; bu nedenle Present Perfect ('have you drunk') kullanılır ('drink'in 3. hali 'drunk'tır).",
        "difficulty": "hard"
    },
    {
        "id": "a2-g05-q19",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "Zeynep isn't at her office desk right now. She _____ to the downstairs café to buy a sandwich.",
        "options": ["has gone", "has been", "went", "is going"],
        "correctAnswer": "has gone",
        "explanation": "Zeynep şu an masasında değil; kafeteryaya gitmiş ve henüz dönmemiştir. Bu durum için 'has gone' kullanılır.",
        "difficulty": "hard"
    },
    {
        "id": "a2-g05-q20",
        "topicId": "a2-g05",
        "level": "A2",
        "question": "Look at that cracked glass! Who _____ that to the window?",
        "options": ["has done", "did do", "have done", "does"],
        "correctAnswer": "has done",
        "explanation": "Kırık cam gözümüzün önündedir (etki/sonuç şu anda ortada); zamanı belirsiz bu eylem için tekil soru 'Who has done that?' olarak sorulur.",
        "difficulty": "hard"
    }
]

print("All 80 questions defined.")

# Validation and generation logic
all_new_questions = a2_g01_questions + a2_g02_questions + a2_g04_questions + a2_g05_questions
print(f"Total new questions: {len(all_new_questions)}")

# Validate each question
validation_errors = []
for q in all_new_questions:
    if not q.get("id"): validation_errors.append((q, "id missing"))
    if not q.get("topicId"): validation_errors.append((q, "topicId missing"))
    if q.get("level") != "A2": validation_errors.append((q, "level not A2"))
    if not q.get("question"): validation_errors.append((q, "question missing"))
    opts = q.get("options", [])
    if len(opts) != 4: validation_errors.append((q, "not 4 options"))
    if len(set(opts)) != 4: validation_errors.append((q, "duplicate options"))
    corr = q.get("correctAnswer")
    if not corr or corr not in opts: validation_errors.append((q, "correctAnswer not in options"))
    if not q.get("explanation"): validation_errors.append((q, "explanation missing"))
    if q.get("difficulty") not in ["easy", "medium", "hard"]: validation_errors.append((q, "invalid difficulty"))

if validation_errors:
    print(f"Validation failed with {len(validation_errors)} errors:")
    for err in validation_errors:
        print("  ERR:", err)
    exit(1)
print("All 80 questions passed internal validation!")

# Now read existing js/grammar-data.js
with open("js/grammar-data.js", "r", encoding="utf-8") as f:
    orig_code = f.read()

# Let's inspect topics
# We want to replace:
# a2-g01, a2-g02, a2-g04, a2-g05 in GRAMMAR_TOPICS
# and insert questions in GRAMMAR_QUESTIONS.

# Read current GRAMMAR_TOPICS and GRAMMAR_QUESTIONS using a clean JS parser or string replacement
import re

def js_obj(obj, indent=4):
    lines = []
    ind = " " * indent
    lines.append("{\n")
    for k, v in obj.items():
        if isinstance(v, str):
            lines.append(f'{ind}  {k}: {json.dumps(v, ensure_ascii=False)},\n')
        elif isinstance(v, (int, float, bool)):
            lines.append(f'{ind}  {k}: {json.dumps(v)},\n')
        elif v is None:
            lines.append(f'{ind}  {k}: null,\n')
        elif isinstance(v, list):
            lines.append(f'{ind}  {k}: [\n')
            for item in v:
                if isinstance(item, str):
                    lines.append(f'{ind}    {json.dumps(item, ensure_ascii=False)},\n')
                elif isinstance(item, dict):
                    # nested dict
                    sub_ind = ind + "    "
                    lines.append(f'{sub_ind}{{\n')
                    for sk, sv in item.items():
                        lines.append(f'{sub_ind}  {sk}: {json.dumps(sv, ensure_ascii=False)},\n')
                    lines.append(f'{sub_ind}}},\n')
            lines.append(f'{ind}  ],\n')
        elif isinstance(v, dict):
            # nested dict (e.g. content)
            sub_ind = ind + "  "
            lines.append(f'{sub_ind}{k}: {{\n')
            for sk, sv in v.items():
                if isinstance(sv, str):
                    lines.append(f'{sub_ind}  {sk}: {json.dumps(sv, ensure_ascii=False)},\n')
                elif isinstance(sv, list):
                    lines.append(f'{sub_ind}  {sk}: [\n')
                    for item in sv:
                        if isinstance(item, str):
                            lines.append(f'{sub_ind}    {json.dumps(item, ensure_ascii=False)},\n')
                        elif isinstance(item, dict):
                            sub2_ind = sub_ind + "    "
                            lines.append(f'{sub2_ind}{{\n')
                            for ssk, ssv in item.items():
                                lines.append(f'{sub2_ind}  {ssk}: {json.dumps(ssv, ensure_ascii=False)},\n')
                            lines.append(f'{sub2_ind}}},\n')
                    lines.append(f'{sub_ind}  ],\n')
            lines.append(f'{sub_ind}}},\n')
    lines.append(f'{ind}}}')
    return "".join(lines)

# Prepare full topic dictionary objects
t_a2_g01 = {
    "id": "a2-g01",
    "level": "A2",
    "order": 1,
    "title": "Present Simple vs. Present Continuous",
    "description": "Genel doğrular ve alışkanlıklar (Simple Present) ile şu anda devam eden eylemlerin (Present Continuous) ve durum fiillerinin (stative verbs) karşılaştırılması.",
    "status": "ready",
    "content": a2_g01_content
}

t_a2_g02 = {
    "id": "a2-g02",
    "level": "A2",
    "order": 2,
    "title": "Past Simple — Regular & Irregular Verbs",
    "description": "Geçmişte tamamlanmış eylemler, düzenli fiiller (-ed), en önemli düzensiz fiiller (V2) ve 'did / didn't' soru-olumsuz yapıları.",
    "status": "ready",
    "content": a2_g02_content
}

t_a2_g04 = {
    "id": "a2-g04",
    "level": "A2",
    "order": 4,
    "title": "Future Tenses — Will / Going to / Present Continuous",
    "description": "Gelecek zaman yapıları: konuşma anındaki kararlar ve tahminler (will), önceden yapılmış planlar ve kanıta dayalı tahminler (be going to), kesinleşmiş randevular (Present Continuous).",
    "status": "ready",
    "content": a2_g04_content
}

t_a2_g05 = {
    "id": "a2-g05",
    "level": "A2",
    "order": 5,
    "title": "Present Perfect Simple",
    "description": "Geçmişte başlayıp etkisi süren veya zamanı belirtilmemiş deneyimler; have/has + V3 yapısı ve 'ever, never, just, already, yet' zarfları.",
    "status": "ready",
    "content": a2_g05_content
}

# Construct formatted question JS strings
def format_q(q):
    return f"""  {{
    id: '{q['id']}',
    topicId: '{q['topicId']}',
    level: '{q['level']}',
    question: {json.dumps(q['question'], ensure_ascii=False)},
    options: {json.dumps(q['options'], ensure_ascii=False)},
    correctAnswer: {json.dumps(q['correctAnswer'], ensure_ascii=False)},
    explanation: {json.dumps(q['explanation'], ensure_ascii=False)},
    difficulty: '{q['difficulty']}',
  }},"""

# Regex replacement for a2-g01
pattern_a2_g01 = r'\{\s*id:\s*[\'\"]a2-g01[\'\"].*?status:\s*[\'\"]soon[\'\"].*?content:\s*null,?\s*\},?'
match1 = re.search(pattern_a2_g01, orig_code, re.DOTALL)
assert match1, "Could not find a2-g01 stub in grammar-data.js"
code1 = orig_code[:match1.start()] + js_obj(t_a2_g01, 2) + ",\n" + orig_code[match1.end():]

# Regex replacement for a2-g02
pattern_a2_g02 = r'\{\s*id:\s*[\'\"]a2-g02[\'\"].*?status:\s*[\'\"]soon[\'\"].*?content:\s*null,?\s*\},?'
match2 = re.search(pattern_a2_g02, code1, re.DOTALL)
assert match2, "Could not find a2-g02 stub in grammar-data.js"
code2 = code1[:match2.start()] + js_obj(t_a2_g02, 2) + ",\n" + code1[match2.end():]

# Regex replacement for a2-g04
pattern_a2_g04 = r'\{\s*id:\s*[\'\"]a2-g04[\'\"].*?status:\s*[\'\"]soon[\'\"].*?content:\s*null,?\s*\},?'
match4 = re.search(pattern_a2_g04, code2, re.DOTALL)
assert match4, "Could not find a2-g04 stub in grammar-data.js"
code4 = code2[:match4.start()] + js_obj(t_a2_g04, 2) + ",\n" + code2[match4.end():]

# Regex replacement for a2-g05
pattern_a2_g05 = r'\{\s*id:\s*[\'\"]a2-g05[\'\"].*?status:\s*[\'\"]soon[\'\"].*?content:\s*null,?\s*\},?'
match5 = re.search(pattern_a2_g05, code4, re.DOTALL)
assert match5, "Could not find a2-g05 stub in grammar-data.js"
code5 = code4[:match5.start()] + js_obj(t_a2_g05, 2) + ",\n" + code4[match5.end():]

# Now insert questions in GRAMMAR_QUESTIONS
# Find "// ---------- 🟢 A2: Past Continuous (a2-g03) — 20 Soru ----------"
# We can place a2-g01 and a2-g02 before a2-g03, and a2-g04 and a2-g05 after a2-g03!

q_marker_a2_g03 = "// ---------- 🟢 A2: Past Continuous (a2-g03) — 20 Soru ----------"
pos_a2_g03 = code5.find(q_marker_a2_g03)
assert pos_a2_g03 != -1, "Could not find a2-g03 question marker"

a2_g01_str = "  // ---------- 🟢 A2: Present Simple vs. Present Continuous (a2-g01) — 20 Soru ----------\n" + "\n".join([format_q(q) for q in a2_g01_questions]) + "\n\n"
a2_g02_str = "  // ---------- 🟢 A2: Past Simple — Regular & Irregular Verbs (a2-g02) — 20 Soru ----------\n" + "\n".join([format_q(q) for q in a2_g02_questions]) + "\n\n"

code_pre_g03 = code5[:pos_a2_g03] + a2_g01_str + a2_g02_str + code5[pos_a2_g03:]

# Now find where B1 questions begin:
# "// ---------- 🔵 B1: Present Perfect vs. Past Simple (b1-g01) — 20 Soru ----------"
q_marker_b1_g01 = "// ---------- 🔵 B1: Present Perfect vs. Past Simple (b1-g01) — 20 Soru ----------"
pos_b1_g01 = code_pre_g03.find(q_marker_b1_g01)
assert pos_b1_g01 != -1, "Could not find b1-g01 question marker"

a2_g04_str = "  // ---------- 🟢 A2: Future Tenses — Will / Going to / Present Continuous (a2-g04) — 20 Soru ----------\n" + "\n".join([format_q(q) for q in a2_g04_questions]) + "\n\n"
a2_g05_str = "  // ---------- 🟢 A2: Present Perfect Simple (a2-g05) — 20 Soru ----------\n" + "\n".join([format_q(q) for q in a2_g05_questions]) + "\n\n"

final_code = code_pre_g03[:pos_b1_g01] + a2_g04_str + a2_g05_str + code_pre_g03[pos_b1_g01:]

with open("js/grammar-data.js", "w", encoding="utf-8") as f:
    f.write(final_code)

print("js/grammar-data.js updated successfully!")
