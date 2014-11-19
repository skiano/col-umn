
var col = require('../lib/COL');

function setContent (options) {
  options.content = true;
}

var build = col(6)
    (
    col(4)(setContent)
    )(
    col(2)(setContent)
    )(
    col(6)(setContent)
        (
        col(3)(setContent)
        )( 
        col(3)(setContent) 
        )
    );

console.log(JSON.stringify(build(),null,2))




