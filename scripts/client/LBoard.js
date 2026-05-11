class LBoard {
  constructor() {
    this.players = [];
  };
  
  add(name, score) {
    score || (score = 0);
    for(var i = 0,len = this.players.length; i != len; i++) {
      if(score > this.players[i].score) {
        break;
      }
    }
    const p = this.players[i];
    const n = p ? lList.innerHTML.search(p.name + ': ' + p.score) : lList.innerHTML.length;
    this.players.splice(i, 0, {name: name, score: score});
    lList.innerHTML = lList.innerHTML.slice(0, n) + name + ': ' + score + '<br>' + lList.innerHTML.slice(n);
  }
  
  del(name, score) {
    score || (score = 0);
    const str = name + ': ' + score + '<br>';
    const n = lList.innerHTML.search(str);

    if (n === -1) {
      return;
    }

    lList.innerHTML = lList.innerHTML.slice(0, n) + lList.innerHTML.slice(n + str.length);
    const i = this.players.map(e => e.name + e.score).indexOf(name + score);
    this.players.splice(i, 1);
  }
  
  update(name, oldScore, newScore) {
    this.del(name, oldScore);
    this.add(name, newScore);
  }
}
