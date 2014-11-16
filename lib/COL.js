
module.exports = COL;

function COL (width) {

  var totalWidth = 0;

  var c = {
    width: width,
    children: [],
    options: {}
  }

  return function buildColumn (action) {

    if(action === COL) {
      
      return c;

    } else if (typeof action === 'function') {
      
      // to set options pass a function
      action(c.options);
      return buildColumn;

    } else if (typeof action === 'string') {

      c.name = action;
      return buildColumn;

    } else if (action && action.width) {

      totalWidth += action.width;
      c.children.push(action);

      if (totalWidth > width) {
        throw new Error('overflow error')
      }

      return buildColumn;
      // return totalWidth === width ? c : buildColumn;

    } 

  }

}