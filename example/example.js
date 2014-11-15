
var makeGrid = require('../lib/');

var grid = makeGrid();

grid
  .column(9)
  .setModule('a')
  .setRule('bottom')
  .setRule('right')
  .nest()
    .column(3)
      .nest()
        .column(2)
          .nest()
            .column(1)
              .setModule('b')
            .column(1)
              .setModule('c')
        .column(3)
          .setModule('d')
    .column(4)
      .nest()
        .column(3)
        .column(1)
    .column(6)
      .setModule('f')

// grid.render();

// var grid = makeGrid(9);

// grid
//   .setModule('a')
//   .setRule('bottom')
//   .setRule('right')
//   .nest()
//     .column(3)
//       .nest(3)
//         .column(2)
//           .nest()
//             .column(1)
//               .setModule('b')
//             .column(1)
//               .setModule('c')
//         .column(1)
//           .setModule('d')
//     .column(6)
//       .setModule('e');

// grid.render();
