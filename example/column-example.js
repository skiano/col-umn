
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

var rail = COL(4)('Well')(COL(4)('Module A')(COL))(COL(4)('Module B')(COL))(COL);
var well = COL(8)('Well')(COL(4)('Module A')(COL))(COL(4)('Module B')(COL))(COL);
var header = COL(12)('Header')(COL);
var page = COL(12)(header)(rail)(well)(COL);

// what it might look like minified
// var r=C(x)(a)(C(x)(a)(C))(C(x)(a)(C))(C),w=C(x)(a)(C(x)(a)(C))(C(x)(a)(C))(C),h=C(x)(a)(C),p=C(x)(h)(r)(w)(C);

console.log(JSON.stringify(page,null,2));


