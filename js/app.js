// VELUNO v5.0 (Ember Soft) — uygulama giriş noktası: açılış (hayrat) ekranı, router, Defterim (varsayılan), Hazır Kelime Havuzu, Yolum, Menü, Ayarlar, Tema Sistemi, PWA kaydı.
import { initStorage, state, getSettings, setSetting, getMeta, setMeta, persistent, replaceAll, DEFAULT_SETTINGS } from './storage.js';
import { seedBuiltIn, LEVELS } from './vocabulary.js';
import { $, $$, esc, toast, confirmDialog, openModal, ICONS } from './ui.js';
import { renderLearn, initKeys, abortSession } from './learning.js';
import { renderReview, studyPlan } from './review.js';
import { renderExams } from './exams.js';
import { renderStats, levelStats, today, streakStats, todayLearnedCount } from './statistics.js';
import { renderVocabulary } from './vocab-ui.js';
import { renderGrammar, nextGrammarTopic, openGrammarLesson, resetGrammarView } from './grammar.js';
import { exportBackup, pickAndRestore } from './import-export.js';
import { initAuth, getCurrentUser, isLoggedIn, isSude, isAhmet, isAuthorizedUser, hasSeenSurpriseThisSession, markSurpriseSeen, login, logout, testFirebaseAccess } from './auth.js';
import { renderSurprise } from './surprise.js';
import { renderNotebook, getAllNotebookLists } from './notebook.js';
import { renderIrregularVerbs, resetIrregularView, computeVerbSetStats, BUILTIN_IRREGULAR_VERBS } from './irregular-verbs.js';
import { renderPath } from './path-ui.js';
import { ensureListPaths } from './paths.js';

const view = () => $('#view');
const INTRO_KEY = 'lexora_intro_seen';

/* ---------- Tema Çözümleme & Ayarların Uygulanması ---------- */
export const THEME_META_COLORS = { dark: '#101317', studio: '#131F23', ember: '#101820', light: '#F7F9FC' };
export const THEME_IDS = ['light', 'dark', 'auto', 'studio', 'ember'];
export function resolveTheme(themePref = 'light', prefersDark = null) {
  if (themePref === 'studio') return 'studio';
  if (themePref === 'ember') return 'ember';
  if (themePref === 'dark') return 'dark';
  if (themePref === 'auto') {
    const isDark = prefersDark !== null
      ? Boolean(prefersDark)
      : (typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return isDark ? 'dark' : 'light';
  }
  return 'light';
}

export function applySettings() {
  const s = getSettings();
  const r = document.documentElement;
  const resolved = resolveTheme(s.theme);
  r.dataset.theme = resolved;
  r.dataset.themeMode = s.theme || 'light';
  r.classList.toggle('no-anim', !s.animations);
  r.classList.toggle('reduce', !!s.reducedMotion);
  const metaTheme = document.getElementById('meta-theme-color');
  if (metaTheme) {
    const metaColors = { dark: '#101317', studio: '#131F23', ember: '#101820', light: '#F7F9FC' };
    metaTheme.setAttribute('content', metaColors[resolved] || '#F7F9FC');
  }
}

/* ---------- Açılış ekranı ---------- */
function showIntro() {
  const el = $('#intro');
  el.hidden = false; el.classList.remove('leave');
  $('#app').hidden = true;
  el.querySelectorAll('.rv').forEach((n) => { n.style.animation = 'none'; void n.offsetWidth; n.style.animation = ''; });

  const agree = $('#intro-agree');
  const btn = $('#intro-go');

  if (agree) {
    agree.checked = false;
    agree.onchange = () => {
      btn.disabled = !agree.checked;
    };
  }
  btn.disabled = true;

  btn.onclick = () => {
    if (agree && !agree.checked) return;
    try { localStorage.setItem(INTRO_KEY, 'true'); } catch { /* özel mod */ }
    el.classList.add('leave');
    setTimeout(() => {
      el.hidden = true;
      enterApp();
      toast('✅ Duanız sisteme başarıyla kaydedildi. +10 sevap (temsili) 😇', 'success', 4500);
    }, 450);
  };

  const focusTarget = agree || btn;
  setTimeout(() => focusTarget.focus({ preventScroll: true }), getSettings().animations && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 5200 : 100);
}

function enterApp() {
  $('#app').hidden = false;
  if (!location.hash || location.hash === '#/dashboard') location.hash = '#/notebook';
  route();
}

/* ---------- Router (hash tabanlı → GitHub Pages'te yenileme sorunu olmaz) ---------- */
const routes = { notebook: renderNotebook, dashboard: renderNotebook, learn: renderLearn, path: renderPath, review: renderReview, grammar: renderGrammar, irregular: renderIrregularVerbs, more: renderMore, vocabulary: renderVocabulary, exams: renderExams, statistics: renderStats, settings: renderSettings, surprise: renderSurprise, login: (v) => { renderSettings(v); openAuthModal(() => renderSettings(v)); } };
// v5.0 Mobil Tasarım Revizyonu: Alt menü 4 sekme → Defterim · Hazır Kelime Havuzu · Yolum · Menü. Diğer tüm bölümler "Menü" sekmesini aktif gösterir.
const MORE_GROUP = ['more', 'review', 'grammar', 'irregular', 'vocabulary', 'exams', 'statistics', 'settings', 'login', 'surprise'];
let keepGrammarView = false;
function gotoGrammarLesson(id) {
  if (openGrammarLesson(id, null)) { keepGrammarView = true; location.hash = '#/grammar'; }
}
function route() {
  const rawName = (location.hash.replace('#/', '') || 'notebook').split('?')[0];
  const name = rawName === 'dashboard' ? 'notebook' : rawName;
  if (rawName === 'dashboard' && typeof history !== 'undefined' && typeof history.replaceState === 'function') {
    try { history.replaceState(null, '', '#/notebook'); } catch { /* */ }
  }
  if (isSude() && !hasSeenSurpriseThisSession() && name !== 'surprise') {
    location.hash = '#/surprise';
    return;
  }
  const fn = routes[name] || renderNotebook;
  abortSession();
  if (name === 'grammar') { if (!keepGrammarView) resetGrammarView(); keepGrammarView = false; }
  if (name === 'irregular') { resetIrregularView(); }
  $$('[data-nav]').forEach((a) => {
    const inBottom = !!a.closest('#bottomnav');
    const on = a.dataset.nav === name || (inBottom && a.dataset.nav === 'more' && MORE_GROUP.includes(name));
    a.classList.toggle('active', on); on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
  view().classList.remove('page-in'); void view().offsetWidth; view().classList.add('page-in');
  try { fn(view()); } catch (e) { console.error(e); view().innerHTML = `<div class="page"><h2>Bir hata oluştu</h2><p class="muted">${esc(e.message)}</p><a class="btn" href="#/notebook">Defterime Dön</a></div>`; }
  window.scrollTo(0, 0);
  $('#view').focus({ preventScroll: true });
}

/* ---------- Serbest Seviye Seçimi & Günlük Hedef ---------- */
export function openLevelSelectorModal(onSelect) {
  const current = getMeta('learnLevel');
  openModal({
    title: 'Bugün ne öğrenmek istersin?',
    html: `<p class="muted small">İstediğin seviyeden serbestçe başlayabilirsin. İlerlemen her seviyede ayrı korunur.</p>
      <div class="level-picker-list">
        ${LEVELS.map((lvl) => {
          const stats = levelStats(lvl);
          const isCur = lvl === current;
          const sub = lvl === 'A2' ? 'Temel (Elementary)' : lvl === 'B1' ? 'Orta (Intermediate)' : 'İleri (Upper Intermediate)';
          return `<button type="button" class="level-picker-btn ${isCur ? 'active' : ''}" data-pick-level="${lvl}">
            <div class="level-picker-info">
              <span class="level-picker-code">${lvl}</span>
              <div class="level-picker-texts">
                <b>${sub}</b>
                <span class="muted small">${stats.completed}/${stats.total} kelime tamamlandı (%${stats.completion})</span>
              </div>
            </div>
            ${isCur ? '<span class="level-picker-badge">Mevcut</span>' : ICONS.chev}
          </button>`;
        }).join('')}
      </div>`,
    onMount(b, api) {
      $$('[data-pick-level]', b).forEach((btn) => {
        btn.onclick = async () => {
          const picked = btn.dataset.pickLevel;
          api.close();
          if (onSelect) await onSelect(picked);
        };
      });
    },
  });
}

function openGoalModal(onDone) {
  const cur = getSettings().dailyGoal || 10;
  openModal({
    title: 'Günlük Hedef',
    html: `<p class="muted small">Günde kaç yeni kelime öğrenmek istiyorsun?</p>
      <div class="seg" role="group">${[5, 10, 15, 20].map((g) => `<button type="button" class="seg-btn ${cur === g ? 'active' : ''}" data-set-goal="${g}">${g}</button>`).join('')}</div>
      <label class="field">Özel hedef (1–500)<input type="number" min="1" max="500" class="input" id="custom-goal-inp" value="${cur}"></label>
      <div class="row end"><button class="btn ghost" data-x>Vazgeç</button><button class="btn primary" id="save-custom-goal">Kaydet</button></div>`,
    onMount(b, api) {
      const save = (val) => { setSetting('dailyGoal', val); api.close(); toast(`Günlük hedef ${val} kelime olarak ayarlandı.`); if (onDone) onDone(); };
      $('[data-x]', b).onclick = api.close;
      $$('[data-set-goal]', b).forEach((x) => { x.onclick = () => save(parseInt(x.dataset.setGoal, 10)); });
      $('#save-custom-goal', b).onclick = () => save(Math.max(1, Math.min(500, parseInt($('#custom-goal-inp', b).value, 10) || 10)));
    },
  });
}

/* ---------- Menü (4. Sekme: Çalışma Modülleri, Araçlar, Hesap ve Ayarlar) ---------- */
function renderMore(v) {
  const item = (href, ic, title, sub) => `<li><a class="list-row linkrow" href="${href}"><span class="row-ic">${ICONS[ic]}</span><div class="row-main"><b>${title}</b><span class="muted small">${sub}</span></div>${ICONS.chev}</a></li>`;
  const u = getCurrentUser();
  const s = getSettings(), t = today();
  const dailyGoal = s.dailyGoal || 10;
  const tWords = todayLearnedCount(t);
  const strk = streakStats();
  const due = levelStats('').due;
  const gNext = nextGrammarTopic();
  const irvStats = computeVerbSetStats(BUILTIN_IRREGULAR_VERBS);
  const plan = studyPlan();
  const ahmetBanner = isAhmet() ? `
    <div class="ahmet-preview-banner">
      <span>Ahmet & Sude Özel Alanı ❤️</span>
      <a href="#/surprise?preview=1">Sürprizi Önizle ❤️</a>
    </div>` : '';

  v.innerHTML = `<div class="page">
  <div class="nb-brand-row" style="margin-bottom:6px">
    <span class="hero-title" aria-label="VELUNO">VELUNO</span>
    <span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span>
  </div>
  <h1>Menü</h1>
  ${ahmetBanner}
  <div class="list" style="margin-bottom:14px">
    <div class="list-row">
      <div class="row-main">
        <b>Günlük İlerleme · ${tWords}/${dailyGoal} kelime</b>
        <span class="muted small"><span class="streak-mark">Seri ${strk.current} gün</span> · ${due ? `${due} kelime tekrar bekliyor` : 'Şu an bekleyen tekrar yok'}</span>
      </div>
      <button type="button" class="text-btn" id="edit-goal">Hedef</button>
    </div>
  </div>
  <h2 class="group-title">Çalış</h2>
  <ul class="list">
    ${item('#/notebook', 'book', 'Kelime Defterim', 'Kişisel kelime listelerin ve dikey öğrenme yolun')}
    ${item('#/learn', 'book', 'Hazır Kelime Havuzu', 'A2, B1 ve B2 hazır kelimeler · 4 aşamalı öğrenme')}
    ${item('#/path', 'chart', 'Yolum', 'Kişisel ve hazır öğrenme yolların')}
    ${item('#/review', 'repeat', 'Tekrarlarım', due ? `${due} kelime tekrar bekliyor (SRS)` : 'Aralıklı tekrar (SRS) kuyruğu')}
    ${item('#/grammar', 'book', 'Grammar Academy', gNext ? `${String(gNext.order).padStart(2, '0')} — ${esc(gNext.title)}` : 'Dilbilgisi konuları ve alıştırmalar')}
    ${item('#/irregular', 'repeat', 'Fiillerin 3 Hali', irvStats.learned ? `${irvStats.learned}/${irvStats.total} fiil öğrenildi` : 'Düzensiz fiiller (V1, V2, V3) ve kişisel listelerin')}
  </ul>
  <h2 class="group-title">Araçlar</h2>
  <ul class="list">
    ${item('#/vocabulary', 'stack', 'Kelime Havuzum', 'Kelimeleri ara, incele ve düzenle')}
    ${item('#/exams', 'exam', 'Sınavlar', 'Kelime sınavları ve geçmiş sonuçlar')}
    ${item('#/statistics', 'chart', 'İstatistikler', plan && !plan.past ? `Sınava ${plan.days} gün · günlük ${plan.suggested}` : 'İlerlemeni takip et')}
  </ul>
  <h2 class="group-title">Hesap ve Ayarlar</h2>
  <ul class="list">
    ${item('#/settings', 'gear', 'Ayarlar', 'Tema, hedef, yedekleme')}
    ${u ? item('#/settings', 'gear', 'Profil', esc(u.email || u.displayName || 'Giriş yapıldı')) : item('#/login', 'gear', 'Özel Giriş (Ahmet & Sude)', 'Profil ve sürpriz hesabı')}
  </ul></div>`;
  const eg = $('#edit-goal', v);
  if (eg) eg.onclick = () => openGoalModal(() => renderMore(v));
}

/* ---------- Ayarlar (iOS tarzı liste) ---------- */
function renderSettings(v) {
  const s = getSettings();
  const curTheme = THEME_IDS.includes(s.theme) ? s.theme : 'light';
  const sw = (id, label, on, desc = '') => `<label class="list-row"><span class="row-main"><b>${label}</b>${desc ? `<span class="muted small">${desc}</span>` : ''}</span><input type="checkbox" class="switch" id="${id}" ${on ? 'checked' : ''}></label>`;
  const btnRow = (id, label, cls = '') => `<li><button type="button" class="list-row linkrow ${cls}" id="${id}"><span class="row-main"><b>${label}</b></span>${ICONS.chev}</button></li>`;
  v.innerHTML = `<div class="page settings"><h1>Ayarlar</h1>

  <h2 class="group-title">Görünüm</h2>
  <div class="list"><div class="list-row stack"><span class="row-main"><b>Tema</b></span>
    <div class="theme-grid" role="group" aria-label="Tema seçimi">
      <button type="button" class="theme-card-btn ${curTheme === 'light' ? 'active' : ''}" data-set-theme="light"><span class="theme-preview theme-p-light" aria-hidden="true"><span class="theme-swatch-bar"></span></span>Açık</button>
      <button type="button" class="theme-card-btn ${curTheme === 'dark' ? 'active' : ''}" data-set-theme="dark"><span class="theme-preview theme-p-dark" aria-hidden="true"><span class="theme-swatch-bar"></span></span>Koyu</button>
      <button type="button" class="theme-card-btn ${curTheme === 'auto' ? 'active' : ''}" data-set-theme="auto"><span class="theme-preview theme-p-auto" aria-hidden="true"><span class="theme-swatch-bar"></span></span>Otomatik</button>
      <button type="button" class="theme-card-btn ${curTheme === 'studio' ? 'active' : ''}" data-set-theme="studio"><span class="theme-preview theme-p-studio" aria-hidden="true"><span class="theme-swatch-bar"></span></span>VELUNO Studio</button>
      <button type="button" class="theme-card-btn ${curTheme === 'ember' ? 'active' : ''}" data-set-theme="ember"><span class="theme-preview theme-p-ember" aria-hidden="true"><span class="theme-swatch-bar"></span></span>Ember Soft</button>
    </div></div></div>
  <p class="group-note muted small">Otomatik, cihazının açık / koyu görünümünü takip eder. VELUNO Studio, petrol ve lime yeşili özel tasarım sunar. Ember Soft; koyu antrasit zemin, Midnight Petrol ve Aged Bronze tonlarıyla sakin bir görünüm sunar.</p>

  <h2 class="group-title">Günlük Hedef</h2>
  <ul class="list">
    <li><button type="button" class="list-row linkrow" id="goal-row"><span class="row-main"><b>Günlük kelime hedefi</b></span><span class="row-value">${s.dailyGoal} kelime</span>${ICONS.chev}</button></li>
    <li><label class="list-row"><span class="row-main"><b>Grup boyutu</b><span class="muted small">Bir oturumdaki kelime sayısı</span></span><input class="input sm num" type="number" min="1" max="20" id="batch" value="${s.batchSize}"></label></li>
    <li><label class="list-row"><span class="row-main"><b>Hedef sınav tarihi</b></span><input class="input sm" type="date" id="exam" value="${s.examDate}"></label></li>
  </ul>

  <h2 class="group-title">Ses ve Öğrenme</h2>
  <div class="list">
    ${sw('snd', 'Ses efektleri', s.sound)}${sw('anim', 'Animasyonlar', s.animations)}${sw('red', 'Azaltılmış hareket', s.reducedMotion, 'Geçişleri ve hareketi en aza indirir')}${sw('keys', 'Klavye kısayolları', s.shortcuts)}
    <label class="list-row"><span class="row-main"><b>Telaffuz hızı</b></span><span class="row-value" id="rv">${s.ttsRate}×</span><input type="range" min="0.5" max="1.5" step="0.1" id="rate" value="${s.ttsRate}"></label>
  </div>
  <ul class="list"><li><button type="button" class="list-row linkrow" id="tts"><span class="row-main"><b>Telaffuzu dene</b></span>${ICONS.speaker}</button></li></ul>

  <h2 class="group-title">Yedekleme ve Geri Yükleme</h2>
  <ul class="list">
    ${btnRow('exp', 'Yedeği indir (JSON)')}${btnRow('imp', 'Yedeği geri yükle')}${btnRow('replay-intro', 'Hayrat açılışını tekrar izle')}
  </ul>
  <ul class="list">${btnRow('reset', 'İlerlemeyi sıfırla…', 'danger-text')}</ul>
  <p class="group-note muted small">Sıfırlama, kelime ilerlemelerini ve istatistikleri siler; kelimelerin korunur. İki aşamalı onay gerekir.</p>

  <h2 class="group-title">Özel Hesap (Ahmet & Sude)</h2>
  ${(() => {
    const u = getCurrentUser();
    return u
      ? `<ul class="list">
          <li class="list-row"><span class="row-main"><b>Giriş Yapıldı</b><span class="muted small">${esc(u.email || u.displayName)}</span></span><span class="row-value ok-t">${u.isSude ? 'Sude ❤️' : (u.isAhmet ? 'Ahmet (Yönetici)' : 'Giriş Yapıldı')}</span></li>
          ${u.isAhmet ? `<li><a class="list-row linkrow" href="#/surprise?preview=1"><span class="row-main"><b>Sürprizi Önizle ❤️</b><span class="muted small">Ahmet özel önizleme modu</span></span>${ICONS.chev}</a></li>` : ''}
          ${u.isSude ? `<li><a class="list-row linkrow" href="#/surprise"><span class="row-main"><b>Sürprizimi Gör ❤️</b><span class="muted small">Just For You ekranı</span></span>${ICONS.chev}</a></li>` : ''}
          <li><button type="button" class="list-row linkrow" id="test-access-btn"><span class="row-main"><b>Erişim ve Güvenlik Testi</b><span class="muted small">Firestore okuma yetkilerini anlık kontrol et</span></span>${ICONS.chev}</button></li>
          <li><button type="button" class="list-row linkrow danger-text" id="logout-btn"><span class="row-main"><b>Çıkış Yap</b></span></button></li>
        </ul>`
      : `<ul class="list">
          <li><button type="button" class="list-row linkrow" id="open-auth"><span class="row-main"><b>Özel Giriş (Ahmet & Sude)</b><span class="muted small">Sürpriz ve yönetici hesabı</span></span>${ICONS.chev}</button></li>
          <li><button type="button" class="list-row linkrow" id="test-guest-btn"><span class="row-main"><b>Güvenlik Kontrolü (Misafir)</b><span class="muted small">Yabancıların erişemediğini doğrula</span></span>${ICONS.chev}</button></li>
        </ul>`;
  })()}
  <p class="group-note muted small">Normal kullanıcıların hesap oluşturması gerekmez; tüm eğitim özellikleri ücretsiz ve çevrimdışı açıktır.</p>

  <h2 class="group-title">Hakkında</h2>
  <div class="list">
    <div class="list-row"><span class="row-main"><b>VELUNO</b><span class="muted small">Daha akıllıca öğren, daha uzun süre hatırla.</span></span><span class="row-value">v5.0.2</span></div>
    <div class="list-row"><span class="row-main"><b>Veri depolama</b><span class="muted small">${persistent ? 'IndexedDB (kalıcı) · yalnızca bu tarayıcıda' : '⚠ Bellek: tarayıcı IndexedDB\'yi engelliyor; yedek almadan sekmeyi kapatmayın'}</span></span><span class="row-value">${state.words.length} kelime</span></div>
  </div></div>`;
  const on = (id, fn, ev = 'change') => { $(id, v).addEventListener(ev, fn); };
  const num = (id, key, min, max) => on(id, (e) => { const n = Math.max(min, Math.min(max, parseInt(e.target.value, 10) || DEFAULT_SETTINGS[key])); e.target.value = n; setSetting(key, n); toast('Ayarlar kaydedildi.'); });
  num('#batch', 'batchSize', 1, 20);
  $('#goal-row', v).onclick = () => openGoalModal(() => renderSettings(v));
  on('#exam', (e) => { setSetting('examDate', e.target.value); toast('Sınav tarihi kaydedildi.'); });
  const updateThemeUI = (val) => {
    setSetting('theme', val);
    applySettings();
    $$('[data-set-theme]', v).forEach((btn) => btn.classList.toggle('active', btn.dataset.setTheme === val));
  };
  $$('[data-set-theme]', v).forEach((btn) => {
    btn.onclick = () => updateThemeUI(btn.dataset.setTheme);
  });
  [['#snd', 'sound'], ['#anim', 'animations'], ['#red', 'reducedMotion'], ['#keys', 'shortcuts']].forEach(([id, k]) => on(id, (e) => { setSetting(k, e.target.checked); applySettings(); }));
  on('#rate', (e) => { setSetting('ttsRate', +e.target.value); $('#rv', v).textContent = e.target.value + '×'; });
  $('#tts', v).onclick = async () => { const { speak } = await import('./ui.js'); speak('achieve'); };
  $('#exp', v).onclick = exportBackup; $('#imp', v).onclick = pickAndRestore;
  $('#replay-intro', v).onclick = () => { localStorage.removeItem(INTRO_KEY); showIntro(); };
  $('#reset', v).onclick = resetProgress;
  if ($('#open-auth', v)) $('#open-auth', v).onclick = () => openAuthModal(() => renderSettings(v));
  if ($('#logout-btn', v)) $('#logout-btn', v).onclick = async () => { await logout(); toast('Çıkış yapıldı.'); renderSettings(v); };
  if ($('#test-access-btn', v)) $('#test-access-btn', v).onclick = showAccessTestModal;
  if ($('#test-guest-btn', v)) $('#test-guest-btn', v).onclick = showAccessTestModal;
}

async function showAccessTestModal() {
  const loading = openModal({
    title: 'Erişim ve Güvenlik Testi',
    html: `
      <div class="center" style="padding:1.5rem">
        <p>Firebase Firestore güvenlik kuralları ve okuma yetkileri test ediliyor…</p>
        <span class="muted small">Lütfen bekleyin…</span>
      </div>
    `
  });

  const res = await testFirebaseAccess();
  loading.close();

  const userRole = res.currentUser
    ? `${esc(res.currentUser.role)} (${esc(res.currentUser.email || res.currentUser.uid)})`
    : 'Misafir (Giriş Yapılmamış)';

  const itemsHtml = res.tests.map((t) => {
    const isOk = t.status === 'ALLOWED';
    const isDenied = t.status === 'DENIED';
    const badgeClass = isOk ? 'ok-t' : (isDenied ? 'warn-t' : 'err-t');
    const badgeText = isOk ? '✅ İZİN VERİLDİ' : (isDenied ? '🔒 ENGELLENDİ' : '⚠️ ' + t.status);
    return `
      <li class="list-row" style="align-items:flex-start">
        <div class="row-main">
          <b>${esc(t.target)}</b>
          <span class="muted small" style="margin-top:2px">${esc(t.message)}</span>
        </div>
        <span class="row-value ${badgeClass}" style="white-space:nowrap;font-weight:600;font-size:0.75rem">${badgeText}</span>
      </li>
    `;
  }).join('');

  openModal({
    title: 'Firestore Güvenlik ve Yetki Raporu',
    html: `
      <div style="margin-bottom:12px">
        <p class="small muted" style="margin:0 0 4px"><b>Firebase Projesi:</b> <code>${esc(res.project)}</code></p>
        <p class="small muted" style="margin:0"><b>Mevcut Oturum:</b> <b>${userRole}</b></p>
      </div>
      <ul class="list" style="margin-bottom:14px">
        ${itemsHtml}
      </ul>
      <div class="group-note muted small" style="margin-bottom:14px">
        ${res.currentUser && (res.currentUser.role.includes('Ahmet') || res.currentUser.role.includes('Sude'))
          ? '✨ Yetkili hesap oturumunuz açık. Yalnızca siz özel fotoğrafa ve mesaja erişebilirsiniz.'
          : '🛡️ Giriş yapılmamış (Misafir). Özel dokümanlara erişim sunucu tarafından başarıyla engellenmiştir (DENIED).'}
      </div>
      <div class="row end">
        <button type="button" class="btn primary" data-x>Kapat</button>
      </div>
    `,
    onMount(b, api) {
      $('[data-x]', b).onclick = api.close;
    }
  });
}

function openAuthModal(onSuccess) {
  openModal({
    title: 'Özel Giriş (Ahmet & Sude)',
    html: `
      <form id="auth-form" class="auth-form" autocomplete="on">
        <p class="muted small" style="margin-bottom:14px">Bu giriş yalnızca özel sürpriz ve yönetici önizlemesi içindir. Normal kullanıcıların giriş yapması gerekmez.</p>
        <div class="field">
          <label for="auth-email">E-posta</label>
          <input type="email" id="auth-email" class="input" placeholder="ornek@veluno.app" required autocomplete="username">
        </div>
        <div class="field">
          <label for="auth-pass">Şifre</label>
          <input type="password" id="auth-pass" class="input" placeholder="••••••••" required autocomplete="current-password">
        </div>
        <div id="auth-err" class="err small" style="margin:6px 0 10px"></div>
        <div class="row end gap">
          <button type="button" class="btn ghost" data-x>Vazgeç</button>
          <button type="submit" class="btn primary" id="auth-submit">Giriş Yap</button>
        </div>
      </form>
    `,
    onMount(b, api) {
      $('[data-x]', b).onclick = api.close;
      const form = $('#auth-form', b);
      const errEl = $('#auth-err', b);
      const submitBtn = $('#auth-submit', b);

      form.onsubmit = async (e) => {
        e.preventDefault();
        errEl.textContent = '';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Giriş yapılıyor…';

        const email = $('#auth-email', b).value.trim();
        const pass = $('#auth-pass', b).value;

        const res = await login(email, pass);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Giriş Yap';

        if (!res.success) {
          errEl.textContent = res.error || 'Giriş başarısız.';
          return;
        }

        api.close();
        if (isSude()) {
          toast('Hoş geldin Sude! Senin için bir sürpriz var. ❤️', 'success');
          location.hash = '#/surprise';
        } else if (isAhmet()) {
          toast('Hoş geldin Ahmet! Sürprizi Önizle modu aktif.', 'success');
          route();
        } else {
          toast('Giriş yapıldı.', 'success');
          route();
        }
        if (typeof onSuccess === 'function') onSuccess();
      };
    }
  });
}

async function resetProgress() {
  if (!(await confirmDialog('Tüm öğrenme ilerlemeniz silinecek. Devam etmek istiyor musunuz?', { okLabel: 'Devam Et', danger: true, title: 'Adım 1/2' }))) return;
  openModal({ title: 'Adım 2/2 — Son Onay', html: `<p>Bu işlem geri alınamaz. Onaylamak için <b>SIFIRLA</b> yazın. (Önce yedek almanız önerilir.)</p><input class="input" id="rc" placeholder="SIFIRLA" autocomplete="off"><div class="row end"><button class="btn ghost" data-x>Vazgeç</button><button class="btn danger" id="rgo" disabled>Sıfırla</button></div>`,
    onMount(b, api) {
      $('[data-x]', b).onclick = api.close;
      $('#rc', b).oninput = (e) => { $('#rgo', b).disabled = e.target.value.trim() !== 'SIFIRLA'; };
      $('#rgo', b).onclick = async () => {
        const keep = ['deletedIds', 'schemaVersion', 'notebookLists', 'notebookWords', 'irregularLists', 'irregularCustomVerbs', 'memoryGameStats', 'memoryGameRotation', 'notebookPaths', 'pathTab', 'pathListByUser'].filter((k) => getMeta(k) != null).map((k) => ({ key: k, value: getMeta(k) }));
        try { await replaceAll({ words: state.words, progress: [], exams: [], daily: [], meta: keep }); api.close(); toast('İlerleme sıfırlandı.', 'success'); route(); }
        catch (e) { toast('Sıfırlama başarısız: ' + e.message, 'error'); }
      };
    } });
}

/* ---------- PWA ---------- */
function registerSW() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  navigator.serviceWorker.register('service-worker.js', { updateViaCache: 'none' }).then((reg) => {
    const announce = (w) => w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) updateToast(w); });
    if (reg.waiting && navigator.serviceWorker.controller) updateToast(reg.waiting);
    reg.addEventListener('updatefound', () => announce(reg.installing));
    reg.update().catch(() => {});
    setInterval(() => reg.update().catch(() => {}), 3600000);
  }).catch((e) => console.warn('SW kaydı başarısız', e));
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
}
function updateToast(worker) {
  const root = $('#toasts'); if (!root || root.querySelector('[data-sw-update]')) return;
  const el = document.createElement('div'); el.className = 'toast info'; el.dataset.swUpdate = '1';
  el.innerHTML = 'Yeni sürüm hazır. <button class="btn sm primary">Yenile</button>';
  el.querySelector('button').onclick = () => worker.postMessage('SKIP_WAITING');
  root.appendChild(el);
}

/* ---------- Başlatma ---------- */
if (typeof window !== 'undefined') {
  window.addEventListener('lexora:error', (e) => toast('Kayıt hatası: ' + e.detail, 'error', 6000));
  window.addEventListener('hashchange', () => { if (!$('#app').hidden) route(); });
  if (typeof window.matchMedia === 'function') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSchemeChange = () => { if (getSettings().theme === 'auto') applySettings(); };
    if (mq.addEventListener) mq.addEventListener('change', onSchemeChange);
    else if (mq.addListener) mq.addListener(onSchemeChange);
  }
  document.addEventListener('click', (e) => { const a = e.target.closest('a[href^="#/"]'); if (a && a.getAttribute('href') === location.hash && !$('#app').hidden) { e.preventDefault(); route(); } });
  // iPhone / mobil klavye açıldığında alt menüyü gizle ve cevap alanını görünür tut
  document.addEventListener('focusin', (e) => {
    const t = e.target;
    if (t && /^(INPUT|TEXTAREA)$/.test(t.tagName) && t.type !== 'checkbox' && t.type !== 'radio' && t.type !== 'range' && t.type !== 'file') {
      document.body.classList.add('kb-open');
      setTimeout(() => { try { t.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch { /* */ } }, 140);
    }
  });
  document.addEventListener('focusout', () => {
    setTimeout(() => {
      const a = document.activeElement;
      if (!a || !/^(INPUT|TEXTAREA)$/.test(a.tagName) || a.type === 'checkbox') document.body.classList.remove('kb-open');
    }, 100);
  });
}

async function boot() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  applySettings();
  initKeys();
  try {
    await initStorage();
    const r = await seedBuiltIn();
    if (!state.words.length) throw new Error('Kelime verisi yüklenemedi. İnternet bağlantınızı kontrol edip sayfayı yenileyin.');
    if (r.errors.length) console.warn(r.errors);
    try { await ensureListPaths(getAllNotebookLists()); } catch (e) { console.warn('Yol senkronizasyonu başarısız', e); }
  } catch (e) {
    console.error(e);
    $('#app').hidden = false; $('#view').innerHTML = `<div class="card"><h2>Başlatılamadı</h2><p>${esc(e.message)}</p><button class="btn primary" onclick="location.reload()">Yeniden Dene</button></div>`;
    return;
  }
  if (!persistent) setTimeout(() => toast('Tarayıcınız kalıcı depolamayı engelliyor; ilerlemeniz bu sekme kapanınca kaybolabilir. Düzenli yedek alın.', 'error', 8000), 1500);
  try { await initAuth(); } catch {}
  registerSW();
  let seen = false;
  try { seen = localStorage.getItem(INTRO_KEY) === 'true'; } catch { /* */ }
  if (seen) { $('#intro').hidden = true; enterApp(); } else showIntro();
}
boot();
