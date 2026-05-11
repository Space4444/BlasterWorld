class Orb extends SpaceObject {
	constructor(texture, parent, startAngle, speed, orbitRadius) {
		super(texture, 0, 0, 0, 0, 0, 0, background);

		if ( !(this instanceof Star) ) {
			this.parent = parent;
			this.startAngle = startAngle;
			this.orbitRadius = orbitRadius;
			this.angleSpeed = speed / orbitRadius;
		}

		this.ID = rand.next().toFixed(15);

		Orb.list[this.ID] = this;
	}

	generate(){}
	load(){}
	landResponse() {}

	update() {
		super.update();
		this.drawX -= halfW;
		this.drawY -= halfH;

	    this.drawX *= this.depth;
	    this.drawY *= this.depth;

		this.drawX += halfW;
		this.drawY += halfH;

		if (this.parent) {
			this.angle = Math.ang((this.startAngle + this.angleSpeed * pt * 0.025) % Math.TWO_PI);

			this.x = this.parent.x + this.orbitRadius * Math.cos(this.angle);
			this.y = this.parent.y + this.orbitRadius * Math.sin(this.angle);
		}
	}

	static generate() {
		const promises = Object.values( Orb.list ).map( orb => {
			
			return new Promise( (resolve, reject) => {
				setTimeout(() => {
					orb.generate();

					Universe.progress();
					console.log('orb');

					resolve();
				}, 0);
			});

		} );

		promises.reduce( (prom1, prom2) => prom1.then(prom2) );
	}

	static update() {
		for (var i in Orb.list) {
			Orb.list[i].update();
		}
	}

    get iconRadius() {
        return 4;
    }

    get depth() {
    	return Orb.DEPTH;
    }
}
Orb.list = {};
Orb.DEPTH = 0.25;
