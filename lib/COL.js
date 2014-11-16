
module.exports = COL;

function COL (outerWidth) {

  var childrenWidth = 0;

  var column = {
    width: outerWidth,
    children: [],
    options: {}
  }

  return function buildColumn (action) {

    if(action === COL) { return column; }


    if (typeof action === 'function') {
      
      // to set options pass a function
      action(column.options);
      

    } else if (typeof action === 'string') {

      column.name = action;


    } else if (action && action.width) {

      childrenWidth += action.width;
      column.children.push(action);

      if (childrenWidth > outerWidth) {
        throw new Error('overflow error')
      }

    }

    return buildColumn;
  }
}