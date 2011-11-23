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
        if (n < 2) {
            this.aliveNext = false;
        } else if (n < 4) {
            this.aliveNext = true;
        } else if (n >= 4) {
            this.aliveNext = false;
        }
    } else if (n == 3) {
        this.aliveNext = true;
    }
};

Cell.prototype.age = function () {
    this.alive = this.aliveNext;
}
