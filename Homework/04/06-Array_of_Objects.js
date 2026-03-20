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