class Star extends Orb {
	constructor(texture) {
		super(texture);

        this.sprite.pluginName = 'picture';
	}

	generate() {
		const width = 1024, height = width;
		
		const buffer = this.createTexture(width, height);

		// create off-screen canvas element
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

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

		ldb.set('star', dataUri);
	}

	createTexture(w, h) {
		const roughness = rand.next() * 8 + 5;
        const val = [];
        for (var i = 0; i <= w; i++) {
        	val[i] = [];
        }
        val[0][0] = val[0][h] = val[w][0] = val[w][h] = rand.next() * ((400 * roughness) | 0) * 0.01;
        var max = -Number.MAX_VALUE, min = Number.MAX_VALUE;
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
                    if (min > val[i][j]) {
                        min = val[i][j];
                    }
                    if (max < val[i][j]) {
                        max = val[i][j];
                    }
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
                    if (min > val[i0][j]) {
                        min = val[i0][j];
                    }
                    if (max < val[i0][j]) {
                        max = val[i0][j];
                    }

                    A = j - l2 < 0 ? val[i][h - l] : val[i][j - l2];

                    B = val[i0][j0];

                    C = val[i][j];

                    D = val[i + l][j0];

                    val[i][j - l] = (A + B + C + D) * 0.25 + (rand.next() * 2 * l - l) * k2;
                    if (min > val[i][j0]) {
                        min = val[i][j0];
                    }
                    if (max < val[i][j0]) {
                        max = val[i][j0];
                    }
                }
            }

            for (var i = l; i <= h; i += l2) {
                val[w][i] = val[0][i];
            }

            for (var i = l; i <= w; i += l2) {
                val[i][h] = val[i][0];
            }
        }
        var rand1 = Math.pow(2, rand.next() * 4 - 2), rand2 = Math.pow(2, rand.next() * 4 - 2), rand3 = Math.pow(2, rand.next() * 4 - 2);

        var m = Math.max(rand1, rand2, rand3);
        rand1 /= m;
        rand2 /= m;
        rand3 /= m;

        var delta = (max - min) * 1.2;
        const c = new Uint8ClampedArray(w * h * 4);
        for (var i = 0; i < w; i++) {
            for (var j = 0; j < h; j++) {
                const col = ((val[i][j]) - min) / delta;
                const pos = i + j * w;
		        c.setPixel(pos, ((col * rand1 + 0.2) * 512) | 0, ((col * rand2 + 0.2) * 512) | 0, ((col * rand3 + 0.2) * 512) | 0, 255);
            }
        }

        return c;
	}

	load() {
		ldb.get('star', dataUri => {
			const texture = PIXI.Texture.fromImage(dataUri);
			this.setTexture(texture);
		});
	}

	setTexture(texture) {
		var uniforms = {};
		uniforms['texture'] = texture;
		
		//Create our Pixi filter using our custom shader code
		this.sprite['shader'] = new PIXI.Filter('', Star.shaderCode, uniforms);
	}

	update() {
		super.update();
	}

    get iconColor() {
        return '#FFFF00';
    }
    get iconRadius() {
        return 8;
    }
}
Star.shaderCode = document.getElementById("starShader").innerHTML;
