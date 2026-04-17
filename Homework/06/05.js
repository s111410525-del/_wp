function fetchData(id, callback) {
  const data = { id: id, status: "success" };
  // 按照慣例，第一個參數傳錯誤物件(此處為 null)，第二個傳資料
  callback(null, data);
}

fetchData(10, (err, result) => {
  if (!err) {
    console.log(result); // { id: 10, status: "success" }
  }
});