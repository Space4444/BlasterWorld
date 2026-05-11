class SpaceShip extends GameBody {
  constructor(ID, pack, pilot, seed) {
    const x = pack['x'];
    const y = pack['y'];
    const spdX = pack['speedX'] || 0;
    const spdY = pack['speedY'] || 0;
    const maxHP = pack['maxHP'] || 100;
    const HP = pack['HP'] || maxHP;
    const bulletID = pack['bulletID'] || 0;
    const angleSpeed = pack['angleSpeed'] || 0;
    const rotation = pack['rotation'] || 0;
    const firing = pack['firing'] || false;
    const weapons = pack['weapons'];
    const engines = pack['engines'];
    const other = pack['other'];
    const weaponCount = pack['weaponCount'] || 3;
    const engineCount = pack['engineCount'] || 1;
    const otherCount = pack['otherCount'] || 2;
    const explosion = new Explosion(images.particle, Explosion.getShipSettings(seed) );

    super(ID, pilot, null, x, y, maxHP, HP, rotation, undefined, spdX, spdY, 50, angleSpeed, explosion);

    this.sprite = new PIXI.projection.Sprite2d();
    this.sprite.anchor.set(0.5);
    SpaceShip.getTexture(seed, pilot.level, texture => this.sprite.texture = texture);

    this.checkEquipment(weapons);
    this.checkEquipment(engines);
    this.checkEquipment(other);

    Object.assign(this, {
      pressingUp: false,
      pressingDown: false,
      pressingRight: false,
      pressingLeft: false,
      pressingAttack: firing,
      inventorySize: 36,
      weapons: [],
      _engines: [],
      _other: [],
      bulletID: bulletID,
      maxAccel: 0,
      maxSpeed: 0,
      repair: 0,
      angleAccel: 0,
      rotationX: 0,
      rotationY: 0,
      bullets: {},
      trueAngleSpeed: 0
    });
    this._engines.size = engineCount;
    this._other.size = otherCount;
    this.weapons = weapons;
    this.engines = engines;
    this.other = other;

    this.setSlotCounts([weaponCount, engineCount, otherCount]);
  }
  
  update() {
    this.updateFire();
    this.updateBullets();
    this.updateSpeed();
    this.updateAngleSpeed();

    super.update();

    this.updatePerspective();
  }

  updatePerspective() {
    var angle = this.angleSpeed * 2;
    if (Math.abs(angle) > 0.5) {
      angle = Math.sign(angle) * 0.5;
    }
    this.rotationX = this.lerp(this.rotationX, angle, 0.2);

    this.sprite.proj.matrix.mat3[4] = Math.cos(this.rotationX);
    this.sprite.proj.matrix.mat3[5] = 0.01 * Math.sin(this.rotationX);


    var force = 0.7 * (this.pressingUp - this.pressingDown);
    force *= 1 - this.sqrSpeed / (this.maxSpeed * this.maxSpeed);
    this.rotationY = this.lerp(this.rotationY, force, 0.25);
    this.sprite.proj.matrix.mat3[0] = Math.cos(this.rotationY);
    this.sprite.proj.matrix.mat3[2] = 0.005 * Math.sin(this.rotationY);


    this.sprite.proj._projID++;
  }
  
  updateFire() {
    for (var i = 0; i < this.weapons.size; i++) {
      if (this.weapons[i]) {
        this.weaponInfo[i].timer += dt;
        if (this.pressingAttack) {
          Weapon.fire(this, this.weapons[i].type, i);
        }
      }
    }
  }
  
  updateBullets() {
    for (var i in this.bullets) {
      const bullet = this.bullets[i];

      bullet.update();

      if ( bullet.hitTestMyPlr() ) {
        return;
      }
    }
  }

  updateSpeed() {}
  updateAngleSpeed() {}

  setSlotCounts(slots) {
    [
    this.weapons.size,
    this.engines.size,
    this.other.size
    ] = slots;

    this.weaponInfo = [];
    const step = 33 / ((this.weapons.size / 2) | 0) , start = +(this.weapons.size % 2 === 0);
    for (var i = 0, j = start, bullY; i < this.weapons.size; i++, ((j *= -1) >= 0) && j++) {
      bullY = -j * step || 0;
      this.weaponInfo[i] = {timer: 1000, x: 33, y: bullY};
    }
  }

  startDraw() {
    this.drawing = true;
    shipContainer.addChild(this.sprite);
    info.addChild(this.info);
  }
  stopDraw() {
    for (var i in this.bullets) {
      this.bullets[i].decay();
    }

    this.drawing = false;
    shipContainer.removeChild(this.sprite);
    info.removeChild(this.info);
  }

  reset() {
    this.pressingAttack = false;
    this.pressingDown = false;
    this.pressingLeft = false;
    this.pressingRight = false;
    this.pressingUp = false;
    this.syncHP = true;
    this.rotation = 0;
    this.trueRotation = 0;
    this.bulletID = 0;
    this.HP = this.trueHP = this.maxHP;
  }

  cutSpeed() {
    const sqrSpd = this.sqrSpeed;

    if (sqrSpd < this.maxSpeed * this.maxSpeed) {
      return;
    }

    const k = this.maxSpeed / Math.sqrt(sqrSpd);
    this.speedX = this.speedX * k;
    this.speedY = this.speedY * k;
  }

  checkEquipment(compartment) {
    for (var item of compartment) {
      if (item) {
        Item.checkEquipment(item['type']);
      }
    }
  }

  setEquipment(compID, index, item) {
    switch (compID) {
      case 'engines':
      if (this.engines[index]) {
        Engine.unequip(this, this.engines[index]['type']);
      }
      if (item) {
        Engine.equip(this, item['type']);
      }
      break;
      case 'other':
      if (this.other[index]) {
        Other.unequip(this, this.other[index]['type']);
      }
      if (item) {
        Other.equip(this, item['type']);
      }
      break;
    }
  }

  delEquipment(compID, index) {
    switch (compID) {
      case 'engines':
      Engine.unequip(this, this.engines[index]['type']);
      break;
      case 'other':
      Other.unequip(this, this.other[index]['type']);
      break;
    }
  }

  die() {
    this.alife = false;
    this.pressingAttack = false;

    if (GameBody.list[this.ID]) {
      this.explosion.explode(this.x, this.y);
      this.stopDraw();
    }

    this.delFromList();
  }

  delFromList() {

    // Wait until all ship`s bullets decay
    if ( Object.keys(this.bullets).length > 0) {
      setTimeout( () => this.delFromList(), 500);
      return;
    }

    if (GameBody.list[this.ID]) {
      delete GameBody.list[this.ID];
    } else if (GameBody.invisibleList[this.ID]) {
      delete GameBody.invisibleList[this.ID];
    }
  }

  synchronize() {
    this.angleSpeed = this.lerp(this.angleSpeed, this.trueAngleSpeed, 0.3);

    super.synchronize();
  }

  get engines() {
    return this._engines;
  }
  set engines(engines) {
    for (var i = 0; i < this.engines.size; i++) {
      if (engines[i]) {
        this.setEquipment('engines', i, engines[i]);
      }
    }
    this._engines = engines;
  }

  get other() {
    return this._other;
  }
  set other(other) {
    for (var i = 0; i < this.other.size; i++) {
      if (other[i]) {
        this.setEquipment('other', i, other[i]);
      }
    }
    this._other = other;
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
      trueRotation: pack['rotation'],
      bulletID: pack['bulletID'],
      trueAngleSpeed: pack['angleSpeed']
    });
  }

  static getTexture(seed, lvl, callback) {
    SpaceShip.getImage(seed, lvl, image => callback( PIXI.Texture.fromImage(image) ) );
  }

  static getImage(seed, lvl, callback) {
    if (seed in images) { //get image from RAM
      callback(images[seed]);
    } else {
      ldb.get('_s_' + seed, value => {
        if (value === null) { //generate image and save it to the hard drive and RAM
          SpaceShip.createImage(seed, lvl, image => { callback(image); Item.cacheImage(seed, image); } );
        } else { //get image from the hard drive
          callback(value);
          Item.cacheImage(seed, value);
          //SpaceShip.createImage(seed, lvl, image => { callback(image); Item.cacheImage(seed, image); } );
        }
      });
    }
  }

  static createImage(seed, lvl, callback) {
    if (seed === 0) {
      callback('client/ship.png');
      return;
    }

    const width = 104, height = 128;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    setTimeout(SpaceShip.draw, 0, seed, lvl, ctx, context => {
      const dataURL = context.canvas.toDataURL(); // produces a PNG file

      callback(dataURL);

      ldb.set('_s_' + seed, dataURL);
    });
  }

  static draw(seed, level, ctx, callback) {
        var w = ctx.canvas.width, h = ctx.canvas.height;
        const rand = new Random(seed);
w*=1.25;h*=1.25;
ctx.canvas.width*=1.25;ctx.canvas.height*=1.25;
        ctx.translate(0.5 * w, 0.5 * h);
        ctx.rotate(Math.HALF_PI);
w/=1.25;h/=1.25;
        const topBottom = SpaceShip.drawHull(rand, level, ctx, w, h);

        SpaceShip.drawWindShield(rand, level, ctx, topBottom);

        callback(ctx);
      }

  static drawHull(rand, level, ctx, w, h) {
        const color = '#' + (rand.next().toString(16) + "000000").substr(2, 6);console.log('ship: ', rand._seed, color);

        ctx.lineWidth = 2;
        w -= ctx.lineWidth + 5;
        h -= ctx.lineWidth;

        var points = [];

        const maxWidth = w * 0.5;
        const sharpness = rand.next(10, 100);
        const minInterval = 1;
        const maxInterval = 15;
        const minHalhHeight = 0.17 * h;
        const maxHalhHeight = 0.5 * h;
        const smoothingType = rand.next(0, 3) | 0;//console.log(smoothingType);
        const maxLines = 3;
        var pointCount;

        //generate point coordinates of the top of the ship
        points[0] = {
          x: 0,
          y: rand.next(-maxHalhHeight, -minHalhHeight)
        };
        for (var i = 1; ; i++) {
          var y;
          do {//console.log(1000);
            y = points[i - 1].y + rand.next(-sharpness, sharpness);
          } while (y < -maxHalhHeight || y > -minHalhHeight);

          points[i] = {
            x: points[i - 1].x + rand.next(minInterval, maxInterval),
            y
          };

          if (points[i].x > maxWidth) {
            points[i].x = maxWidth;
            points[i].y = 0;
            pointCount = i + 1;
            break;
          }
        }

        //generate point coordinates of the bottom of the ship
        const finalPoint = {
          x: 0,
          y: h * 0.3//rand.next(minHalhHeight, maxHalhHeight)
        }
        points[pointCount] = {
          x: Math.min(maxWidth, points[pointCount - 1].x + rand.next(-maxInterval, maxInterval) ),
          y: rand.next(minHalhHeight, maxHalhHeight)
        };
        for (var i = pointCount + 1; ; i++) {
          var y;
          do {//console.log(2000);
            y = points[i - 1].y + rand.next(-sharpness, sharpness);
          } while (y < minHalhHeight || y > maxHalhHeight);

          points[i] = {
            x: points[i - 1].x - rand.next(minInterval, maxInterval),
            y
          };

          if (points[i].x < 0) {
            points[i] = finalPoint;
            pointCount = i + 1;
            break;
          }
        }

        const fewest = SpaceShip.findFewestAngles(points, ctx, maxWidth, maxLines);

        //draw
        
        ctx.beginPath();

        // add coords of the left side
        points = points.concat( points.slice(0, -1).reverse().map( point => ({x: -point.x, y: point.y}) ) );

        var drawPolygon;
        switch (smoothingType) {
          case 0: drawPolygon = SpaceShip.drawPolygon; break;
          case 1: drawPolygon = SpaceShip.drawSmoothPolygon; break;
          case 2: drawPolygon = SpaceShip.drawOrtPolygon; break;
        }
        drawPolygon(ctx, points);

        ctx.fillStyle = SpaceShip.gradient(ctx, maxWidth, rand);
        ctx.strokeStyle = SpaceShip.gradient(ctx, maxWidth, rand);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();



        //draw separate hull parts

        const index1 = fewest.top[0];
        const index2 = fewest.bottom[0];
        const index3 = pointCount * 2 - 2 - index2;
        const index4 = pointCount * 2 - 2 - index1;
            
        ctx.beginPath();
            
        ctx.fillStyle = SpaceShip.gradient(ctx, maxWidth, rand, color);
        ctx.strokeStyle = SpaceShip.gradient(ctx, maxWidth, rand);

        drawPolygon(ctx,
          points.slice(0, index1 + 1).
          concat(points.slice(index2, index3 + 1) ).
          concat(points.slice(index4 - points.length) )
        );
            
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        var i = 0, j = 0, len1 = fewest.top.length, len2 = fewest.bottom.length, next;

        if (len1 >= 0 && len2 >= 0)
        while (true) {
          next = false;
          const prevI = i, prevJ = j;
          if (i + 1 < len1) {
            i++;
            next = true;
          }
          if (j + 1 < len2) {
            j++;
            next = true;
          }

          if (!next) {
            break;
          }

          let index1, index2, index3, index4, vertices, dx;

          // right part
          index1 = fewest.top[prevI];
          index2 = fewest.top[i];
          index3 = fewest.bottom[j];
          index4 = fewest.bottom[prevJ];

          //ctx.save(); 
          ctx.beginPath();
              
          ctx.fillStyle = SpaceShip.gradient(ctx, maxWidth, rand);
          ctx.strokeStyle = SpaceShip.gradient(ctx, maxWidth, rand);

          vertices = points.slice(index1, index2 + 1).
          concat(points.slice(index3, index4 + 1) );

          drawPolygon(ctx, vertices);
              
          ctx.closePath();

          //dx = vertices.reduce( (a, b) => a.x + b.x ) / vertices.length;
          //ctx.transform(1, 0, 0, 1, 0, dx);

          ctx.fill();
          ctx.stroke();
          //ctx.restore();

          //left part
          index1 = pointCount * 2 - 2 - index1;
          index2 = pointCount * 2 - 2 - index2;
          index3 = pointCount * 2 - 2 - index3;
          index4 = pointCount * 2 - 2 - index4;
          
          //ctx.save();
          ctx.beginPath();

          vertices = points.slice(index4, index3 + 1).
          concat(points.slice(index2, index1 + 1) ).reverse();

          drawPolygon(ctx, vertices);
              
          ctx.closePath();

          //dx = vertices.reduce( (a, b) => a.x + b.x ) / vertices.length;
          //ctx.transform(1, 0, 0, 1, 0, dx);

          ctx.fill();
          ctx.stroke();
          //ctx.restore();
        }





        return [
          Math.max(points[0].y, points[1].y),
          Math.min(points[pointCount - 1].y, points[pointCount - 2].y)
        ]
      }

  static findFewestAngles(points, ctx, maxWidth, maxLines) {
        const topMin = [];
        const bottomMin = [];

        for (var i = 1, len = points.length - 1; i < len; i++) {
          const averageY = SpaceShip.lerp(points[i - 1].y, points[i + 1].y, (points[i].x - points[i - 1].x) / (points[i + 1].x - points[i - 1].x) );

          if (points[i].y < averageY !== averageY > 0 || points[i].x === maxWidth) {
            continue;
          }

          const v1 = {
            x: points[i - 1].x - points[i].x,
            y: points[i - 1].y - points[i].y
          }
          const v2 = {
            x: points[i + 1].x - points[i].x,
            y: points[i + 1].y - points[i].y
          }
          const cos = (v1.x * v2.x + v1.y * v2.y) / Math.sqrt( (v1.x * v1.x + v1.y * v1.y) * (v2.x * v2.x + v2.y * v2.y) );

          if (averageY > 0) {
            if (!bottomMin[0] || cos > bottomMin[0].cos) {
              bottomMin.push({
                cos,
                point: points[i],
                index: i
              });
            }
          } else {
            if (!topMin[0] || cos > topMin[0].cos) {
              topMin.push({
                cos,
                point: points[i],
                index: i
              });
            }
          }
        }

        topMin.sort( (p1, p2) => p1.point.x - p2.point.x );
        bottomMin.sort( (p1, p2) => p1.point.x - p2.point.x );

        const result = {top: topMin.map(v => v.index), bottom: bottomMin.map(v => v.index)};

        return result;
      }

  static lerp(a, b, x) {
        return a + (b - a) * x;
      }

  static drawWindShield(rand, level, ctx, topBottom) {
        ctx.beginPath();
        ctx.fillStyle = 'red';

        const height = topBottom[1] - topBottom[0];

        const y = (topBottom[0] + topBottom[1]) * 0.5;
        const ry = Math.max(10, rand.next(height * 0.25) );
        const rx = rand.next(4, 0.7 * ry);

        ctx.save();
        ctx.beginPath();

        var gradient = ctx.createRadialGradient(0, y, 0, 0, y, ry);
        var col1 = (rand.next().toString(16) + '000000').substr(2, 6);
        
        var r = col1.substr(0, 2);
        var g = col1.substr(2, 2);
        var b = col1.substr(4, 2);
        r = ('00' + Math.min(0xFF, parseInt(r, 16) * 2).toString(16) ).substr(-2);
        g = ('00' + Math.min(0xFF, parseInt(g, 16) * 2).toString(16) ).substr(-2);
        b = ('00' + Math.min(0xFF, parseInt(b, 16) * 2).toString(16) ).substr(-2);

        const col2 = '#' + r + g + b;

        col1 = '#' + col1;  
        gradient.addColorStop(0, col2);  
        gradient.addColorStop(1, col1);

        ctx.fillStyle = gradient;
        ctx.ellipse(0, y, rx, ry, 0, 0, Math.PI * 2);

        ctx.transform(rx / ry, 0, 0, 1, 0, 0);

        ctx.fill();
        ctx.restore();
      }

  static drawPolygon(ctx, points) {
        ctx.moveTo(points[0].x, points[0].y);

        for (var i = 0, len = points.length; i < len; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      }

  static drawSmoothPolygon(ctx, points) {
        const len = points.length - 1;

        const xc = (points[len - 1].x + points[0].x) * 0.5;
        const yc = (points[len - 1].y + points[0].y) * 0.5;
        ctx.moveTo(xc, yc);

        for (var i = 0; i < len; i++)
        {
          const xc = (points[i].x + points[i + 1].x) * 0.5;
          const yc = (points[i].y + points[i + 1].y) * 0.5;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
      }

  static drawOrtPolygon(ctx, points) {
        ctx.moveTo(points[0].x, points[0].y);

        for (var i = 0, len = points.length - 1; i < len; i++) {
          const x = (points[i].x + points[i + 1].x) * 0.5;
          ctx.lineTo(x, points[i].y);
          ctx.lineTo(x, points[i + 1].y);
        }
        const x = (points[i].x + points[0].x) * 0.5;
        ctx.lineTo(x, points[i].y);
        ctx.lineTo(x, points[0].y);
      }

  static gradient(ctx, maxWidth, rand, col2) {
        const grd = ctx.createLinearGradient(-maxWidth, 0, maxWidth, 0);
        const col1 = '#' + (rand.next().toString(16) + "000000").substr(2, 6);
        col2 = col2 || '#' + (rand.next().toString(16) + "000000").substr(2, 6);
        grd.addColorStop(0, col1);
        grd.addColorStop(0.5, col2);
        grd.addColorStop(1, col1);

        return grd;
  }

}
