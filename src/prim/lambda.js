function loadTo(s) {
  s.lambda = (args, func) => {

    function replace(list, matches, replacements) {
      if (s.isNull(list)) {
        return list;
      }

      const first = s.car(list);
      const rest = s.cdr(list);

      if (s.isAtom(first)) {
        const i = matches.indexOf(first);

        if (i > -1) {
          return s.cons(replacements[i], replace(rest, matches, replacements));
        }

        return s.cons(first, replace(rest, matches, replacements));
      }

      return s.cons(replace(first, matches, replacements), replace(rest, matches, replacements));
    }

    function result(...argValues) {
      return s.value(replace(func, args, argValues));
    }

    return result;
  };
}

module.exports = { loadTo };
