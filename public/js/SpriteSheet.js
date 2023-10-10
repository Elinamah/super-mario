export default class SpriteSheet { //default export allows name to be changed within the import if wanted
    constructor(image, width, height) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.tiles = new Map();
        this.animations = new Map();
    }

    defineAnim(name, animation) {
        this.animations.set(name, animation); 
    }

    define(name, x, y, width, height) {
        // buffers[0] = false => nonflipped
        // buffers[1] = true => flipped
        const buffers = [false, true].map(flip => {  //map() same as forEach, except each return value gets put in a separate array
        const buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;

        const context =  buffer.getContext('2d');

        //when the flip function has been run twice, dvs flip goes from false to true
        if (flip) {
            context.scale(-1, 1);
            context.translate(-width, 0);
        }

        context.drawImage(
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

        return buffer;
    });

        this.tiles.set(name, buffers);
    }

    defineTile(name, x, y) {
        this.define(name, x * this.width, y * this.height, this.width, this.height);
    }

    draw(name, context, x, y, flip = false) {
        const buffer = this.tiles.get(name)[flip ? 1 : 0];
        context.drawImage(buffer, x, y);
    }

    drawAnim(name, context, x, y, distance) {
        const animation = this.animations.get(name);
        this.drawTile(animation(distance), context, x, y);
    }

    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height);
    }
}