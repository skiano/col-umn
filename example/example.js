
var makeGrid = require('../lib/');

var grid = makeGrid();

grid.column(9)
  .setModule('a')
  .setRule('bottom')
  .nest()
    .column(2)
    .column(7)

// grid.column(9)
//   .setModule('a')
//   .setRule(['right','bottom'])
//   .nest(2)
//     .column(6)
//       .nest(2)
//         .column()
//           .setModule('smallA')
//         .column()
//           .setModule('smallB')
//     .column(3)
//       .setModule('c')
//       .setRule('left')
//   .nest(3)
//     .column()
//       .setModule('d')
//       .setRule('right')
//     .column()
//       .setModule('e')
//       .setRule('right')
//     .column()
//       .setModule('f')

// grid.compile();
