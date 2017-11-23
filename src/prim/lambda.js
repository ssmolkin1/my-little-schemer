module.exports = {
  lambda(args, func) {
    const that = this;

    function replace(list, matches, replacements) {
      if (that.isNull(list)) {
        return list;
      }

      const first = that.car(list);
      const rest = that.cdr(list);

      if (that.isAtom(first)) {
        const i = matches.indexOf(first);

        if (i > -1) {
          return that.cons(replacements[i], replace(rest, matches, replacements));
        }

        return that.cons(first, replace(rest, matches, replacements));
      }

      return that.cons(replace(first, matches, replacements), replace(rest, matches, replacements));
    }

    function result(...argValues) {
      return that.value(replace(func, args, argValues));
    }

    return result;
  },
};
