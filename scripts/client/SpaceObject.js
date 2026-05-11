class SpaceObject {
  constructor(texture, x, y, rotation, zIndex, spdX, spdY, cont) {
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5);
    
    Object.assign(this, {
      x: x || 0,
      y: y || 0,
      speedX: spdX || 0,
      speedY: spdX || 0,
      rotation: rotation || 0,
      drawX: -1000,
      drawY: -1000,
    });

    if (zIndex === undefined) {
      (cont || container).addChild(this.sprite);
    } else {
      (cont || container).addChildAt(this.sprite, zIndex);
    }
  }

  update() {
    this.updateDrawPosition();
    this.updatePosition();
  }

  updatePosition() {
    this.x += this.speedX * dt;
    this.y += this.speedY * dt;
  }

  updateRotation() {
    this.rotation += this.angleSpeed * dt;
    this.rotation = Math.ang(this.rotation);
  }

  updateDrawPosition() {
    this.drawX = this.x + camera.x;
    this.drawY = this.y + camera.y;
  }

  getDistance(o) {
    return Math.sqrt( this.getSqrDistance(o) );
  }

  getSqrDistance(o) {
    const dx = this.x - o.x, dy = this.y - o.y;
    return dx * dx + dy * dy;
  }

  getAngle(o) {
    return Math.atan2(o.y - this.y, o.x - this.x);
  }

  get drawX() {
    return this.sprite.x;
  }
  set drawX(value) {
    this.sprite.x = value;
  }

  get drawY() {
    return this.sprite.y;
  }
  set drawY(value) {
    this.sprite.y = value;
  }

  get rotation() {
    return this.sprite.rotation;
  }
  set rotation(value) {
    this.sprite.rotation = value;
  }

  get direction() {
    return Math.atan2(this.speedY, this.speedX);
  }

  get speed() {
    return Math.sqrt(this.sqrSpeed);
  }

  get sqrSpeed() {
    return this.speedX * this.speedX + this.speedY * this.speedY;
  }

}
