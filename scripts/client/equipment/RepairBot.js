class RepairBot extends Other {
	constructor(ID, repairSpeed) {
		super(ID);

		this.repairSpeed = repairSpeed;
	}

	static draw(seed, level, ctx, callback) {
		const w = ctx.canvas.width, h = ctx.canvas.height;
		const rand = new Random(seed);

		ctx.translate(0.5 * w, 0.5 * h);

		RepairBot.drawBase(rand, level, ctx, w, h);
		RepairBot.drawClaws(rand, level, ctx, w, h);

		callback(ctx);
	}

	static drawBase(rand, level, ctx, w, h) {
		ctx.lineWidth = 2;
		w -= ctx.lineWidth;
		h -= ctx.lineWidth;

		const points = [];

		const maxWidth = w * 0.3;
		const sharpness = 15;
		const minInterval = 4;
		const maxInterval = 7;
		const minHalhHeight = 0.15 * h;
		const maxHalhHeight = 0.3 * h;
		var pointCount;

		//generate point coordinates of the top of the base
		points[0] = {
			x: 0,
			y: rand.next(-maxHalhHeight, -minHalhHeight)
		};
		for (var i = 1; ; i++) {
			var y;
			do {console.log(100);
				y = points[i - 1].y + rand.next(-sharpness, sharpness);
			} while (y < -maxHalhHeight || y > -minHalhHeight);

			points[i] = {
				x: points[i - 1].x + rand.next(minInterval, maxInterval),
				y
			};

			if (points[i].x > maxWidth) {
				points[i].x = maxWidth;
				points[i].y = 0;
				pointCount = i + 1;
				break;
			}
		}

		//generate point coordinates of the bottom of the base
		const finalPoint = {
			x: 0,
			y: rand.next(minHalhHeight, maxHalhHeight)
		}
		points[pointCount] = {
			x: points[pointCount - 1].x + rand.next(-maxInterval, maxInterval),
			y: rand.next(minHalhHeight, maxHalhHeight)
		};
		for (var i = pointCount + 1; ; i++) {
			var y;
			do {console.log(200);
				y = points[i - 1].y + rand.next(-sharpness, sharpness);
			} while (y < minHalhHeight || y > maxHalhHeight);

			points[i] = {
				x: points[i - 1].x - rand.next(minInterval, maxInterval),
				y
			};

			if (points[i].x < 0) {
				points[i] = finalPoint;
				pointCount = i + 1;
				break;
			}
		}

		//draw base
		
		ctx.beginPath();

		ctx.moveTo(points[0].x, points[0].y);
		//right side
		for (var i = 0; i < pointCount; i++) {
			ctx.lineTo(points[i].x, points[i].y);
		}
		//left side
		for (var i = pointCount - 1; i >= 0; i--) {
			ctx.lineTo(-points[i].x, points[i].y);
		}

		ctx.fillStyle = RepairBot.gradient(ctx, maxWidth, rand);
		ctx.strokeStyle = RepairBot.gradient(ctx, maxWidth, rand);

		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	static drawClaws(rand, level, ctx, w, h) {
		ctx.lineWidth = rand.next(5, 8);
		w -= ctx.lineWidth;
		h -= ctx.lineWidth;

		const clawCount = rand.next(2, 5) | 0;
		const color = RepairBot.gradient(ctx, w * 0.5, rand);

		ctx.lineCap = 'round';

		for (var i = 0; i < clawCount; i++) {
			const k = i / (clawCount - 1);
			const x = -w * 0.2 + k * w * 0.4;
			const y = w * 0.2 * (1 - Math.abs(k - 0.5));
			RepairBot.drawClaw(rand, level, ctx, x, y, k, color);
		}
	}

	static drawClaw(rand, level, ctx, x, y, k, color) {
		const joints = [];
		const jointCount = 3;
		const minJointLength = 15;
		const maxJointLength = 20;
		const sign = Math.sign(0.5 - k);

		joints[0] = {x, y};

		for (var i = 1, jointAngle; i < jointCount; i++) {
			const k1 = (i - 1) / (jointCount - 1);
			const jointLength = rand.next(minJointLength, maxJointLength);
			jointAngle = 0.5 - k - 2 * k1 * sign + Math.HALF_PI;

			joints[i] = {
				x: joints[i - 1].x + jointLength * Math.cos(jointAngle),
				y: joints[i - 1].y - jointLength * Math.sin(jointAngle)
			}
		}

		ctx.beginPath();

		ctx.moveTo(joints[0].x, joints[0].y);

		for (var i = 0; i < jointCount; i++) {
			ctx.lineTo(joints[i].x, joints[i].y);
		}

		ctx.strokeStyle = color;

		ctx.stroke();

		ctx.beginPath();
		ctx.arc(joints[jointCount - 1].x, joints[jointCount - 1].y - 8, 8, -Math.PI * 0.25, Math.PI * 1.25);
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
RepairBot.DEFAULTS = Item.getStats(4);

Other.default = new RepairBot(4, ...Object.values(RepairBot.DEFAULTS) );

Other.catalog[4] = Other.default;
