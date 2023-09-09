export default class SpriteSheet { //default export allows name to be changed within the import if wanted
    constructor(image, width, height) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.tiles = new Map();
    }

    define(name, x, y, width, height) {
        const buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        buffer
            .getContext('2d')
            .drawImage(
                this.image,        // 1. Source image or canvas
                x,                 // 2. Source x-coordinate
                y,                 // 3. Source y-coordinate
                width,             // 4. Source width
                height,            // 5. Source height
                0,                 // 6. Destination x-coordinate
                0,                 // 7. Destination y-coordinate
                width,             // 8. Destination width
                height             // 9. Destination height
            );
        this.tiles.set(name, buffer);
    }

    defineTile(name, x, y) {
        this.define(name, x * this.width, y * this.height, this.width, this.height);
    }

    draw(name, context, x, y) {
        const buffer = this.tiles.get(name);
        context.drawImage(buffer, x, y);
    }

    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height);
    }
}