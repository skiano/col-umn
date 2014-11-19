
var col = require('../lib/col-umn');

function testQueue (column, cb) {
  console.log('testQueue', column);
  cb(null);
}

var test = col(6)(testQueue)(
  col(4)(testQueue)
)();

console.log(test)


// function setContent (options) {
//   options.content = true;
// }

// var build = col(6)
//     (
//     col(4)(setContent)
//     )(
//     col(2)(setContent)
//     )(
//     col(6)(setContent)
//         (
//         col(3)(setContent)
//         )( 
//         col(3)(setContent) 
//         )
//     );

// console.log(JSON.stringify(build(),null,2))




