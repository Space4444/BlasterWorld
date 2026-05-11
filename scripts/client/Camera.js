class Camera {
  constructor() {
    this.x1 = halfW - ship.x;
    this.y1 = halfH - ship.y;
    this.x = this.x1;
    this.y = this.y1;
  }
  
  update() {
    this.x1 -= halfW;
    this.y1 -= halfH;

    if (player.alife) {
      const spd = ship.speed, k = 0.5 * spd | 0 === 0 ? 0 : 0.1 / spd;

      this.x1 -= (ship.x + ship.speedX * w * k + this.x1) * 0.03 * dt;
      this.y1 -= (ship.y + ship.speedY * h * k + this.y1) * 0.03 * dt;
      
      this.x1 -= ship.speedX * dt;
      this.y1 -= ship.speedY * dt;
    }

    this.updateBackground();

    //this.x1 += halfW;
    //this.y1 += halfH;
    this.x = halfW - ship.x;//+= (this.x1 - this.x) * 0.3 * dt;
    this.y = halfH - ship.y;//+= (this.y1 - this.y) * 0.3 * dt;
  }
  
  updateBackground() {
    for (var i = 0, len = Universe.foregroundUniforms.length; i < len; i++) {
      const depth = Orb.station.depth + (1 - Orb.station.depth) * i / (Universe.FOREGROUND_COUNT - 1);

      Universe.foregroundUniforms[i]['pos'] = [
        this.x * depth,
        this.y * depth
      ]
    }

    Universe.backgroundUniforms['pos'] = [this.x * 0.075, this.y * 0.075];
  }

  lookAt(o) {
    this.x = this.x1 = halfW - o.x;
    this.y = this.y1 = halfH - o.y;
  }
}
