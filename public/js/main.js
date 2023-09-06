import SpriteSheet from './SpriteSheet.js'; 
import {loadImage, loadLevel} from './loaders.js';

function drawBackground(background, context, sprites) {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
        for(let x = x1;x < x2;x++){
            for(let y = y1; y < y2;y++) {
                sprites.drawTile(background.tile, context, x, y);
            }
        }
    })
}

function loadBackgroundSprites() {
    return loadImage('/img/tiles.png')
    .then(image => {
        const sprites = new SpriteSheet(image, 16, 16);
        sprites.define('ground', 0, 0); //Naming & specifying from where in the src img we're starting the 16x16 box. 0x0 = top left corner
        sprites.define('sky', 3, 23);
        return sprites;
    });
}

// Get a reference to an HTML canvas element with the id 'screen'.
const canvas = document.getElementById('screen');

// Get a 2D rendering context for the canvas, which allows drawing on it.
const context = canvas.getContext('2d');

Promise.all([ //Want both of these to load in parallell to avoid unnecessary delay
    loadBackgroundSprites(),
    loadLevel('1-1')
])
.then(([ sprites, level]) => { // Instead of having to specify result[0] & result[1]
    level.backgrounds.forEach(background => {
        drawBackground(background, context, sprites)
    }) 
});