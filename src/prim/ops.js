/**
 * Inserts methods into namespace
 * @param  {object} S The namepsace into which the methods are inserted.
 * @returns  {void}
 */
function loadTo(S) {
  /**
   * Takes a non-empty list as its argument and return the first member of the argument.
   * @param  {list} l
   * @returns  {*}
   * @example
   * // returns 1
   * car([1, 2]);
   */
  S.car = (l) => {
    if (S.isAtom(l) || S.isNull(l)) {
      throw new TypeError('The Law of Car: You can only take the car of a non-empty list.');
    }

    let result = l[0];

    // Clone there result if it is a list or an object to keep the function pure
    if (S.isList(result)) {
      result = result.slice();
    }

    if (S.isObject(result)) {
      result = Object.assign({}, result);
    }

    return result;
  };

  /**
   * Takes a non-empty list as its argument and returns a new list contaiting the same members
   * as the argument, except for the car.
   * @param  {list} l
   * @return  {list}
   * @example
   * // returns [2]
   * cdr([1, 2]);
   */
  S.cdr = (l) => {
    if (S.isAtom(l) || S.isNull(l)) {
      throw new TypeError('The Law of Cdr: You can only take the cdr of a non-empty list.');
    }

    return l.slice(1);
  };

  /**
   * Takes two arguments, the second of which must be a list, and returns a new list comtaining
   * the first argument and the elements of the second argument.
   * @param  {*} exp
   * @param  {list} l
   * @returns {list}
   * @example
   * // returns ['cat', 'dog']
   * cons('cat', ['dog']);
   */
  S.cons = (exp, l) => {
    if (S.isAtom(l)) {
      throw new TypeError('The Law of Cons: The second argument must be a list.');
    }

    const n = l.slice(0);

    n.unshift(exp);

    return n;
  };

  /**
   * Takes any expression as its argument and returns the expression unevaluated. Should only
   * be used inside S-Expressions and jS-Expressions.
   * @param  {*} exp
   * @returns  {*}
   * @example
   * // returns ['cat', 'dog']
   * evaluate(`(cons cat (dog))`);
   *
   * // returns ['cons', 'cat', ['dog']]
   * evaluate(`(quote (cons cat (dog)))`);
   */
  S.quote = exp => exp;

  /**
   * Adds 1 to a number.
   * @param  {number} n
   * @returns {number}
   * @example
   * // returns 2
   * add1(1);
   */
  S.add1 = (n) => {
    if (!S.isNumber(n)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n + 1;
  };

  /**
   * Subtracts 1 from a number.
   * @param  {number} n
   * @returns {number}
   * @example
   * // returns 1
   * sub1(2);
   */
  S.sub1 = (n) => {
    if (!S.isNumber(n)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n - 1;
  };

  S.y = le => (f => f(f))(f => le(x => (f(f))(x)));
}

module.exports = { loadTo };
