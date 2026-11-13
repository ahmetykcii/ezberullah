// LEXORA — Fiillerin 3 Hali (Irregular Verbs)
// Kullanıcıların kendi düzensiz fiil listelerini oluşturmasını (Manuel Ekle + Toplu/Dosya İçe Aktarma)
// veya yerleşik 190 düzensiz fiil kütüphanesinden (Hazır Fiiller: A2, B1, B2) çalışmasını sağlar.
// Öğrenme Kartları, V2 Testi, V3 Testi, Karışık Test, Yanlışlarım ve V2/V3 ağırlıklı SRS (1-3-7-14-30 gün) içerir.

import { state, saveData } from './storage.js';
import * as E from './engine.js';
import { $, $$, esc, openModal, toast, confirmDialog, speak, sfx, ICONS, successMark } from './ui.js';
import { parseCSV, detectDelimiter } from './import-export.js';
import { getCurrentUser } from './auth.js';
import { bumpDaily } from './statistics.js';

export const IRREGULAR_LEVELS = ['A2', 'B1', 'B2'];
export const IRREGULAR_LEVEL_NAMES = {
  A2: 'Temel Yaygın Fiiller (~A2)',
  B1: 'Orta Düzey Fiiller (~B1)',
  B2: 'İleri Düzey Fiiller (~B2)',
};

/* ---------- Yerleşik 190 Doğrulanmış Düzensiz Fiil Veri Seti (data/irregular-verbs.json ile birebir) ---------- */
export const BUILTIN_IRREGULAR_VERBS = [
  { id: 'irv-a2-001', v1: 'be', v2: 'was/were', v3: 'been', meaning: 'olmak, bulunmak', level: 'A2' },
  { id: 'irv-a2-002', v1: 'become', v2: 'became', v3: 'become', meaning: 'olmak, haline gelmek', level: 'A2' },
  { id: 'irv-a2-003', v1: 'begin', v2: 'began', v3: 'begun', meaning: 'başlamak', level: 'A2' },
  { id: 'irv-a2-004', v1: 'break', v2: 'broke', v3: 'broken', meaning: 'kırmak, bozmak', level: 'A2' },
  { id: 'irv-a2-005', v1: 'bring', v2: 'brought', v3: 'brought', meaning: 'getirmek', level: 'A2' },
  { id: 'irv-a2-006', v1: 'build', v2: 'built', v3: 'built', meaning: 'inşa etmek, kurmak', level: 'A2' },
  { id: 'irv-a2-007', v1: 'buy', v2: 'bought', v3: 'bought', meaning: 'satın almak', level: 'A2' },
  { id: 'irv-a2-008', v1: 'catch', v2: 'caught', v3: 'caught', meaning: 'yakalamak, yetişmek', level: 'A2' },
  { id: 'irv-a2-009', v1: 'choose', v2: 'chose', v3: 'chosen', meaning: 'seçmek', level: 'A2' },
  { id: 'irv-a2-010', v1: 'come', v2: 'came', v3: 'come', meaning: 'gelmek', level: 'A2' },
  { id: 'irv-a2-011', v1: 'cost', v2: 'cost', v3: 'cost', meaning: 'mal olmak, tutmak', level: 'A2' },
  { id: 'irv-a2-012', v1: 'cut', v2: 'cut', v3: 'cut', meaning: 'kesmek', level: 'A2' },
  { id: 'irv-a2-013', v1: 'do', v2: 'did', v3: 'done', meaning: 'yapmak', level: 'A2' },
  { id: 'irv-a2-014', v1: 'draw', v2: 'drew', v3: 'drawn', meaning: 'çizmek, çekmek', level: 'A2' },
  { id: 'irv-a2-015', v1: 'drink', v2: 'drank', v3: 'drunk', meaning: 'içmek', level: 'A2' },
  { id: 'irv-a2-016', v1: 'drive', v2: 'drove', v3: 'driven', meaning: 'sürmek, araba kullanmak', level: 'A2' },
  { id: 'irv-a2-017', v1: 'eat', v2: 'ate', v3: 'eaten', meaning: 'yemek yemek', level: 'A2' },
  { id: 'irv-a2-018', v1: 'fall', v2: 'fell', v3: 'fallen', meaning: 'düşmek', level: 'A2' },
  { id: 'irv-a2-019', v1: 'feel', v2: 'felt', v3: 'felt', meaning: 'hissetmek', level: 'A2' },
  { id: 'irv-a2-020', v1: 'find', v2: 'found', v3: 'found', meaning: 'bulmak', level: 'A2' },
  { id: 'irv-a2-021', v1: 'fly', v2: 'flew', v3: 'flown', meaning: 'uçmak', level: 'A2' },
  { id: 'irv-a2-022', v1: 'forget', v2: 'forgot', v3: 'forgotten', meaning: 'unutmak', level: 'A2' },
  { id: 'irv-a2-023', v1: 'get', v2: 'got', v3: 'got/gotten', meaning: 'almak, elde etmek, olmak', level: 'A2' },
  { id: 'irv-a2-024', v1: 'give', v2: 'gave', v3: 'given', meaning: 'vermek', level: 'A2' },
  { id: 'irv-a2-025', v1: 'go', v2: 'went', v3: 'gone', meaning: 'gitmek', level: 'A2' },
  { id: 'irv-a2-026', v1: 'grow', v2: 'grew', v3: 'grown', meaning: 'büyümek, yetiştirmek', level: 'A2' },
  { id: 'irv-a2-027', v1: 'have', v2: 'had', v3: 'had', meaning: 'sahip olmak', level: 'A2' },
  { id: 'irv-a2-028', v1: 'hear', v2: 'heard', v3: 'heard', meaning: 'duymak, işitmek', level: 'A2' },
  { id: 'irv-a2-029', v1: 'hit', v2: 'hit', v3: 'hit', meaning: 'vurmak, çarpmak', level: 'A2' },
  { id: 'irv-a2-030', v1: 'hold', v2: 'held', v3: 'held', meaning: 'tutmak', level: 'A2' },
  { id: 'irv-a2-031', v1: 'hurt', v2: 'hurt', v3: 'hurt', meaning: 'incitmek, acımak', level: 'A2' },
  { id: 'irv-a2-032', v1: 'keep', v2: 'kept', v3: 'kept', meaning: 'tutmak, saklamak, sürdürmek', level: 'A2' },
  { id: 'irv-a2-033', v1: 'know', v2: 'knew', v3: 'known', meaning: 'bilmek, tanımak', level: 'A2' },
  { id: 'irv-a2-034', v1: 'learn', v2: 'learned/learnt', v3: 'learned/learnt', meaning: 'öğrenmek', level: 'A2' },
  { id: 'irv-a2-035', v1: 'leave', v2: 'left', v3: 'left', meaning: 'ayrılmak, bırakmak', level: 'A2' },
  { id: 'irv-a2-036', v1: 'let', v2: 'let', v3: 'let', meaning: 'izin vermek, bırakmak', level: 'A2' },
  { id: 'irv-a2-037', v1: 'lose', v2: 'lost', v3: 'lost', meaning: 'kaybetmek', level: 'A2' },
  { id: 'irv-a2-038', v1: 'make', v2: 'made', v3: 'made', meaning: 'yapmak, üretmek', level: 'A2' },
  { id: 'irv-a2-039', v1: 'mean', v2: 'meant', v3: 'meant', meaning: 'anlamına gelmek, kastetmek', level: 'A2' },
  { id: 'irv-a2-040', v1: 'meet', v2: 'met', v3: 'met', meaning: 'buluşmak, tanışmak', level: 'A2' },
  { id: 'irv-a2-041', v1: 'pay', v2: 'paid', v3: 'paid', meaning: 'ödemek', level: 'A2' },
  { id: 'irv-a2-042', v1: 'put', v2: 'put', v3: 'put', meaning: 'koymak', level: 'A2' },
  { id: 'irv-a2-043', v1: 'read', v2: 'read', v3: 'read', meaning: 'okumak', level: 'A2' },
  { id: 'irv-a2-044', v1: 'ride', v2: 'rode', v3: 'ridden', meaning: 'binmek, sürmek (bisiklet, at)', level: 'A2' },
  { id: 'irv-a2-045', v1: 'ring', v2: 'rang', v3: 'rung', meaning: 'çalmak (zil, telefon)', level: 'A2' },
  { id: 'irv-a2-046', v1: 'run', v2: 'ran', v3: 'run', meaning: 'koşmak, işletmek', level: 'A2' },
  { id: 'irv-a2-047', v1: 'say', v2: 'said', v3: 'said', meaning: 'söylemek, demek', level: 'A2' },
  { id: 'irv-a2-048', v1: 'see', v2: 'saw', v3: 'seen', meaning: 'görmek', level: 'A2' },
  { id: 'irv-a2-049', v1: 'sell', v2: 'sold', v3: 'sold', meaning: 'satmak', level: 'A2' },
  { id: 'irv-a2-050', v1: 'send', v2: 'sent', v3: 'sent', meaning: 'göndermek', level: 'A2' },
  { id: 'irv-a2-051', v1: 'show', v2: 'showed', v3: 'shown/showed', meaning: 'göstermek', level: 'A2' },
  { id: 'irv-a2-052', v1: 'shut', v2: 'shut', v3: 'shut', meaning: 'kapatmak', level: 'A2' },
  { id: 'irv-a2-053', v1: 'sing', v2: 'sang', v3: 'sung', meaning: 'şarkı söylemek', level: 'A2' },
  { id: 'irv-a2-054', v1: 'sit', v2: 'sat', v3: 'sat', meaning: 'oturmak', level: 'A2' },
  { id: 'irv-a2-055', v1: 'sleep', v2: 'slept', v3: 'slept', meaning: 'uyumak', level: 'A2' },
  { id: 'irv-a2-056', v1: 'speak', v2: 'spoke', v3: 'spoken', meaning: 'konuşmak', level: 'A2' },
  { id: 'irv-a2-057', v1: 'spend', v2: 'spent', v3: 'spent', meaning: 'harcamak, geçirmek (zaman)', level: 'A2' },
  { id: 'irv-a2-058', v1: 'stand', v2: 'stood', v3: 'stood', meaning: 'ayakta durmak, katlanmak', level: 'A2' },
  { id: 'irv-a2-059', v1: 'swim', v2: 'swam', v3: 'swum', meaning: 'yüzmek', level: 'A2' },
  { id: 'irv-a2-060', v1: 'take', v2: 'took', v3: 'taken', meaning: 'almak, götürmek', level: 'A2' },
  { id: 'irv-a2-061', v1: 'teach', v2: 'taught', v3: 'taught', meaning: 'öğretmek', level: 'A2' },
  { id: 'irv-a2-062', v1: 'tell', v2: 'told', v3: 'told', meaning: 'anlatmak, söylemek', level: 'A2' },
  { id: 'irv-a2-063', v1: 'think', v2: 'thought', v3: 'thought', meaning: 'düşünmek, sanmak', level: 'A2' },
  { id: 'irv-a2-064', v1: 'throw', v2: 'threw', v3: 'thrown', meaning: 'atmak, fırlatmak', level: 'A2' },
  { id: 'irv-a2-065', v1: 'understand', v2: 'understood', v3: 'understood', meaning: 'anlamak', level: 'A2' },
  { id: 'irv-a2-066', v1: 'wake', v2: 'woke/waked', v3: 'woken/waked', meaning: 'uyanmak, uyandırmak', level: 'A2' },
  { id: 'irv-a2-067', v1: 'wear', v2: 'wore', v3: 'worn', meaning: 'giymek, takmak', level: 'A2' },
  { id: 'irv-a2-068', v1: 'win', v2: 'won', v3: 'won', meaning: 'kazanmak', level: 'A2' },
  { id: 'irv-a2-069', v1: 'write', v2: 'wrote', v3: 'written', meaning: 'yazmak', level: 'A2' },

  { id: 'irv-b1-001', v1: 'beat', v2: 'beat', v3: 'beaten', meaning: 'yenmek, dövmek, çarpmak (kalp)', level: 'B1' },
  { id: 'irv-b1-002', v1: 'bend', v2: 'bent', v3: 'bent', meaning: 'bükmek, eğilmek', level: 'B1' },
  { id: 'irv-b1-003', v1: 'bet', v2: 'bet', v3: 'bet', meaning: 'bahse girmek', level: 'B1' },
  { id: 'irv-b1-004', v1: 'bite', v2: 'bit', v3: 'bitten', meaning: 'ısırmak', level: 'B1' },
  { id: 'irv-b1-005', v1: 'bleed', v2: 'bled', v3: 'bled', meaning: 'kanamak', level: 'B1' },
  { id: 'irv-b1-006', v1: 'blow', v2: 'blew', v3: 'blown', meaning: 'üflemek, esmek', level: 'B1' },
  { id: 'irv-b1-007', v1: 'burn', v2: 'burned/burnt', v3: 'burned/burnt', meaning: 'yakmak, yanmak', level: 'B1' },
  { id: 'irv-b1-008', v1: 'burst', v2: 'burst', v3: 'burst', meaning: 'patlamak', level: 'B1' },
  { id: 'irv-b1-009', v1: 'deal', v2: 'dealt', v3: 'dealt', meaning: 'ilgilenmek, başa çıkmak, dağıtmak', level: 'B1' },
  { id: 'irv-b1-010', v1: 'dig', v2: 'dug', v3: 'dug', meaning: 'kazmak', level: 'B1' },
  { id: 'irv-b1-011', v1: 'dive', v2: 'dived/dove', v3: 'dived', meaning: 'dalmak (suya)', level: 'B1' },
  { id: 'irv-b1-012', v1: 'dream', v2: 'dreamed/dreamt', v3: 'dreamed/dreamt', meaning: 'rüya görmek, hayal kurmak', level: 'B1' },
  { id: 'irv-b1-013', v1: 'feed', v2: 'fed', v3: 'fed', meaning: 'beslemek', level: 'B1' },
  { id: 'irv-b1-014', v1: 'fight', v2: 'fought', v3: 'fought', meaning: 'savaşmak, kavga etmek, mücadele etmek', level: 'B1' },
  { id: 'irv-b1-015', v1: 'fit', v2: 'fit/fitted', v3: 'fit/fitted', meaning: 'uymak, tam gelmek (beden, ölçü)', level: 'B1' },
  { id: 'irv-b1-016', v1: 'forgive', v2: 'forgave', v3: 'forgiven', meaning: 'affetmek, bağışlamak', level: 'B1' },
  { id: 'irv-b1-017', v1: 'freeze', v2: 'froze', v3: 'frozen', meaning: 'donmak, dondurmak', level: 'B1' },
  { id: 'irv-b1-018', v1: 'hang', v2: 'hung/hanged', v3: 'hung/hanged', meaning: 'asmak, takılmak', level: 'B1' },
  { id: 'irv-b1-019', v1: 'hide', v2: 'hid', v3: 'hidden', meaning: 'saklamak, gizlenmek', level: 'B1' },
  { id: 'irv-b1-020', v1: 'kneel', v2: 'knelt/kneeled', v3: 'knelt/kneeled', meaning: 'diz çökmek', level: 'B1' },
  { id: 'irv-b1-021', v1: 'lay', v2: 'laid', v3: 'laid', meaning: 'sermek, koymak, yatırmak', level: 'B1' },
  { id: 'irv-b1-022', v1: 'lead', v2: 'led', v3: 'led', meaning: 'öncülük etmek, yol göstermek', level: 'B1' },
  { id: 'irv-b1-023', v1: 'lean', v2: 'leaned/leant', v3: 'leaned/leant', meaning: 'yaslanmak, eğilmek', level: 'B1' },
  { id: 'irv-b1-024', v1: 'lend', v2: 'lent', v3: 'lent', meaning: 'ödünç vermek', level: 'B1' },
  { id: 'irv-b1-025', v1: 'lie', v2: 'lay', v3: 'lain', meaning: 'uzanmak, yatmak', level: 'B1' },
  { id: 'irv-b1-026', v1: 'light', v2: 'lit/lighted', v3: 'lit/lighted', meaning: 'yakmak, aydınlatmak', level: 'B1' },
  { id: 'irv-b1-027', v1: 'prove', v2: 'proved', v3: 'proven/proved', meaning: 'kanıtlamak, ispat etmek', level: 'B1' },
  { id: 'irv-b1-028', v1: 'quit', v2: 'quit/quitted', v3: 'quit/quitted', meaning: 'bırakmak, istifa etmek', level: 'B1' },
  { id: 'irv-b1-029', v1: 'rise', v2: 'rose', v3: 'risen', meaning: 'yükselmek, doğmak (güneş)', level: 'B1' },
  { id: 'irv-b1-030', v1: 'seek', v2: 'sought', v3: 'sought', meaning: 'aramak, peşinde olmak', level: 'B1' },
  { id: 'irv-b1-031', v1: 'set', v2: 'set', v3: 'set', meaning: 'ayarlamak, kurmak, batmak (güneş)', level: 'B1' },
  { id: 'irv-b1-032', v1: 'shake', v2: 'shook', v3: 'shaken', meaning: 'sallamak, titremek', level: 'B1' },
  { id: 'irv-b1-033', v1: 'shine', v2: 'shone/shined', v3: 'shone/shined', meaning: 'parlamak, parlatmak', level: 'B1' },
  { id: 'irv-b1-034', v1: 'shoot', v2: 'shot', v3: 'shot', meaning: 'ateş etmek, şut çekmek, film çekmek', level: 'B1' },
  { id: 'irv-b1-035', v1: 'shrink', v2: 'shrank/shrunk', v3: 'shrunk', meaning: 'küçülmek, çekmek (kumaş)', level: 'B1' },
  { id: 'irv-b1-036', v1: 'sink', v2: 'sank', v3: 'sunk', meaning: 'batmak (suya)', level: 'B1' },
  { id: 'irv-b1-037', v1: 'slide', v2: 'slid', v3: 'slid', meaning: 'kaymak, kaydırmak', level: 'B1' },
  { id: 'irv-b1-038', v1: 'smell', v2: 'smelled/smelt', v3: 'smelled/smelt', meaning: 'kokmak, koklamak', level: 'B1' },
  { id: 'irv-b1-039', v1: 'speed', v2: 'sped/speeded', v3: 'sped/speeded', meaning: 'hız yapmak, hızlandırmak', level: 'B1' },
  { id: 'irv-b1-040', v1: 'spell', v2: 'spelled/spelt', v3: 'spelled/spelt', meaning: 'hecelemek, harf harf kodlamak', level: 'B1' },
  { id: 'irv-b1-041', v1: 'spill', v2: 'spilled/spilt', v3: 'spilled/spilt', meaning: 'dökmek, dökülmek (sıvı)', level: 'B1' },
  { id: 'irv-b1-042', v1: 'spin', v2: 'spun', v3: 'spun', meaning: 'dönmek, döndürmek', level: 'B1' },
  { id: 'irv-b1-043', v1: 'spit', v2: 'spat/spit', v3: 'spat/spit', meaning: 'tükürmek', level: 'B1' },
  { id: 'irv-b1-044', v1: 'split', v2: 'split', v3: 'split', meaning: 'bölmek, ayırmak, yarılmak', level: 'B1' },
  { id: 'irv-b1-045', v1: 'spoil', v2: 'spoiled/spoilt', v3: 'spoiled/spoilt', meaning: 'bozmak, şımartmak', level: 'B1' },
  { id: 'irv-b1-046', v1: 'spread', v2: 'spread', v3: 'spread', meaning: 'yaymak, yayılmak, sürmek', level: 'B1' },
  { id: 'irv-b1-047', v1: 'steal', v2: 'stole', v3: 'stolen', meaning: 'çalmak, hırsızlık yapmak', level: 'B1' },
  { id: 'irv-b1-048', v1: 'stick', v2: 'stuck', v3: 'stuck', meaning: 'yapıştırmak, saplamak, sıkışmak', level: 'B1' },
  { id: 'irv-b1-049', v1: 'sting', v2: 'stung', v3: 'stung', meaning: 'sokmak (arı, böcek), sızlamak', level: 'B1' },
  { id: 'irv-b1-050', v1: 'strike', v2: 'struck', v3: 'struck/stricken', meaning: 'çarpmak, vurmak, grev yapmak', level: 'B1' },
  { id: 'irv-b1-051', v1: 'swear', v2: 'swore', v3: 'sworn', meaning: 'yemin etmek, küfretmek', level: 'B1' },
  { id: 'irv-b1-052', v1: 'sweep', v2: 'swept', v3: 'swept', meaning: 'süpürmek', level: 'B1' },
  { id: 'irv-b1-053', v1: 'swing', v2: 'swung', v3: 'swung', meaning: 'sallanmak, sallamak', level: 'B1' },
  { id: 'irv-b1-054', v1: 'tear', v2: 'tore', v3: 'torn', meaning: 'yırtmak, koparmak', level: 'B1' },
  { id: 'irv-b1-055', v1: 'upset', v2: 'upset', v3: 'upset', meaning: 'üzmek, altüst etmek', level: 'B1' },
  { id: 'irv-b1-056', v1: 'wet', v2: 'wet/wetted', v3: 'wet/wetted', meaning: 'ıslatmak', level: 'B1' },
  { id: 'irv-b1-057', v1: 'wind', v2: 'wound', v3: 'wound', meaning: 'sarmak, kurmak (saat), kıvrılmak', level: 'B1' },

  { id: 'irv-b2-001', v1: 'arise', v2: 'arose', v3: 'arisen', meaning: 'ortaya çıkmak, doğmak (sorun, fırsat)', level: 'B2' },
  { id: 'irv-b2-002', v1: 'awake', v2: 'awoke', v3: 'awoken', meaning: 'uyanmak, uyandırmak, farkına varmak', level: 'B2' },
  { id: 'irv-b2-003', v1: 'bear', v2: 'bore', v3: 'borne/born', meaning: 'katlanmak, taşımak, doğurmak', level: 'B2' },
  { id: 'irv-b2-004', v1: 'bid', v2: 'bid/bade', v3: 'bid/bidden', meaning: 'teklif vermek (açık artırma), dilemek', level: 'B2' },
  { id: 'irv-b2-005', v1: 'bind', v2: 'bound', v3: 'bound', meaning: 'bağlamak, ciltlemek, zorunlu kılmak', level: 'B2' },
  { id: 'irv-b2-006', v1: 'breed', v2: 'bred', v3: 'bred', meaning: 'yetiştirmek, üretmek (hayvan), yol açmak', level: 'B2' },
  { id: 'irv-b2-007', v1: 'broadcast', v2: 'broadcast', v3: 'broadcast', meaning: 'yayın yapmak (radyo, TV)', level: 'B2' },
  { id: 'irv-b2-008', v1: 'cast', v2: 'cast', v3: 'cast', meaning: 'atmak, rol vermek, gölge düşürmek', level: 'B2' },
  { id: 'irv-b2-009', v1: 'cling', v2: 'clung', v3: 'clung', meaning: 'sıkıca tutunmak, yapışmak', level: 'B2' },
  { id: 'irv-b2-010', v1: 'creep', v2: 'crept', v3: 'crept', meaning: 'sürünmek, sessizce yaklaşmak', level: 'B2' },
  { id: 'irv-b2-011', v1: 'dwell', v2: 'dwelt/dwelled', v3: 'dwelt/dwelled', meaning: 'ikamet etmek, üzerinde durmak', level: 'B2' },
  { id: 'irv-b2-012', v1: 'flee', v2: 'fled', v3: 'fled', meaning: 'kaçmak (tehlikeden)', level: 'B2' },
  { id: 'irv-b2-013', v1: 'fling', v2: 'flung', v3: 'flung', meaning: 'savurmak, hızla fırlatmak', level: 'B2' },
  { id: 'irv-b2-014', v1: 'forbid', v2: 'forbade', v3: 'forbidden', meaning: 'yasaklamak', level: 'B2' },
  { id: 'irv-b2-015', v1: 'forecast', v2: 'forecast/forecasted', v3: 'forecast/forecasted', meaning: 'tahmin etmek (hava, ekonomi)', level: 'B2' },
  { id: 'irv-b2-016', v1: 'foresee', v2: 'foresaw', v3: 'foreseen', meaning: 'öngörmek, önceden sezmek', level: 'B2' },
  { id: 'irv-b2-017', v1: 'grind', v2: 'ground', v3: 'ground', meaning: 'öğütmek, ezmek, bilemek', level: 'B2' },
  { id: 'irv-b2-018', v1: 'input', v2: 'input/inputted', v3: 'input/inputted', meaning: 'veri girmek', level: 'B2' },
  { id: 'irv-b2-019', v1: 'interweave', v2: 'interwove', v3: 'interwoven', meaning: 'birbirine örmek, kaynaştırmak', level: 'B2' },
  { id: 'irv-b2-020', v1: 'knit', v2: 'knitted/knit', v3: 'knitted/knit', meaning: 'örgü örmek, kaynaşmak', level: 'B2' },
  { id: 'irv-b2-021', v1: 'leap', v2: 'leaped/leapt', v3: 'leaped/leapt', meaning: 'sıçramak, atlamak', level: 'B2' },
  { id: 'irv-b2-022', v1: 'mislead', v2: 'misled', v3: 'misled', meaning: 'yanıltmak, yanlış yönlendirmek', level: 'B2' },
  { id: 'irv-b2-023', v1: 'mistake', v2: 'mistook', v3: 'mistaken', meaning: 'yanlış anlamak, karıştırmak', level: 'B2' },
  { id: 'irv-b2-024', v1: 'misunderstand', v2: 'misunderstood', v3: 'misunderstood', meaning: 'yanlış anlamak', level: 'B2' },
  { id: 'irv-b2-025', v1: 'offset', v2: 'offset', v3: 'offset', meaning: 'dengelemek, telafi etmek', level: 'B2' },
  { id: 'irv-b2-026', v1: 'overcome', v2: 'overcame', v3: 'overcome', meaning: 'üstesinden gelmek, aşmak', level: 'B2' },
  { id: 'irv-b2-027', v1: 'overdo', v2: 'overdid', v3: 'overdone', meaning: 'abartmak, aşırıya kaçmak', level: 'B2' },
  { id: 'irv-b2-028', v1: 'overhear', v2: 'overheard', v3: 'overheard', meaning: 'kulak misafiri olmak', level: 'B2' },
  { id: 'irv-b2-029', v1: 'oversee', v2: 'oversaw', v3: 'overseen', meaning: 'gözetlemek, denetlemek', level: 'B2' },
  { id: 'irv-b2-030', v1: 'oversleep', v2: 'overslept', v3: 'overslept', meaning: 'uyuyakalmak', level: 'B2' },
  { id: 'irv-b2-031', v1: 'overtake', v2: 'overtook', v3: 'overtaken', meaning: 'sollamak, yetişip geçmek', level: 'B2' },
  { id: 'irv-b2-032', v1: 'overthrow', v2: 'overthrew', v3: 'overthrown', meaning: 'devirmek (yönetim, iktidar)', level: 'B2' },
  { id: 'irv-b2-033', v1: 'partake', v2: 'partook', v3: 'partaken', meaning: 'katılmak, yer almak', level: 'B2' },
  { id: 'irv-b2-034', v1: 'plead', v2: 'pleaded/pled', v3: 'pleaded/pled', meaning: 'yalvarmak, savunma yapmak (mahkeme)', level: 'B2' },
  { id: 'irv-b2-035', v1: 'preset', v2: 'preset', v3: 'preset', meaning: 'önceden ayarlamak', level: 'B2' },
  { id: 'irv-b2-036', v1: 'redo', v2: 'redid', v3: 'redone', meaning: 'yeniden yapmak', level: 'B2' },
  { id: 'irv-b2-037', v1: 'rebuild', v2: 'rebuilt', v3: 'rebuilt', meaning: 'yeniden inşa etmek', level: 'B2' },
  { id: 'irv-b2-038', v1: 'repay', v2: 'repaid', v3: 'repaid', meaning: 'geri ödemek, karşılığını vermek', level: 'B2' },
  { id: 'irv-b2-039', v1: 'rewrite', v2: 'rewrote', v3: 'rewritten', meaning: 'yeniden yazmak', level: 'B2' },
  { id: 'irv-b2-040', v1: 'rid', v2: 'rid', v3: 'rid', meaning: 'kurtarmak, başından savmak', level: 'B2' },
  { id: 'irv-b2-041', v1: 'saw', v2: 'sawed', v3: 'sawn/sawed', meaning: 'testere ile kesmek', level: 'B2' },
  { id: 'irv-b2-042', v1: 'sew', v2: 'sewed', v3: 'sewn/sewed', meaning: 'dikmek (dikiş)', level: 'B2' },
  { id: 'irv-b2-043', v1: 'shed', v2: 'shed', v3: 'shed', meaning: 'dökmek (yaprak, gözyaşı, ışık)', level: 'B2' },
  { id: 'irv-b2-044', v1: 'slay', v2: 'slew', v3: 'slain', meaning: 'katletmek, öldürmek', level: 'B2' },
  { id: 'irv-b2-045', v1: 'sling', v2: 'slung', v3: 'slung', meaning: 'fırlatmak, asmak (omza)', level: 'B2' },
  { id: 'irv-b2-046', v1: 'slit', v2: 'slit', v3: 'slit', meaning: 'uzunlamasına kesmek, yarmak', level: 'B2' },
  { id: 'irv-b2-047', v1: 'sow', v2: 'sowed', v3: 'sown/sowed', meaning: 'tohum ekmek', level: 'B2' },
  { id: 'irv-b2-048', v1: 'spring', v2: 'sprang/sprung', v3: 'sprung', meaning: 'sıçramak, fırlamak, kaynaklanmak', level: 'B2' },
  { id: 'irv-b2-049', v1: 'stride', v2: 'strode', v3: 'stridden', meaning: 'uzun adımlarla yürümek', level: 'B2' },
  { id: 'irv-b2-050', v1: 'strive', v2: 'strove/strived', v3: 'striven/strived', meaning: 'çabalamak, uğraşmak', level: 'B2' },
  { id: 'irv-b2-051', v1: 'swell', v2: 'swelled', v3: 'swollen/swelled', meaning: 'şişmek, kabarmak, artmak', level: 'B2' },
  { id: 'irv-b2-052', v1: 'thrive', v2: 'throve/thrived', v3: 'thriven/thrived', meaning: 'gelişmek, serpilmek, başarılı olmak', level: 'B2' },
  { id: 'irv-b2-053', v1: 'tread', v2: 'trod', v3: 'trodden/trod', meaning: 'ayak basmak, çiğnemek', level: 'B2' },
  { id: 'irv-b2-054', v1: 'undergo', v2: 'underwent', v3: 'undergone', meaning: 'geçirmek, maruz kalmak (ameliyat, değişim)', level: 'B2' },
  { id: 'irv-b2-055', v1: 'undertake', v2: 'undertook', v3: 'undertaken', meaning: 'üstlenmek, girişmek', level: 'B2' },
  { id: 'irv-b2-056', v1: 'undo', v2: 'undid', v3: 'undone', meaning: 'çözmek, geri almak, bozmak', level: 'B2' },
  { id: 'irv-b2-057', v1: 'uphold', v2: 'upheld', v3: 'upheld', meaning: 'desteklemek, sürdürmek, onaylamak', level: 'B2' },
  { id: 'irv-b2-058', v1: 'weave', v2: 'wove/weaved', v3: 'woven/weaved', meaning: 'dokumak, örmek', level: 'B2' },
  { id: 'irv-b2-059', v1: 'wed', v2: 'wed/wedded', v3: 'wed/wedded', meaning: 'evlenmek, nikâh kıymak', level: 'B2' },
  { id: 'irv-b2-060', v1: 'weep', v2: 'wept', v3: 'wept', meaning: 'ağlamak, gözyaşı dökmek', level: 'B2' },
  { id: 'irv-b2-061', v1: 'withdraw', v2: 'withdrew', v3: 'withdrawn', meaning: 'geri çekmek, para çekmek', level: 'B2' },
  { id: 'irv-b2-062', v1: 'withhold', v2: 'withheld', v3: 'withheld', meaning: 'esirgemek, alıkoymak, vermemek', level: 'B2' },
  { id: 'irv-b2-063', v1: 'withstand', v2: 'withstood', v3: 'withstood', meaning: 'dayanmak, direnmek, karşı koymak', level: 'B2' },
  { id: 'irv-b2-064', v1: 'wring', v2: 'wrung', v3: 'wrung', meaning: 'sıkmak, burkmak (çamaşır, el)', level: 'B2' },
];

/* ---------- Kullanıcı Kimliği (User Scoping) ---------- */
export function getActiveIrregularUserId() {
  const u = getCurrentUser();
  return u && u.uid ? u.uid : 'guest';
}

/* ---------- Doğrulama & Biçim Kontrolü (Validation & Multi-Form Check) ---------- */
const VERB_FORM_RE = /^[A-Za-z][A-Za-z '’\-/]*$/;

export function validateIrregularVerb(v) {
  const errs = [];
  if (!v || typeof v !== 'object') return ['Geçersiz fiil kaydı'];
  const v1 = String(v.v1 || '').trim();
  const v2 = String(v.v2 || '').trim();
  const v3 = String(v.v3 || '').trim();
  const meaning = String(v.meaning || '').trim();

  if (!v1) errs.push('V1 (1. hal) boş olamaz');
  else if (!VERB_FORM_RE.test(v1)) errs.push('V1 yalnızca İngilizce harf içermelidir');

  if (!v2) errs.push('V2 (2. hal) boş olamaz');
  else if (!VERB_FORM_RE.test(v2)) errs.push('V2 yalnızca İngilizce harf ve / içermelidir');

  if (!v3) errs.push('V3 (3. hal) boş olamaz');
  else if (!VERB_FORM_RE.test(v3)) errs.push('V3 yalnızca İngilizce harf ve / içermelidir');

  if (!meaning) errs.push('Türkçe anlam boş olamaz');

  return errs;
}

/**
 * Birden fazla geçerli biçimi olan fiilleri (örn: "learned/learnt", "was/were", "got/gotten") destekler.
 * Kullanıcı "learned", "learnt" veya "learned/learnt" yazarsa doğru kabul edilir.
 */
export function parseAcceptedForms(rawForm) {
  const clean = String(rawForm || '').trim();
  if (!clean) return [];
  const parts = clean
    .split(/[\/,;]/)
    .map((x) => E.norm(x))
    .filter(Boolean);
  const fullSlash = parts.join('/');
  const set = new Set(parts);
  if (parts.length > 1) {
    set.add(fullSlash);
    set.add([...parts].reverse().join('/'));
  }
  return [...set];
}

export function checkVerbFormAnswer(expectedRaw, userInput) {
  const inp = E.norm(userInput).replace(/\s*\/\s*/g, '/');
  if (!inp) return false;
  const accepted = parseAcceptedForms(expectedRaw);
  if (accepted.includes(inp)) return true;
  if (inp.includes('/')) {
    const userParts = inp.split('/').map((x) => E.norm(x)).filter(Boolean);
    const baseParts = String(expectedRaw || '').split(/[\/,;]/).map((x) => E.norm(x)).filter(Boolean);
    if (userParts.length > 0 && userParts.every((up) => baseParts.includes(up))) return true;
  }
  return false;
}

/* ---------- Hazır Fiiller Erişimi ---------- */
export function getBuiltInIrregularVerbs(level = '') {
  if (!level) return [...BUILTIN_IRREGULAR_VERBS];
  return BUILTIN_IRREGULAR_VERBS.filter((v) => v.level === level);
}

/* ---------- Manuel Listeler ve Kişisel Fiiller (Depolama) ---------- */
export function getAllIrregularLists() {
  return Array.isArray(state.meta?.irregularLists) ? [...state.meta.irregularLists] : [];
}

export function getUserIrregularLists(userId = getActiveIrregularUserId()) {
  return getAllIrregularLists().filter((l) => l && l.userId === userId);
}

export async function saveAllIrregularLists(lists) {
  state.meta.irregularLists = lists;
  await saveData('meta', { key: 'irregularLists', value: lists });
  return lists;
}

export function getAllCustomIrregularVerbs() {
  return Array.isArray(state.meta?.irregularCustomVerbs) ? [...state.meta.irregularCustomVerbs] : [];
}

export function getUserCustomIrregularVerbs(userId = getActiveIrregularUserId()) {
  return getAllCustomIrregularVerbs().filter((v) => v && v.userId === userId);
}

export async function saveAllCustomIrregularVerbs(verbs) {
  state.meta.irregularCustomVerbs = verbs;
  await saveData('meta', { key: 'irregularCustomVerbs', value: verbs });
  return verbs;
}

/* ---------- Manuel Liste Oluşturma / Düzenleme / Silme ---------- */
export async function createIrregularList(name, userId = getActiveIrregularUserId()) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return { ok: false, error: 'Liste adı boş olamaz.' };
  const all = getAllIrregularLists();
  const userLists = all.filter((l) => l.userId === userId);
  if (userLists.some((l) => l.name.toLowerCase() === trimmed.toLowerCase())) {
    return { ok: false, error: 'Bu isimde bir fiil listeniz zaten mevcut.' };
  }
  const now = new Date().toISOString();
  const id = `irlist_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const newList = {
    id,
    userId,
    name: trimmed,
    verbIds: [],
    createdAt: now,
    updatedAt: now,
  };
  all.push(newList);
  await saveAllIrregularLists(all);
  return { ok: true, list: newList };
}

export async function updateIrregularList(listId, { name } = {}) {
  const all = getAllIrregularLists();
  const idx = all.findIndex((l) => l.id === listId);
  if (idx < 0) return { ok: false, error: 'Liste bulunamadı.' };
  const list = all[idx];
  if (name !== undefined) {
    const trimmed = String(name || '').trim();
    if (!trimmed) return { ok: false, error: 'Liste adı boş olamaz.' };
    const others = all.filter((l) => l.userId === list.userId && l.id !== listId);
    if (others.some((l) => l.name.toLowerCase() === trimmed.toLowerCase())) {
      return { ok: false, error: 'Bu isimde bir fiil listeniz zaten var.' };
    }
    list.name = trimmed;
  }
  list.updatedAt = new Date().toISOString();
  all[idx] = list;
  await saveAllIrregularLists(all);
  return { ok: true, list };
}

export async function deleteIrregularList(listId) {
  const all = getAllIrregularLists();
  const target = all.find((l) => l.id === listId);
  if (!target) return { ok: false, error: 'Liste bulunamadı.' };
  const userId = target.userId;
  const remaining = all.filter((l) => l.id !== listId);
  await saveAllIrregularLists(remaining);

  const otherLists = remaining.filter((l) => l.userId === userId);
  const activeVerbIds = new Set(otherLists.flatMap((l) => l.verbIds || []));
  const allVerbs = getAllCustomIrregularVerbs();
  const keptVerbs = allVerbs.filter((v) => v.userId !== userId || activeVerbIds.has(v.id));
  await saveAllCustomIrregularVerbs(keptVerbs);

  return { ok: true };
}

/* ---------- Manuel Fiil Ekleme (Tekil & Çoklu Liste Paylaşımlı) ---------- */
export async function addVerbToIrregularList({ v1, v2, v3, meaning, listId, userId = getActiveIrregularUserId() }) {
  const candidate = {
    v1: String(v1 || '').trim().toLowerCase(),
    v2: String(v2 || '').trim().toLowerCase(),
    v3: String(v3 || '').trim().toLowerCase(),
    meaning: String(meaning || '').trim(),
  };

  const errs = validateIrregularVerb(candidate);
  if (errs.length) return { ok: false, error: errs.join(' · ') };

  const allLists = getAllIrregularLists();
  const list = allLists.find((l) => l.id === listId && l.userId === userId);
  if (!list) return { ok: false, error: 'Hedef liste bulunamadı.' };

  const allVerbs = getAllCustomIrregularVerbs();
  const userVerbs = allVerbs.filter((v) => v.userId === userId);

  // Aynı kullanıcı daha önce aynı V1 fiilini eklediyse aynı kaydı paylaş (ilerleme sıfırlanmaz)
  let targetVerb = userVerbs.find((v) => E.norm(v.v1) === E.norm(candidate.v1));
  let isNew = false;

  if (targetVerb) {
    if (list.verbIds.includes(targetVerb.id)) {
      return { ok: false, error: `"${candidate.v1}" fiili bu listede zaten mevcut.` };
    }
    // Kullanıcı V2/V3/anlam güncellediyse tamamla
    targetVerb.v2 = candidate.v2 || targetVerb.v2;
    targetVerb.v3 = candidate.v3 || targetVerb.v3;
    targetVerb.meaning = candidate.meaning || targetVerb.meaning;
    targetVerb.updatedAt = new Date().toISOString();
  } else {
    const now = new Date().toISOString();
    targetVerb = {
      id: `irv_custom_${userId}_${candidate.v1.replace(/[^a-z0-9]+/g, '-')}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
      userId,
      v1: candidate.v1,
      v2: candidate.v2,
      v3: candidate.v3,
      meaning: candidate.meaning,
      level: 'CUSTOM',
      custom: true,
      createdAt: now,
      updatedAt: now,
    };
    allVerbs.push(targetVerb);
    isNew = true;
  }

  list.verbIds.push(targetVerb.id);
  list.updatedAt = new Date().toISOString();

  await saveAllCustomIrregularVerbs(allVerbs);
  await saveAllIrregularLists(allLists);

  return { ok: true, verb: targetVerb, list, isNew };
}

export async function removeVerbFromIrregularList(listId, verbId, userId = getActiveIrregularUserId()) {
  const allLists = getAllIrregularLists();
  const list = allLists.find((l) => l.id === listId && l.userId === userId);
  if (!list) return { ok: false, error: 'Liste bulunamadı.' };

  list.verbIds = (list.verbIds || []).filter((id) => id !== verbId);
  list.updatedAt = new Date().toISOString();
  await saveAllIrregularLists(allLists);

  const otherLists = allLists.filter((l) => l.userId === userId && l.id !== listId);
  const stillUsed = otherLists.some((l) => (l.verbIds || []).includes(verbId));
  if (!stillUsed) {
    const allVerbs = getAllCustomIrregularVerbs();
    await saveAllCustomIrregularVerbs(allVerbs.filter((v) => v.id !== verbId));
  }
  return { ok: true };
}

/* ---------- Toplu Ekleme & Dosya (TXT / CSV / XLSX) Ayrıştırıcı ---------- */
const IRREGULAR_HEADERS = new Set([
  'v1', 'v2', 'v3', 'base', 'base form', 'past', 'past simple', 'past participle', 'participle',
  'meaning', 'anlam', 'türkçe', 'turkce', 'tr', 'fiil', 'infinitive',
]);

function isHeaderRow(parts) {
  if (!Array.isArray(parts) || parts.length < 2) return false;
  const matches = parts.filter((p) => IRREGULAR_HEADERS.has(String(p || '').trim().toLowerCase())).length;
  return matches >= 2;
}

function splitVerbLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return [];
  if (trimmed.includes('\t')) return trimmed.split('\t').map((s) => s.trim());
  if (/\s+[-–—:=]\s+/.test(trimmed)) return trimmed.split(/\s+[-–—:=]\s+/).map((s) => s.trim());
  if (trimmed.includes(';')) return trimmed.split(';').map((s) => s.trim());
  if (trimmed.split('-').length >= 4) {
    const dashParts = trimmed.split('-').map((s) => s.trim());
    return [dashParts[0], dashParts[1], dashParts[2], dashParts.slice(3).join(' - ')];
  }
  if (trimmed.split(',').length >= 4) {
    const commaParts = parseCSV(trimmed, ',')[0] || [];
    if (commaParts.length >= 4) {
      return [commaParts[0], commaParts[1], commaParts[2], commaParts.slice(3).join(', ')];
    }
  }
  return [trimmed];
}

export function parseBulkIrregularVerbs(inputData, currentListVerbIds = [], existingUserVerbs = []) {
  let rawRows = [];
  if (Array.isArray(inputData)) {
    rawRows = inputData.map((r, idx) => ({
      lineNum: idx + 1,
      parts: Array.isArray(r) ? r.map((x) => String(x ?? '').trim()) : splitVerbLine(String(r ?? '')),
      rawLine: Array.isArray(r) ? r.join(' - ') : String(r ?? ''),
    }));
  } else {
    const lines = String(inputData || '').replace(/^\uFEFF/, '').split(/\r?\n/);
    lines.forEach((line, idx) => {
      if (!line.trim()) return;
      rawRows.push({
        lineNum: idx + 1,
        parts: splitVerbLine(line),
        rawLine: line.trim(),
      });
    });
  }

  if (rawRows.length > 0 && isHeaderRow(rawRows[0].parts)) {
    rawRows = rawRows.slice(1);
  }

  const results = [];
  const seenInBatch = new Set();
  const existingMap = new Map(existingUserVerbs.map((v) => [E.norm(v.v1), v]));
  const listIdSet = new Set(currentListVerbIds);

  for (const row of rawRows) {
    const { lineNum, parts, rawLine } = row;
    if (!parts.length || parts.every((p) => !p)) continue;

    if (parts.length < 4) {
      results.push({
        lineNum,
        rawLine,
        v1: parts[0] || '',
        v2: parts[1] || '',
        v3: parts[2] || '',
        meaning: parts[3] || '',
        status: 'error',
        message: 'Eksik alan (V1 - V2 - V3 - Türkçe anlam gerekli)',
      });
      continue;
    }

    const v1 = parts[0].trim().toLowerCase();
    const v2 = parts[1].trim().toLowerCase();
    const v3 = parts[2].trim().toLowerCase();
    const meaning = parts.slice(3).join(', ').trim();

    const vErrs = validateIrregularVerb({ v1, v2, v3, meaning });
    if (vErrs.length) {
      results.push({
        lineNum,
        rawLine,
        v1,
        v2,
        v3,
        meaning,
        status: 'error',
        message: vErrs[0],
      });
      continue;
    }

    const normKey = E.norm(v1);
    if (seenInBatch.has(normKey)) {
      results.push({
        lineNum,
        rawLine,
        v1,
        v2,
        v3,
        meaning,
        status: 'dup',
        message: 'Giriş içinde tekrar eden fiil',
      });
      continue;
    }
    seenInBatch.add(normKey);

    const existingVerb = existingMap.get(normKey);
    if (existingVerb && listIdSet.has(existingVerb.id)) {
      results.push({
        lineNum,
        rawLine,
        v1,
        v2,
        v3,
        meaning,
        status: 'dup',
        message: 'Bu fiil listede zaten mevcut',
      });
      continue;
    }

    results.push({
      lineNum,
      rawLine,
      v1,
      v2,
      v3,
      meaning,
      status: 'ok',
      message: 'Hazır',
    });
  }

  return results;
}

export async function bulkAddVerbsToIrregularList({ items, listId, userId = getActiveIrregularUserId() }) {
  if (!Array.isArray(items) || !items.length) {
    return { ok: false, error: 'Eklenecek fiil bulunamadı.' };
  }

  const allLists = getAllIrregularLists();
  const list = allLists.find((l) => l.id === listId && l.userId === userId);
  if (!list) return { ok: false, error: 'Hedef liste bulunamadı.' };

  const allVerbs = getAllCustomIrregularVerbs();
  const userVerbs = allVerbs.filter((v) => v.userId === userId);
  const userVerbMap = new Map(userVerbs.map((v) => [E.norm(v.v1), v]));

  let addedCount = 0;

  for (const item of items) {
    if (item.status === 'error' || item.status === 'dup') continue;
    const v1 = String(item.v1 || '').trim().toLowerCase();
    const v2 = String(item.v2 || '').trim().toLowerCase();
    const v3 = String(item.v3 || '').trim().toLowerCase();
    const meaning = String(item.meaning || '').trim();
    if (validateIrregularVerb({ v1, v2, v3, meaning }).length > 0) continue;

    const normKey = E.norm(v1);
    let verbObj = userVerbMap.get(normKey);

    if (!verbObj) {
      const now = new Date().toISOString();
      verbObj = {
        id: `irv_custom_${userId}_${v1.replace(/[^a-z0-9]+/g, '-')}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
        userId,
        v1,
        v2,
        v3,
        meaning,
        level: 'CUSTOM',
        custom: true,
        createdAt: now,
        updatedAt: now,
      };
      allVerbs.push(verbObj);
      userVerbMap.set(normKey, verbObj);
    }

    if (!list.verbIds.includes(verbObj.id)) {
      list.verbIds.push(verbObj.id);
      addedCount++;
    }
  }

  list.updatedAt = new Date().toISOString();
  await saveAllCustomIrregularVerbs(allVerbs);
  await saveAllIrregularLists(allLists);

  return { ok: true, addedCount, list };
}

/* ---------- SRS & Form Bazlı (V2 / V3) İlerleme Sistemi ---------- */
export function getVerbCanonicalKey(verbOrV1) {
  if (typeof verbOrV1 === 'string') return E.norm(verbOrV1);
  return E.norm(verbOrV1?.v1 || verbOrV1?.id || '');
}

export function newVerbProgress(verbOrV1, userId = getActiveIrregularUserId()) {
  const v1 = getVerbCanonicalKey(verbOrV1);
  return {
    key: `${userId}::${v1}`,
    userId,
    v1,
    status: 'NEW', // 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED'
    learned: false,
    srsStep: 0,
    reviewInterval: 0,
    lastReviewedAt: null,
    nextReviewAt: null,
    correctCount: 0,
    incorrectCount: 0,
    consecutiveCorrect: 0,
    v2Correct: 0,
    v2Wrong: 0,
    v3Correct: 0,
    v3Wrong: 0,
    meaningCorrect: 0,
    meaningWrong: 0,
    lastMistakeForm: null, // 'v2' | 'v3' | 'meaning' | null
    mistakeHistory: [],
  };
}

export function getAllIrregularProgressMap() {
  return state.meta?.irregularProgress && typeof state.meta.irregularProgress === 'object'
    ? { ...state.meta.irregularProgress }
    : {};
}

export function getVerbProgress(verbOrV1, userId = getActiveIrregularUserId()) {
  const v1 = getVerbCanonicalKey(verbOrV1);
  const k = `${userId}::${v1}`;
  const map = getAllIrregularProgressMap();
  const existing = map[k];
  return existing ? { ...newVerbProgress(v1, userId), ...existing } : newVerbProgress(v1, userId);
}

export async function saveVerbProgress(prog) {
  if (!prog || !prog.key) return prog;
  const map = getAllIrregularProgressMap();
  map[prog.key] = prog;
  state.meta.irregularProgress = map;
  await saveData('meta', { key: 'irregularProgress', value: map });
  return prog;
}

export function isVerbDue(p, now = Date.now()) {
  if (!p) return false;
  if (p.status === 'REVIEW') return true;
  return Boolean(p.learned && p.nextReviewAt !== null && p.nextReviewAt <= now);
}

/**
 * Fiil cevabını işler ve V2/V3 hata geçmişi ile SRS (1 -> 3 -> 7 -> 14 -> 30 gün) takvimini günceller.
 */
export async function applyVerbAnswer(verbOrV1, ok, { form = 'v2', mode = 'test', input = '' } = {}, now = Date.now(), userId = getActiveIrregularUserId()) {
  const p = getVerbProgress(verbOrV1, userId);
  p.lastReviewedAt = now;

  if (form === 'card') {
    if (ok) {
      p.learned = true;
      p.correctCount++;
      p.consecutiveCorrect++;
      if (!p.nextReviewAt) {
        p.srsStep = 0;
        p.reviewInterval = E.INTERVALS[0]; // 1 gün
        p.nextReviewAt = now + E.DAY;
      }
      if (p.status === 'NEW') p.status = 'LEARNING';
    } else {
      p.status = 'REVIEW';
      p.nextReviewAt = now;
    }
    await saveVerbProgress(p);
    return p;
  }

  // V2 / V3 / Anlam ayrı takip
  if (form === 'v2') {
    if (ok) p.v2Correct++;
    else { p.v2Wrong++; p.lastMistakeForm = 'v2'; }
  } else if (form === 'v3') {
    if (ok) p.v3Correct++;
    else { p.v3Wrong++; p.lastMistakeForm = 'v3'; }
  } else {
    if (ok) p.meaningCorrect++;
    else { p.meaningWrong++; p.lastMistakeForm = 'meaning'; }
  }

  if (ok) {
    p.correctCount++;
    p.consecutiveCorrect++;
    // Eğer V2 veya V3 zayıflığı giderildiyse lastMistakeForm temizle
    if (p.lastMistakeForm === form) p.lastMistakeForm = null;

    // SRS ilerletme: 1 -> 3 -> 7 -> 14 -> 30 gün
    const stepIndex = Math.min(p.srsStep, E.INTERVALS.length - 1);
    p.reviewInterval = E.INTERVALS[stepIndex];
    p.nextReviewAt = now + p.reviewInterval * E.DAY;
    p.srsStep = Math.min(E.INTERVALS.length - 1, p.srsStep + 1);
    p.learned = true;
    p.status = p.srsStep >= 4 && p.consecutiveCorrect >= 3 ? 'MASTERED' : 'LEARNING';
  } else {
    p.incorrectCount++;
    p.consecutiveCorrect = 0;
    p.status = 'REVIEW';
    p.srsStep = Math.max(0, p.srsStep - 1);
    p.reviewInterval = E.INTERVALS[0]; // Hata durumunda 1 güne çekilir
    p.nextReviewAt = now; // Tekrar listesinde hemen önceliklendirilir
    p.mistakeHistory.push({ at: now, form, input: String(input || '') });
    if (p.mistakeHistory.length > 100) p.mistakeHistory.shift();
  }

  await saveVerbProgress(p);
  return p;
}

/**
 * Kullanıcının bir fiilde V2 mi yoksa V3 mü karıştırdığını analiz ederek soru biçimini ağırlıklandırır.
 * Örneğin V2 biliniyor ama V3 yanlış yapılıyorsa V3 sorusuna öncelik verir.
 */
export function selectWeightedFormForVerb(verb, userId = getActiveIrregularUserId(), rnd = Math.random) {
  const p = getVerbProgress(verb, userId);
  const v2Weakness = p.v2Wrong * 2 - p.v2Correct + (p.lastMistakeForm === 'v2' ? 3 : 0);
  const v3Weakness = p.v3Wrong * 2 - p.v3Correct + (p.lastMistakeForm === 'v3' ? 3 : 0);

  if (v3Weakness > v2Weakness && p.v3Wrong > 0) return 'v3';
  if (v2Weakness > v3Weakness && p.v2Wrong > 0) return 'v2';
  if (p.lastMistakeForm === 'meaning') return 'meaning';

  const pool = ['v2', 'v3', 'v2', 'v3', 'meaning'];
  return pool[Math.floor(rnd() * pool.length)];
}

/* ---------- Soru Üretici (V2, V3, Karışık, Yanlışlarım) ---------- */
export function buildIrregularQuestion(verb, mode = 'mixed', allVerbs = BUILTIN_IRREGULAR_VERBS, userId = getActiveIrregularUserId(), rnd = Math.random) {
  let targetForm = mode;
  let format = 'typing'; // 'typing' | 'mc'

  if (mode === 'v2') {
    targetForm = 'v2';
    format = 'typing';
  } else if (mode === 'v3') {
    targetForm = 'v3';
    format = 'typing';
  } else if (mode === 'mistakes' || mode === 'srs') {
    targetForm = selectWeightedFormForVerb(verb, userId, rnd);
    format = rnd() < 0.7 ? 'typing' : 'mc';
  } else if (mode === 'mixed') {
    targetForm = selectWeightedFormForVerb(verb, userId, rnd);
    format = targetForm === 'meaning' ? 'mc' : (rnd() < 0.55 ? 'typing' : 'mc');
  }

  const pool = allVerbs.length >= 4 ? allVerbs : BUILTIN_IRREGULAR_VERBS;

  if (targetForm === 'v2') {
    if (format === 'mc') {
      const correct = verb.v2;
      const distractors = E.shuffle(
        pool.filter((x) => E.norm(x.v1) !== E.norm(verb.v1) && E.norm(x.v2) !== E.norm(correct)),
        rnd
      )
        .slice(0, 3)
        .map((x) => x.v2);
      // Eğer fiilin V3 hali V2 halinden farklıysa çeldiricilere eklemek öğreticidir
      if (E.norm(verb.v3) !== E.norm(verb.v2) && !distractors.includes(verb.v3)) {
        distractors[0] = verb.v3;
      }
      const options = E.shuffle([correct, ...distractors.slice(0, 3)], rnd);
      return {
        verb,
        form: 'v2',
        format: 'mc',
        prompt: `${verb.v1} → ?`,
        subPrompt: `Türkçe: ${verb.meaning} · Fiilin 2. halini (V2 - Past Simple) seçin`,
        options,
        answerIndex: options.indexOf(correct),
        expected: correct,
      };
    }
    return {
      verb,
      form: 'v2',
      format: 'typing',
      prompt: `${verb.v1} → ?`,
      subPrompt: `Türkçe: ${verb.meaning} · Fiilin 2. halini (V2) yazın`,
      expected: verb.v2,
    };
  }

  if (targetForm === 'v3') {
    if (format === 'mc') {
      const correct = verb.v3;
      const distractors = E.shuffle(
        pool.filter((x) => E.norm(x.v1) !== E.norm(verb.v1) && E.norm(x.v3) !== E.norm(correct)),
        rnd
      )
        .slice(0, 3)
        .map((x) => x.v3);
      if (E.norm(verb.v2) !== E.norm(verb.v3) && !distractors.includes(verb.v2)) {
        distractors[0] = verb.v2;
      }
      const options = E.shuffle([correct, ...distractors.slice(0, 3)], rnd);
      return {
        verb,
        form: 'v3',
        format: 'mc',
        prompt: `${verb.v1} → ${verb.v2} → ?`,
        subPrompt: `Türkçe: ${verb.meaning} · Fiilin 3. halini (V3 - Past Participle) seçin`,
        options,
        answerIndex: options.indexOf(correct),
        expected: correct,
      };
    }
    return {
      verb,
      form: 'v3',
      format: 'typing',
      prompt: `${verb.v1} → ${verb.v2} → ?`,
      subPrompt: `Türkçe: ${verb.meaning} · Fiilin 3. halini (V3) yazın`,
      expected: verb.v3,
    };
  }

  // meaning (Türkçe anlam çoktan seçmeli)
  const correct = verb.meaning;
  const distractors = E.shuffle(
    pool.filter((x) => E.norm(x.v1) !== E.norm(verb.v1) && E.norm(x.meaning) !== E.norm(correct)),
    rnd
  )
    .slice(0, 3)
    .map((x) => x.meaning);
  const options = E.shuffle([correct, ...distractors], rnd);
  return {
    verb,
    form: 'meaning',
    format: 'mc',
    prompt: `${verb.v1} – ${verb.v2} – ${verb.v3}`,
    subPrompt: 'Bu düzensiz fiilin Türkçe anlamı hangisidir?',
    options,
    answerIndex: options.indexOf(correct),
    expected: correct,
  };
}

export function checkIrregularQuestionAnswer(q, userInput) {
  if (!q) return false;
  if (q.format === 'mc') {
    return Number(userInput) === q.answerIndex;
  }
  return checkVerbFormAnswer(q.expected, userInput);
}

/* ---------- İstatistik ve İlerleme Hesaplama ---------- */
export function computeVerbSetStats(verbs, userId = getActiveIrregularUserId(), now = Date.now()) {
  const list = Array.isArray(verbs) ? verbs : [];
  let learned = 0;
  let unlearned = 0;
  let mistakes = 0;
  let due = 0;
  let mastered = 0;

  for (const v of list) {
    const p = getVerbProgress(v, userId);
    if (p.learned) learned++;
    else unlearned++;
    if (p.status === 'MASTERED') mastered++;
    if (p.status === 'REVIEW' || p.v2Wrong > p.v2Correct || p.v3Wrong > p.v3Correct) {
      mistakes++;
    }
    if (isVerbDue(p, now)) {
      due++;
    }
  }

  const total = list.length;
  const completion = total ? Math.round((learned / total) * 100) : 0;

  return {
    total,
    learned,
    unlearned,
    mistakes,
    due,
    mastered,
    completion,
    verbs: list,
  };
}

export function getIrregularListStats(listId, userId = getActiveIrregularUserId()) {
  const lists = getUserIrregularLists(userId);
  const list = lists.find((l) => l.id === listId);
  if (!list) return computeVerbSetStats([], userId);
  const allCustom = getUserCustomIrregularVerbs(userId);
  const verbMap = new Map(allCustom.map((v) => [v.id, v]));
  const verbs = (list.verbIds || []).map((id) => verbMap.get(id)).filter(Boolean);
  return computeVerbSetStats(verbs, userId);
}

/* ---------- Arayüz Durumu (Ana Ekran / Manuel / Hazır / Oturum) ---------- */
let currentSubView = 'home'; // 'home' | 'manual' | 'builtin'
let selectedBuiltInLevel = 'ALL'; // 'ALL' | 'A2' | 'B1' | 'B2'
let searchQuery = '';

export function resetIrregularView() {
  currentSubView = 'home';
}

/* ---------- Çalışma Oturumu Yöneticisi (Cards, V2, V3, Mixed, Mistakes, SRS) ---------- */
export function startIrregularStudySession(verbs, mode, title, onReturn) {
  const userId = getActiveIrregularUserId();
  const now = Date.now();
  let pool = [...verbs];

  if (mode === 'mistakes') {
    pool = pool.filter((v) => {
      const p = getVerbProgress(v, userId);
      return p.status === 'REVIEW' || p.incorrectCount > 0 || p.v2Wrong > 0 || p.v3Wrong > 0;
    });
    // En çok hata yapılanları öne sırala
    pool.sort((a, b) => {
      const pa = getVerbProgress(a, userId);
      const pb = getVerbProgress(b, userId);
      return (pb.v2Wrong + pb.v3Wrong + pb.incorrectCount) - (pa.v2Wrong + pa.v3Wrong + pa.incorrectCount);
    });
  } else if (mode === 'srs') {
    pool = pool.filter((v) => isVerbDue(getVerbProgress(v, userId), now));
  } else {
    // Önce yanlış yapılanlar ve öğrenilmemiş olanlar, sonra diğerleri
    pool = E.shuffle(pool);
    pool.sort((a, b) => {
      const pa = getVerbProgress(a, userId);
      const pb = getVerbProgress(b, userId);
      const scoreA = pa.status === 'REVIEW' ? 0 : (!pa.learned ? 1 : 2);
      const scoreB = pb.status === 'REVIEW' ? 0 : (!pb.learned ? 1 : 2);
      return scoreA - scoreB;
    });
  }

  if (!pool.length) {
    if (mode === 'mistakes') toast('Harika! Bu grupta yanlış yaptığınız bir fiil bulunmuyor.', 'success');
    else if (mode === 'srs') toast('Şu an tekrar zamanı gelen fiil bulunmuyor.', 'success');
    else toast('Çalışılacak fiil bulunamadı.');
    return false;
  }

  const sessionVerbs = pool.slice(0, 15);
  const v = $('#view');
  if (!v) return true;

  document.body.classList.add('focus');
  let idx = 0;
  const results = [];

  const exitSession = () => {
    document.body.classList.remove('focus');
    if (onReturn) onReturn();
    else renderIrregularVerbs(v);
  };

  const renderSummary = async () => {
    document.body.classList.remove('focus');
    await bumpDaily({ sessionsCompleted: 1 });
    const okCount = results.filter((r) => r.ok).length;
    const wrongVerbs = [...new Set(results.filter((r) => !r.ok).map((r) => `${r.verb.v1} (${r.verb.v2} - ${r.verb.v3})`))];

    v.innerHTML = `
      <div class="summary">
        ${successMark()}
        <h2>${esc(title)} Tamamlandı</h2>
        <div class="big-num">${okCount}/${results.length}</div>
        <p class="muted">${mode === 'cards' ? 'fiil kartı tamamlandı' : 'doğru cevap'}</p>
        ${wrongVerbs.length ? `<details class="more" open><summary>Tekrar Edilecek Fiiller (${wrongVerbs.length})</summary><div class="more-body"><p><b>${esc(wrongVerbs.join(' · '))}</b></p></div></details>` : '<p class="verdict">Kusursuz performans! 🌟</p>'}
        <div class="sum-actions">
          <button type="button" class="btn primary" id="irv-sum-again">Tekrar Çalış</button>
          <button type="button" class="btn ghost" id="irv-sum-back">Fiillerin 3 Hali'ne Dön</button>
        </div>
      </div>
    `;
    $('#irv-sum-again', v).onclick = () => startIrregularStudySession(verbs, mode, title, onReturn);
    $('#irv-sum-back', v).onclick = exitSession;
  };

  const renderStep = () => {
    if (idx >= sessionVerbs.length) {
      renderSummary();
      return;
    }

    const currentVerb = sessionVerbs[idx];
    const pct = Math.round((idx / sessionVerbs.length) * 100);
    const prog = getVerbProgress(currentVerb, userId);

    if (mode === 'cards') {
      v.innerHTML = `
        <div class="run">
          <div class="run-top">
            <button type="button" class="icon-btn" id="irv-exit" aria-label="Çık">${ICONS.close}</button>
            <div class="progress thin"><i style="width:${pct}%"></i></div>
            <span class="run-count">${idx + 1}/${sessionVerbs.length}</span>
          </div>
          <div class="run-body" id="irv-card">
            <div class="run-label"><span>Öğrenme Kartı · ${esc(currentVerb.level === 'CUSTOM' ? 'Kişisel' : `~${currentVerb.level}`)}</span></div>
            <div class="irv-flashcard">
              <div class="irv-forms-grid">
                <div class="irv-form-box">
                  <span class="irv-form-tag">V1 (Yalın)</span>
                  <strong class="irv-form-val">${esc(currentVerb.v1)}</strong>
                  <button type="button" class="speak-btn sm" data-spk="${esc(currentVerb.v1)}" aria-label="V1 Dinle">${ICONS.speaker}</button>
                </div>
                <div class="irv-form-box">
                  <span class="irv-form-tag">V2 (Past)</span>
                  <strong class="irv-form-val">${esc(currentVerb.v2)}</strong>
                  <button type="button" class="speak-btn sm" data-spk="${esc(currentVerb.v2.split('/')[0])}" aria-label="V2 Dinle">${ICONS.speaker}</button>
                </div>
                <div class="irv-form-box">
                  <span class="irv-form-tag">V3 (Participle)</span>
                  <strong class="irv-form-val">${esc(currentVerb.v3)}</strong>
                  <button type="button" class="speak-btn sm" data-spk="${esc(currentVerb.v3.split('/')[0])}" aria-label="V3 Dinle">${ICONS.speaker}</button>
                </div>
              </div>
              <div class="irv-card-meaning">
                <span class="muted small">Türkçe Anlamı</span>
                <h3>${esc(currentVerb.meaning)}</h3>
              </div>
              ${prog.v2Wrong > 0 || prog.v3Wrong > 0 ? `<div class="muted small" style="margin-top:8px">Önceki hatalar: V2 (${prog.v2Wrong}) · V3 (${prog.v3Wrong})</div>` : ''}
            </div>
            <div class="row gap wrap" style="margin-top:20px;width:100%">
              <button type="button" class="btn block" id="irv-card-hard" style="flex:1">Zorlandım (Tekrar Et)</button>
              <button type="button" class="btn primary xl block" id="irv-card-easy" style="flex:2">Öğrendim / Sonraki →</button>
            </div>
          </div>
        </div>
      `;

      $('#irv-exit', v).onclick = exitSession;
      $$('[data-spk]', v).forEach((b) => { b.onclick = () => speak(b.dataset.spk); });
      $('#irv-card-hard', v).onclick = async () => {
        await applyVerbAnswer(currentVerb, false, { form: 'card', mode: 'cards' }, Date.now(), userId);
        results.push({ verb: currentVerb, ok: false });
        idx++;
        renderStep();
      };
      $('#irv-card-easy', v).onclick = async () => {
        await applyVerbAnswer(currentVerb, true, { form: 'card', mode: 'cards' }, Date.now(), userId);
        await bumpDaily({ done: 1, correct: 1 });
        results.push({ verb: currentVerb, ok: true });
        idx++;
        renderStep();
      };
      return;
    }

    // Test modları: V2, V3, Mixed, Mistakes, SRS
    const q = buildIrregularQuestion(currentVerb, mode, verbs.length >= 4 ? verbs : BUILTIN_IRREGULAR_VERBS, userId);
    let answered = false;

    const formBadge = q.form === 'v2' ? 'V2 Testi (2. Hal)' : q.form === 'v3' ? 'V3 Testi (3. Hal)' : 'Anlam Testi';

    const bodyHtml = q.format === 'mc'
      ? `
        <h2 class="word">${esc(q.prompt)}</h2>
        <p class="hint">${esc(q.subPrompt)}</p>
        <div class="options">
          ${q.options.map((opt, i) => `<button type="button" class="opt" data-opt="${i}"><span class="opt-n">${i + 1}</span><span>${esc(opt)}</span></button>`).join('')}
        </div>
      `
      : `
        <h2 class="word">${esc(q.prompt)}</h2>
        <p class="hint">${esc(q.subPrompt)}</p>
        <form id="irv-ans-form" autocomplete="off">
          <input id="irv-inp" class="input lg" placeholder="${q.form === 'v2' ? 'Fiilin 2. halini (V2) yazın…' : 'Fiilin 3. halini (V3) yazın…'}" autocapitalize="off" autocorrect="off" spellcheck="false">
          <div class="ans-actions">
            <button type="submit" id="irv-check-btn" class="btn primary xl block">Kontrol Et</button>
            <button type="button" id="irv-next-btn" class="btn primary xl block" hidden>Devam Et</button>
          </div>
        </form>
      `;

    v.innerHTML = `
      <div class="run">
        <div class="run-top">
          <button type="button" class="icon-btn" id="irv-exit" aria-label="Çık">${ICONS.close}</button>
          <div class="progress thin"><i style="width:${pct}%"></i></div>
          <span class="run-count">${idx + 1}/${sessionVerbs.length}</span>
        </div>
        <div class="run-body" id="qcard">
          <div class="run-label"><span>${esc(formBadge)}</span></div>
          <div id="qbody">${bodyHtml}</div>
          <div id="fb"></div>
        </div>
      </div>
    `;

    $('#irv-exit', v).onclick = exitSession;

    const handleSubmission = async (userInput) => {
      if (answered) return;
      answered = true;
      const isOk = checkIrregularQuestionAnswer(q, userInput);
      await applyVerbAnswer(currentVerb, isOk, { form: q.form, mode, input: userInput }, Date.now(), userId);
      await bumpDaily({ [isOk ? 'correct' : 'wrong']: 1, done: 1 });
      results.push({ verb: currentVerb, ok: isOk, form: q.form });

      const qc = $('#qcard', v);
      qc.classList.add(isOk ? 'correct' : 'wrong');
      sfx(isOk ? 'ok' : 'bad');

      if (q.format === 'mc') {
        $$('.opt', v).forEach((b, i) => {
          b.disabled = true;
          if (i === q.answerIndex) b.classList.add('right');
          else if (!isOk && Number(userInput) === i) b.classList.add('bad');
        });
      } else {
        const inp = $('#irv-inp', v);
        if (inp) inp.disabled = true;
        const chk = $('#irv-check-btn', v);
        if (chk) { chk.disabled = true; chk.hidden = true; }
      }

      const fullForms = `${currentVerb.v1} – ${currentVerb.v2} – ${currentVerb.v3} (${currentVerb.meaning})`;
      const fbHtml = isOk
        ? `<div class="feedback feedback-compact ok" role="status"><div class="feedback-head"><b>Doğru</b><small>${esc(fullForms)}</small></div></div>`
        : `<div class="feedback feedback-compact no" role="status"><div class="feedback-head"><b>Yanlış</b><span>Doğru cevap: <b>${esc(q.expected)}</b></span></div><small>${esc(fullForms)}</small></div>`;
      const nextBtn = $('#irv-next-btn', v);
      if (nextBtn) {
        $('#fb', v).innerHTML = fbHtml;
        nextBtn.hidden = false;
        nextBtn.onclick = () => { idx++; renderStep(); };
        nextBtn.focus();
      } else {
        $('#fb', v).innerHTML = `${fbHtml}<button type="button" class="btn primary xl block" id="irv-next-btn">Devam Et</button>`;
        $('#irv-next-btn', v).onclick = () => { idx++; renderStep(); };
        $('#irv-next-btn', v).focus();
      }
    };

    if (q.format === 'mc') {
      $$('.opt', v).forEach((btn) => {
        btn.onclick = () => handleSubmission(Number(btn.dataset.opt));
      });
    } else {
      const inp = $('#irv-inp', v);
      if (inp) inp.focus();
      $('#irv-ans-form', v).onsubmit = (e) => {
        e.preventDefault();
        if (inp.value.trim()) handleSubmission(inp.value.trim());
      };
    }
  };

  renderStep();
  return true;
}

/* ---------- Modallar: Liste Oluşturma & Fiil Ekleme (Manuel + Toplu + TXT/CSV/XLSX) ---------- */
export function openIrregularListModal(existingList = null, onSaved = () => {}) {
  const isEdit = Boolean(existingList && existingList.id);
  openModal({
    title: isEdit ? 'Fiil Listesini Düzenle' : 'Yeni Fiil Listesi Oluştur',
    html: `
      <form id="irv-list-form" class="grid form" autocomplete="off">
        <label>Liste Adı *
          <input class="input" id="irv-list-name" required placeholder="Örn: Unit 4 - Irregular Verbs" value="${esc(existingList?.name || '')}">
        </label>
        <div class="err span2" id="irv-list-err" role="alert"></div>
        <div class="row end span2 gap">
          <button type="button" class="btn ghost" data-x>Vazgeç</button>
          <button type="submit" class="btn primary">${isEdit ? 'Güncelle' : 'Oluştur'}</button>
        </div>
      </form>
    `,
    onMount(b, api) {
      $('[data-x]', b).onclick = api.close;
      const inp = $('#irv-list-name', b);
      inp.focus();
      $('#irv-list-form', b).onsubmit = async (e) => {
        e.preventDefault();
        const errEl = $('#irv-list-err', b);
        errEl.textContent = '';
        const res = isEdit
          ? await updateIrregularList(existingList.id, { name: inp.value })
          : await createIrregularList(inp.value);
        if (!res.ok) {
          errEl.textContent = res.error;
          return;
        }
        api.close();
        toast(isEdit ? 'Liste güncellendi.' : `"${esc(res.list.name)}" oluşturuldu.`, 'success');
        onSaved(res.list);
      };
    },
  });
}

async function readUploadedVerbFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'xlsx' || ext === 'xls') {
    if (!window.XLSX) {
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        s.onload = res;
        s.onerror = () => rej(new Error('XLSX okuyucu yüklenemedi (internet bağlantısı gerekir).'));
        document.head.appendChild(s);
      });
    }
    const wb = window.XLSX.read(await file.arrayBuffer());
    const rows = window.XLSX.utils
      .sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '' })
      .filter((r) => r.some((x) => String(x).trim() !== ''))
      .map((r) => r.map((x) => String(x).trim()));
    return rows;
  }
  if (ext === 'csv') {
    const text = await file.text();
    const delim = detectDelimiter(text);
    return delim.length === 1 ? parseCSV(text, delim) : text;
  }
  if (ext === 'txt') {
    return await file.text();
  }
  throw new Error('Desteklenen dosya formatları: TXT, CSV, XLSX');
}

export function openAddIrregularVerbModal({ defaultListId = null, initialTab = 'single', onSaved = () => {} } = {}) {
  const userId = getActiveIrregularUserId();
  const lists = getUserIrregularLists(userId);

  if (!lists.length) {
    openIrregularListModal(null, (newList) => {
      openAddIrregularVerbModal({ defaultListId: newList.id, initialTab, onSaved });
    });
    return;
  }

  const listOpts = lists
    .map((l) => `<option value="${l.id}" ${l.id === defaultListId ? 'selected' : ''}>${esc(l.name)} (${(l.verbIds || []).length} fiil)</option>`)
    .join('');

  openModal({
    title: 'Düzensiz Fiil Ekle (V1 - V2 - V3)',
    wide: true,
    html: `
      <div class="seg full" role="tablist" style="margin-bottom:14px">
        <button type="button" class="seg-btn ${initialTab === 'single' ? 'active' : ''}" id="irv-tab-single">Tek Tek Ekle</button>
        <button type="button" class="seg-btn ${initialTab === 'bulk' ? 'active' : ''}" id="irv-tab-bulk">Toplu Ekle / Dosya Yükle</button>
      </div>

      <div style="margin-bottom:14px;background:var(--surf);padding:12px;border-radius:12px">
        <label style="font-weight:600;font-size:0.9rem;display:flex;flex-direction:column;gap:6px">
          Hedef Liste:
          <select class="input" id="irv-target-list">${listOpts}</select>
        </label>
      </div>

      <!-- TEK TEK EKLEME -->
      <form id="irv-panel-single" class="grid form" autocomplete="off" ${initialTab === 'bulk' ? 'hidden' : ''}>
        <label>V1 (Fiilin 1. Hali) *
          <input class="input" id="irv-inp-v1" required placeholder="Örn: go" autocapitalize="off">
        </label>
        <label>V2 (Fiilin 2. Hali - Past) *
          <input class="input" id="irv-inp-v2" required placeholder="Örn: went veya learned/learnt" autocapitalize="off">
        </label>
        <label>V3 (Fiilin 3. Hali - Participle) *
          <input class="input" id="irv-inp-v3" required placeholder="Örn: gone veya learned/learnt" autocapitalize="off">
        </label>
        <label>Türkçe Anlamı *
          <input class="input" id="irv-inp-meaning" required placeholder="Örn: gitmek">
        </label>
        <div class="err span2" id="irv-single-err" role="alert"></div>
        <div class="row end span2 gap">
          <button type="button" class="btn ghost" data-x>Vazgeç</button>
          <button type="submit" class="btn primary">Listeye Ekle</button>
        </div>
      </form>

      <!-- TOPLU EKLEME / DOSYA YÜKLEME -->
      <div id="irv-panel-bulk" ${initialTab === 'bulk' ? '' : 'hidden'}>
        <div style="margin-bottom:12px;padding:12px;border:1px dashed var(--bd);border-radius:12px;background:var(--surf)">
          <label style="font-weight:600;font-size:0.88rem;display:block;margin-bottom:6px">
            Dosyadan Yükle (TXT, CSV, XLSX):
          </label>
          <input type="file" id="irv-file-inp" accept=".txt,.csv,.xlsx,.xls" class="input sm" style="width:100%">
        </div>

        <p class="muted small" style="margin:0 0 6px">
          Veya her satıra <code>V1 - V2 - V3 - Türkçe</code> biçiminde yapıştırın:
        </p>
        <textarea class="input" id="irv-bulk-text" rows="6" style="font-family:monospace;font-size:0.88rem;width:100%;margin-bottom:10px" placeholder="go - went - gone - gitmek&#10;eat - ate - eaten - yemek&#10;see - saw - seen - görmek"></textarea>

        <div class="row between wrap gap" style="margin-bottom:12px">
          <button type="button" class="btn primary" id="irv-btn-parse">Satırları Ayrıştır ve Önizle</button>
          <span class="muted small" id="irv-bulk-summary"></span>
        </div>

        <div id="irv-preview-box" hidden>
          <div class="bulk-preview-table-container" style="max-height:220px;overflow-y:auto;border:1px solid var(--bd);border-radius:10px;margin-bottom:12px">
            <table class="bulk-table" style="width:100%;border-collapse:collapse;font-size:0.83rem">
              <thead>
                <tr style="background:var(--surf);text-align:left;border-bottom:1px solid var(--bd)">
                  <th style="padding:6px 8px">#</th>
                  <th style="padding:6px 8px">V1</th>
                  <th style="padding:6px 8px">V2</th>
                  <th style="padding:6px 8px">V3</th>
                  <th style="padding:6px 8px">Türkçe</th>
                  <th style="padding:6px 8px">Durum</th>
                  <th style="padding:6px 8px">Sil</th>
                </tr>
              </thead>
              <tbody id="irv-preview-tbody"></tbody>
            </table>
          </div>
          <p class="muted small" style="margin:0 0 10px">Hatalı veya tekrar eden satırlar diğer geçerli fiillerin kaydedilmesini engellemez.</p>
          <div class="err" id="irv-bulk-err" role="alert"></div>
          <div class="row end gap">
            <button type="button" class="btn ghost" data-x>Vazgeç</button>
            <button type="button" class="btn primary" id="irv-btn-save-bulk">Geçerli Fiilleri Kaydet</button>
          </div>
        </div>
      </div>
    `,
    onMount(b, api) {
      $$('[data-x]', b).forEach((btn) => { btn.onclick = api.close; });

      const tabSingle = $('#irv-tab-single', b);
      const tabBulk = $('#irv-tab-bulk', b);
      const panelSingle = $('#irv-panel-single', b);
      const panelBulk = $('#irv-panel-bulk', b);
      const listSelect = $('#irv-target-list', b);

      tabSingle.onclick = () => {
        tabSingle.classList.add('active');
        tabBulk.classList.remove('active');
        panelSingle.hidden = false;
        panelBulk.hidden = true;
      };
      tabBulk.onclick = () => {
        tabBulk.classList.add('active');
        tabSingle.classList.remove('active');
        panelSingle.hidden = true;
        panelBulk.hidden = false;
      };

      // Tekil kaydetme
      panelSingle.onsubmit = async (e) => {
        e.preventDefault();
        const errEl = $('#irv-single-err', b);
        errEl.textContent = '';
        const res = await addVerbToIrregularList({
          v1: $('#irv-inp-v1', b).value,
          v2: $('#irv-inp-v2', b).value,
          v3: $('#irv-inp-v3', b).value,
          meaning: $('#irv-inp-meaning', b).value,
          listId: listSelect.value,
          userId,
        });
        if (!res.ok) {
          errEl.textContent = res.error;
          return;
        }
        api.close();
        toast(`"${esc(res.verb.v1)}" fiili listeye eklendi.`, 'success');
        onSaved();
      };

      // Toplu önizleme
      let parsedRows = [];
      const renderPreview = () => {
        const okCount = parsedRows.filter((r) => r.status === 'ok').length;
        const dupCount = parsedRows.filter((r) => r.status === 'dup').length;
        const errCount = parsedRows.filter((r) => r.status === 'error').length;
        $('#irv-bulk-summary', b).textContent = `${okCount} hazır · ${dupCount} tekrar · ${errCount} hatalı`;

        const tbody = $('#irv-preview-tbody', b);
        tbody.innerHTML = parsedRows
          .map((r, i) => {
            const cls = r.status === 'ok' ? 'chip ok' : r.status === 'dup' ? 'chip alt' : 'chip bad';
            const lbl = r.status === 'ok' ? 'Hazır' : r.status === 'dup' ? 'Tekrar' : 'Hatalı';
            return `
              <tr data-idx="${i}" style="border-bottom:1px solid var(--bd)">
                <td style="padding:5px 8px;color:var(--tx-sec)">${i + 1}</td>
                <td style="padding:5px 6px"><input class="input sm" data-f="v1" value="${esc(r.v1)}"></td>
                <td style="padding:5px 6px"><input class="input sm" data-f="v2" value="${esc(r.v2)}"></td>
                <td style="padding:5px 6px"><input class="input sm" data-f="v3" value="${esc(r.v3)}"></td>
                <td style="padding:5px 6px"><input class="input sm" data-f="meaning" value="${esc(r.meaning)}"></td>
                <td style="padding:5px 8px"><span class="${cls}" title="${esc(r.message)}" style="font-size:0.73rem">${lbl}</span></td>
                <td style="padding:5px 6px"><button type="button" class="icon-btn sm" data-del="${i}" style="color:var(--no)">✕</button></td>
              </tr>
            `;
          })
          .join('');

        $$('[data-f]', tbody).forEach((inp) => {
          inp.oninput = (ev) => {
            const tr = ev.target.closest('tr');
            const rIdx = Number(tr.dataset.idx);
            const field = ev.target.dataset.f;
            parsedRows[rIdx][field] = ev.target.value.trim();
            const errs = validateIrregularVerb(parsedRows[rIdx]);
            parsedRows[rIdx].status = errs.length ? 'error' : 'ok';
            parsedRows[rIdx].message = errs.length ? errs[0] : 'Hazır';
          };
        });

        $$('[data-del]', tbody).forEach((btn) => {
          btn.onclick = () => {
            parsedRows.splice(Number(btn.dataset.del), 1);
            renderPreview();
          };
        });
      };

      const runParse = (rawSource) => {
        const targetList = getUserIrregularLists(userId).find((l) => l.id === listSelect.value);
        const existingVerbs = getUserCustomIrregularVerbs(userId);
        parsedRows = parseBulkIrregularVerbs(rawSource, targetList?.verbIds || [], existingVerbs);
        if (!parsedRows.length) {
          toast('Ayrıştırılacak satır bulunamadı.');
          return;
        }
        $('#irv-preview-box', b).hidden = false;
        renderPreview();
      };

      $('#irv-btn-parse', b).onclick = () => runParse($('#irv-bulk-text', b).value);

      $('#irv-file-inp', b).onchange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          const data = await readUploadedVerbFile(file);
          runParse(data);
          toast(`"${esc(file.name)}" dosyası okundu.`, 'success');
        } catch (err) {
          toast(err.message || 'Dosya okunamadı', 'error');
        }
      };

      $('#irv-btn-save-bulk', b).onclick = async () => {
        const valid = parsedRows.filter((r) => r.status === 'ok');
        const errBox = $('#irv-bulk-err', b);
        errBox.textContent = '';
        if (!valid.length) {
          errBox.textContent = 'Kaydedilecek geçerli satır bulunamadı.';
          return;
        }
        const res = await bulkAddVerbsToIrregularList({
          items: parsedRows,
          listId: listSelect.value,
          userId,
        });
        if (!res.ok) {
          errBox.textContent = res.error;
          return;
        }
        api.close();
        toast(`${res.addedCount} fiil listeye kaydedildi.`, 'success');
        onSaved();
      };
    },
  });
}

/* ---------- Çalışma Modu Seçici Bar (A. Kartlar, B. V2, C. V3, D. Karışık, E. Yanlışlarım + SRS) ---------- */
function renderStudyModesBar(stats, titlePrefix) {
  return `
    <div class="irv-modes-grid">
      <button type="button" class="irv-mode-btn" data-study-mode="cards" ${stats.total ? '' : 'disabled'}>
        <span class="irv-mode-ic">${ICONS.book}</span>
        <b>Öğrenme Kartları</b>
        <span class="muted small">V1 · V2 · V3 & Anlam</span>
      </button>
      <button type="button" class="irv-mode-btn" data-study-mode="v2" ${stats.total ? '' : 'disabled'}>
        <span class="irv-mode-ic">V2</span>
        <b>V2 Testi</b>
        <span class="muted small">go → went</span>
      </button>
      <button type="button" class="irv-mode-btn" data-study-mode="v3" ${stats.total ? '' : 'disabled'}>
        <span class="irv-mode-ic">V3</span>
        <b>V3 Testi</b>
        <span class="muted small">go → went → gone</span>
      </button>
      <button type="button" class="irv-mode-btn" data-study-mode="mixed" ${stats.total ? '' : 'disabled'}>
        <span class="irv-mode-ic">${ICONS.bolt}</span>
        <b>Karışık Test</b>
        <span class="muted small">Çoktan Seçmeli & Yazılı</span>
      </button>
      <button type="button" class="irv-mode-btn" data-study-mode="mistakes" ${stats.mistakes ? '' : 'disabled'}>
        <span class="irv-mode-ic">${ICONS.target}</span>
        <b>Yanlışlarım (${stats.mistakes})</b>
        <span class="muted small">V2/V3 Odaklı Tekrar</span>
      </button>
      <button type="button" class="irv-mode-btn primary-mode" data-study-mode="srs" ${stats.due ? '' : 'disabled'}>
        <span class="irv-mode-ic">${ICONS.brain}</span>
        <b>SRS Tekrar (${stats.due})</b>
        <span class="muted small">1-3-7-14-30 Gün</span>
      </button>
    </div>
  `;
}

function renderStatsSummaryStrip(stats) {
  return `
    <div class="irv-stats-strip">
      <div class="irv-stat-pill"><b>${stats.total}</b><span>Toplam Fiil</span></div>
      <div class="irv-stat-pill ok"><b>${stats.learned}</b><span>Öğrenilen</span></div>
      <div class="irv-stat-pill"><b>${stats.unlearned}</b><span>Çalışılacak</span></div>
      <div class="irv-stat-pill warn"><b>${stats.mistakes}</b><span>Yanlışlarım</span></div>
      <div class="irv-stat-pill ac"><b>${stats.due}</b><span>Tekrar Gelen</span></div>
    </div>
  `;
}

/* ---------- Ana Sayfa Görünümü: 1) İki Büyük Seçenek, 2) Manuel Ekle, 3) Hazır Fiiller ---------- */
export function renderIrregularVerbs(v) {
  const userId = getActiveIrregularUserId();

  // 1) ANA GİRİŞ EKRANI: Yalnızca iki büyük seçenek ("Manuel Ekle" ve "Hazır Fiiller")
  if (currentSubView === 'home') {
    const manualLists = getUserIrregularLists(userId);
    const manualVerbs = getUserCustomIrregularVerbs(userId);
    const builtInStats = computeVerbSetStats(BUILTIN_IRREGULAR_VERBS, userId);
    const manualStats = computeVerbSetStats(manualVerbs, userId);

    v.innerHTML = `
      <div class="page irv-page">
        <header style="margin-bottom:22px">
          <h1 style="margin:0 0 6px">Fiillerin 3 Hali</h1>
          <p class="lead" style="margin:0">İngilizce düzensiz fiilleri (V1 · V2 · V3) kendi listelerinle veya hazır kütüphaneyle öğren.</p>
        </header>

        <div class="irv-choice-grid">
          <!-- SEÇENEK 1: MANUEL EKLE -->
          <button type="button" class="irv-choice-card" id="irv-choose-manual">
            <div class="irv-choice-icon" aria-hidden="true">${ICONS.edit}</div>
            <div class="irv-choice-body">
              <h2>Manuel Ekle</h2>
              <p class="muted">Kendi fiillerini ekle ve çalış.</p>
              <div class="irv-choice-meta">
                <span class="chip">${manualLists.length} liste · ${manualStats.total} fiil</span>
                ${manualStats.due ? `<span class="chip alt">${manualStats.due} tekrar bekliyor</span>` : ''}
              </div>
            </div>
            <span class="irv-choice-arrow">${ICONS.chev}</span>
          </button>

          <!-- SEÇENEK 2: HAZIR FİİLLER -->
          <button type="button" class="irv-choice-card" id="irv-choose-builtin">
            <div class="irv-choice-icon" aria-hidden="true">${ICONS.book}</div>
            <div class="irv-choice-body">
              <h2>Hazır Fiiller</h2>
              <p class="muted">Hazır düzensiz fiilleri öğren ve tekrar et.</p>
              <div class="irv-choice-meta">
                <span class="chip">${builtInStats.total} yaygın fiil (~A2 · ~B1 · ~B2)</span>
                <span class="chip ok">%${builtInStats.completion} tamamlandı</span>
              </div>
            </div>
            <span class="irv-choice-arrow">${ICONS.chev}</span>
          </button>
        </div>
      </div>
    `;

    $('#irv-choose-manual', v).onclick = () => {
      currentSubView = 'manual';
      renderIrregularVerbs(v);
    };
    $('#irv-choose-builtin', v).onclick = () => {
      currentSubView = 'builtin';
      renderIrregularVerbs(v);
    };
    return;
  }

  // 2) MANUEL EKLE EKRANI
  if (currentSubView === 'manual') {
    const lists = getUserIrregularLists(userId);
    const allCustomVerbs = getUserCustomIrregularVerbs(userId);
    const overallStats = computeVerbSetStats(allCustomVerbs, userId);

    const listCardsHtml = lists.length
      ? lists
          .map((l) => {
            const st = getIrregularListStats(l.id, userId);
            return `
              <div class="notebook-card irv-list-card" data-list-id="${l.id}" style="background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px;margin-bottom:14px">
                <div class="row between wrap gap" style="margin-bottom:10px">
                  <div>
                    <h3 style="margin:0 0 4px;font-size:1.08rem;display:flex;align-items:center;gap:8px">
                      <span>${esc(l.name)}</span>
                      <span class="chip" style="font-size:0.75rem">${st.total} fiil</span>
                    </h3>
                    <div class="muted small">
                      ${st.learned}/${st.total} öğrenildi (%${st.completion}) · ${st.unlearned} çalışılacak
                      ${st.mistakes ? ` · <span class="warn-t">${st.mistakes} yanlış</span>` : ''}
                      ${st.due ? ` · <span class="ok-t"><b>${st.due} tekrar bekliyor</b></span>` : ''}
                    </div>
                  </div>
                  <div class="row gap wrap">
                    <button type="button" class="btn sm primary" data-list-study="${l.id}" ${st.total ? '' : 'disabled'}>Çalış / Test</button>
                    <button type="button" class="btn sm" data-list-add="${l.id}">＋ Fiil Ekle</button>
                    <button type="button" class="btn sm ghost" data-list-edit="${l.id}" title="Adı Düzenle">${ICONS.edit}</button>
                    <button type="button" class="btn sm ghost" data-list-del="${l.id}" title="Listeyi Sil" style="color:var(--no)">${ICONS.trash}</button>
                  </div>
                </div>
                <div class="progress thin" style="margin-bottom:10px"><i style="width:${st.completion}%"></i></div>
                ${st.verbs.length ? `
                  <details class="more" style="margin-top:6px">
                    <summary>Listedeki Fiiller (${st.verbs.length})</summary>
                    <div class="more-body" style="padding-top:8px">
                      <div class="irv-table-wrap">
                        <table class="irv-verb-table">
                          <thead><tr><th>V1</th><th>V2</th><th>V3</th><th>Türkçe</th><th>Durum</th><th></th></tr></thead>
                          <tbody>
                            ${st.verbs.map((vb) => {
                              const vp = getVerbProgress(vb, userId);
                              return `<tr>
                                <td><b>${esc(vb.v1)}</b></td>
                                <td>${esc(vb.v2)}</td>
                                <td>${esc(vb.v3)}</td>
                                <td>${esc(vb.meaning)}</td>
                                <td><span class="chip ${vp.learned ? 'ok' : vp.status === 'REVIEW' ? 'bad' : ''}" style="font-size:0.72rem">${vp.learned ? 'Öğrenildi' : vp.status === 'REVIEW' ? 'Tekrar' : 'Yeni'}</span></td>
                                <td><button type="button" class="icon-btn sm" data-rem-verb="${vb.id}" data-from-list="${l.id}" style="color:var(--no)">✕</button></td>
                              </tr>`;
                            }).join('')}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>
                ` : ''}
              </div>
            `;
          })
          .join('')
      : `
        <div class="center" style="padding:2.2rem 1rem;background:var(--card);border:1px dashed var(--bd);border-radius:14px">
          <p class="lead" style="margin-bottom:6px">Henüz kişisel bir fiil listeniz yok.</p>
          <p class="muted small" style="margin-bottom:14px">Örn: "Unit 4 - Irregular Verbs" veya "En Çok Karıştırdıklarım" adında bir liste oluşturarak başlayın.</p>
          <button type="button" class="btn primary" id="irv-empty-new-list">＋ İlk Fiil Listeni Oluştur</button>
        </div>
      `;

    v.innerHTML = `
      <div class="page irv-page">
        <div class="row between wrap gap" style="margin-bottom:14px">
          <button type="button" class="btn sm ghost" id="irv-back-home">← Fiillerin 3 Hali</button>
          <div class="row gap wrap">
            <button type="button" class="btn sm" id="irv-btn-new-list">＋ Yeni Liste</button>
            <button type="button" class="btn sm primary" id="irv-btn-add-verb">＋ Fiil Ekle / Dosya Yükle</button>
          </div>
        </div>

        <h1 style="margin:0 0 4px">Manuel Ekle — Kişisel Fiil Listelerim</h1>
        <p class="lead" style="margin:0 0 16px">Kendi eklediğin düzensiz fiilleri öğren, V2/V3 testleri çöz ve SRS ile tekrar et.</p>

        ${renderStatsSummaryStrip(overallStats)}
        ${renderStudyModesBar(overallStats, 'Kişisel Fiillerim')}

        <h2 style="font-size:1.12rem;margin:20px 0 12px">Listelerim (${lists.length})</h2>
        <div>${listCardsHtml}</div>
      </div>
    `;

    const refresh = () => renderIrregularVerbs(v);
    $('#irv-back-home', v).onclick = () => { currentSubView = 'home'; refresh(); };
    $('#irv-btn-new-list', v).onclick = () => openIrregularListModal(null, refresh);
    if ($('#irv-empty-new-list', v)) $('#irv-empty-new-list', v).onclick = () => openIrregularListModal(null, refresh);
    $('#irv-btn-add-verb', v).onclick = () => openAddIrregularVerbModal({ onSaved: refresh });

    $$('[data-study-mode]', v).forEach((btn) => {
      btn.onclick = () => {
        const mode = btn.dataset.studyMode;
        startIrregularStudySession(allCustomVerbs, mode, 'Kişisel Fiillerim', refresh);
      };
    });

    $$('[data-list-add]', v).forEach((btn) => {
      btn.onclick = () => openAddIrregularVerbModal({ defaultListId: btn.dataset.listAdd, onSaved: refresh });
    });

    $$('[data-list-edit]', v).forEach((btn) => {
      btn.onclick = () => {
        const target = lists.find((x) => x.id === btn.dataset.listEdit);
        if (target) openIrregularListModal(target, refresh);
      };
    });

    $$('[data-list-del]', v).forEach((btn) => {
      btn.onclick = async () => {
        const target = lists.find((x) => x.id === btn.dataset.listDel);
        if (!target) return;
        if (await confirmDialog(`"${target.name}" listesi silinsin mi?`, { danger: true })) {
          await deleteIrregularList(target.id);
          toast('Liste silindi.');
          refresh();
        }
      };
    });

    $$('[data-list-study]', v).forEach((btn) => {
      btn.onclick = () => {
        const lId = btn.dataset.listStudy;
        const target = lists.find((x) => x.id === lId);
        const st = getIrregularListStats(lId, userId);
        if (!target || !st.total) return;
        openModal({
          title: `${esc(target.name)} — Çalışma Modu Seç`,
          html: `
            <p class="muted small">Bu listedeki ${st.total} fiili hangi modda çalışmak istersiniz?</p>
            ${renderStudyModesBar(st, target.name)}
          `,
          onMount(mb, api) {
            $$('[data-study-mode]', mb).forEach((mBtn) => {
              mBtn.onclick = () => {
                api.close();
                startIrregularStudySession(st.verbs, mBtn.dataset.studyMode, target.name, refresh);
              };
            });
          },
        });
      };
    });

    $$('[data-rem-verb]', v).forEach((btn) => {
      btn.onclick = async () => {
        await removeVerbFromIrregularList(btn.dataset.fromList, btn.dataset.remVerb, userId);
        toast('Fiil listeden kaldırıldı.');
        refresh();
      };
    });

    return;
  }

  // 3) HAZIR FİİLLER EKRANI
  const activeVerbs = selectedBuiltInLevel === 'ALL'
    ? BUILTIN_IRREGULAR_VERBS
    : BUILTIN_IRREGULAR_VERBS.filter((vb) => vb.level === selectedBuiltInLevel);

  const stats = computeVerbSetStats(activeVerbs, userId);
  const q = searchQuery.toLowerCase().trim();
  const filteredTableVerbs = activeVerbs.filter((vb) => {
    if (!q) return true;
    return (
      vb.v1.toLowerCase().includes(q) ||
      vb.v2.toLowerCase().includes(q) ||
      vb.v3.toLowerCase().includes(q) ||
      vb.meaning.toLowerCase().includes(q)
    );
  });

  v.innerHTML = `
    <div class="page irv-page">
      <div class="row between wrap gap" style="margin-bottom:14px">
        <button type="button" class="btn sm ghost" id="irv-back-home">← Fiillerin 3 Hali</button>
        <span class="muted small">Yaklaşık öğrenme düzeyleri (~A2 · ~B1 · ~B2)</span>
      </div>

      <h1 style="margin:0 0 4px">Hazır Düzensiz Fiiller</h1>
      <p class="lead" style="margin:0 0 14px">Doğrulanmış ${BUILTIN_IRREGULAR_VERBS.length} yaygın İngilizce düzensiz fiil kütüphanesi.</p>

      <div class="seg full" role="group" aria-label="Yaklaşık Seviye Seçimi" style="margin-bottom:16px">
        ${['ALL', ...IRREGULAR_LEVELS].map((lv) => `
          <button type="button" class="seg-btn ${selectedBuiltInLevel === lv ? 'active' : ''}" data-irv-lv="${lv}">
            ${lv === 'ALL' ? `Tümü (${BUILTIN_IRREGULAR_VERBS.length})` : `~${lv} (${BUILTIN_IRREGULAR_VERBS.filter((x) => x.level === lv).length})`}
          </button>
        `).join('')}
      </div>

      ${renderStatsSummaryStrip(stats)}
      ${renderStudyModesBar(stats, selectedBuiltInLevel === 'ALL' ? 'Hazır Fiiller' : `~${selectedBuiltInLevel} Fiiller`)}

      <div class="row between wrap gap" style="margin:22px 0 10px">
        <h2 style="font-size:1.1rem;margin:0">Fiil Tablosu (${filteredTableVerbs.length})</h2>
        <input class="input sm" id="irv-search-inp" placeholder="Fiil veya Türkçe anlam ara…" value="${esc(searchQuery)}" style="max-width:260px">
      </div>

      <div class="irv-table-wrap" style="background:var(--card);border:1px solid var(--bd);border-radius:14px;overflow-x:auto">
        <table class="irv-verb-table">
          <thead>
            <tr>
              <th>V1</th>
              <th>V2 (Past)</th>
              <th>V3 (Participle)</th>
              <th>Türkçe Anlamı</th>
              <th>Düzey</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTableVerbs.map((vb) => {
              const vp = getVerbProgress(vb, userId);
              const badgeCls = vp.learned ? 'chip ok' : vp.status === 'REVIEW' ? 'chip bad' : 'chip';
              const badgeTxt = vp.status === 'MASTERED' ? 'Kalıcı' : vp.learned ? 'Öğrenildi' : vp.status === 'REVIEW' ? 'Yanlışım' : 'Yeni';
              return `
                <tr>
                  <td>
                    <div class="row gap" style="align-items:center">
                      <button type="button" class="speak-btn sm" data-spk="${esc(vb.v1)}" aria-label="Dinle">${ICONS.speaker}</button>
                      <b>${esc(vb.v1)}</b>
                    </div>
                  </td>
                  <td><b>${esc(vb.v2)}</b></td>
                  <td><b>${esc(vb.v3)}</b></td>
                  <td>${esc(vb.meaning)}</td>
                  <td><span class="muted small">~${esc(vb.level)}</span></td>
                  <td><span class="${badgeCls}" style="font-size:0.72rem">${badgeTxt}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const refresh = () => renderIrregularVerbs(v);
  $('#irv-back-home', v).onclick = () => { currentSubView = 'home'; refresh(); };

  $$('[data-irv-lv]', v).forEach((btn) => {
    btn.onclick = () => {
      selectedBuiltInLevel = btn.dataset.irvLv;
      refresh();
    };
  });

  $$('[data-study-mode]', v).forEach((btn) => {
    btn.onclick = () => {
      const mode = btn.dataset.studyMode;
      const label = selectedBuiltInLevel === 'ALL' ? 'Hazır Fiiller' : `~${selectedBuiltInLevel} Düzensiz Fiiller`;
      startIrregularStudySession(activeVerbs, mode, label, refresh);
    };
  });

  const searchInp = $('#irv-search-inp', v);
  if (searchInp) {
    searchInp.oninput = (e) => {
      searchQuery = e.target.value;
      const pos = searchInp.selectionStart;
      refresh();
      const newInp = $('#irv-search-inp', v);
      if (newInp) {
        newInp.focus();
        try { newInp.setSelectionRange(pos, pos); } catch {}
      }
    };
  }

  $$('[data-spk]', v).forEach((btn) => {
    btn.onclick = () => speak(btn.dataset.spk);
  });
}
