
var makeGrid = require('../lib/');

function testRender (rootColumn) {
  console.log('-------------------------------------------')
  console.log(JSON.stringify(rootColumn, null, 2));
  console.log('-------------------------------------------')
}

var grid = makeGrid();

// grid
//   .column(9)
//   .nest()
//     .column(5)
//       .nest()
//         .column(2)
//           .nest()
//             .column(1)
//             .column(1)
//         .column(3)
//     .column(3)
//       .nest()
//         .column(2)
//         .column(1)
//     .column(4) // too many !


grid
  .column(12)
  .nest()
    .column(6)
      .nest()
        .column(6)
      .nest()
        .column(2)
        .column(2)
        .column(2)
    .column(6)



grid.render(testRender);

