class Bullet extends SpaceObject {
  constructor(data, bulletList) {
    super(data.x0, data.y0, data.speedX, data.speedY);
    
    Object.assign(this, {
      damage: data.dmg,
      radius: data.radius,
      x0: this.x,
      y0: this.y,
      ID: data.ID,
      born: Date.now()
    });

    bulletList[this.ID] = this;
    
    setTimeout(this.die, data.lifeTime, this.ID, bulletList);
  }

  get position() {
    const t = (Date.now() - this.born) * 0.025;
    return [this.x0 + this.speedX * t, this.y0 + this.speedY * t];
  }

  die(ID, bulletList) {
    delete bulletList[ID];
  }
}
