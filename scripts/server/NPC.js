class NPC extends Controller {
  update_20() {
    super.update_20();

    if (!this.body.visible) {
      this.body.die();
    }
  }

  static spawnAll() {
    Enemy.spawn();
    AsteroidController.spawn();
  }

  static spawn() {
    if (this.count >= this.MAX_COUNT) {
      return;
    } 

    sp: for (var i in this.playerList) {
      const ship = GameBody.list[i];      

      if (!ship || Math.random() > this.spawnRate) {
        continue;
      }

      const x = ship.x + this.MAX_SPAWN_DISTANCE * (Math.random() * 2 - 1);
      const y = ship.y + this.MAX_SPAWN_DISTANCE * (Math.random() * 2 - 1);

      for (var j in GameBody.list) {
        const p = GameBody.list[j];

        if (Math.abs(p.x - x) < SpaceObject.VISIBLE_DISTANCE && Math.abs(p.y - y) < SpaceObject.VISIBLE_DISTANCE) {
          continue sp;
        }
      }

      const dist = ship.distToStation;

      const level = this.getLevel(dist);

      const npc = new this( Math.random(), x, y, level);

      if (npc.body.HP > 0) {
        io.emit('spawned', {
            'type': this.name,
            'data': npc.allFirstInfo
        });
      }
    }
  }

  static getLevel(dist) {
    return 1;
  }

}
NPC.spawnRate = 1;
NPC.count = 0;
NPC.MAX_COUNT = 0;
NPC.MAX_SPAWN_DISTANCE = 2000;
NPC.playerList = {};
