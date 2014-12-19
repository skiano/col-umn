
var col = require('../lib/col-umn');

function svc (name) {

  return function (column, cb) {

    setTimeout(function(){

      column.setOption(name, 'true');
      cb(null)

    }, 1000);
  }
}

function multiSvc (name) {
  return function (column, cb) {

    setTimeout(function(){

      column.setOption(name, function (value) {
        if (value) {
          value.push(value.length);
        } else {
          value = [0];
        }
        return value;
      });

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
        col(3)(multiSvc('SVC-D'))(multiSvc('SVC-D'))(multiSvc('SVC-D'))
        )
    );

var schema = {
  allData: true
}

build(schema, function render (err, grid) {
  
  console.log(JSON.stringify(grid,null,2))

})




