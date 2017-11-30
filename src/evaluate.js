function loadTo(s) {
  s.LIBS = {
    // Choose with libraries to use
    IN_USE: [],
    // Choose whether to use user definitions
    USE_DEFINED: true,
    defined: {},
  };

  s.getDefinition = (name) => {
    // User-defined terms take precedence over primitives and libraries
    if (s.LIBS.USE_DEFINED && Object.prototype.hasOwnProperty.call(s.LIBS.defined, name)) {
      return s.LIBS.defined[name];
    }

    const dfl = s.getDefFromLibs(s, s.LIBS, s.LIBS.IN_USE, name);

    return dfl !== '#NOT_DEFINED' ? dfl : name;
  };


  s.value = (exp) => {
    if (s.isObject(exp)) {
      const copy = Object.assign({}, exp);
      s.replaceObjVal(copy, s.value);
      return copy;
    }

    if (s.isAtom(exp) || s.isNull(exp)) {
      // NaN must be handled seperately, since it will create in infinite
      // loop if run through the ternary termination condition
      // below (since NaN !== NaN)
      if (Number.isNaN(exp)) {
        return exp;
      }
      const def = s.getDefinition(exp);
      return s.isEqual(exp, def) ? exp : s.value(def);
    }

    const first = s.getDefinition(s.car(exp));
    const rest = s.cdr(exp);

    if (s.isObject(first)) {
      const copy = Object.assign({}, first);
      s.replaceObjVal(copy, s.value);
      return s.cons(copy, s.value(rest));
    }

    if (s.isFunction(first)) {
      if (first === s.lambda || first === s.define || first === s.quote) {
        return first(...rest);
      }

      // Evaluation control needs to be handed off specially to these functions
      if (first === s.cond || first === s['||'] || first === s['&&']) {
        return first(rest);
      }

      return first(...s.value(rest));
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
    } else if (s.isObject(scheme)) {
      input = Object.assign({}, scheme);
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
