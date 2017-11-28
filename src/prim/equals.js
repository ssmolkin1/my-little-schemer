function loadTo(s) {
  s.isEqobj = (o1, o2) => {
    if (!s.isObject(o1) || !s.isObject(o2)) {
      throw new TypeError('The Law of isEqobj: isEqobj can only be used to compare two objects.');
    }

    return s.isEqlist(Object.entries(o1), Object.entries(o2));
  };

  s.isEqan = (a1, a2) => {
    if (s.isList(a1) || s.isList(a2)) {
      throw new TypeError('The Law of isEqan: isEqan can only be used to compare two atoms.');
    }

    if (s.isObject(a1) && s.isObject(a2)) {
      return s.isEqobj(a1, a2);
    }

    if (s.isObject(a1) || s.isObject(a2)) {
      return false;
    }

    return a1 === a2;
  };

  s.isEqual = (s1, s2) => {
    if (s.isAtom(s1) && s.isAtom(s2)) {
      return s.isEqan(s1, s2);
    }

    if (s.isAtom(s1) || s.isAtom(s2)) {
      return false;
    }

    return s.isEqlist(s1, s2);
  };

  s.isEqlist = (l1, l2) => {
    if (s.isAtom(l1) || s.isAtom(l2)) {
      throw new TypeError('The Law of isEqlist: isEqlist can only be used to compare two lists.');
    }

    if (s.isNull(l1) && s.isNull(l2)) {
      return true;
    }

    if (s.isNull(l1) || s.isNull(l2)) {
      return false;
    }

    return s.isEqual(s.car(l1), s.car(l2)) && s.isEqual(s.cdr(l1), s.cdr(l2));
  };
}

module.exports = { loadTo };
