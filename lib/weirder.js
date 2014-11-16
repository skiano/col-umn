
function column (width) {

  var totalWidth = 0;
  var c = {
    width: width,
    children: [],
    options: {}
  }

  return function buildColumn (action) {

    if (action === undefined) {
      
      // to end early just chain ()
      return c; 

    } else if (typeof action === 'function') {
      
      // to set options pass a function
      action(c.options);
      return buildColumn;

    } else if (typeof action === 'string') {

      c.name = action;
      return buildColumn;

    } else if (action && action.width) {

      totalWidth += action.width;
      c.children.push(action);

      if (totalWidth > width) {
        throw new Error('overflow error')
      }

      return totalWidth === width ? c : buildColumn;

    } 

  }

}



function setFancy (options) {
  options.fancy = true;
}

function setBoring (options) {
  options.fancy = true;
}

function module (module) {
  return function (options) {
    if (options.modules) {
      options.modules.push(module);
    } else {
      options.modules = [module];
    }
  }
}


var grid = column(12)('PAGE')(

  column(6)('HEADER')(
    
    column(4)('MODULE_A')(setFancy)()

  )(

    column(2)('MODULE_B')(setFancy)()

  )

)(
  column(6)(setBoring)()
)


console.log(JSON.stringify(grid, null, 2));
