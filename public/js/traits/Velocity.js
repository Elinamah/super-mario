import { Trait } from "../Entity.js";

export default class Velocity extends Trait {
    constructor() {
        super('velocity');
    }

    /**
     * Update velocity on an entity
     * @param {*} entity Entity to be updated
     * @param {*} deltaTime Time duration between updates
     */
    update(entity, deltaTime) { 
        entity.pos.x += entity.vel.x  * deltaTime;
        entity.pos.y += entity.vel.y * deltaTime;
    }
}