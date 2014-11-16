

function sequence (number) {



}


function Grid () {

  var self = this;

  self.list = [];

  self.column = function (column) {
    self.list.push(column)
    return self;
  }

  self.render = function () {
    console.log(self.list);
  }

  self.nest = function nesting (divisions) {
    if (divisions > 0) {
      return function (column) {
        
        if (column instanceof Grid) {
          console.log(column)
          self.list = self.list.concat(column.list)
        } else {
          self.list.push(column);
        }

        return nesting(divisions-1);
      }
    } else {
      return self;
    }
  }

  return self;

}


var grid = function () {
  return new Grid();
};

grid()
  .column('a')
  .nest(4)(
    grid().column('b')
  )('c')('d')('e')
  .render()

