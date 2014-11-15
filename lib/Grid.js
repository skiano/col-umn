
var _ = require('lodash');

var STATE = {
  INIT: 'INIT',
  COLUMN: 'COLUMN',
  NEST: 'NEST',
  OPTION: 'OPTION'
}

module.exports = function Grid (supportedOptions) {

  // PRIVATE INFORMATION

  var self = this;
  var link = 0;
  var workingState = STATE.INIT;
  var rootColumn = {};
  var workingColumn = rootColumn;
  var workingNest;

  /* 
   * WATCH LINK INDEX
   *
   */
  addLink = function () {
    link += 1;
  }
  
  /* 
   * HANDLE EXPECTATIONS
   *
   */
  expectsCol = function () {
    return workingNest && workingNest.expects > 0;
  }

  /* 
   * HANDLES STATE CHANGES
   *
   */
  setState = function (newState) {
    addLink();
    vallidateStateChange(workingState, newState, workingNest);
    workingState = newState;
  };

  /* 
   * HANDLE OPTIONS
   *
   */
  setOption = function(option, value) {
    setState(STATE.OPTION);
    workingColumn[option] = value;
    return self;
  };

  /*
   * COMMANDS: SET COLUMN OPTIONS
   * these defer to setOption
   * todo: allow user to specify more options ?
   *
   */
  self.setRule = _.partial(setOption, 'rule');
  self.setModule = _.partial(setOption, 'module');

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

    } else {

      console.log('there is a problem!')
    }

    setState(STATE.COLUMN);
    return self;
  }

  // NEST COMMAND

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

    console.log(' ')
    console.log('-------------')
    console.log('Creating Nest')
    console.log('Expects', workingNest.expects + ' units')

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










