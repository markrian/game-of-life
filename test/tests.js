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

module( "Game" );

test( "Basics", function () {
	var game = new GameOfLife.Game();
	game.init( 10, 10 );

	var cellCount = 0;
	game.onCells( function (cell) { cellCount++; });
	equal( cellCount, 100, "Game creates the right number of cells" );

	ok( game.getCell( 0, 0 ) instanceof GameOfLife.Cell,
		"Can get an instance of a cell by its coords" );

	ok( !game.running, "Game isn't running initially" );
	deepEqual( game.population, 0, "Game has no live cells initially" );

	var generation = game.generation;
	game.tick();
	deepEqual( game.generation, generation + 1, "tick() increments the generation number" );
});

test( "Unwrapped Game", function () {
	function countNeighbours(cell) {
		var neighbours = 0;
		for (var neighbour in cell.neighbours) {
			if ( cell.neighbours[neighbour] instanceof GameOfLife.Cell ) {
				neighbours += 1;
			}
		}
		return neighbours;
	}

	var game = new GameOfLife.Game();
	game.init( 10, 10, false );

	var cell = game.getCell( 9, 9 );
	deepEqual( countNeighbours( cell ), 3,
		"Corner cells only have three neighbours in an unwrapped game" );

	cell = game.getCell( 5, 4 );
	deepEqual( countNeighbours( cell ), 8,
		"Central cells have eight neighbours" );

	cell = game.getCell( 9, 4 );
	deepEqual( countNeighbours( cell ), 5,
		"Edge cells have five neighbours in an unwrapped game" );
});
