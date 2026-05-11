class Enemy extends NPC {
	constructor(ID, x, y, level) {
		super(ID, 50 * level);

		this.level = level;

		const HP = SpaceShip.getMaxHP(level - 3);

		this.body = new SpaceShip(ID, this, x, y, HP);
		this.body.setSlotCounts([1, 1, 1]);

		delete this.body.pressingUp;
		delete this.body.pressingDown;
		Object.defineProperty(this.body, 'pressingUp', {
			get: function () { return this._pressingUp; },
			set: function (value) {
				this._pressingUp = value;
				io.emit('input', {
					'ID': this.ID,
					'data': {
						'inputID': 'up',
						'state': value
					}
				});
			},
		});
		Object.defineProperty(this.body, 'pressingDown', {
			get: function () { return this._pressingDown; },
			set: function (value) {
				this._pressingDown = value;
				io.emit('input', {
					'ID': this.ID,
					'data': {
						'inputID': 'down',
						'state': value
					}
				});
			},
		});

		this.target = null;

		this.body.reachedDist = 200;

		this.range = 1000000 * (1 + (level - 2 - 1) * 0.25);

		this.createEquipment(level - 1);
	}

	update25() {
		super.update25();

		this.updateTarget();
		this.updateBullets();
	}

	createEquipment(level) {
		const seed = new Random(level).next(0x7FFFFFFF) | 0;
		const rand = new Random(seed);

		const weaponID = Weapon.create(level, rand);
		const engineID = Engine.create(level, rand);
		const otherID = Other.create(level, rand);

		const engine = {'type': engineID, 'amount': 1};
		const other = {'type': otherID, 'amount': 1};
		const weapon = {'type': weaponID, 'amount': 1};
		this.body.setEquipment('engines', 0, engine);
		this.body.setEquipment('other', 0, other);
		this.body.weapons[0] = weapon;
		this.body.engines[0] = engine;
		this.body.other[0] = other;
	}
	
	interactWithPlayer(player) {
		this.checkTarget(player.body);
		this.checkShots(player.body);
	}

	updateTarget() {
		if (!this.target) {
			return; 
		}

		if (!Player.list[this.target.controller.ID] || this.body.getSqrDistance(this.target) >= 2 * this.range) {
			this.setTarget();
			this.body.destination = {x: this.body.x, y: this.body.y};
			return;
		}

		this.body.destination = this.target;//targetAngle = this.body.getAngle(this.target);
	}

	updateBullets() {
		const ship = this.body;

		for (var i in ship.bullets) {
			ship.bullets[i].updatePosition();
		}
	}

	checkTarget(ship) {
		if (this.target) {
			return;
		}

		if ( this.body.getSqrDistance(ship) < this.range) {
			this.setTarget(ship);
		}
	}

	setTarget(target) {
		const firing = !!target;

		this.target = target;

		this.body.pressingAttack = firing;

		io.emit('target', {
			'ID': this.ID,
			'target': target ? target.ID : undefined
		});
	}

	checkShots(target) {
		const ship = this.body;

		for (var i in ship.bullets) {
			const bullet = ship.bullets[i];

			const radiusSum = bullet.radius + target.radius;
			if (bullet.getSqrDistance(target) < radiusSum * radiusSum) {
				io.emit('hitInfo', {
					'bullet': i,
					'ship': ship.ID,
					'target': target.ID
				});

				target.hit(bullet.damage);

				delete ship.bullets[i];

				break;
			}
		}
	}

	get firstInfo() {
		return {
			'ID': this.ID,
			'lvl': this.level
		};
	}

	get info() {
		return {
			'ID': this.ID,
			'lvl': this.level,
			'target': this.target ? this.target.ID : null
		};
	}

	static getLevel(dist) {
		const rand = Math.random();

		if (rand < 0.66) {
			return Math.floor( Math.floor(dist * 0.0002) + 1 - Math.log2(rand / 0.66) );
		}

		return Math.max(1, Math.ceil( Math.floor(dist * 0.0002) + 2 + Math.log2( (1 - rand) / 0.66 ) ) );
	}

}
Enemy.playerList = Player.list;
Enemy.MAX_COUNT = 30;
Enemy.list = {};
