
var col = require('../');

var grid = col(6)('Awesome', true)();

var data = grid(function testRender (err, data) {
  console.log(data);
});


