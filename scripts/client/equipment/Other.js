class Other {
	constructor(ID) {
		this.ID = ID;
	}

	equip(ship) {}

	unequip(ship) {}

	static check(ID) {
		if (ID in Other.catalog) {
			return;
		}

		const O = Other.getSubClass(ID);

		Other.catalog[ID] = new O(ID, ...Object.values( Item.getStats(ID) ) );
	}

	static getSubClass(ID) {
		switch (ID) {
			case 'repair bot': return RepairBot;
		}

		switch ( Item.getSubCategory(ID) ) {
			case 'repair bot': return RepairBot;
		}
	}

	static equip(ship, ID) {
		Other.check(ID);
		Other.catalog[ID].equip(ship);
	}

	static unequip(ship, ID) {
		Other.catalog[ID].unequip(ship);
	}

	static draw(seed, type, level, ctx, callback) {
		const O = Other.getSubClass(type);
		O.draw(seed, level, ctx, callback);
	}

}
Other.catalog = {};
