function loadTo(s) {
  s.LIBS = {};

  s.isDefined = (name) => {
    return Object.prototype.hasOwnProperty.call(s, name);
  };

  s.value = (exp) => {
    if (s.isAtom(exp) || s.isNull(exp)) {
      if (s.isDefined(exp)) {
        return s.value(s[exp]);
      }

      return exp;
    }

    const first = s.car(exp);
    const rest = s.cdr(exp);

    if (s.isFunction(first)) {
      if (first === 'lambda' || first === 'define') {
        return s[first](...rest);
      }

      // Evaluation control needs to be handed off specially to these functions
      if (first === 'cond' || first === '||' || first === '&&' || first === 'quote' ||
        first === s.cond || first === s['||'] || first === s['&&'] || first === s.quote) {
        return s.isDefined(first) ? s[first](rest) : first(rest);
      }

      return s.isDefined(first) ? s[first](...s.value(rest)) : first(...s.value(rest));
    }

    return s.cons(s.value(first), s.value(rest));
  };

  s.evaluate = (scheme, js = false, final = false, convert = false) => {
    let input;

    // converts from scheme to JS if not already converted
    if (!js) {
      input = s.jSExpression(scheme);
    } else if (typeof scheme === 'number') {
      input = 0 + scheme;
    } else if (typeof scheme === 'boolean') {
      input = !!scheme;
    } else {
      input = scheme.slice();
    }

    // evaluates the input
    let output = s.value(input);

    // return only the final result if the option final is selected
    if (final && s.isList(output)) {
      output = output[output.length - 1];
    }

    // converts the output back to scheme if option convert is selected
    if (convert) {
      output = s.sExpression(output);
    }

    return output;
  };
}

module.exports = { loadTo };
