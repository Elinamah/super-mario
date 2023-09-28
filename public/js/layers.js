/**
 * Draws up the whole background tile by tile, on a buffer, until the whole background is complete
 * @param {*} backgrounds 
 * @param {*} sprites 
 * @returns drawBackgroundLayer(context) 
 */
export function createBackgroundLayer(level, sprites) {
    const tiles = level.tiles;
    const resolver = level.tileCollider.tiles;

    const buffer = document.createElement('canvas');
    buffer.width = 256 + 16;
    buffer.height = 240;

    const context = buffer.getContext('2d');

    let startIndex;
    let endIndex;
    function redraw(drawFrom, drawTo) {
        //We don't need to redo the loop if we haven't moved the camera
        if (drawFrom === startIndex && drawTo === endIndex){
            return;
        }

        startIndex = drawFrom;
        endIndex = drawTo;

        for (let x = startIndex; x <= endIndex; ++x) {
            const col = tiles.grid[x];
            //if-statement needed, so it doesn't crash when camera moves and tiles are no longer there
            if (col) {
                col.forEach((tile, y) => {
                    sprites.drawTile(tile.name, context, x - startIndex, y);
                });
            }
        }
    }

    return function drawBackgroundLayer(context, camera) {
        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFrom = resolver.toIndex(camera.pos.x);
        const drawTo = drawFrom + drawWidth;
        redraw(drawFrom, drawTo);

        context.drawImage(buffer, 
            -camera.pos.x % 16, //modulus will make is smooth
            -camera.pos.y);
    };
}

/**
 * Takes in set of entities and draw them on the context
 * @param {*} entities 
 * @returns drawSpriteLayer(context)
 */
export function createSpriteLayer(entities, width = 64,height = 64 ) {
    const spriteBuffer = document.createElement('canvas');
    spriteBuffer.width = 64;
    spriteBuffer.height = 64;
    const spriteBufferContext = spriteBuffer.getContext('2d');

    return function drawSpriteLayer(context, camera) {

        entities.forEach(entity => {
            spriteBufferContext.clearRect(0, 0, width, height);

            entity.draw(spriteBufferContext);

            context.drawImage(
                spriteBuffer,
                entity.pos.x - camera.pos.x,
                entity.pos.y - camera.pos.y);
        });
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

    return function drawCollision(context, camera) {
        //blue box around the box we currently pointing at
        context.strokeStyle = 'blue';
        resolvedTiles.forEach(({x, y}) => {
            context.beginPath();
            context.rect(
                x * tileSize -camera.pos.x, 
                y * tileSize -camera.pos.y, 
                tileSize, tileSize);
            context.stroke();
        });

        //red box around mario
        context.strokeStyle = 'red';
        level.entities.forEach(entity => {
            context.beginPath();
            context.rect(
                entity.pos.x -camera.pos.x, 
                entity.pos.y -camera.pos.y,
                entity.size.x, entity.size.y);
            context.stroke();
        });

        resolvedTiles.length = 0;
    };
}

export function createCameraLayer(cameraToDraw) {
    return function drawCameraRect(context, fromCamera){
        context.strokeStyle = 'purple';
        context.beginPath();
            context.rect(
                cameraToDraw.pos.x -fromCamera.pos.x, 
                cameraToDraw.pos.y -fromCamera.pos.y,
                cameraToDraw.size.x, 
                cameraToDraw.size.y);
            context.stroke();
    };  
}
