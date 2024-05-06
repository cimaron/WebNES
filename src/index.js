/**
 * WebNES
 *
 * @package   WebNES
 * @author    Cimaron Shanahan
 * @copyright 2023 Cimaron Shanahan
 * @license   MIT
 */
 "use strict";

import NesRenderingContext from './api/NesRenderingContext.js';

const _getNativeContext = HTMLCanvasElement.prototype.getContext;


/**
 * Override getContext
 *
 * @param   string   contextType
 * @param   mixed    contextAttributes
 *
 * @return  mixed
 */
HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {

	if (contextType == 'nes') {
		return new NesRenderingContext(this, contextAttributes);
	}

	return _getNativeContext.apply(this, arguments);
};


window.NesRenderingContext = NesRenderingContext;

