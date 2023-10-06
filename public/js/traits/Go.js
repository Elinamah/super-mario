import { Trait } from "../Entity.js";

export default class Go extends Trait {
    constructor() {
        super('go');

        this.dir = 0;
        this.speed = 10000;

        this.distance = 0;
        this.heading = 1;
    }

    /**
     * Update the moving animation based on an entity
     * @param {*} entity The entity/sprite that will jump
     * @param {*} deltaTime The time duration for the update  
     */
    update(entity, deltaTime) { 
        entity.vel.x = this.speed * this.dir * deltaTime;

        if (this.dir) {
            this.heading = this.dir;
            this.distance += Math.abs(entity.vel.x) *deltaTime; //Math.abs to not get negative numbers. distance of running over time
        } else {
            this.distance = 0;
        }
        
    }
}