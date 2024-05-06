/**
 * NesRenderingContext
 *
 * @package   WebNES
 * @author    Cimaron Shanahan
 * @copyright 2023 Cimaron Shanahan
 * @license   MIT
 */

import { readonly } from '../util/property.js';
import { internal } from '../util/internal.js';
import NesDriver from '../driver/NesDriver.js';


/**
 * Nes Rendering Context Class
 */
function NesRenderingContext(element, contextAttributes) {

	contextAttributes = Object.assign({
		mode : 'ntsc'
	}, contextAttributes || {});

	const data = internal(this, {
		events : {},
		contextAttributes : contextAttributes
	});

	readonly(this, 'region', contextAttributes.mode.toLowerCase() == "pal" ? "pal" : "ntsc");

	readonly(this, 'SCREEN_W', 256);
	readonly(this, 'SCREEN_H', 240);
	readonly(this, 'canvas', element);

	data.ctx = element.getContext('2d');
	data.image = new ImageData(this.SCREEN_W, this.SCREEN_H);

	this.canvas.width = this.SCREEN_W;
	this.canvas.height = this.SCREEN_H;

	data.events = {};

	let dClass = NesDriver.getDriver(contextAttributes.driver);
	if (!dClass) {
		throw new Error("WebNes: No drivers registered");
	}

	data.driver = new dClass();

};

/**
 * Add event listener
 *
 * @param   string     type       Event type
 * @param   function   listener   Callback function
 */
NesRenderingContext.prototype.addEventListener = function(type, listener) {

	if (['frame', 'scanline', 'sp0', 'nmi'].indexOf(type) == -1) {
		throw new Error("Invalid event type");
	}

	let data = internal(this);
	let list = data.events[type] = (data.events[type] || []);

	list.push(listener);
};

/**
 * Remove event listener
 *
 * @param   string     type       Event type
 * @param   function   listener   Callback function
 */
NesRenderingContext.prototype.removeEventListener = function(type, listener) {

	let data = internal(this);
	let list = data.events[type];

	if (list && list.indexOf(listener) != -1) {
		list.splice(list.indexOf(listener), 1);
	}
};

/**
 * Dispatch event
 *
 * @param   string   type      Event type
 * @param   mixed    evtData   Event Data
 */
NesRenderingContext.prototype.dispatchEvent = function(type, evtData) {

	let data = internal(this);
	let event = {
		type : type,
		element : this.canvas,
		target : this,
		context : this,
		data : evtData
	};

	let list = data.events[type] || [];
	for (let i = 0; i < list.length; i++) {
		list[i](event);
	}
};


export default NesRenderingContext;

