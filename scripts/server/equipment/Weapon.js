class Weapon {
	constructor(dmg, fireRate) {
		this.damage = dmg;
		this.fireRate = 1 / fireRate;
	}

	fire(ship, index) {}

	static check(ID) {
		if (ID in Weapon.catalog) {
			return;
		}

		var W;

		switch ( Item.getSubCategory(ID) ) {
			case 'moving-shot': W = MovingShotWpn; break;
			case 'instant-shot': W = InstantShotWpn; break;
		}

		Weapon.catalog[ID] = new W( ...Object.values( Item.getStats(ID) ) );
	}

	static fire(ship, weaponID, index) {
		Weapon.check(weaponID);
		Weapon.catalog[weaponID].fire(ship, index);
	}

	static create(level, rand) {
		return MovingShotWpn.create(level, rand);
	}

	static createElement(level, rand, subcategory) {
		rand = rand || new Random(0);

		const defaults = Object.values(Weapon.DEFAULTS);
		const stats = new Array(defaults.length - 1);
		
		do {
			Random.fillArray(stats, rand, (level - 1) * 0.25 + 1);

			for (var i = 0, len = stats.length; i < len; i++) {
				stats[i] *= defaults[i];
				stats[i] = +(stats[i] + 0.001).toFixed(3);
			}
		} while (stats[2] > 30 || stats[1] < 0.01 || stats[1] > 1);//set limit of 30 to bullet speed and min value of 0.01 for firerate

		stats[i] = defaults[i]; // set bullet life time to it`s default value

		return [1, subcategory, level].concat(stats).join('|');
	}

}
Weapon.catalog = {};
