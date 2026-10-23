// VELUNO v4.3 — "Just For You ❤️" Romantic Experience Redesign
// Sude & Ahmet için özel, zarif, duygusal ve akılda kalıcı romantik sürpriz deneyimi.

import { getCurrentUser, isSude, isAhmet, isAuthorizedUser, markSurpriseSeen, ensureFirebaseSdk } from './auth.js';
import { isFirebaseConfigured } from './firebase-config.js';

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

  // 2) Yetkili kullanıcı (Sude veya Ahmet önizleme) — Zenginleştirilmiş Romantik Sürpriz Arayüzü
  container.innerHTML = `
    <div class="jfy-page" id="jfy-container">
      <!-- Arka Planda Çok Sayıda Süzülen Romantik Kalp (25–35 adet) -->
      <div class="jfy-hearts-bg" aria-hidden="true">
        <span class="jfy-heart h1">❤️</span>
        <span class="jfy-heart h2">💖</span>
        <span class="jfy-heart h3">💕</span>
        <span class="jfy-heart h4">💗</span>
        <span class="jfy-heart h5">❤️</span>
        <span class="jfy-heart h6">💓</span>
        <span class="jfy-heart h7">💖</span>
        <span class="jfy-heart h8">❤️</span>
        <span class="jfy-heart h9">💕</span>
        <span class="jfy-heart h10">💗</span>
        <span class="jfy-heart h11">💖</span>
        <span class="jfy-heart h12">❤️</span>
        <span class="jfy-heart h13">💓</span>
        <span class="jfy-heart h14">💕</span>
        <span class="jfy-heart h15">💖</span>
        <span class="jfy-heart h16">💗</span>
        <span class="jfy-heart h17">❤️</span>
        <span class="jfy-heart h18">💓</span>
        <span class="jfy-heart h19">💕</span>
        <span class="jfy-heart h20">💖</span>
        <span class="jfy-heart h21">💗</span>
        <span class="jfy-heart h22">❤️</span>
        <span class="jfy-heart h23">💓</span>
        <span class="jfy-heart h24">💖</span>
        <span class="jfy-heart h25">💕</span>
        <span class="jfy-heart h26">💗</span>
        <span class="jfy-heart h27">❤️</span>
        <span class="jfy-heart h28">💖</span>
        <span class="jfy-heart h29">💓</span>
        <span class="jfy-heart h30">💕</span>
        <span class="jfy-heart h31">❤️</span>
        <span class="jfy-heart h32">💗</span>
      </div>

      <div class="jfy-content-wrap">
        ${isPreview ? '<div class="jfy-badge-preview">Ahmet — Önizleme Modu</div>' : ''}

        <!-- Aşama 1: Sürpriz Öncesi Karşılama ve Ses Uyarısı -->
        <div class="jfy-stage jfy-stage-intro" id="jfy-intro">
          <div class="jfy-eyebrow">JUST FOR YOU</div>
          <h1 class="jfy-heading">Senin için küçük bir şey hazırladım. <span class="jfy-heart-pulse">❤️</span></h1>
          <p class="jfy-subtitle">Sadece ikimize özel, kalbimden gelen bir sürpriz.</p>

          <!-- Zarif Ses Uyarısı Kartı -->
          <div class="jfy-sound-notice" role="note">
            <div class="jfy-sound-pill">
              <span class="jfy-sound-ic" aria-hidden="true">🔊</span>
              <span class="jfy-sound-title">Telefonunun sesini açmayı unutma sevgilim. ❤️</span>
            </div>
            <p class="jfy-sound-sub">Çünkü bu sürprizin bir de şarkısı var. 🎶</p>
          </div>

          <div class="jfy-open-action">
            <button type="button" class="jfy-btn-reveal" id="btn-open-surprise">
              <span class="jfy-btn-sparkle">✨</span> Sürprizini Aç <span class="jfy-btn-heart">❤️</span>
            </button>
          </div>
        </div>

        <!-- Aşama 2: Açılan Romantik İçerik (Büyük Fotoğraf, Duygusal Mesaj ve Müzik) -->
        <div class="jfy-stage jfy-stage-revealed" id="jfy-revealed" hidden>
          <div class="jfy-card jfy-romantic-card">

            <!-- 1. Büyütülmüş ve Odak Noktası Fotoğraf Alanı (%30 daha geniş) -->
            <div class="jfy-photo-container">
              <div class="jfy-photo-frame" id="jfy-photo-box">
                <div class="jfy-photo-placeholder" id="jfy-placeholder">
                  <div class="jfy-placeholder-graphic">
                    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="jfy-svg-heart">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <span class="jfy-placeholder-caption">Bizim Özel Anımız</span>
                  <span class="jfy-placeholder-sub muted small">Ahmet & Sude ❤️</span>
                </div>
              </div>
            </div>

            <!-- 2. Romantik Mesaj Alanı (Firestore'dan dinamik gelir; kaynak koda gömülmez) -->
            <div class="jfy-message-box">
              <div class="jfy-msg-sigil">SUDE & AHMET</div>
              <div id="jfy-msg-text">
                <div class="jfy-msg-lead">İyi ki varsın… ❤️</div>
                <div class="jfy-msg-divider" aria-hidden="true">
                  <span class="jfy-div-line"></span>
                  <span class="jfy-div-heart">❤️</span>
                  <span class="jfy-div-line"></span>
                </div>
                <div class="jfy-msg-paragraphs">
                  <p class="jfy-msg-p jfy-msg-waiting muted">Özel romantik mesajımız yükleniyor… ❤️</p>
                </div>
              </div>
            </div>

            <!-- 3. Minimalist Müzik Oynatıcı (Gökhan Türkmen — Derdim / Nakarat) -->
            <div class="jfy-music-card">
              <div class="jfy-music-info">
                <div class="jfy-music-ic" aria-hidden="true">🎵</div>
                <div class="jfy-music-texts">
                  <span class="jfy-music-title">Gökhan Türkmen — Derdim</span>
                  <span class="jfy-music-sub" id="jfy-music-sub">Bizim şarkımız · Nakarat</span>
                </div>
              </div>
              <button type="button" class="jfy-music-btn" id="btn-toggle-music" aria-label="Müziği oynat / duraklat">
                <span id="jfy-play-icon">▶</span>
              </button>
              <audio id="jfy-audio" preload="none"></audio>
            </div>

            <!-- 4. Sayfadan Çıkış & VELUNO'ya Devam -->
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
    openBtn.onclick = () => {
      // 1) iPhone Safari uyumlu müzik başlatma (Doğrudan kullanıcı dokunma anında)
      if (audioEl && audioEl.src) {
        try {
          const playPromise = audioEl.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              isAudioPlaying = true;
              updateMusicUI(true, container);
            }).catch(() => {
              isAudioPlaying = false;
              updateMusicUI(false, container);
            });
          }
        } catch {
          isAudioPlaying = false;
          updateMusicUI(false, container);
        }
      }

      // 2) Muhteşem Kalp Patlaması Efekti (Heart Burst Particle Animation)
      triggerHeartBurst(container, openBtn);

      // 3) Karşılama ekranını yumuşak biçimde gizle ve sürpriz kartını aç
      if (introEl) introEl.hidden = true;
      if (revealedEl) {
        revealedEl.hidden = false;
        revealedEl.classList.add('jfy-fade-in');
      }

      // 4) Firestore'dan güvenli fotoğraf ve mesajı çek
      loadSecurePrivateData(container);
    };
  }

  if (musicBtn && audioEl) {
    musicBtn.onclick = () => {
      const sub = container.querySelector('#jfy-music-sub');
      if (!audioEl.src) {
        // Telif hakkı nedeniyle gerçek müzik dosyası henüz hazır değilse
        if (sub) sub.textContent = 'Müzik dosyası yakında eklenecek ❤️';
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
        }).catch(() => {
          if (sub) sub.textContent = 'Ses oynatılamadı. Lütfen tekrar deneyin.';
        });
      }
    };
  }

  if (continueBtn) {
    continueBtn.onclick = () => {
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

// Kalp Patlaması Efekti (36 radyal kalp parçacığı)
function triggerHeartBurst(container, sourceBtn) {
  if (typeof document === 'undefined') return;

  const burstWrap = document.createElement('div');
  burstWrap.className = 'jfy-burst-wrap';
  burstWrap.setAttribute('aria-hidden', 'true');

  const rect = sourceBtn ? sourceBtn.getBoundingClientRect() : null;
  const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const originY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

  burstWrap.style.left = `${originX}px`;
  burstWrap.style.top = `${originY}px`;

  const heartIcons = ['❤️', '💖', '💕', '💗', '💓', '💘', '✨'];
  const totalParticles = 36;

  for (let i = 0; i < totalParticles; i++) {
    const p = document.createElement('span');
    p.className = 'jfy-burst-particle';
    p.textContent = heartIcons[i % heartIcons.length];

    // Rastgele açı ve mesafe
    const angle = (i * (360 / totalParticles) + (Math.random() * 20 - 10)) * (Math.PI / 180);
    const dist = 90 + Math.random() * 210;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 30; // Hafif yukarı eğim
    const rot = (Math.random() * 80 - 40);
    const scale = 0.8 + Math.random() * 0.9;

    p.style.setProperty('--dx', `${dx.toFixed(1)}px`);
    p.style.setProperty('--dy', `${dy.toFixed(1)}px`);
    p.style.setProperty('--rot', `${rot.toFixed(1)}deg`);
    p.style.setProperty('--scale', scale.toFixed(2));
    p.style.animationDuration = `${(1.5 + Math.random() * 0.7).toFixed(2)}s`;
    p.style.animationDelay = `${(Math.random() * 0.15).toFixed(2)}s`;

    burstWrap.appendChild(p);
  }

  document.body.appendChild(burstWrap);

  // 2.3 saniye sonra parçacık DOM'unu temizle
  setTimeout(() => {
    if (burstWrap.parentNode) {
      burstWrap.parentNode.removeChild(burstWrap);
    }
  }, 2300);
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
    await ensureFirebaseSdk();

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
          msgEl.innerHTML = formatRomanticMessage(mdata.message);
        }
      }
    }
  } catch {
    // Özel veri henüz yoksa veya ağ kesildiyse zarif yer tutucu korunur, asla hata sızdırılmaz
  }
}

// Firestore'dan gelen romantik mesajı tipografik standartlara göre biçimlendirir
function formatRomanticMessage(raw) {
  if (!raw) return '';
  const text = String(raw).trim();
  // Paragraflara ayır
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  if (!paragraphs.length) {
    return `<div class="jfy-msg-paragraphs"><p class="jfy-msg-p">${escapeHtml(text)}</p></div>`;
  }

  // İlk paragraf: Büyük, dikkat çekici, romantik başlık / lead cümlesi
  const leadHtml = `<div class="jfy-msg-lead">${escapeHtml(paragraphs[0])}</div>`;

  // Zarif romantik ayırıcı
  const dividerHtml = `
    <div class="jfy-msg-divider" aria-hidden="true">
      <span class="jfy-div-line"></span>
      <span class="jfy-div-heart">❤️</span>
      <span class="jfy-div-line"></span>
    </div>
  `;

  // Devam paragrafları: Okunabilirliği yüksek, sola hizalı, ferah gövde metni
  const bodyParagraphs = paragraphs.slice(1).map((p) => {
    const formatted = escapeHtml(p).replace(/\n/g, '<br>');
    return `<p class="jfy-msg-p">${formatted}</p>`;
  }).join('');

  const bodyHtml = bodyParagraphs
    ? `<div class="jfy-msg-paragraphs">${bodyParagraphs}</div>`
    : '';

  return leadHtml + dividerHtml + bodyHtml;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
