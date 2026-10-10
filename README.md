# 原住民全球新聞網

面向臺灣原住民族十六族與全球原住民族議題的新聞網站，介面為繁體中文。經營單位為仁傳媒有限公司，與「新住民&新移民全球新聞網」同一套靜態網站架構：首頁頭條、分類、來源側欄、摘要展開，以及「抓取 → 人工摘要 → 產生 `data.js` → 推上 GitHub Pages」的更新方式。

目前上線的 28 則稿件全部標示【示例】，用來展示版面。它們不是採訪，沒有真實受訪者，也不能當成已經發生的新聞。

英文名稱：Indigenous Peoples Global News Network。

## 技術

| 項目 | 做法 |
| --- | --- |
| 頁面 | 靜態 HTML、`style.css`、`app.js`、`common.js` |
| 新聞資料 | `news_db.json` 經 `build_site.py` 產生 `data.js` |
| 上線條件 | `summary_ok` 且摘要 50～200 字；示例稿標題須以【示例】開頭 |
| 抓取 | `fetch_news.py`（官方 RSS、中央社、Google 新聞索引） |
| 摘要寫回 | `apply_summaries.py` |
| 部署 | `deploy.sh` 推送到 `origin main`，給 GitHub Pages |
| 語言 | 繁體中文（`zh-Hant-TW`） |

分類為：族群文化、部落新聞、語言復振、傳統祭儀、土地與權益、國際原住民新聞、政策與補助。

## 頁面

- `index.html` 新聞首頁、分類、搜尋、載入更多
- `article.html` 單則稿件
- `about.html` 宗旨、服務對象、編輯原則
- `nations.html` 十六族入門導讀
- `organization.html` 職務編制與聯絡表單（表單不會送出）
- `accessibility.html` 無障礙與響應式說明
- `404.html` 找不到頁面

## 本地預覽

不需要安裝套件。在專案目錄執行：

```bash
python3 build_site.py
python3 -m http.server 41773 --bind 0.0.0.0
```

或 `./serve.sh`。瀏覽器打開 [http://127.0.0.1:41773](http://127.0.0.1:41773)。

字級按鈕、分類、搜尋與聯絡表單都在瀏覽器裡完成，沒有帳號，也沒有資料庫。

## 日後換成真實新聞

1. 安裝抓取依賴：`pip install -r requirements.txt`
2. `python3 fetch_news.py 3` 把候選稿寫進 `news_db.json`，`summary_ok` 為 false，不會出現在網站上，並列入 `pending_summary.json`
3. 編輯依原文撰寫 50～200 字摘要，存成 `summaries.json`（網址對應摘要；值為 `REMOVE` 表示刪除）
4. `python3 apply_summaries.py summaries.json`
5. `python3 build_site.py` 重新產生 `data.js`

抓取程式只負責找候選與暫時摘要。分類依關鍵字粗分，上線前可在 `news_db.json` 改 `category`。示例稿請留在資料庫裡，或在確認不再需要後自行刪除；正式稿不要加 `sample: true`，也不要使用【示例】標題。

## 部署

GitHub 專案的 Pages 來源設為 `main` 分支根目錄。更新時：

```bash
./deploy.sh publish   # 只重建 data.js 並推送
./deploy.sh 3         # 先抓近 3 天候選，再重建並推送
```

`deploy.sh` 會在工作目錄提交並 `git push origin main`。沒有內容變更時不會推送。Pages 若啟用 Jekyll，專案根目錄已放 `.nojekyll`。

## 無障礙

頁面語言、跳至主要內容、鍵盤焦點、三檔字級、分類文字（不只靠顏色）、900 與 640 畫素的單欄版面，說明見網站上的「無障礙」頁。本站沒有宣稱通過第三方檢測。
