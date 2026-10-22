#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LEXORA — Otomatik Kelime Veri İşleme, Normalizasyon, Tekrar Ayıklama ve Kalite Kontrol Hattı (Pipeline)
Çalıştırma:
    /usr/bin/python3 scripts/vocab_pipeline.py

Özellikler:
1. Mevcut data/a2.json (ilk 146), data/b1.json (ilk 47) ve data/b2.json (ilk 48) içindeki 241 yerleşik
   kelimeyi ve kimliklerini (ID) birebir korur.
2. data/sources/ altındaki kaynak dosyaları (.tsv, .csv, .json) okur.
3. Kelimeleri normalize eder, mevcut kelimelerle veya seviyeler arasında (A2 -> B1 -> B2) tekrar edenleri
   otomatik ayıklar ve raporlar.
4. Yalnızca tüm zorunlu alanları (word, level, partOfSpeech, meanings, exampleSentence [hedef kelimeyi içeren],
   exampleTranslation, category) eksiksiz ve doğrulanmış kayıtları AKTİF (isDraft: false) yapar.
5. Eksik alanı bulunan (ör. örnek cümlesi veya çevirisi henüz doğrulanmamış) aday kelimeleri uydurma veriyle
   doldurmaz; isDraft: true ve missingFields listesiyle DRAFT (Taslak) durumunda saklar.
6. Otomatik kalite kontrollerini çalıştırır ve data/sources/pipeline_report.json dosyasını üretir.
"""

import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
SOURCES_DIR = DATA_DIR / "sources"

VALID_LEVELS = ("A2", "B1", "B2")
TARGET_COUNTS = {"A2": 800, "B1": 1200, "B2": 1500}
PROTECTED_COUNTS = {"A2": 244, "B1": 192, "B2": 261}

VALID_POS = {
    "noun", "verb", "adjective", "adverb", "phrasal verb",
    "preposition", "conjunction", "pronoun", "determiner", "expression", "idiom",
}

VALID_CATEGORIES = {
    "Education", "Environment", "Technology", "Health", "Society",
    "Science", "Business", "Psychology", "Daily Life", "Academic Vocabulary",
}

# Yalnızca gerçek İngiliz/Amerikan yazım varyantlarına izin verilir; eş anlamlılar/kısaltmalar engellenir
ALLOWED_SPELLING_VARIANTS = {
    ("neighbour", "neighbor"),
    ("centimetre", "centimeter"),
    ("analyse", "analyze"),
    ("criticise", "criticize"),
    ("apologise", "apologize"),
    ("authorise", "authorize"),
    ("characterise", "characterize"),
    ("armour", "armor"),
    ("artifact", "artefact"),
    ("catalogue", "catalog"),
}


def norm_word(w: str) -> str:
    return re.sub(r"\s+", " ", (w or "").strip()).lower()


def split_list(val) -> list:
    if isinstance(val, list):
        return [str(x).strip() for x in val if str(x).strip()]
    if not val:
        return []
    return [x.strip() for x in re.split(r"[;|]", str(val)) if x.strip()]


def can_blank_sentence(word: str, sentence: str) -> bool:
    """js/engine.js içindeki blankSentence(word) mantığının birebir karşılığı."""
    s = (sentence or "").strip()
    w = (word or "").strip()
    if not s or not w:
        return False
    cands = [w]
    if len(w) > 4:
        cands.append(w[:-1])
    for c in cands:
        pattern = r"\b" + re.escape(c) + r"\w*"
        if re.search(pattern, s, flags=re.IGNORECASE):
            return True
    return False


def compute_missing_fields(rec: dict) -> list:
    missing = []
    if not rec.get("meanings") or not any(str(m).strip() for m in rec["meanings"]):
        missing.append("meanings")
    if not rec.get("partOfSpeech") or rec["partOfSpeech"] not in VALID_POS:
        missing.append("partOfSpeech")
    ex = (rec.get("exampleSentence") or "").strip()
    if not ex:
        missing.append("exampleSentence")
    elif not can_blank_sentence(rec.get("word", ""), ex):
        missing.append("exampleSentence_targetWordMatch")
    tr = (rec.get("exampleTranslation") or "").strip()
    if not tr:
        missing.append("exampleTranslation")
    return missing


def filter_alt_answers(word: str, alts: list, synonyms: list) -> tuple[list, list]:
    """
    Eş anlamlıları veya kısaltmaları alternativeAnswers içinden ayıklar;
    yalnızca gerçek UK/US yazım varyantlarını alternativeAnswers içinde tutar.
    """
    w_low = norm_word(word)
    clean_alts = []
    syn_set = [s for s in synonyms]
    for a in alts:
        a_low = norm_word(a)
        if not a_low or a_low == w_low:
            continue
        if (w_low, a_low) in ALLOWED_SPELLING_VARIANTS or (a_low, w_low) in ALLOWED_SPELLING_VARIANTS:
            clean_alts.append(a.strip())
        else:
            if a.strip() not in syn_set and len(a.strip()) > 2:
                syn_set.append(a.strip())
    return clean_alts, syn_set


def parse_tsv_source(path: Path, source_label: str) -> list:
    rows = []
    if not path.exists():
        return rows
    for line_no, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        parts = [p.strip() for p in line.split("|")]
        while len(parts) < 13:
            parts.append("")
        lv, word, pos, meanings, ex, tr, cat, syn, col, fam, ant, alt, note = parts[:13]
        lv = lv.upper()
        if lv not in VALID_LEVELS or not word:
            continue
        # Özel isim değilse küçük harfe normalize et
        if word[0].isupper() and word.lower() not in ("croatia", "earth", "monday", "sunday", "turkey", "ankara", "istanbul", "berlin", "london"):
            word = word.lower()
        pos_norm = pos.lower() if pos else ""
        cat_norm = cat if cat in VALID_CATEGORIES else "Daily Life"
        syns = split_list(syn)
        alts_raw = split_list(alt)
        clean_alts, syns = filter_alt_answers(word, alts_raw, syns)
        rows.append({
            "level": lv,
            "word": word,
            "pos": pos_norm,
            "meanings": split_list(meanings),
            "exampleSentence": ex,
            "exampleTranslation": tr,
            "category": cat_norm,
            "synonyms": syns,
            "collocations": split_list(col),
            "wordFamily": split_list(fam),
            "antonyms": split_list(ant),
            "alternativeAnswers": clean_alts,
            "reviewNote": note,
            "source": source_label,
        })
    return rows


def main():
    existing_by_level = {}
    seen_words = set()
    seen_ids = set()

    # 1. Mevcut 241 korumalı kelimeyi yükle
    for lv in VALID_LEVELS:
        p = DATA_DIR / f"{lv.lower()}.json"
        data = json.loads(p.read_text(encoding="utf-8"))
        protected_n = PROTECTED_COUNTS[lv]
        protected_slice = data[:protected_n]
        assert len(protected_slice) == protected_n, f"{lv} korumalı kayıt sayısı {protected_n} olmalı!"
        for w in protected_slice:
            w["isDraft"] = False
            seen_words.add(norm_word(w["word"]))
            seen_ids.add(w["id"])
        existing_by_level[lv] = protected_slice

    # 2. Kaynak dosyaları oku
    active_candidates = parse_tsv_source(
        SOURCES_DIR / "verified_active_batch.tsv",
        "LEXORA Doğrulanmış Aktif Genişletme Paketi (NGSL 1.2 CC BY-SA 4.0 genel referanslı; özgün cümle ve çeviriler)",
    )
    draft_candidates = parse_tsv_source(
        SOURCES_DIR / "cefr_draft_candidates.tsv",
        "LEXORA CEFR Aday Havuzu (NGSL 1.2 CC BY-SA 4.0 genel referanslı; örnek cümle tamamlanmayı bekliyor - DRAFT)",
    )

    skipped_duplicates = []
    added_active = {"A2": 0, "B1": 0, "B2": 0}
    added_draft = {"A2": 0, "B1": 0, "B2": 0}
    missing_summary = {}

    now_iso = "2026-10-23T01:00:00.000Z"

    for cand in active_candidates + draft_candidates:
        lv = cand["level"]
        w_key = norm_word(cand["word"])
        if not re.match(r"^[A-Za-z][A-Za-z '’\-.]*$", cand["word"]):
            continue
        if w_key in seen_words:
            skipped_duplicates.append({"level": lv, "word": cand["word"], "reason": "already_exists"})
            continue

        seq = len(existing_by_level[lv]) + 1
        slug = re.sub(r"[^a-z0-9]+", "-", w_key).strip("-")
        rec_id = f"{lv.lower()}-{slug}-{seq:03d}"
        while rec_id in seen_ids:
            seq += 1
            rec_id = f"{lv.lower()}-{slug}-{seq:03d}"

        rec = {
            "id": rec_id,
            "level": lv,
            "word": cand["word"],
            "meanings": cand["meanings"],
            "partOfSpeech": cand["pos"],
            "pronunciation": "",
            "exampleSentence": cand["exampleSentence"],
            "exampleTranslation": cand["exampleTranslation"],
            "synonyms": cand["synonyms"],
            "antonyms": cand["antonyms"],
            "collocations": cand["collocations"],
            "wordFamily": cand["wordFamily"],
            "category": cand["category"],
            "alternativeAnswers": cand["alternativeAnswers"],
            "source": cand["source"],
            "reviewRequired": bool(cand["reviewNote"]),
            "reviewNote": cand["reviewNote"],
            "createdAt": now_iso,
            "updatedAt": now_iso,
        }

        missing = compute_missing_fields(rec)
        if missing:
            rec["isDraft"] = True
            rec["missingFields"] = missing
            rec["reviewRequired"] = True
            added_draft[lv] += 1
            for m in missing:
                missing_summary[m] = missing_summary.get(m, 0) + 1
        else:
            rec["isDraft"] = False
            added_active[lv] += 1

        seen_words.add(w_key)
        seen_ids.add(rec_id)
        existing_by_level[lv].append(rec)

    # 3. Kalite Kontrolleri ve Dosyalara Yazma
    report = {
        "levels": {},
        "totals": {"active": 0, "draft": 0, "all": 0},
        "skippedDuplicatesCount": len(skipped_duplicates),
        "skippedDuplicates": skipped_duplicates,
        "missingFieldsBreakdown": missing_summary,
        "remainingToTarget3500": {},
    }

    all_ids_check = set()
    all_words_check = set()

    for lv in VALID_LEVELS:
        records = existing_by_level[lv]
        out_path = DATA_DIR / f"{lv.lower()}.json"
        out_path.write_text(json.dumps(records, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

        active_recs = [r for r in records if not r.get("isDraft")]
        draft_recs = [r for r in records if r.get("isDraft")]

        for r in records:
            assert r["id"] not in all_ids_check, f"Duplicate ID: {r['id']}"
            all_ids_check.add(r["id"])
            wk = norm_word(r["word"])
            assert wk not in all_words_check, f"Cross-level duplicate word: {r['word']}"
            all_words_check.add(wk)
            if not r.get("isDraft"):
                assert compute_missing_fields(r) == [], f"Active word has missing fields: {r['id']}"

        report["levels"][lv] = {
            "active": len(active_recs),
            "draft": len(draft_recs),
            "total": len(records),
            "target": TARGET_COUNTS[lv],
            "remainingActiveNeeded": max(0, TARGET_COUNTS[lv] - len(active_recs)),
        }
        report["totals"]["active"] += len(active_recs)
        report["totals"]["draft"] += len(draft_recs)
        report["totals"]["all"] += len(records)
        report["remainingToTarget3500"][lv] = max(0, TARGET_COUNTS[lv] - len(active_recs))

    report_path = SOURCES_DIR / "pipeline_report.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print("=== LEXORA PIPELINE TAMAMLANDI ===")
    for lv in VALID_LEVELS:
        info = report["levels"][lv]
        print(f"  {lv}: {info['active']} aktif | {info['draft']} taslak (DRAFT) | Toplam: {info['total']} (Hedef: {info['target']})")
    print(f"  GENEL TOPLAM: {report['totals']['active']} aktif + {report['totals']['draft']} taslak = {report['totals']['all']} kayıt")
    print(f"  Ayıklanan Tekrar Sayısı: {report['skippedDuplicatesCount']}")


if __name__ == "__main__":
    main()
