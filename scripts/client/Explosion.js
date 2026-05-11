class Explosion {
  constructor(texture, settings) {
    this.settings = settings;
    this.texture = texture;
  }
  
  explode(x, y) {
    const ID = Math.random();

    const explosionContainer = new PIXI.Container();
    container.addChild(explosionContainer);

    // Create a new emitter
    const emitter = new PIXI.particles.Emitter(

      // The PIXI.Container to put the emitter in
      // if using blend modes, it's important to put this
      // on top of a bitmap, and not use the root stage Container
      explosionContainer,

      // The collection of particle images to use
      [this.texture],

      // Emitter configuration, edit this to change the look
      // of the emitter
      this.settings
    );

    // Start emitting
    emitter.emit = true;

    Explosion.list[ID] = () => {
      explosionContainer.x = x + camera.x;
      explosionContainer.y = y + camera.y;
      emitter.update(dt * 0.04);
    };

    setTimeout(() => {
      //emitter.destroy();
      container.removeChild(explosionContainer);
      delete Explosion.list[ID];
    }, emitter['maxLifetime'] * 1000);
  }

  static update() {
    for (var i in Explosion.list) {
      Explosion.list[i]();
    }
  }

  static getBulletSettings(ID) {
    if (ID in Item.catalog) {
      return Explosion.bulletSettings;
    }

    const seed = +ID.replaceAll(/\.|\|/, '');
    const rand = new Random(seed);
    const color = '#' + (rand.next().toString(16) + "000000").substr(2, 6);

    const result = Object.create(Explosion.bulletSettings);

    result['color']['end'] = color;

    return result;
  }

  static getShipSettings(seed) {
    if (seed === 0) {
      return Explosion.shipSettings;
    }
    
    const rand = new Random(seed);
    const color = '#' + (rand.next().toString(16) + "000000").substr(2, 6);

    const result = Object.create(Explosion.shipSettings);

    result['color']['end'] = color;

    return result;
  }
}
Explosion.bulletSettings = {
  "alpha": {
    "start": 1,
    "end": 0
  },
  "scale": {
    "start": 0.2,
    "end": 0.5,
    "minimumScaleMultiplier": 1
  },
  "color": {
    "start": "#FFFFFF",
    "end": "#FF0000"
  },
  "speed": {
    "start": 200,
    "end": 50,
    "minimumSpeedMultiplier": 1
  },
  "acceleration": {
    "x": 0,
    "y": 0
  },
  "maxSpeed": 0,
  "startRotation": {
    "min": 0,
    "max": 360
  },
  "noRotation": false,
  "rotationSpeed": {
    "min": 0,
    "max": 0
  },
  "lifetime": {
    "min": 0.2,
    "max": 0.8
  },
  "blendMode": "normal",
  "frequency": 0.001,
  "emitterLifetime": 0.01,
  "maxParticles": 500,
  "pos": {
    "x": 0,
    "y": 0
  },
  "addAtBack": false,
  "spawnType": "circle",
  "spawnCircle": {
    "x": 0,
    "y": 0,
    "r": 0
  }
}
Explosion.shipSettings = {
  "alpha": {
    "start": 1,
    "end": 0
  },
  "scale": {
    "start": 0.4,
    "end": 1,
    "minimumScaleMultiplier": 1
  },
  "color": {
    "start": "#FFFFFF",
    "end": "#0000FF"
  },
  "speed": {
    "start": 200,
    "end": 50,
    "minimumSpeedMultiplier": 1
  },
  "acceleration": {
    "x": 0,
    "y": 0
  },
  "maxSpeed": 0,
  "startRotation": {
    "min": 0,
    "max": 360
  },
  "noRotation": false,
  "rotationSpeed": {
    "min": 0,
    "max": 0
  },
  "lifetime": {
    "min": 0.2,
    "max": 1.5
  },
  "blendMode": "normal",
  "frequency": 0.001,
  "emitterLifetime": 0.2,
  "maxParticles": 500,
  "pos": {
    "x": 0,
    "y": 0
  },
  "addAtBack": false,
  "spawnType": "circle",
  "spawnCircle": {
    "x": 0,
    "y": 0,
    "r": 0
  }
}
Explosion.list = {};
