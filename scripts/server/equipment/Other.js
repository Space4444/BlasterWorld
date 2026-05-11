class Other {
	constructor() {}

	equip(ship) {}

	unequip(ship) {}

	static check(ID) {
		if (ID in Other.catalog) {
			return;
		}

		var O;

		switch ( Item.getSubCategory(ID) ) {
			case 'repair bot': O = RepairBot; break;
		}

		Other.catalog[ID] = new O( ...Object.values( Item.getStats(ID) ) );
	}

	static equip(ship, ID) {
		Other.check(ID);
		Other.catalog[ID].equip(ship);
	}

	static unequip(ship, ID) {
		Other.catalog[ID].unequip(ship);
	}

	static create(level, rand) {
		return RepairBot.create(level, rand);
	}

	static createElement(level, rand, subcategory) {
		rand = rand || new Random(0);
		
		const defaults = Object.values(RepairBot.DEFAULTS);
		const stats = new Array(defaults.length);
		
		Random.fillArray(stats, rand, (level - 1) * 0.25 + 1);

		for (var i = 0, len = stats.length; i < len; i++) {
			stats[i] *= defaults[i];
			stats[i] = (stats[i] + 0.001).toFixed(3);
		}

		return [3, subcategory, level].concat(stats).join('|');
	}

}
Other.catalog = {};
