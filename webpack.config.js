var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/main.js',
	output: {
    	path: path.resolve(__dirname, 'dist'),
    	filename: 'index.js',
		libraryTarget: 'var',
    	library: 'Index'
	},
	resolve: {
		alias: {
			'gl-matrix': path.resolve('./node_modules/gl-matrix/dist/gl-matrix.js')
		}
	},
	module: {
    	loaders: [
        	{
            	test: /\.js$/,
            	loader: 'babel-loader',
            	query: {
                	presets: ['env']
            	}
        	},
			{
                test: /\.glsl$/,
				loader: 'webpack-glsl-loader'
            }
    	]
	},
	stats: {
    	colors: true
	},
	devtool: 'source-map'
};
