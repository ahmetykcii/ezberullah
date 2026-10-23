# VELUNO v4.3 — "Just For You ❤️" Firebase Kurulum Kılavuzu

Bu kılavuz, Sude için hazırlanan özel romantik sürprizin Firebase altyapısını 5 adımda güvenli şekilde kurmanızı sağlar.

---

### Güvenlik İlkesi
* Sude'nin fotoğrafı ve romantik mesaj **asla GitHub deposuna yüklenmez**.
* Fotoğraf **Firebase Storage**, mesaj **Firestore Database** üzerinde barındırılır.
* Gerçek güvenlik istemci kodunda değil, **Firebase Sunucu Güvenlik Kuralları** (`storage.rules` ve `firestore.rules`) ile sağlanır.
* Yalnızca Ahmet ve Sude'nin gerçek Firebase `UID` değerleri izinlidir; diğer tüm istekler sunucuda engellenir.

---

### Adım 1: Firebase Projesi Oluşturma
1. [Firebase Console](https://console.firebase.google.com/) adresine gidin.
2. **Proje Ekle**'ye tıklayın ve projeye isim verin (örn. `veluno-love`).
3. Google Analytics'i isteğe bağlı olarak açabilir veya kapatabilirsiniz.
4. Projenin oluşturulmasını bekleyin.

---

### Adım 2: Authentication (Kimlik Doğrulama) Etkinleştirme
1. Sol menüden **Build > Authentication** bölümüne gidin.
2. **Get Started**'a tıklayın.
3. **Sign-in method** sekmesinden **Email/Password** seçeneğini bulun ve etkinleştirin (**Enable**).
4. **Users** sekmesine gidin ve **Add user** diyerek yalnızca iki hesap oluşturun:
   - Ahmet için hesap (örn: `ahmet@veluno.app`) ve güçlü bir şifre
   - Sude için hesap (örn: `sude@veluno.app`) ve güçlü bir şifre
5. Oluşturulan her iki kullanıcının **User UID** değerini kopyalayın.

---

### Adım 3: İstemci Yapılandırması (`js/firebase-config.js`)
1. Firebase Console > **Project Settings** (dişli çark) > **General** sekmesine gidin.
2. **Your apps** bölümünden **Web (</>)** ikonuna tıklayın ve uygulamanızı kaydedin.
3. Ekrana gelen `firebaseConfig` nesnesindeki bilgileri projedeki [`js/firebase-config.js`](../js/firebase-config.js) dosyasına yapıştırın:
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
     AHMET: "AHMET_KOPYALANAN_GERCEK_UID",
     SUDE: "SUDE_KOPYALANAN_GERCEK_UID"
   };
   ```

---

### Adım 4: Storage ve Firestore Güvenlik Kuralları
1. **Firebase Storage:**
   - Sol menüden **Build > Storage** sekmesine gidin, **Get Started** deyin.
   - **Rules** sekmesine gelin ve projedeki [`firebase/storage.rules`](./storage.rules) içeriğini yapıştırın.
   - `AHMET_FIREBASE_UID_BURAYA` ve `SUDE_FIREBASE_UID_BURAYA` alanlarına 2. Adımda aldığınız gerçek UID'leri yazın.
   - **Publish** butonuna basarak kuralları yayınlayın.
   - **Files** sekmesine gelin, `private/sude/` klasörü açıp Sude ile özel fotoğrafınızı `photo.jpg` adıyla buraya yükleyin.

2. **Cloud Firestore:**
   - Sol menüden **Build > Firestore Database** sekmesine gidin, **Create database** deyin.
   - **Rules** sekmesine gelin ve [`firebase/firestore.rules`](./firestore.rules) içeriğini yapıştırın (UID'leri yazarak).
   - **Publish** butonuna basın.
   - **Data** sekmesine gelin, `private` koleksiyonu altında `sude` adında bir belge oluşturun ve içine şu alanı ekleyin:
     - `message` (string): Sude'ye özel romantik mesajınız.

---

### Adım 5: Doğrulama ve Test
1. Ahmet hesabıyla giriş yapın:
   - Normal VELUNO ana sayfasını görürsünüz.
   - Sayfada veya Ayarlar'da **Sürprizi Önizle ❤️** seçeneği açılır.
2. Sude hesabıyla giriş yapın:
   - Sude doğrudan **Just For You ❤️** karşılama ekranına yönlendirilir.
   - **Sürprizini Aç ❤️** butonuna basıldığında fotoğraf, mesaj ve müzik açılır.
   - **VELUNO'ya Devam Et** dediğinde normal uygulamaya geçer ve sayfa yenilemelerinde sürpriz zorla tekrar açılmaz.
