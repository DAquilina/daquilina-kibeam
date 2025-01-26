import { CELL_CLASSNAMES } from "../constants/cell-classnames.constant.mjs";
import { CELL_PLACEHOLDERS } from "../constants/cell-placeholders.constant.mjs";
import { CELL_TEMPLATE } from "../constants/cell-template.constant.mjs";
import { OverlayType } from "../enums/overlay-type.enum.mjs";


/**
 * Removes the "selected" state from the view of the given cell
 *
 * @param {string} cellId 
 */
export function doDeselect(cellId) {

    const cell = document.getElementById(cellId);

    cell.classList.remove("highlighted");
}

/**
 * Puts the view of the given cell into the "selected" state
 *
 * @param {string} cellId 
 */
export function doSelect(cellId) {

    const cell = document.getElementById(cellId);

    cell.classList.add("highlighted");
}

/**
 * Sets the given cell to edit mode
 *
 * @param {*} cellId 
 */
export function doSetEdit(value) {

    const overlay = document.getElementById("overlay");

    overlay.classList.add(OverlayType.Text);
    overlay.classList.remove("hidden");

    setTimeout(() => {

        const input = document.getElementsByClassName("value-input")[0];

        input.value = value;
        input.focus();
    }, 300);
}

/**
 * Sets the given cell to read-only mode
 *
 * @param {*} cellId 
 */
export function doSetReadonly() {

    const overlay = document.getElementById("overlay");

    overlay.classList.remove(OverlayType.Text);
    overlay.classList.add("hidden");
}

/**
 * Functional wrapper to directly access a DOM element
 *
 * @param {string} id 
 * @returns HTMLElement
 */
export function getElement(id) {

    return document.getElementById(id);
}

/**
 * Retrieves the value from the value input
 *
 * TODO: make this more robust
 *
 * @returns 
 */
export function getValueFromInput() {

    const input = document.getElementsByClassName("value-input")[0];

    return input?.value ?? undefined;
}

/**
 * Injects the given variables in the root context after each of the other stylesheets
 *
 * @param {{ [key: string]: string }} variables 
 */
export function injectCSSVariables(variables) {

    if (variables) {
        const stylesheet = document.createElement("style");

        stylesheet.innerHTML = `:root {`;

        Object.keys(variables).forEach((variable) => {

            stylesheet.innerHTML += `--${variable}: ${variables[variable]};`;
        });

        stylesheet.innerHTML += `}`;

        document.head.appendChild(stylesheet);
    }
}

/**
 * Injects the given markup into the given container
 *
 * @param {string} containerId 
 * @param {string} markupString 
 */
export function injectHTML(containerId, markupString) {

    const container = document.getElementById(containerId);

    if (container) {
        // This should be sanitized, but in the interest of time that's a backlog problem
        container.innerHTML = markupString;
    }
}

/**
 * Generates markup for the given grid and adds it to the view
 * 
 * @param {Grid} grid 
 */
export function renderGrid(grid) {

    let output = ``;
    let classList;
    let currentRow = 0;
    let remainder;

    const [highlightedX, highlightedY] = grid.highlightedCell;

    grid.cells.forEach((cell, index) => {

        remainder = index % grid.columnCount;

        classList = ["cell"];

        if ((index > 0) && (remainder) === 0) {
            currentRow++;
        }

        if (!currentRow && (remainder === (grid.columnCount - 1))) {
            classList.push(CELL_CLASSNAMES.topRight);
        }

        if ((currentRow === (grid.rowCount - 1)) && !remainder) {
            classList.push(CELL_CLASSNAMES.bottomLeft);
        }

        if ((currentRow === (grid.rowCount - 1)) && (remainder === (grid.columnCount - 1))) {
            classList.push(CELL_CLASSNAMES.bottomRight);
        }

        if (currentRow === highlightedX && remainder === highlightedY) {
            classList.push(CELL_CLASSNAMES.highlighted);
        }

        output += CELL_TEMPLATE
            .replace(CELL_PLACEHOLDERS.cellId, grid.cellIdFromXY(remainder, currentRow))
            .replace(CELL_PLACEHOLDERS.initialValue, cell !== undefined ? cell : CELL_PLACEHOLDERS.emptyValue)
            .replace(CELL_PLACEHOLDERS.className, classList.join(" "));
    });

    injectHTML("grid-container", output);
}

/**
 * Updates the given cell to reflect the given value.
 *
 * @param {string} cellId 
 * @param {string} newValue 
 */
export function updateCellContents(cellId, newValue) {

    const cell = document.getElementById(cellId);

    cell.innerHTML = (!!newValue || newValue === 0) ? newValue : CELL_PLACEHOLDERS.emptyValue;
}
