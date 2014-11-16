
module.exports = COL;

function Column (outerWidth) {
  this.width = outerWidth;
  this.columns = [];
  this.options = {};
}

function COL (outerWidth) {

  if (typeof outerWidth !== 'number') {
    throw new Error('COL must begin with a number')
  }
  
  /*
   * Store this column
   */
  var column = new Column(outerWidth);
  var childrenWidth = 0;

  /*
   * Start the ball rolling
   *
   */
  return function buildColumn (input) {

    /*
     * inputs that terminate
     *
     */
    if(input === COL) { 
      return column;
    } else if (input === true) {
      return function (fn) {
        fn(column);
      }
    }

    /*
     * inputs that return functions
     *
     */
    if (typeof input === 'function') {
      
      input(column.options);

    } else if (typeof input === 'string') {

      column.name = input;

    } else if (input instanceof Column) {

      childrenWidth += input.width;
      column.columns.push(input);

      if(childrenWidth === outerWidth) {
        childrenWidth = 0;
      } else if (childrenWidth > outerWidth) {
        throw new Error('overflow error')
      }
    } else {
      throw new Error('input not supported yet')
    }

    return buildColumn;
  }
}