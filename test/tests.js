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

	function makeNeighbours(cell, number) {
		var directions = "n ne e se s sw w nw".split( " " ),
			neighbour;
		while (number--) {
			neighbour = new Cell();
			neighbour.live();
			neighbour.age();
			cell.neighbours[directions[number]] = neighbour;
		}
	}
});
