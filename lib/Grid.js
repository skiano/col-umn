
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
  var rootColumn;
  var workingColumn;
  var workingNest = {};
  var saved = [];
  

  function deferColumn () {
    console.log('-----------------------')
    console.log('saving for later')
    console.log(workingColumn);
    saved.push(workingColumn);
  }

  function returnToColumn () {
    console.log('-----------------------')
    console.log('back to column')
    console.log(saved[saved.length - 1]);
    workingColumn = saved.pop();
  }

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
      workingNest.column[option] = setter(workingNest.column[option], value);
    } else {
      workingNest.column[option] = value;
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
   * COMMAND: CREATE COLUMN
   * The User creates a column 
   * right after
   *
   */
  self.column = chainFn(LINK_TYPE.COLUMN, function column (width) {

    if (!workingColumn) {

      rootColumn = { width: width };
      workingColumn = rootColumn;

    } else {

      var newColumn = { width: width }

      if (workingNest.fractions) {
        newColumn.denominator = nest.fractions;
      }

      workingNest.store.push(newColumn);
      workingNest.width -= width;
      workingNest.expects -= 1;

      console.log(workingNest.expects, workingNest.width)

    }

  });

  self.nest = chainFn(LINK_TYPE.NEST, function nest (divisions) {

    if (workingNest.expects === 0) {
      returnToColumn();
    } else {
      deferColumn(workingColumn);
    }

    var store = [];

    if (workingColumn.children) {
      workingColumn.children.push(store);
    } else {
      workingColumn.children = [store];
    }

    workingNest.store = store;
    workingNest.expects = divisions;
    workingNest.totalDivisions = divisions;
    workingNest.fractions = false;
    workingNest.width = workingColumn.width;

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



