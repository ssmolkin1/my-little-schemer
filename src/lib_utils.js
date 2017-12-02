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

  s.getLibNames = (...libs) => libs.map(lib => lib.getName());

  s.unloadLibs = (...libNames) => {
    const usedLibs = s.LIBS.IN_USE;
    libNames.forEach((name) => {
      usedLibs.splice(usedLibs.indexOf(name), 1);
    });
  };

  s.removeLibs = (...libNames) => {
    const libs = s.LIBS;
    libNames.forEach(name => delete libs[name]);
    s.unloadLibs(...libNames);
  };

  s.reloadLibs = (libNames, i = 0) => {
    const usedLibs = s.LIBS.IN_USE;

    function reload(name) {
      if (usedLibs.indexOf(name) !== -1) {
        console.warn(`The ${name} library is already in use.`);
      } else {
        usedLibs.splice(i, 0, name);
      }
    }

    if (s.isList(libNames)) {
      libNames.forEach(name => reload(name));
    } else {  // if only one name is passed as an argument
      reload(libNames);
    }
  };

  s.loadLibs = (...libModules) => {
    const libs = s.LIBS;
    libModules.forEach((mod) => {
      const name = mod.getName();
      if (Object.hasOwnProperty.call(libs, name)) {
        s.reloadLibs(name);
      } else {
        mod.loadTo(s);
      }
    });
  };

  s.loadDefs = () => {
    s.LIBS.USE_DEFINED = true;
  };

  s.unloadDefs = () => {
    s.LIBS.USE_DEFINED = false;
  };

  s.clearDefs = () => {
    s.LIBS.defined = {};
  };

  s.setUsedLibs = (array) => {
    s.LIBS.IN_USE = array;
  };

  s.getUsedLibs = () => s.LIBS.IN_USE.slice();

  s.getLoadOrder = () => {
    const libs = s.LIBS;
    const result = s.getUsedLibs();
    result.push('primitive');

    if (libs.USE_DEFINED) {
      result.unshift('defined');
    }

    return result.reverse();
  };
}

module.exports = { loadTo };
