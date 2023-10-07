import { Trait, Sides } from "../Entity.js";

export default class Jump extends Trait {
    constructor() {
        super('jump');

        this.ready = 0;
        this.duration = 0.3; //jump is longer the longer button is held, but 0.5 is maximum
        this.velocity = 200; //initial jump speed
        this.engageTime = 0; // to see if jump is engaged
        this.requestTime = 0;
        this.gracePeriod = 0.1; //time before landing, that will still allow button inputs
        this.speedBoost = 0.3; //to allow higher jumps when running
    }

    get falling() { //get allows you to call it with mario.jump.falling instead of calling the function
    
        return this.ready < 0;
    }

    start() {
        this.requestTime = this.gracePeriod;
    }

    cancel() {
        this.engageTime = 0;
        this.requestTime = 0;
    }

    obstruct(entity, side) {
        if (side === Sides.BOTTOM) {
            this.ready = 1;
        } else if (side === Sides.TOP) {
            this.cancel();
        }
    }

    /**
     * Update the jump animation based on an entity
     * @param {*} entity The entity/sprite that will jump
     * @param {*} deltaTime The time duration for the update  
     */
    update(entity, deltaTime) { 
        if(this.requestTime > 0) {
            if (this.ready > 0) {
                this.engageTime = this.duration;
                this.requestTime = 0;
            }

            this.requestTime -= deltaTime;
        }

        if (this.engageTime > 0) { //as long as jump is engaged
            entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * this.speedBoost); //minus because we want mario to go upwards 
            this.engageTime -= deltaTime; //this ensures that jump can longer than 0.5 seconds
        }

        this.ready--;
    }
}