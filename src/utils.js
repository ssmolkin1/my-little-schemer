function loadTo(s) {
  s.caller = lda => (...args) => lda.call(this, ...args);
}

module.exports = { loadTo };
