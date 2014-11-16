

function Grid () {

  var self = this;
  
  self.rootColumn = {
    children: []
  };

  var workingColumn;

  self.column = function (width) {
    var column = { 
      width: width,
      children: []
    }
    self.rootColumn.children.push(column)
    workingColumn = column;
    return self;
  }

  self.render = function () {
    console.log(JSON.stringify(self.rootColumn,null,2));
  }

  self.nest = function nesting (divisions) {
    if (divisions > 0) {
      return function (column) {

        if (column instanceof Grid) {
          workingColumn.children.push(column.rootColumn);
        } else {
          workingColumn.children.push(column);
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
  .column(6)
  .nest(4)(
    grid()
      .column(1)
      .column(2)
  )(
    grid()
      .column(1)
      .column(2)
  )(
    {width: 2}
  )(
    {width: 2}
  )
  .render()










