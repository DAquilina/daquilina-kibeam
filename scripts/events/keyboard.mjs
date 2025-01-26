/**
 * Binds the given key as a global hotkey, activating the specified callback when detected.
 *
 * TODO: modifier keys, hotkey map to prevent multiple bindings, unbind logic
 *
 * @param {string} key The plaintext name of the key to be targeted. See MDN for more information.
 * @param {function} callback The function to be called when the given key is pressed
 * @param {*} context Used to maintain a reference to "this"
 */
export function bindKeyEvent(key, callback, context) {

    window.addEventListener("keydown", (event) => {

        if (event.key === key) {
            callback(context);
        }
    });
}
