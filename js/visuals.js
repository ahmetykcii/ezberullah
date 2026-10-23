// VELUNO v3.3 — Görsel Kelime Öğrenme & Görsel Kütüphanesi Modülü
import { state, getSettings } from './storage.js';
import { $, $$, esc, openModal, speak, ICONS } from './ui.js';

let metaCache = null;
let loadPromise = null;

export async function loadVisualsMeta() {
  if (metaCache) return metaCache;
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    try {
      const res = await fetch('data/visuals-meta.json');
      if (!res.ok) throw new Error('Visuals meta yüklenemedi');
      metaCache = await res.json();
      return metaCache;
    } catch (e) {
      console.warn('Görsel metadata yükleme uyarısı (çevrimdışı/yedek mod):', e.message);
      metaCache = { stats: { totalWords: 1320, visualizedCount: 0, animatedCount: 0, staticCount: 0, abstractCount: 1320 }, visuals: {} };
      return metaCache;
    }
  })();
  return loadPromise;
}

export function getWordVisualSync(wordId) {
  if (!metaCache?.visuals) return null;
  const v = metaCache.visuals[wordId];
  return v && v.type !== 'abstract' && v.path ? v : null;
}

export function getWordMetaSync(wordId) {
  if (!metaCache?.visuals) return null;
  return metaCache.visuals[wordId] || null;
}

export function hasWordVisual(wordId) {
  return !!getWordVisualSync(wordId);
}

/**
 * Öğrenme ekranında kelime görseli HTML'ini üretir.
 * Ayarlarda "visuals" kapalıysa veya kelime soyutsa (görselsizse) boş dize döner; gereksiz alan kaplamaz.
 */
export function renderVisualHtml(wordId, { compact = false } = {}) {
  const s = getSettings();
  if (s.visuals === false) return '';
  const vis = getWordVisualSync(wordId);
  if (!vis || !vis.path) return '';
  return `<div class="word-visual-box ${compact ? 'compact' : ''}" data-visual-id="${esc(wordId)}" aria-label="${esc(vis.concept || vis.word)}">
    <img class="word-visual-img" src="${vis.path}" alt="${esc(vis.word)}" loading="lazy" onerror="this.closest('.word-visual-box').style.display='none'">
  </div>`;
}

/**
 * Görsel Kütüphanesinden veya önizlemeden çağrılan,
 * gerçek öğrenme ekranını (1. Aşama / Card) taklit eden salt okunur önizleme.
 * Asla SRS kaydı yapmaz, puan değiştirmez, seriyi bozmaz.
 */
export function openVisualPreviewModal(word) {
  const vis = getWordMetaSync(word.id);
  const meanings = Array.isArray(word.meanings) ? word.meanings.join(' · ') : (word.meanings || '');
  const isAnimated = vis?.type === 'animation';
  const hasVis = vis && vis.type !== 'abstract' && vis.path;

  const visualHtml = hasVis
    ? `<div class="word-visual-box preview-box">
         <img class="word-visual-img" src="${vis.path}" alt="${esc(word.word)}">
       </div>`
    : `<div class="word-visual-empty"><p class="muted small">Bu kelime soyut veya dil bilgisel bir kavram olduğu için yanıltıcı görselleştirilmemiştir.</p></div>`;

  const badgeHtml = hasVis
    ? `<span class="vis-badge ${isAnimated ? 'anim' : 'static'}">${isAnimated ? '🎬 Hareketli Animasyon' : '🖼 Statik Görsel'}</span>`
    : `<span class="vis-badge abstract">📄 Görselsiz (Soyut Kavram)</span>`;

  openModal({
    title: 'Öğrenme Ekranında Önizle',
    html: `<div class="visual-preview-modal">
      <div class="preview-badge-row">${badgeHtml}<span class="level-tag">${esc(word.level)}</span></div>
      <div class="run-body preview-card">
        <h2 class="word">${esc(word.word)}</h2>
        ${word.pronunciation ? `<div class="muted small">${esc(word.pronunciation)}</div>` : ''}
        <button type="button" class="speak-btn" id="pv-speak" aria-label="Dinle">${ICONS.speaker}</button>
        ${visualHtml}
        <div class="meaning">${esc(meanings)}</div>
        ${word.exampleSentence ? `<blockquote>${esc(word.exampleSentence)}<small>${esc(word.exampleTranslation || '')}</small></blockquote>` : ''}
      </div>
      ${hasVis && vis.concept ? `<p class="preview-concept muted small"><b>Görsel Anlatım:</b> ${esc(vis.concept)}</p>` : ''}
      <div class="preview-meta muted small">
        <span>Lisans: <b>${esc(vis?.license || 'CC0 1.0 Universal')}</b></span> · 
        <span>Kaynak: <b>${esc(vis?.source || 'VELUNO Tasarım Sistemi')}</b></span>
      </div>
      <p class="preview-safe-note muted small">ℹ Bu bir güvenli önizlemedir; öğrenme ilerlemenizi veya tekrar tarihlerinizi etkilemez.</p>
      <div class="row end"><button type="button" class="btn primary" data-x>Kapat</button></div>
    </div>`,
    onMount(b, api) {
      $('[data-x]', b).onclick = api.close;
      const sp = $('#pv-speak', b);
      if (sp) sp.onclick = () => speak(word.word);
    },
  });
}

/**
 * Görsel Kütüphanesi Ekranı
 */
export async function renderVisualLibrary(v) {
  await loadVisualsMeta();
  const meta = metaCache || { stats: {}, visuals: {} };
  const stats = meta.stats || { totalWords: 1320, visualizedCount: 1175, animatedCount: 505, staticCount: 670, abstractCount: 145 };

  let curLevel = 'ALL';
  let curType = 'ALL';
  let query = '';

  const getFiltered = () => {
    return state.words.filter((w) => {
      if (curLevel !== 'ALL' && w.level !== curLevel) return false;
      const vis = meta.visuals?.[w.id];
      const vType = vis?.type || 'abstract';
      if (curType === 'animation' && vType !== 'animation') return false;
      if (curType === 'static' && vType !== 'static') return false;
      if (curType === 'abstract' && vType !== 'abstract') return false;
      if (curType === 'has_visual' && (vType === 'abstract' || !vis?.path)) return false;

      if (query) {
        const q = query.toLowerCase();
        const wordMatch = w.word.toLowerCase().includes(q);
        const meanMatch = (w.meanings || []).some((m) => m.toLowerCase().includes(q));
        const conceptMatch = vis?.concept?.toLowerCase().includes(q);
        if (!wordMatch && !meanMatch && !conceptMatch) return false;
      }
      return true;
    });
  };

  const draw = () => {
    const list = getFiltered();
    v.innerHTML = `<div class="page visual-library">
      <div class="back-nav"><a href="#/more" class="btn ghost sm"><span class="btn-ic">${ICONS.back}</span> Diğer</a></div>
      <h1>Görsel Kütüphanesi</h1>
      <p class="lead">Kelimeleri zihinde canlandıran hareketli ve statik görsel anlatımlar.</p>

      <div class="vis-stats-strip">
        <div class="vis-stat-pill"><b>${stats.visualizedCount || 1175}</b> Görselleştirilmiş</div>
        <div class="vis-stat-pill blue"><b>${stats.animatedCount || 505}</b> Animasyon</div>
        <div class="vis-stat-pill emerald"><b>${stats.staticCount || 670}</b> Statik</div>
        <div class="vis-stat-pill gray"><b>${stats.abstractCount || 145}</b> Görselsiz (Soyut)</div>
      </div>

      <div class="vis-controls">
        <div class="vis-search-wrap">
          <input type="search" class="input sm" id="vis-search" placeholder="Kelime veya Türkçe anlam ara…" value="${esc(query)}">
        </div>
        <div class="vis-filters-row">
          <div class="seg" role="group" aria-label="Seviye filtresi">
            <button type="button" class="seg-btn ${curLevel === 'ALL' ? 'active' : ''}" data-lvl="ALL">Tümü</button>
            <button type="button" class="seg-btn ${curLevel === 'A2' ? 'active' : ''}" data-lvl="A2">A2</button>
            <button type="button" class="seg-btn ${curLevel === 'B1' ? 'active' : ''}" data-lvl="B1">B1</button>
            <button type="button" class="seg-btn ${curLevel === 'B2' ? 'active' : ''}" data-lvl="B2">B2</button>
          </div>
          <div class="seg" role="group" aria-label="Görsel türü filtresi">
            <button type="button" class="seg-btn ${curType === 'ALL' ? 'active' : ''}" data-type="ALL">Tüm Türler</button>
            <button type="button" class="seg-btn ${curType === 'animation' ? 'active' : ''}" data-type="animation">Animasyon</button>
            <button type="button" class="seg-btn ${curType === 'static' ? 'active' : ''}" data-type="static">Statik</button>
            <button type="button" class="seg-btn ${curType === 'abstract' ? 'active' : ''}" data-type="abstract">Görselsiz</button>
          </div>
        </div>
      </div>

      <div class="vis-result-count muted small">${list.length} kelime listeleniyor</div>

      <div class="vis-grid">
        ${list.slice(0, 100).map((w) => {
          const vis = meta.visuals?.[w.id];
          const hasVis = vis && vis.type !== 'abstract' && vis.path;
          const isAnim = vis?.type === 'animation';
          const badgeClass = isAnim ? 'anim' : (hasVis ? 'static' : 'abstract');
          const badgeText = isAnim ? 'Animasyon' : (hasVis ? 'Statik' : 'Görselsiz');
          const thumb = hasVis
            ? `<div class="vis-thumb"><img src="${vis.path}" alt="${esc(w.word)}" loading="lazy"></div>`
            : `<div class="vis-thumb empty"><span class="muted small">Soyut</span></div>`;

          return `<div class="vis-card" data-preview="${esc(w.id)}">
            ${thumb}
            <div class="vis-card-info">
              <div class="vis-card-header">
                <b>${esc(w.word)}</b>
                <span class="level-tag xs">${esc(w.level)}</span>
              </div>
              <div class="vis-card-meaning">${esc((w.meanings || []).slice(0, 2).join(', '))}</div>
              <div class="vis-card-footer">
                <span class="vis-badge ${badgeClass}">${badgeText}</span>
                <button type="button" class="btn text-btn sm" data-btn-pv="${esc(w.id)}">Önizle</button>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
      ${list.length > 100 ? `<p class="muted small center" style="margin:24px 0">Performans için ilk 100 kelime gösteriliyor. Arama yaparak spesifik kelimelere ulaşabilirsiniz.</p>` : ''}
    </div>`;

    // Event listeners
    const sInp = $('#vis-search', v);
    if (sInp) {
      sInp.oninput = (e) => { query = e.target.value.trim(); draw(); };
      sInp.focus();
    }
    $$('[data-lvl]', v).forEach((b) => { b.onclick = () => { curLevel = b.dataset.lvl; draw(); }; });
    $$('[data-type]', v).forEach((b) => { b.onclick = () => { curType = b.dataset.type; draw(); }; });

    $$('[data-preview]', v).forEach((card) => {
      card.onclick = (e) => {
        const id = card.dataset.preview;
        const w = state.wordMap.get(id);
        if (w) openVisualPreviewModal(w);
      };
    });
  };

  draw();
}
