function calculateTotal(cart, discountFunc) {
  const total = cart.reduce((sum, price) => sum + price, 0);
  return discountFunc(total);
}

const finalPrice = calculateTotal([100, 200, 300], sum => sum - 50);
console.log(finalPrice); // 550