module.exports = {
  isList(exp) {
    return Array.isArray(exp);
  },

  isAtom(exp) {
    return !this.isList(exp);
  },

  isObject(a) {
    return this.isAtom(a) && (typeof a === 'object')
  },

  isNumber(exp) {
    return !Number.isNaN(exp) && typeof exp === 'number';
  },

  isNull(l) {
    if (this.isAtom(l)) {
      throw new TypeError('The Law of isNull: You can only ask isNull of a list.');
    }
    return l.length === 0;
  },

  isFunction(name) {
    return this.isDefined(name) ? typeof this[name] === 'function' : typeof name === 'function';
  },

  isZero(n) {
    if (!this.isNumber(n)) {
      throw new TypeError('The Law of isZero: The argument of isZero must be a number.');
    }

    return n === 0;
  },
};
