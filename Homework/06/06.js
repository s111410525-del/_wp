const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}';

const obj = JSON.parse(jsonStr);

console.log(obj.tags[1]); // "node" (陣列索引從 0 開始)