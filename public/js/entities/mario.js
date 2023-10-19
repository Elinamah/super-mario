import Entity from "../Entity.js";
import Jump from "../traits/Jump.js";
import Go from "../traits/Go.js";
import { loadSpriteSheet } from "../loaders.js"

const SLOW_DRAG = 1/1500;
const FAST_DRAG = 1/5000;

/**
 * Function for creating Mario sprite
 * @returns loadMarioSprite()
 */
export function loadMario() {
    return loadSpriteSheet('mario')
    .then(createMarioFactory);
}

function createMarioFactory(sprite) {
    //similar to a mini API
    const runAnim = sprite.animations.get('run');
    function routeFrame(mario) {
        if (mario.jump.falling) {
            return 'jump';
        }

        if (mario.go.distance > 0) {
            if ((mario.vel.x > 0 && mario.go.dir < 0 )|| (mario.vel.x < 0 && mario.go.dir > 0)) {
                return 'break';
            }

            return runAnim(mario.go.distance);
        }

        return 'idle';
    }

    function setTurboState(turboOn) {
        this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
    }

    function drawMario(context) {
        sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0); //conditional expression as argument
    }

    return function createMario() {
        const mario = new Entity();
        mario.size.set(14, 16); // size needed for collision, otherwise mario "hangs from his head" from the buttom of the tile

        mario.addTrait(new Go());
        mario.addTrait(new Jump());
    
        mario.turbo = setTurboState;
        mario.draw = drawMario;

        mario.turbo(false);
    
        return mario;
    };
}
