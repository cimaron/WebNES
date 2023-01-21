/**
 * NesRenderingContext API
 *
 * @package     NesRenderingContext
 * @author      Cimaron Shanahan
 * @copyright   2023 Cimaron Shanahan
 * @license     MIT
 */

import { NesRenderingContext } from './NesRenderingContext.js';


/**
 * Nes State Class
 */
function NesState(driver) {
	this.driver = driver;

	//PPUMASK
	this.PPUMASK = 0;

	this.grey    = 0;
	this.bgMask  = NesRenderingContext.BIT_BGMASK;
	this.spMask  = NesRenderingContext.BIT_SPMASK;
	this.bgShow  = NesRenderingContext.BIT_SHOWBG;
	this.spShow  = NesRenderingContext.BIT_SHOWSP;
	this.emRed   = 0;
	this.emGreen = 0;
	this.emBlue  = 0;

	//PPUSCROLL
	this.PPUSCROLL_0 = 0;
	this.PPUSCROLL_1 = 0;

	this.scrollX = 0;
	this.scrollY = 0;
}

/**
 * Compute PPUMASK value
 *
 * @return  Uint8
 */
NesState.prototype.computePPUMASK = function() {
	return (this.grey | this.bgMask | this.spMask | this.bgShow | this.spShow | this.emRed | this.emGreen | this.emBlue);
};


export { NesState };

