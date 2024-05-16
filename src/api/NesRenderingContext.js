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
import NesPPU from './NesPPU.js';
import NesRom from './NesRom.js';


/**
 * Nes Rendering Context Class
 */
class NesRenderingContext extends EventTarget {

	/**
	 * @param {HTMLCanvasElement} element
	 * @param {object} contextAttributes
	 */
	constructor(element, contextAttributes) {

		contextAttributes = Object.assign({
			mode : 'ntsc'
		}, contextAttributes || {});

		let width = 256, height = 240;

		const data = internal(this, {
			contextAttributes : contextAttributes,
			screen : new ImageData(width, height),
			width : width,
			height: height,
		});

		this.canvas.width = width;
		this.canvas.height = height;
		data.ctx = element.getContext('2d');

		readonly(this, 'region', contextAttributes.mode.toLowerCase() == "pal" ? "pal" : "ntsc");

		readonly(this, 'SCREEN_W', width);
		readonly(this, 'SCREEN_H', height);
		readonly(this, 'canvas', element);

		//init screen
		data.screen.data.fill(0xFF000000);
		data.ctx.putImageData(data.screen, 0, 0);

		//init driver
		data.driver = initDriver.call(this, contextAttributes);

		//init api objects
		data.ppu = new NesPPU(data.driver);

		//Dispatch events
		window.requestAnimationFrame(function() {
			this.dispatchEvent('ready');
		}.bind(this));
	}

	/**
	 * Get PPU Api Object
	 */
	getPPU() {
		return internal(this).ppu;
	}

	/**
	 * Get Rom
	 *
	 * @returns {NesRom}
	 */
	getRom() {
		return this.rom;
	}

	/**
	 * Reset execution
	 */
	reset() {
		const driver = internal(this).driver;

		driver.setRom(this.rom);
		driver.reset();
	}

	/**
	 * Pause execution
	 */
	pause() {
		internal(this).driver.stop();
	}

	/**
	 * Start execution
	 */
	start() {
		internal(this).driver.start();
	}

	/**
	 * Read memory address
	 *
	 * @param {number} addr - Uint16 address
	 *
	 * @returns {number} - Uint8 value
	 */
	read(addr) {

		addr = addr & 0xFFFF;

		return internal(this).driver.read(addr);
	}

	/**
	 * Write memory address
	 *
	 * @param {number} addr - Uint16 address
	 * @param {number} - Uint8 value
	 */
	write(addr, byte) {

		addr = addr & 0xFFFF;
		byte = byte & 0xFF;

		internal(this).driver.write(addr, byte);
	}
}


/**
 * Create driver
 *
 * @param {NesRenderingContext} attr
 */
function initDriver(attr) {

	let dClass = NesDriver.getDriver(attr.driver);
	if (!dClass) {
		throw new Error("WebNes: No drivers registered");
	}

	const data = internal(this);
	const screen = data.screen;

	const driver = new dClass({

		buffer : screen.data.buffer,

		frame : function() {
			data.ctx.putImageData(screen, 0, 0);
			this.dispatchEvent('frame');
		}.bind(this),

		interrupt : this.dispatchEvent.bind(this, 'interrupt')
	});

	this.rom = new NesRom();

	driver.setRom(this.rom);
	driver.start();

	return driver;
}

export default NesRenderingContext;

