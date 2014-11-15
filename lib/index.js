
/*  
 * Entry Point (development mode)
 *
 */
var Grid = require('./Grid');

/*
 * POLYFILL FOREACH to avoid dependancy on lodash
 *
 * Production steps of ECMA-262, Edition 5, 15.4.4.18
 * Reference: http://es5.github.io/#x15.4.4.18
 *
 */
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback, thisArg) {
    var T, k;
    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
      T = thisArg;
    }
    k = 0;
    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}

/*
 * PROVIDING A VALIDATOR
 * FOR THE MODULE
 *
 */
var Vallidator = require('./Vallidator');

module.exports = function MakeGrid (initialWidth) {
  return new Grid(initialWidth, new Vallidator(initialWidth));
}