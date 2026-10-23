// VELUNO v3.1 — uygulama giriş noktası: açılış (hayrat) ekranı, router, Learning Home, Diğer, Ayarlar, Tema Sistemi, PWA kaydı.
import { initStorage, state, getSettings, setSetting, getMeta, persistent, replaceAll, DEFAULT_SETTINGS } from './storage.js';
import { seedBuiltIn, LEVELS, LEVEL_NAMES } from './vocabulary.js';
import { $, $$, esc, toast, confirmDialog, openModal, ICONS } from './ui.js';
import { renderLearn, initKeys, abortSession, resumeSaved, startLearn } from './learning.js';
import { renderReview, studyPlan, startReview } from './review.js';
import { renderExams } from './exams.js';
import { renderStats, levelStats, today, streakStats, todayLearnedCount } from './statistics.js';
import { renderVocabulary } from './vocab-ui.js';
import { renderGrammar, nextGrammarTopic, openGrammarLesson, resetGrammarView } from './grammar.js';
import { exportBackup, pickAndRestore } from './import-export.js';
import { initAuth, getCurrentUser, isLoggedIn, isSude, isAhmet, isAuthorizedUser, hasSeenSurpriseThisSession, markSurpriseSeen, login, logout, testFirebaseAccess } from './auth.js';
import { renderSurprise } from './surprise.js';

const view = () => $('#view');
const INTRO_KEY = 'lexora_intro_seen';

/* ---------- Tema Çözümleme & Ayarların Uygulanması ---------- */
export function resolveTheme(themePref = 'light', prefersDark = null) {
  if (themePref === 'studio') return 'studio';
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
    const metaColors = { dark: '#101317', studio: '#131F23', light: '#F7F9FC' };
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
  if (!location.hash) location.hash = '#/dashboard';
  route();
}

/* ---------- Router (hash tabanlı → GitHub Pages'te yenileme sorunu olmaz) ---------- */
const routes = { dashboard: renderDashboard, learn: renderLearn, review: renderReview, grammar: renderGrammar, more: renderMore, vocabulary: renderVocabulary, exams: renderExams, statistics: renderStats, settings: renderSettings, surprise: renderSurprise, login: (v) => { renderSettings(v); openAuthModal(() => renderSettings(v)); } };
const MORE_GROUP = ['more', 'vocabulary', 'exams', 'statistics', 'settings'];
let keepGrammarView = false;
function gotoGrammarLesson(id) {
  if (openGrammarLesson(id, null)) { keepGrammarView = true; location.hash = '#/grammar'; }
}
function route() {
  const name = (location.hash.replace('#/', '') || 'dashboard').split('?')[0];
  const fn = routes[name] || renderDashboard;
  abortSession();
  if (name === 'grammar') { if (!keepGrammarView) resetGrammarView(); keepGrammarView = false; }
  $$('[data-nav]').forEach((a) => {
    const on = a.dataset.nav === name || (a.dataset.nav === 'more' && MORE_GROUP.includes(name));
    a.classList.toggle('active', on); on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
  view().classList.remove('page-in'); void view().offsetWidth; view().classList.add('page-in');
  try { fn(view()); } catch (e) { console.error(e); view().innerHTML = `<div class="page"><h2>Bir hata oluştu</h2><p class="muted">${esc(e.message)}</p><a class="btn" href="#/dashboard">Ana Sayfaya Dön</a></div>`; }
  window.scrollTo(0, 0);
  $('#view').focus({ preventScroll: true });
}

/* ---------- Ana Sayfa (Learning Home) & Serbest Seviye Seçimi (v3.2) ---------- */
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

function renderDashboard(v) {
  // Sude yeni oturumunda henüz sürprizi görmediyse sürpriz ekranına yönlendir
  if (isSude() && !hasSeenSurpriseThisSession()) {
    location.hash = '#/surprise';
    return;
  }

  const s = getSettings(), t = today();
  const dailyGoal = s.dailyGoal || 10;
  const tWords = todayLearnedCount(t);
  const reached = tWords >= dailyGoal;
  const goalPct = Math.min(100, Math.round((tWords / dailyGoal) * 100));

  const prefLevel = getMeta('learnLevel');
  const level = LEVELS.includes(prefLevel) ? prefLevel : null;
  const byLevel = getMeta('activeSessionsByLevel') || {};
  const activeSaved = level ? byLevel[level] : getMeta('activeSession');
  const hasSaved = activeSaved && activeSaved.idx < (activeSaved.items?.length || 0);

  const strk = streakStats();
  const due = levelStats('').due;
  const gNext = nextGrammarTopic();
  const plan = studyPlan();
  const row = (attrs, main, sub = '') => `<li><${attrs.href ? 'a' : 'button type="button"'} class="list-row linkrow" ${attrs.href ? `href="${attrs.href}"` : `id="${attrs.id}"`}><div class="row-main"><b>${main}</b>${sub ? `<span class="muted small">${sub}</span>` : ''}</div>${ICONS.chev}</${attrs.href ? 'a' : 'button'}></li>`;

  const levelName = level ? (level === 'A2' ? 'Temel' : level === 'B1' ? 'Orta' : 'İleri') : '';

  let ctaHtml = '';
  if (!level) {
    ctaHtml = `<button class="btn primary xl block" id="go-pick-level">Öğrenmeye Başla</button>
      <p class="muted small center">Seviyeni seçerek başla · A2, B1 veya B2</p>`;
  } else if (hasSaved) {
    ctaHtml = `<button class="btn primary xl block" id="resume">Kaldığın Yerden Devam Et — ${level}</button>
      <p class="muted small center">${esc(activeSaved.title)} · ${activeSaved.idx}/${activeSaved.items.length} · <button type="button" class="text-btn" id="change-level">Seviyeyi Değiştir</button> · <button type="button" class="text-btn" id="discard">Vazgeç</button></p>`;
  } else {
    ctaHtml = `<button class="btn primary xl block" id="go-learn">Öğrenmeye Devam Et — ${level}</button>
      <p class="muted small center">${level} — ${levelName} Seviye · <button type="button" class="text-btn" id="change-level">Seviyeyi Değiştir</button></p>`;
  }

  const ahmetBanner = isAhmet() ? `
    <div class="ahmet-preview-banner">
      <span>Ahmet & Sude Özel Alanı ❤️</span>
      <a href="#/surprise?preview=1">Sürprizi Önizle ❤️</a>
    </div>` : '';

  v.innerHTML = `<div class="page home">
  <header class="hero"><div class="hero-brand"><div class="hero-copy"><div class="hero-title-row"><h1 class="hero-title" aria-label="VELUNO">VELUNO</h1><span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span></div><p class="hero-tagline">Hoş geldin. Bugün kısa bir adım yeterli.</p></div></div></header>
  ${ahmetBanner}
  <section class="today" aria-label="Bugünkü hedef">
    <div class="today-row"><div class="today-label">Bugünkü Hedefin: <b>${tWords}/${dailyGoal}</b> Kelime</div><button type="button" class="text-btn" id="edit-goal">Değiştir</button></div>
    <div class="progress ${reached ? 'goal-reached' : ''}" role="progressbar" aria-valuenow="${goalPct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${goalPct}%"></i></div>
    <div class="today-sub muted small">Günlük Seri: <b>${strk.current} gün</b>${reached ? ' · Hedef tamamlandı' : ''}</div>
  </section>
  <div class="cta-block">
    ${ctaHtml}
  </div>
  <ul class="list quiet">
    ${due ? row({ href: '#/review' }, `${due} kelime tekrar bekliyor`, 'Kısa bir tekrar turu') : ''}
    ${gNext ? row({ id: 'go-grammar' }, 'Grammar', `${String(gNext.order).padStart(2, '0')} — ${esc(gNext.title)}`) : ''}
    ${plan && !plan.past ? row({ href: '#/statistics' }, `Sınava ${plan.days} gün kaldı`, `Önerilen günlük hedef: ${plan.suggested}`) : ''}
  </ul>
  </div>`;

  const onLevelChange = async (newLevel) => {
    await setMeta('learnLevel', newLevel);
    const byL = getMeta('activeSessionsByLevel') || {};
    if (byL[newLevel]) {
      await setMeta('activeSession', byL[newLevel]);
    } else {
      await setMeta('activeSession', null);
    }
    renderDashboard(v);
  };

  const gpl = $('#go-pick-level', v);
  if (gpl) gpl.onclick = () => openLevelSelectorModal(async (lvl) => { await setMeta('learnLevel', lvl); await startLearn(lvl); });

  const gl = $('#go-learn', v);
  if (gl) gl.onclick = () => startLearn(level);

  const cl = $('#change-level', v);
  if (cl) cl.onclick = () => openLevelSelectorModal(onLevelChange);

  const gg = $('#go-grammar', v); if (gg) gg.onclick = () => gotoGrammarLesson(gNext.id);
  $('#edit-goal', v).onclick = () => openGoalModal(() => renderDashboard(v));
  const rs = $('#resume', v);
  if (rs) rs.onclick = async () => { if (!(await resumeSaved(level))) toast('Oturum devam ettirilemedi.', 'error'); };
  const dc = $('#discard', v);
  if (dc) dc.onclick = async () => {
    if (await confirmDialog('Yarım kalan oturum silinsin mi? (Verdiğiniz cevaplar zaten kaydedildi.)', { danger: true })) {
      const { setMeta } = await import('./storage.js');
      await setMeta('activeSession', null);
      const byL = getMeta('activeSessionsByLevel') || {};
      if (level && byL[level]) {
        delete byL[level];
        await setMeta('activeSessionsByLevel', byL);
      }
      renderDashboard(v);
    }
  };
}

/* ---------- Diğer ---------- */
function renderMore(v) {
  const item = (href, ic, title, sub) => `<li><a class="list-row linkrow" href="${href}"><span class="row-ic">${ICONS[ic]}</span><div class="row-main"><b>${title}</b><span class="muted small">${sub}</span></div>${ICONS.chev}</a></li>`;
  v.innerHTML = `<div class="page"><h1>Diğer</h1>
  <ul class="list">
    ${item('#/vocabulary', 'stack', 'Kelime Havuzum', 'Kelimeleri ara, incele ve düzenle')}
    ${item('#/exams', 'exam', 'Sınavlar', 'Kelime sınavları ve geçmiş sonuçlar')}
    ${item('#/statistics', 'chart', 'İstatistikler', 'İlerlemeni takip et')}
    ${item('#/settings', 'gear', 'Ayarlar', 'Görünüm, hedef, yedekleme')}
  </ul></div>`;
}

/* ---------- Ayarlar (iOS tarzı liste) ---------- */
function renderSettings(v) {
  const s = getSettings();
  const curTheme = ['light', 'dark', 'auto', 'studio'].includes(s.theme) ? s.theme : 'light';
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
    </div></div></div>
  <p class="group-note muted small">Otomatik, cihazının açık / koyu görünümünü takip eder. VELUNO Studio, petrol ve lime yeşili özel tasarım sunar.</p>

  <h2 class="group-title">Günlük Hedef</h2>
  <ul class="list">
    <li><button type="button" class="list-row linkrow" id="goal-row"><span class="row-main"><b>Günlük kelime hedefi</b></span><span class="row-value">${s.dailyGoal} kelime</span>${ICONS.chev}</button></li>
    <li><label class="list-row"><span class="row-main"><b>Grup boyutu</b><span class="muted small">Bir oturumdaki kelime sayısı</span></span><input class="input sm num" type="number" min="1" max="15" id="batch" value="${s.batchSize}"></label></li>
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
    <div class="list-row"><span class="row-main"><b>VELUNO</b><span class="muted small">Daha akıllıca öğren, daha uzun süre hatırla.</span></span><span class="row-value">v4.3</span></div>
    <div class="list-row"><span class="row-main"><b>Veri depolama</b><span class="muted small">${persistent ? 'IndexedDB (kalıcı) · yalnızca bu tarayıcıda' : '⚠ Bellek: tarayıcı IndexedDB\'yi engelliyor; yedek almadan sekmeyi kapatmayın'}</span></span><span class="row-value">${state.words.length} kelime</span></div>
  </div></div>`;
  const on = (id, fn, ev = 'change') => { $(id, v).addEventListener(ev, fn); };
  const num = (id, key, min, max) => on(id, (e) => { const n = Math.max(min, Math.min(max, parseInt(e.target.value, 10) || DEFAULT_SETTINGS[key])); e.target.value = n; setSetting(key, n); toast('Ayarlar kaydedildi.'); });
  num('#batch', 'batchSize', 1, 15);
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
        const keep = ['deletedIds', 'schemaVersion'].filter((k) => getMeta(k) != null).map((k) => ({ key: k, value: getMeta(k) }));
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
