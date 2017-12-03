function loadTo(s) {
  s.valueAsync = async function (exp) {
    return s.value(exp);
  };

  s.evaluateAsync = async function (scheme, callback, js = false, final = false, convert = false) {
    return s.evaluate(scheme, js, final, convert);
  };

  s.jSExpressionAsync = async function (input, callback) {
    return s.jSExpression(input);
  };

  s.sExpressionAsync = async function (exp, callback) {
    return s.sExpression(exp);
  };
}

module.exports = { loadTo };
