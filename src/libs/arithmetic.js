function loadTo(s) {
  s.LIBS.arithmetic = {};
  const lib = s.LIBS.arithmetic;

  // Name for choosing whether to use library
  lib.NAME = 'arithmetic';
  // Defs from libs loaded later take precedence over those loaded earlier
  s.LIBS.IN_USE.unshift(lib.NAME);

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
