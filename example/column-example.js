
var COL = require('../lib/COL');


function setRule (options) {
  options.rule = 'top';
}

function render (grid) {
  console.log(JSON.stringify(grid,null,2))
}


COL(12)('PAGE')(
  
  COL(6)('HEADER')(

    COL(6)('MODULE_A')(setRule)(COL)

  )(
    
    COL(5)('MODULE_B')(COL)

  )(

    COL(1)('MODULE_B')(COL)

  )(COL)

)(

  COL(6)('setBoring')(COL)

)(true)(render);