import Compositor from './Compositor.js';
import { loadMarioSprite, loadBackgroundSprites } from './sprites.js';
import { loadLevel } from './loaders.js';
import { createBackgroundLayer, createSpriteLayer} from './layers.js';

// Get a reference to an HTML canvas element with the id 'screen'.
const canvas = document.getElementById('screen');

// Get a 2D rendering context for the canvas, which allows drawing on it.
const context = canvas.getContext('2d');

Promise.all([ //Want both of these to load in parallell to avoid unnecessary delay
    loadMarioSprite(),
    loadBackgroundSprites(),
    loadLevel('1-1')
])
.then(([ marioSprite, backgroundSprites, level]) => { // Instead of having to specify result[0] & result[1]
    const comp = new Compositor();

    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
    comp.layers.push(backgroundLayer);

    //Made this a separate variable to be able to move Mario around
    const pos = {
        x: 64,
        y: 64
    };

    const spriteLayer = createSpriteLayer(marioSprite, pos);
    comp.layers.push(spriteLayer);

    //uses the browers own refresh function for updating the image
    function update() {
        comp.draw(context);
        pos.x += 2;
        pos.y += 2;
        requestAnimationFrame(update);
    }

    update(); 
});