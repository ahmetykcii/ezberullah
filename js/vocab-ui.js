// Kelime Havuzum sayfası: arama/filtre, basit + gelişmiş kelime ekle/düzenle/sil (modal),
// ücretsiz otomatik bilgi hazırlama, taslak kelime tamamlama, içe aktarma, Karıştırılan Kelimeler.
import { state } from './storage.js';
import { $, $$, esc, openModal, toast, confirmDialog, speak } from './ui.js';
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
        <button type="button" class="btn sm primary" id="wf-autofill">✨ Bilgileri Otomatik Hazırla</button>
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
  v.innerHTML = `<div class="row between wrap"><h1>Kelime Havuzum</h1><div class="tabs"><button class="tab ${tab === 'words' ? 'on' : ''}" data-t="words">Kelimeler</button><button class="tab ${tab === 'conf' ? 'on' : ''}" data-t="conf">Karıştırılan Kelimeler</button></div></div><div id="vbody"></div>`;
  $$('[data-t]', v).forEach((b) => { b.onclick = () => { tab = b.dataset.t; renderVocabulary(v); }; });
  (tab === 'words' ? words : confusing)($('#vbody', v), () => renderVocabulary(v));
}

function words(root, refresh) {
  const statusCodes = ['NEW', 'LEARNING', 'REVIEW', 'MASTERED'];
  root.innerHTML = `<div class="toolbar"><input class="input" id="q" type="search" placeholder="Kelime veya Türkçe anlam ara…" value="${esc(filt.q)}" aria-label="Kelime ara">
    <select class="input" id="fl" aria-label="Seviye filtresi">${['<option value="">Tüm Seviyeler</option>', ...LEVELS.map((x) => `<option value="${x}" ${filt.level === x ? 'selected' : ''}>${x} — ${LEVEL_NAMES[x]}</option>`)].join('')}</select>
    <select class="input" id="fc" aria-label="Kategori filtresi"><option value="">Tüm Kategoriler</option>${CATEGORIES.map((x) => `<option value="${esc(x)}" ${filt.category === x ? 'selected' : ''}>${esc(CATEGORY_LABELS[x] || x)}</option>`).join('')}</select>
    <select class="input" id="fs" aria-label="Durum filtresi"><option value="">Tüm Durumlar</option>${statusCodes.map((x) => `<option value="${x}" ${filt.status === x ? 'selected' : ''}>${esc(STATUS_LABELS[x])}</option>`).join('')}<option value="DRAFT" ${filt.status === 'DRAFT' ? 'selected' : ''}>Taslak (Eksik Bilgili)</option></select>
    <select class="input" id="fp" aria-label="Kelime türü filtresi"><option value="">Tüm Türler</option>${POS.map((x) => `<option value="${esc(x)}" ${filt.pos === x ? 'selected' : ''}>${esc(POS_LABELS[x] || x)}</option>`).join('')}</select>
    <button class="btn primary" type="button" id="add">+ Kelime Ekle</button><button class="btn" type="button" id="imp">Toplu İçe Aktar</button></div>
    <p class="muted" id="count"></p><div class="table" id="list"></div><div class="row center"><button class="btn" type="button" id="more">Daha Fazla Göster</button></div>`;

  const draw = () => {
    const l = filterWords(filt);
    const draftCount = l.filter((w) => !isWordReady(w)).length;
    $('#count', root).textContent = `${l.length} kelime${draftCount ? ` (${draftCount} taslak)` : ''}`;
    $('#list', root).innerHTML = l.slice(0, limit).map((w) => {
      const p = state.progress[w.id];
      const pool = poolOf(p);
      const ready = isWordReady(w);
      return `<div class="row-item">
        <span>
          <b>${esc(w.word)}</b> <small class="muted">${esc(posLabel(w.partOfSpeech))}</small><br>
          <span class="muted">${esc(w.meanings.join(', '))}</span>
          ${!ready ? `<br><small class="no-t">⚠ Taslak: Örnek cümle eksik — öğrenme ve sınav sorularına henüz dahil değil.</small>` : ''}
        </span>
        <span><span class="chip">${w.level}</span> <span class="chip alt">${esc(categoryLabel(w.category))}</span></span>
        <span>
          ${ready
            ? `<span class="chip ${pool === 'REVIEW' ? 'bad' : pool === 'MASTERED' ? '' : 'alt'}">${esc(statusLabel(pool))}</span> <small class="muted">${p?.masteryScore ? p.masteryScore + ' · ' + masteryLabel(p.masteryScore) : ''}</small>`
            : `<span class="chip bad">Taslak</span> <button type="button" class="btn sm" data-complete="${w.id}">Eksik Bilgileri Tamamla</button>`}
        </span>
        <span class="row gap">
          <button type="button" class="icon-btn" data-s="${w.id}" aria-label="Dinle" title="Dinle">🔊</button>
          <button type="button" class="icon-btn" data-e="${w.id}" aria-label="Düzenle" title="Düzenle">✏️</button>
          <button type="button" class="icon-btn" data-d="${w.id}" aria-label="Sil" title="Sil">🗑️</button>
        </span>
      </div>`;
    }).join('') || '<p class="muted">Eşleşen kelime bulunamadı.</p>';

    $('#more', root).hidden = l.length <= limit;
    $$('[data-s]', root).forEach((b) => { b.onclick = () => speak(state.wordMap.get(b.dataset.s).word); });
    $$('[data-e]', root).forEach((b) => { b.onclick = () => openWordModal(state.wordMap.get(b.dataset.e), refresh, false); });
    $$('[data-complete]', root).forEach((b) => { b.onclick = () => openWordModal(state.wordMap.get(b.dataset.complete), refresh, true); });
    $$('[data-d]', root).forEach((b) => {
      b.onclick = async () => {
        const w = state.wordMap.get(b.dataset.d);
        if (await confirmDialog(`"${w.word}" kelimesi ve bu kelimenin ilerleme kaydı silinecek. Emin misiniz?`, { okLabel: 'Sil', danger: true })) {
          await removeWord(w.id);
          toast('Kelime silindi.');
          refresh();
        }
      };
    });
  };

  const bind = (id, k) => { $(id, root).onchange = (e) => { filt[k] = e.target.value; limit = 40; draw(); }; };
  $('#q', root).oninput = (e) => { filt.q = e.target.value; limit = 40; draw(); };
  bind('#fl', 'level'); bind('#fc', 'category'); bind('#fs', 'status'); bind('#fp', 'pos');
  $('#add', root).onclick = () => openWordModal(null, refresh, false);
  $('#imp', root).onclick = () => openImportWizard(refresh);
  $('#more', root).onclick = () => { limit += 40; draw(); };
  draw();
}

function confusing(root) {
  root.innerHTML = `<div class="grid modes">${CONFUSING.map((c) => `<div class="card"><h3>${esc(c.title)}</h3><p class="muted">${esc(c.note)}</p>${c.items.map((i) => `<div class="cmp"><b>${esc(i.w)}</b> <small class="muted">${esc(posLabel(i.pos))}</small> — ${esc(i.tr)}<br><i>${esc(i.ex)}</i> <button type="button" class="icon-btn" data-sp="${esc(i.w)}" aria-label="Dinle">🔊</button></div>`).join('')}</div>`).join('')}</div>
  <div class="card"><h3>Karıştırılan Kelimeler Testi</h3><p class="muted">Bu mini test kelime ilerlemenizi ve istatistiklerinizi etkilemez.</p><div id="cq"><button type="button" class="btn primary" id="cs">Testi Başlat (10 Soru)</button></div></div>`;
  $$('[data-sp]', root).forEach((b) => { b.onclick = () => speak(b.dataset.sp); });
  $('#cs', root).onclick = () => {
    const qs = shuffle(CONFUSING.flatMap((c) => c.quiz)).slice(0, 10);
    let i = 0, score = 0;
    const box = $('#cq', root);
    const show = () => {
      if (i >= qs.length) {
        box.innerHTML = `<h3>Sonuç: ${score}/${qs.length}</h3><button type="button" class="btn primary" id="cs2">Yeniden Başla</button>`;
        $('#cs2', box).onclick = () => confusing(root);
        return;
      }
      const q = qs[i];
      box.innerHTML = `<p class="muted">${i + 1}/${qs.length}</p><h2 class="sent">${esc(q.s)}</h2><div class="row gap">${shuffle(q.opts).map((o) => `<button type="button" class="btn" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div><div id="r"></div>`;
      $$('[data-o]', box).forEach((b) => {
        b.onclick = () => {
          const ok = b.dataset.o === q.a; if (ok) score++;
          $$('[data-o]', box).forEach((x) => { x.disabled = true; if (x.dataset.o === q.a) x.classList.add('right'); });
          $('#r', box).innerHTML = `<p class="${ok ? 'ok-t' : 'no-t'}">${ok ? '✓ Doğru' : '✗ Yanlış — Doğru cevap: ' + esc(q.a)}</p><button type="button" class="btn primary" id="nx">Devam →</button>`;
          $('#nx', box).onclick = () => { i++; show(); };
        };
      });
    };
    show();
  };
}
