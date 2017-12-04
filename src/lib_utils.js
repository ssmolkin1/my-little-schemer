function loadTo(S) {
  S.getDefFromLibs = (prim, lib, libNames, name) => {
    if (S.isNull(libNames)) {
      if (Object.prototype.hasOwnProperty.call(prim, name)) {
        return prim[name];
      }

      // Returns special message if name is not defined
      // (cannot return undefined becuase undefined might be the definiton of name)
      return '#NOT_DEFINED';
    }

    const first = S.car(libNames);
    const rest = S.cdr(libNames);

    if (Object.prototype.hasOwnProperty.call(lib[first], name)) {
      return lib[first][name];
    }

    return S.getDefFromLibs(prim, lib, rest, name);
  };

  // Get name from one or more library modules
  S.getLibName = (...libs) => libs.map(lib => lib.getName());

  // "Soft" unload def and sym libraries (removes names from "IN_USE", but does
  // not delete lib from s object)
  S._unloadLib = (base, ...libNames) => {
    const usedLibs = base.IN_USE;
    libNames.forEach((name) => {
      const i = usedLibs.indexOf(name);

      if (i !== -1) {
        usedLibs.splice(i, 1);
      }
    });
  };

  S.unloadDefLib = (...libNames) => S._unloadLib(S.LIBS, ...libNames);

  S.unloadSymLib = (...libNames) => S._unloadLib(S.SPEC_SYM, ...libNames);

  S.unloadLib = (...libNames) => {
    S.unloadDefLib(...libNames);
    S.unloadSymLib(...libNames);
  };

  // "Hard" unload by removing def and sym libs from s object (and also remove
  // names from "IN_USE")
  S._removeLib = (base, ...libNames) => {
    libNames.forEach(name => delete base[name]);
    S._unloadLib(base, ...libNames);
  };

  S.removeDefLib = (...libNames) => S._removeLib(S.LIBS, ...libNames);

  S.removeSymLib = (...libNames) => S._removeLib(S.SPEC_SYM, ...libNames);

  S.removeLib = (...libNames) => {
    S.removeDefLib(...libNames);
    S.removeSymLib(...libNames);
  };

  // Reload "soft" unloaded libs
  S._reloadLib = (base, ...libNames) => {
    const usedLibs = base.IN_USE;

    libNames.forEach((name) => {
      if (usedLibs.indexOf(name) !== -1) {
        console.warn(`The ${name} ${base === S.LIBS ? 'definition' : 'symbol'} library is already in use.`);
      } else {
        usedLibs.unshift(name);
      }
    });
  };

  S.reloadDefLib = (...libNames) => S._reloadLib(S.LIBS, ...libNames);

  S.reloadSymLib = (...libNames) => S._reloadLib(S.SPEC_SYM, ...libNames);

  S.reloadLib = (...libNames) => {
    S.reloadDefLib(...libNames);
    S.reloadSymLib(...libNames);
  };

  // Load def and sym library modules. Does a hard unload in case the library is already loaded;
  S.loadLib = (...libModules) => {
    libModules.forEach((mod) => {
      const name = mod.getName();
      S.removeLib(name);
      mod.loadTo(S);
    });
  };

  // Set and clear symbol and defintions
  S.define = (name, exp) => {
    if (typeof name !== 'string') {
      throw new Error('The Law of Define: The first argument must be a string.');
    }

    S.LIBS.defined[name] = S.value(exp);
  };

  S.undefine = (name) => {
    delete S.LIBS.defined[name];
  };

  S.setSym = (name, exp) => {
    if (typeof name !== 'string') {
      throw new Error('The Law of SetSym: The first argument must be a string.');
    }

    S.SPEC_SYM.defined[name] = exp;
  };

  S.remSym = (name) => {
    delete S.SPEC_SYM.defined[name];
  };

  // Hard and soft unload user definitions and symbols
  S.loadDefs = () => {
    S.LIBS.USE_DEFINED = true;
  };

  S.unloadDefs = () => {
    S.LIBS.USE_DEFINED = false;
  };

  S.clearDefs = () => {
    S.LIBS.defined = {};
  };

  S.loadSyms = () => {
    S.SPEC_SYM.USE_DEFINED = true;
  };

  S.unloadSyms = () => {
    S.SPEC_SYM.USE_DEFINED = false;
  };

  S.clearSyms = () => {
    S.SPEC_SYM.defined = {};
  };

  // Set used def and sym libs
  S._setUsedLibs = (base, array) => {
    base.IN_USE = array;
  };

  S.setUsedDefLibs = array => S._setUsedLibs(S.LIBS, array);

  S.setUsedSymLibs = array => S._setUsedLibs(S.SPEC_SYM, array);

  S.setUsedLibs = (array) => {
    S.setUsedDefLibs(array);
    S.setUsedSymLibs(array);
  };

  // Get used def and sym libs
  S._getUsedLibs = base => base.IN_USE.slice();

  S.getUsedDefLibs = () => S._getUsedLibs(S.LIBS);

  S.getUsedSymLibs = () => S._getUsedLibs(S.SPEC_SYM);

  S.getUsedLibs = () => {
    const result = {};

    result.defintions = S.getUsedDefLibs();
    result.symbols = S.getUsedSymLibs();

    return result;
  };

  // Get load order of sym and def libs: Load order is shown such that the rightmost item
  // is the last loaded and overrides anything to the left. This is the opposite of
  // how the IN_USE array works (lowest index (leftmost) overrides), although the IN_USE
  // array handles loading as you would expect (libs are loaded to front of array, so last loaded
  // lib overrides anything that came before it).
  S._getLoadOrder = (base) => {
    const result = S._getUsedLibs(base);
    result.push('primitive');

    if (base.USE_DEFINED) {
      result.unshift('defined');
    }

    return result.reverse();
  };

  S.getDefLoadOrder = () => S._getLoadOrder(S.LIBS);

  S.getSymLoadOrder = () => S._getLoadOrder(S.SPEC_SYM);

  S.getLoadOrder = () => {
    const result = {};

    result.defintions = S.getDefLoadOrder();
    result.symbols = S.getSymLoadOrder();

    return result;
  };
}

module.exports = { loadTo };
