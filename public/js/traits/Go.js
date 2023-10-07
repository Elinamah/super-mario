import { Trait } from "../Entity.js";

export default class Go extends Trait {
    constructor() {
        super('go');

        this.dir = 0;
        this.acceleration = 400;
        this.deceleration = 300;
        this.dragFactor = 1/5000;

        this.distance = 0;
        this.heading = 1;
    }

    /**
     * Update the moving animation based on an entity
     * @param {*} entity The entity/sprite that will jump
     * @param {*} deltaTime The time duration for the update  
     */
    update(entity, deltaTime) { 
        const absX = Math.abs(entity.vel.x)

        if (this.dir !== 0) {
            entity.vel.x += this.acceleration * deltaTime * this.dir;

            if(entity.jump) { 
                if(entity.jump.falling === false) {
                    this.heading = this.dir; //can't be in the air while changing direction
                } 
            } else {
                this.heading = this.dir;
            }

        } else if (entity.vel.x !== 0) {
            const decel = Math.min(absX, this.deceleration * deltaTime);
            entity.vel.x += entity.vel.x > 0 ? -decel : decel;
        } else {
            this.distance = 0;
        }

        //how air resistance is calculated irl
        const drag = this.dragFactor * entity.vel.x * absX;
        entity.vel.x -= drag;

        this.distance += absX *deltaTime; //Math.abs to not get negative numbers. distance of running over time

    }
}