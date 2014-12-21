col-umn.js
==========

_Note: this is not ready for stable use_

``col-umn.js`` uses functions to describe __nested columns__ and the work __(sync or async)__ needed to fill those columns with data.

## Installation

```
$ npm install col-umn
```

## Motivation

I often end up writing __JSON__ descriptions of grids for laying out complicated pages. These descriptions can become quite complicated and usually have properties that are essentially pointers to work that needs to be done (for instance what component needs to be used).

By approaching this problem in a more functional way, I hope to make descriptions of complicated layouts that are  compact, flexible, and expressive. I am also interested in thinking of the layout as an application and not as data.

### Structure overview

```js

var COL = require('col-umn');

//  * Setup the column               * Render the column
//  |_____                           |_________________________
//  |    |                           |                        |
    COL(3)(optionFn)('optionB', true)({data: [1,2,3]},callback);
//        |_________________________|
//        |
//        * Setup column operations to execute on render.
//          - functions that set options
//          - simple option assignment
//          - child columns

```

__breaking down the structure__

The ``COl`` function returns the __build function__ which is used to set options and nest other columns’ build functions.

```js

// Setup a 3 unit column and return the 'build function'

var buildFn = COL(3);
  
// The build function returns itself until
// it is called with an {} or undefined

buildFn = buildFn(optionFn);
buildFn = buildFn('optionB', true);

// Execute the final rendered column
// and return the final data

buildFn({data: [1,2,3]}, callback); 

```

## Examples

__Simple Option setting__

```js

COL(6)('Awesome', true);

// Rendered:

// {
//   "width": 6,
//   "options": {
//      "Awesome": true
//    }
//  }
    
```

__Nesting__

```js

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
  );
  
// Rendered:

// {
//   "width": 6,
//   "columns": [
//     {
//       "width": 6,
//       "columns": [
//         {
//           "width": 3
//         },
//         {
//           "width": 3
//         }
//       ]
//     },
//     {
//       "width": 4
//     },
//     {
//       "width": 2
//     }
//   ]
// }

```


