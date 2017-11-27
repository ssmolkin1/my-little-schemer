module.exports = {
  caller(lda) {
    return (...args) => lda.call(this, ...args);
  },
};
