// 100 kelimelik A2 Pilot Paketi üreticisi (node veya macOS jsc ile çalışır) -> data/a2-pilot-100.json
// KURAL: alternativeAnswers YALNIZCA aynı kelimenin İngiliz/Amerikan yazım varyantları (ör. centimetre/centimeter) için kullanılır.
// Eş anlamlılar (autumn/fall, bookshop/bookstore), kısaltmalar (ad/advert, cm) veya farklı sözcük türleri alternativeAnswers içine EKLENMEZ.
// Biçim: word|pos|meanings(;)|exampleSentence|exampleTranslation|category|synonyms(;)|collocations(;)|wordFamily(;)|antonyms(;)|altAnswers(;)|reviewNote

const RAW_PILOT_A2 = `
abroad|adverb|yurt dışında;yurt dışına|My sister wants to study abroad next year.|Kız kardeşim gelecek yıl yurt dışında okumak istiyor.|Education|overseas|go abroad;live abroad||||
active|adjective|aktif;hareketli|My grandfather is eighty, but he is still very active.|Dedem seksen yaşında ama hâlâ çok hareketli.|Health|energetic;lively|stay active;active lifestyle|activity;actively|inactive;lazy||
adult|noun|yetişkin|Tickets are ten pounds for adults and five for children.|Biletler yetişkinler için on, çocuklar için beş sterlin.|Society|grown-up|young adult|adulthood|child||
adventure|noun|macera|Camping in the forest was a great adventure for us.|Ormanda kamp yapmak bizim için harika bir maceraydı.|Daily Life||a big adventure;sense of adventure|adventurous|||
advertisement|noun|reklam;ilan|I saw an advertisement for a cheap laptop online.|İnternette ucuz bir dizüstü bilgisayar reklamı gördüm.|Business|commercial|television advertisement;put an advertisement|advertise|||A2-B1 sınırında uzun kelime; kısaltmaları (ad/advert) tam kelime olmadığı için alternativeAnswers dizisinden çıkarıldı.
airline|noun|hava yolu şirketi|Which airline are you flying with tomorrow?|Yarın hangi hava yolu şirketiyle uçuyorsun?|Daily Life||international airline;airline ticket||||
airport|noun|havalimanı;havaalanı|We arrived at the airport two hours before the flight.|Uçuştan iki saat önce havalimanına vardık.|Daily Life||international airport;arrive at the airport||||
allow|verb|izin vermek|My parents do not allow me to play games late at night.|Ailem gece geç saatte oyun oynamama izin vermiyor.|Society|permit;let|allow someone to do||forbid||
almost|adverb|neredeyse;hemen hemen|Hurry up, it is almost time for the train.|Acele et, neredeyse tren vakti geldi.|Daily Life|nearly|almost ready;almost finished||||
alone|adjective|yalnız;tek başına|She was alone in the house on Sunday morning.|Pazar sabahı evde yalnızdı.|Psychology||leave someone alone;live alone||together||Hem sıfat (be alone) hem zarf (walk alone) olarak kullanılır; örnek cümle sıfat kullanımına göre düzenlendi.
amount|noun|miktar;tutar|Try to reduce the amount of sugar in your tea.|Çayındaki şeker miktarını azaltmaya çalış.|Health|quantity;sum|a large amount of;a small amount of||||A2-B1 sınırında; sayılamayan isimlerle kullanımı (amount of) ders notunda vurgulanabilir.
ancient|adjective|antik;çok eski|We visited an ancient castle near the sea.|Denizin yakınında antik bir kaleyi ziyaret ettik.|Society|very old|ancient history;ancient city||modern||
angry|adjective|kızgın;öfkeli|The teacher was angry because we were late.|Geç kaldığımız için öğretmen kızgındı.|Psychology|mad;upset|get angry;angry with someone|angrily;anger|calm||
announce|verb|duyurmak;ilan etmek|The school will announce the exam dates tomorrow.|Okul sınav tarihlerini yarın duyuracak.|Education|declare|announce a decision|announcement|||A2-B1 geçiş kelimesi; bazı listelerde B1 başında yer alır.
appear|verb|görünmek;ortaya çıkmak|The first stars appear in the sky after sunset.|Günbatımından sonra gökyüzünde ilk yıldızlar görünür.|Science|show up|appear suddenly|appearance|disappear||Çok anlamlı fiil: hem "ortaya çıkmak/belirmek" hem de "gibi görünmek (seem)" anlamında kullanılır.
appointment|noun|randevu|I have a dentist appointment at three o'clock.|Saat üçte dişçi randevum var.|Health||make an appointment;keep an appointment||||
architect|noun|mimar|Her uncle is an architect and designs modern houses.|Amcası bir mimar ve modern evler tasarlıyor.|Business||famous architect|architecture|||
argue|verb|tartışmak|My brothers often argue about which film to watch.|Erkek kardeşlerim sık sık hangi filmi izleyecekleri konusunda tartışır.|Psychology|quarrel;disagree|argue with someone;argue about|argument|agree||
arrange|verb|ayarlamak;düzenlemek|Can you arrange a meeting for Monday morning?|Pazartesi sabahı için bir toplantı ayarlayabilir misin?|Business|organise;plan|arrange a meeting;arrange tickets|arrangement|||
arrive|verb|varmak;ulaşmak|What time does the bus arrive in Ankara?|Otobüs Ankara'ya saat kaçta varıyor?|Daily Life|reach;get to|arrive at;arrive in;arrive early|arrival|leave;depart||
article|noun|makale;köşe yazısı|I read an interesting article about sleep yesterday.|Dün uyku hakkında ilginç bir makale okudum.|Education|essay;report|newspaper article;write an article||||Çok anlamlı kelime: hem "makale" hem "eşya/madde" hem de dilbilgisinde "tanım edatı" anlamına gelir.
artist|noun|sanatçı;ressam|The young artist painted a picture of the old bridge.|Genç sanatçı eski köprünün bir resmini yaptı.|Society|painter|talented artist;local artist|art;artistic|||
assistant|noun|yardımcı;asistan|The shop assistant helped me find the right size.|Mağaza görevlisi doğru bedeni bulmama yardım etti.|Business|helper|shop assistant;office assistant|assist;assistance|||
astronaut|noun|astronot|The astronaut spent six months on the space station.|Astronot uzay istasyonunda altı ay geçirdi.|Science||space astronaut||||
athlete|noun|sporcu;atlet|Every athlete in the race trained for many months.|Yarıştaki her sporcu aylarca antrenman yaptı.|Health|sportsperson|professional athlete;olympic athlete|athletic|||
attract|verb|çekmek;ilgi çekmek|The warm weather attracts many tourists to the coast.|Sıcak hava kıyıya birçok turist çekiyor.|Environment|draw|attract visitors;attract attention|attraction;attractive|||A2-B1 sınırında; B1 ile ortak havuzda değerlendirilebilir.
audience|noun|izleyiciler;seyirci|The audience clapped loudly at the end of the concert.|Konserin sonunda seyirciler yüksek sesle alkışladı.|Society|spectators;viewers|large audience||||
author|noun|yazar|Who is the author of your favourite book?|En sevdiğin kitabın yazarı kim?|Education|writer|famous author;best-selling author||||
autumn|noun|sonbahar|Tree leaves turn yellow and brown in autumn.|Ağaç yaprakları sonbaharda sarı ve kahverengiye döner.|Environment|fall|in autumn;autumn weather||spring||İngiliz İngilizcesi "autumn"; Amerikan İngilizcesi eş anlamlısı "fall" farklı bir kelime olduğu için alternativeAnswers yerine yalnızca synonyms içinde tutuldu.
average|adjective|ortalama;sıradan|The average temperature in July is thirty degrees.|Temmuz ayında ortalama sıcaklık otuz derecedir.|Science|normal;typical|average price;on average||||Hem sıfat hem isim olarak kullanılır.
avoid|verb|kaçınmak;uzak durmak|You should avoid eating heavy food before sleeping.|Uyumadan önce ağır yiyecekler yemekten kaçınmalısın.|Health|stay away from|avoid mistakes;avoid traffic|avoidable|||
awake|adjective|uyanık|The noise outside kept me awake until midnight.|Dışarıdaki gürültü gece yarısına kadar beni uyanık tuttu.|Health|alert|stay awake;wide awake|wake|asleep||
award|noun|ödül|She won an award for her science project.|Bilim projesi için bir ödül kazandı.|Education|prize|win an award;receive an award||||
awful|adjective|berbat;çok kötü|We stayed at home because the weather was awful.|Hava berbat olduğu için evde kaldık.|Daily Life|terrible;horrible|awful weather;feel awful|awfully|wonderful;great||
background|noun|arka plan;geçmiş|You can see snow-covered mountains in the background.|Arka planda karla kaplı dağları görebilirsin.|Daily Life||in the background;family background||||
backpack|noun|sırt çantası|He put his water bottle and map into his backpack.|Su şişesini ve haritasını sırt çantasına koydu.|Daily Life|rucksack|heavy backpack;school backpack||||
bandage|noun|bandaj;sargı bezi|The nurse put a clean bandage on his knee.|Hemşire onun dizine temiz bir sargı bezi sardı.|Health|dressing|put on a bandage||||
battery|noun|pil;batarya|My phone battery is almost empty.|Telefonumun bataryası neredeyse bitti.|Technology||low battery;charge the battery||||
bean|noun|fasulye|My mother cooked white beans and rice for dinner.|Annem akşam yemeği için beyaz fasulye ve pilav pişirdi.|Health||green beans;coffee beans||||
beard|noun|sakal|My uncle grew a long beard during the winter.|Amcam kış boyunca uzun bir sakal bıraktı.|Daily Life||grow a beard;short beard||||
beat|verb|yenmek;vurmak|Our school team beat the champions yesterday.|Okul takımımız dün şampiyonları yendi.|Society|defeat|beat a team;heart beats||lose||Düzensiz fiil (beat-beat-beaten) ve çok anlamlı (yenmek / kalp atması / vurmak).
bee|noun|arı|A bee flew into the kitchen through the open window.|Açık pencereden mutfağa bir arı girdi.|Environment||honey bee;busy bee||||
beginner|noun|başlangıç seviyesindeki kişi;acemi|This swimming course is suitable for beginners.|Bu yüzme kursu yeni başlayanlar için uygundur.|Education|learner;novice|complete beginner;beginner level|begin;beginning|expert||
behave|verb|davranmak;uslu durmak|The children behaved very well during the long trip.|Çocuklar uzun yolculuk boyunca çok iyi davrandı.|Psychology|act|behave well;behave badly|behaviour|||
believe|verb|inanmak|Do you believe his story about the lost key?|Kayıp anahtarla ilgili hikâyesine inanıyor musun?|Psychology|trust|believe in;hard to believe|belief;believable|doubt||
helmet|noun|kask|Always wear a helmet when you ride a bicycle.|Bisiklete bindiğinde her zaman kask tak.|Health||cycling helmet;wear a helmet||||
belong|verb|ait olmak|Does this black umbrella belong to you?|Bu siyah şemsiye sana mı ait?|Daily Life||belong to someone|belongings|||
belt|noun|kemer;emniyet kemeri|Please fasten your seat belt before the car moves.|Araba hareket etmeden önce lütfen emniyet kemerini bağla.|Daily Life||seat belt;leather belt||||
billion|noun|milyar|More than eight billion people live on Earth.|Dünya üzerinde sekiz milyardan fazla insan yaşıyor.|Science||one billion;billions of||||
blanket|noun|battaniye|Take an extra blanket because tonight will be cold.|Fazladan bir battaniye al çünkü bu gece soğuk olacak.|Daily Life|cover|warm blanket;wool blanket||||
bleed|verb|kanamak|His finger started to bleed after he cut it.|Parmağını kestikten sonra kanamaya başladı.|Health||bleed heavily|blood;bleeding|||
blind|adjective|kör;görme engelli|Special dogs help blind people walk safely in the street.|Özel köpekler görme engelli insanların sokakta güvenle yürümesine yardım eder.|Health||blind person|blindness|||
block|noun|apartman bloğu;blok|Walk two blocks straight ahead and turn left.|İki blok düz yürü ve sola dön.|Daily Life||apartment block;office block||||Çok anlamlı: hem "apartman bloğu/şehir bloğu" hem fiil olarak "engellemek".
blow|verb|esmek;üflemek|A cold wind is blowing from the north today.|Bugün kuzeyden soğuk bir rüzgâr esiyor.|Environment||wind blows;blow out candles||||
board|noun|tahta;yazı tahtası|The teacher wrote five new words on the board.|Öğretmen tahtaya beş yeni kelime yazdı.|Education||whiteboard;notice board;on board||||
boil|verb|kaynamak;haşlamak|Water boils at one hundred degrees Celsius.|Su yüz santigrat derecede kaynar.|Science||boil water;boil an egg|boiling|||
bone|noun|kemik|Milk helps children build strong bones.|Süt çocukların güçlü kemikler geliştirmesine yardımcı olur.|Health||broken bone;human bones||||
bookshop|noun|kitapçı|I bought a dictionary from the bookshop near our school.|Okulumuzun yanındaki kitapçıdan bir sözlük aldım.|Education|bookstore|local bookshop;second-hand bookshop||||İngiliz "bookshop"; Amerikan eş anlamlısı "bookstore" farklı bileşik kelime olduğu için alternativeAnswers yerine yalnızca synonyms içinde tutuldu.
boss|noun|patron;yönetici|She asked her boss for two days off next week.|Gelecek hafta için patronundan iki gün izin istedi.|Business|manager;employer|talk to the boss||||
bother|verb|rahatsız etmek;canını sıkmak|Sorry to bother you, but do you have the time?|Seni rahatsız ettiğim için üzgünüm ama saatin var mı?|Psychology|disturb;annoy|don't bother;bother someone||||
bottom|noun|alt;dip|Write your name at the bottom of the page.|Sayfanın alt kısmına adını yaz.|Daily Life|base|at the bottom of;bottom shelf||top||
bowl|noun|kâse|He ate a bowl of hot soup for lunch.|Öğle yemeğinde bir kâse sıcak çorba içti.|Daily Life|dish|a bowl of soup;salad bowl||||
brain|noun|beyin|Puzzles and reading are good exercises for your brain.|Bulmacalar ve okumak beynin için iyi egzersizlerdir.|Health|mind|human brain;brain power||||
branch|noun|dal;şube|A small bird sat on the highest branch of the tree.|Küçük bir kuş ağacın en yüksek dalına kondu.|Environment|bough|tree branch;bank branch||||Çok anlamlı kelime: hem "ağaç dalı" hem de "şube (banka vb.)" anlamında kullanılır; örnek cümle somut "ağaç dalı" anlamındadır.
brave|adjective|cesur|The brave firefighter saved the cat from the roof.|Cesur itfaiyeci kediyi çatıdan kurtardı.|Psychology|courageous;fearless|brave person;be brave|bravely;bravery|afraid;cowardly||
breath|noun|nefes;soluk|Take a deep breath before you start speaking.|Konuşmaya başlamadan önce derin bir nefes al.|Health||take a deep breath;out of breath|breathe|||İsim olan "breath" ile fiil olan "breathe" sık karıştırılır.
breeze|noun|esinti;meltem|A cool breeze came from the sea in the evening.|Akşamleyin denizden serin bir esinti geldi.|Environment|light wind|cool breeze;sea breeze|breezy|||
bride|noun|gelin|The bride wore a simple white dress at the wedding.|Gelin düğünde sade beyaz bir elbise giydi.|Society||bride and groom||||
bright|adjective|parlak;aydınlık|The kitchen is very bright in the morning.|Mutfak sabahları çok aydınlık oluyor.|Daily Life|shining;sunny|bright light;bright colour|brightly;brightness|dark;dull||
brighten|verb|aydınlatmak;neşelendirmek|Fresh flowers always brighten our living room.|Taze çiçekler oturma odamızı her zaman aydınlatır.|Daily Life|cheer up|brighten the room;brighten your day|bright|||A2-B1 sınırında türemiş fiil; "bright" kökünden dolayı boşluk doldurmada kök eşleşmesi dikkatle incelenmeli.
broad|adjective|geniş|We walked along a broad street with tall trees.|Uzun ağaçlı geniş bir cadde boyunca yürüdük.|Daily Life|wide|broad street;broad shoulders|broadly|narrow||
broken|adjective|kırık;bozuk|Be careful, there is broken glass on the floor.|Dikkatli ol, yerde kırık cam var.|Daily Life|damaged|broken window;broken arm|break|unbroken;working||
brush|verb|fırçalamak|You should brush your teeth after breakfast and before bed.|Kahvaltıdan sonra ve yatmadan önce dişlerini fırçalamalısın.|Health|clean|brush your teeth;brush your hair|toothbrush|||
budget|noun|bütçe|Students often travel on a small budget.|Öğrenciler genellikle küçük bir bütçeyle seyahat eder.|Business||low budget;monthly budget||||A2-B1 geçiş kelimesi.
burn|verb|yanmak;yakmak|Be careful not to burn your hand on the hot oven.|Sıcak fırında elini yakmamaya dikkat et.|Health||burn food;burn wood|burning|||
bury|verb|gömmek|The dog tried to bury a bone in the garden.|Köpek bahçeye bir kemik gömmeye çalıştı.|Daily Life||bury in the ground|burial|||A2-B1 sınırında fiil; bazı CEFR listelerinde B1 seviyesinde yer alır.
businessman|noun|iş insanı;iş adamı|The businessman travels to Berlin twice a month.|İş insanı ayda iki kez Berlin'e seyahat ediyor.|Business|entrepreneur|successful businessman|business|||
button|noun|düğme;tuş|Press the green button to start the washing machine.|Çamaşır makinesini çalıştırmak için yeşil düğmeye bas.|Technology|switch;key|press a button;shirt button||||
cabin|noun|kabin;kulübe|We stayed in a small wooden cabin in the mountains.|Dağlarda küçük ahşap bir kulübede kaldık.|Daily Life|cottage;hut|wooden cabin;ship cabin||||
calendar|noun|takvim|Mark the exam date on your calendar so you don't forget.|Unutmamak için sınav tarihini takvimine işaretle.|Education|schedule|wall calendar;check the calendar||||
calm|adjective|sakin;huzurlu|Stay calm and read the question again.|Sakin kal ve soruyu tekrar oku.|Psychology|peaceful;quiet|stay calm;calm sea|calmly;calmness|nervous;angry||
camel|noun|deve|Camels can walk for days in the desert without water.|Develer çölde günlerce susuz yürüyebilir.|Environment||desert camel||||
camp|verb|kamp yapmak|We plan to camp near the lake this weekend.|Bu hafta sonu gölün yakınında kamp yapmayı planlıyoruz.|Environment||go camping;camp outdoors|campsite;camper|||
cancel|verb|iptal etmek|They had to cancel the football match because of heavy snow.|Yoğun kar nedeniyle futbol maçını iptal etmek zorunda kaldılar.|Society|call off|cancel a flight;cancel a meeting|cancellation|||
capital|noun|başkent|Ankara is the capital of Turkey.|Ankara Türkiye'nin başkentidir.|Society||capital city;capital letter||||Çok anlamlı: başkent / büyük harf / sermaye.
careful|adjective|dikkatli|Be careful when you cross the busy road.|Kalabalık caddeden karşıya geçerken dikkatli ol.|Daily Life|cautious|be careful with|carefully;care|careless||
careless|adjective|dikkatsiz|He lost points because of careless spelling mistakes.|Dikkatsiz yazım hataları yüzünden puan kaybetti.|Education|sloppy|careless mistake;careless driver|carelessly;carelessness|careful||
carpet|noun|halı|She bought a soft blue carpet for her bedroom.|Yatak odası için yumuşak mavi bir halı aldı.|Daily Life|rug|clean the carpet;thick carpet||||
cartoon|noun|çizgi film;karikatür|My little brother watches cartoons every Saturday morning.|Küçük erkek kardeşim her cumartesi sabahı çizgi film izler.|Daily Life|animation|watch a cartoon;funny cartoon||||
cash|noun|nakit para|Do you want to pay in cash or by credit card?|Nakit mi yoksa kredi kartıyla mı ödemek istersiniz?|Business|money;coins|pay in cash;cash machine||||
castle|noun|kale;şato|Thousands of tourists visit the old castle every summer.|Her yaz binlerce turist eski kaleyi ziyaret eder.|Society|fortress;palace|old castle;stone castle||||
catch|verb|yakalamak;yetişmek|If we run, we can still catch the eight o'clock bus.|Koşarsak saat sekiz otobüsüne hâlâ yetişebiliriz.|Daily Life|grab;capture|catch a bus;catch a ball;catch a cold||miss||
ceiling|noun|tavan|There is a small lamp hanging from the ceiling.|Tavandan sarkan küçük bir lamba var.|Daily Life||high ceiling;low ceiling||floor||
celebrate|verb|kutlamak|We went to a nice restaurant to celebrate her birthday.|Doğum gününü kutlamak için güzel bir restorana gittik.|Society||celebrate a birthday;celebrate success|celebration|||
centimetre|noun|santimetre|The notebook is twenty centimetres long.|Defter yirmi santimetre uzunluğundadır.|Science||ten centimetres|||centimeter|İngiliz "centimetre", Amerikan yazım varyantı "centimeter" alternativeAnswers olarak korundu; kısaltma olan "cm" çıkarıldı.
century|noun|yüzyıl;asır|This stone bridge was built in the sixteenth century.|Bu taş köprü on altıncı yüzyılda inşa edildi.|Society||twentieth century;for centuries||||
certain|adjective|kesin;emin|Are you certain that the library is open on Sundays?|Kütüphanenin pazar günleri açık olduğundan emin misin?|Psychology|sure;confident|feel certain;for certain|certainly;certainty|uncertain;unsure||
chain|noun|zincir|The bicycle chain came off while I was riding up the hill.|Yokuş yukarı çıkarken bisikletin zinciri attı.|Technology||bicycle chain;heavy chain||||
champion|noun|şampiyon|She became the national chess champion at the age of sixteen.|On altı yaşında ulusal satranç şampiyonu oldu.|Society|winner|world champion;champion team|championship|||
chance|noun|şans;fırsat|Please give me one more chance to explain.|Açıklamam için lütfen bana bir şans daha ver.|Daily Life|opportunity;possibility|by chance;second chance||||
`;

const out = typeof print === 'function' ? print : console.log;
const readJSON = async (p) => {
  if (typeof readFile === 'function') return JSON.parse(readFile(p));
  const fs = await import('node:fs'); return JSON.parse(fs.readFileSync(p, 'utf8'));
};
const list = (s) => (s ? s.split(';').map((x) => x.trim()).filter(Boolean) : []);

// Mevcut orijinal 46 A2, 47 B1 ve 48 B2 kelimelerini kontrol et (id 001..046 olan A2 kelimeleri)
const existingWords = new Set();
for (const lv of ['a2', 'b1', 'b2']) {
  const arr = await readJSON(`data/${lv}.json`);
  for (const w of arr) {
    // Eğer a2.json zaten birleştirilmişse yalnızca ilk 46 (001..046) orijinal kaydı baz al
    const num = parseInt(w.id.split('-').pop(), 10);
    if (lv === 'a2' && num > 46) continue;
    existingWords.add(w.word.toLowerCase());
  }
}

const lines = RAW_PILOT_A2.trim().split('\n').filter((l) => l.trim());
const records = [];
const seenPilot = new Set();

lines.forEach((line, idx) => {
  const parts = line.split('|').map((x) => x.trim());
  const [word, pos, meanings, ex, tr, cat, syn, col, fam, ant, alt, reviewNote] = parts;
  if (!word || !pos || !meanings || !ex || !tr || !cat) {
    throw new Error(`Eksik zorunlu alan (satır ${idx + 1}): ${line}`);
  }
  const lw = word.toLowerCase();
  if (existingWords.has(lw)) {
    throw new Error(`Mevcut veritabanıyla tekrar eden kelime: ${word}`);
  }
  if (seenPilot.has(lw)) {
    throw new Error(`Pilot paket içinde tekrar eden kelime: ${word}`);
  }
  seenPilot.add(lw);

  const seq = 47 + idx; // Mevcut A2 001..046 olduğu için 047..146
  records.push({
    id: `a2-${lw}-${String(seq).padStart(3, '0')}`,
    level: 'A2',
    word,
    meanings: list(meanings),
    partOfSpeech: pos,
    pronunciation: '',
    exampleSentence: ex,
    exampleTranslation: tr,
    synonyms: list(syn),
    antonyms: list(ant),
    collocations: list(col),
    wordFamily: list(fam),
    category: cat,
    alternativeAnswers: list(alt),
    source: 'LEXORA Özgün A2 Derlemesi (NGSL 1.2 CC BY-SA 4.0 genel referanslı; resmi liste dosyalarıyla birebir otomatik çapraz doğrulama yapılmamıştır)',
    reviewRequired: Boolean(reviewNote),
    reviewNote: reviewNote || '',
    createdAt: '2026-10-23T00:00:00.000Z',
    updatedAt: '2026-10-23T00:00:00.000Z',
  });
});

out('PILOT_JSON\t' + JSON.stringify(records));
