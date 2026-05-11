class MyShip extends JetSpaceShip {
	constructor(ID, pack, pilot, texture, bulletTexture, trailTexture) {
		super(ID, pack, pilot, texture, bulletTexture, trailTexture);
	}

	updateSpeed() {
		if (synchronizing) {
			return;
		}

		if (this.pressingUp && this.pressingDown) {

			if (this.speedX !== 0 || this.speedY !== 0) {
				const sqrSpeed = this.sqrSpeed;

				if (sqrSpeed < this.maxAccel * this.maxAccel) {
					this.speedX = this.speedY = 0;
				} else {
					const k = this.maxAccel / Math.sqrt(sqrSpeed);

					this.speedX -= this.speedX * k;
					this.speedY -= this.speedY * k;
				}
			}
		} else if (this.pressingUp) {
			this.speedX += this.maxAccel * Math.cos(this.rotation) * dt;
			this.speedY += this.maxAccel * Math.sin(this.rotation) * dt;

			this.cutSpeed();
		} else if (this.pressingDown) {
			this.speedX -= this.maxAccel * Math.cos(this.rotation) * dt;
			this.speedY -= this.maxAccel * Math.sin(this.rotation) * dt;

			this.cutSpeed();
		}
	}

	updateAngleSpeed() {
		if (this.targetAngle) {

			const t = Math.abs(this.angleSpeed / this.angleAccel);
			const deltaAng = Math.ang(this.targetAngle - this.rotation);
			const delta = t === 0 ? 
			( Math.abs( Math.ang(this.rotation - this.targetAngle)) < this.angleAccel ? 
				0 : 
				(deltaAng > 0 ? 
					-Number.MAX_VALUE : 
					Number.MAX_VALUE)) : 
			(this.angleSpeed - deltaAng * 2 / t);

			if (Math.abs(delta) > this.angleAccel) {
				if (delta < 0) {
					this.angleSpeed += this.angleAccel * dt;
				} else {
					this.angleSpeed -= this.angleAccel * dt;
				}
			} else {
				this.angleSpeed -= Math.min( Math.abs(this.angleSpeed), this.angleAccel * dt) * Math.sign(this.angleSpeed);

				if (Math.abs(this.angleSpeed) < this.angleAccel) {
					this.angleSpeed = 0;
					this.rotation = this.targetAngle;
				}
			}
		} else {
			if (this.pressingRight && this.pressingLeft) {
				this.angleSpeed -= Math.min( Math.abs(this.angleSpeed), this.angleAccel * dt) * Math.sign(this.angleSpeed);
			} else {
				const t = Math.abs(this.angleSpeed / this.angleAccel),
				deltaAng = this.angleSpeed * t;

				if (deltaAng < Math.PI && this.pressingRight) {
					this.angleSpeed += this.angleAccel * dt;
				} else if (deltaAng > -Math.PI && this.pressingLeft) {
					this.angleSpeed -= this.angleAccel * dt;
				}
			}
		}
	}

	updateBullets() {
		for (var i in this.bullets) {
			const bullet = this.bullets[i];

			bullet.update();

			if (bullet.decaing) {
				continue;
			}

			for (var j in GameBody.list) {
				if (j === this.ID) {
					continue;
				}

				const body = GameBody.list[j];

				if (!body.alife) {
					continue;
				}

				const dx = bullet.x - body.trueX;
				const dy = bullet.y - body.trueY;
				const radiusSum = bullet.radius + body.radius;

				if (dx * dx + dy * dy > radiusSum * radiusSum) {
					continue;
				}

				socket.emit('hit', {
					'bullet': i,
					'target': j
				});
				
				body.hit(bullet.damage);

				bullet.explode();

				break;
			}
		}
	}

}
