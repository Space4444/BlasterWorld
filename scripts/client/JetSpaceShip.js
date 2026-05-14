class JetSpaceShip extends SpaceShip {
  constructor(ID, pack, pilot, seed, trailTexture) {
    super(ID, pack, pilot, seed);

    this.trailTime = 0;
    this.trailTimer = (pack['maxSpd'] || 15) / (pack['accel'] || 2);

    this.trail = new PIXI.Sprite(trailTexture);
    this.trail.blendMode = PIXI.BLEND_MODES.ADD;

    this.sprite.addChild(this.trail);
    this.trail.x = -this.radius;
    this.trail.anchor.set(0.65, 0.5);
  }
  
  update() {
    super.update();
    this.updateTrail();
  }

  updateTrail() {
    if(this.pressingUp && !this.pressingDown) {
      if((this.trailTime += dt) > this.trailTimer) {
        this.trailTime = this.trailTimer;
      }
    } else if((this.trailTime -= dt) < 0) {
      this.trailTime = 0;
    }

    this.trail.alpha = this.trailTime / this.trailTimer;
  }

  setHP(HP) {
    this.HP = this.maxHP = HP;
  }

  static getSlotCounts(level) {
    switch (level) {
      case 1: return [1, 1, 1];
      case 2: return [1, 1, 2];
      case 3: return [2, 1, 1];
      case 4: return [2, 1, 2];
      case 5: return [2, 1, 3];
      case 6: return [3, 1, 2];
      case 7: return [3, 1, 3];
      case 8: return [4, 1, 1];
      case 9: return [4, 1, 3];
      case 10: return [5, 1, 4];
    }
  }

  static getPrice(level) {
    return level * level * 1000;
  }

  static getMaxHP(level) {
    return ( ( (level - 1) * 0.25) + 1) * 100;
  }
}
