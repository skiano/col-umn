
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

function makeGrid () {
  return new Grid(new Vallidator()); 
}


