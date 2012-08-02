function randomSample() {
	return arguments[Math.floor(Math.random() * arguments.length)];
}

module( "Cells" );

test( "Basics", function () {
	var cell = new GameOfLife.Cell();
	ok( !cell.alive, "Cells start off dead" );

	cell.live();
	cell.age();
	ok( cell.alive, "Cells can come to life" );

	cell.die();
	cell.age();
	ok( !cell.alive, "Cells can die" );
});

test( "Life cycles", function () {
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

	var cell = new GameOfLife.Cell();
	makeNeighbours( cell, 3 );
	cell.nextState();
	cell.age();
	ok( cell.alive, "Cells can reproduce" );

	makeNeighbours( cell, randomSample( 0, 1 ) );
	cell.nextState();
	cell.age();
	ok( !cell.alive, "Cells die from under-population" );

	cell = new GameOfLife.Cell();
	cell.live();
	cell.age();
	makeNeighbours( cell, randomSample( 2, 3 ) );
	cell.nextState();
	cell.age();
	ok( cell.alive, "Cells stay alive with the right number of neighbours" );

	makeNeighbours( cell, randomSample( 4, 5, 6, 7, 8 ) );
	cell.nextState();
	cell.age();
	ok( !cell.alive, "Cells die from over-population" );
});
