/**
 * NesRenderingContext API
 *
 * @package     NesRenderingContext
 * @author      Cimaron Shanahan
 * @copyright   2023 Cimaron Shanahan
 * @license     MIT
 */

import { NesOamTable } from './NesOamTable.js';
import { NesState } from './NesState.js';
import { Util } from './util.js';

import {} from './methods/mask.js';
import {} from './methods/scroll.js';

/**
 * Nes Rendering Context Class
 */
function NesRenderingContext(element, contextAttributes) {

	contextAttributes = contextAttributes || {};

	this.SCREEN_W = 256;
	this.SCREEN_H = 240;

	this.canvas = element;
	this.ctx = element.getContext('2d');
	this.image = new ImageData(this.SCREEN_W, this.SCREEN_H);
	this._dirty = true;

	this.canvas.width = this.SCREEN_W;
	this.canvas.height = this.SCREEN_H;

	this.events = {};

	this.driver = this.getDriver(contextAttributes.driver);

	this.driver.onHblank(function(data) {
		this.dispatchEvent('scanline', data);
	}.bind(this));

	this.driver.onVblank(function(data) {
		this.dispatchEvent('frame', data);
	}.bind(this));

	this.driver.attachScreenBuffer(this.image.data.buffer);

	//Subobjects
	this.state = new NesState(this.driver);
	//this.patternTable0 = this.createPatternTable();
	//this.patternTable1 = this.createPatternTable();
	//this.oamTable      = new NesOamTable(this.driver);
	//this.palleteTable  = new NesPalleteTable(this.driver);
	//this.nameTables    = new NesNameTables(this.driver);

	this.paused = false;

	//this.attachPatternTable(this.patternTable0, 0);

	window.requestAnimationFrame(this._schedule.bind(this));
};


NesRenderingContext.drivers = (window.NesRenderingContext ? window.NesRenderingContext.drivers : {});


NesRenderingContext.PPUCTRL   = 0x2000;
NesRenderingContext.PPUMASK   = 0x2001;



NesRenderingContext.PPUSCROLL = 0x2005;



NesRenderingContext.BIT_GREYSCALE = 0x01;
NesRenderingContext.BIT_BGMASK    = 0x02;
NesRenderingContext.BIT_SPMASK    = 0x04;
NesRenderingContext.BIT_SHOWBG    = 0x08;
NesRenderingContext.BIT_SHOWSP    = 0x10;
NesRenderingContext.BIT_EMRED     = 0x20;
NesRenderingContext.BIT_EMBLUE    = 0x40;
NesRenderingContext.BIT_EMGREEN   = 0x80;


/**
 * Add event listener
 *
 * @return  NesGraphicsDriver
 */
NesRenderingContext.prototype.getDriver = function(name) {
	
	let drivers = NesRenderingContext.drivers;

	if (name && name in drivers) {
		return new drivers[name];	
	}

	for (name in drivers) {
		return new drivers[name]();
	}

	throw new Error("No drivers registered");
};

/**
 * Add event listener
 *
 * @param   string     type       Event type
 * @param   function   listener   Callback function
 */
NesRenderingContext.prototype.addEventListener = function(type, listener) {

	if (['frame', 'scanline'].indexOf(type) == -1) {
		throw new Error("Invalid event type");		
	}

	let list = this.events[type] = (this.events[type] || []);
	list.push(listener);
};

/**
 * Remove event listener
 *
 * @param   string     type       Event type
 * @param   function   listener   Callback function
 */
NesRenderingContext.prototype.removeEventListener = function(type, listener) {
	
	let list = this.events[type];
	
	if (list && list.indexOf(listener) != -1) {
		list.splice(list.indexOf(listener), 1);
	}
};

/**
 * Dispatch event
 *
 * @param   string   type   Event type
 * @param   mixed    data   Data
 */
NesRenderingContext.prototype.dispatchEvent = function(type, data) {

	let event = {
		type : type,
		element : this.canvas,
		target : this,
		context : this,
		data : data
	};

	let list = this.events[type] || [];
	for (let i = 0; i < list.length; i++) {
		list[i](event);
	}
};

/**
 * Schedule next frame
 *
 * @param   string   type   Event type
 * @param   mixed    data   Data
 */
NesRenderingContext.prototype._schedule = function() {

	if (this.paused) {
		return;
	}

	window.requestAnimationFrame(this._schedule.bind(this));

	//if (this._dirty) {
		try {
			this._renderFrame();
			this.ctx.putImageData(this.image, 0, 0);
		} catch (e) {
			console.log(e);
		}
		this._dirty = false;
	//}
};

/**
 *
 */
NesRenderingContext.prototype._renderFrame = function() {
	//this.oamTable.update();

	this.flushPPUMASK();
	this.flushPPUSCROLL();

	this.driver.renderFrame();
};

/**
 *
 */
NesRenderingContext.prototype.pause = function() {
	this.paused = true;
};

/**
 *
 */
NesRenderingContext.prototype.start = function() {
	this.paused = false;
};



/**
 *
 */
NesRenderingContext.prototype.createPatternTable = function(data) {
	return new NesPatternTable(data);
};

/**
 * Attach pattern table to rendering context
 *
 * @param   NesRenderingContext   table
 * @param   int                   n       (0|1)
 *
 * @throws  Error
 */	
NesRenderingContext.prototype.attachPatternTable = function(table, n) {

	if (Object.getPrototypeOf(table).constructor !== NesPatternTable) {
		throw new TypeError("argument is not a NesPatternTable object");
	}

	if (n !== 0 && n !== 1) {
		throw new RangeError("Invalid index");		
	}

	n === 0 ? this.patternTable0 = table : this.patternTable1 = table;
	
	this.driver.attachCHROM(table.data);
};

/**
 * Detach pattern table from rendering context
 *
 * @param   int   n   (0|1)
 *unexpec
 * @throws  RangeError
 */	
NesRenderingContext.prototype.detachPatternTable = function(table, n) {

	if (n !== 0 && n !== 1) {
		throw new RangeError("Invalid index");
	}

	n === 0 ? this.patternTable0 = null : this.patternTable1 = null;
};

/**
 * Get Pattern Table
 *
 * @param   int   n   (0|1)
 *
 * @return  NesPatternTable
 *
 * @throws  NotSupportedError
 */
NesRenderingContext.prototype.getPatternTable = function(n) {

	if (n === 0) {
		return this.patternTable0;
	}

	if (n === 1) {
		return this.patternTable1;	
	}

	throw new RangeError("Invalid index"); 
};


/**
 * Read PPU register
 *
 * @param   Uint16   addr   PPU register address [0x2000 - 0x2007]
 *
 * @return  Uint8
 */
NesRenderingContext.prototype.read = function(addr) {

	Util.validateNumber(0x2000, 0x2007, addr);

	return this.driver.readRegister(addr);
};

/**
 * Write PPU register
 *
 * @param   Uint16   addr   PPU register address [0x2000 - 0x2007]
 * @param   Uint8    byte   Data
 */
NesRenderingContext.prototype.write = function(addr, byte) {

	Util.validateNumber(0x2000, 0x2007, addr);
	Util.validateNumber(0, 255, byte);

	this.driver.writeRegister(addr, byte);
};




window.NesRenderingContext = NesRenderingContext;

export { NesRenderingContext };

