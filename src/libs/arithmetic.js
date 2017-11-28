function loadTo(s) {
  s.LIBS.arithmetic = {};
  const lib = s.LIBS.arithmetic;

  lib['+'] = (n, m) => {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n + m;
  };

  lib['-'] = (n, m) => {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n - m;
  };

  lib['*'] = (n, m) => {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n * m;
  };

  lib['/'] = (n, m) => {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n / m;
  };

  lib['%'] = (n, m) => {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n % m;
  };
}

module.exports = { loadTo };
