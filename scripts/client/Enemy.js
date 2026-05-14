class Enemy extends NPC {
	constructor(pack) {
    	const {'controller': controlPack, 'body': bodyPack} = pack;

		const ID = controlPack['ID'];
		const lvl = controlPack['lvl'];

		super(ID, lvl);

		const seed = new Random(lvl + window.seed * 10 - 2000).next(0x7FFFFFFF) | 0;

		this.body = new JetSpaceShip(ID, bodyPack, this, seed, images.trail);
	}

}
