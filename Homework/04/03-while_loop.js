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