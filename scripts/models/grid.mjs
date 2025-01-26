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
    get cellCount() {
        return this.cells?.length ?? 0;
    }

    get cells() {
        const output = [];

        this.#grid.forEach((row) => {

            output.push(...row);
        });

        return output;
    }

    get columnCount() {
        return this.#columnCount;
    }
    #columnCount;

    get columnCountCurrentRow() {

        return this.#grid[this.#highlightY].length;
    }

    get cornerIdBottomleft() {
        return this.cellIdFromXY(this.#grid.length, 1);
    }

    get cornerIdTopRight() {
        return this.cellIdFromXY(1, this.#grid[0]?.length ?? 1);
    }

    get currentValue() {

        return this.#grid[this.#highlightY][this.#highlightX];
    }
    set currentValue(newValue) {
        this.#grid[this.#highlightY][this.#highlightX] = newValue;

        updateCellContents(this.cellIdFromXY(...this.highlightedCell), newValue);
    }

    get highlightedCell() {
        return [this.#highlightX, this.#highlightY];
    }
    #highlightX = 0;
    #highlightY = 0;

    get isEditing() {
        return this.#isEditing;
    }
    #isEditing = false;

    get rowCount() {
        if (!this.cellCount) {
            return 0;
        }

        return this.#grid.length;
    }

    // TODO: cell model to support different data types
    #grid;

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

    cellIdFromXY(x, y) {

        return `${x + 1}-${y + 1}`;
    }

    doSelect(x, y, context) {

        doDeselect((context || this).cellIdFromXY(...(context || this).highlightedCell))
        doSelect((context || this).cellIdFromXY(x, y));

        this.#highlightX = x;
        this.#highlightY = y;
    }

    editModeOff(context) {

        (context ?? this).setEditMode(false);
    }

    editModeOn(context) {

        if ((context ?? this).#isEditing) {
            (context ?? this).saveValue(context);
        }
        else {
            (context ?? this).setEditMode(true);
        }
    }

    saveValue(context) {
        const value = getValueFromInput();

        if ((context ?? this).currentValue !== value) {
            (context ?? this).currentValue = value;
        }

        (context ?? this).editModeOff(context);
    }

    selectDown(context) {

        if (!(context ?? this).isEditing) {
            const [x, y] = (context ?? this).highlightedCell;

            if (y < ((context ?? this).rowCount - 1)) {
                (context ?? this).doSelect(x, y + 1, context);
            }
        }
    }

    selectLeft(context) {

        if (!(context ?? this).isEditing) {
            const [x, y] = (context ?? this).highlightedCell;

            if (x > 0) {
                (context ?? this).doSelect(x - 1, y, context);
            }
        }
    }

    selectRight(context) {

        if (!(context ?? this).isEditing) {
            const [x, y] = (context ?? this).highlightedCell;

            if (x < ((context ?? this).columnCountCurrentRow - 1)) {
                (context ?? this).doSelect(x + 1, y, context);
            }
        }
    }

    selectUp(context) {

        if (!(context ?? this).isEditing) {
            const [x, y] = (context ?? this).highlightedCell;

            if (y > 0) {
                (context ?? this).doSelect(x, y - 1, context);
            }
        }
    }

    setEditMode(state) {

        if (this.#isEditing !== state) {
            this.#isEditing = state;

            state ? doSetEdit(this.currentValue) : doSetReadonly();
        }
    }

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
