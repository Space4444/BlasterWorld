class Asteroid extends GameBody {
  constructor(ID, pack, controller, src, explosion) {
    const x = pack['x'];
    const y = pack['y'];
    const spdX = pack['speedX'];
    const spdY = pack['speedY'];
    const rotation = pack['rotation'];
    const angSpd = pack['angleSpeed'];
    const radius = pack['radius'];
    const imageID = pack['imageID'];
    const maxHP = Asteroid.strength * radius * radius * radius;
    const HP = pack['HP'] || maxHP;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      const rect = new PIXI.Rectangle(imageID * Asteroid.IMAGE_SIZE, 0, Asteroid.IMAGE_SIZE, Asteroid.IMAGE_SIZE);
      const texture = new PIXI.Texture( new PIXI.BaseTexture(img) );
      texture.frame = rect;
      this.sprite['texture'] = texture;
    };

    super(ID, controller, null, x, y, maxHP, HP, rotation, undefined, spdX, spdY, radius, angSpd, explosion);

    this.sprite.scale.x = this.sprite.scale.y = 2.1 / Asteroid.IMAGE_SIZE * radius;
  }

  set syncInfo(pack) {
    //super.syncInfo = pack; ?????????????!!!!!!!!!!!!???!?!?!?
    if (this.syncHP || this.drawHP > pack['HP']) {
      this.drawHP = pack['HP'];
    }

    Object.assign(this, {
      trueX: pack['x'],
      trueY: pack['y'],
      trueSpeedX: pack['speedX'],
      trueSpeedY: pack['speedY'],
      trueRotation: pack['rotation']
    });
  }
  
}
Asteroid.IMAGE_SIZE = 158;
Asteroid.strength = 0.00024;
Asteroid.list = {};
