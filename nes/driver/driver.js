/**
 * NesRenderingContext API
 *
 * @package     NesRenderingContext
 * @author      Cimaron Shanahan
 * @copyright   2023 Cimaron Shanahan
 * @license     MIT
 */

import { NesGraphicsDriver } from '../NesGraphicsDriver.js';



function MyPPU_Driver() {
	NesGraphicsDriver.apply(this);

	this.even = true;

	this.ppu = new MyPPU();
}

Object.assign(MyPPU_Driver.prototype, NesGraphicsDriver.prototype);

/**
 *
 */
MyPPU_Driver.prototype.attachScreenBuffer = function(buffer) {
	this.ppu.screen = new Uint32Array(buffer);
};

/**
 *
 */
MyPPU_Driver.prototype.attachCHROM = function(chrom) {
	this.ppu.CHROM = chrom;
};



MyPPU_Driver.prototype.renderFrame = function() {

	let i, cycles = 0;

	//Render scanlines
	for (i = 0; i < 240; i++) {
		this.ppu.renderScanline(i);
		this.hblank(i, 341, this.ppu.state.sp0hit);
	}

	//Post-Render scanline
	this.ppu.renderScanline(240);
	this.hblank(240, 341, this.ppu.state.sp0hit);
	
	if (this.ppu.state.nmi) {
		this.vblank(341 * 340 + 1);
	}

	//Vertical blanking lines
	for (i = 241; i < 261; i++) {
		this.ppu.renderScanline(i);
		this.hblank(i, 341, this.ppu.state.sp0hit);
	}

	//Pre-Render scanline
	this.ppu.renderScanline(261);
	this.hblank(261, this.even ? 341 : 340, this.ppu.state.sp0hit);
	this.even = !this.even;
};

/**
 * External
 */
MyPPU_Driver.prototype.readRegister = function(addr) {
	return this.ppu.readRegister(addr);
};

MyPPU_Driver.prototype.writeRegister = function(addr, data) {
	this.ppu.writeRegister(addr, data & 0xFF);
};

MyPPU_Driver.prototype.dma = function(addr, data) {
	this.ppu.dma(addr, data);
};


/**
 * External
 */
MyPPU_Driver.prototype.writeVram = function(addr, data) {
	this.ppu.writeRegister(PPUADDR, addr >> 8);
	this.ppu.writeRegister(PPUADDR, addr & 0xFF);
	this.ppu.writeRegister(PPUDATA, data & 0xFF);
};

/**
 * External
 */
MyPPU_Driver.prototype.startOAM = function(pos) {
	this.ppu.writeRegister(OAMADDR, (pos|0 & 0xFF));	
};

/**
 * External
 */
MyPPU_Driver.prototype.writeOAM = function(data) {
	this.ppu.writeRegister(OAMDATA, data & 0xFF);
};


//window.MyPPU_Driver = MyPPU_Driver;

window.NesRenderingContext = window.NesRenderingContext || { drivers : {} };
window.NesRenderingContext.drivers.MyPPU = MyPPU_Driver;

