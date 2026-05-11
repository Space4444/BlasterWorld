class GameBody extends SpaceObject {
	constructor(ID, controller, texture, x, y, maxHP, HP, rotation, zIndex, spdX, spdY, radius, angleSpeed, explosion) {
		super(texture, x, y, rotation, zIndex, spdX, spdY);

		Object.assign(this, {
			ID: ID,
			controller: controller,
			alife: true,
			radius: radius,
			maxHP: maxHP,
			HP: HP,
			drawHP: HP,
			angleSpeed: angleSpeed,
			explosion: explosion,
			trueX: x,
			trueY: y,
			trueSpeedX: spdX,
			trueSpeedY: spdY,
			trueRotation: rotation,
			syncHP: true,
			syncID: 0,
			syncHPTimeout: null,
			info: new PIXI.Container(),
			healthBar: {
				green: new PIXI.Graphics(),
				grey: new PIXI.Graphics()
			}
		});

		this.info.addChild(this.healthBar.green);
		this.info.addChild(this.healthBar.grey);

		controller.body = this;

		GameBody.invisibleList[ID] = this;
	}

	update() {
		this.updateRotation();

		super.update();

		this.updateInfo();
		this.updateHealthBar();

		if (synchronizing) {
			this.synchronize();
		}
		this.HP = this.lerp(this.HP, this.drawHP, 0.3);
	}

	updateHealthBar() {
		if (this.maxHP < this.HP + 0.1) {
			this.healthBar.green.clear();
			this.healthBar.grey.clear();

			return;
		}

		const lineW = this.radius * 2 - 30, health = this.HP / this.maxHP;

		var graphics = this.healthBar.green;
		graphics.clear();

		graphics.beginFill(0x00AA00);

	    // draw a rectangle
	    graphics.drawRect(-this.radius + 13, -this.radius - 9, lineW * health, 5);

	    graphics = this.healthBar.grey;
	    graphics.clear();

	    graphics.beginFill(0x808080);
	    
	    graphics.alpha = 0.5;

	    // draw a rectangle
	    graphics.drawRect(-this.radius + 13 + lineW * health, -this.radius - 9, lineW * (1 - health), 5);
	}

	updateInfo() {
		this.info.x = this.drawX;
		this.info.y = this.drawY;
	}

	synchronize() {
		this.speedX = this.lerp(this.speedX, this.trueSpeedX, 0.3);
		this.speedY = this.lerp(this.speedY, this.trueSpeedY, 0.3);

		this.x = this.lerp(this.x, this.trueX, 0.1);
		this.y = this.lerp(this.y, this.trueY, 0.1);

		this.rotation = this.syncAng(this.rotation, this.trueRotation, 0.3);
	}

	lerp(current, target, speed) {
		return current + (target - current) * speed * dt;
	}

	syncAng(current, target, speed) {
		const result = current + Math.ang(target - current) * speed * dt;
		return Math.ang(result);
	}

	hit(dmg) {
		this.drawHP = Math.max(1, this.drawHP - dmg);

		this.syncHP = false;

		clearTimeout(this.syncHPTimeout);

		if (!this.syncHPTimeout) {
			this.syncHPTimeout = setTimeout(() => this.syncHP = true, 500);
		}

		this.syncHPTimeout = 0;
	}

	die() {
		this.alife = false;

		if (GameBody.list[this.ID]) {
			this.explosion.explode(this.x, this.y);
			this.stopDraw();
			delete GameBody.list[this.ID];
		} else if (GameBody.invisibleList[this.ID]) {
			delete GameBody.invisibleList[this.ID];
		}
	}

	startDraw() {
		container.addChild(this.sprite);
		info.addChild(this.info);
	}

	stopDraw() {
		container.removeChild(this.sprite);
		info.removeChild(this.info);
	}

	set syncInfo(pack) {
		if (this.syncHP || this.drawHP > pack['HP']) {
			this.drawHP = pack['HP'];
		}
	}

	static updateList(ID, pack, syncID) {
		var body = GameBody.list[ID];

		if(!body) {
			if (body = GameBody.invisibleList[ID]) {
				delete GameBody.invisibleList[ID];
				body.startDraw();
				GameBody.list[ID] = body;
				body.x = pack['x'];
				body.y = pack['y'];
			} else return;
		} else if (!body.drawing) {
            body.startDraw();
        }
		
		body.syncInfo = pack;
		body.syncID = syncID;
	}

	static clearList(syncID) {
		for (var i in GameBody.list) {
			const body = GameBody.list[i];
			if (body.alife && body.syncID != syncID) {
				delete GameBody.list[i];

				body.stopDraw();

				GameBody.invisibleList[i] = body;
			}
		}
	}

	static update() {
		for(var i in GameBody.list) {
			GameBody.list[i].update();
		}
	}

}
GameBody.list = {};
GameBody.invisibleList = {};
