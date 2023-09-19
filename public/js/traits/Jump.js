import { Trait } from "../Entity.js";

export default class Jump extends Trait {
    constructor() {
        super('jump');

        this.duration = 0.5; //jump is longer the longer button is held, but 0.5 is maximum
        this.velocity = 200; //initial jump speed
        this.engageTime = 0; // to see if jump is engaged
    }

    start() {
        this.engageTime = this.duration;
    }

    cancel() {
        this.engageTime = 0;
    }

    /**
     * Update the jump animation based on an entity
     * @param {*} entity The entity/sprite that will jump
     * @param {*} deltaTime The time duration for the update  
     */
    update(entity, deltaTime) { 
        if (this.engageTime > 0) { //as long as jump is engaged
            entity.vel.y = -this.velocity; // - because we want mario to go upwards
            this.engageTime -= deltaTime; //this ensures that jump can longer than 0.5 seconds
        }
    }
}