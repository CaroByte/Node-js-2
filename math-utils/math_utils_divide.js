const math_utils_divide = (a, b) => {
    if (Number(b) === 0) {
        throw new Error('División por cero no permitida');
    }
    return (Number(a) / Number(b));
}

module.exports = math_utils_divide;