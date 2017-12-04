function loadTo(S) {
  S.isEqobj = (o1, o2) => {
    if (!S.isObject(o1) || !S.isObject(o2)) {
      throw new TypeError('The Law of isEqobj: isEqobj can only be used to compare two objects.');
    }

    return S.isEqlist(Object.entries(o1), Object.entries(o2));
  };

  S.isEqan = (a1, a2) => {
    if (S.isList(a1) || S.isList(a2)) {
      throw new TypeError('The Law of isEqan: isEqan can only be used to compare two atoms.');
    }

    if (S.isObject(a1) && S.isObject(a2)) {
      return S.isEqobj(a1, a2);
    }

    if (S.isObject(a1) || S.isObject(a2)) {
      return false;
    }

    return a1 === a2;
  };

  S.isEqual = (s1, s2) => {
    if (S.isAtom(s1) && S.isAtom(s2)) {
      return S.isEqan(s1, s2);
    }

    if (S.isAtom(s1) || S.isAtom(s2)) {
      return false;
    }

    return S.isEqlist(s1, s2);
  };

  S.isEqlist = (l1, l2) => {
    if (S.isAtom(l1) || S.isAtom(l2)) {
      throw new TypeError('The Law of isEqlist: isEqlist can only be used to compare two lists.');
    }

    if (S.isNull(l1) && S.isNull(l2)) {
      return true;
    }

    if (S.isNull(l1) || S.isNull(l2)) {
      return false;
    }

    return S.isEqual(S.car(l1), S.car(l2)) && S.isEqual(S.cdr(l1), S.cdr(l2));
  };
}

module.exports = { loadTo };
