
var col = require('../lib/col-umn');

function svc (name) {

  return function (column, cb) {

    setTimeout(function(){

      column[name] = true;

      cb(null)

    }, 1000);
  }
}

var build = col(6)
    (
    col(4)(svc('SVC-A'))(svc('SVC-A-2'))
    )(
    col(2)(svc('SVC-B'))
    )(
    col(6)(svc('SVC-C'))
        (
        col(3)(svc('SVC-D'))
        )( 
        col(3)(svc('SVC-D')) 
        )
    );

build(true, function (err, grid) {
  console.log(JSON.stringify(grid,null,2))
})




