/**
 * NesDriver
 *
 * @package   WebNES
 * @author    Cimaron Shanahan
 * @copyright 2023 Cimaron Shanahan
 * @license   MIT
 */
"use strict";


const drivers = {};


class NesDriver {

	/**
	 * @type {string}
	 */
	name = "";

	/**
	 * @type {function}
	 */
	handlers;

	/**
	 * @type {boolean}
	 */
	state = 0;

	/**
	 * @type {number}
	 */
	nextFrame = 0;

	/**
	 * @constructor
	 *
	 * @param {Object} config - Configuration parameters
	 * @param {ArrayBuffer} config.buffer
	 * @param {function}    [config.interrupt]
	 * @param {function}    [config.frame]
	 */
	constructor(config) {

		this.width = 256;
		this.height = 240;

		this.buffer = config.buffer;

		this.handlers = {
			interrupt : (config.interrupt || function() {}),
			frame     : (config.frame     || function() {}),
		};
	}

	/**
	 * Reset device
	 */
	reset() {
		this.state = 1;
	}

	/**
	 * Start device
	 */
	start() {
		this.state = 1;

		if (!this.nextFrame) {
			this.nextFrame = window.requestAnimationFrame(this.frame.bind(this));
		}
	}

	/**
	 * Stop device
	 */
	stop() {
		this.state = 0;

		window.cancelAnimationFrame(this.nextFrame);

		this.nextFrame = 0;
	}

	/**
	 * Schedule and run frame
	 */
	frame() {

		if (this.state == 1) {
			this.nextFrame = window.requestAnimationFrame(this.frame.bind(this));
		}
	}

	/**
	 * Run n clocks
	 *
	 * @param {number} n - Integer
	 *
	 * @returns {number} Number of clocks ran
	 */
	tick(n) {
		n = (n || 1)|0;

		/*
		run device clock n times
		checking interrupt state each time
		*/

		return n;
	}

	/**
	 * Stub read
	 *
	 * @param {number} addr - Uint16 address
	 *
	 * @returns {number} Uint8 value
	 */
	read(addr) {
		let byte = 0;

		this.tick();

		return byte;
	}

	/**
	 * Stub write
	 *
	 * @param {number} addr - Uint16 address
	 * @param {number} Uint8 value
	 */
	write(addr, byte) {

		//do nothing

		this.tick();
	}
}

/**
 * Register driver
 *
 * @param {string} name
 * @param {NesDriver} driver
 */
NesDriver.register = function(name, driver) {
	drivers[name] = driver;
};

/**
 * Get driver (by name if possible)
 *
 * @param {string|null} name
 *
 * @returns {NesDriver}
 */
NesDriver.getDriver = function(name) {
	return (name && drivers[name]) ? drivers[name] : Object.values(drivers)[0];
};


export default NesDriver;

