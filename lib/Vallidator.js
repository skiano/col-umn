
var Vallidator;
var LINK_TYPE = require('./linkTypes');

var INVALID = [
  [LINK_TYPE.INIT, LINK_TYPE.OPTION].join(), // init -> option
  [LINK_TYPE.INIT, LINK_TYPE.NEST].join(),   // init -> nest
  [LINK_TYPE.NEST, LINK_TYPE.OPTION].join(), // nest -> option
  [LINK_TYPE.NEST, LINK_TYPE.NEST].join()    // nest -> nest
];

module.exports = Vallidator = function (usesInitialWidth) {
  
  var self = this;

  /*
   * If the user initializes the grid
   * with a column argument it will throw off the chain
   * because it produces an impled link
   *
   */
  self.offeset = usesInitialWidth;
  self.links = [LINK_TYPE.INIT];
  self.idx = 0;

  self.checkLink = function (newLink) {
    var previousLink = self.links[self.idx];
    var invalid = INVALID.indexOf([previousLink,newLink].join()) !== -1;
    if(invalid) {

      console.log(self.links);

      console.log(invalid, previousLink, newLink);  
    }
    self.links.push(newLink);
    self.idx += 1;
  }

  self.checkOverflow = function (workingNest) {
    if (workingNest.expects < 0) {

      console.log(self.links)

      throw new Error('too much material');
    }
  }

}


