function checkAdmin(role, callback) {
  if (role !== "admin") {
    return callback("Access Denied"); // 發現錯誤，提早回傳
  }
  callback(null, "Welcome");
}

// 測試一：錯誤狀況
checkAdmin("user", (err, msg) => {
  if (err) {
    console.error("Error:", err); // "Error: Access Denied"
    return;
  }
  console.log(msg);
});

// 測試二：正確狀況
checkAdmin("admin", (err, msg) => {
  if (err) return console.error(err);
  console.log(msg); // "Welcome"
});