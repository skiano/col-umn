
var col = require('../');

var i = 1;

function testRender (err, data) {
  console.log('EXAMPLE', i++ + ':');
  console.log(JSON.stringify(data,null,2));
  console.log('');
}



var gridA = col(6);

gridA()(testRender);


var gridB = col(6)('Awesome', true);

gridB()(testRender);


var gridB = col(6)
                (
                col(6)
                )(
                col(4)
                )(
                col(2)
                );


gridB()(testRender);


