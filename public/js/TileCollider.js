import TileResolver from "./TileResolver.js";

export default class TileCollider {
    constructor(tileMatrix) {
        this.tiles = new TileResolver(tileMatrix);
    }

    checkX(entity) {
        let x;
        if (entity.vel.x > 0) {
            x = entity.pos.x + entity.size.x;
        } else if (entity.vel.x < 0) {
            x = entity.pos.x;
        } else {
            return;
        }

        const matches = this.tiles.searchByRange(
            x, x,
            entity.pos.y, entity.pos.y + entity.size.y);

        matches.forEach(match => {

            //Ignore and return if match isn't ground
            if (match.tile.type !== 'ground') {
                return;
            }

            //entity.size.x needed for anchor point be marios feet, not his head
            if (entity.vel.x > 0) { //If the entity is moving downwards
                if (entity.pos.x + entity.size.x > match.x1) { //if entity has passed through ground tile
                    entity.pos.x = match.x1 - entity.size.x; //then put entity ontop of ground tile
                    entity.vel.x = 0; //stops the entity from falling
                }
            }

            else if (entity.vel.x < 0) { //If the entity is moving downwards
                if (entity.pos.x < match.x2) { //if entity has passed through ground tile
                    entity.pos.x = match.x2; //then put entity ontop of ground tile
                    entity.vel.x = 0; //stops the entity from falling
                }
            }
        });
    }

    /**
     * Function for not falling through floor
     * @param {*} entity 
     * @returns 
     */
    checkY(entity) {
        let y;
        if (entity.vel.y > 0) {
            y = entity.pos.y + entity.size.y;
        } else if (entity.vel.y < 0) {
            y = entity.pos.y;
        } else {
            return;
        }

        const matches = this.tiles.searchByRange(
            entity.pos.x, entity.pos.x + entity.size.x,
            y, y);

        matches.forEach(match => {

            //Ignore and return if match isn't ground
            if (match.tile.type !== 'ground') {
                return;
            }

            //entity.size.y needed for anchor point be marios feet, not his head
            if (entity.vel.y > 0) { //If the entity is moving downwards
                if (entity.pos.y + entity.size.y > match.y1) { //if entity has passed through ground tile
                    entity.pos.y = match.y1 - entity.size.y; //then put entity ontop of ground tile
                    entity.vel.y = 0; //stops the entity from falling
                }
            }

            else if (entity.vel.y < 0) { //If the entity is moving downwards
                if (entity.pos.y < match.y2) { //if entity has passed through ground tile
                    entity.pos.y = match.y2; //then put entity ontop of ground tile
                    entity.vel.y = 0; //stops the entity from falling
                }
            }
        });
    }

    test(entity) {
        this.checkY(entity);
    }
}