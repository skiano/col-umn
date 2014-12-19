
var COL = require('../');

var i = 1;

function testRender (err, data) {
  console.log('EXAMPLE', i++ + ':');
  console.log(JSON.stringify(data,null,2));
  console.log('');
}

var g;

var gridA = COL(6);

gridA()(testRender);


var gridB = COL(6)('Awesome', true);

gridB()(testRender);


var g;

g = COL(6)
        (
        COL(6)
            (
            COL(3)
            )(
            COL(3)
            )
        )(
        COL(4)
        )(
        COL(2)
        )
        (null);


g(testRender);


