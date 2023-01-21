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
 * Get Scroll x value
 *
 * @return  Uint8
 */
NesRenderingContext.prototype.getScrollX = function() {
	return this.state.scrollX;
};

/**
 * Set Scroll x value
 *
 * @param   Uint8   x
 */
NesRenderingContext.prototype.setScrollX = function(x) {
	this.state.scrollX = x;
};

/**
 * Get Scroll y value
 *
 * @return  Uint8
 */
NesRenderingContext.prototype.getScrollY = function() {
	return this.state.scrollY;
};

/**
 * Set Scroll y value
 *
 * @param   Uint8   x
 */
NesRenderingContext.prototype.setScrollY = function(y) {
	this.state.scrollY = y;
};

/**
 * Set Scroll values
 *
 * @param   Uint8   x
 * @param   Uint8   y
 */
NesRenderingContext.prototype.setScroll = function(x, y) {
	this.state.scrollX = x;
	this.state.scrollY = y;
};

/**
 * Send updates to PPU
 */
NesRenderingContext.prototype.flushPPUSCROLL = function() {

	if (this.state.PPUSCROLL_0 !== this.state.scrollX || this.state.PPUSCROLL_1 !== this.state.scrollY) {

		this.write(NesRenderingContext.PPUSCROLL, this.state.scrollX);
		this.state.PPUSCROLL_0 = this.state.scrollX;

		this.write(NesRenderingContext.PPUSCROLL, this.state.scrollY);
		this.state.PPUSCROLL_1 = this.state.scrollY;
	}
};

