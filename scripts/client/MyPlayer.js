class MyPlayer extends Player {
  constructor(pack, trailTexture) {
    super(pack, trailTexture);

    Object.assign(this, {
      inputFromMouse: false,
      rotationSyncTimer: 1,
      target: null,
      targetReached: false,
    });
  }

  update() {
    super.update();
    
    if (this.destination) {
      this.goToDestination(this.destination);
      this.emitTargetAngle();
    } else {
      this.setTargetAngle(mouseX, mouseY);
    }
  }

  collectItem(item) {
    super.collectItem(item);

    Interface.addItem(item['index'], Item.list[item['ID']]);
  }
  
  setTargetAngle(x, y) {
    if (!this.destination) {
      this.body.targetAngle = Math.atan2(y - this.body.drawY, x - this.body.drawX);
      this.emitTargetAngle();
    }
  }

  emitTargetAngle() {
    if ((this.rotationSyncTimer += dt) > 1) {
      inputChannel.send( JSON.stringify({'angle': this.body.targetAngle}) );
      this.rotationSyncTimer--;
    }
  }

  startInputFromKeyboard() {
    if (this.body.targetAngle) {
      inputChannel.send( JSON.stringify({'angle': null}) );

      this.body.targetAngle = null;
    }
  }

  goToDestination({x, y}) {
    const ship = this.body;
    const sX = x - ship.x, sY = y - ship.y;
    
    this.targetReached = Math.abs(sX) + Math.abs(sY) < 100;
    if (this.targetReached && this.destination === Orb.station && !this.landed) {
      socket.emit('landing', Orb.station.ID);
      this.destination = {x: this.destination.x, y: this.destination.y};
    }

    if (ship.pressingDown) {
      return;
    }

    const s = Math.sqrt(sX * sX + sY * sY);
    const snX = sX / s, snY = sY / s;
    const spd = ship.speed + 1;
    const destVX = snX * spd - 0.2 * ship.speedX;
    const destVY = snY * spd - 0.2 * ship.speedY;

    ship.targetAngle = Math.atan2(destVY, destVX);
    
    this.pressUp( Math.abs( Math.ang(ship.targetAngle - ship.rotation) ) < 0.1);

    const decel = spd * spd * 0.5 / s;

    this.pressDown(ship.pressingUp && (s < 100 || decel >= ship.maxAccel));
  }
  
  die() {
    super.die();
    setTimeout(() => {
      app.ticker.stop();
      respawnDiv.style.display = 'inline-block';
    }, 2000);
  }

  respawn(data) {
    super.respawn(data);
    
    this.body.startDraw();
    
    centerCamera();
    app.ticker.start();
    this.destination = null;
    respawnDiv.style.display = 'none';
    camera.lookAt(this.body);
  }

  stopLanding() {
    super.stopLanding();

    showLandedUI();

    camera.x = camera.y = NaN;
    app.ticker.stop();
    this.orb.landResponse();

    Item.clearEquipment(); //delete useless equipment info
    Item.delImages(); //delete useless item images from the database
  }

  startTakingOff() {
    this.orb.takeOffResponse();
    app.ticker.start();

    // wait until orbs update
    setTimeout(() => {
      showSpaceUI();

      super.startTakingOff();

      centerCamera();
    }, 100);
  }

  pressUp(state, e) {
    if (state && e) {
      if (e.ctrlKey) {
        this.destination = {x: mouseX - camera.x, y: mouseY - camera.y};
      } else {
        this.destination = null;
      }

      this.pressDown(false);
    }

    if (this.destination) {
      this.pressDown(false);
    }

    if (this.body.pressingUp !== state) {
      socket.emit('input', {'inputID': 'up', 'state': state});
      this.body.pressingUp = state;
    }
  }

  pressDown(state) {
    if (this.body.pressingDown !== state) {
      socket.emit('input', {'inputID': 'down', 'state': state});
      this.body.pressingDown = state;
    }
  }

  pressAttack(state) {
    this.destination = null;

    if (this.body.pressingAttack !== state) {
      socket.emit('input', {'inputID': 'fire', 'state': state});
      this.body.pressingAttack = state;
    }
  }

  static addSocketListeners1(socket) {
    socket.on('remove', data => {
      const player = Controller.list[data];
      if (player) {
        player.remove();
      }
    });

    socket.once('seed', data => {
      rand = new Random(seed = data);

      Universe.start();
    });

    socket.once('init', data => {
      const {'allInfo': info, 'items': items, 'myID': myID, 'myItems': myItems, 'seed': systemSeed} = data;

      for (var i = 0, len = info.length; i < len; i++) {
        switch (info[i]['type']) {
          case 'Player':
          const ID = info[i]['data']['controller']['ID'];

          if (ID === myID) {
            player = new MyPlayer(info[i]['data'], images.trail);
          } else {
            new Player(info[i]['data'], images.trail);
          }
          break;
          case 'Enemy':
          new Enemy(info[i]['data']);
          break;
          case 'AsteroidController':
          new AsteroidController(info[i]['data'], 'client/asteroid.png', shipExp);
          break;
        }
      }

      for (i = 0, len = items.length; i < len; i++) {
        new Item(items[i]);
      }

      Interface.initInventory(myItems);

      startGame();

      MyPlayer.addSocketListeners2(socket);
    });
  }

  static addSocketListeners2(socket) {
    socket.on('target', data => {
      const npc = Controller.list[data['ID']];

      if (npc) {
        npc.body.pressingAttack = !!data['target'];
      }
    });

    socket.on('playerJoined', data => {
      new Player(data, images.trail);
    });

    socket.on('input', data => {
      const p = Controller.list[data['ID']];
      if (!p) {
        return;
      }

      const ship = p.body;

      if (!ship) {
        return;
      }

      const input = data['data'];

      switch (input['inputID']) {
        case 'fire':
        ship.pressingAttack = !!input['state'];
        break;
        case 'up':
        ship.pressingUp = !!input['state'];
        break;
        case 'down':
        ship.pressingDown = !!input['state'];
        break;
      }
    });

    socket.on('hitInfo', data => {
      const ship = GameBody.list[data['ship']];
      const target = GameBody.list[data['target']];

      if (!ship || !target || target.ID === player.ID) {
        return;
      }

      for (var i = -3, bullet; i != 4; i++) {
        const [weaponID, bulletIndex] = data['bullet'].split('|');
        bullet = ship.bullets[weaponID + '|' + (+bulletIndex + i)];

        if (bullet && bullet.getSqrDistance(target) < 10000) {
          bullet.explode(target);
        }
      }
    });

    socket.on('icons', data => {
      for (var i = 0, len = data['data'].length; i < len; i++) {
        const newIcon = data['data'][i];
        var icon = Icon.list[newIcon['ID']], cont = Controller.list[newIcon['ID']];
        
        if(!cont) {
          return;
        }

        if (!icon) {
          const type = cont.constructor;
          icon = Icon.list[newIcon['ID']] = new Icon(type);
        }

        icon.x = newIcon['x'];
        icon.y = newIcon['y'];
        icon.syncID = data['ID'];
      }

      Icon.clear(data['ID']);
      minimap.draw();
    });

    socket.on('money', data => {
      const p = Controller.list[data['ID']];
      p.money = data['money'];
    });

    socket.on('spawned', data => {
      switch (data['type']) {
        case 'Enemy':
        new Enemy(data['data']);
        break;
        case 'AsteroidController':
        new AsteroidController(data['data'], '/client/asteroid.png', shipExp);
        break;
      }
    });

    socket.on('die', data => {
      const s = Controller.list[data];
      
      if (s) {
        s.die();
      }
    });

    socket.on('respawned', data => {
      const player = Controller.list[data['controller']['ID']];
      if (player) {
        player.respawn(data);
      } else {
        new Player(data, images.trail);
      }
    });

    socket.on('drop', data => {
      new Item(data);
    });

    socket.on('collect', data => {
      if (Item.list[data['item']['ID']]) {
        if (data['player']) {
          Controller.list[data['player']].collectItem(data['item']);
        } else {
          Item.list[data['item']['ID']].die();
        }
      }
    });

    socket.on('land', data => {
      if (!player.landed) {
        Player.list[data['player']].startLanding(data['orb']);
      }
    });

    socket.on('takeOff', data => {
      Player.takeOff(data);
    });

    socket.on('crafted', data => {
      Interface.craft(data);
    });

    socket.on('updEquipmnt', data => {
      const player = Controller.list[data['ship']];
      if (!player) {
        return;
      }
      
      const ship = player.body;
      const {'index': index, 'item': item} = data;

      switch (data['compID']) {
        case 'weapons':
        ship.weapons[index] = item;
        break;
        case 'engines':
        ship.setEquipment('engines', index, item);
        ship.engines[index] = item;
        break;
        case 'other':
        ship.setEquipment('other', index, item);
        ship.other[index] = item;
        break;
      }
    });

    socket.on('changeShip', data => {
      if (data === 'same') {
        Interface.alert('You can`t change your ship to the same one');
        return;
      }
      if (data === 'notEmpty') {
        Interface.alert('You must unequip all equipment from your ship before changing one');
        return;
      }

      const pl = Controller.list[data['ID']];
      
      pl.body.setSlotCounts( JetSpaceShip.getSlotCounts(data['level']) );
      pl.body.setHP( JetSpaceShip.getMaxHP(data['level']) );

      SpaceShip.getTexture(data['level'] - 1, pl.level, texture => {
        pl.body.sprite.texture = texture;
      });

      if (pl === player) {
        player.money -= JetSpaceShip.getPrice(data['level']);
        Interface.updateEquipment();
      }
    });

    socket.on('addToChat', data => {
      chatText.innerHTML += '<div>' + data + '</div>';

      if (chatText.childElementCount > 20) {
        chatText.removeChild(chatText.firstChild);
      }

      chatText.scrollTop = chatText.scrollHeight;
    });

    socket.on('evalAnswer', data => {
      console.log( CircularJSON.parse(data) );
    });

    socket.on('pongg', data => {
      tcpPing.check(data);
    });
  }

}
