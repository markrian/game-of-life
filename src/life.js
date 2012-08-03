(function (window, undefined) {

	'use strict';

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
		this.high = 20;
		this.wide = 20;
		this.size = this.wide * this.high;
		this.angle = 0;
		this.cells = [];
		this.generation = 0;
		this.population = 0;
		this.wraps = true;
		this.rate = 10;
	}

	extend(Game.prototype, {

		// Create the field, all the cells and their neighbours
		init: function (wide, high, wraps) {
			var x = 0,
				y = 0,
				self = this;

			this.wide = wide;
			this.high = high;
			this.wraps = wraps;

			// Create a 2D array: [ [], [], ... [], [] ]
			while (x < wide) {
				if (!this.cells[x]) {
					this.cells[x] = [];
				}
				y = 0;
				while (y < high) {
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
			var w = this.wide,
				h = this.high,
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
			var w = this.wide,
				h = this.high;
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
			this.canvas = document.createElement('canvas');
			this.canvas.width = width;
			this.canvas.height = height;
			this.context = this.canvas.getContext('2d');
			this.element.appendChild(this.canvas);
		},

		// Canvas drawing
		canvasDraw: function () {
			var wide = this.wide,
				high = this.high,

				// Width of each cell in pixels
				w = Math.ceil(this.canvas.width / wide),

				// Height of each cell in pixels
				h = Math.ceil(this.canvas.height / high),

				// Loop variables
				i, j,

				// Reference to the game instance
				self = this;

			function drawCell(x, y) {
				var cell = self.getCell(x, y),
					alive = cell.alive;
				self.context.fillStyle = alive ? 'green' : 'brown';
				self.context.fillRect(0, 0, w, h);
			}

			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			this.context.save();

			// Rotate the whole canvas around the centre
			this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
			this.context.rotate(this.angle);
			this.context.translate(-w * wide / 2, -h * high / 2);

			for (j = 0; j < high; j += 1) {
				this.context.save();
				for (i = 0; i < wide; i += 1) {
					drawCell(i, j);
					this.context.translate(w, 0);
				}
				this.context.restore();
				this.context.translate(0, h);
			}

			this.context.restore();
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
			if (this.running) {
				this.pause();
				this.run(generationsPerSecond);
				return;
			} else {
				this.simulation = setInterval(function () {
					self.canvasDraw();
					self.tick();
				}, dt);
				this.running = true;
			}
		},

		// Pause a running simuation
		pause: function () {
			if (!this.running) {
				return;
			} else {
				clearInterval(this.simulation);
				this.running = false;
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

	var GameOfLife = window.GameOfLife = function (options) {

		if (!options || !options.element) {
			throw "You must specify the element in which to display the game.";
		}

		var game = new Game(),
			width = options.element.offsetWidth || 200,
			height = options.element.offsetHeight || 150;

		game.high = Math.ceil(Math.sqrt(game.size * height / width));
		game.wide = Math.ceil(game.high * width / height);

		extend(game, options);
		game.init(game.wide, game.high, game.wraps);
		game.randomise();
		game.canvasInit(width, height);
		game.run(game.rate);
		return game;
	};

	GameOfLife.Cell = Cell;
	GameOfLife.Game = Game;

})(this);
