

function MyOAM() {
	this.y = 0;
	this.i = 0;
	this.x = 0;
	this.a = 0;
	this.data = new Uint8Array(2);
}
MyOAM.prototype.set = function(sp, sy, tiledata) {
	this.y = sp & 0xFF;
	this.i = (sp >> 8) & 0xFF;
	this.a = (sp >> 16) & 0xFF;
	this.x = (sp >> 24) & 0xFF;

	//Load tile data
	if (tiledata) {

		let tile_a = sy - this.y;
		
		//flip y
		if (this.a & 0x80) {
			tile_a = 8 - tile_a;
		}
		tile_a += (this.i * 16);

		let lo = tiledata[tile_a];
		let hi = tiledata[tile_a + 8];

		//flip x
		if (!(this.a & 0x40)) {
			lo = this.reverse(lo);
			hi = this.reverse(hi);
		}

		this.data[0] = lo;
		this.data[1] = hi;
	} else {
		this.data[0] = 0;
		this.data[1] = 0;
	}
};

MyOAM.prototype.reverse = function(b) {
	b = (b & 0xF0) >> 4 | (b & 0x0F) << 4;
	b = (b & 0xCC) >> 2 | (b & 0x33) << 2;
	b = (b & 0xAA) >> 1 | (b & 0x55) << 1;
	return b;
}

MyOAM.prototype.reset = function() {
	this.set(0);
};


//Defines

//Register names
const PPUCTRL   = 0x2000;
const PPUMASK   = 0x2001;
const PPUSTATUS = 0x2002;
const OAMADDR   = 0x2003;
const OAMDATA   = 0x2004;
const PPUSCROLL = 0x2005;
const PPUADDR   = 0x2006;
const PPUDATA   = 0x2007;
const OAMDMA    = 0x4014;


/**
 *
 */
function MyPPU() {

	this.screen_width = 256;
	this.screen_height = 240;

	//External access
	this.screen = new Uint32Array(this.screen_width * this.screen_height);

	this.DUMMYCHROM = new Uint8Array(0x2000);
	this.CHROM = this.DUMMYCHROM;

	this.REGISTERS = new Uint8Array(8);

	//Internal Memory
	this.VRAM    = new Uint8Array(0x800);
	this.OAM     = new Uint8Array(256);
	this.OAM_32  = new Uint32Array(this.OAM.buffer);
	this.PALLETE = new Uint8Array(0x20);

	//State for internal processing
	this.state = {
		nmi : 0,

		vblank : 0,
		sp0hit : 0,
		
		nt : 0,
		
		addr_latch : 0,
		addr : new Uint16Array(1),
		addr8 : null,

		scroll : new Uint8Array(2),

		vram_buffer : 0,
	};

	this.state.addr8 = new Uint8Array(this.state.addr.buffer);

	//Buffers for rendering
	this.buffers = {
		
		OAM : new Array(8),

		bgi : new Uint8Array(32 * 2),
		bg : new Uint8Array(8 * 32 * 2),
		attr : new Uint8Array(32),

		sp0 : new Uint8Array(256 + 8),
		sp_bg : new Uint8Array(256 + 8),
		sp_fg : new Uint8Array(256 + 8)
	};
	
	for (let i = 0; i < 8; i++) {
		this.buffers.OAM[i] = new MyOAM();	
	}
	
	this.setMirroring(0); //vertical
}

MyPPU.colorPallete = [
	0xFF525252, 0xFFB40000, 0xFFA00000, 0xFFB1003D, 0xFF740069, 0xFF00005B, 0xFF00005F, 0xFF001840,
	0xFF002F10, 0xFF084A08, 0xFF006700, 0xFF124200, 0xFF6D2800, 0xFF000000, 0xFF000000, 0xFF000000,
	0xFFC4D5E7, 0xFFFF4000, 0xFFDC0E22, 0xFFFF476B, 0xFFD7009F, 0xFF680AD7, 0xFF0019BC, 0xFF0054B1,
	0xFF006A5B, 0xFF008C03, 0xFF00AB00, 0xFF2C8800, 0xFFA47200, 0xFF000000, 0xFF000000, 0xFF000000,
	0xFFF8F8F8, 0xFFFFAB3C, 0xFFFF7981, 0xFFFF5BC5, 0xFFFF48F2, 0xFFDF49FF, 0xFF476DFF, 0xFF00B4F7,
	0xFF00E0FF, 0xFF00E375, 0xFF03F42B, 0xFF78B82E, 0xFFE5E218, 0xFF787878, 0xFF000000, 0xFF000000,
	0xFFFFFFFF, 0xFFFFF2BE, 0xFFF8B8B8, 0xFFF8B8D8, 0xFFFFB6FF, 0xFFFFC3FF, 0xFFC7D1FF, 0xFF9ADAFF,
	0xFF88EDF8, 0xFF83FFDD, 0xFFB8F8B8, 0xFFF5F8AC, 0xFFFFFFB0, 0xFFF8D8F8, 0xFF000000, 0xFF000000
	/*
	0xFF545454, 0xFF741E00, 0xFF901008, 0xFF880030, 0xFF640044, 0xFF30005C, 0xFF000454, 0xFF000000,
	0xFF00183C, 0xFF002A20, 0xFF003A08, 0xFF004000, 0xFF003C00, 0xFF3C3200, 0xFF000000, 0xFF000000,
	0xFF989698, 0xFFC44C08, 0xFFEC3230, 0xFFE41E5C, 0xFFB01488, 0xFF6414A0, 0xFF202298, 0xFF000000,
	0xFF003C78, 0xFF005A54, 0xFF007228, 0xFF007C08, 0xFF287600, 0xFF786600, 0xFF000000, 0xFF000000,
	0xFFECEEEC, 0xFFEC9A4C, 0xFFEC7C78, 0xFFEC62B0, 0xFFEC54E4, 0xFFB458EC, 0xFF646AEC, 0xFF000000,
	0xFF2088D4, 0xFF00AAA0, 0xFF00C474, 0xFF20D04C, 0xFF6CCC38, 0xFFCCB438, 0xFF3C3C3C, 0xFF000000,
	0xFFECEEEC, 0xFFECCCA8, 0xFFECBCBC, 0xFFECB2D4, 0xFFECAEEC, 0xFFD4AEEC, 0xFFB0B4EC, 0xFF000000,
	0xFF90C4E4, 0xFF78D2CC, 0xFF78DEB4, 0xFF90E2A8, 0xFFB4E298, 0xFFE4D6A0, 0xFFA0A2A0, 0xFF000000,
	*/
];



MyPPU.prototype.readRegister = function(addr) {

	addr = addr & 0xFFFF;

	if (addr < 0x2000 || addr >= 0x4000) {
		throw new Error("Invalid PPU read");
	}

	switch (addr & 0x7) {

		case 0: //PPUCTRL
			return this.REGISTERS[0];
			break;

		case 1: //PPUMASK
			break;

		case 2: //PPUSTATUS
			let ret = this.state.vblank | this.state.sp0hit;
			this.state.vblank = 0;
			this.state.addr_latch = 0;
			return ret;

		case 3: //OAMADDR
			return this.REGISTERS[3];
			break;

		case 4: //OAMDATA
			debugger;
			break;

		case 5: //PPUSCROLL
			this.state.addr_latch = 0;
			return this.REGISTERS[5];
			break;

		case 6: //PPUADDR
			this.state.addr_latch = 0;
			debugger;
			break;

		case 7: //PPUDATA
			return this.readRam();
			break;
	}
};

/** 
 *
 */
MyPPU.prototype.writeRegister = function(addr, byte) {

	addr = addr & 0xFFFF;
	byte = byte & 0xFF;

	if ((addr < 0x2000 || addr >= 0x4000) && addr != 0x4014) {
		throw new Error("Invalid PPU write");
	}

	addr = addr & 0x07;
	this.REGISTERS[addr] = byte;

	switch (addr) {
		case 0: //PPUCTRL
			this.state.nmi = byte & 0x80;
			break;

		case 1: //PPUMASK
		case 2: //PPUSTATUS
		case 3: //OAMADDR
			break;

		case 4: //OAMDATA
			let idx = this.REGISTERS[3];
			this.OAM[idx] = byte;
			this.REGISTERS[3]++;
			break;

		case 5: //PPUSCROLL
			this.state.scroll[this.state.addr_latch] = byte;
			this.state.addr_latch = 1 - this.state.addr_latch;
			break;

		case 6: //PPUADDR
			this.state.addr8[1 - this.state.addr_latch] = byte; //hi => lo, reverse order for little endian
			this.state.addr_latch = 1 - this.state.addr_latch;
			break;

		case 7: //PPUDATA
			this.writeRam(byte);
			break;

		case 0x2014:
			debugger;
			break;
	}
};

/**
 *
 */
MyPPU.prototype.dma = function(addr, ram) {
	let start = this.REGISTERS[OAMADDR & 7];
	addr = addr << 8;
	
	for (let i = 0; i < 256; i++) {		
		this.OAM[(i + start) & 0xFF] = ram[addr + i];
	}
};


/**
 * Write data to vram
 */
MyPPU.prototype.writeRam = function(byte) {

	let addr = this.state.addr[0] & 0x3FFF;

	if (addr < 0x2000) {
		//throw new Error(`Invalid VRAM write at ${addr}`);
		this.CHROM[addr] = byte;
	} else if (addr < 0x3F00) {
		//Mirror 0x2000 - 0x2EFF;	
		addr = (addr - 0x2000) & 0x7FF;
		this.VRAM[addr] = byte;
	
		if (addr >= 0x3C0 && addr < 0x400) {
			//console.log('$' + hex(addr), byte);	
		}
	
	} else {

		if (addr == 0x3F10 || addr == 0x3F14 || addr == 0x3F18 || addr == 0x3F1C) {
			addr = addr & 0xFFEF;
		}
		
		this.PALLETE[addr & 0x1F] = byte;
	}

	//VRAM increment
	let incr = (this.REGISTERS[0] & 0x4) ? 32 : 1;
	this.state.addr[0] = (this.state.addr[0] + incr);
	//this.state.addr[0] &= 0x3FFF;
};


/**
 * Write data to vram
 */
MyPPU.prototype.readRam = function() {

	let byte;
	let addr = this.state.addr[0] & 0x3FFF;

	if (addr < 0x2000) {
		byte = this.state.vram_buffer;
		this.state.vram_buffer = this.CHROM[addr];
	} else if (addr < 0x3F00) {
		//Mirror 0x2000 - 0x2EFF;
		addr = (addr - 0x2000) & 0x7FF;
		this.state.vram_buffer = this.VRAM[addr];
		byte = this.state.vram_buffer;
	} else {

		if (addr == 0x3F10 || addr == 0x3F14 || addr == 0x3F18 || addr == 0x3F1C) {
			addr = addr & 0xFFEF;
		}

		byte = this.PALLETE[addr & 0x1F];
	}

	//VRAM increment
	let incr = (this.REGISTERS[0] & 0x4) ? 32 : 1;
	this.state.addr[0] = (this.state.addr[0] + incr);
	//this.state.addr[0] &= 0x3FFF;

	return byte;
};



MyPPU.prototype.setMirroring = function(m) {

	let s0, s1, s2, s3;

	switch (m) {

		//Vertical Mirroring
		case 0:
			s0 = 0; s1 = 0x400;
			s2 = 0; s3 = 0x400;
			break;
	}

	this.nt0 = new Uint8Array(this.VRAM.buffer, s0, 0x400);
	this.att0 = new Uint8Array(this.VRAM.buffer, s0 + 0x3C0, 64);

	this.nt1 = new Uint8Array(this.VRAM.buffer, s1, 0x400);
	this.att1 = new Uint8Array(this.VRAM.buffer, s1 + 0x3C0, 64);

	this.nt2 = new Uint8Array(this.VRAM.buffer, s2, 0x400);
	this.att2 = new Uint8Array(this.VRAM.buffer, s2 + 0x3C0, 64);

	this.nt3 = new Uint8Array(this.VRAM.buffer, s3, 0x400);
	this.att3 = new Uint8Array(this.VRAM.buffer, s3 + 0x3C0, 64);
};



MyPPU.prototype.prepareOAM = function(n) {

	let o = 0, i;

	//Clear
	for (i = 0; i < 8; i++) {
		this.buffers.OAM[i].reset();
	}

	this.state.sp0 = null;

	//@todo: https://nesdev-wiki.nes.science/wikipages/PPU_programmer_reference.xhtml#Values_during_rendering
	for (i = 0; i < 64; i++) {

		if (this.prepareOAMEntry(n, i, o)) {

			if (i == 0) {
				this.state.sp0 = this.buffers.OAM[i];
			}

			if (++o >= 8) {
				break;
			}
		}
	}
};

/**
 *
 */
MyPPU.prototype.prepareOAMEntry = function(sy, i, cur) {

	let oy = this.OAM[i * 4];

	if (oy <= sy - 8 || oy > sy) {
		return false;
	}

	let rawdata = this.OAM_32[i];

	this.buffers.OAM[cur].set(rawdata, sy, this.CHROM);

	return true;
};



/**
 *
 */
MyPPU.prototype.renderSprites = function(n, pri) {

	let checkSp0 = !this.state.sp0hit;

	this.buffers.sp_bg.fill(0);
	this.buffers.sp_fg.fill(0);
	checkSp0 && this.buffers.sp0.fill(0);

	for (let i = 7; i >= 0; i--) {
		this.renderSprite(this.buffers.OAM[i]);
	}

	if (checkSp0 && this.state.sp0) {
		this.renderSprite0();
	}
};

/**
 *
 */
MyPPU.prototype.renderSprite = function(sp) {

	let buffer = (sp.a & 0x20) ? this.buffers.sp_bg : this.buffers.sp_fg;

	let pal = 0x10 | ((sp.a & 0x03) << 2);

	let lobyte = sp.data[0];
	let hibyte = sp.data[1];
	
//if (sp.x != 0 && (lobyte || hibyte)) debugger;
	for (let s = 0; s < 8; s++) {

		let lo = (lobyte >> s) & 0x1;
		let hi = (hibyte >> s) & 0x1;

		let coli = this.PALLETE[pal + (hi << 1) | lo];
		if (coli > 0) {
			buffer[sp.x + s] = coli;
		}
	}
};

/**
 *
 */
MyPPU.prototype.renderSprite0 = function() {

	let buffer = this.buffers.sp0;
	let sp = this.state.sp0;

	for (let s = 0; s < 8; s++) {
		let lo, hi;

		lo = sp.data[0] & 0x1;
		hi = sp.data[1] & 0x1;

		sp.data[0] = sp.data[0] >> 1;
		sp.data[1] = sp.data[1] >> 1;

		buffer[sp.x + s] = (hi << 1) | lo;
	}
};

/**
 *
 */
MyPPU.prototype.renderBgLookup = function(y) {
	
	let i,
		bgi = this.buffers.bgi,
		rowstart
		;

	//rowstart = (y >= 240 ? 0x800 : 0x000) + (y >> 3) * 32;
	let ntx = 0x400 * (this.state.nt & 1);

	//Vertical mirroring
	y = y % 240;
	rowstart = (y >> 3) * 32;

	let nt1 = 0x000 + ntx;
	let nt2 = 0x400 - ntx;

	for (i = 0; i < 32; i++) {
		//bgi[     i] = this.nt0[rowstart + i];
		//bgi[32 + i] = this.nt1[rowstart + i];
		bgi[     i] = this.VRAM[nt1 + rowstart + i];
		bgi[32 + i] = this.VRAM[nt2 + rowstart + i];
	}
};


/**
 *
 */
MyPPU.prototype.renderAttr = function(y) {
	
	let i,
		attr = this.buffers.attr,
		byte1, byte2, shift,
		rowstart
		;
	
	let metay, attry;

	//Vertical mirroring
	y = y % 240;
	attry = y >> 5;
	metay = y >> 4;
	
	shift = metay % 2 == 1 ? 4 : 0;
	rowstart = attry * 8;

	for (i = 0; i < 8; i++) {

		byte1 = this.att0[rowstart + i];
		byte2 = this.att1[rowstart + i];

		byte1 = (byte1 >> shift) & 0xF;
		byte2 = (byte2 >> shift) & 0xF;

		//Left,Right
		attr[2 * i    ] = byte1 & 0x3;
		attr[2 * i + 1] = byte1 >> 2;

		attr[16 + 2 * i    ] = byte2 & 0x3;
		attr[16 + 2 * i + 1] = byte2 >> 2;
	}
};

/**
 *
 */
MyPPU.prototype.renderBg = function(y, pri) {

	//Only update internal index buffer on each tile boundary
	if (y % 8 == 0) {
		this.renderBgLookup(y);
	}

	if (y % 16 == 0) {
		this.renderAttr(y);	
	}

	let bgi = this.buffers.bgi, 
	    bg = this.buffers.bg,
	    ptstart = ((this.REGISTERS[0] & 0x10) >> 4) * 0x1000
		;

	let nt = this.state.nt & 1;	

	let i, ti, tileaddr, hi, lo, x = 0, ty = y & 0x7;

	for (i = 0; i < 64; i++) {
		
		tileaddr = 16 * bgi[i];

		lo = this.CHROM[ptstart + tileaddr + ty];
		hi = this.CHROM[ptstart + tileaddr + ty + 8];

		for (ti = 7; ti >= 0; ti--) {
			bg[x + ti] = ((hi & 0x1) << 1) | (lo & 0x1);
			hi >>= 1;
			lo >>= 1;
		}

		x += 8;
	}
};


/**
 *
 */
MyPPU.prototype.renderScanline = function(n) {
	
	if (n == 0) {
		this.state.vblank = 0;
	}

	if (n < 240) {
		this.renderVisibleScanline(n);	
	}

	if (n == 241) {
		this.state.scroll[0] = 0;
		this.state.scroll[1] = 0;
		this.state.vblank = 0x80;
	}

	if (n == 261) {
		this.state.sp0hit = 0;
	}
};

/**
 *
 */
MyPPU.prototype.renderVisibleScanline = function(n) {

	let addr = this.screen_width * n;

	this.prepareOAM(n);
	this.renderSprites(n, 0);
	this.renderBg(n);

	let pali, col = 0, bg_col;
	let checkSp0 = !this.state.sp0hit;
	let sx = this.state.scroll[0];
	
	let fg = this.buffers.sp_fg,
	    bg = this.buffers.sp_bg;

	for (let i = 0; i < 256; i++) {

		if (n == 1 && i == 8 && window.pause) {
			debugger;
		}

		bg_col = this.buffers.bg[(sx + i) % 512];

		if (checkSp0 && bg_col && this.buffers.sp0[i]) {
			this.state.sp0hit = 0x40;
		}

		//col = i & 0x3F;
		if (fg[i]) {
			col = fg[i];
		} else if (bg_col > 0) {
			pali = this.buffers.attr[((i + sx) % 512) >> 4] << 2;
			col = this.PALLETE[pali + bg_col];
		} else if (bg[i]) {
			col = bg[i];
		} else {
			col = this.PALLETE[0];
		}

		this.screen[addr] = MyPPU.colorPallete[col];
		addr++;
	}
};




