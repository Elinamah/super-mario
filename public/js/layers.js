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