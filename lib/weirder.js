
function column (width) {

  var totalWidth = 0;
  var c = {
    width: width,
    children: [],
    options: {}
  }

  return function buildColumn (innerColumn) {

    if (innerColumn === undefined) {
      
      // to end early just chain ()
      return c; 

    } else if (typeof innerColumn === 'function') {
      
      // to set options pass a function
      innerColumn(c.options);
      return buildColumn;

    } else if (innerColumn && innerColumn.width) {

      totalWidth += innerColumn.width;
      c.children.push(innerColumn);

      if (totalWidth > width) {
        throw new Error('overflow error')
      }

      return totalWidth === width ? c : buildColumn;

    } 

  }

}

setFancy = function (options) {
  options.fancy = true;
}

setBoring = function (options) {
  options.fancy = true;
}

var grid = column(12)(setFancy)
(
  column(6)(setFancy)()
)(
  column(6)(setBoring)()
)

console.log(JSON.stringify(grid, null, 2));


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