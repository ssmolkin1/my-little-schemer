function loadTo(S) {
  /**
   * Takes any expression as an argument and returns true if the argument is a list
   * and false otherwise. A JavaScript array is a list.
   * @param  {*} exp
   * @returns  {boolean}
   * @example
   * // returns true
   * isList(['hello', 'world']);
   */
  S.isList = exp => Array.isArray(exp);

  /**
   * Takes any expression as an argument and returns true if the argument is an
   * atom and false otherwise. Anything which is not a list is an atom!
   * @param  {*} exp
   * @returns  {boolean}
   * @example
   * // returns true
   * isAtom('hello');
   *
   * // returns true
   * isAtom({ hello: 'world' });
   */
  S.isAtom = exp => !S.isList(exp);

  /**
   * Takes any expression as an argument and returns true if the argument is an atom which is
   * a JavaScript object (i.e., typeof argument === 'object') other than null and false
   * otherwise. isObject returns false if the argument is a JavaScript array, because arrays
   * are lists.
   * @param  {*} exp
   * @returns  {boolean}
   * @example
   * // returns true
   * isObject({ hello: 'world' });
   *
   * // returns false
   * isObject(['hello', 'world']);
   */
  S.isObject = exp => S.isAtom(exp) && (typeof exp === 'object') && exp !== null;

  /**
   * Takes any expression as an argument and returns true if the argument is a number (i.e.,
   * typeof argument === 'number') other than NaN and false otherwise.
   * @param  {*} exp
   * @returns  {boolean}
   * @example
   * // returns true
   * isNumber(15);
   */
  S.isNumber = exp => !Number.isNaN(exp) && typeof exp === 'number';

  /**
   * Takes a list as an argument and returns true if the argument is the empty list and
   * false otherwise.
   * @param  {list} l
   * @returns  {boolean}
   * @example
   * // returns true
   * isNull([]);
   */
  S.isNull = (l) => {
    if (S.isAtom(l)) {
      throw new TypeError('The Law of isNull: You can only ask isNull of a list.');
    }
    return l.length === 0;
  };

  /**
   * Takes an expression as an argument and returns true if the argument evaluates to a
   * function (i.e., it is a function or a reference to a function) and false otherwise.
   * @param  {*} exp
   * @returns  {boolean}
   * @example
   * // returns true
   * isFunction('cdr');
   *
   * // returns true
   * isFunction(console.log);
   */
  S.isFunction = exp => typeof S.getDefinition(exp) === 'function';

  /**
   * Takes a number as an argument and returns true if the argument is 0 and false
   * otherwise.
   * @param  {number} n
   * @returns  {boolean}
   * @example
   * // returns true
   * isZero(0);
   */
  S.isZero = (n) => {
    if (!S.isNumber(n)) {
      throw new TypeError('The Law of isZero: The argument of isZero must be a number.');
    }

    return n === 0;
  };
}

module.exports = { loadTo };
