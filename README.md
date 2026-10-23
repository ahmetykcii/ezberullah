# VELUNO — Daha akıllıca öğren, daha uzun süre hatırla.

A2 / B1 / B2 seviyelerinde İngilizce kelime öğrenme ve Grammar Academy platformu. Tamamen statik (HTML + CSS + JavaScript ES modülleri), sunucusuz, ücretsiz ve çevrimdışı çalışabilen bir PWA. Arayüz tamamen Türkçedir ve hem masaüstü (MacBook) hem de mobil (iPhone / Safari) ekranlar için optimize edilmiştir.

**Güncel Veri Tabanı:**
* **A2 (Temel Seviye):** 478 aktif kelime (+18 taslak) · 14 Grammar konusu
* **B1 (Orta Seviye):** 192 aktif kelime (+371 taslak) · 12 Grammar konusu
* **B2 (Orta Üstü Seviye):** 261 aktif kelime · 12 Grammar konusu
* **Toplam:** **931 aktif kelime**, **389 taslak kelime** (**1.320 toplam kayıt**) ve **38 Grammar konusu** (**3 aktif ders, 60 özgün soru**)

**Özellikler:** Hayrat açılış ekranı · Ana Sayfa (`VELUNO` + `ahmet ❤️ sude` özel imzası) · Açık (varsayılan), Koyu ve Otomatik (Cihaz Teması) 3'lü tema sistemi · 6 aşamalı öğrenme (Kelimeyi Öğren → Çoktan Seçmeli → Yazma → Eksik Harf → Cümlede Boşluk Doldurma → Cümlede Kullanma) · Grammar Academy (Türkçe konu anlatımları, formüller, sınav taktikleri ve 5 soruluk rastgele mini sınavlar) · Yeni / Öğreniliyor / Tekrar Edilecek / Kalıcı Öğrenilen havuzları · Aralıklı tekrar (1-3-7-14-30 gün SRS) · 0–100 hakimiyet puanı · Günlük hedef ve çalışma serisi · Akıllı Tekrar, Hızlı Tekrar, Yanlış Kelimeler, Yazma ve Dinleme Tekrarı · Sınavlar (Mini, 50, 100, Yanlış Kelimeler, Seviye Bitirme %80) · Kelime ekle/düzenle/sil + ücretsiz otomatik bilgi hazırlama · CSV/TXT/JSON/XLSX içe aktarma · JSON yedek/geri yükleme · İstatistikler + 365 günlük takvim · Karıştırılan Kelimeler · Sınav tarihine göre çalışma planı · Odak Modu · Klavye kısayolları · iPhone/Safari tam ekran PWA desteği.

## 1. Yerel Olarak Çalıştırma ve Testler

```bash
python3 -m http.server 8080
# Tarayıcıda: http://localhost:8080
```

Otomatik testleri çalıştırmak için (Node.js veya macOS yerleşik `jsc`):

```bash
node tests/run-tests.mjs
# veya macOS JavaScriptCore ile:
/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc -m tests/run-tests.mjs
```

## 2. GitHub Pages Üzerinde Yayınlama

1. GitHub üzerinde yeni bir depo oluşturun (ör. `veluno`).
2. Proje klasöründe aşağıdaki komutları çalıştırın:
   ```bash
   git init
   git add .
   git commit -m "VELUNO v3.0.0 yayın"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADINIZ/veluno.git
   git push -u origin main
   ```
3. GitHub deponuzda **Settings → Pages → Build and deployment** bölümünden **Source: Deploy from a branch**, **Branch: `main` / `/ (root)`** seçip **Save** butonuna tıklayın.
4. Birkaç dakika içinde uygulamanız `https://KULLANICI_ADINIZ.github.io/veluno/` adresinde ücretsiz olarak yayına girer.

## 3. iPhone (Safari) Ana Ekrana Ekleme

1. iPhone'da **Safari** ile yayın adresini açın.
2. Alt bardaki **Paylaş (Share)** simgesine dokunun.
3. **Ana Ekrana Ekle (Add to Home Screen)** seçeneğine dokunup **Ekle** deyin.
4. **VELUNO** özel ikonuyla tam ekran uygulama olarak açılır ve çevrimdışı çalışır.
