// VELUNO v4.3 — Firebase Public Client Configuration
// Bu dosya yalnızca istemci tarafı herkese açık yapılandırma bilgilerini içerir.
// GİZLİ YÖNETİCİ ANAHTARLARI VEYA SERVİS HESABI ŞİFRELERİ KESİNLİKLE BURAYA EKLENMEZ.

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAWfIEIlRjOygfTUOctAsoVodCazyDYvQK",
  authDomain: "veluno-private.firebaseapp.com",
  projectId: "veluno-private",
  storageBucket: "veluno-private.firebasestorage.app",
  messagingSenderId: "1027705472722",
  appId: "1:1027705472722:web:27b641f3ff01daea160f0b",
  measurementId: "G-2VG83RQNGX"
};

// Yetkili Firebase UID değerleri
// Gerçek sunucu erişim kontrolü Firebase Sunucusundaki firestore.rules kuralları ile sağlanır.
export const AUTHORIZED_UIDS = {
  AHMET: "abtxapEdixd96LgSRo9ZufW6RB82",
  SUDE: "8wjsLQS03fgOH7EuptJA5mJDqTn2"
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
