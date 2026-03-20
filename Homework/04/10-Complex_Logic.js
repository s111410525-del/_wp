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