class SpaceObject {
	constructor(x, y, spdX, spdY) {
		this.x = x || 0;
		this.y = y || 0;
		this.speedX = spdX || 0;
		this.speedY = spdY || 0;
	}

	updatePosition() {
		this.x += this.speedX;
		this.y += this.speedY;
	}

	isNear(o) {
		return Math.abs(this.x - o.x) < SpaceObject.VISIBLE_DISTANCE && Math.abs(this.y - o.y) < SpaceObject.VISIBLE_DISTANCE;
	}

	onRadar(o) {
		return Math.abs(this.x - o.x) < SpaceObject.RADAR_DISTANCE && Math.abs(this.y - o.y) < SpaceObject.RADAR_DISTANCE;
	}

	getDistance(o) {
		return Math.sqrt( this.getSqrDistance(o) );
	}

	getSqrDistance(o) {
		const dx = this.x - o.x, dy = this.y - o.y;
		return dx * dx + dy * dy;
	}

	getAngle(o) {
		return Math.atan2(o.y - this.y, o.x - this.x);
	}

	get speed() {
		return Math.sqrt(this.sqrSpeed);
	}

	get sqrSpeed() {
		return this.speedX * this.speedX + this.speedY * this.speedY;
	}

	get direction() {
		return Math.atan2(this.speedY, this.speedX);
	}

	get visible() {
		for (var i in Player.list) {
			if (GameBody.list[i].onRadar(this)) {
				return true;
			}
		}

		return false;
	}

}
SpaceObject.VISIBLE_DISTANCE = 1500;
SpaceObject.RADAR_DISTANCE = 3000;
