class Engine {
	constructor(maxSpd, maxAccel, angleAccel) {
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

		Engine.catalog[ID] = new Engine( ...Object.values( Item.getStats(ID) ) );
	}

	static equip(ship, ID) {
		Engine.check(ID);
		Engine.catalog[ID].equip(ship);
	}

	static unequip(ship, ID) {
		Engine.catalog[ID].unequip(ship);
	}

	static create(level, rand) {
		const result = Engine.createElement(level, rand, 0);

		Engine.check(result);

		return result;
	}

	static createElement(level, rand, subcategory) {
		rand = rand || new Random(0);
		
		const defaults = Object.values(Engine.DEFAULTS);
		const stats = new Array(defaults.length);
		
		Random.fillArray(stats, rand, (level - 1) * 0.25 + 1);

		for (var i = 0, len = stats.length; i < len; i++) {
			stats[i] *= defaults[i];
			stats[i] = (stats[i] + 0.001).toFixed(3);
		}

		stats[0] = Math.min(stats[0], 40); // set limit for max speed

		return [2, subcategory, level].concat(stats).join('|');
	}

}
Engine.catalog = {};

Engine.DEFAULTS = Item.getStats(3);

Engine.default = new Engine( ...Object.values(Engine.DEFAULTS) );

Engine.catalog[3] = Engine.default;
