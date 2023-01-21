/**
 * NesRenderingContext API
 *
 * @package     NesRenderingContext
 * @author      Cimaron Shanahan
 * @copyright   2023 Cimaron Shanahan
 * @license     MIT
 */

import { NesRenderingContext } from '../NesRenderingContext.js';


/**
 * Get greyscale mode
 *
 * @return  bool
 */
NesRenderingContext.prototype.getGrayscaleMode = function() {
	return this.state.grey;
};

/**
 * Set greyscale mode
 *
 * @param   bool   mode   On or off
 */
NesRenderingContext.prototype.setGrayscaleMode = function(mode) {
	this.state.grey = (mode ? NesRenderingContext.BIT_GREYSCALE : 0);
};

/**
 * Get background mask
 *
 * @return  bool
 */
NesRenderingContext.prototype.getBackgroundMask = function() {
	return this.state.bgMask;
};

/**
 * Show background mask
 *
 * @param   bool   mode   On or off
 */
NesRenderingContext.prototype.setBackgroundMask = function(mode) {
	this.state.bgMask = (mode ? NesRenderingContext.BIT_BGMASK : 0);
};

/**
 * Get sprite mask
 *
 * @return  bool
 */
NesRenderingContext.prototype.getSpriteMask = function() {
	return this.state.spMask;
};

/**
 * Show sprite mask
 *
 * @param   bool   mode   On or off
 */
NesRenderingContext.prototype.setSpriteMask = function(mode) {
	this.state.spMask = (mode ? NesRenderingContext.BIT_BGMASK : 0);
};


//@todo the rest

/**
 * Send updates to PPU
 */
NesRenderingContext.prototype.flushPPUMASK = function() {

	let mask = this.state.computePPUMASK();

	if (mask != this.state.PPUMASK) {
		this.write(NesRenderingContext.PPUMASK, mask);
		this.state.PPUMASK = mask;
	}
};

