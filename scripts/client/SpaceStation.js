class SpaceStation extends Orb {
	constructor(texture, parent, startAngle, speed, orbitRadius) {
		super(texture, parent, startAngle, speed, orbitRadius);

        this.sprite.pluginName = 'picture';
		
		this.uniforms = {
			'over': 0
		}

		this.sprite['shader'] = new PIXI.Filter('', SpaceStation.shaderCode, this.uniforms);
		this.sprite.interactive = true;
		this.sprite['mouseover'] = () => this.mouseOver();
		this.sprite['mouseout'] = () => this.mouseOut();
	}

	loadInterface() {
		this.interface = new StationInterface();
	}

	landResponse() {
		this.interface.show();
	}

	takeOffResponse() {
		this.interface.hide();
	}

	mouseOver() {
		this.uniforms['over'] = 1;
		this.hover = true;
	}

	mouseOut() {
		this.uniforms['over'] = 0;
		this.hover = false;
	}

	update() {
		super.update();
		this.rotation += 0.002;
	}

    get iconColor() {
        return '#00FF00';
    }

    get orbitColor() {
    	return '#00EE00';
    }

    get depth() {
    	return 0.36;
    }
}
SpaceStation.shaderCode = document.getElementById("stationShader").innerHTML;
