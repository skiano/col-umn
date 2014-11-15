
var makeGrid = require('../lib/')({
  supportOptions: ['a','b','c']
});

var grid = makeGrid();

grid
  .column(9)
  .setModule('a')
  .setRule('bottom')
  .setRule('right')
  .nest()
    .column(5)
      .nest()
        .column(2)
          .nest()
            .column(1)
              .setModule('b')
            .column(1)
              .setModule('c')
        .column(3)
          .setModule('d')
    .column(3)
      .nest()
        .column(2)
        .column(1)
    .column(1)
      .setModule('f')

grid.render(function (rootColumn) {
  console.log(rootColumn)
});
