class MovingShotWpn extends Weapon {
	constructor(ID, texture, dmg, fireRate, bullSpd, bullLifeTime) {
		super(ID, dmg, fireRate);

		this.bulletTexture = texture;
		this.bulletSpeed = bullSpd;
		this.bulletLifeTime = bullLifeTime;

		this.bullExplosion = new Explosion(images.particle, Explosion.getBulletSettings(ID) );
	}

	fire(ship, index) {
		const info = ship.weaponInfo[index];

		if (info.timer < this.fireRate) {
			return;
		}

		const sin = Math.sin(ship.rotation);
		const cos = Math.cos(ship.rotation);
		const dx = info.x * cos - info.y * sin;
		const dy = info.x * sin + info.y * cos;

		new Bullet(this.bulletTexture, {
			ship: ship,
			explosion: this.bullExplosion,
			damage: this.damage,
			ID: ship.bulletID++,
			index,
			x: ship.x + dx,
			y: ship.y + dy,
			currX: ship.x + dx,
			currY: ship.y + dy,
			trueX: ship.trueX + dx,
			trueY: ship.trueY + dy,
			speedX: ship.trueSpeedX + this.bulletSpeed * Math.cos(ship.trueRotation),
			speedY: ship.trueSpeedY + this.bulletSpeed * Math.sin(ship.trueRotation),
			lifeTime: this.bulletLifeTime,
			rotation: ship.rotation
		});

		info.timer = 0;
	}

	delBulletImage() {
		
	}

	static draw(seed, level, ctx, callback) {
		const w = ctx.canvas.width, h = ctx.canvas.height;
		const rand = new Random(seed);

		ctx.translate(0.5 * w, 0.5 * h);

		const baseLine = rand.next(w * 0.2, w * 0.3);
		MovingShotWpn.drawBarrel(rand, level, ctx, w, h, baseLine);
		MovingShotWpn.drawBase(rand, level, ctx, w, h, baseLine);

		callback(ctx);
	}

	static drawBarrel(rand, level, ctx, w, h, baseLine) {
		ctx.lineWidth = 2;
		w -= ctx.lineWidth;
		h -= ctx.lineWidth;

		const points = [];

		const maxWidth = w * 0.25;
		const sharpness = 25;
		const minInterval = 2;
		const maxInterval = 7;
		const halfBarrelWidth = rand.next(1, 4);
		var pointCount;

		//fill the array of point coordinates of the top of the barrel
		points[0] = {
			x: 0,
			y: -0.5 * h
		};
		points[1] = {
			x: points[0].x + halfBarrelWidth,
			y: -0.5 * h
		};
		for (var i = 2; ; i++) {
			var y;
			do {console.log(0);
				y = points[i - 1].y + rand.next(-sharpness, sharpness);
			} while (y > baseLine || y < -0.5 * h);

			points[i] = {
				x: points[i - 1].x + rand.next(minInterval, maxInterval),
				y
			};

			if (points[i].x > maxWidth) {
				points[i].x = maxWidth;
				points[i + 1] = {
					x: maxWidth,
					y: baseLine
				}
				pointCount = i + 2;
				break;
			}
		}

		//draw barrel
		
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

		//create random gradient
		ctx.fillStyle = MovingShotWpn.gradient(ctx, maxWidth, rand);
		ctx.strokeStyle = MovingShotWpn.gradient(ctx, maxWidth, rand);

		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		//center part of the barrel
		ctx.fillStyle = MovingShotWpn.gradient(ctx, points[1].x, rand);
		ctx.strokeStyle = MovingShotWpn.gradient(ctx, points[1].x, rand);
		ctx.beginPath();

		ctx.rect(-points[1].x, points[1].y, 2 * points[1].x, baseLine - points[1].y);

		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	static drawBase(rand, level, ctx, w, h, baseLine) {
		ctx.lineWidth = 2;
		w -= ctx.lineWidth;
		h -= ctx.lineWidth;

		const points = [];

		const maxWidth = w * 0.3;
		const sharpness = 10;
		const minInterval = 4;
		const maxInterval = 7;
		const minHalhHeight = h * 0.05;
		const maxHalhHeight = 0.5 * h - baseLine;
		var pointCount;

		//generate point coordinates of the top of the base
		points[0] = {
			x: 0,
			y: baseLine - rand.next(minHalhHeight, maxHalhHeight)
		};
		for (var i = 1; ; i++) {
			var y;
			do {console.log(10);
				y = points[i - 1].y + rand.next(-sharpness, sharpness);
			} while (y > baseLine - minHalhHeight || y < baseLine - maxHalhHeight);

			points[i] = {
				x: points[i - 1].x + rand.next(minInterval, maxInterval),
				y
			};

			if (points[i].x > maxWidth) {
				points[i].x = maxWidth;
				points[i].y = baseLine;
				pointCount = i + 1;
				break;
			}
		}

		//generate point coordinates of the bottom of the base
		const finalPoint = {
			x: 0,
			y: baseLine + rand.next(minHalhHeight, maxHalhHeight)
		}
		for (var i = pointCount; ; i++) {
			var y;
			do {console.log(20);
				y = points[i - 1].y + rand.next(-sharpness, sharpness);
			} while (y < baseLine + minHalhHeight || y > baseLine + maxHalhHeight);

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

		ctx.fillStyle = MovingShotWpn.gradient(ctx, maxWidth, rand);
		ctx.strokeStyle = MovingShotWpn.gradient(ctx, maxWidth, rand);

		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	static gradient(ctx, maxWidth, rand) {
		const grd = ctx.createLinearGradient(-maxWidth, 0, maxWidth, 0);
		const col1 = '#' + (rand.next().toString(16) + "000000").substr(2, 6);
		const col2 = '#' + (rand.next().toString(16) + "000000").substr(2, 6);
		grd.addColorStop(0, col1);
		grd.addColorStop(0.5, col2);
		grd.addColorStop(1, col1);

		return grd;
	}

}
