const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
    constructor() {
        // Holds the current state of a given key (Pressed or not)
        this.keyStates = new Map();

        // Holds the callback functions for a key code (ASCII number) 
        this.keyMap = new Map();
    }

    /**
     * Maps a keyboard key code to a callback function.
     * @param {*} keyCode - The key code to map.
     * @param {*} callback - The function to be executed when the key is pressed.
     */
    addMapping(keyCode, callback) {
        this.keyMap.set(keyCode, callback);
    }

    /**
     * Handles keyboard events to map key presses and the functions to be executed when keys are pressed.
     * @param {*} event - The keyboard event object, which key is pressed and a check if it's a new event.
     */
    handleEvent(event) {
        const {keyCode} = event;

        if (!this.keyMap.has(keyCode)) {
            //Did not have key mapped
            return;
        }

        //We need to have made the keyStates for this to even trigger
        event.preventDefault();

        //ternary operator:
        //const keyState = event.type === 'keydown' ? PRESSED : RELEASED;
        let keyState;

        if (event.type === 'keydown') {
            keyState = PRESSED;
        } else {
            keyState = RELEASED;
        }

        // If keyStates and keyCode are already the same as the last event => no changes needed
        if (this.keyStates.get(keyCode) === keyState) {
            return;
        }

        //If there's a difference since the last event
        this.keyStates.set(keyCode, keyState);
        console.log(this.keyStates);

        //this.keyMap.get(keyCode)(keyState);
        const callback = this.keyMap.get(keyCode);
        if (callback) {
            callback(keyState);
        }

    }

    /**
     * Sets up event listeners for keydown and keyup events on the specified `window` object
     * and processes the events using the `handleEvent` method.
     * @param {*} window The window object to listen to.
     */
    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            });
        });
    }
}