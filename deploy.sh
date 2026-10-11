#!/usr/bin/env bash
# 原住民全球新聞網：抓新聞 → 產生網站資料 → 推送 GitHub Pages
# 用法：./deploy.sh [天數，預設3]   抓新聞＋部署（沒摘要的新聞不會上線，列在 pending_summary.json）
#       ./deploy.sh publish        只重建網站並部署（補寫摘要、apply_summaries.py 之後用）
set -euo pipefail
cd "$(dirname "$0")"
if [ "${1:-}" != "publish" ]; then python3 fetch_news.py "${1:-3}"; python3 fetch_industry.py "${1:-3}" || echo "產業報導抓取失敗（不影響其他新聞）"; fi
python3 fetch_industry.py --retag   # 重新標記「產業報導」
python3 extras.py || echo "補助／標案資訊更新失敗，沿用上一版 extras.js"   # 讀當時最新的補助王、標案王資料
python3 build_site.py
git add -A
if git diff --cached --quiet; then echo "資料無變動，不需部署"; exit 0; fi
git -c user.name="tommyliu2009" -c user.email="tommyliu2009@users.noreply.github.com" commit -qm "新聞更新 $(TZ=Asia/Taipei date '+%Y-%m-%d %H:%M')"
git push -q origin main
echo "已部署：$(git log -1 --format=%s)"
