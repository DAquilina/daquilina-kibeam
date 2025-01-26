import Grid from "./models/grid.mjs";


export function init() {

    fetch("./assets/config.json").then(async (configData) => {

        const configJson = await configData.json();

        new Grid(
            configJson.cellCount,
            configJson.columnCount,
            configJson.initialValues,
            configJson.theme
        );
    });
}
