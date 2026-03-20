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