
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
      if (output instanceof Column) {
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

    childrenWidth += column.data.width;

    if(childrenWidth === outerWidth) {
      childrenWidth = 0;
    } else if (childrenWidth > outerWidth) {
      throw new Error('overflow error') // todo make this more useful
    }

  }

  self.public = {
    setOption: function (name, value) {

      if (typeof value === 'function') {

        /*
         * If you pass a function as the value
         * you get special treatment and can have 
         * two functions use the same key
         * becuase they can manage their own problems
         */
        self.data.options[name] = value(self.data.options[name]);

      } else if (self.data.options.hasOwnProperty(name)) {

        throw new Error ('two functions are setting the same option: ' + name)

      } else {

        self.data.options[name] = value;  

      }
    }
  }

}