
/**
 * Nes Pallete Table Object
 */
function NesPalleteTable(driver) {

	this.driver = driver;

	this.palletes = new Array(8);

	for (let i = 0; i < 8; i++) {
		this.palletes[i] = new NesPallete(driver, i);
	}
}

/**
 *
 */
NesPalleteTable.prototype.getBackgroundColor = function() {
	return this.palletes[0].getColor();
};

/**
 *
 */
NesPalleteTable.prototype.setBackground = function(c) {

	if (typeof n != "number") {
		throw new TypeError("Invalid argument");
	}

	this.palletes[0].setColor(c);
};

/**
 *
 */
NesPalleteTable.prototype._getPallete = function(n, i) {

	if (typeof n != "number") {
		throw new TypeError("Invalid argument");
	}

	n = n|0;

	if (n < 0 || n > 3) {
		throw new RangeError("argument is out of range");
	}

	return this.palletes[n + (i * 4)];
};

/**
 *
 */
NesPalleteTable.prototype.getBackgroundPallete = function(n) {
	return this._getPallete(n, 0);
};

/**
 *
 */
NesPalleteTable.prototype.getSpritePallete = function(n) {
	return this._getPallete(n, 1);
};





/**
 *
 */
function NesPallete(driver, i) {

	this.driver = driver;
	this.i = i;

	this.data = new Uint8Array(4);
};

/**
 * Set pallete color
 *
 * @param   byte   c
 */
NesPallete.prototype.setColor = function(i, c) {

	if (typeof c != "number" || typeof i != "number") {
		throw new TypeError("Invalid argument");
	}

	i = i|0;

	if (i < 0 || i > 3) {
		throw new RangeError("argument is out of range");
	}

	this.data[i] = (c|0) & 0x3F;
	this.driver.writeVram(0x3F00 + 4 * this.i + i, this.data[i]);
};




/**
 *
 */
NesRenderingContext.prototype.setBackgroundColor = function(c) {
	this.palleteTable.getBackgroundPallete(0).setColor(0, c);
};

/**
 *
 */
NesRenderingContext.prototype.getSpritePallete = function(n) {
	return this.palleteTable.getSpritePallete(n);
};



