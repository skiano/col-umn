
var COL = require('../lib/COL');

var grid = COL(12)('PAGE')(
  
  COL(6)('HEADER')(

    COL(3)('MODULE_A')(COL)

  )(
    
    COL(3)('MODULE_B')(COL)

  )(COL)

)(

  COL(COL)('setBoring')(COL)

)(COL);

console.log(JSON.stringify(grid,null,2));