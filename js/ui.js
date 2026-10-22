// UI yardımcıları: toast, modal, onay penceresi, ses, ilerleme halkası. (Üst düzeyde DOM erişimi yok.)
import { getSettings } from './storage.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const fmtTime = (sec) => {
  sec = Math.round(sec || 0);
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  return h ? `${h} sa ${m} dk` : m ? `${m} dk` : `${sec} sn`;
};

export function toast(msg, type = 'info', ms = 3800) {
  const root = document.getElementById('toasts');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, ms);
}

const modals = [];
export function openModal({ title, html, onMount, onClose, wide = false }) {
  const root = document.getElementById('modal-root');
  const ov = document.createElement('div');
  ov.className = 'modal-overlay';
  ov.innerHTML = `<div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="modal-head"><h3>${esc(title)}</h3><button class="icon-btn" data-close aria-label="Kapat">✕</button></div>
    <div class="modal-body">${html}</div></div>`;
  root.appendChild(ov);
  const prev = document.activeElement;
  const api = {
    el: ov.querySelector('.modal-body'),
    close() {
      const i = modals.indexOf(api);
      if (i < 0) return;
      modals.splice(i, 1); ov.remove();
      if (prev && prev.focus) try { prev.focus(); } catch { /* */ }
      if (onClose) onClose();
    },
  };
  modals.push(api);
  ov.addEventListener('mousedown', (e) => { if (e.target === ov) api.close(); });
  $('[data-close]', ov).onclick = () => api.close();
  if (onMount) onMount(api.el, api);
  const f = $('input,select,textarea,button.primary,button', api.el);
  if (f) f.focus();
  return api;
}
export const closeTopModal = () => { const m = modals[modals.length - 1]; if (m) { m.close(); return true; } return false; };
export const hasModal = () => modals.length > 0;

export function confirmDialog(msg, { okLabel = 'Onayla', danger = false, title = 'Onay' } = {}) {
  return new Promise((resolve) => {
    let done = false;
    openModal({
      title,
      html: `<p>${esc(msg)}</p><div class="row end"><button class="btn ghost" data-no>Vazgeç</button><button class="btn ${danger ? 'danger' : 'primary'}" data-ok>${esc(okLabel)}</button></div>`,
      onMount(b, api) {
        $('[data-no]', b).onclick = () => { done = true; api.close(); resolve(false); };
        $('[data-ok]', b).onclick = () => { done = true; api.close(); resolve(true); };
      },
      onClose() { if (!done) resolve(false); },
    });
  });
}

/* ---------- Ses (iPhone / Safari Uyumlu) ---------- */
export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
let cachedVoices = [];
let lastUtterance = null;
const NOVELTY_VOICES = /albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|organ|superstar|trinoids|whisper|wobble|zarvox/i;
const PREFERRED_VOICES = /samantha|daniel|karen|moira|alex|aaron|nicky|ava|allison|siri|natural|enhanced|premium|google us english|google uk english/i;

function pickEnglishVoice(synth) {
  const list = synth.getVoices();
  if (list && list.length) cachedVoices = list;
  const voices = cachedVoices.length ? cachedVoices : (list || []);
  const enVoices = voices.filter((x) => /^en[-_]/i.test(x.lang) && !NOVELTY_VOICES.test(x.name || ''));
  return (
    enVoices.find((x) => PREFERRED_VOICES.test(x.name || '') && /en[-_]US/i.test(x.lang)) ||
    enVoices.find((x) => PREFERRED_VOICES.test(x.name || '')) ||
    enVoices.find((x) => /en[-_](US|GB)/i.test(x.lang) && x.localService) ||
    enVoices.find((x) => /en[-_](US|GB)/i.test(x.lang)) ||
    enVoices[0] ||
    voices.find((x) => /^en/i.test(x.lang)) ||
    null
  );
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    cachedVoices = window.speechSynthesis.getVoices() || [];
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        try { cachedVoices = window.speechSynthesis.getVoices() || []; } catch { /* */ }
      };
    }
  } catch { /* */ }
}

export function speak(text, slow = false) {
  if (!ttsSupported()) { toast('Bu tarayıcı sesli okumayı desteklemiyor.', 'error'); return false; }
  try {
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending) synth.cancel();
    if (synth.paused) synth.resume();
    const u = new SpeechSynthesisUtterance(String(text || '').trim());
    lastUtterance = u;
    u.lang = 'en-US';
    const v = pickEnglishVoice(synth);
    if (v) { u.voice = v; u.lang = v.lang || 'en-US'; }
    else if (cachedVoices.length) toast('Cihazda İngilizce ses bulunamadı; telaffuz kalitesi düşük olabilir.', 'info');
    u.rate = Math.max(0.5, Math.min(1.5, getSettings().ttsRate * (slow ? 0.65 : 1)));
    u.onend = () => { if (lastUtterance === u) lastUtterance = null; };
    u.onerror = () => { if (lastUtterance === u) lastUtterance = null; };
    synth.speak(u);
    return true;
  } catch {
    return false;
  }
}

let actx = null;
export function sfx(kind) {
  if (!getSettings().sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume().catch(() => {});
    const o = actx.createOscillator(), g = actx.createGain();
    o.connect(g); g.connect(actx.destination);
    const t = actx.currentTime;
    o.type = 'sine';
    o.frequency.setValueAtTime(kind === 'ok' ? 660 : 220, t);
    if (kind === 'ok') o.frequency.setValueAtTime(880, t + 0.08);
    g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.start(t); o.stop(t + 0.24);
  } catch { /* ses desteklenmiyor */ }
}

export function ring(pct, size = 84, label = '') {
  const r = 34, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, pct));
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 84 84" role="img" aria-label="${esc(label || v + '%')}">
    <circle cx="42" cy="42" r="${r}" class="ring-bg"/><circle cx="42" cy="42" r="${r}" class="ring-fg" stroke-dasharray="${(c * v) / 100} ${c}" transform="rotate(-90 42 42)"/>
    <text x="42" y="47" text-anchor="middle" class="ring-t">${Math.round(v)}%</text></svg>`;
}
