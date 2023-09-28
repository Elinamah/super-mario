import SpriteSheet from './SpriteSheet.js'; 
import { loadImage } from './loaders.js';

/**
 * Takes an image of different Mario Sprite drawings and specifying which one we want
 * @returns loadImage -> Mario Sprite
 */
export function loadMarioSprite() {
    return loadImage('/img/characters.gif')
    .then(image => {
        const sprites = new SpriteSheet(image, 16, 16);
        sprites.define('idle', 276, 44, 16, 16); //Naming & specifying from where in the src img we're starting the 16x16 box. 0x0 = top left corner
        return sprites;
    });
}