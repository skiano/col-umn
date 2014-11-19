
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

    if(arguments[1] === COL) {
      
      return column;

    } else if (typeof input === 'function') {

      // add to the queue
      column.queue.push(input);

    } else if (input === undefined) {

      executeQueue(column.queue, column);
      return column;

    }

    return buildFn;
  }
}

/*
 * function to execute the column queue
 *
 */
function executeQueue (queue, column) {

  var i = queue.length
    , s = i
    , supp_array = []
    ;

  while (s--) supp_array.push(queue.pop());
  while (i--) {

    var output = supp_array.pop()(column, COL);

    if (output instanceof Column) {
      column.addColumn(output);
      executeQueue(output.queue, output);
    }

  };
}

/*
 * a column object
 *
 */
function Column (outerWidth) {

  var self = this;
  var childrenWidth = 0;
  
  self.width = outerWidth;
  self.queue = [];

  /*
   * Add a child column to this column
   */
  self.addColumn = function (column) {
    
    if (self.columns) {
      self.columns.push(column);
    } else {
      self.columns = [column];
    }

    childrenWidth += column.width;

    if(childrenWidth === outerWidth) {
      childrenWidth = 0;
    } else if (childrenWidth > outerWidth) {
      throw new Error('overflow error') // todo make this more useful
    }
  }

}