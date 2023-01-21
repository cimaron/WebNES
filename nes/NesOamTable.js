/**
 * NesRenderingContext API
 *
 * @package     NesRenderingContext
 * @author      Cimaron Shanahan
 * @copyright   2023 Cimaron Shanahan
 * @license     MIT
 */


/**
 * Nes Oam Table Object
 */
function NesOamTable(driver) {

	this.driver = driver;
	this._dirty = false;

	this.sprites = new Array(64);

	for (let i = 0; i < 64; i++) {
		this.sprites[i] = new NesSprite(this, i);
	}
}

/**
 * Update OAM
 */
NesOamTable.prototype.update = function() {

	if (!this._dirty) {
		return;
	}

	this.driver.startOAM(0);

	for (let i = 0; i < 64; i++) {
		let sprite = this.getSprite(i);
		this.driver.writeOAM(sprite.ypos);
		this.driver.writeOAM(sprite.index);
		this.driver.writeOAM(sprite.xpos);
		this.driver.writeOAM(sprite.attr);
	}
};


NesOamTable.prototype.getSprite = function(n) {

	if (typeof n != "number") {
		throw new TypeError("Invalid argument");
	}

	n = n|0;

	if (n < 0 || n >= 64) {
		throw new RangeError("argument is out of range");
	}

	return this.sprites[n];
};



function NesSprite(table, i) {

	this.table = table;
	this.i = i;

	this.ypos = 0;
	this.index = 0;
	this.xpos = 0;
	this.attr = 0;

	/*
	76543210
	||||||||
	||||||++- Palette (4 to 7) of sprite
	|||+++--- Unimplemented (read 0)
	||+------ Priority (0: in front of background; 1: behind background)
	|+------- Flip sprite horizontally
	+-------- Flip sprite vertically
	*/
};

/**
 * Get y position
 *
 * @return  byte
 */
NesSprite.prototype.getYPos = function() {
	return this.ypos;
};

/**
 * Set y position
 *
 * @param   byte   y
 */
NesSprite.prototype.setYPos = function(y) {

	if (typeof y != "number") {
		throw new TypeError("Invalid argument");
	}

	this.table._dirty = true;
	this.ypos = (y|0) & 0xFF;
};

/**
 * Get x position
 *
 * @return  byte
 */
NesSprite.prototype.getXPos = function() {
	return this.xpos;
};

/**
 * Set x position
 *
 * @param   byte   y
 */
NesSprite.prototype.setXPos = function(x) {

	if (typeof x != "number") {
		throw new TypeError("Invalid argument");
	}

	this.table._dirty = true;
	this.xpos = (x|0) & 0xFF;
};

/**
 * Set tile number
 *
 * @param   byte   n
 */
NesSprite.prototype.setTile = function(n) {

	if (typeof n != "number") {
		throw new TypeError("Invalid argument");
	}

	this.table._dirty = true;
	this.index = (n|0) & 0xFF;
};

/**
 * Get tile number
 *
 * @return  byte
 */
NesSprite.prototype.getTile = function() {
	return this.index;
};





/**
 *
 */
/*
NesRenderingContext.prototype.getSprite = function(n) {
	return this.oamTable.getSprite(n);
};
*/



export { NesOamTable };

