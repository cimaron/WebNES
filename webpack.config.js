const path = require('path');

module.exports = {
	entry: {
		index: './src/index.js'
	},
	mode : 'production',
	devtool: 'source-map',
	output: {
		filename: 'webnes.js',
		path: path.resolve(__dirname, 'dist')
	}
};