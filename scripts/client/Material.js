class Material {
	static draw(seed, level, ctx, type, callback) {
		const w = ctx.canvas.width, h = ctx.canvas.height;
		const rand = new Random(seed);

		ctx.translate(0.5 * w, 0.5 * h);
		ctx.rotate(Math.HALF_PI);

		Material.drawBase(rand, level, ctx, w, h, type);

		callback(ctx);
	}

	static drawBase(rand, level, ctx, w, h, type) {
		ctx.lineWidth = 1;
		Material.gradient(ctx, w * 0.25, type, level, rand);

		var numberOfSides = +level + 2;
		var star = false;

		if (numberOfSides > 8) {
			numberOfSides -= 5;
			star = true;
		}

		const radius = w * 0.25;

		ctx.beginPath();
		ctx.moveTo (radius * Math.cos(0), radius *  Math.sin(0));          

		for (var step = Math.TWO_PI / numberOfSides, angle = step; angle <= Math.TWO_PI; angle += step) {
			if (star) {
			    ctx.lineTo (0.5 * radius * Math.cos(angle - step * 0.5), 0.5 * radius * Math.sin(angle - step * 0.5) );
			}
		    ctx.lineTo (radius * Math.cos(angle), radius * Math.sin(angle) );
		}

		ctx.fill();
		ctx.stroke();
	}

	static gradient(ctx, r, type, level, rand) {
		var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, r);

		var fill1, stroke;

		switch (type) {
	        case 'weapon': fill1 = '#7F0000'; stroke = '#00FFFF'; break;
	        case 'engine': fill1 = '#00007F'; stroke = '#FFFF00'; break;
	        case 'other': fill1 = '#007F00'; stroke = '#FF00FF'; break;
	    }
        
        var r = fill1.substr(1, 2);
        var g = fill1.substr(3, 2);
        var b = fill1.substr(5, 2);
        r = ('00' + Math.min(0xFF, parseInt(r, 16) + 0x7F).toString(16) ).substr(-2);
        g = ('00' + Math.min(0xFF, parseInt(g, 16) + 0x7F).toString(16) ).substr(-2);
        b = ('00' + Math.min(0xFF, parseInt(b, 16) + 0x7F).toString(16) ).substr(-2);

        const fill2 = '#' + r + g + b;

        gradient.addColorStop(0, fill2);  
        gradient.addColorStop(1, fill1);

		ctx.fillStyle = gradient;
		ctx.strokeStyle = stroke;
	}
}
Material.catalog = {};
