
/* 
 * Full Vallidator
 *
 */
var Vallidator;

/*
 * CONSTANTS
 *
 */
var LINK_TYPE = require('./LinkTypes');

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
    var str = fill('-',(link.depth+1)*2) + '| ' + commands[link.type];
    string.push(str);
  });

  var str = fill('>',(badLink.depth+1)*2) + '> ' + commands[badLink.type] + ' ~ '+ warning +' !';
  string.push(str);

  return string.join('\n');
}

/*
 * MAIN VALIDATOR CONSTRUCTOR
 *
 */
module.exports = Vallidator = function (usesInitialWidth) {
  var self = this;

  /*
   * If the user initializes the grid
   * with a column argument it will throw off the chain
   * because it produces an impled link
   *
   */
  self.offeset = usesInitialWidth;
  self.links = [{
    depth: 0,
    type: LINK_TYPE.GRID
  }];
  self.idx = 0;

  /*
   * Each link that is added is checked
   * to ensure it does not produce am invalid relationship
   *
   */
  self.checkLink = function (newLink, currentDepth) {
    var previousLink = self.links[self.idx].type;
    var relationship = [previousLink,newLink].join();
    var invalid = INVALID.indexOf(relationship) !== -1;
    if(invalid) {
      // console.log('hey');
      // var c = reviewChain(self.links);
      // console.log(c)
    }
    self.links.push({
      depth: currentDepth,
      type: newLink
    });
    self.idx += 1;
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
  
  console.error(fill('-',70));
  console.error('> '+ type +' caused the', getGetOrdinal(idx), 'link');
  console.error(message);
  
  // console.error(type);
  err.stack.forEach(function (frame, idx) {
    if (frame.getFunctionName()==='chainLink') {
      var mainErr = err.stack[idx + 1];
      console.error('> ' + mainErr.getFileName());
      console.error('> Line: ' + mainErr.getLineNumber());
    }
  });

  console.error(fill('-',70));

  throw err;

}


