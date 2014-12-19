
var ColData = require('./ColData');
var ColWork = require('./ColWork');

module.exports = function COL (data, filter) {

  var column = new ColData(data, filter);

  // Return the main build function
  // to get the column started
  
  return function buildFn () {

    // allow columnWork to know this is async
    
    buildFn.isAsync = true;

    // interpret various argument patterns

    switch (true) {

      // CASE: the order from a parent column to execute work

      case (typeof arguments[2] === 'function' && arguments[3] instanceof ColWork):

        var outerData = arguments[1]
          , dequeue = arguments[2]
          ;

        column.work.execute(outerData, function (error) {
          dequeue(error, column);
        });

        break;

      // CASE: user adding a task to the column

      case (typeof arguments[0] === 'function'):

        column.work.addTask(arguments[0]);

        break;

      // CASE: the top level render

      case (typeof arguments[0] === 'object' && typeof arguments[1] === 'function'):

        var render = arguments[1]
          , outerData = arguments[0]
          ;

        column.work.execute(outerData, function (error) {
          render(error, column.data);
        });

        break;

      // CASE: simple set option

      case (typeof arguments[0] === 'string'):

        var key = arguments[0]
          , value = arguments[1]
          ;

        column.public.setOption(key, value);

        break;

      // CASE: no data

      case (typeof arguments[0] === 'undefined' || (arguments.length === 1 && !arguments[0])):

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

