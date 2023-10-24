import Compositor from "./Compositor.js";
import EntityCollider from "./EntityCollider.js";
import TileCollider from "./TileCollider.js";

export default class Level {
    constructor() {
        this.gravity = 1500;
        this.totalTime = 0;

        this.comp = new Compositor();
        this.entities = new Set(); //A set ensures that there's only 1 entity of each/set

        this.entityCollider = new EntityCollider(this.entities);
        this.tileCollider = null;
    }

    setCollisionGrid(matrix) {
        this.tileCollider = new TileCollider(matrix);
    }

    //Update each entity within a level, synchronizing their behavior with deltaTime.
    update(deltaTime) {
        this.entities.forEach(entity => {
            entity.update(deltaTime, this);

            entity.pos.x += entity.vel.x  * deltaTime;
            if (entity.canCollide) {
                this.tileCollider.checkX(entity);
            }

            entity.pos.y += entity.vel.y * deltaTime;
            if (entity.canCollide) {
                this.tileCollider.checkY(entity);
            }

            entity.vel.y += this.gravity * deltaTime;
        });

        this.entities.forEach(entity => {
            if (entity.canCollide) {
                this.entityCollider.check(entity);
            }
        });

        this.totalTime += deltaTime;
    }
}