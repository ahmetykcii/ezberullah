// VELUNO Siyami Maskot Modülü
// Gerçek Siyam kedisinden esinlenen resmi maskotun (Siyami) durum ve tepki yöneticisi.
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const SIYAMI_ASSETS = {
  idle: 'assets/mascot/siyami-idle.png',
  correct: 'assets/mascot/siyami-correct.png',
  wrong: 'assets/mascot/siyami-wrong.png',
  complete: 'assets/mascot/siyami-complete.png',
  sleep: 'assets/mascot/siyami-sleep.png',
  excited: 'assets/mascot/siyami-excited.png',
  curious: 'assets/mascot/siyami-curious.png',
  thinking: 'assets/mascot/siyami-thinking.png',
  focused: 'assets/mascot/siyami-focused.png',
  celebrate: 'assets/mascot/siyami-celebrate.png',
  hello: 'assets/mascot/siyami-hello.png',
  surprised: 'assets/mascot/siyami-surprised.png',
  love: 'assets/mascot/siyami-love.png',
};

export const SIYAMI_STATE_NAMES = Object.keys(SIYAMI_ASSETS);

/**
 * Durum adına göre maskot görsel dosya yolunu döner.
 * @param {string} state - idle | correct | wrong | complete | sleep vb.
 * @returns {string} Görsel yolu
 */
export function getMascotSrc(state = 'idle') {
  return SIYAMI_ASSETS[state] || SIYAMI_ASSETS.idle;
}

/**
 * Yeniden kullanılabilir Siyami maskot HTML bileşeni.
 * @param {Object} opts
 * @param {string} [opts.state='idle'] - Maskot durumu
 * @param {string} [opts.size='md'] - xs (24px), sm (36px), md (48px), lg (72px), xl (96px)
 * @param {string} [opts.className=''] - Ek CSS sınıfları
 * @param {string} [opts.alt='Siyami'] - Erişilebilirlik açıklaması
 * @param {string} [opts.id=''] - DOM ID
 * @returns {string} HTML çıktısı
 */
export function mascotHtml({
  state = 'idle',
  size = 'md',
  className = '',
  alt = 'Siyami',
  id = '',
} = {}) {
  const src = getMascotSrc(state);
  const idAttr = id ? ` id="${esc(id)}"` : '';
  const extraClass = className ? ` ${className}` : '';
  return `<div class="siyami-wrap siyami-${size}${extraClass}"${idAttr} data-siyami-state="${esc(state)}" aria-hidden="true">` +
    `<img class="siyami-img" src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async" onerror="this.style.display='none'"/>` +
  `</div>`;
}

let activeRevertTimer = null;

/**
 * Sayfadaki bir Siyami görselini yeni bir duruma geçirir.
 * İsteğe bağlı olarak revertAfterMs süresi sonra varsayılan duruma (idle) döner.
 * @param {HTMLElement|string} target - Seçici veya DOM öğesi
 * @param {string} newState - Geçilecek durum
 * @param {Object} [opts]
 * @param {number|null} [opts.revertAfterMs=null] - Geri dönüş süresi (ms)
 * @param {string} [opts.revertTo='idle'] - Geri dönülecek durum
 */
export function setMascotState(target, newState, { revertAfterMs = null, revertTo = 'idle' } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const img = el.tagName === 'IMG' ? el : el.querySelector('img.siyami-img') || el.querySelector('img');
  const wrap = el.classList.contains('siyami-wrap') ? el : el.closest('.siyami-wrap') || el;

  const src = getMascotSrc(newState);
  if (img && img.src !== src) {
    img.src = src;
  }
  if (wrap) {
    wrap.dataset.siyamiState = newState;
    wrap.classList.remove('siyami-anim-pop', 'siyami-anim-tilt', 'siyami-anim-wave');
    void wrap.offsetWidth; // reflow tetikle
    if (newState === 'correct' || newState === 'complete' || newState === 'celebrate') {
      wrap.classList.add('siyami-anim-pop');
    } else if (newState === 'wrong' || newState === 'curious' || newState === 'thinking') {
      wrap.classList.add('siyami-anim-tilt');
    }
  }

  if (activeRevertTimer) {
    clearTimeout(activeRevertTimer);
    activeRevertTimer = null;
  }

  if (typeof revertAfterMs === 'number' && revertAfterMs > 0) {
    activeRevertTimer = setTimeout(() => {
      setMascotState(target, revertTo);
      activeRevertTimer = null;
    }, revertAfterMs);
  }
}

/**
 * Öğrenme ekranındaki Siyami tepkisini tetikler (doğru, yanlış veya tamamlama).
 * @param {'correct'|'wrong'|'complete'|'idle'} type
 */
export function reactLearningMascot(type) {
  const slot = document.getElementById('siyami-learning-slot') || document.querySelector('.siyami-run-slot');
  if (!slot) return;
  if (type === 'correct') {
    setMascotState(slot, 'correct', { revertAfterMs: 1400, revertTo: 'idle' });
  } else if (type === 'wrong') {
    setMascotState(slot, 'wrong', { revertAfterMs: 1500, revertTo: 'idle' });
  } else if (type === 'complete') {
    setMascotState(slot, 'complete');
  } else {
    setMascotState(slot, 'idle');
  }
}
