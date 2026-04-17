const post = {
  id: 1,
  title: "Hello World",
  content: "Markdown content"
};

// 方式一：點符號 (常用，直觀)
console.log(post.title);

// 方式二：中括號 (當屬性名稱是變數或包含特殊字元時必用)
console.log(post["title"]);