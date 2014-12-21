col-umn.js
==========

col-umn.js provides a way to describe a nested grid by taking advantage of functions.

### The structure

The whole thing starts with the ``COL`` function

    var COL = require('col-umn');
    
    COL(3);
    
This simply means you want a column that is 3 units wide. If this was rendered the final data would be

    {
      width: 3
    }

You can then attatch as many _option functions_ as you want.

    var optionFn = function (column) {
      // configure the column
      column.setOption('myOption', true);
    };
    
    COL(3)(optionFn);
    
which would render to the following

    {
      width: 3,
      myOption: true
    }
    
For simple option setting, like the last example you can also do this

    COL(3)('myOption', true); // same data as last example

### Getting Started

Definition

    COL(6)

When rendered this could be

    {
      "width": 6
    }

Definition

    COL(6)('Awesome', true)

When rendered this could be

    {
      "width": 6,
      "options": {
        "Awesome": true
      }
    }

Definition

    COL(6)
      (
        COL(6)
          (
            COL(3)
          )(
            COL(3)
          )
      )(
        COL(4)
      )(
        COL(2)
      )

When rendered this could be

    {
      "width": 6,
      "columns": [
        {
          "width": 6,
          "columns": [
            {
              "width": 3
            },
            {
              "width": 3
            }
          ]
        },
        {
          "width": 4
        },
        {
          "width": 2
        }
      ]
    }





    




