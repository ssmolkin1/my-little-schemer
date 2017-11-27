const s = require('../../index');

module.exports = {
  '+': function (n, m) {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n + m;
  },

  '-': function (n, m) {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n - m;
  },

  '*': function (n, m) {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n * m;
  },

  '/': function (n, m) {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n / m;
  },

  '%': function (n, m) {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n % m;
  },
};
