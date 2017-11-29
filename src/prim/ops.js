function loadTo(s) {
  s.car = (l) => {
    if (s.isAtom(l) || s.isNull(l)) {
      throw new TypeError('The Law of Car: You can only take the car of a non-empty list.');
    }

    return l[0];
  };

  s.cdr = (l) => {
    if (s.isAtom(l) || s.isNull(l)) {
      throw new TypeError('The Law of Cdr: You can only take the cdr of a non-empty list.');
    }

    return l.slice(1);
  };

  s.cons = (exp, l) => {
    if (s.isAtom(l)) {
      throw new TypeError('The Law of Cons: The second argument must be a list.');
    }

    const n = l.slice(0);

    n.unshift(exp);

    return n;
  };

  s.quote = exp => exp;

  s.add1 = (n) => {
    if (!s.isNumber(n)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n + 1;
  };

  s.sub1 = (n) => {
    if (!s.isNumber(n)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n - 1;
  };

  s.define = (name, exp) => {
    if (!s.isAtom(name)) {
      throw new Error('The Law of Define: The first argument must be an atom.');
    }

    s[name] = s.value(exp);
  };

  s.undefine = (name) => {
    delete s[name];
  };
}

module.exports = { loadTo };
