
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


module.exports = function configureGrid (options) {

  var Configured = function () {

  };

  if (!options) {
    /*
     * if there are no options
     * assume no configuration
     * and return grid instance immediately
     *
     */
    return makeGrid();

  } else {
    /*
     * Otherwise 
     * allow user to 
     * affect Grid prototype
     *
     */
    Grid.prototype.hello = function () {
      console.log('hello');
    }
    return makeGrid;
  }
  
}

/*
 * Avoids use of `new`
 * and hides having to provide a grid validator
 *
 */
function makeGrid () {
  return new Grid(new Vallidator()); 
}


