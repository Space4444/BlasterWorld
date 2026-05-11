class Weapon {
	constructor(ID, dmg, fireRate) {
		this.ID = ID;
		this.damage = dmg;
		this.fireRate = 1 / fireRate;
	}

	fire(ship, index) {}

	static check(ID, callback) {
		if (ID in Weapon.catalog) {
			return callback && callback();
		}

		const W = Weapon.getSubClass(ID);

		if (W === MovingShotWpn) {
			const bullet = Weapon.getBulletTexture(ID, bullet => {
				Weapon.catalog[ID] = new W(ID, bullet, ...Object.values( Item.getStats(ID) ) );
			});
		} else {
			Weapon.catalog[ID] = new W(ID, ...Object.values( Item.getStats(ID) ) );
		}
	}

	static getBulletTexture(ID, callback) {
		if (ID in Item.catalog) {
			callback(images.playerBullet);
			return;
		}

		Weapon.getBulletImage(ID, image => callback( PIXI.Texture.fromImage(image) ) );
	}

	static getBulletImage(ID, callback) {
		ldb.get('_b_' + ID, value => {
			if (value === null) { //generate image and save it to the hard drive
				Weapon.createBulletImage(ID, callback);
			} else { //get image from the hard drive
				callback(value);
				//Weapon.createBulletImage(ID, callback);
	 		}
	 	});
	}

	static createBulletImage(ID, callback) {
		const width = 40, height = width;

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		canvas.width = width;
		canvas.height = height;

		setTimeout(Weapon.drawBulletImage, 0, ID, ctx, context => {
			const dataURL = context.canvas.toDataURL(); // produces a PNG file

			callback(dataURL);

			Bullet.catalog[ID] = 'here is bullet';
			ldb.set('_b_' + ID, dataURL);
		});
	}

	static drawBulletImage(ID, ctx, callback) {
		const seed = +ID.replaceAll(/\.|\|/, '');
		const data = ID.split('|');
		const lvl = data[2];
		const dmg = data[3];

		Bullet.draw(seed, lvl, dmg, ctx, callback);
	}

	static getSubClass(ID) {
		switch (ID) {
			case 'moving-shot': return MovingShotWpn;
			case 'instant-shot': return InstantShotWpn;
		}

		switch ( Item.getSubCategory(ID) ) {
			case 'moving-shot': return MovingShotWpn;
			case 'instant-shot': return InstantShotWpn;
		}
	}

	static fire(ship, weaponID, index) {
		Weapon.check(weaponID, () => {
			Weapon.catalog[weaponID].fire(ship, index);
		});
	}

	static draw(seed, type, level, ctx, callback) {
		const W = Weapon.getSubClass(type);
		W.draw(seed, level, ctx, callback);
	}

}
Weapon.catalog = {};
