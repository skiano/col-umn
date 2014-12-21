col-umn.js
==========

``col-umn.js`` uses functions to describe __nested columns__ and the work _(sync or async)_ needed to fill those columns with data.

## Installation

node:

```
$ npm install col-umn
```

## Motivation

I often end up writing __JSON__ descriptions of grids for laying out complicated pages. These descriptions can become quite complicated and usually have properties that are essentially pointers to work that needs to be done (for instance what component needs to be used).

By approaching this problem in a more functional way, I hope to make descriptions of complicated layouts that are  compact, flexible, and expressive. I am also interested in thinking of the layout as an application and not as data.

### Structure overview

```js

var COL = require('col-umn');

// create option functions
optionFn = function (column) {
  column.setOption('optionA', 3);
}

//  * Setup the column               * Render the column
//  |_____                           |________________
//  |    |                           |               |
    COL(3)(optionFn)('optionB', true)({data: [1,2,3]});
//        |_________________________|
//        |
//        * Setup operations to execute on render

```



### Getting started

The whole thing starts with the ``COL`` function

```js

    var COL = require('col-umn');
    
    COL(3);
    
```
    
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

### more stuff

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





    




