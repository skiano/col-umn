
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
  var workingColumn = {};
  var workingNest;
  
  // HANDLE EXPECTATIONS

  var expect = {};

  expectsCol = function () {
    return expect.columns && expect.columns > 0;
  }

  expectSatisfied = function () {
    if (expect.columns < 0) {
      console.log('too wide for parent!')
    }
    return expect.columns === 0;
  }

  // HANDLES STATE CHANGES

  setState = function (newState) {
    vallidateStateChange(workingState, newState, expect);
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

    } else if (expectsCol()) {

      var newColumn = {};

      if (!workingColumn.children) {
        workingColumn.children = [newColumn];
      } else {
        workingColumn.children.push(newColumn);
      }

      setOption('width', width);
      expect.columns -= width;

      // in a nest
      // need to resolve what column 
      // we are working on 
      console.log('--------------------------');
      console.log('Creating Nested Column:', width);
      console.log('Expects: ' + expect.columns + ' more units')

      if (expectSatisfied()) {
        console.log('----------------');
        console.log('Return To Parent');
        workingColumn = workingNest.parent;
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
      workingColumn.usesFractions = true;
    } else {
      divisions = workingColumn.width;
    }

    expect.columns = divisions;
    
    workingNest = {
      parent: workingColumn,
      columns: []
    }

    console.log('-------------')
    console.log('Creating Nest')
    console.log('Expects', expect.columns + ' units')

    setState(STATE.NEST);
    return self;
  }

  /*
   * Compiling
   *
   */

  self.compile = function () {
    console.log('compile')
  };
  
  return self;
};

function vallidateStateChange (oldState, newState, expectations) {
  return true;
}

function isGrid (object) {
  return object instanceof Grid;
}










