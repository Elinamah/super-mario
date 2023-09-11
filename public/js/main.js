import Compositor from './Compositor.js';
import { loadMarioSprite, loadBackgroundSprites } from './sprites.js';
import { loadLevel } from './loaders.js';
import { createBackgroundLayer, createSpriteLayer} from './layers.js';

// Get a reference to an HTML canvas element with the id 'screen'.
const canvas = document.getElementById('screen');

// Get a 2D rendering context for the canvas, which allows drawing on it.
const context = canvas.getContext('2d');

class Vec2 {
    constructor(x, y) {
        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Entity {
    constructor() {
        this.pos = new Vec2(0, 0);
        this.vel = new Vec2(0, 0);
    }
}

Promise.all([ //Want both of these to load in parallell to avoid unnecessary delay
    loadMarioSprite(),
    loadBackgroundSprites(),
    loadLevel('1-1')
])
.then(([ marioSprite, backgroundSprites, level]) => { // Instead of having to specify result[0] & result[1]
    const comp = new Compositor();

    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
    comp.layers.push(backgroundLayer);

    const gravity = 0.5;

    const mario = new Entity();
    mario.pos.set(64, 180);
    mario.vel.set(2, -10);

    const spriteLayer = createSpriteLayer(marioSprite, mario.pos);
    comp.layers.push(spriteLayer);

    //uses the browers own refresh function for updating the image
    function update() {
        comp.draw(context);
        mario.pos.x += mario.vel.x;
        mario.pos.y += mario.vel.y;
        mario.vel.y += gravity;
        requestAnimationFrame(update);
    }

    update(); 
});