
var col = require('../lib/col-umn');

function svc (name) {

  return function (column, outerData, cb) {

    setTimeout(function(){

      if (outerData.hasOwnProperty(name)) {
        
        column.setOption(name, outerData[name]);
        cb(null);

      } else {

        cb(new Error('Data missing ' + name));

      }

    }, 1000);
  }
}

function multiSvc (name) {
  
  return function (column, outerData, cb) {

    setTimeout(function(){

      var amount = outerData[name];

      if (amount < 3) {
        cb('Not enough ' + name);
      }

      column.setOption('animals', function (value) {
        
        if (!value) {
          value = {};
        }

        value[name] = amount;

        return value;

      });

      cb(null)

    }, 1000);
  }
}

var render = col(6)
    (
    col(4)(svc('dataA1'))(svc('dataA2'))
    )(
    col(2)(svc('dataB'))
    )(
    col(6)(svc('dataC'))
        (
        col(3)(multiSvc('cats'))
        )( 
        col(3)(multiSvc('dogs'))(multiSvc('rabbits'))(multiSvc('horses'))
        )
    );

var schemaA = {
  dataA1: 'A1 is great',
  dataA2: 'A2 is great',
  dataB: 'B is ok',
  dataC: 'C is not so good',
  cats: 20,
  dogs: 10,
  rabbits: 5,
  horses: 15
}

var schemaB = {
  // dataA1: 'A1 is great',
  dataA2: 'A2 is great',
  dataB: 'B is ok',
  dataC: 'C is not so good',
  cats: 0,
  dogs: 1,
  rabbits: 10,
  horses: 30
}


render(schemaA, function (err, grid) {

  console.log('Schema A:');
  console.log(JSON.stringify(grid,null,2))

  console.log('')
  console.log('')

  render(schemaB, function (err, grid) {

    if (err) {
      console.log(err)
    }

    console.log('Schema B:');
    console.log(JSON.stringify(grid,null,2))

  });

});








