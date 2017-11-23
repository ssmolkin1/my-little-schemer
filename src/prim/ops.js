module.exports = {
  car(l) {
    if (this.isAtom(l) || this.isNull(l)) {
      throw new TypeError('The Law of Car: You can only take the car of a non-empty list.');
    }

    return l[0];
  },

  cdr(l) {
    if (this.isAtom(l) || this.isNull(l)) {
      throw new TypeError('The Law of Cdr: You can only take the cdr of a non-empty list.');
    }

    return l.slice(1);
  },

  cons(exp, l) {
    if (this.isAtom(l)) {
      throw new TypeError('The Law of Cons: The second argument must be a list.');
    }

    const n = l.slice(0);

    n.unshift(exp);

    return n;
  },

  quote(exp) {
    return exp;
  },

  add1(n) {
    if (!this.isNumber(n)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n + 1;
  },

  sub1(n) {
    if (!this.isNumber(n)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n - 1;
  },

  define(name, exp) {
    if (!this.isAtom(name)) {
      throw new Error('The Law of Define: The first argument must be an atom.');
    }

    this[name] = this.value(exp);
  },

  undefine(name) {
    delete this[name];
  },
};
