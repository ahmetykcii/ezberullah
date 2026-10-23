# VELUNO — Kelime Veri Tabanı Kaynakları ve Lisans Belgesi

Bu belge, VELUNO kelime veri tabanının oluşturulmasında ve genişletilmesinde başvurulan kaynakları, lisans doğrulama durumlarını ve telif ilkelerini şeffaf biçimde belgeler.

---

## 1. Telif ve Özgünlük İlkeleri

* **Telifli sözlük tanımları ve örnekleri kopyalanmaz:** Oxford 3000/5000, Cambridge English Vocabulary Profile (EVP), Longman Communication 3000 veya Macmillan gibi ticari ve telif koruması altındaki sözlüklerin İngilizce tanımları, ses kayıtları ve telifli örnek cümleleri **kopyalanmamıştır**.
* **Özgün içerik üretimi:** Veri tabanındaki aktif kelimelerin **İngilizce örnek cümleleri**, **örnek cümlelerin Türkçe çevirileri**, **eşdizimler (collocations)** ve **kelime ailesi** verileri VELUNO projesi için özgün olarak hazırlanmıştır.
* **Doğrulanmamış veri uydurulmaz:** IPA fonetik telaffuzları harici bir telifli sözlükten kopyalamamak ve hatalı fonetik üretmemek adına `pronunciation` alanı boş (`""`) bırakılmıştır; seslendirme tarayıcının yerleşik `Web Speech API` sentezleyicisi ile yapılır.

---

## 2. Kaynak ve Lisans Doğrulama Durumu (Şeffaflık Raporu)

Aşağıda referans alınan açık kelime listelerinin lisans durumları, **doğrudan doğrulanabilen** ve **doğrudan doğrulanamayan / kısmen doğrulanan** yönleriyle açıkça belirtilmiştir:

### 2.1. New General Service List (NGSL v1.2) ve New Academic Word List (NAWL v1.0)
* **Yazarlar:** Dr. Charles Browne, Brent Culligan, Joseph Phillips (2013)
* **Kaynak URL:** https://www.newgeneralservicelist.com
* **Lisans Durumu (Doğrulandı — CC BY-SA 4.0):** Resmi NGSL ve NAWL sayfalarında listelerin **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)** lisansı altında sunulduğu doğrulanmıştır. Bu lisans, yazarlara atıf yapılması ve türetilen kelime listelerinin aynı lisansla paylaşılması koşuluyla ticari ve eğitsel kullanıma izin verir.
* **Sınırlılık / Doğrulama Notu:** Bu geliştirme ortamında resmi NGSL 1.2 CSV/XLSX dosyası yerel olarak indirilip kelime-kelime otomatik çapraz eşleştirme yapılmamıştır. NGSL genel sıklık çerçevesi referans alınmış olmakla birlikte, A2 seviyesindeki somut günlük yaşam kelimeleri (ör. *astronaut, camel, helmet, toothbrush/brush*) genel CEFR A2 müfredatına uygun olarak VELUNO için derlenmiştir.
* **Atıf (Citation):**
  > Browne, C., Culligan, B., & Phillips, J. (2013). *The New General Service List*. Retrieved from https://www.newgeneralservicelist.com

### 2.2. CEFR-J Wordlist (Version 1.6)
* **Yazarlar:** Prof. Yukio Tono ve Tono Laboratory, Tokyo University of Foreign Studies (TUFS)
* **Kaynak URL:** http://www.cefr-j.org
* **Lisans Durumu (Kısmen Kontrol Edildi — Birincil Hukuki Metin Doğrudan Doğrulanamadı):**
  * Açık dil profili depolarında (ör. `openlanguageprofiles/olp-en-cefrj`) CEFR-J kelime listesinin kaynak gösterilerek araştırma ve ticari/eğitsel amaçlarla kullanılabildiği belirtilmektedir.
  * **Önemli Şeffaflık Notu:** Birincil `http://www.cefr-j.org` sitesindeki resmi kullanım koşullarının (Terms of Use) tam hukuki metni bu çevrimdışı/kum havuzu çalışma ortamında doğrudan indirilip incelenememiştir ve yerel bir CEFR-J v1.6 resmi tablosu üzerinden otomatik seviye eşleştirmesi yapılmamıştır. Bu nedenle CEFR-J lisansı **"kesin doğrulanmış açık lisans"** olarak değil, **"ikincil kaynaklardan kontrol edilmiş, birincil lisans metni manuel doğrulama gerektiren referans"** olarak kabul edilmelidir.

### 2.3. Kullanıcı Tarafından Sağlanan A2 / B1 PDF Kelime Paketleri ve Yayın Hakları Uyarısı
* Kullanıcı tarafından sağlanan A2 ve B1 çalışma PDF'lerinden alınan aday kelimelerde **İngilizce sözlük tanımları (definitions) veri tabanına kesinlikle dahil edilmemiştir**.
* Tekil İngilizce kelimeler (headwords) ve temel Türkçe karşılıkları dilin genel söz varlığına aittir; ancak üçüncü taraf bir yayınevinin (ör. Oxford University Press) özel seçki sırası, marka adı ("Oxford 3000" vb.) veya özgün sözlük tanımları telif/marka hakkına tabi olabilir. Bu nedenle uygulama arayüzünde herhangi bir ticari sözlük markası kullanılmamış ve tüm örnek cümleler özgün olarak yazılmıştır.

---

## 3. VELUNO Veri Kaynağı Etiketlemesi

* CEFR seviye sınırında (A2–B1) bulunan, örnek cümlesi henüz tamamlanmamış veya inceleme gerektiren 389 kayıt (`A2: 18`, `B1: 371`) `isDraft: true`, `reviewRequired: true` ve `reviewNote` alanlarıyla işaretlenerek aktif öğrenme/sınav döngüsünden ayrı tutulmuştur.
