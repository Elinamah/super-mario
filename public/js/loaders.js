import SpriteSheet from './SpriteSheet.js'; 
import { createAnim } from './anim.js';

export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

export function loadJSON(url) {
    return fetch(url) 
    .then(response => response.json());
}

export function loadSpriteSheet(name) {
    return loadJSON(`/sprites/${name}.json`) 
    .then(sheetSpec => Promise.all([
        sheetSpec, 
        loadImage(sheetSpec.imageURL),
    ]))
    .then(([sheetSpec, image]) => {
        const sprites = new SpriteSheet(
            image, 
            sheetSpec.tileWidth, 
            sheetSpec.tileHeight);

        if (sheetSpec.tiles) {
            sheetSpec.tiles.forEach(tileSpec => {
                sprites.defineTile(
                    tileSpec.name, 
                    tileSpec.index[0],
                    tileSpec.index[1]); //Naming & specifying from where in the src img we're starting the 16x16 box. 0x0 = top left corner
            });   
        }    

        if (sheetSpec.frames) {
            sheetSpec.frames.forEach(frameSpec => {
                sprites.define(frameSpec.name, ...frameSpec.rect); //spread operator, instead of typing frameSpec[0], framspec[1]...
            });
        }

        if (sheetSpec.animations) {
            sheetSpec.animations.forEach(animSpec => {
                const animation = createAnim(animSpec.frames, animSpec.frameLen);
                sprites.defineAnim(animSpec.name, animation);
            });
        }

        return sprites;
    });
}   