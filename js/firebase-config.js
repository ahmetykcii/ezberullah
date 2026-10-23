// VELUNO v4.3 — Firebase Public Client Configuration
// Bu dosya yalnızca istemci tarafı herkese açık yapılandırma bilgilerini içerir.
// GİZLİ YÖNETİCİ ANAHTARLARI VEYA SERVİS HESABI ŞİFRELERİ KESİNLİKLE BURAYA EKLENMEZ.

export const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Yetkili UID listesi (Firebase Console'dan alınan gerçek UID'ler buraya girilir)
// Gerçek erişim kontrolü Firebase Sunucusu üzerindeki Storage ve Firestore Güvenlik Kuralları ile sağlanır.
export const AUTHORIZED_UIDS = {
  AHMET: "AHMET_FIREBASE_UID_BURAYA",
  SUDE: "SUDE_FIREBASE_UID_BURAYA"
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
