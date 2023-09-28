import Camera from './Camera.js';
import Timer from './Timer.js';
import { loadLevel } from './loaders.js';
import { createMario } from './entities.js';
import { createCollisionLayer, createCameraLayer } from './layers.js';
import { setupKeyboard } from './input.js';
import { setupMouseControl } from './debug.js';

// Get a reference to an HTML canvas element with the id 'screen'.
const canvas = document.getElementById('screen');

// Get a 2D rendering context for the canvas, which allows drawing on it.
const context = canvas.getContext('2d');

Promise.all([ //Want both of these to load in parallell to avoid unnecessary delay
    createMario(),
    loadLevel('1-1'), //Level will load in with all layers and entities
])
.then(([mario, level]) => { // Instead of having to specify result[0] & result[1]
    const camera = new Camera();
    window.camera = camera;

    mario.pos.set(64, 64);

    level.comp.layers.push(
        createCollisionLayer(level),
        createCameraLayer(camera)
    );


    level.entities.add(mario);

    const input = setupKeyboard(mario);
    input.listenTo(window);

    setupMouseControl(canvas, mario, camera);

    const timer = new Timer(1/60);

    // Uses a hard coded value(1/60) to ensure stability even with different kinds of user framerates and framerate instabilities
    /**
     * Updates the game level and Mario's horizontal speed and direction.
     * Also draws the updated level on the canvas.
     * @param {number} deltaTime - The time increment for the update.
     */
    timer.update = function update(deltaTime) {
        level.update(deltaTime);
        level.comp.draw(context, camera);
    }

    timer.start(); 
});