function loadTo(s) {
  s.getDefFromLibs = (prim, lib, libNames, name) => {
    if (s.isNull(libNames)) {
      if (Object.prototype.hasOwnProperty.call(prim, name)) {
        return prim[name];
      }

      // Returns special message if name is not defined
      // (cannot return undefined becuase undefined might be the definiton of name)
      return '#NOT_DEFINED';
    }

    const first = s.car(libNames);
    const rest = s.cdr(libNames);

    if (Object.prototype.hasOwnProperty.call(lib[first], name)) {
      return lib[first][name];
    }

    return s.getDefFromLibs(prim, lib, rest, name);
  };

  // Get name from one or more library modules
  s.getLibName = (...libs) => libs.map(lib => lib.getName());

  // "Soft" unload def and sym libraries (removes names from "IN_USE", but does
  // not delete lib from s object)
  s._unloadLib = (base, ...libNames) => {
    const usedLibs = base.IN_USE;
    libNames.forEach((name) => {
      const i = usedLibs.indexOf(name);

      if (i !== -1) {
        usedLibs.splice(i, 1);
      }
    });
  };

  s.unloadDefLib = (...libNames) => s._unloadLib(s.LIBS, ...libNames);

  s.unloadSymLib = (...libNames) => s._unloadLib(s.SPEC_SYM, ...libNames);

  s.unloadLib = (...libNames) => {
    s.unloadDefLib(...libNames);
    s.unloadSymLib(...libNames);
  };

  // "Hard" unload by removing def and sym libs from s object (and also remove
  // names from "IN_USE")
  s._removeLib = (base, ...libNames) => {
    libNames.forEach(name => delete base[name]);
    s._unloadLib(base, ...libNames);
  };

  s.removeDefLib = (...libNames) => s._removeLib(s.LIBS, ...libNames);

  s.removeSymLib = (...libNames) => s._removeLib(s.SPEC_SYM, ...libNames);

  s.removeLib = (...libNames) => {
    s.removeDefLib(...libNames);
    s.removeSymLib(...libNames);
  };

  // Reload "soft" unloaded libs
  s._reloadLib = (base, ...libNames) => {
    const usedLibs = base.IN_USE;

    libNames.forEach((name) => {
      if (usedLibs.indexOf(name) !== -1) {
        console.warn(`The ${name} ${base === s.LIBS ? 'definition' : 'symbol'} library is already in use.`);
      } else {
        usedLibs.unshift(name);
      }
    });
  };

  s.reloadDefLib = (...libNames) => s._reloadLib(s.LIBS, ...libNames);

  s.reloadSymLib = (...libNames) => s._reloadLib(s.SPEC_SYM, ...libNames);

  s.reloadLib = (...libNames) => {
    s.reloadDefLib(...libNames);
    s.reloadSymLib(...libNames);
  };

  // Load def and sym library modules. Does a hard unload in case the library is already loaded;
  s.loadLib = (...libModules) => {
    libModules.forEach((mod) => {
      const name = mod.getName();
      s.removeLib(name);
      mod.loadTo(s);
    });
  };

  // Set and clear symbol and defintions
  s.define = (name, exp) => {
    if (typeof name !== 'string') {
      throw new Error('The Law of Define: The first argument must be a string.');
    }

    s.LIBS.defined[name] = s.value(exp);
  };

  s.undefine = (name) => {
    delete s.LIBS.defined[name];
  };

  s.setSym = (name, exp) => {
    if (typeof name !== 'string') {
      throw new Error('The Law of SetSym: The first argument must be a string.');
    }

    s.SPEC_SYM.defined[name] = exp;
  };

  s.remSym = (name) => {
    delete s.SPEC_SYM.defined[name];
  };

  // Hard and soft unload user definitions and symbols
  s.loadDefs = () => {
    s.LIBS.USE_DEFINED = true;
  };

  s.unloadDefs = () => {
    s.LIBS.USE_DEFINED = false;
  };

  s.clearDefs = () => {
    s.LIBS.defined = {};
  };

  s.loadSyms = () => {
    s.SPEC_SYM.USE_DEFINED = true;
  };

  s.unloadSyms = () => {
    s.SPEC_SYM.USE_DEFINED = false;
  };

  s.clearSyms = () => {
    s.SPEC_SYM.defined = {};
  };

  // Set used def and sym libs
  s._setUsedLibs = (base, array) => {
    base.IN_USE = array;
  };

  s.setUsedDefLibs = array => s._setUsedLibs(s.LIBS, array);

  s.setUsedSymLibs = array => s._setUsedLibs(s.SPEC_SYM, array);

  s.setUsedLibs = (array) => {
    s.setUsedDefLibs(array);
    s.setUsedSymLibs(array);
  };

  // Get used def and sym libs
  s._getUsedLibs = base => base.IN_USE.slice();

  s.getUsedDefLibs = () => s._getUsedLibs(s.LIBS);

  s.getUsedSymLibs = () => s._getUsedLibs(s.SPEC_SYM);

  s.getUsedLibs = () => {
    const result = {};

    result.defintions = s.getUsedDefLibs();
    result.symbols = s.getUsedSymLibs();

    return result;
  };

  // Get load order of sym and def libs: Load order is shown such that the rightmost item
  // is the last loaded and overrides anything to the left. This is the opposite of
  // how the IN_USE array works (lowest index (leftmost) overrides), although the IN_USE
  // array handles loading as you would expect (libs are loaded to front of array, so last loaded
  // lib overrides anything that came before it).
  s._getLoadOrder = (base) => {
    const result = s._getUsedLibs(base);
    result.push('primitive');

    if (base.USE_DEFINED) {
      result.unshift('defined');
    }

    return result.reverse();
  };

  s.getDefLoadOrder = () => s._getLoadOrder(s.LIBS);

  s.getSymLoadOrder = () => s._getLoadOrder(s.SPEC_SYM);

  s.getLoadOrder = () => {
    const result = {};

    result.defintions = s.getDefLoadOrder();
    result.symbols = s.getSymLoadOrder();

    return result;
  };
}

module.exports = { loadTo };
