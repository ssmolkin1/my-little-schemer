function loadTo(s) {
  s.isList = (exp) => {
    return Array.isArray(exp);
  };

  s.isAtom = (exp) => {
    return !s.isList(exp);
  };

  s.isObject = (a) => {
    return s.isAtom(a) && (typeof a === 'object')
  };

  s.isNumber = (exp) => {
    return !Number.isNaN(exp) && typeof exp === 'number';
  };

  s.isNull = (l) => {
    if (s.isAtom(l)) {
      throw new TypeError('The Law of isNull: You can only ask isNull of a list.');
    }
    return l.length === 0;
  };

  s.isFunction = (name) => {
    return s.isDefined(name) ? typeof s[name] === 'function' : typeof name === 'function';
  };

  s.isZero = (n) => {
    if (!s.isNumber(n)) {
      throw new TypeError('The Law of isZero: The argument of isZero must be a number.');
    }

    return n === 0;
  };
}

module.exports = { loadTo };
