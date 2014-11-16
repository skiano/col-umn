
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

  var column = new Column(outerWidth);
  var childrenWidth = 0;

  return function buildColumn (action) {

    if(action === COL) { return column; }

    if (typeof action === 'function') {
      
      action(column.options);

    } else if (typeof action === 'string') {

      column.name = action;

    } else if (action instanceof Column) {

      childrenWidth += action.width;
      column.columns.push(action);

      if(childrenWidth === outerWidth) {
        childrenWidth = 0;
      } else if (childrenWidth > outerWidth) {
        throw new Error('overflow error')
      }
    } else {
      throw new Error('action not supported yet')
    }

    return buildColumn;
  }
}