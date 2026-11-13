// VELUNO Noir — Onaylı V + Beyaz Işık Açılış Bileşeni
// - Yalnızca beyaz ışık + saf siyah V silueti; RGB/neon/üçgen yok.
// - SVG/CSS animasyonu 60 FPS'e kilitlenmez; tarayıcının ekran yenileme hızına (60/90/120 Hz) uyum sağlar.

const V_PATH = 'M171 162H244L288 262L332 162H405L288 430Z';

const EMITTERS = [
  { cx: 207, cy: 177, r: 99 },
  { cx: 369, cy: 177, r: 99 },
  { cx: 227, cy: 231, r: 99 },
  { cx: 349, cy: 231, r: 99 },
  { cx: 247, cy: 285, r: 99 },
  { cx: 329, cy: 285, r: 99 },
  { cx: 267, cy: 339, r: 99 },
  { cx: 309, cy: 339, r: 99 },
  { cx: 288, cy: 393, r: 99 },
  { cx: 288, cy: 414, r: 90 },
];

export function mountVLightScene(container) {
  if (!container) return { setStaticMode() {}, destroy() {} };

  const idSuffix = Math.random().toString(36).slice(2, 7);
  const f1 = `v-glow1-${idSuffix}`;
  const f2 = `v-glow2-${idSuffix}`;
  const f3 = `v-glow3-${idSuffix}`;
  const grad = `v-point-${idSuffix}`;

  const emittersSvg = EMITTERS.map((e) =>
    `<circle class="source" cx="${e.cx}" cy="${e.cy}" r="${e.r}" fill="url(#${grad})"/>`
  ).join('');

  container.innerHTML = `
    <div class="v-scene" aria-hidden="true">
      <svg viewBox="0 0 576 576" aria-hidden="true">
        <defs>
          <filter id="${f1}" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="11"/></filter>
          <filter id="${f2}" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="33"/></filter>
          <filter id="${f3}" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="70"/></filter>
          <radialGradient id="${grad}">
            <stop offset="0" stop-color="#fff" stop-opacity=".65"/>
            <stop offset=".28" stop-color="#fff" stop-opacity=".24"/>
            <stop offset="1" stop-color="#fff" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <g class="sources">${emittersSvg}</g>
        <path class="wide" fill="white" opacity=".18" filter="url(#${f3})" d="${V_PATH}"/>
        <path class="inside" fill="white" opacity=".30" filter="url(#${f2})" d="${V_PATH}"/>
        <path class="bloom" fill="white" opacity=".75" filter="url(#${f1})" d="${V_PATH}"/>
        <path fill="#000000" d="${V_PATH}"/>
      </svg>
    </div>
  `;

  const scene = container.querySelector('.v-scene');

  function syncPause() {
    const hidden = typeof document !== 'undefined' && document.visibilityState === 'hidden';
    scene?.classList.toggle('is-paused', hidden);
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', syncPause);
  }

  return {
    setStaticMode(isStatic) {
      scene?.classList.toggle('is-static', Boolean(isStatic));
    },
    destroy() {
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', syncPause);
      }
      container.innerHTML = '';
    },
  };
}
