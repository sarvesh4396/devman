const examples = [
  {
    code: `function getCube(a) {
    var cube = a * a * a;
    return cube;
  }`,
    docs: ` * Returns cube of a decimal number
    * 
    * @param {Number} a A decimal integer
    * @returns {Number} Cube of integer a`,
  },
  {
    code: `function isEven(num) {
    return (num % 2) == 0;
  }`,
    docs: `* Checks a number is even or not
    *
    * @param {Number} num A decimal integer
    * @returns {bool} True if number is even else false`,
  },
  {
    code: `function factorial(x) {
    if (x == 1) {
      return 1;
    } else {
      // recursive call to the function
      return x * factorial(x - 1);
    }
  }`,
    docs: ` * This is a recursive function to find the factorial of an integer
    *
    * @param {Number} x A positive integer
    * @returns {Number} factorial of integer x`,
  },
];

module.exports = { js_examples: examples };

``;

`This is a recursive function
    to find the factorial of an integer

    Args:
        x (int): A positive integer

    Returns:
        int: factorial of integer x`;
