import Compositor from "./Compositor.js";
import { Matrix } from "./math.js";

export default class Level {
    constructor() {
        this.comp = new Compositor();
        this.entities = new Set(); //A set ensures that there's only 1 entity of each/set
        this.tiles = new Matrix();
    }

    /**
     * Update each entity within a level, synchronizing their behavior with deltaTime.
     * @param {number} deltaTime - The time increment for the update.
     */
    update(deltaTime) {
        this.entities.forEach(entity => {
            entity.update(deltaTime);
        });
    }
}