
module.exports = COL;

function Column (outerWidth) {
  this.width = outerWidth;
  this.columns = [];
  this.options = {};
}

function COL (outerWidth) {

  var childrenWidth = 0;
  
  var column = new Column(outerWidth);

  return function buildColumn (action) {

    if(action === COL) { return column; }


    if (typeof action === 'function') {
      
      // to set options pass a function
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
    }

    return buildColumn;
  }
}