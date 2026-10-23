// VELUNO v4.3 — "Just For You ❤️" Private Romantic Surprise Screen
// Apple benzeri zarif, pastel pembe/lavanta tonlarında, süzülen kalpler ve güvenli içerik mimarisi.

import { getCurrentUser, isSude, isAhmet, isAuthorizedUser, markSurpriseSeen } from './auth.js';
import { isFirebaseConfigured } from './firebase-config.js';

let audioPlayer = null;
let isAudioPlaying = false;

export function renderSurprise(container) {
  const isPreview = typeof location !== 'undefined' && location.hash.includes('preview=1');
  const user = getCurrentUser();
  const canAccess = isAuthorizedUser() || (isAhmet() && isPreview);

  // 1) Yetkisiz veya misafir kullanıcı kontrolü
  if (!canAccess) {
    container.innerHTML = `
      <div class="page jfy-page center">
        <div class="jfy-card jfy-locked-card">
          <div class="jfy-lock-ic" aria-hidden="true">🔒</div>
          <h2 class="jfy-title">Özel Sayfa</h2>
          <p class="jfy-lead muted">Bu sürpriz yalnızca yetkili hesaplara özeldir.<br>Normal İngilizce öğrenme deneyimine kaldığın yerden devam edebilirsin.</p>
          <div class="jfy-actions">
            <a class="btn primary" href="#/dashboard">Ana Sayfaya Dön</a>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // 2) Yetkili kullanıcı (Sude veya Ahmet önizleme) — Sürpriz Arayüzü
  container.innerHTML = `
    <div class="jfy-page" id="jfy-container">
      <!-- Süzülen zarif kalpler arka planı -->
      <div class="jfy-hearts-bg" aria-hidden="true">
        <span class="jfy-heart h1">❤️</span>
        <span class="jfy-heart h2">💖</span>
        <span class="jfy-heart h3">💕</span>
        <span class="jfy-heart h4">💗</span>
        <span class="jfy-heart h5">❤️</span>
        <span class="jfy-heart h6">💓</span>
        <span class="jfy-heart h7">💖</span>
        <span class="jfy-heart h8">❤️</span>
      </div>

      <div class="jfy-content-wrap">
        ${isPreview ? '<div class="jfy-badge-preview">Ahmet — Önizleme Modu</div>' : ''}
        
        <!-- Aşama 1: Sürpriz Öncesi Karşılama -->
        <div class="jfy-stage jfy-stage-intro" id="jfy-intro">
          <div class="jfy-eyebrow">JUST FOR YOU</div>
          <h1 class="jfy-heading">Senin için küçük bir şey hazırladım. <span class="jfy-heart-pulse">❤️</span></h1>
          <p class="jfy-subtitle">Sadece ikimize özel, kalbimden gelen bir sürpriz.</p>
          <div class="jfy-open-action">
            <button type="button" class="jfy-btn-reveal" id="btn-open-surprise">
              <span class="jfy-btn-sparkle">✨</span> Sürprizini Aç <span class="jfy-btn-heart">❤️</span>
            </button>
          </div>
        </div>

        <!-- Aşama 2: Açılan Romantik İçerik (Varsayılan gizli, tıklamayla yumuşak açılır) -->
        <div class="jfy-stage jfy-stage-revealed" id="jfy-revealed" hidden>
          <div class="jfy-card jfy-romantic-card">
            
            <!-- Özel Fotoğraf Alanı (Güvenli kaynaktan dinamik yüklenir; kaynakta dosya yoksa zarif yer tutucu) -->
            <div class="jfy-photo-container">
              <div class="jfy-photo-frame" id="jfy-photo-box">
                <div class="jfy-photo-placeholder" id="jfy-placeholder">
                  <div class="jfy-placeholder-graphic">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="jfy-svg-heart">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <span class="jfy-placeholder-caption">Bizim Özel Anımız</span>
                </div>
              </div>
            </div>

            <!-- Romantik Mesaj Alanı (Firestore'dan dinamik gelir) -->
            <div class="jfy-message-box">
              <div class="jfy-msg-sigil">SUDE & AHMET</div>
              <h2 class="jfy-msg-title">İyi ki varsın sevgilim…</h2>
              <div class="jfy-msg-body" id="jfy-msg-text">
                <p>Seninle geçen her gün hayatımın en değerli hediyesi. Gözlerindeki ışıltı, kalbindeki sevgi ve gülüşünle hayatımı güzelleştirdiğin için teşekkür ederim.</p>
                <p>Nerede olursak olalım, kalbim daima seninle atıyor. Seni çok seviyorum. ❤️</p>
              </div>
            </div>

            <!-- Özel Müzik Oynatıcı (Gökhan Türkmen — Derdim / Nakarat) -->
            <div class="jfy-music-card">
              <div class="jfy-music-info">
                <div class="jfy-music-ic" aria-hidden="true">🎵</div>
                <div class="jfy-music-texts">
                  <span class="jfy-music-title">Gökhan Türkmen — Derdim</span>
                  <span class="jfy-music-sub">Bizim şarkımız · Nakarat</span>
                </div>
              </div>
              <button type="button" class="jfy-music-btn" id="btn-toggle-music" aria-label="Müziği oynat / duraklat">
                <span id="jfy-play-icon">▶</span>
              </button>
              <audio id="jfy-audio" preload="none"></audio>
            </div>

            <!-- Sayfadan Çıkış & VELUNO'ya Devam -->
            <div class="jfy-exit-wrap">
              <button type="button" class="btn primary xl block jfy-btn-continue" id="btn-continue-veluno">
                VELUNO’ya Devam Et ✨
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  `;

  // Etkinlik bağlama
  wireSurpriseEvents(container);
}

function wireSurpriseEvents(container) {
  const introEl = container.querySelector('#jfy-intro');
  const revealedEl = container.querySelector('#jfy-revealed');
  const openBtn = container.querySelector('#btn-open-surprise');
  const continueBtn = container.querySelector('#btn-continue-veluno');
  const musicBtn = container.querySelector('#btn-toggle-music');
  const audioEl = container.querySelector('#jfy-audio');

  if (openBtn) {
    openBtn.onclick = async () => {
      // 1) Sürprizi yumuşak geçişle aç
      if (introEl) introEl.hidden = true;
      if (revealedEl) {
        revealedEl.hidden = false;
        revealedEl.classList.add('jfy-fade-in');
      }

      // 2) Müzik altyapısı kontrolü
      if (audioEl && audioEl.src) {
        try {
          await audioEl.play();
          isAudioPlaying = true;
          updateMusicUI(true, container);
        } catch {}
      }

      // 3) Dinamik Firestore ve Storage yükleme denemesi
      loadSecurePrivateData(container);
    };
  }

  if (musicBtn && audioEl) {
    musicBtn.onclick = () => {
      if (!audioEl.src) {
        // Müzik dosyası henüz sunucuya yüklenmemişse kullanıcıyı nazikçe bilgilendir
        const sub = container.querySelector('.jfy-music-sub');
        if (sub) sub.textContent = 'Müzik yakında eklenecek ❤️';
        return;
      }
      if (isAudioPlaying) {
        audioEl.pause();
        isAudioPlaying = false;
        updateMusicUI(false, container);
      } else {
        audioEl.play().then(() => {
          isAudioPlaying = true;
          updateMusicUI(true, container);
        }).catch(() => {});
      }
    };
  }

  if (continueBtn) {
    continueBtn.onclick = () => {
      // Oturumda sürprizin görüldüğünü kaydet
      markSurpriseSeen();
      if (audioEl && isAudioPlaying) {
        try { audioEl.pause(); } catch {}
      }
      if (typeof location !== 'undefined') {
        location.hash = '#/dashboard';
      }
    };
  }
}

function updateMusicUI(playing, container) {
  const icon = container.querySelector('#jfy-play-icon');
  const musicCard = container.querySelector('.jfy-music-card');
  if (icon) icon.textContent = playing ? '❚❚' : '▶';
  if (musicCard) musicCard.classList.toggle('playing', playing);
}

async function loadSecurePrivateData(container) {
  if (!isFirebaseConfigured() || typeof window === 'undefined') return;

  try {
    // Cloud Firestore üzerinden fotoğraf ve mesaj çekme (Firebase Spark Planı — Blaze gerekmez)
    if (window.firebase && window.firebase.firestore) {
      const db = window.firebase.firestore();

      // 1) Sude & Ahmet Özel Fotoğraf Belgesi (private/sudePhoto)
      const photoDoc = await db.collection('private').doc('sudePhoto').get();
      if (photoDoc.exists) {
        const pdata = photoDoc.data();
        if (pdata && pdata.imageBase64) {
          const mime = pdata.mimeType || 'image/webp';
          const dataUrl = `data:${mime};base64,${pdata.imageBase64}`;
          const box = container.querySelector('#jfy-photo-box');
          if (box) {
            box.innerHTML = `<img src="${dataUrl}" class="jfy-real-photo" alt="Sude & Ahmet Özel Fotoğrafı" loading="eager">`;
          }
        }
      }

      // 2) Sude & Ahmet Özel Romantik Mesaj Belgesi (private/sude)
      const msgDoc = await db.collection('private').doc('sude').get();
      if (msgDoc.exists) {
        const mdata = msgDoc.data();
        const msgEl = container.querySelector('#jfy-msg-text');
        if (msgEl && mdata.message) {
          msgEl.innerHTML = `<p>${escapeHtml(mdata.message).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
        }
      }
    }
  } catch {
    // Özel veri henüz yoksa veya ağ kesildiyse zarif yer tutucu korunur, asla hata sızdırılmaz
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
