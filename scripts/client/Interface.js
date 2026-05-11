class Interface {
	constructor() {
		const takeOff = document.getElementById("take-off");

		takeOff.onclick = () => {
		  if (ship.maxSpeed === 0) {
		  	Interface.alert('You must have an engine equipped on your ship before you can take off');
		  	return;
		  }

		  socket.emit('takingOff');
		};
	}

	show() {
		this.resize();
		Interface.showing = this;
	}

	hide() {
		Interface.showing = null;
	}

	resize() {

	}

	static updateEquipment() {
		Orb.station.interface.updateEquipment();
	}

	static alert(msg) {
		Interface.message.innerText = msg;
		$(Interface.message).on('click', Interface.clearAlert);
		
		clearTimeout(Interface.alertTimeout);
		Interface.alertTimeout = setTimeout(Interface.clearAlert, 5000);
	}

	static clearAlert(msg) {
		$(Interface.message).off('click');
		Interface.message.innerText = '';
	}

	static initInventory(items) {
		Interface.inventory = items['inventory'];
		Interface.crafting = items['crafting'];
		Interface.result = items['result'];
		Interface.hand = items['hand'];
	}

	static resize() {
		if (Interface.showing) {
			Interface.showing.resize();
		}
	}

	static addItem(index, item) {
		const it = Interface.inventory[index];
		if (it) {
			it['amount']++;
			Orb.station.interface.updateItemInfo(index, it['amount']);
		} else {
			Interface.inventory[index] = {'type': item['type'], 'amount': 1};
			Orb.station.interface.addNewItem(index, Interface.inventory[index]);
		}
	}

	static craft(item) {
		Orb.station.interface.craft(item);
	}

	static getSellPrice(item) {
		return Item.getPrice(item['type']) * item['amount'];
	}
	
}
Interface.inventory = [];

Interface.equipment = {
	'weapons': Weapon,
	'engines': Engine,
	'other': Other
};

Interface.message = document.getElementById('alert');