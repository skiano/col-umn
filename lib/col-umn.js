
module.exports = COL;

function COL (outerWidth) {

  /*
   * Store this column
   */
  var column = new Column(outerWidth);

  /*
   * Start the ball rolling
   *
   */
  return function buildFn (input) {

    if(arguments[2] === COL) {

      /*
       * this is the parent column 
       * calling for the queue of this column
       */
      var dequeue = arguments[1];
      executeQueue(column.queue, column, function () {
        dequeue(null, column);
      });

    } else if (typeof input === 'function') {

      /*
       * add to the queue of
       * work for the column
       */
      column.queue.push(input);

    } else if (input === true) {

      /*
       * return an async function to build the column
       *
       */
      return function (cb) {
        executeQueue(column.queue, column, function () {
          cb(column.data);
        });
      };

    }

    return buildFn;
  }
}

/*
 * function to execute the column queue
 *
 */
function executeQueue (queue, column, cb) {

  if (queue.length === 0) {cb(null)}

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
      column.data.options, function dequeue (err, output) {

      if (output instanceof Column) {
        console.log('column')
        column.addColumn(output);
      }

      promises -= 1;

      if (promises === 0) { 
        console.log('finished work')
        return cb(null); 
      }
    
    }, COL); // COL passed so the child can know

  };
}

/*
 * a column object
 *
 */
function Column (outerWidth) {

  var self = this;
  var childrenWidth = 0;
  
  self.data = {
    width: outerWidth,
    options: {}
  };

  self.queue = [];

  /*
   * Add a child column to this column
   */
  self.addColumn = function (column) {
    
    if (self.data.columns) {
      self.data.columns.push(column.data);
    } else {
      self.data.columns = [column.data];
    }

    childrenWidth += column.width;

    if(childrenWidth === outerWidth) {
      childrenWidth = 0;
    } else if (childrenWidth > outerWidth) {
      throw new Error('overflow error') // todo make this more useful
    }
  }
}