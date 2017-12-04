function loadTo(S) {
  S.valueAsync = async function (exp) {
    return S.value(exp);
  };

  S.evaluateAsync = async function (scheme, js = false, final = false, convert = false) {
    return S.evaluate(scheme, js, final, convert);
  };

  S.jSExpressionAsync = async function (input) {
    return S.jSExpression(input);
  };

  S.sExpressionAsync = async function (exp) {
    return S.sExpression(exp);
  };
}

module.exports = { loadTo };
