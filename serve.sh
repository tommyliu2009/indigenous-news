#!/usr/bin/env bash
# 本地預覽。預設埠 41773，可用第一個參數改埠。
cd "$(dirname "$0")"
PORT="${1:-41773}"
echo "原住民全球新聞網  http://127.0.0.1:${PORT}"
exec python3 -m http.server "$PORT" --bind 0.0.0.0
