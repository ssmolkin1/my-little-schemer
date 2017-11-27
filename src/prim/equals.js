module.exports = {
  isEqobj(o1, o2) {
    if (!this.isObject(o1) || !this.isObject(o2)) {
      throw new TypeError('The Law of isEqobj: isEqobj can only be used to compare two objects.');
    }

    return this.isEqlist(Object.entries(o1), Object.entries(o2));
  },

  isEqan(a1, a2) {
    if (this.isList(a1) || this.isList(a2)) {
      throw new TypeError('The Law of isEqan: isEqan can only be used to compare two atoms.');
    }

    if (this.isObject(a1) && this.isObject(a2)) {
      return this.isEqobj(a1, a2);
    }

    if (this.isObject(a1) || this.isObject(a2)) {
      return false;
    }

    return a1 === a2;
  },

  isEqual(s1, s2) {
    if (this.isAtom(s1) && this.isAtom(s2)) {
      return this.isEqan(s1, s2);
    }

    if (this.isAtom(s1) || this.isAtom(s2)) {
      return false;
    }

    return this.isEqlist(s1, s2);
  },

  isEqlist(l1, l2) {
    if (this.isAtom(l1) || this.isAtom(l2)) {
      throw new TypeError('The Law of isEqlist: isEqlist can only be used to compare two lists.');
    }

    if (this.isNull(l1) && this.isNull(l2)) {
      return true;
    }

    if (this.isNull(l1) || this.isNull(l2)) {
      return false;
    }

    return this.isEqual(this.car(l1), this.car(l2)) && this.isEqual(this.cdr(l1), this.cdr(l2));
  },
};
