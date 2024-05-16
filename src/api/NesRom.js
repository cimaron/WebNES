/**
 * NesRom
 *
 * @package   WebNES
 * @author    Cimaron Shanahan
 * @copyright 2023 Cimaron Shanahan
 * @license   MIT
 */
"use strict";


class NesRom {

	/**
	 * @type {Uint8Array}
	 */
	header;
	
	/**
	 * @type {Uint8Array}
	 */
	prgrom;
	
	/**
	 * @type {Uint8Array}
	 */
	chrom;

	/**
	 * @param {number} chromeSize
	 */
	constructor(chromSize) {
		this.reset(chromSize);
	}

	/**
	 * Reset rom
	 *
	 * @param {number} chromSize
	 */
	reset(chromSize) {

		let banks = Math.ceil((chromSize || 8192) / 8192);

		this.header = new Uint8Array(16);
		this.prgrom = new Uint8Array(32768);

		this.chrom  = new Uint8Array(banks * 8192);

		//Constant $4E $45 $53 $1A ("NES" followed by MS-DOS end-of-file)
		(new Uint32Array(this.header.buffer))[0] = 0x1A53454E;
		this.header[4] = (this.prgrom.length / 16384);
		this.header[5] = banks;
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return "" +
			String.fromCharCode.apply(null, this.header) +
			String.fromCharCode.apply(null, this.prgrom) +
			String.fromCharCode.apply(null, this.chrom)
			;
	}
}

export default NesRom;

