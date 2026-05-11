class Universe {
	static start() {
		Universe.orbCount = rand.next(3, 5);

        Orb.station = new SpaceStation(null, rand.next(Math.TWO_PI), rand.next() > 0.5 ? 1 : -1, 1000);

        var mainPlanet;
		for (var i = 1; i < Universe.orbCount; i++) {
			const planet = new Planet({x: 0, y: 0}, rand.next(Math.TWO_PI), rand.next() > 0.5 ? 1 : -1, i * 5000);

            if (i === 1) {
                mainPlanet = planet;
            }
		}

        Orb.station.parent = mainPlanet;

		Universe.orbCount = (Universe.orbCount + 2) | 0;
	}
}
Universe.orbCount = 0;
