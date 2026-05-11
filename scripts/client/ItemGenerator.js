class ItemGenerator {
	static createImage(ID, callback) {
		const width = 90, height = width;

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		canvas.width = width;
		canvas.height = height;

		setTimeout(ItemGenerator.drawImage, 0, ID, ctx, context => {
			const dataURL = context.canvas.toDataURL(); // produces a PNG file

			callback(dataURL);

			const prefix = Item.getCategory(ID).slice(0, 1);
			ldb.set(`_${prefix}_${ID}`, dataURL);
		});
	}

	static drawImage(ID, ctx, callback) {
		const category = Item.getCategory(ID);
		const data = ID.split('|');

		const seed = +ID.replaceAll(/\.|\|/, '');
		const subcategory = Item.getSubCategory(ID);
		const lvl = data[2];

		var I;
		if (subcategory === 'element') {
			Material.draw(seed, lvl, ctx, category, context => {
				callback(context);

				Material.catalog[ID] = true;
			});
			return;
		} else switch (category) {
			case 'weapon': I = Weapon; break;
			case 'engine': I = Engine; break;
			case 'other': I = Other; break;
		}

		I.draw(seed, subcategory, lvl, ctx, callback);
	}

}
