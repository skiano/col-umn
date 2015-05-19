
var ColData = require('./ColData');
var ColWork = require('./ColWork');

module.exports = function COL (data, filter) {
  var column = new ColData(data, filter);

  // Return the main build function
  // to get the column started
  
  return function buildFn (arg0, arg1, arg2, arg3) {
    // allow columnWork to know this is async
    buildFn.isAsync = true;

    // interpret various argument patterns
    switch (true) {
      // TODO: if arg1 is instanceof ColData
      // throw error because it means the user passed in a rendered column

      case (typeof arg0 === 'string'):
        // CASE: simple set option
        // arg0: option name
        // arg1: option value
        column.public.setOption(arg0, arg1);
        break;

      case (typeof arg0 === 'function'):
        // CASE: user adding a task to the column
        column.work.addTask(arg0);
        break;

      case (typeof arg2 === 'function' && arg3 instanceof ColWork):
        // CASE: the order from a parent column to execute work
        // arg1: outer data
        // arg2: executeTask() from parent column
        column.work.execute(arg1, function (error) {
          arg2(error, column);
        });
        break;

      case (arg0 instanceof ColWork):
        // CASE: user mistakenly nested a rendered column
        throw new Error('Nesting a rendered column');

      case (typeof arg0 === 'object' && typeof arg1 === 'function'):
        // CASE: the top level render
        // arg0: outer data
        // arg1: render function
        column.work.execute(arg0, function (error) {
          arg1(error, column.data);
        });
        break;

      case (typeof arg0 === 'undefined' || (arguments.length === 1 && !arg0)):
        // CASE: no data
        return function (cb) {
          buildFn({}, cb);
        };

      default: 
        // throw error if no support for args
        throw new Error('cannot handle: ' + JSON.stringify(Array.prototype.slice.call(arguments)));
    }

    // Always return the buildFunction so user
    // can add as many tasks as they want
    return buildFn;
  };
};

