
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

      // CASE: the order from a parent column to execute work

      case (typeof arg2 === 'function' && arg3 instanceof ColWork):

        var outerData = arg1
          , dequeue = arg2
          ;

        column.work.execute(outerData, function (error) {
          dequeue(error, column);
        });

        break;

      // CASE: user adding a task to the column

      case (typeof arg0 === 'function'):

        column.work.addTask(arg0);

        break;

      // CASE: the top level render

      case (typeof arg0 === 'object' && typeof arg1 === 'function'):

        var render = arg1
          , outerData = arg0
          ;

        column.work.execute(outerData, function (error) {
          render(error, column.data);
        });

        break;

      // CASE: simple set option

      case (typeof arg0 === 'string'):

        var key = arg0
          , value = arg1
          ;

        column.public.setOption(key, value);

        break;

      // CASE: no data

      case (typeof arg0 === 'undefined' || (arguments.length === 1 && !arg0)):

        return function (cb) {
          buildFn({}, cb);
        }
        
        break;

      // throw error if no support for args

      default: 

        throw new Error('cannot handle: ' + JSON.stringify(Array.prototype.slice.call(arguments)))
        
    }

    // Always return the build so user
    // can add as many tasks as they want

    return buildFn;
    
  }
}

