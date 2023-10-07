import Compositor from "./Compositor.js";
import TileCollider from "./TileCollider.js";
import { Matrix } from "./math.js";

export default class Level {
    constructor() {
        this.gravity = 1500;
        this.totalTime = 0;

        this.comp = new Compositor();
        this.entities = new Set(); //A set ensures that there's only 1 entity of each/set
        this.tiles = new Matrix();

        this.tileCollider = new TileCollider(this.tiles);
    }

    /**
     * Update each entity within a level, synchronizing their behavior with deltaTime.
     * @param {number} deltaTime - The time increment for the update.
     */
    update(deltaTime) {
        this.entities.forEach(entity => {
            entity.update(deltaTime);

            entity.pos.x += entity.vel.x  * deltaTime;
            this.tileCollider.checkX(entity);

            entity.pos.y += entity.vel.y * deltaTime;
            this.tileCollider.checkY(entity);

            entity.vel.y += this.gravity * deltaTime;
        });

        this.totalTime += deltaTime;
    }
}