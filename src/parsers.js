function loadTo(s) {
  s.SPEC_SYM = {
    // Choose which symbol libraries to use
    IN_USE: [],
    // Choose whether to use user-defined symbols
    USE_DEFINED: true,
    primitive: {
      '#t': true,
      '#f': false,
      '#n': '\n',
      '#NaN': NaN,
      '#Infinity': Infinity,
      '#null': null,
      '#undefined': undefined,
    },

    defined: {},
  };

  // Deep replace objects
  s.replaceObjVal = (obj, replacer) => {
    Object.entries(obj).forEach((ent) => {
      const key = ent[0];
      const val = ent[1];

      if (s.isObject(val)) {
        s.replaceObjVal(val);
      }

      obj[key] = replacer(val);
    });
  };

  s.jSExpression = (string) => {
    if (typeof string !== 'string') {
      throw new Error('The argument must be a string');
    }

    function formatText(txt) {
      return txt.slice()
        .replace(/"/g, '#\\"#')
        .replace(/[{}[\],]/g, '#$&#');
    }

    let exp = `(${formatText(string.slice(0))})`; // clone string wrap string in outer parens (valid expressions must be wrapped in outer parens)

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
      const def = s.SPEC_SYM.defined;

      if (Object.prototype.hasOwnProperty.call(def, a)) {
        return def[a];
      }

      const prim = s.SPEC_SYM.primitive;

      if (Object.prototype.hasOwnProperty.call(prim, a)) {
        return prim[a];
      }

      if (typeof a === 'string') {
        // handles commas, double quotes and brackets
        const reformatted = a.slice()
          .replace(/#([{}[\],])#/g, '$1')
          .replace(/#"#/g, '"');

        // turn to JSON
        if (/(^{.*}$)|(^\[.*\]$)/.test(reformatted)) {
          return replaceSpecialSymbols(JSON.parse(reformatted));
        }

        return reformatted;
      }

      return a;
    }

    function replaceSpecialSymbols(sExp) {
      if (s.isObject(sExp)) {
        s.replaceObjVal(sExp, replaceSpecialSymbols);
        return sExp;
      }

      if (s.isAtom(sExp)) {
        return specailSymbols(sExp);
      }

      if (s.isNull(sExp)) {
        return sExp;
      }

      const first = s.car(sExp);
      const rest = s.cdr(sExp);

      if (s.isObject(first)) {
        s.replaceObjVal(first, replaceSpecialSymbols);
        return s.cons(first, replaceSpecialSymbols(rest));
      }

      if (s.isAtom(first)) {
        return s.cons(specailSymbols(first), replaceSpecialSymbols(rest));
      }

      return s.cons(replaceSpecialSymbols(first), replaceSpecialSymbols(rest));
    }

    return s.car(replaceSpecialSymbols(exp));
  };

  s.sExpression = (exp) => {
    const revSymEnts = {};
    const revSymVals = {};

    const sse = Object.entries(s.SPEC_SYM);

    sse.forEach((ent) => {
      revSymEnts[ent[0]] = Object.entries(ent[1]);
      revSymVals[ent[0]] = Object.values(ent[1]);      
    });

    const def = revSymEnts.defined;
    const prim = revSymEnts.primitive;

    function parens(a) {
      return s.cons(['('], s.cons(a, [')']));
    }

    function convert(input) {
      if (s.isAtom(input) || s.isNull(input)) {
        return input;
      }

      const first = s.car(input);
      const rest = s.cdr(input);

      if (s.isAtom(first)) {
        return s.cons(first, convert(rest));
      }

      return s.cons(parens(convert(first)), convert(rest));
    }

    function specailSymbols(a) {
      const defI = revSymVals.defined.indexOf(a);

      if (defI > -1) {
        return def[defI][0];
      }

      const primI = revSymVals.primitive.indexOf(a);

      if (primI > -1) {
        return prim[primI][0];
      }

      if (s.isObject(a)) {
        const copy = Object.assign({}, a);
        replaceSpecialSymbols(copy);
        return JSON.stringify(copy);
      }

      return a;
    }

    function replaceSpecialSymbols(jSExp) {
      if (s.isObject(jSExp)) {
        const copy = Object.assign({}, jSExp);
        s.replaceObjVal(copy, replaceSpecialSymbols);
        return JSON.stringify(copy);
      }

      if (s.isAtom(jSExp)) {
        return specailSymbols(jSExp);
      }

      if (s.isNull(jSExp)) {
        return jSExp;
      }

      const first = s.car(jSExp);
      const rest = s.cdr(jSExp);

      if (s.isObject(first)) {
        const copy = Object.assign({}, first);
        s.replaceObjVal(copy, replaceSpecialSymbols);
        return s.cons(JSON.stringify(copy), replaceSpecialSymbols(rest));
      }

      if (s.isAtom(first)) {
        return s.cons(specailSymbols(first), replaceSpecialSymbols(rest));
      }

      return s.cons(replaceSpecialSymbols(first), replaceSpecialSymbols(rest));
    }

    function format(output) {
      const replaced = replaceSpecialSymbols(output);

      if (s.isList(replaced)) {
        const closed = parens(replaced);
        return closed.join()
          .replace(/,/g, ' ');
      }

      return replaced.toString();
    }

    return format(convert(exp));
  };
}

module.exports = { loadTo };
