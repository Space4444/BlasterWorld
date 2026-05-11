class RepairBot extends Other {
	constructor(spd) {
		super();
		this.speed = spd;
	}

	equip(ship) {
		ship.repair += this.speed;
	}

	unequip(ship) {
		ship.repair -= this.speed;
	}

	static create(level, rand) {
		const result = Other.createElement(level, rand, 0);

		Other.check(result);

		return result;
	}

}
Other.DEFAULTS = Item.getStats(4);

Other.default = new RepairBot( ...Object.values(Other.DEFAULTS) );

Other.catalog[4] = Other.default;
