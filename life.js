(function (window, undefined) {

	'use strict';

	var canvas, context;

	function extend(target, source) {
		var key;
		for (key in source) {
			if (source[key] !== undefined) {
				target[key] = source[key];
			}
		}
	}

	function $(id) {
		return document.getElementById.call(document, id);
	}

	function Cell() {
		this.alive = false;
		this.aliveNext = false;
		this.neighbours = {};
	}

	extend(Cell.prototype, {

		// Inspects the cell's neighbours to see what the next state should be
		nextState: function () {
			var n = 0,
				neighbour;
			for (neighbour in this.neighbours) {
				if (this.neighbours.hasOwnProperty(neighbour)) {

					// If a neighbour is alive, then increment livingNeighbours by 1, otherwise, by 0.
					n += +this.neighbours[neighbour].alive;
				}
			}
			if (this.alive) {

				// under-populated
				if (n < 2) {
					this.die();

				// well-populated
				} else if (n < 4) {
					this.live();

				// over-populated
				} else if (n >= 4) {
					this.die();
				}

			// reproduction
			} else if (n === 3) {
				this.live();

			// If nothing else, make sure the cell is dead
			} else {
				this.die();
			}
		},

		// Move to the prepared next state
		age: function () {
			this.alive = this.aliveNext;
		},

		// Make the cell dead in the next state
		die: function () {
			this.aliveNext = false;
		},

		// Make the cell alive in the next state
		live: function () {
			this.aliveNext = true;
		}
	});

	function Game() {
		this.height = 0;
		this.width = 0;
		this.cells = [];
		this.generation = 0;
		this.population = 0;
	}

	extend(Game.prototype, {

		// Create the field, all the cells and their neighbours
		init: function (width, height, wraps) {
			var x = 0,
				y = 0,
				self = this;
			this.height = height || 10;
			this.width = width || 10;
			this.wraps = wraps || false;

			// Create a 2D array: [ [], [], ... [], [] ]
			while (x < width) {
				if (!this.cells[x]) {
					this.cells[x] = [];
				}
				y = 0;
				while (y < height) {
					this.cells[x].push(new Cell());
					y += 1;
				}
				x += 1;
			}
			this.onCells(function (cell, x, y) {
				var cells = {
						n: self.getCell(x, y + 1),
						ne: self.getCell(x + 1, y + 1),
						e: self.getCell(x + 1, y),
						se: self.getCell(x + 1, y - 1),
						s: self.getCell(x, y - 1),
						sw: self.getCell(x - 1, y - 1),
						w: self.getCell(x - 1, y),
						nw: self.getCell(x - 1, y + 1)
					},
					key;
				for (key in cells) {
					if (!cells[key]) {
						delete cells[key];
					}
				}
				cell.neighbours = cells;
			});
		},

		// Iterate through cells in the x-direction first, and then in the y-direction.
		onCells: function (fn) {
			var w = this.width,
				h = this.height,
				x = 0,
				y = 0;
			while (y < h) {
				x = 0;
				while (x < w) {
					fn(this.cells[x][y], x, y);
					x += 1;
				}
				y += 1;
			}
		},

		// Return the cell at the given coordinates
		getCell: function (x, y) {
			var w = this.width,
				h = this.height;
			if (this.wraps) {
				if (x < 0) {
					x = w + (x % w);
				} else {
					x %= w;
				}
				if (y < 0) {
					y = h + (y % h);
				} else {
					y %= h;
				}
			}
			return this.cells[x] ? this.cells[x][y] : undefined;
		},

		// Progress the game by one generation
		tick: function () {
			var population = 0;
			this.generation += 1;
			this.onCells(function (cell) {
				cell.nextState();
			});
			this.onCells(function (cell) {
				cell.age();
				population += +cell.alive;
			});
			this.population = population;
		},

		// A very simple drawing function
		simpleDraw: function () {
			var display = $('display'),
				pre = display.getElementsByTagName('pre')[0] || document.createElement('pre'),
				w = this.width,
				h = this.height,
				string = '';
			this.onCells(function (cell, x, y) {
				if (x === 0 && y > 0) {
					string += '\n';
				}
				string += cell.alive ? '\u2588' : ' ';
			});
			pre.innerHTML = string;
			if (!pre.parentNode) {
				display.appendChild(pre);
			}
		},

		// Canvas initialisation
		canvasInit: function (width, height) {
			canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			context = canvas.getContext('2d');
			$('display').appendChild(canvas);
		},

		// Canvas drawing
		canvasDraw: function () {
			var wide = this.width,
				high = this.height,

				// Width of each cell in pixels
				w = canvas.width / wide,

				// Height of each cell in pixels
				h = canvas.height / high,

				// Loop variables
				i, j,

				// Reference to the game instance
				self = this;

			function drawCell(x, y) {
				var cell = self.getCell(x, y),
					alive = cell.alive;
				context.save();
				context.fillStyle = alive ? 'green' : 'brown';
				context.fillRect(0, 0, w, h);
				context.restore();
			}

			context.clearRect(0, 0, canvas.width, canvas.height);

			context.save();

			for (j = 0; j < high; j += 1) {
				context.save();
				for (i = 0; i < wide; i += 1) {
					drawCell(i, j);
					context.translate(w, 0);
				}
				context.restore();
				context.translate(0, h);
			}

			context.restore();
		},

		// Randomise the current state of all the cells
		randomise: function () {
			this.onCells(function (cell) {
				cell.alive = Math.random() > 0.5 ? true : false;
			});
		},

		// Reset the game's generation number. If clear is given, then also kill all the cells.
		reset: function (clear) {
			this.generation = 0;
			if (clear) {
				this.onCells(function (cell) {
					cell.alive = false;
				});
			}
		}
	});

	window.GameOfLife = Game;

})(this);
