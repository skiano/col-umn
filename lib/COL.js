
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

    if(input === COL || input === undefined || arguments[2] === isBuildFn) { 
      
      return column;
    
    } else if (typeof input === 'string') {
      
      column.name = input;

    }


    /*
     * inputs that return functions
     *
     */
    if (typeof input === 'function') {

      if(!column.options) {column.options = {}}
      var output = input(column.options, column.columns, isBuildFn);

      if(output instanceof Column) {

        childrenWidth += output.width;

        if (column.columns) {
          column.columns.push(output);
        } else {
          column.columns = [output];
        }

        if(childrenWidth === outerWidth) {
          childrenWidth = 0;
        } else if (childrenWidth > outerWidth) {
          throw new Error('overflow error: ' + column.name + ' caused by ' + output.name)
        }
      }

    } else {
      throw new Error('input not supported yet')
    }

    return buildFn;
  }
}