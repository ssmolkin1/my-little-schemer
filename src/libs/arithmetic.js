// Name of the library within the LIBS and SPEC_SYM objects
const name = 'arithmetic';

function getName() {
  return name;
}

function loadTo(s) {
  // Create new object within the s.LIB object, storing the library,
  s.LIBS[name] = {};
  const lib = s.LIBS[name];

  // Defs from libs loaded later take precedence over those loaded earlier
  s.LIBS.IN_USE.unshift(name);

  /* If you want to set special symbols for the parser in your library, you can
  do so by creating an s.SPEC_SYM[name] object and assiging symbol-definition
  key-value pairs to it. Initialize it's use with s.SPEC_SYM.IN_USE.unshift(name) */

  lib['+'] = (n, m) => {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n + m;
  };

  lib['-'] = (n, m) => {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n - m;
  };

  lib['*'] = (n, m) => {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n * m;
  };

  lib['/'] = (n, m) => {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n / m;
  };

  lib['%'] = (n, m) => {
    if (!s.isNumber(n) || !s.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n % m;
  };
}

module.exports = { getName, loadTo };
