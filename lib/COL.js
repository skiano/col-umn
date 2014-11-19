
module.exports = COL;

function Column (outerWidth) {

  var self = this;
  var childrenWidth = 0;
  
  self.width = outerWidth;

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

function COL (outerWidth) {

  if (typeof outerWidth !== 'number') {
    throw new Error('COL must begin with a number')
  }

  /*
   * Store this column
   */
  var column = new Column(outerWidth);

  /*
   * Start the ball rolling
   *
   */
  return function buildFn (input) {

    var A = arguments[0]
      , B = arguments[1]
      , C = arguments[2]
      ;

    if(C === COL || A === undefined || A === COL) { 
      
      return column;

    } else if (typeof A === 'string') {
      
      column.name = input;

    }

    /*
     * inputs that return functions
     *
     */
    if (typeof A === 'function') {

      if(!column.options) {column.options = {}}

      var output = A(column.options, column.columns, COL);

      if(output instanceof Column) {
        column.addColumn(output);
      }

    } else {

      throw new Error('input not supported yet');

    }

    return buildFn;
  }
}