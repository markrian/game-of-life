function Cell() {
    this.alive = false;
    this.aliveNext = false;
    this.neighbours = {};
}

Cell.prototype.getNextState = function () {
    var livingNeighbours = 0,
        neighbour;
    for (neighbour in this.neighbours) {
        if (this.neighbours.hasOwnProperty(neighbour)) {
            // If a neighbour is alive, then increment livingNeighbours by 1, otherwise, by 0.
            livingNeighbours += +this.neighbours[neighbour].alive;
        }
    }
};

Cell.prototype.age = function () {
    this.alive = this.aliveNext;
}
