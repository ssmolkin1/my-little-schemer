module.exports = {
  SPEC_SYM: {
    primitive: {
      '#t': true,
      '#f': false,
      '#n': '\n',
      '#NaN': NaN,
      '#Infinity': Infinity,
      '#null': null,
      '#undefined': undefined,
      '#{': '{',
      '#}': '}',
      '#[': '[',
      '#]': ']',
      '#"#': '"',
    },

    defined: {},
  },

  formatText(txt) {
    return txt.slice()
      .replace(/\s"\s/g, ' #\\"# ')
      .replace(/,/g, '#,#');
  },

  jSExpression(string) {
    if (typeof string !== 'string') {
      throw new Error('The argument must be a string');
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
      // unwrap numbers from double quotes, except those which are object keys
      .replace(/"(\d+\.?\d*|\.\d+)"([^:])/g, '$1$2')
      // handle double double quotes
      .replace(/""([^"]*)""/g, '"\\"$1\\""')
      // handles JSON objects
      .replace(/([\]}])"/g, '$1')
      .replace(/"([\[{])/g, '$1')
      .replace(/"?,,,"?/g, ',')
      .replace(/\\,\\"/g, ',')
      // handle grammatical periods
      .replace(/,([.]+),/g, ',"$1",')
      // add leading zero to decimal numbers, like '.5' (required to parse JSON)
      .replace(/(,)(\.)/g, '$10$2')
      // remove unecessary decimal point from integers, like '5.' (required to parse  JSON)
      .replace(/\.(,)/g, '$1')
      // replace ( with [
      .replace(/\(,/g, '[')
      // replace ) with ]
      .replace(/,?\)/g, ']'));

    function specailSymbols(a) {
      const def = that.SPEC_SYM.defined;

      if (Object.prototype.hasOwnProperty.call(def, a)) {
        return def[a];
      }

      const prim = that.SPEC_SYM.primitive;

      if (Object.prototype.hasOwnProperty.call(prim, a)) {
        return prim[a];
      }

      // handle commas
      if (a.toString().slice(-3) === '#,#') {
        return `${a.toString().slice(0, -3)},`;
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
        // handles attached commas
        return that.cons(specailSymbols(first), replaceSpecialSymbols(rest));
      }

      return that.cons(replaceSpecialSymbols(first), replaceSpecialSymbols(rest));
    }

    return this.car(replaceSpecialSymbols(exp));
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
