(function (window, undefined) {

	var Game = window.GameOfLife;

	Game.patterns = {
		glider: [
			[0, 1, 0],
			[0, 0, 1],
			[1, 1, 1]
		],

		'f-pentomino': [
			[0, 1, 1],
			[1, 1, 0],
			[0, 1, 0]
		],

		'diehard': [
			[0, 0, 0, 0, 0, 0, 1, 0],
			[1, 1, 0, 0, 0, 0, 0, 0],
			[0, 1, 0, 0, 0, 1, 1, 1]
		]
	};
})(window);
