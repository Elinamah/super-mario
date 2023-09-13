import Entity from "./Entity.js";
import { loadMarioSprite } from './sprites.js';

export function createMario() {
    return loadMarioSprite()
    .then(sprite => {
        const mario = new Entity();
    
        mario.draw = function drawMario(context) {
            sprite.draw('idle', context, this.pos.x, this.pos.y);
        }
    
        //when you attach normal function to object, you get access to "this"
        mario.update = function updateMario(deltaTime) { 
            this.pos.x += this.vel.x  * deltaTime;
            this.pos.y += this.vel.y * deltaTime;
        }
        return mario;
    });
}
