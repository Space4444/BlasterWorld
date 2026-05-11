class MovingShotWpn extends Weapon {
	constructor(dmg, fireRate, bullSpd, bullLifeTime) {
		super(dmg, fireRate);

		this.bulletSpeed = bullSpd;
		this.bulletLifeTime = bullLifeTime;
	}

	fire(ship, index) {
		const info = ship.weaponInfo[index];

		if (info.timer < this.fireRate) {
			return;
		}

		const sin = Math.sin(ship.rotation);
		const cos = Math.cos(ship.rotation);
		const dx = info.x * cos - info.y * sin;
		const dy = info.x * sin + info.y * cos;

		new Bullet({
			dmg: this.damage,
			ID: index + '|' + ++ship.bulletID,
			x0: ship.x + dx,
			y0: ship.y + dy,
			speedX: ship.speedX + this.bulletSpeed * Math.cos(ship.rotation),
			speedY: ship.speedY + this.bulletSpeed * Math.sin(ship.rotation),
			radius: 15,
			lifeTime: this.bulletLifeTime
		}, ship.bullets);

		info.timer = 0;
	}

	static create(level, rand) {
		const result = Weapon.createElement(level, rand, 0);
		
		Weapon.check(result);

		return result;
	}

}
Weapon.DEFAULTS = Item.getStats(2);

Weapon.default = new MovingShotWpn( ...Object.values(Weapon.DEFAULTS) );

Weapon.catalog[2] = Weapon.default;
