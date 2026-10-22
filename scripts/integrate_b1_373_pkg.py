#!/usr/bin/env python3
"""
LEXORA B1 373 Aday Paketi Güvenli Entegrasyon Betiği
- Mevcut 931 aktif kelimeyi (A2: 478, B1: 192, B2: 261) ve 18 A2 taslağını (toplam 949 kayıt) birebir korur.
- new_b1_candidates.json içindeki 373 adayı mevcut A2, B1 ve B2 kayıtlarıyla karşılaştırır.
- Türkçe anlamı (meanings) boş olan 2 kaydı (achievement, decimal) import_new_b1.py kuralına ve validateWord() şemasına uygun olarak atlar.
- Kalan 371 yeni B1 adayını isDraft: true ve missingFields: ["exampleSentence", "exampleTranslation"] ile data/b1.json dosyasına ekler.
"""
import json
import os
import pathlib

ROOT = pathlib.Path("/Users/ahmetyakici/.gemini/antigravity/scratch/lexora")
PKG_DIR = pathlib.Path("/Users/ahmetyakici/.gemini/antigravity/brain/b74f717d-40e3-4d41-ad58-35f3f0de73f4/scratch/b1_pkg")
CANDS_PATH = PKG_DIR / "new_b1_candidates.json"

a2_path = ROOT / "data" / "a2.json"
b1_path = ROOT / "data" / "b1.json"
b2_path = ROOT / "data" / "b2.json"

a2_data = json.loads(a2_path.read_text(encoding="utf-8"))
b1_data = json.loads(b1_path.read_text(encoding="utf-8"))
b2_data = json.loads(b2_path.read_text(encoding="utf-8"))
cands = json.loads(CANDS_PATH.read_text(encoding="utf-8"))

# Mevcut B1 taslaklarını temizle (yeniden çalıştırılabilirlik için; yalnızca orijinal 192 aktif kayıt korunur)
b1_existing = [w for w in b1_data if not w.get("id", "").startswith("b1-oxref-")]
assert len(b1_existing) == 192, f"Beklenen 192 mevcut B1 kaydı, bulunan: {len(b1_existing)}"

ids = set()
words = set()
alt_map = {}

for lvl, arr in (("A2", a2_data), ("B1", b1_existing), ("B2", b2_data)):
    for x in arr:
        ids.add(x["id"])
        w_key = x["word"].strip().casefold()
        words.add(w_key)
        for alt in x.get("alternativeAnswers", []):
            a_key = alt.strip().casefold()
            if a_key != w_key:
                alt_map[a_key] = (lvl, x["id"], x["word"])

SPECIAL_NOTES = {
    "b1-oxref-0002": "Mevcut b2-analyse-003 (analyse) kaydının Amerikan İngilizcesi yazım varyantıdır (alternativeAnswers içinde tanımlı); B1 tamamlama aşamasında ikinci bir bağımsız kart olarak aktif edilmemelidir.",
    "b1-oxref-0003": "Mevcut b1-apologise-088 (apologise) kaydının Amerikan İngilizcesi yazım varyantıdır (alternativeAnswers içinde tanımlı); B1 tamamlama aşamasında ikinci bir bağımsız kart olarak aktif edilmemelidir.",
    "b1-oxref-0168": "Kaynak PDF satır kayması nedeniyle Türkçe anlamı ('açıklama, izah' -> explanation) hatalıdır; 'uzman, bilirkişi' olarak düzeltilmeden aktif edilmemelidir.",
    "b1-oxref-0040": "Kaynak PDF OCR yazım hatası ('araştırmalık yapmak'); anlam kontrolünden geçirilmeden aktif edilmemelidir.",
    "b1-oxref-0328": "Kaynak PDF OCR yazım hatası ('ilagaki'); anlam kontrolünden geçirilmeden aktif edilmemelidir.",
}

added = []
skipped_duplicates = []
skipped_missing_meaning = []

for x in cands:
    w = x["word"].strip().casefold()
    if w in words or x["id"] in ids:
        skipped_duplicates.append(x["word"])
        continue
    if x.get("level") != "B1" or not x.get("meanings") or not any(str(m).strip() for m in x.get("meanings", [])):
        skipped_missing_meaning.append((x["id"], x["word"], x.get("partOfSpeech")))
        continue

    # Noktalı virgülle birleşik kalmış anlamları ayır
    cleaned_meanings = []
    for m in x["meanings"]:
        for part in str(m).split(";"):
            p = part.strip()
            if p and p not in cleaned_meanings:
                cleaned_meanings.append(p)

    rec = dict(x)
    rec["meanings"] = cleaned_meanings
    rec["isDraft"] = True
    rec["missingFields"] = ["exampleSentence", "exampleTranslation"]
    rec["reviewRequired"] = True
    rec["reviewNote"] = SPECIAL_NOTES.get(
        rec["id"],
        "Örnek cümle ve Türkçe çevirisi tamamlandığında aktifleşecek B1 taslak kaydı."
    )

    added.append(rec)
    ids.add(rec["id"])
    words.add(w)

new_b1 = b1_existing + added
tmp_path = b1_path.with_suffix(".json.tmp")
tmp_path.write_text(json.dumps(new_b1, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
os.replace(tmp_path, b1_path)

print(f"Mevcut B1 aktif: {len(b1_existing)}")
print(f"Eklenen B1 taslak: {len(added)}")
print(f"Atlanan tekrar (headword/ID): {len(skipped_duplicates)} -> {skipped_duplicates}")
print(f"Atlanan eksik anlam (meanings=[]): {len(skipped_missing_meaning)} -> {skipped_missing_meaning}")
print(f"Yeni B1 toplam kayıt: {len(new_b1)} ({sum(not w.get('isDraft') for w in new_b1)} aktif, {sum(bool(w.get('isDraft')) for w in new_b1)} taslak)")
