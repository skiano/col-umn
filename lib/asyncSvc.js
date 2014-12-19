
module.exports = function asyncSvc (fn, timeout) {

  return function wrappedFunction (column, outerData, callback) {

    var tooSlow = false;
    
    if (timeout) {
      var timer = setTimeout(function () {
        tooSlow = true;
        callback(new Error('service timed out'));
      }, timeout);
    }

    fn(column, outerData, function wrappedCallback (error) {
      if (tooSlow) { 
        return; 
      } else {
        if (timeout) {clearTimeout(timer);}
        callback(error);
      }
    });

    // notify col-umn that this is async

    wrappedFunction.isAsync = true;
    return wrappedFunction;

  }

};