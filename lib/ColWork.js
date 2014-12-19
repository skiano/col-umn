
var asyncSvc = require('./asyncSvc');

function functionName(fun) {

  // taken from http://stackoverflow.com/a/15714445

  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

module.exports = function ColWork (column, ColData) {

  var self = this
    , locked = false
    , tasks = []
    , idx = 0
    , isAsync
    ;

  this.addTask = function (fn) {
    if (typeof fn !== 'function') {
      throw new Error ('Column tasks must be functions: ' + fn);
    } else {

      tasks.push(fn);
      
    }
  };

  this.execute = function executeWork (outerData, callback) {

    if (locked) {
      throw new Error ('You cannot render a column while it is being rendered');
    }

    column.clear();
    locked = true;

    var promises = tasks.length;
    var errors = [];

    for (idx = 0; idx < tasks.length; idx += 1) {

      var returnValue = tasks[idx](column.public, outerData, function dequeue (error, output) {

        if (!isAsync) {
          throw new Error('You must wrap async column functions in asyncSvc');
        }

        /*
         * bubble up any error
         */
        if (error) {
          errors = errors.concat(error instanceof Error ? [error] : error);
          column.setError(error);
        }

        /*
         * this is the executed queue 
         * of the child column
         */
        if (output instanceof ColData) {
          column.addChildColumn(output);
        }

        /*
         * track how many queue items 
         * have completed
         */
        promises -= 1;

        if (promises === 0) {
          locked = false;
          return callback(errors.length > 0 ? errors : null); 
        }
      
      }, self);

      /*
       * detect if this uses async service
       * checking the function name feels weird
       * but it is pretty tricky to identify the build function
       * out of its scope
       */
      isAsync = typeof returnValue === 'function' && (returnValue === asyncSvc || returnValue.isBuildFunction);

      if (!isAsync) {
        locked = false;
        callback(null);
      }

    }

  }

}
