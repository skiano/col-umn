
var ColData = require('./ColData');

module.exports = COL;

function COL (outerWidth) {

  /*
   * Store this column level
   */
  var column = new ColData(outerWidth);

  /*
   * Main build function
   */
  return function buildFn () {

    switch (true) {

      /*
       * Order to execute the queue
       */
      case (typeof arguments[2] === 'function' && arguments[3] === COL):

        var outerData = arguments[1]
          , dequeue = arguments[2]
          ;

        executeQueue(column, outerData, function () {
          dequeue(null, column);
        });

        break;

      /*
       * add to the queue of
       * work for the column
       */
      case (typeof arguments[0] === 'function'):

        column.queue.push(arguments[0]);

        break;

      /*
       * This renders the column
       * with top level data
       */
      case (typeof arguments[0] === 'object' && typeof arguments[1] === 'function'):

        var render = arguments[1]
          , outerData = arguments[0]
          ;

        executeQueue(column, outerData, function (err) {
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

/*
 * function to execute the column queue
 *
 */
function executeQueue (column, outerData, cb) {

  queue = column.queue;

  if (queue.length === 0) { cb(null); }

  var i = queue.length
    , s = i
    , supp_array = []
    , promises = 0
    ;

  while (s--) {
    supp_array.push(queue.pop())
    promises += 1;
  };

  /*
   * For every function in the queue
   * execute it and pass a `dequeue` callback
   * that is called by the outside function
   *
   */
  while (i--) {

    var queueFunction = supp_array.pop();

    queueFunction(
      column.public, outerData, function dequeue (err, output) {

      /*
       * this is the executed queue 
       * of the child column
       */
      if (output instanceof ColData) {
        column.addColumn(output);
      }

      /*
       * track how many queue items 
       * have completed
       */
      promises -= 1;
      if (promises === 0) { 
        return cb(null); 
      }
    
    }, COL); // COL passed so the child can know

  };
}
