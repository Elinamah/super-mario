import Compositor from './Compositor.js';
import Timer from './Timer.js';
import { loadBackgroundSprites } from './sprites.js';
import { loadLevel } from './loaders.js';
import { createSpriteLayer, createBackgroundLayer} from './layers.js';
import { createMario } from './entities.js';
import Keyboard from './KeyboardState.js';

// Get a reference to an HTML canvas element with the id 'screen'.
const canvas = document.getElementById('screen');

// Get a 2D rendering context for the canvas, which allows drawing on it.
const context = canvas.getContext('2d');

Promise.all([ //Want both of these to load in parallell to avoid unnecessary delay
    createMario(),
    loadBackgroundSprites(),
    loadLevel('1-1')
])
.then(([ mario, backgroundSprites, level]) => { // Instead of having to specify result[0] & result[1]
    const comp = new Compositor(); //for layers

    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
    comp.layers.push(backgroundLayer);

    const gravity = 2000;
    mario.pos.set(64, 180);
    //mario.vel.set(200, -600);

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

    const spriteLayer = createSpriteLayer(mario);
    comp.layers.push(spriteLayer);

    const timer = new Timer(1/60);

    // Uses a hard coded value(1/60) to ensure stability even with different kinds of user framerates and framerate instabilities
    timer.update = function update(deltaTime) {
        mario.update(deltaTime);
        comp.draw(context);
        mario.vel.y += gravity * deltaTime;
    }

    timer.start(); 
});