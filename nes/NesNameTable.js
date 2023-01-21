
/**
 * Nes NameTables Object
 */
function NesNameTables(driver) {
	this.driver = driver;

	this.mode = 0;

	this.tables = [0, 1, 2, 3].map((i) => new NesNameTable(driver, i));
}



NesNameTables.prototype.getNameTable = function(i) {

	if (typeof i != "number") {
		throw new TypeError("Invalid argument");
	}

	i = i|0;
	if (i < 0 || i > 3) {
		throw new RangeError("argument is out of range");
	}

	return this.tables[i];
};



/**
 * Nes NameTable Object
 */
function NesNameTable(driver, i) {
	this.driver = driver;
	this.i = i;
}

/**
 *
 */
NesNameTable.prototype.setTile = function(i, t) {
	
	console.warn("Missing checks in NesNameTable.setTile");

	let ntAddr = 0x2000 + (0x400 * this.i) + i;

	this.driver.writeVram(ntAddr, t);
};










/**
 *
 */
NesRenderingContext.prototype.getNameTable = function(i) {
	return this.nameTables.getNameTable(i);
};


