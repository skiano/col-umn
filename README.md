Chain Grid
==========

Chain Grid provides a way to describe nested grids as a chained function. It also allows the user to define methods for setting options for columns within the chain. For example, you could specify a module option that could store modules in a column. 

The chain is a much more compact way to express a nested grid then html or json. Also it has the advantage that as it executes it can vallidate the nesting and provide feedback about where columns do not nest properly.

### Quick Example
this is what a grid with no column options might look like

    grid
      .column(12)
        .nest(2)
          .column(6)
          .column(6)
        .nest(1)
          .column(12)

