class Asteroid extends GameBody {
	constructor(ID, controller, x, y, imageID) {
		const r = Math.random() * Asteroid.radiusRange + Asteroid.MIN_RADIUS;

		controller.level = 1 + ( (r - Asteroid.MIN_RADIUS) * 0.05) | 0;

		const r3 = r * r * r;
		const maxHP = Asteroid.strength * r3;
		const mass = Asteroid.density * r3;
		const spdX = Asteroid.maxSpeed * (Math.random() * 2 - 1);
		const spdY = Asteroid.maxSpeed * (Math.random() * 2 - 1);
		const angSpd = Asteroid.maxAngleSpeed * (Math.random() * 2 - 1);

		super(ID, controller, x, y, r, maxHP, mass, spdX, spdY, angSpd);

		this.imageID = imageID;
	}

	updateSyncInfo() {
		Object.assign(this.syncInfo, {
			'ID': this.ID,
			'x': this.x,
			'y': this.y,
			'rotation': this.rotation,
			'speedX': this.speedX,
			'speedY': this.speedY,
			'HP': this.HP
		});
	}

	get items() {
		const r = Math.random();

		if (r > 0.75) {
			return [];
		}
		return [];
		/*if (r > 0.5) {
			return [0];
		} else if (r > 0.25) {
			return [1];
		} else {
			return [0, 1];
		}*/
	}

	get firstInfo() {
		return {
			'x': this.x,
			'y': this.y,
			'rotation': this.rotation,
			'radius': this.radius,
			'imageID': this.imageID,
			'speedX': this.speedX,
			'speedY': this.speedY,
			'angleSpeed': this.angleSpeed
		};
	}

	get info () {
		return {
			'x': this.x,
			'y': this.y,
			'rotation': this.rotation,
			'HP': this.HP,
			'radius': this.radius,
			'imageID': this.imageID,
			'speedX': this.speedX,
			'speedY': this.speedY,
			'angleSpeed': this.angleSpeed
		};
	}

}
Asteroid.strength = 0.00024;
Asteroid.density = 0.004;
Asteroid.maxSpeed = 10;
Asteroid.maxAngleSpeed = 0.05;

Asteroid.MIN_ORBIT_RADIUS = 10900;
Asteroid.MAX_ORBIT_RADIUS = 14200;
Asteroid.sqrMinR = Asteroid.MIN_ORBIT_RADIUS ** 2;
Asteroid.sqrMaxR = Asteroid.MAX_ORBIT_RADIUS ** 2;

Asteroid.MIN_RADIUS = 20;
Asteroid.MAX_RADIUS = 120;
Asteroid.radiusRange = Asteroid.MAX_RADIUS - Asteroid.MIN_RADIUS;
