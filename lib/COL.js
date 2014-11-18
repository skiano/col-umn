
// if (typeof Object.create != 'function') {
//   Object.create = (function() {
//     var Object = function() {};
//     return function (prototype) {
//       if (arguments.length > 1) {
//         throw Error('Second argument not supported');
//       }
//       if (typeof prototype != 'object') {
//         throw TypeError('Argument must be an object');
//       }
//       Object.prototype = prototype;
//       var result = new Object();
//       Object.prototype = null;
//       return result;
//     };
//   })();
// }


module.exports = COL;

function isBuildFn () {};

function Column (outerWidth) {
  this.width = outerWidth;
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
  return function buildFn (input) {

    /*
     * inputs that terminate
     *
     */
    if(input === COL || input === undefined) { 
      return column;
    }

    /*
     * when this build function
     * is used by parent it looks like this
     *
     */
    if(arguments[2] === isBuildFn) {
      console.log('parent building a child')
      return column;
    }

    /*
     * inputs that return functions
     *
     */
    if (typeof input === 'function') {

      if(!column.options) {column.options = {}}
      input(column.options, column.columns, isBuildFn);

    } else if (typeof input === 'string') {

      column.name = input;

    } else if (input instanceof Column) {

      childrenWidth += input.width;

      if (column.columns) {
        column.columns.push(input);
      } else {
        column.columns = [input];
      }

      if(childrenWidth === outerWidth) {
        childrenWidth = 0;
      } else if (childrenWidth > outerWidth) {
        throw new Error('overflow error: ' + column.name + ' caused by ' + input.name)
      }

    } else {
      throw new Error('input not supported yet')
    }

    return buildFn;
  }
}