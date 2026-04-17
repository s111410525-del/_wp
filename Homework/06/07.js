function fakeGet(sql, params, callback) {
  // 模擬資料庫非同步回傳一筆資料
  callback(null, { title: "Fake Title" });
}

fakeGet("SELECT * FROM posts WHERE id = ?", [1], (err, row) => {
  console.log(row.title); // "Fake Title"
});