// VELUNO v4.3 — Authentication & Session Management
// Sadece Ahmet ve Sude için özel hesap oturumu. Normal kullanıcılar misafir olarak çalışır.

import { FIREBASE_CONFIG, AUTHORIZED_UIDS, isFirebaseConfigured, isSudeUid, isAhmetUid, isAuthorizedUid } from './firebase-config.js';

const SESSION_SURPRISE_KEY = 'veluno_surprise_seen_session';
const AUTH_STATE_KEY = 'veluno_cached_auth_state';

let currentUser = null;
let authInstance = null;
let isInitialized = false;
const authListeners = new Set();

/* ---------- Oturum ve Sürpriz Takibi ---------- */
export function hasSeenSurpriseThisSession() {
  try {
    return typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_SURPRISE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markSurpriseSeen() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_SURPRISE_KEY, 'true');
    }
  } catch {}
}

export function resetSurpriseSession() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(SESSION_SURPRISE_KEY);
    }
  } catch {}
}

/* ---------- Kullanıcı Bilgisi ve Yetki Kontrolleri ---------- */
export function getCurrentUser() {
  return currentUser;
}

export function isLoggedIn() {
  return Boolean(currentUser && currentUser.uid);
}

export function isSude() {
  return Boolean(currentUser && isSudeUid(currentUser.uid));
}

export function isAhmet() {
  return Boolean(currentUser && isAhmetUid(currentUser.uid));
}

export function isAuthorizedUser() {
  return Boolean(currentUser && isAuthorizedUid(currentUser.uid));
}

export function onAuthStateChanged(fn) {
  if (typeof fn === 'function') {
    authListeners.add(fn);
    fn(currentUser);
  }
  return () => authListeners.delete(fn);
}

function notifyListeners() {
  authListeners.forEach((fn) => {
    try { fn(currentUser); } catch {}
  });
}

/* ---------- Firebase Entegrasyonu & Güvenli Oturum Başlatma ---------- */
export async function ensureFirebaseSdk() {
  if (typeof window === 'undefined') return false;
  if (window.firebase && window.firebase.auth && window.firebase.firestore) return true;

  return new Promise((resolve) => {
    const loadScript = (src) => new Promise((res, rej) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') return res();
        existing.addEventListener('load', () => res());
        existing.addEventListener('error', () => rej());
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => { s.dataset.loaded = 'true'; res(); };
      s.onerror = rej;
      document.head.appendChild(s);
    });

    loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js')
      .then(() => Promise.all([
        loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js'),
        loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js')
      ]))
      .then(() => resolve(true))
      .catch((err) => {
        console.warn('Firebase SDK yüklenemedi:', err?.message || err);
        resolve(false);
      });
  });
}

export async function initAuth() {
  if (isInitialized) return { ready: true, configured: isFirebaseConfigured(), user: currentUser };

  // Çevrimdışı / tarayıcı dışı ortam kontrolü (JSC, Node testleri)
  if (typeof window === 'undefined' || !isFirebaseConfigured()) {
    isInitialized = true;
    return { ready: true, configured: false, user: null };
  }

  isInitialized = true;

  try {
    const sdkReady = await ensureFirebaseSdk();
    if (sdkReady && window.firebase && window.firebase.auth) {
      if (!window.firebase.apps || !window.firebase.apps.length) {
        window.firebase.initializeApp(FIREBASE_CONFIG);
      }
      authInstance = window.firebase.auth();
      authInstance.onAuthStateChanged((user) => {
        handleFirebaseUser(user);
      });
      return { ready: true, configured: true, user: currentUser };
    }
  } catch (err) {
    // Firebase bağlantısı kurulamazsa normal VELUNO asla aksamaz
    console.warn('Firebase başlatılamadı (çevrimdışı mod):', err?.message || err);
  }

  return { ready: true, configured: isFirebaseConfigured(), user: null };
}

function handleFirebaseUser(fbUser) {
  if (!fbUser) {
    currentUser = null;
    notifyListeners();
    return;
  }

  currentUser = {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName || (isSudeUid(fbUser.uid) ? 'Sude' : (isAhmetUid(fbUser.uid) ? 'Ahmet' : 'Kullanıcı')),
    isSude: isSudeUid(fbUser.uid),
    isAhmet: isAhmetUid(fbUser.uid),
    isAuthorized: isAuthorizedUid(fbUser.uid)
  };

  notifyListeners();
}

/* ---------- Giriş ve Çıkış İşlemleri ---------- */
export async function login(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Lütfen e-posta ve şifrenizi girin.' };
  }

  // Firebase yapılandırılmamışsa
  if (!isFirebaseConfigured()) {
    return {
      success: false,
      error: 'Firebase yapılandırması henüz tamamlanmadı. Lütfen firebase-config.js dosyasını kontrol edin.'
    };
  }

  try {
    if (!authInstance && typeof window !== 'undefined') {
      await ensureFirebaseSdk();
      if (window.firebase && window.firebase.auth) {
        if (!window.firebase.apps || !window.firebase.apps.length) {
          window.firebase.initializeApp(FIREBASE_CONFIG);
        }
        authInstance = window.firebase.auth();
      }
    }

    if (authInstance && authInstance.signInWithEmailAndPassword) {
      const cred = await authInstance.signInWithEmailAndPassword(email.trim(), password);
      handleFirebaseUser(cred.user);

      // Sude her yeni başarılı girişinde sürprizi görür
      if (isSudeUid(cred.user.uid)) {
        resetSurpriseSession();
      }

      return { success: true, user: currentUser };
    }
    return { success: false, error: 'Kimlik doğrulama servisine bağlanılamadı. İnternet bağlantınızı kontrol edin.' };
  } catch (err) {
    let msg = 'Giriş yapılamadı.';
    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      msg = 'E-posta veya şifre hatalı.';
    } else if (err.code === 'auth/network-request-failed') {
      msg = 'Ağ bağlantısı başarısız. Lütfen internetinizi kontrol edin.';
    } else if (err.code === 'auth/too-many-requests') {
      msg = 'Çok fazla başarısız deneme. Lütfen bir süre sonra tekrar deneyin.';
    } else if (err.code === 'auth/invalid-api-key' || err.message?.includes('API key not valid') || err.message?.includes('API_KEY_INVALID')) {
      msg = 'Firebase API anahtarı geçersiz. Lütfen Firebase Console > Proje Ayarları altındaki Web API Key değerini kontrol edin.';
    }
    return { success: false, error: msg };
  }
}

export async function logout() {
  resetSurpriseSession();
  currentUser = null;
  if (authInstance && authInstance.signOut) {
    try { await authInstance.signOut(); } catch {}
  }
  notifyListeners();
  return { success: true };
}

/* ---------- Test ve Mock Yardımcıları (Yalnızca Test Ortamı İçin) ---------- */
export function _setMockUserForTesting(user) {
  currentUser = user ? {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'Kullanıcı',
    isSude: isSudeUid(user.uid),
    isAhmet: isAhmetUid(user.uid),
    isAuthorized: isAuthorizedUid(user.uid)
  } : null;
  notifyListeners();
}

export function _resetForTesting() {
  currentUser = null;
  resetSurpriseSession();
  authListeners.clear();
  isInitialized = false;
}

/* ---------- Firebase Bağlantı ve Erişim Güvenliği Tanılama Aracı ---------- */
export async function testFirebaseAccess() {
  const result = {
    configured: isFirebaseConfigured(),
    project: FIREBASE_CONFIG.projectId || '(tanımsız)',
    currentUser: currentUser ? {
      uid: currentUser.uid,
      email: currentUser.email,
      role: currentUser.isSude ? 'Sude ❤️' : (currentUser.isAhmet ? 'Ahmet (Yönetici) 👑' : 'Yetkisiz Kullanıcı')
    } : null,
    tests: []
  };

  if (!result.configured) {
    result.tests.push({
      id: 'config',
      target: 'Firebase Yapılandırması',
      status: 'MISSING_CONFIG',
      success: false,
      message: 'firebase-config.js içinde apiKey henüz girilmemiş.'
    });
    return result;
  }

  if (typeof window === 'undefined') {
    result.tests.push({
      id: 'env',
      target: 'Çalışma Ortamı',
      status: 'NON_BROWSER',
      success: false,
      message: 'Bu test yalnızca tarayıcı ortamında çalışır.'
    });
    return result;
  }

  await ensureFirebaseSdk();

  if (!window.firebase || !window.firebase.firestore) {
    result.tests.push({
      id: 'sdk',
      target: 'Firebase SDK',
      status: 'SDK_ERROR',
      success: false,
      message: 'Firebase SDK yüklenemedi. İnternet bağlantınızı kontrol edin.'
    });
    return result;
  }

  const db = window.firebase.firestore();

  // Test 1: Sude Özel Mesajı (private/sude) Okuma Testi
  try {
    const doc = await db.collection('private').doc('sude').get();
    result.tests.push({
      id: 'message',
      target: 'private/sude (Özel Mesaj)',
      status: 'ALLOWED',
      success: true,
      exists: doc.exists,
      message: doc.exists
        ? 'Mesaj belgesi başarıyla okundu (Erişim Yetkili).'
        : 'Okuma yetkisi ONAYLANDI (Belge Firestore\'da henüz oluşturulmamış, güvenlik kuralı izin veriyor).'
    });
  } catch (err) {
    const isApiKeyError = err.message?.includes('API key not valid') || err.message?.includes('API_KEY_INVALID') || err.code === 'auth/invalid-api-key';
    const isDenied = err.code === 'permission-denied';
    result.tests.push({
      id: 'message',
      target: 'private/sude (Özel Mesaj)',
      status: isApiKeyError ? 'INVALID_API_KEY' : (isDenied ? 'DENIED' : 'ERROR'),
      success: false,
      message: isApiKeyError
        ? 'Firebase API anahtarı geçersiz (Google API_KEY_INVALID). Lütfen Console > Proje Ayarları altındaki Web API Key değerini kontrol edin.'
        : (isDenied
          ? 'Erişim Güvenlik Kuralı Tarafından Engellendi (DENIED - Yabancılar İçeriği Göremez).'
          : `Hata: ${err.message}`)
    });
  }

  // Test 2: Sude Özel Fotoğrafı (private/sudePhoto) Okuma Testi
  try {
    const pdoc = await db.collection('private').doc('sudePhoto').get();
    result.tests.push({
      id: 'photo',
      target: 'private/sudePhoto (Özel Fotoğraf)',
      status: 'ALLOWED',
      success: true,
      exists: pdoc.exists,
      message: pdoc.exists
        ? 'Fotoğraf belgesi başarıyla okundu (Erişim Yetkili).'
        : 'Okuma yetkisi ONAYLANDI (Belge Firestore\'da henüz oluşturulmamış, güvenlik kuralı izin veriyor).'
    });
  } catch (err) {
    const isApiKeyError = err.message?.includes('API key not valid') || err.message?.includes('API_KEY_INVALID') || err.code === 'auth/invalid-api-key';
    const isDenied = err.code === 'permission-denied';
    result.tests.push({
      id: 'photo',
      target: 'private/sudePhoto (Özel Fotoğraf)',
      status: isApiKeyError ? 'INVALID_API_KEY' : (isDenied ? 'DENIED' : 'ERROR'),
      success: false,
      message: isApiKeyError
        ? 'Firebase API anahtarı geçersiz (Google API_KEY_INVALID). Lütfen Console > Proje Ayarları altındaki Web API Key değerini kontrol edin.'
        : (isDenied
          ? 'Erişim Güvenlik Kuralı Tarafından Engellendi (DENIED - Yabancılar Fotoğrafı Göremez).'
          : `Hata: ${err.message}`)
    });
  }

  // Konsolda şık ve renkli rapor
  if (typeof console !== 'undefined' && console.group) {
    console.group('🔍 VELUNO Firebase Erişim Tanılama Raporu');
    console.log('Proje:', result.project);
    console.log('Kullanıcı:', result.currentUser || 'Giriş yapılmamış (Misafir)');
    result.tests.forEach(t => {
      const icon = t.status === 'ALLOWED' ? '✅' : (t.status === 'DENIED' ? '🔒' : '⚠️');
      console.log(`${icon} [${t.status}] ${t.target}: ${t.message}`);
    });
    console.groupEnd();
  }

  return result;
}

if (typeof window !== 'undefined') {
  window.testFirebaseAccess = testFirebaseAccess;
}

