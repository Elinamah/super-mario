import Level from "./Level.js";
import SpriteSheet from './SpriteSheet.js'; 
import { createSpriteLayer, createBackgroundLayer} from './layers.js';
import { createAnim } from './anim.js';

/**
 * Loads an image from a given URL and returns it as a Promise.
 *
 * @param {string} url - The URL of the image to be loaded.
 * @returns {Promise<HTMLImageElement>} A Promise that resolves to the loaded image.
 */
export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        
        image.src = url;
    });
}

function loadJSON(url) {
    return fetch(url) 
    .then(response => response.json());
}

/*
- We loop over the backgrounds
- We generalise which coordinates we have
- We create meta data on the tiles in the matrix
*/
function createTiles(level, backgrounds) {
    function applyRange(background, xStart, xLen, yStart, yLen) {
        const xEnd = xStart + xLen;
        const yEnd = yStart + yLen;
        for(let x = xStart;x < xEnd;++x){
            for(let y = yStart; y < yEnd;++y) {
                level.tiles.set(x, y, {
                    name: background.tile,
                    type: background.type,
                });
            }
        }
    }

    backgrounds.forEach(background => {
        background.ranges.forEach(range => {
           if (range.length === 4) {
                //Applies values in order
                const [xStart, xLen, yStart, yLen] = range;
                applyRange(background, xStart, xLen, yStart, yLen);

           } else if (range.length === 3) {
                const [xStart, xLen, yStart] = range;
                applyRange(background, xStart, xLen, yStart, 1);

           } else if (range.length === 2) {
            const [xStart, yStart] = range;
            applyRange(background, xStart, 1, yStart, 1);
       }
        });
    });
}

export function loadSpriteSheet(name) {
    return loadJSON(`/sprites/${name}.json`) 
    .then(sheetSpec => Promise.all([
        sheetSpec, 
        loadImage(sheetSpec.imageURL)
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

/**
 * Loads and builds a game level based on the specified name.
 * Because of json structure, we can easily swap which world to show
 * @param {string} name - The name of the level to load.
 * @returns {Promise<Level>} - A promise that resolves(promise successfully completed) to the built Level object.
 */
export function loadLevel(name) { 
    return loadJSON(`/levels/${name}.json`) //OBS the ` instead of ' used to be able to call placeholder value
    .then(levelSpec => Promise.all([
        levelSpec,
        loadSpriteSheet(levelSpec.spriteSheet),
    ]))    
    .then(([levelSpec, backgroundSprites]) => {
        const level = new Level();

        createTiles(level, levelSpec.backgrounds);

        const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
        level.comp.layers.push(backgroundLayer);
    
        const spriteLayer = createSpriteLayer(level.entities);
        level.comp.layers.push(spriteLayer);

        return level;
    });
}