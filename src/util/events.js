/**
 * NesRenderingContext
 *
 * @package   WebNES
 * @author    Cimaron Shanahan
 * @copyright 2023 Cimaron Shanahan
 * @license   MIT
 */
"use strict";

import internal from './internal.js';


function events(obj, type) {

	let ev = internal(obj)._events || {};
	internal(obj)._events = ev;

	let list = ev[type] || [];
	ev[type] = list;

	return list;
}

const EventTarget = {

	/**
	 * Add event listener
	 *
	 * @param   string     type       Event type
	 * @param   function   listener   Callback function
	 */
	addEventListener: function(type, listener) {
		let list = events(this, type);

		if (typeof listener == 'function' && list.indexOf(listener) == -1) {
			list.push(listener);
		}
	},

	/**
	 * Remove event listener
	 *
	 * @param   string     type       Event type
	 * @param   function   listener   Callback function
	 */
	removeEventListener: function(type, listener) {
		let list = events(this, type);

		let i = list.indexOf(listener);
		if (i != -1) {
			list.splice(i, 1);
		}
	},

	/**
	 * Dispatch event
	 *
	 * @param   string   type      Event type
	 * @param   mixed    evtData   Event Data
	 */
	dispatchEvent: function(type, evtData) {
		let list = events(this, type);

		let event = {
			type          : type,
			element       : this.canvas,
			target        : this,
			currentTarget : this,
			context       : this,
			data          : evtData
		};

		for (let i = 0; i < list.length; i++) {
			list[i](event);
		}
	}
};

export default EventTarget;
