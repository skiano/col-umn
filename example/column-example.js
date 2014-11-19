
var COL = require('../lib/COL');


var build = COL(6)(
  COL(4)
)(
  COL(2)
)(
  COL(6)(
    COL(3)
  )(
    COL(3)
  )
)

console.log(build())


