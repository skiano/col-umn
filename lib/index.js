
/*  
 * Entry Point (development mode)
 *
 */
var Grid = require('./Grid');

/*
 * PROVIDING A VALIDATOR
 * FOR THE MODULE
 *
 */
var Vallidator = require('./Vallidator');

module.exports = function MakeGrid (initialWidth) {
  return new Grid(initialWidth, new Vallidator(initialWidth));
}