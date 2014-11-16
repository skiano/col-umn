COL-UMN
==========

col-umn.js describes grids functionally.

### Getting Started

Here is what the basic setup looks like:

    var COL = require('col-umn');
    
    var grid = COL(6)(COL);

Every column starts by calling ```COL()``` and passing in the width of the column. This then returns a build function that allows you to do something do the column. That build function will continue to return itself until the ```COL``` function is passed into it to close the column. At that point the completed column is returned.

#### Nesting Columns

If you want to add a child to the column you pass a column to the build function

    COL(12)(
      COL(4)(COL)
    )(
      COL(8)(COL)
    )(COL);

#### Naming Columns

You can optionally give the column a name by passing a string to the build function. This can add clarity and makes error messages better if you have an invalid grid (more on that later)

    COL(12)('Page')(
      COL(4)('Left Rail')(COL)
    )(
      COL(8)('Right Rail')(COL)
    )(COL);

__which translates to__

    {
      "width": 12,
      "name": "Page",
      "columns": [
        {
          "width": 4,
          "name": "Left Rail"
        },
        {
          "width": 8,
          "name": "Right Rail"
        }
      ]
    }

#### Modifying Columns

If you pass a function to the build function it will run your function by passing the current columns options as the first argument. (it will also pass the children of the column as the second argument if there are any)

    function useBorder (options) {
      options.border = true;
    }

    g = COL(12)(useBorder)(COL);
    
__which translates to__
    
    {
      "width": 12,
      "options": {
        "border": true
      }
    }
    

    




