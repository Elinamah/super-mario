export class Matrix {
    constructor() {
        this.grid = []; //we'll be checking Marios collision with all 4 tiles surrounding him
    }

    forEach(callback) {
        this.grid.forEach((column, x) => {
            column.forEach((value, y) => {
                callback(value, x, y);
            })
        })
    }

    get(x, y) {
        const col = this.grid[x];
        if (col) {
            return col[y];
        }
        return undefined;
    }

    set(x, y, value) {
        if (!this.grid[x]) { //If the colum at pos x doesn't have a corresponding pos y,
            this.grid[x] = []; // we create a new row for it 
        }

        this.grid[x][y] = value;
    }
}

window.Matrix = Matrix;

export class Vec2 {
    constructor(x, y) {
        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}