// VELUNO v4.1 — Grammar Academy Resmi Müfredatı (38/38 Aktif Konu) ve Tam Soru Havuzu (38 Ders × 20 Soru = 760 Özgün Soru)

export const GRAMMAR_LEVELS = [
  {
    "id": "A2",
    "badge": "🟢 A2",
    "name": "Elementary",
    "trName": "Temel Orta Seviye",
    "description": "Günlük iletişim, temel zamanlar, kipler (modals), karşılaştırma yapıları ve temel bağlaçlar.",
    "topicCount": 14
  },
  {
    "id": "B1",
    "badge": "🔵 B1",
    "name": "Intermediate",
    "trName": "Orta Seviye",
    "description": "Geçmiş ve deneyim zamanları arasındaki farklar, edilgen çatı (passive), koşul cümleleri ve dolaylı anlatım.",
    "topicCount": 12
  },
  {
    "id": "B2",
    "badge": "🟣 B2",
    "name": "Upper Intermediate",
    "trName": "İleri Orta Seviye",
    "description": "İleri düzey zamanlar, geçmiş kipler, karma koşul cümleleri (mixed conditionals), devrik yapılar ve akademik dil bilgisi.",
    "topicCount": 12
  }
];

export const GRAMMAR_TOPICS = [
  {
    "id": "a2-g01",
    "level": "A2",
    "order": 1,
    "title": "Present Simple vs. Present Continuous",
    "description": "Genel doğrular ve alışkanlıklar (Simple Present) ile şu anda devam eden eylemlerin (Present Continuous) ve durum fiillerinin (stative verbs) karşılaştırılması.",
    "status": "ready",
    "content": {
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
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Özetle; her zaman tekrarlanan alışkanlıklar, rutinler ve bilimsel gerçekler için Simple Present (V1 / V-s, don't / doesn't), konuşma anında veya bu sıralar geçici olarak devam eden eylemler için ise Present Continuous (am/is/are + V-ing) kullanılır. Duyu, duygu, düşünce ve sahiplik bildiren durum fiilleri (know, understand, want, need, belong, like vb.) konuşma anında bile '-ing' takısı almaz ve Simple Present ile çekimlenir."
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
        },
        {
          "en": "My father usually drinks Turkish coffee, but right now he is drinking herbal tea.",
          "tr": "Babam genellikle Türk kahvesi içer ama şu anda bitki çayı içiyor.",
          "note": "Genel alışkanlık (usually drinks) ile konuşma anındaki geçici eylemin (is drinking) bir arada kullanımı."
        },
        {
          "en": "This soup tastes delicious; what spices do you put in it?",
          "tr": "Bu çorbanın tadı harika; içine hangi baharatları koyuyorsun?",
          "note": "'Taste' burada çorbanın tadını (durum) bildirdiği için -ing almaz; tarif sorulurken de genel doğru (do you put) kullanılır."
        },
        {
          "en": "Be quiet, please! The baby is sleeping in the next room.",
          "tr": "Lütfen sessiz olun! Bebek yan odada uyuyor.",
          "note": "'Be quiet!' ünlemi konuşma anını işaret ettiği için Present Continuous (is sleeping) zorunludur."
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
  },
  {
    "id": "a2-g02",
    "level": "A2",
    "order": 2,
    "title": "Past Simple — Regular & Irregular Verbs",
    "description": "Geçmişte tamamlanmış eylemler, düzenli fiiller (-ed), en önemli düzensiz fiiller (V2) ve 'did / didn't' soru-olumsuz yapıları.",
    "status": "ready",
    "content": {
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
        },
        {
          "heading": "6. Konu Özeti",
          "body": "Past Simple Tense, geçmişte belirli bir zamanda (yesterday, last week, two days ago, in 2010) başlayıp tamamen bitmiş olayları anlatır. Olumlu cümlelerde düzenli fiillere '-ed' eklenir veya düzensiz fiillerin 2. hali (V2) kullanılır. Ancak soru (Did you...?) ve olumsuz (didn't...) cümlelerde 'did' devreye girdiği için ana fiil mutlaka yalın (V1) hâline döner. Durum cümlelerinde ise 'was / were' kullanılır ve 'did' ile birleştirilmez."
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
        },
        {
          "en": "Mozart composed more than six hundred pieces of music during his short life.",
          "tr": "Mozart kısa yaşamı boyunca altı yüzden fazla müzik eseri besteledi.",
          "note": "Hayatta olmayan bir kişinin geçmişte tamamlanmış eylemi (Past Simple - composed)."
        },
        {
          "en": "Who left the kitchen window open last night?",
          "tr": "Dün gece mutfak penceresini kim açık bıraktı?",
          "note": "Özneyi soran 'Who' sorularında 'did' yardımcı fiili kullanılmaz, doğrudan V2 (left) gelir."
        },
        {
          "en": "We didn't book the hotel room in advance, so we couldn't find a place to stay.",
          "tr": "Otel odasını önceden ayırtmadık, bu yüzden kalacak bir yer bulamadık.",
          "note": "Olumsuz geçmiş zamanda 'didn't + V1' (didn't book) yapısı."
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
  },
  {
    "id": "a2-g03",
    "level": "A2",
    "order": 3,
    "title": "Past Continuous",
    "description": "Geçmişte belirli bir anda devam etmekte olan eylemler, was/were + V-ing yapısı ve When/While bağlaçları.",
    "status": "ready",
    "content": {
      "intro": "Past Continuous Tense (Şimdiki Zamanın Hikâyesi — \"yapıyordum / ediyordum\"), geçmişte belirli bir anda devam etmekte olan, henüz bitmemiş eylemleri anlatmak için kullanılır. Özellikle geçmişte uzun süren bir eylem devam ederken başka kısa bir eylemin araya girdiği durumları (When / While) ifade etmede sınavların en temel konularından biridir.",
      "sections": [
        {
          "heading": "1. Past Continuous Nedir ve Nasıl Kurulur?",
          "body": "Türkçeye \"-ıyordu / -iyordu\" (örneğin: \"Kitap okuyordum\", \"Yağmur yağıyordu\") olarak çevrilir. Bu zamanı kurmak için özneye göre \"was\" veya \"were\" yardımcı fiili seçilir ve ana fiilin sonuna \"-ing\" takısı eklenir. Tekil öznelerde (I, He, She, It) \"was\", çoğul öznelerde ve \"You\" öznesinde (You, We, They) \"were\" kullanılır."
        },
        {
          "heading": "2. Temel Kullanım Alanları",
          "body": "1) Geçmişte belirli bir saatte veya anda devam eden eylemler (\"Yesterday at 8 PM, I was studying\").\n2) Geçmişte devam eden uzun bir eylem (Past Continuous) sırasında gerçekleşen kısa ve ani bir olay (Past Simple) (\"I was walking home when it started to rain\").\n3) Geçmişte aynı anda paralel olarak devam eden iki uzun eylem (\"While I was cooking, my brother was setting the table\").\n4) Hikâye anlatımlarında arka planı ve atmosferi betimlemek (\"The sun was shining and the birds were singing\")."
        },
        {
          "heading": "3. When ve While Bağlaçları ile Kullanımı",
          "body": "• WHILE (iken): Süreç bildirdiği için kendisinden hemen sonra genellikle Past Continuous (was/were + V-ing) gelir. (\"While she was sleeping, the phone rang.\")\n• WHEN (-dığında): Genellikle kısa ve ani eylemi anlatan Past Simple (V2) cümleciğinin önüne gelir; ancak devam eden eylemin önüne de gelebilir. Sınavlarda \"When + Simple Past (V2), Past Continuous\" kalıbı en sık sorulan yapıdır."
        },
        {
          "heading": "4. Past Continuous vs. Past Simple Karşılaştırması",
          "body": "Past Simple (V2) geçmişte başlayıp bitmiş, tamamlanmış eylemleri veya art arda gerçekleşen olayları anlatır (\"I opened the door and turned on the light\"). Past Continuous (was/were + V-ing) ise olayın tamamlanmasına değil, o esnada devam etmekte olan sürecine odaklanır."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Past Continuous (was/were + V-ing), geçmişte belirli bir noktada devam etmekte olan yarım kalmış süreçleri anlatır. Tek başına bitmiş olaylar için değil, genellikle 'When' (kısa olay - V2) ve 'While / As / Just as' (uzun süreç - was/were + V-ing) bağlaçlarıyla iki geçmiş eylemi ilişkilendirmek için kullanılır. Durum fiilleri (know, want, believe) burada da '-ing' almaz ve Past Simple (V2) ile ifade edilir."
        }
      ],
      "formulas": [
        {
          "label": "Olumlu Cümle (+)",
          "pattern": "I / He / She / It + was + V-ing\nYou / We / They + were + V-ing",
          "note": "Örn: She was reading a book. / They were playing football."
        },
        {
          "label": "Olumsuz Cümle (-)",
          "pattern": "I / He / She / It + wasn’t (was not) + V-ing\nYou / We / They + weren’t (were not) + V-ing",
          "note": "Örn: I wasn’t listening to music. / We weren’t sleeping."
        },
        {
          "label": "Soru Cümlesi (?)",
          "pattern": "Was + I / he / she / it + V-ing?\nWere + you / we / they + V-ing?",
          "note": "Örn: Were you working at 9 PM last night? — Yes, I was. / No, I wasn’t."
        },
        {
          "label": "When & While Kalıbı",
          "pattern": "While + Past Continuous (was/were V-ing), Past Simple (V2)\nWhen + Past Simple (V2), Past Continuous (was/were V-ing)",
          "note": "Örn: While I was crossing the street, I saw an old friend."
        }
      ],
      "examples": [
        {
          "en": "I was studying English at 10 o’clock last night.",
          "tr": "Dün gece saat 10’da İngilizce çalışıyordum.",
          "note": "Geçmişte belirli bir saatte devam eden eylem."
        },
        {
          "en": "While we were having dinner, the lights went out.",
          "tr": "Biz akşam yemeği yerken elektrikler kesildi.",
          "note": "Uzun eylem (were having) devam ederken kısa eylem (went out) araya girdi."
        },
        {
          "en": "What were you doing when the earthquake happened?",
          "tr": "Deprem olduğunda ne yapıyordun?",
          "note": "When + V2 (happened), soru kısmında Past Continuous (were you doing)."
        },
        {
          "en": "While Ahmet was driving, Sude was looking at the map.",
          "tr": "Ahmet araba kullanırken Sude haritaya bakıyordu.",
          "note": "Geçmişte aynı anda paralel devam eden iki eylem."
        },
        {
          "en": "She wasn’t paying attention to the teacher during the lesson.",
          "tr": "Ders sırasında öğretmene dikkatini vermiyordu.",
          "note": "Tekil özne (She) ile olumsuz kullanım (wasn’t + V-ing)."
        },
        {
          "en": "It was snowing heavily when we left the mountain cabin yesterday morning.",
          "tr": "Dün sabah dağ kulübesinden ayrıldığımızda yoğun kar yağıyordu.",
          "note": "Biz ayrıldığımızda (left - kısa eylem) kar yağışı devam etmekteydi (was snowing - uzun arka plan eylemi)."
        },
        {
          "en": "Why were you standing outside in the cold without a coat?",
          "tr": "Neden soğukta paltosuz bir şekilde dışarıda dikiliyordun?",
          "note": "'You' öznesi ile Past Continuous soru kalıbı (Why + were + you + V-ing)."
        },
        {
          "en": "Just as I was getting off the bus, I dropped my wallet on the pavement.",
          "tr": "Tam otobüsten inerken cüzdanımı kaldırıma düşürdüm.",
          "note": "'Just as' bağlacı da 'while' gibi süreç bildirir ve Past Continuous (was getting off) ile takip edilir."
        }
      ],
      "keyRules": [
        "Durum fiilleri (State Verbs: know, believe, understand, want, need, like, love, hate, belong, remember, mean) süreç bildirmediği için Past Continuous (was/were + V-ing) ile KULLANILMAZ; bu fiillerle Past Simple (V2) kullanılır.",
        "\"At this time yesterday\" (dün bu vakitlerde), \"at 7 PM last night\" (dün gece 7’de), \"all day yesterday\" (dün bütün gün) ifadeleri doğrudan Past Continuous işaretçisidir.",
        "Geçmişte arka arkaya, sırayla yapılan eylemlerde Past Continuous DEĞİL, her iki tarafta da Past Simple (V2) kullanılır: \"When I arrived home, I took off my coat.\" (Eve vardığımda paltomu çıkardım).",
        "\"As\" ve \"Just as\" bağlaçları da tıpkı \"While\" gibi \"tam ... iken\" anlamı taşır ve kendilerinden sonra Past Continuous alır."
      ],
      "commonMistakes": [
        {
          "wrong": "I was knowing the answer to that question.",
          "right": "I knew the answer to that question.",
          "explanation": "\"Know\" (bilmek) bir durum fiilidir (state verb) ve \"-ing\" takısı almaz. Geçmiş zamanda her zaman \"knew\" (V2) olarak kullanılır."
        },
        {
          "wrong": "They was watching a movie at midnight.",
          "right": "They were watching a movie at midnight.",
          "explanation": "Çoğul öznelerle (You, We, They) \"was\" değil, mutlaka \"were\" yardımcı fiili kullanılmalıdır."
        },
        {
          "wrong": "While I walked to school, I was meeting my teacher.",
          "right": "While I was walking to school, I met my teacher.",
          "explanation": "Okula yürümek uzun süren arka plan eylemidir (was walking), öğretmenle karşılaşmak ise anlık eylemdir (met)."
        },
        {
          "wrong": "When the alarm rang, I was waking up and got out of bed.",
          "right": "When the alarm rang, I woke up and got out of bed.",
          "explanation": "Alarmın çalmasıyla uyanıp yataktan kalkmak art arda gerçekleşen tamamlanmış eylemlerdir; bu nedenle Past Simple (woke up) kullanılır."
        }
      ],
      "examTips": [
        "Boşluktan hemen önce \"While\", \"As\" veya \"Just as\" varsa ve seçeneklerde durum fiili (know, want vb.) yoksa öncelikle \"was/were + V-ing\" seçeneğini arayın.",
        "Cümlede \"at this time yesterday\", \"at 9 o’clock last night\" gibi geçmişe ait nokta saat/zaman verilmişse doğru cevap yüksek ihtimalle Past Continuous’tur.",
        "İki boşluklu sorularda seçenekleri elerken önce \"State Verb\" (durum fiili) kontrolü yapın: \"wanting, knowing, believing, needing\" bulunan şıkları anında eleyin.",
        "\"When\" bağlacından hemen sonraki boşlukta genellikle kısa eylem (V2), temel cümlede ise o sırada devam eden uzun eylem (was/were + V-ing) yer alır."
      ]
    }
  },
  {
    "id": "a2-g04",
    "level": "A2",
    "order": 4,
    "title": "Future Tenses — Will / Going to / Present Continuous",
    "description": "Gelecek zaman yapıları: konuşma anındaki kararlar ve tahminler (will), önceden yapılmış planlar ve kanıta dayalı tahminler (be going to), kesinleşmiş randevular (Present Continuous).",
    "status": "ready",
    "content": {
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
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Gelecek zaman seçiminde temel ölçüt kararın ne zaman alındığı ve tahminin neye dayandığıdır: Konuşma anındaki ani kararlar, sözler ve kişisel tahminler (I think, probably) için 'will + V1'; önceden planlanmış niyetler ve somut fiziksel kanıtlara (Look at those clouds!) dayalı tahminler için 'am/is/are going to + V1'; yeri ve saati netleşmiş resmi randevular için ise Present Continuous kullanılır. Zaman bağlaçlarından (when, before, after, as soon as, until) hemen sonra 'will' gelmeyeceği unutulmamalıdır."
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
        },
        {
          "en": "Those bags look very heavy; I will carry one of them for you.",
          "tr": "O çantalar çok ağır görünüyor; bir tanesini senin için taşıyayım.",
          "note": "Konuşma anında karşıdakine yapılan gönüllü teklif ve anlık karar (will + V1)."
        },
        {
          "en": "Watch out! That cyclist is riding too fast; he is going to hit the fence!",
          "tr": "Dikkat et! Şu bisikletli çok hızlı sürüyor; çite çarpacak!",
          "note": "Göz önünde gerçekleşen somut tehlike ve kanıta dayalı tahmin (is going to hit)."
        },
        {
          "en": "As soon as the plane lands in Rome, I will send you a text message.",
          "tr": "Uçak Roma'ya iner inmez sana kısa mesaj göndereceğim.",
          "note": "Zaman bağlacı (As soon as) bulunan yan cümlede 'will' kullanılmaz, Simple Present (lands) gelir."
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
  },
  {
    "id": "a2-g05",
    "level": "A2",
    "order": 5,
    "title": "Present Perfect Simple",
    "description": "Geçmişte başlayıp etkisi süren veya zamanı belirtilmemiş deneyimler; have/has + V3 yapısı ve 'ever, never, just, already, yet' zarfları.",
    "status": "ready",
    "content": {
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
        },
        {
          "heading": "6. Konu Özeti",
          "body": "Present Perfect Simple (have/has + V3), geçmişte gerçekleştiği zamanı önemli olmayan deneyimleri veya sonucu şu anda devam eden olayları anlatır. 'Ever' (sorularda hiç), 'never' (olumlu cümlede asla), 'just' (az önce), 'already' (çoktan) ve 'yet' (olumsuz ve soru sonunda henüz) bu zamanın en önemli ipuçlarıdır. 'Yesterday, last week, ... ago, in 2019' gibi bitmiş geçmiş zaman zarflarıyla asla kullanılmaz."
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
        },
        {
          "en": "My sister has been to Tokyo twice, and she loves Japanese culture.",
          "tr": "Kız kardeşim iki kez Tokyo'da bulundu ve Japon kültürünü çok seviyor.",
          "note": "Gidip dönülmüş yaşam deneyimi ('has been to' + kez sayısı)."
        },
        {
          "en": "Look! Someone has broken the living room window; there is glass everywhere.",
          "tr": "Bak! Biri oturma odasının penceresini kırmış; her yerde cam var.",
          "note": "Eylem geçmişte olmuş ancak sonucu (yerdeki camlar) şu anda göz önünde (Present Perfect)."
        },
        {
          "en": "I have already read this novel, so you can borrow my copy.",
          "tr": "Bu romanı çoktan okudum, dolayısıyla benim nüshamı ödünç alabilirsin.",
          "note": "'Already' yardımcı fiil (have) ile ana fiil (read - V3) arasında yer alır."
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
  },
  {
    "id": "a2-g06",
    "level": "A2",
    "order": 6,
    "title": "Modals: Ability & Possibility (Can, Could, Be Able To)",
    "description": "Şimdiki, geçmiş ve gelecek zamanlarda yetenek ve olasılık bildiren kip yapıları.",
    "status": "ready",
    "content": {
      "intro": "İngilizcede bir işi yapabilme yeteneğimizi (ability) ve bir durumun gerçekleşme olasılığını (possibility) ifade etmek için 'can', 'could' ve 'be able to' yapılarını kullanırız. 'Can' şimdiki/genel yetenekleri, 'could' geçmişteki genel yetenekleri anlatırken; 'be able to' tüm zamanlara çekimlenebilen ve özellikle geçmişte zor bir durumun üstesinden gelerek başarılan tekil eylemleri vurgulayan esnek bir yapıdır.",
      "sections": [
        {
          "heading": "1. Temel Kurallar ve Kullanım Alanları",
          "body": "• CAN: Şimdiki zamanda genel yetenek ('I can swim'), fırsat ve genel olasılık ('Winters can be very cold here') bildirir. Özneye göre değişmez ve kendisinden sonra fiil daima yalın (V1) gelir.\n• COULD: Geçmişteki genel ve sürekli yetenekleri ('When I was six, I could ride a bike') veya şimdiki/gelecek zamandaki zayıf olasılıkları ('It could rain tonight') ifade eder.\n• BE ABLE TO: 'Am/is/are able to' (şimdi), 'was/were able to' (geçmiş), 'will be able to' (gelecek) ve 'have/has been able to' (Present Perfect) şeklinde çekimlenir. 'Can' kipinin giremediği gelecek zaman ve Perfect yapılarda zorunlu olarak 'be able to' kullanılır."
        },
        {
          "heading": "2. Olumlu, Olumsuz ve Soru Yapıları",
          "body": "'Can' ve 'Could' yardımcı kiplerdir; soru yaparken öznenin önüne geçerler ('Can you drive?', 'Could she read?'), olumsuz yaparken 'not' alırlar ('cannot / can't', 'could not / couldn't'). 'Be able to' yapısında ise çekim 'to be' fiili üzerinden yapılır: 'Are you able to come?', 'He wasn't able to finish on time', 'Will they be able to attend?'."
        },
        {
          "heading": "3. Kullanım Farkları ve Karşılaştırmalar (Could vs. Was/Were Able To)",
          "body": "Sınavlarda en çok ölçülen fark geçmiş zamandaki olumlu cümlelerdir:\n1) Geçmişteki GENEL bir yetenek anlatılıyorsa hem 'could' hem 'was/were able to' kullanılabilir: 'My grandfather could speak three languages.'\n2) Geçmişte belirli bir anda çaba harcanarak başarılan TEK SEFERLİK bir olay (managed to) anlatılıyorsa olumlu cümlede 'could' KULLANILMAZ, 'was/were able to' kullanılır: 'The fire spread quickly, but everyone was able to escape.' (could escape YANLIŞ)."
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar",
          "body": "1) Olumsuz geçmiş cümlelerde genel veya tek seferlik ayrımı yoktur; 'couldn't' ve 'wasn't/weren't able to' birbirinin yerine rahatlıkla kullanılabilir ('We couldn't / weren't able to find the hotel').\n2) Duyu fiilleriyle (see, hear, smell, taste, feel) ve zihinsel fiillerle (understand, remember) geçmişte tek seferlik olaylarda dahi 'could' kullanılır: 'We sat at the back, so we could hardly hear the speaker.'"
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Şimdiki yeteneklerde 'can + V1', geçmiş genel yeteneklerde 'could + V1', geçmişte tek seferlik zorlu başarılarda (olumlu cümlede) 'was/were able to + V1', gelecek ve Perfect zamanlarda ise 'will be able to / have been able to + V1' kullanılır. Kip fiillerinden sonra 'to' gelmez (can to go değil, can go)."
        }
      ],
      "formulas": [
        {
          "label": "Şimdiki Yetenek (+ / - / ?)",
          "pattern": "Subject + can / can't + V1\nCan + Subject + V1?",
          "note": "Örn: She can play the violin. / Can you speak Italian?"
        },
        {
          "label": "Geçmiş Genel Yetenek (+ / - / ?)",
          "pattern": "Subject + could / couldn't + V1\nCould + Subject + V1?",
          "note": "Örn: When I was young, I could run very fast."
        },
        {
          "label": "Geçmiş Tekil Başarı (Managed to)",
          "pattern": "Subject + was / were able to + V1",
          "note": "Örn: Despite the heavy traffic, we were able to catch the plane."
        },
        {
          "label": "Gelecek ve Perfect Yetenek",
          "pattern": "Subject + will be able to + V1\nSubject + have/has been able to + V1",
          "note": "Örn: Robots will be able to perform surgeries soon."
        }
      ],
      "examples": [
        {
          "en": "Sude can speak both English and Spanish fluently.",
          "tr": "Sude hem İngilizceyi hem de İspanyolcayı akıcı bir şekilde konuşabiliyor.",
          "note": "Şimdiki zamanda genel dil yeteneği (can + V1)."
        },
        {
          "en": "When my father was a teenager, he could swim across the lake easily.",
          "tr": "Babam gençken gölü kolayca yüzerek geçebilirdi.",
          "note": "Geçmişteki genel ve tekrarlanabilir fiziksel yetenek (could + V1)."
        },
        {
          "en": "The exam was extremely difficult, but Emre was able to pass it with a high score.",
          "tr": "Sınav son derece zordu ama Emre yüksek bir puanla geçmeyi başardı.",
          "note": "Geçmişte zor bir durumda elde edilen tek seferlik başarı (was able to)."
        },
        {
          "en": "I looked everywhere for my glasses, but I couldn't find them.",
          "tr": "Gözlüğümü her yerde aradım ama bulamadım.",
          "note": "Olumsuz cümlede tek seferlik durumda 'couldn't' kullanımı tamamen doğrudur."
        },
        {
          "en": "After you complete this course, you will be able to build your own website.",
          "tr": "Bu kursu tamamladıktan sonra kendi web siteni kurabileceksin.",
          "note": "'Will' sonrasında 'can' gelemeyeceği için 'will be able to + V1' kullanılır."
        },
        {
          "en": "From the top of the tower, we could see the entire city clearly.",
          "tr": "Kulenin tepesinden tüm şehri net bir şekilde görebildik.",
          "note": "Duyu fiili (see) olduğu için tek seferlik geçmiş durumda da 'could' kullanılır."
        },
        {
          "en": "I haven't been able to sleep well since last week.",
          "tr": "Geçen haftadan beri iyi uyuyamıyorum.",
          "note": "'Since' ile Present Perfect gerektiğinden 'haven't been able to' kullanılır."
        },
        {
          "en": "Even a small mistake can cause a serious problem in the system.",
          "tr": "Küçük bir hata bile sistemde ciddi bir soruna yol açabilir.",
          "note": "Genel olasılık bildiren 'can + V1' kullanımı."
        }
      ],
      "keyRules": [
        "'Can' ve 'Could' kiplerinden sonra gelen fiil her zaman yalındır (V1); araya asla 'to' girmez ve fiile '-s / -ed / -ing' eklenmez.",
        "'Will can' veya 'have could' gibi iki kip yan yana gelemez; bu durumlarda 'will be able to' ve 'have/has been able to' kullanılır.",
        "Geçmişte zorluklara rağmen başarılan tek seferlik olumlu eylemlerde (managed to anlamında) 'could' değil, 'was/were able to' seçilir.",
        "Duyu fiilleri (see, hear, smell, taste, feel) geçmişte tekil olaylarda bile 'could' ile kullanılır."
      ],
      "commonMistakes": [
        {
          "wrong": "She can speaks three foreign languages.",
          "right": "She can speak three foreign languages.",
          "explanation": "'Can' kipinden sonra özne 'He/She/It' olsa bile fiil '-s' takısı almaz, yalın (speak) kalır."
        },
        {
          "wrong": "I will can join your team next month.",
          "right": "I will be able to join your team next month.",
          "explanation": "'Will' ve 'can' yan yana kullanılamaz; gelecek zaman yetenek/olasılık için 'will be able to' kullanılır."
        },
        {
          "wrong": "Our car broke down, but the mechanic could fix it in an hour.",
          "right": "Our car broke down, but the mechanic was able to fix it in an hour.",
          "explanation": "Geçmişte tek seferlik özel bir durumun başarıyla sonuçlanmasında olumlu cümlede 'could' değil, 'was able to' kullanılır."
        },
        {
          "wrong": "Are you able swim in deep water?",
          "right": "Are you able to swim in deep water?",
          "explanation": "'Be able to' kalıbında 'to' edatı yapıya dahildir ve unutulmamalıdır."
        }
      ],
      "examTips": [
        "Boşluktan önce 'will', 'would', 'have/has' veya 'to' varsa şıklardaki 'can' ve 'could' seçeneklerini anında eleyin; 'be able to' türevlerini arayın.",
        "Cümlede 'when I was a child / young' gibi geçmiş genel bir dönem varsa 'could' en güçlü adaydır.",
        "Cümlede 'despite, although, finally, fortunately' gibi zorlu bir durumu aşma ipucu ve geçmiş zaman varsa olumlu şıklarda 'was/were able to' seçin.",
        "Olumsuz geçmiş cümlede 'couldn't' ve 'wasn't/weren't able to' aynı anlamdadır; özne-yardımcı fiil uyumuna (I/he/she/it wasn't vs we/you/they weren't) dikkat edin."
      ]
    }
  },
  {
    "id": "a2-g07",
    "level": "A2",
    "order": 7,
    "title": "Modals: Obligation & Advice (Must, Have To, Don’t Have To, Should)",
    "description": "Zorunluluk, gereklilik, yasaklama ve tavsiye bildiren kiplerin olumlu ve olumsuz anlam farkları.",
    "status": "ready",
    "content": {
      "intro": "Günlük hayatta kuralları, zorunlulukları, yasakları ve tavsiyeleri ifade etmek için 'must', 'have to' ve 'should' yapılarını kullanırız. Olumlu cümlelerde 'must' ve 'have to' birbirine çok yakın anlamlar (zorunluluk) taşırken, olumsuz cümlelerde 'mustn't' (kesin yasak!) ile 'don't have to' (gerek yok, zorunlu değil) tamamen farklı iki anlama ayrılır. Bu ayrım A2 seviyesinin en kritik sınav noktasıdır.",
      "sections": [
        {
          "heading": "1. Temel Kurallar ve Kullanım Alanları",
          "body": "• MUST: Konuşmacının kendi içinden gelen güçlü zorunlulukları ('I must buy a gift for my mom'), resmi yazılı kuralları ('Passengers must wear seatbelts') ve güçlü tavsiyeleri ifade eder.\n• HAVE TO / HAS TO: Dışarıdan kaynaklanan kuralları, yasaları veya başkasının koyduğu zorunlulukları ('I have to wear a suit at work') anlatır.\n• SHOULD / OUGHT TO: Zorunluluk değil, tavsiye, öğüt ve doğru olanı belirtir ('You should sleep early')."
        },
        {
          "heading": "2. Olumlu, Olumsuz ve Soru Yapıları",
          "body": "'Must' ve 'Should' doğrudan özneyle kullanılır; soru ve olumsuzda yardımcı fiil almazlar ('Must I wait?', 'You mustn't smoke', 'Should we call?', 'You shouldn't eat so much sugar'). Buna karşılık 'have to' bir yarı-kip (semi-modal) olduğu için zamana ve özneye göre çekimlenir: 3. tekil şahısta 'has to', olumsuzda 'don't / doesn't have to', geçmişte 'had to / didn't have to', soruda ise 'Do/Does/Did + Subject + have to + V1?' şeklinde kurulur."
        },
        {
          "heading": "3. Kullanım Farkları ve Karşılaştırmalar (Mustn't vs. Don't Have To)",
          "body": "• MUSTN'T (Yasaklama - Prohibition): Bir şeyin yapılmasının kesinlikle yasak, tehlikeli veya kurallara aykırı olduğunu bildirir ('You mustn't park here' = Buraya park edemezsin, yasak!).\n• DON'T / DOESN'T HAVE TO (Zorunluluk Yokluğu - Lack of Necessity): Bir şeyi yapmanın zorunlu olmadığını, isterse yapılabileceğini ama gerek olmadığını anlatır ('Tomorrow is Sunday, so I don't have to wake up early' = Erken kalkmama gerek yok)."
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar",
          "body": "1) 'Must' kipinin geçmiş zaman (Past) veya gelecek zaman (Future) çekimi YOKTUR. Geçmişteki tüm zorunluluklar için yalnızca 'had to' ('We had to walk home yesterday'), gelecekteki zorunluluklar için 'will have to' kullanılır.\n2) 'Should' ile 'Ought to' anlamca tamamen aynıdır ('yapmalısın / etmelisin'); tek fark 'ought' kelimesinden sonra 'to' gelmesidir ('You should study' = 'You ought to study')."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Zorunluluklarda içsel karar ve yazılı kurallar için 'must', dış kurallar için 'have to/has to', geçmiş zorunluluklar için 'had to' kullanılır. Yasaklamalarda 'mustn't', 'yapmana gerek yok' anlamında 'don't/doesn't have to', tavsiye ve önerilerde ise 'should / shouldn't + V1' tercih edilir."
        }
      ],
      "formulas": [
        {
          "label": "Zorunluluk (+)",
          "pattern": "Subject + must + V1\nI/You/We/They + have to + V1 | He/She/It + has to + V1",
          "note": "Örn: You must stop at the red light. / She has to work on Saturdays."
        },
        {
          "label": "Yasaklama vs. Gerek Yok (-)",
          "pattern": "Subject + mustn't + V1 (YASAK!)\nSubject + don't / doesn't have to + V1 (GEREK YOK)",
          "note": "Örn: You mustn't touch that wire! / You don't have to pay; it's free."
        },
        {
          "label": "Geçmiş Zorunluluk (Past)",
          "pattern": "Subject + had to + V1 (+)\nSubject + didn't have to + V1 (-)",
          "note": "Örn: I had to take a taxi yesterday because I missed the bus."
        },
        {
          "label": "Tavsiye ve Öğüt (+ / - / ?)",
          "pattern": "Subject + should / shouldn't + V1\nShould + Subject + V1?",
          "note": "Örn: You should see a dentist. / You shouldn't drink cold water."
        }
      ],
      "examples": [
        {
          "en": "Visitors mustn't use flash photography inside the museum.",
          "tr": "Ziyaretçiler müze içinde flaşlı fotoğraf çekmemelidir (yasaktır).",
          "note": "Resmi kural ve yasaklama (mustn't + V1)."
        },
        {
          "en": "You don't have to bring an umbrella; the weather forecast says it will be sunny.",
          "tr": "Şemsiye getirmene gerek yok; hava durumu güneşli olacağını söylüyor.",
          "note": "Zorunluluk olmaması (don't have to + V1)."
        },
        {
          "en": "Ahmet has to wear a helmet whenever he enters the construction site.",
          "tr": "Ahmet inşaat alanına her girdiğinde kask takmak zorundadır.",
          "note": "3. tekil şahısta dış kural/zorunluluk (has to + V1)."
        },
        {
          "en": "We missed the last train last night, so we had to take a taxi home.",
          "tr": "Dün gece son treni kaçırdık, bu yüzden eve taksiyle gitmek zorunda kaldık.",
          "note": "Geçmiş zamandaki zorunluluk için 'must' kullanılamaz; 'had to' kullanılır."
        },
        {
          "en": "You look exhausted; you should take a short break and rest.",
          "tr": "Çok bitkin görünüyorsun; kısa bir mola verip dinlenmelisin.",
          "note": "Tavsiye ve öneri (should + V1)."
        },
        {
          "en": "Does your brother have to work on public holidays?",
          "tr": "Erkek kardeşin resmi tatillerde çalışmak zorunda mı?",
          "note": "'Have to' soru yapısı 'Does + özne + have to + V1' ile kurulur."
        },
        {
          "en": "This is a top-secret document; you mustn't show it to anyone.",
          "tr": "Bu çok gizli bir belgedir; onu kimseye göstermemelisin.",
          "note": "Güçlü uyarı ve kesin yasaklama (mustn't)."
        },
        {
          "en": "Children shouldn't spend too much time in front of screens.",
          "tr": "Çocuklar ekran karşısında çok fazla vakit geçirmemelidir.",
          "note": "Olumsuz tavsiye / doğru olmayan davranış (shouldn't + V1)."
        }
      ],
      "keyRules": [
        "'Mustn't' yasak bildirir ('yapmamalısın, yasak!'); 'don't/doesn't have to' ise 'yapmana gerek yok' demektir.",
        "'Must' kipinin geçmiş hali yoktur; dün veya geçen hafta yaşanan zorunluluklar için daima 'had to' kullanılır.",
        "'Has to' yapısı soru veya olumsuz olduğunda ('does / doesn't' geldiğinde) tekrar 'have to' şekline döner ('She doesn't have to', 'Does she have to?').",
        "'Should' ve 'Must' sonrasında 'to' gelmez; 'Have to' ve 'Ought to' yapılarında ise 'to' zorunludur."
      ],
      "commonMistakes": [
        {
          "wrong": "Yesterday I musted go to the bank to pay the bills.",
          "right": "Yesterday I had to go to the bank to pay the bills.",
          "explanation": "'Must' fiilinin '-ed' almış geçmiş hali yoktur; geçmiş zorunluluk 'had to' ile ifade edilir."
        },
        {
          "wrong": "She doesn't has to cook tonight because we are ordering pizza.",
          "right": "She doesn't have to cook tonight because we are ordering pizza.",
          "explanation": "'Doesn't' yardımcı fiilinden sonra 'has to' değil, yalın 'have to' kullanılır."
        },
        {
          "wrong": "Entrance is free today, so you mustn't buy a ticket.",
          "right": "Entrance is free today, so you don't have to buy a ticket.",
          "explanation": "Girişin ücretsiz olması bilet almanın 'yasak' (mustn't) olduğu değil, 'gerekli olmadığı' (don't have to) anlamına gelir."
        },
        {
          "wrong": "You should to apologize to your friend immediately.",
          "right": "You should apologize to your friend immediately.",
          "explanation": "'Should' kipinden sonra 'to' kullanılmaz, doğrudan yalın fiil (apologize) gelir."
        }
      ],
      "examTips": [
        "Soruda 'It is free / optional / not necessary' ya da 'holiday / Sunday' gibi ipuçları varsa hemen 'don't / doesn't / didn't have to' şıkkına yönelin.",
        "Soruda 'dangerous / forbidden / against the rules / secret / silence' gibi yasak ipuçları varsa 'mustn't' doğru cevaptır.",
        "Cümlede 'yesterday, last night, when I was at school' gibi geçmiş zaman zarfı varsa şıklardaki 'must' ve 'have to' seçeneklerini eleyip 'had to / didn't have to' seçin.",
        "Boşluktan hemen sonra 'to + V1' varsa 'must' ve 'should' şıklarını eleyin ('have to / has to / had to / ought to' kalır)."
      ]
    }
  },
  {
    "id": "a2-g08",
    "level": "A2",
    "order": 8,
    "title": "Modals: Permission & Requests (May, Might, Could)",
    "description": "Kibarca izin isteme, ricada bulunma ve düşük/orta olasılık ifade etme kalıpları.",
    "status": "ready",
    "content": {
      "intro": "İngilizcede sosyal iletişimin en önemli parçalarından biri kibarca izin istemek (permission), birinden ricada bulunmak (requests) ve emin olmadığımız durumlarda olasılık (possibility) belirtmektir. Bu işlevler için 'may', 'might', 'could' ve 'can' kiplerini nezaket derecelerine ve olasılık güçlerine göre kullanırız.",
      "sections": [
        {
          "heading": "1. Temel Kurallar ve Kullanım Alanları",
          "body": "1) İZİN İSTEME (Permission): 'I' veya 'We' öznesiyle karşıdan izin isterken kullanılır: 'Can I...?' (samimi/günlük), 'Could I...?' (kibar), 'May I...?' (resmi ve en kibar).\n2) RİCADA BULUNMA (Polite Requests): Karşıdaki kişiden ('You' öznesi) bir şey yapmasını rica ederken kullanılır: 'Can you help me?' (samimi), 'Could you help me?' (daha kibar ve resmi).\n3) OLASILIK (Possibility): Şimdiki veya gelecekteki belirsiz ihtimalleri (%30-%50) anlatırken 'may', 'might' ve 'could' kullanılır ('She may/might/could be in her office')."
        },
        {
          "heading": "2. Olumlu, Olumsuz ve Soru Yapıları",
          "body": "• Olumlu Olasılık ve İzin Verme: 'Subject + may / might / could + V1' ('It may rain later', 'You may leave the room now').\n• Olumsuz Olasılık: 'Subject + may not / might not + V1' ('He might not come to the party'). DİKKAT: Olumsuz olasılıkta ('belki olmaz' anlamında) 'couldn't' KULLANILMAZ; çünkü 'couldn't' imkânsızlık ('olamaz') bildirir.\n• Soru (İzin ve Rica): 'May / Could / Can + I + V1?' (İzin) ve 'Could / Can / Will / Would + you + V1?' (Rica)."
        },
        {
          "heading": "3. Kullanım Farkları ve Karşılaştırmalar",
          "body": "• 'May you...?' Yapılmaz! Ricada bulunurken 'Can you...?' veya 'Could you...?' denir; ancak 'May you open the window?' KESİNLİKLE YANLIŞTIR. 'May' soru cümlelerinde yalnızca 'I' ve 'We' özneleriyle izin isterken kullanılır ('May I open the window?').\n• İzin Verme Cevapları: 'Could I borrow your pen?' sorusuna izin verirken 'Yes, you can' veya 'Yes, of course' denir ('Yes, you could' denmez, çünkü 'could' soruda sadece nezaket katar)."
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar",
          "body": "1) Olumsuz İhtimal vs. İmkânsızlık: 'She may not / might not know the truth' (Gerçeği bilmiyor olabilir - %50 ihtimal) ile 'She can't / couldn't know the truth' (Gerçeği biliyor olamaz - imkânsız) anlamca tamamen farklıdır.\n2) 'May not' genellikle kısaltılmaz ('mayn't' modern İngilizcede kullanılmaz); 'might not' ise nadiren 'mightn't' olarak kısaltılır."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "İzin isterken 'Can/Could/May I + V1?', karşıdan kibarca bir şey rica ederken 'Can/Could/Would you + V1?' kullanılır ('May you' yoktur!). Gelecek veya şimdiki zamana dair 'belki olur' anlamındaki olasılıklarda 'may / might / could + V1', 'belki olmaz' anlamındaki olumsuz olasılıklarda ise yalnızca 'may not / might not + V1' kullanılır."
        }
      ],
      "formulas": [
        {
          "label": "Kibarca İzin İsteme (Permission)",
          "pattern": "May / Could / Can + I (we) + V1?",
          "note": "Örn: May I come in? / Could I use your phone for a minute?"
        },
        {
          "label": "Kibarca Ricada Bulunma (Request)",
          "pattern": "Could / Can / Would + you + (please) + V1?",
          "note": "Örn: Could you speak more slowly, please? (May you OLMAZ)"
        },
        {
          "label": "Olasılık Bildirme (+)",
          "pattern": "Subject + may / might / could + V1",
          "note": "Örn: Take your coat; it might get cold in the evening."
        },
        {
          "label": "Olumsuz Olasılık (-)",
          "pattern": "Subject + may not / might not + V1",
          "note": "Örn: I'm not sure, but Mert might not attend the meeting."
        }
      ],
      "examples": [
        {
          "en": "May I see your passport and boarding pass, please?",
          "tr": "Pasaportunuzu ve biniş kartınızı görebilir miyim lütfen?",
          "note": "Resmi ortamda 'I' öznesiyle kibarca izin/talep (May I + V1)."
        },
        {
          "en": "Could you please hold the door for me? My hands are full.",
          "tr": "Benim için kapıyı tutabilir misiniz lütfen? Ellerim dolu.",
          "note": "Karşıdaki kişiden kibarca ricada bulunma (Could you + V1)."
        },
        {
          "en": "I don't know where Selin is; she may be in the cafeteria.",
          "tr": "Selin'in nerede olduğunu bilmiyorum; kafeteryada olabilir.",
          "note": "'I don't know' ile desteklenen şimdiki zaman olasılığı (may + be)."
        },
        {
          "en": "We might go to Antalya for our summer holiday, but we haven't decided yet.",
          "tr": "Yaz tatilimiz için Antalya'ya gidebiliriz ama henüz karar vermedik.",
          "note": "Kesinleşmemiş gelecek olasılığı (might + V1)."
        },
        {
          "en": "They might not finish the project today because there is a power outage.",
          "tr": "Elektrik kesintisi olduğu için projeyi bugün bitiremeyebilirler.",
          "note": "'Bitirememe ihtimali var' anlamında olumsuz olasılık (might not + V1)."
        },
        {
          "en": "Students may leave the examination hall after they hand in their papers.",
          "tr": "Öğrenciler kâğıtlarını teslim ettikten sonra sınav salonundan ayrılabilirler.",
          "note": "Resmi izin verme ifadesi (may + V1)."
        },
        {
          "en": "Could I have a glass of water, please?",
          "tr": "Bir bardak su alabilir miyim lütfen?",
          "note": "Restoranda veya misafirlikte kibar istek kalıbı (Could I have...)."
        },
        {
          "en": "Don't throw away that old vase; it could be valuable.",
          "tr": "O eski vazoyu çöpe atma; değerli olabilir.",
          "note": "'Could' kipinin olumlu cümlede olasılık (might/may gibi) anlamında kullanımı."
        }
      ],
      "keyRules": [
        "'May' soru cümlelerinde yalnızca 'I' ve 'We' özneleriyle kullanılır; 'May you help me?' diye bir yapı İngilizcede yoktur.",
        "Cümlede 'I am not sure, perhaps, maybe, I don't know' gibi belirsizlik ifadeleri varsa olasılık bildiren 'may / might / could' tercih edilir.",
        "'Belki yapmaz / olmayabilir' anlamındaki olumsuz olasılık sadece 'may not' veya 'might not' ile kurulur; 'couldn't' kesin imkânsızlık bildirir.",
        "'Could I...?' ile izin istendiğinde olumlu cevap 'Yes, you can' veya 'Yes, you may' şeklinde verilir; 'Yes, you could' denmez."
      ],
      "commonMistakes": [
        {
          "wrong": "May you pass me the salt, please?",
          "right": "Could you pass me the salt, please?",
          "explanation": "'You' öznesiyle rica cümlesi kurulurken 'May' kullanılmaz; 'Could you' veya 'Can you' kullanılır."
        },
        {
          "wrong": "I'm not sure, but our train couldn't arrive on time.",
          "right": "I'm not sure, but our train might not arrive on time.",
          "explanation": "Emin olunmayan olumsuz olasılıklarda ('gecikme ihtimali var') 'couldn't' değil, 'might not / may not' kullanılır."
        },
        {
          "wrong": "She might comes to the concert with us tonight.",
          "right": "She might come to the concert with us tonight.",
          "explanation": "Tüm kiplerde olduğu gibi 'might' sonrasında da fiil yalın (V1: come) kalır, '-s' almaz."
        },
        {
          "wrong": "Could I borrow your dictionary? — Yes, you could.",
          "right": "Could I borrow your dictionary? — Yes, you can.",
          "explanation": "'Could I...?' sorusundaki 'could' nezaket içindir; izin verirken şimdiki zaman ('Yes, you can / may') kullanılır."
        }
      ],
      "examTips": [
        "Soru '_____ you ...?' şeklinde başlıyorsa şıklardaki 'May' seçeneğini hemen eleyin; 'Could' veya 'Can' arayın.",
        "Cümlede 'I'm not sure / I haven't decided / Perhaps' varsa doğrudan 'may / might / could' şıklarına odaklanın.",
        "Resmi bir görevliyle (officer, professor, receptionist) konuşulan '_____ I ...?' sorularında en kibar seçenek olan 'May' veya 'Could' önceliklidir.",
        "Olumsuz olasılık ('I'm not sure, he _____ not come') sorularında 'can't/couldn't' çeldiricisine düşmeyin; 'might not / may not' seçin."
      ]
    }
  },
  {
    "id": "a2-g09",
    "level": "A2",
    "order": 9,
    "title": "Comparative & Superlative Adjectives",
    "description": "Sıfatlarda üstünlük (-er / more) ve en üstünlük (-est / the most) dereceleri ile düzensiz sıfatlar (good, bad, far).",
    "status": "ready",
    "content": {
      "intro": "İki kişiyi, nesneyi veya yeri birbiriyle kıyaslarken 'Comparative' (daha ...), bir varlığı ait olduğu grubun tamamıyla kıyaslayıp en üstün özelliğini belirtirken ise 'Superlative' (en ...) sıfat yapılarını kullanırız. Sıfatın hece sayısı (kısa veya uzun olması) ve düzensiz sıfatlar bu konunun temel taşlarını oluşturur.",
      "sections": [
        {
          "heading": "1. Temel Kurallar ve Kullanım Alanları",
          "body": "1) COMPARATIVE (Üstünlük - 'daha ...'): İki varlığı karşılaştırır. Kısa (tek heceli) sıfatların sonuna '-er' eklenir ('tall -> taller', 'fast -> faster'); uzun (iki ve daha fazla heceli) sıfatların önüne 'more' (veya 'less') getirilir ('expensive -> more expensive'). Karşılaştırılan ikinci unsurdan önce 'than' kullanılır.\n2) SUPERLATIVE (En Üstünlük - 'en ...'): Bir varlığı en az üç veya daha fazla öğeli bir grupla karşılaştırır. Sıfatın önüne mutlaka 'the' (veya my, his gibi bir iyelik sıfatı) gelir; kısa sıfatlara '-est' ('the tallest'), uzun sıfatların önüne 'the most' ('the most expensive') eklenir."
        },
        {
          "heading": "2. Yazım Kuralları ve Düzensiz Sıfatlar",
          "body": "• Yazım Kuralları:\n- Sonu '-e' ile bitenlere sadece '-r / -st' gelir (large -> larger -> the largest).\n- Sonu 'sessiz + y' ile biten iki heceli sıfatlarda 'y' düşer, '-ier / -iest' gelir (happy -> happier -> the happiest, easy -> easier -> the easiest).\n- 'Sessiz + sesli + sessiz' ile biten tek heceli sıfatlarda son harf çiftleşir (big -> bigger -> the biggest, hot -> hotter -> the hottest).\n• Düzensiz Sıfatlar (Irregular Adjectives):\n- good -> better -> the best\n- bad -> worse -> the worst\n- far -> farther/further -> the farthest/furthest\n- little -> less -> the least\n- much/many -> more -> the most"
        },
        {
          "heading": "3. Kullanım Farkları ve Karşılaştırmalar (Than vs. In / Of)",
          "body": "• Comparative cümlelerinin en belirgin işareti boşluktan sonra gelen 'than' kelimesidir ('Ankara is colder than İzmir').\n• Superlative cümlelerinde ise boşluktan önce 'the', cümlenin devamında ise grubu veya yeri belirten 'in' (in the world, in our class, in Turkey) ya da çoğul isimlerle/zamanlarla 'of' (of all, of the three sisters, of my life) ya da 'I have ever + V3' kalıbı yer alır."
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar",
          "body": "1) Eşitlik Karşılaştırması (as + adjective + as): İki varlığın eşit derecede bir özelliğe sahip olduğunu anlatırken 'as ... as' (olumsuzda 'not as/so ... as') kullanılır ve aradaki sıfat KESİNLİKLE YALIN kalır ('Ahmet is as tall as his father').\n2) Comparative Güçlendiriciler: Üstünlük derecesini vurgulamak için comparative sıfatların önüne 'much, a lot, far, a bit, slightly' gelebilir ('much more expensive', 'a lot faster'); ancak 'very faster' veya 'more faster' ASLA KULLANILMAZ."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "İki şey kıyaslanırken (than varsa) kısa sıfata '-er', uzun sıfata 'more' getirilir. Bir grup içindeki en üstün özellik anlatılırken (the ... in/of/ever varsa) kısa sıfata 'the -est', uzun sıfata 'the most' getirilir. 'Good -> better -> the best' ve 'bad -> worse -> the worst' düzensiz dönüşümleri ile 'as + yalın sıfat + as' eşitlik kalıbı unutulmamalıdır."
        }
      ],
      "formulas": [
        {
          "label": "Comparative (İkili Karşılaştırma)",
          "pattern": "Kısa Sıfat + -er + than\nmore / less + Uzun Sıfat + than",
          "note": "Örn: Trains are safer than buses. / This book is more interesting than that one."
        },
        {
          "label": "Superlative (En Üstünlük)",
          "pattern": "the + Kısa Sıfat + -est (in / of ...)\nthe most / the least + Uzun Sıfat (in / of ...)",
          "note": "Örn: Mount Everest is the highest mountain in the world."
        },
        {
          "label": "Eşitlik Kalıbı (As ... As)",
          "pattern": "as + YALIN SIFAT + as\nnot as (so) + YALIN SIFAT + as",
          "note": "Örn: My new phone is as fast as my laptop."
        },
        {
          "label": "Düzensiz Sıfatlar Tablosu",
          "pattern": "good -> better -> the best\nbad -> worse -> the worst\nfar -> further/farther -> the furthest/farthest",
          "note": "Örn: Today's weather is worse than yesterday's."
        }
      ],
      "examples": [
        {
          "en": "A cheetah is much faster than a lion.",
          "tr": "Bir çita, bir aslandan çok daha hızlıdır.",
          "note": "Kısa sıfatta comparative (-er + than) ve 'much' ile güçlendirme."
        },
        {
          "en": "Health is more important than money and fame.",
          "tr": "Sağlık, para ve şöhretten daha önemlidir.",
          "note": "Uzun sıfatta comparative (more + important + than)."
        },
        {
          "en": "Jupiter is the largest planet in our solar system.",
          "tr": "Jüpiter, güneş sistemimizdeki en büyük gezegendir.",
          "note": "'In our solar system' grup belirttiği için superlative (the largest)."
        },
        {
          "en": "This is the most delicious baklava I have ever eaten!",
          "tr": "Bu, hayatımda yediğim en lezzetli baklava!",
          "note": "'I have ever + V3' yapısı her zaman superlative (the most delicious) gerektirir."
        },
        {
          "en": "The traffic this morning was even worse than it was yesterday.",
          "tr": "Bu sabahki trafik dünkünden bile daha kötüydü.",
          "note": "'Bad' düzensiz sıfatının comparative hali (worse + than)."
        },
        {
          "en": "Learning English grammar is not as difficult as many people think.",
          "tr": "İngilizce dil bilgisi öğrenmek birçok insanın düşündüğü kadar zor değildir.",
          "note": "'Not as + yalın sıfat (difficult) + as' eşitlik/kıyaslama yapısı."
        },
        {
          "en": "Sude is the youngest and the most hardworking engineer in the company.",
          "tr": "Sude şirketteki en genç ve en çalışkan mühendistir.",
          "note": "Kısa (the youngest) ve uzun (the most hardworking) superlative yapıların birlikte kullanımı."
        },
        {
          "en": "If you need further information, please contact our customer service.",
          "tr": "Daha fazla (ek) bilgiye ihtiyacınız olursa lütfen müşteri hizmetlerimizle iletişime geçin.",
          "note": "'Far' sıfatının 'further' hali 'daha uzak' yanında 'daha fazla / ek' anlamında da kullanılır."
        }
      ],
      "keyRules": [
        "Aynı sıfata hem 'more' hem '-er' (more taller) ya da hem 'most' hem '-est' (the most tallest) ASLA eklenmez.",
        "Boşluktan hemen sonra 'than' varsa Comparative, boşluktan önce 'the' ve devamında 'in + tekil yer' veya 'of + çoğul grup' ya da 'ever + V3' varsa Superlative seçilir.",
        "'As ... as' kalıbının arasındaki sıfat hiçbir ek (-er, -est, more, most) almaz; daima yalın haldedir.",
        "Superlative yapılarda eğer sıfattan önce 'my, your, his, her, our, their' veya 'this/that' varsa ayrıca 'the' kullanılmaz ('She is my best friend' — 'my the best friend' DEĞİL)."
      ],
      "commonMistakes": [
        {
          "wrong": "My brother is more taller than me.",
          "right": "My brother is taller than me.",
          "explanation": "'Tall' tek heceli kısa bir sıfattır; '-er' aldığında önüne tekrar 'more' gelmez."
        },
        {
          "wrong": "This hotel is the better in the city.",
          "right": "This hotel is the best in the city.",
          "explanation": "'In the city' tüm şehirdeki otellerle kıyaslama (en üstünlük) bildirdiği için 'better' değil, 'the best' kullanılır."
        },
        {
          "wrong": "Silver is not as more expensive as gold.",
          "right": "Silver is not as expensive as gold.",
          "explanation": "'As ... as' kalıbı içinde sıfat yalın (expensive) olmalıdır; 'more' almaz."
        },
        {
          "wrong": "Ahmet is my the closest friend at university.",
          "right": "Ahmet is my closest friend at university.",
          "explanation": "İyelik sıfatı ('my') kullanıldığında superlative sıfatın önüne 'the' gelmez."
        }
      ],
      "examTips": [
        "Cümlede 'than' kelimesini görür görmez Superlative (-est / most) ve yalın şıkları eleyip Comparative (-er / more / worse / better) arayın.",
        "Cümlede '... I have ever seen / read / tasted' kalıbı varsa hiç düşünmeden Superlative ('the -est / the most / the best / the worst') şıkkını işaretleyin.",
        "Boşluğun sağında ve solunda 'as _____ as' varsa '-er, -est, more, most, better, worse' içeren tüm şıkları eleyin; yalın sıfatı seçin.",
        "Boşluktan önce 'much, a lot, far, a bit' varsa devamında Comparative ('much better', 'far more expensive') gelir."
      ]
    }
  },
  {
    "id": "a2-g10",
    "level": "A2",
    "order": 10,
    "title": "Quantifiers (Some, Any, Much, Many, A Lot Of, A Few, A Little)",
    "description": "Sayılabilen ve sayılamayan isimlerle kullanılan miktar belirleyiciler.",
    "status": "ready",
    "content": {
      "intro": "İngilizcede nesnelerin veya kavramların miktarını belirtirken kullandığımız kelimelere 'Quantifiers' (Miktar Belirleyiciler) denir. Doğru miktar belirleyiciyi seçmenin altın kuralı, boşluktan sonra gelen ismin Sayılabilen Çoğul (Countable Plural: books, apples, people) mu yoksa Sayılamayan Tekil (Uncountable: water, money, time, information, advice, furniture, traffic) mi olduğuna ve cümlenin olumlu, olumsuz ya da soru yapısına dikkat etmektir.",
      "sections": [
        {
          "heading": "1. Temel Kurallar: Some ve Any",
          "body": "• SOME (Biraz / Birkaç): Hem sayılabilen çoğul isimlerle ('some friends') hem de sayılamayan isimlerle ('some water') OLUMLU cümlelerde kullanılır.\n• ANY (Hiç / Herhangi): Hem sayılabilen çoğul hem de sayılamayan isimlerle OLUMSUZ cümlelerde ('I don't have any money') ve SORU cümlelerinde ('Do you have any brothers?') kullanılır.\n• Özel Kural: Teklif (Would you like...?) ve rica (Can/Could I have...?) sorularında soru cümlesi olmasına rağmen 'any' değil, 'SOME' kullanılır ('Would you like some tea?')."
        },
        {
          "heading": "2. Much, Many ve A Lot Of / Lots Of",
          "body": "• MANY (Çok / Birçok): Sadece SAYILABİLEN ÇOĞUL isimlerle ('many students', 'many cars') kullanılır. Genellikle olumsuz ve soru cümlelerinde tercih edilir ancak olumlu cümlede de doğrudur.\n• MUCH (Çok): Sadece SAYILAMAYAN isimlerle ('much time', 'much money', 'much traffic') olumsuz ve soru cümlelerinde kullanılır ('I don't have much time', 'How much milk do we need?').\n• A LOT OF / LOTS OF (Çok): Hem sayılabilen çoğul hem de sayılamayan isimlerle özellikle OLUMLU cümlelerde güvenle kullanılır ('a lot of books', 'a lot of patience')."
        },
        {
          "heading": "3. A Few / Few vs. A Little / Little",
          "body": "• A FEW / FEW: Sadece SAYILABİLEN ÇOĞUL isimlerle kullanılır ('a few days', 'a few questions').\n• A LITTLE / LITTLE: Sadece SAYILAMAYAN isimlerle kullanılır ('a little sugar', 'a little hope').\n• Olumlu vs. Olumsuz Anlam Farkı: Başında 'a' olan 'a few' (birkaç - yeterli) ve 'a little' (biraz - yeterli) olumlu bir anlam taşırken; 'a' olmayan 'few' (çok az, neredeyse hiç) ve 'little' (çok az, yetersiz) olumsuz/yetersizlik anlamı katar."
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar",
          "body": "1) Türkçede çoğul gibi düşünülen ancak İngilizcede KESİNLİKLE SAYILAMAYAN (Uncountable) kelimeler sınavlarda çok sık sorulur: money, time, information, advice, news, furniture, luggage/baggage, traffic, homework, housework, bread, weather. Bu kelimeler çoğul '-s' almaz ve 'many / a few' ile ASLA kullanılmaz ('much information', 'a little advice').\n2) Düzensiz çoğul isimler (people, children, men, women, mice, teeth, feet) sonunda '-s' olmasa da sayılabilen çoğuldur ve 'many / a few' alır ('many people', 'a few children')."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Sayılabilen çoğul isimlerle 'many, a few, few', sayılamayan isimlerle 'much, a little, little' kullanılır. 'Some' olumlu cümlelerle ve ikram/rica sorularıyla, 'any' ise olumsuz ve genel soru cümleleriyle eşleşir. 'A lot of' her iki isim türüyle de kullanılabilir."
        }
      ],
      "formulas": [
        {
          "label": "Sayılabilen Çoğul İsimlerle (Countable Plural)",
          "pattern": "many / a few / few / some / any / a lot of + Çoğul İsim (books, people)",
          "note": "Örn: How many languages do you speak? / I have a few close friends."
        },
        {
          "label": "Sayılamayan İsimlerle (Uncountable)",
          "pattern": "much / a little / little / some / any / a lot of + Sayılamayan İsim (water, advice)",
          "note": "Örn: We don't have much time. / Let's add a little salt."
        },
        {
          "label": "Some vs. Any Dağılımı",
          "pattern": "Olumlu (+) & Teklif/Rica (?): SOME\nOlumsuz (-) & Genel Soru (?): ANY",
          "note": "Örn: Would you like some coffee? / There isn't any milk left."
        },
        {
          "label": "Yeterli (+) vs. Yetersiz (-) Azlık",
          "pattern": "a few / a little = biraz/birkaç var (yeterli, olumlu)\nfew / little = neredeyse hiç yok (yetersiz, olumsuz)",
          "note": "Örn: I have a little money, so I can buy this sandwich."
        }
      ],
      "examples": [
        {
          "en": "How much luggage are you taking with you on the flight?",
          "tr": "Uçuşta yanına ne kadar bagaj alıyorsun?",
          "note": "'Luggage' sayılamayan (uncountable) bir isim olduğu için 'How much' kullanılır."
        },
        {
          "en": "There aren't any vacant seats left in the front row.",
          "tr": "Ön sırada hiç boş koltuk kalmadı.",
          "note": "Olumsuz cümlede çoğul isimle 'any' kullanımı."
        },
        {
          "en": "Would you like some homemade lemonade with your cake?",
          "tr": "Pastanızın yanında biraz ev yapımı limonata ister misiniz?",
          "note": "'Would you like...?' bir ikram/teklif sorusu olduğu için 'some' kullanılır."
        },
        {
          "en": "Can you give me a little advice about my job interview?",
          "tr": "İş görüşmem hakkında bana biraz tavsiye verebilir misin?",
          "note": "'Advice' sayılamayan bir isimdir; 'biraz' anlamında 'a little' alır."
        },
        {
          "en": "Only a few students passed the physics exam because it was very hard.",
          "tr": "Çok zor olduğu için fizik sınavını yalnızca birkaç öğrenci geçti.",
          "note": "'Students' sayılabilen çoğul isimdir; 'a few' ile kullanılır."
        },
        {
          "en": "We had very little time before the train departed, so we had to run.",
          "tr": "Tren kalkmadan önce çok az (yetersiz) vaktimiz vardı, bu yüzden koşmak zorunda kaldık.",
          "note": "Sayılamayan 'time' ile olumsuz/yetersizlik bildiren 'little' kullanımı."
        },
        {
          "en": "Were there many people at the art gallery opening last night?",
          "tr": "Dün gece sanat galerisi açılışında çok insan var mıydı?",
          "note": "'People' düzensiz çoğul isim olduğu için 'many' alır."
        },
        {
          "en": "She spends a lot of money on books and concert tickets every month.",
          "tr": "Her ay kitaplara ve konser biletlerine çok para harcıyor.",
          "note": "Olumlu cümlede hem 'money' hem 'books' ile 'a lot of' rahatlıkla kullanılır."
        }
      ],
      "keyRules": [
        "'Money, time, information, advice, furniture, luggage, traffic, news, bread' sayılamayan isimlerdir; 'many' veya 'a few' ile ASLA kullanılmazlar.",
        "'People, children, women, men' sonunda -s olmasa da çoğul sayılabilen isimlerdir; 'much' veya 'a little' DEĞİL, 'many' veya 'a few' alırlar.",
        "İkram ('Would you like...?') ve rica ('Can/Could I have...?') sorularında 'any' değil, 'some' kullanılır.",
        "'A lot of' arkasından bir isim geldiğinde 'of' alır ('a lot of books'); ancak cümle sonunda isimsiz zarf olarak kullanıldığında 'of' düşer ('Thanks a lot')."
      ],
      "commonMistakes": [
        {
          "wrong": "I need some informations about the summer course.",
          "right": "I need some information about the summer course.",
          "explanation": "'Information' sayılamayan bir isimdir ve hiçbir zaman çoğul '-s' takısı almaz."
        },
        {
          "wrong": "How many money do we need for the museum tickets?",
          "right": "How much money do we need for the museum tickets?",
          "explanation": "Türkçede 'kaç lira' dense de İngilizcede 'money' kelimesi sayılamaz (uncountable) kabul edilir ve 'How much' alır."
        },
        {
          "wrong": "There are only a little chairs in the meeting room.",
          "right": "There are only a few chairs in the meeting room.",
          "explanation": "'Chairs' sayılabilen çoğul bir isimdir; 'a little' değil, 'a few' ile kullanılır."
        },
        {
          "wrong": "Could I have any water, please?",
          "right": "Could I have some water, please?",
          "explanation": "Bir şey rica ederken ('Could I have...?') olumlu yanıt beklendiği için 'any' değil, 'some' kullanılır."
        }
      ],
      "examTips": [
        "Boşluktan hemen sonraki kelimeye bakın: Sonunda çoğul '-s' varsa (veya people/children ise) şıklardaki 'much, a little, little' seçeneklerini anında eleyin.",
        "Boşluktan sonraki kelime sayılamayan bir isimse (information, advice, furniture, time, money, water, traffic) şıklardaki 'many, a few, few' seçeneklerini anında eleyin.",
        "Cümle 'Would you like _____ ...?' veya 'Could I have _____ ...?' şeklindeyse doğru cevap 'some'dır.",
        "Boşluktan önce 'very, too, so' varsa ('too much, so many, very little, very few') 'a lot of' şıkkını eleyin ('very a lot of' olmaz)."
      ]
    }
  },
  {
    "id": "a2-g11",
    "level": "A2",
    "order": 11,
    "title": "Possessive Pronouns & Adjectives",
    "description": "İyelik sıfatları (my, your, their) ile iyelik zamirlerinin (mine, yours, theirs) cümle içindeki görevleri.",
    "status": "ready",
    "content": {
      "intro": "İngilizcede bir nesnenin kime ait olduğunu anlatırken iki temel yapı kullanırız: İyelik Sıfatları (Possessive Adjectives: my, your, his, her, its, our, their) ve İyelik Zamirleri (Possessive Pronouns: mine, yours, his, hers, ours, theirs). Bu iki grubu birbirinden ayıran en net ve şaşmaz kural şudur: İyelik sıfatlarından sonra mutlaka bir İSİM gelirken, iyelik zamirleri zaten ismin yerini tuttuğu için kendilerinden sonra ASLA İSİM ALMAZLAR.",
      "sections": [
        {
          "heading": "1. Temel Kurallar ve Kullanım Alanları",
          "body": "• İYELİK SIFATLARI (Possessive Adjectives): 'my, your, his, her, its, our, their'. Bir ismin önüne gelerek o ismin kime ait olduğunu belirtir: 'my bag' (benim çantam), 'their house' (onların evi), 'its tail' (onun kuyruğu).\n• İYELİK ZAMİRLERİ (Possessive Pronouns): 'mine, yours, his, hers, ours, theirs'. Daha önce bahsedilen bir ismi tekrar etmemek için tek başına kullanılır: 'This bag is mine' (Bu çanta benimki), 'Ours is on the second floor' (Bizimki ikinci katta)."
        },
        {
          "heading": "2. Kişi Zamirleri, İyelik Sıfatları ve İyelik Zamirleri Tablosu",
          "body": "• I -> my + isim (benim ...-m) -> mine (benimki)\n• You -> your + isim (senin/sizin ...-n) -> yours (seninki/sizinki)\n• He -> his + isim (onun ...-sı) -> his (onunki - yazılışı aynıdır!)\n• She -> her + isim (onun ...-sı) -> hers (onunki)\n• It -> its + isim (onun ...-sı) -> [İyelik zamiri olarak tek başına kullanılmaz]\n• We -> our + isim (bizim ...-mız) -> ours (bizimki)\n• They -> their + isim (onların ...-ları) -> theirs (onlarınki)"
        },
        {
          "heading": "3. Kullanım Farkları ve Karşılaştırmalar",
          "body": "En kritik ayrım boşluktan sonra bir İSİM olup olmadığıdır:\n• 'Is this YOUR umbrella?' (Boşluktan sonra 'umbrella' ismi var -> İyelik Sıfatı).\n• 'No, it isn't MINE. HERS is blue.' (Boşluklardan sonra isim yok -> İyelik Zamiri).\n• 'A friend of + İyelik Zamiri' Kalıbı: 'Benim arkadaşlarımdan biri' derken 'a friend of mine', 'onun akrabalarından biri' derken 'a relative of hers / his' kalıbı kullanılır ('a friend of me / my' YANLIŞTIR)."
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar",
          "body": "1) 'Its' vs. 'It's' Karışıklığı: Kesme işareti olmayan 'its' iyelik sıfatıdır ('onun' -> 'The dog wagged its tail'). Kesme işaretli 'it's' ise 'it is' veya 'it has' kısaltmasıdır.\n2) 'Whose' (Kimin) Sorusu: Aidiyet sorarken 'Whose + isim' veya tek başına 'Whose' kullanılır ('Whose car is this?' = Bu kimin arabası?). 'Who's' (Who is / Who has) ile karıştırılmamalıdır.\n3) İyelik Zamirlerinde Kesme İşareti Yoktur: 'Yours, hers, ours, theirs' kelimelerinde kesme işareti (your's, her's) ASLA kullanılmaz."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Boşluktan hemen sonra bir isim (veya sıfat + isim) geliyorsa İyelik Sıfatı (my, your, his, her, its, our, their); boşluktan sonra isim gelmiyorsa (fiil, nokta veya edat varsa) ya da 'of _____' kalıbı varsa İyelik Zamiri (mine, yours, his, hers, ours, theirs) seçilir. 'Its' (onun) ile 'It's' (o ...-dır) ve 'Whose' (kimin) ile 'Who's' (kim ...-dır) ayrımlarına dikkat edilmelidir."
        }
      ],
      "formulas": [
        {
          "label": "İyelik Sıfatı Kuralı (+ İsim)",
          "pattern": "my / your / his / her / its / our / their + İSİM (Noun)",
          "note": "Örn: Her laptop is very fast. / They lost their keys."
        },
        {
          "label": "İyelik Zamiri Kuralı (İsimsiz)",
          "pattern": "mine / yours / his / hers / ours / theirs (Tek Başına)",
          "note": "Örn: My phone battery is dead; can I use yours?"
        },
        {
          "label": "Double Genitive ('A friend of ...' Kalıbı)",
          "pattern": "a / some + İsim + of + mine / yours / his / hers / ours / theirs",
          "note": "Örn: We met an old colleague of ours at the airport."
        },
        {
          "label": "Whose (Kimin) Soru Kalıbı",
          "pattern": "Whose + İsim + Yardımcı Fiil + Özne?\nWhose + Yardımcı Fiil + Özne?",
          "note": "Örn: Whose jacket is this? — It is mine."
        }
      ],
      "examples": [
        {
          "en": "I forgot my dictionary at home; may I borrow yours for this lesson?",
          "tr": "Ben sözlüğümü evde unuttum; bu ders için seninkini ödünç alabilir miyim?",
          "note": "İlk boşlukta isim var (my dictionary), ikinci boşlukta isim yok (yours)."
        },
        {
          "en": "Our garden is quite small, whereas theirs is full of fruit trees.",
          "tr": "Bizim bahçemiz oldukça küçük, oysa onlarınki meyve ağaçlarıyla dolu.",
          "note": "'Our garden' (iyelik sıfatı + isim) ve 'theirs' (= their garden, iyelik zamiri)."
        },
        {
          "en": "The cat hurt its paw while jumping off the garden wall.",
          "tr": "Kedi bahçe duvarından atlarken patisini incitti.",
          "note": "Cansız varlık ve hayvanlar için kesme işaretsiz iyelik sıfatı (its + paw)."
        },
        {
          "en": "Sude went to the theatre with a close friend of hers yesterday.",
          "tr": "Sude dün yakın bir arkadaşıyla tiyatroya gitti.",
          "note": "'A friend of + iyelik zamiri (hers)' kalıbı."
        },
        {
          "en": "Whose notebooks are these on the kitchen table? Are they yours or Kerem's?",
          "tr": "Mutfak masasındaki bu defterler kimin? Seninkiler mi yoksa Kerem'inkiler mi?",
          "note": "Aidiyet soran 'Whose + isim' ve isimsiz 'yours'."
        },
        {
          "en": "Ahmet's jacket is black, so this brown one cannot be his.",
          "tr": "Ahmet'in ceketi siyah, dolayısıyla bu kahverengi olan onunki olamaz.",
          "note": "'His' hem iyelik sıfatı hem de iyelik zamiri olarak aynı yazılır."
        },
        {
          "en": "Their flight was delayed for two hours, but ours took off on time.",
          "tr": "Onların uçuşu iki saat rötar yaptı ama bizimki zamanında kalktı.",
          "note": "'Their flight' (sıfat + isim) ve özne konumunda tek başına 'ours' (iyelik zamiri)."
        },
        {
          "en": "Please make sure that everyone writes their own name on the exam paper.",
          "tr": "Lütfen herkesin sınav kâğıdına kendi adını yazdığından emin olun.",
          "note": "'Own' kelimesi daima iyelik sıfatlarından (my own, their own) sonra gelir."
        }
      ],
      "keyRules": [
        "İyelik sıfatları (my, your, her, our, their) tek başına kullanılamaz; arkalarından mutlaka bir isim gelmelidir.",
        "İyelik zamirlerinden (mine, yours, hers, ours, theirs) sonra ASLA bir isim gelmez.",
        "'A friend of _____' gibi 'of' edatlı aidiyet kalıplarında nesne zamiri (me, her, us) veya iyelik sıfatı (my, our) değil, İyelik Zamiri (mine, hers, ours) kullanılır.",
        "'Its' (onun - iyelik sıfatı), 'It's' (It is / It has); 'Whose' (kimin), 'Who's' (Who is / Who has); 'Their' (onların), 'There' (orada) ve 'They're' (They are) yazılışları karıştırılmamalıdır."
      ],
      "commonMistakes": [
        {
          "wrong": "This umbrella isn't my; I think it is her.",
          "right": "This umbrella isn't mine; I think it is hers.",
          "explanation": "Boşluklardan sonra isim gelmediği için iyelik sıfatı (my, her) değil, iyelik zamiri (mine, hers) kullanılmalıdır."
        },
        {
          "wrong": "We are going to have dinner with a cousin of us tonight.",
          "right": "We are going to have dinner with a cousin of ours tonight.",
          "explanation": "'A cousin of ...' kalıbında 'of' sonrasında nesne zamiri (us) değil, iyelik zamiri (ours) kullanılır."
        },
        {
          "wrong": "Istanbul is famous for it's historical palaces and bridges.",
          "right": "Istanbul is famous for its historical palaces and bridges.",
          "explanation": "'Onun tarihi sarayları' anlamında iyelik sıfatı olan kesme işaretsiz 'its' kullanılmalıdır; 'it's' = 'it is' demektir."
        },
        {
          "wrong": "Who's dictionary is lying on the teacher's desk?",
          "right": "Whose dictionary is lying on the teacher's desk?",
          "explanation": "'Kimin sözlüğü' diye sorarken 'Who's' (Who is) değil, aidiyet sorusu olan 'Whose' kullanılır."
        }
      ],
      "examTips": [
        "Boşluktan hemen sonraki kelimeye bakın: Bir isim varsa 'mine, yours, hers, ours, theirs' şıklarını anında eleyin; isim yoksa 'my, your, her, our, their, its' şıklarını anında eleyin.",
        "İki boşluklu sorularda genellikle birincisi isimden önce (my/your/our/their), ikincisi cümle sonunda isimsiz (mine/yours/ours/theirs) olarak sorulur.",
        "Boşluktan önce 'a friend of / a colleague of / a neighbor of' varsa doğrudan '-s' takılı iyelik zamirlerini (mine, yours, his, hers, ours, theirs) seçin.",
        "Boşluktan sonra 'own' kelimesi varsa ('_____ own car') mutlaka İyelik Sıfatı (my, your, his, her, our, their) seçin."
      ]
    }
  },
  {
    "id": "a2-g12",
    "level": "A2",
    "order": 12,
    "title": "Prepositions of Place & Time",
    "description": "Yer ve zaman edatlarının (in, on, at, under, between, next to, until, during) doğru kullanımı.",
    "status": "ready",
    "content": {
      "intro": "Edatlar (Prepositions), cümle içindeki isimlerin zamanını ve konumunu diğer kelimelerle ilişkilendiren küçük ama işlevi çok büyük yapı taşlarıdır. Özellikle 'in, on, at' üçlüsünün genelden özele doğru daralan piramit mantığını ve 'between/among, next to, opposite, until/by, during/for' ayrımlarını kavramak hem okuma parçalarında hem de dil bilgisi testlerinde büyük avantaj sağlar.",
      "sections": [
        {
          "heading": "1. Zaman Edatları: IN, ON, AT Piramidi",
          "body": "• IN (En Geniş Zaman Dilimleri): Yüzyıllar (in the 21st century), yıllar (in 2024, in 1998), mevsimler (in summer, in winter), aylar (in May, in October), günün ana bölümleri (in the morning, in the afternoon, in the evening) ve süreç sonunda ('in ten minutes' = 10 dakika içinde).\n• ON (Günler ve Tarihler): Haftanın günleri (on Monday, on Fridays), tam tarihler (on 15th May, on July 4, 2020), özel gün kelimesi içeren ifadeler (on my birthday, on New Year's Day, on Sunday morning, on a cold winter day).\n• AT (Nokta Saatler ve Özel Anlar): Saatler (at 7 o'clock, at 10:30 PM), günün nokta anları (at night, at midnight, at noon, at dawn/sunrise) ve resmi tatil dönemleri (at the weekend [UK], at Christmas)."
        },
        {
          "heading": "2. Yer Edatları: IN, ON, AT ve Konum Edatları",
          "body": "• IN (Kapalı Alanlar ve Sınırları Belli Bölgeler): Ülkeler, şehirler, mahalleler (in Turkey, in London), odalar, binalar, kutular (in the kitchen, in the box, in a car, in a taxi).\n• ON (Yüzeyler, Katlar ve Toplu Taşıma): Yüzey teması (on the table, on the wall, on the floor), bina katları (on the second floor), cadde/sokaklar (on Oxford Street), üzerinde yürünebilen toplu taşıma araçları (on a bus, on a train, on a plane, on a ship) ve iletişim kanalları (on TV, on the internet, on the phone).\n• AT (Belirli Noktalar, Kurumlar ve Adresler): Tam kapı numarası olan adresler (at 24 Baker Street), buluşma/etkinlik noktaları (at the bus stop, at the door, at the airport, at home, at work, at school, at university)."
        },
        {
          "heading": "3. Kullanım Farkları (Between vs. Among, Until vs. By, During vs. For)",
          "body": "• BETWEEN vs. AMONG: İki varlık veya net olarak tek tek sayılan öğeler arasında 'between' ('between the bank and the post office'); ikiden fazla belirsiz bir kalabalık/grup içinde 'among' ('among the trees').\n• UNTIL (TILL) vs. BY: Bir eylemin o zamana kadar kesintisiz devam ettiğini anlatırken 'until' ('I waited until 5 PM' = 5'e kadar bekledim); en geç o zamana kadar tamamlanacağını anlatırken 'by' ('Finish it by Friday' = En geç Cuma'ya kadar bitir).\n• DURING vs. FOR: 'During + İsim' olayın hangi dönem sırasında olduğunu ('during the summer / during the film'); 'For + Süre' ise ne kadar sürdüğünü ('for two hours / for three days') anlatır."
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar",
          "body": "1) Edat Almayan Zaman Zarfları: 'this, next, last, every' kelimelerinden önce ve 'yesterday, today, tomorrow' ile ASLA 'in, on, at' kullanılmaz ('on last Monday' YANLIŞ -> 'last Monday' DOĞRU; 'in next week' YANLIŞ -> 'next week' DOĞRU).\n2) Ulaşım Araçları: İçinde eğilerek oturulan küçük araçlarda 'in a car / in a taxi'; içinde ayağa kalkılabilen büyük toplu taşıma araçlarında ve bineklerde 'on a bus / on a train / on a plane / on a bike / on a horse'; genel ulaşım türünde ise 'by car / by bus / by plane' (araya the/a girmeden!) ve yürüyerek derken 'on foot' kullanılır."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Zaman ve yerde büyükten küçüğe 'IN (yıl/ay/ülke/şehir/oda) -> ON (gün/tarih/yüzey/kat/otobüs-uçak) -> AT (saat/gece/nokta konum/ev-okul-iş)' kuralı işler. İki şey arasında 'between', süreç boyunca 'during + isim', süre miktarında 'for + sayısal süre', bir noktaya kadar devam etmede 'until' kullanılır ve 'next/last/this/every' önüne edat gelmez."
        }
      ],
      "formulas": [
        {
          "label": "Zaman Piramidi (IN / ON / AT)",
          "pattern": "IN + Yıl / Ay / Mevsim / Sabah-Akşam\nON + Gün / Tam Tarih / ... Day\nAT + Saat / Night / Noon / Midnight / The weekend",
          "note": "Örn: in 1999, in July | on Monday, on Monday morning | at 8:15, at night."
        },
        {
          "label": "Yer Piramidi (IN / ON / AT)",
          "pattern": "IN + Ülke / Şehir / Oda / Kutu / Araba\nON + Yüzey / Kat / Cadde / Otobüs-Tren-Uçak\nAT + Nokta Konum / Ev-İş-Okul / Tam Adres",
          "note": "Örn: in Paris, in the kitchen | on the 3rd floor, on the bus | at the station."
        },
        {
          "label": "Süreç Edatları (During / For / Until)",
          "pattern": "during + İsim (during the meeting)\nfor + Süre (for three weeks)\nuntil + Bitiş Noktası (until midnight)",
          "note": "Örn: Nobody spoke during the exam. / We stayed there until Sunday."
        },
        {
          "label": "Konum Edatları (Place)",
          "pattern": "between A and B (A ile B arasında)\nnext to / beside (bitişiğinde/yanında)\nopposite (karşısında) | under (altında) | behind (arkasında)",
          "note": "Örn: The pharmacy is between the hospital and the bakery."
        }
      ],
      "examples": [
        {
          "en": "Our train leaves at 9:45 AM on Tuesday morning.",
          "tr": "Trenimiz Salı sabahı saat 09:45'te kalkıyor.",
          "note": "Nokta saat için 'at' (at 9:45 AM), gün adı içeren sabah için 'on' (on Tuesday morning)."
        },
        {
          "en": "Atatürk was born in Salonika in 1881.",
          "tr": "Atatürk 1881 yılında Selanik'te doğdu.",
          "note": "Şehir (in Salonika) ve yıl (in 1881) için 'in' kullanılır."
        },
        {
          "en": "Sude lives in an apartment on the fourth floor.",
          "tr": "Sude dördüncü kattaki bir dairede yaşıyor.",
          "note": "Bina katları her zaman 'on' edatı alır (on the fourth floor)."
        },
        {
          "en": "I read two chapters of my book while I was on the plane to Berlin.",
          "tr": "Berlin uçağındayken kitabımın iki bölümünü okudum.",
          "note": "Uçak, tren, otobüs ve gemi gibi büyük taşıtlarda 'on' kullanılır (on the plane)."
        },
        {
          "en": "The library stays open until 10 PM on weekdays.",
          "tr": "Kütüphane hafta içi günlerde akşam 10'a kadar açık kalır.",
          "note": "Bitiş saatine kadar süren devamlılık için 'until' kullanılır."
        },
        {
          "en": "Several people fell asleep during the long conference.",
          "tr": "Uzun konferans sırasında birkaç kişi uyuyakaldı.",
          "note": "Bir olayın/etkinliğin esnasında derken 'during + isim' kullanılır."
        },
        {
          "en": "The small wooden cabin was hidden among the tall pine trees.",
          "tr": "Küçük ahşap kulübe uzun çam ağaçlarının arasında gizlenmişti.",
          "note": "İkiden fazla belirsiz çoğul varlık arasında 'among' kullanılır."
        },
        {
          "en": "In the photo, Ahmet is sitting between his mother and his sister.",
          "tr": "Fotoğrafta Ahmet annesi ile kız kardeşinin arasında oturuyor.",
          "note": "İki kişi arasında 'between ... and ...' kullanılır."
        }
      ],
      "keyRules": [
        "Normalde 'in the morning' denir; ancak önünde gün veya tarih varsa gün baskın çıkar ve 'on' kullanılır: 'on Monday morning', 'on a rainy evening'.",
        "'Night' kelimesi istisnadır; sabah/öğle/akşam 'in' alırken gece 'at night' alır.",
        "'Next, last, this, every' kelimelerinin önüne 'in, on, at' GELMEZ ('See you next Friday', 'We met last summer').",
        "Sayısal bir zaman uzunluğu veriliyorsa ('two hours, five days, a long time') 'for'; bir etkinlik/dönem ismi veriliyorsa ('the holiday, the lesson, the night') 'during' kullanılır."
      ],
      "commonMistakes": [
        {
          "wrong": "We have an important meeting in Monday morning.",
          "right": "We have an important meeting on Monday morning.",
          "explanation": "'Morning' tek başına 'in' alır ancak başında gün adı (Monday) olduğunda 'on Monday morning' olur."
        },
        {
          "wrong": "I will visit my grandparents on next weekend.",
          "right": "I will visit my grandparents next weekend.",
          "explanation": "'Next, last, this, every' ifadelerinden önce hiçbir zaman edatı (in, on, at) kullanılmaz."
        },
        {
          "wrong": "My cousin waited for me at the airport during three hours.",
          "right": "My cousin waited for me at the airport for three hours.",
          "explanation": "'Three hours' sayısal bir süre uzunluğudur; 'during' değil, 'for' ile kullanılır."
        },
        {
          "wrong": "There were many passengers in the bus this morning.",
          "right": "There were many passengers on the bus this morning.",
          "explanation": "Otobüs, tren, uçak ve gemi gibi toplu taşıma araçlarında 'in' değil, 'on' (on the bus) kullanılır."
        }
      ],
      "examTips": [
        "Boşluktan sonra 'Monday morning / Friday night / 23rd April / a cold winter day' gibi 'gün' kelimesine veya tarihine bağlı bir ifade varsa hemen 'on' seçin.",
        "Boşluktan sonra '... and ...' ile bağlı iki unsur varsa ('_____ Rome and Florence') doğru cevap kesinlikle 'between'dir.",
        "Boşluktan sonra bir etkinlik/dönem ismi ('the match, the flight, the summer') varsa 'during'; sayısal bir süre ('two weeks, a long time') varsa 'for' seçin.",
        "Bina katları ('_____ the 2nd floor'), cadde isimleri, ekran/iletişim araçları ('_____ TV, _____ the phone, _____ the internet') ve toplu taşıma ('_____ the train/plane/bus') sorularında 'on' işaretleyin."
      ]
    }
  },
  {
    "id": "a2-g13",
    "level": "A2",
    "order": 13,
    "title": "Adverbs of Manner",
    "description": "Eylemin nasıl yapıldığını anlatan durum zarfları (-ly ekli zarflar ve fast, hard, well gibi düzensiz zarflar).",
    "status": "ready",
    "content": {
      "intro": "Sıfatlar (Adjectives) isimleri nitelerken ('a careful driver' = dikkatli bir sürücü), Durum Zarfları (Adverbs of Manner) fiilleri niteler ve eylemin NASIL (How?) yapıldığını anlatır ('He drives carefully' = Dikkatli bir şekilde sürer). Çoğu durum zarfı sıfata '-ly' eklenerek türetilir; ancak 'good -> well, fast -> fast, hard -> hard' gibi düzensiz zarflar ve duyu/bağfiillerle (look, feel, smell, taste, sound, seem, be) zarf değil sıfat kullanılması kuralı sınavların en sevdiği konudur.",
      "sections": [
        {
          "heading": "1. Temel Kurallar ve '-ly' Türetim Kuralları",
          "body": "Bir eylemin nasıl gerçekleştiğini anlatmak için sıfatların sonuna genellikle '-ly' eklenir:\n• Genel kural: quick -> quickly, slow -> slowly, careful -> carefully, quiet -> quietly.\n• Sonu '-y' ile biten sıfatlarda 'y' düşer, '-ily' gelir: easy -> easily, happy -> happily, angry -> angrily, heavy -> heavily.\n• Sonu '-le' ile bitenlerde 'e' düşer, '-y' gelir: comfortable -> comfortably, terrible -> terribly, gentle -> gently.\n• Sonu '-ic' ile bitenlere '-ally' eklenir: automatic -> automatically, enthusiastic -> enthusiastically."
        },
        {
          "heading": "2. Düzensiz Zarflar (Irregular Adverbs: Good, Fast, Hard, Late)",
          "body": "Bazı çok yaygın kelimeler '-ly' kuralına uymaz:\n• GOOD (iyi - sıfat) -> WELL (iyi bir şekilde - zarf): 'She is a good singer' / 'She sings well'.\n• FAST (hızlı - hem sıfat hem zarf): 'a fast car' / 'He drives fast' ('fastly' diye bir kelime YOKTUR!).\n• HARD (zor/sıkı - hem sıfat hem zarf): 'a hard exam' / 'She works hard'. DİKKAT: 'Hardly' kelimesinin 'sıkı çalışmakla' ilgisi yoktur; 'hardly' = 'neredeyse hiç' demektir!\n• LATE (geç - hem sıfat hem zarf): 'a late train' / 'He arrived late'. DİKKAT: 'Lately' = 'son zamanlarda' demektir!\n• EARLY (erken - hem sıfat hem zarf): 'an early bird' / 'We woke up early'."
        },
        {
          "heading": "3. Kullanım Farkları: Eylem Fiilleri vs. Bağfiiller (Linking Verbs)",
          "body": "• Eylem Fiilleri (Action Verbs: run, speak, write, drive, work, study): Kendilerinden sonra ZARF (Adverb) alırlar ('He speaks English fluently').\n• Bağfiiller / Durum ve Duyu Fiilleri (Linking Verbs: be, seem, appear, look [görünmek], feel, smell, taste, sound, become, get): Bir eylemin nasıl yapıldığını değil, öznenin nasıl olduğunu/göründüğünü anlattıkları için kendilerinden sonra zarf DEĞİL, SIFAT (Adjective) alırlar ('You look tired', 'This soup tastes delicious', 'The music sounds great')."
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar",
          "body": "1) 'Look' Fiili Tuzağı: 'Look' tek başına 'görünmek' anlamındaysa SIFAT alır ('She looks happy' = Mutlu görünüyor). Ancak 'look at' (bir şeye bakmak) veya 'look for' (aramak) eylem bildirdiği için ZARF alır ('She looked at me angrily' = Bana kızgınlıkla baktı).\n2) Sonu '-ly' ile Biten Sıfatlar: 'friendly' (arkadaş canlısı), 'lovely' (hoş), 'lonely' (yalnız), 'silly' (aptalca), 'elderly' (yaşlı) kelimeleri sonunda '-ly' olmasına rağmen zarf değil SIFATTIR ('in a friendly way' şeklinde zarflaştırılır).\n3) Sıfatları Niteleyen Zarflar: Bir sıfatın derecesini belirten kelimeler de zarftır ('extremely cold', 'incredibly fast', 'completely wrong')."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "İsimlerden ve bağfiillerden (be, look, feel, smell, taste, sound, seem) sonra SIFAT; gerçek eylem fiillerinden (drive, speak, work, play) ve sıfatların kendisinden önce ise ZARF (-ly veya well, fast, hard, late, early) kullanılır. 'Fastly' diye bir kelime olmadığı, 'good' sıfatının zarf halinin 'well' olduğu ve 'hard' (sıkı/çok) ile 'hardly' (neredeyse hiç) farkı unutulmamalıdır."
        }
      ],
      "formulas": [
        {
          "label": "Sıfat vs. Zarf Temel Görevi",
          "pattern": "Adjective + İsim (a careful driver)\nFiil + Adverb of Manner (drives carefully)",
          "note": "Örn: She is a fluent speaker. -> She speaks fluently."
        },
        {
          "label": "Bağfiil (Linking Verb) Kuralı",
          "pattern": "be / look / feel / smell / taste / sound / seem + SIFAT (Adjective)",
          "note": "Örn: The cake smells wonderful. (wonderfully DEĞİL)"
        },
        {
          "label": "Düzensiz Zarflar (Irregular)",
          "pattern": "good -> well | fast -> fast | hard -> hard | late -> late | early -> early",
          "note": "Örn: They played well and worked hard."
        },
        {
          "label": "Zarf + Sıfat Kombinasyonu",
          "pattern": "Adverb (-ly) + Adjective (extremely difficult, surprisingly easy)",
          "note": "Örn: The exam questions were surprisingly easy."
        }
      ],
      "examples": [
        {
          "en": "Please read the instructions carefully before you start the machine.",
          "tr": "Makineyi çalıştırmadan önce lütfen talimatları dikkatlice okuyun.",
          "note": "'Read' eylem fiilini niteleyen durum zarfı (carefully)."
        },
        {
          "en": "Sude plays the piano very well; she practices hard every day.",
          "tr": "Sude piyanoyu çok iyi çalar; her gün sıkı pratik yapar.",
          "note": "Düzensiz zarflar: 'well' (plays fiilini niteler) ve 'hard' (practices fiilini niteler)."
        },
        {
          "en": "This freshly baked bread smells amazing!",
          "tr": "Bu taze pişmiş ekmek harika kokuyor!",
          "note": "'Smell' bağfiil (linking verb) olduğu için zarf değil, sıfat (amazing) alır."
        },
        {
          "en": "The children were playing happily in the snow.",
          "tr": "Çocuklar karda mutlulukla oynuyorlardı.",
          "note": "'Happy' sıfatında 'y' düşüp '-ily' gelerek 'happily' zarfına dönüşmüştür."
        },
        {
          "en": "Don't drive so fast on this wet road; it is very dangerous.",
          "tr": "Bu ıslak yolda bu kadar hızlı sürme; çok tehlikeli.",
          "note": "'Fast' hem sıfat hem zarftır; 'fastly' diye bir kelime yoktur."
        },
        {
          "en": "The manager looked at the late employee angrily.",
          "tr": "Müdür geç kalan çalışana kızgın bir şekilde baktı.",
          "note": "'Look at' (bakmak) eylem fiili olduğu için zarf (angrily) alır."
        },
        {
          "en": "Although he studied all night, he could hardly keep his eyes open in the exam.",
          "tr": "Bütün gece çalışmasına rağmen sınavda gözlerini neredeyse hiç açık tutamadı.",
          "note": "'Hardly' = 'neredeyse hiç / güçlükle' anlamındadır."
        },
        {
          "en": "Our new neighbors are very friendly; they greeted us warmly.",
          "tr": "Yeni komşularımız çok cana yakın; bizi sıcak bir şekilde karşıladılar.",
          "note": "'Friendly' ('are' sonrasında) bir sıfattır; 'warmly' ('greeted' fiilini niteleyen) bir zarftır."
        }
      ],
      "keyRules": [
        "İngilizcede 'fastly' diye bir kelime KESİNLİKLE YOKTUR; 'fast' hem sıfat hem de zarf olarak aynı kalır.",
        "'Good' bir sıfattır ('a good book'); bir fiili nitelerken zarf hali olan 'well' kullanılır ('speaks well'). Ancak sağlık durumundan bahsederken 'I feel well' (kendimi sağlıklı/iyi hissediyorum) doğrudur.",
        "'Hard' zarfı 'sıkı, çok, gayretle' demektir ('work hard'); 'hardly' ise 'neredeyse hiç' demektir ('hardly ever').",
        "'Be, seem, look (görünmek), feel, smell, taste, sound' fiillerinden sonra zarf (-ly) DEĞİL, sıfat kullanılır."
      ],
      "commonMistakes": [
        {
          "wrong": "Ahmet speaks German very good.",
          "right": "Ahmet speaks German very well.",
          "explanation": "'Speak' bir eylem fiilidir; sıfat olan 'good' ile değil, zarf olan 'well' ile nitelenir."
        },
        {
          "wrong": "The ambulance drove very fastly to the hospital.",
          "right": "The ambulance drove very fast to the hospital.",
          "explanation": "'Fast' kelimesinin zarf hali de 'fast'tir; 'fastly' diye bir sözcük yoktur."
        },
        {
          "wrong": "Your new perfume smells wonderfully.",
          "right": "Your new perfume smells wonderful.",
          "explanation": "'Smell' (kokmak) bir duyu bağfiilidir; öznenin özelliğini anlattığı için zarf (wonderfully) değil, sıfat (wonderful) alır."
        },
        {
          "wrong": "She worked very hardly to pass the university entrance exam.",
          "right": "She worked very hard to pass the university entrance exam.",
          "explanation": "'Sıkı/çok çalışmak' anlamında 'work hard' denir; 'worked hardly' dersek 'neredeyse hiç çalışmadı' anlamına gelir."
        }
      ],
      "examTips": [
        "Şıklarda 'fastly' görürseniz hiçbir zaman işaretlemeyin; doğrudan eleyin.",
        "Boşluktan önce 'taste, smell, sound, seem, feel' veya edatsız 'look' varsa '-ly' ile biten zarf şıklarını eleyip yalın sıfatı seçin.",
        "Boşluktan önce 'look at / look for / listen to' veya normal bir eylem fiili (write, run, answer, explain) varsa '-ly' zarfını veya 'well / fast / hard' seçin.",
        "Boşluktan hemen sonra bir sıfat varsa ('_____ cold', '_____ impossible') o sıfatı derecelendiren '-ly' zarfını ('extremely cold', 'nearly impossible') seçin."
      ]
    }
  },
  {
    "id": "a2-g14",
    "level": "A2",
    "order": 14,
    "title": "Basic Relative Clauses (Who, Which, Where)",
    "description": "İnsanları, nesneleri ve yerleri niteleyen temel sıfat cümlecikleri.",
    "status": "ready",
    "content": {
      "intro": "Sıfat Cümlecikleri (Relative Clauses), bir ismi tanımlamak, hangi kişiden, nesneden veya yerden bahsettiğimizi netleştirmek ve iki ayrı cümleyi tek bir akıcı cümlede birleştirmek için kullanılır. Türkçeye '-an / -en / -dığı' (konuşan adam, aldığım kitap, doğduğum şehir) olarak çevrilen bu yapıda doğru ilgi zamirini (who, which, that, where, whose) seçmek için boşluktan hemen önceki isme ve boşluktan hemen sonraki yapıya bakılır.",
      "sections": [
        {
          "heading": "1. Temel Kurallar: Who, Which ve That",
          "body": "• WHO (İnsanlar): Yalnızca insanları (the woman, the doctor, people, a friend) nitelemek için kullanılır ('A chef is a person who cooks in a restaurant').\n• WHICH (Nesneler, Hayvanlar ve Kavramlar): Cansız varlıkları ve hayvanları (the car, the book, the dog, a machine) nitelemek için kullanılır ('I lost the watch which my father gave me').\n• THAT (Joker Kelime): Tanımlayıcı (virgülsüz) sıfat cümleciklerinde hem İNSANLAR için 'who' yerine hem de NESNELER için 'which' yerine kullanılabilir ('the man that/who called', 'the laptop that/which I bought')."
        },
        {
          "heading": "2. Yerleri ve Aidiyeti Niteleme: Where ve Whose",
          "body": "• WHERE (Yerler): Bir yer ismini (the city, the hotel, the restaurant, the house) nitelerken o yerde bir eylem gerçekleşiyorsa ('orada / içinde' anlamında) kullanılır ve kendisinden sonra mutlaka ÖZNE + FİİL gelir ('This is the café where we first met').\n• WHOSE (Aidiyet - 'ki onun'): Hem insanlar hem de nesneler için 'onun / onların' anlamında sahiplik kurar ve kendisinden hemen sonra mutlaka bir İSİM gelir ('I met a girl whose brother is a pilot' = Erkek kardeşi pilot olan bir kızla tanıştım)."
        },
        {
          "heading": "3. Kullanım Farkları (Where vs. Which/That Yer İsimlerinde)",
          "body": "Sınavlarda en çok düşülen tuzak yer isimleridir (hotel, city, restaurant, museum). Boşluktan önce bir yer ismi varsa hemen 'where' atlamayın! Şu iki kurala bakın:\n1) Boşluktan hemen sonra FİİL varsa özne aranıyordur -> 'WHICH / THAT' kullanılır ('This is the hotel which has a swimming pool').\n2) Cümlecik içinde yer edatı (in, at, to, from) kalmışsa veya o yer yan cümlenin doğrudan nesnesiyse -> 'WHICH / THAT' kullanılır ('the hotel which we stayed at', 'the city which I visited').\n3) Edat yoksa ve boşluktan sonra 'Özne + Fiil' gelerek 'o yerde' anlamı veriyorsa -> 'WHERE' kullanılır ('the hotel where we stayed')."
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar",
          "body": "1) Zamir Tekrarı Yapılmaz: Relative clause zaten ismin yerini tuttuğu için yan cümlede o ismi karşılayan 'he, she, it, they, there' zamirleri tekrar YAZILMAZ ('The movie which I watched IT' YANLIŞ -> 'The movie which I watched' DOĞRU).\n2) Nesne Konumunda Düşürme (Omission): Eğer 'who, which, that' sonrasında yeni bir 'Özne + Fiil' geliyorsa (yani ilgi zamiri nesne konumundaysa) tamamen atılabilir: 'The cake (which/that) my mother made was delicious.' Ancak boşluktan sonra doğrudan fiil geliyorsa (özne konumundaysa) ASLA atılamaz."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Boşluktan önceki isim İNSAN ise 'who / that', CANSIZ NESNE veya HAYVAN ise 'which / that', YER ise ve 'orada' anlamında Özne+Fiil takip ediyorsa 'where', iki isim arasında AİDİYET kuruyorsa 'whose + isim' seçilir. Yer isimlerinden sonra doğrudan fiil veya cümle sonunda edat (in/at/to) varsa 'where' değil 'which/that' kullanılır."
        }
      ],
      "formulas": [
        {
          "label": "İnsanları Niteleme (Who / That)",
          "pattern": "İnsan İsmi (Person) + who / that + Fiil (veya Özne + Fiil)",
          "note": "Örn: Do you know the architect who designed this building?"
        },
        {
          "label": "Nesneleri ve Hayvanları Niteleme (Which / That)",
          "pattern": "Cansız İsim / Hayvan + which / that + Fiil (veya Özne + Fiil)",
          "note": "Örn: The dictionary which is on the table belongs to Sude."
        },
        {
          "label": "Yerleri Niteleme (Where vs. Which)",
          "pattern": "Yer İsmi + WHERE + Özne + Fiil (Edat YOK)\nYer İsmi + WHICH / THAT + Fiil (veya ... Edat VAR)",
          "note": "Örn: The village where I grew up vs. The village which is near the lake."
        },
        {
          "label": "Aidiyet Niteleme (Whose)",
          "pattern": "İnsan / Nesne + WHOSE + İsim (Noun) + Fiil",
          "note": "Örn: That is the writer whose novel won the first prize."
        }
      ],
      "examples": [
        {
          "en": "An astronaut is a scientist who travels into space.",
          "tr": "Astronot, uzaya seyahat eden bir bilim insanıdır.",
          "note": "'A scientist' (insan) öznesini niteleyen 'who + fiil' yapısı."
        },
        {
          "en": "I can't find the keys which I left on the kitchen counter this morning.",
          "tr": "Bu sabah mutfak tezgâhının üzerinde bıraktığım anahtarları bulamıyorum.",
          "note": "'The keys' (cansız nesne) ismini niteleyen 'which + özne + fiil' yapısı."
        },
        {
          "en": "Antalya is a coastal city where millions of tourists spend their holidays.",
          "tr": "Antalya, milyonlarca turistin tatilini geçirdiği bir kıyı şehridir.",
          "note": "'A coastal city' (yer) + 'where + özne + fiil' ('o şehirde tatil geçirirler')."
        },
        {
          "en": "We booked a hotel which has an indoor swimming pool and a spa.",
          "tr": "Kapalı yüzme havuzu ve spası olan bir otel ayırttık.",
          "note": "'A hotel' yer ismi olsa da boşluktan hemen sonra fiil (has) geldiği için 'where' değil 'which' kullanılır."
        },
        {
          "en": "The woman whose car was stolen called the police immediately.",
          "tr": "Arabası çalınan kadın hemen polisi aradı.",
          "note": "'The woman' ile 'car' (isim) arasında sahiplik kuran 'whose'."
        },
        {
          "en": "Is this the restaurant that you recommended to us last week?",
          "tr": "Geçen hafta bize tavsiye ettiğin restoran bu mu?",
          "note": "'Recommend' fiili 'restoranı tavsiye etmek' (nesne) olarak kullanıldığı için 'where' değil, 'that/which' alır."
        },
        {
          "en": "People who exercise regularly generally have more energy.",
          "tr": "Düzenli egzersiz yapan insanlar genellikle daha fazla enerjiye sahiptir.",
          "note": "Çoğul insan ismi (People) + 'who + fiil'."
        },
        {
          "en": "The documentary which we watched in history class was fascinating.",
          "tr": "Tarih dersinde izlediğimiz belgesel büyüleyiciydi.",
          "note": "'The documentary' cansız nesnedir; 'which' ile nitelenir."
        }
      ],
      "keyRules": [
        "'Who' sadece insanlar için, 'which' sadece cansızlar ve hayvanlar için, 'that' ise her ikisi için kullanılır.",
        "'Where' kelimesinden hemen sonra ASLA doğrudan fiil gelmez ('the house where is big' YANLIŞ -> 'the house which is big' DOĞRU).",
        "Boşluktan önceki kelime ile boşluktan sonraki yalın isim arasında 'onun ...-sı' ilişkisi varsa (the man _____ dog, the student _____ father) cevap 'whose'dur.",
        "Relative clause içinde nitelenen isme ait ikinci bir nesne zamiri (it, them, him, her, there) kullanılmaz."
      ],
      "commonMistakes": [
        {
          "wrong": "This is the bakery where sells the freshest bread in town.",
          "right": "This is the bakery which sells the freshest bread in town.",
          "explanation": "'Bakery' bir yer olsa da boşluktan hemen sonra 'sells' fiili geldiği için özne zamiri olan 'which' veya 'that' kullanılmalıdır."
        },
        {
          "wrong": "The laptop who I bought yesterday is not working properly.",
          "right": "The laptop which I bought yesterday is not working properly.",
          "explanation": "'The laptop' cansız bir nesnedir; 'who' yalnızca insanlar için kullanılır."
        },
        {
          "wrong": "That is the small town where my grandfather was born there.",
          "right": "That is the small town where my grandfather was born.",
          "explanation": "'Where' zaten 'orada' (in that town) anlamını içerir; cümle sonunda tekrar 'there' kullanılmaz."
        },
        {
          "wrong": "Do you know the boy who his sister is in our class?",
          "right": "Do you know the boy whose sister is in our class?",
          "explanation": "'Kız kardeşi bizim sınıfta olan çocuk' derken 'who his' diye bir yapı yoktur; iyelik ilgi zamiri 'whose' kullanılır."
        }
      ],
      "examTips": [
        "Boşluğun solundaki isme ve sağındaki kelimeye birlikte bakın: Solunda İnsan + Sağında Fiil/Özne varsa 'who/that'; Solunda Cansız + Sağında Fiil/Özne varsa 'which/that' seçin.",
        "Solunda Yer ismi varsa hemen sağını kontrol edin: Sağında doğrudan Fiil varsa ('is, was, has, sells, offers') veya cümle sonunda 'in, at, to' edatı varsa 'where' şıkkını eleyip 'which/that' seçin.",
        "Solunda bir isim, sağında da 'a/an/the' almayan yalın bir İSİM ('_____ father, _____ roof, _____ name') varsa ve 'onun' anlamı uyuyorsa 'whose' doğru cevaptır.",
        "Şıklarda 'where' ile birlikte yan cümlede 'there' veya 'which' ile birlikte yan cümlede 'it/them' tekrar ediliyorsa o şıkkı hemen eleyin."
      ]
    }
  },
  {
    "id": "b1-g01",
    "level": "B1",
    "order": 1,
    "title": "Present Perfect vs. Past Simple (For & Since)",
    "description": "Geçmişle bugünü bağlayan Present Perfect (have/has + V3) ile belirli geçmiş zaman Past Simple (V2) arasındaki farklar.",
    "status": "ready",
    "content": {
      "intro": "Türk öğrencilerin İngilizce öğrenirken en çok karıştırdığı konu Present Perfect (have/has + V3) ile Past Simple (V2) arasındaki farktır. Çünkü Türkçede her ikisi de çoğu zaman \"-dı / -di\" geçmiş zaman ekiyle çevrilir. Oysa İngilizcede ayrım çok nettir: Eylemin geçmişte tam olarak NE ZAMAN yapıldığı belliyse ve o zaman dilimi kapandıysa Past Simple; zamanı belirsizse, etkisi sürüyorsa veya geçmişte başlayıp hâlâ devam ediyorsa Present Perfect kullanılır.",
      "sections": [
        {
          "heading": "1. İki Zaman Arasındaki Temel Mantık Farkı",
          "body": "• Past Simple (V2): Geçmişle bağını koparmış, tamamlanmış olaylardır. \"Yesterday, last week, in 2018, two days ago, when I was a child\" gibi bitmiş zaman ifadeleriyle kullanılır.\n• Present Perfect (have/has + V3): Geçmişte başlamış ama günümüzle bağı devam eden eylemlerdir. Ya eylem hâlâ sürüyordur (\"Üç yıldır burada yaşıyorum\"), ya eylemin sonucu şu anda gözle görülüyordur (\"Anahtarımı kaybettim [şu an içeri giremiyorum]\"), ya da zamanı belirtilmeden hayat tecrübesi anlatılıyordur (\"Paris’te bulundum\")."
        },
        {
          "heading": "2. For ve Since Kullanımı",
          "body": "• FOR + Süreç (Toplam Süre): Eylemin ne kadar sürdüğünü belirtir. (\"for two hours, for five years, for a long time, for ages\").\n• SINCE + Başlangıç Noktası: Eylemin geçmişte ne zaman başladığını belirtir. (\"since 2020, since Monday, since last summer, since I graduated\").\nÖnemli Kural: \"Since\" bağlacından sonra bir cümle gelirse, \"since\"in bağlı olduğu yan cümlecik Past Simple (V2), ana cümle ise Present Perfect (have/has + V3) olur: \"We have known each other since we were children.\""
        },
        {
          "heading": "3. Ever, Never, Just, Already, Yet, Recently, So Far",
          "body": "• Ever / Never: Hayat deneyimlerinde soru (\"Have you ever ridden a horse?\") ve olumsuz anlamda (\"I have never seen snow\") kullanılır.\n• Just: Henüz / az önce biten eylemler (\"She has just left the office\").\n• Already: Beklenenden önce tamamlanan eylemler (\"I have already finished my homework\").\n• Yet: Olumsuz ve soru cümlelerinin sonunda \"henüz / daha\" anlamında (\"Has the train arrived yet? / No, it hasn’t arrived yet\").\n• So far / Up to now / Lately / Recently: \"Şu ana kadar / son zamanlarda\" anlamıyla Present Perfect gerektirir."
        },
        {
          "heading": "4. Bitmiş Zaman vs. Bitmemiş Zaman Dilimi",
          "body": "• \"This morning / this week / today / this year\" gibi zaman dilimleri henüz tamamlanmadıysa Present Perfect kullanılır: \"I have drunk three cups of coffee today.\"\n• Ancak o zaman dilimi kapandıysa (örneğin akşam saat 8’de \"this morning\" diyorsak) Past Simple kullanılır: \"I drank two cups of coffee this morning.\""
        },
        {
          "heading": "Konu Özeti",
          "body": "Present Perfect (have/has + V3), geçmişte başlayıp etkisi şu anda devam eden ya da net zamanı belirtilmeyen yaşam deneyimleri için kullanılır (for/since, just, already, yet). Past Simple (V2 / did) ise geçmişte belirli bir zamanda (yesterday, in 2010, two days ago) tamamlanmış ve bitmiş eylemleri ifade eder."
        }
      ],
      "formulas": [
        {
          "label": "Present Perfect (+ / - / ?)",
          "pattern": "(+) Subject + have / has + V3\n(-) Subject + haven’t / hasn’t + V3\n(?) Have / Has + Subject + V3?",
          "note": "I/You/We/They → have | He/She/It → has"
        },
        {
          "label": "Past Simple (+ / - / ?)",
          "pattern": "(+) Subject + V2\n(-) Subject + didn’t + V1 (yalın fiil)\n(?) Did + Subject + V1 (yalın fiil)?",
          "note": "Olumsuz ve soruda \"did\" geldiği için fiil V1 (yalın) hâline döner!"
        },
        {
          "label": "Since Cümle Kalıbı (Altın Kural)",
          "pattern": "Main Clause (have/has + V3) + SINCE + Past Simple (V2)",
          "note": "Örn: She has worked here since she moved to Istanbul."
        }
      ],
      "examples": [
        {
          "en": "I have lived in Ankara for six years.",
          "tr": "Altı yıldır Ankara’da yaşıyorum. (Hâlâ Ankara’da yaşıyorum.)",
          "note": "Geçmişte başlayıp bugün de devam eden durum → Present Perfect + for."
        },
        {
          "en": "I lived in Ankara for six years before I moved to Izmir.",
          "tr": "İzmir’e taşınmadan önce altı yıl Ankara’da yaşadım. (Artık orada yaşamıyorum.)",
          "note": "Geçmişte başlayıp geçmişte bitmiş durum → Past Simple."
        },
        {
          "en": "Have you seen the new movie yet? — Yes, I saw it last night.",
          "tr": "Yeni filmi henüz izledin mi? — Evet, dün gece izledim.",
          "note": "İlk cümlede zaman belirsiz (Have you seen), ikinci cümlede \"last night\" belirli zaman (saw)."
        },
        {
          "en": "We haven’t heard from him since he left the company.",
          "tr": "Şirketten ayrıldığından beri ondan haber almadık.",
          "note": "Ana cümle Present Perfect (haven’t heard), since cümleciği Past Simple (left)."
        },
        {
          "en": "Shakespeare wrote more than thirty plays.",
          "tr": "Shakespeare otuzdan fazla oyun yazdı.",
          "note": "Hayatta olmayan kişilerin yaptığı eylemler kapandığı için her zaman Past Simple (wrote) kullanılır."
        },
        {
          "en": "I haven't seen my primary school teacher since we graduated in 2015.",
          "tr": "2015 yılında mezun olduğumuzdan beri ilkokul öğretmenimi görmedim.",
          "note": "Belirli başlangıç noktası bildiren \"since + past clause\" ile Present Perfect kullanımı."
        },
        {
          "en": "Did you visit the Topkapı Palace when you were staying in İstanbul last month?",
          "tr": "Geçen ay İstanbul'da kalırken Topkapı Sarayı'nı ziyaret ettin mi?",
          "note": "Geçmişte belirli ve tamamlanmış zaman dilimi (last month) için Past Simple sorusu."
        },
        {
          "en": "They have lived in three different countries over the past six years.",
          "tr": "Son altı yıl içinde üç farklı ülkede yaşadılar.",
          "note": "Geçmişten bugüne uzanan süreçte deneyim ve birikim (over the past... + Present Perfect)."
        }
      ],
      "keyRules": [
        "\"Yesterday, ... ago, last (week/month/year), in 1999, when + cümle, what time...?, when...?\" ifadeleri KESİNLİKLE Present Perfect ile kullanılmaz; doğrudan Past Simple (V2) ister.",
        "\"Where have you been?\" (Neredeydin? — gittin ve geri geldin) ile \"Where has she gone?\" (Nereye gitti? — henüz dönmedi, hâlâ orada) arasındaki \"been to\" vs \"gone to\" farkına dikkat edin.",
        "\"When\" ile başlayan bir soruya (\"When did you buy this car?\") asla \"have/has + V3\" ile soru sorulmaz veya cevap verilmez.",
        "Hayatta olmayan tarihi şahsiyetlerin (Atatürk, Einstein, Shakespeare vb.) eylemleri artık devam edemeyeceği için \"for\" kullanılsa bile Past Simple ile ifade edilir."
      ],
      "commonMistakes": [
        {
          "wrong": "I have seen him yesterday at the library.",
          "right": "I saw him yesterday at the library.",
          "explanation": "\"Yesterday\" belirli bir geçmiş zaman ifadesidir. Belirli geçmiş zaman zarflarıyla Present Perfect (have seen) kullanılmaz."
        },
        {
          "wrong": "She is living in London since 2021.",
          "right": "She has lived (veya has been living) in London since 2021.",
          "explanation": "Geçmişten bugüne uzanan \"since / for\" süreçlerinde Türkçedeki gibi şimdiki zaman (is living) değil, Present Perfect kullanılır."
        },
        {
          "wrong": "When have you graduated from university?",
          "right": "When did you graduate from university?",
          "explanation": "\"When\" (ne zaman) sorusu geçmişte nokta zaman sorduğu için her zaman \"Did + Subject + V1\" ile kurulur."
        },
        {
          "wrong": "I didn’t finish my report yet.",
          "right": "I haven’t finished my report yet.",
          "explanation": "\"Yet\" (henüz) zarfı geçmişten şu ana kadar olan süreci ifade ettiği için Present Perfect olumsuz (haven’t/hasn’t V3) ile kullanılır."
        }
      ],
      "examTips": [
        "Cümlede \"yesterday, ago, in + geçmiş yıl (in 2015), last...\" görürseniz \"have/has + V3\" seçeneklerini saniyesinde eleyin ve doğrudan V2 seçin.",
        "Boşluktan sonra bir zaman aralığı (three days, a long time, ten years) varsa \"for\"; başlangıç noktası (2019, Friday, childhood, V2 cümle) varsa \"since\" seçin.",
        "Cümlede \"so far, up to now, lately, recently, yet, already, just, ever, since\" ipuçlarından biri varsa önceliğiniz her zaman Present Perfect (have/has + V3) olsun.",
        "İki boşluklu \"since\" sorularında kalıbı unutmayın: [Boşluk 1: have/has V3] + SINCE + [Boşluk 2: V2]."
      ]
    }
  },
  {
    "id": "b1-g02",
    "level": "B1",
    "order": 2,
    "title": "Present Perfect Continuous",
    "description": "Geçmişte başlayıp konuşma anında hâlâ devam eden veya etkisi yeni bitmiş süreç odaklı eylemler (have/has been + V-ing).",
    "status": "ready",
    "content": {
      "intro": "Present Perfect Continuous Tense (have/has been + V-ing), geçmişte başlayıp konuşma anında kesintisiz biçimde sürmekte olan eylemleri veya etkisi/sonucu şu anda gözle görülür şekilde yeni sona ermiş süreçleri vurgulamak için kullanılır. Temel odak noktası eylemin tamamlanması (sonuç) değil, ne kadar süredir devam ettiği (süreç) ve harcanan emektir.",
      "sections": [
        {
          "heading": "1. Süreç Vurgusu ve \"How Long...?\" Soruları",
          "body": "Present Perfect Continuous, bir eylemin \"ne kadar süredir\" (how long) yapılmakta olduğunu anlatırken for ve since belirteçleriyle birlikte sıklıkla kullanılır: \"I have been studying for three hours\" (Üç saattir ders çalışıyorum - ve hala çalışmaktayım)."
        },
        {
          "heading": "2. Yeni Sona Ermiş ve Belirtisi/Etkisi Görülen Eylemler",
          "body": "Eylem tam konuşma anında bitmiş olsa bile, fiziksel sonucu ortadaysa bu zaman yapısı kullanılır: \"Your clothes are covered in paint! Have you been painting the room?\" (Üstün boya içinde! Odayı mı boyuyordun?)."
        },
        {
          "heading": "3. Present Perfect Simple ile Farkı (Süreç vs. Sonuç)",
          "body": "• Continuous: Eylemin kendisine ve sürecine odaklanır (I have been writing emails all morning - hala devam ediyor olabilir).\n• Simple: Eylemin tamamlanmasına ve miktarına/sonucuna odaklanır (I have written five emails - eylem bitti, 5 adet e-posta hazır)."
        },
        {
          "heading": "4. Durum Fiilleri (Stative Verbs) İstisnası",
          "body": "Know, believe, understand, like, belong gibi durum fiilleri süreç bildirse dahi Continuous çekim alamaz; bunun yerine Present Perfect Simple kullanılır: \"I have known him for years\" (have been knowing YANLIŞTIR)."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "have/has been + V-ing yapısı sürece, eylemin devamlılığına ve gözle görülür mevcut sonuçlara odaklanır. \"How long\" sorularının standart yanıtıdır. Durum fiilleri bu yapıda kullanılamaz."
        }
      ],
      "formulas": [
        {
          "label": "Olumlu (+)",
          "pattern": "Subject + have / has + been + V-ing",
          "note": "Örn: She has been waiting for the bus for 30 minutes."
        },
        {
          "label": "Olumsuz (-)",
          "pattern": "Subject + haven't / hasn't + been + V-ing",
          "note": "Örn: I haven't been sleeping well lately."
        },
        {
          "label": "Soru (?)",
          "pattern": "Have / Has + Subject + been + V-ing?",
          "note": "Örn: How long have you been learning English?"
        },
        {
          "label": "Stative Verb Kuralı",
          "pattern": "Stative Verb -> Present Perfect Simple kullanılır",
          "note": "Örn: I have had this car for five years (have been having DEĞİL)."
        }
      ],
      "examples": [
        {
          "en": "It has been raining steadily since early this morning, and the streets are flooded.",
          "tr": "Sabahın erken saatlerinden beri aralıksız yağmur yağıyor ve sokaklar su altında.",
          "note": "Süregelen doğa olayı (has been raining)."
        },
        {
          "en": "Why are your hands so dirty? Have you been working in the garden?",
          "tr": "Ellerin neden bu kadar kirli? Bahçede mi çalışıyordun?",
          "note": "Mevcut fiziksel belirti ve etki (Have you been working)."
        },
        {
          "en": "Ahmet has been learning English for six months, and his pronunciation is improving fast.",
          "tr": "Ahmet altı aydır İngilizce öğreniyor ve telaffuzu hızla gelişiyor.",
          "note": "Süreç vurgusu (has been learning)."
        },
        {
          "en": "I have been trying to reach customer service all morning, but the line is always busy.",
          "tr": "Bütün sabahtır müşteri hizmetlerine ulaşmaya çalışıyorum ama hat hep meşgul.",
          "note": "Tekrarlanan ve süren çaba (have been trying)."
        },
        {
          "en": "Sude is exhausted because she has been preparing her presentation since dawn.",
          "tr": "Sude çok yorgun çünkü şafaktan beri sunumunu hazırlıyor.",
          "note": "Yorgunluğun sebebi olan süreç (has been preparing)."
        },
        {
          "en": "How long have you been living in this modern apartment complex?",
          "tr": "Ne kadar süredir bu modern apartman kompleksinde yaşıyorsunuz?",
          "note": "\"How long\" soru kalıbı (have you been living)."
        },
        {
          "en": "We haven't been practicing enough recently, so we might lose the tournament.",
          "tr": "Son zamanlarda yeterince antrenman yapmıyoruz, bu yüzden turnuvayı kaybedebiliriz.",
          "note": "Olumsuz süreç bildirimi (haven't been practicing)."
        },
        {
          "en": "He has been writing that historical novel for over three years now.",
          "tr": "Şimdi üç yılı aşkın bir süredir o tarihi romanı yazıyor.",
          "note": "Uzun süreli süreç odaklı eylem (has been writing)."
        }
      ],
      "keyRules": [
        "For (süreç boyunca: for 3 days) ve since (başlangıç anından itibaren: since Monday) bu zamanın en sık kullanılan belirteçleridir.",
        "\"Lately\" ve \"recently\" kelimeleri son dönemdeki geçici alışkanlık ve süreçleri anlatırken bu zamanla sıkça kullanılır.",
        "Tamamlanmış miktar veya sayı bildiren cümlelerde (how many, how much) Continuous değil Simple kullanılır: \"He has written 3 books\".",
        "Live ve work fiilleri hem Present Perfect Simple hem Continuous ile anlam farkı olmaksızın kullanılabilir."
      ],
      "commonMistakes": [
        {
          "wrong": "I have been knowing Sarah since elementary school.",
          "right": "I have known Sarah since elementary school.",
          "explanation": "'Know' bir durum fiilidir ve asla continuous (-ing) çekimi almaz; Present Perfect Simple (have known) kullanılmalıdır."
        },
        {
          "wrong": "She has been writing three detailed essays today.",
          "right": "She has written three detailed essays today.",
          "explanation": "Eylemin kaç kez yapıldığı veya kaç adet tamamlandığı belirtildiğinde Present Perfect Simple (has written) kullanılır."
        },
        {
          "wrong": "How long are you waiting here?",
          "right": "How long have you been waiting here?",
          "explanation": "Geçmişten şu ana kadar ne kadar süredir beklendiğini sormak için Present Continuous değil Present Perfect Continuous kullanılır."
        },
        {
          "wrong": "It is raining since yesterday morning.",
          "right": "It has been raining since yesterday morning.",
          "explanation": "'Since' ile geçmişe bağlanan eylemlerde Present Continuous (is raining) kullanılamaz; has been raining gereklidir."
        }
      ],
      "examTips": [
        "Cümlede \"How long...?\" sorusu varsa ve fiil durum fiili değilse ilk olarak have/has been + V-ing şıkkını değerlendirin.",
        "\"All day, all morning, for hours, lately\" ifadeleri süreç bildirdiği için genellikle Present Perfect Continuous çeker.",
        "Seçeneklerde \"knowing, believing, wanting\" gibi -ing almış durum fiilleri görürseniz hemen eleyin.",
        "Cümlede \"twice, three times, several items\" gibi tamamlanmış adet/miktar varsa Continuous değil Simple seçin."
      ]
    }
  },
  {
    "id": "b1-g03",
    "level": "B1",
    "order": 3,
    "title": "Past Perfect Simple",
    "description": "Geçmişteki bir olaydan daha önce gerçekleşmiş eylemler (had + V3) ve before, after, by the time bağlaçları.",
    "status": "ready",
    "content": {
      "intro": "Past Perfect Simple Tense (had + V3), geçmişte yaşanmış iki olaydan daha önce meydana gelmiş olanını (geçmişin geçmişini) netleştirmek ve zaman sırasını belirgin kılmak için kullanılır. İngilizcede zaman çizgisi geriye doğru ilerlerken, geçmişteki bir referans noktasından daha eski olan eylem mutlaka Past Perfect ile anlatılır.",
      "sections": [
        {
          "heading": "1. Temel Mantık: İki Geçmiş Eylemin Kronolojisi",
          "body": "Geçmişte iki olay ardışık olarak yaşandığında: 1. Olan eylem (daha eski): Past Perfect (had + V3) ile ifade edilir. 2. Olan eylem (daha yeni): Past Simple (V2) ile ifade edilir. Örnek: \"When we arrived at the cinema, the movie had already started\" (Sinemaya vardığımızda film çoktan başlamıştı)."
        },
        {
          "heading": "2. \"By the time\" ve \"Before\" Bağlaçları ile Kullanım",
          "body": "\"By the time\" (-e kadar) bağlacının bulunduğu yan cümlede Past Simple kullanılırken, ana cümlede Past Perfect kullanılır: \"By the time the police arrived, the thieves had escaped\" (Polis gelene kadar hırsızlar kaçmıştı)."
        },
        {
          "heading": "3. \"After\" ve \"As soon as\" Bağlaçları ile Kullanım",
          "body": "\"After\" (-den sonra) bağlacı doğal olarak ilk gerçekleşen eylemi bağladığı için ardından Past Perfect alır: \"After she had finished her homework, she went out with her friends\" (Ödevini bitirdikten sonra arkadaşlarıyla dışarı çıktı)."
        },
        {
          "heading": "4. Geçmişteki Neden-Sonuç İlişkileri",
          "body": "Geçmişteki bir duygu veya durumun nedenini açıklarken Past Perfect kullanılır: \"Ahmet was very nervous because he had never flown before\" (Ahmet çok gergindi çünkü daha önce hiç uçağa binmemişti)."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Past Perfect (had + V3) geçmişte daha önce gerçekleşmiş ilk olayı anlatır. \"By the time + Past Simple, had V3\" ve \"After + had V3, Past Simple\" temel sınav kalıplarıdır."
        }
      ],
      "formulas": [
        {
          "label": "Olumlu (+)",
          "pattern": "Subject + had + V3 (Past Participle)",
          "note": "Örn: The train had already left when I reached the station."
        },
        {
          "label": "Olumsuz (-)",
          "pattern": "Subject + hadn't + V3",
          "note": "Örn: She hadn't seen that film before yesterday."
        },
        {
          "label": "Soru (?)",
          "pattern": "Had + Subject + V3?",
          "note": "Örn: Had you finished the report before the boss asked for it?"
        },
        {
          "label": "Zaman Bağlacı Formülü",
          "pattern": "By the time + Past Simple (V2), Past Perfect (had V3)",
          "note": "Örn: By the time we arrived, they had already eaten dinner."
        }
      ],
      "examples": [
        {
          "en": "When we arrived at the station, the express train had already departed.",
          "tr": "İstasyona vardığımızda ekspres tren çoktan hareket etmişti.",
          "note": "Trenin kalkması daha önce gerçekleştiği için \"had departed\"."
        },
        {
          "en": "By the time the firefighters arrived, the neighbors had extinguished the fire.",
          "tr": "İtfaiyeciler gelene kadar komşular yangını söndürmüştü.",
          "note": "\"By the time + V2, had V3\" şablonu."
        },
        {
          "en": "She realized that she had left her car keys inside the locked office.",
          "tr": "Araba anahtarlarını kilitli ofisin içinde unuttuğunu fark etti.",
          "note": "Unutma eylemi fark etme anından önce yaşandı."
        },
        {
          "en": "After Ahmet had completed his military service, he started working as an engineer.",
          "tr": "Ahmet askerlik hizmetini tamamladıktan sonra mühendis olarak çalışmaya başladı.",
          "note": "\"After + had completed\"."
        },
        {
          "en": "Sude had never visited a European city before she traveled to Rome last spring.",
          "tr": "Sude geçen bahar Roma'ya seyahat etmeden önce hiçbir Avrupa şehrini ziyaret etmemişti.",
          "note": "Geçmişteki ilk deneyim (had never visited)."
        },
        {
          "en": "He couldn't pay for the grocery shopping because he had forgotten his wallet at home.",
          "tr": "Cüzdanını evde unuttuğu için market alışverişini ödeyemedi.",
          "note": "Geçmişteki sonucun daha önceki nedeni (had forgotten)."
        },
        {
          "en": "The meeting had already started by the time the manager joined the video call.",
          "tr": "Yönetici görüntülü görüşmeye katıldığında toplantı çoktan başlamıştı.",
          "note": "Toplantının başlaması daha önce tamamlandı."
        },
        {
          "en": "They had lived in Germany for ten years before they decided to relocate to Turkey.",
          "tr": "Türkiye'ye taşınmaya karar vermeden önce Almanya'da on yıl yaşamışlardı.",
          "note": "Geçmişteki karardan önceki on yıllık süreç."
        }
      ],
      "keyRules": [
        "Past Perfect tek başına kullanılmaz; mutlaka geçmişteki başka bir referans noktası veya eylemle (Past Simple) ilişkilendirilir.",
        "\"Already, just, never\" zarfları yardımcı fiil \"had\" ile ana fiil \"V3\" arasına girer: \"had already finished\".",
        "Zaman sırası \"before/after\" ile çok net olduğunda günlük dilde bazen her iki eylem de Past Simple yapılabilir; ancak sınavlarda Past Perfect kuralı test edilir.",
        "\"By the time\" yan cümlesine ASLA \"had V3\" gelmez; yan cümle Past Simple (V2), ana cümle had V3 olur."
      ],
      "commonMistakes": [
        {
          "wrong": "By the time we had arrived, the show started.",
          "right": "By the time we arrived, the show had started.",
          "explanation": "\"By the time\" ifadesinin hemen ardındaki cümlecik Past Simple (arrived), diğer ana cümle Past Perfect (had started) olur."
        },
        {
          "wrong": "I had bought a new computer yesterday.",
          "right": "I bought a new computer yesterday.",
          "explanation": "Geçmişte tek bir tamamlanmış olay varsa ve karşılaştırılan başka geçmiş olay yoksa Past Perfect değil Past Simple kullanılır."
        },
        {
          "wrong": "When I opened the door, I saw that someone broke the window.",
          "right": "When I opened the door, I saw that someone had broken the window.",
          "explanation": "Pencerenin kırılması görme ve kapıyı açma eyleminden daha önce yaşandığı için Past Perfect (had broken) gereklidir."
        },
        {
          "wrong": "She didn't eat anything because she already had lunch.",
          "right": "She didn't eat anything because she had already had lunch.",
          "explanation": "Yemek yememe sebebinin öncesini anlatmak için Past Perfect (had had) kullanılmalıdır."
        }
      ],
      "examTips": [
        "Soruda \"By the time + V2\" gördüyseniz virgülden sonraki ana cümlede doğrudan \"had + V3\" arayın.",
        "Cümlede \"realized, noticed, discovered that...\" fiilleri varsa sonrasındaki boşlukta genellikle Past Perfect (had V3) aranır.",
        "\"Before\" ve \"after\" bağlaçlı sorularda olayların kronolojik sırasını belirleyin; ilk gerçekleşene \"had V3\", ikinciye \"V2\" koyun.",
        "Şıklarda \"have/has + V3\" varsa ve cümlenin diğer kısmı Past Simple ise (was, said, went), zaman uyumu gereği Present Perfect elenir."
      ]
    }
  },
  {
    "id": "b1-g04",
    "level": "B1",
    "order": 4,
    "title": "Used To & Would",
    "description": "Geçmişte yapılan ancak artık devam etmeyen alışkanlıklar ve durumlar (used to, didn’t use to, would, be/get used to).",
    "status": "ready",
    "content": {
      "intro": "\"Used to\" ve \"Would\", geçmişte düzenli olarak tekrarlanan ancak günümüzde artık geçerli olmayan alışkanlıkları anlatmak için kullanılır. Aralarındaki en temel ayrım, \"used to\" yapısının hem geçmiş durumları (state) hem de eylemleri (action) kapsayabilmesi; \"would\" yapısının ise yalnızca geçmiş eylemler için kullanılabilmesidir. Ayrıca \"be used to\" ve \"get used to\" kalıpları bu yapıyla karıştırılmaması gereken ayrı yapılardır.",
      "sections": [
        {
          "heading": "1. \"Used to\": Geçmiş Alışkanlıklar ve Durumlar",
          "body": "\"Used to + V1\", geçmişte doğru olan fakat artık sona ermiş durumları ve alışkanlıkları ifade eder: \"I used to have long hair\" (Eskiden uzun saçlarım vardı - durum), \"He used to smoke a pack a day\" (Eskiden günde bir paket sigara içerdi - alışkanlık)."
        },
        {
          "heading": "2. \"Would\": Yalnızca Geçmiş Tekrarlanan Eylemler",
          "body": "\"Would + V1\", geçmişte nostaljik olarak tekrarlanan alışkanlıkları anlatır ancak durum fiilleriyle (stative verbs: be, live, have, know, like) KULLANILAMAZ: \"Every summer we would visit our grandparents\" (DOĞRU) / \"I would live in London\" (YANLIŞ, used to live olmalıdır)."
        },
        {
          "heading": "3. Soru ve Olumsuz Biçim: \"didn't use to\"",
          "body": "Olumsuz ve soru biçimlerinde \"did / didn't\" yardımcı fiili geldiğinde fiilin sonundaki \"d\" harfi düşer: \"didn't use to + V1\" ve \"Did you use to + V1?\"."
        },
        {
          "heading": "4. Karıştırılan Yapılar: \"Be Used to\" ve \"Get Used to\"",
          "body": "• be used to + V-ing / Noun: Alışkın olmak (durum): \"I am used to waking up early\".\n• get used to + V-ing / Noun: Alışmak (süreç): \"You will soon get used to the cold weather\"."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Used to hem eylem hem durum için geçmiş alışkanlıkları ifade eder. Would yalnızca geçmiş eylemler için nostaljik anlatımda kullanılır (durum fiilleriyle kullanılmaz). Did / didn't ile \"use to\" biçiminde \"d\" harfi düşer. Be/get used to yapısı ise -ing alır."
        }
      ],
      "formulas": [
        {
          "label": "Used to Olumlu (+)",
          "pattern": "Subject + used to + V1 (base form)",
          "note": "Örn: I used to ride my bike to school every day."
        },
        {
          "label": "Used to Olumsuz (-)",
          "pattern": "Subject + didn't use to + V1",
          "note": "Örn: She didn't use to like spicy Mexican food."
        },
        {
          "label": "Would ile Geçmiş Alışkanlık",
          "pattern": "Subject + would + V1 (Yalnızca Action Verbs)",
          "note": "Örn: On Sundays, my grandfather would tell us stories."
        },
        {
          "label": "Be / Get Used to",
          "pattern": "Subject + be / get used to + V-ing / Noun",
          "note": "Örn: He is used to working under intense pressure."
        }
      ],
      "examples": [
        {
          "en": "My family used to live in a small coastal town before moving to Ankara.",
          "tr": "Ailem Ankara'ya taşınmadan önce küçük bir sahil kasabasında yaşardı.",
          "note": "Durum fiili (live) olduğu için \"would\" kullanılamaz, \"used to\" kullanılır."
        },
        {
          "en": "Whenever we visited my grandmother in the summer, she would bake fresh cookies for us.",
          "tr": "Yazın büyükannemi ne zaman ziyaret etsek bizim için taze kurabiyeler pişirirdi.",
          "note": "Geçmişte tekrarlanan sevecen eylem (would bake)."
        },
        {
          "en": "Ahmet didn't use to drink coffee in the mornings, but now he cannot wake up without it.",
          "tr": "Ahmet eskiden sabahları kahve içmezdi ama artık o olmadan uyanamıyor.",
          "note": "didn't use to (d harfi düştü)."
        },
        {
          "en": "Did you use to play video games for hours when you were a teenager?",
          "tr": "Gençken saatlerce video oyunu oynar mıydın?",
          "note": "Soru kalıbı (Did you use to)."
        },
        {
          "en": "I used to believe that the moon was following our car when I was a child.",
          "tr": "Çocukken ayın arabamızı takip ettiğine inanırdım.",
          "note": "Zihinsel durum fiili (believe) ile used to."
        },
        {
          "en": "Every evening after school, the boys would gather at the playground to play football.",
          "tr": "Her akşam okuldan sonra çocuklar futbol oynamak için oyun alanında toplanırlardı.",
          "note": "Geçmiş alışkanlık eylemi (would gather)."
        },
        {
          "en": "She has lived in London for two years, so she is used to the rainy weather.",
          "tr": "İki yıldır Londra'da yaşıyor, bu yüzden yağmurlu havaya alışkın.",
          "note": "Alışkın olmak (be used to + noun)."
        },
        {
          "en": "It took Sude several weeks to get used to waking up at 6 a.m. for her new job.",
          "tr": "Sude'nin yeni işi için sabah 6'da uyanmaya alışması birkaç hafta sürdü.",
          "note": "Alışma süreci (get used to + waking up)."
        }
      ],
      "keyRules": [
        "\"Used to\" yapısının şimdiki zaman hali YOKTUR; şu anki alışkanlıklar için Simple Present ve usually kullanılır: \"I usually wake up early\" (I use to wake up YANLIŞTIR).",
        "Stative verbs (live, have, know, like, be) ile asla \"would\" geçmiş alışkanlık kipinde kullanılamaz; sadece \"used to\" kullanılır.",
        "\"didn't used to\" yazımı yaygın bir hatadır; doğrusu \"didn't use to\" şeklindedir.",
        "\"be used to\" yapısından sonra fiil gelirse daima \"-ing\" takısı alır (\"I am used to living alone\")."
      ],
      "commonMistakes": [
        {
          "wrong": "When I was younger, I would have a cute golden retriever.",
          "right": "When I was younger, I used to have a cute golden retriever.",
          "explanation": "'Have' sahiplik bildiren bir durum fiilidir; geçmiş durumlar için 'would' değil 'used to' kullanılır."
        },
        {
          "wrong": "I didn't used to like olives when I was a child.",
          "right": "I didn't use to like olives when I was a child.",
          "explanation": "Didn't yardımcı fiili kullanıldığında use fiili yalın kalmalıdır (use to)."
        },
        {
          "wrong": "I use to go to the gym three times a week now.",
          "right": "I usually go to the gym three times a week now.",
          "explanation": "Şimdiki alışkanlıklar için 'use to' kalıbı yoktur; 'usually + V1' kullanılır."
        },
        {
          "wrong": "He is not used to drive on the left side of the road.",
          "right": "He is not used to driving on the left side of the road.",
          "explanation": "'Be used to' alışkın olmak kalıbından sonra fiil gelirse sonuna -ing takısı alır (driving)."
        }
      ],
      "examTips": [
        "Boşluktan sonraki fiile bakın: live, be, know, have gibi bir durum fiili varsa seçeneklerdeki \"would\"u eleyip \"used to\" seçin.",
        "Soru ve olumsuz cümlelerde \"didn't use to\" biçimini arayın (\"used\" olan şıkları eleyin).",
        "Boşluğun önünde \"am/is/are/was/were/got\" varsa arkasından gelen fiilin \"-ing\" alacağını unutmayın (be used to + V-ing).",
        "Cümlede \"now, nowadays, today\" varsa geçmiş alışkanlık kalıpları (used to/would) değil geniş zaman kullanılır."
      ]
    }
  },
  {
    "id": "b1-g05",
    "level": "B1",
    "order": 5,
    "title": "Passive Voice (Present, Past, Present Perfect)",
    "description": "Eylemi yapanın değil, eylemden etkilenenin ön planda olduğu edilgen yapılar (be + V3).",
    "status": "ready",
    "content": {
      "intro": "Edilgen çatı (Passive Voice), eylemi yapan kişinin (öznenin / agent) bilinmediği, önemsiz olduğu veya eylemden etkilenen nesnenin odak noktası yapılmak istendiği durumlarda kullanılır. İngilizcede tüm edilgen yapıların değişmeyen altın kuralı: İlgili zamanın \"be\" yardımcı fiili + asıl fiilin 3. hali (Past Participle / V3) formülüdür.",
      "sections": [
        {
          "heading": "1. Present Simple Passive (am / is / are + V3)",
          "body": "Genel doğrular, rutinler ve süreçler için kullanılır: \"English is spoken all over the world\" (İngilizce tüm dünyada konuşulur), \"Millions of packages are delivered every day\" (Her gün milyonlarca koli teslim edilir)."
        },
        {
          "heading": "2. Past Simple Passive (was / were + V3)",
          "body": "Geçmişte tamamlanmış olaylar, icatlar ve tarihi gelişmeler için kullanılır: \"The Eiffel Tower was built in 1889\" (Eyfel Kulesi 1889'da inşa edildi), \"The ancient documents were discovered by archaeologists\" (Antik belgeler arkeologlar tarafından keşfedildi)."
        },
        {
          "heading": "3. Present Perfect Passive (have / has been + V3)",
          "body": "Etkisi şu anda hissedilen veya yeni tamamlanmış eylemler için kullanılır: \"All the flight tickets have been sold\" (Tüm uçak biletleri satıldı), \"The critical security bug has been fixed\" (Kritik güvenlik hatası giderildi)."
        },
        {
          "heading": "4. Eylemi Yapanı Belirtme: \"by + Agent\"",
          "body": "Eğer eylemi gerçekleştiren kişi veya unsur önemliyse ve cümleye dahil edilmek isteniyorsa cümlenin sonuna \"by\" edatıyla eklenir: \"The novel was written by George Orwell\". Alet ve araçlar için ise genellikle \"with\" kullanılır: \"The box was opened with a knife\"."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Edilgen çatıda nesne başa geçer. Temel şablon \"be + V3\"tür. Present Simple için am/is/are + V3, Past Simple için was/were + V3, Present Perfect için have/has been + V3 kullanılır."
        }
      ],
      "formulas": [
        {
          "label": "Present Simple Passive",
          "pattern": "Subject + am / is / are + V3 (Past Participle)",
          "note": "Örn: Wine is made from grapes."
        },
        {
          "label": "Past Simple Passive",
          "pattern": "Subject + was / were + V3",
          "note": "Örn: The Mona Lisa was painted by Leonardo da Vinci."
        },
        {
          "label": "Present Perfect Passive",
          "pattern": "Subject + have / has + been + V3",
          "note": "Örn: The lost luggage has just been found."
        },
        {
          "label": "Yapanı Belirtme",
          "pattern": "... + by + person / agent",
          "note": "Örn: The suspect was arrested by the police officers."
        }
      ],
      "examples": [
        {
          "en": "Over two billion cups of coffee are consumed around the world every single day.",
          "tr": "Tüm dünyada her gün iki milyardan fazla fincan kahve tüketilmektedir.",
          "note": "Present Simple Passive (are consumed)."
        },
        {
          "en": "The modern telephone was invented by Alexander Graham Bell in 1876.",
          "tr": "Modern telefon 1876 yılında Alexander Graham Bell tarafından icat edildi.",
          "note": "Past Simple Passive (was invented)."
        },
        {
          "en": "All the final exam papers have already been evaluated by the academic committee.",
          "tr": "Bütün final sınav kağıtları akademik komite tarafından çoktan değerlendirildi.",
          "note": "Present Perfect Passive (have been evaluated)."
        },
        {
          "en": "Olive oil is produced in large quantities in Mediterranean countries.",
          "tr": "Zeytinyağı Akdeniz ülkelerinde yüksek miktarlarda üretilir.",
          "note": "Genel gerçek ve pasif (is produced)."
        },
        {
          "en": "The stolen jewels were recovered by the detective within twenty-four hours.",
          "tr": "Çalınan mücevherler dedektif tarafından yirmi dört saat içinde geri alındı.",
          "note": "Çoğul geçmiş pasif (were recovered)."
        },
        {
          "en": "A brand-new hospital has been opened in our district this morning.",
          "tr": "Bu sabah ilçemizde yepyeni bir hastane açıldı.",
          "note": "Yeni tamamlanmış eylem (has been opened)."
        },
        {
          "en": "Spanish is spoken as an official language in more than twenty countries.",
          "tr": "İspanyolca yirmiden fazla ülkede resmi dil olarak konuşulur.",
          "note": "Geniş zaman pasif (is spoken)."
        },
        {
          "en": "Thousands of historic buildings were destroyed during the major earthquake.",
          "tr": "Büyük deprem sırasında binlerce tarihi bina yıkıldı.",
          "note": "Geçmiş zaman pasif (were destroyed)."
        }
      ],
      "keyRules": [
        "Geçişsiz fiiller (nesne almayan fiiller: sleep, arrive, die, happen, occur) ASLA pasif yapılamaz: \"An accident was happened\" YANLIŞTIR.",
        "Öznenin tekil veya çoğul oluşuna göre yardımcı fiil (is/are, was/were, has/have) doğru uyum sağlamalıdır.",
        "Edilgen cümlede ana fiil istisnasız daima 3. halinde (V3) olmak zorundadır.",
        "Eylemi yapan kişi \"by\" ile eklenir; eylemde kullanılan nesne/araç ise \"with\" ile belirtilir (\"with a key\")."
      ],
      "commonMistakes": [
        {
          "wrong": "The terrible car accident was happened on the highway yesterday.",
          "right": "The terrible car accident happened on the highway yesterday.",
          "explanation": "'Happen' geçişsiz (intransitive) bir fiildir; nesne almadığı için asla pasif yapılamaz."
        },
        {
          "wrong": "The delicious cake made by my grandmother yesterday.",
          "right": "The delicious cake was made by my grandmother yesterday.",
          "explanation": "Edilgen cümlede 'be' yardımcı fiili (was) unutulmamalıdır; sadece 'made' denirse pasta kendisi yapmış gibi algılanır."
        },
        {
          "wrong": "All the emails has been sent to the customers.",
          "right": "All the emails have been sent to the customers.",
          "explanation": "Özne 'All the emails' çoğul olduğu için 'has been' değil 'have been' kullanılmalıdır."
        },
        {
          "wrong": "English speaks in many countries around the globe.",
          "right": "English is spoken in many countries around the globe.",
          "explanation": "İngilizce dili kendisi konuşamaz, insanlar tarafından konuşulur; bu yüzden edilgen 'is spoken' olmalıdır."
        }
      ],
      "examTips": [
        "Cümlenin öznesine bakın: Özne eylemi yapan mı (etken) yoksa eylemden etkilenen nesne mi (edilgen)? Cansız varlıklar genellikle pasiftir.",
        "Boşluktan sonra \"by...\" ifadesi varsa kuvvetle muhtemel cümle Passive Voice gerektirir (be + V3).",
        "Tarih (in 1990, yesterday) varsa \"was/were + V3\", genel kural varsa \"is/are + V3\", \"recently/already/yet\" varsa \"have/has been + V3\" arayın.",
        "Happen, occur, die, arrive, fall fiillerinin pasif şıklarını (was happened, is died) tereddütsüz eleyin."
      ]
    }
  },
  {
    "id": "b1-g06",
    "level": "B1",
    "order": 6,
    "title": "Conditionals (Zero, First, Second)",
    "description": "Genel doğrular (Type 0), gerçek olası durumlar (Type 1) ve şu anki hayali/gerçek dışı durumlar (Type 2).",
    "status": "ready",
    "content": {
      "intro": "Koşul cümleleri (Conditionals / If Clauses), bir eylemin gerçekleşmesinin başka bir şarta bağlı olduğu durumları ifade eder. B1 seviyesinde üç temel koşul türü öğrenilir: Doğa yasaları ve genel geçer doğrular için Type 0, gelecekteki gerçek ve olası durumlar için Type 1, şu anki veya gelecekteki varsayımsal / hayali durumlar için Type 2 kullanılır.",
      "sections": [
        {
          "heading": "1. Zero Conditional (Type 0): Doğa Yasaları ve Genel Doğrular",
          "body": "Kalıp: If + Present Simple, Present Simple. Bilimsel gerçekler, kurallar ve her zaman aynı sonucu veren durumlarda kullanılır: \"If you heat water to 100 degrees, it boils\" (Suyu 100 dereceye kadar ısıtırsan kaynar). \"If\" yerine \"when\" de kullanılabilir."
        },
        {
          "heading": "2. First Conditional (Type 1): Gerçek ve Olası Gelecek",
          "body": "Kalıp: If + Present Simple, will / won't + V1. Gelecekte gerçekleşme ihtimali yüksek olan gerçekçi koşulları anlatır: \"If it rains tomorrow, we will stay at home\" (Yarın yağmur yağarsa evde kalacağız). DİKKAT: \"If\" cümlesine asla \"will\" gelmez."
        },
        {
          "heading": "3. Second Conditional (Type 2): Hayali ve Gerçek Dışı Durumlar",
          "body": "Kalıp: If + Past Simple, would / could / might + V1. Şu anki gerçekliğin tam tersi olan hayali, varsayımsal veya gerçekleşmesi imkansıza yakın durumları anlatır: \"If I won the lottery, I would travel around the world\" (Piyangoyu kazansam dünyayı gezerdim - ama şu an kazanmadım). To be fiili için formal dilde \"were\" kullanılır: \"If I were you, I would accept the offer\"."
        },
        {
          "heading": "4. \"Unless\" Bağlacı (If not / -medikçe)",
          "body": "\"Unless\", anlam olarak \"if not\" demektir ve kendi cümlesini zaten olumsuz yaptığı için yanına olumsuz fiil almaz: \"Unless you study hard, you won't pass\" = \"If you don't study hard, you won't pass\"."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Type 0: If + V1, V1 (genel gerçek). Type 1: If + V1, will + V1 (olası gelecek). Type 2: If + V2 (were), would + V1 (hayali şimdiki durum). Unless = If not."
        }
      ],
      "formulas": [
        {
          "label": "Type 0 (Genel Gerçek)",
          "pattern": "If + Present Simple, Present Simple",
          "note": "Örn: If ice melts, it becomes water."
        },
        {
          "label": "Type 1 (Gerçek Gelecek)",
          "pattern": "If + Present Simple, will / can / may + V1",
          "note": "Örn: If you study hard, you will pass the exam."
        },
        {
          "label": "Type 2 (Hayali Şimdiki Zaman)",
          "pattern": "If + Past Simple (were), would / could + V1",
          "note": "Örn: If I had more time, I would learn Italian."
        },
        {
          "label": "Unless Kullanımı",
          "pattern": "Unless + Positive Verb = If + Negative Verb",
          "note": "Örn: Unless it rains, we will play tennis."
        }
      ],
      "examples": [
        {
          "en": "If you freeze water, it turns into ice.",
          "tr": "Suyu dondurursan buza dönüşür.",
          "note": "Doğa kuralı ve bilimsel gerçek (Type 0)."
        },
        {
          "en": "If Ahmet finishes his work early today, he will join us for dinner.",
          "tr": "Ahmet bugün işini erken bitirirse akşam yemeğinde bize katılacak.",
          "note": "Gelecekteki gerçek ve olası durum (Type 1)."
        },
        {
          "en": "If I were you, I would consult an experienced lawyer before signing.",
          "tr": "Senin yerinde olsaydım imzalamadan önce deneyimli bir avukata danışırdım.",
          "note": "Tavsiye ve hayali durum (If I were you + would, Type 2)."
        },
        {
          "en": "Unless you book your flight tickets in advance, they will be very expensive.",
          "tr": "Uçak biletlerinizi önceden ayırtmadıkça çok pahalı olacaklar.",
          "note": "Unless = If you don't book."
        },
        {
          "en": "If Sude had a car, she wouldn't have to take the crowded subway every day.",
          "tr": "Sude'nin bir arabası olsaydı her gün kalabalık metroya binmek zorunda kalmazdı.",
          "note": "Şimdiki gerçeğin zıttı (Type 2)."
        },
        {
          "en": "Plants die if they do not get enough sunlight and water.",
          "tr": "Bitkiler yeterli güneş ışığı ve su almazlarsa ölürler.",
          "note": "Biyolojik gerçek (Type 0)."
        },
        {
          "en": "If we leave right now, we will easily catch the morning train.",
          "tr": "Hemen şimdi çıkarsak sabah trenine rahatlıkla yetişeceğiz.",
          "note": "Olası gelecek şartı (Type 1)."
        },
        {
          "en": "What would you do if you found a lost wallet full of cash on the street?",
          "tr": "Sokakta nakit para dolu kayıp bir cüzdan bulsaydın ne yapardın?",
          "note": "Varsayımsal soru (Type 2: would you do)."
        }
      ],
      "keyRules": [
        "\"If\" ile başlayan yan cümlede (condition clause) asla \"will\" veya \"would\" kullanılmaz: \"If I will see him\" YANLIŞTIR.",
        "Cümle \"If\" ile başlarsa iki cümlecik arasına virgül konur; \"If\" ortadaysa virgül kullanılmaz.",
        "Type 2 koşullarında \"I, he, she, it\" özneleri için geleneksel ve resmi İngilizcede \"were\" kullanımı tercih edilir.",
        "\"Unless\" zaten olumsuz anlam içerdiği için yanındaki fiil olumlu çekimlenir: \"Unless you don't come\" YANLIŞTIR."
      ],
      "commonMistakes": [
        {
          "wrong": "If it will rain tomorrow, we will cancel the picnic.",
          "right": "If it rains tomorrow, we will cancel the picnic.",
          "explanation": "'If' cümlesinde gelecek zaman anlamı olsa dahi 'will' kullanılmaz; Present Simple (rains) kullanılır."
        },
        {
          "wrong": "If I would have a million dollars, I would buy a yacht.",
          "right": "If I had a million dollars, I would buy a yacht.",
          "explanation": "'If' cümlesinde 'would' kullanılamaz; Type 2 şart cümlesinde Past Simple (had) kullanılır."
        },
        {
          "wrong": "Unless you don't hurry, you will miss the flight.",
          "right": "Unless you hurry, you will miss the flight.",
          "explanation": "'Unless' zaten '-medikçe' anlamında olumsuzluk kattığından çift olumsuzluk yapılmaz; fiil olumlu (hurry) olmalıdır."
        },
        {
          "wrong": "If I was you, I would take that great opportunity.",
          "right": "If I were you, I would take that great opportunity.",
          "explanation": "Tavsiye kalıbında ve resmi dilde varsayımsal durumlarda 'were' kullanımı standart kabul edilir."
        }
      ],
      "examTips": [
        "Eşleştirme kuralı: If tarafında V1 varsa diğer tarafta will + V1 (Type 1); If tarafında V2 varsa diğer tarafta would + V1 (Type 2) arayın.",
        "Seçeneklerde \"If + will\" veya \"If + would\" içeren şıkları doğrudan eleyin.",
        "Cümlede \"Unless\" varsa yanındaki fiilin olumlu yapıda olduğunu kontrol edin.",
        "\"If I were you\" kalıbını gördüğünüzde diğer tarafta tereddüt etmeden \"would / wouldn't + V1\" arayın."
      ]
    }
  },
  {
    "id": "b1-g07",
    "level": "B1",
    "order": 7,
    "title": "Reported Speech — Introduction",
    "description": "Dolaylı anlatımda zaman kayması (backshift), zamir ve zaman zarfı dönüşümleri (say, tell, ask).",
    "status": "ready",
    "content": {
      "intro": "Dolaylı Anlatım (Reported / Indirect Speech), bir kişinin söylediği sözleri tırnak işareti kullanmadan, kendi cümlelerimizle bir başkasına aktarma yöntemidir. Aktarma fiili geçmiş zamanda (said, told) olduğunda, doğrudan söylenen cümlenin zamanı bir derece geçmiş zamana kaydırılır (Backshift). Ayrıca kişi zamirleri, işaret sıfatları ve zaman zarfları da yeni konuşma anına göre uyarlanır.",
      "sections": [
        {
          "heading": "1. Zaman Kayması (Backshift) Tablosu",
          "body": "• Present Simple -> Past Simple (am/is/are -> was/were | work -> worked)\n• Present Continuous -> Past Continuous (is working -> was working)\n• Past Simple & Present Perfect -> Past Perfect (worked / have worked -> had worked)\n• will -> would | can -> could | may -> might | must -> had to."
        },
        {
          "heading": "2. Aktarma Fiilleri: \"Say\" vs. \"Tell\"",
          "body": "• SAY: Kime söylendiği belirtilmez (say that...) veya \"to\" ile belirtilir: \"He said that he was tired\" (He said me YANLIŞTIR).\n• TELL: Mutlaka bir kişi nesnesi (me, him, her, us, them) alır: \"He told me that he was tired\" (He told that YANLIŞTIR)."
        },
        {
          "heading": "3. Zaman ve Yer Zarflarındaki Dönüşümler",
          "body": "• now -> then / at that moment\n• today -> that day | tonight -> that night\n• tomorrow -> the next day / the following day\n• yesterday -> the day before / the previous day\n• here -> there | this / these -> that / those."
        },
        {
          "heading": "4. Emir ve Rica Cümleleri (Reported Imperatives)",
          "body": "Emir ve ricalar aktarılırken fiil \"to + V1\" veya olumsuzsa \"not to + V1\" kalıbına dönüşür: \"Doctor: Drink water\" -> \"The doctor told me to drink water\". \"Teacher: Don't talk\" -> \"The teacher told us not to talk\"."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Aktarma fiili geçmiş zamandaysa zaman bir derece geriye kayar (backshift). Tell + nesne (told me), say + that (said that). Emirlerde to / not to + V1 kullanılır. Zaman zarfları da geçmişe uyarlanır."
        }
      ],
      "formulas": [
        {
          "label": "Düz Cümle Aktarımı",
          "pattern": "Subject + said (that) / told someone (that) + Backshifted Tense",
          "note": "Örn: \"I am happy\" -> He said that he was happy."
        },
        {
          "label": "Olumlu Emir Aktarımı",
          "pattern": "Subject + told / asked someone + to + V1",
          "note": "Örn: \"Sit down\" -> She told him to sit down."
        },
        {
          "label": "Olumsuz Emir Aktarımı",
          "pattern": "Subject + told / asked someone + not to + V1",
          "note": "Örn: \"Don't shout\" -> He told them not to shout."
        },
        {
          "label": "Modal Dönüşümü",
          "pattern": "can -> could  |  will -> would  |  must -> had to",
          "note": "Örn: \"I can help\" -> She said that she could help."
        }
      ],
      "examples": [
        {
          "en": "Ahmet said that he was preparing a comprehensive report for his supervisor.",
          "tr": "Ahmet yöneticisi için kapsamlı bir rapor hazırlamakta olduğunu söyledi.",
          "note": "Present Continuous -> Past Continuous (was preparing)."
        },
        {
          "en": "Sude told me that she had bought a new laptop the day before.",
          "tr": "Sude bana bir önceki gün yeni bir dizüstü bilgisayar satın aldığını söyledi.",
          "note": "told me + Past Perfect (had bought) + the day before."
        },
        {
          "en": "The doctor told the patient to take the prescribed medication twice daily.",
          "tr": "Doktor hastaya reçete edilen ilacı günde iki kez almasını söyledi.",
          "note": "Emir aktarımı (told + person + to take)."
        },
        {
          "en": "Our teacher warned us not to use our mobile phones during the lecture.",
          "tr": "Öğretmenimiz derste cep telefonlarımızı kullanmamamız konusunda bizi uyardı.",
          "note": "Olumsuz emir aktarımı (warned us not to use)."
        },
        {
          "en": "Ali mentioned that he would travel to London the following month.",
          "tr": "Ali bir sonraki ay Londra'ya seyahat edeceğini belirtti.",
          "note": "will -> would | next month -> the following month."
        },
        {
          "en": "She explained that she couldn't attend the annual meeting due to illness.",
          "tr": "Hastalık sebebiyle yıllık toplantıya katılamayacağını açıkladı.",
          "note": "can't -> couldn't."
        },
        {
          "en": "The police officer instructed the driver to step out of the vehicle.",
          "tr": "Polis memuru sürücüye araçtan dışarı çıkması talimatını verdi.",
          "note": "Resmi talimat aktarımı (instructed to step out)."
        },
        {
          "en": "They said that they had lived in that historic mansion for over thirty years.",
          "tr": "O tarihi konakta otuz yılı aşkın bir süredir yaşamış olduklarını söylediler.",
          "note": "have lived -> had lived."
        }
      ],
      "keyRules": [
        "Aktarma fiili şimdiki zamandaysa (He says that...) zaman kayması (backshift) YAPILMAZ: \"He says he is tired\".",
        "Genel geçer bilimsel doğrularda zaman kayması zorunlu değildir: \"He said that water boils at 100 degrees\".",
        "\"Tell\" fiilinden sonra doğrudan nesne (me, him, her) gelmek zorundadır; \"said me\" kullanımı kesinlikle yanlıştır.",
        "Emir cümlelerinde tırnak içindeki \"don't\", aktarımda daima \"not to + V1\" haline dönüşür."
      ],
      "commonMistakes": [
        {
          "wrong": "He said me that he was feeling sick.",
          "right": "He told me that he was feeling sick. / He said that he was feeling sick.",
          "explanation": "'Say' fiilinden sonra doğrudan kişi nesnesi gelemez; 'told me' veya nesnesiz 'said that' kullanılmalıdır."
        },
        {
          "wrong": "The teacher told us to not open the exam booklets.",
          "right": "The teacher told us not to open the exam booklets.",
          "explanation": "Olumsuz emir aktarımında olumsuzluk eki 'to' edatından önce gelir: 'not to open'."
        },
        {
          "wrong": "She said that she will call me tomorrow.",
          "right": "She said that she would call me the next day.",
          "explanation": "Aktarma fiili 'said' geçmişte olduğu için 'will' -> 'would' ve 'tomorrow' -> 'the next day' dönüşümü yapılmalıdır."
        },
        {
          "wrong": "My father told that he had lost his keys.",
          "right": "My father told us that he had lost his keys. / My father said that...",
          "explanation": "'Tell' fiili nesnesiz kullanılamaz; kime söylediği belirtilmelidir (told us / told me)."
        }
      ],
      "examTips": [
        "\"Said\" mi \"Told\" mu ayrımında boşluğun hemen sağına bakın: Bir zamir/isim (me, him, the students) varsa \"told\", yoksa \"said\" seçin.",
        "Cümlenin başında \"said / told\" varsa boşlukta Present Tense (am, is, will, can) şıklarını eleyin; Past Tense (was, would, could, had V3) arayın.",
        "Emir/rica aktarımlarında \"to + V1\" veya \"not to + V1\" kalıbını doğrudan arayın.",
        "Zaman zarflarına dikkat edin: \"the day before\" varsa fiilin Past Perfect (had V3) olması gerektiğini unutmayın."
      ]
    }
  },
  {
    "id": "b1-g08",
    "level": "B1",
    "order": 8,
    "title": "Modals of Deduction (Must Be, Can’t Be, Might Be)",
    "description": "Mevcut kanıtlara dayanarak güçlü veya zayıf çıkarımda bulunma kipleri.",
    "status": "ready",
    "content": {
      "intro": "Çıkarım Kipleri (Modals of Deduction / Speculation), mevcut ipuçları ve kanıtlara dayanarak bir durumun ne kadar kesin veya olası olduğuna dair tahmin yürütürken kullanılır. İngilizcede kesin doğru olduğuna inandığımız durumlar için \"must\", imkansız olduğuna inandığımız durumlar için \"can't\", olası/ihtimal dahilindeki durumlar için ise \"might / may / could\" kipleri kullanılır.",
      "sections": [
        {
          "heading": "1. Güçlü Olumlu Çıkarım (Must Be / Must + V1)",
          "body": "Eldeki kanıtlar doğrultusunda bir durumun kesinlikle doğru olduğunu düşündüğümüzde \"must\" kullanılır: \"He has been running for two hours; he must be exhausted!\" (İki saattir koşuyor; son derece yorgun olmalı - %95 kesinlik)."
        },
        {
          "heading": "2. Güçlü Olumsuz / İmkansızlık Çıkarımı (Can't Be / Can't + V1)",
          "body": "Bir durumun mantıken veya fiziken kesinlikle imkansız olduğuna inandığımızda \"can't\" kullanılır. DİKKAT: İngilizcede imkansızlık çıkarımı için ASLA \"mustn't\" kullanılmaz; daima \"can't\" tercih edilir: \"That can't be Ali; he is currently in Germany\" (O kişi Ali olamaz; o şu an Almanya'da)."
        },
        {
          "heading": "3. Zayıf ve Orta Düzey Olasılık (Might / May / Could + V1)",
          "body": "Bir durumun doğru olması ihtimal dahilinde fakat kesin değilse (yaklaşık %30-%50 ihtimal) \"might, may veya could\" kullanılır: \"Where is Sude? She might be in the library\" (Kütüphanede olabilir)."
        },
        {
          "heading": "4. Devam Eden Durumlarda Çıkarım (Modal + be + V-ing)",
          "body": "Şu anda sürmekte olan bir eyleme dair çıkarımda bulunurken \"Modal + be + V-ing\" şablonu uygulanır: \"Listen to that noise! They must be having a party next door\" (Yan komşuda parti veriyor olmalılar)."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Kesin doğruysa: must (%95). Kesin imkansızsa: can't (%99). Olasıysa: might/may/could (%50). İmkansızlıkta \"mustn't\" kullanılmaz (can't kullanılır). Süren eylemde modal + be + V-ing şablonu geçerlidir."
        }
      ],
      "formulas": [
        {
          "label": "Güçlü Olumlu Çıkarım",
          "pattern": "Subject + must + be / V1 (%90-95 kesinlik)",
          "note": "Örn: You have worked all day; you must be tired."
        },
        {
          "label": "Güçlü İmkansızlık Çıkarımı",
          "pattern": "Subject + can't + be / V1 (Kesinlikle imkansız)",
          "note": "Örn: It can't be true! (mustn't be YANLIŞ)"
        },
        {
          "label": "Olasılık Çıkarımı",
          "pattern": "Subject + might / may / could + be / V1 (%50 olasılık)",
          "note": "Örn: Take an umbrella; it might rain later."
        },
        {
          "label": "Süren Eylem Çıkarımı",
          "pattern": "Subject + modal + be + V-ing",
          "note": "Örn: The lights are on; she must be studying inside."
        }
      ],
      "examples": [
        {
          "en": "The lights in his room are on, so he must be awake at this hour.",
          "tr": "Odasının ışıkları açık, bu saatte uyanık olmalı.",
          "note": "Güçlü kanıt (lights are on) -> must be."
        },
        {
          "en": "That woman can't be sixty years old; she looks barely thirty-five!",
          "tr": "O kadın altmış yaşında olamaz; neredeyse otuz beş gösteriyor!",
          "note": "İmkansızlık çıkarımı (can't be)."
        },
        {
          "en": "I am not sure where your keys are; they might be on the kitchen counter.",
          "tr": "Anahtarlarının nerede olduğundan emin değilim; mutfak tezgahında olabilirler.",
          "note": "Belirsizlik ve olasılık (might be)."
        },
        {
          "en": "He has three luxury sports cars; he must earn an impressive salary.",
          "tr": "Üç lüks spor arabası var; etkileyici bir maaş kazanıyor olmalı.",
          "note": "Maddi kanıta dayalı çıkarım (must earn)."
        },
        {
          "en": "It can't be snowing in Antalya in the middle of July; that is impossible.",
          "tr": "Temmuz ayının ortasında Antalya'da kar yağıyor olamaz; bu imkansız.",
          "note": "Doğa kuralına aykırı imkansızlık (can't be snowing)."
        },
        {
          "en": "Sude could be delayed because of the severe traffic on the bridge.",
          "tr": "Sude köprüdeki yoğun trafik yüzünden gecikmiş olabilir.",
          "note": "Makul olasılık (could be delayed)."
        },
        {
          "en": "Don't disturb Ahmet right now; he might be taking an important online exam.",
          "tr": "Şu anda Ahmet'i rahatsız etmeyin; önemli bir çevrimiçi sınava giriyor olabilir.",
          "note": "Süregelen olasılık (might be taking)."
        },
        {
          "en": "You haven't eaten anything since breakfast; you must be starving!",
          "tr": "Kahvaltıdan beri hiçbir şey yemedin; açlıktan ölüyor olmalısın!",
          "note": "Güçlü mantıksal çıkarım (must be starving)."
        }
      ],
      "keyRules": [
        "\"Mustn't\" çıkarım için KULLANILMAZ; mustn't yalnızca \"yasaklama\" bildirir (\"You mustn't smoke here\"). İmkansızlık çıkarımında kural olarak \"can't\" kullanılır.",
        "\"Could\" burada geçmiş zaman değil, şimdiki zamandaki olasılığı (\"olabilir\") ifade eder: \"It could be true\".",
        "Kanıt ne kadar somutsa seçilen modal o kadar güçlü olur (somut kanıt: must / can't; tahmin: might).",
        "Olumsuz olasılıkta \"might not\" ve \"may not\" (olmayabilir) kullanılırken, \"could not\" güçlü imkansızlık belirtir."
      ],
      "commonMistakes": [
        {
          "wrong": "Look at his fancy clothes; he mustn't be poor.",
          "right": "Look at his fancy clothes; he can't be poor.",
          "explanation": "İmkansızlık ve olumsuz mantıksal çıkarımlarda 'mustn't' değil, kesinlikle 'can't' kullanılır."
        },
        {
          "wrong": "She is not at home. She can be at work.",
          "right": "She is not at home. She could be at work. / She might be at work.",
          "explanation": "Spesifik bir durumdaki olumlu olasılık için 'can' tek başına kullanılmaz; 'could', 'may' veya 'might' kullanılır."
        },
        {
          "wrong": "He must to be very tired after the match.",
          "right": "He must be very tired after the match.",
          "explanation": "Modal fiillerden (must, can, might) sonra asla 'to' gelmez; doğrudan yalın fiil gelir."
        },
        {
          "wrong": "It can't rain tomorrow; the sky is slightly overcast.",
          "right": "It might rain tomorrow; the sky is slightly overcast.",
          "explanation": "Gökyüzü kapalıysa yağmur ihtimal dahilindedir; 'can't' (asla yağamaz) denemez, 'might' (yağabilir) denir."
        }
      ],
      "examTips": [
        "Cümlede \"I am sure / certain it is true\" anlamı varsa -> MUST.",
        "Cümlede \"It is impossible / I am sure it is not true\" anlamı varsa -> CAN'T (mustn't şıkkını hemen eleyin).",
        "Cümlede \"Perhaps / maybe / I am not sure\" ifadeleri varsa -> MIGHT / MAY / COULD.",
        "Şıklarda \"must to be\" veya \"can to be\" gibi 'to' eklenmiş kalıplar görürseniz doğrudan eleyin."
      ]
    }
  },
  {
    "id": "b1-g09",
    "level": "B1",
    "order": 9,
    "title": "Gerunds & Infinitives",
    "description": "Fiillerden, sıfatlardan ve edatlardan sonra V-ing (gerund) veya to + V1 (infinitive) seçimi.",
    "status": "ready",
    "content": {
      "intro": "İngilizcede bir fiilin ardından başka bir fiil geldiğinde veya bir fiil isimleştirildiğinde iki temel biçim kullanılır: Gerund (V-ing) veya Infinitive (to + V1). Hangisinin seçileceği, ilk fiilin türüne, önündeki edata (preposition) veya iletilmek istenen özel anlama bağlıdır. B1 seviyesinin en önemli konularından biri, anlam değiştiren ve değiştirmeyen fiil gruplarını ayırt edebilmektir.",
      "sections": [
        {
          "heading": "1. Sadece Gerund (V-ing) Alan Fiiller ve Edatlar",
          "body": "Enjoy, avoid, mind, suggest, admit, deny, finish, practice fiillerinden sonra daima Gerund gelir: \"She avoided answering the question\". Ayrıca TÜM edatlardan (in, on, at, about, without, instead of, look forward to) sonra fiil mutlaka \"-ing\" alır: \"He left without saying goodbye\"."
        },
        {
          "heading": "2. Sadece Infinitive (to + V1) Alan Fiiller ve Sıfatlar",
          "body": "Decide, hope, plan, promise, refuse, manage, agree, afford fiillerinden sonra to + V1 gelir: \"We decided to move to a new apartment\". Ayrıca sıfatlardan sonra standart olarak infinitive kullanılır: \"It is easy to learn\", \"I am happy to meet you\"."
        },
        {
          "heading": "3. Anlam Değiştiren Kritik Fiiller",
          "body": "• REMEMBER / FORGET:\n  - to V1: Yapılacak görevi hatırlamak/unutmak: \"Remember to lock the door\" (Kilitlemeyi unutma).\n  - V-ing: Geçmiş bir anıyı hatırlamak/unutmak: \"I remember locking the door\" (Kilitlediğimi hatırlıyorum).\n• STOP:\n  - to V1: Başka bir eylemi yapmak için durmak: \"He stopped to drink water\".\n  - V-ing: Eylemi tamamen bırakmak/sonlandırmak: \"He stopped smoking\".\n• TRY:\n  - to V1: Güç sarf etmek / çabalamak: \"I tried to lift the heavy box\".\n  - V-ing: Denemek / yöntem olarak test etmek: \"Try adding some salt\"."
        },
        {
          "heading": "4. Anlam Değiştirmeyen Fiiller (Like, Love, Hate, Begin, Start)",
          "body": "Begin, start, continue, like, love, prefer fiillerinden sonra hem gerund hem infinitive büyük bir anlam farkı olmaksızın kullanılabilir: \"It started raining\" = \"It started to rain\"."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Edatlardan sonra daima V-ing gelir. Sıfatlardan sonra to + V1 gelir. Avoid/suggest/mind -> V-ing. Decide/promise/hope -> to V1. Remember/stop/try fiilleri anlama göre iki biçimi de alır."
        }
      ],
      "formulas": [
        {
          "label": "Edat + Gerund",
          "pattern": "Preposition + Verb-ing",
          "note": "Örn: She is good at solving difficult math puzzles."
        },
        {
          "label": "Sıfat + Infinitive",
          "pattern": "Adjective + to + V1",
          "note": "Örn: It is important to stay calm in an emergency."
        },
        {
          "label": "Stop Karşılaştırması",
          "pattern": "stop to V1 (amacıyla durmak) vs. stop V-ing (bırakmak)",
          "note": "He stopped smoking vs. He stopped to smoke."
        },
        {
          "label": "Look forward to İstisnası",
          "pattern": "look forward to + V-ing ('to' burada edattır)",
          "note": "Örn: I look forward to hearing from you soon."
        }
      ],
      "examples": [
        {
          "en": "She decided to accept the lucrative job offer from the international company.",
          "tr": "Uluslararası şirketten gelen cazip iş teklifini kabul etmeye karar verdi.",
          "note": "'Decide' fiili infinitive (to accept) alır."
        },
        {
          "en": "Ahmet avoided answering the difficult questions during the press conference.",
          "tr": "Ahmet basın toplantısı sırasında zor soruları yanıtlamaktan kaçındı.",
          "note": "'Avoid' fiili gerund (answering) gerektirir."
        },
        {
          "en": "Please remember to turn off the lights before you leave the office.",
          "tr": "Lütfen ofisten ayrılmadan önce ışıkları kapatmayı unutmayın / hatırlayın.",
          "note": "Gelecek görev (remember to turn off)."
        },
        {
          "en": "I clearly remember meeting him at a technology conference five years ago.",
          "tr": "Beş yıl önce onunla bir teknoloji konferansında tanıştığımı net bir şekilde hatırlıyorum.",
          "note": "Geçmiş anı (remember meeting)."
        },
        {
          "en": "He was feeling exhausted, so he stopped to take a short rest by the fountain.",
          "tr": "Çok yorgun hissediyordu, bu yüzden çeşmenin yanında kısa bir mola vermek için durdu.",
          "note": "Amaç için durmak (stopped to take)."
        },
        {
          "en": "The doctor strongly advised him to stop smoking cigarettes immediately.",
          "tr": "Doktor ona derhal sigara içmeyi bırakmasını şiddetle tavsiye etti.",
          "note": "Alışkanlığı bırakmak (stop smoking)."
        },
        {
          "en": "We are really looking forward to visiting our grandparents this weekend.",
          "tr": "Bu hafta sonu büyükanne ve büyükbabamızı ziyaret etmeyi dört gözle bekliyoruz.",
          "note": "'Look forward to' edattır, gerund (visiting) alır."
        },
        {
          "en": "Sude is very interested in learning foreign languages and cultural history.",
          "tr": "Sude yabancı dil öğrenmeye ve kültür tarihine oldukça meraklıdır.",
          "note": "Edat sonrası (interested in learning)."
        }
      ],
      "keyRules": [
        "\"Look forward to, be used to, object to\" kalıplarındaki \"to\" mastar eki değil EDATTIR; dolayısıyla arkasından \"-ing\" gelir: \"look forward to seeing you\".",
        "Cümlenin öznesi konumundaki fiiller genellikle Gerund biçiminde başlar: \"Smoking is harmful\" (ancak resmi dilde \"To err is human\" mümkündür).",
        "Let ve make ettirgen fiillerinden sonra nesne geldiğinde fiil yalın (bare infinitive) olur: \"She made me laugh\" (to laugh DEĞİL).",
        "Edat + fiil kuralı istisnasızdır: about, by, in, of, with, without gibi tüm edatlar fiile \"-ing\" ekletir."
      ],
      "commonMistakes": [
        {
          "wrong": "I am looking forward to see you tomorrow.",
          "right": "I am looking forward to seeing you tomorrow.",
          "explanation": "'Look forward to' yapısındaki 'to' bir edattır; edatlardan sonra fiil -ing (seeing) alır."
        },
        {
          "wrong": "He promised giving me the money back next Monday.",
          "right": "He promised to give me the money back next Monday.",
          "explanation": "'Promise' geleceğe yönelik taahhüt bildiren bir fiildir ve 'to + V1' (to give) gerektirir."
        },
        {
          "wrong": "She left the meeting without to say a single word.",
          "right": "She left the meeting without saying a single word.",
          "explanation": "'Without' bir edattır; edatlardan sonra mastar (to say) değil gerund (saying) kullanılır."
        },
        {
          "wrong": "My parents made me to clean my entire room.",
          "right": "My parents made me clean my entire room.",
          "explanation": "'Make someone do something' kalıbında fiil yalın kalır, 'to' almaz."
        }
      ],
      "examTips": [
        "Boşluktan önce bir edat (in, at, of, for, about, without, instead of) varsa tereddütsüz \"-ing\" (gerund) işaretleyin.",
        "\"Look forward to + boşluk\" soruları sınavlarda en çok sorulan çeldiricidir; şıklarda \"to V1\"e kanmayın, \"V-ing\"i seçin.",
        "\"Stop\" fiili sorularında cümlenin sonunu okuyun: Bir eylemi bırakıyorsa -ing, yapmak için duruyorsa to + V1 seçin.",
        "Sıfatlardan sonra (it is difficult / impossible / crucial + boşluk) daima to + V1 arayın."
      ]
    }
  },
  {
    "id": "b1-g10",
    "level": "B1",
    "order": 10,
    "title": "Defining Relative Clauses",
    "description": "Cümleye temel anlam kazandıran tanımlayıcı sıfat cümlecikleri (who, which, that, whose, where, when).",
    "status": "ready",
    "content": {
      "intro": "Tanımlayıcı Sıfat Cümlecikleri (Defining Relative Clauses), cümlede bahsettiğimiz kişinin, nesnenin, yerin veya zamanın tam olarak hangisi olduğunu belirten ve cümlenin anlamı için vazgeçilmez olan bilgiyi veren yapılardır. Bu cümlecikler çıkarıldığında ana cümlenin anlamı eksik veya belirsiz kalır; bu sebeple asla virgülle ayrılmazlar.",
      "sections": [
        {
          "heading": "1. İlgi Zamirleri ve Kullanım Alanları",
          "body": "• WHO / THAT: İnsanlar için (\"The teacher who helped me\").\n• WHICH / THAT: Cansız nesneler ve hayvanlar için (\"The phone that I lost\").\n• WHOSE: Sahiplik / aidiyet için (insan ve nesneler: \"The woman whose car was stolen\").\n• WHERE: Mekanlar için (\"The hotel where we stayed\").\n• WHEN: Zamanlar için (\"The day when we first met\")."
        },
        {
          "heading": "2. \"That\" Zamirinin Esnekliği",
          "body": "Tanımlayıcı sıfat cümleciklerinde \"that\", hem \"who\" hem de \"which\" yerine günlük dilde sıklıkla kullanılabilir. Ancak arkasından virgül gelen (non-defining) yapılarda \"that\" ASLA kullanılamaz."
        },
        {
          "heading": "3. İlgi Zamirinin Atılması (Omission of Relative Pronoun)",
          "body": "Eğer ilgi zamiri (who, which, that) sıfat cümleciğinde NESNE konumundaysa (arkasından başka bir özne geliyorsa) cümleden tamamen atılabilir:\n\"The book which I read\" = \"The book I read\" (DOĞRU).\nAncak ilgi zamiri ÖZNE konumundaysa (arkasından doğrudan fiil geliyorsa) ASLA atılamaz:\n\"The man who spoke to me\" (who atılamaz)."
        },
        {
          "heading": "4. \"Whose\" Sahiplik Kalıbı",
          "body": "\"Whose\", arkasından hemen tanımlıksız bir isim alarak iyelik ilişkisi kurar: \"A widow is a woman whose husband has died\". Hem insan hem de cansız varlıkların parçaları için kullanılabilir."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Defining relative clauses virgülle ayrılmaz. İnsanlar için who/that, nesneler için which/that, sahiplik için whose, yer için where kullanılır. İlgi zamiri nesne konumundaysa cümleden atılabilir."
        }
      ],
      "formulas": [
        {
          "label": "İnsan Niteleme",
          "pattern": "Person + who / that + clause",
          "note": "Örn: The architect who designed this bridge is famous."
        },
        {
          "label": "Nesne Niteleme",
          "pattern": "Thing + which / that + clause",
          "note": "Örn: This is the laptop that broke down yesterday."
        },
        {
          "label": "Sahiplik Niteleme",
          "pattern": "Noun + whose + noun + clause",
          "note": "Örn: I met a girl whose father is an astronaut."
        },
        {
          "label": "Zamir Atma Kuralı",
          "pattern": "Noun + (who/which/that) + Subject + Verb",
          "note": "Örn: The movie (that) we watched was fantastic."
        }
      ],
      "examples": [
        {
          "en": "The police have caught the criminal who stole the expensive diamond necklace.",
          "tr": "Polis, pahalı elmas kolyeyi çalan suçluyu yakaladı.",
          "note": "İnsan özne niteleyen \"who\"."
        },
        {
          "en": "This is the ancient manuscript that was discovered in the desert cave.",
          "tr": "Bu, çöl mağarasında keşfedilen antik el yazmasıdır.",
          "note": "Cansız nesne niteleyen \"that / which\"."
        },
        {
          "en": "I met a friendly local woman whose family has lived in the village for centuries.",
          "tr": "Ailesi yüzyıllardır köyde yaşayan cana yakın yerli bir kadınla tanıştım.",
          "note": "Sahiplik bildiren \"whose\"."
        },
        {
          "en": "That is the picturesque coastal town where my grandparents spent their youth.",
          "tr": "Büyükannem ve büyükbabamın gençliklerini geçirdikleri pitoresk sahil kasabası işte burasıdır.",
          "note": "Mekan bildiren \"where\"."
        },
        {
          "en": "The delicious cake (which) Sude baked for the office party was finished in minutes.",
          "tr": "Sude'nin ofis partisi için pişirdiği lezzetli pasta dakikalar içinde bitti.",
          "note": "Nesne konumunda atılabilen \"which / that\"."
        },
        {
          "en": "Do you still remember the happy day when we received our university acceptance letters?",
          "tr": "Üniversite kabul mektuplarımızı aldığımız o mutlu günü hala hatırlıyor musun?",
          "note": "Zaman niteleyen \"when\"."
        },
        {
          "en": "A veterinarian is a qualified doctor whose job is to treat sick animals.",
          "tr": "Veteriner hekim, görevi hasta hayvanları tedavi etmek olan yetkili bir doktordur.",
          "note": "Whose job (işi ... olan)."
        },
        {
          "en": "The laptop which I bought last month has already started showing battery problems.",
          "tr": "Geçen ay satın aldığım dizüstü bilgisayar şimdiden batarya sorunları göstermeye başladı.",
          "note": "Nesne niteleyen \"which\"."
        }
      ],
      "keyRules": [
        "Defining (tanımlayıcı) sıfat cümleciklerinde asla virgül KULLANILMAZ.",
        "Virgül olmayan bu yapılarda \"that\", hem \"who\" hem \"which\" yerine tamamen geçerlidir.",
        "İlgi zamirinden sonra doğrudan fiil geliyorsa (who works, which broke), o zamir cümleden atılamaz.",
        "\"Where\" arkasından tam bir cümle (özne + fiil) alır; eğer arkasından doğrudan fiil geliyorsa yer adı bile olsa \"which / that\" kullanılır (\"the house which was built\")."
      ],
      "commonMistakes": [
        {
          "wrong": "I visited the hotel where was built in 1920.",
          "right": "I visited the hotel which was built in 1920.",
          "explanation": "Boşluktan sonra doğrudan fiil ('was built') geliyorsa mekan özne konumundadır; 'where' değil 'which / that' kullanılır."
        },
        {
          "wrong": "The boy whose his bicycle was stolen reported it to the police.",
          "right": "The boy whose bicycle was stolen reported it to the police.",
          "explanation": "'Whose' zaten iyelik zamiridir; arkasından tekrar 'his / her / their' getirilmez ('whose bicycle')."
        },
        {
          "wrong": "The man whom lives next door is an architect.",
          "right": "The man who lives next door is an architect.",
          "explanation": "Cümlenin öznesi konumundaki eylemi yapan kişi için 'whom' değil 'who' kullanılır."
        },
        {
          "wrong": "The car, that I bought last week, is very economical.",
          "right": "The car that I bought last week is very economical. / The car, which I bought...",
          "explanation": "Tanımlayıcı cümlecikte virgül kullanılmaz; virgüllü cümlede ise asla 'that' kullanılmaz."
        }
      ],
      "examTips": [
        "Boşluktan önce bir isim ve boşluktan hemen sonra definitionsız bir isim varsa (a boy _____ dog...) -> WHOSE arayın.",
        "Mekan kelimelerinden (city, house, hotel) sonra doğrudan FİİL geliyorsa WHICH, tam cümle (özne + fiil) geliyorsa WHERE seçin.",
        "Seçeneklerde \"whose his\" veya \"whose their\" gibi çifte iyelik şıklarını hemen eleyin.",
        "Defining yapılarda virgül olmadığını ve \"that\" zamirinin serbestçe kullanılabileceğini unutmayın."
      ]
    }
  },
  {
    "id": "b1-g11",
    "level": "B1",
    "order": 11,
    "title": "Connectors & Linking Words (Although, Despite, However, In Order To)",
    "description": "Zıtlık, neden-sonuç ve amaç bildiren bağlaçların cümle ve isim öbekleriyle kullanımı.",
    "status": "ready",
    "content": {
      "intro": "Bağlaçlar ve Geçiş Sözcükleri (Connectors & Linking Words), düşünceler arasındaki mantıksal, zamansal, zıtlık ve amaç ilişkilerini kurarak metinlerin akıcı ve tutarlı olmasını sağlar. B1 seviyesinde özellikle zıtlık bildiren bağlaçların cümle mi (clause) yoksa isim öbeği mi (noun phrase) aldığı ayrımı ve amaç bildiren yapıların kuralları kapsamlı şekilde test edilir.",
      "sections": [
        {
          "heading": "1. Zıtlık Bildiren Bağlaçlar: Cümle Alanlar (Although, Even though, Though)",
          "body": "\"Although, Even though ve Though\" (-e rağmen / -sa da) bağlaçlarından sonra tam bir cümle (Özne + Fiil) gelir: \"Although it rained heavily, we thoroughly enjoyed the open-air concert\" (Şiddetli yağmur yağmasına rağmen açık hava konserinden çok keyif aldık)."
        },
        {
          "heading": "2. Zıtlık Bildiren Bağlaçlar: İsim / V-ing Alanlar (Despite, In spite of)",
          "body": "\"Despite\" ve \"In spite of\" (-e rağmen) bağlaçlarından sonra ASLA tam cümle gelmez; isim, zamir veya V-ing (gerund) gelir: \"Despite the heavy rain, we enjoyed the concert\" veya \"In spite of feeling tired, she worked late\". DİKKAT: \"Despite of\" diye bir kullanım YOKTUR."
        },
        {
          "heading": "3. Geçiş Zarfları: \"However, Nevertheless, On the other hand\"",
          "body": "\"However\" (Ancak / Ne var ki), iki bağımsız cümle arasında köprü kurar. Genellikle noktalı virgül (;) veya noktadan (.) sonra gelir ve kendisinden sonra virgül (,) alır: \"He studied very hard; however, he did not pass the exam\"."
        },
        {
          "heading": "4. Amaç Bildiren Yapılar: In order to, So as to, So that",
          "body": "• in order to / so as to + V1: -mek amacıyla (fiil alır): \"She woke up early in order to catch the train\". Olumsuzu: \"in order not to / so as not to be late\".\n• so that + Clause (Subject + can/could/will/would): -sın diye (cümle alır): \"She woke up early so that she could catch the train\"."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Although/Even though + Özne + Fiil alır. Despite/In spite of + İsim veya V-ing alır (\"despite of\" yoktur). However noktadan sonra virgülle başlar. In order to + V1 alır; so that + tam cümle alır."
        }
      ],
      "formulas": [
        {
          "label": "Cümle Alan Zıtlık",
          "pattern": "Although / Even though / Though + Subject + Verb",
          "note": "Örn: Although he was ill, he went to work."
        },
        {
          "label": "İsim Alan Zıtlık",
          "pattern": "Despite / In spite of + Noun / V-ing",
          "note": "Örn: Despite his illness, he went to work."
        },
        {
          "label": "Geçiş Zarfı",
          "pattern": "Sentence 1. However, Sentence 2.",
          "note": "Örn: It was raining. However, we went for a walk."
        },
        {
          "label": "Amaç Yapıları",
          "pattern": "in order to + V1  vs.  so that + Subject + Modal",
          "note": "Örn: in order to pass vs. so that he could pass"
        }
      ],
      "examples": [
        {
          "en": "Although the company faced financial difficulties, it didn't dismiss any employees.",
          "tr": "Şirket mali güçlüklerle karşılaşmasına rağmen hiçbir çalışanını işten çıkarmadı.",
          "note": "Although + tam cümle (the company faced)."
        },
        {
          "en": "Despite having very little experience in sales, he secured the account manager position.",
          "tr": "Satış alanında çok az deneyimi olmasına rağmen müşteri yöneticisi pozisyonunu kazandı.",
          "note": "Despite + V-ing (having)."
        },
        {
          "en": "The mobile phone is quite expensive; however, its battery performance is unmatched.",
          "tr": "Cep telefonu oldukça pahalı; ne var ki batarya performansı eşsiz.",
          "note": "Geçiş zarfı (however + virgül)."
        },
        {
          "en": "Ahmet took an intensive language course in order to improve his academic English skills.",
          "tr": "Ahmet akademik İngilizce becerilerini geliştirmek amacıyla yoğun bir dil kursuna katıldı.",
          "note": "in order to + V1 (improve)."
        },
        {
          "en": "Sude spoke quietly so that she wouldn't wake the sleeping baby in the adjoining room.",
          "tr": "Sude yan odada uyuyan bebeği uyandırmasın diye alçak sesle konuştu.",
          "note": "so that + cümle (she wouldn't wake)."
        },
        {
          "en": "In spite of the terrible weather conditions, the rescue operation was completed successfully.",
          "tr": "Berbat hava koşullarına rağmen kurtarma operasyonu başarıyla tamamlandı.",
          "note": "In spite of + isim öbeği (the terrible weather)."
        },
        {
          "en": "We left the house early so as not to get caught in the morning rush hour traffic.",
          "tr": "Sabah yoğun saat trafiğine yakalanmamak amacıyla evden erken çıktık.",
          "note": "Olumsuz amaç (so as not to get caught)."
        },
        {
          "en": "Even though he was thoroughly exhausted, he stayed up to finish the project deadline.",
          "tr": "Bütünüyle tükenmiş olmasına karşın proje teslimini tamamlamak için ayakta kaldı.",
          "note": "Even though + tam cümle."
        }
      ],
      "keyRules": [
        "\"Despite of\" İngilizcede KESİNLİKLE YANLIŞTIR; ya \"despite\" ya da \"in spite of\" kullanılır.",
        "\"Despite / In spite of + the fact that\" kalıbı kurulursa, arkasından tam cümle (özne + fiil) gelebilir.",
        "\"Although\" ve \"but\" aynı cümlede asla BİRLİKTE kullanılmaz: \"Although it rained, but we went out\" YANLIŞTIR.",
        "Olumsuz amaç yapısında \"in order to not\" değil, \"in order not to\" ve \"so as not to\" sıralaması kullanılır."
      ],
      "commonMistakes": [
        {
          "wrong": "Despite of the rain, we decided to go hiking.",
          "right": "Despite the rain, we decided to go hiking. / In spite of the rain...",
          "explanation": "'Despite' edatı asla 'of' almaz; 'in spite of' ise üç kelimeden oluşur."
        },
        {
          "wrong": "Although he was late, but he didn't apologize.",
          "right": "Although he was late, he didn't apologize. / He was late, but he didn't apologize.",
          "explanation": "'Although' ve 'but' aynı zıtlığı bildirir; ikisi aynı anda tek bir cümlede kullanılamaz."
        },
        {
          "wrong": "He left early in order to not miss the bus.",
          "right": "He left early in order not to miss the bus.",
          "explanation": "Amaç bildiren olumsuz yapıda 'not', 'to'dan önce gelir: 'in order not to'."
        },
        {
          "wrong": "Despite he worked hard, he failed the exam.",
          "right": "Although he worked hard, he failed the exam. / Despite working hard...",
          "explanation": "'Despite' arkasından doğrudan tam cümle (he worked hard) alamaz; tam cümle için 'Although' gerekir."
        }
      ],
      "examTips": [
        "Boşluktan sonra tam cümle (özne + fiil) varsa -> ALTHOUGH / EVEN THOUGH seçin.",
        "Boşluktan sonra sadece isim öbeği veya V-ing varsa -> DESPITE / IN SPITE OF seçin.",
        "Şıklarda \"Despite of\" seçeneğini doğrudan eleyin.",
        "Noktalı virgül (;) veya noktadan (.) hemen sonra boşluk ve ardından virgül (,) varsa -> HOWEVER seçin."
      ]
    }
  },
  {
    "id": "b1-g12",
    "level": "B1",
    "order": 12,
    "title": "Question Tags",
    "description": "Cümle sonuna eklenen onay soruları (\"...değil mi?\") ve istisnai kalıplar (Let’s, I am, imperative).",
    "status": "ready",
    "content": {
      "intro": "Onay Soruları (Question Tags), bir ifadenin doğruluğunu teyit etmek, muhatabın onayını almak veya konuşmayı sürdürmek amacıyla cümle sonuna eklenen kısa soru ekleridir (\"değil mi? / öyle mi?\"). Temel kural zıt kutup kuralıdır: Cümle olumluysa soru eki olumsuz, cümle olumsuzsa soru eki olumlu olur. Ayrıca \"Let's\", emir cümleleri ve \"I am\" gibi özel istisnalar barındırır.",
      "sections": [
        {
          "heading": "1. Altın Kural: Zıt Kutupluluk (Positive / Negative)",
          "body": "• Olumlu cümle -> Olumsuz ek:\n  \"You are a student, aren't you?\"\n  \"She works here, doesn't she?\"\n• Olumsuz cümle -> Olumlu ek:\n  \"You aren't tired, are you?\"\n  \"He didn't call, did he?\""
        },
        {
          "heading": "2. Yardımcı Fiil ve Zaman Uyumu",
          "body": "Cümlede modal veya yardımcı fiil (be, have, can, will, should) varsa aynen taşınır: \"You can swim, can't you?\". Cümlede yardımcı fiil yoksa (Present Simple / Past Simple düz cümle): \"do / does / did\" devreye girer: \"Ahmet loves jazz music, doesn't he?\"."
        },
        {
          "heading": "3. Özel İstisnalar (Sınavların Vazgeçilmez Kalıpları)",
          "body": "• I am -> aren't I? (\"I am right, aren't I?\")\n• Let's -> shall we? (\"Let's have a coffee, shall we?\")\n• Emir cümleleri (Imperatives) -> will you? (\"Pass me the salt, will you?\" / \"Don't be late, will you?\")\n• Sahiplik: \"You have a car, don't you?\" (Amerikan) veya \"haven't you?\" (İngiliz)."
        },
        {
          "heading": "4. Gizli Olumsuz Kelimeler (Never, Rarely, Seldom, Barely, Nobody)",
          "body": "Cümlede \"never, rarely, seldom, hardly, barely, nobody, nothing\" gibi olumsuz anlam taşıyan sözcükler varsa cümle yapısal olarak olumlu görünse bile anlamca olumsuzdur; bu yüzden soru eki OLUMLU olur: \"Nobody came to the party, did they?\", \"She never eats meat, does she?\"."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Olumlu cümle olumsuz tag, olumsuz cümle olumlu tag alır. I am -> aren't I? Let's -> shall we? Emir cümleleri -> will you? Never/nobody olan cümleler olumlu tag (does he? did they?) alır."
        }
      ],
      "formulas": [
        {
          "label": "Olumlu Cümle + Negatif Tag",
          "pattern": "Positive Sentence, auxiliary + not + pronoun?",
          "note": "Örn: She is a doctor, isn't she?"
        },
        {
          "label": "Olumsuz Cümle + Pozitif Tag",
          "pattern": "Negative Sentence, auxiliary + pronoun?",
          "note": "Örn: They haven't arrived yet, have they?"
        },
        {
          "label": "I am İstisnası",
          "pattern": "I am..., aren't I?",
          "note": "Örn: I am next in line, aren't I?"
        },
        {
          "label": "Let's İstisnası",
          "pattern": "Let's..., shall we?",
          "note": "Örn: Let's take a short break, shall we?"
        }
      ],
      "examples": [
        {
          "en": "You haven't completed the assignment yet, have you?",
          "tr": "Ödevi henüz tamamlamadın, değil mi?",
          "note": "Olumsuz cümle (haven't) -> olumlu tag (have you?)."
        },
        {
          "en": "Sude plays the violin beautifully, doesn't she?",
          "tr": "Sude kemanı çok güzel çalıyor, değil mi?",
          "note": "Simple Present 3. tekil (plays) -> doesn't she?."
        },
        {
          "en": "Let's go for a walk in the park, shall we?",
          "tr": "Hadi parkta yürüyüşe çıkalım, olur mu / ne dersin?",
          "note": "'Let's' teklif kalıbı 'shall we?' alır."
        },
        {
          "en": "I am invited to the wedding celebration as well, aren't I?",
          "tr": "Ben de düğün kutlamasına davetliyim, öyle değil mi?",
          "note": "'I am' yapısı 'aren't I?' gerektirir."
        },
        {
          "en": "Ahmet rarely speaks during the weekly staff meetings, does he?",
          "tr": "Ahmet haftalık personel toplantılarında nadiren konuşur, değil mi?",
          "note": "'Rarely' gizli olumsuzluk kattığı için pozitif tag (does he?)."
        },
        {
          "en": "Close the front window before leaving, will you?",
          "tr": "Ayrılmadan önce ön pencereyi kapat, tamam mı?",
          "note": "Emir cümlesi -> will you?."
        },
        {
          "en": "Nobody called while I was at the dentist, did they?",
          "tr": "Ben diş hekimindeyken kimse aramadı, değil mi?",
          "note": "'Nobody' olumsuzdur ve zamiri 'they' olur -> did they?."
        },
        {
          "en": "They can speak three foreign languages fluently, can't they?",
          "tr": "Üç yabancı dili akıcı bir şekilde konuşabiliyorlar, değil mi?",
          "note": "Modal (can) -> olumsuz tag (can't they?)."
        }
      ],
      "keyRules": [
        "Question tag kısmında asla tam isim kullanılmaz; daima kişi zamiri (he, she, it, they, we, you, I) kullanılır.",
        "\"Nobody, somebody, everybody, everyone\" zamirleri tag kısmında \"they\" zamiriyle karşılanır: \"Everybody is here, aren't they?\".",
        "\"Nothing, everything, something\" zamirleri tag kısmında \"it\" ile karşılanır: \"Nothing was said, was it?\".",
        "Ses tonu (intonation) yukarı doğru çıkıyorsa gerçek bir soru soruluyordur; aşağı doğru iniyorsa onay bekleniyordur."
      ],
      "commonMistakes": [
        {
          "wrong": "I am right, amn't I?",
          "right": "I am right, aren't I?",
          "explanation": "İngilizcede 'amn't' diye bir kısaltma yoktur; standart kural 'aren't I?' şeklindedir."
        },
        {
          "wrong": "She never drinks milk, doesn't she?",
          "right": "She never drinks milk, does she?",
          "explanation": "'Never' cümleye olumsuzluk katar; bu yüzden tag kısmı olumlu (does she) olmalıdır."
        },
        {
          "wrong": "Let's watch a movie tonight, will we?",
          "right": "Let's watch a movie tonight, shall we?",
          "explanation": "'Let's' kalıbının sabit onay sorusu 'shall we?'dir."
        },
        {
          "wrong": "Everybody enjoyed the performance, didn't he?",
          "right": "Everybody enjoyed the performance, didn't they?",
          "explanation": "'Everybody' tekil fiil alsa da onay sorusunda çoğul zamir olan 'they' ile karşılanır."
        }
      ],
      "examTips": [
        "Cümlede \"never, rarely, seldom, hardly, nobody, nothing\" var mı hemen kontrol edin; varsa tag mutlaka OLUMLU olacaktır.",
        "\"I am...\" ile başlayan cümlelerde doğrudan \"aren't I?\" seçeneğini arayın.",
        "\"Let's...\" ile başlayan cümlelerde doğrudan \"shall we?\" seçeneğini arayın.",
        "Emir cümlelerinde (Don't touch that / Please sit down) doğrudan \"will you?\" arayın."
      ]
    }
  },
  {
    "id": "b2-g01",
    "level": "B2",
    "order": 1,
    "title": "Past Perfect Continuous",
    "description": "Geçmişteki bir olaydan önce belirli bir süre devam etmiş eylemler (had been + V-ing).",
    "status": "ready",
    "content": {
      "intro": "Past Perfect Continuous Tense (had been + V-ing), geçmişte gerçekleşen bir eylemden veya belirli bir andan önce başlamış ve o ana kadar kesintisiz bir süreç boyunca devam etmiş eylemleri anlatır. Present Perfect Continuous (have/has been V-ing) yapısının bir adım geçmişe (Past) taşınmış hâlidir; odak noktası eylemin ne kadar sürdüğü (süreç) veya geçmişte bıraktığı gözle görülür fiziksel etkidir.",
      "sections": [
        {
          "heading": "1. Temel Kurallar ve Kullanım Alanları",
          "body": "Past Perfect Continuous iki temel durumda kullanılır:\n1) Geçmişteki bir olaydan önce ne kadar süreyle devam ettiği vurgulanan eylemler: 'They had been waiting for two hours when the bus finally arrived.' (Otobüs nihayet geldiğinde iki saattir bekliyorlardı.)\n2) Geçmişte sona ermiş ancak etkisi, izi veya yorgunluğu geçmişteki o anda açıkça görülen eylemler: 'Her eyes were red because she had been crying.' (Gözleri kırmızıydı çünkü ağlamaktaydı / ağlamıştı.)"
        },
        {
          "heading": "2. Olumlu, Olumsuz ve Soru Yapıları",
          "body": "Bu zamanda özne tekil de olsa çoğul da olsa yardımcı fiil daima 'had been' olarak sabit kalır ve ana fiile '-ing' eklenir.\n• Olumlu (+): Subject + had been + V-ing ('I had been working', 'She had been sleeping')\n• Olumsuz (-): Subject + hadn't (had not) been + V-ing ('We hadn't been paying attention')\n• Soru (?): Had + Subject + been + V-ing? ('How long had you been studying before the exam started?')"
        },
        {
          "heading": "3. Kullanım Farkları ve Karşılaştırmalar (Past Perfect Simple vs. Continuous & Past Continuous)",
          "body": "• Past Perfect Continuous (had been V-ing) vs. Past Perfect Simple (had V3): Continuous yapısı 'Ne kadar süredir?' (How long? — süreç) sorusuna yanıt verirken; Simple yapısı 'Kaç kez / Ne kadar?' (How many / How much — tamamlanmış miktar ve sonuç) sorusuna yanıt verir. Örn: 'He had been writing letters all morning' (Süreç) vs. 'He had written five letters by noon' (Tamamlanan miktar).\n• Past Continuous (was/were V-ing) vs. Past Perfect Continuous (had been V-ing): 'When I entered the room, she was singing' (İçeri girdiğim tam o sırada şarkı söylüyordu) vs. 'When I entered the room, she had been singing for an hour' (İçeri girdiğimde bir saattir şarkı söylemekteydi — öncesinden gelen süreç)."
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar",
          "body": "• Durum Fiilleri (Stative Verbs): 'know, believe, own, belong, understand, like, hate, want, have (sahiplik), be' gibi durum fiilleri '-ing' takısı alamaz. Bu fiillerle süreç ('for ten years' vb.) bildirilse dahi Past Perfect Continuous DEĞİL, zorunlu olarak Past Perfect Simple (had + V3) kullanılır:\nDoğru: 'We had known each other for ten years before we became business partners.' ('had been knowing' KESİNLİKLE YANLIŞTIR).\n• Anlık Fiiller: 'start, finish, break, stop, arrive, die' gibi anlık biten eylemler süreklilik bildiremeyeceği için (tekrar anlamı yoksa) Continuous yapıda kullanılmaz."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Özetle; geçmişte bir referans noktasından (when + V2, before + V2, by the time + V2) önce belli bir süre ('for, since, all day, how long') devam etmiş eylemler için 'had been + V-ing' kullanılır. Sayı/miktar belirtilen tamamlanmış işlerde ve durum fiillerinde (stative verbs) ise 'had + V3' tercih edilir."
        }
      ],
      "formulas": [
        {
          "label": "Olumlu Cümle (+)",
          "pattern": "Subject + had been + V-ing (+ for / since / all day)",
          "note": "Örn: She had been working at that hospital for six years before she moved."
        },
        {
          "label": "Olumsuz Cümle (-)",
          "pattern": "Subject + hadn't (had not) been + V-ing",
          "note": "Örn: He hadn't been sleeping well for weeks before he saw a doctor."
        },
        {
          "label": "Soru Cümlesi (?)",
          "pattern": "(How long) + had + Subject + been + V-ing?",
          "note": "Örn: How long had they been driving when the engine overheated?"
        },
        {
          "label": "Durum Fiilleri İstisnası (Stative Verbs)",
          "pattern": "Subject + had + V3 (+ for / since) — [-ing ALMAZ]",
          "note": "Örn: I had owned that car for five years before I sold it."
        }
      ],
      "examples": [
        {
          "en": "We had been waiting at the station for over an hour when the train finally pulled in.",
          "tr": "Tren nihayet perona girdiğinde bir saati aşkın süredir istasyonda beklemekteydik.",
          "note": "Geçmişteki bir olaydan (pulled in) önce devam eden süreç (for over an hour)."
        },
        {
          "en": "The ground was completely soaked because it had been raining heavily all night.",
          "tr": "Yer tamamen sırılsıklamdı çünkü bütün gece şiddetli yağmur yağmıştı.",
          "note": "Geçmişteki bir durumun (was soaked) öncesinde süregelen fiziksel nedeni."
        },
        {
          "en": "How long had you been learning Spanish before you went to Madrid?",
          "tr": "Madrid'e gitmeden önce ne kadar süredir İspanyolca öğreniyordun?",
          "note": "'How long' + 'before + V2' ile geçmiş süreç sorusu."
        },
        {
          "en": "Ahmet was exhausted because he had been studying for his final exams since morning.",
          "tr": "Ahmet çok bitkin düşmüştü çünkü sabahtan beri final sınavlarına çalışıyordu.",
          "note": "Geçmişteki yorgunluğun (was exhausted) arkasındaki süreç nedeni."
        },
        {
          "en": "She hadn't been feeling well for several days, so she decided to take a sick leave.",
          "tr": "Birkaç gündür kendini iyi hissetmiyordu, bu yüzden hastalık izni almaya karar verdi.",
          "note": "Olumsuz Past Perfect Continuous (hadn't been feeling)."
        },
        {
          "en": "By the time the firefighters arrived, the warehouse had been burning for forty minutes.",
          "tr": "İtfaiyeciler vardığında depo kırk dakikadır yanmaktaydı.",
          "note": "'By the time + V2' ve 'for + süre' birleşimi."
        },
        {
          "en": "They had known each other since childhood before they got married in 2020.",
          "tr": "2020'de evlenmeden önce çocukluktan beri birbirlerini tanıyorlardı.",
          "note": "DİKKAT: 'Know' durum fiili olduğu için 'had been knowing' değil, 'had known' kullanılır."
        },
        {
          "en": "The chef's apron was covered in flour because he had been baking bread all afternoon.",
          "tr": "Şefin önlüğü un içindeydi çünkü bütün öğleden sonra ekmek pişirmişti.",
          "note": "Geçmişteki görünür kanıt (was covered in flour) → had been baking."
        }
      ],
      "keyRules": [
        "Cümlede geçmişte gerçekleşen bir olay (V2) ve bu olaydan öncesine ait bir süreç ('for two hours, since morning, all day, how long') bir arada verildiyse doğru zaman Past Perfect Continuous (had been V-ing) olur.",
        "Geçmişteki bir durumun ('was tired, were wet, smelled of smoke') hemen öncesindeki devamlı eylemi açıklarken 'because + had been V-ing' kullanılır.",
        "Cümlede eylemin kaç kez yapıldığı veya ortaya çıkan net sayısal miktar ('three reports, five cups of coffee') varsa Continuous değil, Past Perfect Simple (had V3) kullanılır.",
        "Durum fiilleri (know, be, have [sahiplik], own, belong, believe, like) süre zarfı alsa bile kesinlikle 'had been V-ing' olmaz; 'had V3' olarak çekimlenir."
      ],
      "commonMistakes": [
        {
          "wrong": "When I arrived at the café, Sude was waiting for me for forty minutes.",
          "right": "When I arrived at the café, Sude had been waiting for me for forty minutes.",
          "explanation": "Geçmişteki bir andan öncesini kapsayan 'for forty minutes' gibi bir süre zarfı olduğunda 'was waiting' değil, 'had been waiting' kullanılır."
        },
        {
          "wrong": "We had been knowing the manager for years before he retired.",
          "right": "We had known the manager for years before he retired.",
          "explanation": "'Know' bir durum fiilidir (stative verb) ve '-ing' takısı alamaz; süreç bildirse de 'had known' kullanılır."
        },
        {
          "wrong": "By 5 PM yesterday, I had been writing six official emails.",
          "right": "By 5 PM yesterday, I had written six official emails.",
          "explanation": "Tamamlanmış net bir miktar ('six official emails') belirtildiğinde süreç değil sonuç odaklı Past Perfect Simple ('had written') kullanılır."
        },
        {
          "wrong": "His hands were dirty because he has been repairing his bike.",
          "right": "His hands were dirty because he had been repairing his bike.",
          "explanation": "Ana cümle geçmiş zaman ('His hands were dirty') olduğu için yan cümlede Present Perfect ('has been') kullanılamaz; zaman uyumu gereği 'had been repairing' olmalıdır."
        }
      ],
      "examTips": [
        "Soruda 'when/before/by the time + V2' ile birlikte 'for + süre' veya 'all day / all morning / since...' görürseniz şıklarda doğrudan 'had been + V-ing' arayın.",
        "Boşluktan sonraki fiil 'know, be, own, belong, have (sahip olmak)' ise 'had been V-ing' şıkkını anında eleyip 'had + V3' şıkkını işaretleyin.",
        "Ana cümlede 'was exhausted / were red / was covered in snow / was out of breath' gibi geçmişte gözlemlenen bir sonuç ve 'because' bağlacı varsa 'had been + V-ing' en güçlü adaydır.",
        "Boşluktan sonra 'three times, four chapters, ten pages' gibi sayısal bir çıktı varsa 'had been V-ing' tuzağına düşmeyin; 'had + V3' seçin."
      ]
    }
  },
  {
    "id": "b2-g02",
    "level": "B2",
    "order": 2,
    "title": "Future Continuous & Future Perfect",
    "description": "Gelecekte belirli bir anda devam edecek (will be V-ing) ve belirli bir zamana kadar tamamlanmış olacak (will have V3) eylemler.",
    "status": "ready",
    "content": {
      "intro": "B2 seviyesinde gelecek zaman yalnızca 'will' veya 'going to' ile sınırlı değildir. Gelecekte spesifik bir noktada devam ediyor olacak eylemleri anlatmak için Future Continuous (will be + V-ing), gelecekte belirli bir tarihe veya olaya kadar tamamlanmış/bitmiş olacak eylemleri ifade etmek için ise Future Perfect (will have + V3) ve süreç vurgusu için Future Perfect Continuous (will have been + V-ing) kullanılır.",
      "sections": [
        {
          "heading": "1. Temel Kurallar ve Kullanım Alanları",
          "body": "• Future Continuous (will be + V-ing): Gelecekte tam belirli bir saatte veya anda ('this time tomorrow, at 9 PM tonight, in two hours' time') yarıda/devam etmekte olacak eylemleri anlatır: 'This time tomorrow, I will be flying to Tokyo.' (Yarın bu vakitlerde Tokyo'ya uçuyor olacağım.)\n• Future Perfect Simple (will have + V3): Gelecekte belirli bir zamana kadar ('by tomorrow, by 2030, by the time you arrive, before Friday') çoktan bitmiş, tamamlanmış olacak eylemleri anlatır: 'By next June, she will have graduated from university.' (Gelecek Haziran'a kadar üniversiteden mezun olmuş olacak.)"
        },
        {
          "heading": "2. Olumlu, Olumsuz ve Soru Yapıları",
          "body": "Her iki yapıda da 'will' tüm özneler için aynıdır.\n• Future Continuous:\n  (+) Subject + will be + V-ing ('We will be having dinner at 8 PM.')\n  (-) Subject + won't be + V-ing ('I won't be working tomorrow.')\n  (?) Will + Subject + be + V-ing? ('Will you be using your laptop tonight?')\n• Future Perfect:\n  (+) Subject + will have + V3 ('They will have finished the bridge by autumn.')\n  (-) Subject + won't have + V3 ('He won't have woken up by 7 AM.')\n  (?) Will + Subject + have + V3? ('Will you have completed the report by Monday?')"
        },
        {
          "heading": "3. Kullanım Farkları ve Karşılaştırmalar (Future Perfect Continuous Dahil)",
          "body": "• 'At this time tomorrow' (Yarın bu sırada) → Eylem devam ediyor olacak → Future Continuous (will be V-ing).\n• 'By this time tomorrow' (Yarın bu vakte kadar) → Eylem tamamlanmış olacak → Future Perfect (will have V3).\n• Future Perfect Continuous (will have been + V-ing): Gelecekte belirli bir noktaya gelindiğinde bir eylemin ne kadar süredir devam ediyor olacağını ('by... + for...') vurgular:\n'By the end of this year, I will have been teaching English for ten years.' (Bu yılın sonunda, on yıldır İngilizce öğretiyor olacağım — hem 'by' var hem 'for + süre' var)."
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar",
          "body": "• Zaman Bağlaçları Kuralı (Time Clauses): 'When, by the time, before, after, as soon as, until, once' gibi zaman bağlaçlarının bulunduğu yan cümlecikte KESİNLİKLE 'will / will be / will have' kullanılmaz! Yan cümlecik Simple Present (V1/V-s) veya Present Perfect (have/has V3) olur; 'will have V3' veya 'will be V-ing' SADECE ana cümlede yer alır:\nDoğru: 'By the time the guests arrive (arrive = V1), we will have cleaned the house.' ('By the time the guests will arrive' YANLIŞTIR).\n• Durum Fiilleri: 'know, be, have (sahiplik), own' gibi durum fiilleri 'by... + for...' ile kullanılsa bile '-ing' alamayacağı için Future Perfect Simple (will have V3) ile kurulur: 'By next month, they will have been married for twenty years.'"
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Özetle; gelecekteki bir noktada sürecek işler için 'will be V-ing' (ipucu: at this time tomorrow, at 5 PM tomorrow), gelecekteki bir noktaya kadar bitecek işler için 'will have V3' (ipucu: by, by the time, before, within), gelecekteki bir noktada ne kadar süredir devam ediyor olacağını vurgulamak içinse 'will have been V-ing' (ipucu: by... + for...) kullanılır."
        }
      ],
      "formulas": [
        {
          "label": "Future Continuous (+ / - / ?)",
          "pattern": "Subject + will (not) be + V-ing",
          "note": "İpuçları: at this time tomorrow, at 10 o'clock tonight, this time next week."
        },
        {
          "label": "Future Perfect Simple (+ / - / ?)",
          "pattern": "Subject + will (not) have + V3",
          "note": "İpuçları: by Monday, by 2030, by then, by the time + V1, in five years' time."
        },
        {
          "label": "Future Perfect Continuous",
          "pattern": "Subject + will have been + V-ing (+ by ... + for ...)",
          "note": "Örn: By May, she will have been living here for five years."
        },
        {
          "label": "By the time Zaman Bağlacı Kuralı",
          "pattern": "By the time + Subject + V1 (Present), Subject + will have + V3",
          "note": "Yan cümlecikte asla 'will' kullanılmaz!"
        }
      ],
      "examples": [
        {
          "en": "Don't call me at 8 o'clock tonight because I will be watching the championship match.",
          "tr": "Bu akşam saat 8'de beni arama çünkü şampiyonluk maçını izliyor olacağım.",
          "note": "Gelecekte belirli bir saatte (at 8 o'clock tonight) devam edecek eylem."
        },
        {
          "en": "This time next week, we will be lying on a sandy beach in Antalya.",
          "tr": "Gelecek hafta tam bu vakitlerde Antalya'da kumsalda uzanıyor olacağız.",
          "note": "'This time next week' → Future Continuous (will be lying)."
        },
        {
          "en": "By the end of this month, the construction team will have completed the new metro line.",
          "tr": "Bu ayın sonuna kadar inşaat ekibi yeni metro hattını tamamlamış olacak.",
          "note": "'By the end of this month' (-e kadar) → Future Perfect (will have completed)."
        },
        {
          "en": "By the time you get home from work, I will have cooked dinner.",
          "tr": "Sen işten eve gelene kadar ben akşam yemeğini pişirmiş olacağım.",
          "note": "'By the time + get (V1)' → ana cümle 'will have cooked'."
        },
        {
          "en": "Will you be using your car tomorrow morning, or can I borrow it?",
          "tr": "Yarın sabah arabanı kullanıyor olacak mısın, yoksa ödünç alabilir miyim?",
          "note": "Karşı tarafın gelecekteki planını kibarca sorma (Will you be using...?)."
        },
        {
          "en": "By next October, Emre will have been working at this software company for eight years.",
          "tr": "Gelecek Ekim ayı itibarıyla Emre bu yazılım şirketinde sekiz yıldır çalışıyor olacak.",
          "note": "'By next October' + 'for eight years' → Future Perfect Continuous (will have been working)."
        },
        {
          "en": "The plane will have taken off by the time we reach the airport if we don't hurry.",
          "tr": "Acele etmezsek biz havalimanına varana kadar uçak çoktan kalkmış olacak.",
          "note": "Gelecekteki bir andan önce tamamlanmış olacak eylem (will have taken off)."
        },
        {
          "en": "By 2028, we will have known each other for a quarter of a century.",
          "tr": "2028 yılına gelindiğinde birbirimizi çeyrek asırdır tanıyor olacağız.",
          "note": "'Know' durum fiili olduğu için 'for' olsa bile 'will have known' kullanılır."
        }
      ],
      "keyRules": [
        "'By' + gelecek zaman ('by tomorrow, by 2035, by next week, by then') '...-e kadar / ... itibarıyla' demektir ve neredeyse her zaman Future Perfect (will have V3) veya süreç varsa Future Perfect Continuous (will have been V-ing) gerektirir.",
        "'At this time tomorrow / next week' veya 'At 7 PM tomorrow' gibi gelecekte nokta bir an belirten ifadeler Future Continuous (will be V-ing) gerektirir.",
        "'By the time, when, before, as soon as' bağlaçlarının hemen arkasındaki cümlede gelecek anlam için Simple Present (V1) kullanılır; 'will' gelmez.",
        "Karşı tarafın zaten planlanmış bir eylemini nazikçe sorarken 'Will you be + V-ing?' yapısı sıkça tercih edilir."
      ],
      "commonMistakes": [
        {
          "wrong": "By the time you will arrive at the station, the train will have left.",
          "right": "By the time you arrive at the station, the train will have left.",
          "explanation": "'By the time' zaman bağlacının bulunduğu yan cümlede 'will' kullanılmaz; Simple Present ('arrive') kullanılır."
        },
        {
          "wrong": "At this time tomorrow, I will have flown to London.",
          "right": "At this time tomorrow, I will be flying to London.",
          "explanation": "'At this time tomorrow' (yarın tam bu saatte) devam etmekte olan eylemi anlatır ('will be flying'). 'By this time tomorrow' olsaydı 'will have flown' olurdu."
        },
        {
          "wrong": "By next Friday, she will finish typing all the thesis chapters.",
          "right": "By next Friday, she will have finished typing all the thesis chapters.",
          "explanation": "'By next Friday' (gelecek cumaya kadar tamamlanmış olma) vurgusu Future Simple değil, Future Perfect ('will have finished') gerektirir."
        },
        {
          "wrong": "By 2030, they will have been owning this house for twenty years.",
          "right": "By 2030, they will have owned this house for twenty years.",
          "explanation": "'Own' (sahip olmak) durum fiili olduğu için '-ing' almaz; 'will have owned' kullanılır."
        }
      ],
      "examTips": [
        "Cümlede 'by + gelecek zaman' veya 'by the time + V1' görürseniz ilk olarak 'will have + V3' (veya 'for + süre' de varsa 'will have been + V-ing') şıkkına yönelin.",
        "Dikkat: 'By the time + V2 (arrived)' geçmiş zamandır ve 'had V3' ister; 'By the time + V1 (arrive/arrives)' gelecek zamandır ve 'will have V3' ister! Yan cümlenin fiiline mutlaka bakın.",
        "'This time tomorrow / At 4 PM tomorrow' ifadelerini gördüğünüzde doğrudan 'will be + V-ing' arayın.",
        "Edilgen (Passive) yapıya dikkat edin: Nesne başta ise 'the project will have been completed' (Future Perfect Passive) yapısını seçin; 'will have been completing' (etken süreç) ile karıştırmayın!"
      ]
    }
  },
  {
    "id": "b2-g03",
    "level": "B2",
    "order": 3,
    "title": "Past Modals (Should Have Done, Could Have Done, Must Have Done, Might Have Done)",
    "description": "Geçmişe yönelik pişmanlık, eleştiri, kaçırılmış fırsat ve geçmiş çıkarım yapıları (Modal + have + V3).",
    "status": "ready",
    "content": {
      "intro": "Past Modals (Modal + have + V3), geçmişte gerçekleşmiş veya gerçekleşmemiş olaylar hakkında bugünden bakarak çıkarım (deduction) yapmak, pişmanlık (regret) dile getirmek, eleştiride (criticism) bulunmak veya kaçırılmış fırsatları anlatmak için kullanılır. B2 seviyesinin hem günlük iletişimde hem de akademik sınavlarda en çok ölçülen konularından biridir.",
      "sections": [
        {
          "heading": "1. Temel Kurallar ve Kullanım Alanları: Pişmanlık ve Eleştiri (Should / Ought to / Needn't have V3)",
          "body": "• should have + V3 / ought to have + V3: Geçmişte yapılması doğru/gerekli olan bir şeyin YAPILMADIĞINI anlatır; pişmanlık veya eleştiri bildirir ('... yapmalıydın ama yapmadın').\n  Örn: 'You should have backed up your files.' (Dosyalarını yedeklemeliydin [ama yedeklemedin ve silindi].)\n• shouldn't have + V3: Geçmişte yapılmaması gereken bir hatanın YAPILDIĞINI anlatır ('... yapmamalıydın ama yaptın').\n• needn't have + V3: Geçmişte bir eylemin yapıldığını ama aslında yapılmasına hiç gerek olmadığını anlatır ('boşuna yaptın').\n  Örn: 'You needn't have brought an umbrella; it didn't rain at all.' (Şemsiye getirmene gerek yoktu; hiç yağmur yağmadı [ama getirdin].)"
        },
        {
          "heading": "2. Olumlu ve Olumsuz Geçmiş Çıkarımlar (Must / Can't / May / Might / Could have V3)",
          "body": "Geçmişteki bir olay hakkında eldeki kanıtlara dayanarak tahmin/çıkarım yaparken:\n• must have + V3 (%95 güçlü olumlu çıkarım): '... yapmış olmalı / kesin öyle olmuştur'.\n  Örn: 'The streets are wet; it must have rained last night.' (Sokaklar ıslak; dün gece yağmur yağmış olmalı.)\n• can't have + V3 / couldn't have + V3 (%95 güçlü olumsuz çıkarım): '... yapmış olamaz / imkânsız'.\n  Örn: 'You can't have seen Sude in Ankara yesterday; she is in Berlin!' (Dün Sude'yi Ankara'da görmüş olamazsın; o Berlin'de!)\n• may / might / could have + V3 (%50 zayıf olasılık): '... yapmış olabilir / belki yapmıştır'."
        },
        {
          "heading": "3. Kullanım Farkları ve Karşılaştırmalar (Could have V3 vs. Couldn't have V3 & Didn't need to)",
          "body": "• could have + V3 (Kaçırılmış Fırsat): Geçmişte bir şeyi yapma imkânı veya yeteneği vardı ama YAPMADI.\n  Örn: 'I could have stayed at a hotel, but I preferred to camp.' (Otelde kalabilirdim ama kamp yapmayı tercih ettim.)\n• couldn't have + V3: Hem 'yapmış olamaz' (çıkarım) hem de 'istese bile yapamazdı' (imkânsızlık) anlamı taşır.\n• needn't have + V3 vs. didn't need to + V1:\n  - 'needn't have V3': Gerek yoktu ama YAPI (boşuna yapıldı).\n  - 'didn't need to V1': Gerek yoktu, bu yüzden YAPILMADI."
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar",
          "body": "• 'Mustn't have + V3' diye bir çıkarım kalıbı YOKTUR! Güçlü geçmiş çıkarımın olumsuzu ('yapmış olamaz') daima 'can't have + V3' veya 'couldn't have + V3' ile kurulur.\n• 'Would have + V3': Genellikle koşul cümlelerinde (Type 3) veya 'yapacaktım ama... (... but ...)' yapılarında gerçekleşmemiş niyeti anlatır: 'I would have called you, but my battery died.' (Seni arayacaktım ama şarjım bitti.)\n• Süreç Çıkarımı (Modal + have been + V-ing): Geçmişte o sırada devam etmekte olan bir eylem için çıkarım yapar: 'He didn't hear the doorbell; he must have been sleeping.' (Zili duymadı; o sırada uyuyor olmalıydı.)"
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Özetle; geçmişte yapılan/yapılmayan eylemleri eleştirirken 'should(n't) have V3', güçlü olumlu çıkarımda 'must have V3', güçlü olumsuz çıkarımda 'can't/couldn't have V3', zayıf ihtimalde 'may/might/could have V3', gerçekleşmeyen imkânda 'could have V3' ve boşuna yapılan eylemde 'needn't have V3' kullanılır."
        }
      ],
      "formulas": [
        {
          "label": "Pişmanlık ve Eleştiri",
          "pattern": "Subject + should (not) / ought (not) to + have + V3",
          "note": "Yapmalıydın (yapmadın) / Yapmamalıydın (yaptın)."
        },
        {
          "label": "Güçlü Geçmiş Çıkarım (+ / -)",
          "pattern": "(+) Subject + must + have + V3\n(-) Subject + can't / couldn't + have + V3",
          "note": "DİKKAT: Olumsuz çıkarımda 'mustn't have V3' KULLANILMAZ!"
        },
        {
          "label": "Olasılık ve Kaçırılmış İmkân",
          "pattern": "Subject + may / might / could + have + V3",
          "note": "'Could have V3' ayrıca 'yapabilirdim ama yapmadım' demektir."
        },
        {
          "label": "Gereksiz Yapılmış Eylem",
          "pattern": "Subject + needn't + have + V3",
          "note": "Gerek yoktu ama boşuna yaptın."
        }
      ],
      "examples": [
        {
          "en": "I should have studied harder for the proficiency exam; I failed by just two points.",
          "tr": "Muafiyet sınavına daha sıkı çalışmalıydım; sadece iki puanla kaldım.",
          "note": "Geçmişe yönelik pişmanlık (should have studied — çalışmadım)."
        },
        {
          "en": "You shouldn't have spoken to your mother so rudely yesterday.",
          "tr": "Dün annene o kadar kaba konuşmamalıydın.",
          "note": "Geçmişteki bir davranışa yönelik eleştiri (shouldn't have spoken — konuştun)."
        },
        {
          "en": "Ali isn't answering his phone; he must have left it in his car.",
          "tr": "Ali telefonuna cevap vermiyor; onu arabasında unutmuş olmalı.",
          "note": "Güçlü olumlu geçmiş çıkarım (must have left)."
        },
        {
          "en": "She can't have stolen the documents because she was abroad all last week.",
          "tr": "Belgeleri o çalmış olamaz çünkü geçen hafta boyunca yurt dışındaydı.",
          "note": "Kanıta dayalı güçlü olumsuz geçmiş çıkarım (can't have stolen)."
        },
        {
          "en": "We could have taken a taxi, but we decided to walk in the cool evening air.",
          "tr": "Taksiye binebilirdik ama serin akşam havasında yürümeye karar verdik.",
          "note": "Geçmişte var olan ama tercih edilmeyen imkân (could have taken)."
        },
        {
          "en": "You needn't have cooked so much food; we had already eaten before coming here.",
          "tr": "Bu kadar çok yemek pişirmene gerek yoktu; buraya gelmeden önce zaten yemiştik.",
          "note": "Boşuna yapılmış eylem (needn't have cooked — yemek pişirildi)."
        },
        {
          "en": "I'm not sure why Zeynep missed the meeting; she might have forgotten about it.",
          "tr": "Zeynep'in toplantıyı neden kaçırdığından emin değilim; unutmuş olabilir.",
          "note": "'I'm not sure' → %50 zayıf geçmiş ihtimal (might have forgotten)."
        },
        {
          "en": "I would have lent you the money, but you never asked me for help.",
          "tr": "Sana o parayı ödünç verirdim ama benden hiç yardım istemedin.",
          "note": "Gerçekleşmemiş geçmiş niyet ('would have lent ... but ...')."
        }
      ],
      "keyRules": [
        "Tüm Past Modal yapılarında 'have' yardımcı fiili sabittir (asla 'has' veya 'had' olmaz) ve hemen arkasından fiilin 3. hâli (V3) gelir.",
        "Geçmişe ait kesin kanıt varsa: Olumlu çıkarım 'must have V3', olumsuz çıkarım 'can't/couldn't have V3' olur.",
        "Cümlede 'I'm not sure, perhaps, maybe, it's possible' gibi belirsizlik ifadeleri varsa 'may/might/could have V3' seçilir.",
        "Bir şeyi yapma fırsatı varken yapmadığımızı anlatırken ('... but I didn't') 'could have V3' kullanılır."
      ],
      "commonMistakes": [
        {
          "wrong": "He mustn't have heard the alarm clock this morning.",
          "right": "He can't (or couldn't) have heard the alarm clock this morning.",
          "explanation": "'Yapmış olamaz' anlamındaki olumsuz geçmiş çıkarım 'mustn't have V3' ile DEĞİL, 'can't / couldn't have V3' ile yapılır."
        },
        {
          "wrong": "She should has told the truth to the police officer.",
          "right": "She should have told the truth to the police officer.",
          "explanation": "Modal (should, must, could, might) sonrasında tekil öznelerde bile 'has' kullanılmaz; daima yalın 'have + V3' gelir."
        },
        {
          "wrong": "You should studied more before taking the driving test.",
          "right": "You should have studied more before taking the driving test.",
          "explanation": "Modal'dan sonra doğrudan V2 ('should studied') gelemez; araya mutlaka 'have' girmelidir ('should have studied')."
        },
        {
          "wrong": "I must have left my keys at the office, ___? (Question) / Do you think he must have gone?",
          "right": "Could he have left his keys at the office?",
          "explanation": "Geçmiş çıkarım sorularında 'Must he have...?' yerine 'Could he have...?' veya 'Can he have...?' kullanılır."
        }
      ],
      "examTips": [
        "Önce zamanı tespit edin: Olay geçmişteyse ('yesterday, last night, when I called, V2') şıklardaki yalın modalları ('must V1, should V1, can't V1') hemen eleyin ve 'Modal + have + V3' şıklarına odaklanın.",
        "Cümlede hata, pişmanlık veya sitem varsa ('unfortunately, it was a mistake, it's your fault') → 'should / shouldn't have V3' işaretleyin.",
        "Cümlede güçlü bir kanıt ve olumlu anlam varsa → 'must have V3'; 'impossible, no way, couldn't be true' gibi imkânsızlık kanıtı varsa → 'can't / couldn't have V3' seçin.",
        "'... ama yapmadım (... but I didn't)' anlamı varsa 'could have V3'; 'yapacaktım ama engel çıktı (... but I was busy)' anlamı varsa 'would have V3' doğru cevaptır."
      ]
    }
  },
  {
    "id": "b2-g04",
    "level": "B2",
    "order": 4,
    "title": "Third Conditional & Mixed Conditionals",
    "description": "Geçmişteki gerçek dışı koşullar (Type 3) ile geçmiş ve şimdiki zamanı birleştiren karma koşul cümleleri (Mixed Conditionals).",
    "status": "ready",
    "content": {
      "intro": "B2 seviyesinin ve ileri düzey İngilizce sınavlarının (YDS, YÖKDİL, IELTS, TOEFL, Hazırlık Atlama) en ayırt edici konularından biri Third Conditional (3. Tip Koşul) ve Mixed Conditionals (Karma Koşul Cümleleri) yapısıdır. Bu yapılar gerçekleşmemiş geçmiş durumları, pişmanlıkları ve geçmişteki bir olayın bugüne uzanan hayali sonuçlarını ifade eder.",
      "sections": [
        {
          "heading": "1. Third Conditional (Type 3) Nedir?",
          "body": "Hem koşulun (If clause) hem de sonucun (Main clause) tamamen GEÇMİŞTE kaldığı, artık değiştirilemeyecek hayali durumları anlatır. Genellikle pişmanlık, eleştiri veya rahatlama bildirir.\n• Koşul Cümlesi (If Clause): Past Perfect (had + V3)\n• Sonuç Cümlesi (Main Clause): would / could / might + have + V3\nGerçekte olanın tam tersini düşünürüz: \"Erken çıksaydım treni yakalardım\" (Ama erken çıkmadım ve treni kaçırdım)."
        },
        {
          "heading": "2. Mixed Conditional — Tür 1: Geçmiş Koşul → Şimdiki Sonuç (Type 3 + Type 2)",
          "body": "En sık kullanılan karma koşul türüdür. Geçmişte gerçekleşmiş (veya gerçekleşmemiş) bir olayın ŞU ANKİ (bugünkü) sonucunu anlatır.\n• If Clause (Geçmiş Koşul — Type 3): If + Subject + had + V3\n• Main Clause (Şimdiki Sonuç — Type 2): Subject + would / could / might + V1 (veya be + V-ing)\nİpucu: Sonuç cümlesinde \"now, today, at the moment, right now, currently\" gibi şimdiki zaman zarfları yer alır!\nÖrnek: \"If I had accepted that job offer last year, I would be living in Berlin now.\" (Geçen yıl o iş teklifini kabul etseydim, şu anda Berlin’de yaşıyor olurdum.)"
        },
        {
          "heading": "3. Mixed Conditional — Tür 2: Şimdiki/Genel Koşul → Geçmiş Sonuç (Type 2 + Type 3)",
          "body": "Kişinin genel bir özelliği, karakteri veya şu anki kalıcı durumu farklı olsaydı, geçmişte bir olayın farklı sonuçlanacağını anlatır.\n• If Clause (Genel/Şimdiki Durum — Type 2): If + Subject + V2 (were / knew / had vb.)\n• Main Clause (Geçmiş Sonuç — Type 3): Subject + would / could / might + have + V3\nÖrnek: \"If I were more careful, I wouldn’t have made that mistake yesterday.\" (Daha dikkatli biri olsaydım [genel özelliğim], dün o hatayı yapmazdım [geçmiş sonuç].)"
        },
        {
          "heading": "4. Would Have / Could Have / Might Have Farkı",
          "body": "• would have + V3: Koşul sağlansaydı kesin gözüyle bakılan hayali sonuç (\"...yapardım\").\n• could have + V3: Koşul sağlansaydı ortaya çıkacak yetenek veya fırsat (\"...yapabilirdim\").\n• might have + V3: Koşul sağlansaydı gerçekleşmesi muhtemel ama kesin olmayan sonuç (\"...yapabilirdim / belki olurdu\")."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Özetle; hem koşul hem de sonuç geçmişte kalmışsa Third Conditional (If + had V3, would/could/might have V3) kullanılır. Geçmişteki bir olayın şu anki sonucunu vurgularken Mixed Tür 1 (If + had V3, would V1 + now/today); genel veya kalıcı bir durumun geçmişteki bir olaya etkisini anlatırken ise Mixed Tür 2 (If + V2/were, would have V3 + yesterday/last...) tercih edilir. 'If' cümleciği içinde asla 'would' veya 'would have' yer almaz."
        }
      ],
      "formulas": [
        {
          "label": "Third Conditional (Geçmiş → Geçmiş)",
          "pattern": "If + Subject + had (not) + V3, Subject + would / could / might (not) + have + V3",
          "note": "Her iki taraf da geçmiştedir. (yesterday, last week, in 2010)"
        },
        {
          "label": "Mixed Tür 1 (Geçmiş Koşul → Şimdiki Sonuç)",
          "pattern": "If + Subject + had (not) + V3, Subject + would / could + V1 (now / today)",
          "note": "Type 3 (If) + Type 2 (Main). Sonuç cümlesinde \"now / today\" bulunur."
        },
        {
          "label": "Mixed Tür 2 (Genel Durum → Geçmiş Sonuç)",
          "pattern": "If + Subject + V2 (were / knew), Subject + would / could + have + V3 (yesterday)",
          "note": "Type 2 (If) + Type 3 (Main). Genel bir durumun geçmişteki etkisini anlatır."
        }
      ],
      "examples": [
        {
          "en": "If you had told me about the problem, I would have helped you.",
          "tr": "Bana sorundan bahsetmiş olsaydın, sana yardım ederdim.",
          "note": "Saf Third Conditional: Geçmişte bahsetmedin, ben de geçmişte yardım edemedim."
        },
        {
          "en": "If she hadn’t missed the flight, she would be in Rome right now.",
          "tr": "Uçağı kaçırmamış olsaydı, şu anda Roma’da olurdu.",
          "note": "Mixed Conditional (Type 3 + Type 2): Uçağı geçmişte kaçırdı, sonucu şu anda (\"right now\") yaşanıyor."
        },
        {
          "en": "If I spoke German fluently, I would have applied for the position in Munich last month.",
          "tr": "Akıcı Almanca konuşabilseydim (genel durumum), geçen ay Münih’teki pozisyona başvururdum (geçmiş sonuç).",
          "note": "Mixed Conditional (Type 2 + Type 3): Almanca bilmemek genel durum, başvuru ise geçen ay."
        },
        {
          "en": "We could have won the match if our best player hadn’t been injured.",
          "tr": "En iyi oyuncumuz sakatlanmamış olsaydı maçı kazanabilirdik.",
          "note": "Sonuç cümlesi başta, \"if\" cümlesi sonda (bu durumda virgül kullanılmaz)."
        },
        {
          "en": "Had I known you were in hospital, I would have visited you immediately.",
          "tr": "Hastanede olduğunu bilseydim, seni derhâl ziyaret ederdim.",
          "note": "İleri düzey ipucu: \"If I had known\" yerine \"If\" atılarak \"Had I known\" (devrik yapı) kullanılabilir."
        },
        {
          "en": "But for the lifeguard's quick intervention, the swimmer would have drowned in the strong current.",
          "tr": "Cankurtaranın hızlı müdahalesi olmasaydı, yüzücü güçlü akıntıda boğulurdu.",
          "note": "'But for + isim' (... olmasaydı), 'If it hadn't been for...' anlamında Third Conditional sonuç cümlesiyle kullanılır."
        },
        {
          "en": "If Sinan hadn't squandered his inheritance five years ago, he wouldn't be struggling with debt today.",
          "tr": "Sinan beş yıl önce mirasını çarçur etmemiş olsaydı, bugün borçlarla boğuşuyor olmazdı.",
          "note": "Mixed Conditional (Type 3 → Type 2): Geçmişteki eylemin ('five years ago') bugünkü devam eden sonucu ('today')."
        },
        {
          "en": "If she weren't such a trustworthy colleague, the board wouldn't have appointed her as the interim director last week.",
          "tr": "Bu kadar güvenilir bir iş arkadaşı olmasaydı (genel karakteri), yönetim kurulu geçen hafta onu geçici direktör olarak atamazdı (geçmiş sonuç).",
          "note": "Mixed Conditional (Type 2 → Type 3): Kalıcı bir özelliğin geçmişteki bir karara etkisi."
        }
      ],
      "keyRules": [
        "Altın Kural: \"If\" bağlı cümleciğin (If-clause) kendi içinde KESİNLİKLE \"would\", \"would have\" veya \"will\" kullanılmaz! (\"If I would have known\" YANLIŞTIR; \"If I had known\" DOĞRUDUR).",
        "Sonuç cümlesinin sonunda \"now, right now, today, currently, still\" gibi şimdiki zaman zarfı varsa sonuç kısmı \"would have V3\" DEĞİL, \"would + V1 / would be V-ing\" (Mixed Type 3 → 2) olmalıdır.",
        "\"But for + isim\" veya \"Without + isim\" (... olmasaydı) yapıları da Third Conditional sonuç cümlesiyle çok sık kullanılır: \"But for your help, I would have failed.\"",
        "\"Unless\" (eğer ...-mezse) gerçek dışı geçmiş (Type 3) cümlelerde nadiren kullanılır; bunun yerine \"If ... hadn’t V3\" tercih edilir."
      ],
      "commonMistakes": [
        {
          "wrong": "If I would have studied harder, I would have passed the exam.",
          "right": "If I had studied harder, I would have passed the exam.",
          "explanation": "\"If\" cümleciği içinde \"would have V3\" kullanılmaz. If tarafında her zaman Past Perfect (had + V3) yer alır."
        },
        {
          "wrong": "If we had saved more money last year, we would have been on holiday now.",
          "right": "If we had saved more money last year, we would be on holiday now.",
          "explanation": "Sonuç cümlesinde \"now\" (şu anda) bulunduğu için sonuç bugüne aittir; \"would have been\" yerine Type 2 sonucu olan \"would be\" kullanılmalıdır."
        },
        {
          "wrong": "If she wasn’t afraid of flying, she would have come with us to Paris last summer.",
          "right": "If she weren’t (wasn’t) afraid of flying, she would have come with us... (Doğru Karma Yapı)",
          "explanation": "Dikkat: Uçaktan korkmamak genel bir özelliktir (Type 2: weren’t), geçen yaz Paris’e gelmek ise geçmiş sonuçtur (Type 3: would have come). Burada her iki tarafı da had V3 yapmak anlamı bozabilir."
        },
        {
          "wrong": "If they had left earlier, they wouldn’t missed the bus.",
          "right": "If they had left earlier, they wouldn’t have missed the bus.",
          "explanation": "Modal (wouldn’t / couldn’t / might not) sonrasında geçmiş anlam için \"have + V3\" (wouldn’t have missed) eksiksiz yazılmalıdır."
        }
      ],
      "examTips": [
        "Soruda ilk iş olarak zaman zarflarını daire içine alın: İki tarafta da geçmiş varsa Type 3 (had V3 / would have V3); If tarafında geçmiş (\"last night\"), ana cümlede şimdiki zaman (\"now / today\") varsa Mixed Conditional (had V3 / would V1) seçin!",
        "\"If\" kelimesinin bulunduğu boşlukta \"would / could / will / would have\" içeren tüm şıkları okumadan eleyin.",
        "Cümle başında \"Had + Subject + V3...\" görürseniz bunun \"If + Subject + had + V3\" devrik yapısı olduğunu hatırlayın ve ana cümlede \"would/could/might have + V3\" (veya \"now\" varsa \"would + V1\") arayın.",
        "If tarafında genel bir durum (\"If I were you\", \"If he knew the truth\", \"If she were more organized\") ve ana cümlede \"yesterday / last week\" varsa ikinci boşlukta \"would have + V3\" işaretleyin."
      ]
    }
  },
  {
    "id": "b2-g05",
    "level": "B2",
    "order": 5,
    "title": "Advanced Passive Voice & Causatives",
    "description": "İleri düzey edilgen yapılar (It is said that / He is known to...) ve ettirgen çatı (have/get something done).",
    "status": "ready",
    "content": {
      "intro": "B1 seviyesinde öğrendiğimiz temel Passive Voice (be + V3) kuralları, B2 seviyesinde akademik ve haber dilinin vazgeçilmezi olan Kişisiz Edilgen Yapılar (Impersonal Passive: 'It is said that...' / 'He is believed to...'), Gerund/Infinitive Passive ('being V3' / 'to be V3') ve bir işi başkasına yaptırmayı anlatan Ettirgen Çatı (Causatives: 'have/get something done', 'have someone do', 'make someone do') ile derinleşir.",
      "sections": [
        {
          "heading": "1. İleri Düzey Raporlama Edilgeni (It is said that... / Subject is said to...)",
          "body": "'think, believe, say, report, know, expect, allege, claim, consider, estimate' gibi fiillerle halk arasındaki veya medyadaki genel kanıyı aktarırken iki farklı Passive kalıbı kullanılır:\n1) It + be + V3 + that + Cümle:\n   'It is believed that the company is losing money.' / 'It is thought that the thief escaped abroad.'\n2) Özne + be + V3 + to V1 (veya geçmiş eylemse: to have V3):\n   • Yan cümledeki eylem ana fiille AYNI ZAMANDA (Present veya Future) ise → 'to + V1' (veya 'to be V-ing'):\n     'The company is believed to be losing money.' / 'She is known to speak five languages.'\n   • Yan cümledeki eylem ana fiilden DAHA ÖNCE (Past / Perfect) gerçekleşmişse → 'to have + V3':\n     'The thief is thought to have escaped abroad last night.' (Hırsızın dün gece yurt dışına kaçtığı düşünülüyor.)"
        },
        {
          "heading": "2. Ettirgen Çatı (Causatives) — Nesne Odaklı: Have / Get Something Done",
          "body": "Bir işi kendimiz yapmayıp bir uzmana veya başkasına (ücretle ya da rica ile) yaptırdığımızda kullanılır:\n• have + something (nesne) + V3 (past participle):\n  'I had my car serviced yesterday.' (Dün arabamın bakımını yaptırdım.)\n  'She is having her hair cut right now.' (Şu anda saçını kestiriyor.)\n• get + something (nesne) + V3:\n  'Have something done' ile aynı anlamdadır; günlük dilde biraz daha yaygındır:\n  'We need to get the air conditioner repaired before summer.' (Yazdan önce klimayı tamir ettirmemiz gerekiyor.)\nNot: 'Have something V3' bazen kişinin başına istemeden gelen talihsiz olayları da anlatır: 'He had his wallet stolen on the bus.' (Otobüste cüzdanını çaldırdı.)"
        },
        {
          "heading": "3. Ettirgen Çatı (Causatives) — Kişi Odaklı: Have / Get / Make / Let Someone Do",
          "body": "İşi kime yaptırdığımızı (kişiyi) belirttiğimizde kullanılan fiile göre arkadan gelen fiilin yapısı değişir (Sınavlarda en çok bu fark sorulur!):\n• have + someone (kişi) + V1 (yalın fiil — 'to' ALMAZ): Birine görev/sorumluluk vererek iş yaptırmak.\n  'The manager had his assistant prepare the slides.' (Müdür asistanına slaytları hazırlattı.)\n• get + someone (kişi) + TO + V1 ('to' ALIR): Birini ikna ederek iş yaptırmak.\n  'I finally got my brother to lend me his bicycle.' (Sonunda kardeşimi bisikletini bana ödünç vermeye ikna ettim.)\n• make + someone (kişi) + V1 (yalın fiil — 'to' ALMAZ): Birini zorlamak / mecbur bırakmak.\n  'The teacher made the students rewrite the essay.' (Öğretmen öğrencilere kompozisyonu yeniden yazdırdı.)\n  ⚠️ ÇOK ÖNEMLİ: 'Make' fiili PASSIVE (edilgen) yapıldığında ('be made') arkasına 'TO + V1' alır!\n  'The students were made TO rewrite the essay.' (Öğrenciler kompozisyonu yeniden yazmaya mecbur bırakıldı.)\n• let + someone + V1 (izin vermek) → Passive hali: 'be allowed to + V1'."
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar (Passive Gerund & Infinitive)",
          "body": "• Passive Infinitive (to be + V3 / to have been + V3): 'expect, want, hope, need, seem, appear, would like' gibi fiillerden sonra özne eylemden etkileniyorsa 'to be V3' kullanılır:\n  'She hopes to be promoted next month.' (Gelecek ay terfi ettirilmeyi umuyor.)\n  'The manuscript appears to have been written in the 15th century.' (El yazması 15. yüzyılda yazılmış gibi görünüyor.)\n• Passive Gerund (being + V3 / having been + V3): Edatlardan (of, about, without, instead of) veya '-ing' alan fiillerden (hate, enjoy, avoid, remember, appreciate, mind) sonra edilgen anlamda 'being + V3' kullanılır:\n  'Nobody likes being criticized in public.' (Kimse toplum içinde eleştirilmekten hoşlanmaz.)\n• 'Need + V-ing' = 'Need + to be + V3': Cansız öznelerle 'The floorboards need polishing' = 'The floorboards need to be polished' (Yer tahtalarının cilalanması gerekiyor)."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Özetle; raporlama edilgeninde eş zamanlı eylemler 'is said to V1', geçmiş eylemler 'is said to have V3' alır. Ettirgen çatıda nesne varsa 'have/get + nesne + V3'; kişi varsa 'have + kişi + V1', 'make + kişi + V1' (ancak passive ise 'be made to V1') ve 'get + kişi + to V1' kuralları geçerlidir."
        }
      ],
      "formulas": [
        {
          "label": "Raporlama Edilgeni (Impersonal Passive)",
          "pattern": "Subject + is/are + said/believed/known + to V1 (Genel/Şimdi)\nSubject + is/are + said/believed/known + to have V3 (Geçmiş)",
          "note": "Örn: He is known to be rich. / He is known to have left yesterday."
        },
        {
          "label": "Causative — Nesne ile (İş Yaptırma)",
          "pattern": "have / get + Object (Nesne) + V3",
          "note": "Örn: I had / got my watch repaired."
        },
        {
          "label": "Causative — Kişi ile (Etken)",
          "pattern": "have + Person + V1\nmake + Person + V1\nget + Person + TO V1",
          "note": "Sadece 'get + kişi' yapısında 'to' kullanılır!"
        },
        {
          "label": "Make Passive & Passive Gerund/Infinitive",
          "pattern": "be made + TO V1\nto be + V3 (Infinitive) / being + V3 (Gerund)",
          "note": "Örn: He was made to apologize. / She hates being ignored."
        }
      ],
      "examples": [
        {
          "en": "The ancient temple is believed to have been built more than three thousand years ago.",
          "tr": "Antik tapınağın üç bin yıldan daha uzun bir süre önce inşa edildiğine inanılıyor.",
          "note": "Raporlama edilgeni + geçmiş edilgen: 'is believed' + 'to have been built'."
        },
        {
          "en": "We are having our kitchen repainted by a professional decorator this week.",
          "tr": "Bu hafta mutfağımızı profesyonel bir dekoratöre yeniden boyatıyoruz.",
          "note": "'have + something (our kitchen) + V3 (repainted)' Present Continuous çekimi."
        },
        {
          "en": "The supervisor had the technician check all the security cameras in the building.",
          "tr": "Denetçi, teknisyene binadaki tüm güvenlik kameralarını kontrol ettirdi.",
          "note": "'have + kişi (the technician) + V1 (check)'."
        },
        {
          "en": "I finally got my stubborn friend to see a dentist about his toothache.",
          "tr": "Sonunda inatçı arkadaşımı diş ağrısı için bir diş hekimine görünmeye ikna ettim.",
          "note": "'get + kişi (my friend) + to V1 (to see)'."
        },
        {
          "en": "The passengers were made to wait at the terminal for five hours due to the fog.",
          "tr": "Yolcular sis nedeniyle terminalde beş saat bekletildi (beklemeye mecbur bırakıldı).",
          "note": "'Make' edilgen olduğunda ('were made') arkasına 'to + V1' ('to wait') alır."
        },
        {
          "en": "Famous actors often complain about being followed by paparazzi everywhere they go.",
          "tr": "Ünlü oyuncular sık sık gittikleri her yerde paparazziler tarafından takip edilmekten şikâyet ederler.",
          "note": "Edat ('about') sonrası Passive Gerund ('being followed')."
        },
        {
          "en": "All applications must be submitted online before the deadline; late entries won't be accepted.",
          "tr": "Tüm başvurular son tarihten önce çevrim içi olarak teslim edilmelidir; geç başvurular kabul edilmeyecektir.",
          "note": "Modal Passive ('must be submitted' / 'won't be accepted')."
        },
        {
          "en": "The suspect is reported to be hiding in a coastal town under a false identity.",
          "tr": "Şüphelinin sahte bir kimlikle bir sahil kasabasında saklanmakta olduğu bildiriliyor.",
          "note": "Şu anda devam eden eylem için raporlama edilgeni ('is reported to be hiding')."
        }
      ],
      "keyRules": [
        "'Have/get + cansız nesne' geliyorsa arkadaki fiil her zaman V3 olur ('have my suit cleaned', 'get the roof fixed').",
        "'Have + kişi' ve 'Make + kişi' yapılarında fiil YALIN (V1) gelir; 'Get + kişi' yapısında ise 'TO + V1' gelir.",
        "'Make' fiili edilgen (was/were made) olduğunda yalın kuralı bozulur ve mutlaka 'TO + V1' alır ('He was made to pay').",
        "'is said / thought / believed / known' sonrasında olay geçmişte kalmışsa 'to have V3' (edilgense 'to have been V3'); genel veya şimdiki zamandaysa 'to V1' kullanılır."
      ],
      "commonMistakes": [
        {
          "wrong": "I had the mechanic repaired my brakes yesterday.",
          "right": "I had the mechanic repair my brakes yesterday. (veya: I had my brakes repaired.)",
          "explanation": "'Have + kişi (the mechanic)' kullanıldığında fiil V3 değil, yalın (V1: repair) olmalıdır. Nesne önde olsaydı ('had my brakes repaired') V3 olurdu."
        },
        {
          "wrong": "She got her younger brother clean the garage.",
          "right": "She got her younger brother to clean the garage.",
          "explanation": "'Get + kişi' kalıbında fiilden önce mutlaka 'to' gelmelidir ('got him to clean')."
        },
        {
          "wrong": "The employees were made sign the confidentiality agreement.",
          "right": "The employees were made to sign the confidentiality agreement.",
          "explanation": "Etken cümlede 'made them sign' doğrudur; ancak edilgen (were made) olduğunda 'to sign' kullanılması zorunludur."
        },
        {
          "wrong": "The painting is believed to steal from the gallery in 1998.",
          "right": "The painting is believed to have been stolen from the gallery in 1998.",
          "explanation": "1998 geçmiş zamandır ('to have V3') ve tablo kendi kendine çalmayıp çalındığı için edilgen ('to have been stolen') olmalıdır."
        }
      ],
      "examTips": [
        "Causative sorularında ilk iş boşluktan önceki kelimeye bakın: Cansız bir nesne mi ('the car, his hair, the roof') yoksa bir insan mı ('the plumber, her secretary, me')? Nesne ise V3 işaretleyin!",
        "Boşluktan önce insan varsa şu üçlüyü hatırlayın: 'have someone DO', 'make someone DO', 'get someone TO DO'.",
        "Boşluktan önce 'was/were made' görürseniz gözünüz kapalı 'to + V1' şıkkını seçin.",
        "'is said / believed / reported / thought' sorularında cümlenin sonundaki zaman zarfına bakın: 'yesterday, in 1990, last week, ago' varsa şıklarda 'to have V3' (veya 'to have been V3') arayın."
      ]
    }
  },
  {
    "id": "b2-g06",
    "level": "B2",
    "order": 6,
    "title": "Advanced Reported Speech",
    "description": "Özel aktarma fiilleri (advise, warn, accuse of, deny, suggest, insist on) ile ileri düzey dolaylı anlatım.",
    "status": "ready",
    "content": {
      "intro": "B1 seviyesinde dolaylı anlatımda 'say, tell, ask' fiilleri ve zaman kayması (backshift) kuralları öğrenilir. B2 seviyesinde ise konuşmacının niyetini (uyarı, öğüt, suçlama, inkâr, öneri, söz verme, özür dileme) doğrudan tek bir fiille özetleyen Özel Aktarma Fiilleri (Reporting Verbs) ve bu fiillerin zorunlu kıldığı dil bilgisi kalıpları (to V1, someone to V1, V-ing, Preposition + V-ing) incelenir.",
      "sections": [
        {
          "heading": "1. Temel Kurallar ve Kullanım Alanları: Infinitive (to + V1) Alan Aktarma Fiilleri",
          "body": "Bu fiiller iki alt gruba ayrılır:\n1) Verb + (not) to + V1 (Kişi zamiri ALMADAN doğrudan 'to V1' alanlar):\n   • agree, offer, promise, refuse, threaten, claim, demand, decide\n   Örn: 'I'll help you.' → 'He offered to help me.' (Bana yardım etmeyi teklif etti.)\n   Örn: 'I won't sign it.' → 'She refused to sign it.' (İmzalamayı reddetti.)\n2) Verb + Object (Kişi) + (not) to + V1 (Araya mutlaka kişi/nesne zamiri alanlar):\n   • advise, warn, remind, invite, encourage, persuade, order, beg, forbid, urge, tell, ask\n   Örn: 'Don't touch the wire!' → 'He warned us not to touch the wire.' (Bizi kabloya dokunmamamız konusunda uyardı.)\n   Örn: 'You should see a doctor.' → 'She advised me to see a doctor.' (Bana doktora görünmemi tavsiye etti.)"
        },
        {
          "heading": "2. Gerund (V-ing) ve Edat (Preposition + V-ing) Alan Aktarma Fiilleri",
          "body": "1) Verb + V-ing (Doğrudan '-ing' alanlar):\n   • admit, deny, suggest, recommend, regret, mention\n   Örn: 'I didn't break the vase.' → 'He denied breaking (or having broken) the vase.' (Vazoyu kırdığını inkâr etti.)\n   Örn: 'Let's go for a walk.' → 'She suggested going for a walk.' (Yürüyüşe çıkmayı önerdi.)\n2) Verb + Preposition + (not) V-ing (Edatla kullanılanlar):\n   • apologize (to sb) FOR + V-ing (bir şey için özür dilemek)\n   • insist ON + V-ing (bir şeyde ısrar etmek)\n   • complain (to sb) ABOUT + V-ing (bir şeyden şikâyet etmek)\n   • confess TO + V-ing (bir şeyi itiraf etmek — 'to' burada edattır!)\n   • object TO + V-ing (bir şeye itiraz etmek)\n3) Verb + Object (Kişi) + Preposition + V-ing:\n   • accuse sb OF + V-ing (birini bir şeyle suçlamak)\n   • blame sb FOR + V-ing (birini bir şeyden dolayı suçlamak)\n   • congratulate sb ON + V-ing (birini tebrik etmek)\n   • thank sb FOR + V-ing (birine teşekkür etmek)\n   • discourage / prevent sb FROM + V-ing (birini caydırmak / engellemek)"
        },
        {
          "heading": "3. Kullanım Farkları ve Karşılaştırmalar: 'Suggest' ve 'Recommend' Tuzağı!",
          "body": "B2 sınavlarında öğrencilerin en çok hata yaptığı iki fiil 'suggest' ve 'recommend'dir:\n⚠️ KURAL: 'Suggest' ve 'recommend' fiilleri KESİNLİKLE 'suggest someone to do' veya 'suggest to do' şeklinde KULLANILAMAZ!\nDoğru Kullanım Kalıpları:\n1) suggest / recommend + V-ing:\n   'The doctor suggested exercising regularly.' (Doğru)\n2) suggest / recommend + that + Subject + (should) + V1 (Subjunctive — yalın fiil!):\n   'The doctor suggested that he (should) exercise regularly.' (Tekil özne 'he' olsa bile 'exercise' yalın kalabilir veya 'should exercise' olur!)\n   ❌ YANLIŞ: 'The doctor suggested him to exercise.' / 'She suggested to go.'"
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar",
          "body": "• Zaman Kayması Olmayan Durumlar (No Backshift):\n  1) Aktarma fiili şimdiki/geniş zamandaysa ('He says / has said that...'): İçerideki zaman değişmez.\n  2) Evrensel doğrular ve bilimsel gerçekler aktarılırken: 'The teacher explained that the Earth revolves around the Sun.'\n  3) Type 2 ve Type 3 Koşul Cümleleri ile 'wish / would rather / it's time' yapıları aktarılırken fiil derecesi daha fazla geçmişe kaymaz:\n     Direct: 'If I had more time, I would learn Italian.' → Reported: 'She said that if she had more time, she would learn Italian.'\n• 'Explain' ve 'Describe' Kuralı: Bu fiillerden sonra kişi zamiri doğrudan gelemez, araya 'to' girer: 'He explained the rule TO me' ('He explained me the rule' YANLIŞTIR)."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Özetle; 'offer, refuse, promise, agree' doğrudan 'to V1'; 'advise, warn, remind, persuade' ise 'kişi + to V1' alır. 'Admit, deny, suggest' sonrasında 'V-ing' (veya 'that + cümle'); 'accuse sb of, apologize for, insist on, blame sb for, confess to' sonrasında ise her zaman 'V-ing' kullanılır."
        }
      ],
      "formulas": [
        {
          "label": "Verb + to V1 / Verb + Person + to V1",
          "pattern": "offer / refuse / promise / agree / threaten + (not) to V1\nadvise / warn / remind / persuade / encourage + sb + (not) to V1",
          "note": "Örn: She promised to call. / He warned me not to be late."
        },
        {
          "label": "Verb + V-ing (Gerund)",
          "pattern": "admit / deny / suggest / recommend / regret + (not) V-ing (or having V3)",
          "note": "DİKKAT: 'suggest to V1' veya 'suggest sb to V1' YOKTUR!"
        },
        {
          "label": "Verb (+ Person) + Preposition + V-ing",
          "pattern": "insist on / apologize for / confess to + V-ing\naccuse sb of / blame sb for / congratulate sb on + V-ing",
          "note": "Örn: They accused him of stealing the data."
        },
        {
          "label": "Suggest / Recommend / Insist + That Clause",
          "pattern": "suggest / recommend / demand / insist + that + Subject + (should) + V1",
          "note": "Örn: She insisted that he apologize immediately."
        }
      ],
      "examples": [
        {
          "en": "The lifeguard warned the tourists not to swim beyond the red buoys.",
          "tr": "Cankurtaran, turistleri kırmızı şamandıraların ötesinde yüzmemeleri konusunda uyardı.",
          "note": "'warn + kişi (the tourists) + not to V1 (not to swim)'."
        },
        {
          "en": "The suspect strongly denied having any connection with the cyberattack.",
          "tr": "Şüpheli, siber saldırıyla herhangi bir bağlantısı olduğunu kesin bir dille inkâr etti.",
          "note": "'deny + V-ing' kalıbı."
        },
        {
          "en": "My colleague suggested taking the metro instead of driving in rush-hour traffic.",
          "tr": "İş arkadaşım yoğun saat trafiğinde araba sürmek yerine metroya binmeyi önerdi.",
          "note": "'suggest + V-ing' ('suggested to take' OLMAZ)."
        },
        {
          "en": "The auditor accused the chief accountant of falsifying the annual tax returns.",
          "tr": "Denetçi, başmuhasebeciyi yıllık vergi beyannamelerinde sahtecilik yapmakla suçladı.",
          "note": "'accuse + kişi + OF + V-ing' kalıbı."
        },
        {
          "en": "Despite the heavy rain, Kerem insisted on walking home without an umbrella.",
          "tr": "Şiddetli yağmura rağmen Kerem şemsiyesiz eve yürümekte ısrar etti.",
          "note": "'insist ON + V-ing' kalıbı."
        },
        {
          "en": "She apologized to her team for missing the morning deadline.",
          "tr": "Sabahki son teslim süresini kaçırdığı için ekibinden özür diledi.",
          "note": "'apologize (to sb) FOR + V-ing'."
        },
        {
          "en": "The committee recommended that the historic building be restored immediately.",
          "tr": "Komite, tarihi binanın derhâl restore edilmesini tavsiye etti.",
          "note": "'recommend that + Subject + (should) be V3' (Subjunctive)."
        },
        {
          "en": "My brother reminded me to lock the back door before leaving the house.",
          "tr": "Kardeşim evden çıkmadan önce arka kapıyı kilitlememi bana hatırlattı.",
          "note": "'remind + kişi (me) + to V1 (to lock)'."
        }
      ],
      "keyRules": [
        "'Suggest' ve 'recommend' fiillerinden sonra ASLA 'kişi + to V1' (örn. 'suggested me to go') gelmez; ya doğrudan 'V-ing' ya da 'that + özne + (should) V1' gelir.",
        "Bir edatla biten tüm aktarma kalıplarından ('accuse of, insist on, apologize for, blame for, congratulate on, confess to, object to') sonra gelen fiil mutlaka '-ing' (Gerund) alır.",
        "Olumsuz aktarımda 'not' kelimesi 'to' veya 'V-ing' yapısının HEMEN ÖNÜNE gelir: 'warned me NOT to go', 'apologized for NOT calling'.",
        "'Confess to' ve 'object to' kalıplarındaki 'to' mastar eki değil, yönelme edatıdır; bu yüzden arkalarından V1 değil, 'V-ing' gelir ('confessed to stealing')."
      ],
      "commonMistakes": [
        {
          "wrong": "Sude suggested us to try the new Italian restaurant downtown.",
          "right": "Sude suggested trying (or: suggested that we try) the new Italian restaurant downtown.",
          "explanation": "'Suggest' fiili 'someone to do' kalıbıyla kullanılamaz; 'suggest + V-ing' veya 'suggest that + özne + V1' kullanılmalıdır."
        },
        {
          "wrong": "He refused helping us with the project.",
          "right": "He refused to help us with the project.",
          "explanation": "'Refuse' (reddetmek) fiili '-ing' almaz; daima 'to + V1' ('refused to help') alır."
        },
        {
          "wrong": "The manager accused the intern for leaking the password.",
          "right": "The manager accused the intern of leaking the password.",
          "explanation": "'Accuse' fiilinin edatı 'for' değil, 'of'tur ('accuse someone OF doing something'). 'For' edatı 'blame' ile kullanılır ('blame sb for')."
        },
        {
          "wrong": "Can you explain me how this software works?",
          "right": "Can you explain to me how this software works?",
          "explanation": "'Explain' fiilinden sonra kişi zamiri kullanılacaksa önüne mutlaka 'to' gelmelidir ('explain to me')."
        }
      ],
      "examTips": [
        "Şıklarda 'suggested me to...', 'recommended him to...', 'explained me...' görürseniz saniyesinde eleyin; bu üçü sınavların en klasik çeldiricisidir!",
        "Boşluktan önce 'accused', 'insisted', 'apologized', 'congratulated', 'blamed', 'confessed' varsa doğru edatı (accuse OF, insist ON, apologize FOR, congratulate ON, blame FOR, confess TO) ve arkasından 'V-ing' yapısını arayın.",
        "'Suggest / recommend / insist / demand / propose + that + tekil özne (he/she/it)' sonrasında şıklarda yalın fiil (V1 / be V3) görürseniz şaşırmayın; bu yapı gizli 'should' (Subjunctive) yapısıdır ve 100% doğrudur!",
        "'Deny' ve 'admit' fiillerinden sonra hem 'V-ing' ('denied stealing') hem de 'having V3' ('denied having stolen') doğru kabul edilir; ancak 'to steal' yanlıştır."
      ]
    }
  },
  {
    "id": "b2-g07",
    "level": "B2",
    "order": 7,
    "title": "Non-defining Relative Clauses",
    "description": "Virgülle ayrılan, ek bilgi veren sıfat cümlecikleri ve tüm cümleyi niteleyen \"which\" yapıları.",
    "status": "ready",
    "content": {
      "intro": "B1 seviyesinde bir ismi tanımlamak ve diğerlerinden ayırt etmek için zorunlu bilgi veren Defining Relative Clauses öğrenilir. B2 seviyesinde ise zaten kim veya ne olduğu bilinen özneler (özel isimler, tek olan kavramlar) hakkında parantez içi EK BİLGİ veren, cümleden çıkarıldığında cümlenin temel anlamını bozmayan ve mutlaka VİRGÜLLE ayrılan Non-defining Relative Clauses ile tüm cümleyi niteleyen 'which' ve nicelik bildiren ('most of whom, both of which') yapılar ele alınır.",
      "sections": [
        {
          "heading": "1. Temel Kurallar ve Kullanım Alanları (Non-defining Relative Clauses)",
          "body": "Non-defining Relative Clause, zaten belirli olan bir isim ('Istanbul, Albert Einstein, my father, the Eiffel Tower') hakkında ekstra açıklama yapar ve ana cümleden VİRGÜLLERLE ayrılır:\n• İnsanlar için: who (özne/nesne), whom (nesne), whose (iyelik)\n  'Professor Demir, who teaches biochemistry, won an international award.'\n• Cansızlar ve hayvanlar için: which, whose\n  'The Grand Bazaar, which was built in the 15th century, attracts millions of tourists.'\n• Yer ve zaman için: where, when\n  'We spent three days in Prag, where my cousin lives.'"
        },
        {
          "heading": "2. Altın Yasaklar: 'That' Kullanılmaz ve Zamir Atılamaz!",
          "body": "Defining (virgülsüz) sıfat cümleciklerinin aksine, virgüllü Non-defining Relative Clause yapılarında İKİ KESİN YASAK vardır:\n1) VİRGÜLDEN SONRA 'THAT' KULLANILAMAZ!\n   'who' veya 'which' yerine asla 'that' yazılamaz:\n   Doğru: 'My laptop, which I bought last month, is very fast.'\n   ❌ YANLIŞ: 'My laptop, that I bought last month, is very fast.'\n2) RELATIVE PRONOUN (WHO / WHICH / WHOM) CÜMLEDEN ATILAMAZ (Omission Yoktur)!\n   Nesne konumunda olsa bile zamir mutlaka yazılmalıdır."
        },
        {
          "heading": "3. Kullanım Farkları ve Karşılaştırmalar: Tüm Cümleyi Niteleyen 'Which' (Sentential Relative)",
          "body": "B2 seviyesinin en önemli yapılarından biri, tek bir ismi değil, virgülden önceki TÜM CÜMLEYİ (veya durumu) niteleyen ', which' yapısıdır. Türkçeye '... ki bu durum ...' diye çevrilir ve devamında tekil fiil alır:\n• 'He passed the driving test on his first attempt, which surprised everyone.'\n  (Ehliyet sınavını ilk denemesinde geçti ki bu durum herkesi şaşırttı — Burada 'which' sınavı değil, sınavı ilk denemede geçmesi olayını niteler!)\n⚠️ DİKKAT: Tüm cümleyi nitelemek için virgülden sonra SADECE 'which' kullanılır; 'what' veya 'that' ASLA kullanılmaz!"
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar: Nicelik İfadeleri + Of Whom / Of Which / Of Whose",
          "body": "Bir grubun tamamını veya bir kısmını ('some of, many of, most of, both of, all of, neither of, none of, two of, half of, the majority of') açıklarken virgülden sonra şu kalıp kullanılır:\n• İnsanlar için: Quantifier + of + WHOM ('who' DEĞİL!)\n  'She has three brothers, all of whom are civil engineers.' (Üç erkek kardeşi var ki onların hepsi inşaat mühendisi.)\n• Cansızlar/Hayvanlar için: Quantifier + of + WHICH ('that' veya 'them' DEĞİL!)\n  'I read two novels on holiday, neither of which was very gripping.' (Tatilde iki roman okudum ki ikisi de pek sürükleyici değildi.)\n• İyelik için: Quantifier + of + WHOSE + İsim\n• Edatlı Yapılar (Preposition + whom/which): Virgülden sonra 'in which, at which, for which, with whom, without which' gibi edatlı yapılar sıklıkla kullanılır; edattan sonra asla 'who' veya 'that' gelmez."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Özetle; özel isimlerden veya bilinen isimlerden sonra gelen virgüllü sıfat cümleciklerinde 'that' kullanılmaz ve zamir atılmaz. Önceki tüm cümleyi niteleyen yapı ', which'tir. Nicelik ifadelerinden ('most of, both of, two of') sonra insanlarda 'whom', cansızlarda 'which' seçilir."
        }
      ],
      "formulas": [
        {
          "label": "Non-defining (Virgüllü Ek Bilgi)",
          "pattern": "Özel/Belirli İsim + , + who / whom / which / whose / where / when + ... + , + Ana Fiil",
          "note": "Virgülden sonra ASLA 'that' gelmez ve zamir düşmez!"
        },
        {
          "label": "Tüm Cümleyi Niteleyen 'Which'",
          "pattern": "Tam Cümle + , + which + Tekil Fiil (surprised / made / means / is...)",
          "note": "'... ki bu durum ...' anlamı verir. 'what' veya 'that' OLMAZ."
        },
        {
          "label": "Nicelik + Of Whom / Of Which",
          "pattern": "Tam Cümle + , + all / most / both / some / none / two + of + whom (İnsan) / which (Cansız)",
          "note": "DİKKAT: Virgülden sonra bağlaç yoksa 'both of them' DEĞİL, 'both of whom/which' olur!"
        },
        {
          "label": "Preposition + Whom / Which",
          "pattern": "İsim + , + in / on / at / for / with / without + which (Cansız) / whom (İnsan)",
          "note": "Edattan hemen sonra 'who' veya 'that' kesinlikle gelemez."
        }
      ],
      "examples": [
        {
          "en": "Ankara, which has been the capital of Turkey since 1923, is home to many prestigious universities.",
          "tr": "1923'ten beri Türkiye'nin başkenti olan Ankara, birçok prestijli üniversiteye ev sahipliği yapmaktadır.",
          "note": "'Ankara' özel isimdir; iki virgül arasında 'which' ile ek bilgi verilmiştir ('that' olmaz)."
        },
        {
          "en": "The flight was delayed for six hours due to heavy fog, which ruined all our connection plans.",
          "tr": "Uçuş yoğun sis nedeniyle altı saat rötar yaptı ki bu durum tüm aktarma planlarımızı mahvetti.",
          "note": "Önceki tüm cümleyi (uçuşun 6 saat rötar yapmasını) niteleyen ', which'."
        },
        {
          "en": "The company interviewed ten candidates yesterday, none of whom had sufficient experience.",
          "tr": "Şirket dün on adayla mülakat yaptı ki onların hiçbirinin yeterli deneyimi yoktu.",
          "note": "İnsanlar ('ten candidates') + 'none of whom' ('none of them' virgülden sonra bağlaçsız olmaz)."
        },
        {
          "en": "He lent me two history books, both of which were written by Professor İnalcık.",
          "tr": "Bana iki tarih kitabı ödünç verdi ki her ikisi de Profesör İnalcık tarafından yazılmıştı.",
          "note": "Cansız isim ('two history books') + 'both of which'."
        },
        {
          "en": "Ms. Kaya, whose daughter won the national piano competition, is our neighbor.",
          "tr": "Kızı ulusal piyano yarışmasını kazanan Kaya Hanım bizim komşumuzdur.",
          "note": "Virgüllü cümlede iyelik bağı: 'whose daughter'."
        },
        {
          "en": "We visited the coastal town of Side, where ancient Roman ruins stand beside sandy beaches.",
          "tr": "Antik Roma kalıntılarının kumsalların yanında yükseldiği sahil kasabası Side'yi ziyaret ettik.",
          "note": "Yer ismi + ', where + tam cümle (orada anlamında)'."
        },
        {
          "en": "The treaty, without which peace could not have been achieved, was signed in Geneva.",
          "tr": "Onsuz barışın sağlanamayacağı antlaşma Cenevre'de imzalandı.",
          "note": "Edat + which: 'without which' (onsuz)."
        },
        {
          "en": "My grandfather still remembers 1969, when astronauts walked on the Moon for the first time.",
          "tr": "Dedem astronotların Ay'da ilk kez yürüdüğü 1969 yılını hâlâ hatırlıyor.",
          "note": "Zaman ifadesi (1969) + ', when'."
        }
      ],
      "keyRules": [
        "Boşluktan hemen önce virgül (,) varsa şıklardaki 'that' seçeneğini okumadan eleyin!",
        "Virgülden sonra önceki eylemin tamamına yorum yapılıyorsa ('... , _____ made me angry / was a shame') doğru cevap her zaman 'which'tir ('what' çeldiricisine düşmeyin).",
        "İki cümle sadece virgülle ayrılmışsa ('ve' bağlacı yoksa), ikinci kısımda 'most of them / both of us' DEĞİL, cümleleri bağlayan 'most of whom / both of which' kullanılır.",
        "Bir yer isminden (örn. 'Paris, ...') sonra yer yönelmesi/bulunması ('orada') anlamı varsa 'where' (veya 'in which'); ancak boşluktan hemen sonra fiil geliyorsa ('Paris, _____ is famous for...') özne gerektiği için 'which' kullanılır!"
      ],
      "commonMistakes": [
        {
          "wrong": "İzmir, that is the third largest city in Turkey, has a mild climate.",
          "right": "İzmir, which is the third largest city in Turkey, has a mild climate.",
          "explanation": "Özel isimden ve virgülden sonra (Non-defining Relative Clause) asla 'that' kullanılamaz; 'which' kullanılmalıdır."
        },
        {
          "wrong": "She forgot to save the document before closing the laptop, what caused her to lose three hours of work.",
          "right": "She forgot to save the document before closing the laptop, which caused her to lose three hours of work.",
          "explanation": "Önceki tüm cümleyi nitelemek için virgülden sonra 'what' kullanılmaz; daima ', which' kullanılır."
        },
        {
          "wrong": "There are forty students in the auditorium, most of them are from the engineering faculty.",
          "right": "There are forty students in the auditorium, most of whom are from the engineering faculty.",
          "explanation": "Arada 'and' bağlacı olmadan iki cümleyi virgülle bağlarken 'most of them' (zamir) cümleleri bağlayamaz (comma splice hatası); bağlaç görevi gören 'most of whom' kullanılmalıdır."
        },
        {
          "wrong": "We stayed at the Grand Hotel, where was built in 1910.",
          "right": "We stayed at the Grand Hotel, which was built in 1910.",
          "explanation": "Otel bir yer ismi olsa bile boşluktan hemen sonra fiil ('was built') geldiği için özneye ihtiyaç vardır; 'where' özne olamaz, 'which' kullanılır."
        }
      ],
      "examTips": [
        "Sınavda boşluktan önce virgül (,) gördüğünüz an 'that' şıkkının üstünü çizin.",
        "Virgülden sonra 'many of _____, two of _____, all of _____, neither of _____' kalıbı varsa şıklarda sadece 'whom' (insansa) veya 'which' (cansızsa) arayın; 'them / who / that' şıklarını eleyin!",
        "Yer ismi + virgül + boşluk sorusunda boşluktan sonraki ilk kelimeye bakın: Fiil varsa ('is, was, has, attracts') → 'which'; Özne + Fiil varsa ('we stayed, he was born') → 'where' seçin.",
        "Boşluktan önce bir edat ('in, on, at, with, from, to, without, by') varsa şıklardaki 'who' ve 'that' elenir; sadece 'whom', 'which' veya 'whose + isim' kalır."
      ]
    }
  },
  {
    "id": "b2-g08",
    "level": "B2",
    "order": 8,
    "title": "Participle Clauses",
    "description": "Sıfat ve zarf cümleciklerinin V-ing, V3 ve Having + V3 ile kısaltılması (Reduced Clauses).",
    "status": "ready",
    "content": {
      "intro": "Participle Clauses (Ortaç Cümlecikleri / Kısaltmalar), İngilizcede hem sıfat cümleciklerini (Relative Clauses) hem de zaman/sebep/koşul bildiren zarf cümleciklerini (Adverbial Clauses) daha akıcı, özlü ve akademik bir dille ifade etmek için bağlaç ve özneyi atarak fiili 'V-ing' (Present Participle), 'V3' (Past Participle) veya 'Having + V3' (Perfect Participle) hâline getirme yöntemidir.",
      "sections": [
        {
          "heading": "1. Temel Kurallar: Sıfat Cümleciklerinin Kısaltılması (Reduced Relative Clauses)",
          "body": "Özne konumundaki 'who, which, that' atılarak sıfat cümleciği kısaltılır:\n1) Etken (Active) Kısaltma → V-ing:\n   İsmi niteleyen eylem etkense (özne işi kendisi yapıyorsa) fiil 'V-ing' olur:\n   'The woman who is talking to the director is my aunt.' → 'The woman talking to the director is my aunt.'\n   'Passengers who travel on this train must have a reservation.' → 'Passengers traveling on this train...'\n2) Edilgen (Passive) Kısaltma → V3 (veya devam ediyorsa: being V3):\n   İsmi niteleyen eylem edilgense 'who/which/that + be' atılır ve sadece 'V3' kalır:\n   'The cars which are produced in this factory are exported.' → 'The cars produced in this factory are exported.'\n3) 'To + V1' ( veya Edilgen: 'to be + V3') ile Kısaltma:\n   İsimden önce 'the first, the second, the last, the only' veya 'the best, the most...' (superlative) varsa kısaltma 'to V1 / to be V3' ile yapılır:\n   'Neil Armstrong was the first man who walked on the Moon.' → '... the first man to walk on the Moon.'"
        },
        {
          "heading": "2. Zarf Cümleciklerinin Kısaltılması (Adverbial Participle Clauses)",
          "body": "Yan cümle ile ana cümlenin ÖZNESİ AYNI olduğunda 'when, while, because, since, as, after' gibi bağlaçlar ve özne atılarak cümle başında kısaltma yapılır:\n1) Etken ve Eş Zamanlı / Sebep Bildiren Eylem → V-ing:\n   • Zaman ('When I walked into the room, I saw the broken glass.') → 'Walking into the room, I saw the broken glass.'\n   • Sebep ('Because she didn't want to wake the baby, she tiptoed.') → 'Not wanting to wake the baby, she tiptoed.'\n2) Edilgen Eylem → V3 (Past Participle):\n   Ana cümlenin öznesi yan cümledeki eylemden ETKİLENİYORSA (edilgense) cümle doğrudan 'V3' ile başlar:\n   • ('When it is viewed from space, the Earth looks like a blue marble.') → 'Viewed from space, the Earth looks like a blue marble.'\n   • ('Because it was built on a fault line, the bridge collapsed.') → 'Built on a fault line, the bridge collapsed.'"
        },
        {
          "heading": "3. Kullanım Farkları ve Karşılaştırmalar: Having V3 vs. Having Been V3",
          "body": "Yan cümledeki eylem ana cümledeki eylemden AÇIKÇA DAHA ÖNCE tamamlanmışsa (zaman farkı vurgulanıyorsa) Perfect Participle kullanılır:\n• Etken Öncelik → Having + V3:\n  'After he had finished his master's degree, he started looking for a job.'\n  → 'Having finished his master's degree, he started looking for a job.' (Yüksek lisansını bitirdikten sonra / bitirmiş olarak...)\n• Edilgen Öncelik → Having been + V3:\n  'After he had been warned twice by the referee, the player was sent off.'\n  → 'Having been warned twice by the referee, the player was sent off.' (Hakem tarafından iki kez uyarıldıktan sonra...)"
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar: Özne Uyumu Kuralı (Dangling Participle)",
          "body": "⚠️ ALTIN KURAL: Cümle başında 'V-ing / V3 / Having V3' ile kısaltma yapıldığında, VİRGÜLDEN HEMEN SONRA GELEN ANA CÜMLE ÖZNESİ o kısaltılmış eylemin gerçek öznesi olmak ZORUNDADIR!\n• Örnek 1: '_____ in the refrigerator for a week, the milk smelled sour.'\n  Virgülden sonraki özne 'the milk' (süt). Süt kendi kendini buzdolabında bırakır mı, yoksa bırakılır mı? Bırakılır (Edilgen)! O hâlde 'Keeping' değil, 'Kept' (veya 'Having been kept') doğrudur.\n• Örnek 2: '_____ the report carefully, the manager signed it.'\n  Virgülden sonraki özne 'the manager' (müdür). Müdür raporu kendisi okur (Etken)! O hâlde 'Reading / Having read' doğrudur."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Özetle; özne işi kendisi yapıyorsa (etken) 'V-ing' veya önce yapmışsa 'Having V3'; özne işten etkileniyorsa (edilgen) 'V3' veya önce etkilenmişse 'Having been V3' kullanılır. 'The first, the last, the only, the best' ifadelerinden sonra ise 'to V1 / to be V3' kısaltması yapılır."
        }
      ],
      "formulas": [
        {
          "label": "Etken Kısaltma (Active Participle)",
          "pattern": "V-ing (Eş zamanlı / Genel)\nHaving + V3 (Ana eylemden daha önce tamamlanmış)",
          "note": "Örn: Feeling tired, I went to bed. / Having paid the bill, we left."
        },
        {
          "label": "Edilgen Kısaltma (Passive Participle)",
          "pattern": "V3 (Genel / Edilgen durum)\nBeing + V3 / Having been + V3 (Öncelikli edilgen)",
          "note": "Örn: Written in simple English, the book is easy to read."
        },
        {
          "label": "Olumsuz Kısaltma (Negative Participle)",
          "pattern": "Not + V-ing / Not + having + V3 / Not + V3",
          "note": "Örn: Not knowing the address, she used GPS."
        },
        {
          "label": "Sıra Sayıları ve Superlative Kısaltması",
          "pattern": "the first / the last / the only / the best + İsim + to V1 (Etken) / to be V3 (Edilgen)",
          "note": "Örn: She is the youngest mountaineer to climb Everest."
        }
      ],
      "examples": [
        {
          "en": "Realizing that he had forgotten his passport at home, Can asked the taxi driver to turn back.",
          "tr": "Pasaportunu evde unuttuğunu fark eden Can, taksi şoföründen geri dönmesini istedi.",
          "note": "Etken zarf kısaltması ('Because/When he realized...' → 'Realizing...')."
        },
        {
          "en": "Built by the famous Ottoman architect Mimar Sinan, the Selimiye Mosque is a masterpiece.",
          "tr": "Ünlü Osmanlı mimarı Mimar Sinan tarafından inşa edilen Selimiye Camii bir şaheserdir.",
          "note": "Edilgen kısaltma: Virgülden sonraki özne 'the Selimiye Mosque' inşa edilendir → 'Built' (V3)."
        },
        {
          "en": "Having lived in Tokyo for five years, Selin can speak Japanese fluently.",
          "tr": "Tokyo'da beş yıl yaşamış olduğu için Selin akıcı bir şekilde Japonca konuşabiliyor.",
          "note": "Ana cümleden önce gerçekleşmiş etken deneyim → 'Having + V3'."
        },
        {
          "en": "Not wanting to disturb her roommate, she studied in the living room with a desk lamp.",
          "tr": "Oda arkadaşını rahatsız etmek istemediği için çalışma lambasıyla oturma odasında ders çalıştı.",
          "note": "Olumsuz kısaltmada 'Not' en başa gelir ('Not wanting')."
        },
        {
          "en": "The artifacts discovered during the excavation are now on display at the national museum.",
          "tr": "Kazı sırasında keşfedilen tarihi eserler şu anda ulusal müzede sergileniyor.",
          "note": "Sıfat cümleciği edilgen kısaltması ('which were discovered' → 'discovered')."
        },
        {
          "en": "Marie Curie was the first scientist to win two Nobel Prizes in different scientific fields.",
          "tr": "Marie Curie, farklı bilim alanlarında iki Nobel Ödülü kazanan ilk bilim insanıydı.",
          "note": "'the first + isim' sonrası 'to + V1' ('to win') kısaltması."
        },
        {
          "en": "Having been rejected by three publishers, the manuscript was finally accepted by a major firm.",
          "tr": "Üç yayınevi tarafından reddedildikten sonra, taslak nihayet büyük bir firma tarafından kabul edildi.",
          "note": "Öncelikli edilgen kısaltma: Taslak reddedildi → 'Having been rejected'."
        },
        {
          "en": "Anyone wishing to register for the workshop should fill out the online form by Friday.",
          "tr": "Atölyeye kaydolmak isteyen herkes cuma gününe kadar çevrim içi formu doldurmalıdır.",
          "note": "'Anyone who wishes' → etken sıfat cümleciği kısaltması ('Anyone wishing')."
        }
      ],
      "keyRules": [
        "Cümle başındaki boşluklarda (_____ ..., Subject + Verb), virgülden hemen sonraki ÖZNEYİ kontrol edin: Özne fiili kendisi yapıyorsa 'V-ing / Having V3', özneye o iş yapılıyorsa 'V3 / Having been V3' seçin.",
        "İsimden sonra gelen sıfat cümleciği kısaltmasında boşluktan sonra NESNE varsa genellikle Etken ('V-ing'), boşluktan sonra 'by / in / at / with' gibi bir edat varsa genellikle Edilgen ('V3') olur (geçişli fiiller için).",
        "'The first, the second, the last, the only' veya 'the most/best/-est' yapılarından sonra kısaltma 'V-ing' ile DEĞİL, 'to V1' (edilgense 'to be V3') ile yapılır.",
        "Olumsuz kısaltmalarda 'not' daima en başa gelir: 'Not knowing', 'Not having seen'."
      ],
      "commonMistakes": [
        {
          "wrong": "Bitten by a stray dog, the doctor gave the boy a tetanus shot.",
          "right": "Bitten by a stray dog, the boy was given a tetanus shot by the doctor.",
          "explanation": "'Bitten by a stray dog' (sokak köpeği tarafından ısırılan) ifadesinden sonra gelen özne doktor olamaz (doktor ısırılmadı!); virgülden sonraki özne ısırılan çocuk ('the boy') olmalıdır."
        },
        {
          "wrong": "She was the only candidate answering all the interview questions correctly.",
          "right": "She was the only candidate to answer all the interview questions correctly.",
          "explanation": "'The only + isim' yapısından sonra sıfat cümleciği kısaltması 'V-ing' ile değil, 'to + V1' ('to answer') ile yapılır."
        },
        {
          "wrong": "Knowing not what to say, he remained silent throughout the meeting.",
          "right": "Not knowing what to say, he remained silent throughout the meeting.",
          "explanation": "Participle kısaltmalarında olumsuzluk zarfı 'not' fiilden sonra değil, fiilin EN ÖNÜNE ('Not knowing') gelir."
        },
        {
          "wrong": "Locating in the heart of the city, the hotel offers easy access to museums.",
          "right": "Located in the heart of the city, the hotel offers easy access to museums.",
          "explanation": "Otel bir yeri konumlandırmaz, şehrin kalbinde 'konumlandırılmıştır / yer alır' ('is located'). Bu yüzden edilgen kısaltma 'Located' (V3) olmalıdır."
        }
      ],
      "examTips": [
        "Cümle başı kısaltma sorularında altın taktik: Virgülden sonraki öznenin altını çizin! Özne cansızsa ('the book, the bridge, the medicine, the city') %90 ihtimalle Edilgen ('V3' veya 'Having been V3') doğrudur.",
        "Boşluktan hemen sonra 'by + isim' ('by the police, by Shakespeare, by experts') görürseniz yapı kesinlikle edilgendir: 'V3', 'being V3', 'having been V3' veya 'to be V3' dışındaki tüm etken şıkları eleyin!",
        "Boşluktan önce 'the first, the last, the only, the best' varsa şıklarda doğrudan 'to V1' (veya edilgense 'to be V3') arayın.",
        "Cümle başında 'Surrounded by..., Located in..., Built in..., Written by...,Known as..., Compared to...' kalıpları her zaman V3 (Past Participle) ile başlar."
      ]
    }
  },
  {
    "id": "b2-g09",
    "level": "B2",
    "order": 9,
    "title": "Inversion",
    "description": "Olumsuz ve kısıtlayıcı zarflarla (Never, Rarely, Seldom, Not only, Hardly, No sooner) yapılan devrik cümleler.",
    "status": "ready",
    "content": {
      "intro": "Inversion (Devrik Cümle Yapısı), İngilizcede anlamı güçlendirmek, dramatik etki yaratmak ve yazıya yüksek akademik/edebi bir üslup katmak için kullanılır. Olumsuz, kısıtlayıcı veya vurgulanan zarf öbekleri cümlenin EN BAŞINA alındığında, ana cümle düz cümle olmaktan çıkar ve tıpkı bir SORU CÜMLESİ gibi devrik ('Yardımcı Fiil + Özne + Ana Fiil') dizilimine geçer.",
      "sections": [
        {
          "heading": "1. Temel Kurallar: Olumsuz ve Kısıtlayıcı Zarflarla Devrik Yapı",
          "body": "Aşağıdaki olumsuz ve kısıtlayıcı zarflar cümlenin EN BAŞINA geldiğinde hemen arkasından devrik yapı ('Auxiliary + Subject + Verb') gelir:\n• Sıklık zarfları: Never (before), Rarely, Seldom, Scarcely ever, Little\n  Düz: 'I have never seen such a chaotic organization.'\n  Devrik: 'Never have I seen such a chaotic organization.'\n  Düz: 'She little realized the danger she was in.'\n  Devrik: 'Little did she realize the danger she was in.' (İçinde bulunduğu tehlikenin neredeyse hiç farkında değildi.)\n• Kural ve Yasak İfadeleri: Under no circumstances, In no way, On no account, At no time, Nowhere\n  Devrik: 'Under no circumstances should you share your password.' (Hiçbir koşulda şifreni paylaşmamalısın.)"
        },
        {
          "heading": "2. 'Not Only ... But Also', 'Hardly ... When' ve 'No Sooner ... Than'",
          "body": "• Not only + Yardımcı Fiil + Özne + Fiil, but (subject) also ...:\n  'Not only did he miss the flight, but he also lost his luggage.' (Sadece uçağı kaçırmakla kalmadı, aynı zamanda bagajını da kaybetti.)\n• Hardly / Scarcely / Barely + HAD + Subject + V3 + WHEN + Subject + V2:\n  'Tam ...-mıştı ki ... oldu' anlamında ardışık iki geçmiş olayı anlatır ve 'when' ile eşleşir:\n  'Hardly had I closed my eyes when the phone rang.' (Gözlerimi henüz kapatmıştım ki telefon çaldı.)\n• No sooner + HAD + Subject + V3 + THAN + Subject + V2:\n  'Hardly... when' ile aynı anlamdadır ancak karşılaştırma yapısı olduğu için mutlaka 'THAN' ile eşleşir:\n  'No sooner had the match started than it began to pour with rain.'"
        },
        {
          "heading": "3. Kullanım Farkları ve Karşılaştırmalar: 'Only' İfadeleri ve 'Not Until' (İkinci Cümlede Devriklik!)",
          "body": "⚠️ ÇOK ÖNEMLİ FARK: 'Only after, Only when, Only if, Only by, Not until' gibi arkasına bir yan cümlecik (zaman veya koşul cümlesi) alan yapılarda, devriklik hemen yan cümlede DEĞİL, virgülden sonraki ANA CÜMLEDE gerçekleşir!\n• 'Only when / Only after + Yan Cümle (DÜZ), + Yardımcı Fiil + Özne + Fiil (DEVRİK):'\n  Doğru: 'Only when the plane landed Safely DID the passengers breathe a sigh of relief.'\n  (Ancak uçak güvenle indiğinde yolcular rahat bir nefes aldı — 'the plane landed' düz, 'did the passengers breathe' devrik!)\n• 'Not until + Yan Cümle (DÜZ) + Yardımcı Fiil + Özne + Fiil (DEVRİK):'\n  Doğru: 'Not until I saw the receipt DID I realize how expensive the meal was.'\n• 'Only then / Only later / Only in this way' (Yan cümle almayan kısa ifadeler): Hemen arkasından devrik olur:\n  'Only then did I understand her true intentions.'"
        },
        {
          "heading": "4. Önemli İstisnalar ve Özel Durumlar: So / Such ve Koşul Devrikleri (Conditional Inversion)",
          "body": "1) So + Sıfat/Zarf + Yardımcı Fiil + Özne ... that ... / Such + be + İsim ... that ...:\n   'So exhausted was he that he fell asleep in his chair.' (O kadar yorgundu ki koltuğunda uyuyakaldı.)\n2) Koşul Cümlelerinde Devriklik ('If' atılarak yapılır):\n   • Type 1 (Should): 'If you should need help...' → 'Should you need help, please call me.'\n   • Type 2 (Were): 'If I were in your position...' → 'Were I in your position, I would accept.' / 'Were they to offer me the job...'\n   • Type 3 (Had): 'If we had known the truth...' → 'Had we known the truth, we would have acted differently.'\n3) 'So + Yardımcı Fiil + Özne' (Olumlu katılma: '... de öyle') ve 'Neither / Nor + Yardımcı Fiil + Özne' (Olumsuz katılma: '... de öyle değil'):\n   'She speaks French, and so does her brother.' / 'I haven't seen the film, and neither has Mert.'"
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Özetle; cümle olumsuz bir zarfla ('Never, Rarely, Little, Under no circumstances, Not only') başlıyorsa hemen arkasından soru dizilimi ('do/does/did/have/had/modal + özne + fiil') gelir. 'Hardly/Scarcely' daima 'had + özne + V3 ... when', 'No sooner' ise 'had + özne + V3 ... than' ile kurulur. 'Only when / Only after / Not until' yapılarında ise devriklik ikinci (ana) cümlede yapılır."
        }
      ],
      "formulas": [
        {
          "label": "Genel Olumsuz Zarf Devrikliği",
          "pattern": "Never / Rarely / Seldom / Little / Under no circumstances + Aux (do/does/did/have/had/can/should) + Subject + Verb",
          "note": "Soru cümlesi dizilimi uygulanır ama cümle sonunda nokta (.) vardır."
        },
        {
          "label": "Hardly ... When & No Sooner ... Than",
          "pattern": "Hardly / Scarcely + had + Subject + V3 + WHEN + Subject + V2\nNo sooner + had + Subject + V3 + THAN + Subject + V2",
          "note": "Hardly → WHEN | No sooner → THAN eşleşmesine dikkat!"
        },
        {
          "label": "Only When / Only After / Not Until (Ana Cümle Devrikliği)",
          "pattern": "Only when / Only after / Not until + [Subject + Verb (Düz)], + [Aux + Subject + Verb (Devrik)]",
          "note": "Yan cümle düz kalır, ana cümle devrik olur!"
        },
        {
          "label": "Koşul Cümlesi Devrikliği (If'siz Koşul)",
          "pattern": "Type 1: Should + Subject + V1\nType 2: Were + Subject + (to V1 / Sıfat)\nType 3: Had + Subject + V3",
          "note": "Olumsuzlarda 'not' özneden sonra gelir: 'Had I not seen it...'"
        }
      ],
      "examples": [
        {
          "en": "Never before have I witnessed such a breathtaking natural phenomenon.",
          "tr": "Daha önce hiç bu kadar nefes kesici bir doğa olayına tanık olmamıştım.",
          "note": "'Never before' cümle başında → 'have I witnessed' (devrik Present Perfect)."
        },
        {
          "en": "Little did the passengers know that the flight would be diverted to another city.",
          "tr": "Yolcular uçuşun başka bir şehre yönlendirileceğini hiç bilmiyorlardı.",
          "note": "'Little' (neredeyse hiç) + Past Simple devriği: 'did the passengers know'."
        },
        {
          "en": "No sooner had we sat down for dinner than the power went out across the neighborhood.",
          "tr": "Biz akşam yemeği için henüz oturmuştuk ki tüm mahallede elektrikler kesildi.",
          "note": "'No sooner + had we sat down + than + V2'."
        },
        {
          "en": "Hardly had the speaker finished her presentation when the audience burst into applause.",
          "tr": "Konuşmacı sunumunu henüz bitirmişti ki dinleyiciler alkışa boğuldu.",
          "note": "'Hardly + had the speaker finished + when + V2'."
        },
        {
          "en": "Not only does regular exercise strengthen the heart, but it also improves mental clarity.",
          "tr": "Düzenli egzersiz sadece kalbi güçlendirmekle kalmaz, aynı zamanda zihinsel berraklığı da artırır.",
          "note": "'Not only' başında → Simple Present devriği ('does regular exercise strengthen')."
        },
        {
          "en": "Only after the audit was completed did the board discover the financial discrepancy.",
          "tr": "Yönetim kurulu mali tutarsızlığı ancak denetim tamamlandıktan sonra keşfetti.",
          "note": "'Only after + the audit was completed (düz)' + 'did the board discover (devrik ana cümle)'."
        },
        {
          "en": "Under no circumstances are visitors allowed to take flash photographs inside the gallery.",
          "tr": "Ziyaretçilerin galeri içinde flaşlı fotoğraf çekmesine hiçbir koşulda izin verilmez.",
          "note": "'Under no circumstances' + 'are visitors allowed'."
        },
        {
          "en": "Should you require any further assistance, please do not hesitate to contact our reception desk.",
          "tr": "Daha fazla yardıma ihtiyaç duyarsanız, lütfen resepsiyon masamızla iletişime geçmekten çekinmeyin.",
          "note": "'If you should require' yerine Type 1 devrik koşul: 'Should you require'."
        }
      ],
      "keyRules": [
        "Cümle başında olumsuz zarf varsa ve ana fiil Past Simple (V2) ise devrik yapıda 'did + özne + V1' ('Rarely did he speak'); Present Simple ise 'do/does + özne + V1' ('Seldom does she complain') kullanılır.",
        "'No sooner' her zaman 'than' ile, 'Hardly / Scarcely / Barely' ise her zaman 'when' ile eşleşir.",
        "'Only if, Only when, Only after, Not until' cümle başındaysa İLK cümleyi asla devrik yapmayın; İKİNCİ (ana) cümleyi devrik yapın!",
        "Devrik koşul cümlelerinde ('Should / Were / Had') olumsuzluk eki 'not' yardımcı fiille birleşmez ('Hadn't I' OLMAZ); özneden sonra ayrı yazılır ('Had I not...')."
      ],
      "commonMistakes": [
        {
          "wrong": "Never I have tasted such delicious baklava before.",
          "right": "Never have I tasted such delicious baklava before.",
          "explanation": "'Never' cümle başına geldiğinde özne ile yardımcı fiil yer değiştirmelidir ('have I tasted')."
        },
        {
          "wrong": "No sooner had the train left the station when it started to snow.",
          "right": "No sooner had the train left the station than it started to snow.",
          "explanation": "'No sooner' (daha erken değil - comparative) yapısı 'when' ile değil, 'than' ile kullanılır. ('Hardly/Scarcely' olsaydı 'when' olurdu)."
        },
        {
          "wrong": "Only when did he apologize she forgave him.",
          "right": "Only when he apologized did she forgive him.",
          "explanation": "'Only when' yapısında yan cümle ('he apologized') düz kalır; devriklik ana cümlede ('did she forgive him') uygulanır."
        },
        {
          "wrong": "Rarely she goes to concerts on weekdays.",
          "right": "Rarely does she go to concerts on weekdays.",
          "explanation": "'Rarely' cümle başında olduğunda Simple Present devrik yapısı ('does + she + go') zorunludur."
        }
      ],
      "examTips": [
        "Cümlenin en başında 'Never, Rarely, Seldom, Little, Not only, Under no circumstances, Nowhere, On no account' görürseniz şıklardaki düz dizilimleri (Özne + Fiil) hemen eleyin; soru diziliminde olan ('Aux + Subject + Verb') şıkkı seçin!",
        "Boşluktan sonra '... than + V2' varsa şıklarda 'No sooner had + özne + V3'; '... when + V2' varsa 'Hardly / Scarcely had + özne + V3' arayın.",
        "Cümle 'Only after / Only when / Only if / Not until' ile başlıyorsa, iki cümlenin birleştiği noktaya (ikinci cümlenin başına) bakın: Devrik yapı orada olmalıdır!",
        "Cümle başında boşluk ve devamında '... you need help' (V1) varsa 'Should'; '... I in your shoes' varsa 'Were'; '... they listened to me, they wouldn't have failed' (V3) varsa 'Had' işaretleyin."
      ]
    }
  },
  {
    "id": "b2-g10",
    "level": "B2",
    "order": 10,
    "title": "Wish & If Only",
    "description": "Şimdiki zamana (wish + V2), geçmişe (wish + had V3) ve yakınmaya (wish + would V1) yönelik dilek/pişmanlık kipleri.",
    "status": "ready",
    "content": {
      "intro": "Wish ve If Only yapıları, mevcut gerçekliğin veya geçmişte yaşanmış olayların aksini arzulama, pişmanlık duyma veya bir durumdan yakınma bildirmek için kullanılır. \"If only\" anlam olarak \"I wish\" ile aynıdır ancak çok daha güçlü ve duygusal bir vurgu taşır. İngilizce dil bilgisinde bu yapılar bir derece geçmiş zamana (unreal past / hypothetical shift) kaydırılarak ifade edilir.",
      "sections": [
        {
          "heading": "1. Şimdiki Zamana Yönelik Dilekler (Wish / If only + Past Simple / Continuous)",
          "body": "Şu anda geçerli olan bir durumun farklı olmasını dilediğimizde fiil Past Simple veya Past Continuous biçimine çekilir. Anlam şimdiki zamandır ancak durum gerçek dışıdır (unreal present): \"I wish I had more free time\" (Keşke daha çok boş vaktim olsa - ama şu an yok). Formal İngilizcede \"was\" yerine \"were\" tercih edilir: \"I wish I were taller\"."
        },
        {
          "heading": "2. Geçmişe Yönelik Pişmanlıklar (Wish / If only + Past Perfect)",
          "body": "Geçmişte gerçekleşmiş veya gerçekleşmemiş bir olaydan duyulan pişmanlığı belirtmek için \"had + V3\" kullanılır: \"I wish I hadn't stayed up so late last night\" (Keşke dün gece bu kadar geç saate kadar ayakta kalmasaydım). Bu yapı 3rd Conditional mantığıyla birebir örtüşür."
        },
        {
          "heading": "3. Yakınma, Rahatsızlık ve İstek (Wish / If only + would + V1)",
          "body": "Başka bir kişinin can sıkıcı bir alışkanlığından yakınırken veya bir durumun değişmesini sabırsızlıkla arzularken \"would + V1\" kullanılır: \"I wish you would stop tapping your pen!\" DİKKAT: Kural olarak özne \"I\" veya \"we\" olduğunda \"would\" kullanılamaz; onun yerine \"could\" kullanılır (\"I wish I could help\")."
        },
        {
          "heading": "4. Yetenek ve İmkansızlık Bildiren Dilekler (Wish + could + V1)",
          "body": "\"Could + V1\" hem şu anki hem gelecekteki bir yeteneğe/imkana dair dileği belirtir: \"I wish I could speak Japanese fluently\". Geçmişteki bir yetenek pişmanlığı için ise \"could have + V3\" kullanılır: \"I wish I could have attended your wedding\"."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Özetle: Şimdiki zaman dileği için Past Simple/were, geçmiş pişmanlığı için Past Perfect (had V3), başkalarının davranışlarından şikayet ve yakınma için would + V1 kullanılır. Kendimiz için asla wish + would denmez (I wish I would X YANLIŞTIR)."
        }
      ],
      "formulas": [
        {
          "label": "Şimdiki Zaman Dileği",
          "pattern": "Subject + wish (+ that) + Subject + Past Simple (were)",
          "note": "Örn: I wish I knew the answer. / I wish he were here."
        },
        {
          "label": "Geçmiş Pişmanlığı",
          "pattern": "Subject + wish (+ that) + Subject + had + V3",
          "note": "Örn: She wishes she had studied harder for the exam."
        },
        {
          "label": "Şikayet / Yakınma",
          "pattern": "Subject + wish + Different Subject + would + V1",
          "note": "Örn: I wish it would stop raining! (I wish I would YANLIŞ)"
        },
        {
          "label": "Yetenek / İzin Dileği",
          "pattern": "Subject + wish + Subject + could + V1",
          "note": "Örn: I wish I could play the guitar like you."
        }
      ],
      "examples": [
        {
          "en": "I wish I had enough money to buy that modern electric car right now.",
          "tr": "Şu anda o modern elektrikli arabayı alacak kadar param olmasını dilerdim / keşke param olsa.",
          "note": "Şimdiki zamandaki imkansızlık (had)."
        },
        {
          "en": "If only we had checked the weather forecast before starting our long hike!",
          "tr": "Keşke uzun yürüyüşümüze başlamadan önce hava durumunu kontrol etmiş olsaydık!",
          "note": "Geçmişteki hata ve pişmanlık (If only + had checked)."
        },
        {
          "en": "I wish you would listen to me when I am trying to explain something important.",
          "tr": "Önemli bir şey açıklamaya çalışırken keşke beni dinlesen / dinlemeni rica ediyorum.",
          "note": "Birinin davranışından yakınma (would listen)."
        },
        {
          "en": "Ahmet wishes he were not working this weekend so that he could join the road trip.",
          "tr": "Ahmet bu hafta sonu çalışmıyor olmayı dilerdi, böylece yolculuğa katılabilecekti.",
          "note": "Şimdiki durumun tersi (were not working)."
        },
        {
          "en": "If only I hadn't deleted those project files by accident yesterday morning.",
          "tr": "Keşke dün sabah o proje dosyalarını yanlışlıkla silmemiş olsaydım.",
          "note": "Geçmişe yönelik güçlü pişmanlık (hadn't deleted)."
        },
        {
          "en": "We wish we could stay longer in this picturesque coastal village.",
          "tr": "Bu pitoresk sahil köyünde keşke daha uzun süre kalabilseydik.",
          "note": "İmkansızlık/yetenek dileği (could stay)."
        },
        {
          "en": "I wish the bus would arrive soon; it has been forty minutes since the schedule.",
          "tr": "Keşke otobüs bir an önce gelse; tarifeden bu yana kırk dakika geçti.",
          "note": "Sabırsızlıkla bir durumun değişmesini isteme (would arrive)."
        },
        {
          "en": "Sude wishes she had taken the job offer in London when she had the chance.",
          "tr": "Sude elinde fırsat varken Londra'daki iş teklifini kabul etmiş olmayı dilerdi.",
          "note": "Geçmişteki kaçırılmış fırsat (had taken)."
        }
      ],
      "keyRules": [
        "Şimdiki zamana ait dileklerde fiil bir zaman geriye çekilerek Past Simple yapılır ancak anlam şu anı veya geleceği ifade eder.",
        "\"To be\" fiili için formal yazımda tüm öznelerde (I, he, she, it) \"were\" kullanımı standart kabul edilir: \"I wish I were free\".",
        "Özne kendisi hakkında konuşurken (I wish I...) asla \"would\" kullanamaz; bunun yerine \"could\" kullanılır.",
        "\"If only\" yapısı cümlenin başında daha dramatik ve kuvvetli bir duygu vermek için kullanılır."
      ],
      "commonMistakes": [
        {
          "wrong": "I wish I will travel to Japan next summer.",
          "right": "I hope I will travel to Japan next summer. / I wish I could travel...",
          "explanation": "Gelecekte olası ve gerçekçi umutlar için \"wish\" değil \"hope\" kullanılır. Wish gerçek dışı/imkansız dilekler içindir."
        },
        {
          "wrong": "I wish I would have more patience with my students.",
          "right": "I wish I had more patience with my students.",
          "explanation": "Özne \"I\" olduğunda kendi kişisel durumu için \"would\" kullanılamaz; Past Simple (had) kullanılır."
        },
        {
          "wrong": "If only I didn't spend all my savings last year.",
          "right": "If only I hadn't spent all my savings last year.",
          "explanation": "Geçmişe (last year) ait pişmanlıklar Past Simple değil, mutlaka Past Perfect (hadn't spent) ile kurulur."
        },
        {
          "wrong": "I wish my neighbor doesn't play loud music late at night.",
          "right": "I wish my neighbor wouldn't play loud music late at night.",
          "explanation": "Başkalarının rahatsız edici alışkanlıklarından yakınırken Present Tense değil \"wouldn't + V1\" kullanılır."
        }
      ],
      "examTips": [
        "Cümlede \"yesterday, last year, then, when I was young\" gibi geçmiş zaman ipucu varsa boşlukta hemen Past Perfect (had + V3) arayın.",
        "Cümlede \"now, at present, today\" varsa veya genel durum bildiriliyorsa Past Simple (V2 / were) arayın.",
        "\"I wish I...\" veya \"We wish we...\" özne eşleşmelerinde şıklardaki \"would\" seçeneğini doğrudan eleyin.",
        "Olası bir geleceği anlatan seçeneklerde \"wish\" yerine \"hope\" gelmesi gerektiğini unutmayın."
      ]
    }
  },
  {
    "id": "b2-g11",
    "level": "B2",
    "order": 11,
    "title": "Subjunctive & Unreal Past (It’s Time, I’d Rather)",
    "description": "It’s high time, would rather, as if / as though ile kullanılan gerçek dışı geçmiş zaman çekimleri.",
    "status": "ready",
    "content": {
      "intro": "İngilizcede \"Unreal Past\" (Gerçek Dışı Geçmiş Zaman), biçimsel olarak geçmiş zaman (Past Simple / Past Perfect) çekimi kullanılmasına rağmen anlam olarak şimdiki veya gelecekteki hipotetik durumları anlatan yapılardır. \"It's time / It's high time\", \"would rather\", \"as if / as though\" ve mandative subjunctive kalıpları bu dil bilgisi kategorisinin en kritik ve sınavlarda en çok ayırt edici olan konularıdır.",
      "sections": [
        {
          "heading": "1. It's Time / It's High Time / It's About Time + Past Simple",
          "body": "\"Vakti geldi de geçiyor / artık yapılması gerekir\" anlamına gelen bu yapıda, eylem gecikmiş bir gerekliliği ifade eder. Kalıptan sonra bir özne geliyorsa fiil mutlaka Past Simple (V2) olur: \"It's high time we left\" (Artık gitmemizin vakti geldi de geçiyor). Özne yoksa mastar (infinitive) kullanılır: \"It's time to leave\"."
        },
        {
          "heading": "2. Would Rather: Aynı Özne vs. Farklı Özne Kuralı",
          "body": "1) Özneler aynı ise: would rather + bare infinitive (V1) kullanılır: \"I'd rather stay at home tonight\". 2) Özneler farklı ise (tercih başkası üzerineyse): would rather + subject + Past Simple kullanılır: \"I'd rather you didn't smoke in here\" (Burada sigara içmemeni tercih ederim - şimdiki zaman tercihi). Geçmişe yönelik farklı özne tercihinde Past Perfect kullanılır: \"I'd rather you hadn't told him the secret yesterday\"."
        },
        {
          "heading": "3. As If / As Though (Sanki ... -mış gibi)",
          "body": "Bir durumun gerçek dışı veya varsayımsal olduğunu vurgulamak için Past Simple kullanılır: \"He talks as if he knew everything\" (Sanki her şeyi biliyormuş gibi konuşuyor - ama bilmiyor). Durumun gerçek olma ihtimali yüksekse normal zamanlar kullanılır: \"It looks as if it is going to rain\"."
        },
        {
          "heading": "4. Mandative Subjunctive (Öneri ve Talep Bildiren Fiiller)",
          "body": "Resmi İngilizcede suggest, recommend, demand, insist, require fiillerinden ve essential, vital, crucial sıfatlarından sonra gelen \"that\" cümleciğinde fiil tüm şahıslar için yalın (base form) kalır: \"The doctor insisted that he take a few days off\" (takes DEĞİL)."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "It's high time + Subject + V2 gerektirir. Would rather + farklı özne şimdiki zaman için V2, geçmiş için had V3 alır. As if gerçek dışı durumlarda V2/were alır. Mandative subjunctive yapılarında fiil her zaman yalındır (base form)."
        }
      ],
      "formulas": [
        {
          "label": "It's (high) time Yapısı",
          "pattern": "It's (high / about) time + Subject + Past Simple (V2)",
          "note": "Örn: It's high time you started studying."
        },
        {
          "label": "Would Rather (Farklı Özne - Şimdiki)",
          "pattern": "Subject + would rather + Subject + Past Simple (V2)",
          "note": "Örn: I'd rather she came by train tomorrow."
        },
        {
          "label": "Would Rather (Farklı Özne - Geçmiş)",
          "pattern": "Subject + would rather + Subject + had + V3",
          "note": "Örn: I'd rather you hadn't invited him to the party."
        },
        {
          "label": "Mandative Subjunctive",
          "pattern": "insist / demand / suggest + that + Subject + Base Form (V1)",
          "note": "Örn: They demanded that she be released immediately."
        }
      ],
      "examples": [
        {
          "en": "It is high time the government took decisive action against rising air pollution.",
          "tr": "Hükümetin artan hava kirliliğine karşı kararlı adımlar atmasının vakti geldi de geçiyor.",
          "note": "It is high time + Past Simple (took)."
        },
        {
          "en": "I would rather you didn't mention this private conversation to anyone else.",
          "tr": "Bu özel konuşmadan başka hiç kimseye bahsetmemeni tercih ederim.",
          "note": "Would rather + farklı özne + Past Simple (didn't mention)."
        },
        {
          "en": "She behaved as if she owned the entire multinational company.",
          "tr": "Sanki tüm çok uluslu şirketin sahibi kendisiymiş gibi davrandı.",
          "note": "Gerçek dışı durum (as if + owned)."
        },
        {
          "en": "The committee recommended that the candidate submit an updated portfolio.",
          "tr": "Komite, adayın güncel bir portföy sunmasını tavsiye etti.",
          "note": "Mandative subjunctive (submit, 3. tekil -s almaz)."
        },
        {
          "en": "It's about time we made a final decision regarding our summer holiday destination.",
          "tr": "Yaz tatili rotamızla ilgili artık nihai bir karar vermemizin vakti geldi.",
          "note": "It's about time + made."
        },
        {
          "en": "I'd rather have cooked at home yesterday than ordered fast food.",
          "tr": "Dün hazır yemek sipariş etmektense evde yemek pişirmiş olmayı tercih ederdim.",
          "note": "Aynı özne geçmiş tercih (would rather have + V3)."
        },
        {
          "en": "He speaks about finance as though he were a leading economic expert.",
          "tr": "Ekonomi alanında önde gelen bir uzmanmış gibi finans üzerine konuşuyor.",
          "note": "As though + were (varsayımsal durum)."
        },
        {
          "en": "The supervisor insisted that every employee attend the safety training session.",
          "tr": "Yönetici, her çalışanın güvenlik eğitimine katılmasında ısrar etti.",
          "note": "Insisted that + attend (yalın fiil)."
        }
      ],
      "keyRules": [
        "\"It's high time\" kalıbından sonra asla şimdiki zaman veya \"should\" kullanılmaz; fiil daima Past Simple biçimindedir.",
        "\"Would rather\" kalıbından sonra gelen özne farklıysa fiil şimdiki zaman için Past Simple, geçmiş zaman için Past Perfect olur.",
        "Subjunctive cümlelerde (demand that, require that) 3. tekil şahıslarda fiile asla -s takısı eklenmez, be fiili \"be\" olarak kalır.",
        "\"As if / As though\" ile gerçek dışılık anlatılırken was yerine were kullanımı formal dilde tercih edilir."
      ],
      "commonMistakes": [
        {
          "wrong": "It's high time you go to the dentist for a check-up.",
          "right": "It's high time you went to the dentist for a check-up.",
          "explanation": "\"It's high time\" yapısından sonra özne geldiğinde fiil zorunlu olarak Past Simple (went) olmalıdır."
        },
        {
          "wrong": "I would rather you don't call me late at night.",
          "right": "I would rather you didn't call me late at night.",
          "explanation": "Would rather kalıbında iki farklı özne (I / you) olduğunda şimdiki zaman tercihi için Past Simple (didn't call) kullanılır."
        },
        {
          "wrong": "The manager insists that he signs the contract today.",
          "right": "The manager insists that he sign the contract today.",
          "explanation": "Mandative subjunctive yapısında \"insist that\" sonrasında 3. tekil şahıs olsa bile fiil yalın (sign) kalmalıdır."
        },
        {
          "wrong": "He looks as if he was seeing a ghost right now.",
          "right": "He looks as if he saw a ghost / had seen a ghost.",
          "explanation": "As if yapılarında şaşkınlık ve gerçek dışılık V2 veya had V3 ile verilir; present continuous kullanılmaz."
        }
      ],
      "examTips": [
        "Test sorularında \"It's (high/about) time + özne\" kalıbını gördüğünüz anda seçeneklerde sadece Past Simple (V2) arayın.",
        "\"I'd rather + özne + boşluk\" varsa ve cümle içinde geçmiş zaman belirteci yoksa doğrudan V2, geçmiş belirteci varsa had + V3 seçin.",
        "\"Suggest / insist / demand / recommend that + özne + boşluk\" sorularında şıklardaki -s takılı fiilleri ve will/would yapılarını eleyin; yalın fiili (V1) seçin.",
        "Passive subjunctive sorularında \"be + V3\" şablonunu unutmayın: \"demanded that the prisoner be released\"."
      ]
    }
  },
  {
    "id": "b2-g12",
    "level": "B2",
    "order": 12,
    "title": "Advanced Articles & Noun Phrases",
    "description": "Belirli/belirsiz tanımlıkların (a, an, the, zero article) ileri düzey kuralları ve karmaşık isim tamlamaları.",
    "status": "ready",
    "content": {
      "intro": "İngilizce tanımlıklar (Articles: A, An, The ve Zero Article), basit seviyede genel/belirli ayrımıyla öğretilse de B2 seviyesinde coğrafi adlar, kurumlar, soyut kavramlar, tür temsili ve karmaşık isim tamlamalarında incelikli kurallar barındırır. Tanımlıkların doğru kullanımı, akademik ve profesyonel İngilizce metin üretiminin en belirgin kalite göstergelerinden biridir.",
      "sections": [
        {
          "heading": "1. Kurum İsimleri ve Amaç Kuralı (School, Prison, Hospital, University)",
          "body": "Bu mekanlar kuruluş amaçları doğrultusunda kullanıldığında tanımlık almaz (zero article): \"He is in hospital\" (hasta olarak yatıyor), \"She goes to school\" (öğrenci olarak gidiyor). Ancak bina veya belirli bir fiziksel mekan olarak ziyaret edildiğinde \"the\" alır: \"I went to the hospital to visit my friend\"."
        },
        {
          "heading": "2. Coğrafi İsimlerde \"The\" Kullanımı",
          "body": "• THE ALANLAR: Okyanuslar (the Atlantic), denizler (the Mediterranean), nehirler (the Nile), sıradağlar (the Alps), ada grupları (the Bahamas), çoğul/birlik ülkeler (the Netherlands, the United States, the UK).\n• ZERO ARTICLE (ALMAYANLAR): Tek dağlar (Mount Everest), tek göller (Lake Michigan), tek adalar (Sicily), kıtalar (Europe, Asia), tekil ülkelerin çoğu (France, Turkey)."
        },
        {
          "heading": "3. Tür Temsili ve Genelleme (Generic Reference)",
          "body": "Bir türün veya icadın tamamını genellemek için üç farklı yol vardır:\n1) \"The + tekil isim\": \"The cheetah is the fastest land animal\" veya \"Alexander Graham Bell invented the telephone\".\n2) \"Çoğul isim + zero article\": \"Cheetahs are fast animals\".\n3) \"A/An + tekil isim\": \"A doctor must be compassionate\"."
        },
        {
          "heading": "4. Karmaşık İsim Tamlamaları ve Sıfatlaşan İsimler (Noun Adjuncts)",
          "body": "İki veya daha fazla ismin bir araya geldiği tamlamalarda ilk isim sıfat görevi görür ve tekil kalır: \"a three-week course\" (three-weeks DEĞİL), \"a car production plant\". Sıfat sıralamasında genelden özele OSASCOMP (Opinion, Size, Age, Shape, Color, Origin, Material, Purpose) kuralı geçerlidir."
        },
        {
          "heading": "5. Konu Özeti",
          "body": "Kurumlar temel amacı için kullanıldığında zero article, bina olarak ziyaret edildiğinde \"the\" alır. Coğrafyada çoğul/sıradağ/denizler \"the\", tekil dağ/göl/ülkeler zero article alır. İsim tamlamalarında niteleyen sayı ve isimler tekil kalır (a ten-minute break)."
        }
      ],
      "formulas": [
        {
          "label": "Kurum: Amaç vs. Bina",
          "pattern": "in hospital (hasta)  vs.  in the hospital (ziyaretçi)",
          "note": "Aynı kural school, prison, university, church için geçerlidir."
        },
        {
          "label": "Coğrafi Adlar",
          "pattern": "the + sıradağ / deniz / nehir  |  Ø + tek dağ / göl / kıta",
          "note": "the Alps vs. Mount Everest | the Nile vs. Lake Geneva"
        },
        {
          "label": "Bütüncül İsim Grupları",
          "pattern": "the + Sıfat = Çoğul İnsan Grubu",
          "note": "the rich (zenginler), the elderly (yaşlılar), the unemployed"
        },
        {
          "label": "Bileşik Sıfat Tamlamaları",
          "pattern": "a/an + Number + singular noun + noun",
          "note": "a five-star hotel (five-stars DEĞİL), a two-hour lecture"
        }
      ],
      "examples": [
        {
          "en": "My uncle was taken to hospital in an ambulance after the car accident.",
          "tr": "Amcam araba kazasından sonra ambulansla hastaneye (tedavi amacıyla) kaldırıldı.",
          "note": "Kurumun temel amacı (to hospital, zero article)."
        },
        {
          "en": "The Alps attract millions of passionate skiers and mountaineers every winter.",
          "tr": "Alpler her kış milyonlarca tutkulu kayakçı ve dağcıyı kendine çeker.",
          "note": "Sıradağlar \"the\" tanımlığı alır."
        },
        {
          "en": "Mount Everest is the highest mountain peak above sea level on Earth.",
          "tr": "Everest Dağı, yeryüzünde deniz seviyesinin üzerindeki en yüksek dağ zirvesidir.",
          "note": "Tekil dağ zirvesi (zero article, Mount Everest)."
        },
        {
          "en": "The government should create more job opportunities for the unemployed.",
          "tr": "Hükümet, işsizler için daha fazla istihdam olanağı yaratmalıdır.",
          "note": "\"The unemployed\" tüm işsizleri ifade eden çoğul grup ismidir."
        },
        {
          "en": "We attended a very productive two-hour conference on renewable energy sources.",
          "tr": "Yenilenebilir enerji kaynakları üzerine iki saatlik çok verimli bir konferansa katıldık.",
          "note": "Bileşik niteleme (two-hour, hours DEĞİL)."
        },
        {
          "en": "The telephone completely transformed global human communication in the late nineteenth century.",
          "tr": "Telefon, on dokuzuncu yüzyılın sonlarında küresel insan iletişimini bütünüyle dönüştürdü.",
          "note": "İcat ve tür temsili (the telephone)."
        },
        {
          "en": "Lake Superior is the largest of the Great Lakes in North America.",
          "tr": "Superior Gölü, Kuzey Amerika'daki Büyük Göller'in en büyüğüdür.",
          "note": "Tek göl adı (Lake Superior, zero article)."
        },
        {
          "en": "She has lived in the United Kingdom for more than a decade now.",
          "tr": "Artık on yılı aşkın bir süredir Birleşik Krallık'ta yaşıyor.",
          "note": "Birlik/krallık bildiren ülke adı (the United Kingdom)."
        }
      ],
      "keyRules": [
        "\"School, university, prison, hospital, church, bed\" kelimeleri temel işlevleri için kullanıldığında \"the\" almaz.",
        "Müzik aletleri çalınırken eylemde \"the\" ile kullanılır: \"play the piano / the violin\" (spor branşlarında ise article almaz: play football).",
        "\"The + sıfat\" yapısı o özelliğe sahip tüm insanları çoğul olarak tanımlar ve çoğul fiil alır: \"The elderly need care\".",
        "Sayı bildiren sıfat tamlamalarında aradaki isim asla çoğul yapılmaz: \"a ten-year-old child\" (years DEĞİL)."
      ],
      "commonMistakes": [
        {
          "wrong": "He went to the prison because he committed a severe crime.",
          "right": "He went to prison because he committed a severe crime.",
          "explanation": "Suçlu olarak hapse girmek temel amaçtır ve sıfır tanımlık (to prison) gerektirir. \"To the prison\" ziyaret amaçlıdır."
        },
        {
          "wrong": "They climbed the Mount Fuji during their trip to Japan.",
          "right": "They climbed Mount Fuji during their trip to Japan.",
          "explanation": "Tekil dağ adları (Mount Fuji, Mount Everest) asla \"the\" tanımlığı almaz."
        },
        {
          "wrong": "We stayed at a five-stars luxury resort near the beach.",
          "right": "We stayed at a five-star luxury resort near the beach.",
          "explanation": "İsimden önce gelen bileşik sıfatlar çoğul eki (-s) alamaz; \"five-star\" olmalıdır."
        },
        {
          "wrong": "The rich is getting richer while the poor is struggling.",
          "right": "The rich are getting richer while the poor are struggling.",
          "explanation": "\"The + adjective\" yapıları o gruptaki tüm insanları kapsayan çoğul öznelerdir ve çoğul fiil (are) alır."
        }
      ],
      "examTips": [
        "Kurum sorularında cümlenin bağlamına bakın: Kişi hasta/öğrenci/suçlu ise sıfır tanımlık, ziyaretçi/tamirci ise \"the\" seçin.",
        "Coğrafi adlarda çoğul ekli isimler (The Himalayas, The Netherlands, The Philippines) daima \"the\" alır.",
        "Çizgili bileşik niteleyicilerde (hyphenated adjectives) -s takısı olan şıkları doğrudan eleyin (\"a three-days meeting\" YANLIŞTIR).",
        "\"Play + enstrüman\" sorularında \"the\", \"play + spor/oyun\" sorularında ise sıfır tanımlık (Ø) kuralını hatırlayın."
      ]
    }
  }
];

export const GRAMMAR_QUESTIONS = [
  {
    "id": "a2-g01-q01",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "Ahmet usually _____ black coffee in the morning, but today he is drinking green tea.",
    "options": [
      "drinks",
      "is drinking",
      "drink",
      "drank"
    ],
    "correctAnswer": "drinks",
    "explanation": "'Usually' (genellikle) alışkanlık ve rutin bildirir; bu nedenle geniş zaman (Simple Present) kullanılır. Özne 'Ahmet' (3. tekil) olduğu için fiil -s takısı alarak 'drinks' olur.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g01-q02",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "Be quiet! The baby _____ in the bedroom right now.",
    "options": [
      "is sleeping",
      "sleeps",
      "sleep",
      "was sleeping"
    ],
    "correctAnswer": "is sleeping",
    "explanation": "'Be quiet!' ünlemi ve 'right now' (şu anda) konuşma anında devam eden bir eylemi işaret eder. Tekil özne 'The baby' ile 'is sleeping' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g01-q03",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "I _____ this math problem at all. Can you explain it to me once more?",
    "options": [
      "don't understand",
      "am not understanding",
      "doesn't understand",
      "not understand"
    ],
    "correctAnswer": "don't understand",
    "explanation": "'Understand' bir durum fiilidir (stative verb) ve -ing takısı almaz. Konuşma anında dahi olsa Simple Present olumsuz kalıbı 'don't understand' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g01-q04",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "Look! Sude _____ to catch the school bus across the street.",
    "options": [
      "is running",
      "runs",
      "are running",
      "run"
    ],
    "correctAnswer": "is running",
    "explanation": "'Look!' (Bak!) ünlemi o anda gerçekleşen bir eylemi bildirir. 'Sude' tekil öznesi ile Present Continuous 'is running' kullanılır (run fiilinde n çiftleşir).",
    "difficulty": "easy"
  },
  {
    "id": "a2-g01-q05",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "Pure water _____ at 100 degrees Celsius under standard atmospheric pressure.",
    "options": [
      "boils",
      "is boiling",
      "boil",
      "boiled"
    ],
    "correctAnswer": "boils",
    "explanation": "Bilimsel gerçekler, doğa yasaları ve genel geçer doğrular her zaman Simple Present Tense ile anlatılır. 'Water' sayılamaz tekil isim olduğu için 'boils' doğrudur.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g01-q06",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "What time _____ your father usually get home from work in the evening?",
    "options": [
      "does",
      "do",
      "is",
      "are"
    ],
    "correctAnswer": "does",
    "explanation": "Simple Present soru cümlesinde 3. tekil şahıs ('your father' = he) için 'does' yardımcı fiili kullanılır; asıl fiil (get) yalın kalır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g01-q07",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "Listen! Somebody _____ the piano in the music room upstairs.",
    "options": [
      "is playing",
      "plays",
      "play",
      "are playing"
    ],
    "correctAnswer": "is playing",
    "explanation": "'Listen!' (Dinle!) ünlemi konuşma anında sürmekte olan sesi ve eylemi belirtir. Tekil belgisiz zamir 'Somebody' ile 'is playing' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g01-q08",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "I _____ a warm winter coat today because it is very cold outside.",
    "options": [
      "am wearing",
      "wear",
      "wears",
      "am wear"
    ],
    "correctAnswer": "am wearing",
    "explanation": "'Today' (bugün) ifadesi genel bir alışkanlığı değil, bugüne özel geçici durumu anlatır. Bu nedenle Present Continuous 'am wearing' doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g01-q09",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "This freshly baked bread _____ delicious! Did you make it yourself?",
    "options": [
      "smells",
      "is smelling",
      "smell",
      "are smelling"
    ],
    "correctAnswer": "smells",
    "explanation": "'Smell' duyu bildiren bir durum fiilidir ve '... kokmak' anlamında durum belirttiğinde -ing almaz. 'This bread' tekil olduğu için 'smells' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g01-q10",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "My brother is an engineer, but he _____ this week because he is on vacation.",
    "options": [
      "isn't working",
      "doesn't work",
      "don't work",
      "aren't working"
    ],
    "correctAnswer": "isn't working",
    "explanation": "'This week' (bu hafta) geçici bir durumu ifade eder. Genel mesleği mühendislik olsa da bu haftaya özgü tatil durumu için Present Continuous 'isn't working' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g01-q11",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "Why _____ you _____ at me like that? Is there something strange on my shirt?",
    "options": [
      "are / looking",
      "do / look",
      "are / look",
      "is / looking"
    ],
    "correctAnswer": "are / looking",
    "explanation": "Konuşma anında devam eden bakma eylemini sormak için Present Continuous soru yapısı 'Why are you looking...?' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g01-q12",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "Do you know who _____ this red backpack left on the chair?",
    "options": [
      "owns",
      "is owning",
      "own",
      "is own"
    ],
    "correctAnswer": "owns",
    "explanation": "'Own' (sahip olmak) sahiplik bildiren bir durum fiilidir (stative verb) ve -ing takısı almaz. Tekil özne sorusu 'Who' ile 'owns' gelir.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g01-q13",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "I _____ you are completely right about this important decision.",
    "options": [
      "think",
      "am thinking",
      "thinks",
      "are thinking"
    ],
    "correctAnswer": "think",
    "explanation": "'Think' fiili bir fikre veya düşünceye sahip olmak (bence / inanıyorum) anlamında kullanıldığında durum fiilidir ve -ing almaz ('I think').",
    "difficulty": "medium"
  },
  {
    "id": "a2-g01-q14",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "Please don't make any noise; Ali _____ an online exam in his study room.",
    "options": [
      "is taking",
      "takes",
      "take",
      "has taken"
    ],
    "correctAnswer": "is taking",
    "explanation": "'Please don't make any noise' uyarısı konuşma anında devam eden bir eylemi gösterir. 'Ali' tekil öznesiyle 'is taking' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g01-q15",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "I _____ about moving to a quieter town, but I haven't made a final choice yet.",
    "options": [
      "am thinking",
      "think",
      "thinks",
      "am thought"
    ],
    "correctAnswer": "am thinking",
    "explanation": "'Think' fiili 'zihinde tartmak, üzerinde kafa yormak' şeklinde zihinsel bir süreç bildirdiğinde Present Continuous ile kullanılabilir ('I am thinking about moving').",
    "difficulty": "hard"
  },
  {
    "id": "a2-g01-q16",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "Ahmet cannot come to the phone right now because he _____ a shower.",
    "options": [
      "is having",
      "has",
      "have",
      "is have"
    ],
    "correctAnswer": "is having",
    "explanation": "'Have' fiili sahiplik bildirdiğinde -ing almaz; ancak 'have a shower / lunch / breakfast' gibi eylem içeren kalıplarda konuşma anında 'is having' olarak kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g01-q17",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "The global temperature of our planet _____ warmer every decade.",
    "options": [
      "is getting",
      "gets",
      "get",
      "are getting"
    ],
    "correctAnswer": "is getting",
    "explanation": "Aşamalı olarak değişen ve gelişen trendleri (değişim süreçlerini) anlatmak için Present Continuous kullanılır ('is getting warmer').",
    "difficulty": "hard"
  },
  {
    "id": "a2-g01-q18",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "Emre is so careless! He always _____ his keys at the office, which drives me crazy.",
    "options": [
      "is leaving",
      "leaves",
      "leave",
      "left"
    ],
    "correctAnswer": "is leaving",
    "explanation": "'Always' zarfı Present Continuous ('is always leaving') ile kullanıldığında, konuşmacıyı rahatsız eden, can sıkan tekrarlı davranışları eleştirmek için kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g01-q19",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "Can you tell me which family that historic stone mansion _____ to?",
    "options": [
      "belongs",
      "is belonging",
      "belong",
      "belonged"
    ],
    "correctAnswer": "belongs",
    "explanation": "'Belong to' (ait olmak) mutlak bir durum fiilidir; hiçbir zaman -ing takısı almaz. Tekil özne (that mansion) ile 'belongs' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g01-q20",
    "topicId": "a2-g01",
    "level": "A2",
    "question": "Although my cousins normally live in Bursa, they _____ with us in Istanbul for two weeks.",
    "options": [
      "are staying",
      "stay",
      "stays",
      "stayed"
    ],
    "correctAnswer": "are staying",
    "explanation": "'Normally live in Bursa' kalıcı durumu (Simple Present), 'for two weeks' ise geçici bir süreyi ifade eder. Geçici durumlar için Present Continuous ('are staying') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g02-q01",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "We _____ in a cozy wooden cabin near the lake during our holiday last summer.",
    "options": [
      "stayed",
      "stay",
      "staying",
      "stays"
    ],
    "correctAnswer": "stayed",
    "explanation": "'Last summer' (geçen yaz) geçmişte bitmiş bir zamanı belirtir. Düzenli fiil 'stay' sonuna -ed alarak 'stayed' olur.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g02-q02",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "I _____ a delicious carrot cake for my mother's birthday party yesterday.",
    "options": [
      "made",
      "make",
      "maked",
      "making"
    ],
    "correctAnswer": "made",
    "explanation": "'Yesterday' geçmiş zaman gerektirir. 'Make' düzensiz bir fiildir; 2. hali (V2) 'made'dir ('maked' diye bir kelime yoktur).",
    "difficulty": "easy"
  },
  {
    "id": "a2-g02-q03",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "Did you _____ the ancient castle during your sightseeing trip in Rome?",
    "options": [
      "visit",
      "visited",
      "visiting",
      "visits"
    ],
    "correctAnswer": "visit",
    "explanation": "Past Simple soru cümlelerinde 'Did' yardımcı fiili kullanıldığında ana fiil mutlaka YALIN (V1: visit) olmalıdır; -ed takısı almaz.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g02-q04",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "They _____ to the cinema with us last night because they were too exhausted.",
    "options": [
      "didn't go",
      "didn't went",
      "weren't go",
      "not went"
    ],
    "correctAnswer": "didn't go",
    "explanation": "Past Simple olumsuz cümle yapısı 'didn't + yalın fiil (V1)' şeklindedir. 'Didn't' sonrası fiilin 2. hali (went) kullanılamaz; 'didn't go' doğrudur.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g02-q05",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "Sude accidentally _____ her leather wallet on the bus seat two hours ago.",
    "options": [
      "left",
      "leave",
      "leaved",
      "leaves"
    ],
    "correctAnswer": "left",
    "explanation": "'Two hours ago' (iki saat önce) Past Simple gerektirir. 'Leave' düzensiz fiilinin 2. hali (V2) 'left'tir ('leaved' yanlıştır).",
    "difficulty": "easy"
  },
  {
    "id": "a2-g02-q06",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "Ahmet was very thirsty after the workout, so he _____ two full glasses of water.",
    "options": [
      "drank",
      "drink",
      "drinked",
      "drunk"
    ],
    "correctAnswer": "drank",
    "explanation": "'Drink' düzensiz bir fiildir; Past Simple (V2) hali 'drank'tir. 'Drunk' 3. haldir (V3); 'drinked' ise kural dışı ve yanlıştır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g02-q07",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "The students _____ excited when they heard about the school trip to Cappadocia.",
    "options": [
      "were",
      "was",
      "are",
      "did"
    ],
    "correctAnswer": "were",
    "explanation": "'The students' çoğul bir öznedir. Geçmiş zamanda durum (sıfat) cümlesi kurarken çoğul öznelerle 'were' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g02-q08",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "I _____ to call you yesterday evening, but my phone battery suddenly died.",
    "options": [
      "tried",
      "tryed",
      "try",
      "was try"
    ],
    "correctAnswer": "tried",
    "explanation": "Sonu 'sessiz + y' ile biten düzenli fiillerde -ed eklenirken 'y' harfi 'i'ye dönüşür: try -> tried ('tryed' yazımı yanlıştır).",
    "difficulty": "medium"
  },
  {
    "id": "a2-g02-q09",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "Where _____ you _____ that stylish winter jacket you wore yesterday?",
    "options": [
      "did / buy",
      "did / bought",
      "were / buy",
      "do / bought"
    ],
    "correctAnswer": "did / buy",
    "explanation": "Past Simple soru cümlesinde 'Did + özne + V1 (yalın fiil)' kuralı geçerlidir. Bu nedenle 'did / buy' doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g02-q10",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "The city bus suddenly _____ at the red light and all the passengers moved forward.",
    "options": [
      "stopped",
      "stoped",
      "stops",
      "stopping"
    ],
    "correctAnswer": "stopped",
    "explanation": "'Sessiz + tek sesli + tek sessiz' ile biten tek heceli düzenli fiillerde -ed gelirken son harf çiftleşir: stop -> stopped.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g02-q11",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "We _____ any available tickets for the theatre because they were completely sold out.",
    "options": [
      "couldn't find",
      "couldn't found",
      "can't find",
      "didn't could find"
    ],
    "correctAnswer": "couldn't find",
    "explanation": "Geçmişte yapabilirlik/bulabilirlik olumsuzu 'couldn't + V1' ile ifade edilir. 'Couldn't' sonrasında yalın fiil 'find' gelir.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g02-q12",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "My father _____ me how to ride a bicycle when I was seven years old.",
    "options": [
      "taught",
      "teached",
      "teach",
      "thought"
    ],
    "correctAnswer": "taught",
    "explanation": "'Teach' (öğretmek) düzensiz bir fiildir ve 2. hali 'taught'tur ('teached' yanlıştır; 'thought' ise 'think'in geçmiş halidir).",
    "difficulty": "medium"
  },
  {
    "id": "a2-g02-q13",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "Why _____ you absent from the English class yesterday morning?",
    "options": [
      "were",
      "did",
      "was",
      "are"
    ],
    "correctAnswer": "were",
    "explanation": "'Absent' (devamsız/yok) bir sıfattır, eylem fiili değildir. İsim ve sıfat sorularında 'did' değil, 'was/were' kullanılır: 'Why were you absent?'",
    "difficulty": "medium"
  },
  {
    "id": "a2-g02-q14",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "She slipped on the wet floor and _____ down, injuring her ankle.",
    "options": [
      "fell",
      "felt",
      "fall",
      "falled"
    ],
    "correctAnswer": "fell",
    "explanation": "'Fall' (düşmek) fiilinin 2. hali 'fell'dir. 'Felt' ise 'feel' (hissetmek) fiilinin 2. halidir; karıştırılmamalıdır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g02-q15",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "Who _____ that magnificent stone bridge over the river in 1895?",
    "options": [
      "built",
      "did build",
      "builded",
      "was build"
    ],
    "correctAnswer": "built",
    "explanation": "Özneyi soran 'Who' sorularında (Who + V2) yardımcı fiil 'did' kullanılmaz; fiilin 2. hali doğrudan yazılır: 'Who built the bridge?'",
    "difficulty": "hard"
  },
  {
    "id": "a2-g02-q16",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "The price of olive oil _____ noticeably in the local market last autumn.",
    "options": [
      "rose",
      "raised",
      "risen",
      "rised"
    ],
    "correctAnswer": "rose",
    "explanation": "'Rise' (kendiliğinden yükselmek/artmak) geçişsiz düzensiz bir fiildir ve 2. hali 'rose'dur. 'Raise' nesne alan farklı bir fiildir.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g02-q17",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "Yesterday, Kemal woke up early, _____ a quick breakfast, and ran to the bus stop.",
    "options": [
      "ate",
      "eaten",
      "eats",
      "was eating"
    ],
    "correctAnswer": "ate",
    "explanation": "Geçmişte art arda, kronolojik sırayla gerçekleşen tamamlanmış eylemler dizisinde tüm fiiller Past Simple (V2) olur: woke up, ate, ran.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g02-q18",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "I didn't like the documentary film because it _____ too slow and uninteresting.",
    "options": [
      "was",
      "were",
      "did",
      "is"
    ],
    "correctAnswer": "was",
    "explanation": "Filmin niteliği anlatılmaktadır (slow and uninteresting - sıfat tamlaması). Tekil özne 'it' ile geçmiş zamanda 'was' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g02-q19",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "Kerem _____ twenty euros from his brother to purchase his school supplies.",
    "options": [
      "borrowed",
      "lent",
      "borrow",
      "borrowing"
    ],
    "correctAnswer": "borrowed",
    "explanation": "'Borrow' (ödünç almak) düzenli bir fiildir (borrowed). 'Lend' (ödünç vermek) ise eylemin tersi yöndedir.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g02-q20",
    "topicId": "a2-g02",
    "level": "A2",
    "question": "How much _____ that vintage watch _____ when your grandfather bought it?",
    "options": [
      "did / cost",
      "did / costed",
      "was / cost",
      "does / costed"
    ],
    "correctAnswer": "did / cost",
    "explanation": "'Cost' (mal olmak/fiyatında olmak) fiilinin üç hali de 'cost'tur ('costed' diye bir form yoktur). Soru 'Did + özne + cost' şeklinde kurulur.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g03-q01",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "Yesterday at 6:30 PM, I _____ dinner in the kitchen when the doorbell rang.",
    "options": [
      "was cooking",
      "cooked",
      "am cooking",
      "have cooked"
    ],
    "correctAnswer": "was cooking",
    "explanation": "Geçmişte belirli bir saatte (Yesterday at 6:30 PM) devam etmekte olan uzun eylem için Past Continuous (was cooking) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g03-q02",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "While the children _____ in the garden, it suddenly began to rain heavily.",
    "options": [
      "were playing",
      "was playing",
      "played",
      "are playing"
    ],
    "correctAnswer": "were playing",
    "explanation": "\"While\" bağlacından sonra devam eden süreç eylemi gelir. \"The children\" çoğul özne olduğu için \"were playing\" doğrudur.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g03-q03",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "What _____ you doing when the power went out last night?",
    "options": [
      "were",
      "was",
      "did",
      "are"
    ],
    "correctAnswer": "were",
    "explanation": "\"You\" öznesi ve \"doing\" (V-ing) fiili ile Past Continuous soru cümlesi \"Were you doing...?\" şeklinde kurulur.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g03-q04",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "Selin broke her glasses while she _____ her bedroom yesterday afternoon.",
    "options": [
      "was cleaning",
      "cleaned",
      "were cleaning",
      "is cleaning"
    ],
    "correctAnswer": "was cleaning",
    "explanation": "Odayı temizlemek devam eden uzun eylemdir (\"while she was cleaning\"), gözlüğün kırılması (broke) ise o esnada gerçekleşen kısa olaydır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g03-q05",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "I called Mert three times yesterday evening, but he didn’t answer because he _____ a shower.",
    "options": [
      "was taking",
      "took",
      "takes",
      "were taking"
    ],
    "correctAnswer": "was taking",
    "explanation": "Telefon çaldığı sırada Mert duş alma eyleminin ortasındaydı (devam eden eylem: was taking).",
    "difficulty": "easy"
  },
  {
    "id": "a2-g03-q06",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "While I was studying for my exam, my roommates _____ loudly in the living room.",
    "options": [
      "were talking",
      "was talking",
      "talked",
      "have talked"
    ],
    "correctAnswer": "were talking",
    "explanation": "Geçmişte aynı anda paralel olarak devam eden iki uzun eylemde her iki cümlecik de Past Continuous olur (\"my roommates\" çoğul → were talking).",
    "difficulty": "medium"
  },
  {
    "id": "a2-g03-q07",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "We were walking along the beach when we _____ a beautiful seashell.",
    "options": [
      "found",
      "were finding",
      "find",
      "are finding"
    ],
    "correctAnswer": "found",
    "explanation": "Sahilde yürürken (uzun eylem: were walking) deniz kabuğu bulmak anlık bir olaydır; \"when\" cümleciğinde Past Simple (found) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g03-q08",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "Although the teacher was explaining the grammar rule, Kerem _____ to her.",
    "options": [
      "wasn’t listening",
      "weren’t listening",
      "didn’t listened",
      "isn’t listening"
    ],
    "correctAnswer": "wasn’t listening",
    "explanation": "Öğretmen dersi anlatırken Kerem o esnada dinlemiyordu. Tekil özne (Kerem) ile olumsuz Past Continuous \"wasn’t listening\" olur.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g03-q09",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "At this time last week, we _____ on a plane to London.",
    "options": [
      "were sitting",
      "sat",
      "was sitting",
      "are sitting"
    ],
    "correctAnswer": "were sitting",
    "explanation": "\"At this time last week\" (geçen hafta tam bu vakitlerde) ifadesi geçmişte devam eden eylemi vurgular; \"we\" ile \"were sitting\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g03-q10",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "I didn’t ask the bus driver for directions because I already _____ the way to the museum.",
    "options": [
      "knew",
      "was knowing",
      "know",
      "were knowing"
    ],
    "correctAnswer": "knew",
    "explanation": "\"Know\" (bilmek) bir durum fiilidir (state verb) ve \"-ing\" takısı almaz. Bu nedenle Past Continuous yerine Past Simple (knew) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g03-q11",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "_____ it snowing when you left the office last night?",
    "options": [
      "Was",
      "Were",
      "Did",
      "Is"
    ],
    "correctAnswer": "Was",
    "explanation": "Özne \"it\" ve ana fiil \"snowing\" (V-ing) olduğu için geçmiş zaman soru cümlesi \"Was it snowing...?\" ile başlar.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g03-q12",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "As the train _____ the station, the passengers stood up to take their bags.",
    "options": [
      "was approaching",
      "approached",
      "is approaching",
      "were approaching"
    ],
    "correctAnswer": "was approaching",
    "explanation": "\"As\" bağlacı \"while\" gibi \"...iken\" anlamında süreç bildirir. Tren istasyona yaklaşırken (was approaching) yolcular ayağa kalktı.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g03-q13",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "When the manager walked into the room, the employees _____ about the new project.",
    "options": [
      "were discussing",
      "was discussing",
      "discussed",
      "are discussing"
    ],
    "correctAnswer": "were discussing",
    "explanation": "Müdür odaya girdiğinde (walked) çalışanlar yeni projeyi tartışmaktaydı (devam eden eylem: were discussing).",
    "difficulty": "medium"
  },
  {
    "id": "a2-g03-q14",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "She _____ a heavy coat because the wind was blowing very coldly.",
    "options": [
      "was wearing",
      "wears",
      "were wearing",
      "is wearing"
    ],
    "correctAnswer": "was wearing",
    "explanation": "Rüzgâr soğuk eserken o sırada kalın bir palto giyiyordu (tekil özne \"she\" → was wearing).",
    "difficulty": "easy"
  },
  {
    "id": "a2-g03-q15",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "While I was looking for my keys, I _____ an old photo album in the drawer.",
    "options": [
      "came across",
      "was coming across",
      "come across",
      "am coming across"
    ],
    "correctAnswer": "came across",
    "explanation": "Anahtarları aramak süreçtir (was looking for), çekmecede eski albüme rastlamak ise anlık tamamlanan olaydır (came across - V2).",
    "difficulty": "hard"
  },
  {
    "id": "a2-g03-q16",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "When I arrived home last night, I unlocked the door, turned on the light, and _____ my shoes.",
    "options": [
      "took off",
      "was taking off",
      "take off",
      "were taking off"
    ],
    "correctAnswer": "took off",
    "explanation": "Geçmişte arka arkaya, sırayla yapılan tamamlanmış eylemlerin tamamı Past Simple (arrived, unlocked, turned on, took off) ile ifade edilir.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g03-q17",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "Why _____ they laughing so loudly when we entered the café?",
    "options": [
      "were",
      "did",
      "was",
      "have"
    ],
    "correctAnswer": "were",
    "explanation": "\"They\" öznesi ve \"laughing\" (V-ing) fiiliyle kurulan Past Continuous sorusunda yardımcı fiil \"were\" olmalıdır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g03-q18",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "When I saw Elif at the bookstore, she _____ a dictionary because she needed one for her course.",
    "options": [
      "wanted",
      "was wanting",
      "wants",
      "were wanting"
    ],
    "correctAnswer": "wanted",
    "explanation": "\"Want\" (istemek) bir durum fiilidir (state verb) ve Past Continuous (was wanting) olarak kullanılamaz; Past Simple (wanted) doğrudur.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g03-q19",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "My father fell asleep while he _____ the news on television.",
    "options": [
      "was watching",
      "watched",
      "were watching",
      "watches"
    ],
    "correctAnswer": "was watching",
    "explanation": "Televizyonda haberleri izlerken (uzun eylem: while he was watching) uyuyakaldı (kısa eylem: fell asleep).",
    "difficulty": "easy"
  },
  {
    "id": "a2-g03-q20",
    "topicId": "a2-g03",
    "level": "A2",
    "question": "Nobody noticed that the baby _____ towards the stairs while everyone was chatting.",
    "options": [
      "was crawling",
      "crawls",
      "were crawling",
      "has crawled"
    ],
    "correctAnswer": "was crawling",
    "explanation": "Herkes sohbet ederken bebek o esnada merdivenlere doğru emekliyordu (\"the baby\" tekil özne → was crawling).",
    "difficulty": "medium"
  },
  {
    "id": "a2-g04-q01",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "Look at those dark black clouds gathering in the sky! It _____ rain very soon.",
    "options": [
      "is going to",
      "will",
      "rains",
      "shall"
    ],
    "correctAnswer": "is going to",
    "explanation": "Gökyüzündeki kara bulutlar gibi gözle görülür somut bir kanıt olduğunda yapılan tahminler için 'is going to' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g04-q02",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "The phone in the corridor is ringing. — Don't get up, I _____ answer it!",
    "options": [
      "will",
      "am going to",
      "am answering",
      "shall to"
    ],
    "correctAnswer": "will",
    "explanation": "Konuşma anında, anlık olarak verilen ani kararlar için 'will' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g04-q03",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "We _____ our flight tickets already; we are flying to Berlin on Friday morning.",
    "options": [
      "have bought",
      "will buy",
      "are buying",
      "buy"
    ],
    "correctAnswer": "have bought",
    "explanation": "'Already' (çoktan) biletlerin önceden alındığını bildirir; bu sayede cuma günkü uçuş Present Continuous ile kesin düzenleme olarak anlatılmıştır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g04-q04",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "I promise I _____ tell your personal secret to anyone in the office.",
    "options": [
      "won't",
      "am not going to",
      "don't",
      "not will"
    ],
    "correctAnswer": "won't",
    "explanation": "Söz verme (promise), güvence veya yemin durumlarında daima 'will / won't' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g04-q05",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "Sude _____ a surgeon when she finishes medical school; that has been her dream for years.",
    "options": [
      "is going to be",
      "will be",
      "is being",
      "be"
    ],
    "correctAnswer": "is going to be",
    "explanation": "Önceden belirlenmiş kariyer hedefi, plan ve niyetler için 'be going to' yapısı tercih edilir.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g04-q06",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "I think renewable energy sources _____ replace fossil fuels within fifty years.",
    "options": [
      "will",
      "are going to",
      "are replacing",
      "shall"
    ],
    "correctAnswer": "will",
    "explanation": "'I think' (bence) ile ifade edilen kişisel inanç ve genel tahminlerde 'will' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g04-q07",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "Watch out! You _____ spill that boiling tea onto your lap.",
    "options": [
      "are going to",
      "will",
      "shall",
      "spill"
    ],
    "correctAnswer": "are going to",
    "explanation": "'Watch out!' (Dikkat et!) gibi anlık uyarılar ve fiziksel tehlike belirtileri 'be going to' gerektirir.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g04-q08",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "What _____ you _____ this weekend? Have you arranged anything special?",
    "options": [
      "are / going to do",
      "will / do",
      "do / do",
      "are / done"
    ],
    "correctAnswer": "are / going to do",
    "explanation": "Bir kişinin hafta sonu için önceden tasarladığı plan ve niyetlerini sormak için 'What are you going to do?' kalıbı kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g04-q09",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "I _____ my dentist tomorrow at 4:30 PM; my appointment is written in my calendar.",
    "options": [
      "am seeing",
      "will see",
      "see",
      "saw"
    ],
    "correctAnswer": "am seeing",
    "explanation": "Günü ve saati kesinleşmiş, randevusu alınmış (appointment) görüşmeler için Present Continuous ('am seeing') en doğru yapıdır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g04-q10",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "Don't carry that heavy box alone. Wait a second, I _____ you with it.",
    "options": [
      "will help",
      "am going to help",
      "help",
      "helped"
    ],
    "correctAnswer": "will help",
    "explanation": "Konuşma anında yapılan teklif ve yardım etme kararları için 'will + V1' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g04-q11",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "According to the official timetable, the express train to Ankara _____ at 08:30 tomorrow morning.",
    "options": [
      "leaves",
      "will leave",
      "is going to leave",
      "is leaving"
    ],
    "correctAnswer": "leaves",
    "explanation": "Tren, uçak, sinema veya ders programı gibi resmi bir zaman çizelgesine (timetable/schedule) bağlı gelecek eylemler Simple Present ile ifade edilir.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g04-q12",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "As soon as I _____ at the office tomorrow, I will email you the updated contract.",
    "options": [
      "arrive",
      "will arrive",
      "arrived",
      "am going to arrive"
    ],
    "correctAnswer": "arrive",
    "explanation": "'As soon as, when, before, after' gibi zaman bağlaçlarının bulunduğu yan cümleciklerde gelecek zaman için 'will' KULLANILMAZ; Simple Present (arrive) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g04-q13",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "We have run out of milk. — Really? In that case, I _____ to the grocery store right now.",
    "options": [
      "will go",
      "am going",
      "go",
      "went"
    ],
    "correctAnswer": "will go",
    "explanation": "Eksik konuşma anında fark edildiğinde verilen spontane ve anlık karar için 'will go' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g04-q14",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "Climate scientists believe that global sea levels _____ rise significantly over the next century.",
    "options": [
      "will",
      "are going to",
      "are rising",
      "shall"
    ],
    "correctAnswer": "will",
    "explanation": "Geleceğe dair genel tahmin ve öngörülerde 'believe that ... will' yapısı standarttır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g04-q15",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "Look at that exhausted athlete staggering on the track! He _____ finish the race.",
    "options": [
      "isn't going to",
      "won't",
      "doesn't",
      "not will"
    ],
    "correctAnswer": "isn't going to",
    "explanation": "Koşucunun sendeleyen fiziksel durumu gözlemlenebilir bir kanıttır. Somut kanıta dayanan negatif tahmin 'isn't going to finish' ile ifade edilir.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g04-q16",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "We _____ married on the fifteenth of June; the wedding invitations have already been printed and mailed.",
    "options": [
      "are getting",
      "will get",
      "get",
      "got"
    ],
    "correctAnswer": "are getting",
    "explanation": "Davetiyelerin çoktan basılıp postalanmış olması (invitations have been mailed), organizasyonun kesinleştirildiğini gösterir. Bu kesin düzenleme Present Continuous ('are getting married') gerektirir.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g04-q17",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "If you don't take an umbrella in this storm, you _____ get completely soaked.",
    "options": [
      "will",
      "are going to",
      "are",
      "shall to"
    ],
    "correctAnswer": "will",
    "explanation": "First Conditional (Tip 1 Koşul) cümlelerinin ana cümlesinde gelecek zaman sonucu olarak 'will + V1' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g04-q18",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "I _____ an intensive German course next Monday; I have already paid the tuition fee.",
    "options": [
      "am starting",
      "will start",
      "start",
      "started"
    ],
    "correctAnswer": "am starting",
    "explanation": "Kurs ücreti ödenmiş ve kayıt tamamlanmıştır; kesinleşmiş düzenleme için Present Continuous ('am starting') en uygunudur.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g04-q19",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "My stomach feels terrible after that seafood. I think I _____ be sick.",
    "options": [
      "am going to",
      "will",
      "shall",
      "am"
    ],
    "correctAnswer": "am going to",
    "explanation": "Kişinin midesinin kötü olması fiziksel bir kanıttır; vücuttaki doğrudan belirtiye dayanan tahmin 'am going to be sick' şeklinde kurulur.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g04-q20",
    "topicId": "a2-g04",
    "level": "A2",
    "question": "The bags are all packed by the hallway because my parents _____ to Bodrum early tomorrow morning.",
    "options": [
      "are driving",
      "will drive",
      "drive",
      "drove"
    ],
    "correctAnswer": "are driving",
    "explanation": "Bavullar çoktan toplandığı için eylem kesinleşmiş bir seyahat planıdır ve Present Continuous ('are driving') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g05-q01",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "Have you _____ visited the historic Topkapı Palace in Istanbul?",
    "options": [
      "ever",
      "never",
      "already",
      "yet"
    ],
    "correctAnswer": "ever",
    "explanation": "Hayat tecrübelerini sorarken soru cümlelerinde özne ile fiil arasında 'ever' (hiç) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g05-q02",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "Ahmet has _____ tasted octopus; he really dislikes trying unfamiliar seafood.",
    "options": [
      "never",
      "ever",
      "yet",
      "already"
    ],
    "correctAnswer": "never",
    "explanation": "Olumlu yapılı cümlede 'asla / hiçbir zaman / hiç' anlamını vermek için 'never' kullanılır ('has never tasted').",
    "difficulty": "easy"
  },
  {
    "id": "a2-g05-q03",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "I have _____ finished my biology assignment, so I can finally go out for a walk.",
    "options": [
      "just",
      "yet",
      "ever",
      "never"
    ],
    "correctAnswer": "just",
    "explanation": "'Just', bir eylemin 'az önce / henüz' tamamlandığını ve sonucunun şu an taze olduğunu anlatır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g05-q04",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "The courier hasn't delivered the parcel we ordered last week _____.",
    "options": [
      "yet",
      "already",
      "just",
      "ever"
    ],
    "correctAnswer": "yet",
    "explanation": "'Yet', olumsuz cümlelerin ve soru cümlelerinin EN SONUNDA 'henüz' anlamında kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g05-q05",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "She _____ three detailed reports to her manager so far this morning.",
    "options": [
      "has sent",
      "have sent",
      "sented",
      "has send"
    ],
    "correctAnswer": "has sent",
    "explanation": "Üçüncü tekil özne 'She' ile 'has' kullanılır ve 'send' düzensiz fiilinin 3. hali (V3) 'sent'tir.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g05-q06",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "We _____ in this quiet coastal neighborhood since 2019.",
    "options": [
      "have lived",
      "has lived",
      "lived",
      "are living"
    ],
    "correctAnswer": "have lived",
    "explanation": "'Since 2019' geçmişte başlayıp günümüze kadar devam eden durumu bildirir; çoğul özne 'We' ile 'have lived' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g05-q07",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "Where is Caner? — He is not in the office; he _____ to the bank to deposit some money.",
    "options": [
      "has gone",
      "has been",
      "went",
      "have gone"
    ],
    "correctAnswer": "has gone",
    "explanation": "Caner şu anda ofiste olmadığına ve bankaya gidip henüz dönmediğine göre 'has gone' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g05-q08",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "I cannot open my front door right now because I _____ my apartment keys.",
    "options": [
      "have lost",
      "lost",
      "has lost",
      "am losing"
    ],
    "correctAnswer": "have lost",
    "explanation": "Anahtar geçmişte kaybedilmiştir ancak kapıyı açamama sonucu ŞU ANDA geçerlidir; bu nedenle Present Perfect ('have lost') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g05-q09",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "Have you cleaned the kitchen counter and washed the dishes _____?",
    "options": [
      "yet",
      "already",
      "never",
      "just"
    ],
    "correctAnswer": "yet",
    "explanation": "Soru cümlelerinin sonunda 'yaptın mı / ettin mi?' anlamında 'yet' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g05-q10",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "Sude has _____ submitted all her college applications, even though the deadline is next month.",
    "options": [
      "already",
      "yet",
      "ever",
      "since"
    ],
    "correctAnswer": "already",
    "explanation": "Başvuruların beklenenden önce, 'çoktan' bitirildiğini olumlu cümlede vurgulamak için 'already' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g05-q11",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "I have been to London several times, so I _____ the public transport system quite well.",
    "options": [
      "know",
      "have known",
      "knew",
      "am knowing"
    ],
    "correctAnswer": "know",
    "explanation": "'Have been to London' geçmişteki deneyimi anlatır; bunun sonucu olarak şehri ŞU AN iyi tanıyorum/biliyorum derken Simple Present ('know') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g05-q12",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "My grandparents _____ happily married for more than forty years.",
    "options": [
      "have been",
      "has been",
      "were",
      "are being"
    ],
    "correctAnswer": "have been",
    "explanation": "'For more than forty years' (40 yıldan fazla süredir) geçmişten bugüne süren durumu belirtir. Çoğul özne 'My grandparents' ile 'have been' doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g05-q13",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "Okan _____ a stylish new smartphone yesterday afternoon at the shopping mall.",
    "options": [
      "bought",
      "has bought",
      "have bought",
      "buys"
    ],
    "correctAnswer": "bought",
    "explanation": "DİKKAT: Cümlede 'yesterday afternoon' (dün öğleden sonra) gibi net ve bitmiş geçmiş zaman ifadesi olduğunda Present Perfect KULLANILAMAZ; Past Simple ('bought') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g05-q14",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "We _____ each other very well since our primary school days.",
    "options": [
      "have known",
      "have knew",
      "knew",
      "know"
    ],
    "correctAnswer": "have known",
    "explanation": "'Since' ile geçmişten bugüne süregelen tanışıklık anlatılır. 'Know' fiilinin 3. hali (V3) 'known'dur ('have known').",
    "difficulty": "medium"
  },
  {
    "id": "a2-g05-q15",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "I _____ never _____ such a breathtaking sunset in my entire life.",
    "options": [
      "have / seen",
      "has / seen",
      "did / see",
      "have / saw"
    ],
    "correctAnswer": "have / seen",
    "explanation": "Hayat boyu yapılan deneyim vurgusunda 'I have never seen...' kalıbı kullanılır ('see' fiilinin 3. hali 'seen'dir).",
    "difficulty": "hard"
  },
  {
    "id": "a2-g05-q16",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "My older sister _____ with high honors from university two years ago.",
    "options": [
      "graduated",
      "has graduated",
      "have graduated",
      "graduates"
    ],
    "correctAnswer": "graduated",
    "explanation": "'Two years ago' (iki yıl önce) kesin bir geçmiş zaman belirtecidir; 'ago' olan cümlelerde Present Perfect kullanılmaz, Past Simple (V2: graduated) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g05-q17",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "Tolga is back home from his vacation in Antalya; he _____ a fantastic time there.",
    "options": [
      "had",
      "has had",
      "has",
      "have had"
    ],
    "correctAnswer": "had",
    "explanation": "Tolga tatilden çoktan dönmüştür (is back); tatildeki harika zaman artık bitmiş bir geçmişe ait olduğu için 'had' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g05-q18",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "How many cups of espresso _____ you _____ so far today?",
    "options": [
      "have / drunk",
      "did / drink",
      "have / drank",
      "do / drink"
    ],
    "correctAnswer": "have / drunk",
    "explanation": "'So far today' (bugün şu ana kadar) henüz bitmemiş bir zaman dilimini ifade eder; bu nedenle Present Perfect ('have you drunk') kullanılır ('drink'in 3. hali 'drunk'tır).",
    "difficulty": "hard"
  },
  {
    "id": "a2-g05-q19",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "Zeynep isn't at her office desk right now. She _____ to the downstairs café to buy a sandwich.",
    "options": [
      "has gone",
      "has been",
      "went",
      "is going"
    ],
    "correctAnswer": "has gone",
    "explanation": "Zeynep şu an masasında değil; kafeteryaya gitmiş ve henüz dönmemiştir. Bu durum için 'has gone' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g05-q20",
    "topicId": "a2-g05",
    "level": "A2",
    "question": "Look at that cracked glass! Who _____ that to the window?",
    "options": [
      "has done",
      "did do",
      "have done",
      "does"
    ],
    "correctAnswer": "has done",
    "explanation": "Kırık cam gözümüzün önündedir (etki/sonuç şu anda ortada); zamanı belirsiz bu eylem için tekil soru 'Who has done that?' olarak sorulur.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g06-q01",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "My little sister is only four years old, so she _____ read or write yet.",
    "options": [
      "can't",
      "couldn't",
      "isn't able",
      "doesn't can"
    ],
    "correctAnswer": "can't",
    "explanation": "Cümle şimdiki zamandadır ('is only four') ve genel bir yetenek eksikliğinden bahsedilmektedir. 'Isn't able' sonrasında 'to' eksik olduğu için 'can't' doğrudur.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g06-q02",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "_____ your grandfather ride a horse when he lived in the village?",
    "options": [
      "Could",
      "Can",
      "Was",
      "Did"
    ],
    "correctAnswer": "Could",
    "explanation": "Geçmiş zamanda ('when he lived') yalın fiil ('ride') ile genel bir yetenek sorulurken 'Could + özne + V1?' yapısı kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g06-q03",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "Sude is very talented in music; she _____ play both the guitar and the flute.",
    "options": [
      "can",
      "is able",
      "could to",
      "can to"
    ],
    "correctAnswer": "can",
    "explanation": "Şimdiki zamandaki ('is very talented') genel bir yeteneği anlatırken yalın fiilden ('play') önce 'can' kullanılır. 'Can to' veya 'to' olmadan 'is able' yanlıştır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g06-q04",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "I looked everywhere for my house keys this morning, but I _____ find them.",
    "options": [
      "couldn't",
      "can't",
      "wasn't able",
      "didn't could"
    ],
    "correctAnswer": "couldn't",
    "explanation": "Bu sabah geçmişte ('looked') yaşanan olumsuz durumda 'couldn't + V1' kullanılır. 'Wasn't able' sonrasında 'to' olmadığı için elenir.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g06-q05",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "Dolphins are very intelligent animals and they _____ communicate with each other using sounds.",
    "options": [
      "can",
      "could to",
      "are able",
      "cans"
    ],
    "correctAnswer": "can",
    "explanation": "Genel bir doğa gerçeği ve yetenek anlatılmaktadır. 'Can' kipinden sonra doğrudan yalın fiil ('communicate') gelir.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g06-q06",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "Are you _____ lift this heavy suitcase by yourself, or do you need help?",
    "options": [
      "able to",
      "can",
      "could",
      "able"
    ],
    "correctAnswer": "able to",
    "explanation": "Cümle 'Are you...' ile başladığı için 'be able to + V1' kalıbının 'able to' kısmı gelmelidir; 'Are you can' yapısı İngilizcede yoktur.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g06-q07",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "When you finish this six-month course, you will _____ speak German with confidence.",
    "options": [
      "be able to",
      "can",
      "could",
      "able to"
    ],
    "correctAnswer": "be able to",
    "explanation": "Gelecek zaman kipi 'will' sonrasında 'can' veya 'could' gelemez; 'will be able to + V1' kalıbı zorunludur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g06-q08",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "We sat at the very back of the hall, but we _____ hear the orchestra clearly.",
    "options": [
      "could",
      "can",
      "were able",
      "managed"
    ],
    "correctAnswer": "could",
    "explanation": "'Hear' bir duyu fiilidir ve geçmiş zaman ('sat') bağlamında 'could hear' ile kullanılır. 'Were able' ve 'managed' sonrasında 'to' eksiktir.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g06-q09",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "Mozart _____ compose complex music when he was only five years old.",
    "options": [
      "could",
      "can",
      "is able to",
      "was able"
    ],
    "correctAnswer": "could",
    "explanation": "Geçmişteki ('when he was only five') genel bir yetenekten bahsedildiği için 'could + V1' doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g06-q10",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "The mountain road was covered in ice, yet the driver _____ reach the hotel safely.",
    "options": [
      "was able to",
      "could",
      "can",
      "were able to"
    ],
    "correctAnswer": "was able to",
    "explanation": "Geçmişte zorlu bir engelin üstesinden gelinerek başarılan TEK SEFERLİK olumlu bir olayda 'could' değil, tekil özneye uygun 'was able to' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g06-q11",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "I haven't _____ contact Kerem since he changed his phone number last month.",
    "options": [
      "been able to",
      "could",
      "can",
      "be able to"
    ],
    "correctAnswer": "been able to",
    "explanation": "'Haven't' (Present Perfect) yardımcı fiilinden sonra V3 formu olan 'been able to + V1' gelir; 'can/could' Perfect yapılarda kullanılamaz.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g06-q12",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "Even a small spark _____ start a huge forest fire in dry summer weather.",
    "options": [
      "can",
      "is able",
      "could to",
      "was able"
    ],
    "correctAnswer": "can",
    "explanation": "Genel bilimsel olasılık anlatılırken 'can + V1' (can start) kullanılır. Diğer şıklarda 'to' eksiktir veya yapı bozuktur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g06-q13",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "Why _____ your teammates able to attend the training session yesterday afternoon?",
    "options": [
      "weren't",
      "wasn't",
      "couldn't",
      "didn't"
    ],
    "correctAnswer": "weren't",
    "explanation": "Cümlede 'able to' bulunduğu ve özne çoğul ('your teammates') olduğu için geçmiş zamanda 'weren't' yardımcı fiili kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g06-q14",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "Because of the thick fog at the airport last night, no planes _____ take off.",
    "options": [
      "could",
      "can",
      "were able",
      "could to"
    ],
    "correctAnswer": "could",
    "explanation": "Cümlede 'no planes' zaten olumsuzluk bildirdiği için geçmiş zamanda 'could + V1' kullanılır. 'Were able' sonrasında 'to' yoktur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g06-q15",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "Although the opposing team played very well, our players _____ score a goal in the last minute and won.",
    "options": [
      "were able to",
      "could",
      "can",
      "was able to"
    ],
    "correctAnswer": "were able to",
    "explanation": "Geçmişte belirli bir maçta çaba gösterilerek başarılan tek seferlik olumlu eylemde (managed to) 'could' kullanılmaz; çoğul özneyle 'were able to' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g06-q16",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "I would love to _____ play the cello like a professional musician one day.",
    "options": [
      "be able to",
      "can",
      "could",
      "able to"
    ],
    "correctAnswer": "be able to",
    "explanation": "'Would love to' yapısındaki 'to' mastar ekinden sonra kip ('can/could') gelemez; yalın 'be able to' yapısı gelir.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g06-q17",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "When I entered the kitchen, I _____ smell something burning in the oven.",
    "options": [
      "could",
      "can",
      "was able",
      "am able to"
    ],
    "correctAnswer": "could",
    "explanation": "'Smell' bir duyu fiili olduğu için geçmişte tek seferlik bir anda dahi 'could + V1' ile kullanılır. 'Was able' şıkkında 'to' eksiktir.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g06-q18",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "Fortunately, the trapped miners _____ rescue teams through an old radio and were saved.",
    "options": [
      "were able to contact",
      "could contact",
      "can contact",
      "was able to contact"
    ],
    "correctAnswer": "were able to contact",
    "explanation": "'Fortunately' ve 'were saved' ifadeleri geçmişte tek seferlik zorlu bir başarıyı gösterir; olumlu cümlede çoğul özneyle 'were able to contact' doğrudur, 'could' tekil başarıda kullanılmaz.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g06-q19",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "How many pages _____ translate since you started working this morning?",
    "options": [
      "have you been able to",
      "could you",
      "can you",
      "did you able to"
    ],
    "correctAnswer": "have you been able to",
    "explanation": "'Since you started...' ifadesi ana cümlede Present Perfect gerektirir; soru formu 'have you been able to + V1' olarak kurulur.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g06-q20",
    "topicId": "a2-g06",
    "level": "A2",
    "question": "After searching for three hours in the dark forest, the hikers finally _____ find the path.",
    "options": [
      "were able to",
      "could",
      "can",
      "are able to"
    ],
    "correctAnswer": "were able to",
    "explanation": "Üç saatlik zorlu bir arayışın sonunda ('finally') geçmişte tek seferlik bir başarı elde edildiği için 'could' değil, 'were able to' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g07-q01",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "You _____ touch that hot pan on the stove; you will burn your hand!",
    "options": [
      "mustn't",
      "don't have to",
      "haven't to",
      "should"
    ],
    "correctAnswer": "mustn't",
    "explanation": "Elini yakma tehlikesi olduğu için güçlü bir uyarı ve yasaklama söz konusudur; bu nedenle 'mustn't' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g07-q02",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "Tomorrow is a national holiday, so we _____ go to school.",
    "options": [
      "don't have to",
      "mustn't",
      "doesn't have to",
      "should"
    ],
    "correctAnswer": "don't have to",
    "explanation": "Resmi tatil olduğu için okula gitmeye 'gerek yoktur' (zorunluluk yokluğu). 'We' öznesiyle 'don't have to' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g07-q03",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "If you have a terrible toothache, you _____ see a dentist as soon as possible.",
    "options": [
      "should",
      "mustn't",
      "don't have to",
      "have"
    ],
    "correctAnswer": "should",
    "explanation": "Diş ağrısı çeken birine tavsiye ve öneride bulunurken 'should + V1' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g07-q04",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "All drivers _____ stop when the traffic light turns red.",
    "options": [
      "must",
      "shouldn't",
      "don't have to",
      "has to"
    ],
    "correctAnswer": "must",
    "explanation": "Trafik kuralı ve yasal zorunluluk bildirildiği için çoğul özneyle ('All drivers') 'must' kullanılır ('has to' tekil özne içindir).",
    "difficulty": "easy"
  },
  {
    "id": "a2-g07-q05",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "My sister is a nurse, so she _____ wear a uniform at the hospital every day.",
    "options": [
      "has to",
      "have to",
      "must to",
      "should to"
    ],
    "correctAnswer": "has to",
    "explanation": "3. tekil şahıs özne ('she') ile dış kurallardan kaynaklanan zorunluluk 'has to + V1' ile ifade edilir. 'Must to' ve 'should to' yanlıştır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g07-q06",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "You _____ drink so much coffee late at night; it will keep you awake.",
    "options": [
      "shouldn't",
      "don't have to",
      "must",
      "doesn't have to"
    ],
    "correctAnswer": "shouldn't",
    "explanation": "Gece geç saatte çok kahve içmemek gerektiğine dair olumsuz tavsiye verildiği için 'shouldn't' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g07-q07",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "The museum entrance is completely free on Tuesdays, so visitors _____ pay for a ticket.",
    "options": [
      "don't have to",
      "mustn't",
      "shouldn't",
      "hasn't to"
    ],
    "correctAnswer": "don't have to",
    "explanation": "Girişin ücretsiz olması ödeme yapmanın yasak olduğunu değil, 'gerekli olmadığını' (don't have to) gösterir.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g07-q08",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "Because the elevator was out of order yesterday, we _____ walk up to the seventh floor.",
    "options": [
      "had to",
      "must",
      "have to",
      "should"
    ],
    "correctAnswer": "had to",
    "explanation": "'Yesterday' ve 'was' geçmiş zaman bildirmektedir. 'Must' kipinin geçmiş hali olmadığından geçmiş zorunluluk için 'had to' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g07-q09",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "_____ Emre have to work at the office this Saturday, or is he off?",
    "options": [
      "Does",
      "Do",
      "Must",
      "Is"
    ],
    "correctAnswer": "Does",
    "explanation": "'Have to' kalıbıyla 3. tekil şahıs ('Emre') için geniş zamanda soru sorulurken 'Does + özne + have to + V1?' yapısı kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g07-q10",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "Passengers _____ leave their bags unattended at the airport; security will remove them.",
    "options": [
      "mustn't",
      "don't have to",
      "didn't have to",
      "ought to"
    ],
    "correctAnswer": "mustn't",
    "explanation": "Havalimanında çantaları sahipsiz bırakmak güvenlik kuralları gereği kesinlikle yasaktır ('mustn't').",
    "difficulty": "medium"
  },
  {
    "id": "a2-g07-q11",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "Selin _____ cook dinner tonight because her husband has already ordered food from a restaurant.",
    "options": [
      "doesn't have to",
      "mustn't",
      "don't have to",
      "hadn't to"
    ],
    "correctAnswer": "doesn't have to",
    "explanation": "Yemek çoktan sipariş edildiği için Selin'in yemek pişirmesine gerek yoktur; tekil özne ('Selin') ile 'doesn't have to' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g07-q12",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "You really _____ read this historical novel; the story is truly fascinating!",
    "options": [
      "must",
      "don't have to",
      "have",
      "must to"
    ],
    "correctAnswer": "must",
    "explanation": "Konuşmacının bir kitabı veya filmi içtenlikle ve güçlü bir şekilde tavsiye etmesi durumunda 'must + V1' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g07-q13",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "We _____ wait long for the bus yesterday morning because it arrived right on time.",
    "options": [
      "didn't have to",
      "mustn't",
      "don't have to",
      "weren't have to"
    ],
    "correctAnswer": "didn't have to",
    "explanation": "'Yesterday morning' ve 'arrived' geçmiş zamandır; geçmişte bir şeye gerek kalmadığını anlatmak için 'didn't have to' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g07-q14",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "Everyone _____ respect traffic rules to prevent accidents on the roads.",
    "options": [
      "ought to",
      "should to",
      "must to",
      "have to"
    ],
    "correctAnswer": "ought to",
    "explanation": "'Everyone' tekil kabul edilir ('have to' uyumsuzdur, 'has to' olmalıydı). 'Should' ve 'must' ise 'to' almaz. 'Ought to + V1' tamamen doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g07-q15",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "Keep this password in a safe place, and you _____ tell it to anyone, not even your closest friends.",
    "options": [
      "mustn't",
      "don't have to",
      "didn't have to",
      "ought not"
    ],
    "correctAnswer": "mustn't",
    "explanation": "Şifreyi kimseye söylememek güçlü bir uyarı ve yasaktır ('mustn't'). 'Ought not' sonrasında 'to' eksik olduğu için yanlıştır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g07-q16",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "If you want to work in that country next year, you _____ apply for a work permit in advance.",
    "options": [
      "will have to",
      "will must",
      "had to",
      "didn't have to"
    ],
    "correctAnswer": "will have to",
    "explanation": "'Next year' gelecek zaman bildirmektedir. 'Will must' diye bir yapı yoktur; gelecekteki zorunluluk 'will have to' ile ifade edilir.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g07-q17",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "Attendance at the workshop is optional; you _____ come if you are busy, but you are welcome.",
    "options": [
      "don't have to",
      "mustn't",
      "shouldn't",
      "cannot"
    ],
    "correctAnswer": "don't have to",
    "explanation": "'Optional' (isteğe bağlı) ve 'you are welcome' ifadeleri katılmanın yasak olmadığını, sadece zorunlu olmadığını ('don't have to') kanıtlar.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g07-q18",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "How much tax _____ a small business owner have to pay every year?",
    "options": [
      "does",
      "do",
      "is",
      "must"
    ],
    "correctAnswer": "does",
    "explanation": "Cümlede 'have to pay' bulunduğu ve özne tekil ('a small business owner') olduğu için geniş zaman soru yardımcı fiili 'does' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g07-q19",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "When my father was in the army, he _____ wake up at five o'clock every single morning.",
    "options": [
      "had to",
      "must",
      "has to",
      "should"
    ],
    "correctAnswer": "had to",
    "explanation": "'When my father was in the army' geçmişte kalmış bir dönemdir. Geçmişteki zorunluluklar 'had to' ile anlatılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g07-q20",
    "topicId": "a2-g07",
    "level": "A2",
    "question": "You _____ wash those strawberries; I have already washed them three times!",
    "options": [
      "don't have to",
      "mustn't to",
      "haven't to",
      "ought not"
    ],
    "correctAnswer": "don't have to",
    "explanation": "Çilekler zaten üç kez yıkandığı için tekrar yıkamaya gerek yoktur ('don't have to'). Diğer şıklar dil bilgisi açısından hatalıdır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g08-q01",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "Excuse me, Professor, _____ I ask a question about the homework assignment?",
    "options": [
      "may",
      "might to",
      "would",
      "mustn't"
    ],
    "correctAnswer": "may",
    "explanation": "Bir profesörden resmi ve kibar bir şekilde izin isterken 'I' öznesiyle 'May I + V1?' yapısı kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g08-q02",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "_____ you please turn down the volume of the television? I have a headache.",
    "options": [
      "Could",
      "May",
      "Might",
      "Must"
    ],
    "correctAnswer": "Could",
    "explanation": "Karşıdaki kişiden ('you' öznesi) kibarca bir ricada bulunurken 'Could you please + V1?' kullanılır; 'May you' veya 'Might you' kullanılmaz.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g08-q03",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "Take an umbrella with you because it _____ rain later this afternoon.",
    "options": [
      "might",
      "can to",
      "may to",
      "would"
    ],
    "correctAnswer": "might",
    "explanation": "Öğleden sonra yağmur yağma olasılığını (%50 ihtimal) belirtirken yalın fiilden önce 'might' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g08-q04",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "Waiter, _____ we have the bill when you have a moment, please?",
    "options": [
      "could",
      "may to",
      "would",
      "are"
    ],
    "correctAnswer": "could",
    "explanation": "'We' öznesiyle restoranda kibarca bir şey isterken 'Could we have...?' kalıbı kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g08-q05",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "I am not sure where Ahmet is right now; he _____ be in the library.",
    "options": [
      "may",
      "can to",
      "mustn't",
      "needs"
    ],
    "correctAnswer": "may",
    "explanation": "'I am not sure' belirsizlik bildirdiği için şimdiki zamandaki olasılığı ifade etmek üzere 'may be' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g08-q06",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "_____ you help me carry these boxes to the upstairs office, please?",
    "options": [
      "Can",
      "May",
      "Might",
      "Shouldn't"
    ],
    "correctAnswer": "Can",
    "explanation": "'You' öznesiyle ricada bulunurken 'Can you...?' kullanılır; 'May you' ve 'Might you' rica cümlelerinde kullanılmaz.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g08-q07",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "We haven't made a final decision yet, but we _____ move to İzmir next summer.",
    "options": [
      "might",
      "must",
      "can't",
      "have to"
    ],
    "correctAnswer": "might",
    "explanation": "'Henüz kesin karar vermedik' ifadesi gelecekteki eylemin yalnızca bir olasılık olduğunu gösterir; bu nedenle 'might' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g08-q08",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "Customer: Could I use your rest room, please? — Shopkeeper: Yes, of course you _____.",
    "options": [
      "can",
      "could",
      "might",
      "would"
    ],
    "correctAnswer": "can",
    "explanation": "'Could I...?' ile kibarca izin istendiğinde, izin verme cevabı 'Yes, you can' (veya 'may') ile verilir; 'Yes, you could' denmez.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g08-q09",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "Don't ring the doorbell! The baby _____ be sleeping right now.",
    "options": [
      "might",
      "can to",
      "couldn't",
      "would"
    ],
    "correctAnswer": "might",
    "explanation": "Bebeğin şu anda uyuyor olma ihtimaline karşı uyarı yapılmaktadır; olasılık bildiren 'might be sleeping' doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g08-q10",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "Sude _____ not come to the cinema with us tonight because she feels a bit tired.",
    "options": [
      "might",
      "could",
      "can",
      "would"
    ],
    "correctAnswer": "might",
    "explanation": "'Belki gelmez / gelmeme ihtimali var' anlamındaki olumsuz olasılık 'might not' veya 'may not' ile kurulur; 'could not' ve 'can not' imkânsızlık bildirir.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g08-q11",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "All passengers _____ now board the plane through Gate 14.",
    "options": [
      "may",
      "might to",
      "could to",
      "would"
    ],
    "correctAnswer": "may",
    "explanation": "Havalimanı anonsu gibi resmi ortamlarda izin verirken 'may + V1' (may board) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g08-q12",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "_____ you mind opening the window for a few minutes? It's very stuffy in here.",
    "options": [
      "Would",
      "Could",
      "May",
      "Might"
    ],
    "correctAnswer": "Would",
    "explanation": "'Mind + V-ing' ile kurulan kibar rica kalıbı 'Would you mind doing...?' (veya 'Do you mind') şeklindedir; 'Could you mind' kullanılmaz.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g08-q13",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "Be careful with that stray dog; it looks frightened and it _____ bite you.",
    "options": [
      "could",
      "may to",
      "mustn't",
      "needs"
    ],
    "correctAnswer": "could",
    "explanation": "Korkmuş bir köpeğin ısırma olasılığını anlatırken 'could + V1' (might/may anlamında) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g08-q14",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "_____ I borrow your umbrella for ten minutes? I just need to walk to the pharmacy.",
    "options": [
      "Could",
      "Would",
      "Might to",
      "Must"
    ],
    "correctAnswer": "Could",
    "explanation": "'I' öznesiyle kibarca izin isterken 'Could I borrow...?' kullanılır. 'Would I' izin isteme kalıbı değildir.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g08-q15",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "Traffic is quite heavy this morning, so I _____ be ten minutes late for the interview, though I hope not.",
    "options": [
      "may",
      "can't",
      "mustn't",
      "should"
    ],
    "correctAnswer": "may",
    "explanation": "'Though I hope not' (umarım olmam ama) ifadesi gecikmenin istenmeyen bir olasılık olduğunu gösterir; bu nedenle 'may' doğrudur.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g08-q16",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "I knocked on Mr. Kaya's door twice, but nobody answered; he _____ not be at home right now.",
    "options": [
      "may",
      "could",
      "can",
      "would"
    ],
    "correctAnswer": "may",
    "explanation": "Evde olmama ihtimalini ('belki evde değildir') anlatmak için olumsuzda 'may not be' kullanılır; 'could not be' ve 'cannot be' kesin imkânsızlık katar.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g08-q17",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "Excuse me, sir, _____ you tell me how to get to the Archaeological Museum?",
    "options": [
      "could",
      "may",
      "might",
      "shall"
    ],
    "correctAnswer": "could",
    "explanation": "Yoldaki birinden ('you' öznesi) kibarca adres tarif etmesini rica ederken 'Could you tell me...?' kullanılır. 'May/Might/Shall you' yanlıştır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g08-q18",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "Let's call the restaurant before we go; they _____ not have any free tables on Friday evening.",
    "options": [
      "might",
      "could",
      "can",
      "must"
    ],
    "correctAnswer": "might",
    "explanation": "Cuma akşamı boş masa bulamama olasılığını ('belki boş masa yoktur') ifade ederken olumsuz olasılık kipi 'might not' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g08-q19",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "Student: May I leave the classroom early today? — Teacher: No, I'm afraid you _____.",
    "options": [
      "can't",
      "couldn't",
      "might not",
      "wouldn't"
    ],
    "correctAnswer": "can't",
    "explanation": "İzin isteyen birine olumsuz yanıt verirken (izin vermeme) 'No, you can't' veya 'No, you may not' kullanılır; 'couldn't / might not' kullanılmaz.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g08-q20",
    "topicId": "a2-g08",
    "level": "A2",
    "question": "Whose gloves are these on the counter? — I'm not sure, but they _____ belong to Zeynep.",
    "options": [
      "could",
      "can to",
      "mustn't",
      "are able"
    ],
    "correctAnswer": "could",
    "explanation": "'I'm not sure' ile desteklenen olumlu tahmin/olasılık cümlesinde 'could belong' (= might/may belong) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g09-q01",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "Winter in Erzurum is much _____ than winter in Antalya.",
    "options": [
      "colder",
      "coldest",
      "more cold",
      "cold"
    ],
    "correctAnswer": "colder",
    "explanation": "Cümlede 'than' ile iki şehir karşılaştırılmaktadır. 'Cold' tek heceli kısa bir sıfat olduğu için '-er' alır ('colder').",
    "difficulty": "easy"
  },
  {
    "id": "a2-g09-q02",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "The Nile is _____ river in the world.",
    "options": [
      "the longest",
      "longer",
      "most long",
      "the most long"
    ],
    "correctAnswer": "the longest",
    "explanation": "'In the world' tüm dünyadaki nehirler arasında en üstünlük (Superlative) bildirir; kısa sıfat 'long' -> 'the longest' olur.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g09-q03",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "A sports car is _____ than an ordinary family car.",
    "options": [
      "more expensive",
      "expensiver",
      "most expensive",
      "the most expensive"
    ],
    "correctAnswer": "more expensive",
    "explanation": "'Expensive' üç heceli uzun bir sıfattır ve cümlede 'than' bulunduğu için comparative hali 'more expensive' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g09-q04",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "Who is the _____ person in your family?",
    "options": [
      "oldest",
      "older",
      "more old",
      "most old"
    ],
    "correctAnswer": "oldest",
    "explanation": "Boşluktan önce 'the' ve devamında 'in your family' grup ifadesi olduğu için superlative 'oldest' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g09-q05",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "My new apartment is _____ than my old one; it has four large rooms.",
    "options": [
      "bigger",
      "biger",
      "biggest",
      "more big"
    ],
    "correctAnswer": "bigger",
    "explanation": "'Big' tek heceli ve sessiz-sesli-sessiz harfle biten bir sıfattır; 'than' ile comparative yapılırken son harf çiftleşir ('bigger').",
    "difficulty": "easy"
  },
  {
    "id": "a2-g09-q06",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "Homemade food is always _____ than fast food for your health.",
    "options": [
      "better",
      "gooder",
      "best",
      "more good"
    ],
    "correctAnswer": "better",
    "explanation": "'Good' düzensiz bir sıfattır; 'than' ile yapılan ikili karşılaştırmada comparative hali 'better' olur ('gooder' diye bir kelime yoktur).",
    "difficulty": "easy"
  },
  {
    "id": "a2-g09-q07",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "That was _____ movie I have ever watched in my entire life!",
    "options": [
      "the worst",
      "worse",
      "the baddest",
      "more bad"
    ],
    "correctAnswer": "the worst",
    "explanation": "'I have ever watched' kalıbı daima Superlative gerektirir. 'Bad' sıfatının superlative hali 'the worst'tür.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g09-q08",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "The second question on the test was much _____ than the first one.",
    "options": [
      "easier",
      "more easy",
      "easiest",
      "easyer"
    ],
    "correctAnswer": "easier",
    "explanation": "Sonu 'sessiz + y' ile biten 'easy' sıfatı comparative olurken 'y' düşer ve '-ier' alır ('easier').",
    "difficulty": "medium"
  },
  {
    "id": "a2-g09-q09",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "Travelling by train is not as _____ as travelling by plane.",
    "options": [
      "fast",
      "faster",
      "fastest",
      "more fast"
    ],
    "correctAnswer": "fast",
    "explanation": "'As ... as' (veya 'not as ... as') eşitlik karşılaştırması kalıbının arasına giren sıfat hiçbir ek almaz, yalın ('fast') kalır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g09-q10",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "Hagia Sophia is one of _____ historical monuments in Turkey.",
    "options": [
      "the most famous",
      "more famous",
      "famousest",
      "the famousest"
    ],
    "correctAnswer": "the most famous",
    "explanation": "'One of the + Superlative + çoğul isim' kalıbında uzun sıfat 'famous' -> 'the most famous' olarak çekimlenir.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g09-q11",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "Which planet is _____ from the Sun: Saturn or Neptune?",
    "options": [
      "farther",
      "farthest",
      "more far",
      "farer"
    ],
    "correctAnswer": "farther",
    "explanation": "Sadece iki gezegen (Saturn or Neptune) kıyaslandığı için 'far' düzensiz sıfatının comparative hali olan 'farther' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g09-q12",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "Since she started her new job, Zeynep looks _____ than she used to be.",
    "options": [
      "happier",
      "more happy",
      "happiest",
      "happyer"
    ],
    "correctAnswer": "happier",
    "explanation": "Cümlede 'than' vardır; sonu '-y' ile biten 'happy' sıfatı '-ier' alarak 'happier' olur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g09-q13",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "August is usually the _____ month of the year in the Mediterranean region.",
    "options": [
      "hottest",
      "hotter",
      "most hot",
      "hotest"
    ],
    "correctAnswer": "hottest",
    "explanation": "'The ... month of the year' superlative gerektirir; 'hot' sıfatında son sessiz harf çiftleşerek 'hottest' olur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g09-q14",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "This armchair is far _____ than that wooden chair over there.",
    "options": [
      "more comfortable",
      "comfortabler",
      "most comfortable",
      "as comfortable"
    ],
    "correctAnswer": "more comfortable",
    "explanation": "'Than' ve güçlendirici 'far' ile birlikte uzun sıfat 'comfortable' comparative formda ('more comfortable') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g09-q15",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "Sude is my _____ friend; we have known each other since primary school.",
    "options": [
      "closest",
      "the closest",
      "closer",
      "more close"
    ],
    "correctAnswer": "closest",
    "explanation": "Superlative sıfatın önünde 'my' iyelik sıfatı bulunduğunda ayrıca 'the' kullanılmaz ('my closest friend').",
    "difficulty": "hard"
  },
  {
    "id": "a2-g09-q16",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "The patient's condition is getting slightly _____ every day thanks to the new treatment.",
    "options": [
      "better",
      "best",
      "good",
      "the best"
    ],
    "correctAnswer": "better",
    "explanation": "'Slightly' (biraz) derecelendirme zarfı ve 'get + comparative' (gittikçe daha iyi olmak) yapısı nedeniyle 'better' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g09-q17",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "Of the three laptops on the table, the silver one has _____ battery life.",
    "options": [
      "the longest",
      "longer",
      "more long",
      "as long"
    ],
    "correctAnswer": "the longest",
    "explanation": "'Of the three laptops' (üç dizüstü bilgisayar arasından) ifadesi ikiden fazla öğeyi kıyasladığı için Superlative ('the longest') gerektirir.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g09-q18",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "Today's math test wasn't so _____ as the one we had last month.",
    "options": [
      "complicated",
      "more complicated",
      "most complicated",
      "the most complicated"
    ],
    "correctAnswer": "complicated",
    "explanation": "Olumsuz eşitlik karşılaştırması olan 'not so ... as' kalıbında da tıpkı 'as ... as' gibi yalın sıfat ('complicated') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g09-q19",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "Buying a monthly bus pass is much _____ expensive than buying single tickets every day.",
    "options": [
      "less",
      "least",
      "fewer",
      "little"
    ],
    "correctAnswer": "less",
    "explanation": "'Expensive' uzun sıfatıyla 'than' kullanarak 'daha az pahalı' demek için comparative 'less' kullanılır ('less expensive than').",
    "difficulty": "hard"
  },
  {
    "id": "a2-g09-q20",
    "topicId": "a2-g09",
    "level": "A2",
    "question": "Please do not hesitate to call our office if you require any _____ details about the contract.",
    "options": [
      "further",
      "far",
      "furthest",
      "more far"
    ],
    "correctAnswer": "further",
    "explanation": "'Further' kelimesi 'daha uzak' anlamının yanı sıra isimlerden önce 'ek / ilave / daha fazla' (further details/information) anlamında kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g10-q01",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "There aren't _____ apples left in the basket; we need to buy some from the market.",
    "options": [
      "any",
      "some",
      "much",
      "a little"
    ],
    "correctAnswer": "any",
    "explanation": "'Aren't' olumsuz cümle olduğu ve 'apples' sayılabilen çoğul isim olduğu için 'any' kullanılır ('much/a little' sayılamayanlarla kullanılır).",
    "difficulty": "easy"
  },
  {
    "id": "a2-g10-q02",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "How _____ cousins do you have on your mother's side?",
    "options": [
      "many",
      "much",
      "a little",
      "any"
    ],
    "correctAnswer": "many",
    "explanation": "'Cousins' sayılabilen çoğul bir isimdir; miktarını sorarken 'How many' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g10-q03",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "I usually put just _____ milk in my coffee because I don't like it too milky.",
    "options": [
      "a little",
      "a few",
      "many",
      "any"
    ],
    "correctAnswer": "a little",
    "explanation": "'Milk' sayılamayan (uncountable) bir isimdir ve olumlu cümlede 'biraz' anlamında 'a little' alır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g10-q04",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "We met _____ interesting people while we were travelling around Spain.",
    "options": [
      "some",
      "any",
      "much",
      "a little"
    ],
    "correctAnswer": "some",
    "explanation": "Olumlu cümlede çoğul sayılabilen isimle ('people') 'birkaç / bazı' anlamında 'some' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g10-q05",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "How _____ sugar would you like in your tea?",
    "options": [
      "much",
      "many",
      "few",
      "a few"
    ],
    "correctAnswer": "much",
    "explanation": "'Sugar' sayılamayan bir isim olduğu için miktar sorusu 'How much' ile kurulur.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g10-q06",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "Sude invited _____ close friends to her birthday dinner last night.",
    "options": [
      "a few",
      "a little",
      "much",
      "any"
    ],
    "correctAnswer": "a few",
    "explanation": "'Friends' sayılabilen çoğul bir isimdir ve olumlu cümlede 'birkaç' anlamında 'a few' alır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g10-q07",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "Would you like _____ hot soup before the main course arrives?",
    "options": [
      "some",
      "any",
      "many",
      "a few"
    ],
    "correctAnswer": "some",
    "explanation": "'Would you like...?' bir ikram ve teklif sorusu olduğu için soru cümlesinde 'any' değil, 'some' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g10-q08",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "We didn't experience _____ traffic on the highway this morning, so we arrived early.",
    "options": [
      "much",
      "many",
      "a few",
      "some"
    ],
    "correctAnswer": "much",
    "explanation": "'Traffic' İngilizcede sayılamayan (uncountable) bir isimdir ve olumsuz cümlede ('didn't experience') 'much' ile kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g10-q09",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "Could I have _____ more bread with my salad, please?",
    "options": [
      "some",
      "any",
      "many",
      "a few"
    ],
    "correctAnswer": "some",
    "explanation": "'Could I have...?' kibarca bir şey rica etme sorusudur ve sayılamayan 'bread' ile 'some' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g10-q10",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "There were _____ children playing in the park because the weather was sunny and warm.",
    "options": [
      "a lot of",
      "much",
      "a little",
      "any"
    ],
    "correctAnswer": "a lot of",
    "explanation": "'Children' düzensiz çoğul (sayılabilen) bir isimdir; olumlu cümlede 'çok sayıda' anlamında 'a lot of' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g10-q11",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "I need _____ advice on how to prepare for the scholarship interview.",
    "options": [
      "some",
      "many",
      "a few",
      "any"
    ],
    "correctAnswer": "some",
    "explanation": "'Advice' (tavsiye) sayılamayan bir isimdir; olumlu cümlede 'biraz tavsiye' anlamında 'some' alır ('many/a few' çoğullarla, 'any' olumsuz/soruyla gelir).",
    "difficulty": "medium"
  },
  {
    "id": "a2-g10-q12",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "How _____ furniture do you plan to buy for your new living room?",
    "options": [
      "much",
      "many",
      "a few",
      "some"
    ],
    "correctAnswer": "much",
    "explanation": "'Furniture' (mobilya) İngilizcede sayılamayan tekil bir isimdir; bu nedenle 'How much' ile sorulur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g10-q13",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "Wait a minute! I have _____ questions to ask the tour guide before we leave.",
    "options": [
      "a few",
      "a little",
      "much",
      "any"
    ],
    "correctAnswer": "a few",
    "explanation": "'Questions' sayılabilen çoğul bir isimdir; olumlu cümlede 'birkaç soru' anlamında 'a few' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g10-q14",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "Unfortunately, the police haven't found _____ useful information about the missing painting yet.",
    "options": [
      "any",
      "some",
      "many",
      "a few"
    ],
    "correctAnswer": "any",
    "explanation": "Cümle olumsuz ('haven't found') ve 'information' sayılamayan bir isim olduğu için 'any' doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g10-q15",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "Very _____ people know about this hidden beach, so it is always peaceful and quiet.",
    "options": [
      "few",
      "little",
      "much",
      "a little"
    ],
    "correctAnswer": "few",
    "explanation": "'People' sayılabilen çoğul isimdir. Plajın hep sakin olması 'çok az (neredeyse hiç) insanın' bildiğini gösterir ('very few people').",
    "difficulty": "hard"
  },
  {
    "id": "a2-g10-q16",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "We can't afford to stay at that luxury resort because we have very _____ money left.",
    "options": [
      "little",
      "few",
      "many",
      "a few"
    ],
    "correctAnswer": "little",
    "explanation": "'Money' sayılamayan bir isimdir ve 'kalmaya gücümüz yetmez' ifadesi paranın yetersiz/çok az olduğunu gösterir ('very little money').",
    "difficulty": "hard"
  },
  {
    "id": "a2-g10-q17",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "Don't worry, we still have _____ time before the boarding gate closes, so we can grab a coffee.",
    "options": [
      "a little",
      "little",
      "a few",
      "many"
    ],
    "correctAnswer": "a little",
    "explanation": "'Time' sayılamayan bir isimdir ve kahve alabilecek kadar 'biraz (yeterli)' vakit olduğu için olumlu anlamlı 'a little' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g10-q18",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "There is too _____ noise in this café; let's go somewhere quieter to study.",
    "options": [
      "much",
      "many",
      "a lot of",
      "a few"
    ],
    "correctAnswer": "much",
    "explanation": "'Noise' burada sayılamayan bir isimdir ve önünde 'too' zarfı bulunduğu için 'too much' kullanılır ('too a lot of' olmaz).",
    "difficulty": "hard"
  },
  {
    "id": "a2-g10-q19",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "How _____ loaves of bread should I buy from the bakery on my way home?",
    "options": [
      "many",
      "much",
      "a little",
      "any"
    ],
    "correctAnswer": "many",
    "explanation": "'Bread' tek başına sayılamaz ancak 'loaves of bread' (ekmek somunları) çoğul ve sayılabilen bir birim olduğu için 'How many' alır!",
    "difficulty": "hard"
  },
  {
    "id": "a2-g10-q20",
    "topicId": "a2-g10",
    "level": "A2",
    "question": "Ahmet speaks English very well; he makes only _____ grammar mistakes when he writes essays.",
    "options": [
      "a few",
      "a little",
      "much",
      "any"
    ],
    "correctAnswer": "a few",
    "explanation": "'Mistakes' sayılabilen çoğul bir isimdir ve 'only' sonrasında sadece 'a few' (only a few mistakes = sadece birkaç hata) gelebilir.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g11-q01",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "This is _____ new bicycle. My father bought it for me yesterday.",
    "options": [
      "my",
      "mine",
      "me",
      "myself"
    ],
    "correctAnswer": "my",
    "explanation": "İsimden (new bicycle) önce iyelik sıfatı (possessive adjective) olan \"my\" gelir. \"Mine\" iyelik zamiridir ve arkasından isim almaz.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g11-q02",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "Is this red notebook _____ or does it belong to Sarah?",
    "options": [
      "yours",
      "your",
      "you",
      "yourself"
    ],
    "correctAnswer": "yours",
    "explanation": "Cümle sonunda isim olmaksızın sahiplik bildirmek için iyelik zamiri (possessive pronoun) olan \"yours\" (seninki) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g11-q03",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "Ali forgot to bring _____ jacket, so he is feeling cold now.",
    "options": [
      "his",
      "him",
      "he",
      "himself"
    ],
    "correctAnswer": "his",
    "explanation": "Tekil erkek özne (Ali) için iyelik sıfatı \"his\" (onun) kullanılır ve \"jacket\" ismini niteler.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g11-q04",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "We love our school, and the teachers always praise _____ students.",
    "options": [
      "their",
      "theirs",
      "them",
      "they"
    ],
    "correctAnswer": "their",
    "explanation": "Çoğul 3. şahıs (the teachers) için iyelik sıfatı \"their\" (onların) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g11-q05",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "I have lost my pen. Can I borrow _____ for a moment?",
    "options": [
      "yours",
      "your",
      "you",
      "yourselves"
    ],
    "correctAnswer": "yours",
    "explanation": "Tekrar \"pen\" dememek için \"seninki\" anlamında iyelik zamiri olan \"yours\" tercih edilir.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g11-q06",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "The cat is drinking _____ milk from the small bowl.",
    "options": [
      "its",
      "it's",
      "it",
      "itself"
    ],
    "correctAnswer": "its",
    "explanation": "Hayvan ve cansız varlıklar için iyelik sıfatı kesme işareti olmadan \"its\" (onun) şeklinde yazılır. \"It's\" ise \"it is\" kısaltmasıdır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g11-q07",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "That blue coat looks exactly like mine, but it is actually _____.",
    "options": [
      "hers",
      "her",
      "she",
      "herself"
    ],
    "correctAnswer": "hers",
    "explanation": "İsim olmadan cümlenin nesnesi konumunda \"onunki\" anlamını vermek için iyelik zamiri \"hers\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g11-q08",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "Our house has three rooms, while _____ has four large bedrooms.",
    "options": [
      "theirs",
      "their",
      "them",
      "they"
    ],
    "correctAnswer": "theirs",
    "explanation": "\"Onlarınki / onların evi\" yerine tek başına özne olarak iyelik zamiri \"theirs\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g11-q09",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "Whose keys are these on the table? They are _____.",
    "options": [
      "mine",
      "my",
      "me",
      "myself"
    ],
    "correctAnswer": "mine",
    "explanation": "\"Whose...?\" (Kimin...?) sorusuna isim kullanmadan cevap verirken \"benimki\" anlamında \"mine\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g11-q10",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "Sude and _____ brother always walk to school together every morning.",
    "options": [
      "her",
      "hers",
      "she",
      "herself"
    ],
    "correctAnswer": "her",
    "explanation": "Sude'nin erkek kardeşi ifadesinde isimden (brother) önce dişil iyelik sıfatı \"her\" gelir.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g11-q11",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "You should be proud of _____ great achievement on the final exam.",
    "options": [
      "your",
      "yours",
      "you",
      "yourself"
    ],
    "correctAnswer": "your",
    "explanation": "\"Great achievement\" bir isim tamlamasıdır; dolayısıyla niteleyici olarak iyelik sıfatı \"your\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g11-q12",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "This umbrella isn't mine. Is it _____ or someone else's?",
    "options": [
      "hers",
      "her",
      "she",
      "her umbrella's"
    ],
    "correctAnswer": "hers",
    "explanation": "İsimsiz kullanımda \"onunki\" demek için tekil dişi şahıs iyelik zamiri \"hers\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g11-q13",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "The bird hurt _____ wing when it tried to fly through the open window.",
    "options": [
      "its",
      "it's",
      "it",
      "itself"
    ],
    "correctAnswer": "its",
    "explanation": "Kuşun kanadı tamlamasında iyelik sıfatı apostrofsuz \"its\" olmalıdır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g11-q14",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "Our car is much older than _____, but it runs very smoothly.",
    "options": [
      "theirs",
      "their",
      "them",
      "they car"
    ],
    "correctAnswer": "theirs",
    "explanation": "Karşılaştırma cümlesinde \"onların arabasından\" anlamında \"theirs\" (onlarınki) iyelik zamiri kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g11-q15",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "A good friend of _____ called me last night to share some exciting news.",
    "options": [
      "mine",
      "my",
      "me",
      "myself"
    ],
    "correctAnswer": "mine",
    "explanation": "\"A friend of mine\" (arkadaşlarımdan biri / bir arkadaşım) kalıbında \"of\" edatından sonra iyelik zamiri (mine, yours, hers) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g11-q16",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "She borrowed a dictionary of _____ because she had left her own at home.",
    "options": [
      "his",
      "him",
      "he",
      "himself"
    ],
    "correctAnswer": "his",
    "explanation": "\"A dictionary of his\" (onun sözlüklerinden biri) çift iyelik (double genitive) kalıbıdır ve \"his\" iyelik zamiriyle kurulur.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g11-q17",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "These seats are not ours; _____ are located in the very front row.",
    "options": [
      "ours",
      "our",
      "us",
      "our ones"
    ],
    "correctAnswer": "ours",
    "explanation": "Cümlede özne olarak \"bizimkiler / bizim koltuklarımız\" anlamında iyelik zamiri \"ours\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g11-q18",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "Is that mobile phone on the kitchen counter _____ or your sister's?",
    "options": [
      "yours",
      "your",
      "you",
      "yourself"
    ],
    "correctAnswer": "yours",
    "explanation": "Karşılaştırmalı ve alternatifli sorularda nesne yerine iyelik zamiri \"yours\" (seninki) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g11-q19",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "Two colleagues of _____ are planning to give a presentation at the conference.",
    "options": [
      "theirs",
      "their",
      "them",
      "they"
    ],
    "correctAnswer": "theirs",
    "explanation": "\"Of\" edatlı sahiplik yapısında (two colleagues of theirs) iyelik zamiri \"theirs\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g11-q20",
    "topicId": "a2-g11",
    "level": "A2",
    "question": "Every country has _____ own unique traditions and cultural heritage.",
    "options": [
      "its",
      "it's",
      "their",
      "his"
    ],
    "correctAnswer": "its",
    "explanation": "\"Every country\" tekil bir özne olduğu için ona ait anlamında tekil iyelik sıfatı \"its\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g12-q01",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "Our English lesson starts _____ 9 o'clock every weekday morning.",
    "options": [
      "at",
      "in",
      "on",
      "to"
    ],
    "correctAnswer": "at",
    "explanation": "Saat bildiren ifadelerde (at 9 o'clock) zaman edatı olarak daima \"at\" kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g12-q02",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "We usually go on vacation _____ July when the weather is warm.",
    "options": [
      "in",
      "on",
      "at",
      "by"
    ],
    "correctAnswer": "in",
    "explanation": "Aylardan, mevsimlerden ve yıllardan önce zaman edatı olarak \"in\" kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g12-q03",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "I always play football with my classmates _____ Sunday afternoons.",
    "options": [
      "on",
      "in",
      "at",
      "for"
    ],
    "correctAnswer": "on",
    "explanation": "Haftanın günleri ve günün belirli bölümleriyle (on Sunday afternoons) \"on\" edatı kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g12-q04",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "There is a lovely family picture hanging _____ the wall in the living room.",
    "options": [
      "on",
      "in",
      "at",
      "under"
    ],
    "correctAnswer": "on",
    "explanation": "Duvarda asılı olma durumunda temas belirten yer edatı \"on\" (on the wall) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g12-q05",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "The students are sitting _____ the classroom waiting for their teacher.",
    "options": [
      "in",
      "on",
      "at",
      "to"
    ],
    "correctAnswer": "in",
    "explanation": "Kapalı veya sınırları belirli bir alanın içinde bulunurken yer edatı \"in\" kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g12-q06",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "My grandmother goes to bed very early _____ night.",
    "options": [
      "at",
      "in",
      "on",
      "during"
    ],
    "correctAnswer": "at",
    "explanation": "\"Geceleyin\" derken \"at night\" kalıbı kullanılır (in the morning / in the evening ile karıştırılmamalıdır).",
    "difficulty": "easy"
  },
  {
    "id": "a2-g12-q07",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "The supermarket is located _____ the bakery and the post office.",
    "options": [
      "between",
      "among",
      "in",
      "under"
    ],
    "correctAnswer": "between",
    "explanation": "İki belirgin nesne ya da yerin arasında olma durumunda \"between\" edatı kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g12-q08",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "We agreed to meet our friends _____ the bus stop near the city park.",
    "options": [
      "at",
      "on",
      "in",
      "to"
    ],
    "correctAnswer": "at",
    "explanation": "Noktasal ve belirli bir buluşma konumu belirtirken \"at the bus stop\" şeklinde \"at\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g12-q09",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "The sleepy cat was resting peacefully _____ the wooden table.",
    "options": [
      "under",
      "between",
      "during",
      "until"
    ],
    "correctAnswer": "under",
    "explanation": "Masanın altında bulunma durumunu ifade etmek için \"under\" edatı kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g12-q10",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "She was born _____ October 14th, 2005 in a small town.",
    "options": [
      "on",
      "in",
      "at",
      "from"
    ],
    "correctAnswer": "on",
    "explanation": "Belirli ve tam gün belirten tarihlerde (gün + ay) \"on\" edatı kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g12-q11",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "The library will remain closed _____ Monday morning for maintenance.",
    "options": [
      "until",
      "during",
      "between",
      "at"
    ],
    "correctAnswer": "until",
    "explanation": "Bir eylemin veya durumun süreceği son noktayı (kadar) belirtmek için \"until\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g12-q12",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "Nobody was allowed to speak or use mobile phones _____ the exam.",
    "options": [
      "during",
      "until",
      "at",
      "on"
    ],
    "correctAnswer": "during",
    "explanation": "Belirli bir olayın veya sürecin \"esnasında / boyunca\" anlamını vermek için isimle birlikte \"during\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g12-q13",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "The pharmacy is right _____ to the bank on Main Street.",
    "options": [
      "next",
      "near",
      "beside",
      "close"
    ],
    "correctAnswer": "next",
    "explanation": "\"Hemen yanında\" anlamına gelen sabit edat öbeği \"next to\"dur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g12-q14",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "I will see you _____ lunchtime in the school cafeteria.",
    "options": [
      "at",
      "on",
      "in",
      "to"
    ],
    "correctAnswer": "at",
    "explanation": "Öğün vakitlerini belirten anlarda \"at lunchtime / at breakfast\" şeklinde \"at\" edatı kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g12-q15",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "We stayed _____ the hotel for three days while visiting the historic city.",
    "options": [
      "at",
      "on",
      "to",
      "onto"
    ],
    "correctAnswer": "at",
    "explanation": "Bir mekanda belirli bir amaçla kalındığında genel kurum ve konum olarak \"at the hotel\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g12-q16",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "The temperature dropped significantly _____ the middle of the night.",
    "options": [
      "in",
      "at",
      "on",
      "by"
    ],
    "correctAnswer": "in",
    "explanation": "\"Gecenin ortasında\" derken \"in the middle of the night\" ifadesinde \"in\" edatı kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g12-q17",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "There were many colorful butterflies flying _____ the blooming flowers.",
    "options": [
      "among",
      "between",
      "under",
      "next"
    ],
    "correctAnswer": "among",
    "explanation": "İkiden fazla nesnenin veya kalabalığın arasında olma durumunda \"among\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g12-q18",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "The train arrived exactly _____ time, so we did not miss our connection.",
    "options": [
      "on",
      "in",
      "at",
      "with"
    ],
    "correctAnswer": "on",
    "explanation": "\"On time\" tam vaktinde / dakik olarak anlamına gelen sabit bir zaman kalıbıdır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g12-q19",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "Please make sure you arrive _____ time for the start of the movie.",
    "options": [
      "in",
      "on",
      "at",
      "by"
    ],
    "correctAnswer": "in",
    "explanation": "\"In time for...\" bir etkinlik başlamadan önce, vaktinde yetişecek şekilde anlamında kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g12-q20",
    "topicId": "a2-g12",
    "level": "A2",
    "question": "He placed the old documents _____ the top shelf of the wooden cupboard.",
    "options": [
      "on",
      "at",
      "in",
      "into"
    ],
    "correctAnswer": "on",
    "explanation": "Raf yüzeyinin üstü kastedildiği için \"on the top shelf\" şeklinde \"on\" edatı kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g13-q01",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "She sings very _____, and everyone in the hall enjoys listening to her.",
    "options": [
      "beautifully",
      "beautiful",
      "beauty",
      "more beautiful"
    ],
    "correctAnswer": "beautifully",
    "explanation": "Eylemin (sings) nasıl yapıldığını nitelemek için durum zarfı (adverb of manner) olan \"beautifully\" (-ly eki) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g13-q02",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "Please drive _____ because the roads are wet and slippery after the rain.",
    "options": [
      "carefully",
      "careful",
      "care",
      "caring"
    ],
    "correctAnswer": "carefully",
    "explanation": "\"Drive\" fiilini niteleyen durum zarfı \"carefully\" (dikkatlice) olmalıdır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g13-q03",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "Ahmet speaks English very _____, so everyone understands him easily.",
    "options": [
      "fluently",
      "fluent",
      "fluency",
      "more fluent"
    ],
    "correctAnswer": "fluently",
    "explanation": "\"Speaks\" fiilini niteleyen zarf biçimi \"fluently\"dir.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g13-q04",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "The children played _____ in the garden all afternoon.",
    "options": [
      "happily",
      "happy",
      "happiness",
      "happier"
    ],
    "correctAnswer": "happily",
    "explanation": "\"Happy\" sıfatının zarf biçimi -y düşüp -ily alarak \"happily\" olur.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g13-q05",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "He answered all the teacher's questions _____ and got full marks.",
    "options": [
      "correctly",
      "correct",
      "correction",
      "correctness"
    ],
    "correctAnswer": "correctly",
    "explanation": "Fiili nitelemek için -ly ekli durum zarfı \"correctly\" (doğru bir şekilde) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g13-q06",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "The turtle moved _____ across the grass toward the pond.",
    "options": [
      "slowly",
      "slow",
      "slowness",
      "slower"
    ],
    "correctAnswer": "slowly",
    "explanation": "Hareket fiili \"moved\" durum zarfı olan \"slowly\" ile nitelenir.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g13-q07",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "Sude works very _____ every day to finish her graduation project.",
    "options": [
      "hard",
      "hardly",
      "harder",
      "hardest"
    ],
    "correctAnswer": "hard",
    "explanation": "\"Hard\" hem sıfat hem zarf olarak aynı biçimdedir (\"sıkı/çok çalışmak\"). \"Hardly\" ise \"neredeyse hiç\" anlamına gelir.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g13-q08",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "The young athlete can run extremely _____ in sprint competitions.",
    "options": [
      "fast",
      "fastly",
      "faster",
      "fastest"
    ],
    "correctAnswer": "fast",
    "explanation": "\"Fast\" düzensiz bir zarftır; asla -ly takısı almaz (\"fastly\" İngilizcede yoktur).",
    "difficulty": "medium"
  },
  {
    "id": "a2-g13-q09",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "Ali did very _____ on his chemistry exam and received the highest grade.",
    "options": [
      "well",
      "good",
      "goodly",
      "better"
    ],
    "correctAnswer": "well",
    "explanation": "\"Good\" sıfatının zarf karşılığı düzensiz olarak \"well\"dir. \"Did well\" doğru kullanımdır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g13-q10",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "The baby was sleeping so soundly that we opened the door _____.",
    "options": [
      "quietly",
      "quiet",
      "quietness",
      "more quiet"
    ],
    "correctAnswer": "quietly",
    "explanation": "Kapıyı açma eyleminin sessizce yapıldığını belirtmek için \"quietly\" zarfı kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g13-q11",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "The chef chopped the fresh vegetables _____ with a sharp knife.",
    "options": [
      "quickly",
      "quick",
      "quickness",
      "quicker"
    ],
    "correctAnswer": "quickly",
    "explanation": "Eylemin nasıl gerçekleştiğini ifade etmek için \"quickly\" durum zarfı kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g13-q12",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "The injured bird was breathing _____ after the rescue.",
    "options": [
      "weakly",
      "weak",
      "weakness",
      "weaker"
    ],
    "correctAnswer": "weakly",
    "explanation": "Nefes alma fiilini niteleyen zarf hali \"weakly\" (zayıfça) biçimindedir.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g13-q13",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "He explained the complex instructions so _____ that everyone understood immediately.",
    "options": [
      "clearly",
      "clear",
      "clearness",
      "clearer"
    ],
    "correctAnswer": "clearly",
    "explanation": "Açıklama eyleminin netliğini belirtmek için durum zarfı \"clearly\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g13-q14",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "The brave firefighter reacted _____ to save the frightened puppy.",
    "options": [
      "calmly",
      "calm",
      "calmness",
      "calmer"
    ],
    "correctAnswer": "calmly",
    "explanation": "\"Reacted\" fiilini niteleyen durum zarfı \"calmly\" (sakin bir şekilde) olmalıdır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g13-q15",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "I was so exhausted after the long hike that I could _____ keep my eyes open.",
    "options": [
      "hardly",
      "hard",
      "hardest",
      "hardy"
    ],
    "correctAnswer": "hardly",
    "explanation": "\"Hardly\" kısıtlayıcı bir sıklık/derece zarfıdır ve \"neredeyse hiç / güçlükle\" anlamına gelir.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g13-q16",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "The soup tastes _____ because the cook added fresh aromatic herbs.",
    "options": [
      "delicious",
      "deliciously",
      "more deliciously",
      "tasteful"
    ],
    "correctAnswer": "delicious",
    "explanation": "\"Taste\" duyu bildiren bağlayıcı bir fiildir (linking verb); bu nedenle zarf değil sıfat (delicious) alır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g13-q17",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "Although he felt _____, he managed to deliver an excellent speech.",
    "options": [
      "nervous",
      "nervously",
      "nervousness",
      "more nervously"
    ],
    "correctAnswer": "nervous",
    "explanation": "\"Feel\" his bildiren bağlayıcı fiil olduğu için doğrudan sıfat (nervous) ile tamamlanır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g13-q18",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "The music in the restaurant sounds too _____; could you please turn it down?",
    "options": [
      "loud",
      "loudly",
      "loudness",
      "more loudly"
    ],
    "correctAnswer": "loud",
    "explanation": "\"Sound\" bağlayıcı fiilinden sonra durum zarfı değil niteleyici sıfat (loud) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g13-q19",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "She looked _____ at the broken antique vase on the floor.",
    "options": [
      "sadly",
      "sad",
      "sadness",
      "more sad"
    ],
    "correctAnswer": "sadly",
    "explanation": "Burada \"look at\" bir bakma eylemi bildirdiğinden bağlayıcı fiil değildir; eylemi niteleyen zarf \"sadly\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g13-q20",
    "topicId": "a2-g13",
    "level": "A2",
    "question": "They solved the difficult puzzle surprisingly _____ in less than ten minutes.",
    "options": [
      "easily",
      "easy",
      "easiness",
      "easier"
    ],
    "correctAnswer": "easily",
    "explanation": "\"Easy\" sıfatı \"-ily\" alarak durum zarfı \"easily\" olur ve fiili niteler.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g14-q01",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "A doctor is a professional person _____ helps sick people get better.",
    "options": [
      "who",
      "which",
      "where",
      "when"
    ],
    "correctAnswer": "who",
    "explanation": "İnsanları niteleyen temel sıfat cümleciklerinde (relative clauses) ilgi zamiri olarak \"who\" kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g14-q02",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "This is the book _____ I borrowed from the municipal library yesterday.",
    "options": [
      "which",
      "who",
      "where",
      "whose"
    ],
    "correctAnswer": "which",
    "explanation": "Cansız nesneleri (the book) nitelemek için sıfat cümleciğinde \"which\" (veya that) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g14-q03",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "That is the Italian restaurant _____ we celebrated Sude's birthday last month.",
    "options": [
      "where",
      "which",
      "who",
      "when"
    ],
    "correctAnswer": "where",
    "explanation": "Bir eylemin gerçekleştiği yeri (the restaurant) nitelemek için mekan belirten \"where\" kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g14-q04",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "The girl _____ is sitting next to Ahmet is the new exchange student.",
    "options": [
      "who",
      "which",
      "where",
      "whose"
    ],
    "correctAnswer": "who",
    "explanation": "İnsan özne durumundaki \"The girl\" için \"who\" ilgi zamiri kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g14-q05",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "I have bought a smart watch _____ tracks my daily physical activity.",
    "options": [
      "which",
      "who",
      "where",
      "whose"
    ],
    "correctAnswer": "which",
    "explanation": "Cansız bir nesne olan \"smart watch\" nitelemek için \"which\" kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g14-q06",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "Is this the university campus _____ your older brother studies medicine?",
    "options": [
      "where",
      "which",
      "who",
      "that"
    ],
    "correctAnswer": "where",
    "explanation": "\"Kampüste okumak\" eyleminin geçtiği konumu nitelemek için yer zarfı \"where\" kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "a2-g14-q07",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "The architect _____ designed this modern bridge won an international award.",
    "options": [
      "who",
      "which",
      "where",
      "whom"
    ],
    "correctAnswer": "who",
    "explanation": "\"The architect\" bir insandır; eylemi yapan özne konumunda olduğu için \"who\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g14-q08",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "We stayed at a charming hotel _____ had a beautiful view of the sea.",
    "options": [
      "which",
      "where",
      "who",
      "whose"
    ],
    "correctAnswer": "which",
    "explanation": "Otel bir yer olmasına rağmen cümlecik içinde nesne/özne konumunda bir özelliğe sahip olduğu (\"had a view\") için \"where\" değil \"which\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g14-q09",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "Paris is the historic city _____ my parents first met thirty years ago.",
    "options": [
      "where",
      "which",
      "who",
      "that"
    ],
    "correctAnswer": "where",
    "explanation": "Anne babanın buluşma eyleminin gerçekleştiği yeri ifade ettiği için \"where\" uygundur.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g14-q10",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "The mobile phone _____ is lying on the wooden desk belongs to Mehmet.",
    "options": [
      "which",
      "who",
      "where",
      "whose"
    ],
    "correctAnswer": "which",
    "explanation": "Cansız bir nesne olan telefon niteleyen tanımlayıcı bağlaç \"which\"tir.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g14-q11",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "The kind woman _____ lives across the street always waters our plants.",
    "options": [
      "who",
      "which",
      "where",
      "whom"
    ],
    "correctAnswer": "who",
    "explanation": "Karşıda yaşayan kadını (insan) nitelediği için \"who\" ilgi zamiri kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g14-q12",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "This is the cozy cafe _____ I usually write my weekly essays.",
    "options": [
      "where",
      "which",
      "who",
      "when"
    ],
    "correctAnswer": "where",
    "explanation": "Yazma eyleminin yapıldığı mekanı nitelemek için \"where\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g14-q13",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "The delicious cake _____ my mother baked for the party was finished in minutes.",
    "options": [
      "which",
      "who",
      "where",
      "whose"
    ],
    "correctAnswer": "which",
    "explanation": "Pişirilen pastayı (cansız nesne) nitelemek için \"which\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g14-q14",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "I need to find a travel partner _____ speaks Spanish fluently.",
    "options": [
      "who",
      "which",
      "where",
      "whose"
    ],
    "correctAnswer": "who",
    "explanation": "Seyahat partneri bir insan olduğu için \"who\" ilgi zamiri kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "a2-g14-q15",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "This is the town _____ was severely damaged by the heavy earthquake.",
    "options": [
      "which",
      "where",
      "who",
      "when"
    ],
    "correctAnswer": "which",
    "explanation": "Kasaba bir mekan olmasına karşın arkasından doğrudan fiil (\"was damaged\") gelerek özne olduğu için \"where\" değil \"which\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g14-q16",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "The museum _____ we visited last weekend was founded in the nineteenth century.",
    "options": [
      "which",
      "where",
      "who",
      "when"
    ],
    "correctAnswer": "which",
    "explanation": "\"Visit\" fiili doğrudan nesne alır (visit the museum); bu nedenle yer edatı almaz ve \"which\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g14-q17",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "The bakery _____ makes the best sourdough bread is located near the park.",
    "options": [
      "which",
      "where",
      "who",
      "whose"
    ],
    "correctAnswer": "which",
    "explanation": "Ekmek yapan özne konumundaki fırını (kurum/işletme) nitelediği için \"which\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g14-q18",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "Do you remember the peaceful park _____ we sat and talked for hours?",
    "options": [
      "where",
      "which",
      "who",
      "that"
    ],
    "correctAnswer": "where",
    "explanation": "Parkta oturup konuşma eyleminin geçtiği konumu anlattığı için yer bildiren \"where\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g14-q19",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "Students _____ score above ninety points will receive a certificate of merit.",
    "options": [
      "who",
      "which",
      "where",
      "whom"
    ],
    "correctAnswer": "who",
    "explanation": "İnsan özne çoğulu (\"Students\") niteleyen ilgi zamiri \"who\"dur.",
    "difficulty": "hard"
  },
  {
    "id": "a2-g14-q20",
    "topicId": "a2-g14",
    "level": "A2",
    "question": "The laptop computer _____ keyboard stopped working yesterday is quite old.",
    "options": [
      "whose",
      "which",
      "who",
      "where"
    ],
    "correctAnswer": "whose",
    "explanation": "Bilgisayarın klavyesi (laptop's keyboard) arasındaki sahiplik ilişkisini bağlamak için \"whose\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g01-q01",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "We _____ each other since we started university five years ago.",
    "options": [
      "have known",
      "knew",
      "are knowing",
      "had known"
    ],
    "correctAnswer": "have known",
    "explanation": "\"Since + Past Simple (started)\" kalıbında ana cümle geçmişten bugüne devam eden durumu anlattığı için Present Perfect (have known) olur.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g01-q02",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "I _____ my wallet at home this morning, so I had to borrow money from a colleague at lunch.",
    "options": [
      "left",
      "have left",
      "leave",
      "was leaving"
    ],
    "correctAnswer": "left",
    "explanation": "Öğle yemeği geçip gittiği için \"this morning\" (bu sabah) artık kapanmış bir geçmiş zamandır ve devamında \"had to\" (Past) vardır; bu nedenle Past Simple (left) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g01-q03",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "My sister has worked as an architect _____ more than eight years.",
    "options": [
      "for",
      "since",
      "during",
      "ago"
    ],
    "correctAnswer": "for",
    "explanation": "\"More than eight years\" (sekiz yıldan fazla) bir başlangıç noktası değil, toplam süreç bildirdiği için \"for\" kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g01-q04",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "_____ you ever _____ authentic Japanese sushi in Tokyo?",
    "options": [
      "Have / tried",
      "Did / try",
      "Were / trying",
      "Do / try"
    ],
    "correctAnswer": "Have / tried",
    "explanation": "Zaman belirtmeden hayat boyu deneyimi soran \"ever\" zarfı Present Perfect soru kalıbı (Have you ever + V3) ile kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g01-q05",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "The company _____ three new branches in different cities so far this year.",
    "options": [
      "has opened",
      "opened",
      "opens",
      "was opening"
    ],
    "correctAnswer": "has opened",
    "explanation": "\"So far this year\" (bu yıl şu ana kadar) bitmemiş bir zaman dilimini ve günümüze kadar olan toplam sonucu ifade ettiği için Present Perfect (has opened) gerektirir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g01-q06",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "When _____ the Wright brothers _____ the first successful airplane?",
    "options": [
      "did / fly",
      "have / flown",
      "were / flying",
      "do / fly"
    ],
    "correctAnswer": "did / fly",
    "explanation": "\"When\" soru kelimesi geçmişte nokta bir zamanı sorduğu için Present Perfect ile KULLANILMAZ; Past Simple soru yapısı (did / fly) doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g01-q07",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "There have been many technological changes _____ the internet became widely available in the 1990s.",
    "options": [
      "since",
      "for",
      "until",
      "while"
    ],
    "correctAnswer": "since",
    "explanation": "Ana cümle Present Perfect (have been), yan cümle geçmişteki bir başlangıç olayı (became - V2) olduğunda aradaki bağlaç \"since\" (-den beri) olur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g01-q08",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "Can isn’t at home right now; he _____ to the supermarket to buy some bread.",
    "options": [
      "has gone",
      "has been",
      "went",
      "was going"
    ],
    "correctAnswer": "has gone",
    "explanation": "Can şu anda evde değilse süpermarkete gitmiş ve henüz dönmemiştir. Gidip henüz dönmeme durumu \"has gone (to)\" ile ifade edilir (\"has been\" gidip dönmüş demektir).",
    "difficulty": "hard"
  },
  {
    "id": "b1-g01-q09",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "My grandfather _____ in that small village for forty years before he passed away in 2015.",
    "options": [
      "lived",
      "has lived",
      "is living",
      "lives"
    ],
    "correctAnswer": "lived",
    "explanation": "Eylem geçmişte kalmış ve kişi 2015’te vefat etmiş olduğundan süreç artık bugüne devam etmemektedir. Bu yüzden \"for forty years\" olsa bile Past Simple (lived) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g01-q10",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "I don’t need to wash the car today because my brother _____ it.",
    "options": [
      "has already washed",
      "already washed yesterday",
      "washes",
      "was washing"
    ],
    "correctAnswer": "has already washed",
    "explanation": "Geçmişte yapılan eylemin şu anki sonucu (\"bugün yıkamama gerek yok\") vurgulandığı ve \"already\" kullanıldığı için Present Perfect (has already washed) doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g01-q11",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "We _____ any reply from the customer service department yet.",
    "options": [
      "haven’t received",
      "didn’t receive",
      "don’t receive",
      "weren’t receiving"
    ],
    "correctAnswer": "haven’t received",
    "explanation": "Cümle sonundaki \"yet\" (henüz) zarfı geçmişten bugüne kadar olan süreci anlatır ve olumsuz Present Perfect (haven’t received) ile kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g01-q12",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "As soon as the plane landed at the airport last night, I _____ my parents.",
    "options": [
      "called",
      "have called",
      "was calling",
      "call"
    ],
    "correctAnswer": "called",
    "explanation": "\"Last night\" (dün gece) belirli geçmiş zaman ifadesidir ve uçak iner inmez yapılan tamamlanmış eylemi anlatmak için Past Simple (called) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g01-q13",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "Since she _____ her new job in September, she _____ much free time.",
    "options": [
      "started / hasn’t had",
      "has started / didn’t have",
      "starts / hasn’t had",
      "started / didn’t had"
    ],
    "correctAnswer": "started / hasn’t had",
    "explanation": "\"Since\"in bağlı olduğu yan cümlecikte Past Simple (started), ana cümlede ise Present Perfect (hasn’t had) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g01-q14",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "Scientists _____ several promising treatments for the disease over the last decade.",
    "options": [
      "have developed",
      "developed",
      "develop",
      "were developing"
    ],
    "correctAnswer": "have developed",
    "explanation": "\"Over the last decade\" (son on yıl boyunca — günümüze kadar uzanan süreç) Present Perfect (have developed) gerektirir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g01-q15",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "A: Have you spoken to Deniz recently?\nB: Yes, I _____ into her at the train station two days ago.",
    "options": [
      "ran",
      "have run",
      "was running",
      "run"
    ],
    "correctAnswer": "ran",
    "explanation": "İkinci cümlede \"two days ago\" (iki gün önce) net bir geçmiş zaman zarfı verildiği için cevap Past Simple (ran into) olmalıdır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g01-q16",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "It is the first time I _____ such a breathtaking view in my life.",
    "options": [
      "have seen",
      "saw",
      "see",
      "was seeing"
    ],
    "correctAnswer": "have seen",
    "explanation": "\"It is the first/second time...\" kalıbı kendisinden sonra her zaman Present Perfect (have/has + V3) alır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g01-q17",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "Mozart _____ his first symphony when he was only eight years old.",
    "options": [
      "composed",
      "has composed",
      "composes",
      "was composing"
    ],
    "correctAnswer": "composed",
    "explanation": "\"When he was only eight years old\" geçmişte kapanmış bir dönemi anlatır ve Mozart hayatta olmadığı için Past Simple (composed) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g01-q18",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "Look! Somebody _____ coffee on the carpet; there is a big brown stain right here.",
    "options": [
      "has spilled",
      "spilled yesterday",
      "spills",
      "was spilling"
    ],
    "correctAnswer": "has spilled",
    "explanation": "Eylem geçmişte gerçekleşmiş ancak sonucu şu anda göz önünde (\"Look! ... there is a big brown stain right here\") olduğu için Present Perfect (has spilled) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g01-q19",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "How long _____ you _____ your current car before you decided to sell it last month?",
    "options": [
      "did / have",
      "have / had",
      "do / have",
      "were / having"
    ],
    "correctAnswer": "did / have",
    "explanation": "Dikkat: Arabayı geçen ay satmaya karar verdiğine göre sahiplik süreci geçmişte kalmıştır. \"How long\" sorusu bitmiş geçmiş için sorulduğunda Past Simple (did / have) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g01-q20",
    "topicId": "b1-g01",
    "level": "B1",
    "question": "She has been a member of the chess club _____ last October.",
    "options": [
      "since",
      "for",
      "in",
      "from"
    ],
    "correctAnswer": "since",
    "explanation": "\"Last October\" (geçen Ekim ayı) bir süreç değil, başlangıç noktasıdır; Present Perfect cümlede başlangıç noktasıyla \"since\" kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g02-q01",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "I am out of breath because I _____ around the park for an hour.",
    "options": [
      "have been running",
      "run",
      "was running",
      "had run"
    ],
    "correctAnswer": "have been running",
    "explanation": "Şu anki fiziksel etkinin nedeni olan ve yeni biten süreç odaklı eylemlerde Present Perfect Continuous (have been running) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g02-q02",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "It _____ all morning, and the grass is completely soaked.",
    "options": [
      "has been raining",
      "rains",
      "is raining",
      "was raining"
    ],
    "correctAnswer": "has been raining",
    "explanation": "\"All morning\" süreci ve ıslak çim sonucu Present Perfect Continuous (has been raining) gerektirir.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g02-q03",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "How long _____ you _____ for the bus to arrive?",
    "options": [
      "have / been waiting",
      "are / waiting",
      "did / wait",
      "had / waited"
    ],
    "correctAnswer": "have / been waiting",
    "explanation": "\"How long\" ile ne kadar süredir bir eylemin yapılmakta olduğu sorulurken have been waiting kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g02-q04",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "Ahmet's eyes are red because he _____ on his computer since noon.",
    "options": [
      "has been working",
      "works",
      "is working",
      "worked"
    ],
    "correctAnswer": "has been working",
    "explanation": "\"Since noon\" ifadesiyle geçmişten konuşma anına kadar süren eylem has been working ile anlatılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g02-q05",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "We _____ English at this academy for six months now.",
    "options": [
      "have been learning",
      "learn",
      "learned",
      "are learning"
    ],
    "correctAnswer": "have been learning",
    "explanation": "\"For six months now\" geçmişten bugüne devam eden süreci gösterir.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g02-q06",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "Sude looks tired; she _____ all day without taking any break.",
    "options": [
      "has been studying",
      "studies",
      "study",
      "was studied"
    ],
    "correctAnswer": "has been studying",
    "explanation": "Tüm gün kesintisiz süren çalışma eylemi has been studying ile ifade edilir.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g02-q07",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "I _____ this book for two weeks, but I haven't finished it yet.",
    "options": [
      "have been reading",
      "have read",
      "read",
      "am reading"
    ],
    "correctAnswer": "have been reading",
    "explanation": "Kitabın henüz bitmediği ve okuma sürecinin sürdüğü belirtildiği için have been reading kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g02-q08",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "He has written three poems today, but he _____ all morning.",
    "options": [
      "has been writing",
      "has written",
      "wrote",
      "is writing"
    ],
    "correctAnswer": "has been writing",
    "explanation": "Belirli sayı için Simple (three poems), sürecin kendisi için ise Continuous (has been writing all morning) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g02-q09",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "Why are your clothes covered in flour? _____ you _____ a cake?",
    "options": [
      "Have / been baking",
      "Did / bake",
      "Were / baking",
      "Are / baking"
    ],
    "correctAnswer": "Have / been baking",
    "explanation": "Üstündeki un izi yeni tamamlanmış eylemin fiziksel belirtisidir; Have you been baking uygundur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g02-q10",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "They _____ in this neighborhood since their daughter was born.",
    "options": [
      "have been living",
      "live",
      "are living",
      "lived"
    ],
    "correctAnswer": "have been living",
    "explanation": "Başlangıç noktası belirtilen yaşam süreci have been living ile anlatılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g02-q11",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "I _____ Sarah for over ten years; she is my closest friend.",
    "options": [
      "have known",
      "have been knowing",
      "know",
      "am knowing"
    ],
    "correctAnswer": "have known",
    "explanation": "'Know' durum fiilidir; süreç bildirse bile asla continuous almaz, have known kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g02-q12",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "The technicians _____ to repair the main server for the past four hours.",
    "options": [
      "have been trying",
      "try",
      "tried",
      "are trying"
    ],
    "correctAnswer": "have been trying",
    "explanation": "Son dört saattir süregelen çaba have been trying ile ifade edilir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g02-q13",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "She _____ tennis since she was only seven years old.",
    "options": [
      "has been playing",
      "plays",
      "played",
      "is playing"
    ],
    "correctAnswer": "has been playing",
    "explanation": "Çocukluktan bu yana devam eden spor alışkanlığı has been playing ile verilir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g02-q14",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "What _____ you _____ all day? Your room is still completely messy!",
    "options": [
      "have / been doing",
      "did / do",
      "do / do",
      "had / done"
    ],
    "correctAnswer": "have / been doing",
    "explanation": "Bütün gün boyunca ne yapılmakta olduğunu sormak için have been doing kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g02-q15",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "I _____ to call customer service repeatedly, but nobody answers the phone.",
    "options": [
      "have been trying",
      "am trying",
      "tried",
      "had tried"
    ],
    "correctAnswer": "have been trying",
    "explanation": "Tekrarlanan ve konuşma anına kadar süren ısrarlı arama have been trying gerektirir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g02-q16",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "He has a headache because he _____ loud music through his headphones for hours.",
    "options": [
      "has been listening to",
      "listened to",
      "listens to",
      "had listened to"
    ],
    "correctAnswer": "has been listening to",
    "explanation": "Baş ağrısının sebebi olan saatler sürmüş eylem has been listening to ile verilir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g02-q17",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "She _____ with her cousin lately while her apartment is being renovated.",
    "options": [
      "has been staying",
      "stays",
      "is stayed",
      "stayed"
    ],
    "correctAnswer": "has been staying",
    "explanation": "'Lately' son dönemdeki geçici süreçleri anlatırken Present Perfect Continuous ile sıkça kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g02-q18",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "The negotiations _____ for three consecutive days without any concrete agreement.",
    "options": [
      "have been continuing",
      "continue",
      "continued",
      "are continuing"
    ],
    "correctAnswer": "have been continuing",
    "explanation": "Üç gündür süren müzakereler have been continuing ile ifade edilir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g02-q19",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "Although he _____ for only two months, he already plays the piano remarkably well.",
    "options": [
      "has been practicing",
      "practices",
      "practiced",
      "is practicing"
    ],
    "correctAnswer": "has been practicing",
    "explanation": "Sadece iki aydır sürmekte olan pratik süreci has been practicing ile verilir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g02-q20",
    "topicId": "b1-g02",
    "level": "B1",
    "question": "How many chapters of the novel _____ you _____ so far today?",
    "options": [
      "have / written",
      "have / been writing",
      "did / write",
      "are / writing"
    ],
    "correctAnswer": "have / written",
    "explanation": "Tamamlanan adet/miktar sorulduğunda (\"how many chapters\") Continuous değil Simple (have written) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g03-q01",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "When we reached the cinema, the movie _____ already _____.",
    "options": [
      "had / started",
      "has / started",
      "was / starting",
      "did / start"
    ],
    "correctAnswer": "had / started",
    "explanation": "Varmamızdan önce başlamış olan ilk eylem Past Perfect (had started) ile ifade edilir.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g03-q02",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "By the time the police arrived, the burglar _____ away.",
    "options": [
      "had run",
      "has run",
      "ran",
      "was running"
    ],
    "correctAnswer": "had run",
    "explanation": "\"By the time + V2\" kalıbında ana cümle Past Perfect (had run) olur.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g03-q03",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "She realized that she _____ her passport at the hotel.",
    "options": [
      "had left",
      "leaves",
      "has left",
      "was left"
    ],
    "correctAnswer": "had left",
    "explanation": "Pasaportu unutma eylemi fark etme anından önce gerçekleşmiştir (had left).",
    "difficulty": "easy"
  },
  {
    "id": "b1-g03-q04",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "After Ahmet _____ his degree, he applied for several jobs.",
    "options": [
      "had completed",
      "completes",
      "has completed",
      "was completing"
    ],
    "correctAnswer": "had completed",
    "explanation": "\"After\" ilk gerçekleşen eylemi bağladığı için ardından had completed alır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g03-q05",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "I couldn't enter my apartment because I _____ my keys.",
    "options": [
      "had lost",
      "lost",
      "have lost",
      "was losing"
    ],
    "correctAnswer": "had lost",
    "explanation": "Eve girememenin öncesindeki sebebi had lost (kaybetmiştim) ile anlatılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g03-q06",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "Sude _____ never _____ sushi before she traveled to Tokyo last year.",
    "options": [
      "had / eaten",
      "has / eaten",
      "did / eat",
      "was / eating"
    ],
    "correctAnswer": "had / eaten",
    "explanation": "Geçmişteki Tokyo seyahatinden önceki deneyimsizlik had never eaten ile verilir.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g03-q07",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "The train _____ already _____ by the time we bought our tickets.",
    "options": [
      "had / departed",
      "has / departed",
      "was / departing",
      "did / depart"
    ],
    "correctAnswer": "had / departed",
    "explanation": "Bilet alma anından önce trenin kalkmış olduğunu belirtmek için had departed kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g03-q08",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "He felt very confident during the interview because he _____ thoroughly.",
    "options": [
      "had prepared",
      "prepares",
      "has prepared",
      "was preparing"
    ],
    "correctAnswer": "had prepared",
    "explanation": "Mülakattan önceki titiz hazırlık had prepared ile ifade edilir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g03-q09",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "They couldn't purchase the concert tickets because all of them _____ sold out.",
    "options": [
      "had been",
      "have been",
      "were being",
      "are"
    ],
    "correctAnswer": "had been",
    "explanation": "Biletlerin tükenmiş olması geçmişteki satın alamama anından öncedir (had been sold out).",
    "difficulty": "medium"
  },
  {
    "id": "b1-g03-q10",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "She thanked me warmly for the thoughtful gift I _____ her.",
    "options": [
      "had given",
      "give",
      "have given",
      "am giving"
    ],
    "correctAnswer": "had given",
    "explanation": "Hediyeyi verme eylemi teşekkür etmeden önce yaşanmıştır (had given).",
    "difficulty": "medium"
  },
  {
    "id": "b1-g03-q11",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "By the age of twenty-five, he _____ three successful startups.",
    "options": [
      "had founded",
      "founded",
      "has founded",
      "was founding"
    ],
    "correctAnswer": "had founded",
    "explanation": "Geçmişteki belirli bir yaş sınırına kadar tamamlanan başarı had founded ile anlatılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g03-q12",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "The grass was yellow and dry because it _____ for two months.",
    "options": [
      "hadn't rained",
      "hasn't rained",
      "doesn't rain",
      "wasn't raining"
    ],
    "correctAnswer": "hadn't rained",
    "explanation": "Geçmişteki kuruluğun öncesindeki iki aylık yağmursuzluk hadn't rained ile verilir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g03-q13",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "As soon as the guests _____, we started serving the appetizers.",
    "options": [
      "had arrived",
      "have arrived",
      "arrive",
      "are arriving"
    ],
    "correctAnswer": "had arrived",
    "explanation": "Misafirlerin gelmesi ilk eylemdir; as soon as had arrived kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g03-q14",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "I recognized the actor immediately because I _____ him in an earlier film.",
    "options": [
      "had seen",
      "saw",
      "have seen",
      "am seeing"
    ],
    "correctAnswer": "had seen",
    "explanation": "Tanıma anından önceki bir filmde görmüş olma had seen ile ifade edilir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g03-q15",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "Hardly _____ the house when it started to pour with rain.",
    "options": [
      "had we left",
      "we had left",
      "did we leave",
      "were we leaving"
    ],
    "correctAnswer": "had we left",
    "explanation": "\"Hardly had + özne + V3\" kısıtlayıcı devrik geçmiş zaman yapısıdır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g03-q16",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "She was disappointed because she _____ the prestigious scholarship she had applied for.",
    "options": [
      "hadn't received",
      "hasn't received",
      "didn't receive",
      "wasn't receiving"
    ],
    "correctAnswer": "hadn't received",
    "explanation": "Hayal kırıklığının öncesindeki olumsuz sonuç Past Perfect (hadn't received) gerektirir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g03-q17",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "Until yesterday, I _____ never _____ of that ancient civilization.",
    "options": [
      "had / heard",
      "have / heard",
      "did / hear",
      "was / hearing"
    ],
    "correctAnswer": "had / heard",
    "explanation": "\"Until yesterday\" geçmişteki düne kadar süren durumu belirttiği için had heard kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g03-q18",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "By the time the rescue team reached the mountain, the storm _____ down.",
    "options": [
      "had calmed",
      "has calmed",
      "calmed",
      "was calming"
    ],
    "correctAnswer": "had calmed",
    "explanation": "Kurtarma ekibinin ulaşmasından önce fırtınanın dinmiş olması had calmed ile verilir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g03-q19",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "He apologized for the rude remark he _____ earlier in the heated discussion.",
    "options": [
      "had made",
      "made",
      "has made",
      "was making"
    ],
    "correctAnswer": "had made",
    "explanation": "Özrün öncesindeki tartışmada söylenmiş olan kırıcı söz had made ile aktarılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g03-q20",
    "topicId": "b1-g03",
    "level": "B1",
    "question": "No sooner _____ the contract than they began arguing over delivery dates.",
    "options": [
      "had they signed",
      "they had signed",
      "did they sign",
      "were they signing"
    ],
    "correctAnswer": "had they signed",
    "explanation": "\"No sooner had they signed\" kalıbı geçmişteki ardışık olayları devrik bağlar.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g04-q01",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "My father _____ smoke a pack of cigarettes a day, but he quit ten years ago.",
    "options": [
      "used to",
      "would",
      "is used to",
      "was used to"
    ],
    "correctAnswer": "used to",
    "explanation": "Geçmişte olup artık bırakılan alışkanlıklar için used to kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g04-q02",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "We _____ live in a small village when I was a little child.",
    "options": [
      "used to",
      "would",
      "are used to",
      "get used to"
    ],
    "correctAnswer": "used to",
    "explanation": "'Live' durum fiili olduğu için 'would' kullanılamaz; sadece 'used to' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g04-q03",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "I didn't _____ like green olives when I was younger.",
    "options": [
      "use to",
      "used to",
      "used",
      "using to"
    ],
    "correctAnswer": "use to",
    "explanation": "Didn't yardımcı fiilinden sonra fiilin 'd' harfi düşerek 'use to' biçiminde gelir.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g04-q04",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "Did you _____ ride a bicycle to school every morning?",
    "options": [
      "use to",
      "used to",
      "would",
      "used"
    ],
    "correctAnswer": "use to",
    "explanation": "Geçmiş alışkanlık bildiren soru cümlelerinde \"Did\" yardımcı fiili başa geldiğinde fiil yalın kalarak \"use to\" biçiminde kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g04-q05",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "Every summer, my grandmother _____ bake delicious strawberry pies for us.",
    "options": [
      "would",
      "is used to",
      "got used to",
      "uses to"
    ],
    "correctAnswer": "would",
    "explanation": "Geçmişte nostaljik olarak tekrarlanan eylemler için 'would + V1' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g04-q06",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "Ahmet _____ have very long curly hair in high school.",
    "options": [
      "used to",
      "would",
      "is used to",
      "was used to"
    ],
    "correctAnswer": "used to",
    "explanation": "'Have' sahiplik durum fiili olduğundan 'would' alamaz; 'used to' alır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g04-q07",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "When we were kids, we _____ sit by the fireplace and listen to fairy tales.",
    "options": [
      "would",
      "are used to",
      "use to",
      "getting used to"
    ],
    "correctAnswer": "would",
    "explanation": "Geçmişte tekrarlanan dinleme ve oturma eylemleri için 'would' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g04-q08",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "She has lived in London for five years, so she _____ on the left side.",
    "options": [
      "is used to driving",
      "used to drive",
      "would drive",
      "get used to drive"
    ],
    "correctAnswer": "is used to driving",
    "explanation": "Mevcut duruma alışkın olma anlamında 'is used to + V-ing' (driving) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g04-q09",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "It took Sude a few months to _____ the noisy city traffic.",
    "options": [
      "get used to",
      "used to",
      "would",
      "use to"
    ],
    "correctAnswer": "get used to",
    "explanation": "Alışma süreci ve çabasını anlatırken 'get used to' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g04-q10",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "There _____ be an old bookstore at the corner, but it was replaced by a bank.",
    "options": [
      "used to",
      "would",
      "is used to",
      "use to"
    ],
    "correctAnswer": "used to",
    "explanation": "'Be' durum fiili geçmiş varlığı anlattığında 'used to' alır ('would be' alışkanlıkta denmez).",
    "difficulty": "medium"
  },
  {
    "id": "b1-g04-q11",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "I _____ waking up early in the morning; I have done it all my life.",
    "options": [
      "am used to",
      "used to",
      "would",
      "get used to"
    ],
    "correctAnswer": "am used to",
    "explanation": "Hayatı boyunca yaptığı için sabah erken uyanmaya alışkın olduğunu anlatır ('am used to waking up').",
    "difficulty": "medium"
  },
  {
    "id": "b1-g04-q12",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "Whenever he felt stressed, he _____ go for a solitary walk along the beach.",
    "options": [
      "would",
      "is used to",
      "uses to",
      "has used to"
    ],
    "correctAnswer": "would",
    "explanation": "Stresli anlarda tekrarlanan nostaljik eylem için 'would' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g04-q13",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "They _____ have a heated swimming pool in their old villa.",
    "options": [
      "used to",
      "would",
      "are used to",
      "getting used to"
    ],
    "correctAnswer": "used to",
    "explanation": "Havuz sahibi olma geçmiş durumu için 'used to' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g04-q14",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "I _____ drink coffee at night, but now it prevents me from sleeping.",
    "options": [
      "used to",
      "would",
      "am used to",
      "use to"
    ],
    "correctAnswer": "used to",
    "explanation": "Geçmişteki alışkanlık için used to uygundur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g04-q15",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "Which of the following sentences is grammatically INCORRECT?",
    "options": [
      "When I was young, I would live in Madrid.",
      "When I was young, I used to live in Madrid.",
      "We would often play football on Sundays.",
      "I didn't use to drink tea."
    ],
    "correctAnswer": "When I was young, I would live in Madrid.",
    "explanation": "'Live' durum fiilidir; geçmiş durumlar için 'would' kullanılamaz ('used to live' olmalıdır).",
    "difficulty": "hard"
  },
  {
    "id": "b1-g04-q16",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "After working in night shifts for several weeks, she finally _____ sleeping during the day.",
    "options": [
      "got used to",
      "used to",
      "would",
      "was used"
    ],
    "correctAnswer": "got used to",
    "explanation": "Süreç sonunda alışma gerçekleştiği için 'got used to + V-ing' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g04-q17",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "My grandfather was a wise man; he _____ always listen patiently before offering advice.",
    "options": [
      "would",
      "is used to",
      "used",
      "uses to"
    ],
    "correctAnswer": "would",
    "explanation": "Geçmişte düzenli olarak gösterilen karakter davranışı için 'would' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g04-q18",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "I find it hard to _____ the cold climate of this northern city.",
    "options": [
      "get used to",
      "used to",
      "would",
      "be use to"
    ],
    "correctAnswer": "get used to",
    "explanation": "'Find it hard to get used to...' bir şeye alışmayı zor bulmak anlamına gelir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g04-q19",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "He _____ believe in ghosts until he spent a night in that historic castle.",
    "options": [
      "didn't use to",
      "wouldn't",
      "wasn't used to",
      "hasn't used to"
    ],
    "correctAnswer": "didn't use to",
    "explanation": "'Believe' zihinsel durum fiilidir; olumsuz geçmiş durum için 'didn't use to' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g04-q20",
    "topicId": "b1-g04",
    "level": "B1",
    "question": "She is a professional nurse, so she _____ long working hours in intense environments.",
    "options": [
      "is used to",
      "used to",
      "would",
      "use to"
    ],
    "correctAnswer": "is used to",
    "explanation": "İsim öbeğine (long working hours) alışkın olma durumu 'is used to' ile verilir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g05-q01",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "English _____ in many international conferences around the world.",
    "options": [
      "is spoken",
      "speaks",
      "is speaking",
      "has spoken"
    ],
    "correctAnswer": "is spoken",
    "explanation": "İngilizce dili konuşulan nesnedir; Present Simple Passive 'is spoken' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g05-q02",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "The Mona Lisa _____ by Leonardo da Vinci in the early sixteenth century.",
    "options": [
      "was painted",
      "painted",
      "is painted",
      "has been painted"
    ],
    "correctAnswer": "was painted",
    "explanation": "Geçmişte tamamlanmış tarihi sanat eseri için Past Simple Passive 'was painted' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g05-q03",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "All the concert tickets _____ already _____ online.",
    "options": [
      "have / been sold",
      "has / been sold",
      "were / selling",
      "are / sold"
    ],
    "correctAnswer": "have / been sold",
    "explanation": "'All tickets' çoğuldur; 'already' ile Present Perfect Passive 'have been sold' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g05-q04",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "Millions of parcels _____ by courier companies across the country every day.",
    "options": [
      "are delivered",
      "deliver",
      "is delivered",
      "delivered"
    ],
    "correctAnswer": "are delivered",
    "explanation": "Her gün tekrarlanan rutin edilgen eylem çoğul özneyle 'are delivered' olur.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g05-q05",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "The new subway line _____ by the mayor yesterday morning.",
    "options": [
      "was opened",
      "is opened",
      "opened",
      "has been opened"
    ],
    "correctAnswer": "was opened",
    "explanation": "'Yesterday morning' geçmiş zaman zarfıdır; tekil özneyle 'was opened' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g05-q06",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "Rice _____ in wet paddy fields throughout East Asia.",
    "options": [
      "is grown",
      "grows",
      "is growing",
      "was grown"
    ],
    "correctAnswer": "is grown",
    "explanation": "Pirinç yetiştirilme genel gerçeği için Present Simple Passive 'is grown' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g05-q07",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "The critical security vulnerability _____ by the software engineering team.",
    "options": [
      "has been fixed",
      "has fixed",
      "fixed",
      "is fixing"
    ],
    "correctAnswer": "has been fixed",
    "explanation": "Güvenlik açığı giderildi anlamında Present Perfect Passive 'has been fixed' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g05-q08",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "The ancient silver coins _____ in a ceramic pot by archaeologists last week.",
    "options": [
      "were discovered",
      "discovered",
      "have been discovered",
      "are discovered"
    ],
    "correctAnswer": "were discovered",
    "explanation": "'Last week' geçmiş belirtecidir; çoğul nesneyle 'were discovered' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g05-q09",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "A brand-new modern library _____ in our neighborhood recently.",
    "options": [
      "has been built",
      "built",
      "is building",
      "was building"
    ],
    "correctAnswer": "has been built",
    "explanation": "'Recently' yakın geçmişi işaret eder; tekil nesneyle 'has been built' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g05-q10",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "The historic bridge _____ by a severe earthquake in the nineteenth century.",
    "options": [
      "was destroyed",
      "destroyed",
      "is destroyed",
      "has destroyed"
    ],
    "correctAnswer": "was destroyed",
    "explanation": "Tarihi depremde yıkılan köprü için Past Simple Passive 'was destroyed' uygundur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g05-q11",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "The suspicious packages _____ at the border security checkpoint this morning.",
    "options": [
      "were intercepted",
      "intercepted",
      "are intercepted",
      "have intercepted"
    ],
    "correctAnswer": "were intercepted",
    "explanation": "Bu sabah gerçekleşen olayda çoğul nesne 'were intercepted' alır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g05-q12",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "Coffee _____ in Brazil and exported to hundreds of countries worldwide.",
    "options": [
      "is harvested",
      "harvests",
      "harvested",
      "is harvesting"
    ],
    "correctAnswer": "is harvested",
    "explanation": "Kahvenin hasat edilmesi geniş zaman pasifi 'is harvested' ile anlatılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g05-q13",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "The stolen vehicles _____ by the police before they crossed the border.",
    "options": [
      "were found",
      "found",
      "have found",
      "are found"
    ],
    "correctAnswer": "were found",
    "explanation": "Araçların bulunması geçmiş edilgen biçimde 'were found' ile ifade edilir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g05-q14",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "All safety guidelines must _____ strictly by the factory workers.",
    "options": [
      "be followed",
      "follow",
      "are followed",
      "been followed"
    ],
    "correctAnswer": "be followed",
    "explanation": "Modal fiillerden (must) sonra pasif yapı 'be + V3' (be followed) şeklinde kurulur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g05-q15",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "Which of the following sentences contains a grammatical error?",
    "options": [
      "A tragic traffic accident was occurred on the bridge yesterday.",
      "The novel was written by an anonymous author.",
      "The packages have been dispatched today.",
      "Wine is made from fermented grapes."
    ],
    "correctAnswer": "A tragic traffic accident was occurred on the bridge yesterday.",
    "explanation": "'Occur' geçişsiz (intransitive) bir fiildir ve asla edilgen yapılamaz; 'occurred' olmalıdır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g05-q16",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "The mysterious locked door _____ opened _____ a special electronic key card.",
    "options": [
      "was / with",
      "was / by",
      "is / of",
      "were / by"
    ],
    "correctAnswer": "was / with",
    "explanation": "Alet ve araç belirten nesneler pasif cümlede 'with' edatıyla ifade edilir ('with a key card').",
    "difficulty": "hard"
  },
  {
    "id": "b1-g05-q17",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "It is reported that three endangered species _____ from the national park this year.",
    "options": [
      "have disappeared",
      "have been disappeared",
      "were disappeared",
      "are disappeared"
    ],
    "correctAnswer": "have disappeared",
    "explanation": "'Disappear' geçişsiz fiildir; pasif yapılamaz (have disappeared doğrudur).",
    "difficulty": "hard"
  },
  {
    "id": "b1-g05-q18",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "The historic peace treaty _____ by the delegates of both nations last night.",
    "options": [
      "was signed",
      "signed",
      "has been signed",
      "is signed"
    ],
    "correctAnswer": "was signed",
    "explanation": "Tarihi antlaşma dün gece imzalandı anlamında 'was signed' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g05-q19",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "Many innovative medical treatments _____ developed over the past few decades.",
    "options": [
      "have been",
      "were being",
      "are",
      "had"
    ],
    "correctAnswer": "have been",
    "explanation": "'Over the past few decades' süreci Present Perfect Passive 'have been developed' gerektirir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g05-q20",
    "topicId": "b1-g05",
    "level": "B1",
    "question": "The secret recipe _____ guarded closely by the founding family for generations.",
    "options": [
      "has been",
      "was",
      "is",
      "had"
    ],
    "correctAnswer": "has been",
    "explanation": "Nesillerdir süregelen koruma Present Perfect Passive 'has been guarded' ile anlatılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g06-q01",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "If you heat ice, it _____.",
    "options": [
      "melts",
      "will melt",
      "melted",
      "would melt"
    ],
    "correctAnswer": "melts",
    "explanation": "Bilimsel bir doğa kuralı olduğu için Type 0 (melts) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g06-q02",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "If it _____ tomorrow, we will stay at home and watch movies.",
    "options": [
      "rains",
      "will rain",
      "rained",
      "would rain"
    ],
    "correctAnswer": "rains",
    "explanation": "Type 1 koşul cümlesinde if tarafı Present Simple (rains) alır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g06-q03",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "If I won a million dollars, I _____ travel around the entire world.",
    "options": [
      "would",
      "will",
      "can",
      "shall"
    ],
    "correctAnswer": "would",
    "explanation": "Type 2 hayali koşulda ana cümlede 'would + V1' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g06-q04",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "If I _____ you, I would consult a doctor immediately.",
    "options": [
      "were",
      "am",
      "will be",
      "have been"
    ],
    "correctAnswer": "were",
    "explanation": "Tavsiye ve hayali durum kalıbı 'If I were you' ile kurulur.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g06-q05",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "Unless you study hard, you _____ pass the final examination.",
    "options": [
      "won't",
      "will",
      "wouldn't",
      "don't"
    ],
    "correctAnswer": "won't",
    "explanation": "Unless (çalışmadıkça) ana cümlede olumsuz gelecek zaman 'won't pass' gerektirir.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g06-q06",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "If you press this red button, the machine _____ immediately.",
    "options": [
      "stops",
      "stopped",
      "would stop",
      "had stopped"
    ],
    "correctAnswer": "stops",
    "explanation": "Genel kural ve talimat bildiren Type 0 yapısıdır (stops).",
    "difficulty": "easy"
  },
  {
    "id": "b1-g06-q07",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "If Sude _____ more free time, she would learn how to play the piano.",
    "options": [
      "had",
      "has",
      "will have",
      "have"
    ],
    "correctAnswer": "had",
    "explanation": "Type 2 hayali şimdiki zaman koşulunda if tarafı Past Simple (had) olur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g06-q08",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "We will be late for the meeting unless we _____ a taxi right now.",
    "options": [
      "take",
      "don't take",
      "will take",
      "took"
    ],
    "correctAnswer": "take",
    "explanation": "'Unless' kendi cümlesini zaten olumsuz kıldığı için fiil olumlu (take) çekimlenir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g06-q09",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "What would you do if someone _____ your car in the parking lot?",
    "options": [
      "damaged",
      "damages",
      "will damage",
      "has damaged"
    ],
    "correctAnswer": "damaged",
    "explanation": "Type 2 sorusunda (What would you do...) if cümlesi Past Simple (damaged) alır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g06-q10",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "If Ahmet gets a promotion this month, he _____ a new apartment.",
    "options": [
      "will buy",
      "would buy",
      "bought",
      "buys"
    ],
    "correctAnswer": "will buy",
    "explanation": "Type 1 gerçek olası durumda sonuç cümlesi 'will buy' ile kurulur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g06-q11",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "Plants _____ quickly if they do not receive enough water.",
    "options": [
      "die",
      "will die",
      "would die",
      "died"
    ],
    "correctAnswer": "die",
    "explanation": "Biyolojik genel geçer gerçek için Type 0 (die) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g06-q12",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "If I _____ his phone number, I would call him right away.",
    "options": [
      "knew",
      "know",
      "will know",
      "have known"
    ],
    "correctAnswer": "knew",
    "explanation": "Şu anda numarasını bilmediği hayali durum için Type 2 (knew) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g06-q13",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "Unless the weather _____ by afternoon, the football match will be cancelled.",
    "options": [
      "improves",
      "doesn't improve",
      "will improve",
      "improved"
    ],
    "correctAnswer": "improves",
    "explanation": "'Unless + tekil özne' olumlu çekim alarak 'improves' olur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g06-q14",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "If they practiced more diligently, they _____ many more matches.",
    "options": [
      "could win",
      "can win",
      "will win",
      "win"
    ],
    "correctAnswer": "could win",
    "explanation": "Type 2 cümlesinde 'would' yerine yetenek belirten 'could win' kullanılabilir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g06-q15",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "Which sentence is grammatically INCORRECT?",
    "options": [
      "If I will see him tomorrow, I will give him your message.",
      "If I see him tomorrow, I will give him your message.",
      "If I were you, I would reconsider the decision.",
      "Unless you hurry, you will miss the train."
    ],
    "correctAnswer": "If I will see him tomorrow, I will give him your message.",
    "explanation": "'If' cümlesinde asla 'will' kullanılamaz; 'If I see him' olmalıdır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g06-q16",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "If water _____ cooled to zero degrees Celsius, it freezes solid.",
    "options": [
      "is",
      "will be",
      "was",
      "would be"
    ],
    "correctAnswer": "is",
    "explanation": "Pasif biçimli bilimsel gerçeklik cümlesinde Type 0 (is cooled) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g06-q17",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "She would definitely buy that designer handbag if it _____ so expensive.",
    "options": [
      "weren't",
      "isn't",
      "won't be",
      "wouldn't be"
    ],
    "correctAnswer": "weren't",
    "explanation": "Type 2 olumsuz koşulunda resmi dilde 'weren't' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g06-q18",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "Provided that you _____ the equipment carefully, you may borrow it for the weekend.",
    "options": [
      "handle",
      "will handle",
      "handled",
      "would handle"
    ],
    "correctAnswer": "handle",
    "explanation": "'Provided that' (şartıyla) bağlacı Type 1 mantığında Present Simple (handle) alır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g06-q19",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "What _____ you do if you were offered a lucrative job in Tokyo tomorrow?",
    "options": [
      "would",
      "will",
      "can",
      "shall"
    ],
    "correctAnswer": "would",
    "explanation": "Type 2 koşul sorusunda (if you were offered...) modal olarak 'would' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g06-q20",
    "topicId": "b1-g06",
    "level": "B1",
    "question": "Unless the committee approves the proposal, funding _____ granted for the research.",
    "options": [
      "won't be",
      "will be",
      "wouldn't be",
      "is not"
    ],
    "correctAnswer": "won't be",
    "explanation": "Unless koşuluna bağlı gelecekteki olumsuz pasif sonuç 'won't be granted' olur.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g07-q01",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "\"I am very tired today,\" said Ahmet. -> Ahmet said that he _____ very tired that day.",
    "options": [
      "was",
      "is",
      "will be",
      "has been"
    ],
    "correctAnswer": "was",
    "explanation": "Present Simple 'am', geçmiş aktarımda Past Simple 'was' haline dönüşür.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g07-q02",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "\"I like Italian food,\" she said. -> She said that she _____ Italian food.",
    "options": [
      "liked",
      "likes",
      "will like",
      "is liking"
    ],
    "correctAnswer": "liked",
    "explanation": "Aktarımda fiil bir derece geriye kayarak Past Simple (liked) olur.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g07-q03",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "Ali _____ me that he had passed his driving test on the first attempt.",
    "options": [
      "told",
      "said",
      "spoke",
      "asked"
    ],
    "correctAnswer": "told",
    "explanation": "Kişi nesnesi ('me') doğrudan geldiği için 'told' fiili kullanılır ('said me' denmez).",
    "difficulty": "easy"
  },
  {
    "id": "b1-g07-q04",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "Sude said, \"I will call you tomorrow.\" -> Sude said she _____ call me the next day.",
    "options": [
      "would",
      "will",
      "can",
      "should"
    ],
    "correctAnswer": "would",
    "explanation": "'Will' aktarımda 'would' haline dönüşür.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g07-q05",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "\"Please close the door,\" the teacher said to us. -> The teacher told us _____ the door.",
    "options": [
      "to close",
      "closing",
      "close",
      "closed"
    ],
    "correctAnswer": "to close",
    "explanation": "Emir ve rica aktarımlarında 'to + V1' (to close) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g07-q06",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "\"Don't make noise!\" the librarian said. -> The librarian told them _____ noise.",
    "options": [
      "not to make",
      "to not make",
      "don't make",
      "not making"
    ],
    "correctAnswer": "not to make",
    "explanation": "Olumsuz emir aktarımında 'not to + V1' (not to make) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g07-q07",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "\"I am studying for my biology exam now,\" she said. -> She said that she _____ then.",
    "options": [
      "was studying",
      "is studying",
      "studied",
      "had studied"
    ],
    "correctAnswer": "was studying",
    "explanation": "Present Continuous 'am studying', 'was studying' haline dönüşür; 'now' -> 'then' olur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g07-q08",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "\"We have bought a new house,\" they said. -> They said that they _____ a new house.",
    "options": [
      "had bought",
      "have bought",
      "bought",
      "were buying"
    ],
    "correctAnswer": "had bought",
    "explanation": "Present Perfect 'have bought', Past Perfect 'had bought' haline dönüşür.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g07-q09",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "He _____ that the plane tickets were far too expensive.",
    "options": [
      "said",
      "told",
      "told to",
      "spoke"
    ],
    "correctAnswer": "said",
    "explanation": "Nesne olmaksızın 'that' cümleciği bağlandığında 'said' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g07-q10",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "\"I can speak three languages,\" Maria said. -> Maria said that she _____ three languages.",
    "options": [
      "could speak",
      "can speak",
      "speaks",
      "will speak"
    ],
    "correctAnswer": "could speak",
    "explanation": "Dolaylı anlatımda zaman kayması (backshift) kuralına göre yetenek bildiren \"can\" kipi bir derece geçmişe giderek \"could\" haline dönüşür.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g07-q11",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "The doctor advised the patient _____ more vegetables and avoid fast food.",
    "options": [
      "to eat",
      "eating",
      "eat",
      "ate"
    ],
    "correctAnswer": "to eat",
    "explanation": "Tavsiye aktarımında 'advised someone to eat' şablonu kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g07-q12",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "The flight attendant warned passengers _____ their seatbelts during turbulence.",
    "options": [
      "to fasten",
      "fastening",
      "fasten",
      "fastened"
    ],
    "correctAnswer": "to fasten",
    "explanation": "Talimat aktarımında 'warned to fasten' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g07-q13",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "She told me that she had visited Paris _____.",
    "options": [
      "the year before",
      "last year",
      "yesterday",
      "tomorrow"
    ],
    "correctAnswer": "the year before",
    "explanation": "Dolaylı anlatımda 'last year' zaman zarfı 'the year before' veya 'the previous year' olur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g07-q14",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "\"I lost my keys yesterday,\" he said. -> He said that he _____ his keys the day before.",
    "options": [
      "had lost",
      "lost",
      "has lost",
      "was losing"
    ],
    "correctAnswer": "had lost",
    "explanation": "Past Simple 'lost', aktarımda Past Perfect 'had lost' olur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g07-q15",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "Which of the following sentences is grammatically INCORRECT?",
    "options": [
      "The manager said me that the deadline was extended.",
      "The manager told me that the deadline was extended.",
      "The manager said that the deadline was extended.",
      "The manager asked me to finish the report."
    ],
    "correctAnswer": "The manager said me that the deadline was extended.",
    "explanation": "'Say' fiilinden sonra doğrudan nesne gelemez; 'said me' kullanımı yanlıştır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g07-q16",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "The police officer strictly ordered the suspect _____ his hands where they could be seen.",
    "options": [
      "to keep",
      "keeping",
      "kept",
      "keep"
    ],
    "correctAnswer": "to keep",
    "explanation": "Emir aktarımında 'ordered someone to keep' kalıbı kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g07-q17",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "She explained that she _____ to the party because she had caught a severe cold.",
    "options": [
      "couldn't come",
      "can't come",
      "won't come",
      "comes"
    ],
    "correctAnswer": "couldn't come",
    "explanation": "Zaman uyumu gereği geçmiş gerekçeyle 'couldn't come' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g07-q18",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "Our biology teacher mentioned that the human heart _____ approximately 100,000 times a day.",
    "options": [
      "beats",
      "beat",
      "was beating",
      "had beaten"
    ],
    "correctAnswer": "beats",
    "explanation": "Bilimsel ve biyolojik genel geçer gerçeklerde dolaylı anlatımda zaman geriye kaydırılmaz (beats).",
    "difficulty": "hard"
  },
  {
    "id": "b1-g07-q19",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "He reminded me _____ the project files before leaving the office.",
    "options": [
      "not to forget",
      "to not forget",
      "don't forget",
      "not forgetting"
    ],
    "correctAnswer": "not to forget",
    "explanation": "'Not to forget' kalıbında olumsuzluk 'to'dan önce gelir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g07-q20",
    "topicId": "b1-g07",
    "level": "B1",
    "question": "She wondered where her colleagues _____ the emergency meeting.",
    "options": [
      "were holding",
      "are holding",
      "hold",
      "will hold"
    ],
    "correctAnswer": "were holding",
    "explanation": "Dolaylı soru cümlesinde zaman geriye kayarak 'were holding' olur ve düz cümle sırası korunur.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g08-q01",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "You have been working in the garden all day in the hot sun. You _____ be exhausted!",
    "options": [
      "must",
      "can't",
      "might",
      "couldn't"
    ],
    "correctAnswer": "must",
    "explanation": "Tüm gün sıcak altında çalışmanın güçlü mantıksal sonucu olarak 'must be exhausted' (%95 kesinlik) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g08-q02",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "That woman _____ be his grandmother; she looks barely thirty years old!",
    "options": [
      "can't",
      "must",
      "might not",
      "mustn't"
    ],
    "correctAnswer": "can't",
    "explanation": "Görünüşe dayalı kesin imkansızlık çıkarımında 'can't be' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g08-q03",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "I am not sure where Sarah is. She _____ be in the staff library.",
    "options": [
      "might",
      "must",
      "can't",
      "mustn't"
    ],
    "correctAnswer": "might",
    "explanation": "'I am not sure' ifadesi belirsizlik ve orta olasılık bildirir; 'might be' uygundur.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g08-q04",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "Listen to that loud cheering! Our football team _____ winning the championship.",
    "options": [
      "must be",
      "can't be",
      "might not be",
      "should be"
    ],
    "correctAnswer": "must be",
    "explanation": "Duyulan tezahürat güçlü bir kanıttır; 'must be winning' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g08-q05",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "He owns five luxury villas and a private yacht. He _____ be extremely wealthy.",
    "options": [
      "must",
      "can't",
      "might",
      "mustn't"
    ],
    "correctAnswer": "must",
    "explanation": "Maddi kanıtlardan çıkarılan güçlü olumlu sonuç 'must be' ile verilir.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g08-q06",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "It _____ be snowing in Antalya in August; that is completely impossible!",
    "options": [
      "can't",
      "must",
      "might",
      "mustn't"
    ],
    "correctAnswer": "can't",
    "explanation": "İmkansız durumlar için 'can't be' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g08-q07",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "Why is the office completely dark? Everyone _____ gone home early.",
    "options": [
      "must have",
      "can't have",
      "might not",
      "should"
    ],
    "correctAnswer": "must have",
    "explanation": "Ofisin tamamen karanlık olması herkesin eve gitmiş olduğu sonucunu doğurur (must have gone).",
    "difficulty": "medium"
  },
  {
    "id": "b1-g08-q08",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "That jacket _____ be Mehmet's because his jacket is dark blue and this is bright red.",
    "options": [
      "can't",
      "must",
      "might",
      "mustn't"
    ],
    "correctAnswer": "can't",
    "explanation": "Renk farkı kanıtıyla ceket Mehmet'in olamaz anlamında 'can't be' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g08-q09",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "Take an umbrella with you; the sky is gray and it _____ rain this afternoon.",
    "options": [
      "could",
      "must",
      "can't",
      "mustn't"
    ],
    "correctAnswer": "could",
    "explanation": "Havanın kapalı olması bir olasılıktır (could / might rain).",
    "difficulty": "medium"
  },
  {
    "id": "b1-g08-q10",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "Look at his fancy designer clothes; he _____ earn a substantial salary.",
    "options": [
      "must",
      "can't",
      "may not",
      "mustn't"
    ],
    "correctAnswer": "must",
    "explanation": "Kıyafetler yüksek kazanç çıkarımını destekler (must earn).",
    "difficulty": "medium"
  },
  {
    "id": "b1-g08-q11",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "The phone is ringing, but nobody answers. They _____ be asleep or out.",
    "options": [
      "might",
      "must to",
      "can't to",
      "could to"
    ],
    "correctAnswer": "might",
    "explanation": "Cevap verilmemesi olası durumları akla getirir (might be).",
    "difficulty": "medium"
  },
  {
    "id": "b1-g08-q12",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "This antique coin _____ be genuine; it feels much too light and looks plastic.",
    "options": [
      "can't",
      "must",
      "might",
      "mustn't"
    ],
    "correctAnswer": "can't",
    "explanation": "Hafifliği ve plastik görüntüsü sahte olduğuna kanıttır (can't be genuine).",
    "difficulty": "medium"
  },
  {
    "id": "b1-g08-q13",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "He speaks German with a native accent; he _____ lived in Germany for years.",
    "options": [
      "must have",
      "can't have",
      "might not",
      "should have"
    ],
    "correctAnswer": "must have",
    "explanation": "Aksansız konuşması geçmişte orada yaşamış olduğuna güçlü kanıttır (must have lived).",
    "difficulty": "medium"
  },
  {
    "id": "b1-g08-q14",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "Don't disturb Sude now; she _____ preparing her doctoral presentation.",
    "options": [
      "might be",
      "can't be",
      "must to be",
      "should to be"
    ],
    "correctAnswer": "might be",
    "explanation": "Şu anda hazırlanıyor olabileceği olasılığı 'might be preparing' ile anlatılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g08-q15",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "Which sentence is grammatically INCORRECT for making an impossibility deduction?",
    "options": [
      "He has lived here for twenty years, so he mustn't know the area.",
      "He has lived here for twenty years, so he can't be a stranger here.",
      "That story can't be true.",
      "She can't be working at this hour."
    ],
    "correctAnswer": "He has lived here for twenty years, so he mustn't know the area.",
    "explanation": "'Mustn't' çıkarım için kullanılamaz; olumsuz çıkarımda 'can't' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g08-q16",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "I am not entirely convinced, but the experimental treatment _____ prove effective.",
    "options": [
      "might",
      "must",
      "can't",
      "shall"
    ],
    "correctAnswer": "might",
    "explanation": "'Not entirely convinced' zayıf olasılık (might) gerektirir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g08-q17",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "They _____ have finished the construction already; they only started three days ago!",
    "options": [
      "can't",
      "must",
      "might",
      "mustn't"
    ],
    "correctAnswer": "can't",
    "explanation": "Üç gün önce başlanan inşaatın bitmiş olması imkansızdır (can't have finished).",
    "difficulty": "hard"
  },
  {
    "id": "b1-g08-q18",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "The front door was securely bolted from the inside, so the intruder _____ entered through the window.",
    "options": [
      "must have",
      "can't have",
      "might not",
      "should"
    ],
    "correctAnswer": "must have",
    "explanation": "Kapının içeriden kilitli olması pencereden girildiği sonucunu verir (must have entered).",
    "difficulty": "hard"
  },
  {
    "id": "b1-g08-q19",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "He hasn't replied to any messages today. He _____ be traveling on a long-haul flight.",
    "options": [
      "could",
      "must to",
      "can't to",
      "need"
    ],
    "correctAnswer": "could",
    "explanation": "Mesajlara bakmaması uçakta olma ihtimalini (could be traveling) gösterir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g08-q20",
    "topicId": "b1-g08",
    "level": "B1",
    "question": "You _____ have seen Ali in the office yesterday afternoon because he was in Paris with me!",
    "options": [
      "can't",
      "must",
      "might",
      "mustn't"
    ],
    "correctAnswer": "can't",
    "explanation": "Ali'nin Paris'te olması ofiste görülmüş olmasını imkansız kılar (can't have seen).",
    "difficulty": "hard"
  },
  {
    "id": "b1-g09-q01",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "She decided _____ a new laptop for her university studies.",
    "options": [
      "to buy",
      "buying",
      "buy",
      "bought"
    ],
    "correctAnswer": "to buy",
    "explanation": "'Decide' fiili daima 'to + V1' (to buy) alır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g09-q02",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "Ahmet enjoys _____ in the sea early in the morning.",
    "options": [
      "swimming",
      "to swim",
      "swim",
      "swam"
    ],
    "correctAnswer": "swimming",
    "explanation": "'Enjoy' fiilinden sonra daima Gerund (swimming) gelir.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g09-q03",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "I am looking forward to _____ you at the graduation ceremony.",
    "options": [
      "seeing",
      "see",
      "to see",
      "saw"
    ],
    "correctAnswer": "seeing",
    "explanation": "'Look forward to' kalıbındaki 'to' edattır ve arkasından -ing (seeing) alır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g09-q04",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "He left the meeting room without _____ a single word.",
    "options": [
      "saying",
      "to say",
      "say",
      "said"
    ],
    "correctAnswer": "saying",
    "explanation": "'Without' edatından sonra fiil -ing (saying) alır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g09-q05",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "It is very important _____ regular physical exercise.",
    "options": [
      "to do",
      "doing",
      "do",
      "did"
    ],
    "correctAnswer": "to do",
    "explanation": "Sıfatlardan sonra (important) infinitive 'to do' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g09-q06",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "Please remember _____ the front door before you go to sleep.",
    "options": [
      "to lock",
      "locking",
      "lock",
      "locked"
    ],
    "correctAnswer": "to lock",
    "explanation": "Yapılacak bir görevi hatırlatmak için 'remember to lock' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g09-q07",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "Sude promised _____ me with my English homework this evening.",
    "options": [
      "to help",
      "helping",
      "help",
      "helped"
    ],
    "correctAnswer": "to help",
    "explanation": "'Promise' geleceğe yönelik söz bildirdiği için 'to help' alır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g09-q08",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "He avoided _____ eye contact during the intense interrogation.",
    "options": [
      "making",
      "to make",
      "make",
      "made"
    ],
    "correctAnswer": "making",
    "explanation": "'Avoid' fiili kendisinden sonra Gerund (making) gerektirir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g09-q09",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "I clearly remember _____ this historic museum when I was ten years old.",
    "options": [
      "visiting",
      "to visit",
      "visit",
      "visited"
    ],
    "correctAnswer": "visiting",
    "explanation": "Geçmiş bir anıyı hatırlamak 'remember + V-ing' (visiting) ile anlatılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g09-q10",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "The doctor strongly advised him to stop _____ sugary energy drinks.",
    "options": [
      "drinking",
      "to drink",
      "drink",
      "drank"
    ],
    "correctAnswer": "drinking",
    "explanation": "Zararlı bir alışkanlığı tamamen bırakmak 'stop drinking' ile ifade edilir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g09-q11",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "We were exhausted from the long walk, so we stopped _____ some fresh water.",
    "options": [
      "to drink",
      "drinking",
      "drink",
      "drank"
    ],
    "correctAnswer": "to drink",
    "explanation": "Bir eylemi yapmak amacıyla mola vermek 'stopped to drink' şeklinde kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g09-q12",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "She is extremely good at _____ complex mathematical equations.",
    "options": [
      "solving",
      "to solve",
      "solve",
      "solved"
    ],
    "correctAnswer": "solving",
    "explanation": "'At' edatından sonra fiil Gerund (solving) olur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g09-q13",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "They managed _____ the mountain summit before the snowstorm hit.",
    "options": [
      "to reach",
      "reaching",
      "reach",
      "reached"
    ],
    "correctAnswer": "to reach",
    "explanation": "'Manage' zor bir şeyi başarmak anlamında 'to reach' alır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g09-q14",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "Would you mind _____ the window? It is getting quite chilly inside.",
    "options": [
      "closing",
      "to close",
      "close",
      "closed"
    ],
    "correctAnswer": "closing",
    "explanation": "'Would you mind' kalıbı daima Gerund (closing) alır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g09-q15",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "I tried _____ the heavy wooden wardrobe, but it was far too heavy for one person.",
    "options": [
      "to lift",
      "lifting",
      "lift",
      "lifted"
    ],
    "correctAnswer": "to lift",
    "explanation": "Güç sarf ederek çabalamak 'try to lift' ile verilir ('try lifting' yöntem denemektir).",
    "difficulty": "hard"
  },
  {
    "id": "b1-g09-q16",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "If you have a persistent headache, try _____ a glass of lukewarm water with lemon.",
    "options": [
      "drinking",
      "to drink",
      "drink",
      "drank"
    ],
    "correctAnswer": "drinking",
    "explanation": "Bir çare veya yöntem olarak denemek 'try drinking' ile ifade edilir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g09-q17",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "My parents never let me _____ out late with my friends on school nights.",
    "options": [
      "stay",
      "to stay",
      "staying",
      "stayed"
    ],
    "correctAnswer": "stay",
    "explanation": "'Let someone do something' kalıbında fiil yalın (stay) kalır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g09-q18",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "The funny comedian made the entire audience _____ uncontrollably.",
    "options": [
      "laugh",
      "to laugh",
      "laughing",
      "laughed"
    ],
    "correctAnswer": "laugh",
    "explanation": "'Make someone do something' kalıbında fiil yalın (laugh) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g09-q19",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "He confessed to _____ confidential files from the company server.",
    "options": [
      "stealing",
      "steal",
      "to steal",
      "stole"
    ],
    "correctAnswer": "stealing",
    "explanation": "'Confess to' kalıbındaki 'to' edattır ve arkasından Gerund (stealing) gerektirir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g09-q20",
    "topicId": "b1-g09",
    "level": "B1",
    "question": "She regrets _____ him the painful truth because it hurt his feelings deeply.",
    "options": [
      "telling",
      "to tell",
      "tell",
      "told"
    ],
    "correctAnswer": "telling",
    "explanation": "Geçmişte yapılmış bir eyleme duyulan pişmanlık 'regret telling' ile verilir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g10-q01",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "A teacher is a person _____ educates young minds and inspires students.",
    "options": [
      "who",
      "which",
      "where",
      "whose"
    ],
    "correctAnswer": "who",
    "explanation": "İnsanları niteleyen sıfat cümleciğinde 'who' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g10-q02",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "This is the smartphone _____ I bought online last weekend.",
    "options": [
      "which",
      "who",
      "where",
      "whose"
    ],
    "correctAnswer": "which",
    "explanation": "Cansız nesneleri niteleyen ilgi zamiri 'which' (veya that) tir.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g10-q03",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "That is the hospital _____ my younger brother was born.",
    "options": [
      "where",
      "which",
      "who",
      "when"
    ],
    "correctAnswer": "where",
    "explanation": "Mekanda gerçekleşen eylemi bağlamak için 'where' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g10-q04",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "I met a kind man _____ daughter studies medicine in İstanbul.",
    "options": [
      "whose",
      "who",
      "which",
      "where"
    ],
    "correctAnswer": "whose",
    "explanation": "Kızının babası arasındaki iyelik ilişkisi 'whose' ile bağlanır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g10-q05",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "The boy _____ won the chess championship is only nine years old.",
    "options": [
      "who",
      "which",
      "where",
      "whose"
    ],
    "correctAnswer": "who",
    "explanation": "Yarışmayı kazanan çocuğu nitelemek için 'who' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g10-q06",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "Is this the university campus _____ you spent your undergraduate years?",
    "options": [
      "where",
      "which",
      "who",
      "whose"
    ],
    "correctAnswer": "where",
    "explanation": "Yılların geçirildiği mekanı nitelemek için 'where' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g10-q07",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "The novel _____ Sude recommended to me was captivating from start to finish.",
    "options": [
      "that",
      "who",
      "where",
      "whose"
    ],
    "correctAnswer": "that",
    "explanation": "Cansız nesneyi niteleyen ve tanımlayıcı olan cümlecikte 'that' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g10-q08",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "We stayed at a cozy hotel _____ had a heated indoor swimming pool.",
    "options": [
      "which",
      "where",
      "who",
      "whose"
    ],
    "correctAnswer": "which",
    "explanation": "Otel bir mekan olmasına rağmen doğrudan fiille özneleştiği için 'where' değil 'which' alır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g10-q09",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "The architect _____ designed that award-winning cultural center is Turkish.",
    "options": [
      "who",
      "which",
      "where",
      "whose"
    ],
    "correctAnswer": "who",
    "explanation": "Mimarı (insan) niteleyen ilgi zamiri 'who'dur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g10-q10",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "A widow is a woman _____ husband has passed away.",
    "options": [
      "whose",
      "who",
      "which",
      "whom"
    ],
    "correctAnswer": "whose",
    "explanation": "Kocası vefat etmiş kadın ifadesindeki sahiplik bağı 'whose' ile kurulur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g10-q11",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "Do you remember the exact day _____ we first met at the book fair?",
    "options": [
      "when",
      "where",
      "which",
      "who"
    ],
    "correctAnswer": "when",
    "explanation": "Zamanı (the day) niteleyen bağlaç 'when'dir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g10-q12",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "The delicious chocolate cake _____ my mother baked was gone in five minutes.",
    "options": [
      "which",
      "who",
      "where",
      "whose"
    ],
    "correctAnswer": "which",
    "explanation": "Cansız nesne (cake) için 'which' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g10-q13",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "The students _____ passed the advanced English exam were awarded certificates.",
    "options": [
      "who",
      "which",
      "where",
      "whose"
    ],
    "correctAnswer": "who",
    "explanation": "Sınavı geçen öğrencileri niteleyen ilgi zamiri 'who'dur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g10-q14",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "That is the cafe _____ I wrote most of the chapters of my new book.",
    "options": [
      "where",
      "which",
      "who",
      "that"
    ],
    "correctAnswer": "where",
    "explanation": "Yazma eyleminin gerçekleştirildiği yeri ifade ettiği için 'where' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g10-q15",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "In which of the following sentences can the relative pronoun be OMITTED?",
    "options": [
      "The movie that we watched last night was thrilling.",
      "The actor who played the villain won an award.",
      "The woman whose car broke down called a mechanic.",
      "The building which collapsed was very old."
    ],
    "correctAnswer": "The movie that we watched last night was thrilling.",
    "explanation": "İlgi zamiri nesne konumunda olduğunda (we watched it) cümleden atılabilir: 'The movie we watched...'.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g10-q16",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "The historic library _____ was damaged during the fire has now been restored.",
    "options": [
      "which",
      "where",
      "whose",
      "who"
    ],
    "correctAnswer": "which",
    "explanation": "Kütüphane arkasından doğrudan fiil ('was damaged') aldığı için 'where' değil 'which' gerektirir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g10-q17",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "The family _____ house was severely destroyed in the flood received state aid.",
    "options": [
      "whose",
      "who",
      "which",
      "where"
    ],
    "correctAnswer": "whose",
    "explanation": "Evi zarar gören aileyi sahiplikle nitelemek için 'whose house' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g10-q18",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "The candidate _____ resume impressed the committee most was hired immediately.",
    "options": [
      "whose",
      "who",
      "which",
      "whom"
    ],
    "correctAnswer": "whose",
    "explanation": "Özgeçmişi komiteyi etkileyen aday ilişkisi 'whose resume' ile kurulur.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g10-q19",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "This is the peaceful town _____ my parents plan to retire next year.",
    "options": [
      "where",
      "which",
      "who",
      "whose"
    ],
    "correctAnswer": "where",
    "explanation": "Emekli olunacak mekanı nitelemek için 'where' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g10-q20",
    "topicId": "b1-g10",
    "level": "B1",
    "question": "People _____ exercise regularly tend to have lower cardiovascular risks.",
    "options": [
      "who",
      "which",
      "where",
      "whose"
    ],
    "correctAnswer": "who",
    "explanation": "Düzenli egzersiz yapan insanları niteleyen ilgi zamiri 'who'dur.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g11-q01",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "_____ it was raining heavily, we decided to go for a walk in the forest.",
    "options": [
      "Although",
      "Despite",
      "However",
      "In spite of"
    ],
    "correctAnswer": "Although",
    "explanation": "Tam bir cümle (it was raining heavily) geldiği için zıtlık bağlacı 'Although' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g11-q02",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "_____ the heavy rain, we decided to go for a walk in the forest.",
    "options": [
      "Despite",
      "Although",
      "Even though",
      "Though"
    ],
    "correctAnswer": "Despite",
    "explanation": "İsim öbeği (the heavy rain) geldiği için zıtlık bağlacı 'Despite' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g11-q03",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "He studied diligently for the exam. _____, he failed to obtain a passing grade.",
    "options": [
      "However",
      "Although",
      "Despite",
      "Because"
    ],
    "correctAnswer": "However",
    "explanation": "Noktadan sonra virgülle başlayan bağımsız cümle geçiş zarfı 'However' gerektirir.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g11-q04",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "She woke up very early _____ catch the morning express train.",
    "options": [
      "in order to",
      "so that",
      "because",
      "although"
    ],
    "correctAnswer": "in order to",
    "explanation": "Fiilin yalın haliyle (catch) amaç belirtmek için 'in order to' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g11-q05",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "He spoke softly _____ he wouldn't wake the sleeping patient.",
    "options": [
      "so that",
      "in order to",
      "despite",
      "because of"
    ],
    "correctAnswer": "so that",
    "explanation": "Tam bir cümleyle (he wouldn't wake) amaç belirtmek için 'so that' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g11-q06",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "_____ having very little money, they managed to travel across Europe.",
    "options": [
      "In spite of",
      "Although",
      "Even though",
      "However"
    ],
    "correctAnswer": "In spite of",
    "explanation": "V-ing (having) ile başlayan öbek 'In spite of' alır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g11-q07",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "_____ he was thoroughly exhausted, Ahmet stayed up to complete the report.",
    "options": [
      "Even though",
      "Despite",
      "In spite of",
      "Because of"
    ],
    "correctAnswer": "Even though",
    "explanation": "Tam bir cümle (he was exhausted) 'Even though' gerektirir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g11-q08",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "_____ his severe knee injury, the athlete finished the marathon race.",
    "options": [
      "Despite",
      "Although",
      "Even though",
      "Though"
    ],
    "correctAnswer": "Despite",
    "explanation": "İsim öbeği (his severe knee injury) 'Despite' gerektirir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g11-q09",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "The new smartphone is quite sleek; _____, its battery life is rather disappointing.",
    "options": [
      "however",
      "although",
      "despite",
      "in order to"
    ],
    "correctAnswer": "however",
    "explanation": "Noktalı virgül ve virgül arasındaki geçiş zarfı 'however'dır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g11-q10",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "We whispered quietly _____ disturb the other students in the library.",
    "options": [
      "so as not to",
      "so that",
      "in order to not",
      "despite"
    ],
    "correctAnswer": "so as not to",
    "explanation": "Olumsuz amaç bildiren yapı 'so as not to + V1' biçimindedir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g11-q11",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "She saved money for two years _____ she could afford to buy her own car.",
    "options": [
      "so that",
      "in order to",
      "despite",
      "although"
    ],
    "correctAnswer": "so that",
    "explanation": "Özne ve modal içeren cümlecik (she could afford) 'so that' alır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g11-q12",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "_____ the fact that it was freezing outside, they went swimming in the lake.",
    "options": [
      "Despite",
      "Although",
      "Even though",
      "Whereas"
    ],
    "correctAnswer": "Despite",
    "explanation": "'Despite the fact that' arkasından tam cümle alabilen özel kalıptır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g11-q13",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "He ate a large lunch; _____, he felt hungry again by mid-afternoon.",
    "options": [
      "nevertheless",
      "although",
      "in spite of",
      "despite"
    ],
    "correctAnswer": "nevertheless",
    "explanation": "Noktalı virgül sonrası zıtlık geçiş zarfı 'nevertheless' (yine de) dir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g11-q14",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "I will write down the instructions clearly _____ you don't forget anything.",
    "options": [
      "so that",
      "in order to",
      "despite",
      "although"
    ],
    "correctAnswer": "so that",
    "explanation": "Kendisine bağlı tam bir cümlecik (you don't forget anything) alarak amaç bildiren doğru yapı \"so that\" bağlacıdır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g11-q15",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "Which of the following sentences contains a grammatical error?",
    "options": [
      "Despite of his immense wealth, he leads a very humble life.",
      "Despite his immense wealth, he leads a very humble life.",
      "Although he is immensely wealthy, he leads a humble life.",
      "He is wealthy; however, he leads a humble life."
    ],
    "correctAnswer": "Despite of his immense wealth, he leads a very humble life.",
    "explanation": "'Despite of' İngilizcede kesinlikle yoktur; 'despite' olmalıdır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g11-q16",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "We took a detour along the secondary road _____ avoid the gridlocked traffic.",
    "options": [
      "in order to",
      "so that",
      "despite",
      "although"
    ],
    "correctAnswer": "in order to",
    "explanation": "Yalın fiil (avoid) öncesi amaç yapısı 'in order to'dur.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g11-q17",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "_____ being warned multiple times by the authorities, the hikers entered the gorge.",
    "options": [
      "In spite of",
      "Although",
      "Even though",
      "Whereas"
    ],
    "correctAnswer": "In spite of",
    "explanation": "V-ing pasif öbek (being warned) 'In spite of' alır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g11-q18",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "She worked two part-time jobs _____ pay her tuition fees without taking loans.",
    "options": [
      "so as to",
      "so that",
      "in order",
      "despite"
    ],
    "correctAnswer": "so as to",
    "explanation": "Amaç bildiren mastar yapısı 'so as to + V1' biçimindedir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g11-q19",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "_____ the torrential rainfall caused severe flash floods, the dam held firm.",
    "options": [
      "Although",
      "Despite",
      "In spite of",
      "Because of"
    ],
    "correctAnswer": "Although",
    "explanation": "Tam cümle (the rainfall caused floods) 'Although' gerektirir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g11-q20",
    "topicId": "b1-g11",
    "level": "B1",
    "question": "They turned off all the exterior lights _____ draw any unwanted attention.",
    "options": [
      "so as not to",
      "in order to not",
      "so that not",
      "despite"
    ],
    "correctAnswer": "so as not to",
    "explanation": "Doğru olumsuz amaç sıralaması 'so as not to + V1'dir.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g12-q01",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "You are an engineer, _____?",
    "options": [
      "aren't you",
      "are you",
      "don't you",
      "do you"
    ],
    "correctAnswer": "aren't you",
    "explanation": "Olumlu cümle (are) olumsuz soru eki 'aren't you?' alır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g12-q02",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "She doesn't work on Saturdays, _____?",
    "options": [
      "does she",
      "doesn't she",
      "is she",
      "isn't she"
    ],
    "correctAnswer": "does she",
    "explanation": "Olumsuz cümle (doesn't) olumlu soru eki 'does she?' alır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g12-q03",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "Ahmet can speak German fluently, _____?",
    "options": [
      "can't he",
      "can he",
      "doesn't he",
      "does he"
    ],
    "correctAnswer": "can't he",
    "explanation": "Modal (can) olumlu olduğu için tag 'can't he?' olur.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g12-q04",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "They haven't arrived yet, _____?",
    "options": [
      "have they",
      "haven't they",
      "did they",
      "didn't they"
    ],
    "correctAnswer": "have they",
    "explanation": "Olumsuz yardımcı fiil (haven't) olumlu tag 'have they?' alır.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g12-q05",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "Let's go for a walk in the park, _____?",
    "options": [
      "shall we",
      "will we",
      "do we",
      "aren't we"
    ],
    "correctAnswer": "shall we",
    "explanation": "'Let's' teklif yapısının sabit onay sorusu 'shall we?'dir.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g12-q06",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "I am invited to the wedding, _____?",
    "options": [
      "aren't I",
      "amn't I",
      "am I",
      "don't I"
    ],
    "correctAnswer": "aren't I",
    "explanation": "'I am' yapısının standart onay sorusu 'aren't I?' biçimindedir.",
    "difficulty": "easy"
  },
  {
    "id": "b1-g12-q07",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "Sude lived in London for two years, _____?",
    "options": [
      "didn't she",
      "did she",
      "wasn't she",
      "hasn't she"
    ],
    "correctAnswer": "didn't she",
    "explanation": "Past Simple olumlu cümle (lived) 'didn't she?' alır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g12-q08",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "He never drinks coffee in the evening, _____?",
    "options": [
      "does he",
      "doesn't he",
      "is he",
      "isn't he"
    ],
    "correctAnswer": "does he",
    "explanation": "'Never' olumsuzluk kattığı için onay sorusu olumlu 'does he?' olur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g12-q09",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "Please close the front door, _____?",
    "options": [
      "will you",
      "do you",
      "shall you",
      "won't you"
    ],
    "correctAnswer": "will you",
    "explanation": "Emir cümlelerinde onay sorusu 'will you?' biçimindedir.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g12-q10",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "Nobody called while I was out, _____?",
    "options": [
      "did they",
      "didn't they",
      "did he",
      "didn't he"
    ],
    "correctAnswer": "did they",
    "explanation": "'Nobody' olumsuzdur ve zamiri 'they' olur; olumlu 'did they?' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g12-q11",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "We should leave early tomorrow, _____?",
    "options": [
      "shouldn't we",
      "should we",
      "don't we",
      "won't we"
    ],
    "correctAnswer": "shouldn't we",
    "explanation": "Olumlu modal (should) olumsuz tag 'shouldn't we?' alır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g12-q12",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "There were many people at the conference, _____?",
    "options": [
      "weren't there",
      "were there",
      "weren't they",
      "didn't they"
    ],
    "correctAnswer": "weren't there",
    "explanation": "'There were' yapısının soru eki 'weren't there?' olur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g12-q13",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "Nothing was damaged during the minor tremor, _____?",
    "options": [
      "was it",
      "wasn't it",
      "did it",
      "were they"
    ],
    "correctAnswer": "was it",
    "explanation": "'Nothing' olumsuzdur ve zamiri 'it'tir; olumlu 'was it?' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g12-q14",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "You would rather stay at home tonight, _____?",
    "options": [
      "wouldn't you",
      "hadn't you",
      "don't you",
      "won't you"
    ],
    "correctAnswer": "wouldn't you",
    "explanation": "'Would rather' yapısının onay sorusu 'wouldn't you?' olur.",
    "difficulty": "medium"
  },
  {
    "id": "b1-g12-q15",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "She hardly ever complains about the heavy workload, _____?",
    "options": [
      "does she",
      "doesn't she",
      "is she",
      "isn't she"
    ],
    "correctAnswer": "does she",
    "explanation": "'Hardly ever' cümleye olumsuzluk kattığından tag olumlu (does she) olmalıdır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g12-q16",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "Don't touch those hot laboratory instruments, _____?",
    "options": [
      "will you",
      "do you",
      "shall you",
      "won't you"
    ],
    "correctAnswer": "will you",
    "explanation": "Olumsuz emir cümlelerinde onay sorusu 'will you?' ile kurulur.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g12-q17",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "Everybody was thrilled with the exceptional musical performance, _____?",
    "options": [
      "weren't they",
      "wasn't he",
      "weren't he",
      "wasn't it"
    ],
    "correctAnswer": "weren't they",
    "explanation": "'Everybody' tekil fiil (was) alsa da soru ekinde zamiri 'they' olduğundan fiil çoğul 'weren't they?' olur.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g12-q18",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "I am right about this matter, _____?",
    "options": [
      "aren't I",
      "am not I",
      "amn't I",
      "isn't it"
    ],
    "correctAnswer": "aren't I",
    "explanation": "'I am' yapısının kabul edilen tek doğru tag biçimi 'aren't I?'dır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g12-q19",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "Someone left their umbrella in the hallway, _____?",
    "options": [
      "didn't they",
      "did they",
      "did he",
      "didn't he"
    ],
    "correctAnswer": "didn't they",
    "explanation": "'Someone' tag kısmında 'they' zamirine dönüşür; Past Simple olumlu fiil 'didn't they?' alır.",
    "difficulty": "hard"
  },
  {
    "id": "b1-g12-q20",
    "topicId": "b1-g12",
    "level": "B1",
    "question": "You had better consult a specialist regarding your chronic back pain, _____?",
    "options": [
      "hadn't you",
      "better you",
      "wouldn't you",
      "shouldn't you"
    ],
    "correctAnswer": "hadn't you",
    "explanation": "'Had better' kalıbının soru eki 'hadn't you?' şeklinde kurulur.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g01-q01",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "They _____ at the bus stop for nearly forty minutes when the shuttle finally arrived.",
    "options": [
      "had been waiting",
      "were waiting",
      "have been waiting",
      "waited"
    ],
    "correctAnswer": "had been waiting",
    "explanation": "Geçmişteki bir olaydan ('when the shuttle finally arrived' - V2) önce belirli bir süre ('for nearly forty minutes') devam etmiş eylemi anlatmak için Past Perfect Continuous ('had been waiting') kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g01-q02",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "Her eyes were red and puffy because she _____ all afternoon.",
    "options": [
      "had been crying",
      "has been crying",
      "is crying",
      "cries"
    ],
    "correctAnswer": "had been crying",
    "explanation": "Geçmişteki bir durumun ('Her eyes were red') öncesinde süregelen ve fiziksel iz bırakan nedeni açıklarken 'had been crying' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g01-q03",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "How long _____ you _____ English before you moved to London last year?",
    "options": [
      "had / been learning",
      "have / been learning",
      "were / learning",
      "did / learn"
    ],
    "correctAnswer": "had / been learning",
    "explanation": "'Before you moved' (geçmişteki bir olaydan önce) ve 'How long' (ne kadar süredir) birleşimi Past Perfect Continuous soru kalıbını ('had / been learning') gerektirir.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g01-q04",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "The children's clothes were covered in mud because they _____ football in the rain.",
    "options": [
      "had been playing",
      "have been playing",
      "are playing",
      "play"
    ],
    "correctAnswer": "had been playing",
    "explanation": "Kıyafetlerin çamur içinde olması ('were covered') geçmiştedir; bu duruma yol açan önceki süreç 'had been playing' ile ifade edilir.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g01-q05",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "Emre was completely out of breath when I met him because he _____ all the way from the station.",
    "options": [
      "had been running",
      "has been running",
      "runs",
      "is running"
    ],
    "correctAnswer": "had been running",
    "explanation": "Geçmişte karşılaştığımızda nefes nefese kalmış olmasının ('was out of breath') öncesindeki devamlı eylem 'had been running'dir.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g01-q06",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "We _____ for over three hours without a break, so my father pulled over at a rest area.",
    "options": [
      "had been driving",
      "have been driving",
      "are driving",
      "drive"
    ],
    "correctAnswer": "had been driving",
    "explanation": "Babamın dinlenme tesisine çekmesinden ('pulled over' - V2) önce 3 saati aşkın süredir devam eden sürüş eylemi için 'had been driving' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g01-q07",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "By the time the rescue helicopter spotted the hikers, they _____ through the snowstorm for six hours.",
    "options": [
      "had been walking",
      "were walking",
      "walked",
      "have been walking"
    ],
    "correctAnswer": "had been walking",
    "explanation": "'By the time + V2 (spotted)' ve 'for six hours' (altı saattir) süreç ifadesi bir arada kullanıldığında Past Perfect Continuous ('had been walking') seçilir.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g01-q08",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "Selin _____ at that law firm for five years before she decided to open her own office.",
    "options": [
      "had been working",
      "has been working",
      "was working",
      "is working"
    ],
    "correctAnswer": "had been working",
    "explanation": "Kendi ofisini açmaya karar vermeden ('before she decided') önceki 5 yıllık çalışma sürecini anlatmak için 'had been working' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g01-q09",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "The kitchen smelled wonderful when I walked in because my grandmother _____ cinnamon rolls all morning.",
    "options": [
      "had been baking",
      "has been baking",
      "baked",
      "bakes"
    ],
    "correctAnswer": "had been baking",
    "explanation": "İçeri girdiğimde mutfağın harika kokmasının ('smelled wonderful') arkasındaki tüm sabah süren eylem 'had been baking' ile anlatılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g01-q10",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "I _____ well for several weeks, so I finally made an appointment with a specialist.",
    "options": [
      "hadn't been sleeping",
      "haven't been sleeping",
      "wasn't sleeping",
      "don't sleep"
    ],
    "correctAnswer": "hadn't been sleeping",
    "explanation": "Uzmandan randevu almadan ('made an appointment' - V2) önceki birkaç haftalık olumsuz süreci anlatmak için 'hadn't been sleeping' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g01-q11",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "The negotiations _____ smoothly for days until a sudden disagreement over pricing broke out.",
    "options": [
      "had been going",
      "have been going",
      "went",
      "are going"
    ],
    "correctAnswer": "had been going",
    "explanation": "Ani bir anlaşmazlık patlak verene kadar ('until ... broke out') günlerce devam etmiş olan süreci 'had been going' ifade eder.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g01-q12",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "When the power outage occurred, I _____ on my thesis for two hours without saving the document.",
    "options": [
      "had been working",
      "worked",
      "have been working",
      "am working"
    ],
    "correctAnswer": "had been working",
    "explanation": "Elektrik kesintisi meydana geldiğinde ('occurred' - V2) öncesinden beri iki saattir devam eden çalışma süreci 'had been working' ile anlatılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g01-q13",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "The pavement was slippery because it _____ since midnight and the temperature had dropped below zero.",
    "options": [
      "had been sleeting",
      "has been sleeting",
      "sleeted",
      "is sleeting"
    ],
    "correctAnswer": "had been sleeting",
    "explanation": "Kaldırımın kaygan olması ('was slippery') geçmiştedir; gece yarısından o ana kadar süren sulu kar yağışı 'had been sleeting' olur.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g01-q14",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "The musicians _____ for months before they gave their first live concert at the opera house.",
    "options": [
      "had been rehearsing",
      "were rehearsing",
      "have been rehearsing",
      "rehearse"
    ],
    "correctAnswer": "had been rehearsing",
    "explanation": "İlk canlı konserlerini vermeden ('before they gave') önce aylarca süren prova eylemi için 'had been rehearsing' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g01-q15",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "Although we _____ each other for more than a decade, we had never traveled abroad together until last summer.",
    "options": [
      "had known",
      "had been knowing",
      "knew",
      "have known"
    ],
    "correctAnswer": "had known",
    "explanation": "DİKKAT: 'For more than a decade' (on yıldan fazla süredir) süreç bildirse de 'know' bir durum fiilidir (stative verb) ve '-ing' alamaz. Bu yüzden 'had been knowing' yerine Past Perfect Simple ('had known') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g01-q16",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "By the time the editor called to check on my progress, I _____ four chapters of the novel.",
    "options": [
      "had translated",
      "had been translating",
      "was translating",
      "have translated"
    ],
    "correctAnswer": "had translated",
    "explanation": "Burada süreç ('for hours') değil, tamamlanmış net bir miktar ('four chapters of the novel') vurgulanmaktadır. Sayı/miktar belirtilen bitmiş eylemlerde Past Perfect Continuous değil, Past Perfect Simple ('had translated') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g01-q17",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "My uncle _____ that vintage motorcycle for fifteen years before he finally agreed to sell it to a collector.",
    "options": [
      "had owned",
      "had been owning",
      "was owning",
      "has owned"
    ],
    "correctAnswer": "had owned",
    "explanation": "'Own' (sahip olmak) sahiplik bildiren bir durum fiilidir ve Continuous (-ing) yapıya giremez. 'For fifteen years' olsa dahi doğru cevap 'had owned' olmalıdır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g01-q18",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "The detectives realized that the suspect _____ the company's financial records for months before the audit took place.",
    "options": [
      "had been falsifying",
      "was falsifying",
      "has been falsifying",
      "falsified"
    ],
    "correctAnswer": "had been falsifying",
    "explanation": "Denetim gerçekleşmeden ('before the audit took place') önce aylarca devam eden ('for months') evrakta sahtecilik süreci 'had been falsifying' ile anlatılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g01-q19",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "She _____ three cups of strong coffee before the morning briefing, yet she still felt drowsy.",
    "options": [
      "had drunk",
      "had been drinking",
      "was drinking",
      "has drunk"
    ],
    "correctAnswer": "had drunk",
    "explanation": "'Three cups of strong coffee' tamamlanmış bir sayı/miktar belirttiği için süreç odaklı Continuous yapı değil, sonuç ve miktar odaklı Past Perfect Simple ('had drunk') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g01-q20",
    "topicId": "b2-g01",
    "level": "B2",
    "question": "Until he won the national championship in 2022, the young athlete _____ under the guidance of his father for seven years.",
    "options": [
      "had been training",
      "was training",
      "has been training",
      "trained"
    ],
    "correctAnswer": "had been training",
    "explanation": "2022'de şampiyonluğu kazanana kadar ('Until he won') yedi yıl boyunca ('for seven years') devam etmiş olan antrenman süreci 'had been training' gerektirir.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g02-q01",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "This time tomorrow, we _____ over the Atlantic Ocean on our way to New York.",
    "options": [
      "will be flying",
      "will have flown",
      "fly",
      "have flown"
    ],
    "correctAnswer": "will be flying",
    "explanation": "'This time tomorrow' (yarın tam bu vakitlerde) gelecekte belirli bir anda devam ediyor olacak eylemi anlatır; bu nedenle Future Continuous ('will be flying') kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g02-q02",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "By next Friday, the technicians _____ the new fiber-optic cables throughout the entire building.",
    "options": [
      "will have installed",
      "will be installing",
      "install",
      "installed"
    ],
    "correctAnswer": "will have installed",
    "explanation": "'By next Friday' (gelecek cumaya kadar) ifadesi eylemin o tarihten önce tamamlanmış olacağını bildirir ve Future Perfect ('will have installed') gerektirir.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g02-q03",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "Please don't phone me between 7 and 8 PM tonight because I _____ my piano lesson then.",
    "options": [
      "will be having",
      "will have had",
      "have",
      "had"
    ],
    "correctAnswer": "will be having",
    "explanation": "Gelecekte belirli bir saat aralığında ('between 7 and 8 PM tonight') devam etmekte olacak bir eylem için Future Continuous ('will be having') kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g02-q04",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "By 2030, many automobile manufacturers _____ producing petrol-powered vehicles completely.",
    "options": [
      "will have stopped",
      "will be stopping",
      "stopped",
      "are stopping"
    ],
    "correctAnswer": "will have stopped",
    "explanation": "'By 2030' (2030 yılına kadar / 2030 itibarıyla) tamamlanmış olacak bir değişimi ifade ettiği için Future Perfect ('will have stopped') doğrudur.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g02-q05",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "At 10 o'clock tomorrow morning, the candidates _____ their oral presentations in front of the jury.",
    "options": [
      "will be giving",
      "will have given",
      "give",
      "gave"
    ],
    "correctAnswer": "will be giving",
    "explanation": "'At 10 o'clock tomorrow morning' gelecekte nokta bir zaman verir; o sırada sürmekte olacak eylem için 'will be giving' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g02-q06",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "I promise I _____ all my debts to you by the end of next month.",
    "options": [
      "will have paid back",
      "will be paying back",
      "pay back",
      "paid back"
    ],
    "correctAnswer": "will have paid back",
    "explanation": "'By the end of next month' (gelecek ayın sonuna kadar) borcun tamamen ödenip bitmiş olacağını vurguladığı için 'will have paid back' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g02-q07",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "By the time you wake up tomorrow morning, I _____ for the airport.",
    "options": [
      "will have left",
      "will be leaving",
      "leave",
      "am leaving"
    ],
    "correctAnswer": "will have left",
    "explanation": "'By the time you wake up' (sen uyanana kadar) havalimanı için yola çıkma eylemi çoktan gerçekleşmiş olacağından Future Perfect ('will have left') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g02-q08",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "_____ you _____ your laptop this evening, or may I borrow it to finish my slide deck?",
    "options": [
      "Will / be using",
      "Will / have used",
      "Do / use",
      "Have / used"
    ],
    "correctAnswer": "Will / be using",
    "explanation": "Bir ricada bulunmadan önce karşı tarafın gelecekteki planını/devam edecek eylemini kibarca sorarken Future Continuous soru kalıbı ('Will you be using...?') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g02-q09",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "We are driving too slowly; by the time we _____ to the cinema, the film will have already started.",
    "options": [
      "get",
      "will get",
      "got",
      "will have got"
    ],
    "correctAnswer": "get",
    "explanation": "Zaman bağlacı ('by the time') bulunan yan cümlecikte gelecek anlam için asla 'will' kullanılmaz; Simple Present ('get') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g02-q10",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "Don't worry about the mess in the living room; we _____ everything up before the guests arrive tonight.",
    "options": [
      "will have tidied",
      "will be tidying",
      "tidied",
      "have tidied"
    ],
    "correctAnswer": "will have tidied",
    "explanation": "'Before the guests arrive tonight' (bu akşam misafirler gelmeden önce) işin tamamlanmış olacağını bildirir → 'will have tidied'.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g02-q11",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "This time next month, my sister _____ in her new apartment in Vienna.",
    "options": [
      "will be living",
      "will have lived",
      "lives",
      "has lived"
    ],
    "correctAnswer": "will be living",
    "explanation": "'This time next month' (gelecek ay bu vakitlerde) gelecekte o anda devam etmekte olacak yaşam düzenini anlatır → 'will be living'.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g02-q12",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "If you call her at 6 PM, she probably won't answer because she _____ home from the office.",
    "options": [
      "will be driving",
      "will have driven",
      "drives",
      "drove"
    ],
    "correctAnswer": "will be driving",
    "explanation": "Akşam saat 6'da aradığında tam o sırada işten eve arabayla dönüyor olacağı (devam eden eylem) için 'will be driving' doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g02-q13",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "How many countries _____ you _____ by the time you finish your European rail tour next month?",
    "options": [
      "will / have visited",
      "will / be visiting",
      "do / visit",
      "have / visited"
    ],
    "correctAnswer": "will / have visited",
    "explanation": "'By the time you finish' (bitirene kadar) ve 'How many countries' (tamamlanmış sayı/miktar) Future Perfect soru yapısını ('will / have visited') gerektirir.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g02-q14",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "In three hours' time, I _____ my last university exam and my summer holiday will officially begin!",
    "options": [
      "will have taken",
      "will be taking",
      "take",
      "took"
    ],
    "correctAnswer": "will have taken",
    "explanation": "Yaz tatilinin resmen başlayabilmesi için üç saat içinde son sınavın verilip bitmiş olması gerekir; tamamlanmış gelecek eylem için 'will have taken' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g02-q15",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "By the end of this academic year, Professor Yılmaz _____ at our faculty for thirty years.",
    "options": [
      "will have been lecturing",
      "will be lecturing",
      "is lecturing",
      "lectured"
    ],
    "correctAnswer": "will have been lecturing",
    "explanation": "Hem 'By the end of this academic year' (gelecek referans noktası) hem de 'for thirty years' (süreç) bir arada olduğu için Future Perfect Continuous ('will have been lecturing') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g02-q16",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "The new high-speed railway tunnel _____ by the end of 2027, cutting travel time in half.",
    "options": [
      "will have been completed",
      "will have completed",
      "will be completing",
      "is completing"
    ],
    "correctAnswer": "will have been completed",
    "explanation": "DİKKAT: 'By the end of 2027' Future Perfect gerektirir; ancak özne 'The new high-speed railway tunnel' (tünel) cansızdır ve kendi kendini tamamlayamaz. Bu yüzden edilgen (Future Perfect Passive: 'will have been completed') olmalıdır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g02-q17",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "By the time we celebrate our anniversary in June, we _____ each other for exactly twenty years.",
    "options": [
      "will have known",
      "will have been knowing",
      "will be knowing",
      "know"
    ],
    "correctAnswer": "will have known",
    "explanation": "'By the time...' ve 'for twenty years' olmasına rağmen 'know' bir durum fiilidir (stative verb) ve '-ing' alamaz. Bu nedenle 'will have been knowing' yerine 'will have known' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g02-q18",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "When the marathon runners reach the stadium at noon tomorrow, they _____ continuously for over three hours.",
    "options": [
      "will have been running",
      "will be running",
      "will have run",
      "are running"
    ],
    "correctAnswer": "will have been running",
    "explanation": "Yarın öğlen stadyuma ulaştıkları gelecek noktasında ('When ... reach'), 3 saati aşkın süredir kesintisiz koşmakta olacakları ('continuously for over three hours') için Future Perfect Continuous ('will have been running') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g02-q19",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "By this time tomorrow, all the conference delegates _____ at their hotels, whereas right now most of them are still at the airport.",
    "options": [
      "will have checked in",
      "will be checking in",
      "check in",
      "checked in"
    ],
    "correctAnswer": "will have checked in",
    "explanation": "DİKKAT: 'This time tomorrow' değil, 'BY this time tomorrow' (yarın bu vakte kadar) denmektedir. 'By' edatı tüm delegelerin otele giriş işlemini tamamlamış olacağını bildirdiği için 'will have checked in' doğrudur.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g02-q20",
    "topicId": "b2-g02",
    "level": "B2",
    "question": "Once the board _____ the budget proposal tomorrow, we will have secured all the funding needed for the project.",
    "options": [
      "approves",
      "will approve",
      "will have approved",
      "approved"
    ],
    "correctAnswer": "approves",
    "explanation": "'Once' (...-dığında / bir kez ... olunca) bir zaman bağlacıdır. Zaman bağlaçlarının bulunduğu yan cümlecikte gelecek anlam için 'will' kullanılmaz; Simple Present ('approves') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g03-q01",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "You _____ told me that the meeting was canceled! I waited in the conference room for an hour.",
    "options": [
      "should have",
      "must have",
      "can't have",
      "needn't have"
    ],
    "correctAnswer": "should have",
    "explanation": "Geçmişte yapılması gereken ama yapılmayan bir eylem için sitem ve eleştiri bildirirken 'should have + V3' ('You should have told me' — Bana söylemeliydin) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g03-q02",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "The grass in the garden is completely wet this morning; it _____ rained heavily during the night.",
    "options": [
      "must have",
      "should have",
      "can't have",
      "needn't have"
    ],
    "correctAnswer": "must have",
    "explanation": "Çimlerin tamamen ıslak olması güçlü bir kanıttır. Kanıta dayalı güçlü olumlu geçmiş çıkarımlar için 'must have + V3' ('yağmış olmalı') kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g03-q03",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "I _____ eaten that third slice of chocolate cake last night; I felt terrible afterwards.",
    "options": [
      "shouldn't have",
      "mustn't have",
      "couldn't have",
      "might not have"
    ],
    "correctAnswer": "shouldn't have",
    "explanation": "Geçmişte yapılan bir hatadan duyulan pişmanlığı ifade etmek için 'shouldn't have + V3' ('yememeliydim ama yedim') kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g03-q04",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "You _____ seen Burak at the shopping mall yesterday; he has been in Japan all week!",
    "options": [
      "can't have",
      "mustn't have",
      "shouldn't have",
      "needn't have"
    ],
    "correctAnswer": "can't have",
    "explanation": "Burak bütün hafta Japonya'da olduğuna göre dün alışveriş merkezinde görülmüş olması imkânsızdır. Güçlü olumsuz geçmiş çıkarım için 'can't have + V3' kullanılır ('mustn't have' çıkarım için kullanılmaz).",
    "difficulty": "easy"
  },
  {
    "id": "b2-g03-q05",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "I'm not sure where I left my sunglasses, but I _____ left them on the café table.",
    "options": [
      "might have",
      "should have",
      "can't have",
      "would have"
    ],
    "correctAnswer": "might have",
    "explanation": "'I'm not sure' (emin değilim) ifadesi geçmişe dair %50 zayıf bir olasılığı gösterir; bunun için 'might have + V3' ('bırakmış olabilirim') kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g03-q06",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "We _____ bought tickets online in advance; the queue at the entrance was huge and we wasted an hour.",
    "options": [
      "ought to have",
      "must have",
      "can't have",
      "might have"
    ],
    "correctAnswer": "ought to have",
    "explanation": "'Ought to have + V3', tıpkı 'should have + V3' gibi geçmişe yönelik pişmanlık ('biletleri önceden internetten almalıydık') ifade eder.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g03-q07",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "You _____ watered the flowers in the garden this morning; the automatic sprinkler system had already done it.",
    "options": [
      "needn't have",
      "mustn't have",
      "can't have",
      "wouldn't have"
    ],
    "correctAnswer": "needn't have",
    "explanation": "Otomatik sulama sistemi çiçekleri zaten suladığı için senin sulamana gerek yoktu ama boşuna suladın. Gereksiz yere yapılmış geçmiş eylemler için 'needn't have + V3' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g03-q08",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "She _____ accepted the job offer in Zurich, but she chose to stay close to her family in Izmir.",
    "options": [
      "could have",
      "must have",
      "can't have",
      "shouldn't have"
    ],
    "correctAnswer": "could have",
    "explanation": "Geçmişte Zürih'teki iş teklifini kabul etme imkânı/fırsatı vardı ama kendi tercihiyle yapmadı ('... but she chose to stay'). Kaçırılmış veya tercih edilmemiş geçmiş imkânlar 'could have + V3' ile anlatılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g03-q09",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "I _____ helped you move your furniture yesterday, but you didn't even tell me you were moving!",
    "options": [
      "would have",
      "must have",
      "can't have",
      "needn't have"
    ],
    "correctAnswer": "would have",
    "explanation": "Geçmişte yapmaya istekli olunan ancak bir engel/bilgisizlik yüzünden gerçekleşmeyen niyetleri ('yardım ederdim ama bana söylemedin') anlatmak için 'would have + V3' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g03-q10",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "The front door was locked from the inside, so the burglar _____ entered through the kitchen window.",
    "options": [
      "must have",
      "should have",
      "needn't have",
      "would have"
    ],
    "correctAnswer": "must have",
    "explanation": "Ön kapının içeriden kilitli olması mantıksal bir kanıttır; hırsızın mutfak penceresinden girmiş olduğu güçlü çıkarımı 'must have entered' ile yapılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g03-q11",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "Why did you walk all the way from the train station in the rain? You _____ called me to pick you up!",
    "options": [
      "could have",
      "must have",
      "can't have",
      "may have"
    ],
    "correctAnswer": "could have",
    "explanation": "'Beni seni almam için arayabilirdin (öyle bir imkânın vardı ama aramadın)' anlamında sitem ve geçmiş olasılık için 'could have called' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g03-q12",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "Tarkan didn't reply to my greeting in the corridor; he _____ noticed me because he wasn't wearing his glasses.",
    "options": [
      "might not have",
      "shouldn't have",
      "needn't have",
      "must not"
    ],
    "correctAnswer": "might not have",
    "explanation": "Gözlüğünü takmadığı için beni fark etmemiş olabilir (geçmişe yönelik olumsuz ihtimal) anlamında 'might not have noticed' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g03-q13",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "This ancient gold coin _____ belonged to a Roman emperor, though archaeologists haven't confirmed it yet.",
    "options": [
      "may have",
      "must have",
      "should have",
      "would have"
    ],
    "correctAnswer": "may have",
    "explanation": "'Though archaeologists haven't confirmed it yet' (henüz doğrulamadılar) ifadesi kesinlik olmadığını gösterir; bu nedenle zayıf olasılık bildiren 'may have belonged' doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g03-q14",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "He _____ passed that difficult calculus exam without cheating; he hadn't attended a single lecture all semester!",
    "options": [
      "couldn't have",
      "mustn't have",
      "shouldn't have",
      "needn't have"
    ],
    "correctAnswer": "couldn't have",
    "explanation": "Bütün dönem tek bir derse bile katılmadığına göre kopya çekmeden o zor sınavı geçmiş olamaz (imkânsız çıkarım) → 'couldn't have passed'.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g03-q15",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "When I knocked on Pelin's door at midnight, there was no answer; she _____ deeply.",
    "options": [
      "must have been sleeping",
      "should have slept",
      "needn't have slept",
      "can't be sleeping"
    ],
    "correctAnswer": "must have been sleeping",
    "explanation": "Gece yarısı kapıyı çaldığım o anda içeriden ses gelmemesine dayanarak, o sırada derin uyuyor olduğu (devam eden geçmiş eylem çıkarımı) 'must have been sleeping' ile ifade edilir.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g03-q16",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "Because the museum entrance was free on Sunday, we _____ for tickets, so we spent that money on souvenirs instead.",
    "options": [
      "didn't need to pay",
      "needn't have paid",
      "mustn't have paid",
      "shouldn't have paid"
    ],
    "correctAnswer": "didn't need to pay",
    "explanation": "DİKKAT: Parayı hediyelik eşyaya harcadıklarına göre bilete para ÖDEMEDİLER. 'Needn't have paid' olsaydı 'gerek yoktu ama boşuna ödedik' anlamına gelirdi. Gerek olmadığı için yapılmayan geçmiş eylemlerde 'didn't need to + V1' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g03-q17",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "The confidential file is missing from the safe; it _____ by someone who knew the combination code.",
    "options": [
      "must have been taken",
      "must have taken",
      "should have taken",
      "could take"
    ],
    "correctAnswer": "must have been taken",
    "explanation": "Özne 'it' (gizli dosya) cansızdır; şifreyi bilen biri tarafından 'alınmış olmalı' derken Past Modal Passive ('must have been + V3') kullanılmalıdır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g03-q18",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "The driver _____ at his phone when the accident happened; otherwise, he would have seen the red light.",
    "options": [
      "must have been looking",
      "should have looked",
      "can't have looked",
      "would have looked"
    ],
    "correctAnswer": "must have been looking",
    "explanation": "'Yoksa kırmızı ışığı görürdü' kanıtından hareketle, kaza olduğu sırada sürücünün telefonuna bakıyor olduğu (geçmiş süreç çıkarımı) 'must have been looking' ile anlatılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g03-q19",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "I _____ a formal suit for the interview, as the company had a casual dress code, so I felt overdressed all day.",
    "options": [
      "needn't have bought",
      "didn't need to buy",
      "can't have bought",
      "mustn't have bought"
    ],
    "correctAnswer": "needn't have bought",
    "explanation": "'Bütün gün fazla şık giyinmiş hissettim (felt overdressed)' ifadesi takım elbisenin satın alınıp giyildiğini kanıtlar. Gerek olmadığı halde boşuna yapılmış geçmiş eylem için 'needn't have bought' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g03-q20",
    "topicId": "b2-g03",
    "level": "B2",
    "question": "You _____ the spare key under the doormat! Anyone could have found it and broken into the house.",
    "options": [
      "shouldn't have hidden",
      "can't have hidden",
      "mustn't have hidden",
      "wouldn't have hidden"
    ],
    "correctAnswer": "shouldn't have hidden",
    "explanation": "Yedek anahtar paspasın altına saklanmış ve bu tehlikeli davranış eleştiriliyor: 'Saklamamalıydın! Herkes bulup eve girebilirdi.' Geçmişe yönelik eleştiri için 'shouldn't have hidden' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g04-q01",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "If we _____ earlier yesterday morning, we wouldn’t have gotten stuck in heavy traffic.",
    "options": [
      "had left",
      "left",
      "would have left",
      "have left"
    ],
    "correctAnswer": "had left",
    "explanation": "Geçmişteki gerçek dışı durumu anlatan Third Conditional (Type 3) yapısında \"If\" cümleciği Past Perfect (had left) olmalıdır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g04-q02",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "If Emre had listened to his doctor’s advice last month, he _____ in hospital right now.",
    "options": [
      "wouldn’t be",
      "wouldn’t have been",
      "isn’t",
      "won’t be"
    ],
    "correctAnswer": "wouldn’t be",
    "explanation": "Mixed Conditional (Geçmiş Koşul → Şimdiki Sonuç): Koşul geçen ay (had listened), ancak sonuç \"right now\" (şu anda) olduğu için ana cümlede Type 2 (wouldn’t be) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g04-q03",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "She _____ the scholarship last year if she had submitted her application before the deadline.",
    "options": [
      "could have won",
      "can win",
      "would win",
      "had won"
    ],
    "correctAnswer": "could have won",
    "explanation": "Hem koşul hem sonuç geçen yıl (last year) geçmişte kaldığı için Third Conditional sonuç cümlesi \"could have + V3\" (could have won) olur.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g04-q04",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "If I _____ so afraid of heights, I would have gone paragliding with my friends in Fethiye last summer.",
    "options": [
      "weren’t",
      "hadn’t been",
      "wouldn’t be",
      "am not"
    ],
    "correctAnswer": "weren’t",
    "explanation": "Mixed Conditional (Genel Durum → Geçmiş Sonuç): Yükseklikten korkmak kişinin genel/kalıcı özelliğidir (Type 2: If I weren’t), geçen yaz yamaç paraşütüne gitmemek ise geçmiş sonuçtur (would have gone).",
    "difficulty": "hard"
  },
  {
    "id": "b2-g04-q05",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "_____ you told me that you were coming to town, I would have arranged a meeting for us.",
    "options": [
      "Had",
      "If",
      "Were",
      "Should"
    ],
    "correctAnswer": "Had",
    "explanation": "\"If you had told me...\" cümlesinde \"If\" atılarak devrik (Inversion) yapıldığında cümle \"Had you told me...\" şeklinde başlar.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g04-q06",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "If the company hadn’t invested in renewable energy ten years ago, it _____ the market leader today.",
    "options": [
      "wouldn’t be",
      "wouldn’t have been",
      "hadn’t been",
      "won’t be"
    ],
    "correctAnswer": "wouldn’t be",
    "explanation": "Koşul 10 yıl önce (hadn’t invested — Type 3), sonuç ise \"today\" (bugün) olduğu için ana cümle Type 2 (wouldn’t be) olmalıdır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g04-q07",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "Nobody would have believed his story if he _____ clear photographic evidence.",
    "options": [
      "hadn’t shown",
      "didn’t show",
      "wouldn’t have shown",
      "hasn’t shown"
    ],
    "correctAnswer": "hadn’t shown",
    "explanation": "Ana cümle \"would have believed\" (Type 3) olduğuna göre, \"if\" cümleciğinde Past Perfect (hadn’t shown) kullanılmalıdır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g04-q08",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "If I _____ how traffic-congested that route was, I would have taken the subway instead.",
    "options": [
      "had known",
      "knew",
      "would have known",
      "have known"
    ],
    "correctAnswer": "had known",
    "explanation": "Geçmişteki o yolculuk sırasında rotanın ne kadar sıkışık olduğunu bilmiş olsaydım (If I had known), metroyu kullanırdım (would have taken).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g04-q09",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "You _____ so exhausted this morning if you hadn’t stayed up watching movies until 4 AM.",
    "options": [
      "wouldn’t feel",
      "wouldn’t have felt",
      "didn’t feel",
      "won’t feel"
    ],
    "correctAnswer": "wouldn’t feel",
    "explanation": "Gece 4’e kadar oturmak geçmişte kaldı (hadn’t stayed up), ancak yorgun hissetme durumu şu an (this morning — konuşma anı) devam ettiği için \"wouldn’t feel\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g04-q10",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "But for the goalkeeper’s incredible save in the last minute, our team _____ the championship final.",
    "options": [
      "would have lost",
      "would lose",
      "had lost",
      "lost"
    ],
    "correctAnswer": "would have lost",
    "explanation": "\"But for + noun\" (If it hadn’t been for... — Kalecinin son dakikadaki inanılmaz kurtarışı olmasaydı) geçmişteki tamamlanmış maçı anlattığı için ana cümlede \"would have lost\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g04-q11",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "If she _____ more organized in general, she wouldn’t have missed two important client meetings last week.",
    "options": [
      "were",
      "had been",
      "would be",
      "is"
    ],
    "correctAnswer": "were",
    "explanation": "\"In general\" (genel olarak) ifadesi kişinin kalıcı karakter özelliğini vurgular (Type 2: If she were), geçen haftaki toplantıları kaçırması ise geçmiş sonuçtur (Type 3).",
    "difficulty": "hard"
  },
  {
    "id": "b2-g04-q12",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "What _____ you _____ if you had been in my position during yesterday’s negotiation?",
    "options": [
      "would / have done",
      "did / do",
      "would / do",
      "had / done"
    ],
    "correctAnswer": "would / have done",
    "explanation": "Dünkü müzakere sırasında (\"during yesterday’s negotiation\") benim yerimde olsaydın (\"if you had been\") ne yapardın? → \"What would you have done?\"",
    "difficulty": "easy"
  },
  {
    "id": "b2-g04-q13",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "If the firefighters _____ within ten minutes, the historic building might have burned down completely.",
    "options": [
      "hadn’t arrived",
      "didn’t arrive",
      "wouldn’t arrive",
      "haven’t arrived"
    ],
    "correctAnswer": "hadn’t arrived",
    "explanation": "Ana cümlede \"might have burned down\" (Type 3 olasılık) bulunduğundan, If cümleciğinde Past Perfect (hadn’t arrived) yer almalıdır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g04-q14",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "If I had backed up my laptop before the system crash, I _____ all these reports again right now.",
    "options": [
      "wouldn’t be writing",
      "wouldn’t have written",
      "hadn’t written",
      "won’t write"
    ],
    "correctAnswer": "wouldn’t be writing",
    "explanation": "Bilgisayarı çökmeden önce yedeklememiş olmam geçmiştedir (had backed up), ancak raporları \"right now\" (şu anda) tekrar yazıyor olmam şimdiki zamandır (wouldn’t be writing).",
    "difficulty": "hard"
  },
  {
    "id": "b2-g04-q15",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "He might not have made such a risky investment if he _____ a financial advisor first.",
    "options": [
      "had consulted",
      "consulted",
      "would consult",
      "has consulted"
    ],
    "correctAnswer": "had consulted",
    "explanation": "Geçmişte riskli bir yatırım yapmış; öncesinde bir danışmana danışmış olsaydı (if he had consulted) bunu yapmayabilirdi (might not have made).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g04-q16",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "If they _____ close friends, they wouldn’t have defended each other so strongly at yesterday’s meeting.",
    "options": [
      "weren’t",
      "hadn’t been",
      "aren’t",
      "wouldn’t be"
    ],
    "correctAnswer": "weren’t",
    "explanation": "Yakın arkadaş olmaları genel/devam eden bir durumdur (If they weren’t close friends — Type 2), dünkü toplantıda birbirlerini savunmaları ise geçmiş sonuçtur (Type 3).",
    "difficulty": "hard"
  },
  {
    "id": "b2-g04-q17",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "If you hadn’t forgotten to lock the back door last night, the thief _____ into the house so easily.",
    "options": [
      "couldn’t have gotten",
      "can’t get",
      "couldn’t get",
      "hadn’t gotten"
    ],
    "correctAnswer": "couldn’t have gotten",
    "explanation": "Dün gece kapıyı kilitlemeyi unutmasaydın (hadn’t forgotten), hırsız eve bu kadar kolay giremezdi (couldn’t have gotten — Type 3).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g04-q18",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "Had the weather been warmer last weekend, we _____ a picnic by the lake.",
    "options": [
      "would have organized",
      "would organize",
      "organized",
      "had organized"
    ],
    "correctAnswer": "would have organized",
    "explanation": "\"Had the weather been warmer last weekend\" = \"If the weather had been warmer last weekend\" (Type 3). Ana cümlede \"would have organized\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g04-q19",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "If Sinan had accepted the scholarship in Canada three years ago, he _____ fluent English now.",
    "options": [
      "would speak",
      "would have spoken",
      "spoke",
      "had spoken"
    ],
    "correctAnswer": "would speak",
    "explanation": "Bursu üç yıl önce kabul etmiş olsaydı (had accepted — Type 3), şu anda (\"now\") akıcı İngilizce konuşuyor olurdu (would speak — Type 2).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g04-q20",
    "topicId": "b2-g04",
    "level": "B2",
    "question": "We _____ lost on our way to the village yesterday if our phone battery hadn’t died.",
    "options": [
      "wouldn’t have gotten",
      "wouldn’t get",
      "didn’t get",
      "hadn’t gotten"
    ],
    "correctAnswer": "wouldn’t have gotten",
    "explanation": "Dün köye giderken telefonumuzun şarjı bitmemiş olsaydı (hadn’t died), kaybolmazdık (wouldn’t have gotten lost — Type 3).",
    "difficulty": "easy"
  },
  {
    "id": "b2-g05-q01",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "I need to have my winter coat _____ before the cold weather starts next week.",
    "options": [
      "dry-cleaned",
      "dry-clean",
      "to dry-clean",
      "dry-cleaning"
    ],
    "correctAnswer": "dry-cleaned",
    "explanation": "'Have + nesne (my winter coat) + V3' ettirgen (causative) kalıbında, işi başkasına yaptırmak anlamında fiilin 3. hâli ('dry-cleaned') kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g05-q02",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "It _____ that drinking green tea regularly reduces the risk of heart disease.",
    "options": [
      "is believed",
      "believes",
      "has believed",
      "is believing"
    ],
    "correctAnswer": "is believed",
    "explanation": "'It + be + V3 + that...' kişisiz edilgen raporlama kalıbında genel inancı ifade etmek için 'It is believed that...' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g05-q03",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "My grandmother gets her groceries _____ to her apartment every Friday morning.",
    "options": [
      "delivered",
      "deliver",
      "to deliver",
      "delivering"
    ],
    "correctAnswer": "delivered",
    "explanation": "'Get + nesne (her groceries) + V3' ettirgen yapısında nesneden sonra fiilin 3. hâli ('delivered') gelir.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g05-q04",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "The strict coach made the players _____ five kilometers around the track in the rain.",
    "options": [
      "run",
      "to run",
      "running",
      "ran"
    ],
    "correctAnswer": "run",
    "explanation": "Etken cümlede 'make + kişi (the players) + V1' kalıbı zorlama bildirir ve arkadan gelen fiil yalındır ('to' almaz: 'run').",
    "difficulty": "easy"
  },
  {
    "id": "b2-g05-q05",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "The CEO had her personal assistant _____ all the flight reservations for the Tokyo summit.",
    "options": [
      "book",
      "to book",
      "booked",
      "booking"
    ],
    "correctAnswer": "book",
    "explanation": "'Have + kişi (her personal assistant) + V1' kalıbında birine görev vererek iş yaptırma anlatılır ve fiil yalın ('book') kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g05-q06",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "How did you finally get your landlord _____ the broken heating system?",
    "options": [
      "to replace",
      "replace",
      "replaced",
      "replacing"
    ],
    "correctAnswer": "to replace",
    "explanation": "'Get + kişi (your landlord) + TO V1' kalıbında birini ikna ederek iş yaptırma anlamı vardır ve mutlaka 'to' kullanılır ('to replace').",
    "difficulty": "easy"
  },
  {
    "id": "b2-g05-q07",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "The suspect is thought _____ the country using a forged passport two days ago.",
    "options": [
      "to have left",
      "to leave",
      "leaving",
      "having left"
    ],
    "correctAnswer": "to have left",
    "explanation": "'Is thought' (düşünülüyor - Present) sonrasında 'two days ago' (iki gün önce - Past) gerçekleşmiş bir eylem aktarıldığı için Perfect Infinitive ('to have + V3': 'to have left') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g05-q08",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "After the noise complaint, the teenagers were made _____ the music down immediately.",
    "options": [
      "to turn",
      "turn",
      "turning",
      "turned"
    ],
    "correctAnswer": "to turn",
    "explanation": "DİKKAT: 'Make' fiili edilgen yapıldığında ('were made') arkasından gelen fiil yalın kalmaz, mutlaka 'to + V1' ('to turn') alır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g05-q09",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "My cat absolutely hates _____ by strangers and hides under the sofa whenever guests come over.",
    "options": [
      "being touched",
      "touching",
      "to touch",
      "having touched"
    ],
    "correctAnswer": "being touched",
    "explanation": "'Hate' fiilinden sonra kedi dokunan değil 'yabancılar tarafından dokunulan' konumda olduğu için Passive Gerund ('being + V3': 'being touched') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g05-q10",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "We _____ our roof _____ right now because some tiles were damaged in last week's storm.",
    "options": [
      "are having / repaired",
      "have / repair",
      "are getting / to repair",
      "had / repairing"
    ],
    "correctAnswer": "are having / repaired",
    "explanation": "'Right now' (şu anda) devam eden ettirgen eylem ve cansız nesne ('our roof') olduğu için 'are having + nesne + V3 (repaired)' doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g05-q11",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "The famous novelist is known _____ in a secluded cabin in the woods at the moment.",
    "options": [
      "to be living",
      "to have lived",
      "living",
      "be living"
    ],
    "correctAnswer": "to be living",
    "explanation": "'Is known' sonrasında 'at the moment' (şu anda devam eden durum) aktarıldığı için Continuous Infinitive ('to be + V-ing': 'to be living') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g05-q12",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "Every candidate expects _____ fairly during the recruitment process.",
    "options": [
      "to be evaluated",
      "to evaluate",
      "evaluating",
      "having evaluated"
    ],
    "correctAnswer": "to be evaluated",
    "explanation": "'Expect' fiili 'to' alır; aday değerlendiren değil 'adilce değerlendirilen' olduğu için Passive Infinitive ('to be evaluated') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g05-q13",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "While traveling on the crowded metro in Rome, Mert unfortunately had his passport _____.",
    "options": [
      "stolen",
      "steal",
      "to steal",
      "stealing"
    ],
    "correctAnswer": "stolen",
    "explanation": "Kişinin başına istemeden gelen talihsiz olaylar da 'have + nesne (his passport) + V3 (stolen)' kalıbıyla anlatılır ('pasaportunu çaldırdı').",
    "difficulty": "medium"
  },
  {
    "id": "b2-g05-q14",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "Our parents never let us _____ video games on school nights, meaning we were not allowed to play.",
    "options": [
      "play",
      "to play",
      "playing",
      "played"
    ],
    "correctAnswer": "play",
    "explanation": "'Let + kişi (us) + V1' izin verme kalıbında fiil daima yalındır ('play'). (Edilgen olsaydı 'were allowed to play' olurdu).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g05-q15",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "The Renaissance fresco is alleged _____ by an unknown apprentice of Leonardo da Vinci in the late 15th century.",
    "options": [
      "to have been painted",
      "to have painted",
      "to be painted",
      "having been painted"
    ],
    "correctAnswer": "to have been painted",
    "explanation": "Hem 15. yüzyılın sonu (geçmiş → 'to have V3') hem de fresk kendi kendine resim yapmayıp 'boyanmış/yapılmış' olduğu (edilgen → 'been V3') için Perfect Passive Infinitive ('to have been painted') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g05-q16",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "She walked out of the boardroom without saying a word because she resented _____ in front of her junior colleagues.",
    "options": [
      "having been humiliated",
      "humiliating",
      "to be humiliated",
      "to have humiliated"
    ],
    "correctAnswer": "having been humiliated",
    "explanation": "'Resent' (içerlemek/kızmak) fiili '-ing' (Gerund) alır; ayrıca astlarının önünde 'aşağılanmış olmasına' (edilgen ve öncesinde gerçekleşmiş) içerlediği için 'having been humiliated' (veya 'being humiliated') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g05-q17",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "These antique silver spoons are completely tarnished; they urgently need _____ before the dinner party.",
    "options": [
      "polishing",
      "to polish",
      "polished",
      "be polished"
    ],
    "correctAnswer": "polishing",
    "explanation": "Cansız öznelerle 'need + V-ing' yapısı edilgen anlam taşır ('need polishing' = 'need to be polished' — cilalanmaya ihtiyacı var). Şıklarda 'to be polished' olmadığı için 'polishing' tek doğru cevaptır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g05-q18",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "Over two hundred ancient artifacts are reported _____ during the archaeological excavation in Göbeklitepe last summer.",
    "options": [
      "to have been unearthed",
      "to have unearthed",
      "to be unearthed",
      "being unearthed"
    ],
    "correctAnswer": "to have been unearthed",
    "explanation": "'Are reported' sonrasında 'last summer' (geçen yaz - geçmiş) olduğu ve tarihi eserler 'gün yüzüne çıkarıldığı' (edilgen) için 'to have been unearthed' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g05-q19",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "Before signing the lease, I had a real estate lawyer _____ every clause in the contract to avoid any hidden fees.",
    "options": [
      "review",
      "reviewed",
      "to review",
      "reviewing"
    ],
    "correctAnswer": "review",
    "explanation": "Tuzak soru: Boşluktan önce cansız sözleşme değil, işi yapan kişi ('a real estate lawyer') vardır! 'Have + kişi + V1' kuralı gereği yalın fiil ('review') seçilir.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g05-q20",
    "topicId": "b2-g05",
    "level": "B2",
    "question": "Instead of _____ by the harsh criticism, the young director used the feedback to improve her next film.",
    "options": [
      "being discouraged",
      "discouraging",
      "to be discouraged",
      "be discouraged"
    ],
    "correctAnswer": "being discouraged",
    "explanation": "'Instead of' edatından sonra fiil '-ing' almalıdır; genç yönetmen cesaret kıran değil, sert eleştirilerden 'cesareti kırılan' (edilgen) konumda olduğu için Passive Gerund ('being discouraged') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g06-q01",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "The mountain guide warned the hikers _____ off the marked trail due to the risk of avalanches.",
    "options": [
      "not to wander",
      "to not wandering",
      "not wandering",
      "don't wander"
    ],
    "correctAnswer": "not to wander",
    "explanation": "'Warn + kişi (the hikers) + (not) to V1' kalıbında olumsuz uyarı 'not to wander' şeklinde ifade edilir.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g06-q02",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "Despite the strong evidence against him, the suspect denied _____ anywhere near the bank on the night of the robbery.",
    "options": [
      "being",
      "to be",
      "that be",
      "been"
    ],
    "correctAnswer": "being",
    "explanation": "'Deny' (inkâr etmek) fiili kendisinden sonra Gerund ('V-ing' veya 'having V3') alır; 'to be' almaz. Bu nedenle 'being' doğrudur.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g06-q03",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "My dentist strongly advised me _____ my toothbrush every three months.",
    "options": [
      "to replace",
      "replacing",
      "replace",
      "that replace"
    ],
    "correctAnswer": "to replace",
    "explanation": "'Advise' fiili arkasından kişi zamiri ('me') aldığında mutlaka 'to + V1' ('to replace') ile devam eder.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g06-q04",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "Zeynep apologized to her professor _____ the assignment two days after the deadline.",
    "options": [
      "for submitting",
      "to submit",
      "of submitting",
      "on submitting"
    ],
    "correctAnswer": "for submitting",
    "explanation": "Bir kişiden bir eylem nedeniyle özür dilemek 'apologize (to sb) FOR + V-ing' kalıbıyla kurulur ('for submitting').",
    "difficulty": "easy"
  },
  {
    "id": "b2-g06-q05",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "Even though we wanted to split the restaurant bill equally, our host insisted _____ for everyone's meal.",
    "options": [
      "on paying",
      "to pay",
      "for paying",
      "of paying"
    ],
    "correctAnswer": "on paying",
    "explanation": "'Insist' fiili 'ON' edatı ve arkasından 'V-ing' (Gerund) alır ('insisted on paying').",
    "difficulty": "easy"
  },
  {
    "id": "b2-g06-q06",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "When I told Berk that my car had broken down, he immediately offered _____ me a lift to the station.",
    "options": [
      "to give",
      "giving",
      "me to give",
      "for giving"
    ],
    "correctAnswer": "to give",
    "explanation": "'Offer' (teklif etmek) fiili kişi zamiri almadan doğrudan 'to + V1' ('offered to give') alır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g06-q07",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "The opposition party accused the mayor _____ public funds on unnecessary luxury projects.",
    "options": [
      "of wasting",
      "for wasting",
      "to waste",
      "with wasting"
    ],
    "correctAnswer": "of wasting",
    "explanation": "Birini bir şey yapmakla suçlamak 'accuse someone OF + V-ing' kalıbıyla ifade edilir ('of wasting').",
    "difficulty": "medium"
  },
  {
    "id": "b2-g06-q08",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "Since everybody was tired of cooking at home, Pelin suggested _____ out at the new Thai restaurant.",
    "options": [
      "eating",
      "to eat",
      "us to eat",
      "that eating"
    ],
    "correctAnswer": "eating",
    "explanation": "'Suggest' fiili kesinlikle 'to V1' veya 'us to V1' almaz; doğrudan Gerund ('V-ing': 'suggested eating') alır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g06-q09",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "Please remind your brother _____ the gas valve before he leaves for the weekend.",
    "options": [
      "to turn off",
      "turning off",
      "of turning off",
      "turn off"
    ],
    "correctAnswer": "to turn off",
    "explanation": "Birine henüz yapmadığı bir görevi yapmasını hatırlatmak 'remind someone TO + V1' ('to turn off') ile kurulur.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g06-q10",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "The airline representative refused _____ the passengers for the delay, claiming it was caused by severe weather.",
    "options": [
      "to compensate",
      "compensating",
      "for compensating",
      "that compensate"
    ],
    "correctAnswer": "to compensate",
    "explanation": "'Refuse' (reddetmek) fiili daima 'to + V1' ('to compensate') alır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g06-q11",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "After hours of questioning by the detectives, the hacker finally confessed _____ the customer database.",
    "options": [
      "to downloading",
      "to download",
      "for downloading",
      "of downloading"
    ],
    "correctAnswer": "to downloading",
    "explanation": "DİKKAT: 'Confess to' (itiraf etmek) kalıbındaki 'to' bir edattır (preposition); bu nedenle arkasından yalın fiil değil, Gerund ('to downloading') gelir.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g06-q12",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "Instead of taking responsibility for the accident, the driver blamed the municipality _____ adequate warning signs.",
    "options": [
      "for not putting up",
      "of not putting up",
      "not to put up",
      "to not put up"
    ],
    "correctAnswer": "for not putting up",
    "explanation": "'Blame someone FOR + (not) V-ing' kalıbında olumsuzluk 'not' kelimesinin '-ing' önüne gelmesiyle yapılır ('for not putting up').",
    "difficulty": "medium"
  },
  {
    "id": "b2-g06-q13",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "All her colleagues congratulated Elif _____ promoted to regional marketing director.",
    "options": [
      "on being",
      "for being",
      "to be",
      "of being"
    ],
    "correctAnswer": "on being",
    "explanation": "'Congratulate someone ON + V-ing' kalıbı tebrik etmek için kullanılır; Elif terfi ettirildiği (edilgen) için 'on being promoted' doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g06-q14",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "It took me nearly an hour, but I finally persuaded my father _____ me borrow his vintage camera.",
    "options": [
      "to let",
      "letting",
      "for letting",
      "let"
    ],
    "correctAnswer": "to let",
    "explanation": "'Persuade + kişi (my father) + TO V1' (birini bir şey yapmaya ikna etmek) kalıbı gereği 'to let' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g06-q15",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "The financial advisor recommended that the company _____ its unprofitable overseas branches immediately.",
    "options": [
      "close",
      "closes",
      "closed",
      "to close"
    ],
    "correctAnswer": "close",
    "explanation": "'Recommend / suggest / insist / demand + that + Subject + (should) + V1' (Subjunctive) kuralı gereği, özne tekil ('the company') olsa bile gizli 'should' nedeniyle fiil yalın ('close') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g06-q16",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "The technician patiently explained _____ how the new encryption protocol worked.",
    "options": [
      "to us",
      "us",
      "for us",
      "at us"
    ],
    "correctAnswer": "to us",
    "explanation": "DİKKAT: 'Explain' fiilinden sonra kişi zamiri doğrudan gelemez ('explained us' YANLIŞTIR); araya mutlaka 'to' edatı girmelidir ('explained to us').",
    "difficulty": "hard"
  },
  {
    "id": "b2-g06-q17",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "During the interview, the veteran actor admitted _____ several major roles early in his career that later became box-office hits.",
    "options": [
      "having turned down",
      "to turn down",
      "turn down",
      "be turning down"
    ],
    "correctAnswer": "having turned down",
    "explanation": "'Admit' (kabul/itiraf etmek) fiili 'V-ing' veya geçmiş önceliği vurgulayan Perfect Gerund ('having + V3': 'having turned down') alır; 'to V1' (mastar) almaz.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g06-q18",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "In yesterday's lecture, the astrophysics professor stated that light _____ at approximately 300,000 kilometers per second.",
    "options": [
      "travels",
      "had traveled",
      " would travel",
      "is traveling"
    ],
    "correctAnswer": "travels",
    "explanation": "Aktarma fiili geçmişte ('stated') olsa dahi, aktarılan bilgi değişmez bir bilimsel gerçek ve doğa yasası olduğunda zaman kayması (backshift) yapılmaz; Simple Present ('travels') korunur.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g06-q19",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "When I spoke to Sinem last night, she said that if she _____ fluent German, she would apply for the fellowship in Vienna.",
    "options": [
      "spoke",
      "speaks",
      "will speak",
      "has spoken"
    ],
    "correctAnswer": "spoke",
    "explanation": "Second Conditional (Type 2: 'If she spoke..., she would apply...') cümleleri dolaylı anlatıma (Reported Speech) aktarılırken anlam bozulmaması için zaman bir derece daha geçmişe kaydırılmaz; 'spoke' olduğu gibi kalır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g06-q20",
    "topicId": "b2-g06",
    "level": "B2",
    "question": "Local residents strongly objected _____ a chemical waste facility so close to the agricultural valley.",
    "options": [
      "to the company's building",
      "the company to build",
      "to build",
      "for the company building"
    ],
    "correctAnswer": "to the company's building",
    "explanation": "'Object to' kalıbındaki 'to' edattır ve arkasından isim veya Gerund ('V-ing' / 'iyelik + V-ing') alır: 'objected to the company's building...' (şirketin inşa etmesine itiraz ettiler).",
    "difficulty": "hard"
  },
  {
    "id": "b2-g07-q01",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "Cappadocia, _____ is world-famous for its fairy chimneys and hot-air balloons, attracts tourists all year round.",
    "options": [
      "which",
      "that",
      "where",
      "who"
    ],
    "correctAnswer": "which",
    "explanation": "'Cappadocia' özel isimdir ve virgülden hemen sonra fiil ('is') geldiği için özne konumunda 'which' kullanılır. Virgülden sonra 'that' kullanılamaz; fiil olduğu için 'where' de gelemez.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g07-q02",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "My older sister, _____ lives in Montreal, is coming to visit us for two weeks in August.",
    "options": [
      "who",
      "that",
      "whom",
      "which"
    ],
    "correctAnswer": "who",
    "explanation": "İnsan öznesi ('My older sister') hakkında iki virgül arasında ek bilgi verilirken özne konumunda 'who' kullanılır (virgülden sonra 'that' gelmez).",
    "difficulty": "easy"
  },
  {
    "id": "b2-g07-q03",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "The train arrived forty minutes late, _____ made us miss the opening speech of the conference.",
    "options": [
      "which",
      "what",
      "that",
      "who"
    ],
    "correctAnswer": "which",
    "explanation": "Virgülden önceki tüm cümleyi (trenin 40 dakika geç gelmesi durumunu) niteleyen yapı her zaman ', which'tir ('... ki bu durum ...').",
    "difficulty": "easy"
  },
  {
    "id": "b2-g07-q04",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "Dr. Arslan, _____ research on marine biology has been published in top journals, will give a seminar today.",
    "options": [
      "whose",
      "who",
      "whom",
      "which"
    ],
    "correctAnswer": "whose",
    "explanation": "Boşluktan sonra yalın bir isim ('research' — araştırması) geldiği ve Dr. Arslan'a ait olduğu için iyelik zamiri 'whose' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g07-q05",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "We spent the weekend in Amasra, _____ we ate delicious fresh fish by the harbor.",
    "options": [
      "where",
      "which",
      "that",
      "when"
    ],
    "correctAnswer": "where",
    "explanation": "Yer ismi ('Amasra') sonrasında tam bir cümle ('we ate...') gelmiş ve 'orada' anlamı verilmiştir; bu nedenle 'where' doğrudur.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g07-q06",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "The company closed down in 2008, _____ the global financial crisis hit the banking sector.",
    "options": [
      "when",
      "which",
      "where",
      "that"
    ],
    "correctAnswer": "when",
    "explanation": "Yıl/zaman ifadesinden ('2008') sonra virgülden sonra 'o zamanda' anlamında tam cümle geldiği için 'when' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g07-q07",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "She applied to four universities in the UK, all of _____ offered her a full scholarship.",
    "options": [
      "which",
      "them",
      "that",
      "whom"
    ],
    "correctAnswer": "which",
    "explanation": "İki cümle sadece virgülle bağlandığında ('and' bağlacı olmadığında) cansız isimler ('four universities') için 'all of which' kullanılır ('all of them' bağlaçsız iki cümleyi bağlayamaz).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g07-q08",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "The rescue team saved twelve miners from the collapsed tunnel, two of _____ were immediately airlifted to hospital.",
    "options": [
      "whom",
      "who",
      "them",
      "which"
    ],
    "correctAnswer": "whom",
    "explanation": "İnsanları ('twelve miners') niteleyen nicelik ifadelerinden ('two of...') sonra 'who' veya 'them' değil, 'whom' ('two of whom') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g07-q09",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "He claimed that he had never received the warning email, _____ turned out to be a complete lie.",
    "options": [
      "which",
      "what",
      "that",
      "where"
    ],
    "correctAnswer": "which",
    "explanation": "Önceki cümlenin tamamını (uyarı e-postasını hiç almadığını iddia etmesi durumunu) nitelemek için virgülden sonra 'which' kullanılır ('what' asla virgülden sonra önceki cümleyi nitelemez).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g07-q10",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "The historic library, _____ roof was severely damaged during the earthquake, will remain closed for restoration.",
    "options": [
      "whose",
      "which",
      "of which",
      "where"
    ],
    "correctAnswer": "whose",
    "explanation": "'Whose' yalnızca insanlar için değil, cansız varlıklar ('The historic library') için de iyelik ('whose roof' — çatısı) bildirmek amacıyla kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g07-q11",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "Our new CEO, with _____ I had a brief meeting this morning, seems very open to innovative ideas.",
    "options": [
      "whom",
      "who",
      "that",
      "whose"
    ],
    "correctAnswer": "whom",
    "explanation": "İnsan öznesi için edattan ('with') hemen sonra 'who' veya 'that' kullanılamaz; yalnızca 'whom' ('with whom') gelebilir.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g07-q12",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "Ephesus, _____ was once a bustling port city of the ancient world, now lies several kilometers inland.",
    "options": [
      "which",
      "where",
      "that",
      "when"
    ],
    "correctAnswer": "which",
    "explanation": "DİKKAT: 'Ephesus' bir yer ismi olmasına rağmen boşluktan hemen sonra fiil ('was') gelmektedir! Cümlenin özneye ihtiyacı olduğu için 'where' değil, 'which' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g07-q13",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "The committee reviewed thirty project proposals, none of _____ met the strict environmental standards.",
    "options": [
      "which",
      "them",
      "whom",
      "that"
    ],
    "correctAnswer": "which",
    "explanation": "Cansız 'thirty project proposals' ismini virgül sonrası nicelik ifadesiyle bağlamak için 'none of which' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g07-q14",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "The peace accord, without _____ the border dispute would have escalated into war, was signed in 1995.",
    "options": [
      "which",
      "that",
      "whom",
      "where"
    ],
    "correctAnswer": "which",
    "explanation": "Cansız isim ('The peace accord') ve edat ('without') sonrasında 'without which' (ki onsuz...) yapısı kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g07-q15",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "The symposium was attended by over two hundred delegates, the majority of _____ were renewable energy specialists.",
    "options": [
      "whom",
      "who",
      "them",
      "which"
    ],
    "correctAnswer": "whom",
    "explanation": "İnsanları ('over two hundred delegates') niteleyen 'the majority of...' ifadesinden sonra bağlaçsız iki cümleyi birleştirmek için 'whom' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g07-q16",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "She bought two second-hand laptops at the auction, and neither of _____ had a working battery.",
    "options": [
      "them",
      "which",
      "whom",
      "that"
    ],
    "correctAnswer": "them",
    "explanation": "ÇOK DİKKAT: Bu kez virgülden sonra 'AND' bağlacı vardır! Cümlede 'and / but' bağlacı zaten bulunduğu için ikinci bir bağlaca ('which') gerek yoktur; normal nesne zamiri 'them' ('and neither of them') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g07-q17",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "The luxury cruise ship, on board _____ there were more than two thousand passengers, docked at Kuşadası port.",
    "options": [
      "which",
      "where",
      "that",
      "whom"
    ],
    "correctAnswer": "which",
    "explanation": "'On board' edat öbeğinden sonra cansız 'The luxury cruise ship' ismini nitelemek için 'which' ('on board which' — ki onun güvertesinde) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g07-q18",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "We climbed to the summit of Mount Nemrut at dawn, from _____ we watched an unforgettable sunrise over the statues.",
    "options": [
      "where",
      "which",
      "that",
      "when"
    ],
    "correctAnswer": "where",
    "explanation": "'From where' (ki oradan...) kalıbı bir yer isminden sonra bakış/hareket başlangıç noktasını anlatmak için kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g07-q19",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "The pharmaceutical firm launched a new painkiller last year, the side effects _____ are still being investigated by regulators.",
    "options": [
      "of which",
      "whose",
      "which",
      "in which"
    ],
    "correctAnswer": "of which",
    "explanation": "Cansız iyelik yapısında isim ('the side effects') 'the' tanımlığı ile öne alındığında 'whose' değil, 'the + isim + of which' ('the side effects of which' = 'whose side effects') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g07-q20",
    "topicId": "b2-g07",
    "level": "B2",
    "question": "The gallery owns five original sketches by Picasso, the most famous of _____ is insured for ten million dollars.",
    "options": [
      "which",
      "them",
      "whom",
      "that"
    ],
    "correctAnswer": "which",
    "explanation": "Virgülden sonra bağlaç ('and') yoktur; cansız 'five original sketches' ismini niteleyen 'the most famous of...' yapısından sonra 'which' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g08-q01",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "_____ a loud explosion outside, all the residents rushed out onto their balconies.",
    "options": [
      "Hearing",
      "Heard",
      "To hear",
      "Have heard"
    ],
    "correctAnswer": "Hearing",
    "explanation": "Virgülden sonraki özne 'all the residents' (bina sakinleri) dışarıdaki yüksek patlama sesini kendileri duyduğu (etken) için cümle 'Hearing' (When they heard...) ile başlar.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g08-q02",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "The smartphones _____ in this facility are exported to more than forty countries worldwide.",
    "options": [
      "manufactured",
      "manufacturing",
      "manufacture",
      "having manufactured"
    ],
    "correctAnswer": "manufactured",
    "explanation": "Akıllı telefonlar üretmez, bu tesiste 'üretilir' ('which are manufactured'). Edilgen sıfat cümleciği kısaltmasında V3 ('manufactured') kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g08-q03",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "Who is that tall gentleman _____ next to the window with a cup of coffee in his hand?",
    "options": [
      "standing",
      "stood",
      "stands",
      "be standing"
    ],
    "correctAnswer": "standing",
    "explanation": "Pencerenin yanında duran beyefendi eylemi kendisi yaptığı (etken: 'who is standing') için 'standing' (V-ing) ile kısaltılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g08-q04",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "_____ in the 16th century, the historic stone bridge still carries pedestrian traffic today.",
    "options": [
      "Built",
      "Building",
      "Having built",
      "To build"
    ],
    "correctAnswer": "Built",
    "explanation": "Virgülden sonraki özne 'the historic stone bridge' (tarihi taş köprü) 16. yüzyılda inşa edildiği (edilgen) için cümle 'Built' (V3) ile başlar.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g08-q05",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "_____ what to do in the emergency, the young intern immediately called her supervisor.",
    "options": [
      "Not knowing",
      "Knowing not",
      "Not known",
      "Didn't know"
    ],
    "correctAnswer": "Not knowing",
    "explanation": "Olumsuz etken kısaltmalarda 'not' zarfı 'V-ing' önüne gelir ('Because she didn't know...' → 'Not knowing').",
    "difficulty": "easy"
  },
  {
    "id": "b2-g08-q06",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "Yuri Gagarin was the first human _____ into outer space aboard the Vostok 1 spacecraft in 1961.",
    "options": [
      "to journey",
      "journeying",
      "journeyed",
      "having journeyed"
    ],
    "correctAnswer": "to journey",
    "explanation": "'The first / the second / the last / the only' yapılarından sonra sıfat cümleciği kısaltması 'to + V1' ('to journey') ile yapılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g08-q07",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "_____ all her exams with high grades, Sude decided to reward herself with a trip to Italy.",
    "options": [
      "Having passed",
      "Passed",
      "Being passed",
      "To pass"
    ],
    "correctAnswer": "Having passed",
    "explanation": "Sude'nin tüm sınavlarını yüksek notlarla geçmesi, İtalya gezisi kararından daha önce tamamlanmış etken bir eylem olduğu için Perfect Participle ('Having passed') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g08-q08",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "_____ by lush pine forests on all sides, the mountain resort offers complete peace and quiet.",
    "options": [
      "Surrounded",
      "Surrounding",
      "Having surrounded",
      "To surround"
    ],
    "correctAnswer": "Surrounded",
    "explanation": "Dağ tesisi ('the mountain resort') çam ormanlarını çevrelemez, ormanlar tarafından 'çevrelenmiştir' (edilgen). Bu nedenle V3 ('Surrounded') doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g08-q09",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "Any employee _____ to work overtime this Saturday must sign the sheet on the noticeboard.",
    "options": [
      "wishing",
      "wished",
      "wishes",
      "having wished"
    ],
    "correctAnswer": "wishing",
    "explanation": "'Any employee who wishes to work...' cümlesi etken olduğu için 'Any employee wishing...' şeklinde kısaltılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g08-q10",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "_____ in a cool, dark place, olive oil can retain its nutritional value for up to two years.",
    "options": [
      "Stored",
      "Storing",
      "Having stored",
      "To store"
    ],
    "correctAnswer": "Stored",
    "explanation": "Virgülden sonraki özne 'olive oil' (zeytinyağı) serin ve karanlık bir yerde 'saklandığında' ('If it is stored...') anlamında edilgen kısaltma 'Stored' (V3) alır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g08-q11",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "The rescue workers searched through the rubble for hours, _____ to find any survivors.",
    "options": [
      "hoping",
      "hoped",
      "to hope",
      "having hoped"
    ],
    "correctAnswer": "hoping",
    "explanation": "Kurtarma görevlileri enkazı ararken aynı zamanda hayatta kalanları bulmayı 'umuyorlardı' (etken ve eş zamanlı ek eylem → 'hoping').",
    "difficulty": "medium"
  },
  {
    "id": "b2-g08-q12",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "She was the only applicant _____ by the selection committee without a second interview.",
    "options": [
      "to be accepted",
      "to accept",
      "accepting",
      "having accepted"
    ],
    "correctAnswer": "to be accepted",
    "explanation": "'The only applicant' yapısı 'to' kısaltması ister; ayrıca başvuru sahibi seçici kurul tarafından 'kabul edildiği' (edilgen) için 'to be accepted' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g08-q13",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "_____ from the top of Galata Tower, the Golden Horn looks especially magnificent at sunset.",
    "options": [
      "Viewed",
      "Viewing",
      "Having viewed",
      "To view"
    ],
    "correctAnswer": "Viewed",
    "explanation": "Virgülden sonraki özne 'the Golden Horn' (Haliç) kendi kendine bakmaz; Galata Kulesi'nin tepesinden 'bakıldığında / izlendiğinde' (edilgen) anlamına geldiği için 'Viewed' (V3) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g08-q14",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "_____ for over six hours at the border crossing, the truck drivers grew increasingly impatient.",
    "options": [
      "Having waited",
      "Waited",
      "Being waited",
      "To wait"
    ],
    "correctAnswer": "Having waited",
    "explanation": "Kamyon şoförleri sınır kapısında 6 saatten fazla beklemiş oldukları için (etken ve öncelikli süreç) 'Having waited' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g08-q15",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "_____ twice by the cybersecurity team about weak passwords, the clerk still failed to update his login credentials.",
    "options": [
      "Having been warned",
      "Having warned",
      "Warning",
      "To be warned"
    ],
    "correctAnswer": "Having been warned",
    "explanation": "Virgülden sonraki özne 'the clerk' (memur), siber güvenlik ekibi tarafından öncesinde iki kez 'uyarılmış olmasına' (hem öncelikli hem edilgen) rağmen şifresini güncellemedi → 'Having been warned'.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g08-q16",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "The highway _____ the two industrial zones is currently closed because it is being repaved.",
    "options": [
      "connecting",
      "connected",
      "connects",
      "to connect"
    ],
    "correctAnswer": "connecting",
    "explanation": "DİKKAT: Öznenin cansız ('The highway' — otoyol) olması her zaman edilgen olacağı anlamına gelmez! Boşluktan sonra nesne ('the two industrial zones') vardır; iki sanayi bölgesini birbirine 'bağlayan' otoyol etken bir işlev görür ('which connects' → 'connecting').",
    "difficulty": "hard"
  },
  {
    "id": "b2-g08-q17",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "_____ in 1923, the Republic of Turkey embarked on a series of sweeping modernization reforms.",
    "options": [
      "Founded",
      "Founding",
      "Having founded",
      "Found"
    ],
    "correctAnswer": "Founded",
    "explanation": "Sınav klasiği: 'Find' (bulmak -> found - found) ile 'Found' (kurmak -> founded - founded) karıştırılmamalıdır! Türkiye Cumhuriyeti 1923'te 'kurulduğu' (edilgen V3) için 'Founded' doğrudur.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g08-q18",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "_____ any formal training in graphic design, Mert taught himself how to use the software through online tutorials.",
    "options": [
      "Not having received",
      "Not receiving not",
      "Not having been received",
      "Having not received"
    ],
    "correctAnswer": "Not having received",
    "explanation": "Mert grafik tasarım konusunda resmi bir eğitim 'almamış olduğu için' (etken ve olumsuz öncelik: 'Because he had not received...') kısaltması 'Not having received' şeklinde kurulur.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g08-q19",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "The patients _____ with the experimental drug showed a much faster recovery than the control group.",
    "options": [
      "treated",
      "treating",
      "having treated",
      "to treat"
    ],
    "correctAnswer": "treated",
    "explanation": "Hastalar ('The patients') tedavi etmez, deneysel ilaçla 'tedavi edilen' ('who were treated') konumdadır; bu nedenle edilgen kısaltma V3 ('treated') kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g08-q20",
    "topicId": "b2-g08",
    "level": "B2",
    "question": "_____ to last year's figures, the company's export revenue has increased by nearly twenty percent.",
    "options": [
      "Compared",
      "Comparing",
      "Having compared",
      "To compare"
    ],
    "correctAnswer": "Compared",
    "explanation": "Şirketin ihracat geliri geçen yılın rakamlarıyla 'karşılaştırıldığında' (edilgen kalıp: 'Compared to / with...') anlamına geldiği için 'Compared' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g09-q01",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "Never in my entire life _____ such a poorly organized international tournament.",
    "options": [
      "have I seen",
      "I have seen",
      "did I saw",
      "I saw"
    ],
    "correctAnswer": "have I seen",
    "explanation": "'Never' olumsuz zarfı cümlenin en başına geldiğinde cümle devrik ('Yardımcı Fiil + Özne + Fiil') olmak zorundadır: 'have I seen'.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g09-q02",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "Rarely _____ a politician admit making a mistake so openly in front of the press.",
    "options": [
      "does",
      "is",
      "has",
      "do"
    ],
    "correctAnswer": "does",
    "explanation": "'Rarely' cümle başında olduğu için devrik yapı gerekir. Özne tekil ('a politician') ve ana fiil yalın ('admit' - V1) olduğu için Simple Present yardımcı fiili 'does' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g09-q03",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "Seldom _____ we get the opportunity to observe a total solar eclipse from our own city.",
    "options": [
      "do",
      "are",
      "have",
      "does"
    ],
    "correctAnswer": "do",
    "explanation": "'Seldom' ile başlayan devrik cümlede özne 'we' ve ana fiil yalın 'get' (V1) olduğu için yardımcı fiil 'do' olmalıdır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g09-q04",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "Under no circumstances _____ unauthorized personnel allowed to enter the server room.",
    "options": [
      "are",
      "do",
      "have",
      "can"
    ],
    "correctAnswer": "are",
    "explanation": "'Under no circumstances' sonrasında 'allowed to enter' (be allowed to — edilgen yapı) bulunduğu ve 'personnel' çoğul anlam taşıdığı için 'are' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g09-q05",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "Little _____ she suspect that her closest business partner was secretly working for a rival firm.",
    "options": [
      "did",
      "was",
      "had",
      "does"
    ],
    "correctAnswer": "did",
    "explanation": "'Little' (neredeyse hiç) cümle başında devrik yapı kurar. Yan cümle geçmiş zaman ('was working') ve ana fiil yalın ('suspect') olduğu için Past Simple yardımcı fiili 'did' seçilir.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g09-q06",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "Not only _____ the storm knock down power lines, but it also flooded dozens of ground-floor shops.",
    "options": [
      "did",
      "was",
      "had",
      "has"
    ],
    "correctAnswer": "did",
    "explanation": "'Not only' cümle başındadır; ikinci kısım geçmiş zaman ('flooded' - V2) ve ilk kısımdaki fiil yalın ('knock down') olduğu için 'did' kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g09-q07",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "Hardly _____ the plane touched down on the runway when all the passengers stood up to get their bags.",
    "options": [
      "had",
      "did",
      "was",
      "has"
    ],
    "correctAnswer": "had",
    "explanation": "'Hardly ... when' kalıbında ilk kısım Past Perfect devriği ('Hardly + had + özne + V3') ile kurulur; 'touched' burada V3 olduğu için 'had' doğrudur.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g09-q08",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "No sooner had we pitched our tent by the lake _____ a violent thunderstorm broke out.",
    "options": [
      "than",
      "when",
      "that",
      "then"
    ],
    "correctAnswer": "than",
    "explanation": "'No sooner had + özne + V3' yapısı karşılaştırma derecesi içerdiği için her zaman 'than' bağlacıyla eşleşir ('when' veya 'then' ile kullanılmaz).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g09-q09",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "On no account _____ this medication be taken on an empty stomach.",
    "options": [
      "should",
      "does",
      "is",
      "has"
    ],
    "correctAnswer": "should",
    "explanation": "'On no account' (hiçbir suretle) sonrasında 'be taken' (yalın edilgen mastar) geldiği için modal yardımcı fiili 'should' ('should this medication be taken') kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g09-q10",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "Nowhere else in the world _____ you find such a unique blend of ancient ruins and turquoise bays.",
    "options": [
      "will",
      "are",
      "have",
      "do"
    ],
    "correctAnswer": "will",
    "explanation": "'Nowhere else' devrik yapı gerektirir; 'you find' (V1) ile gelecek/genel olasılık bildiren 'will you find' (veya geniş zamanda 'do') uygundur; ancak genel vurgu kalıbı olarak şıklarda 'will' (veya 'can') standarttır (burada 'do' da V1 alır, netlik için şıkları ayıralım).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g09-q11",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "_____ you encounter any technical difficulties during the online exam, please contact the IT helpdesk immediately.",
    "options": [
      "Should",
      "Were",
      "Had",
      "Did"
    ],
    "correctAnswer": "Should",
    "explanation": "Type 1 koşul cümlesinde ('If you should encounter...') 'If' atılarak devrik yapıldığında cümle 'Should + özne + V1' ('Should you encounter...') ile başlar.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g09-q12",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "Scarcely had the referee blown the final whistle _____ thousands of fans poured onto the pitch.",
    "options": [
      "when",
      "than",
      "then",
      "while"
    ],
    "correctAnswer": "when",
    "explanation": "'Scarcely / Hardly / Barely + had + özne + V3' kalıbı her zaman 'when' ile devam eder ('than' sadece 'No sooner' ile kullanılır).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g09-q13",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "At no time during the interrogation _____ the suspect confess to having an accomplice.",
    "options": [
      "did",
      "was",
      "had",
      "has"
    ],
    "correctAnswer": "did",
    "explanation": "'At no time' (hiçbir anda) cümle başında devrik yapı kurar. Fiil yalın ('confess') ve olay geçmişteki sorguda olduğu için 'did' kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g09-q14",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "I haven't received the new schedule yet, and neither _____ any of my colleagues in the department.",
    "options": [
      "have",
      "haven't",
      "did",
      "do"
    ],
    "correctAnswer": "have",
    "explanation": "Olumsuz bir cümleye ('haven't received') 'neither / nor' ile katılırken 'neither' zaten olumsuzluk taşıdığı için yardımcı fiil olumlu ve devrik olur: 'neither have any of my colleagues'.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g09-q15",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "Only after the laboratory test results came back _____ what was causing the patient's high fever.",
    "options": [
      "did the doctors realize",
      "the doctors realized",
      "had the doctors realize",
      "were the doctors realized"
    ],
    "correctAnswer": "did the doctors realize",
    "explanation": "DİKKAT: 'Only after' ile başlayan cümlelerde yan cümle ('the laboratory test results came back') düz, ikinci (ana) cümle ise devrik ('did the doctors realize') olur.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g09-q16",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "Not until the seventeenth century _____ that the planets orbit the Sun rather than the Earth.",
    "options": [
      "was it widely accepted",
      "it was widely accepted",
      "did it widely accept",
      "had it widely accepted"
    ],
    "correctAnswer": "was it widely accepted",
    "explanation": "'Not until the seventeenth century' cümle başında olduğu için ana cümle devrik ve edilgen ('it was widely accepted' → 'was it widely accepted') olmalıdır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g09-q17",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "So dense _____ over the Bosphorus this morning that all ferry services had to be suspended for four hours.",
    "options": [
      "was the fog",
      "the fog was",
      "did the fog",
      "had the fog been"
    ],
    "correctAnswer": "was the fog",
    "explanation": "'So + Sıfat (dense)' cümle başına çekildiğinde ('The fog was so dense that...' yerine) özne ile 'to be' fiili devrikleşir: 'So dense was the fog... that...'.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g09-q18",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "_____ for the emergency brake system, the high-speed train would have derailed at the sharp curve.",
    "options": [
      "Had it not been",
      "Hadn't it been",
      "If had it not been",
      "Were it not"
    ],
    "correctAnswer": "Had it not been",
    "explanation": "Ana cümle 'would have derailed' (Type 3) olduğu için 'If it hadn't been for...' kalıbı devrik yapılır. Devrik yapıda 'not' kısaltılmaz; özneden sonra gelir: 'Had it not been for...'.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g09-q19",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "Only by investing heavily in clean energy technologies _____ hope to reverse the effects of climate change.",
    "options": [
      "can we",
      "we can",
      "do we can",
      "are we"
    ],
    "correctAnswer": "can we",
    "explanation": "'Only by + V-ing' zarf öbeği cümle başında yer aldığında ana cümle devrikleşir; 'hope' yalın fiiliyle 'can we hope' doğru dizilimdir.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g09-q20",
    "topicId": "b2-g09",
    "level": "B2",
    "question": "_____ the central bank to raise interest rates unexpectedly next month, the housing market would cool down rapidly.",
    "options": [
      "Were",
      "Should",
      "Had",
      "Did"
    ],
    "correctAnswer": "Were",
    "explanation": "Ana cümlede 'would cool down' (Type 2) ve yan cümlede 'to raise' (to + V1) bulunduğu için Type 2 'If the central bank were to raise...' yapısının devrik hâli olan 'Were the central bank to raise...' kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g10-q01",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "I have so much work today. I wish I _____ on vacation on a sunny beach.",
    "options": [
      "were",
      "am",
      "will be",
      "have been"
    ],
    "correctAnswer": "were",
    "explanation": "Şimdiki zamana yönelik gerçek dışı dileklerde formal İngilizcede tüm şahıslar için \"were\" kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g10-q02",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "I don't know how to speak German. I wish I _____ it fluently.",
    "options": [
      "knew",
      "know",
      "will know",
      "am knowing"
    ],
    "correctAnswer": "knew",
    "explanation": "Şu anki gerçekliğin tersi dilendiğinde fiil bir derece geçmişe kaydırılarak Past Simple (knew) yapılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g10-q03",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "She failed her chemistry driving test. She wishes she _____ harder last week.",
    "options": [
      "had studied",
      "studied",
      "studies",
      "would study"
    ],
    "correctAnswer": "had studied",
    "explanation": "Geçmişe (last week) yönelik pişmanlık ve kaçırılmış durumlar için Past Perfect (had studied) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g10-q04",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "I am really feeling tired. If only I _____ to bed earlier last night!",
    "options": [
      "had gone",
      "went",
      "have gone",
      "would go"
    ],
    "correctAnswer": "had gone",
    "explanation": "\"Last night\" geçmiş zaman zarfıdır; geçmişe ait pişmanlıklarda If only + had V3 kalıbı kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g10-q05",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "I wish you _____ making that annoying clicking noise with your pen!",
    "options": [
      "would stop",
      "stop",
      "will stop",
      "have stopped"
    ],
    "correctAnswer": "would stop",
    "explanation": "Başkalarının rahatsız edici alışkanlıklarından yakınırken ve durmasını isterken \"would + V1\" kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g10-q06",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "Ahmet wishes he _____ more free time to pursue his creative hobbies.",
    "options": [
      "had",
      "has",
      "will have",
      "is having"
    ],
    "correctAnswer": "had",
    "explanation": "Şu anki durumun tersi olan genel bir dilek Past Simple (had) ile ifade edilir.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g10-q07",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "I really regret selling my vintage guitar. I wish I _____ it.",
    "options": [
      "had kept",
      "kept",
      "keep",
      "would keep"
    ],
    "correctAnswer": "had kept",
    "explanation": "\"I regret...\" geçmişe yönelik pişmanlık bildirir; bu yüzden wish + Past Perfect (had kept) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g10-q08",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "The heavy rain has been pouring all day. I wish it _____ raining soon.",
    "options": [
      "would stop",
      "stopped",
      "had stopped",
      "stops"
    ],
    "correctAnswer": "would stop",
    "explanation": "Hava durumu gibi kontrol dışı durumların değişmesini sabırsızlıkla arzularken \"would stop\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g10-q09",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "Sude wishes she _____ afford to rent an apartment closer to her office.",
    "options": [
      "could",
      "can",
      "will",
      "is able to"
    ],
    "correctAnswer": "could",
    "explanation": "Şimdiki zamandaki yetenek veya imkan eksikliğinden doğan dileklerde \"could + V1\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g10-q10",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "If only we _____ the flight earlier; ticket prices have doubled now!",
    "options": [
      "had booked",
      "booked",
      "would book",
      "book"
    ],
    "correctAnswer": "had booked",
    "explanation": "Geçmişte yapılmayan bir eyleme duyulan pişmanlık Past Perfect (had booked) gerektirir.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g10-q11",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "I wish my brother _____ borrow my clothes without asking for permission first.",
    "options": [
      "wouldn't",
      "doesn't",
      "won't",
      "isn't"
    ],
    "correctAnswer": "wouldn't",
    "explanation": "Başka birinin can sıkıcı davranışından yakınırken negatif biçimde \"wouldn't + V1\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g10-q12",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "They live in a noisy neighborhood. They wish they _____ in a quieter suburb.",
    "options": [
      "lived",
      "live",
      "are living",
      "have lived"
    ],
    "correctAnswer": "lived",
    "explanation": "Şu anda yaşanılan durumun tersi için Past Simple (lived) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g10-q13",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "If only I _____ fluent in Spanish, I would apply for that overseas position.",
    "options": [
      "were",
      "am",
      "have been",
      "will be"
    ],
    "correctAnswer": "were",
    "explanation": "Şimdiki zamana ait varsayımsal durumda to be fiili \"were\" olarak çekimlenir.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g10-q14",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "I wish I _____ your advice before signing that complicated contract.",
    "options": [
      "had taken",
      "took",
      "take",
      "would take"
    ],
    "correctAnswer": "had taken",
    "explanation": "Geçmişte yaşanmış bir olaya yönelik pişmanlık Past Perfect (had taken) ile anlatılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g10-q15",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "I wish I _____ attend your art exhibition yesterday, but I had an urgent emergency.",
    "options": [
      "could have",
      "could",
      "would have",
      "might"
    ],
    "correctAnswer": "could have",
    "explanation": "Geçmişteki kaçırılmış bir imkanı veya yeteneği dile getirmek için \"could have + V3\" (could have attended) yapısı kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g10-q16",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "I really wish you _____ interrupt me every time I am trying to make a point.",
    "options": [
      "wouldn't",
      "didn't",
      "hadn't",
      "won't"
    ],
    "correctAnswer": "wouldn't",
    "explanation": "Bir kişinin sürekli tekrarlanan sinir bozucu bir eyleminden şikayet ederken \"wouldn't + V1\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g10-q17",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "Many citizens wish the local council _____ more transparent about public spending.",
    "options": [
      "were",
      "is",
      "will be",
      "has been"
    ],
    "correctAnswer": "were",
    "explanation": "Şu andaki kurumsal durumun farklı olmasını dilerken formal dilde \"were\" kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g10-q18",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "If only she _____ that confidential email to the wrong department yesterday!",
    "options": [
      "hadn't sent",
      "didn't send",
      "wouldn't send",
      "hasn't sent"
    ],
    "correctAnswer": "hadn't sent",
    "explanation": "Geçmişte yapılan büyük bir hataya dair kuvvetli pişmanlık If only + hadn't V3 ile verilir.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g10-q19",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "I hope you _____ a wonderful time in Paris next week!",
    "options": [
      "have",
      "had",
      "would have",
      "had had"
    ],
    "correctAnswer": "have",
    "explanation": "Gelecekteki olası ve gerçekçi iyi dilekler için \"wish\" değil \"hope\" ve Present Simple (have) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g10-q20",
    "topicId": "b2-g10",
    "level": "B2",
    "question": "He wishes he _____ that lucrative investment opportunity when the market crashed.",
    "options": [
      "hadn't missed",
      "didn't miss",
      "wouldn't miss",
      "doesn't miss"
    ],
    "correctAnswer": "hadn't missed",
    "explanation": "Geçmişteki piyasa çöküşü anında kaçırılan fırsat için Past Perfect (hadn't missed) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g11-q01",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "It's high time you _____ looking for a permanent job.",
    "options": [
      "started",
      "start",
      "will start",
      "have started"
    ],
    "correctAnswer": "started",
    "explanation": "\"It's high time + özne\" kalıbından sonra fiil daima Past Simple (started) biçiminde gelir.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g11-q02",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "I would rather you _____ here tonight because the roads are icy.",
    "options": [
      "stayed",
      "stay",
      "will stay",
      "have stayed"
    ],
    "correctAnswer": "stayed",
    "explanation": "\"Would rather + farklı özne\" şimdiki zaman tercihi için Past Simple (stayed) alır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g11-q03",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "The doctor recommended that he _____ more regular exercise.",
    "options": [
      "take",
      "takes",
      "took",
      "will take"
    ],
    "correctAnswer": "take",
    "explanation": "Mandative subjunctive yapısında (\"recommend that\") fiil 3. tekil de olsa yalın (take) kalır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g11-q04",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "It is about time we _____ our final flight reservations.",
    "options": [
      "made",
      "make",
      "will make",
      "have made"
    ],
    "correctAnswer": "made",
    "explanation": "\"It's about time + özne\" kalıbı Past Simple (made) gerektirir.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g11-q05",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "I'd rather _____ at home than go to that noisy party tonight.",
    "options": [
      "stay",
      "stayed",
      "to stay",
      "staying"
    ],
    "correctAnswer": "stay",
    "explanation": "Özneler aynı olduğunda \"would rather + bare infinitive (V1: stay)\" kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g11-q06",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "She speaks English as if she _____ a native speaker born in London.",
    "options": [
      "were",
      "is",
      "will be",
      "has been"
    ],
    "correctAnswer": "were",
    "explanation": "\"As if\" ile gerçek dışı varsayım anlatılırken to be fiili \"were\" olarak çekimlenir.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g11-q07",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "It's high time the old heating system in our building _____ replaced.",
    "options": [
      "was",
      "is",
      "will be",
      "has been"
    ],
    "correctAnswer": "was",
    "explanation": "\"It's high time\" yapısında pasif çekim de Past Simple (was replaced) olur.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g11-q08",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "I would rather she _____ me the truth yesterday instead of lying.",
    "options": [
      "had told",
      "told",
      "tells",
      "would tell"
    ],
    "correctAnswer": "had told",
    "explanation": "\"Would rather + farklı özne\" geçmişe ait pişmanlık ve tercihte Past Perfect (had told) alır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g11-q09",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "The manager insisted that the confidential report _____ sent immediately.",
    "options": [
      "be",
      "is",
      "was",
      "were"
    ],
    "correctAnswer": "be",
    "explanation": "Mandative subjunctive pasif yapısında to be fiili yalın olarak \"be sent\" şeklinde kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g11-q10",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "He acts as though he _____ the entire department, but he is just an assistant.",
    "options": [
      "managed",
      "manages",
      "is managing",
      "will manage"
    ],
    "correctAnswer": "managed",
    "explanation": "Gerçek dışı durumu yansıtmak için \"as though\" sonrasında Past Simple (managed) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g11-q11",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "It is crucial that every candidate _____ present at the hall on time.",
    "options": [
      "be",
      "is",
      "will be",
      "being"
    ],
    "correctAnswer": "be",
    "explanation": "\"It is crucial that...\" kalıbı subjunctive gerektirir; to be fiili yalın (be) kalır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g11-q12",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "I'd rather you _____ smoke in the living room; the smell lingers for days.",
    "options": [
      "didn't",
      "don't",
      "won't",
      "haven't"
    ],
    "correctAnswer": "didn't",
    "explanation": "Farklı özne olumsuz tercihinde Past Simple olumsuz yardımcı fiili \"didn't\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g11-q13",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "She looked at the empty street as if she _____ a ghost.",
    "options": [
      "had seen",
      "saw",
      "sees",
      "is seeing"
    ],
    "correctAnswer": "had seen",
    "explanation": "Geçmişte yaşanmış gibi algılanan durum için as if + had seen uygundur.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g11-q14",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "The judge ordered that the defendant _____ a substantial fine.",
    "options": [
      "pay",
      "pays",
      "paid",
      "will pay"
    ],
    "correctAnswer": "pay",
    "explanation": "Resmi emir ve hüküm bildiren \"order that\" yapısında fiil yalın (pay) kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g11-q15",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "It's high time we _____ what course of action to pursue next.",
    "options": [
      "decided",
      "decide",
      "should decide",
      "had decided"
    ],
    "correctAnswer": "decided",
    "explanation": "\"It's high time + özne\" yapısından sonra \"should\" kullanılmaz; yalnızca Past Simple (decided) doğrudur.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g11-q16",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "I'd rather you _____ all that money on unnecessary luxury items last month.",
    "options": [
      "hadn't spent",
      "didn't spend",
      "wouldn't spend",
      "haven't spent"
    ],
    "correctAnswer": "hadn't spent",
    "explanation": "Geçmişe ait farklı özne tercihi ve eleştirisinde Past Perfect (hadn't spent) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g11-q17",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "The board demanded that the CEO _____ immediately following the financial scandal.",
    "options": [
      "resign",
      "resigns",
      "resigned",
      "will resign"
    ],
    "correctAnswer": "resign",
    "explanation": "Mandative subjunctive kuralına göre \"demand that + subject\" sonrasında fiil yalın (resign) kalmalıdır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g11-q18",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "He walked into the office as though nothing unusual _____ occurred that morning.",
    "options": [
      "had",
      "has",
      "would have",
      "was"
    ],
    "correctAnswer": "had",
    "explanation": "Geçmişteki bir olaydan daha önce gerçekleşmiş varsayım için as though + had occurred kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g11-q19",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "It is imperative that the laboratory equipment _____ sterilized before each experiment.",
    "options": [
      "be",
      "is",
      "was",
      "being"
    ],
    "correctAnswer": "be",
    "explanation": "\"It is imperative that\" resmi gereklilik yapısında pasif subjunctive \"be + V3\" (be sterilized) olur.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g11-q20",
    "topicId": "b2-g11",
    "level": "B2",
    "question": "Would you rather we _____ the dinner reservation until tomorrow evening?",
    "options": [
      "postponed",
      "postpone",
      "will postpone",
      "have postponed"
    ],
    "correctAnswer": "postponed",
    "explanation": "Soru cümlesinde de \"would rather + farklı özne\" yapısı Past Simple (postponed) ile kurulur.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g12-q01",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "After the accident, the injured driver was taken to _____ hospital immediately.",
    "options": [
      "Ø (no article)",
      "the",
      "a",
      "an"
    ],
    "correctAnswer": "Ø (no article)",
    "explanation": "Kurumun temel amacı (hasta olarak tedavi görmek) söz konusu olduğunda article kullanılmaz (to hospital).",
    "difficulty": "easy"
  },
  {
    "id": "b2-g12-q02",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "_____ Alps are one of the most famous mountain ranges in Europe.",
    "options": [
      "The",
      "A",
      "An",
      "Ø (no article)"
    ],
    "correctAnswer": "The",
    "explanation": "Sıradağlar (mountain ranges) her zaman \"The\" tanımlığı alır (The Alps).",
    "difficulty": "easy"
  },
  {
    "id": "b2-g12-q03",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "_____ Mount Everest is the highest mountain peak in the entire world.",
    "options": [
      "Ø (no article)",
      "The",
      "A",
      "An"
    ],
    "correctAnswer": "Ø (no article)",
    "explanation": "Tekil dağ zirveleri tanımlık almaz (Mount Everest).",
    "difficulty": "easy"
  },
  {
    "id": "b2-g12-q04",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "Alexander Graham Bell is widely credited with inventing _____ telephone.",
    "options": [
      "the",
      "a",
      "an",
      "Ø (no article)"
    ],
    "correctAnswer": "the",
    "explanation": "İcatların ve teknolojik araçların tür temsili için \"the\" (the telephone) kullanılır.",
    "difficulty": "easy"
  },
  {
    "id": "b2-g12-q05",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "We attended a very informative _____ seminar on artificial intelligence.",
    "options": [
      "two-hour",
      "two-hours",
      "two hour's",
      "two hours'"
    ],
    "correctAnswer": "two-hour",
    "explanation": "İsimden önce gelen bileşik sıfatlar tekil kalır ve -s takısı almaz (two-hour seminar).",
    "difficulty": "easy"
  },
  {
    "id": "b2-g12-q06",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "_____ unemployed face many financial difficulties during economic recessions.",
    "options": [
      "The",
      "A",
      "An",
      "Ø (no article)"
    ],
    "correctAnswer": "The",
    "explanation": "\"The + sıfat\" yapısı tüm grubu çoğul olarak ifade eder (\"The unemployed\" = işsizler).",
    "difficulty": "easy"
  },
  {
    "id": "b2-g12-q07",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "I went to _____ prison yesterday to visit my client who is on trial.",
    "options": [
      "the",
      "Ø (no article)",
      "a",
      "an"
    ],
    "correctAnswer": "the",
    "explanation": "Kişi suçlu/mahkum olarak değil, ziyaretçi olarak gittiğinde bina kastedildiği için \"the prison\" kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g12-q08",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "_____ United Kingdom consists of England, Scotland, Wales, and Northern Ireland.",
    "options": [
      "The",
      "Ø (no article)",
      "A",
      "An"
    ],
    "correctAnswer": "The",
    "explanation": "İçinde Kingdom, Republic, States gibi birlik/rejim ifadesi geçen ülkeler \"The\" alır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g12-q09",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "She plays _____ violin with great passion in the municipal orchestra.",
    "options": [
      "the",
      "a",
      "an",
      "Ø (no article)"
    ],
    "correctAnswer": "the",
    "explanation": "Müzik aleti çalma eylemlerinde enstrüman adı \"the\" ile kullanılır (play the violin).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g12-q10",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "They took a pleasant boat cruise along _____ river Thames.",
    "options": [
      "the",
      "Ø (no article)",
      "a",
      "an"
    ],
    "correctAnswer": "the",
    "explanation": "Nehir, deniz ve okyanus adları daima \"the\" tanımlığı alır (the Thames).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g12-q11",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "We bought a charming _____ house located near the city center.",
    "options": [
      "three-bedroom",
      "three-bedrooms",
      "three bedroom's",
      "three bedrooms"
    ],
    "correctAnswer": "three-bedroom",
    "explanation": "Bileşik niteleme sıfatlarında isim çoğul eki alamaz; \"three-bedroom\" olmalıdır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g12-q12",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "_____ Lake Geneva is one of the largest bodies of freshwater in Western Europe.",
    "options": [
      "Ø (no article)",
      "The",
      "A",
      "An"
    ],
    "correctAnswer": "Ø (no article)",
    "explanation": "Tekil göl adları başına tanımlık almaz (Lake Geneva).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g12-q13",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "The government recently announced new support measures for _____ elderly.",
    "options": [
      "the",
      "a",
      "an",
      "Ø (no article)"
    ],
    "correctAnswer": "the",
    "explanation": "Toplumsal grubu nitelemek için \"The elderly\" (yaşlılar) yapısı kullanılır.",
    "difficulty": "medium"
  },
  {
    "id": "b2-g12-q14",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "He has been studying medicine at _____ Cambridge University for three years.",
    "options": [
      "Ø (no article)",
      "the",
      "a",
      "an"
    ],
    "correctAnswer": "Ø (no article)",
    "explanation": "Şehir/kişi adıyla anılan üniversiteler \"zero article\" alır (Cambridge University; ancak The University of Cambridge).",
    "difficulty": "medium"
  },
  {
    "id": "b2-g12-q15",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "She was appointed as _____ chairwoman of the board of directors.",
    "options": [
      "Ø (no article)",
      "the",
      "a",
      "an"
    ],
    "correctAnswer": "Ø (no article)",
    "explanation": "Tek ve benzersiz resmi makam/unvan bildiren konumlarda fiilden sonra tanımlık kullanılmayabilir (appointed chairwoman).",
    "difficulty": "hard"
  },
  {
    "id": "b2-g12-q16",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "_____ Netherlands is famous worldwide for its historic windmills and tulips.",
    "options": [
      "The",
      "Ø (no article)",
      "A",
      "An"
    ],
    "correctAnswer": "The",
    "explanation": "Çoğul isim biçiminde olan ülke adları \"The\" tanımlığı alır (The Netherlands).",
    "difficulty": "hard"
  },
  {
    "id": "b2-g12-q17",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "They signed a lucrative _____ contract with an international logistics firm.",
    "options": [
      "ten-year",
      "ten-years",
      "ten year's",
      "ten years'"
    ],
    "correctAnswer": "ten-year",
    "explanation": "Zaman bildiren bileşik sıfat tekil kalır: \"a ten-year contract\".",
    "difficulty": "hard"
  },
  {
    "id": "b2-g12-q18",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "Is _____ cheetah really faster than any other land animal over short sprints?",
    "options": [
      "the",
      "a",
      "an",
      "Ø (no article)"
    ],
    "correctAnswer": "the",
    "explanation": "Bir hayvan türünü bütünüyle temsil etmek için formal dilde \"The + tekil isim\" (The cheetah) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g12-q19",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "He spent three months in _____ hospital recovering from multiple orthopedic surgeries.",
    "options": [
      "Ø (no article)",
      "the",
      "a",
      "an"
    ],
    "correctAnswer": "Ø (no article)",
    "explanation": "Hasta olarak tedavi süreci kastedildiğinden sıfır tanımlık (in hospital) kullanılır.",
    "difficulty": "hard"
  },
  {
    "id": "b2-g12-q20",
    "topicId": "b2-g12",
    "level": "B2",
    "question": "She bought a magnificent _____ wooden dining table for her new apartment.",
    "options": [
      "round antique",
      "antique round",
      "antique and round",
      "round and antique"
    ],
    "correctAnswer": "antique round",
    "explanation": "Sıfat diziliminde Yaş (Age: antique) Şekil'den (Shape: round) önce gelir (OSASCOMP kuralı).",
    "difficulty": "hard"
  }
];
