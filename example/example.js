
var makeGrid = require('../lib/');

var grid = makeGrid();

grid
  .column(9)
  // .nest()
  .setModule('a')
  .setRule('bottom')
  .setRule('right')
  .nest()
    .column(3)
      .nest(3)
        .column(2)
          .nest()
            .column(1)
              .setModule('b')
            .column(1)
              .setModule('c')
        .column(4)
          .setModule('d')
    .column(6)
      .setModule('e');

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
