function loadTo(s) {
  s.cond = (args) => {
    const condition = s.car(args);
    const question = s.car(condition);
    const answer = s.car(s.cdr(condition));

    if (s.isNull(s.cdr(args)) && question !== 'else') {
      throw new SyntaxError('The Law of Cond: The last question must always be else!');
    }

    // Truthiness is not allowed
    if (s.value(question) === true || question === 'else') {
      return s.value(answer);
    }

    return s.cond(s.cdr(args));
  };

  s['||'] = args => s.value(s.car(args)) || s.value(s.car(s.cdr(args)));

  s['&&'] = args => s.value(s.car(args)) && s.value(s.car(s.cdr(args)));
}

module.exports = { loadTo };
