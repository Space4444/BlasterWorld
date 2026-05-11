class AsteroidController extends NPC {
	constructor(pack, imageSrc, explosion) {
    	const {'controller': controlPack, 'body': bodyPack} = pack;

		const ID = controlPack['ID'];

		super(ID);

		this.body = new Asteroid(ID, bodyPack, this, imageSrc, explosion);
	}

}
