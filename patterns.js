(function (window, undefined) {

	'use strict';

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

	Game.prototype.pattern = function (pattern, x, y, padding) {
		var i = 0, // relative x-position in the field
			j = 0, // relative y-position in the field
			column = 0, // current column being processed in the pattern
			line = 0, // current line being processed in the pattern
			w = pattern[0].length,
			h = pattern.length,
			W = w + 2 * padding,
			H = h + 2 * padding;

		x = x || 0;
		y = y || 0;
		padding = padding || 0;

		// Top padding
		while (j < padding) {
			i = 0;
			while (i < W) {
				this.getCell(x + i, y + j).alive = false;
				i += 1;
			}
			j += 1;
		}

		// Actual pattern, plus left and right padding
		while (j < h + padding) {
			i = 0;
			column = 0;
			while (i < W) {

				// Do the left and right padding if we're on the edges; otherwise, apply the pattern
				if (i < padding || i >= w + padding) {
					this.getCell(x + i, y + j).alive = false;
				} else {
					this.getCell(x + i, y + j).alive = !!pattern[line][column];
					column += 1;
				}
				i += 1;
			}
			j += 1;
			line += 1;
		}

		// Bottom padding
		while (j < H) {
			i = 0;
			while (i < W) {
				this.getCell(x + i, y + j).alive = false;
				i += 1;
			}
			j += 1;
		}
	};

})(window);
