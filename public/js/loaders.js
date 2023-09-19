import Level from "./Level.js";
import { createSpriteLayer, createBackgroundLayer} from './layers.js';
import { loadBackgroundSprites } from './sprites.js';

/**
 * Loads an image from a given URL and returns it as a Promise.
 *
 * @param {string} url - The URL of the image to be loaded.
 * @returns {Promise<HTMLImageElement>} A Promise that resolves to the loaded image.
 */
export function loadImage(url) {
    // Create and return a new Promise.
    return new Promise(resolve => {
        // Create a new image element.
        const image = new Image();
        
        // Add an event listener to the image's 'load' event.
        image.addEventListener('load', () => {
            // When the image has loaded, resolve the Promise with the loaded image.
            resolve(image);
        });
        
        // Set the 'src' attribute of the image to the provided URL, triggering the loading process.
        image.src = url;
    });
}

/*
- We loop over the backgrounds
- We generalise which coordinates we have
- We create meta data on the tiles in the matrix
*/
function createTiles(level, backgrounds) {
    backgrounds.forEach(background => {
        background.ranges.forEach(([x1, x2, y1, y2]) => {
            for(let x = x1;x < x2;x++){
                for(let y = y1; y < y2;y++) {
                    level.tiles.set(x, y, {
                        name: background.tile,
                    })
                }
            }
        });
    });
}


/**
 * Loads and builds a game level based on the specified name.
 * @param {string} name - The name of the level to load.
 * @returns {Promise<Level>} - A promise that resolves(promise successfully completed) to the built Level object.
 */
export function loadLevel(name) { 
    return Promise.all([
        fetch(`/levels/${name}.json`) // OBS the ´ instead of ' to allow placeholder value
        .then(response => response.json()),

        loadBackgroundSprites(),
    ])
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