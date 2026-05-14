class SpaceShip extends GameBody {
  constructor(ID, pilot, x, y, maxHP) {
    super(ID, pilot, x, y, 50, maxHP, 500, undefined, undefined, undefined, {bulletID: 0});

    Object.assign(this, {
      _pressingUp: false,
      _pressingDown: false,
      pressingRight: false,
      pressingLeft: false,
      pressingAttack: false,
      inventorySize: 36,
      weapons: [],
      engines: [],
      other: [],
      repair: 0,
      maxAccel: 0,
      maxSpeed: 0,
      angleAccel: 0,
      targetAngle: 0,
      bullets: {}
    });
    
    this.reachedDist = 100;
  }

  update25() {
    super.update25();

    this.updateFire();
    this.updateSpeed();
    this.updateAngleSpeed();

    if (this.destination) {
      this.goToDestination(this.destination);
    }
  }

  update1() {
    super.update1();
    
    this.updateHP();
  }

  updateAngleSpeed() {
    if (this.targetAngle !== null) {
      const t = Math.abs(this.angleSpeed / this.angleAccel);
      const deltaAng = Math.ang(this.targetAngle - this.rotation);
      const delta = t === 0 ? (Math.abs( Math.ang(this.rotation - this.targetAngle)) < this.angleAccel ? 0 : (deltaAng > 0 ? -Number.MAX_VALUE : Number.MAX_VALUE)) : (this.angleSpeed - deltaAng * 2 / t);
      
      if (Math.abs(delta) > this.angleAccel) {
        if(delta < 0) {
          this.angleSpeed += this.angleAccel;
        } else {
          this.angleSpeed -= this.angleAccel;
        }
      } else {
        this.angleSpeed -= Math.min( Math.abs(this.angleSpeed), this.angleAccel) * Math.sign(this.angleSpeed);
        
        if (Math.abs(this.angleSpeed)<this.angleAccel) {
          this.angleSpeed = 0;
          this.rotation = this.targetAngle;
        }
      }
    } else if (this.pressingRight && this.pressingLeft) {
      this.angleSpeed -= Math.min( Math.abs(this.angleSpeed), this.angleAccel) * Math.sign(this.angleSpeed);
    } else {
      const t = Math.abs(this.angleSpeed / this.angleAccel),
      deltaAngle = this.angleSpeed * t;

      if(this.pressingRight && deltaAngle < Math.PI) {
        this.angleSpeed += this.angleAccel;
      } else if (this.pressingLeft && deltaAngle > -Math.PI) {
        this.angleSpeed -= this.angleAccel;
      }
    }
  }

  updateSpeed() {
    if (this.pressingUp && this.pressingDown) {

      if (this.speedX !== 0 || this.speedY !== 0) {

        if (this.sqrSpeed < this.maxAccel * this.maxAccel) {
          this.speedX = this.speedY = 0;
        } else {
          const k = this.maxAccel / this.speed;

          this.speedX -= this.speedX * k;
          this.speedY -= this.speedY * k;
        }
      }
    } else if (this.pressingUp) {
      this.speedX += this.maxAccel * Math.cos(this.rotation);
      this.speedY += this.maxAccel * Math.sin(this.rotation);

      this.cutSpeed();
    } else if (this.pressingDown) {
      this.speedX -= this.maxAccel * Math.cos(this.rotation);
      this.speedY -= this.maxAccel * Math.sin(this.rotation);

      this.cutSpeed();
    }
  }

  updateFire() {
    for (var i = 0; i < this.weapons.size; i++) {
      if (this.weapons[i]) {
        this.weaponInfo[i].timer++;
        if (this.pressingAttack) {
          Weapon.fire(this, this.weapons[i].type, i);
        }
      }
    }
  }

  updateHP() {
    if (this.HP < this.maxHP) {
      this.HP += this.repair;
    } else {
      this.HP = this.maxHP;
    }
  }

  reset() {
    this.pressingAttack = false;
    this.pressingDown = false;
    this.pressingLeft = false;
    this.pressingRight = false;
    this.pressingUp = false;
    this.bulletID = 0;
    this.HP = this.maxHP;
    this.speedX = 0;
    this.speedY = 0;
    this.angleSpeed = 0;
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

  goToDestination({x, y}) {
    const sX = x - this.x, sY = y - this.y;
    
    this.targetReached = Math.abs(sX) + Math.abs(sY) < this.reachedDist;

    if (this.pressingDown) {
      if (this.targetReached || this.sqrSpeed < 1) {
        this.delDestination();
      }

      return;
    }

    const s = Math.sqrt(sX * sX + sY * sY);
    const snX = sX / s, snY = sY / s;
    const spd = this.speed + 1;
    const destVX = snX * spd - 0.2 * this.speedX;
    const destVY = snY * spd - 0.2 * this.speedY;

    this.targetAngle = Math.atan2(destVY, destVX);
    
    this.pressingUp = Math.abs( Math.ang(this.targetAngle - this.rotation) ) < 0.5;

    const decel = spd * spd * 0.5 / s;

    this.pressingDown = this.pressingUp && (s < this.reachedDist || decel >= this.maxAccel);
  }

  delDestination() {
    this.pressingDown = false;
    this.pressingUp = false;
    this.destination = null;
  }

  setSlotCounts(slots) {
    [
      this.weapons.size,
      this.engines.size,
      this.other.size
    ] = slots;

    this.weaponInfo = [];
    const step = 33 / ((this.weapons.size / 2) | 0), start = +(this.weapons.size % 2 === 0);
    for (var i = 0, j = start, bullY; i < this.weapons.size; i++, ((j *= -1) >= 0) && j++) {
      bullY = -j * step || 0;
      this.weaponInfo[i] = {timer: 1000, x: 33, y: bullY};
    }
  }

  setEquipment(compID, index, item) {
    switch (compID) {
      case 'engines':
      if (this.engines[index]) {
        Engine.unequip(this, this.engines[index]['type']);
      }
      Engine.equip(this, item['type']);
      break;
      case 'other':
      if (this.other[index]) {
        Other.unequip(this, this.other[index]['type']);
      }
      Other.equip(this, item['type']);
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

  compIsEmpty(comp) {
    for (var i = 0; i < comp.size; i++) {
      if (comp[i]) {
        return false;
      }
    }

    return true;
  }

  updateSyncInfo() {
    Object.assign(this.syncInfo, {
      'ID': this.ID,
      'x': this.x,
      'y': this.y,
      'HP': this.HP,
      'bulletID': this.bulletID,
      'speedX': this.speedX,
      'speedY': this.speedY,
      'rotation': this.rotation,
      'angleSpeed': this.angleSpeed
    });
  }

  setHP(HP) {
    this.HP = this.maxHP = HP;
  }

  get isEmpty() {
    if ( !this.compIsEmpty(this.weapons) ) {
      return false;
    }
    if ( !this.compIsEmpty(this.engines) ) {
      return false;
    }
    if ( !this.compIsEmpty(this.other) ) {
      return false;
    }

    return true;
  }

  get items() {
    if (Math.random() > 0.5) {
      return [];
    }

    var elem;

    switch ( (Math.random() * 3) | 0) {
      case 0: elem = Weapon.createElement; break;
      case 1: elem = Engine.createElement; break;
      case 2: elem = Other.createElement; break;
    }

    return [elem(this.controller.level, null, -1)];
  }

  get firstInfo() {
    return {
      'x': this.x,
      'y': this.y,
      'maxHP': this.maxHP,
      'weapons': this.weapons,
      'engines': this.engines,
      'other': this.other,
      'weaponCount': this.weapons.size,
      'engineCount': this.engines.size,
      'otherCount': this.other.size
    };
  }

  get info() {
    return {
      'x': this.x,
      'y': this.y,
      'speedX': this.speedX,
      'speedY': this.speedY,
      'HP': this.HP,
      'maxHP': this.maxHP,
      'bulletID': this.bulletID,
      'angleSpeed': this.angleSpeed,
      'rotation': this.rotation,
      'firing': this.pressingAttack,
      'weapons': this.weapons,
      'engines': this.engines,
      'other': this.other,
      'weaponCount': this.weapons.size,
      'engineCount': this.engines.size,
      'otherCount': this.other.size
    };
  }

  get pressingUp() {
    return this._pressingUp;
  }
  set pressingUp(value) {
    this._pressingUp = value;
  }

  get pressingDown() {
    return this._pressingDown;
  }
  set pressingDown(value) {
    this._pressingDown = value;
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

  static get randomPosition() {
    var res = [];

    do {
      res = [10000 * (Math.random() * 2 - 1),
      10000 * (Math.random() * 2 - 1)];
    } while (Math.abs(res[0]) < 2000 && Math.abs(res[1]) < 2000);

    return res;
  }

}
