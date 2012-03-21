(function (window, undefined) {

	'use strict';

	var canvas, context, simulation, running;

	function extend(target, source) {
		var key;
		for (key in source) {
			if (source[key] !== undefined) {
				target[key] = source[key];
			}
		}
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

	// Main constructor for the game of life
	function Game(options) {

		// Default properties for the game object
		this.height = 25;
		this.width = 25;
		this.angle = 0;
		this.cells = [];
		this.generation = 0;
		this.population = 0;
		this.wraps = true;
		this.rate = 5;
	}

	extend(Game.prototype, {

		// Create the field, all the cells and their neighbours
		init: function (width, height, wraps) {
			var x = 0,
				y = 0,
				self = this;

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

		// Canvas initialisation
		canvasInit: function (width, height) {
			canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			context = canvas.getContext('2d');
			this.element.appendChild(canvas);
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
				context.fillStyle = alive ? 'green' : 'brown';
				context.fillRect(0, 0, w, h);
			}

			context.clearRect(0, 0, canvas.width, canvas.height);

			context.save();

			// Rotate the whole canvas around the centre
			context.translate(canvas.width / 2, canvas.height / 2);
			context.rotate(this.angle);
			context.translate(-w * wide / 2, -h * high / 2);

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

		// Start a simulation
		run: function (generationsPerSecond) {
			var self = this,
				dt = 1000 / (generationsPerSecond || this.rate);
			if (running) {
				this.pause();
				this.run(generationsPerSecond);
				return;
			} else {
				simulation = setInterval(function () {
					self.canvasDraw();
					self.tick();
				}, dt);
				running = true;
			}
		},

		// Pause a running simuation
		pause: function () {
			if (!running) {
				return;
			} else {
				clearInterval(simulation);
				running = false;
			}
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

	window.GameOfLife = function (options) {

		if (!options || !options.element) {
			throw "You must specify the element in which to display the game.";
		}

		var game = new Game();
		extend(game, options);
		game.init(game.width, game.height, game.wraps);
		game.randomise();
		game.canvasInit(250, 250);
		game.run(game.rate);
		return game;
	};

})(this);
