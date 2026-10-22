#!/bin/sh
# Kullanım: sh scripts/build-data.sh  (node veya macOS jsc gerekir)
cd "$(dirname "$0")/.."
JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc
if command -v node >/dev/null 2>&1; then node scripts/build-data.mjs > /tmp/lexora-data.txt; else $JSC -m scripts/build-data.mjs > /tmp/lexora-data.txt; fi
python3 - <<'PY'
import json
for line in open('/tmp/lexora-data.txt'):
    if '\t' not in line: continue
    lv, js = line.rstrip('\n').split('\t', 1)
    d = json.loads(js)
    json.dump(d, open(f'data/{lv.lower()}.json', 'w'), ensure_ascii=False, indent=1)
    print(lv, len(d))
PY
