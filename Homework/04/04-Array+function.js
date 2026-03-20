const ages = [12, 25, 18, 33, 40, 15];

function getAdults(arr) {
    return arr.filter(age => age >= 18);
}
console.log(getAdults(ages)); // [25, 18, 33, 40]