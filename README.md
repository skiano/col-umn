COL-UMN
==========

col-umn.js describes grids functionally.

Here is what the basic setup looks like:

    var COL = require('col-umn');
    
    var grid = COL(6)(COL);

Every column starts by calling ```COL()``` and passing in the width of the column. This then returns a build function that allows you to do something do the column. That build function will continue to return itself until the COL function is passed into it to close the column. At that point the completed column is returned.

If you want to add a child to the column you pass a column to the build function

    COL(6)(
      COL(3)(COL)
    )(
      COL(3)(COL)
    )(COL);
