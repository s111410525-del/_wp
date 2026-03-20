const student = {
    name: "小明",
    age: 20,
    major: "資工系"
};

function getStudentInfo(s) {
    return `${s.name} 今年 ${s.age} 歲，就讀於 ${s.major}。`;
}
console.log(getStudentInfo(student));