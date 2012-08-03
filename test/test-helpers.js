function randomSample() {
	return arguments[Math.floor(Math.random() * arguments.length)];
}

function makeNeighbours(cell, number) {
	var directions = "n ne e se s sw w nw".split( " " ),
		neighbours = {},
		neighbour;
	while (number--) {
		neighbour = new GameOfLife.Cell();
		neighbour.live();
		neighbour.age();
		neighbours[directions[number]] = neighbour;
	}
	cell.neighbours = neighbours;
}

function TestCell( options ) {
	var cell = new GameOfLife.Cell();
	if ( options.alive ) {
		cell.live();
		cell.age();
	}

	if ( options.neighbours ) {
		makeNeighbours( cell, options.neighbours );
	}

	cell.nextState();
	cell.age();

	return cell;
}

function countNeighbours(cell) {
	var neighbours = 0;
	for (var neighbour in cell.neighbours) {
		if ( cell.neighbours[neighbour] instanceof GameOfLife.Cell ) {
			neighbours += 1;
		}
	}
	return neighbours;
}
