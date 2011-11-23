function Cell() {
    this.alive = false;
    this.aliveNext = false;
    this.neighbours = {};
}

Cell.prototype.nextState = function () {
    var n = 0,
        neighbour;
    for (neighbour in this.neighbours) {
        if (this.neighbours.hasOwnProperty(neighbour)) {
            // If a neighbour is alive, then increment livingNeighbours by 1, otherwise, by 0.
            n += +this.neighbours[neighbour].alive;
        }
    }
    if (this.alive) {
        // under-populated
        if (n < 2) {
            this.die();
        // well-populated
        } else if (n < 4) {
            this.live();
        // over-populated
        } else if (n >= 4) {
            this.die();
        }
    // reproduction
    } else if (n === 3) {
        this.live();
    }
};

Cell.prototype.age = function () {
    this.alive = this.aliveNext;
};

Cell.prototype.die = function () {
    this.aliveNext = false;
};

Cell.prototype.live = function () {
    this.aliveNext = true;
};

function Game() {
    this.height = 0;
    this.width = 0;
    this.cells = [];
    this.generation = 0;
}

Game.prototype.init = function (width, height, wraps) {
    var x = 0,
        y = 0;
    this.height = height;
    this.width = width;
    // Create a 2D array: [ [], [], ... [], [] ]
    while (x < width) {
        if (!this.cells[x]) this.cells[x] = [];
        y = 0;
        while (y < height) {
            this.cells[x].push(new Cell);
            y += 1;
        }
        x += 1;
    }
};
