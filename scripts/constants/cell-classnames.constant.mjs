// NOTE: the "top-left" equivalent is handled by a :first-child selector in the grid styles. The
//       "bottom-right" doesn't get a similar treatment using :last-child because the last cell
//       doesn't get a rounded corner if there isn't a perfect number of cells
export const CELL_CLASSNAMES = {
    default: "cell",
    bottomLeft: "bottom-left",
    bottomRight: "bottom-right",
    highlighted: "highlighted",
    topRight: "top-right"
};
