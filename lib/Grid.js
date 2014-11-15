
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
  var link = 0; // track the link so that it can give more links
  var workingState = STATE.INIT;
  var rootColumn = {};
  var workingColumn = rootColumn;
  var workingNest;
  
  // HANDLE EXPECTATIONS

  expectsCol = function () {
    return workingNest && workingNest.expects > 0;
  }

  // HANDLES STATE CHANGES

  setState = function (newState) {
    vallidateStateChange(workingState, newState, workingNest);
    // console.log('Set State from', workingState, 'to', newState);
    workingState = newState;
  };

  // HANDLE OPTIONS

  setOption = function(option, value) {
    setState(STATE.OPTION);
    workingColumn[option] = value;
    // console.log('Set Option:', option, ':', value);
    return self;
  };
  // expose native options functions
  self.setRule = _.partial(setOption, 'rule');
  self.setModule = _.partial(setOption, 'module');

  // COLUMN COMMAND

  self.column = function (width) {

    if (workingState === STATE.INIT) {

      console.log('----------------------');
      console.log('Creating Top Column', width);
      setOption('width', width);

    } else if (true) {

      if (workingNest.expects === 0) {
        // workingNest = workingNest.parent.nest;
        console.log(' ')
        console.log('---------------------')
        console.log('Return To Parent Nest')
        workingNest = workingNest.parentNest;
      }

      var parent = workingNest.parent;

      var newColumn = {
        width: width
      };

      if (parent.fractional) {
        newColumn.fractional = true;
      }

      if (!parent.children) {
        parent.children = [newColumn];
      } else {
        parent.children.push(newColumn);
      }

      // Set the new column as 
      // the next working column
      workingColumn = newColumn;

      // adjust expectation
      workingNest.expects -= width;

      // in a nest
      // need to resolve what column 
      // we are working on 
      console.log('--------------------------');
      console.log('Creating Nested Column:', width);
      console.log('Expects ' + workingNest.expects + ' more units')

      if (workingNest.expects < 0) {
        throw new Error('too much material')
      } else {

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










