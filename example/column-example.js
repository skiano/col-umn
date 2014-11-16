
var COL = require('../lib/COL');

var grid = COL(12)('PAGE')(

  COL(6)('HEADER')(
    
    COL(4)('MODULE_A')(COL)

  )(

    COL(2)('MODULE_B')(COL)

  )(COL)

)(

  COL(6)('setBoring')(COL)

)(COL);

console.log( JSON.stringify(grid,null,2) );