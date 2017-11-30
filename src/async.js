function loadTo(s) {
  s.valueAsync = async function(exp, callback) {
    try {
      return callback(await s.value(exp));
    } catch (e) {
      return console.error(e);
    }
  };

  s.evaluateAsync = async function(scheme, callback, js = false, final = false, convert = false) {
    try {
      return callback(await s.evaluate(scheme, js, final, convert));
    } catch (e) {
      return console.error(e);
    }
  };

  s.jSExpressionAsync = async function(string, callback) {
    try {
      return callback(await s.jSExpression(string));
    } catch (e) {
      return console.error(e);
    }
  };

  s.sExpressionAsync = async function(exp, callback) {
    try {
      return callback(await s.sExpression(exp));
    } catch (e) {
      return console.error(e);
    }
  };
}

module.exports = { loadTo };
