
var makeGrid = require('../lib/');

function testRender (rootColumn) {
  console.log('-------------------------------------------')
  console.log(JSON.stringify(rootColumn, null, 2));
  console.log('-------------------------------------------')
}

var grid = makeGrid();

grid
  .nest(11)
    .column(3)
    .column(4)
    .column(4)
  .nest()


grid
  .column(6)
  .option('a')
  .nest(2)
  (
    grid()
    .column(1)
    .column(1)
    .column(1)
  )(
    grid()
    column(3)
  )
  .column(6)


grid
  .column(12)
    .nest(3)
    .column(4)
    .column(4)
    .column(4)
      .nest(2)
      .column(1)
      .column(1)

.column(3)
.column(3)
.column(3)
.column(9)
  .nest(3)
  .column(3)
  .column(3)
  .column(3)
.column(9)

grid
  .column(12)
    .nest(3)
    .column(4)
    .column(4)
      .nest(4)
      .column(1)
      .column(1)
      .column(1)
      .column(1)
    .column(4)
      .nest(2)
      .column(1)
      .column(1)


12col
  8col



grid.render(testRender);


