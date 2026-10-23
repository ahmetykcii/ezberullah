// VELUNO v4.3 — Firebase Public Client Configuration
// Bu dosya yalnızca istemci tarafı herkese açık yapılandırma bilgilerini içerir.
// GİZLİ YÖNETİCİ ANAHTARLARI VEYA SERVİS HESABI ŞİFRELERİ KESİNLİKLE BURAYA EKLENMEZ.

export const FIREBASE_CONFIG = {
  // 1) Firebase Console > Project Settings (Dişli) > General > Your Apps (Web </>) alanından kopyalayın:
  apiKey: "", // Örnek: "AIzaSyD-..."
  authDomain: "veluno-private.firebaseapp.com",
  projectId: "veluno-private",
  storageBucket: "veluno-private.appspot.com",
  messagingSenderId: "", // Örnek: "123456789012"
  appId: "" // Örnek: "1:123456789012:web:abcdef..."
};

// Yetkili UID listesi (Firebase Console > Authentication > Users tablosundan kopyalanır)
// Gerçek sunucu erişim kontrolü Firebase Sunucusundaki firestore.rules kuralları ile sağlanır.
export const AUTHORIZED_UIDS = {
  AHMET: "AHMET_FIREBASE_UID_BURAYA", // Firebase Console'daki Ahmet kullanıcısının User UID'si
  SUDE: "SUDE_FIREBASE_UID_BURAYA"    // Firebase Console'daki Sude kullanıcısının User UID'si
};

export function isFirebaseConfigured() {
  return Boolean(
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.projectId &&
    FIREBASE_CONFIG.apiKey.trim() !== ""
  );
}

export function isSudeUid(uid) {
  return Boolean(uid && uid === AUTHORIZED_UIDS.SUDE && uid !== "SUDE_FIREBASE_UID_BURAYA");
}

export function isAhmetUid(uid) {
  return Boolean(uid && uid === AUTHORIZED_UIDS.AHMET && uid !== "AHMET_FIREBASE_UID_BURAYA");
}

export function isAuthorizedUid(uid) {
  return isSudeUid(uid) || isAhmetUid(uid);
}
