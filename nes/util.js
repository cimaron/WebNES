/**
 * NesRenderingContext API
 *
 * @package     NesRenderingContext
 * @author      Cimaron Shanahan
 * @copyright   2023 Cimaron Shanahan
 * @license     MIT
 */
"use strict";

import { NesRenderingContext } from './NesRenderingContext.js';


var colorPallete = [
	0x525252, 0xB40000, 0xA00000, 0xB1003D, 0x740069, 0x00005B, 0x00005F, 0x001840,
	0x002F10, 0x084A08, 0x006700, 0x124200, 0x6D2800, 0x000000, 0x000000, 0x000000,
	0xC4D5E7, 0xFF4000, 0xDC0E22, 0xFF476B, 0xD7009F, 0x680AD7, 0x0019BC, 0x0054B1,
	0x006A5B, 0x008C03, 0x00AB00, 0x2C8800, 0xA47200, 0x000000, 0x000000, 0x000000,
	0xF8F8F8, 0xFFAB3C, 0xFF7981, 0xFF5BC5, 0xFF48F2, 0xDF49FF, 0x476DFF, 0x00B4F7,
	0x00E0FF, 0x00E375, 0x03F42B, 0x78B82E, 0xE5E218, 0x787878, 0x000000, 0x000000,
	0xFFFFFF, 0xFFF2BE, 0xF8B8B8, 0xF8B8D8, 0xFFB6FF, 0xFFC3FF, 0xC7D1FF, 0x9ADAFF,
	0x88EDF8, 0x83FFDD, 0xB8F8B8, 0xF5F8AC, 0xFFFFB0, 0xF8D8F8, 0x000000, 0x000000
];

var colors = [];

for (let i = 0; i < colorPallete.length; i++) {
	let c = colorPallete[i];
	colors[i] = [
		c & 0xFF,
		(c >> 8) & 0xFF,
		(c >> 16) & 0xFF
	];
}

/**
 * Find nearest pallete index by color
 * Accepts #rgb, #rrggbb, 0x{rr}{gg}{bb}, (r, g, b)
 *
 * @param   mixed   r
 * @param   mixed   g
 * @param   mixed   b
 *
 * @return  byte
 */
function getColor(r, g, b) {

	if (typeof r == "string") {
		let v = parseColorString(r);
		return findNearest(v[0], v[1], v[2]);
	}

	if (typeof r == "number" && typeof g == "undefined") {
		return findNearest(r >> 16, r >> 8 & 0xFF, r & 0xFF);
	}

	if (typeof b == "number" && typeof g == "number" && typeof r == "number") {
		return findNearest(r, g, b);
	}

	throw new Exception("Invalid color value");
};

/**
 * Parse a color string into parts
 *
 * @param   string   col
 *
 * @return  array
 */
function parseColorString(col) {
	let v;

	if (v = col.match(/^#([a-f0-9])([a-f0-9])([a-f0-9])$/i)) {
		return [
			parseInt("0x" + v[1] + v[1]),
			parseInt("0x" + v[2] + v[2]),
			parseInt("0x" + v[3] + v[3])
		];
	}

	if (v = col.match(/^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2}$)/i)) {
		return [
			parseInt("0x" + v[1]),
			parseInt("0x" + v[2]),
			parseInt("0x" + v[3])
		];
	}

	throw new Exception("Invalid color string");
}

/**
 *
 */
function findNearest(r, g, b) {
	let i, c, dist, p, min = Infinity;

	for (i = 0; i < colors.length; i++) {

		c = colors[i];
		dist = distance(r, g, b, c[0], c[1], c[2]);

		if (dist == 0) {
			return i;	
		}

		if (dist < min) {
			min = dist;
			p = i;
		}
	}

	return p;
};

/**
 * @url   https://en.wikipedia.org/wiki/Color_difference
 */
function distance(r1, g1, b1, r2, g2, b2) {

	let rp = .5 * (r1 + r2),
		d1 = r2 - r1,
		d2 = g2 - g1,
		d3 = b2 - b1,
		dist
		;

	if (rp < 128) {
		dist = (2 * d1 * d1 + 4 * d2 * d2 + 3 * d3 * d3);
	} else {
		dist = (3 * d1 * d1 + 4 * d2 * d2 + 2 * d3 * d3);
	}

	return dist;
}

NesRenderingContext.prototype.getColor = getColor;


var Util = {};

/**
 * Validate number
 *
 * @param   int   min
 * @param   int   max
 * @param   int   n
 *
 * @return  int
 */
Util.validateNumber = function(min, max, n) {

	if (typeof n != "number") {
		throw new TypeError("Invalid argument");
	}

	n = n|0;

	if (n < min || n > max) {
		throw new RangeError("argument is out of range");
	}

	return n;
};

/**
 * Set bit
 *
 * @param   int   val   Source value
 * @param   bit   bit   Bit value
 * @param   int   n     Bit position
 */
Util.bit = function(val, bit, n) {
	return val ^ (1 << n) | (bit << n);
};



export { Util };

