class Minimap {
	constructor(map) {
		this.map = map;

		this.width = map.canvas.width;
		this.height = map.canvas.height;

		map.canvas.style.borderRadius = this.width + 'px';

		this.map.translate(this.width * 0.5, this.height * 0.5);

		const minAsterodOrbitR = 10900;
		const maxAsterodOrbitR = 14200;

		this.asteroidBeltWidth = maxAsterodOrbitR - minAsterodOrbitR;
		this.averageAsterodOrbitR = minAsterodOrbitR + this.asteroidBeltWidth * 0.5;

		this.scale = 0.01;

		this.asteroidBeltWidth *= this.scale;
		this.averageAsterodOrbitR *= this.scale;
	}

	draw() {
		this.map.clearRect(-0.5 * this.width, -0.5 * this.height, this.width, this.height);

		this.drawAsteroidBelt();
		this.drawOrbits();
		this.drawOrbs();
		this.drawBodies();
	}

	drawAsteroidBelt() {
		const map = this.map;

		const x = (camera.x - halfW) * this.scale;
		const y = (camera.y - halfH) * this.scale;

		map.strokeStyle = '#774400';
		map.globalAlpha = 0.5;
		map.lineWidth = this.asteroidBeltWidth;
		map.beginPath();
		map.arc(x, y, this.averageAsterodOrbitR, 0, Math.TWO_PI);
		map.stroke();
		map.globalAlpha = 1;
	}

	drawOrbits() {
		const map = this.map;

		for (var i in Orb.list) {
			const o = Orb.list[i];

			if (o instanceof Star) {
				continue;
			}

			const r = o.orbitRadius * this.scale;

			const x = (o.parent.drawX - halfW) * this.scale / Orb.DEPTH;
			const y = (o.parent.drawY - halfH) * this.scale / Orb.DEPTH;

			map.strokeStyle = o.orbitColor;
			map.lineWidth = 1;
			map.beginPath();
			map.arc(x, y, r, 0, Math.TWO_PI);
			map.stroke();		
		}
	}

	drawOrbs() {
		const map = this.map;

		for (var i in Orb.list) {
			const o = Orb.list[i];

			const x = (o.drawX - halfW) * this.scale / o.depth;
			const y = (o.drawY - halfH) * this.scale / o.depth;

			map.fillStyle = o.iconColor;
			const radius = o.iconRadius;

			map.beginPath();
			map.arc(x, y, radius, 0, Math.TWO_PI);
			map.fill();
		}
	}

	drawBodies() {
		const map = this.map;

		for (var i in Icon.list) {
			const icon = Icon.list[i];

			const x = (icon.drawX - halfW) * this.scale;
			const y = (icon.drawY - halfH) * this.scale;

			map.fillStyle = icon.color;
			map.beginPath();
			map.arc(x, y, 2, 0, Math.TWO_PI);
			map.fill();
		}
	}

}
