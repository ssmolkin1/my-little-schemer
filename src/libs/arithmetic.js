// Name of the library within the LIBS and SPEC_SYM objects
const name = 'arithmetic';

function getName() {
  return name;
}

function loadTo(S) {
  // Create new object within the S.LIB object, storing the library,
  S.LIBS[name] = {};
  const lib = S.LIBS[name];

  // Defs from libs loaded later take precedence over those loaded earlier
  S.LIBS.IN_USE.unshift(name);

  /* If you want to set special symbols for the parser in your library, you can
  do so by creating an S.SPEC_SYM[name] object and assiging symbol-definition
  key-value pairs to it. Initialize it's use with S.SPEC_SYM.IN_USE.unshift(name) */

  lib['+'] = (n, m) => {
    if (!S.isNumber(n) || !S.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n + m;
  };

  lib['-'] = (n, m) => {
    if (!S.isNumber(n) || !S.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n - m;
  };

  lib['*'] = (n, m) => {
    if (!S.isNumber(n) || !S.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n * m;
  };

  lib['/'] = (n, m) => {
    if (!S.isNumber(n) || !S.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n / m;
  };

  lib['%'] = (n, m) => {
    if (!S.isNumber(n) || !S.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n % m;
  };

  lib['='] = (n, m) => {
    if (!S.isNumber(n) || !S.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n === m;
  };
}

module.exports = { getName, loadTo };
