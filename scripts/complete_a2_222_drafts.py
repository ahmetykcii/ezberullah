#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LEXORA — 222 A2 Taslak Kelime İnceleme, Tamamlama ve Kalite Kontrol Betiği
Kurallar:
- Mevcut 727 aktif kelimenin (A2: 274, B1: 192, B2: 261) hiçbir alanı veya ID'si değiştirilmez.
- 222 A2 taslak kelimesi (a2-oxref-0031 .. a2-oxref-0252) tek tek incelenir:
  * 1 kelime (neighbor) mevcut a2-neighbour-027 (neighbour) kaydının Amerikan yazım varyantı olduğu için
    ikinci bir bağımsız öğrenme kartı olarak aktif edilmez; taslakta (isDraft: true) tutulur.
  * 11 kelime (effective, financial, independent, innocent, accidentally, annually, anxiously,
    eventually, frequently, obviously, personally) CEFR B1 seviyesine daha uygun olduğu için seviyesi
    otomatik değiştirilmeden gerekçesiyle taslakta (isDraft: true) bekletilir.
  * 6 kelime (about, above, across, around, behind, below) PDF kaynağında "adverb" olarak etiketlenmiş
    olmasına rağmen verilen Türkçe anlamları ("hakkında", "üzerinde", "karşısında", "etrafında",
    "arkasında", "altında") edat (preposition) kullanımı olduğu için sözcük türü uyumsuzluğu nedeniyle
    taslakta (isDraft: true) bekletilir.
  * Kalan 204 kelime için A2 seviyesine uygun, doğal, özgün, temel kelime biçimini (base form) ve
    doğru sözcük türünü (partOfSpeech) kullanan İngilizce örnek cümleler ve Türkçe çevirileri eklenerek
    isDraft: false (AKTİF) durumuna getirilir.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"

# 1. Tekrar / Yazım Varyantı Nedeniyle Bekletilenler (1 kelime)
HELD_DUPLICATE = {
    "neighbor": (
        "Mevcut a2-neighbour-027 (neighbour) kaydının Amerikan İngilizcesi yazım varyantıdır; "
        "bağımsız ikinci bir kart olarak aktif edilmedi, neighbour kaydındaki alternativeAnswers korundu."
    ),
}

# 2. CEFR B1 Seviyesine Daha Uygun Olduğu İçin Bekletilenler (11 kelime)
HELD_CEFR_B1 = {
    "effective": "CEFR incelemesi: Soyut değerlendirme sıfatıdır; standart CEFR profillerinde B1 seviyesine daha uygundur.",
    "financial": "CEFR incelemesi: Ekonomi/maliye terimidir; standart CEFR profillerinde B1 seviyesine daha uygundur.",
    "independent": "CEFR incelemesi: Soyut kavram sıfatıdır; standart CEFR profillerinde B1 seviyesine daha uygundur.",
    "innocent": "CEFR incelemesi: Hukuki ve ahlaki soyut sıfattır; B1 seviyesine daha uygundur.",
    "accidentally": "CEFR incelemesi: Türemiş zarf biçimi B1 seviyesindedir (A2 seviyesinde 'by accident' kalıbı öğretilir).",
    "annually": "CEFR incelemesi: Resmi iş/akademik zarftır ve kök sıfatı 'annual' B1 veri tabanında (b1-annual-081) yer almaktadır; B1 seviyesine daha uygundur.",
    "anxiously": "CEFR incelemesi: Kök ismi 'anxiety' B1 veri tabanında (b1-anxiety-082) yer almaktadır; türemiş zarf B1 seviyesine daha uygundur.",
    "eventually": "CEFR incelemesi: Uzun süreç sonunu belirten zarftır (A2'deki 'finally'den farklı olarak B1 seviyesine daha uygundur).",
    "frequently": "CEFR incelemesi: A2'deki 'often' zarfının resmi eş anlamlısıdır; B1 seviyesine daha uygundur.",
    "obviously": "CEFR incelemesi: Söylem belirteci (discourse marker) olarak B1 seviyesine daha uygundur.",
    "personally": "CEFR incelemesi: Kişisel görüş bildirme zarfı olarak B1 seviyesine daha uygundur.",
}

# 3. Dil / Veri (Sözcük Türü - Anlam Uyumsuzluğu) Nedeniyle Bekletilenler (6 kelime)
HELD_POS_MISMATCH = {
    "about": "Dil/Veri incelemesi: PDF kaynağında partOfSpeech 'adverb' olarak verilmiş ancak Türkçe anlamda ilk sırada edat (preposition) olan 'hakkında' yer alıyor; sözcük türü netleştirilene kadar taslak bırakıldı.",
    "above": "Dil/Veri incelemesi: PDF kaynağında partOfSpeech 'adverb' olarak verilmiş ancak 'üzerinde, üstünde' anlamı birincil olarak preposition (edat) kullanımıdır; taslak bırakıldı.",
    "across": "Dil/Veri incelemesi: PDF kaynağında partOfSpeech 'adverb' olarak verilmiş ancak 'karşısında' anlamı preposition (edat) kullanımıdır; taslak bırakıldı.",
    "around": "Dil/Veri incelemesi: PDF kaynağında partOfSpeech 'adverb' olarak verilmiş ancak 'etrafında, civarında' anlamı birincil olarak preposition (edat) kullanımıdır; taslak bırakıldı.",
    "behind": "Dil/Veri incelemesi: PDF kaynağında partOfSpeech 'adverb' olarak verilmiş ancak 'arkasında' anlamı birincil olarak preposition (edat) kullanımıdır; taslak bırakıldı.",
    "below": "Dil/Veri incelemesi: PDF kaynağında partOfSpeech 'adverb' olarak verilmiş ancak 'aşağısında, altında' anlamı birincil olarak preposition (edat) kullanımıdır; taslak bırakıldı.",
}

# 4. Kalite Kontrolünden Geçen ve Aktifleşecek 204 A2 Kelimesinin Özgün Cümle ve Çevirileri
# Tüm cümlelerde hedef kelimenin temel biçimi (base form) ve kayıtlı partOfSpeech türü birebir kullanılmıştır.
VERIFIED_A2_COMPLETIONS = {
    # Fiiller (Verbs - 41)
    "explain": ("Can you explain this grammar rule to me?", "Bu dil bilgisi kuralını bana açıklayabilir misin?"),
    "fall": ("Leaves fall from the trees in October.", "Ekim ayında yapraklar ağaçlardan düşer."),
    "fill": ("Please fill the bottle with cold water.", "Lütfen şişeyi soğuk suyla doldur."),
    "find": ("I cannot find my house keys anywhere.", "Ev anahtarlarımı hiçbir yerde bulamıyorum."),
    "finish": ("We usually finish work at five o'clock.", "İşi genellikle saat beşte bitiririz."),
    "fly": ("Many birds fly south before winter.", "Birçok kuş kıştan önce güneye uçar."),
    "follow": ("Please follow the signs to the museum.", "Lütfen müzeye giden tabelaları takip et."),
    "forget": ("Do not forget to lock the front door.", "Ön kapıyı kilitlemeyi unutma."),
    "forgive": ("Please forgive me for being late today.", "Bugün geç kaldığım için lütfen beni affet."),
    "grow": ("Tomatoes grow very well in warm weather.", "Domatesler sıcak havada çok iyi yetişir."),
    "guess": ("Can you guess the answer to this riddle?", "Bu bilmecenin cevabını tahmin edebilir misin?"),
    "happen": ("Accidents often happen on rainy nights.", "Kazalar genellikle yağmurlu gecelerde meydana gelir."),
    "hate": ("I hate waiting in long queues at the bank.", "Bankada uzun kuyruklarda beklemekten nefret ederim."),
    "hear": ("Can you hear the music from the next room?", "Yan odadan gelen müziği duyabiliyor musun?"),
    "help": ("Could you help me move this heavy table?", "Bu ağır masayı taşımama yardım edebilir misin?"),
    "hide": ("The little cat likes to hide under the bed.", "Küçük kedi yatağın altına saklanmayı sever."),
    "hope": ("I hope the weather stays sunny this weekend.", "Umarım bu hafta sonu hava güneşli kalır."),
    "include": ("Does the hotel price include breakfast?", "Otel fiyatına kahvaltı dahil mi?"),
    "join": ("Would you like to join our chess club?", "Satranç kulübümüze katılmak ister misin?"),
    "keep": ("You should keep fresh milk in the fridge.", "Taze sütü buzdolabında tutmalısın."),
    "know": ("Do you know the way to the train station?", "Tren istasyonuna giden yolu biliyor musun?"),
    "laugh": ("His funny stories always make us laugh.", "Onun komik hikâyeleri bizi her zaman güldürür."),
    "learn": ("Children learn new words very fast.", "Çocuklar yeni kelimeleri çok hızlı öğrenir."),
    "leave": ("The last bus will leave in ten minutes.", "Son otobüs on dakika içinde kalkacak."),
    "lend": ("Can you lend me your umbrella until tomorrow?", "Yarına kadar şemsiyeni bana ödünç verebilir misin?"),
    "listen": ("We often listen to the radio in the morning.", "Sabahları sık sık radyo dinleriz."),
    "lose": ("Take care not to lose your boarding pass.", "Biniş kartını kaybetmemeye dikkat et."),
    "love": ("My grandparents love working in their garden.", "Büyükanne ve büyükbabam bahçelerinde çalışmayı çok sever."),
    "make": ("I want to make a chocolate cake for tonight.", "Bu akşam için çikolatalı bir pasta yapmak istiyorum."),
    "mean": ("What does this green symbol mean on the map?", "Haritadaki bu yeşil sembol ne anlama geliyor?"),
    "meet": ("Let's meet in front of the cinema at seven.", "Saat yedide sinemanın önünde buluşalım."),
    "repeat": ("Could you repeat the last sentence, please?", "Son cümleyi tekrar edebilir misiniz, lütfen?"),
    "save": ("I try to save a little money every month.", "Her ay biraz para biriktirmeye çalışıyorum."),
    "search": ("You can search for the book title online.", "Kitap adını internette arayabilirsin."),
    "send": ("I will send you a postcard from Izmir.", "Sana İzmir'den bir kartpostal göndereceğim."),
    "share": ("The two sisters share a large bedroom.", "İki kız kardeş büyük bir yatak odasını paylaşıyor."),
    "speak": ("Please speak slowly so everyone can understand.", "Herkesin anlayabilmesi için lütfen yavaş konuş."),
    "spend": ("We plan to spend our holiday by the sea.", "Tatilimizi deniz kenarında geçirmeyi planlıyoruz."),
    "understand": ("Do you understand the instructions on the box?", "Kutunun üzerindeki talimatları anlıyor musun?"),
    "wear": ("Doctors wear white coats in the hospital.", "Doktorlar hastanede beyaz önlük giyer."),
    "win": ("Practice hard if you want to win the match.", "Maçı kazanmak istiyorsan sıkı antrenman yap."),

    # İsimler (Nouns - 58)
    "accommodation": ("The price of the tour includes hotel accommodation.", "Tur fiyatına otel konaklaması dahildir."),
    "action": ("Quick action by the driver prevented an accident.", "Sürücünün hızlı hareketi bir kazayı önledi."),
    "activity": ("Swimming is my favourite summer activity.", "Yüzmek benim en sevdiğim yaz aktivitesidir."),
    "actor": ("The famous actor played a detective in the film.", "Ünlü aktör filmde bir dedektifi canlandırdı."),
    "advice": ("My father gave me useful advice before the interview.", "Babam mülakattan önce bana faydalı bir tavsiye verdi."),
    "animal": ("The giraffe is the tallest animal on land.", "Zürafa karadaki en uzun hayvandır."),
    "appearance": ("The old town has changed its appearance over the years.", "Eski kasaba yıllar içinde dış görünüşünü değiştirdi."),
    "baggage": ("Please collect your baggage from belt number three.", "Lütfen bagajınızı üç numaralı banttan alın."),
    "behavior": ("The teacher praised the students for their polite behavior.", "Öğretmen öğrencileri nazik davranışları için övdü."),
    "biology": ("We studied plant cells in our biology class today.", "Bugün biyoloji dersimizde bitki hücrelerini inceledik."),
    "building": ("The library is the oldest building in our town.", "Kütüphane kasabamızdaki en eski binadır."),
    "business": ("Her aunt runs a small bakery business.", "Teyzesi küçük bir fırın işletmesi yürütüyor."),
    "camera": ("He bought a digital camera for his holiday.", "Tatili için dijital bir fotoğraf makinesi aldı."),
    "career": ("She started her teaching career twenty years ago.", "Öğretmenlik kariyerine yirmi yıl önce başladı."),
    "cheque": ("Grandfather paid the plumber by cheque.", "Dedem tesisatçıya çek ile ödeme yaptı."),
    "cinema": ("There is a new film showing at the local cinema.", "Yerel sinemada yeni bir film gösteriliyor."),
    "clothes": ("Pack warm clothes because the nights are cold.", "Kalın giysiler al çünkü geceler soğuk oluyor."),
    "competition": ("She won first prize in the painting competition.", "Resim yarışmasında birincilik ödülünü kazandı."),
    "dentist": ("You should visit the dentist twice a year.", "Yılda iki kez diş hekimine gitmelisin."),
    "department": ("My cousin works in the sales department.", "Kuzenim satış departmanında çalışıyor."),
    "description": ("The witness gave a clear description of the car.", "Tanık arabanın net bir betimlemesini yaptı."),
    "dictionary": ("Use a dictionary to check the meaning of new words.", "Yeni kelimelerin anlamını kontrol etmek için bir sözlük kullan."),
    "diet": ("A balanced diet includes fruit, vegetables and grains.", "Dengeli bir beslenme düzeni meyve, sebze ve tahılları içerir."),
    "difference": ("Can you tell the difference between these two photos?", "Bu iki fotoğraf arasındaki farkı söyleyebilir misin?"),
    "direction": ("The wind blew from the direction of the sea.", "Rüzgâr deniz yönünden esti."),
    "discount": ("Students get a ten percent discount on train tickets.", "Öğrenciler tren biletlerinde yüzde on indirim alır."),
    "discussion": ("We had a useful discussion about the school trip.", "Okul gezisi hakkında faydalı bir tartışma yaptık."),
    "disease": ("Clean water helps prevent this serious disease.", "Temiz su bu ciddi hastalığı önlemeye yardımcı olur."),
    "distance": ("The distance between the two villages is five kilometres.", "İki köy arasındaki mesafe beş kilometredir."),
    "document": ("Please sign the document at the bottom of the page.", "Lütfen belgeyi sayfanın alt kısmından imzalayın."),
    "driver": ("The bus driver waited for the elderly woman to sit down.", "Otobüs şoförü yaşlı kadının oturmasını bekledi."),
    "economy": ("Tourism is very important for the island's economy.", "Turizm adanın ekonomisi için çok önemlidir."),
    "effort": ("Passing the exam requires regular study and effort.", "Sınavı geçmek düzenli çalışma ve çaba gerektirir."),
    "electricity": ("The storm cut off electricity in several villages.", "Fırtına birkaç köyde elektriği kesti."),
    "emergency": ("Press the red button only in an emergency.", "Kırmızı düğmeye yalnızca acil durumda basın."),
    "employee": ("Every employee receives a security card on the first day.", "Her çalışan ilk gün bir güvenlik kartı alır."),
    "employer": ("A good employer cares about workplace safety.", "İyi bir işveren iş yeri güvenliğini önemser."),
    "energy": ("Solar panels turn sunlight into clean energy.", "Güneş panelleri güneş ışığını temiz enerjiye dönüştürür."),
    "engine": ("The mechanic checked the car engine before our trip.", "Tamirci yolculuğumuzdan önce araba motorunu kontrol etti."),
    "engineer": ("An electrical engineer designed the new lighting system.", "Yeni aydınlatma sistemini bir elektrik mühendisi tasarladı."),
    "equipment": ("All camping equipment is stored in the garage.", "Tüm kamp ekipmanı garajda saklanıyor."),
    "event": ("The music festival is the biggest event of the summer.", "Müzik festivali yazın en büyük etkinliğidir."),
    "examination": ("All students must be quiet during the written examination.", "Yazılı sınav sırasında tüm öğrenciler sessiz olmalıdır."),
    "example": ("Can you give me an example of an irregular verb?", "Bana düzensiz bir fiil örneği verebilir misin?"),
    "experiment": ("We did a simple water experiment in the science lab.", "Fen laboratuvarında basit bir su deneyi yaptık."),
    "explanation": ("Thank you for your clear explanation of the rules.", "Kurallara ilişkin net açıklamanız için teşekkür ederim."),
    "fact": ("It is a well-known fact that exercise improves health.", "Egzersizin sağlığı iyileştirdiği iyi bilinen bir gerçektir."),
    "factory": ("Five hundred people work at the shoe factory.", "Ayakkabı fabrikasında beş yüz kişi çalışıyor."),
    "furniture": ("They bought new wooden furniture for the living room.", "Oturma odası için yeni ahşap mobilya aldılar."),
    "government": ("The government plans to build more railways next year.", "Hükümet gelecek yıl daha fazla demir yolu inşa etmeyi planlıyor."),
    "health": ("Smoking is very harmful to your health.", "Sigara içmek sağlığınız için çok zararlıdır."),
    "information": ("For more information, please visit our website.", "Daha fazla bilgi için lütfen web sitemizi ziyaret edin."),
    "language": ("Spanish is a beautiful language to learn.", "İspanyolca öğrenmek için güzel bir dildir."),
    "passenger": ("Every passenger must wear a seat belt during the flight.", "Uçuş sırasında her yolcu emniyet kemeri takmalıdır."),
    "patience": ("Teaching young children requires a lot of patience.", "Küçük çocuklara ders öğretmek çok sabır gerektirir."),
    "population": ("The population of the town increases every summer.", "Kasabanın nüfusu her yaz artar."),
    "purpose": ("The main purpose of the meeting is to plan the budget.", "Toplantının ana amacı bütçeyi planlamaktır."),
    "relationship": ("She has a warm relationship with her cousins.", "Kuzenleriyle sıcak bir ilişkisi var."),

    # Sıfatlar (Adjectives - 59)
    "able": ("Will you be able to come to the picnic on Sunday?", "Pazar günü pikniğe gelebilecek misin?"),
    "afraid": ("My little brother is afraid of thunder.", "Küçük erkek kardeşim gök gürültüsünden korkar."),
    "alive": ("Thankfully, the climbers were found safe and alive.", "Şükürler olsun ki dağcılar sağ ve hayatta bulundu."),
    "amazing": ("We watched an amazing sunset from the hill.", "Tepeden harika bir gün batımı izledik."),
    "annoyed": ("She was annoyed because the bus arrived late.", "Otobüs geç geldiği için canı sıkılmıştı."),
    "anxious": ("Students often feel anxious before a big exam.", "Öğrenciler büyük bir sınavdan önce genellikle endişeli hisseder."),
    "attractive": ("The town centre has many attractive old houses.", "Şehir merkezinde pek çok çekici eski ev var."),
    "beautiful": ("There are beautiful flowers in my grandmother's garden.", "Anneannemin bahçesinde güzel çiçekler var."),
    "boring": ("The lecture was so boring that I nearly fell asleep.", "Ders o kadar sıkıcıydı ki neredeyse uyuyakalıyordum."),
    "busy": ("The post office is always busy on Monday mornings.", "Postane pazartesi sabahları her zaman yoğundur."),
    "common": ("Snow is very common in this mountain village.", "Bu dağ köyünde kar çok yaygındır."),
    "confused": ("I felt confused by the complicated street signs.", "Karmaşık sokak tabelaları yüzünden kafam karıştı."),
    "convenient": ("Is three o'clock a convenient time for you?", "Saat üç senin için uygun bir zaman mı?"),
    "creative": ("The art teacher encouraged students to be creative.", "Resim öğretmeni öğrencileri yaratıcı olmaya teşvik etti."),
    "crowded": ("The train is always crowded during rush hour.", "Tren işe gidiş geliş saatlerinde her zaman kalabalıktır."),
    "cultural": ("The city hosts many cultural events in spring.", "Şehir ilkbaharda birçok kültürel etkinliğe ev sahipliği yapar."),
    "dark": ("It gets dark very early in December.", "Aralık ayında hava çok erken kararır."),
    "dirty": ("Please take off your dirty boots outside the door.", "Lütfen kirli botlarını kapının dışında çıkar."),
    "disappointed": ("He was disappointed when the concert was cancelled.", "Konser iptal edildiğinde hayal kırıklığına uğradı."),
    "dry": ("Keep the flour in a cool and dry place.", "Unu serin ve kuru bir yerde saklayın."),
    "easy": ("The first question on the test was very easy.", "Testteki ilk soru çok kolaydı."),
    "educated": ("She is a well-educated woman who speaks three languages.", "Üç dil konuşan, iyi eğitimli bir kadındır."),
    "embarrassed": ("He felt embarrassed when he forgot her name.", "Onun adını unuttuğunda mahcup oldu."),
    "empty": ("There were several empty seats at the back of the hall.", "Salonun arkasında birkaç boş koltuk vardı."),
    "enjoyable": ("We spent an enjoyable evening with our old friends.", "Eski dostlarımızla keyifli bir akşam geçirdik."),
    "equal": ("Cut the watermelon into four equal parts.", "Karpuzu dört eşit parçaya kes."),
    "excellent": ("The small restaurant serves excellent fish soup.", "Küçük restoran mükemmel balık çorbası servis ediyor."),
    "excited": ("The children are excited about tomorrow's school trip.", "Çocuklar yarınki okul gezisi için heyecanlı."),
    "fast": ("High-speed trains are a fast way to travel between cities.", "Yüksek hızlı trenler şehirler arasında seyahat etmenin hızlı bir yoludur."),
    "fat": ("The cat became fat because it ate too much.", "Kedi çok fazla yediği için şişmanladı."),
    "favourite": ("Blue has always been my favourite colour.", "Mavi her zaman benim en sevdiğim renk olmuştur."),
    "final": ("What was the final score of the basketball match?", "Basketbol maçının son skoru neydi?"),
    "flat": ("Central Konya is famous for its wide, flat land.", "Orta Konya geniş ve düz arazisiyle ünlüdür."),
    "free": ("Museum entry is free for children under twelve.", "On iki yaş altı çocuklar için müze girişi ücretsizdir."),
    "fresh": ("We bought fresh bread from the bakery this morning.", "Bu sabah fırından taze ekmek aldık."),
    "friendly": ("The hotel staff were very friendly and polite.", "Otel personeli çok samimi ve nazikti."),
    "frightened": ("The puppy looked frightened during the thunderstorm.", "Yavru köpek fırtına sırasında korkmuş görünüyordu."),
    "full": ("Sorry, the car park is completely full today.", "Üzgünüm, otopark bugün tamamen dolu."),
    "funny": ("My uncle told us a funny story at dinner.", "Amcam akşam yemeğinde bize komik bir hikâye anlattı."),
    "generous": ("It was very generous of you to pay for lunch.", "Öğle yemeğini ödemen çok cömert bir davranıştı."),
    "gentle": ("Wash the wool sweater in warm water with gentle soap.", "Yün kazağı ılık suda yumuşak bir sabunla yıkayın."),
    "glad": ("I am really glad that you passed your driving test.", "Ehliyet sınavını geçtiğine gerçekten çok memnun oldum."),
    "good": ("Swimming is very good for your back muscles.", "Yüzmek sırt kasların için çok iyidir."),
    "great": ("We had a great time at the summer camp.", "Yaz kampında harika vakit geçirdik."),
    "guilty": ("He felt guilty about breaking his sister's mug.", "Kız kardeşinin kupasını kırdığı için kendini suçlu hissetti."),
    "happy": ("She looked very happy when she heard the good news.", "İyi haberi duyduğunda çok mutlu görünüyordu."),
    "hard": ("The ground was hard because of the winter frost.", "Kış donu yüzünden toprak sertti."),
    "heavy": ("This suitcase is too heavy for me to lift alone.", "Bu bavul tek başıma kaldıramayacağım kadar ağır."),
    "helpful": ("The tourist office gave us a helpful map of the city.", "Turizm ofisi bize şehrin faydalı bir haritasını verdi."),
    "honest": ("Thank you for giving me an honest answer.", "Bana dürüst bir cevap verdiğin için teşekkür ederim."),
    "horrible": ("The medicine had a horrible taste, but it worked.", "İlacın berbat bir tadı vardı ama işe yaradı."),
    "huge": ("A huge crowd gathered in the main square.", "Ana meydanda kocaman bir kalabalık toplandı."),
    "hungry": ("Are you hungry enough to eat a whole pizza?", "Bütün bir pizzayı yiyecek kadar aç mısın?"),
    "hurt": ("Fortunately, nobody was hurt in the minor traffic accident.", "Neyse ki küçük trafik kazasında kimse yaralanmadı."),
    "important": ("It is important to drink enough water every day.", "Her gün yeterince su içmek önemlidir."),
    "impossible": ("It is impossible to see the stars through these thick clouds.", "Bu kalın bulutların arasından yıldızları görmek imkansız."),
    "intelligent": ("Dolphins are known as very intelligent sea animals.", "Yunuslar çok zeki deniz hayvanları olarak bilinir."),
    "interested": ("My brother is interested in ancient history.", "Erkek kardeşim antik tarihe ilgi duyuyor."),
    "interesting": ("I watched an interesting documentary about bees last night.", "Dün gece arılar hakkında ilginç bir belgesel izledim."),
    "international": ("Istanbul has two large international airports.", "İstanbul'da iki büyük uluslararası havalimanı vardır."),

    # Edatlar (Prepositions - 5)
    "after": ("We went for a short walk after dinner.", "Akşam yemeğinden sonra kısa bir yürüyüşe çıktık."),
    "against": ("Put the ladder against the garden wall.", "Merdiveni bahçe duvarına karşı dayayın."),
    "among": ("We found a small wooden house among the pine trees.", "Çam ağaçlarının arasında küçük ahşap bir ev bulduk."),
    "before": ("Please wash your hands before the meal.", "Yemekten önce lütfen ellerinizi yıkayın."),
    "between": ("The pharmacy is between the bank and the post office.", "Eczane banka ile postanenin arasındadır."),

    # Zarflar (Adverbs - 41)
    "absolutely": ("You are absolutely right about the departure time.", "Kalkış saati konusunda kesinlikle haklısın."),
    "actually": ("He looks young, but he is actually forty years old.", "Genç görünüyor ama aslında kırk yaşında."),
    "again": ("If you do not succeed at first, try again.", "İlk seferde başarılı olamazsan tekrar dene."),
    "ago": ("The train left the station ten minutes ago.", "Tren istasyondan on dakika önce ayrıldı."),
    "already": ("I have already finished my maths homework.", "Matematik ödevimi çoktan bitirdim."),
    "also": ("She speaks English and she also knows some German.", "İngilizce konuşuyor ve ayrıca biraz Almanca biliyor."),
    "always": ("The sun always rises in the east.", "Güneş her zaman doğudan doğar."),
    "anywhere": ("I cannot find my glasses anywhere in the room.", "Odada gözlüklerimi hiçbir yerde bulamıyorum."),
    "apart": ("The two villages are only three kilometres apart.", "İki köy birbirinden yalnızca üç kilometre uzaktadır."),
    "away": ("The beach is only ten minutes away on foot.", "Plaj yürüyerek yalnızca on dakika uzaktadır."),
    "badly": ("Our team played badly in the first half of the match.", "Takımımız maçın ilk yarısında kötü bir şekilde oynadı."),
    "carefully": ("Please read the exam questions carefully before answering.", "Cevaplamadan önce lütfen sınav sorularını dikkatlice okuyun."),
    "certainly": ("This is certainly the best coffee in the neighbourhood.", "Bu kesinlikle mahalledeki en iyi kahve."),
    "clearly": ("She spoke clearly so the whole class could hear.", "Bütün sınıfın duyabilmesi için açıkça ve net konuştu."),
    "completely": ("I completely forgot that today is a public holiday.", "Bugünün resmi tatil olduğunu tamamen unuttum."),
    "directly": ("After the meeting, I went directly home.", "Toplantıdan sonra doğrudan eve gittim."),
    "easily": ("You can easily walk from the hotel to the museum.", "Otelden müzeye kolayca yürüyebilirsin."),
    "especially": ("The park is beautiful, especially in spring.", "Park özellikle ilkbaharda çok güzeldir."),
    "everywhere": ("We looked everywhere for the lost kitten.", "Kayıp yavru kediyi her yerde aradık."),
    "exactly": ("The film started at exactly eight o'clock.", "Film tam olarak saat sekizde başladı."),
    "finally": ("After waiting for an hour, the bus finally arrived.", "Bir saat bekledikten sonra otobüs sonunda geldi."),
    "hardly": ("My grandmother can hardly read without her glasses.", "Babaannem gözlükleri olmadan neredeyse hiç okuyamıyor."),
    "immediately": ("Please call an ambulance immediately.", "Lütfen hemen bir ambulans çağırın."),
    "instead": ("There was no tea left, so I drank water instead.", "Hiç çay kalmamıştı, bu yüzden yerine su içtim."),
    "loudly": ("Someone knocked loudly on the front door.", "Birisi ön kapıyı yüksek sesle çaldı."),
    "mainly": ("The island is visited mainly by families in summer.", "Ada yazın çoğunlukla aileler tarafından ziyaret edilir."),
    "naturally": ("She was naturally tired after the twelve-hour flight.", "On iki saatlik uçuştan sonra doğal olarak yorgundu."),
    "nearly": ("It took us nearly three hours to drive home.", "Eve arabayla dönmemiz neredeyse üç saat sürdü."),
    "normally": ("We normally have soup and salad for supper.", "Akşam yemeğinde normalde çorba ve salata yeriz."),
    "often": ("How often do you go swimming in the winter?", "Kışın ne sıklıkla yüzmeye gidersin?"),
    "possibly": ("Could you possibly help me carry this box?", "Acaba bu kutuyu taşımama yardım edebilir misin?"),
    "quickly": ("Walk quickly or we will miss the ferry.", "Hızlıca yürü yoksa vapuru kaçıracağız."),
    "quietly": ("Please close the door quietly because the baby is sleeping.", "Bebek uyuduğu için lütfen kapıyı sessizce kapat."),
    "rarely": ("He rarely eats sweet food after dinner.", "Akşam yemeğinden sonra nadiren tatlı yiyecekler yer."),
    "recently": ("Have you read any good books recently?", "Son zamanlarda iyi bir kitap okudun mu?"),
    "regularly": ("You should water these indoor plants regularly.", "Bu iç mekân bitkilerini düzenli olarak sulamalısın."),
    "seriously": ("Nobody took his joke seriously at first.", "İlk başta kimse onun şakasını ciddiye almadı."),
    "slowly": ("Please drive slowly near the primary school.", "İlkokulun yakınında lütfen yavaşça sürün."),
    "suddenly": ("The sky darkened and it suddenly began to rain.", "Gökyüzü karardı ve aniden yağmur yağmaya başladı."),
    "usually": ("I usually drink a glass of water when I wake up.", "Uyandığımda genellikle bir bardak su içerim."),
}


def can_blank_sentence(word: str, sentence: str) -> bool:
    s = (sentence or "").strip()
    w = (word or "").strip()
    if not s or not w:
        return False
    cands = [w]
    if len(w) > 4:
        cands.append(w[:-1])
    for c in cands:
        if re.search(r"\b" + re.escape(c) + r"\w*", s, flags=re.IGNORECASE):
            return True
    return False


def main():
    a2_path = DATA_DIR / "a2.json"
    b1_path = DATA_DIR / "b1.json"
    b2_path = DATA_DIR / "b2.json"

    a2 = json.loads(a2_path.read_text(encoding="utf-8"))
    b1 = json.loads(b1_path.read_text(encoding="utf-8"))
    b2 = json.loads(b2_path.read_text(encoding="utf-8"))

    assert len(a2) == 496 and len(b1) == 192 and len(b2) == 261

    # İlk 274 aktif A2 kelimesinin korunduğunu doğrula
    for i in range(274):
        assert not a2[i].get("isDraft"), f"Index {i} should be active!"

    activated_count = 0
    held_dup_list = []
    held_b1_list = []
    held_pos_list = []

    for i in range(274, len(a2)):
        rec = a2[i]
        w = rec["word"].strip()
        wl = w.lower()

        if wl in HELD_DUPLICATE:
            rec["isDraft"] = True
            rec["missingFields"] = ["exampleSentence", "exampleTranslation"]
            rec["reviewRequired"] = True
            rec["reviewNote"] = HELD_DUPLICATE[wl]
            held_dup_list.append(w)
        elif wl in HELD_CEFR_B1:
            rec["isDraft"] = True
            rec["missingFields"] = ["exampleSentence", "exampleTranslation"]
            rec["reviewRequired"] = True
            rec["reviewNote"] = HELD_CEFR_B1[wl]
            held_b1_list.append(w)
        elif wl in HELD_POS_MISMATCH:
            rec["isDraft"] = True
            rec["missingFields"] = ["exampleSentence", "exampleTranslation"]
            rec["reviewRequired"] = True
            rec["reviewNote"] = HELD_POS_MISMATCH[wl]
            held_pos_list.append(w)
        elif wl in VERIFIED_A2_COMPLETIONS:
            ex, tr = VERIFIED_A2_COMPLETIONS[wl]
            assert can_blank_sentence(w, ex), f"blankSentence failed for {w}: {ex}"
            assert re.search(r"\b" + re.escape(w) + r"\b", ex, flags=re.IGNORECASE), f"Exact base word missing in {w}: {ex}"
            rec["exampleSentence"] = ex
            rec["exampleTranslation"] = tr
            rec["isDraft"] = False
            if "missingFields" in rec:
                del rec["missingFields"]
            rec["reviewRequired"] = False
            rec["reviewNote"] = "A2 seviye, sözcük türü ve örnek cümle/çeviri uyumu doğrulandı."
            activated_count += 1
        else:
            raise ValueError(f"Unclassified draft word: {w}")

    a2_path.write_text(json.dumps(a2, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    active_a2 = sum(not x.get("isDraft") for x in a2)
    draft_a2 = sum(bool(x.get("isDraft")) for x in a2)

    print("=== 222 A2 TASLAK KELİME TAMAMLAMA ÖZETİ ===")
    print(f"  İncelenen taslak sayısı: 222")
    print(f"  Aktif hâle getirilen:    {activated_count}")
    print(f"  Tekrar nedeniyle bekletilen ({len(held_dup_list)}): {held_dup_list}")
    print(f"  CEFR (B1) nedeniyle bekletilen ({len(held_b1_list)}): {held_b1_list}")
    print(f"  Dil/POS hatası nedeniyle bekletilen ({len(held_pos_list)}): {held_pos_list}")
    print(f"  Güncel A2: {active_a2} aktif | {draft_a2} taslak (Toplam: {len(a2)})")
    print(f"  Güncel B1: {len(b1)} aktif | 0 taslak")
    print(f"  Güncel B2: {len(b2)} aktif | 0 taslak")
    print(f"  GENEL TOPLAM: {active_a2 + len(b1) + len(b2)} aktif | {draft_a2} taslak")


if __name__ == "__main__":
    main()
