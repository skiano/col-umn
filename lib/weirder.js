
function column (width) {

  var totalWidth = 0;

  var c = {
    width: width,
    children: [],
    options: {}
  }

  return function buildColumn (innerColumn) {

    if (innerColumn === undefined) {
      
      return c;

    } else if (typeof innerColumn === 'function') {
      
      innerColumn(c.options);
      return buildColumn;

    } 

    totalWidth += innerColumn.width;

    if (totalWidth < width ){

      c.children.push(innerColumn);
      return buildColumn;

    } else if (totalWidth === width) {

      return c;

    } else {
      throw new Error('overflow error');
    }

  }

}

setFancy = function (options) {
  options.fancy = true;
}

var grid = column(12)
(
  column(6)(setFancy)()
)(
  column(6)(setFancy)()
)


console.log(grid);


// column(12)(
//   column(4)(
//     column(3)
//   )(
//     column(1)
//   )
// )(
//   column(4)
// )(
//   column(4)
// )(
//   column(4)
// )