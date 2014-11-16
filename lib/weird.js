

function sequence (number) {



}


function Grid () {

  var self = this;
  var list = [];

  self.column = function () {
    var column = {};
    return self;
  }

  self.render = function () {
    console.log(list);
  }

  self.nest = function nesting (divisions) {
    if (divisions > 0) {
      return function (column) {
        list.push(column);
        return nesting(divisions-1);
      }
    } else {
      return self;
    }
  }

}


var grid = function () {
  return new Grid();
};

grid()
  .column()
  .nest(4)('a')('b')('c')('d')
  .render()

