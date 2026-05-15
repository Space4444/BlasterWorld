class Controller {
	constructor(ID, money) {
		this.money = money;
		this.ID = ID;
		Controller.list[ID] = this;
		this.constructor.list[ID] = this;
		this.constructor.count++;
	}

	update25() {
		this.body.update25();
	}

	update15() {
		this.body.update15();
	}
	
	update2() {
		this.body.update2();
	}

	update1() {
		this.body.update1();
	}

	update_20() {
		this.body.update_20();
	}

	interactWithPlayer(player) {}

	die() {
		delete Controller.list[this.ID];
		delete this.constructor.list[this.ID];
		this.constructor.count--;
	}

	get firstInfo() {}
	get info() {}

	get allFirstInfo() {
		return {
			'controller': this.firstInfo,
			'body': this.body.firstInfo
		};
	}
	get allInfo() {
		return {
			'controller': this.info,
			'body': this.body.info
		};
	}

	static setIntervals() {
		setInterval(() => this.update25() , 1000 / 25);
		setInterval(() => this.update15() , 1000 / 15);
		setInterval(() => this.update2()  , 1000 / 2 );
		setInterval(() => this.update1()  , 1000     );
		setInterval(() => this.update_20(), 1000 * 20);
	}

	static update25() {
		for (var i in Controller.list) {
			Controller.list[i].update25();
		}
	}

	static update15() {
		for (var i in Controller.list) {
			Controller.list[i].update15();
		}

		this.synchronize();
	}

	static update2() {
		for (var i in Controller.list) {
			Controller.list[i].update2();
		}

		Item.checkPlayers();
	}

	static update1() {
		for (var i in Controller.list) {
			Controller.list[i].update1();
		}

		NPC.spawnAll();
		AsteroidController.checkPlayers();
		this.emitIcons();

		Orb.update();
	}

	static update_20() {
		for (var i in Controller.list) {
			Controller.list[i].update_20();
		}
	}

	static synchronize() {
		for(var i in Player.list) {
			WebRTC.channels[i].send(JSON.stringify({
				'ID': this.syncID++,
				'data': Player.list[i].syncDataOthers
			}));
		}
	}

	static emitIcons() {
		io.emit('icons', {
			'ID': this.syncID,
			'data': GameBody.iconData
		});
	}

	static get info() {
		const pack = [];

		for (var i in Controller.list) {
			pack.push({
				'type': Controller.list[i].constructor.name,
				'data': Controller.list[i].allInfo
			});
		}

		return pack;
	}

}
Controller.count = 0;
Controller.list = {};
Controller.syncID = 0;
