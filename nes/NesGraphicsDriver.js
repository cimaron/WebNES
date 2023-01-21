/**
 * NesRenderingContext API
 *
 * @package     NesRenderingContext
 * @author      Cimaron Shanahan
 * @copyright   2023 Cimaron Shanahan
 * @license     MIT
 */



/**
 * Graphics driver base class for NesRenderingContext
 */
function NesGraphicsDriver() {

	this._events = {
		hblank : null,
		vblank : null
	};
}

/**
 * Set HBlank callback function
 *
 * @param   function
 */
NesGraphicsDriver.prototype.onHblank = function(fn) {
	this._events.hblank = fn || null;
};

/**
 * Set VBlank callback function
 *
 * @param   function
 */
NesGraphicsDriver.prototype.onVblank = function(fn) {
	this._events.vblank = fn || null;
};

/**
 * Execute HBlank callback
 *
 * @param   int    Current scanline
 * @param   int    PPU cycles elapsed since last scanline
 * @param   bool   Sprite0 flag
 */
NesGraphicsDriver.prototype.hblank = function(i, cycles, sp0) {

	this._events.hblank && this._events.hblank({
		line : i,
		cycles : cycles,
		sprite0 : sp0
	});
};

/**
 * Execute VBlank callback
 *
 * @param   int    PPU cycles elapsed since last frame
 */
NesGraphicsDriver.prototype.vblank = function(cycles) {

	this._events.vblank && this._events.vblank({
		cycles : cycles
	});
};

/**
 * Set screen buffer for rendering
 *
 * @param   ArrayBuffer
 */
NesGraphicsDriver.prototype.attachScreenBuffer = function(buffer) {
	console.warn("attrachScreenBuffer not implemented by driver");
};

/**
 * Set Character ROM data
 *
 * @param   Uint8Array
 */
NesGraphicsDriver.prototype.attachCHROM = function(chrom) {
	console.warn("attachCHROM not implemented by driver");
};

/**
 * Render graphics frame
 */
NesGraphicsDriver.prototype.renderFrame = function() {
	console.warn("renderFrame not implemented by driver");
};

/**
 * Read PPU memory-mapped register
 *
 * @link https://www.nesdev.org/wiki/PPU_registers
 *
 * @param   int16   address   0x2000 - 0x2007
 *
 * @return  int8
 */
NesGraphicsDriver.prototype.readRegister = function(address) {
	console.warn("readRegister not implemented by driver");
};

/**
 * Write PPU memory-mapped register
 *
 * @link https://www.nesdev.org/wiki/PPU_registers
 *
 * @param   int16   address   0x2000 - 0x2007
 * @param   int8    data      Data to write
 */
NesGraphicsDriver.prototype.writeRegister = function(address, data) {
	console.warn("writeRegister not implemented by driver");
};

/**
 * Initiate DMA copy to OAM
 *
 * @link https://www.nesdev.org/wiki/PPU_registers
 *
 * @param   int16   address   0x2000 - 0x2007
 * @param   int8    data      Data to write
 */
NesGraphicsDriver.prototype.dma = function(addr, data) {
	console.warn("dma not implemented by driver");
};


export { NesGraphicsDriver };

