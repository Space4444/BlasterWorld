class Engine {
	constructor(ID, maxSpd, maxAccel, angleAccel) {
		this.ID = ID;
		this.maxSpeed = maxSpd;
		this.maxAccel = maxAccel;
		this.angleAccel = angleAccel;
	}

	equip(ship) {
		ship.maxSpeed += this.maxSpeed;
		ship.maxAccel += this.maxAccel;
		ship.angleAccel += this.angleAccel;
	}

	unequip(ship) {
		ship.maxSpeed -= this.maxSpeed;
		ship.maxAccel -= this.maxAccel;
		ship.angleAccel -= this.angleAccel;
	}

	static check(ID) {
		if (ID in Engine.catalog) {
			return;
		}
		
		Engine.catalog[ID] = new Engine(ID, ...Object.values( Item.getStats(ID) ) );
	}

	static equip(ship, ID) {
		Engine.check(ID);
		Engine.catalog[ID].equip(ship);
	}

	static unequip(ship, ID) {
		Engine.catalog[ID].unequip(ship);
	}

	static draw(seed, type, level, ctx, callback) {
		const w = ctx.canvas.width, h = ctx.canvas.height;
		const rand = new Random(seed);

		ctx.translate(0.5 * w, 0.5 * h);

		Engine.drawBase(rand, level, ctx, w, h);

		callback(ctx);
	}

	static drawBase(rand, level, ctx, w, h) {
		ctx.lineWidth = 2;
		w -= ctx.lineWidth;
		h -= ctx.lineWidth;

		const points = [];

		const maxWidth = w * 0.3;
		const sharpness = w * 0.1;
		const minInterval = 7;
		const maxInterval = 7;
		const minHalhWidth = 0.2 * w;
		const maxHalhWidth = 0.4 * w;
		const halfHeight1 = rand.next(h * 0.3, h * 0.4);
		const halfHeight2 = rand.next(halfHeight1, h * 0.5);
		var blockHeights = [1,3,2,4,2,4,1];
		var pointCount;

		//generate point coordinates of the base
		points[0] = {
			x: rand.next(minHalhWidth * 0.5, minHalhWidth),
			y: -halfHeight2
		};
		for (var i = 1; ; i++) {
			var x;
			do {console.log(1);
				x = points[i - 1].x + rand.next(-sharpness, sharpness);
			} while (x < minHalhWidth || x > maxHalhWidth);

			points[i] = {
				x,
				y: points[i - 1].y + rand.next(minInterval, minInterval)
			};

			if (points[i].y > halfHeight1) {
				points[i].y = halfHeight1;
				points[i + 1] = {
					x: rand.next(minHalhWidth * 0.5, minHalhWidth),
					y: halfHeight2
				}
				pointCount = i + 2;
				break;
			}
		}

		const colors = [];
		for (var i = 0; i < 7; i++) {
			colors[i] = MovingShotWpn.gradient(ctx, maxWidth, rand);
		}

		//draw
		for (var i = 0, k = 0; i < pointCount; i += blockHeights[k], k++) {
			Engine.drawBlock(rand, ctx, i, blockHeights[k], points, pointCount - 1, colors[(k * 2) % 4], colors[(1 + k * 2) % 4], k % 2 ? 0 : 10);
		}
		Engine.drawBlock(rand, ctx, pointCount - 2, 1, points, pointCount, colors[4], colors[5], 10);
	}

	static drawBlock(rand, ctx, startPoint, blockHeight, points, pointCount, fill, stroke, lineCount) {
		ctx.beginPath();

		//right side
		for (var j = 0; j <= blockHeight && j + startPoint < pointCount; j++) {
			ctx.lineTo(points[j + startPoint].x, points[j + startPoint].y);
		}
		//left side
		for (j--; j >= 0; j--) {
			ctx.lineTo(-points[j + startPoint].x, points[j + startPoint].y);
		}

		ctx.fillStyle = fill;
		ctx.strokeStyle = stroke;

		ctx.closePath();
		ctx.fill();
		ctx.stroke();


		//lines

		ctx.beginPath();
		for (var step = Math.PI / (1 + lineCount), angle = step; angle < Math.PI; angle += step) {
			ctx.moveTo(points[startPoint].x * Math.cos(angle), points[startPoint].y);

			for (var j = 1; j <= blockHeight && j + startPoint < pointCount; j++) {
				ctx.lineTo(points[j + startPoint].x * Math.cos(angle), points[j + startPoint].y);
			}
		}

		ctx.strokeStyle = '#' + (rand.next().toString(16) + "000000").substr(2,6);
		ctx.stroke();
	}

	static gradient(ctx, maxWidth, rand) {
		const grd = ctx.createLinearGradient(-maxWidth, 0, maxWidth, 0);
		const col1 = '#' + (rand.next().toString(16) + "000000").substr(2,6);
		const col2 = '#' + (rand.next().toString(16) + "000000").substr(2,6);
		grd.addColorStop(0, col1);
		grd.addColorStop(0.5, col2);
		grd.addColorStop(1, col1);

		return grd;
	}

}
Engine.catalog = {};

Engine.DEFAULTS = Item.getStats(3);

Engine.default = new Engine(3, ...Object.values(Engine.DEFAULTS) );

Engine.catalog[3] = Engine.default;
