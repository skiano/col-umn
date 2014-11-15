
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

function supportOptions () {

}

var prohibitedMessage = ' option is prohibited';
var methodBase = 'set ';
var badOptionValue = ': does not support ';

function supportOption (optionName, vallidator) {
  /*
   * Prevent any accidental override of reserved options
   */
  if (optionName === 'width') {
    throw new Error('width is a reserved option name');
  }

  /*
   * adding the method base
   * ensures that this wont conflict with 
   * current methods and that useing the
   * options will feel more standardized
   *
   */
  // var methodName = camelCase(methodBase + optionName);

  /*
   * make this available to the constructor
   */
}

/*
 * convert option names to camelCase
 * http://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
 */
function camelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}


