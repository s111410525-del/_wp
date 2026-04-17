以下是完整對話紀錄：
---
Simple Blog 系統開發對話紀錄
初始需求
用 Node.js + SQLite 寫一個簡易的網路系統，放在 blog/ 目錄下。
建立時間：2026-03-27
---
完成的功能
## 1. 基本部落格系統
建立的檔案：
- blog/package.json - 專案設定
- blog/server.js - Express 伺服器
- blog/database.js - SQLite 資料庫設定
- blog/public/index.html - 前端頁面
- blog/public/style.css - 樣式
- blog/public/script.js - 前端邏輯
功能：
- 新增/編輯/刪除文章
- SQLite 資料庫持久化儲存
- RESTful API (/api/posts)
---
##　2. 文章詳情頁 + Rich Text 編輯器
更新內容：
- 加入 Quill.js Rich Text 編輯器
- 支援：標題、粗體、斜體、底線、顏色、列表、對齊、連結、圖片
- 點擊文章進入詳情頁閱讀
- 返回列表功能
---
## 3. 會員系統
新增功能：
- 註冊帳戶（帳號3+字元、密碼6+字元、密碼bcrypt加密）
- 登入/登出
- 切換帳號
- 文章作者追蹤（自己的文章才能編輯/刪除）
- 未登入只能看文章
新增資料表：
users (id, username, password, created_at)
posts 加上 user_id 欄位
API：
- POST /api/register - 註冊
- POST /api/login - 登入
- POST /api/logout - 登出
- GET /api/me - 取得當前登入資訊
---
## 4. 留言功能
新增資料表：
comments (id, post_id, user_id, content, created_at)
功能：
- 文章詳情頁底部可留言
- 顯示留言者名稱和時間
- 登入者可刪除自己的留言
- 未登入顯示「登入後可留言」提示
API：
- GET /api/posts/:id/comments - 取得留言
- POST /api/posts/:id/comments - 新增留言
- DELETE /api/comments/:id - 刪除留言
---
## 5. 點讚和分享功能
新增資料表：
likes (id, post_id, user_id, created_at)
功能：
- ♡/♥ 按鈕按讚/取消讚
- 讚數即時更新
- 「分享」按鈕複製文章連結
- 支援手機 Web Share API
- 未登入點讚引導登入
API：
- GET /api/posts/:id/likes - 取得讚數和是否已讚
- POST /api/posts/:id/like - 切換讚狀態
---
最終目錄結構
blog/
├── package.json
├── package-lock.json
├── server.js           # Express 伺服器 + API
├── database.js         # SQLite 設定
├── blog.db             # 資料庫檔案
└── public/
    ├── index.html      # 主頁面
    ├── style.css       # 樣式
    └── script.js       # 前端邏輯
運行方式
cd blog
npm start
然後瀏覽器打開 http://localhost:3001