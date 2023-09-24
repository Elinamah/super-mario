/**
 * Draws up the whole background tile by tile, on a buffer, until the whole background is complete
 * @param {*} backgrounds 
 * @param {*} sprites 
 * @returns drawBackgroundLayer(context) 
 */
export function createBackgroundLayer(level, sprites) {
    const buffer = document.createElement('canvas');
    buffer.width = 256;
    buffer.height = 240;

    const context = buffer.getContext('2d');

    level.tiles.forEach((tile, x, y) => {
        sprites.drawTile(tile.name, context, x, y);
    });

    return function drawBackgroundLayer(context) {
        context.drawImage(buffer, 0, 0);
    }
}

/**
 * Takes in set of entities and draw them on the context
 * @param {*} entities 
 * @returns drawSpriteLayer(context)
 */
export function createSpriteLayer(entities) {
    return function drawSpriteLayer(context) {
        entities.forEach(entity => {
            entity.draw(context);
        })
    };
}

//Track which tiles we've gotten by getByIndex()
export function createCollisionLayer(level) {
    const resolvedTiles = [];

    const tileResolver = level.tileCollider.tiles;
    const tileSize = tileResolver.tileSize;

    //this is needed so we can use the ".call()" function, which lets us acces the "this."" inside the getByIndex()
    const getByIndexOriginal = tileResolver.getByIndex; //reference to the original function
    tileResolver.getByIndex = function getByIndexFake(x, y) { //override the original
        resolvedTiles.push({x, y});
        return getByIndexOriginal.call(tileResolver, x, y);
    }

    return function drawCollision(context) {
        //blue box around the box we currently pointing at
        context.strokeStyle = 'blue';
        resolvedTiles.forEach(({x, y}) => {
            context.beginPath();
            context.rect(
                x * tileSize, 
                y * tileSize, 
                tileSize, tileSize);
            context.stroke();
        });

        //red box around mario
        context.strokeStyle = 'red';
        level.entities.forEach(entity => {
            context.beginPath();
            context.rect(
                entity.pos.x, entity.pos.y,
                entity.size.x, entity.size.y);
            context.stroke();
        });

        resolvedTiles.length = 0;
    };
}
