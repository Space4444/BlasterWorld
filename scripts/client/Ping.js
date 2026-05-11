class Ping {
	constructor(request) {
		this.value = 100;
		this.array = new Array(Ping.LENGTH);
		this.array.fill(this.value);
		this.times = {};

		var id = 0;
		setInterval(() => {
			this.times[++id] = Date.now();
			request(id);
		}, 200);
	}
	check(id) {
        const time = this.times[id];
        if (!time) return;
        
	    const deltaTime = Date.now() - time;
	    this.value -= Ping.K * this.array.shift();
	    this.array.push(deltaTime);
	    this.value += Ping.K * deltaTime;
	    delete this.times[id];
	}
}
Ping.LENGTH = 4;
Ping.K = 1 / Ping.LENGTH;
