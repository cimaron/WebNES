
/**
 * Nes Pattern Table Object
 */
function NesPatternTable(data) {
	this.data = new Uint8Array(16 * 256);
	if (data) {
		this.data.set(data.slice(0, Math.min(this.data.length, data.length)));
	}
}

/**
 *
 */
NesPatternTable.prototype.setData = function(data) {
	this.data = data;
};


/**
 *
 */
NesPatternTable.prototype.getTile = function(n) {

	if (typeof n != "number") {
		throw new TypeError("Invalid argument");
	}

	n = n|0;

	if (n < 0 || n > 255) {
		throw new RangeError("argument is out of range");
	}

	return new NesTile(new Uint8Array(this.data.buffer, 16 * n, 16));
};



function NesTile(data) {
	this.data = data;
};


NesTile.prototype.getRawData = function() {
	return this.data;
};

/**
 *
 */
NesTile.prototype.setData = function(d) {

	for (let i = 0; i < 8; i++) {

		let hi = 0;
		let lo = 0;

		for (let j = 0; j < 8; j++) {
			hi = hi << 1;
			lo = lo << 1;
			lo |= d[8 * i + j] & 1;
			hi |= (d[8 * i + j] & 2) >> 1;
		}

		this.data[i] = lo;
		this.data[i + 8] = hi;
	}
};

/**
 *
 */
NesTile.prototype.getData = function() {
	
	let data = new Uint8Array(8 * 8);

	for (let i = 0; i < 8; i++) {
		
		let lo = this.data[i];
		let hi = this.data[i + 8];
		
		for (let j = 7; j >= 0; j--) {
			data[8 * i + j] = (lo & 1) | ((hi & 1) << 1);
			hi = hi >> 1;
			lo = lo >> 1;
		}
	}
};



/**
 *
 */
NesRenderingContext.prototype.selectSpriteTable = function(n) {
	
	
	
};
	












