class Controller {
	constructor(ID, level) {
		this.ID = ID;
		this.level = level;

		Controller.list[ID] = this;
	}

	update() {}

	die() {
		this.body.die();
	}

	static update() {
		for(var i in Controller.list) {
			Controller.list[i].update();
		}
  		GameBody.update();
	}

}
Controller.list = {};
