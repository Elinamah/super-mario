import { Vec2 } from './math.js';

//Represents what part of the level we draw at any given moment
export default class Camera {
    constructor() {
        this.pos = new Vec2(0, 0);
        this.size = new Vec2(256, 224);
    }
}