/**
 * NesPpu
 *
 * @package   WebNES
 * @author    Cimaron Shanahan
 * @copyright 2023 Cimaron Shanahan
 * @license   MIT
 */
"use strict";

import { readonly } from '../util/property.js';
import { internal } from '../util/internal.js';


class NesPPU {

	constructor(driver) {

		const data = internal(this, {
			driver : driver
		});
	}

	/**
	 * Read vram memory address
	 *
	 * @param {number} vaddr - Uint16 address
	 *
	 * @returns {number} - Uint8 value
	 */
	read(vaddr) {
		let driver = internal(this).driver;

		//@todo throw warning/error if accessing outside blanking period

		//Clear write latch
		driver.read(0x2002);

		let lo = vaddr & 0xFF;
		let hi = (vaddr >> 8) & 0xFF;

		driver.write(0x2006, hi);
		driver.write(0x2006, lo);

		return driver.read(0x2007);
	}

	/**
	 * Write vram memory address
	 *
	 * @param {number} vaddr - Uint16 address
	 * @param {number} byte - Uint8 value
	 */
	write(vaddr, byte) {
		let driver = internal(this).driver;

		//@todo throw warning/error if accessing outside blanking period

		//Clear write latch
		driver.read(0x2002);

		let lo = vaddr & 0xFF;
		let hi = (vaddr >> 8) & 0xFF;

		driver.write(0x2006, hi);
		driver.write(0x2006, lo);
		driver.write(0x2007, byte & 0xFF);
	}

	/**
	 * Set PPUCTRL flags
	 *
	 * @param {number} flags - Uint8 value
	 */
	setControl(flags) {
		return internal(this).driver.write(this.PPUCTRL, flags & 0xFF);
	}

	/**
	 * Set PPUMASK flags
	 *
	 * @param {number} flags - Uint8 value
	 */
	setMask(flags) {
		return internal(this).driver.write(this.PPUMASK, flags & 0xFF);
	}

	/**
	 * Get PPUSTATUS
	 *
	 * @returns {number} - Uint8 value
	 */
	getStatus() {
		return internal(this).driver.read(this.PPUSTATUS);
	}

	/**
	 * Set pallete color
	 *
	 * @param {number} pallete - Uint8
	 * @param {number} index - Uint8
	 * @param {number} color - Uint8
	 */
	setPalleteColor(pallete, index, color) {

		//backdrop
		if (pallete === -1) {
			pallete = 0;
			color = index;
			index = 0;
		}

		let addr = this.ADDR_PALLETES + ((pallete & 0x7) << 2) + (index & 0x3);

		this.write(addr, color & 0x3F);
	}
}


/**
 * PPU Registers
 */
readonly(NesPPU.prototype, {
	PPUCTRL:   0x2000,
	PPUMASK:   0x2001,
	PPUSTATUS: 0x2002,
	OAMADDR:   0x2003,
	OAMDATA:   0x2004,
	PPUSCROLL: 0x2005,
	PPUADDR:   0x2006,
	PPUDATA:   0x2007,
	OAMDMA:    0x4014
});

/**
 * PPU Control
 */
readonly(NesPPU.prototype, {
	NAMETABLE0: 0x00, //$2000
	NAMETABLE1: 0x01, //$2400
	NAMETABLE2: 0x02, //$2800
	NAMETABLE3: 0x03, //$2C00
	VBLANK_NMI_ON: 0x80,
});


readonly(NesPPU.prototype, {
	BIT_GREYSCALE: 0x00, //$2000
	NAMETABLE1: 0x01, //$2400
	NAMETABLE2: 0x02, //$2800
	NAMETABLE3: 0x03, //$2C00
	VBLANK_NMI_ON: 0x80,
});


readonly(NesPPU.prototype, {
	FLAG_GRAYSCALE       : 0x01,
	FLAG_BACKGROUND_MASK_DISABLE : 0x02,
	FLAG_SPRITE_MASK_DISABLE     : 0x04,
	FLAG_SHOW_BACKGROUND : 0x08,
	FLAG_SHOW_SPRITES    : 0x10,
	FLAG_EMPHASIS_RED    : 0x20,
	FLAG_EMPHASIS_BLUE   : 0x40,
	FLAG_EMPHASIS_GREEN  : 0x80,
});

readonly(NesPPU.prototype, {
	ADDR_PALLETES : 0x3F00,
	BACKDROP    : -1,
	BACKGROUND0 : 0,
	BACKGROUND1 : 1,
	BACKGROUND2 : 2,
	BACKGROUND3 : 3,
	SPRITE0     : 4,
	SPRITE1     : 5,
	SPRITE2     : 6,
	SPRITE3     : 7,
});



export default NesPPU;

