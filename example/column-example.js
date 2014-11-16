
var COL = require('../lib/COL');


function setRule (options) {
  options.rule = 'top';
}

function render (grid) {
  console.log(JSON.stringify(grid,null,2))
}


COL(12)(
  
  COL(6)(

    COL(6)('MODULE_A')(setRule)(COL)

  )(
    
    COL(5)('MODULE_B')(COL)

  )(

    COL(1)('MODULE_B')(setRule)(COL)

  )(COL)

)(

  COL(6)('RIGHT')(COL)

)(

  COL(12)('FULL FOOTER')(COL)

)(true)(render);


var g = COL(6)(

  COL(6)('MODULE_A')(COL)

)(
  
  COL(5)('MODULE_B')(COL)

)(

  COL(1)('MODULE_B')(COL)

)(COL)


function useBorder (options) {
  options.border = true;
}

var build = 
COL(12)('Page')(
  COL(4)('Left Rail')(COL)
)(
  COL(8)('Right Rail')(COL)
)(COL);

console.log(JSON.stringify(build,null,2));


