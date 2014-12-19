col-umn.js
==========

col-umn.js provides a way to describe a nested grid by taking advantage of functions.

### Getting Started

Definition

    COL(6);

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
          COL(
        )(
          COL(
        )
    )(
      COL(4)
    )(
      COL(2)
    )
    ();

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





    




