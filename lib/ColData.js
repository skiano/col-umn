
var ColWork = require('./ColWork');

module.exports = function ColData (data, filter) {

  // allow a simple setup with just width
  // or any extra config

  if(typeof data === 'number') {
    data = {
      outerWidth: data
    }
  }

  // filter allows the column to sub set the
  // data from the schema

  this.filter = filter;

  // make the config data available

  this.data = data;

  // set up an object to execute tasks

  this.work = new ColWork(this, ColData);

  // private variables

  var self = this
    , outerWidth = data.outerWidth
    , childrenWidth = 0
    ;

  // clear() is used to ensure 
  // same grid can be rendered 
  // with different data

  self.clear = function () {
    self.data.options = {};
    delete(self.data.columns);
  }

  // setError() allows
  // async modules to add error messages
  // to the column

  self.setError = function (error) {

    if (typeof error === 'object' && error.hasOwnProperty('length')) {
      // this is the child errors bubbling up
    } else {
      self.data.error = error instanceof Error ? error.message : error;
    }

  }

  // addChildColumn() 
  // is used by column work to 
  // created the nesting

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

  // public is the interface 
  // that is exposed to the user services

  self.public = {

    // setOption() allows user service
    // to configure column

    setOption: function (name, value) {

      if (typeof value === 'function') {

        // If you pass a function as the value
        // you get special treatment and can have 
        // two functions use the same key
        // becuase they can manage their own problems
         
        self.data.options[name] = value(self.data.options[name]);

      } else if (self.data.options.hasOwnProperty(name)) {

        // let the user know if they have 
        // one service overwriting the work 
        // of another

        throw new Error ('two functions are setting the same option: ' + name)

      } else {

        self.data.options[name] = value;  

      }
    }

  }

}