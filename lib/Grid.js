
// POLYFILL FOREACH to avoid dependancy on lodash
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
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
var LINK_TYPE = require ('./linkTypes');


module.exports = function Grid (initialWidth, vallidator) {

  vallidator = vallidator(initialWidth);

  /*
   * PRIVATE INFORMATION
   *
   */ 
  
  var self = this;
  var isRoot = true;
  
  var rootColumn = {};
  var workingColumn = rootColumn;
  var workingNest;

  /*
   * CHAIN FUNCTION
   * Helper to make sure 
   * all chained functions 
   * work consistantly
   *
   */
  function chainFn (linkType, fn) {
    return function () {
      /*
       * Allow vallidator the chance to
       * detect malformed chain
       */
      vallidator.checkLink(linkType, rootColumn);
      /*
       * Create the link
       */
      fn.apply(self, arguments);
      return self;
    }
  }

  /* 
   * HANDLE OPTIONS
   * arbitrary options are set on the column
   * so that they can be used by the render function
   * that is passed to compile()
   *
   */
  var setOption = chainFn(LINK_TYPE.OPTION, function (option, value) {
    workingColumn[option] = value;
  });

  /*
   * COMMANDS: SET COLUMN OPTIONS
   * TODO: allow user to specify more options ?
   * TODO: eliminate use of partial so lodash can be removed
   *
   */
  self.setRule = supportOption('rule', setOption, self);
  self.setModule = supportOption('module', setOption, self);

  /*
   * COMMAND: CREATE COLUMN
   * The User creates a column 
   * right after
   *
   */
  self.column = chainFn(LINK_TYPE.COLUMN, function (width) {

    if (isRoot) {
      /*
       * If the grid has just been 
       * initialized, then
       * we can simply use the root column
       *
       */
      setOption('width', width);
      isRoot = false;

    } else {
      /*
       * If the working nest is satisfied
       * it is time to move back to the parent nest
       *
       */
      if (workingNest.expects === 0) {
        workingNest = workingNest.parentNest;
      }

      /*
       * Accessing the parent 
       * column from the nest makes
       * it easy to not wory about simblings
       *
       */
      var parent = workingNest.parent;

      /*
       * Set up a new column object
       * and assign the specified width
       *
       */
      var newColumn = {
        width: width
      };

      /*
       * As soon as any parent 
       * is fractional
       * the entire tree must be fractional
       * or else it would be very tricy to determine
       * when the child could return to non-fractions
       *
       */
      if (parent.fractional) {
        newColumn.denominator = parent.width; 
        newColumn.fractional = true;
      }

      /*
       * Add the new column
       * To the parent column
       *
       */
      if (!parent.children) {
        parent.children = [newColumn];
      } else {
        parent.children.push(newColumn);
      }

      /*
       * Replace the reference to
       * the working column
       * so that column can be called 
       * again with no issue
       *
       */
      workingColumn = newColumn;

      /*
       * Decrement the nest's
       * expected width by the width of the 
       * column so that column()
       * can no when to return to the next level up
       *
       */
      workingNest.expects -= width;

      /*
       * If the working nest expects
       * negative units it means that 
       * a column has been added to the nest
       * that pushes it beyond it's capacity
       *
       */
      vallidator.checkOverflow(workingNest);
    }
  });

  /*
   * NEST COMMAND
   * the nest command allows
   * the user to insert columns inside 
   * the current column
   * 
   * if {divisions} is not specified
   * it assumes the nest inherits its `capacity`
   * from its parent's width
   *
   * if {divisions} is specified
   * the `capacity` will be reset so that
   * the columns divide in a different way
   * as a result all decendant columns
   * must be expressed as fractions of their perents
   *
   */
  self.nest = chainFn(LINK_TYPE.NEST, function (divisions) {
    
    /*
     * Mark the column
     * as fractional
     * so children understand 
     * they are fraction-bases columns
     *
     */
    if (divisions) {
      workingColumn.fractional = true;
    } else {
      divisions = workingColumn.width;
    }
    
    /*
     * create an 
     * object to store references
     * needed to traverse correctly 
     * and expectations about the `capacity`
     * of the nest
     *
     */
    var newNest = {
      expects: divisions,
      parent: workingColumn,

    }
    if (workingNest) {
      newNest.parentNest = workingNest;
    }
    workingNest = newNest;

  });

  /*
   * Rendering
   * after the grid is configured
   * it can be `rendered` using a function
   * that will recursively apply the renderFn
   * to the columns based on the column options
   *
   */
  self.render = function (renderFn) {
    console.log('');
    console.log('------------');
    console.log('Compile Grid');
    console.log(JSON.stringify(rootColumn,null,2));
  };
  
  /*
   * If a the constructor 
   * recieves an argument
   * it becomes an alias to the first
   * column command
   *
   */
  if (initialWidth) {
    self.column(initialWidth);
  }

  /*
   * Create the Chain
   *
   */
  return self;
};

/*
 * Creates a chainable option method
 * for exampte you can call setModule('right')
 * instead of set('rule','right')
 * so that you know options have consistant names
 * and only wory about validity in the values
 * 
 */
function supportOption (name, setOption, self) {
  return function (value) {
    return setOption(name, value);
  }
}

