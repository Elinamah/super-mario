import Timer from './Timer.js';
import { loadLevel } from './loaders.js';
import { createMario } from './entities.js';
import Keyboard from './KeyboardState.js';

// Get a reference to an HTML canvas element with the id 'screen'.
const canvas = document.getElementById('screen');

// Get a 2D rendering context for the canvas, which allows drawing on it.
const context = canvas.getContext('2d');

Promise.all([ //Want both of these to load in parallell to avoid unnecessary delay
    createMario(),
    loadLevel('1-1') //Level will load in with all layers and entities
])
.then(([mario, level]) => { // Instead of having to specify result[0] & result[1]

    const gravity = 2000;
    mario.pos.set(64, 64);

    level.entities.add(mario);

    const SPACE = 32;
    const input = new Keyboard();
    input.addMapping(SPACE, keyState => {
        if (keyState) { 
            mario.jump.start();
        } else {
            mario.jump.cancel();
        }
        console.log(keyState);
    });
    input.listenTo(window);

    /*Allow us to specify Marios location if we press left mouse button
    Makes it easier to debug the tile collisions*/
    ['mousedown', 'mousemove'].forEach(eventName => {
        canvas.addEventListener(eventName, event => {
            if (event.buttons === 1) {
                mario.vel.set(0, 0);
                mario.pos.set(event.offsetX, event.offsetY);
            }
        })
    })

    const timer = new Timer(1/60);

    // Uses a hard coded value(1/60) to ensure stability even with different kinds of user framerates and framerate instabilities
    /**
     * Updates the game level and Mario's horizontal speed and direction.
     * Also draws the updated level on the canvas.
     * @param {number} deltaTime - The time increment for the update.
     */
    timer.update = function update(deltaTime) {
        level.update(deltaTime);
        level.comp.draw(context);
        mario.vel.y += gravity * deltaTime;
    }

    timer.start(); 
});