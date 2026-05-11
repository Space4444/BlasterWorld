class Icon {
	constructor(type) {
		this.color = Icon.colors.get(type);
	}

	set x(x) {
		this.drawX = x + camera.x;
	}
	set y(y) {
		this.drawY = y + camera.y;
	}

	static clear(syncID) {
		for (var i in Icon.list) {
			if (Icon.list[i].syncID !== syncID) {
				delete Icon.list[i];
			}
		}
	}
}
Icon.colors = new Map();
Icon.colors.set(MyPlayer, '#FFFFFF');
Icon.colors.set(Player, '#FF7F00');
Icon.colors.set(Enemy, '#FF0000');
Icon.colors.set(AsteroidController, '#AAAAAA');
Icon.list = {};
