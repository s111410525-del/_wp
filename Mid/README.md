# 新聞大盜 - 網誌系統開發筆記

## 此筆記是使用opencode完成

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

這是一個用 Node.js + SQLite 打造的動態網誌系統，結合了新聞聚合功能，讓使用者可以閱讀來自多個新聞源的即時新聞，同時也能發表自己的文章。

---

## 技術棧

| 技術 | 用途 |
|------|------|
| Express.js | Web 框架 |
| sql.js | SQLite 資料庫（瀏覽器端运行） |
| ejs | 模板引擎 |
| bcryptjs | 密碼雜湊 |
| express-session | 會話管理 |
| axios | HTTP 請求（新間抓取） |

---

## 功能特色

### 基礎功能
- 用戶註冊/登入系統
- 發表、檢視、刪除文章
- 密碼驗證（8位以上、英文及符號）

### 社群功能
- 按讚/收回功能
- 留言功能
- 分享功能（複製連結）
- 收藏功能
- 檢舉功能（累積10次停權30分鐘）

### 新聞功能
- 自動抓取多個新聞源（BBC、CNN、Reuters、NPR、ABC）
- 每5分鐘自動更新
- 即時翻譯功能（英文→中文）
- 新聞來源連結顯示

---

## 資料庫結構

### users 用戶表
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,        -- 帳號
  password TEXT,               -- 密碼（bcrypt雜湊）
  warnings INTEGER DEFAULT 0, -- 檢舉次數
  suspended_until DATETIME     -- 停權截止時間
);
```

### posts 文章表
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,             -- 作者ID（NULL為新聞）
  title TEXT,                  -- 標題
  content TEXT,                -- 內容
  created_at DATETIME,         -- 創建時間
  is_news INTEGER DEFAULT 0,  -- 是否為新聞
  news_link TEXT,              -- 新聞連結
  news_source TEXT             -- 新聞來源名稱
);
```

### likes 按讚表
```sql
CREATE TABLE likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER,             -- 文章ID
  user_id INTEGER,             -- 用戶ID
  UNIQUE(post_id, user_id)      -- 防止重複按讚
);
```

### comments 留言表
```sql
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER,             -- 文章ID
  user_id INTEGER,             -- 用戶ID
  content TEXT,                -- 留言內容
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
  // 使用 MyMemory 翻譯 API
  // 將英文翻譯成中文
}
```
**用途**：將英語新聞翻譯成繁體中文

#### 2. 新聞抓取
```javascript
async function fetchNewsFromSource(name, url, limit = 8) {
  // 從 RSS 來源解析 XML
  // 提取標題、描述、連結、發布時間
}
```
**用途**：從多個新聞源的 RSS  feeds 抓取最新新聞

#### 3. 新聞自動更新
```javascript
async function refreshNews() {
  // 抓取所有來源的新聞
  // 過濾重複的新聞
  // 保留最多30則新聞
}
setInterval(refreshNews, 5 * 60 * 1000); // 每5分鐘執行
```
**用途**：定時更新新聞，確保內容最新

#### 4. 用戶停權機制
```javascript
// 登入時檢查
if (row[4] && new Date(row[4]) > new Date()) {
  return res.render('login', { error: '此帳號已被停用至 ...' });
}

// 檢舉達到10次
if (reportCount[0] && reportCount[0].values[0][0] >= 10) {
  const suspendedUntil = new Date(Date.now() + 30 * 60 * 1000);
  db.run('UPDATE users SET warnings = warnings + 1, suspended_until = ? ...');
}
```
**用途**：防止濫用檢舉功能

#### 5. 按讚/收藏 Toggle 機制
```javascript
const existing = db.exec('SELECT * FROM likes WHERE post_id = ? AND user_id = ?', ...);
if (existing[0] && existing[0].values.length > 0) {
  db.run('DELETE FROM likes ...');  // 已按過就刪除
} else {
  db.run('INSERT INTO likes ...');  // 沒按過就新增
}
```
**用途**：同一用戶對同一文章只能按一次讚/收藏，點擊可切換

---

## API 路由

| 路由 | 方法 | 功能 |
|------|------|------|
| `/` | GET | 首頁（新間列表 + 我的文章） |
| `/post/:id` | GET | 文章詳情 |
| `/post/:id?lang=zh` | GET | 翻譯後的文章 |
| `/login` | GET/POST | 登入 |
| `/register` | GET/POST | 註冊 |
| `/logout` | GET | 登出 |
| `/new` | GET/POST | 發表新文章 |
| `/favorites` | GET | 我的收藏 |
| `/like/:id` | POST | 按讚/收回 |
| `/favorite/:id` | POST | 收藏/取消收藏 |
| `/comment/:id` | POST | 留言 |
| `/report/:id` | POST | 檢舉 |
| `/delete/:id` | POST | 刪除文章 |

---

## 前端頁面

### index.ejs 首頁
- 兩大區塊：「我的文章」和「最新新聞」
- 新聞顯示來源標籤和原文連結
- 支援按讚、收藏、分享、檢舉

### post.ejs 文章頁
- 完整文章內容
- 翻譯切換按鈕
- 留言區
- 所有互動功能

### register.ejs 註冊頁
- 密碼驗證規則
- 即時錯誤訊息顯示

### login.ejs 登入頁
- 停權用戶無法登入

### favorites.ejs 收藏頁
- 顯示所有已收藏的文章

---

## 第三方 API

### BBC News RSS
```
https://feeds.bbci.co.uk/news/rss.xml
```
抓取全球英文新聞

### MyMemory 翻譯 API
```
https://api.mymemory.translated.net/get?q=...&langpair=en|zh-TW
```
免費翻譯服務，單次限500字

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
服務將在 http://localhost:3000 啟動

### 3. 預設帳號
- 帳號：`admin`
- 密碼：`admin123`

### 4. 功能操作
- **發表文章**：登入後點擊「新文章」
- **按讚/收藏**：登入後點擊按鈕
- **翻譯新聞**：在新聞頁點擊「翻譯成中文」
- **檢舉**：點擊檢舉按鈕

---

## 開發紀錄

| 日期 | 更新內容 |
|------|----------|
| 初始 | 建立基本網誌系統 |
| +登入註冊 | 用戶系統 + 密碼驗證 |
| +社群功能 | 按讚、留言、分享 |
| +檢舉機制 | 停權功能 |
| +新聞功能 | 多來源新聞抓取 |
| +翻譯功能 | 即時翻譯 |
| +收藏功能 | 收藏文章 |
| +名稱變更 | 新聞大盜 |

---

## 注意事項

1. **新聞來源**：主要為英文新聞，翻譯僅供參考
2. **資料庫**：sql.js 為記憶體資料庫，重啟後需刪除 `blog.db` 重新初始化
3. **檢舉機制**：需累積10位不同用戶檢舉才會停權
4. **翻譯限制**：單次翻譯限制500字

---

*本文件由 AI 助手協助建立，記錄新聞大盜網誌系統的完整開發過程。*