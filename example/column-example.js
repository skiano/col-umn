
var col = require('../lib/col-umn');
var asyncSvc = require('../lib/asyncSvc');

function svc (name) {
  return asyncSvc(function nameSvc (column, outerData, cb) {

    setTimeout(function (){

      if (outerData.hasOwnProperty(name)) {
        
        column.setOption(name, outerData[name]);
        cb(null);

      } else {

        cb(new Error('Data missing ' + name));

      }

    }, 1000);
  });
}

function hasSync (column, outerData) {
  column.setOption('hasSyncData', true);
}

function multiSvc (name) {
  return asyncSvc(function animalSvc (column, outerData, cb) {

    setTimeout(function(){

      var amount = outerData[name];

      if (amount < 3) {
        cb(new Error('Not enough ' + name));
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
  });
}

function myFilter (data) {
  return data.subData;
}

var render = col(6)
    (
      col(4)(svc('dataA1'))(svc('dataA2'))
    )(
      col(2)(hasSync)
    )(
      col(6)(svc('dataC'))
        (
          col(3, myFilter)(multiSvc('cats'))
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
  horses: 15,
  subData: {
    cats: 'sick!'
  }
}

var schemaB = {
  // dataA1: 'A1 is great',
  dataA2: 'A2 is great',
  dataB: 'B is ok',
  dataC: 'C is not so good',
  cats: 0,
  dogs: 1,
  rabbits: 10,
  horses: 30,
  subData: {
    cats: 'sick!'
  }
}


render(schemaA, function (err, grid) {

  console.log('Schema A:');
  console.log(JSON.stringify(grid,null,2))
  console.log('\n\n\n');

  render(schemaB, function (errs, grid) {
    console.log('Schema B:');
    if (err) { console.log('Errors:', errs) }
    console.log(JSON.stringify(grid,null,2))
  });

});








