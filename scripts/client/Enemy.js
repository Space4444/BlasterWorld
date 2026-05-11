class Enemy extends NPC {
	constructor(pack) {
    	const {'controller': controlPack, 'body': bodyPack} = pack;

		const ID = controlPack['ID'];
		const lvl = controlPack['lvl'];

		super(ID, lvl);

		const seed = new Random(lvl).next(0x7FFFFFFF) | 0;

		this.body = new JetSpaceShip(ID, bodyPack, this, seed, images.trail);
	}

}
