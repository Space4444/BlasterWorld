class GameBody extends SpaceObject {
	constructor(ID, controller, x, y, radius, maxHP, mass, spdX, spdY, angSpd, args={}) {
		super(x, y, spdX, spdY);

		Object.assign(this, {
			ID: ID,
			controller: controller,
			radius: radius,
			maxHP: maxHP,
			HP: maxHP,
			mass: mass,
			rotation: 0,
			angleSpeed: angSpd || 0,
			syncInfo: {}
		}, args);

		controller.body = this;

		GameBody.list[ID] = this;

		this.checkDistanceToStar();

		this.updateSyncInfo();
		Player.addToVisibleLists(this);
	}

	update25() {
		this.updatePosition();
		this.updateRotation();
	}

	update15() {
		this.updateSyncInfo();
	}

	update2() {
		this.checkDistanceToStar();
	}

	update1() {}
	update_20() {}

	updateRotation() {
		this.rotation += this.angleSpeed;
		this.rotation = Math.ang(this.rotation);
	}

	//onPlayerCome() {}
	//onPlayerRetreat() {}
	interactWithPlayer(player) {}
	updateSyncInfo() {}

	checkDistanceToStar() {
		this.sqrDistToStar = this.x * this.x + this.y * this.y;

		this.applyStarDmg();
	}

	checkDistToStation() {
		this.distToStation = Math.abs(this.x - Orb.station.x) + Math.abs(this.y - Orb.station.y);
	}

	applyStarDmg() {
		if (this.sqrDistToStar < 6000000) {
			this.hit((6000000 - this.sqrDistToStar) * 0.00002);
		}
	}

	hit(dmg) {
		if ((this.HP -= dmg) <= 0) {
			this.die();
			this.dropItems();
			return true;
		}

		return false;
	}

	die() {
		io.emit('die', this.ID);
		delete GameBody.list[this.ID];
		Player.delFromVisibleLists(this);
		this.controller.die();
	}

	dropItems() {
		for (var type of this.items) {
			const ID = Math.random();

			const item = new Item(type, ID, this.x, this.y);

			io.emit('drop', item.info);
		}
	}

	hitTest(obj) {
		const dy = this.y - obj.y, dx = this.x - obj.x;
		const sqrDistance = dx * dx + dy * dy;
		const radiusSum = this.radius + obj.radius;

		if (sqrDistance > radiusSum * radiusSum) {
			return;
		}

		const theta = Math.atan2(dy, dx);
		const overlap = this.radius + obj.radius - Math.sqrt(sqrDistance);
		this.x += overlap * Math.cos(theta);
		this.y += overlap * Math.sin(theta);

		const theta1 = this.direction;
		const theta2 = obj.direction;
		const phi = this.getAngle(obj);
		const m1 = this.mass;
		const m2 = obj.mass;
		const v1 = this.speed;
		const v2 = obj.speed;
		const m1m2 = 1 / (m1 + m2);

		const sinPhi = Math.sin(phi), cosPhi = Math.cos(phi);
		const v1SinTheta1Phi = v1 * Math.sin(theta1 - phi), v1CosTheta1Phi = v1 * Math.cos(theta1 - phi);
		const v2SinTheta2Phi = v2 * Math.sin(theta2 - phi), v2CosTheta2Phi = v2 * Math.cos(theta2 - phi);
		const sinPhiHalfPi = Math.sin(phi + Math.HALF_PI), cosPhiHalfPi = Math.cos(phi + Math.HALF_PI);

		const dx1F = (v1CosTheta1Phi * (m1 - m2) + 2 * m2 * v2CosTheta2Phi) * m1m2 * cosPhi + v1SinTheta1Phi * cosPhiHalfPi;
		const dy1F = (v1CosTheta1Phi * (m1 - m2) + 2 * m2 * v2CosTheta2Phi) * m1m2 * sinPhi + v1SinTheta1Phi * sinPhiHalfPi;
		const dx2F = (v2CosTheta2Phi * (m2 - m1) + 2 * m1 * v1CosTheta1Phi) * m1m2 * cosPhi + v2SinTheta2Phi * cosPhiHalfPi;
		const dy2F = (v2CosTheta2Phi * (m2 - m1) + 2 * m1 * v1CosTheta1Phi) * m1m2 * sinPhi + v2SinTheta2Phi * sinPhiHalfPi;

		const averageSpdX = dx1F * m1 * m1m2 + dx2F * m2 * m1m2;
		const averageSpdY = dy1F * m1 * m1m2 + dy2F * m2 * m1m2;

		const spdX1 = this.speedX, spdY1 = this.speedY;

		this.speedX = (dx1F + averageSpdX) * 0.5;                
		this.speedY = (dy1F + averageSpdY) * 0.5;
		obj.speedX = (dx2F + averageSpdX) * 0.5;
		obj.speedY = (dy2F + averageSpdY) * 0.5;

		const dSpdX1 = this.speedX - spdX1, dSpdY1 = this.speedY - spdY1;

		const deltaSpd1 = Math.sqrt(dSpdX1 * dSpdX1 + dSpdY1 * dSpdY1);
		const deltaPulse = deltaSpd1 * m1;

		const dmg = Math.min(this.HP, obj.HP, deltaPulse * GameBody.COLLISION_DAMAGE);

		this.hit(dmg);
		obj.hit(dmg);
	}

	get items() {
		return [];
	}

	get firstInfo() {}
	get info() {}

	static get info() {
		const pack = [];

		for (var i in this.list) {
			pack.push(this.list[i].info);
		}

		return pack;
	}

	static get iconData() {
		const data = [];

		for (var i in this.list) {
			const body = this.list[i];

			data.push({
				'ID': body.ID,
				'x': body.x,
				'y': body.y
			});
		}

		return data;
	}

}
GameBody.COLLISION_DAMAGE = 0.005;
GameBody.list = {};
GameBody.items = new Map();
