# 新聞全視界 - 網誌系統開發筆記

## 此筆記由 opencode 協作完成

## 目錄
- [專案概述](#專案概述)
- [技術棧](#技術棧)
- [功能特色](#功能特色)
- [資料庫結構](#資料庫結構)
- [程式碼解析](#程式碼解析)
- [API 路由](#api-路由)
- [前端頁面](#前端頁面)
- [第三方 API](#第三方-api)
- [使用說明](#使用說明)

---

## 專案概述

這是一個用 Node.js + SQLite 打造的動態網誌系統，結合新聞聚合功能，讓使用者瀏覽多個國際新聞源的即時資訊，同時也能發表個人文章、互動交流。介面支援英文新聞即時翻譯成繁體中文。

---

## 技術棧

| 技術 | 用途 |
|------|------|
| Express.js | Web 框架 |
| sql.js | SQLite 資料庫 |
| EJS | 模板引擎 |
| bcryptjs | 密碼雜湊 |
| express-session | 會話管理 |
| axios | HTTP 請求（新聞抓取） |

---

## 功能特色

### 基礎功能
- 用戶註冊 / 登入系統
- 發表、檢視、刪除文章
- 密碼驗證（8位以上、英文及符號）

### 社群功能
- 按讚 / 收回
- 留言系統
- 分享功能（複製連結）
- 收藏文章
- 檢舉機制（10 次不同用戶檢舉即停權 30 分鐘）

### 新聞聚合
- 自動抓取 BBC、CNN、Reuters、NPR、ABC News、BBC中文、香港電台
- 每 5 分鐘自動更新
- 原文連結可直接跳轉新聞出處
- 英文新聞一鍵翻譯成繁體中文

---

## 資料庫結構

### users 用戶表
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  warnings INTEGER DEFAULT 0,
  suspended_until DATETIME
);
```

### posts 文章表
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title TEXT,
  content TEXT,
  created_at DATETIME,
  is_news INTEGER DEFAULT 0,
  news_link TEXT,
  news_source TEXT
);
```

### likes 按讚表
```sql
CREATE TABLE likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER,
  user_id INTEGER,
  UNIQUE(post_id, user_id)
);
```

### comments 留言表
```sql
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER,
  user_id INTEGER,
  content TEXT,
  created_at DATETIME
);
```

### favorites 收藏表
```sql
CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER,
  user_id INTEGER,
  UNIQUE(post_id, user_id)
);
```

### reports 檢舉表
```sql
CREATE TABLE reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER,
  reporter_id INTEGER,
  created_at DATETIME
);
```

---

## 程式碼解析

### server.js 主程式

#### 1. 翻譯功能
```javascript
async function translateText(text, targetLang = 'zh-TW') {
  // 使用 MyMemory 翻譯 API，將英文翻譯成中文
}
```
**用途**：讓使用者一鍵閱讀翻譯後的新聞內容

#### 2. 新聞抓取
```javascript
async function fetchNewsFromSource(name, url, limit = 8) {
  // 從 RSS XML 解析標題、描述、連結、發布時間
}
```
**用途**：從多個新聞源的 RSS feeds 聚合最新新聞

#### 3. 新聞自動更新
```javascript
async function refreshNews() {
  // 抓取所有來源 → 過濾重複 → 保留最新30則
}
setInterval(refreshNews, 5 * 60 * 1000);
```
**用途**：定時更新確保內容即時

#### 4. 用戶停權機制
```javascript
// 登入時檢查停權狀態
if (row[4] && new Date(row[4]) > new Date()) {
  return res.render('login', { error: '此帳號已被停用至 ...' });
}

// 檢舉累積10次自動停權
if (reportCount >= 10) {
  db.run('UPDATE users SET warnings = warnings + 1, suspended_until = ? ...');
}
```
**用途**：防止濫用，維護社群品質

#### 5. 按讚 / 收藏 Toggle
```javascript
const existing = db.exec('SELECT * FROM likes WHERE post_id = ? AND user_id = ?', ...);
if (existing) {
  db.run('DELETE FROM likes ...');   // 已按過 → 收回
} else {
  db.run('INSERT INTO likes ...');   // 沒按過 → 按讚
}
```
**用途**：同一用戶對同一文章切換按讚 / 收藏狀態

---

## API 路由

| 路由 | 方法 | 功能 |
|------|------|------|
| `/` | GET | 首頁（新聞 + 文章列表） |
| `/post/:id` | GET | 文章詳情 |
| `/post/:id?lang=zh` | GET | 翻譯後的文章 |
| `/login` | GET/POST | 登入 |
| `/register` | GET/POST | 註冊 |
| `/logout` | GET | 登出 |
| `/new` | GET/POST | 發表新文章 |
| `/favorites` | GET | 我的收藏 |
| `/like/:id` | POST | 按讚 / 收回 |
| `/favorite/:id` | POST | 收藏 / 取消 |
| `/comment/:id` | POST | 留言 |
| `/report/:id` | POST | 檢舉 |
| `/delete/:id` | POST | 刪除文章 |

---

## 前端頁面

### index.ejs 首頁
- 分為「我的文章」與「最新新聞」兩區
- 新聞顯示來源徽章與原文連結
- 支援按讚、收藏、分享、檢舉

### post.ejs 文章頁
- 完整文章內容與留言區
- 翻譯切換按鈕
- 新聞來源網址超連結，可直接前往出處

### register.ejs 註冊頁
- 密碼驗規則
- 即時錯誤提示

### login.ejs 登入頁
- 停權用戶拒絕登入

### favorites.ejs 收藏頁
- 顯示已收藏的所有文章

---

## 第三方 API

### 新聞 RSS 來源
```
BBC News:   https://feeds.bbci.co.uk/news/rss.xml
CNN:        https://rss.cnn.com/rss/edition.rss
Reuters:    https://news.google.com/rss/search?q=when:24h+allinurl:reuters.com
NPR:        https://feeds.npr.org/1001/rss.xml
ABC News:   https://feeds.abcnews.com/abcnews/topstories
BBC中文:    https://feeds.bbci.co.uk/zhongwen/trad/rss.xml
香港電台:   https://rthk.hk/rthk/news/rss/rss_news.xml
```
> Reuters 已於 2020 年關閉官方 RSS，改用 Google News RSS 搜尋替代

### MyMemory 翻譯 API
```
https://api.mymemory.translated.net/get?q=...&langpair=en|zh-TW
```
免費翻譯服務，單次限制 500 字元

---

## 使用說明

### 1. 安裝依賴
```bash
cd C:\chen\_wp\Mid
npm install
```

### 2. 啟動伺服器
```bash
npm start
```
服務將在 http://localhost:8080 啟動

### 3. 預設帳號
- 帳號：`admin`
- 密碼：`admin123`

### 4. 功能操作
- **發表文章**：登入後點擊「新文章」
- **按讚 / 收藏**：登入後點擊對應按鈕
- **閱讀原文**：點擊新聞標題旁或 meta 區的「文章連結」
- **翻譯新聞**：在新聞卡片點擊「翻譯成中文」
- **檢舉**：點擊檢舉按鈕，累積 10 次自動停權

---

## 開發紀錄

| 日期 | 更新內容 |
|------|----------|
| 初始 | 建立基本網誌系統（Node.js + SQLite + EJS） |
| 階段一 | 用戶註冊登入、密碼驗證 |
| 階段二 | 按讚、留言、分享社群功能 |
| 階段三 | 檢舉機制與自動停權 |
| 階段四 | 多來源新聞聚合 RSS 抓取 |
| 階段五 | 即時翻譯（英文 → 繁體中文） |
| 階段六 | 收藏功能 |
| 階段七 | 品牌更名為「新聞全視界」 |
| 階段八 | 新聞來源網址改為超連結、修正欄位對應 bug、UI 調整 |
| 階段九 | 修正新聞不更新 bug（sql.js 的 `stmt.step()` 未呼叫導致重複檢查失效） |
| 階段十 | 修復 RSS 來源斷線（Reuters 停用 RSS、CNN HTTP→HTTPS、ABC News URL 更新） |
| 階段十一 | 修正新聞日期排序（pubDate 轉 ISO 8601 格式）、新增 /refresh 手動更新路由 |
| 階段十二 | 移除 GET / 中阻塞的 refreshNews、setInterval 加上 try-catch 防止程序崩潰 |

---

## 如何在其他電腦開啟本網頁

本系統啟動後，同一區域網路（LAN）內的其他裝置可以透過以下方式連線：

### 1. 確認本機 IP 位址

在伺服器電腦上打開命令提示字元或 PowerShell，輸入：

```powershell
ipconfig
```

找到你的 IPv4 位址（通常長這樣：`192.168.x.x` 或 `10.x.x.x`）。

### 2. 啟動伺服器（同原有步驟）

```bash
cd C:\chen\_wp\Mid
npm start
```

你會看到：
```
Blog running at http://localhost:8080
```

### 3. 其他裝置連線

在同一個 Wi-Fi 或區域網路下的任何裝置（手機、平板、其他電腦），打開瀏覽器輸入：

```
http://192.168.x.x:8080
```

（請將 `192.168.x.x` 換成你第一步找到的真實 IP）

### 4. 常見問題

| 問題 | 解決方法 |
|------|----------|
| 連不上、網頁載入失敗 | 檢查伺服器電腦的防火牆是否允許 `8080` 埠 |
| `ERR_CONNECTION_REFUSED` | 確認伺服器正在執行，且本機 localhost 可正常開啟 |
| 手機連不上 | 確認手機和電腦使用同一個 Wi-Fi 網路 |
| 想使用其他埠號 | 修改 `server.js` 中的 `PORT` 變數後重啟 |

### 5. 防火牆設定（Windows）

若其他裝置連不上，需要在 Windows 防火牆開放 `8080` 埠：

```powershell
# 以系統管理員身分執行
New-NetFirewallRule -DisplayName "Blog 8080" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
```

### 6. 手動更新新聞

伺服器每 5 分鐘自動更新新聞，若想立即刷新，在瀏覽器網址列輸入：

```
http://localhost:8080/refresh
```

或從其他裝置：

```
http://192.168.x.x:8080/refresh
```

---

## 注意事項

1. **新聞來源**：主要為英文新聞，翻譯結果僅供參考
2. **資料庫**：使用 sql.js，重啟後若遺失資料可刪除 `blog.db` 重新初始化
3. **檢舉機制**：需累積 10 位不同用戶檢舉才會觸發停權
4. **翻譯限制**：單次翻譯最多 500 字元
5. **開發協作**：本專案由 opencode 協助開發與除錯

---

*本文件記錄「新聞全視界」網誌系統的完整開發過程，由 opencode 協作完成。*
