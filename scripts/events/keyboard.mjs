export function bindKeyEvent(key, callback, context) {

    window.addEventListener("keydown", (event) => {

        if (event.key === key) {
            callback(context);
        }
    });
}
