import TileResolver from "./TileResolver.js";
import { Sides } from './Entity.js'

export default class TileCollider {
    constructor(tileMatrix) {
        this.tiles = new TileResolver(tileMatrix);
    }

    checkX(entity) {
        let x;
        if (entity.vel.x > 0) {
            x = entity.bounds.right;
        } else if (entity.vel.x < 0) {
            x = entity.bounds.left;
        } else {
            return;
        }

        const matches = this.tiles.searchByRange(
            x, x,
            entity.bounds.top, entity.bounds.bottom);

        matches.forEach(match => {

            //Ignore and return if match isn't ground
            if (match.tile.type !== 'ground') {
                return;
            }

            //entity.size.x needed for anchor point be marios feet, not his head
            if (entity.vel.x > 0) { //If the entity is moving downwards
                if (entity.bounds.right > match.x1) { //if entity has passed through ground tile
                    entity.bounds.right = match.x1; //then put entity ontop of ground tile
                    entity.vel.x = 0; //stops the entity from falling

                    entity.obstruct(Sides.RIGHT);
                }
            }

            else if (entity.vel.x < 0) { //If the entity is moving downwards
                if (entity.bounds.left < match.x2) { //if entity has passed through ground tile
                    entity.bounds.left = match.x2; //then put entity ontop of ground tile
                    entity.vel.x = 0; //stops the entity from falling

                    entity.obstruct(Sides.LEFT);
                }
            }
        });
    }

    checkY(entity) {
        let y;
        if (entity.vel.y > 0) {
            y = entity.bounds.bottom;
        } else if (entity.vel.y < 0) {
            y = entity.bounds.top;
        } else {
            return;
        }

        const matches = this.tiles.searchByRange(
            entity.bounds.left, entity.bounds.right,
            y, y);

        matches.forEach(match => {

            //Ignore and return if match isn't ground
            if (match.tile.type !== 'ground') {
                return;
            }

            //entity.size.y needed for anchor point be marios feet, not his head
            if (entity.vel.y > 0) { //If the entity is moving downwards
                if (entity.bounds.bottom > match.y1) { //if entity has passed through ground tile
                    entity.bounds.bottom = match.y1; //then put entity ontop of ground tile
                    entity.vel.y = 0; //stops the entity from falling

                    entity.obstruct(Sides.BOTTOM);
                }
            }

            else if (entity.vel.y < 0) { //If the entity is moving downwards
                if (entity.bounds.top < match.y2) { //if entity has passed through ground tile
                    entity.bounds.top = match.y2; //then put entity ontop of ground tile
                    entity.vel.y = 0; //stops the entity from falling

                    entity.obstruct(Sides.TOP);
                }
            }
        });
    }
}