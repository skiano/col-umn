
var ColData = require('./ColData');
var ColWork = require('./ColWork');

module.exports = function COL (outerWidth) {

  var column = new ColData(outerWidth);

  /*
   * Main build function
   */
  return function buildFn () {

    switch (true) {

      /*
       * Order to execute the queue
       */
      case (typeof arguments[2] === 'function' && arguments[3] instanceof ColWork):

        var outerData = arguments[1]
          , dequeue = arguments[2]
          ;

        column.work.execute(outerData, function () {
          dequeue(null, column);
        });

        break;

      /*
       * add to the queue of
       * work for the column
       */
      case (typeof arguments[0] === 'function'):

        column.work.addTask(arguments[0]);

        break;

      /*
       * This renders the column
       * with top level data
       */
      case (typeof arguments[0] === 'object' && typeof arguments[1] === 'function'):

        var render = arguments[1]
          , outerData = arguments[0]
          ;

        column.work.execute(outerData, function (err) {
          render(err, column.data);
        });

        break;
        
    }

    /*
     * Return the build function for endless chain
     */
    return buildFn;
    
  }
}

