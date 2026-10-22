// Kelime verisini üretir (node veya jsc ile). Her seviye için tek satır JSON basar; scripts/build-data.sh dosyalara böler.
// Biçim: word|pos|anlamlar(;)|örnek cümle|çeviri|kategori|eş anlamlılar(;)|kolokasyonlar(;)|kelime ailesi(;)|zıt anlamlılar(;)
const out = typeof print === 'function' ? print : console.log;

const A2 = `
apartment|noun|daire|They live in a small apartment near the station.|Onlar istasyonun yakınındaki küçük bir dairede yaşıyor.|Daily Life|flat|rent an apartment||
borrow|verb|ödünç almak|Can I borrow your pen, please?|Kalemini ödünç alabilir miyim, lütfen?|Daily Life||borrow money|borrower|lend
cheap|adjective|ucuz|This restaurant is cheap and the food is good.|Bu restoran ucuz ve yemekler iyi.|Daily Life|inexpensive|cheap price|cheaply|expensive
clean|adjective|temiz|Please keep your room clean.|Lütfen odanı temiz tut.|Daily Life|spotless|clean water|cleanliness|dirty
dangerous|adjective|tehlikeli|It is dangerous to swim in this river.|Bu nehirde yüzmek tehlikeli.|Environment|risky|dangerous animal|danger|safe
different|adjective|farklı|My brother is very different from me.|Erkek kardeşim benden çok farklı.|Daily Life|unlike|different from|difference|same
difficult|adjective|zor|The exam was difficult for most students.|Sınav çoğu öğrenci için zordu.|Education|hard|difficult question|difficulty|easy
discover|verb|keşfetmek|Scientists discovered a new island.|Bilim insanları yeni bir ada keşfetti.|Science|find|discover a cure|discovery|
early|adverb|erken|I get up early every morning.|Her sabah erken kalkarım.|Daily Life||early morning||late
education|noun|eğitim|Education is very important for children.|Eğitim çocuklar için çok önemlidir.|Education||primary education|educate;educational|
enjoy|verb|keyif almak;hoşlanmak|We enjoyed the film very much.|Filmden çok keyif aldık.|Daily Life|like|enjoy yourself|enjoyment|
exercise|noun|egzersiz;alıştırma|Regular exercise keeps you healthy.|Düzenli egzersiz sizi sağlıklı tutar.|Health||do exercise||
expensive|adjective|pahalı|That phone is too expensive for me.|O telefon benim için çok pahalı.|Daily Life|costly|expensive car|expense|cheap
famous|adjective|ünlü|She is a famous singer in Turkey.|O, Türkiye'de ünlü bir şarkıcı.|Society|well-known|famous actor|fame|unknown
foreign|adjective|yabancı|He wants to learn a foreign language.|O, yabancı bir dil öğrenmek istiyor.|Education||foreign language|foreigner|
healthy|adjective|sağlıklı|Fruit and vegetables are healthy food.|Meyve ve sebzeler sağlıklı yiyeceklerdir.|Health|fit|healthy diet|health|unhealthy
holiday|noun|tatil|We are going on holiday next week.|Gelecek hafta tatile gidiyoruz.|Daily Life|vacation|go on holiday||
invite|verb|davet etmek|She invited all her friends to the party.|Bütün arkadaşlarını partiye davet etti.|Society||invite someone to|invitation|
journey|noun|yolculuk|The journey to the city takes two hours.|Şehre yolculuk iki saat sürüyor.|Daily Life|trip|a long journey||
knowledge|noun|bilgi|Reading gives you a lot of knowledge.|Okumak sana çok bilgi kazandırır.|Education||general knowledge|know|ignorance
lazy|adjective|tembel|He is too lazy to do his homework.|Ödevini yapamayacak kadar tembel.|Psychology|idle|lazy student|laziness|hard-working
lesson|noun|ders|The English lesson starts at nine.|İngilizce dersi dokuzda başlıyor.|Education|class|private lesson||
machine|noun|makine|This machine makes fresh coffee.|Bu makine taze kahve yapıyor.|Technology||washing machine|machinery|
medicine|noun|ilaç;tıp|Take this medicine twice a day.|Bu ilacı günde iki kez al.|Health|drug|take medicine|medical|
mistake|noun|hata|I made a mistake in the last question.|Son soruda bir hata yaptım.|Education|error|make a mistake||
necessary|adjective|gerekli|Water is necessary for life.|Su yaşam için gereklidir.|Science|essential|absolutely necessary|necessity|unnecessary
neighbour|noun|komşu|Our neighbour is very friendly.|Komşumuz çok arkadaş canlısı.|Society||next-door neighbour|neighbourhood|
pollution|noun|kirlilik|Air pollution is a problem in big cities.|Hava kirliliği büyük şehirlerde bir sorundur.|Environment||air pollution|pollute|
prepare|verb|hazırlamak;hazırlanmak|I need to prepare for tomorrow's exam.|Yarınki sınava hazırlanmam gerekiyor.|Education|get ready|prepare for|preparation|
recycle|verb|geri dönüştürmek|We recycle paper and glass at home.|Evde kâğıt ve camı geri dönüştürüyoruz.|Environment||recycle paper|recycling|
remember|verb|hatırlamak|I can't remember her name.|Onun adını hatırlayamıyorum.|Psychology|recall|remember to do||forget
repair|verb|tamir etmek|He repaired my bike yesterday.|Dün bisikletimi tamir etti.|Daily Life|fix|repair a car||break
result|noun|sonuç|The test results will be ready on Friday.|Test sonuçları cuma günü hazır olacak.|Education|outcome|exam result||
secret|noun|sır|Can you keep a secret?|Bir sır saklayabilir misin?|Society||keep a secret||
special|adjective|özel|Today is a special day for us.|Bugün bizim için özel bir gün.|Daily Life||special occasion|specially|ordinary
subject|noun|ders;konu|Maths is my favourite subject.|Matematik benim en sevdiğim derstir.|Education|topic|school subject||
suggest|verb|önermek|I suggest taking a taxi.|Taksiye binmeyi öneriyorum.|Daily Life|recommend|suggest an idea|suggestion|
temperature|noun|sıcaklık;ateş|The temperature drops at night.|Sıcaklık geceleri düşüyor.|Science||high temperature||
traffic|noun|trafik|There was a lot of traffic this morning.|Bu sabah çok trafik vardı.|Daily Life||heavy traffic||
useful|adjective|yararlı|This app is very useful for students.|Bu uygulama öğrenciler için çok yararlı.|Technology|helpful|useful information|use|useless
weather|noun|hava durumu|The weather is cold and rainy today.|Bugün hava soğuk ve yağmurlu.|Environment||weather forecast||
worry|verb|endişelenmek|Don't worry about the exam.|Sınav için endişelenme.|Psychology|be anxious|worry about||
accident|noun|kaza|He had an accident on his way home.|Eve giderken bir kaza geçirdi.|Daily Life||car accident|accidental|
experience|noun|deneyim|She has a lot of experience in teaching.|Öğretmenlikte çok deneyimi var.|Business||work experience|experienced|
improve|verb|geliştirmek;gelişmek|I want to improve my English.|İngilizcemi geliştirmek istiyorum.|Education|get better|improve skills|improvement|
surprise|noun|sürpriz|The party was a big surprise.|Parti büyük bir sürprizdi.|Daily Life||a pleasant surprise||
`;

const B1 = `
achieve|verb|başarmak;elde etmek|She worked hard to achieve her goals.|Hedeflerine ulaşmak için çok çalıştı.|Education|accomplish;attain|achieve success;achieve a goal|achievement|fail
advantage|noun|avantaj;üstünlük|Speaking two languages is a big advantage.|İki dil konuşmak büyük bir avantajdır.|Society|benefit|take advantage of|advantageous|disadvantage
afford|verb|(maddi olarak) gücü yetmek|We can't afford a new car this year.|Bu yıl yeni bir araba almaya gücümüz yetmiyor.|Business||afford to buy|affordable|
attitude|noun|tutum;davranış|A positive attitude helps you learn faster.|Olumlu bir tutum daha hızlı öğrenmene yardımcı olur.|Psychology|outlook|positive attitude||
benefit|noun|fayda;yarar|Regular exercise has many health benefits.|Düzenli egzersizin birçok sağlık yararı vardır.|Health|advantage|health benefit|beneficial|drawback
capable|adjective|yetenekli;muktedir|She is capable of solving difficult problems.|O, zor problemleri çözebilecek yetenektedir.|Psychology|able|capable of|capability|incapable
challenge|noun|zorluk;meydan okuma|Learning a new language is a real challenge.|Yeni bir dil öğrenmek gerçek bir zorluktur.|Education|difficulty|face a challenge|challenging|
community|noun|topluluk;toplum|The local community built a new park.|Yerel topluluk yeni bir park yaptı.|Society||local community||
complain|verb|şikâyet etmek|Customers complained about the slow service.|Müşteriler yavaş hizmetten şikâyet etti.|Business||complain about|complaint|
consider|verb|düşünmek;göz önünde bulundurmak|You should consider all the options before deciding.|Karar vermeden önce tüm seçenekleri göz önünde bulundurmalısın.|Psychology|think about|consider carefully|consideration|
consume|verb|tüketmek|Cars consume a lot of fuel.|Arabalar çok yakıt tüketir.|Environment|use up|consume energy|consumption;consumer|
create|verb|yaratmak;oluşturmak|The company wants to create new jobs.|Şirket yeni iş olanakları yaratmak istiyor.|Business|make;produce|create jobs|creation;creative|destroy
culture|noun|kültür|Food is an important part of any culture.|Yemek her kültürün önemli bir parçasıdır.|Society||popular culture|cultural|
decrease|verb|azalmak;azaltmak|The number of students has decreased this year.|Öğrenci sayısı bu yıl azaldı.|Society|reduce;decline|decrease sharply||increase
degree|noun|derece;üniversite diploması|She has a degree in biology.|Biyoloji diploması var.|Education||university degree||
develop|verb|geliştirmek;gelişmek|Reading can develop your vocabulary.|Okumak kelime hazineni geliştirebilir.|Education|grow|develop skills|development|
device|noun|cihaz|Most students use a mobile device to study.|Çoğu öğrenci ders çalışmak için mobil bir cihaz kullanıyor.|Technology|gadget|electronic device||
environment|noun|çevre|We must protect the environment.|Çevreyi korumalıyız.|Environment|surroundings|protect the environment|environmental|
habit|noun|alışkanlık|Brushing your teeth is a good habit.|Dişlerini fırçalamak iyi bir alışkanlıktır.|Psychology|routine|bad habit||
influence|noun|etki;nüfuz|Parents have a strong influence on their children.|Ebeveynlerin çocukları üzerinde güçlü bir etkisi vardır.|Society|impact|have an influence on|influential|
increase|verb|artmak;artırmak|Prices increase every year.|Fiyatlar her yıl artıyor.|Business|rise;grow|increase rapidly||decrease
involve|verb|içermek;dahil etmek|The project involves a lot of teamwork.|Proje çok fazla ekip çalışması içeriyor.|Business|include|be involved in|involvement|
local|adjective|yerel|I buy vegetables from the local market.|Sebzeleri yerel pazardan alıyorum.|Society||local people||global
manage|verb|yönetmek;başarmak|She manages a team of ten people.|On kişilik bir ekibi yönetiyor.|Business|run;handle|manage a team|manager;management|
method|noun|yöntem|This method makes memorising words easier.|Bu yöntem kelime ezberlemeyi kolaylaştırır.|Education|technique|teaching method||
opportunity|noun|fırsat|This job is a great opportunity for young people.|Bu iş gençler için harika bir fırsattır.|Business|chance|a golden opportunity||
opinion|noun|görüş;fikir|In my opinion, the film was too long.|Bence film çok uzundu.|Society|view|in my opinion||
patient|adjective|sabırlı|A good teacher must be patient.|İyi bir öğretmen sabırlı olmalıdır.|Psychology|calm|be patient with|patience|impatient
period|noun|dönem;süre|He lived abroad for a long period.|Uzun bir süre yurt dışında yaşadı.|Society|time|period of time||
previous|adjective|önceki|The previous lesson was about verbs.|Önceki ders fiiller hakkındaydı.|Education|earlier|previous experience||next
protect|verb|korumak|Trees protect the soil from erosion.|Ağaçlar toprağı erozyondan korur.|Environment|defend|protect from|protection|
reduce|verb|azaltmak|We should reduce plastic waste.|Plastik atıkları azaltmalıyız.|Environment|decrease|reduce costs|reduction|increase
refuse|verb|reddetmek|He refused to answer the question.|Soruyu cevaplamayı reddetti.|Society|decline|refuse an offer|refusal|accept
reliable|adjective|güvenilir|This is a reliable source of information.|Bu güvenilir bir bilgi kaynağıdır.|Technology|trustworthy|reliable source|rely|unreliable
research|noun|araştırma|Scientists are doing research on the disease.|Bilim insanları hastalık üzerine araştırma yapıyor.|Science|study|do research|researcher|
responsible|adjective|sorumlu|Parents are responsible for their children.|Ebeveynler çocuklarından sorumludur.|Society|accountable|responsible for|responsibility|
society|noun|toplum|Education improves society.|Eğitim toplumu geliştirir.|Society||modern society|social|
stress|noun|stres;gerilim|Too much work causes stress.|Çok fazla iş strese neden olur.|Psychology|pressure|reduce stress|stressful|
suffer|verb|acı çekmek;zarar görmek|Many people suffer from back pain.|Birçok insan sırt ağrısı çekiyor.|Health||suffer from||
survey|noun|anket|The survey shows that most people like the idea.|Anket çoğu insanın fikri beğendiğini gösteriyor.|Society|poll|conduct a survey||
tend|verb|eğilimi olmak|Young people tend to use social media a lot.|Gençler sosyal medyayı çok kullanma eğilimindedir.|Society||tend to|tendency|
waste|noun|atık;israf|We produce too much plastic waste.|Çok fazla plastik atık üretiyoruz.|Environment|rubbish|household waste||
available|adjective|mevcut;müsait|Is this book available in the library?|Bu kitap kütüphanede mevcut mu?|Education|obtainable|available online|availability|unavailable
digital|adjective|dijital|Digital skills are important today.|Dijital beceriler bugün önemlidir.|Technology||digital technology||
emotion|noun|duygu|She couldn't hide her emotions.|Duygularını saklayamadı.|Psychology|feeling|show emotion|emotional|
recover|verb|iyileşmek;toparlanmak|He is recovering from the flu.|Gripten iyileşiyor.|Health|get better|recover from|recovery|
volunteer|noun|gönüllü|She works as a volunteer at the hospital.|Hastanede gönüllü olarak çalışıyor.|Society||volunteer work|voluntary|
`;

const B2 = `
acquire|verb|edinmek;kazanmak|Children acquire language naturally.|Çocuklar dili doğal olarak edinir.|Education|obtain;gain|acquire knowledge|acquisition|lose
adapt|verb|uyum sağlamak;uyarlamak|Animals must adapt to climate change.|Hayvanlar iklim değişikliğine uyum sağlamak zorundadır.|Environment|adjust|adapt to|adaptation|
analyse|verb|analiz etmek|Researchers analysed the data carefully.|Araştırmacılar verileri dikkatle analiz etti.|Science|examine|analyse data|analysis|
anxiety|noun|kaygı;endişe|Many students feel anxiety before exams.|Birçok öğrenci sınavlardan önce kaygı hisseder.|Psychology|worry|feel anxiety|anxious|calm
approach|noun|yaklaşım|The school uses a modern approach to teaching.|Okul öğretimde modern bir yaklaşım kullanıyor.|Education|method|a new approach||
assess|verb|değerlendirmek|Teachers assess students through regular tests.|Öğretmenler öğrencileri düzenli sınavlarla değerlendirir.|Education|evaluate|assess performance|assessment|
assume|verb|varsaymak|I assumed that the shop would be open.|Dükkânın açık olacağını varsaydım.|Psychology|presume|assume responsibility|assumption|
aware|adjective|farkında|Many people are not aware of the risks.|Birçok insan risklerin farkında değil.|Society|conscious|be aware of|awareness|unaware
campaign|noun|kampanya|The campaign aims to reduce plastic use.|Kampanya plastik kullanımını azaltmayı amaçlıyor.|Society||launch a campaign||
cognitive|adjective|bilişsel|Sleep is important for cognitive development.|Uyku bilişsel gelişim için önemlidir.|Psychology||cognitive skills|cognition|
concept|noun|kavram|The concept of time is difficult to explain.|Zaman kavramını açıklamak zordur.|Academic Vocabulary|idea|a basic concept|conceptual|
conclude|verb|sonuca varmak;bitirmek|The study concluded that sleep improves memory.|Çalışma, uykunun hafızayı geliştirdiği sonucuna vardı.|Academic Vocabulary|deduce|conclude that|conclusion|
consequence|noun|sonuç;akıbet|Pollution has serious consequences for health.|Kirliliğin sağlık için ciddi sonuçları vardır.|Environment|result|serious consequences|consequently|
constant|adjective|sürekli;sabit|The constant noise made it hard to focus.|Sürekli gürültü odaklanmayı zorlaştırdı.|Daily Life|continuous|constant change|constantly|
contribute|verb|katkıda bulunmak|Everyone can contribute to protecting nature.|Herkes doğanın korunmasına katkıda bulunabilir.|Society|add|contribute to|contribution|
controversial|adjective|tartışmalı|The new law is very controversial.|Yeni yasa çok tartışmalı.|Society|disputed|controversial issue|controversy|
criticise|verb|eleştirmek|The report criticised the government's decision.|Rapor hükümetin kararını eleştirdi.|Society|condemn|criticise harshly|criticism|praise
deliberate|adjective|kasıtlı|It was a deliberate attempt to mislead people.|Bu, insanları yanıltmaya yönelik kasıtlı bir girişimdi.|Society|intentional|deliberate act|deliberately|accidental
demonstrate|verb|göstermek;kanıtlamak|The experiment demonstrates how plants grow.|Deney bitkilerin nasıl büyüdüğünü gösteriyor.|Science|show;prove|demonstrate a skill|demonstration|
depend|verb|bağlı olmak|Success depends on hard work.|Başarı çok çalışmaya bağlıdır.|Academic Vocabulary|rely|depend on|dependent;dependence|
distinguish|verb|ayırt etmek|It is hard to distinguish between the twins.|İkizleri birbirinden ayırt etmek zor.|Academic Vocabulary|differentiate|distinguish between|distinction|
efficient|adjective|verimli|Solar panels are an efficient source of energy.|Güneş panelleri verimli bir enerji kaynağıdır.|Technology|productive|energy efficient|efficiency|inefficient
eliminate|verb|ortadan kaldırmak|The company wants to eliminate waste.|Şirket israfı ortadan kaldırmak istiyor.|Business|remove|eliminate the risk|elimination|
emerge|verb|ortaya çıkmak|New technologies emerge every year.|Her yıl yeni teknolojiler ortaya çıkıyor.|Technology|appear|emerge from|emergence|disappear
enhance|verb|artırmak;geliştirmek|Good lighting can enhance your concentration.|İyi aydınlatma konsantrasyonunu artırabilir.|Psychology|improve|enhance performance|enhancement|
evidence|noun|kanıt|There is no evidence that the drug is harmful.|İlacın zararlı olduğuna dair hiçbir kanıt yok.|Science|proof|clear evidence|evident|
expose|verb|maruz bırakmak;ortaya çıkarmak|Children should not be exposed to too much screen time.|Çocuklar çok fazla ekran süresine maruz bırakılmamalı.|Health|reveal|be exposed to|exposure|
factor|noun|etken;faktör|Diet is an important factor in good health.|Beslenme sağlıklı olmada önemli bir etkendir.|Academic Vocabulary|element|key factor||
generate|verb|üretmek;oluşturmak|Wind turbines generate clean electricity.|Rüzgâr türbinleri temiz elektrik üretir.|Environment|produce|generate electricity|generation|
global|adjective|küresel|Climate change is a global problem.|İklim değişikliği küresel bir sorundur.|Environment|worldwide|global warming|globalisation|local
impact|noun|etki;darbe|Social media has a huge impact on teenagers.|Sosyal medyanın gençler üzerinde büyük bir etkisi var.|Society|effect|have an impact on||
indicate|verb|göstermek;işaret etmek|The results indicate a clear improvement.|Sonuçlar net bir gelişme gösteriyor.|Academic Vocabulary|show|indicate a trend|indication|
interpret|verb|yorumlamak|Scientists interpret the data in different ways.|Bilim insanları verileri farklı şekillerde yorumlar.|Academic Vocabulary|explain|interpret data|interpretation|
investigate|verb|araştırmak;soruşturmak|Police will investigate the cause of the fire.|Polis yangının nedenini araştıracak.|Society|examine|investigate a case|investigation|
obvious|adjective|açık;belli|It was obvious that she was tired.|Yorgun olduğu belliydi.|Daily Life|clear|obvious reason|obviously|unclear
obtain|verb|elde etmek|You need to obtain permission first.|Önce izin almanız gerekiyor.|Business|get;acquire|obtain permission||
phenomenon|noun|olgu;fenomen|Rainbows are a natural phenomenon.|Gökkuşağı doğal bir olgudur.|Science||natural phenomenon|phenomena|
potential|noun|potansiyel|She has the potential to become a great scientist.|Büyük bir bilim insanı olma potansiyeline sahip.|Psychology||realise your potential|potentially|
predict|verb|tahmin etmek|Experts predict that prices will rise.|Uzmanlar fiyatların artacağını tahmin ediyor.|Science|forecast|predict the future|prediction|
priority|noun|öncelik|Safety is our top priority.|Güvenlik bizim önceliğimizdir.|Business||top priority|prioritise|
sufficient|adjective|yeterli|We don't have sufficient evidence to decide.|Karar vermek için yeterli kanıtımız yok.|Academic Vocabulary|enough|sufficient evidence|insufficient|insufficient
sustainable|adjective|sürdürülebilir|We need sustainable sources of energy.|Sürdürülebilir enerji kaynaklarına ihtiyacımız var.|Environment||sustainable development|sustainability|
tackle|verb|ele almak;üstesinden gelmek|Governments must tackle unemployment.|Hükümetler işsizlikle mücadele etmelidir.|Society|deal with|tackle a problem||
reluctant|adjective|isteksiz|He was reluctant to share his opinion.|Fikrini paylaşmaya isteksizdi.|Psychology|unwilling|reluctant to|reluctance|willing
vulnerable|adjective|savunmasız;hassas|Young children are vulnerable to infections.|Küçük çocuklar enfeksiyonlara karşı hassastır.|Health|exposed|vulnerable to|vulnerability|
innovation|noun|yenilik|Innovation drives economic growth.|Yenilik ekonomik büyümeyi destekler.|Technology||technological innovation|innovate|
overcome|verb|üstesinden gelmek|She tried to overcome her fear of public speaking.|Topluluk önünde konuşma korkusunun üstesinden gelmeye çalıştı.|Psychology|defeat|overcome a problem||
inevitable|adjective|kaçınılmaz|Change is inevitable.|Değişim kaçınılmazdır.|Society|unavoidable|inevitable result|inevitably|avoidable
`;

const ALT = { neighbour: ['neighbor'], analyse: ['analyze'], criticise: ['criticize'], globalisation: ['globalization'] };
const list = (s) => (s ? s.split(';').map((x) => x.trim()).filter(Boolean) : []);

function build(level, text) {
  const seen = new Set();
  return text.trim().split('\n').map((line, i) => {
    const [word, pos, meanings, ex, tr, cat, syn, col, fam, ant] = line.split('|').map((x) => x.trim());
    if (!word || !meanings || !ex) throw new Error(`Hatalı satır (${level} #${i + 1}): ${line}`);
    if (seen.has(word)) throw new Error(`Tekrar: ${word}`);
    seen.add(word);
    return {
      id: `${level.toLowerCase()}-${word}-${String(i + 1).padStart(3, '0')}`, level, word,
      meanings: list(meanings), partOfSpeech: pos, pronunciation: '',
      exampleSentence: ex, exampleTranslation: tr,
      synonyms: list(syn), antonyms: list(ant), collocations: list(col), wordFamily: list(fam),
      category: cat, alternativeAnswers: ALT[word] || [],
      createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z',
    };
  });
}
for (const [lv, t] of [['A2', A2], ['B1', B1], ['B2', B2]]) out(lv + '\t' + JSON.stringify(build(lv, t)));
