import Level from "../Level.js";
import { createSpriteLayer, createBackgroundLayer} from '../layers.js';
import { loadJSON, loadSpriteSheet } from "../loaders.js";
import { Matrix } from "../math.js";

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

        const mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
            return mergedTiles.concat(layerSpec.tiles);
        }, []);

        //console.log('levelSpec:', levelSpec);
        console.log('Tiles:', levelSpec.layers);

        const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
        level.setCollisionGrid(collisionGrid);

        levelSpec.layers.forEach(layer => {
            const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
            const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);
            level.comp.layers.push(backgroundLayer);
        });
    
        const spriteLayer = createSpriteLayer(level.entities);
        level.comp.layers.push(spriteLayer);

        return level;
    });
}

function createCollisionGrid(tiles, patterns) {
    const grid = new Matrix();

    for (const {tile, x, y} of expandTiles(tiles, patterns)) {
        grid.set(x, y, {
            type: tile.type,
        });
    }

    return grid;
}

function createBackgroundGrid(tiles, patterns) {
    const grid = new Matrix();

    for (const {tile, x, y} of expandTiles(tiles, patterns)) {
        grid.set(x, y, {
            name: tile.name,
        });
    }

    return grid;
}

//* and yield allows us to skip pushing into an array and returning it
function* expandSpan(xStart, xLen, yStart, yLen) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for(let x = xStart;x < xEnd;++x){
        for(let y = yStart; y < yEnd;++y) {
            yield {x, y};
        }
    }
}

//creates a generator for expandSpan
function expandRange(range) {
    if (range.length === 4) {
        //Applies values in order
        const [xStart, xLen, yStart, yLen] = range;
        return expandSpan(xStart, xLen, yStart, yLen);

   } else if (range.length === 3) {
        const [xStart, xLen, yStart] = range;
        return expandSpan(xStart, xLen, yStart, 1);

   } else if (range.length === 2) {
        const [xStart, yStart] = range;
        return expandSpan(xStart, 1, yStart, 1);
    }
}

function* expandRanges(ranges) {
    for (const range of ranges) {
        for (const item of expandRange(range)) {
            yield item;
        }
    }
}


//OBS TODO - UNDERSTAND WHY OFFSET X AND Y NEEDED AND CHECK INTO FOR OF LOOP
/*
- We loop over the tiles
- We generalise which coordinates we have
- We create meta data on the tiles in the matrix
*/
function expandTiles(tiles, patterns) {
    const expandedTiles = [];

    function walkTiles(tiles, offSetX, offSetY) {
        for (const tile of tiles) {
            for(const {x, y} of expandRanges(tile.ranges)) {
                const derivedX = x + offSetX;
                const derivedY = y + offSetY;

                if (tile.pattern) {
                    const tiles = patterns[tile.pattern].tiles;
                    walkTiles(tiles, derivedX, derivedY)
                } else {
                    expandedTiles.push({
                        tile,
                        x: derivedX,
                        y: derivedY
                    });
                }
            }
        }
    }

    walkTiles(tiles, 0, 0);

    return expandedTiles;
}
