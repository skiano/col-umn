
module.exports = function ColWork (column, ColData) {

  var self = this
    , locked = false
    , tasks = []
    , idx = 0
    ;

  this.addTask = function (fn) {
    if (typeof fn !== 'function') {
      throw new Error ('Column tasks must be functions: ' + fn);
    } else {
      tasks.push(fn);  
    }
  };

  this.execute = function (outerData, callback) {

    if (locked) {
      throw new Error ('You cannot render a column while it is being rendered');
    }

    locked = true;
    column.clear();

    var promises = tasks.length;

    for (idx = 0; idx < tasks.length; idx += 1) {

      var task = tasks[idx];

      task(column.public, outerData, function dequeue (err, output) {

        /*
         * this is the executed queue 
         * of the child column
         */
        if (output instanceof ColData) {
          column.addChildColumn(output);
        }

        /*
         * track how many queue items 
         * have completed
         */
        promises -= 1;
        if (promises === 0) {
          locked = false;
          return callback(null); 
        }
      
      }, self);

    }

  }

}
