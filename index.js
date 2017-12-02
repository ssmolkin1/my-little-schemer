const s = {};

// loadTo interface allows circular reference without using 'this'
require('./src/evaluate').loadTo(s);
require('./src/parsers').loadTo(s);
require('./src/prim/types').loadTo(s);
require('./src/prim/equals').loadTo(s);
require('./src/prim/ops').loadTo(s);
require('./src/prim/logical').loadTo(s);
require('./src/prim/lambda').loadTo(s);
require('./src/lib_utils').loadTo(s);
require('./src/async').loadTo(s);

module.exports = s;
