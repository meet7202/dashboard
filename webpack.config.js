var path = require('path');
var webpack = require('webpack');

const debug = process.env.NODE_ENV !== "production";

module.exports = {
	entry: path.join(__dirname, 'app/routes.js'),
	output: {
		path: path.join(__dirname, 'dist/js'),
		publicPath: '/dist/js/',
		filename: 'app.js'
	},
	devtool: 'inline-sourcemap',
	devServer: {
		inline: true,
		port: 1357,
		contentBase: './',
		historyApiFallback: {
			index: './index.html'
		}
	},
	module: {
		preLoaders: [
			{ test: /\.json$/, exclude: /node_modules/, loader: 'json' },
		],
		loaders: [{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'stage-0', 'react']
				}
			}, {
				test: /node_modules\/JSONStream\/index\.js$/,
				loaders: ['shebang', 'babel']
			}, { test: /\.css$/, loader: "style-loader!css-loader" },
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
			{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
		]
	}
};
