module.exports = {
  cond(args) {
    const condition = this.car(args);
    const question = this.car(condition);
    const answer = this.car(this.cdr(condition));

    if (this.isNull(this.cdr(args)) && question !== 'else') {
      throw new SyntaxError('The Law of Cond: The last question must always be else!');
    }

    // Truthiness is not allowed
    if (this.value(question) === true || question === 'else') {
      return this.value(answer);
    }

    return this.cond(this.cdr(args));
  },

  '||': function (args) {
    return this.value(this.car(args)) || this.value(this.car(this.cdr(args)));
  },

  '&&': function (args) {
    return this.value(this.car(args)) && this.value(this.car(this.cdr(args)));
  },
};
