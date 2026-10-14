# TIB 新版網站 Demo

這是客戶展示用的獨立靜態網站副本，原始網站檔案保留在另一個資料夾。

## 開啟方式

先在終端機切換至已解壓縮的 `demo-preview` 資料夾，再執行：

```sh
python3 -m http.server 8000
```

瀏覽器開啟 <http://127.0.0.1:8000/>。結束展示後，在終端機按 `Control+C`。

也可直接用文字編輯器檢視 HTML、CSS 與 JavaScript；本 Demo 不需要安裝套件或執行建置。

## 展示內容

- `index.html` 首頁、通訊與出版品精選
- `about.html` 基金會、創辦人、董事會與文件預覽
- `about-page.css` 沿革、服務項目與法人資料彈窗的基金會頁樣式
- `about-interactions.js` 組織架構、捐助章程與基本資料彈窗互動
- `floating-dock.css` 六頁共用的右下角外連按鍵樣式
- `courses.html` 原站課程分類、年度篩選、關鍵字搜尋及分頁
- `courses-data.js` 原站 51 筆課程與 4 筆研討會紀錄
- `courses.js` 課程篩選、分頁及原站課程精選
- `course-detail.html`、`course-detail.js` 單筆課程詳情、原站課綱、圖片與來源連結
- `courses-extra.css` 課程歷年列表與詳情頁樣式
- `teachers.html` 師資介紹
- `news.html` 通訊焦點、消息分類、年度與關鍵字搜尋
- `publications.html` 出版品分類、搜尋及單書資訊
- `books-data.js` 書目資料
- `books.js` 出版品篩選及詳情互動
- `assets/` TIB 商標、網站情境照、張進德博士肖像與實際出版品書封；來源與版位見 `assets/README.md`
- `DEMO操作腳本.md` 建議的客戶展示路線、裝置尺寸與說明
- `DEMO進度與驗收報告.md` 十項 Demo 工作進度及驗收結果
- `evidence/about-redesign-review.json` 基金會頁改版與六頁浮動按鍵檢查紀錄
- `evidence/dock-responsive-review.json` 六頁浮動按鍵紋理、手機圖示與連結一致性檢查紀錄
- `evidence/course-records-review.json` 課程來源快照、筆數、分類與欄位覆蓋檢查紀錄
- `M0決策與資料準備清單.md` Demo 後正式上線前的決策與資料準備項目

課程頁匯入 TIB 原站公開分類中的 51 筆課程與 4 筆研討會紀錄，依類別、年度及關鍵字查找，並可查看單筆師資、招生／開課資訊、課綱與來源。資料快照為 2026-10-14；已結束的班別以歷年紀錄呈現，課程頁不會接收報名。首頁、課程及財稅消息版位已加入照片；通用授課與財務討論畫面均標為情境示意。全站導覽與分頁圖示使用業主提供的 TIB 商標；創辦人／主講師使用提供的張進德博士肖像；出版品頁收錄參考頁列出的 18 本書目，12 本使用提供的實際書封，其餘以「封面待補」版面標示。英文、法人文件與訂閱入口會顯示站內預覽；Demo 不會受理報名、寄送訂閱或保存信箱資料。已確認的元照出版社書頁會以新分頁開啟，其他外連均帶有目的地標示。

此版本使用繁體中文。TIB 商標、出版封面與張進德博士肖像為業主提供素材；其他師資照片、正式文件、課程與消息及收件服務，須由業主提供或核定後再置換。`screenshots/baseline-before-photo-refresh/` 是補入照片前的回歸截圖，請以目前網站畫面為準。
