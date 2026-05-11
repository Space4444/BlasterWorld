class AsteroidController extends NPC {
	constructor(ID, x, y) {
		super(ID, 0);

		this.body = new Asteroid(ID, this, x, y, (Math.random() * 7) | 0);
	}

	interactWithPlayer(player) {
		this.body.hitTest(player.body);
	}

	get firstInfo() {
		return this.info;
	}

	get info() {
		return {
			'ID': this.ID
		};
	}

	static checkPlayers() {
		for (var i in Player.list) {
			const ship = GameBody.list[i];

			if (!ship) {
				if (this.playerList[i]) {
					delete this.playerList[i];
				}
				continue;
			}

			if (ship.sqrDistToStar > Asteroid.sqrMinR && ship.sqrDistToStar < Asteroid.sqrMaxR) {
				if (!this.playerList[i]) {
					this.playerList[i] = ship;
				}
			} else if (this.playerList[i]) {
				delete this.playerList[i];
			}
		}
	}

}
AsteroidController.MAX_COUNT = 100;
AsteroidController.list = {};
