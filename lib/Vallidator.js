
/* 
 * Full Vallidator
 *
 */
var Vallidator;

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
 * CONSTANTS
 *
 */
var LINK_TYPE = require('./LinkTypes');
var RESERVED_OPTIONS = ['width', 'fractional', 'denominator'];

/*
 * INVALID RELATIONSHIPS
 *
 */
var INVALID = [
  [LINK_TYPE.GRID, LINK_TYPE.OPTION].join(), // init -> option
  [LINK_TYPE.GRID, LINK_TYPE.NEST].join(),   // init -> nest
  [LINK_TYPE.NEST, LINK_TYPE.OPTION].join(), // nest -> option
  [LINK_TYPE.NEST, LINK_TYPE.NEST].join()    // nest -> nest
];

/*
 * What type of failures are possible 
 *
 */
var failureTypes = {
  overflow: 'Grid Overflow Error',
  syntax: 'Grid Syntax Error'
}

/*
 * Map link types to display names
 *
 */
var commands = {};
commands[LINK_TYPE.GRID] = 'grid';
commands[LINK_TYPE.NEST] = 'nest';
commands[LINK_TYPE.COLUMN] = 'column';
commands[LINK_TYPE.OPTION] = 'setOption';

/*
 * helper for creating repeating strings
 */
function fill (character, len) {
  return new Array(len + 1).join(character);
}

// https://ecommerce.shopify.com/c/ecommerce-design/t/ordinal-number-in-javascript-1st-2nd-3rd-4th-29259
function getGetOrdinal(n) {
  var s=["th","st","nd","rd"];
  var v=n%100;
  return n+(s[(v-20)%10]||s[v]||s[0]);
}

function reviewChain (chain, warning) {
  var string = [];
  var badLink = chain[chain.length-1];

  chain.slice(0,-1).forEach(function (link) {

    var args = link.args ? Array.prototype.slice.call(link.args, 0) : [];
    var str;


    if(link.type === LINK_TYPE.GRID) {
      str = 'grid('+args+')';
    } else {
      str = fill('-',(link.depth+1)*2) + '| ' + commands[link.type] + ' (' + args.join(', ') + ')';
    }
    
    string.push('> ' + str);

  });

  var args = badLink.args ? Array.prototype.slice.call(badLink.args, 0) : [];
  var str = fill('~',(badLink.depth+1)*2) + '| ' + commands[badLink.type] + ' (' + args.join(', ') + ') ~ '+ warning +' !';
  string.push('> ' + str);

  return string.join('\n');
}

/*
 * MAIN VALIDATOR CONSTRUCTOR
 *
 */
module.exports = Vallidator = function () {
  var self = this;

  self.links = [{
    depth: 0,
    type: LINK_TYPE.GRID
  }];
  self.idx = 0;

  self.checkOption = function (option) {
    if (RESERVED_OPTIONS.indexOf(option) !== -1) {
      throw new Error (option + ' is a resserved option. Make sure to specify option methods');
    }
  }

  /*
   * Each link that is added is checked
   * to ensure it does not produce am invalid relationship
   *
   */
  var currentDepth = 0;

  self.checkLink = function (newLink, workingNest, arguments) {
    var previousLink = self.links[self.idx].type;
    var relationship = [previousLink,newLink].join();
    var invalid = INVALID.indexOf(relationship) !== -1;

    if (previousLink === LINK_TYPE.NEST) {
      currentDepth += 1;
    }

    if (newLink === LINK_TYPE.COLUMN && 
                      workingNest && 
                      workingNest.expects === 0) {
      currentDepth -= 1;
    }

    self.links.push({
      depth: currentDepth,
      type: newLink,
      args: arguments
    });
    self.idx += 1;

    if(invalid) {

      var message = [
        null,
        reviewChain(self.links, 'invalid command'),
        null,
        '> Bad syntax: ' + commands[previousLink] + '() cannot be followed by .' + commands[newLink] + '()',
        null
      ].join('\n');

      gridError (self.idx, failureTypes.syntax, message)
    }
    
  }

  /*
   * When a column is added to a `nest`
   * this checks that the `capacity` has not been exceeded
   *
   */
  self.checkOverflow = function (workingNest) {
    if (workingNest.expects < 0) {

      // how much is too much?
      var excess = (-workingNest.expects);

      // translate to fraction if needed
      if (workingNest.parent.fractional) {
        excess = (excess / workingNest.parent.width * 100).toFixed(0) + ' %';
      } else {
        excess = excess + ' units'
      }

      var message = [
        null,
        reviewChain(self.links, 'overflowed'),
        null,
        '> Column exceeds its parent\'s capacity by ' + excess,
        null
      ].join('\n');

      gridError(self.idx+1, failureTypes.overflow, message);
      
    }
  }
}

function gridError (idx, type, message) {

  try {
    console.error(fill('-',70))
  } catch (e) {
    throw ('Grid Failed To Compile');
  }

  var finalMsg = [];

  var err = new Error();
  
  Error.prepareStackTrace = function (err, stack) {
    return stack;
  };

  Error.captureStackTrace(err, gridError);
  
  console.error('> '+ type +' caused the', getGetOrdinal(idx), 'link');
  console.error(message);

  var report = false;
  
  // console.error(type);
  err.stack.forEach(function (frame, idx) {
    var functionName = frame.getFunctionName();
    if (functionName ==='chainLink') {
      report = true;
    }
    var file = frame.getFileName();
    var line = frame.getLineNumber();
    console.error('> ' + file, 'Line', line);
  });

  console.error(fill('-',70));

  throw err;

}


