const S = {};

// loadTo interface allows circular reference without using 'this'
require('./src/evaluate').loadTo(S);
require('./src/parsers').loadTo(S);
require('./src/prim/types').loadTo(S);
require('./src/prim/equals').loadTo(S);
require('./src/prim/ops').loadTo(S);
require('./src/prim/logical').loadTo(S);
require('./src/prim/lambda').loadTo(S);
require('./src/lib_utils').loadTo(S);
require('./src/async').loadTo(S);

module.exports = S;
