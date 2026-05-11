class StationInterface extends Interface {
	constructor() {
		super();

		this.selected = '0';

		const tabNames = this.tabNames = ['buy', 'sell', 'craft', 'equipment'];

		const tabs = tabNames.map(name =>
			document.getElementById(name + 'Tab')
			);

		const divs = this.divs = tabNames.map(name =>
			document.getElementById(name + 'Div')
			);

		for (let i = 0, len = tabs.length; i < len; i++) {
			const ii = i;

			tabs[i].onclick = () => {
				if (this.selected === ii) {
					return;
				}

				const unselected = this.selected;
				this.selected = ii;

				tabs[this.selected].classList.remove('unselected');
				tabs[this.selected].classList.add('selected');
				tabs[unselected].classList.remove('selected');
				tabs[unselected].classList.add('unselected');

				divs[this.selected].style.display = "flex";
				divs[unselected].style.display = "none";

				this.onTabClicked(ii);
			};
		}

		this.sellButton = document.getElementById('sellButton');
		this.sellButton.onclick = () => this.sell();

		this.moneyDiv = document.getElementById("money");
		this.moneyDiv.innerText = '$' + player.money;

		this.shipImg = document.getElementById('ship-img');


		//add items or empty cells to the equipment
		this.weapons = document.getElementById('weapons');
		this.initCells(this.weapons, ship.weapons, ship.weapons.size);

		this.engines = document.getElementById('engines');
		this.initCells(this.engines, ship.engines, ship.engines.size);

		this.other = document.getElementById('other');
		this.initCells(this.other, ship.other, ship.other.size);

		//add items or empty cells to the inventory
		this.inventory = document.getElementById('inventory');
		this.initCells(this.inventory, Interface.inventory, ship.inventorySize);

		//add items to the crafting cells
		this.crafting = document.getElementById('crafting').children[0].children[0];
		this.initCraftingCells(this.crafting, Interface.crafting);

		//add item to the crafting result cell
		this.result = document.getElementById('result');
		this.initCell(0, 'result', this.result, Interface.result);

		//add item to the hand
		this.hand = document.getElementById('hand');
		this.initCell(0, 'hand', this.hand, Interface.hand);
		if (Interface.hand[0]) {
			this.startHolding();
		}

		this.craftButton = document.getElementById('convert');
		this.updateCraftBtn();

		this.craftButton.onclick = () => socket.emit('craft');

		this.shipImage = document.getElementById('ship-img');

		this.shop = this.divs[0];
		this.buyButtons = [];
		this.initShop();

		if (!this.sellButton.disabled) {
			this.updateSellBtn();
		}

		this.resize();
	}

	initShop() {
		for (var i = 0; i < 10; i++) {
			const itemInfo = document.createElement('div');
			itemInfo.classList.add('itemInfo');

			const shipCell = document.createElement('div');
			shipCell.classList.add('shipCell');

			const seed = i;

			SpaceShip.getImage(seed, 1, src => {
				shipCell.style.backgroundImage = `url(${src})`;
			});

			itemInfo.appendChild(shipCell);

			const desc = document.createElement('div');
			desc.classList.add('itemDesc');

			desc.innerText = this.getShipDescription(i + 1);

			itemInfo.appendChild(desc);

			const buyBtn = document.createElement('button');
			buyBtn.classList.add('buyBtn');
			buyBtn.classList.add('game-button');

			buyBtn.innerText = 'Buy';

			(i => buyBtn.onclick = () => socket.emit('buy', i + 1) )(i);

			this.buyButtons.push(buyBtn);

			itemInfo.appendChild(buyBtn);

			this.shop.appendChild(itemInfo);
		}

		this.updateBuyButtons();
	}

	updateBuyButtons() {
		for (var i = 0, len = this.buyButtons.length; i < len; i++) {
			const button = this.buyButtons[i];

			button.disabled = player.money < JetSpaceShip.getPrice(i + 1);
		}
	}

	getShipDescription(level) {
		const [weapons, engines, other] = JetSpaceShip.getSlotCounts(level);

		const description = 
		`level: ${level}

		hull strength: ${JetSpaceShip.getMaxHP(level)}
		weapons: ${weapons}
		engines: ${engines}
		additional equipment: ${other}

		price: $${JetSpaceShip.getPrice(level)}`;

		return description;
	}

	sell() {
		socket.emit('sell');
		player.money += Interface.getSellPrice(Interface.hand[0]);
		this.updateBuyButtons();
		this.moneyDiv.innerText = '$' + player.money;
		this.delItem(0, Interface.hand, 'hand', Interface.hand[0]['amount'], this.hand);
	}

	onTabClicked(index) {
		if (this.tabNames[index] === 'craft' || this.tabNames[index] === 'equipment') {
			this.divs[index].appendChild(this.inventory);
		}
		if (this.tabNames[index] === 'sell') {
			this.divs[index].insertBefore(this.inventory, this.divs[index].firstChild);
		}
	}

	initCells(compartment, itemInfo, cellCount) {
		for (let i = 0, item; i < cellCount; i++) {
			const cell = document.createElement('div');
			cell.classList.add('cell');
			compartment.appendChild(cell);

			this.initCell(i, compartment.id, cell, itemInfo);
		}
	}

	delCells(compartment) {
		while (compartment.firstChild) {
		    compartment.removeChild(compartment.firstChild);
		}
	}

	initCraftingCells(compartment, itemInfo) {
		for (let i = 0; i < 3; i++) {
			for (let j = 0, item; j < 3; j++) {
				const cell = compartment.children[i].children[j].children[0];

				this.initCell(j + 3 * i, 'crafting', cell, itemInfo);
			}
		}
	}

	initCell(index, compID, cell, itemInfo) {
		const item = itemInfo[index];
		if (item) {
			this.fillCell(cell, item);

			Item.checkEquipment(item['type']);
		}

		cell.onmousedown = e => this.onCellClick(index, compID, cell, this.isRightBtn(e));
	}

	fillCell(cell, item, amount) {
		amount = amount || item['amount'];

		Item.getSrc(item['type'] , src => {
			cell.style.backgroundImage = `url(${src})`;
		});

		const description = Item.getDescription( item['type'] );
		cell.title = cell.alt = description;

		const itemInfo = document.createElement('div');
		itemInfo.innerText = amount === 1 ? '' : amount;
		cell.appendChild(itemInfo);

		cell.classList.add('filledCell');

		if (cell === this.hand) {
			this.sellButton.disabled = false;
			this.updateSellBtn();
		}
	}

	clearCell(cell) {
		cell.classList.remove('filledCell');
		cell.removeChild(cell.firstChild);
		cell.style.backgroundImage = '';
		cell.title = '';

		if (cell === this.hand) {
			this.sellButton.disabled = true;
			this.sellButton.innerText = 'Sell';
		}
	}

	updateSellBtn() {
		this.sellButton.innerText = `Sell for $${Interface.getSellPrice(Interface.hand[0])}`;
	}

	updateItemInfo(index, amount) {
		this.inventory.children[index].children[0].innerText = amount;
	}

	addNewItem(index, item) {
		const cell = this.inventory.children[index];
		this.fillCell(cell, item);
		
		Item.checkEquipment(item['type']);
	}

	craft(item) {
		this.addItem(0, Interface.result, item, 'result', item['amount'], this.result);

		for (let i = 0; i < 3; i++) {
			for (let j = 0, item; j < 3; j++) {
				const index = j + 3 * i;
				const it = Interface.crafting[index];
				
				if (!it) {
					continue;
				}

				const cell = this.crafting.children[i].children[j].children[0];

				this.delItem(index, Interface.crafting, 'crafting', it['amount'], cell);
			}
		}
		
		Item.checkEquipment(item['type']);
	}

	show() {
		this.updateEquipment();
		super.show();
	}

	hide() {
		super.hide();
	}

	updateEquipment() {
		this.updateBuyButtons();
		this.moneyDiv.innerText = '$' + player.money;
		this.shipImg.style.content = `url(${ship.sprite.texture.baseTexture.imageUrl})`;

		this.resizeComp(this.weapons, ship.weapons);
		this.resizeComp(this.engines, ship.engines);
		this.resizeComp(this.other, ship.other);
	}

	resizeComp(interfaceComp, shipComp) {
		this.delCells(interfaceComp);
		this.initCells(interfaceComp, shipComp, shipComp.size);
	}

	resize() {
		this.shipImg.style.transform = `translate(-45px, -32px) rotate(-90deg) scale(${h * 0.008})`;
	}

	onCellClick(index, compID, cell, right) {
		const holding = this.hand.classList.contains('filledCell');

		if (!cell.classList.contains('filledCell') && (!holding || right)) {
			return;
		}

		if (right) {
			this.moveItem(index, 0, compID, 'hand', cell, this.hand, 1);
		} else {
			if (holding) {
				this.moveItem(0, index, 'hand', compID, this.hand, cell);
			} else {
				this.moveItem(index, 0, compID, 'hand', cell, this.hand);
			}
		}
	}

	moveItem(start, end, startCompID, endCompID, startCellDiv, endCellDiv, amount) {
		const startComp = this.getCompartment(startCompID);
		const endComp = this.getCompartment(endCompID);
		const startCell = startComp[start];
		const endCell = endComp[end];

		if (!startCell || !Item.compatible(startCell['type'], endCompID)) {
			return;
		}
		
		amount = amount ||
		Math.min( Item.getStackSize(startCell['type']) - (endCell && endCell['amount'] || 0), startCell['amount']);

		socket.emit('moveItem', {'start': start, 'end': end, 'startComp': startCompID, 'endComp': endCompID, 'amount': amount});

		if (!endCell || startCell['type'] === endCell['type'] && endCell['amount'] < Item.getStackSize(endCell['type']) ) {
			this.addItem(end, endComp, startCell, endCompID, amount, endCellDiv);
			this.delItem(start, startComp, startCompID, amount, startCellDiv);

		} else {
			this.swapItems(startComp, endComp, start, end, startCellDiv, endCellDiv, startCompID, endCompID);
		}
	}

	getCompartment(ID) {
		switch (ID) {
			case 'inventory': return Interface.inventory;
			case 'weapons': return ship.weapons;
			case 'engines': return ship.engines;
			case 'other': return ship.other;
			case 'crafting': return Interface.crafting;
			case 'result': return Interface.result;
			case 'hand': return Interface.hand;
		}
	}

	addItem(index, compartment, item, compID, amount, cell) {
		if (compID === 'engines' || compID === 'other') {
			ship.setEquipment(compID, index, item);
		}

		if (!compartment[index]) {
			compartment[index] = {'type': item['type'], 'amount': amount || item['amount']};
			this.fillCell(cell, item, amount);

			if (compID === 'hand') {
				this.startHolding();
			}
		} else {
			this.addToStack(cell, amount);
			compartment[index]['amount'] += amount;
		}

		if (compID === 'crafting') {
			this.updateCraftBtn(index);
		}
	}

	delItem(index, compartment, compID, amount, cell) {
		if (compID === 'engines' || compID === 'other') {
			ship.delEquipment(compID, index);
		}

		const res = compartment[index]['amount'] - amount;
		if (!res) {
			this.clearCell(cell);
			delete compartment[index];

			if (compID === 'hand') {
				this.stopHolding();
			}
		} else {
			this.delFromStack(cell, amount);
			compartment[index]['amount'] = res;
		}

		if (compID === 'crafting') {
			this.updateCraftBtn(index);
		}
	}

	swapItems(comp1, comp2, index1, index2, cell1, cell2, comp1ID, comp2ID) {
		const item1 = comp1[index1];
		const item2 = comp2[index2];

		this.delItem(index1, comp1, comp1ID, item1['amount'], cell1);
		this.delItem(index2, comp2, comp2ID, item2['amount'], cell2);
		this.addItem(index1, comp1, item2, comp1ID, item2['amount'], cell1);
		this.addItem(index2, comp2, item1, comp2ID, item1['amount'], cell2);
	}

	addToStack(cell, amount) {
		cell.children[0].innerText = (+cell.children[0].innerText || 1) + amount;
	}

	delFromStack(cell, amount) {
		amount = (+cell.children[0].innerText || 1) - amount;
		cell.children[0].innerText = amount < 2 ? '' : amount;
	}

	startHolding() {
		$(this.hand).css({
			left: mouseX,
			top: mouseY
		});

		$(document).on('mousemove', e => {
			$(this.hand).css({
				left: e.pageX,
				top: e.pageY
			});
		});
	}

	stopHolding() {
		$(document).off('mousemove');
	}

	updateCraftBtn(index) {
		const active = !this.craftButton.disabled;
		for (var i = 0, len = Interface.crafting.length; i < len; i++) {
			if (Interface.crafting[i]) {
				if (!active) {
					this.craftButton.disabled = false;
				}
				
				return;
			}
		}

		if (active) {
			this.craftButton.disabled = true;
		}
	}

	isRightBtn(e) {
		e = e || window.event;

	    if ('which' in e) {  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
	    	return e.which == 3;
	    } else if ('button' in e) {  // IE, Opera 
	    	return e.button == 2;
	    }
	}
}
