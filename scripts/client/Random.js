/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */
class Random {
	 constructor(seed) {
	 	this._seed = seed % 2147483647;
	 	if (this._seed <= 0) this._seed += 2147483646;
	 }

	/**
	 * Returns a pseudo-random value between min and max or 0 and min, or 0 and 1.
	 */
	next(min, max) {
	    min = min || 0;
	    max = max || 1;

	 	var rnd = this._seed = this._seed * 16807 % 2147483647;
	 	rnd = (rnd - 1) / 2147483646;

		return min + rnd * (max - min);
	}
}
