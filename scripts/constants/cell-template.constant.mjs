import { CELL_PLACEHOLDERS } from "./cell-placeholders.constant.mjs"

export const CELL_TEMPLATE = `
    <div id="${CELL_PLACEHOLDERS.cellId}" class="${CELL_PLACEHOLDERS.className}">
        <span class="cell-value">${CELL_PLACEHOLDERS.initialValue}</span>
    </div>
`;
