# 網頁設計課程 — 學習筆記總彙整

> **申明**：本學期的作業大多藉助了 Gemini AI 及 opencode 的支援才完成，這份學習筆記也是有了 opencode 的協助才能完成。

**學生**：陳秉硯（s111410525）  
**學期**：114 學年下學期  
**學校**：國立金門大學 資訊工程學系  
**教師**：陳鍾誠  
**GitHub**：https://github.com/s111410525-del/_wp

---

## 目錄

1. [Homework 01 — 個人網頁](#homework-01--個人網頁)
2. [Homework 02 — 綜合表單](#homework-02--綜合表單)
3. [Homework 04 — JavaScript 基礎 10 題](#homework-04--javascript-基礎-10-題)
4. [Homework 05 — JavaScript 函數實作 10 題](#homework-05--javascript-函數實作-10-題)
5. [Homework 06 — JavaScript 後端預習 10 題](#homework-06--javascript-後端預習-10-題)
6. [AI Blog — 會員部落格系統](#ai-blog--會員部落格系統)
7. [Midterm — 新聞全視界](#midterm--新聞全視界)
8. [Git 學習筆記](#git-學習筆記)

---

## Homework 01 — 個人網頁

**路徑**：`Homework/01`  
**技術**：HTML + CSS  
**說明**：個人介紹靜態網頁，包含導覽列、關於我、求學動機、個人興趣、聯絡資訊等區塊。

### 重點摘要

| 主題 | 內容 |
|------|------|
| CSS 變數 | `:root { --primary-color: #58a6ff }` 統一管理主題色 |
| Flexbox | `display: flex; flex-wrap: wrap; gap: 10px` 標籤排版 |
| 黏性導覽 | `position: sticky; top: 0` 固定頂部導覽列 |
| 深色模式 | 整體採用 `#0d1117` 暗色背景 + 卡片式設計 |
| 響應式 | `max-width: 850px; margin: auto` 居中容器 |

### 學到什麼

- CSS 變數（Custom Properties）讓主題配色統一好維護
- `position: sticky` 搭配 `z-index` 做出固定導覽效果
- 卡片式設計（圓角、陰影、邊框）提升視覺質感

```html
<!-- 入門重點：語意化標籤與 CSS 選取器 -->
<nav>, <header>, <section>, <footer>
```

---

## Homework 02 — 綜合表單

**路徑**：`Homework/02`  
**技術**：HTML Form + CSS  
**說明**：展示 HTML 表單的各種輸入類型，包含 text、email、password、number、range、date、radio、checkbox、color、file、textarea 等。

### 重點摘要

| 輸入類型 | 用途 |
|----------|------|
| `text` | 一般文字 |
| `email` | 電子郵件（瀏覽器自動驗證格式） |
| `password` | 密碼（遮罩顯示） |
| `number` | 數字（可設 min/max） |
| `range` | 滑桿（0-100） |
| `date` | 日期選擇器 |
| `radio` | 單選 |
| `checkbox` | 多選 |
| `color` | 顏色挑選 |
| `file` | 檔案上傳 |
| `textarea` | 多行文字 |

### 學到什麼

- 每種 input type 的瀏覽器預設行為
- `label` 的 `for` 屬性與 input `id` 配對，提升無障礙體驗
- `fieldset` 與 `legend` 可進一步分組表單

---

## Homework 04 — JavaScript 基礎 10 題

**路徑**：`Homework/04/`  
**技術**：JavaScript（if/else、for、while、Array、Object、JSON）  
**AI 輔助**：Gemini 對話

### 題目列表

| 題號 | 檔案名稱 | 主題 | 重點 |
|------|----------|------|------|
| 01 | `01-checkNumber.js` | if/else | 判斷正數/負數/零 |
| 02 | `02-for_loop.js` | for 迴圈 | 1+2+...+n 加總 |
| 03 | `03-while_loop.js` | while 迴圈 | 倒數計時 + 字串拼接 |
| 04 | `04-Array+function.js` | Array + filter | 篩選成年年齡 |
| 05 | `05-Object.js` | 物件 | 學生資料格式化輸出 |
| 06 | `06-Array_of_Objects.js` | 物件陣列 | 購物車總金額計算 |
| 07 | `07-JSON.js` | JSON | `JSON.parse` / `JSON.stringify` |
| 08 | `08-Array+for.js` | 陣列最大值 | 手寫 `Math.max` |
| 09 | `09-Array+Object+if.js` | 搜尋引擎 | 依名稱查找用戶 |
| 10 | `10-Complex_Logic.js` | 巢狀資料 | 班級平均分數統計 |

### 學到什麼

- **if/else**：條件判斷的基本結構，注意 `===` 嚴格比較
- **for 迴圈**：`for (let i = 1; i <= n; i++)` 標準寫法
- **while 迴圈**：條件式迴圈，適合不確定次數的場景
- **Array.filter**：回傳新陣列，不修改原陣列
- **物件**：`key: value` 結構，可用點或中括號存取
- **JSON**：`parse`（字串→物件）與 `stringify`（物件→字串）
- **巢狀資料**：物件內包陣列，再包物件，學會逐層存取

---

## Homework 05 — JavaScript 函數實作 10 題

**路徑**：`Homework/05/`  
**技術**：JavaScript（Callback、IIFE、Arrow Function、Higher-Order Function、Closure）  
**AI 輔助**：Gemini 對話

### 題目列表

| 題號 | 主題 | 重點 |
|------|------|------|
| 01 | Callback 基礎 | `mathTool(10, 5, (a,b) => a+b)` |
| 02 | IIFE | 立即執行函數，封裝變數作用域 |
| 03 | Arrow + map | `prices.map(p => p * 0.8)` 打 8 折 |
| 04 | 破壞性修改 | `arr.pop()` + `arr.unshift()` 改變原陣列 |
| 05 | 高階函數 | `multiplier(factor)` 回傳 `n => n*factor` |
| 06 | 自寫 filter | `myFilter(arr, callback)` 手刻陣列篩選 |
| 07 | Arrow + filter | `users.filter(u => u.age >= 18)` 物件篩選 |
| 08 | 傳址陷阱 | `a.push(99)` vs `b = [100]` 的差異 |
| 09 | setTimeout | 延遲 2 秒執行 callback |
| 10 | 綜合應用 | `calculateTotal([100,200,300], sum => sum-50)` |

### 學到什麼

- **Callback**：函數作為參數傳遞，讓邏輯可抽換
- **IIFE**：`(() => { ... })()` 建立區域作用域，避免變數汙染
- **Arrow Function**：簡潔寫法，無 `this` 綁定
- **傳址 vs 傳值**：
  - `a.push(99)` → 修改原陣列內容（傳址）
  - `b = [100]` → 重新賦值，斷開與原變數的連結
- **高階函數**：函數回傳函數，產生特定行為的函數（如 `double`、`triple`）

```javascript
// 第 5 題經典閉包範例
const multiplier = (factor) => (n) => n * factor;
const double = multiplier(2);
console.log(double(10)); // 20
```

---

## Homework 06 — JavaScript 後端預習 10 題

**路徑**：`Homework/06/`  
**技術**：JavaScript（物件操作、解構賦值、forEach、JSON、Callback 模式）  
**說明**：為後端（Node.js + Express）開發做準備的練習

### 題目列表

| 題號 | 主題 | 重點 |
|------|------|------|
| 01 | 物件屬性存取 | `.title` vs `["title"]` |
| 02 | 解構賦值 | `const { title, content } = req.body` |
| 03 | forEach + 拼接 | `posts.forEach(p => html += \`<div>${p.t}</div>\`)` |
| 04 | 動態屬性 | `params["id"] = 99` 動態新增 |
| 05 | Callback 傳資料 | `callback(null, data)` 慣例 |
| 06 | JSON.parse | 解析 JSON 字串為物件 |
| 07 | 模擬資料庫 | `fakeGet(sql, params, callback)` |
| 08 | 三元運算子 | `` Welcome, ${user ? user : "Stranger"} `` |
| 09 | 字串切片 | `str.substring(0, 10) + "..."` |
| 10 | 錯誤優先回呼 | `if (err) return callback(err)` 模式 |

### 學到什麼

- **解構賦值**：從物件中快速取出屬性，減少重複 `req.body.xxx`
- **Error-First Callback**：Node.js 標準慣例，第一個參數是錯誤，第二個是資料
- **三元運算子**：`條件 ? 真值 : 假值`，模板渲染常用
- **模擬資料庫**：了解非同步查詢的 callback 結構，為 Express + SQLite 做準備

```javascript
// 第 10 題：Error-First Pattern 經典寫法
function checkAdmin(role, callback) {
  if (role !== "admin") return callback("Access Denied");
  callback(null, "Welcome");
}
checkAdmin("user", (err, msg) => {
  if (err) return console.error("Error:", err);
  console.log(msg);
});
```

---

## AI Blog — 會員部落格系統

**路徑**：`AI/blog/`, `AI/blog2/`, `AI/blog3/`  
**技術**：Node.js + Express + SQLite + bcrypt + Quill.js  
**說明**：透過與 Gemini AI 對話協作，逐步開發的部落格系統，分為三個版本。

### 版本演進

| 版本 | 目錄 | 功能 |
|------|------|------|
| blog2 | `AI/blog2/` | 基本 CRUD，無會員系統，純 RESTful API |
| blog3 | `AI/blog3/` | 同 blog2，幾乎相同 |
| blog | `AI/blog/` | 完整會員系統 + 留言 + 按讚 + Quill 編輯器 |

### blog — 完整功能

| 功能 | 技術 |
|------|------|
| 會員註冊/登入 | bcrypt 密碼加密 + express-session |
| 文章 CRUD | RESTful API (`/api/posts`) |
| Rich Text 編輯 | Quill.js 所見即所得編輯器 |
| 留言系統 | 留言 CRUD，可刪除自己留言 |
| 按讚功能 | 切換讚/取消讚，即時更新讚數 |
| 分享功能 | Web Share API / 複製連結 |

### 資料庫結構

```sql
users  (id, username, password, created_at)
posts  (id, user_id, title, content, created_at)
comments (id, post_id, user_id, content, created_at)
likes   (id, post_id, user_id, UNIQUE)
```

### 學到什麼

- **AI 協作開發**：用自然語言描述需求，AI 生成程式碼，再手動調整
- **RESTful API 設計**：GET/POST/PUT/DELETE 對應 CRUD
- **Session 認證**：`express-session` 管理登入狀態
- **密碼安全**：`bcrypt` 雜湊，不存明碼
- **關聯資料庫**：多張表（users, posts, comments, likes）透過 `user_id` / `post_id` 關聯

---

## Midterm — 新聞全視界

**路徑**：`Mid/`  
**技術**：Node.js + Express + SQLite + EJS + bcrypt + axios  
**說明**：期中專案，一個結合新聞聚合與社群互動的網誌系統，代號「新聞全視界」。

### 功能特色

| 類別 | 功能 |
|------|------|
| 會員 | 註冊/登入/登出，密碼強度驗證 |
| 文章 | 發表、檢視、刪除 |
| 社群 | 按讚、留言、收藏、分享 |
| 新聞 | 自動抓取 7 個國際新聞 RSS |
| 翻譯 | 一鍵翻譯英文新聞為繁體中文 |
| 檢舉 | 累積 10 次檢舉自動停權 30 分鐘 |

### 新聞來源

| 來源 | RSS Feed |
|------|----------|
| BBC News | `feeds.bbci.co.uk/news/rss.xml` |
| CNN | `rss.cnn.com/rss/edition.rss` |
| Reuters | Google News RSS 替代 |
| NPR | `feeds.npr.org/1001/rss.xml` |
| ABC News | `feeds.abcnews.com/abcnews/topstories` |
| BBC中文 | `feeds.bbci.co.uk/zhongwen/trad/rss.xml` |
| 香港電台 | `rthk.hk/rthk/news/rss/rss_news.xml` |

### 資料庫結構

```sql
users     (id, username, password, warnings, suspended_until)
posts     (id, user_id, title, content, created_at, is_news, news_link, news_source)
likes     (id, post_id, user_id, UNIQUE)
comments  (id, post_id, user_id, content, created_at)
favorites (id, post_id, user_id, UNIQUE)
reports   (id, post_id, reporter_id, created_at)
```

### 架構亮點

```
Mid/
├── server.js          # Express 主程式（路由 + 新聞抓取 + 翻譯）
├── database.js        # SQLite 初始化
├── package.json
├── views/             # EJS 模板
│   ├── index.ejs      # 首頁（新聞 + 文章）
│   ├── post.ejs       # 文章詳情（含留言、翻譯）
│   ├── login.ejs      # 登入
│   ├── register.ejs   # 註冊
│   ├── new.ejs        # 新文章
│   └── favorites.ejs  # 收藏
└── public/            # 靜態資源
```

### 關鍵程式碼片段

```javascript
// 翻譯功能（MyMemory API）
async function translateText(text, targetLang = 'zh-TW') {
  const response = await axios.get('https://api.mymemory.translated.net/get', {
    params: { q: text.substring(0, 500), langpair: 'en|' + targetLang }
  });
  return response.data.responseData.translatedText;
}

// 新聞自動更新（每 5 分鐘）
setInterval(refreshNews, 5 * 60 * 1000);

// 檢舉停權機制（10 次自動停權 30 分鐘）
if (reportCount >= 10) {
  const suspendedUntil = new Date(Date.now() + 30 * 60 * 1000);
  db.run('UPDATE users SET warnings = warnings + 1, suspended_until = ?',
    [suspendedUntil.toISOString(), postUserId]);
}
```

### 學到什麼

- **RSS 新聞聚合**：解析 XML，過濾重複，保留最新 30 則
- **外部 API 整合**：MyMemory 翻譯 API + 多個 RSS sources
- **計時任務**：`setInterval` 定時更新 + `try-catch` 防止崩潰
- **社群機制設計**：按讚 toggle、收藏、檢舉 + 停權
- **EJS 模板引擎**：伺服器端渲染（SSR），直接嵌入 JavaScript
- **IP 分享與防火牆**：區域網路透過 `ipconfig` 找到 IP，開放防火牆埠

---

## Git 學習筆記

**路徑**：`mynote/git的用法.md`（歷史記錄中）  
**說明**：記錄 Git 的基本用法

### 常用指令

```bash
git init                    # 初始化倉庫
git add <file>              # 加入暫存區
git commit -m "訊息"        # 提交
git log --oneline           # 查看提交歷史
git remote add origin <url> # 連接遠端倉庫
git push origin master      # 推送到 GitHub
```

### 學到什麼

- `git add` 加入暫存區，`git commit` 建立版本紀錄
- 透過 `git push` 將程式碼上傳 GitHub 備份與協作

---

## 總結

從 Homework 01～02 的純前端（HTML+CSS），到 Homework 04～06 的 JavaScript 紮根，再到 AI Blog 與 Mid 的全端專案，這學期學到了：

| 階段 | 技能 |
|------|------|
| 基礎 | HTML 語意化、CSS 版面設計、表單處理 |
| JS 核心 | 條件判斷、迴圈、陣列、物件、JSON |
| JS 進階 | Callback、IIFE、Arrow Function、Closure、HOF |
| 後端預習 | 解構賦值、Error-First Callback、非同步思維 |
| 全端開發 | Node.js + Express + SQLite + Session + EJS |
| API 整合 | RSS 解析、翻譯 API、RESTful 設計 |
| AI 協作 | 用自然語言描述需求，AI 輔助生成程式碼 |

---

*本學習筆記由 opencode 協作整理，內容來自 GitHub repo `s111410525-del/_wp`。*
