function loadTo(S) {
  /**
   * Takes a list of question and answer pairs as its argument. If the question evaluates to
   * true, the answer is evaluated. Otherwise, the next question is evaluated. The final
   * question is always 'else', which is always true. This is similar, but not equivalent to,
   * a series of JavaScript if ( ... ) { ... } else if ( ... ) { ... } else { ... } statements.
   * The difference is that "truthiness" is not allowed. The result of the question must
   * strictly equal true in order for the answer to be evaluated. Should only be used inside of
   * S-Expressions and jS-Expressions to avoid confusion.
   * @param  {list} args
   * @returns {*}
   * @example
   * // returns [ 'We', 'have', 'a', 'mouse', 'problem!' ]
   * evaluate(`
   *  (cond
   *   ((isNull (mouse)) (quote (No more mice in the house!)))
   *   (else (quote (We have a mouse problem!))))
   * `);
   */
  S.cond = (args) => {
    const condition = S.car(args);
    const question = S.car(condition);
    const answer = S.car(S.cdr(condition));

    if (S.isNull(S.cdr(args)) && question !== 'else') {
      throw new SyntaxError('The Law of Cond: The last question must always be else!');
    }

    // Truthiness is not allowed
    if (S.value(question) === true || question === 'else') {
      return S.value(answer);
    }

    return S.cond(S.cdr(args));
  };

  /**
   * Takes a list containing two expressions as its argument. If the first expression evaluates
   * to false, the second expression is evaluated and its result is returned. If the first
   * expression evaluates to true, the function returns true and the second expression of the
   * argument is not evaluated. However, "truthiness" is not allowed. The result of the first
   * expression must strictly equal either true or false. Otherwise, an error is thrown. This is
   * not equivalent to the JavaScipt || operator, which returns the result of the first expression
   * if it is "truthy" and the result of the second expression if the result of the first expression
   * is "falsy". Should only be used inside of S-Expressions and jS-Expressions to avoid confusion.
   * @param {list} args
   * @returns {*}
   * @example
   * // returns [ 'There', 'is', 'a', 'bird', 'in', 'the', 'house.' ]
   * evaluate(`(|| (isNull (bird)) (quote (There is a bird in the house.)))`);
   *
   * // throws an error
   * evaluate(`(|| (quote bird) (quote house))`);
   */
  S['||'] = (args) => {
    if (S.value(S.car(args)) === false) {
      return S.value(S.car(S.cdr(args)));
    }

    if (S.value(S.car(args)) === true) {
      return true;
    }

    throw new Error(`The result of the first expression of the argument must strictly
      equal either true or false. "Truthiness" is not permitted.`);
  };

  /**
   * Takes a list containing two expressions as its argument. If the first expression evaluates
   * to true, the second expression is evaluated and its result is returned. If the first
   * expression evaluates to false, the function returns false and the second expression of the
   * argument is not evaluated. However, "truthiness" is not allowed. The result of the first
   * expression must strictly equal either true or false. Otherwise, an error is thrown. This is
   * not equivalent to the JavaScipt && operator, which returns the result of the first expression
   * if it is "falsy" and the result of the second expression if the result of the first expression
   * is "truthy". Should only be used inside of S-Expressions and jS-Expressions to avoid confusion.
   * @param {list} args
   * @returns {*}
   * @example
   * // returns [ 'There', 'are', 'no', 'birds', 'in', 'the', 'house.' ]
   * evaluate(`(&& (isNull ()) (quote (There are no birds in the house.)))`);
   *
   * // throws an error
   * evaluate(`(&& (quote bird) (quote house))`);
   */
  S['&&'] = (args) => {
    if (S.value(S.car(args)) === true) {
      return S.value(S.car(S.cdr(args)));
    }

    if (S.value(S.car(args)) === false) {
      return false;
    }

    throw new Error(`The result of the first expression of the argument must strictly
      equal either true or false. "Truthiness" is not permitted.`);
  };
}

module.exports = { loadTo };
