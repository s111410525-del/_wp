function cleanData(arr) {
  arr.pop();        // 移除最後一個
  arr.unshift("Start"); // 最前面加 Start
}

let myData = [1, 2, 3];
cleanData(myData);
console.log(myData); // ["Start", 1, 2] -> 原陣列被改變了！