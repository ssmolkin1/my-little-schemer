function loadTo(S) {
  S.LIBS = {
    // Choose with libraries to use
    IN_USE: [],
    // Choose whether to use user definitions
    USE_DEFINED: true,
    defined: {},
  };

  S.getDefinition = (name) => {
    // User-defined terms take precedence over primitives and libraries
    if (S.LIBS.USE_DEFINED && Object.prototype.hasOwnProperty.call(S.LIBS.defined, name)) {
      return S.LIBS.defined[name];
    }

    const dfl = S.getDefFromLibs(S, S.LIBS, S.LIBS.IN_USE, name);

    return dfl !== '#NOT_DEFINED' ? dfl : name;
  };


  S.value = (exp) => {
    if (S.isObject(exp)) {
      const copy = Object.assign({}, exp);
      S.replaceObjVal(copy, S.value);
      return copy;
    }

    if (S.isAtom(exp) || S.isNull(exp)) {
      // NaN must be handled seperately, since it will create in infinite
      // loop if run through the ternary termination condition
      // below (since NaN !== NaN)
      if (Number.isNaN(exp)) {
        return exp;
      }
      const def = S.getDefinition(exp);
      return S.isEqual(exp, def) ? exp : S.value(def);
    }

    const first = S.getDefinition(S.car(exp));
    const rest = S.cdr(exp);

    if (S.isObject(first)) {
      const copy = Object.assign({}, first);
      S.replaceObjVal(copy, S.value);
      return S.cons(copy, S.value(rest));
    }

    if (S.isFunction(first)) {
      if (first === S.lambda || first === S.define || first === S.quote) {
        return first(...rest);
      }

      // Evaluation control needs to be handed off specially to these functions
      if (first === S.cond || first === S['||'] || first === S['&&']) {
        return first(rest);
      }

      return first(...S.value(rest));
    }

    return S.cons(S.value(first), S.value(rest));
  };

  S.evaluate = (scheme, js = false, final = false, convert = false) => {
    let input;

    // converts from scheme to JS if not already converted
    if (!js) {
      input = S.jSExpression(scheme);
    } else if (typeof scheme === 'number') {
      input = 0 + scheme;
    } else if (typeof scheme === 'boolean') {
      input = !!scheme;
    } else if (S.isObject(scheme)) {
      input = Object.assign({}, scheme);
    } else {
      input = scheme.slice();
    }

    // evaluates the input
    let output = S.value(input);

    // return only the final result if the option final is selected
    if (final && S.isList(output)) {
      output = output[output.length - 1];
    }

    // converts the output back to scheme if option convert is selected
    if (convert) {
      output = S.sExpression(output);
    }

    return output;
  };
}

module.exports = { loadTo };
