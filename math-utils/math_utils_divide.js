const math_utils_divide = (a, b) => {
    if (Number(b) === 0) {
        throw new Error('Division by zero is not allowed');
    }
    return (Number(a) / Number(b));
  }
  
  module.exports = math_utils_divide;