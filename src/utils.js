function loadTo(s) {
  // s.caller = lda => (...args) => lda.call(this, ...args);

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
}

module.exports = { loadTo };
