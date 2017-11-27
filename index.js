const evaluate = require('./src/evaluate');
const parsers = require('./src/parsers');
const types = require('./src/prim/types');
const equals = require('./src/prim/equals');
const ops = require('./src/prim/ops');
const logical = require('./src/prim/logical');
const lambda = require('./src/prim/lambda');
const utils = require('./src/utils');

module.exports = Object.assign(evaluate, parsers, types, equals, ops, logical, lambda, utils);
