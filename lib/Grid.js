
/* 
 * Grid Constructor
 *
 */
var Grid;

/*
 * CONSTANTS
 *
 */
var LINK_TYPE = require ('./LinkTypes');

/*
 * MAIN GRID CONSTRUCTOR
 *
 */
module.exports = Grid = function (vallidator) {

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
    return function chainLink () {
      /*
       * Allow vallidator the chance to
       * detect malformed chain
       */
      vallidator.checkLink(linkType, workingNest, arguments);
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
  var setOption = chainFn(LINK_TYPE.OPTION, function setOption (option, value, setter) {
    if (setter) {
      workingColumn[option] = setter(workingColumn[option], value);
    } else {
      workingColumn[option] = value;  
    }
  });

  supportOption = function (methodName, optionName, setter) {
    vallidator.checkOption(optionName);
    self[methodName] = function (value) {
      return setOption(optionName, value, setter);
    }
  }

  /*
   * Enable support for any user option
   * this allows the user to create options
   * and define how they work
   *
   */
  var supported = self.__supportedOptions__;
  for (method in supported) {
    /*
     * As long as the key is not already
     * a Grid method, it will be added
     *
     */
    if (supported.hasOwnProperty(method) && 
         !self.hasOwnProperty(method)) {

      if(typeof supported[method] === 'string') {
        /*
         * If option is a string
         * the added method will just set the 
         */
        supportOption(method, supported[method]);

      } else if (supported[method] && 
                  supported[method].name && 
                  typeof supported[method].setter === 'function'){
        /*
         * If a setter is specified
         * it will be given access to the value
         * of the option before it changes
         * 
         * useful for options that store multiples
         */
        supportOption(method, 
          supported[method].name, 
          supported[method].setter);

      } else {
        throw new Error ('Invalid options for new method: ' + method)
      }

    } else {
      throw new Error (method + ' is a reserved method');
    }
  }

  /*
   * COMMANDS: SET COLUMN OPTIONS
   * TODO: allow user to specify more options ?
   * TODO: eliminate use of partial so lodash can be removed
   *
   */
   // self.supportOption('rule', 'setRule');
   // self.supportOption('module', 'setModule');

  /*
   * COMMAND: CREATE COLUMN
   * The User creates a column 
   * right after
   *
   */
  self.column = chainFn(LINK_TYPE.COLUMN, function column (width) {

    console.log('COLUMN', width)

    if (isRoot) {
      /*
       * If the grid has just been 
       * initialized, then
       * we can simply use the root column
       *
       */
      rootColumn.width = width;
      isRoot = false;

      workingNest = {
        expects: width,
        column: rootColumn
      }

    } else {
      /*
       * Accessing the parent 
       * column from the nest makes
       * it easy to not wory about simblings
       *
       */
      var parent = workingNest.column;

      /*
       * if the width is left out
       * it implies full
       */
      width = width || parent.width;

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
      if (workingNest.fractional) {
        newColumn.denominator = parent.width;
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
       * make sure the nests `capacitiy has not been
       * exceeeded yet
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
  self.nest = chainFn(LINK_TYPE.NEST, function nest (divisions) {

    console.log('NEST')

    /*
     * Once a grid is fractional
     * all decendant columns become fractional
     *
     */
    var fractional = divisions ? true : false;
    if (!fractional) {
      divisions = workingColumn.width;
    }

    if (workingNest.expects === 0) {
      
      /*
       * If working nest has just completed
       * traverse back to parent nest
       *
       */
      workingNest = workingNest.parentNest;
      /*
       * reset expected width
       * to allow another row
       *
       */
      workingNest.expects = workingNest.column.width;
      /*
       * reset working column
       */
      workingColumn = workingNest.column;

    } else {
      
      /*
       * If in a column 
       * replace the working nest
       *
       */ 
      var newNest = {
        fractional: workingNest.fractional ? true : fractional,
        expects: divisions,
        column: workingColumn
      };
      newNest.parentNest = workingNest;
      workingNest = newNest;
      
    }

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
    return renderFn(rootColumn);
  };

  /*
   * Create the Chain
   *
   */
  return self;
};

/*
 * Safety
 *
 */
Grid.prototype.__supportedOptions__ = {};



