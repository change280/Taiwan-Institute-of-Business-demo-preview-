/* 課程資料 — 編輯此檔即可更新課程列表。
   日期皆為西元 YYYY-MM-DD；報名狀態依 enrolStart / enrolEnd 與今天日期自動判斷。
   cat: tax | finance | accounting | management | seminar；ttip: 是否適用產業人才投資方案
   sample: true = 示意資料，上線前請替換或刪除 */
window.TIB_COURSES = {
  cats: [
    { id: "", name: "全部" }, { id: "tax", name: "財稅類" }, { id: "finance", name: "財務類" },
    { id: "accounting", name: "會計類" }, { id: "management", name: "管理類" }, { id: "seminar", name: "研討會" }
  ],
  items: [
    { cat: "tax", title: "營利事業所得稅結算申報實務班", teacher: "張進德 博士", start: "2026-11-08", end: "2026-11-22", time: "週日 09:00–16:00", hours: 18, loc: "台中", fee: 3500, ttip: true, code: "", enrolStart: "2026-10-01", enrolEnd: "2026-11-04", sample: true },
    { cat: "tax", title: "遺產及贈與稅節稅與傳承規劃班", teacher: "張進德 博士", start: "2026-11-15", end: "2026-11-29", time: "週日 09:00–16:00", hours: 12, loc: "台北", fee: 3000, ttip: false, enrolStart: "2026-10-05", enrolEnd: "2026-11-10", sample: true },
    { cat: "finance", title: "中小企業財務報表分析與經營決策班", teacher: "施靜慧 博士", start: "2026-11-22", end: "2026-12-20", time: "週日 09:00–16:00", hours: 30, loc: "高雄", fee: 5200, ttip: true, enrolStart: "2026-10-10", enrolEnd: "2026-11-18", sample: true },
    { cat: "tax", title: "營業稅與統一發票實務班", teacher: "生建運 老師", start: "2026-12-02", end: "2026-12-16", time: "週三 18:30–21:30", hours: 12, loc: "台中", fee: 2400, ttip: true, enrolStart: "2026-10-28", enrolEnd: "2026-11-28", sample: true },
    { cat: "management", title: "中小企業內部控制與內部稽核實務", teacher: "黃素慧 博士", start: "2026-12-12", end: "2026-12-26", time: "週六 09:00–16:00", hours: 18, loc: "台北", fee: 3800, ttip: false, enrolStart: "2026-11-02", enrolEnd: "2026-12-08", sample: true }
  ]
};
