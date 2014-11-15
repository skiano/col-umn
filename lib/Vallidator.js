
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

var OverFlowError = 'Column Overflow Error';
var ChainMessage = 'at the % command in the chain';
var Pointer = ' -> ';

// create more intuitive strings for previewing
var commands = {};
commands[LINK_TYPE.GRID] = 'grid';
commands[LINK_TYPE.NEST] = 'nest';
commands[LINK_TYPE.COLUMN] = 'column';
commands[LINK_TYPE.OPTION] = 'setOption';

function fill (character, len) {
  return new Array(len + 1).join(character);
}

// https://ecommerce.shopify.com/c/ecommerce-design/t/ordinal-number-in-javascript-1st-2nd-3rd-4th-29259
function getGetOrdinal(n) {
  var s=["th","st","nd","rd"];
  var v=n%100;
  return n+(s[(v-20)%10]||s[v]||s[0]);
}

function reviewChain (chain) {

  var badLink = chain.pop();

  chain.forEach(function (link) {
    var str = fill('-',(link.depth+1)*2) + '| ' + commands[link.type];
    console.log(str)
  });

  var str = fill('>',(badLink.depth+1)*2) + '> ' + commands[badLink.type] + ' fails!';
  console.log(str)
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
      reviewChain(self.links);
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

      reviewChain(self.links);

      throw new Error('too much material');
    }
  }
}

