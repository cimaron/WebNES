/**
 * NesControllerKeyboard
 *
 * @package     NesRenderingContext
 * @author      Cimaron Shanahan
 * @copyright   2023 Cimaron Shanahan
 * @license     MIT
 */

import { NesController } from './controller.js';

/**
 * Nes Keyboard Controller class
 */
function NesControllerKeyboard() {

	this.keydownHandler = null;
	this.keyupHandler = null;

	this.active = {};
	this.buttonmap = {};

	this.keymap = {
		13 : 'enter',
		16 : 'shift',
		38 : 'up',
		40 : 'down',
		39 : 'right',
		37 : 'left'
	};

	this.addButtonMap('right', NesController.BUTTON_RIGHT );
	this.addButtonMap('left',  NesController.BUTTON_LEFT  );
	this.addButtonMap('down',  NesController.BUTTON_DOWN  );
	this.addButtonMap('up',    NesController.BUTTON_UP    );
	this.addButtonMap('enter', NesController.BUTTON_START );
	this.addButtonMap('shift', NesController.BUTTON_SELECT);
	this.addButtonMap('z',     NesController.BUTTON_B     );
	this.addButtonMap('x',     NesController.BUTTON_A     );
}

/**
 * Add button mapping for key
 *
 * @param   int|string   key      keycode or character
 * @param   int          button   button code
 */
NesControllerKeyboard.prototype.addButtonMap = function(key, button) {
	this.buttonmap[key] = button;
};

/**
 * Keydown handler
 *
 * @param   e   KeyboardEvent
 */
NesControllerKeyboard.keydownHandler = function(e) {

	if (e.repeat) {
		return;
	}

	let key = this.keymap[e.keyCode] || e.key;

	this.active[key] = true;
};

/**
 * Keyup handler
 *
 * @param   e   KeyboardEvent
 */
NesControllerKeyboard.keyupHandler = function(e) {

	let key = this.keymap[e.keyCode] || e.key;

	delete this.active[key];
};

/**
 * Start listening for button presses
 */
NesControllerKeyboard.prototype.start = function() {

	if (this.keyupHandler) {
		return;
	}

	this.keydownHandler = NesControllerKeyboard.keydownHandler.bind(this);
	this.keyupHandler = NesControllerKeyboard.keyupHandler.bind(this);

	window.addEventListener('keydown', this.keydownHandler);
	window.addEventListener('keyup', this.keyupHandler);
};

/**
 * Stop listening for button presses
 */
NesControllerKeyboard.prototype.stop = function() {

	if (!this.keyupHandler) {
		return;
	}

	window.removeEventListener('keydown', this.keydownHandler);
	window.removeEventListener('keyup', this.keyupHandler);

	this.keydownHandler = null;
	this.keyupHandler = null;
};

/**
 * Read state
 *
 * @return  int8
 */
NesControllerKeyboard.prototype.read = function() {
	let data = 0;

	for (let i in this.buttonmap) {
		data |= (this.active[i] ? this.buttonmap[i] : 0);
	}

	return data;
};


export { NesControllerKeyboard };

