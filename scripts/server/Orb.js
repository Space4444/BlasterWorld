class Orb extends SpaceObject {
	constructor(parent, startAngle, speed, orbitRadius) {
		super();

		//if ( !(this instanceof Star) ) {
			this.parent = parent;
			this.startAngle = startAngle;
			this.orbitRadius = orbitRadius;
			this.angleSpeed = speed / orbitRadius;
		//}

		this.ID = rand.next().toFixed(15);

		Orb.list[this.ID] = this;
	}

	update() {
		this.angle = Math.ang((this.startAngle + this.angleSpeed * Universe.time * 0.025) % Math.TWO_PI);

		this.x = this.parent.x + this.orbitRadius * Math.cos(this.angle);
		this.y = this.parent.y + this.orbitRadius * Math.sin(this.angle);
	}

	static update() {
		Universe.time = Date.now();

		for (var i in Orb.list) {
			Orb.list[i].update();
		}
	}
}
Orb.list = {};
