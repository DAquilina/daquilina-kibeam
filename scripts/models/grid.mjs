import { bindKeyEvent } from "../events/keyboard.mjs";
import {
    doDeselect,
    doSelect,
    doSetEdit,
    doSetReadonly,
    getElement,
    getValueFromInput,
    injectCSSVariables,
    renderGrid,
    updateCellContents
} from "../util/dom.mjs";

export default class Grid {

    /**
     * The total number of cells in this grid
     *
     * @readonly
     * @memberof Grid
     */
    get cellCount() {
        return this.cells?.length ?? 0;
    }

    /**
     * The complete set of cells in this grid, returned as an unstructured array
     *
     * @readonly
     * @memberof Grid
     */
    get cells() {
        const output = [];

        this.#grid.forEach((row) => {

            output.push(...row);
        });

        return output;
    }

    /**
     * The configured number of columns
     *
     * @readonly
     * @memberof Grid
     */
    get columnCount() {
        return this.#columnCount;
    }
    #columnCount;

    /**
     * The number of cells in the current row. This may differ from this.columnCount if there is
     * an imperfect number of cells and the focus is on the last row
     *
     * @readonly
     * @memberof Grid
     */
    get columnCountCurrentRow() {

        return this.#grid[this.#highlightY].length;
    }

    /**
     * The cellId of the cell in the bottom left of the grid
     *
     * @readonly
     * @memberof Grid
     */
    get cornerIdBottomleft() {
        return this.cellIdFromXY(this.#grid.length, 1);
    }

    /**
     * The cellId of the cell in the top right of the grid
     *
     * @readonly
     * @memberof Grid
     */
    get cornerIdTopRight() {
        return this.cellIdFromXY(1, this.#grid[0]?.length ?? 1);
    }

    /**
     * The value represented by the highlighted cell
     *
     * @readonly
     * @memberof Grid
     */
    get currentValue() {

        return this.#grid[this.#highlightY][this.#highlightX];
    }
    set currentValue(newValue) {
        this.#grid[this.#highlightY][this.#highlightX] = newValue;

        updateCellContents(this.cellIdFromXY(...this.highlightedCell), newValue);
    }

    /**
     * [x, y] coordinates of the highlighted cell
     *
     * @readonly
     * @memberof Grid
     */
    get highlightedCell() {
        return [this.#highlightX, this.#highlightY];
    }
    #highlightX = 0;
    #highlightY = 0;

    /**
     * The flag representing whether or not the grid's highlighted cell is currently in edit mode
     *
     * @readonly
     * @memberof Grid
     */
    get isEditing() {
        return this.#isEditing;
    }
    #isEditing = false;

    /**
     * The total number of rows in this grid
     *
     * @readonly
     * @memberof Grid
     */
    get rowCount() {
        if (!this.cellCount) {
            return 0;
        }

        return this.#grid.length;
    }

    // TODO: cell model to support different data types
    #grid;

    // TODO: make this more atomic
    constructor(cellCount = 4, columnCount = 2, initialValues, theme) {

        const grid = [];

        this.#columnCount = columnCount;

        if (cellCount > 0) {
            let remainingCells = cellCount;
            let firstCellIndex = 0;
            let values, cellsInRow, row;

            while (remainingCells > 0) {

                cellsInRow = Math.min(this.#columnCount, remainingCells);

                values = initialValues?.slice(firstCellIndex, firstCellIndex + cellsInRow) ?? [];

                row = new Array(cellsInRow);

                grid.push([...values, ...row.slice(values.length)]);

                firstCellIndex += cellsInRow;
                remainingCells -= cellsInRow;
            }
        }

        this.#grid = grid;

        injectCSSVariables({
            gridColumnCount: this.#columnCount,
            ...(theme ?? {})
        });

        this.#render();

        this.#bindGridEvents();
    }

    /**
     * Gets the cellId of the cell at the given coordinates
     *
     * @param {number} x 
     * @param {number} y 
     * @returns {string}
     */
    cellIdFromXY(x, y) {

        return `${x + 1}-${y + 1}`;
    }

    /**
     * Makes the cell at the given coordinates the highlighted cell
     *
     * @param {number} x
     * @param {number} y
     */
    doSelect(x, y) {

        if (!this.isEditing && this.isCellPresent(x, y)) {
            doDeselect(this.cellIdFromXY(...this.highlightedCell))
            doSelect(this.cellIdFromXY(x, y));

            this.#highlightX = x;
            this.#highlightY = y;
        }
    }

    /**
     * Returns the grid to readonly mode
     *
     * @param {*} context 
     */
    editModeOff(context) {

        (context ?? this).setEditMode(false);
    }

    /**
     * Causes the grid to enter edit mode
     *
     * @param {*} context 
     */
    editModeOn(context) {

        if ((context ?? this).#isEditing) {
            (context ?? this).saveValue(context);
        }
        else {
            (context ?? this).setEditMode(true);
        }
    }

    /**
     * Determines if the given coordinates are valid for the current grid.
     *
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    isCellPresent(x, y) {

        return (x >= 0 && y >= 0 && y < this.#grid.length && x < this.#grid[y].length);
    }

    /**
     * Stores the value entered by the user and returns the grid to readonly mode
     *
     * @param {*} context 
     */
    saveValue(context) {
        const value = getValueFromInput();

        if ((context ?? this).currentValue !== value) {
            (context ?? this).currentValue = value;
        }

        (context ?? this).editModeOff(context);
    }

    /**
     * Moves the highlighted cell down by one cell, if possible
     *
     * @param {*} context 
     */
    selectDown(context) {

        const [x, y] = (context ?? this).highlightedCell;

        (context ?? this).doSelect(x, y + 1);
    }

    /**
     * Moves the highlighted cell left by one cell, if possible
     *
     * @param {*} context 
     */
    selectLeft(context) {

        const [x, y] = (context ?? this).highlightedCell;

        (context ?? this).doSelect(x - 1, y);
    }

    /**
     * Moves the highlighted cell right by one cell, if possible
     *
     * @param {*} context 
     */
    selectRight(context) {

        const [x, y] = (context ?? this).highlightedCell;

        (context ?? this).doSelect(x + 1, y);
    }

    /**
     * Moves the highlighted cell up by one cell, if possible
     *
     * @param {*} context 
     */
    selectUp(context) {

        const [x, y] = (context ?? this).highlightedCell;

        (context ?? this).doSelect(x, y - 1);
    }

    /**
     * Causes the grid to enter either edit or readonly mode, based on the provided flag
     *
     * @param {boolean} state true -> edit more, false -> readonly mode
     */
    setEditMode(state) {

        if (this.#isEditing !== state) {
            this.#isEditing = state;

            state ? doSetEdit(this.currentValue) : doSetReadonly();
        }
    }

    /**
     * Binds the keyboard events to the DOM elements
     */
    #bindGridEvents() {

        bindKeyEvent("ArrowDown", this.selectDown, this);
        bindKeyEvent("ArrowLeft", this.selectLeft, this);
        bindKeyEvent("ArrowRight", this.selectRight, this);
        bindKeyEvent("ArrowUp", this.selectUp, this);
        bindKeyEvent("Enter", this.editModeOn, this);
        bindKeyEvent("Escape", this.editModeOff, this);
    }

    #render() {

        renderGrid(this);
    }
}
