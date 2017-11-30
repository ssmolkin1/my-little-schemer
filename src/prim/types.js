function loadTo(s) {
  s.isList = exp => Array.isArray(exp);

  s.isAtom = exp => !s.isList(exp);

  s.isObject = a => s.isAtom(a) && (typeof a === 'object') && a !== null;

  s.isNumber = exp => !Number.isNaN(exp) && typeof exp === 'number';

  s.isNull = (l) => {
    if (s.isAtom(l)) {
      throw new TypeError('The Law of isNull: You can only ask isNull of a list.');
    }
    return l.length === 0;
  };

  s.isFunction = name => typeof s.getDefinition(name) === 'function';

  s.isZero = (n) => {
    if (!s.isNumber(n)) {
      throw new TypeError('The Law of isZero: The argument of isZero must be a number.');
    }

    return n === 0;
  };
}

module.exports = { loadTo };
