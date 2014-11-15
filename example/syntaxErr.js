
var makeGrid = require('../lib/');

var grid = makeGrid();

grid
  .column(9)
  .nest()
    .column(5)
      .nest()
      .nest()
        .column(2)
          .nest()
            .column(1)
            .column(1)
        .column(3)
    .column(3)
      .nest()
        .column(2)
        .column(1)
    .column(1)