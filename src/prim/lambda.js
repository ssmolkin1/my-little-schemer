function loadTo(S) {
  /**
   * Takes two list as arguments: a list of arguments and a function body. Returns a function.
   * Defining functions with lambda should only be done inside S-Expressions or jS-Expressions.
   * However, once defined, the functions are interoperable with JavaScript.
   * @param  {list} args
   * @param  {list} func
   * @returns  {function}
   * @example
   * evaluate(`(
   * (define isLat
   *  (lambda (l)
   *    (cond
   *      ((isNull l) #t)
   *      ((isAtom (car l)) (isLat (cdr l)))
   *      (else #f)))))`);
   *
   * // returns true
   * evaluate(`(isLat (cat dog)))`);
   *
   * const D = LIBS.defined;
   *
   * // returns true
   * D.isLat(['cat', 'dog']);
   */
  S.lambda = (args, func) => {
    function replace(list, matches, replacements) {
      if (S.isNull(list)) {
        return list;
      }

      const first = S.car(list);
      const rest = S.cdr(list);

      if (S.isAtom(first)) {
        const i = matches.indexOf(first);

        if (i > -1) {
          return S.cons(replacements[i], replace(rest, matches, replacements));
        }

        return S.cons(first, replace(rest, matches, replacements));
      }

      return S.cons(replace(first, matches, replacements), replace(rest, matches, replacements));
    }

    function result(...argValues) {
      return S.value(replace(func, args, argValues));
    }

    return result;
  };
}

module.exports = { loadTo };
