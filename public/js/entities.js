import Entity from "./Entity.js";
import Velocity from "./traits/Velocity.js";
import Jump from "./traits/Jump.js";
import Go from "./traits/Go.js";
import { loadMarioSprite } from './sprites.js';

/**
 * Function for creating Mario sprite
 * @returns loadMarioSprite()
 */
export function createMario() {
    return loadMarioSprite()
    .then(sprite => {
        const mario = new Entity();
        mario.size.set(14, 16); // size needed for collision, otherwise mario "hangs from his head" from the buttom of the tile

        mario.addTrait(new Go());
        mario.addTrait(new Jump());
        //mario.addTrait(new Velocity());
    
        mario.draw = function drawMario(context) {
            sprite.draw('idle', context, 0, 0);
        }

        return mario;
    });
}
