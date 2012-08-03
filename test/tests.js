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
	game.init( 10, 5 );

	var cells = [];
	game.onCells( function (cell) { cells.push(cell); } );
	cells = _.uniq( cells );
	equal( cells.length, 50, "Game can iterate through all cells" );

	ok( game.getCell( 0, 0 ) instanceof GameOfLife.Cell,
		"Can get an instance of a cell by its coords" );

	ok( !game.running, "Game isn't running initially" );
	deepEqual( game.population, 0, "Game has no live cells initially" );

	var generation = game.generation;
	game.tick();
	deepEqual( game.generation, generation + 1, "tick() increments the generation number" );
});

test( "Wrapped Game", function () {
	var game = new GameOfLife.Game();
	game.init( 10, 10 );

	ok( game.wraps, "Games wrap by default" );

	var cell = game.getCell( 9, 9 );
	deepEqual( countNeighbours( cell ), 8,
		"Corner cells have eight neighbours in a wrapped game" );

	cell = game.getCell( 5, 4 );
	deepEqual( countNeighbours( cell ), 8,
		"Central cells have eight neighbours" );

	cell = game.getCell( 9, 4 );
	deepEqual( countNeighbours( cell ), 8,
		"Edge cells have eight neighbours in an wrapped game" );

	ok( game.getCell( 4, -1 ) === game.getCell( 4, 9 ),
		"Top-most cell's northern neighbour is in last row, same column" );
	ok( game.getCell( 4, 10 ) === game.getCell( 4, 0 ),
		"Bottom-most cell's southern neighbour is in first row, same column" );
	ok( game.getCell( 10, 4 ) === game.getCell( 0, 4 ),
		"Right-most cell's eastern neighbour is in first column, same row" );
	ok( game.getCell( -1, 4 ) === game.getCell( 9, 4 ),
		"Left-most cell's western neighbour is in last column, same row" );
});

test( "Unwrapped Game", function () {
	var game = new GameOfLife.Game();
	game.init( 10, 10, false );

	ok( !game.wraps, "Games can be set to not wrap" );

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
