import Entity from "./Entity.js";
import Jump from "./traits/Jump.js";
import Go from "./traits/Go.js";
import { createAnim } from "./anim.js";
import { loadSpriteSheet } from "./loaders.js"

/**
 * Function for creating Mario sprite
 * @returns loadMarioSprite()
 */
export function createMario() {
    return loadSpriteSheet('mario')
    .then(sprite => {
        const mario = new Entity();
        mario.size.set(14, 16); // size needed for collision, otherwise mario "hangs from his head" from the buttom of the tile

        mario.addTrait(new Go());
        mario.addTrait(new Jump());

        //similar to a mini API
        const runAnim = createAnim(['run-1', 'run-2', 'run-3'], 10);
        function routeFrame(mario) {
            if (mario.go.dir !== 0) {
                return runAnim(mario.go.distance);
            }

            return 'idle';
        }
    
        mario.draw = function drawMario(context) {
            sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0); //conditional expression as argument
        }

        return mario;
    });
}
