const examples = [
  {
    code: `def get_cube(a):
        cube = a * a * a
        return cube`,
    docs: `Returns cube of a decimal number
    Args:
    a (int): A decimal integer
    
    Returns:
        cube (int): Cube of integer a`,
  },
  {
    code: `def is_even(num):
        return (num % 2) == 0`,
    docs: `Checks a number is even or not
    Args:
      num (int): A Decimal integer

    Returns:
      bool: True if number is even else false`,
  },
  {
    code: `def factorial(x):
    if x == 1:
        return 1
    else:
        # recursive call to the function
        return x * factorial(x - 1)
`,
    docs: `This is a recursive function
    to find the factorial of an integer

    Args:
        x (int): A positive integer

    Returns:
        int: factorial of integer x`,
  },
  {
    code: `def swap_number(a, b):
    a = a + b
    b = a - b
    a = a - b
    return a, b`,
    docs: `swaps two decimal numbers

    Args:
        a (int): A decimal integer number
        b (int): A decimal integer number

    Returns:
        a (int): swaped to value of b
        b (int): swaped to value of a`,
  },
  {
    code: `def popitem(self, last=True):
    if not self:
        raise KeyError("dictionary is empty")
    root = self.__root
    if last:
        link = root.prev
        link_prev = link.prev
        link_prev.next = root
        root.prev = link_prev
    else:
        link = root.next
        link_next = link.next
        root.next = link_next
        link_next.prev = root
    key = link.key
    del self.__map[key]
    value = dict.pop(self, key)
    return key, value`,
    docs: `Remove and return a (key, value) pair from the dictionary.
    Pairs are returned in LIFO order if last is true or FIFO order if false

    Args:
        last (bool, optional): _description_. Defaults to True.

    Raises:
        KeyError: dictionary is empty

    Returns:
        key,value: Removed (key, value) pair from the dictionary`,
  },
];

module.exports = { py_examples: examples };
