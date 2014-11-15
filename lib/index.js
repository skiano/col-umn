
/*  
 * Entry Point (development mode)
 *
 */
var BaseGrid = require('./Grid');

/*
 * PROVIDING A VALIDATOR
 * FOR THE MODULE
 *
 */
var Vallidator = require('./Vallidator');


module.exports = function configureGrid (supportedOptions) {
  /* 
   * Call the super constructor 
   * to initiate base class.
   */
  function ChainGrid (vallidator) { 
    BaseGrid.call( this, vallidator );
  };
  
  /* 
   * Provide options to the grid
   *
   */
  ChainGrid.prototype.__supportedOptions__ = supportedOptions || {};

  /*
   * return a function
   * that the user can call without worrying about 
   * vallidator or `new`
   *
   */
  return function makeGrid () {
    return new ChainGrid(new Vallidator());
  };
}

