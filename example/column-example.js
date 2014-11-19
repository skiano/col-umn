
var col = require('../lib/col-umn');

function testQueue (column, cb) {

  console.log('immediate');
  
  setTimeout(function () {

    column.awesome = true;
    console.log('testQueue');
    cb(null);

  }, 1000);

}

var c = col(6)(testQueue)(testQueue)(
  col(4)(testQueue)
)(true);

c(function (column) {

  console.log(JSON.stringify(column,null,2));

});


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




