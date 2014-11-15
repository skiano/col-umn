
var Grid = require('./Grid');

/*
 * PROVIDING A VALIDATOR
 * FOR THE MODULE
 *
 */
var vallidator = require('./vallidate');

module.exports = function MakeGrid (options) {
  return new Grid(options, vallidator);
}