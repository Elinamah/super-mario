
/**
 * Draws one specific background with predefined tiles, context and sprites
 * @param {*} background 
 * @param {*} context 
 * @param {*} sprites 
 */
function drawBackground(background, context, sprites) {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
        for(let x = x1;x < x2;x++){
            for(let y = y1; y < y2;y++) {
                sprites.drawTile(background.tile, context, x, y);
            }
        }
    })
}

/**
 * Combines all backgrounds and sprites and add them together
 * @param {*} backgrounds 
 * @param {*} sprites 
 * @returns drawBackgroundLayer(context) 
 */
export function createBackgroundLayer(backgrounds, sprites) {
    const buffer = document.createElement('canvas');
    buffer.width = 256;
    buffer.height = 240;

    backgrounds.forEach(background => {
        drawBackground(background, buffer.getContext('2d'), sprites);
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