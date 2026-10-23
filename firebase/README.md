# VELUNO v4.3 — "Just For You ❤️" Güvenli Firebase Kurulum Kılavuzu
### (100% Ücretsiz Firebase Spark Planı — Blaze Gerekmez)

Bu kılavuz, Sude için hazırlanan özel romantik sürprizin Firebase altyapısını **tamamen ücretsiz Firebase Spark planı** ile kurmanızı sağlar.

---

### Mimarinin Temeli: Neden Cloud Firestore?
* **Blaze Planı Zorunluluğu Yoktur:** Firebase Storage artık Blaze (ücretli/kredi kartı) planı gerektirdiği için Storage kullanılmaz.
* **100% Ücretsiz Spark Limiti:** Firestore ücretsiz planda 1 GB depolama ve günlük 50.000 okuma hakkı sunar.
* **Belge Boyutu Uyumu:** Cloud Firestore'da tek bir belgenin boyutu en fazla 1 MiB (1.048.576 bayt) olabilir. 200–400 KB boyutunda WebP formatında optimize edilen fotoğraf, Base64 kodlamasıyla ~270–540 KB yer kaplar ve 1 MiB limitinin oldukça altında güvenle çalışır.
* **Sıfır İstemci İzi:** Fotoğraf ve mesaj GitHub deposunda, HTML, JS veya CSS içinde asla yer almaz. Yalnızca yetkili oturum açıldığında Firestore'dan belleğe çekilir ve anlık Data URL olarak gösterilir.

---

### Adım 1: Firebase Projesi Oluşturma
1. [Firebase Console](https://console.firebase.google.com/) adresine gidin.
2. **Proje Ekle**'ye tıklayın (örn: `veluno-love`).
3. Google Analytics'i isteğe bağlı açın veya kapatın. Projeyi oluşturun.
4. Planın varsayılan **Spark (Ücretsiz / No-cost)** planında olduğundan emin olun. Kredi kartı eklemenize gerek yoktur.

---

### Adım 2: Authentication (Kimlik Doğrulama) Etkinleştirme
1. Sol menüden **Build > Authentication** bölümüne gidin.
2. **Get Started**'a tıklayın.
3. **Sign-in method** sekmesinden **Email/Password** seçeneğini etkinleştirin (**Enable**).
4. **Users** sekmesine gidin ve **Add user** ile iki hesap oluşturun:
   - Ahmet için hesap (örn: `ahmet@veluno.app`) ve güçlü bir şifre
   - Sude için hesap (örn: `sude@veluno.app`) ve güçlü bir şifre
5. Oluşturulan kullanıcıların tablodaki **User UID** değerlerini kopyalayın.

---

### Adım 3: Fotoğrafı WebP ve Base64 Biçimine Dönüştürme
Fotoğrafın Firestore'a eklenebilmesi için WebP biçiminde (200–400 KB) ve Base64 metni olarak hazırlanması gerekir:

1. **WebP'ye Dönüştürme:**
   - Web aracı ile: [Squoosh.app](https://squoosh.app) üzerinden görseli yükleyin, formatı **WebP** seçin, kaliteyi dosya boyutu ~250–350 KB olacak şekilde ayarlayın ve indirin (`photo.webp`).
   - veya Terminal ile:
     ```bash
     cwebp -q 82 ozel_fotografiniz.jpg -o photo.webp
     ```

2. **Base64 Metnine Dönüştürme:**
   - **macOS / Linux:**
     ```bash
     base64 -i photo.webp | tr -d '\n' > photo_base64.txt
     ```
   - **Windows PowerShell:**
     ```powershell
     [Convert]::ToBase64String([IO.File]::ReadAllBytes("photo.webp")) | Out-File -Encoding ascii photo_base64.txt
     ```
   - Çıkan `photo_base64.txt` dosyasındaki metin tek parça Base64 dizisidir (yaklaşık 300–500 bin karakter).

---

### Adım 4: Cloud Firestore Verilerini Oluşturma
1. Firebase Console sol menüsünden **Build > Firestore Database** bölümüne gidin.
2. **Create database** butonuna tıklayın, sunucu konumunu seçin (örn. `europe-west3` veya `eur3`).
3. **Data** sekmesinde:
   - **Start collection**'a tıklayın, Koleksiyon Kimliği olarak `private` yazın.
   - Belge Kimliği (Document ID) olarak `sudePhoto` yazın.
   - Alanları ekleyin:
     * `imageBase64` (string): `photo_base64.txt` içindeki Base64 metnini buraya yapıştırın.
     * `mimeType` (string): `image/webp`
     * `updatedAt` (string veya timestamp): örn. `2026-10-23T17:00:00Z`
   - **Save** diyerek kaydedin.
4. Aynı `private` koleksiyonu içine ikinci belgeyi ekleyin (**Add document**):
   - Belge Kimliği (Document ID): `sude`
   - Alanları ekleyin:
     * `message` (string): Sude'ye özel romantik mesajınız (paragraflar ve emojiler desteklenir).
     * `updatedAt` (string veya timestamp): örn. `2026-10-23T17:00:00Z`
   - **Save** diyerek kaydedin.

---

### Adım 5: Güvenlik Kurallarını Yayına Alma
1. **Firestore Güvenlik Kuralları:**
   - Sol menüden **Firestore Database > Rules** sekmesine gidin.
   - Projedeki [`firebase/firestore.rules`](./firestore.rules) dosyasının içeriğini yapıştırın.
   - `AHMET_FIREBASE_UID_BURAYA` ve `SUDE_FIREBASE_UID_BURAYA` alanlarına 2. Adımda kopyaladığınız gerçek UID'leri yazın.
   - **Publish** butonuna basarak kuralları aktif edin.
   - *Not:* İstemci tarafı tüm yazma işlemleri (`allow write: if false;`) engellenmiştir. Fotoğraf ve mesaj yalnızca Firebase Console üzerinden güncellenebilir.

2. **Storage Güvenlik Kuralları (Kilit):**
   - Sol menüden **Storage > Rules** sekmesine gidin.
   - [`firebase/storage.rules`](./storage.rules) içeriğini yapıştırıp **Publish** deyin (Storage kapalıdır).

---

### Adım 6: İstemci Yapılandırması (`js/firebase-config.js`)
1. Firebase Console sol üstündeki **Project Settings** (dişli simgesi) > **General** sekmesine gidin.
2. **Your apps** bölümünden Web ikonuna (**</>**) tıklayıp bir uygulama adı verin ve kaydedin.
3. Size verilen `firebaseConfig` bilgilerini projedeki [`js/firebase-config.js`](../js/firebase-config.js) dosyasına yapıştırın:
   ```javascript
   export const FIREBASE_CONFIG = {
     apiKey: "AIzaSy...",
     authDomain: "veluno-love.firebaseapp.com",
     projectId: "veluno-love",
     storageBucket: "veluno-love.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };

   export const AUTHORIZED_UIDS = {
     AHMET: "AHMET_GERCEK_UID",
     SUDE: "SUDE_GERCEK_UID"
   };
   ```

---

### Test ve Doğrulama
* **Ahmet Hesabı:** Giriş yapıldığında ana sayfa açılır; menüde veya Ayarlar'da **Sürprizi Önizle ❤️** seçeneği belirir.
* **Sude Hesabı:** Giriş yapıldığında doğrudan **Just For You ❤️** ekranı karşılar. **Sürprizini Aç ❤️** tıklandığında Firestore'dan fotoğraf ve mesaj yüklenir, müzik çalmaya hazır hâle gelir.
* **Misafir / Çevrimdışı:** Giriş yapılmadığında veya Firebase yapılandırılmadığında VELUNO'nun 2.024 kelimesi, 38 Grammar Academy konusu ve tüm özellikleri %100 sorunsuz ve çevrimdışı çalışmaya devam eder.
