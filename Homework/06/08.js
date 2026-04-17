let user = "Guest";

// 使用三元運算子判斷：條件 ? 真時結果 : 假時結果
const welcomeMsg = `<h1>Welcome, ${user ? user : "Stranger"}</h1>`;

console.log(welcomeMsg); // "<h1>Welcome, Guest</h1>"