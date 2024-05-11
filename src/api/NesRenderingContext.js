/**
 * NesRenderingContext
 *
 * @package   WebNES
 * @author    Cimaron Shanahan
 * @copyright 2023 Cimaron Shanahan
 * @license   MIT
 */
"use strict";

import { readonly } from '../util/property.js';
import { internal } from '../util/internal.js';
import EventTarget from '../util/events.js';
import NesDriver from '../driver/NesDriver.js';


/**
 * Nes Rendering Context Class
 */
function NesRenderingContext(element, contextAttributes) {

	contextAttributes = Object.assign({
		mode : 'ntsc'
	}, contextAttributes || {});

	const data = internal(this, {
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


	let dClass = NesDriver.getDriver(contextAttributes.driver);
	if (!dClass) {
		throw new Error("WebNes: No drivers registered");
	}

	data.driver = new dClass();
};

Object.assign(NesRenderingContext.prototype, EventTarget);


export default NesRenderingContext;

