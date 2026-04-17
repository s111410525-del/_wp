(() => {
  const count = 100;
  console.log("Count is: " + count);
})();
// 外部嘗試存取 console.log(count) 會噴出 ReferenceError，達到封裝效果。