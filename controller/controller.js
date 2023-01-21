/**
 * NesController
 *
 * @package     NesRenderingContext
 * @author      Cimaron Shanahan
 * @copyright   2023 Cimaron Shanahan
 * @license     MIT
 */

import { NesControllerKeyboard } from './keyboard.js';


/**
 * Nes Controller class
 */
function NesController() {

	this.handlers = {
		'keyboard' : new NesControllerKeyboard()
	};

	//Internal
	this.latch = 0;
	this.register = 0;
}

NesController.BUTTON_A      = 0x01;
NesController.BUTTON_B      = 0x02;
NesController.BUTTON_SELECT = 0x04;
NesController.BUTTON_START  = 0x08;
NesController.BUTTON_UP     = 0x10;
NesController.BUTTON_DOWN   = 0x20;
NesController.BUTTON_LEFT   = 0x40;
NesController.BUTTON_RIGHT  = 0x80;


/**
 * Start listening for button presses
 *
 * @param   string   type (optional)
 */
NesController.prototype.start = function(type) {

	for (let h in this.handlers) {
		(type == h || !type) && this.handlers[h].start();
	}
};

/**
 * Stop listening for button presses
 *
 * @param   string   type (optional)
 */
NesController.prototype.stop = function(type) {

	for (let h in this.handlers) {
		(type == h || !type) && this.handlers[h].stop();
	}
};

/**
 * Collect button state from handlers
 */
NesController.prototype.collect = function() {

	this.register = 0;

	for (let h in this.handlers) {
		this.register |= this.handlers[h].read();
	}
};

/**
 * Read bit from controller port
 *
 * @return   int1
 */
NesController.prototype.read = function() {

	let bit = this.register & 1;

	this.register >>= 1;

	return bit;
};

/**
 * Write to controller port latch to prepare reading
 *
 * @param   int1   data
 */
NesController.prototype.write = function(data) {

	data = data & 1;

	if (this.latch && !data) {
		this.collect();
	}

	this.latch = data;
};


export { NesController };

