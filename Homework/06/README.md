## 習題7

-----

## 我的測試結果

```sh

....

##1
PS C:\chen\_wp\Homework\06> node 01.js
Hello World
Hello World

##2
PS C:\chen\_wp\Homework\06> node 02.js
JS教學
內容在此

##3
PS C:\chen\_wp\Homework\06> node 03.js
<div>A</div><div>B</div>

##4
PS C:\chen\_wp\Homework\06> node 04.js
{ id: 99 }

##5
PS C:\chen\_wp\Homework\06> node 05.js
{ id: 10, status: 'success' }

##6
PS C:\chen\_wp\Homework\06> node 06.js
node

##7
PS C:\chen\_wp\Homework\06> node 07.js
Fake Title

##8
PS C:\chen\_wp\Homework\06> node 08.js
<h1>Welcome, Guest</h1>

##9
PS C:\chen\_wp\Homework\06> node 09.js
[ 'Very long ...', 'Another Ve...', '3rd Very l...' ]

##10
PS C:\chen\_wp\Homework\06> node 10.js
Error: Access Denied
Welcome
```


# 全方位 JavaScript 實作挑戰：從基礎到後端邏輯

## 1\. 物件屬性存取 (Object Property Access)

  * **目標**：理解 `post.title` 的運作。
  * **題目**：宣告一個名為 `post` 的物件，包含 `id: 1`、`title: "Hello World"` 和 `content: "Markdown content"`。
  * **任務**：練習用兩種方式印出 `title`：
    1.  點符號 (Dot notation)
    2.  中括號 (Bracket notation)

## 2\. 物件解構賦值 (Object Destructuring)

  * **目標**：理解程式中 `const { title, content } = req.body;` 的寫法。
  * **題目**：假設有一個變數 `req` 內容如下：
    ```javascript
    const req = { body: { title: "JS教學", content: "內容在此", author: "Gemini" } };
    ```
  * **任務**：請用一行程式碼從 `req.body` 中取出 `title` 和 `content` 並宣告為同名常數。

## 3\. 陣列的遍歷與字串拼接 (Array forEach & Template Literals)

  * **目標**：理解部落格首頁如何產生文章列表。
  * **題目**：給定一個陣列 `const posts = [{id: 1, t: "A"}, {id: 2, t: "B"}]`。
  * **任務**：宣告一個空字串 `let html = ""`，並使用 `forEach` 遍歷陣列，將每個物件轉為 `<div>A</div>` 的格式拼接到 `html` 中。

## 4\. 字典與動態參數 (URL Params / Dictionary)

  * **目標**：理解 `req.params.id` 的來源。
  * **題目**：建立一個名為 `params` 的物件（字典），模擬 URL 參數。
  * **任務**：動態新增一個鍵為 `"id"`，值為 `99` 的屬性，然後印出這個物件。

## 5\. Callback 函數傳參 (Passing Data via Callbacks)

  * **目標**：理解 `getPost(id, callback)` 的非同步設計。
  * **題目**：撰寫一個函數 `fetchData(id, callback)`。
  * **內部邏輯**：在函數內宣告一個物件 `{ id: id, status: "success" }`。
  * **任務**：呼叫 `callback` 並將 `null` (代表錯誤) 與該物件傳進去。

## 6\. JSON 處理 (Parsing JSON)

  * **目標**：理解 `app.use(express.json())` 在處理什麼。
  * **題目**：給定一個 JSON 字串 `const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}'`。
  * **任務**：將它轉換成 JavaScript 物件，並印出 `tags` 陣列中的第二個元素。
  * **提示**：使用 `JSON.parse(jsonStr)`。

## 7\. 模擬資料庫查詢 (Simulating DB Queries)

  * **目標**：理解 `db.get` 的結構。
  * **題目**：寫一個函數 `fakeGet(sql, params, callback)`。
  * **內部邏輯**：不管 SQL 是什麼，直接呼叫 `callback(null, { title: "Fake Title" })`。
  * **測試**：呼叫這個函數，並在回呼函數中印出標題。

## 8\. 樣板字串中的邏輯運算 (Template Literals with Logic)

  * **目標**：理解網頁 HTML 模板的產生。
  * **題目**：宣告變數 `user = "Guest"`。
  * **任務**：使用「反引號 (` )」建立一個 HTML 字串，內容為  `\<h1\>Welcome, ${...}</h1>`，其中 `${}`內要判斷：如果`user`有值就顯示`user` ，否則顯示  `"Stranger"\`。

## 9\. 陣列物件的排序與切片 (Sort & Substring)

  * **目標**：理解 SQL 語法在 JS 端的預習邏輯（例如 `ORDER BY`, `substr`）。
  * **題目**：給定一個陣列 `["Very long content here", "Another Very long content here", "3rd Very long content here"]`。
  * **任務**：取出這個字串的前 10 個字元，並在後方加上 `"..."`。

## 10\. 錯誤優先回呼模式 (Error-First Callback Pattern)

  * **目標**：理解程式中不斷出現的 `if (err) return ...`。
  * **題目**：寫一個函數 `checkAdmin(role, callback)`。
  * **邏輯**：
    1.  如果 `role` 不是 `"admin"`，呼叫 `callback("Access Denied")`。
    2.  如果是 `"admin"`，呼叫 `callback(null, "Welcome")`。
  * **測試**：練習呼叫此函數並處理有錯誤與沒錯誤的兩種狀況。