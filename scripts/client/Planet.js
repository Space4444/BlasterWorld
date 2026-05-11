class Planet extends Orb {
	constructor(texture, parent, startAngle, speed, orbitRadius) {
		super(texture, parent, startAngle, speed, orbitRadius);

        this.sprite.pluginName = 'picture';

		this.uniforms = {
			'texture': null,
			'LightMap': null,
			'ShadowMap': null,
			'fi': [0, 0],
			'angle': 0,
			'atmosphere': 1
		}
	}

	generate() {
		const height = 512, width = height << 1;

		const buffer = this.createTexture(width, height);

		// create off-screen canvas element
		const canvas = document.createElement('canvas'),
		    ctx = canvas.getContext('2d');

		canvas.width = width;
		canvas.height = height;

		// create imageData object
		const idata = ctx.createImageData(width, height);

		// set our buffer as source
		idata.data.set(buffer);

		// update canvas with new data
		ctx.putImageData(idata, 0, 0);

		const dataUri = canvas.toDataURL(); // produces a PNG file

		const texture = PIXI.Texture.fromImage(dataUri);
		this.setTexture(texture);

		ldb.set(this.ID, dataUri);
	}

	load() {
		ldb.get(this.ID, dataUri => {
			const texture = PIXI.Texture.fromImage(dataUri);
			this.setTexture(texture);
		});
	}

	createTexture(w, h) {
		const roughness = Math.pow(rand.next(), 2) * 5 + 1;
        const val = [];
        for (var i = 0; i <= w; i++) {
        	val[i] = [];
        }
        val[0][0] = val[0][h] = val[w][0] = val[w][h] = rand.next() * ((400 * roughness) | 0) * 0.01;
        val[h][0] = val[h][h] = rand.next() * ((400 * roughness) | 0) * 0.01;

        var l2, i0, j0;
        var k1 = 2 * roughness / h * 0.01, k2 = 1.41 * roughness / h * 0.01;
        var A, B, C, D;

        for (var l = h >> 1; l != 0; l >>= 1) {
            l2 = l << 1;
            for (var i = l; i <= w; i += l2) {
                for (var j = l; j <= h; j += l2) {
                    A = val[i - l][j - l];
                    B = val[i + l][j - l];
                    C = val[i - l][j + l];
                    D = val[i + l][j + l];
                    val[i][j] = (A + B + C + D) * 0.25 + (rand.next() * 200 - 100) * l * k1;
                }
            }
            for (var i = l; i <= w; i += l2) {
                for (var j = l; j <= h; j += l2) {
                    i0 = i - l;
                    j0 = j - l;

                    A = i - l2 < 0 ? val[w - l][j] : val[i - l2][j];

                    B = val[i0][j0];

                    C = val[i][j];

                    D = val[i0][j + l];

                    val[i - l][j] = (A + B + C + D) * 0.25 + (rand.next() * 2 * l - l) * k2;

                    A = j - l2 < 0 ? val[i][h - l] : val[i][j - l2];

                    B = val[i0][j0];

                    C = val[i][j];

                    D = val[i + l][j0];

                    val[i][j - l] = (A + B + C + D) * 0.25 + (rand.next() * 2 * l - l) * k2;
                }
            }

            for (var i = l; i <= h; i += l2) {
                val[w][i] = val[0][i];
            }

            for (var i = l; i <= w; i += l2) {
                val[i][h] = val[i][0];
            }
        }

        var rand1 = rand.next(), rand2 = rand.next();
        const c = new Uint8ClampedArray(w * h * 4);
        for (var i = 0; i < w; i++) {
            for (var j = 0; j < h; j++) {
                const col = val[i][j];
                const pos = i + j * w;
                c.setPixel(pos, ((col % 1) * 256) | 0, (((col + rand1) % 1) * 256) | 0, (((col + rand2) % 1) * 256) | 0, 255);
            }
        }

        return c;
	}

	setTexture(texture) {
		texture.baseTexture.mipmap = false;

		this.uniforms['texture'] = texture;
		this.uniforms['LightMap'] = images.LightMap;
		this.uniforms['ShadowMap'] = images.ShadowMap;
		
		//Create our Pixi shader using our custom shader code
		this.sprite['shader'] = new PIXI.Filter('', Planet.shaderCode, this.uniforms);
	}

	update() {
		super.update();
		this.uniforms['fi'][0] += 0.00035 * dt;
		this.uniforms['fi'][1] += 0.0002 * dt;
		this.uniforms['angle'] = this.angle;
	}

    get iconColor() {
        return '#CCCCCC';
    }

    get orbitColor() {
    	return '#AAAAAA';
    }
}
Planet.shaderCode = document.getElementById("planetShader").innerHTML;
