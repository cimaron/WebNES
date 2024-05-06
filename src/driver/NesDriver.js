/**
 * NesDriver
 *
 * @package   WebNES
 * @author    Cimaron Shanahan
 * @copyright 2023 Cimaron Shanahan
 * @license   MIT
 */

const drivers = {};


class NesDriver {

	/**
	 * @var string
	 */
	name = "";

	/**
	 * @var function
	 */
	nmiHandler;

	/**
	 * @var string
	 */
	state = 'paused';


	/**
	 * Constructor
	 */
	constructor() {
	}

	/**
	 * Run n clocks
	 *
	 * @param   int   n
	 *
	 * @return  int
	 */
	tick(n) {
		n = (n || 1)|0;

		/*
		run device clock n times
		checking NMI state each time
		*/

		return n;
	}

	/**
	 * Stub read
	 *
	 * @param   uint16   addr
	 *
	 * @return  uint8
	 */
	read(addr) {
		let byte = 0;

		this.tick();

		return byte;
	}

	/**
	 * Stub write
	 *
	 * @param   uint16   addr
	 * @param   uint8    byte
	 *
	 * @return  uint8
	 */
	write(addr, byte) {

		//do nothing

		this.tick();
	}

	/**
	 * Register NMI callback
	 *
	 * @param   function   callback
	 */
	registerNmi(callback) {
		this.nmiHandler = callback;
	}
}

/**
 * Register driver
 *
 * @param   NesDriver   driver
 */
NesDriver.register = function(name, driver) {
	drivers[name] = driver;
};

/**
 * Get driver (by name if possible)
 *
 * @param   mixed   name
 *
 * @return  NesDriver
 */
NesDriver.getDriver = function(name) {

	return (name && drivers[name]) ? drivers[name] : Object.values(drivers)[0];
};


export default NesDriver;

