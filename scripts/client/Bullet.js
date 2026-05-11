class Bullet extends SpaceObject {
  constructor(texture, data) {
    super(texture, 0, 0, 0, 0);
    
    Object.assign(this, data);

    this.sprite.blendMode = PIXI.BLEND_MODES.ADD;
    
    const weaponIndex = this.index + '|';
    var bullID = this.ID;

    while (this.ship.bullets[weaponIndex + bullID++]) {}

    this.ID = weaponIndex + --bullID;

    this.ship.bullets[this.ID] = this;
    this.radius = 15;
    
    setTimeout(() => this.decay(), data.lifeTime);
  }
  
  update() {
    super.update();

    this.synchronize();

    if (this.decaing) {
      this.sprite.alpha -= 0.08 * dt;
    }
  }

  synchronize() {
    if (!synchronizing) {
      return;
    }

    const dx = (this.trueX - this.currX) * 0.25 * dt;
    const dy = (this.trueY - this.currY) * 0.25 * dt;
    this.currX += dx;
    this.currY += dy;
    this.x += dx;
    this.y += dy;
  }
  
  hitTestMyPlr() {
    const radiusSum = this.radius + ship.radius;
    if (player.alife && !this.decaing && this.getSqrDistance(ship) < radiusSum * radiusSum) {
      ship.hit(this.damage);

      this.explode();

      return true;
    }

    return false;
  }
  
  explode(target) {
    if (target && this.ship.getSqrDistance(target) > target.radius * target.radius) {
      const radiusSum = target.radius + this.radius;
      const dx = this.x - target.x;
      const dy = this.y - target.y;
      const b = Math.sqrt(dx * dx + dy * dy);
      const angle1 = Math.atan2(dy ,dx);
      const angle2 = this.direction;
      const alpha = Math.ang(angle1 - angle2);
      const ba = b / radiusSum;
      const baSinAlpha = Math.max(-1, Math.min(1, ba * Math.sin(alpha) ) );
      const c = radiusSum * (Math.sqrt(1 - baSinAlpha * baSinAlpha) + ba * Math.cos(alpha) );

      this.x = this.x - c * Math.cos(angle2);
      this.y = this.y - c * Math.sin(angle2);
    }
    
    this.die();
    
    this.explosion.explode(this.x, this.y);
  }

  decay() {
    this.decaing = true;
    setTimeout(() => this.die(), 500);
  }

  die() {
    container.removeChild(this.sprite);
    delete this.ship.bullets[this.ID];
  }

  static draw(seed, level, damage, ctx, callback) {
    const rand = new Random(seed);

    const color = '#' + (rand.next().toString(16) + "000000").substr(2, 6);

    const length = rand.next(1, 5);
    const h = ctx.canvas.height, w = ctx.canvas.width = h * length;
    ctx.canvas.height = w;

    const radius = Math.max(2, Math.min(h / 4,  damage * 0.15) ); // bullet image radius depends on damage

    ctx.translate(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);

    const r = rand.next(radius * 2, h * 0.5);

    ctx.beginPath();
    //ctx.transform(length, 0, 0, 1, 0, 0);
    ctx.shadowColor = color;
    ctx.shadowBlur = r * 1.25;

    ctx.fillStyle = Bullet.doubleColor(color);

    for (var i = 0; i < r / 3; i++) {
      ctx.ellipse(0, 0, radius * w / h, radius, 0, 0, Math.TWO_PI);
      ctx.fill();
    }

    callback(ctx);
  }

  static doubleColor(color) {
    var r = parseInt(color.substr(1, 2), 16);
    var g = parseInt(color.substr(3, 2), 16);
    var b = parseInt(color.substr(5, 2), 16);

    const sum = r + g + b;
    const minSum = Math.max(633, sum * 1.5);

    if (sum < minSum) {
      const k = minSum / sum;

      r = (r * k) | 0;
      g = (g * k) | 0;
      b = (b * k) | 0;

      var rest = 0;
      if (r >= 255) {
        rest += r - 255;
        r = 255;
      }
      if (g >= 255) {
        rest += g - 255;
        g = 255;
      }
      if (b >= 255) {
        rest += b - 255;
        b = 255;
      }

      if (r < 255) {
        const a = Math.min(255 - r, rest);
        r += a;
        rest -= a;
      }
      if (g < 255) {
        const a = Math.min(255 - g, rest);
        g += a;
        rest -= a;
      }
      if (b < 255) {
        const a = Math.min(255 - b, rest);
        b += a;
        rest -= a;
      }
    }

    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
  }

}
Bullet.catalog = {};
