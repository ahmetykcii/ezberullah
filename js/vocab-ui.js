// Kelime Havuzum sayfası: arama/filtre, basit + gelişmiş kelime ekle/düzenle/sil (modal),
// ücretsiz otomatik bilgi hazırlama, taslak kelime tamamlama, içe aktarma, Karıştırılan Kelimeler.
import { state } from './storage.js';
import { $, $$, esc, openModal, toast, confirmDialog, speak, ICONS } from './ui.js';
import {
  LEVELS, LEVEL_NAMES, CATEGORIES, CATEGORY_LABELS, categoryLabel,
  POS, POS_LABELS, posLabel, STATUS_LABELS, statusLabel,
  filterWords, addWord, editWord, removeWord, prepareWordInfo,
  getMissingFields, buildWord, isWordReady, CONFUSING,
} from './vocabulary.js';
import { openImportWizard } from './import-export.js';
import { masteryLabel, shuffle, poolOf } from './engine.js';

let filt = { q: '', level: '', category: '', status: '', pos: '' };
let limit = 40;
let tab = 'words';

function wordForm(w, expandDetails = false) {
  const item = w || {};
  const hasDetails = expandDetails || Boolean(
    item.exampleSentence || item.exampleTranslation || item.partOfSpeech ||
    (item.synonyms && item.synonyms.length) || (item.wordFamily && item.wordFamily.length) ||
    (item.collocations && item.collocations.length) || (item.alternativeAnswers && item.alternativeAnswers.length)
  );
  const levelOpts = LEVELS.map((lv) => `<option value="${lv}" ${lv === (item.level || 'B1') ? 'selected' : ''}>${lv} — ${LEVEL_NAMES[lv]}</option>`).join('');
  const catOpts = CATEGORIES.map((c) => `<option value="${esc(c)}" ${c === (item.category || 'Daily Life') ? 'selected' : ''}>${esc(CATEGORY_LABELS[c] || c)}</option>`).join('');
  const posOpts = [`<option value="">— Seçiniz —</option>`, ...POS.map((p) => `<option value="${esc(p)}" ${p === (item.partOfSpeech || '') ? 'selected' : ''}>${esc(POS_LABELS[p] || p)}</option>`)].join('');

  return `<form id="wf" class="grid form" autocomplete="off">
    <p class="muted small span2" style="margin:0">Başlangıçta yalnızca <b>İngilizce kelime</b>, <b>Türkçe anlam</b> ve <b>Seviye</b> girmeniz yeterlidir. Örnek cümle olmadan kaydedilen kelimeler <b>Taslak</b> olarak saklanır; bilgileri tamamlandığında 6 aşamalı öğrenme ve sınavlara dahil edilir.</p>
    <label>İngilizce kelime *<input class="input" name="word" id="wf-word" required placeholder="Örn: achieve" value="${esc(item.word || '')}"></label>
    <label>Türkçe anlam * <small class="muted">(birden fazlaysa ; ile ayırın)</small><input class="input" name="meanings" id="wf-meanings" required placeholder="Örn: başarmak; elde etmek" value="${esc((item.meanings || []).join('; '))}"></label>
    <label>Seviye *<select class="input" name="level" id="wf-level">${levelOpts}</select></label>
    <label>Kategori (isteğe bağlı)<select class="input" name="category" id="wf-cat">${catOpts}</select></label>

    <div class="span2 row between wrap" style="background:var(--surf);padding:10px 14px;border-radius:12px">
      <div class="row gap wrap">
        <button type="button" class="btn sm primary" id="wf-autofill">Bilgileri Otomatik Hazırla</button>
        <button type="button" class="btn sm ghost" id="wf-toggle-adv">${hasDetails ? 'Ek Bilgileri Gizle ▲' : 'Ek Bilgileri Göster / Düzenle ▼'}</button>
      </div>
      <small class="muted">Ücretsiz · Yerel doğrulanmış sözlükten doldurur</small>
    </div>

    <div class="span2" id="wf-info" hidden></div>

    <div class="span2 grid form" id="wf-adv" ${hasDetails ? '' : 'hidden'} style="margin-bottom:0;padding-top:6px;border-top:1px solid var(--bd)">
      <label>Kelime türü<select class="input" name="partOfSpeech" id="wf-pos">${posOpts}</select></label>
      <label>Alternatif doğru cevaplar (İngilizce) <small class="muted">(; ile)</small><input class="input" name="alternativeAnswers" id="wf-alt" placeholder="Örn: analyze" value="${esc((item.alternativeAnswers || []).join('; '))}"></label>
      <label class="span2">İngilizce örnek cümle <small class="muted">(5. aşama boşluk doldurma için kelimenin cümlede geçmesi gerekir)</small><input class="input" name="exampleSentence" id="wf-ex" placeholder="Örn: She worked hard to achieve her goals." value="${esc(item.exampleSentence || '')}"></label>
      <label class="span2">Örnek cümlenin Türkçe çevirisi<input class="input" name="exampleTranslation" id="wf-tr" placeholder="Örn: Hedeflerine ulaşmak için çok çalıştı." value="${esc(item.exampleTranslation || '')}"></label>
      <label>Eş anlamlılar <small class="muted">(; ile)</small><input class="input" name="synonyms" id="wf-syn" placeholder="Örn: accomplish; attain" value="${esc((item.synonyms || []).join('; '))}"></label>
      <label>Kelime ailesi <small class="muted">(; ile)</small><input class="input" name="wordFamily" id="wf-fam" placeholder="Örn: achievement" value="${esc((item.wordFamily || []).join('; '))}"></label>
      <label class="span2">Kelime kalıpları / eşdizimler <small class="muted">(; ile)</small><input class="input" name="collocations" id="wf-col" placeholder="Örn: achieve success; achieve a goal" value="${esc((item.collocations || []).join('; '))}"></label>
    </div>

    <div class="err span2" id="werr" role="alert"></div>
    <div class="row end span2 gap wrap">
      <button type="button" class="btn ghost" data-close2>Vazgeç</button>
      <button type="submit" class="btn" id="wf-save-draft" title="Yalnızca temel bilgilerle taslak olarak kaydet">Taslak Olarak Kaydet</button>
      <button type="submit" class="btn primary" id="wf-save">Kaydet</button>
    </div>
  </form>`;
}

export function openWordModal(w = null, done = () => {}, expandDetails = false) {
  const isEdit = Boolean(w && w.id);
  openModal({
    title: isEdit ? (expandDetails ? 'Eksik Bilgileri Tamamla' : 'Kelimeyi Düzenle') : 'Yeni Kelime Ekle',
    html: wordForm(w, expandDetails),
    wide: true,
    onMount(b, api) {
      let forceDraft = false;
      const adv = $('#wf-adv', b);
      const toggleBtn = $('#wf-toggle-adv', b);
      const infoBox = $('#wf-info', b);
      const errBox = $('#werr', b);

      const showAdv = () => {
        adv.hidden = false;
        toggleBtn.textContent = 'Ek Bilgileri Gizle ▲';
      };

      toggleBtn.onclick = () => {
        adv.hidden = !adv.hidden;
        toggleBtn.textContent = adv.hidden ? 'Ek Bilgileri Göster / Düzenle ▼' : 'Ek Bilgileri Gizle ▲';
      };

      const renderMissingNotice = (msg, missing, okStyle = false) => {
        infoBox.hidden = false;
        const listHtml = missing && missing.length
          ? `<div class="small" style="margin-top:6px"><b>Eksik veya tamamlanması önerilen alanlar:</b> ${esc(missing.join(' · '))}</div>`
          : `<div class="small" style="margin-top:4px">Tüm öğrenme aşamaları için gerekli bilgiler tamamlandı.</div>`;
        infoBox.innerHTML = `<div class="feedback ${okStyle ? 'ok' : 'no'}" style="text-align:left;margin:0"><b>${esc(msg)}</b>${listHtml}</div>`;
      };

      if (expandDetails && w) {
        const m = getMissingFields(w);
        if (m.length) renderMissingNotice('Bu kelime şu anda Taslak durumunda. Öğrenme döngüsüne dahil edilmesi için aşağıdaki bilgileri tamamlayın:', m, false);
      }

      $('#wf-autofill', b).onclick = async () => {
        errBox.textContent = '';
        const fd = Object.fromEntries(new FormData($('#wf', b)));
        const res = await prepareWordInfo(fd.word, fd);
        showAdv();
        if (res.found) {
          const d = res.data;
          if (d.meanings?.length && !$('#wf-meanings', b).value.trim()) $('#wf-meanings', b).value = d.meanings.join('; ');
          if (d.partOfSpeech) $('#wf-pos', b).value = d.partOfSpeech;
          if (d.category) $('#wf-cat', b).value = d.category;
          if (d.exampleSentence) $('#wf-ex', b).value = d.exampleSentence;
          if (d.exampleTranslation) $('#wf-tr', b).value = d.exampleTranslation;
          if (d.synonyms?.length) $('#wf-syn', b).value = d.synonyms.join('; ');
          if (d.wordFamily?.length) $('#wf-fam', b).value = d.wordFamily.join('; ');
          if (d.collocations?.length) $('#wf-col', b).value = d.collocations.join('; ');
          if (d.alternativeAnswers?.length) $('#wf-alt', b).value = d.alternativeAnswers.join('; ');
          renderMissingNotice(res.message, res.missing, true);
        } else {
          renderMissingNotice(res.message, res.missing, false);
          $('#wf-ex', b).focus();
        }
      };

      $('[data-close2]', b).onclick = () => api.close();
      $('#wf-save-draft', b).onclick = () => { forceDraft = true; };
      $('#wf-save', b).onclick = () => { forceDraft = false; };

      $('#wf', b).onsubmit = async (e) => {
        e.preventDefault();
        errBox.textContent = '';
        const f = Object.fromEntries(new FormData(e.target));
        const preview = buildWord({ ...(w || {}), ...f });
        const hasValidSentence = isWordReady(preview);

        if (!forceDraft && !hasValidSentence) {
          // Kullanıcı normal "Kaydet"e bastı; örnek cümle girilmiş ama kelimeyi içermiyorsa uyar, hiç girilmemişse otomatik taslak olarak kaydet
          if (f.exampleSentence && f.exampleSentence.trim()) {
            showAdv();
            errBox.textContent = `5. aşama (boşluk doldurma) için örnek cümle "${preview.word}" kelimesini içermelidir. Cümleyi düzeltin veya "Taslak Olarak Kaydet" butonunu kullanın.`;
            return;
          }
          f.isDraft = true;
        } else {
          f.isDraft = forceDraft ? true : false;
        }

        const r = isEdit ? await editWord(w.id, f) : await addWord(f);
        if (!r.ok) {
          errBox.textContent = r.errors.join(' · ');
          return;
        }
        if (r.isDraft) {
          toast(isEdit ? 'Kelime taslak olarak güncellendi. Eksik bilgileri tamamladığınızda öğrenmeye açılır.' : 'Kelime taslak olarak eklendi. Eksik bilgileri tamamladığınızda öğrenmeye açılır.', 'info', 4500);
        } else {
          toast(isEdit ? 'Kelime güncellendi ve öğrenme sistemine hazır.' : 'Kelime eklendi ve 6 aşamalı öğrenmeye hazır.', 'success');
        }
        api.close();
        done();
      };
    },
  });
}

export function renderVocabulary(v) {
  v.innerHTML = `<div class="page">
    <div class="page-head"><h1>Kelime Havuzum</h1><button class="icon-btn solid" type="button" id="add" aria-label="Kelime ekle">${ICONS.plus}</button></div>
    <div class="seg sm" role="group" aria-label="Bölüm"><button class="seg-btn ${tab === 'words' ? 'active' : ''}" data-t="words">Kelimeler</button><button class="seg-btn ${tab === 'conf' ? 'active' : ''}" data-t="conf">Karıştırılan Kelimeler</button></div>
    <div id="vbody"></div></div>`;
  $$('[data-t]', v).forEach((b) => { b.onclick = () => { tab = b.dataset.t; renderVocabulary(v); }; });
  $('#add', v).onclick = () => openWordModal(null, () => renderVocabulary(v), false);
  (tab === 'words' ? words : confusing)($('#vbody', v), () => renderVocabulary(v));
}

function openWordDetail(w, refresh) {
  const p = state.progress[w.id];
  const pool = poolOf(p);
  const ready = isWordReady(w);
  openModal({
    title: w.word,
    html: `<div class="wd">
      <div class="wd-top"><span class="muted">${esc(posLabel(w.partOfSpeech))} · ${w.level} · ${esc(categoryLabel(w.category))}</span><button type="button" class="speak-btn" id="wd-sp" aria-label="Dinle">${ICONS.speaker}</button></div>
      <div class="meaning">${esc(w.meanings.join(' · '))}</div>
      ${w.exampleSentence ? `<blockquote>${esc(w.exampleSentence)}<small>${esc(w.exampleTranslation || '')}</small></blockquote>` : '<p class="muted small">Örnek cümle henüz eklenmemiş.</p>'}
      <div class="kv"><span>Durum</span>${ready ? `${esc(statusLabel(pool))}${p?.masteryScore ? ` · ${p.masteryScore} ${esc(masteryLabel(p.masteryScore))}` : ''}` : 'Taslak — öğrenme ve sınavlara henüz dahil değil'}</div>
      ${w.synonyms?.length ? `<div class="kv"><span>Eş anlamlılar</span>${esc(w.synonyms.join(', '))}</div>` : ''}
      <div class="wd-actions">
        ${ready ? '' : '<button type="button" class="btn primary" id="wd-complete">Eksik Bilgileri Tamamla</button>'}
        <button type="button" class="btn" id="wd-edit">Düzenle</button>
        <button type="button" class="btn ghost danger-text" id="wd-del">Sil</button>
      </div></div>`,
    onMount(b, api) {
      $('#wd-sp', b).onclick = () => speak(w.word);
      const c = $('#wd-complete', b); if (c) c.onclick = () => { api.close(); openWordModal(w, refresh, true); };
      $('#wd-edit', b).onclick = () => { api.close(); openWordModal(w, refresh, false); };
      $('#wd-del', b).onclick = async () => {
        api.close();
        if (await confirmDialog(`"${w.word}" kelimesi ve bu kelimenin ilerleme kaydı silinecek. Emin misiniz?`, { okLabel: 'Sil', danger: true })) {
          await removeWord(w.id); toast('Kelime silindi.'); refresh();
        }
      };
    },
  });
}

function words(root, refresh) {
  const statusCodes = ['NEW', 'LEARNING', 'REVIEW', 'MASTERED'];
  const activeFilters = () => ['category', 'status', 'pos'].filter((k) => filt[k]).length;
  root.innerHTML = `<div class="search"><span class="search-ic">${ICONS.search}</span><input class="input" id="q" type="search" placeholder="Kelime veya anlam ara" value="${esc(filt.q)}" aria-label="Kelime ara"></div>
    <div class="filter-row">
      <div class="seg sm" role="group" aria-label="Seviye">${['', ...LEVELS].map((x) => `<button type="button" class="seg-btn ${filt.level === x ? 'active' : ''}" data-fl="${x}">${x || 'Tümü'}</button>`).join('')}</div>
    </div>
    <details class="more compact" ${activeFilters() ? 'open' : ''}><summary>Filtreler${activeFilters() ? ` (${activeFilters()})` : ''}</summary>
      <div class="more-body filters">
        <select class="input sm" id="fc" aria-label="Kategori filtresi"><option value="">Tüm Kategoriler</option>${CATEGORIES.map((x) => `<option value="${esc(x)}" ${filt.category === x ? 'selected' : ''}>${esc(CATEGORY_LABELS[x] || x)}</option>`).join('')}</select>
        <select class="input sm" id="fs" aria-label="Durum filtresi"><option value="">Tüm Durumlar</option>${statusCodes.map((x) => `<option value="${x}" ${filt.status === x ? 'selected' : ''}>${esc(STATUS_LABELS[x])}</option>`).join('')}<option value="DRAFT" ${filt.status === 'DRAFT' ? 'selected' : ''}>Taslak</option></select>
        <select class="input sm" id="fp" aria-label="Kelime türü filtresi"><option value="">Tüm Türler</option>${POS.map((x) => `<option value="${esc(x)}" ${filt.pos === x ? 'selected' : ''}>${esc(POS_LABELS[x] || x)}</option>`).join('')}</select>
        <button class="btn sm ghost" type="button" id="imp">Toplu İçe Aktar</button>
      </div>
    </details>
    <p class="muted small" id="count"></p><ul class="list words" id="list"></ul><div class="row center"><button class="btn" type="button" id="more">Daha Fazla Göster</button></div>`;

  const draw = () => {
    const l = filterWords(filt);
    const draftCount = l.filter((w) => !isWordReady(w)).length;
    $('#count', root).textContent = `${l.length} kelime${draftCount ? ` · ${draftCount} taslak` : ''}`;
    $('#list', root).innerHTML = l.slice(0, limit).map((w) => {
      const ready = isWordReady(w);
      const pool = poolOf(state.progress[w.id]);
      return `<li><button type="button" class="list-row linkrow" data-w="${w.id}"><div class="row-main"><b>${esc(w.word)}</b><span class="muted small">${esc(w.meanings.join(', '))}</span></div><span class="state ${ready ? (pool === 'REVIEW' ? 'warn' : pool === 'MASTERED' ? 'ok' : '') : 'draft'}">${ready ? esc(statusLabel(pool)) : 'Taslak'}</span></button></li>`;
    }).join('') || '<li class="muted empty">Eşleşen kelime bulunamadı.</li>';
    $('#more', root).hidden = l.length <= limit;
    $$('[data-w]', root).forEach((b) => { b.onclick = () => openWordDetail(state.wordMap.get(b.dataset.w), refresh); });
  };

  $('#q', root).oninput = (e) => { filt.q = e.target.value; limit = 40; draw(); };
  $$('[data-fl]', root).forEach((b) => { b.onclick = () => { filt.level = b.dataset.fl; limit = 40; $$('[data-fl]', root).forEach((x) => x.classList.toggle('active', x === b)); draw(); }; });
  const bind = (id, k) => { $(id, root).onchange = (e) => { filt[k] = e.target.value; limit = 40; draw(); }; };
  bind('#fc', 'category'); bind('#fs', 'status'); bind('#fp', 'pos');
  $('#imp', root).onclick = () => openImportWizard(refresh);
  $('#more', root).onclick = () => { limit += 40; draw(); };
  draw();
}

function confusing(root) {
  root.innerHTML = `<div class="conf">${CONFUSING.map((c) => `<section class="conf-group"><h3>${esc(c.title)}</h3><p class="muted small">${esc(c.note)}</p>${c.items.map((i) => `<div class="cmp"><div><b>${esc(i.w)}</b> <small class="muted">${esc(posLabel(i.pos))}</small> — ${esc(i.tr)}<br><i class="muted">${esc(i.ex)}</i></div><button type="button" class="speak-btn sm" data-sp="${esc(i.w)}" aria-label="Dinle">${ICONS.speaker}</button></div>`).join('')}</section>`).join('')}</div>
  <section class="conf-test"><h3>Karıştırılan Kelimeler Testi</h3><p class="muted small">Bu mini test ilerlemeni ve istatistiklerini etkilemez.</p><div id="cq"><button type="button" class="btn primary xl block" id="cs">Testi Başlat (10 Soru)</button></div></section>`;
  $$('[data-sp]', root).forEach((b) => { b.onclick = () => speak(b.dataset.sp); });
  $('#cs', root).onclick = () => {
    const qs = shuffle(CONFUSING.flatMap((c) => c.quiz)).slice(0, 10);
    let i = 0, score = 0;
    const box = $('#cq', root);
    const show = () => {
      if (i >= qs.length) {
        box.innerHTML = `<h3>Sonuç: ${score}/${qs.length}</h3><button type="button" class="btn primary xl block" id="cs2">Yeniden Başla</button>`;
        $('#cs2', box).onclick = () => confusing(root);
        return;
      }
      const q = qs[i];
      box.innerHTML = `<p class="muted small">${i + 1}/${qs.length}</p><h2 class="sent">${esc(q.s)}</h2><div class="options">${shuffle(q.opts).map((o) => `<button type="button" class="opt" data-o="${esc(o)}"><span>${esc(o)}</span></button>`).join('')}</div><div id="r"></div>`;
      $$('[data-o]', box).forEach((b) => {
        b.onclick = () => {
          const ok = b.dataset.o === q.a; if (ok) score++;
          $$('[data-o]', box).forEach((x) => { x.disabled = true; if (x.dataset.o === q.a) x.classList.add('right'); else if (x === b) x.classList.add('bad'); });
          $('#r', box).innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}"><b>${ok ? 'Doğru' : 'Yanlış'}</b>${ok ? '' : `<span>Doğru cevap: ${esc(q.a)}</span>`}</div><button type="button" class="btn primary xl block" id="nx">Devam</button>`;
          $('#nx', box).onclick = () => { i++; show(); };
        };
      });
    };
    show();
  };
}
