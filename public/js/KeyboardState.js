const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
    constructor() {
        // Holds the current state of a given key (Pressed or not)
        this.keyStates = new Map();

        // Holds the callback functions for a key code (ASCII number) 
        this.keyMap = new Map();
    }

    addMapping(keyCode, callback) {
        this.keyMap.set(keyCode, callback);
    }

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

    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            });
        });
    }
}