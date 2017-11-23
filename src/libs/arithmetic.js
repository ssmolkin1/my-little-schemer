module.exports = {
  '+': function (n, m) {
    if (!this.isNumber(n) || !this.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n + m;
  },

  '-': function (n, m) {
    if (!this.isNumber(n) || !this.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n - m;
  },

  '*': function (n, m) {
    if (!this.isNumber(n) || !this.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n * m;
  },

  '/': function (n, m) {
    if (!this.isNumber(n) || !this.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n / m;
  },

  '%': function (n, m) {
    if (!this.isNumber(n) || !this.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n % m;
  },
};
