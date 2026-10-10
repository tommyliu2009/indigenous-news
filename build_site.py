#!/usr/bin/env python3
"""由 news_db.json 產生 data.js（網站資料）。

只輸出已有合格摘要（summary_ok 且 50～200 字）的稿件。
示例稿必須在標題標示【示例】，且不得使用假採訪口吻。
"""
import hashlib, json, sys

CATS = ['族群文化', '部落新聞', '語言復振', '傳統祭儀', '土地與權益', '國際原住民新聞', '政策與補助']
BANNED = ['受訪者表示', '部長表示', '主委表示', '根據本報採訪', '本報訊']

db = json.load(open('news_db.json'))
st = json.load(open('source_status.json'))
ok = [v for v in db.values() if v.get('summary_ok') and 50 <= len(v.get('summary', '')) <= 200]
errors = []
ids = set()

def item_id(v):
    if v.get('id'):
        return v['id']
    raw = (v.get('url') or v.get('title') or '').encode()
    return 'n-' + hashlib.sha1(raw).hexdigest()[:10]

for v in ok:
    if v.get('category') not in CATS:
        errors.append('分類不在範圍內：' + v.get('title', ''))
    if v.get('sample'):
        if not str(v.get('title', '')).startswith('【示例】'):
            errors.append('示例標題缺少【示例】：' + v.get('title', ''))
        for b in BANNED:
            if b in (v.get('summary') or '') or b in (v.get('title') or ''):
                errors.append('出現不允許的報導口吻：' + b + '／' + v.get('id', ''))
    i = item_id(v)
    if i in ids:
        errors.append('id 重複：' + i)
    ids.add(i)
if errors:
    print('\n'.join(errors))
    sys.exit(1)

def pub(v):
    o = {
        'id': item_id(v),
        'title': v['title'],
        'date': v['date'],
        'category': v['category'],
        'unit': v['unit'],
        'summary': v['summary'],
        'sample': bool(v.get('sample')),
    }
    if v.get('url'):
        o['url'] = v['url']
    if v.get('nation'):
        o['nation'] = v['nation']
    if v.get('nationId'):
        o['nationId'] = v['nationId']
    return o

items = sorted((pub(v) for v in ok), key=lambda v: (v['date'], v['id']), reverse=True)
open('data.js', 'w').write(
    'window.NEWS=' + json.dumps(items, ensure_ascii=False) + ';\n'
    'window.UPDATED=' + json.dumps(st['updated'], ensure_ascii=False) + ';\n'
)
print('網站資料', len(items), '則；未上線（待摘要）', len(db) - len(ok), '則')
