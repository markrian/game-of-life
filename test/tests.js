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
	var cell;

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

	cell = TestCell({ neighbours: 3 });
	ok( cell.alive, "Cells can reproduce" );

	cell = TestCell({ alive: true, neighbours: randomSample( 0, 1 ) });
	ok( !cell.alive, "Cells die from under-population" );

	cell = TestCell({ alive: true, neighbours: randomSample( 2, 3 ) });
	ok( cell.alive, "Cells stay alive with the right number of neighbours" );

	cell = TestCell({ alive: true, neighbours: randomSample( 4, 5, 6, 7, 8 ) });
	ok( !cell.alive, "Cells die from over-population" );
});
