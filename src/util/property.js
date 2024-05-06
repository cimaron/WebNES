/**
 * Class property utility functions
 *
 * @package   WebNES
 * @author    Cimaron Shanahan
 * @copyright 2023 Cimaron Shanahan
 * @license   MIT
 */
"use strict";


/**
 * @param {object} object
 * @param {string|object} name
 * @param {*} value
 */
function readonly(object, name, value) {

	if (typeof name == "string") {
		name = { [name] : value };
	}

	for (let i of Object.keys(name)) {

		Object.defineProperty(object, i, {
			enumerable : true,
			value : name[i]
		});
	}

	return object;
}


/**
 * @param {object} object
 * @param {string|object} name
 * @param {*} value
 */
function alias(object, name, getter) {

	if (typeof name == "string") {
		name = { [name] : getter };
	}

	for (let i in Object.keys(name)) {

		Object.defineProperty(object, i, {
			enumerable : true,
			get : name[i]
		});
	}

	return object;
}


export {
	readonly,
	alias
};

