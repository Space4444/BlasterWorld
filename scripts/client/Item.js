class Item extends SpaceObject {
	constructor(pack) {
		const {'type': type, 'ID': ID, 'x': x, 'y': y} = pack;
		
		super(null, x, y);

		Item.getTexture(type, texture => this.sprite.texture = texture);

		this.type = type;
		this.angleSpeed = 0.1 * (Math.random() * 2 - 1);

		container.addChild(this.sprite);

		Item.list[ID] = this;
	}

	update() {
		super.update();
		this.updateRotation();
	}

	updatePosition() {}

	moveTo(ship) {
		const start = Date.now(), x0 = this.x, y0 = this.y;

		this.updatePosition = () => this.follow(start, x0, y0, ship);

		setTimeout(() => this.die(), Item.FOLLOW_TIME);
	}

	follow(start, x0, y0, ship) {
		const t = Date.now() - start;

		this.x = x0 + t / Item.FOLLOW_TIME * (ship.x - x0);
		this.y = y0 + t / Item.FOLLOW_TIME * (ship.y - y0);
	}

	die() {
		delete Item.list[this.ID];
		container.removeChild(this.sprite);
	}

	static getTexture(ID, callback) {
		Item.getSrc(ID, image => callback( PIXI.Texture.fromImage(image) ) );
	}

	static getSrc(ID, callback) {
		if (ID in Item.catalog) {
			callback(Item.catalog[ID].path);
		} else {
			Item.getImage(ID, callback);
		}
	}

	static getImage(ID, callback) {
		if (ID in images) { //get image from RAM
			callback(images[ID]);
		} else {
			const prefix = Item.getCategory(ID).slice(0, 1);

			ldb.get(`_${prefix}_${ID}`, value => {
				if (value === null) { //generate image and save it to the hard drive and RAM
					ItemGenerator.createImage(ID, image => { callback(image); Item.cacheImage(ID, image); } );
				} else { //get image from the hard drive
	 				callback(value);
	 				Item.cacheImage(ID, value);
	 				//ItemGenerator.createImage(ID, image => { callback(image); Item.cacheImage(ID, image); } );
				}
			});
		}
	}

	static cacheImage(ID, image) {
		images[ID] = image;
	}

	static getPrice(ID) {
		var k;
		switch ( Item.getCategory(ID) ) {
			case 'weapon':
			case 'engine':
			case 'other':
			k = 100;
			break;
			default: k = 10;
		}

		if (Item.getSubCategory(ID) === 'element') {
			k *= 0.5;
		}

		return Item.getLevel(ID) * k;
	}

	static getName(ID) {
		if (ID in Item.catalog) {
			return Item.catalog[ID].name
		}

		const info = Item.getCategory(ID);

		const firstWord = Item.getSubCategory(ID) === 'element' ? 'part of ' : 'unknown ';

		return firstWord + (info === 'other' ? 'equipment' : info);
	}

	static getDescription(ID) {
		return (Item.getName(ID) + '\nlevel: ' + Item.getLevel(ID) + '\n' + JSON.stringify( Item.getStats(ID) ) )
		.replaceAll(/{|}|"/, '')
		.replaceAll(',', '\n')
		.replaceAll(':', ': ');
	}

	static getStackSize(ID) {
		if (ID in Item.catalog) {//console.log(0);
			return Item.catalog[ID].stackSize;
		} else if ( Item.getCategory(ID) === 'material') {//console.log(1);
			return 16;
		}
//console.log(2);
		return 1;
	}

	static compatible(ID, compartment) {
		if (compartment in Item.forAll) {
			return true;
		}

		if (Item.getSubCategory(ID) === 'element') {
			return false;
		}

		if (ID in Item.catalog) {
			for (var i = 0, len = Item.catalog[ID].compartments.length; i < len; i++) {
				if (Item.catalog[ID].compartments[i] === compartment) {
					return true;
				}
			}
		}

		switch ( Item.getCategory(ID) ) {
			case 'weapon': return compartment === 'weapons';
			case 'engine': return compartment === 'engines';
			case 'other': return compartment === 'other';
		}

		return false;
	}

	static getCategory(ID) {
		if (ID in Item.catalog) {
			return Item.catalog[ID].category;
		}

		return Item.categories[ ID.split('|')[0] ][0];
	}

	static getSubCategory(ID) {
		if (ID in Item.catalog) {
			return Item.catalog[ID].subcategory;
		}

		const data = ID.split('|');

		if (!Item.categories[ data[0] ]) {
			return 'unknown';
		}

		return Item.categories[ data[0] ][1][ data[1] ] || 'element';
	}

	static getLevel(ID) {
		if (ID in Item.catalog) {
			return Item.catalog[ID].level;
		}

		return +ID.split('|')[2];
	}

	static getStats(ID) {
		var values;

		if (ID in Item.catalog) {
			values = Item.catalog[ID].stats;
		} else {
			values = ID.split('|').slice(3);
		}

		if (values.length === 0) {
			return {};
		}

		const category = Item.getCategory(ID);
		const subcategory = Item.getSubCategory(ID);
		const keys = Item.stats[category][subcategory];

		return Object.assign( ...keys.map( (v, i) => ( { [v]: +values[i] } ) ) );
	}

	static checkEquipment(ID) {
		if (Item.getSubCategory(ID) === 'element') {
			return;
		}

		switch ( Item.getCategory(ID) ) {
			case 'weapon': Weapon.check(ID); break;
			case 'engine': Engine.check(ID); break;
			case 'other': Other.check(ID); break;
		}
	}

	static clearEquipment() {
		Item.delEquipment(Weapon);
		Item.delEquipment(Engine);
		Item.delEquipment(Other);
	}

	static delEquipment(Equipment) {
		for (var ID in Equipment.catalog) {
			if (Equipment.catalog[ID] === Equipment.default) {
				continue;
			}

			var toDelete = true;
			const predicate = item => item && item['type'] === ID;

			if (
				Interface.inventory.find(predicate) ||
				Interface.crafting.find(predicate) ||
				Interface.result.find(predicate) ||
				Interface.hand.find(predicate)
			) {
				toDelete = false;
				continue;
			}
			
			for (var j in Controller.list) {
				const player = Controller.list[j], ship = player.body;

				if (!ship || !(ship instanceof SpaceShip)) {
					continue;	
				}

				if (
					ship.weapons.find(predicate) ||
					ship.engines.find(predicate) ||
					ship.other.find(predicate) 
				) {
					toDelete = false;
					break;
				}
			}

			if (toDelete) {
				if (Equipment === Weapon ) {
					const weapon = Weapon.catalog[ID];
					if (weapon instanceof MovingShotWpn) {
						weapon.delBulletImage();
					}
				}

				delete Equipment.catalog[ID];
			}
		}
	}

	static delImages() {
		const dBOpenRequest = window.indexedDB.open('d2', 1);
		
		dBOpenRequest.onsuccess = event => {
			const db = dBOpenRequest.result;

			db.transaction('s', 'readwrite').objectStore('s').getAll().onsuccess = event => {
				const result = event.target.result || null;

				for (var i = 0, len = result.length; i < len; i++) {
					const row = result[i];
					const prefix = row['k'].slice(1, 2);
					const ID = row['k'].slice(3);

					if ( row['k'].slice(0, 1) === '_' && row['k'].slice(2, 3) === '_' ) {
						if ( Item.getSubCategory(ID) !== 'element' )
						switch (prefix) {
							case 'w': Item.delImage(Weapon, ID, db); break;
							case 'e': Item.delImage(Engine, ID, db); break;
							case 'o': Item.delImage(Other, ID, db); break;
							case 'b': Item.delImage(Bullet, ID, db); break;
						}
					}
				}
			};
		};
	}

	static delImage(Equipment, ID, db) {
		var toDelete = true;
		for (var id in Equipment.catalog) {
			if (id === ID) {
				toDelete = false;
				return;
			}
		}

		if (toDelete) {
			const prefix = Equipment === Bullet ? 'b' : Item.getCategory(ID).slice(0, 1);
			db.transaction('s', 'readwrite').objectStore('s').delete(`_${prefix}_${ID}`);

			delete images[ID];
		}
	}

	static update() {
		for (var i in Item.list) {
			Item.list[i].update();
		}
	}
}
Item.list = {};
Item.FOLLOW_TIME = 300;
Item.textures = new Map();

Item.forAll = {
	'inventory': null,
	'crafting': null,
	'hand': null
}

Item.categories = [
	['material', ['material']],
	['weapon', ['moving-shot', 'instant-shot']],
	['engine', ['engine']],
	['other', ['repair bot']]
];

Item.stats = {
	'material': {
		'element': [],
		'material': []
	},
	'weapon': {
		'element': ['dmg', 'fireRate', 'bullSpd', 'bullLifeTime'],
		'moving-shot': ['damage', 'fire rate', 'bullet speed', 'bullet life time'],
		'instant-shot': ['damage', 'fire rate']
	},
	'engine': {
		'element': ['speed', 'acceleration', 'agility'],
		'engine': ['speed', 'acceleration', 'agility']
	},
	'other': {
		'element': ['repair speed'],
		'repair bot': ['repair speed']
	}
}

Item.catalog = [
	{//0
		name: 'metal',
		path: 'client/items/materials/metal.png',
		stackSize: 16,
		compartments: [],
		category: 'material',
		subcategory: 'material',
		level: 1,
		stats: [],
		description:
`metal`
	},
	{//1
		name: 'stone',
		path: 'client/items/materials/stone.png',
		stackSize: 16,
		compartments: [],
		category: 'material',
		subcategory: 'material',
		level: 1,
		stats: [],
		description:
`stone`
	},
	{//2
		name: 'laser gun',
		path: 'client/items/weapons/laser-gun.png',
		stackSize: 1,
		compartments: ['weapons'],
		category: 'weapon',
		subcategory: 'moving-shot',
		level: 1,
		stats: [15, 0.075, 15, 1500],
		description: 
`laser gun
damage: 10
fire rate: 10`
	},
	{//3
		name: 'plasma engine',
		path: 'client/items/engines/plasma-engine.png',
		stackSize: 1,
		compartments: ['engines'],
		category: 'engine',
		subcategory: 'engine',
		level: 1,
		stats: [15, 2, 0.04],
		description:
`plasma engine
speed: 15
acceleration: 2`
	},
	{//4
		name: 'repair bot',
		path: 'client/items/other_equipment/repair-bot.png',
		stackSize: 1,
		compartments: ['other'],
		category: 'other',
		subcategory: 'repair bot',
		level: 1,
		stats: [5],
		description:
`repair bot
rapairing speed: 5`
	}
];
