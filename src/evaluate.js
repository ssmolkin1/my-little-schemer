module.exports = {
  isDefined(name) {
    return Object.prototype.hasOwnProperty.call(this, name);
  },

  value(exp) {
    if (this.isAtom(exp) || this.isNull(exp)) {
      if (this.isDefined(exp)) {
        return this.value(this[exp]);
      }

      return exp;
    }

    const first = this.car(exp);
    const rest = this.cdr(exp);

    if (this.isFunction(first)) {
      if (first === 'lambda' || first === 'define') {
        return this[first](...rest);
      }

      // Evaluation control needs to be handed off specially to these functions
      if (first === 'cond' || first === '||' || first === '&&' || first === 'quote' ||
        first === this.cond || first === this['||'] || first === this['&&'] || first === this.quote) {
        return this.isDefined(first) ? this[first](rest) : first(rest);
      }

      return this.isDefined(first) ? this[first](...this.value(rest)) : first(...this.value(rest));
    }

    return this.cons(this.value(first), this.value(rest));
  },

  evaluate(scheme, js = false, final = false, convert = false) {
    let input;

    // converts from scheme to JS if not already converted
    if (!js) {
      input = this.jSExpression(scheme);
    } else if (typeof scheme === 'number') {
      input = 0 + scheme;
    } else if (typeof scheme === 'boolean') {
      input = !!scheme;
    } else {
      input = scheme.slice();
    }

    // evaluates the input
    let output = this.value(input);

    // return only the final result if the option final is selected
    if (final && this.isList(output)) {
      output = output[output.length - 1];
    }

    // converts the output back to scheme if option convert is selected
    if (convert) {
      output = this.sExpression(output);
    }

    return output;
  },
};
