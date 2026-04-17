const req = { body: { title: "JS教學", content: "內容在此", author: "Gemini" } };

// 使用一行程式碼解構
const { title, content } = req.body;

console.log(title);   // "JS教學"
console.log(content); // "內容在此"