export default class SpriteSheet { //default export allows name to be changed within the import if wanted
    constructor(image, width, height) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.tiles = new Map();
    }

    define(name, x, y) {
        const buffer = document.createElement('canvas');
        buffer.width = this.width;
        buffer.height = this.height;
        buffer
            .getContext('2d')
            .drawImage(
                this.image,        // 1. Source image or canvas
                x * this.width,    // 2. Source x-coordinate
                y * this.height,   // 3. Source y-coordinate
                this.width,        // 4. Source width
                this.height,       // 5. Source height
                0,                 // 6. Destination x-coordinate
                0,                 // 7. Destination y-coordinate
                this.width,        // 8. Destination width
                this.height        // 9. Destination height
            );
        this.tiles.set(name, buffer);
    }

    draw(name, context, x, y) {
        const buffer = this.tiles.get(name);
        context.drawImage(buffer, x, y);
    }

    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height);
    }
}