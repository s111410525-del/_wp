const jsonString = '{"id": 1, "status": "pending", "items": ["筆電", "滑鼠"]}';

function processOrder(json) {
    // 將 JSON 字串轉為物件
    let order = JSON.parse(json);
    order.status = "completed"; // 修改狀態
    
    // 再轉回 JSON 字串
    return JSON.stringify(order);
}
console.log(processOrder(jsonString));