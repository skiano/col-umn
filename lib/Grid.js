
var _ = require('lodash');

var STATE = {
  INIT: 'INIT',
  COLUMN: 'COLUMN',
  NEST: 'NEST',
  OPTION: 'OPTION'
}

module.exports = function Grid () {

  var grid = {
    supportFractions: false
  }

  // PRIVATE INFORMATION

  var self = this;
  var link = 0;
  var workingState = STATE.INIT;
  var rootColumn = {};
  var workingColumn = rootColumn;
  var workingNest;

  /*
   * Helper to make sure 
   * all chained functions 
   * work consistantly
   *
   */
  function chainFn (fn) {
    return function () {
      link += 1;
      fn.apply(self, arguments);
      return self;
    }
  }

  /* 
   * WATCH LINK INDEX
   *
   */
  
  
  /* 
   * HANDLE EXPECTATIONS
   *
   */
  function expectsCol () {
    return workingNest && workingNest.expects > 0;
  }

  /* 
   * HANDLES STATE CHANGES
   *
   */
  setState = function (newState) {
    vallidateStateChange(workingState, newState, workingNest);
    workingState = newState;
  };

  /* 
   * HANDLE OPTIONS
   *
   */
  setOption = chainFn(function (option, value) {
    setState(STATE.OPTION);
    workingColumn[option] = value;
  });

  /*
   * COMMANDS: SET COLUMN OPTIONS
   * these defer to setOption
   * todo: allow user to specify more options ?
   *
   */
  self.setRule = _.partial(setOption, 'rule');
  self.setModule = _.partial(setOption, 'module');


  self.enableFractions = function () {
    grid.supportFractions = true;
    return self;
  }

  /*
   * COMMAND: CREATE COLUMN
   *
   */
  self.column = function (width) {

    if (workingState === STATE.INIT) {

      /*
       * If the grid has just been 
       * initialized, then
       * we can simply use the root column
       *
       */
      setOption('width', width);

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
      if (workingNest.expects < 0) {
        throw new Error('too much material')
      }

    }

    setState(STATE.COLUMN);
    return self;
  }

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

  self.nest = function (divisions) {
    
    if (divisions) {
      workingColumn.fractional = true;
    } else {
      divisions = workingColumn.width;
    }
    
    var newNest = {
      expects: divisions,
      parent: workingColumn,
      columns: []
    }
    if (workingNest) {
      newNest.parentNest = workingNest;
    }
    workingNest = newNest;

    setState(STATE.NEST);
    return self;
  }

  /*
   * Compiling
   *
   */

  self.compile = function () {
    
    console.log('');
    console.log('------------');
    console.log('Compile Grid');
    console.log(JSON.stringify(rootColumn,null,2));

  };
  
  return self;
};

function vallidateStateChange (oldState, newState, expectations) {
  return true;
}

function isGrid (object) {
  return object instanceof Grid;
}










