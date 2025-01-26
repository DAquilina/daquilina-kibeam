import Grid from "./models/grid.mjs";


/**
 * Bootstraps the application and loads the user's configuration
 */
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
