## 習題 4

AI 問答 https://gemini.google.com/share/43092a743e44

## 摘要 

## 我的測試結果

```sh

....

https://gemini.google.com/share/e03d2be8eb37
##1
PS C:\chen\_wp\Homework\04> node 01-checkNumber.js
正數
##2
PS C:\chen\_wp\Homework\04> node 02-for_loop.js
5050
##3
PS C:\chen\_wp\Homework\04> node 03-while_loop.js
5, 4, 3, 2, 1, 發射！
##4
PS C:\chen\_wp\Homework\04> node 04-Array+function.js
[ 25, 18, 33, 40 ]
##5
PS C:\chen\_wp\Homework\04> node 05-Object.js
小明 今年 20 歲，就讀於 資工系。
##6
PS C:\chen\_wp\Homework\04> node 06-Array_of_Objects
總金額為：290
##7
PS C:\chen\_wp\Homework\04> node 07-JSON.js
{"id":1,"status":"completed","items":["筆電","滑鼠"]}
##8
PS C:\chen\_wp\Homework\04> node 08-Array+for.js
88
##9
PS C:\chen\_wp\Homework\04> node 09-Array+Object+if.js 
找到用戶：ID 2
##10
PS C:\chen\_wp\Homework\04> node 10-Complex_Logic.js
A 班 的平均分數是：78.33333333333333
```




沒問題！我為你準備了 10 個由淺入深的 JavaScript 練習題。這些題目涵蓋了你要求的 `if`、`for`、`while`、`function`、`JSON`、`Array` 與 `Object` 等核心概念。

---

## 1. 基礎數字判斷 (if/else)
判斷一個數字是正數、負數還是零。

```javascript
function checkNumber(num) {
    if (num > 0) {
        return "正數";
    } else if (num < 0) {
        return "負數";
    } else {
        return "這是零";
    }
}
console.log(checkNumber(10)); // 正數
```

---

## 2. 標準迴圈應用 (for loop)
計算 1 到 N 的總和。

```javascript
function sumToN(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}
console.log(sumToN(100)); // 5050
```

---

## 3. 倒數計時器 (while loop)
使用 `while` 模擬倒數計時。

```javascript
function countDown(start) {
    let result = [];
    while (start > 0) {
        result.push(start);
        start--;
    }
    result.push("發射！");
    return result.join(", ");
}
console.log(countDown(5)); // 5, 4, 3, 2, 1, 發射！
```

---

## 4. 陣列過濾器 (Array + function)
從陣列中找出所有大於 18 的數字（篩選成年人）。

```javascript
const ages = [12, 25, 18, 33, 40, 15];

function getAdults(arr) {
    return arr.filter(age => age >= 18);
}
console.log(getAdults(ages)); // [25, 18, 33, 40]
```

---

## 5. 物件屬性存取 (Object)
建立一個學生檔案並回傳格式化字串。

```javascript
const student = {
    name: "小明",
    age: 20,
    major: "資工系"
};

function getStudentInfo(s) {
    return `${s.name} 今年 ${s.age} 歲，就讀於 ${s.major}。`;
}
console.log(getStudentInfo(student));
```

---

## 6. 陣列物件處理 (Array of Objects)
計算購物車內商品的總金額。

```javascript
const cart = [
    { name: "蘋果", price: 30, count: 5 },
    { name: "香蕉", price: 20, count: 3 },
    { name: "牛奶", price: 80, count: 1 }
];

function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price * items[i].count;
    }
    return total;
}
console.log("總金額為：" + calculateTotal(cart)); // 290
```

---

## 7. JSON 格式轉換 (JSON)
模擬從伺服器收到 JSON 字串，並將其轉換為 JavaScript 物件後修改資料。

```javascript
const jsonString = '{"id": 1, "status": "pending", "items": ["筆電", "滑鼠"]}';

function processOrder(json) {
    // 將 JSON 字串轉為物件
    let order = JSON.parse(json);
    order.status = "completed"; // 修改狀態
    
    // 再轉回 JSON 字串
    return JSON.stringify(order);
}
console.log(processOrder(jsonString));
```

---

## 8. 尋找最大值 (Array + for)
不使用內建函式 `Math.max`，用迴圈找出陣列中的最大值。

```javascript
function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}
console.log(findMax([10, 5, 88, 23, 7])); // 88
```

---

## 9. 簡單搜尋引擎 (Array + Object + if)
根據關鍵字搜尋使用者名稱。

```javascript
const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
];

function findUser(name) {
    for (let user of users) {
        if (user.name === name) {
            return `找到用戶：ID ${user.id}`;
        }
    }
    return "找不到該用戶";
}
console.log(findUser("Bob")); // 找到用戶：ID 2
```

---

## 10. 巢狀資料處理 (Complex Logic)
統計班級平均分數。

```javascript
const classroom = {
    className: "A 班",
    students: [
        { name: "Jack", score: 90 },
        { name: "Rose", score: 85 },
        { name: "Tom", score: 60 }
    ]
};

function getAverageScore(data) {
    let total = 0;
    let students = data.students;
    
    for (let i = 0; i < students.length; i++) {
        total += students[i].score;
    }
    
    return total / students.length;
}
console.log(`${classroom.className} 的平均分數是：${getAverageScore(classroom)}`);
```

---

這些練習涵蓋了大部分前端開發會遇到的基礎語法。如果你對哪一個題目感興趣，或者想挑戰更難的題目，**需要我為你解釋其中某個函式的運作邏輯嗎？**