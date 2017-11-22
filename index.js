module.exports = {
  isList(exp) {
    return Array.isArray(exp);
  },

  isAtom(exp) {
    return !this.isList(exp);
  },

  isNumber(exp) {
    return (!!exp || exp === 0) && typeof exp === 'number';
  },

  isNull(l) {
    if (this.isAtom(l)) {
      throw new TypeError('The Law of isNull: You can only ask isNull of a list.');
    }
    return l.length === 0;
  },

  car(l) {
    if (this.isAtom(l) || this.isNull(l)) {
      throw new TypeError('The Law of Car: You can only take the car of a non-empty list.');
    }

    return l[0];
  },

  cdr(l) {
    if (this.isAtom(l) || this.isNull(l)) {
      throw new TypeError('The Law of Cdr: You can only take the cdr of a non-empty list.');
    }

    return l.slice(1);
  },

  cons(exp, l) {
    if (this.isAtom(l)) {
      throw new TypeError('The Law of Cons: The second argument must be a list.');
    }

    const n = l.slice(0);

    n.unshift(exp);

    return n;
  },

  jSExpression(string) {
    if (typeof string !== 'string') {
      throw new Error('The argument must be a string');
    }

    if (/[\[\]{}]/.test(string)) {
      console.warn(`Warning: Please check that you are using valid Scheme syntax. String representations of Javascript objects and arrays
        may not be handled as expected the jSExpression converter.`);
    }
    
    const that = this;
    let exp = `(${string.slice(0)})`; // clone string wrap string in outer parens (valid expressions must be wrapped in outer parens)

    exp = JSON.parse(exp
      // split string on spaces, parens and commas (the last one to avoid errors)
      .split(/([()\s,])/)
      // filter out empty strings, white space and newline
      .filter(a => (a !== '' && a !== ' ' && a !== '\n'))
      // handles backslash characters
      .map((a) => {
        if (a === '\\') {
          return '\\\\';
        }

        return a;
      })
      // create a string representation of an array
      .join(',')
      // wrap everything except parentheses in double quotes (required to parse JSON)
      .replace(/([^,()]+),/g, '"$1",')
      // unwrap numbers from double quotes
      .replace(/"(\d+\.?\d*|\.\d+)"/g, '$1')
      // handle grammatical commas
      .replace(/,,/g, ',","')
      // handle grammatical periods
      .replace(/,([.]+),/g, ',"$1",')
      // handle grammatical double quotes
      .replace(/"""/g, '"\\""')
      // add leading zero to decimal numbers, like '.5' (required to parse JSON)
      .replace(/(,)(\.)/g, '$10$2')
      // remove unecessary decimal point from integers, like '5.' (required to parse  JSON)
      .replace(/\.(,)/g, '$1')
      // replace ( with [
      .replace(/\(,/g, '[')
      // replace ) with ]
      .replace(/,?\)/g, ']'));

    function specailSymbols(a) {
      if (a === '#t') {
        return true;
      }

      if (a === '#f') {
        return false;
      }

      if (a === '#n') {
        return '\n';
      }

      if (a === '#NaN') {
        return NaN;
      }

      if (a === '#Infinity') {
        return Infinity;
      }

      if (a === '#null') {
        return null;
      }

      if (a === '#undefined') {
        return undefined;
      }

      return a;
    }

    function replaceSpecialSymbols(l) {
      if (that.isNull(l)) {
        return l;
      }

      const first = that.car(l);
      const rest = that.cdr(l);

      if (that.isAtom(first)) {
        return that.cons(specailSymbols(first), replaceSpecialSymbols(rest));
      }

      return that.cons(replaceSpecialSymbols(first), replaceSpecialSymbols(rest));
    }

    return this.car(replaceSpecialSymbols(exp));
  },

  isPrimitive(name) {
    return Object.prototype.hasOwnProperty.call(this, name);
  },

  isDefined(name) {
    return eval(`typeof ${name} !== 'undefined'`);
  },

  isFunction(name) {
    if (this.isPrimitive(name)) {
      return typeof this[name] === 'function';
    }

    if (this.isDefined(name)) {
      return eval(`typeof ${name} === 'function`);
    }

    return typeof name === 'function';
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
        first === ss.cond || first === ss['||'] || first === ss['&&'] || first === ss.quote) {
        return this.isDefined(first) ? this[first](rest) : first(rest);
      }

      return this.isDefined(first) ? this[first](...this.value(rest)) : first(...this.value(rest));
    }

    return this.cons(this.value(first), this.value(rest));
  },

  evaluate(scheme, js = false, final = false, convert = false) {
    let input = scheme.slice();

    // converts from scheme to JS if not already converted
    if (!js) {
      input = this.jSExpression(scheme);
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

  quote(exp) {
    return exp;
  },

  define(name, exp) {
    const that = this;
    const geval = eval;

    if (!this.isAtom(name)) {
      throw new Error('The Law of Define: The first argument must be an atom.');
    }

    geval(`var ${name} = '${that.value(exp)}'`)
  },

  undefine(name) {
    delete this[name];
  },

  cond(args) {
    const condition = this.car(args);
    const question = this.car(condition);
    const answer = this.car(this.cdr(condition));

    if (this.isNull(this.cdr(args)) && question !== 'else') {
      throw new SyntaxError('The Law of Cond: The last question must always be else!');
    }

    // Truthiness is not allowed
    if (this.value(question) === true || question === 'else') {
      return this.value(answer);
    }

    return this.cond(this.cdr(args));
  },

  lambda(args, func) {
    const that = this;

    function replace(list, matches, replacements) {
      if (that.isNull(list)) {
        return list;
      }

      const first = that.car(list);
      const rest = that.cdr(list);

      if (that.isAtom(first)) {
        const i = matches.indexOf(first);

        if (i > -1) {
          return that.cons(replacements[i], replace(rest, matches, replacements));
        }

        return that.cons(first, replace(rest, matches, replacements));
      }

      return that.cons(replace(first, matches, replacements), replace(rest, matches, replacements));
    }

    function result(...argValues) {
      return that.value(replace(func, args, argValues));
    }

    return result;
  },

  isEqan(a, b) {
    if (this.isList(a) || this.isList(b)) {
      throw new TypeError('The Law of isEqan: Eqan can only be used to compare two atoms');
    }

    return a === b;
  },

  isEqual(s1, s2) {
    if (this.isAtom(s1) && this.isAtom(s2)) {
      return s1 === s2;
    }

    if (this.isAtom(s1) || this.isAtom(s2)) {
      return false;
    }

    return this.isEqlist(s1, s2);
  },
  
  isEqlist(l1, l2) {
    if (this.isNull(l1) && this.isNull(l2)) {
      return true;
    }

    if (this.isNull(l1) || this.isNull(l2)) {
      return false;
    }

    return this.isEqual(this.car(l1), this.car(l2)) && this.isEqual(this.cdr(l1), this.cdr(l2));
  },

  '||': function (args) {
    return this.value(this.car(args)) || this.value(this.car(this.cdr(args)));
  },

  '&&': function (args) {
    return this.value(this.car(args)) && this.value(this.car(this.cdr(args)));
  },

  '+': function (n, m) {
    if (!this.isNumber(n) || !this.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n + m;
  },

  '-': function (n, m) {
    if (!this.isNumber(n) || !this.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n - m;
  },

  '*': function (n, m) {
    if (!this.isNumber(n) || !this.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n * m;
  },

  '/': function (n, m) {
    if (!this.isNumber(n) || !this.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n / m;
  },

  '%': function (n, m) {
    if (!this.isNumber(n) || !this.isNumber(m)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n % m;
  },

  add1(n) {
    if (!this.isNumber(n)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n + 1;
  },

  sub1(n) {
    if (!this.isNumber(n)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n - 1;
  },

  isZero(n) {
    if (!this.isNumber(n)) {
      throw new TypeError('Arithmetic operations can only be done on numbers.');
    }

    return n === 0;
  },

  sExpression(exp) {
    const that = this;

    function parens(a) {
      return that.cons(['('], that.cons(a, [')']));
    }

    function convert(input) {
      if (that.isAtom(input) || that.isNull(input)) {
        return input;
      }

      const first = that.car(input);
      const rest = that.cdr(input);

      if (that.isAtom(first)) {
        return that.cons(first, convert(rest));
      }

      return that.cons(parens(convert(first)), convert(rest));
    }

    function format(output) {
      if (that.isList(output)) {
        const replaced = output.map((a) => {
          if (a === '\n') {
            return '#n';
          }

          if (a === true) {
            return '#t';
          }

          if (a === false) {
            return '#f';
          }

          if (a === null) {
            return '#null';
          }

          if (a === undefined) {
            return '#undefined';
          }

          if (a === Infinity) {
            return '#Infinity';
          }

          if (Number.isNaN(a)) {
            return '#NaN';
          }

          return a;
        });

        const closed = parens(replaced);

        return closed.join()
          .replace(/,/g, ' ');
      }

      return output;
    }

    return format(convert(exp));
  },
};

const ss = module.exports;

function namespace() {
  ss.define('bob', 'hope');
  console.log(ss.isDefined('bob'));
}

namespace();
console.log(bob);
