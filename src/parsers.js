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
        s.replaceObjVal(val, replacer);
      }

      obj[key] = replacer(val);
    });
  };

  // Converts object (including all nested objects) into a rel
  s.toRel = (obj, stringify = false, toJSE = false) => {
    function relify(l) {
      if (s.isNull(l)) {
        return l;
      }

      const first = s.car(l);
      const rest = s.cdr(l);

      if (s.isObject(first)) {
        return s.cons(relify(Object.entries(first)), relify(rest));
      }

      if (s.isAtom(first)) {
        return s.cons(first, relify(rest));
      }

      return s.cons(relify(first), relify(rest));
    }

    let result = relify(Object.entries(obj));

    // Converts the result to a string for easy fit into an S-Expression
    if (stringify) {
      result = JSON.stringify(result);
    }

    // Converts to jS-Expression if standalone conversion is desired; @param stringify must
    // also be true for this to work
    if (toJSE) {
      result = s.jSExpression(result);
    }

    return result;
  };

  s.jSExpression = (input) => {
    function toJS(string) {
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

        if (s.SPEC_SYM.USE_DEFINED && Object.prototype.hasOwnProperty.call(def, a)) {
          return def[a];
        }

        const prim = s.SPEC_SYM.primitive;
        const dfl = s.getDefFromLibs(prim, s.SPEC_SYM, s.SPEC_SYM.IN_USE, a);

        if (dfl !== '#NOT_DEFINED') {
          return dfl;
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
    }

    // input can be an array of S-Expression strings...
    if (s.isList(input)) {
      return input.map(string => toJS(string));
    }

    // ... or a single string
    return toJS(input);
  };

  s.sExpression = (exp) => {
    const revSymEnts = {};
    const revSymVals = {};
    const symLib = s.SPEC_SYM;
    const usedSyms = symLib.IN_USE;
    const useDefs = symLib.USE_DEFINED;

    // delete overriden defined symbols ---
    const clonedSpecSym = Object.assign({}, symLib);
    const deleteList = usedSyms.slice();

    deleteList.push('primitive');

    function deleter(lib) {
      const keys = Object.keys(clonedSpecSym[lib]);

      deleteList.forEach((libName) => {
        keys.forEach((key) => {
          delete clonedSpecSym[libName][key];
        });
      });
    }

    if (useDefs) {
      deleter('defined');
    } else {
      // And delete unused symbol libraries
      delete clonedSpecSym.defined;
    }

    Object.keys(symLib).forEach((key) => {
      if (deleteList.indexOf(key) === -1 && key !== 'defined') {
        delete clonedSpecSym[key];
      }
    });
    // ... end of delete unused symbol libraries

    usedSyms.forEach((libName) => {
      deleteList.shift();
      deleter(libName);
    });
    //  --- end of delete overriden defined symbols

    const sse = Object.entries(clonedSpecSym);

    sse.forEach((ent) => {
      const libName = ent[0];
      const syms = ent[1];

      // create an object whose keys are library names and values are an array
      // of key-value pairs of symbol and defintion
      revSymEnts[libName] = Object.entries(syms);
      // create an object whose keys are library names and values are an array
      // of the defintions
      revSymVals[libName] = Object.values(syms);
    });

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

    function getSymFromRevLib(libNames, name) {
      if (s.isNull(libNames)) {
        const primI = revSymVals.primitive.indexOf(name);

        if (primI > -1) {
          return revSymEnts.primitive[primI][0];
        }

        // Returns special message if name is not defined
        // (cannot return undefined becuase undefined might be the definiton of name)
        return '#NOT_DEFINED';
      }

      const first = s.car(libNames);
      const rest = s.cdr(libNames);
      const firstLibI = revSymVals[first].indexOf(name);

      if (firstLibI > -1) {
        return revSymEnts[first][firstLibI][0];
      }

      return getSymFromRevLib(rest, name);
    }

    function specailSymbols(a) {
      if (useDefs) {
        const defI = revSymVals.defined.indexOf(a);

        if (defI > -1) {
          return revSymEnts.defined[defI][0];
        }
      }

      const sfl = getSymFromRevLib(usedSyms, a);

      if (sfl !== '#NOT_DEFINED') {
        return sfl;
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
