var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/main.js',
	output: {
    	path: path.resolve(__dirname, 'dist'),
		publicPath: "/dist/",
    	filename: 'index.js',
		libraryTarget: 'var',
    	library: 'Index'
	},
	resolve: {
		modules: [
			path.resolve(__dirname, "src"),
			"node_modules"
		],
		alias: {
			'gl-matrix': path.resolve('./node_modules/gl-matrix/dist/gl-matrix.js'),
			'jquery': path.resolve('./node_modules/jquery/dist/jquery.js')
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
	devtool: 'inline-source-map',
	devServer: {
		overlay: {
			warnings: true,
			errors: true
		}
	}
};
