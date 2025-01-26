# DAquilina's Interactive Grid

This is a simple application written using JavaScript modules to present a simple interactive grid.
The user can change the highlighted cell using the arrow keys and edit the value (locally) by pressing
`Enter`. When editing, pressing `Enter` again will save the value, and pressing `Esc` will cancel edit
mode and return the grid to read-only mode.

## Configuration

The grid can be customized by editing `assets/config.json` according to the schema below:

```
  {
    // Indicates the total number of cells present in the grid
    cellCount: number (integer), >=0, default 4

    // Indicates how many columns the grid's layout will have
    columnCount: number (integer), >=0, default 2

    // The set of values, in order, which will populate the grid starting from the top-left cell
    // and proceeding left to right, then top to bottom
    initialValues: Array<string>, default undefined

    // Any CSS variables can be overwritten by setting values in the theme (see: assets/variables.css)
    // Do not include the preceding dashes (e.g. --textColor -> "textColor": {VALUE})
    theme: { [key: string]: string }, default undefined
  }
```

## Data Structure

Internally, the grid data is stored in the Grid model as a an array of arrays, where each cell has an
ID set to its coordinates in the grid. If there is an imperfect number of cells (i.e. not a perfect
square), then the last row will have fewer elements.

```
      COL   COL   COL
ROW [[1-1] [1-2] [1-3]]
ROW [[2-1] [2-2] [2-3]]
ROW [[3-1] [3-2] [3-3]]
ROW [[4-1] [4-2]]
```
