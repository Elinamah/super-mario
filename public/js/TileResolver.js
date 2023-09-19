//Convert Marios position in world to tile indices(index plural)
export default class TileResolver {
    constructor(matrix, tileSize = 16) {
        this.matrix = matrix;
        this.tileSize = tileSize;
    }

    toIndex(pos) {
        return Math.floor(pos / this.tileSize);
    }

    getByIndex(indexX, indexY) {
        const tile = this.matrix.get(indexX, indexY);
        if (tile) {
            return {
                tile, //in an object because more meta data will be added later
            };
        }
    }

    matchByPosition(posX, posY) {
        return this.getByIndex(
            this.toIndex(posX),
            this.toIndex(posY)
        );
    }
}