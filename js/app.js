// EZBERULLAH — uygulama giriş noktası: açılış (hayrat) ekranı, router, Ana Sayfa, Ayarlar, PWA kaydı.
import { initStorage, state, getSettings, setSetting, getMeta, persistent, replaceAll, DEFAULT_SETTINGS } from './storage.js';
import { seedBuiltIn, LEVELS, LEVEL_NAMES, STATUS_LABELS } from './vocabulary.js';
import { $, $$, esc, toast, ring, fmtTime, confirmDialog, openModal } from './ui.js';
import { renderLearn, initKeys, abortSession, resumeSaved, startLearn } from './learning.js';
import { renderReview, studyPlan, startReview } from './review.js';
import { renderExams } from './exams.js';
import { renderStats, levelStats, today, streakStats, streak, totalSeconds, todayLearnedCount, getMistakeAnalytics } from './statistics.js';
import { renderVocabulary } from './vocab-ui.js';
import { exportBackup, pickAndRestore } from './import-export.js';

const view = () => $('#view');
const INTRO_KEY = 'lexora_intro_seen';

/* ---------- Ayarların uygulanması ---------- */
export function applySettings() {
  const s = getSettings();
  const r = document.documentElement;
  r.dataset.theme = s.theme;
  r.classList.toggle('no-anim', !s.animations);
  r.classList.toggle('reduce', !!s.reducedMotion);
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
const routes = { dashboard: renderDashboard, learn: renderLearn, review: renderReview, vocabulary: renderVocabulary, exams: renderExams, statistics: renderStats, settings: renderSettings };
function route() {
  const name = (location.hash.replace('#/', '') || 'dashboard').split('?')[0];
  const fn = routes[name] || renderDashboard;
  abortSession();
  $$('[data-nav]').forEach((a) => { const on = a.dataset.nav === name; a.classList.toggle('active', on); on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); });
  view().classList.remove('page-in'); void view().offsetWidth; view().classList.add('page-in');
  try { fn(view()); } catch (e) { console.error(e); view().innerHTML = `<div class="card"><h2>Bir hata oluştu</h2><p class="muted">${esc(e.message)}</p><a class="btn" href="#/dashboard">Ana Sayfaya Dön</a></div>`; }
  window.scrollTo(0, 0);
  $('#view').focus({ preventScroll: true });
}

/* ---------- Ana Sayfa (Dashboard) ---------- */
function renderDashboard(v) {
  const s = getSettings(), t = today(), all = levelStats('');
  const dailyGoal = s.dailyGoal || 10;
  const tWords = todayLearnedCount(t);
  const goalPct = Math.min(100, Math.round((tWords / dailyGoal) * 100));
  const saved = getMeta('activeSession');
  const hasSaved = saved && saved.idx < (saved.items?.length || 0);
  const strk = streakStats();
  const mistakes = getMistakeAnalytics(10);
  const plan = studyPlan();
  const next = all.due ? { m: 'smart', t: `${all.due} kelime tekrar bekliyor`, b: 'Akıllı Tekrarı Başlat' } : null;
  const stat = (l, val, sub = '') => `<div class="stat"><span class="muted">${l}</span><b>${val}</b>${sub ? `<small class="muted">${sub}</small>` : ''}</div>`;
  v.innerHTML = `<header class="hero"><div class="hero-brand"><img class="hero-logo" src="assets/icons/icon.svg" width="56" height="56" alt="EZBERULLAH kitap ve beyin logosu"><div class="hero-copy"><div class="hero-title-row"><h1 class="hero-title" aria-label="EZBERULLAH"><span class="ez-w">EZBER</span><span class="ez-g">ULLAH</span></h1><span class="hero-sig" aria-label="ahmet ❤️ sude">ahmet <span class="sig-heart" aria-hidden="true">❤️</span> sude</span></div><p class="hero-tagline">Yeni kelimeler öğrenmeye hazır mısın? <span class="muted">· Daha akıllıca öğren, daha uzun süre hatırla.</span></p></div></div></header>
  ${hasSaved ? `<div class="card resume-card">
    <div class="resume-row">
      <div class="resume-info">
        <span class="chip alt sm">⏳ Yarım Kalan Oturum</span>
        <h3 style="margin:.3rem 0 .2rem">${esc(saved.title)}</h3>
        <span class="muted small">${saved.idx}/${saved.items.length} soru tamamlandı (%${Math.round((saved.idx / saved.items.length) * 100)})</span>
      </div>
      <div class="resume-actions">
        <button class="btn primary lg" id="resume">▶️ Kaldığın Yerden Devam Et</button>
        <button class="btn ghost sm" id="discard">Vazgeç</button>
      </div>
    </div>
    <div class="progress" style="margin-top:12px"><i style="width:${Math.round((saved.idx / saved.items.length) * 100)}%"></i></div>
  </div>` : ''}
  <div class="smart-grid">
    <div class="card smart-card goal-card">
      <div>
        <div class="row between">
          <div><div class="card-eyebrow">GÜNLÜK KELİME HEDEFİ</div><h3 class="card-title">🎯 Bugünkü Hedefin: <b>${tWords}/${dailyGoal}</b> Kelime</h3></div>
          <span class="chip ${tWords >= dailyGoal ? 'ok' : 'alt'}">${tWords >= dailyGoal ? '✓ Tamamlandı' : '%' + goalPct}</span>
        </div>
        <div class="progress big ${tWords >= dailyGoal ? 'goal-reached' : ''}"><i style="width:${goalPct}%"></i></div>
        <div class="goal-chip-row">
          <span class="muted small">Hedef:</span>
          ${[5, 10, 15, 20].map((g) => `<button type="button" class="chip-btn ${dailyGoal === g ? 'active' : ''}" data-set-goal="${g}">${g}</button>`).join('')}
          <button type="button" class="chip-btn ${![5, 10, 15, 20].includes(dailyGoal) ? 'active' : ''}" id="custom-goal" title="Özel hedef belirle">Özel</button>
        </div>
        <p class="muted small">Yalnızca bugün 6 aşamayı bitiren yeni kelimeler sayılır.${next ? ' · ' + next.t : ''}</p>
      </div>
      <div class="row end" style="margin-top:10px">${next ? `<button class="btn primary sm" id="smart">${next.b}</button>` : '<a class="btn primary sm" href="#/learn">Yeni Kelime Öğren</a>'}</div>
    </div>
    <div class="card smart-card streak-card">
      <div>
        <div class="row between">
          <div><div class="card-eyebrow">GÜNLÜK SERİ</div><h3 class="card-title">🔥 ${strk.current} Günlük Seri</h3></div>
          <span class="chip ${strk.todayActive ? 'ok' : 'alt'}">${strk.todayActive ? '✓ Bugün çalışıldı' : '⏳ Henüz çalışılmadı'}</span>
        </div>
        <div class="streak-metrics">
          <div class="streak-sub"><span>Mevcut Seri:</span> <b>${strk.current} gün</b></div>
          <div class="streak-sub"><span>En Uzun Seri:</span> <b>${strk.longest} gün</b></div>
        </div>
        <p class="muted small">${strk.todayActive ? 'Harika! Bugünkü çalışma kaydedildi ve seriniz korundu. 🚀' : 'Seriyi devam ettirmek için bugün en az bir oturum tamamlayın! 💪'}</p>
      </div>
      <div class="row end" style="margin-top:10px"><a class="btn sm" href="#/statistics">Detaylı İstatistikler →</a></div>
    </div>
    <div class="card smart-card mistakes-card">
      <div>
        <div class="row between">
          <div><div class="card-eyebrow">HATA ANALİZİ</div><h3 class="card-title">🧠 Zorlandığın Kelimeler: <b>${mistakes.totalMistakeWords}</b></h3></div>
          <span class="chip ${mistakes.totalMistakeWords > 0 ? 'bad' : 'ok'}">${mistakes.totalMistakeWords > 0 ? mistakes.totalMistakeWords + ' kelime' : 'Sıfır Hata'}</span>
        </div>
        <p class="muted small">${mistakes.totalMistakeWords > 0 ? 'En çok hata yaptığın kelimeleri tekrar ederek hafızanı güçlendir.' : 'Henüz zorlandığın bir kelime yok. Harika gidiyorsun! 🎉'}</p>
        ${mistakes.totalMistakeWords > 0 ? `
          <div class="mistake-preview-list">
            ${mistakes.top10.slice(0, 2).map((m) => `<div class="mistake-pill"><b>${esc(m.word)}</b> <small class="muted">${esc(m.meaning)}</small> <span class="chip bad sm">${m.incorrectCount}×</span></div>`).join('')}
          </div>
        ` : ''}
      </div>
      <div class="row end gap wrap" style="margin-top:10px">
        ${mistakes.totalMistakeWords > 0 ? `<button class="btn sm" id="show-mistakes">🔍 Analizi Gör</button><button class="btn primary sm" id="review-mistakes">🎯 Zorlandığın Kelimeleri Tekrar Et</button>` : '<a class="btn sm" href="#/learn">Yeni Kelime Öğren →</a>'}
      </div>
    </div>
  </div>
  <div class="grid stats">${stat('Çalışma Serisi', strk.current + ' gün')}${stat('Toplam Öğrenilen', all.completed, '6 aşamayı bitiren')}${stat('Tekrar Bekleyen', all.due)}${stat('Bugün Yeni', tWords)}${stat('Bugün Tekrar', t.reviews)}${stat('Bugünkü Süre', fmtTime(t.seconds), 'Toplam: ' + fmtTime(totalSeconds()))}</div>
  ${plan ? planCard(plan) : ''}
  <h2>Seviyeler</h2><div class="grid levels">${LEVELS.map((l) => { const x = levelStats(l); return `<div class="card level"><div class="row between"><div><h3>${l} — ${LEVEL_NAMES[l]}</h3><span class="muted">${x.total} kelime${x.drafts ? ` (+${x.drafts} taslak)` : ''}</span></div>${ring(x.completion, 76, 'Öğrenme Tamamlanma Oranı')}</div>
    <div class="pools"><span><b>${x.NEW}</b>${STATUS_LABELS.NEW}</span><span><b>${x.LEARNING}</b>${STATUS_LABELS.LEARNING}</span><span><b>${x.REVIEW}</b>${STATUS_LABELS.REVIEW}</span><span><b>${x.MASTERED}</b>${STATUS_LABELS.MASTERED}</span></div>
    <p class="small"><span class="muted">Öğrenme Tamamlanma Oranı:</span> <b>%${Math.round(x.completion)}</b> · <span class="muted">Kalıcı Öğrenme Oranı:</span> <b>%${Math.round(x.mastery)}</b></p>
    <p class="small muted">${x.due} kelime tekrar bekliyor</p><button class="btn primary block" data-learn="${l}">Öğrenmeye Devam Et</button></div>`; }).join('')}</div>
  <div class="grid modes quick"><a class="card link" href="#/vocabulary">📚 <b>Kelime Havuzum</b><span class="muted">Kelime ekle, ara, içe aktar</span></a><a class="card link" href="#/exams">📝 <b>Sınavlar</b><span class="muted">Sınavlar ve sınav geçmişi</span></a></div>`;
  $$('[data-learn]', v).forEach((b) => { b.onclick = () => startLearn(b.dataset.learn); });
  const sm = $('#smart', v); if (sm) sm.onclick = () => startReview('smart');
  const rm = $('#review-mistakes', v); if (rm) rm.onclick = () => startReview('mistakes');
  const shm = $('#show-mistakes', v); if (shm) shm.onclick = () => showMistakeModal(mistakes);
  $$('[data-set-goal]', v).forEach((b) => {
    b.onclick = () => {
      const g = parseInt(b.dataset.setGoal, 10);
      setSetting('dailyGoal', g);
      toast(`Günlük hedef ${g} kelime olarak ayarlandı.`);
      renderDashboard(v);
    };
  });
  const cg = $('#custom-goal', v);
  if (cg) cg.onclick = () => {
    openModal({
      title: 'Özel Günlük Hedef',
      html: `
        <p class="muted">Günde öğrenmek istediğiniz yeni kelime sayısını belirleyin (1–500):</p>
        <div style="margin:16px 0"><input type="number" min="1" max="500" class="input" id="custom-goal-inp" value="${dailyGoal}"></div>
        <div class="row end"><button class="btn ghost" data-x>Vazgeç</button><button class="btn primary" id="save-custom-goal">Kaydet</button></div>
      `,
      onMount(b, api) {
        $('[data-x]', b).onclick = api.close;
        const inp = $('#custom-goal-inp', b);
        $('#save-custom-goal', b).onclick = () => {
          const val = Math.max(1, Math.min(500, parseInt(inp.value, 10) || 10));
          setSetting('dailyGoal', val);
          api.close();
          toast(`Günlük hedef ${val} kelime olarak kaydedildi.`);
          renderDashboard(v);
        };
      }
    });
  };
  const rs = $('#resume', v); if (rs) rs.onclick = async () => { if (!(await resumeSaved())) toast('Oturum devam ettirilemedi.', 'error'); };
  const dc = $('#discard', v); if (dc) dc.onclick = async () => { if (await confirmDialog('Yarım kalan oturum silinsin mi? (Verdiğiniz cevaplar zaten kaydedildi.)', { danger: true })) { const { setMeta } = await import('./storage.js'); await setMeta('activeSession', null); renderDashboard(v); } };
}

function showMistakeModal(mistakes) {
  openModal({
    title: '🧠 Akıllı Yanlış Kelime Analizi', wide: true,
    html: `
      <p class="muted">En çok zorlandığınız ilk 10 kelime ve başarı oranları (gerçek SRS çalışma geçmişine dayalıdır):</p>
      <div class="table scroll mistake-table">
        <div class="row-item mistake-head">
          <span>Kelime</span>
          <span>Türkçe Anlam</span>
          <span>Hata / Doğru</span>
          <span>Başarı Oranı</span>
        </div>
        ${mistakes.top10.map((m) => `
          <div class="row-item">
            <span><b>${esc(m.word)}</b> <span class="chip alt sm">${m.level}</span></span>
            <span>${esc(m.meaning)}</span>
            <span><span class="chip bad sm">${m.incorrectCount} hata</span> <small class="muted">${m.correctCount} doğru</small></span>
            <span>${m.accuracy !== null ? `<span class="chip ${m.accuracy >= 60 ? 'ok' : 'bad'} sm">%${m.accuracy}</span>` : '<small class="muted">—</small>'}</span>
          </div>
        `).join('')}
      </div>
      <div class="row between" style="margin-top:14px">
        <button class="btn ghost" data-x>Kapat</button>
        <button class="btn primary" id="modal-review-btn">🎯 Zorlandığın Kelimeleri Tekrar Et</button>
      </div>
    `,
    onMount(b, api) {
      $('[data-x]', b).onclick = api.close;
      const rbtn = $('#modal-review-btn', b);
      if (rbtn) rbtn.onclick = () => { api.close(); startReview('mistakes'); };
    }
  });
}
function planCard(p) {
  if (p.past) return '<div class="card"><h3>Sınav Tarihi Geçti</h3><p class="muted">Ayarlardan yeni bir tarih belirleyebilirsiniz.</p></div>';
  return `<div class="card"><h3>Sınav Planı · ${p.days} Gün Kaldı</h3><p class="muted">${esc(p.phase)}</p><div class="grid stats"><div class="stat"><span class="muted">Öğrenilmemiş</span><b>${p.unlearned}</b></div><div class="stat"><span class="muted">Yeni/Gün</span><b>${p.newPerDay}</b></div><div class="stat"><span class="muted">Tekrar/Gün</span><b>${p.reviewPerDay}</b></div><div class="stat"><span class="muted">Önerilen Günlük Hedef</span><b>${p.suggested}</b></div></div></div>`;
}

/* ---------- Ayarlar ---------- */
function renderSettings(v) {
  const s = getSettings();
  const sw = (id, label, on, desc = '') => `<label class="switch-row"><span>${label}${desc ? `<small class="muted">${desc}</small>` : ''}</span><input type="checkbox" id="${id}" ${on ? 'checked' : ''}></label>`;
  v.innerHTML = `<h1>Ayarlar</h1>
  <div class="row gap wrap quick-links"><a class="btn" href="#/vocabulary">📚 Kelime Havuzum</a><a class="btn" href="#/exams">📝 Sınavlar</a></div>
  <div class="card"><h3>Öğrenme Hedefleri</h3><div class="grid form">
   <label>Günlük kelime hedefi
     <div class="row gap wrap" style="margin:4px 0 6px">
       ${[5, 10, 15, 20].map((g) => `<button type="button" class="chip-btn ${s.dailyGoal === g ? 'active' : ''}" data-s-goal="${g}">${g}</button>`).join('')}
     </div>
     <input class="input" type="number" min="1" max="500" id="goal" value="${s.dailyGoal}">
   </label>
   <label>Kelime öğrenme grup boyutu<input class="input" type="number" min="1" max="15" id="batch" value="${s.batchSize}"></label>
   <label>Hedef sınav tarihi<input class="input" type="date" id="exam" value="${s.examDate}"></label></div>
   <p class="muted small">Sınav tarihi girildiğinde Ana Sayfada kalan gün ve önerilen günlük çalışma hedefi gösterilir.</p></div>
  <div class="card"><h3>Görünüm, Ses ve Kontroller</h3>
   <label class="switch-row"><span>Tema</span><select class="input sm" id="theme"><option value="dark" ${s.theme === 'dark' ? 'selected' : ''}>Koyu (Midnight Academy)</option><option value="light" ${s.theme === 'light' ? 'selected' : ''}>Açık</option></select></label>
   ${sw('snd', 'Ses efektleri', s.sound)}${sw('anim', 'Animasyonlar', s.animations)}${sw('red', 'Azaltılmış hareket', s.reducedMotion, 'Ekran geçişlerini ve hareketi en aza indirir')}${sw('keys', 'Klavye kısayolları', s.shortcuts, 'Enter: gönder · 1–4: seçenek · Boşluk: dinle · Esc: çık')}
   <label class="switch-row"><span>Telaffuz hızı <small class="muted" id="rv">${s.ttsRate}×</small></span><input type="range" min="0.5" max="1.5" step="0.1" id="rate" value="${s.ttsRate}"></label>
   <button class="btn sm" type="button" id="tts">🔊 Telaffuzu Dene</button></div>
  <div class="card"><h3>Veri Yedekleme ve Başlangıç</h3><div class="row gap wrap"><button class="btn" type="button" id="exp">⬇ Veri Yedeğini İndir (JSON)</button><button class="btn" type="button" id="imp">⬆ Veri Yedeğini Geri Yükle</button><button class="btn" type="button" id="replay-intro">🎬 Hayrat Açılışını Tekrar İzle</button></div>
   <p class="muted small">Veri depolama: ${persistent ? 'IndexedDB (kalıcı)' : '⚠ Bellek (tarayıcı IndexedDB\'yi engelliyor; yedek almadan sekmeyi kapatmayın)'} · Toplam ${state.words.length} kelime</p></div>
  <div class="card danger-zone"><h3>İlerlemeyi Sıfırla</h3><p class="muted">Tüm kelime ilerlemeleri, sınav sonuçları ve istatistikler silinir. Kelimeleriniz (kendi eklediklerinizle birlikte) korunur. İki aşamalı onay gerekir.</p><button class="btn danger" type="button" id="reset">İlerlemeyi Sıfırla…</button></div>
  <div class="card"><h3>Hakkında</h3><p class="muted">EZBERULLAH · Daha akıllıca öğren, daha uzun süre hatırla. · Tüm veriler yalnızca bu tarayıcıda saklanır ve tamamen ücretsiz çalışır.</p></div>`;
  const on = (id, fn, ev = 'change') => { $(id, v).addEventListener(ev, fn); };
  const num = (id, key, min, max) => on(id, (e) => { const n = Math.max(min, Math.min(max, parseInt(e.target.value, 10) || DEFAULT_SETTINGS[key])); e.target.value = n; setSetting(key, n); toast('Ayarlar kaydedildi.'); });
  num('#goal', 'dailyGoal', 1, 500); num('#batch', 'batchSize', 1, 15);
  $$('[data-s-goal]', v).forEach((b) => {
    b.onclick = () => {
      const val = +b.dataset.sGoal;
      $('#goal', v).value = val;
      setSetting('dailyGoal', val);
      $$('[data-s-goal]', v).forEach((x) => x.classList.toggle('active', x === b));
      toast('Günlük hedef kaydedildi.');
    };
  });
  on('#exam', (e) => { setSetting('examDate', e.target.value); toast('Sınav tarihi kaydedildi.'); });
  on('#theme', (e) => { setSetting('theme', e.target.value); applySettings(); });
  [['#snd', 'sound'], ['#anim', 'animations'], ['#red', 'reducedMotion'], ['#keys', 'shortcuts']].forEach(([id, k]) => on(id, (e) => { setSetting(k, e.target.checked); applySettings(); }));
  on('#rate', (e) => { setSetting('ttsRate', +e.target.value); $('#rv', v).textContent = e.target.value + '×'; });
  $('#tts', v).onclick = async () => { const { speak } = await import('./ui.js'); speak('achieve'); };
  $('#exp', v).onclick = exportBackup; $('#imp', v).onclick = pickAndRestore;
  $('#replay-intro', v).onclick = () => { localStorage.removeItem(INTRO_KEY); showIntro(); };
  $('#reset', v).onclick = resetProgress;
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
  registerSW();
  let seen = false;
  try { seen = localStorage.getItem(INTRO_KEY) === 'true'; } catch { /* */ }
  if (seen) { $('#intro').hidden = true; enterApp(); } else showIntro();
}
boot();
