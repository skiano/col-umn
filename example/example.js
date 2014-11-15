

var ChainGrid = require('../lib/index');

function testRender (rootColumn) {
  console.log('-------------------------------------------')
  console.log(JSON.stringify(rootColumn, null, 2));
  console.log('-------------------------------------------')
}

/*
 * Example configuration for allowing list option
 *
 */

var makeGrid_A = ChainGrid({
  setModule: {
    name: 'modules',
    setter: function (modules, newModule) {
      if (modules) {
        modules.push(newModule)
      } else {
        modules = [newModule];
      }
      return modules;
    }
  }
});

var gridA = makeGrid_A();

gridA
  .column(9)
    .setModule('a')
    .setModule('b')
    .setModule('c')
    ;

gridA.render(testRender);

/*
 * Example configuration for allowing list option
 *
 */

var makeGrid_B = ChainGrid({
  setRule: 'rule'
});

var gridB = makeGrid_B();

gridB
  .column(9)
    .setRule('bottom')
    .nest()
      .column(9)
        .setRule('bottom')
    .nest()
      .column(5)
        .setRule('right')
      .column(4)

gridB.render(testRender);


