/**
 * Private data utility function
 *
 * @package   WebNES
 * @author    Cimaron Shanahan
 * @copyright 2023 Cimaron Shanahan
 * @license   MIT
 */
"use strict";


const data = new WeakMap;

function internal(obj, def) {

	if (def) {
		def = Object.assign(data.get(obj) || {}, def);
		data.set(obj, def);
	}

	return data.get(obj);
}


export default internal;
export { internal };
