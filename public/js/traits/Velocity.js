import { Trait } from "../Entity.js";

export default class Velocity extends Trait {
    constructor() {
        super('velocity');
    }

    //when you attach normal function to object, you get access to "this"
    update(entity, deltaTime) { 
        entity.pos.x += entity.vel.x  * deltaTime;
        entity.pos.y += entity.vel.y * deltaTime;
    }
}