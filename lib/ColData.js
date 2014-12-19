
var ColWork = require('./ColWork');

module.exports = function ColData (outerWidth) {

  var self = this
    , childrenWidth = 0
    ;

  self.data = {
    width: outerWidth,
    options: {}
  };

  self.work = new ColWork(this, ColData);

  self.clear = function () {

    self.data = {
      width: outerWidth,
      options: {}
    }

  }

  self.setError = function (error) {

    if (typeof error === 'object' && error.hasOwnProperty('length')) {
      // this is the child errors bubbling up
    } else {
      self.data.error = error instanceof Error ? error.message : error;
    }

  }

  self.addChildColumn = function (column) {
    
    if (self.data.columns) {
      self.data.columns.push(column.data);
    } else {
      self.data.columns = [column.data];
    }

    childrenWidth += column.data.width;

    if(childrenWidth === outerWidth) {
      childrenWidth = 0;
    } else if (childrenWidth > outerWidth) {
      throw new Error('overflow error') // todo make this more useful
    }

  }

  self.public = {
    setOption: function (name, value) {

      if (typeof value === 'function') {

        /*
         * If you pass a function as the value
         * you get special treatment and can have 
         * two functions use the same key
         * becuase they can manage their own problems
         */
         
        self.data.options[name] = value(self.data.options[name]);

      } else if (self.data.options.hasOwnProperty(name)) {

        throw new Error ('two functions are setting the same option: ' + name)

      } else {

        self.data.options[name] = value;  

      }
    }
  }

}