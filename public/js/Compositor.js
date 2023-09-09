//Its job is to draw all the layers in an order
export default class Compositor {
    constructor() {
        this.layers = [];
    }

    //Loops over all the layers and draws them
    draw(context) {
        this.layers.forEach(layer => {
            layer(context);
        });
    }
}