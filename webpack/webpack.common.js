const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin =
	require('webpack').container.ModuleFederationPlugin
const deps = require('../package.json').dependencies

const getWPConfig = (env) => {
	return {
		entry: path.resolve(__dirname, '..', './src/index.tsx'),
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		module: {
			rules: [
				{
					test: /\.(ts|js)x?$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
						},
					],
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
				{
					test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
					type: 'asset/resource',
				},
				{
					test: /\.(woff(2)?|eot|ttf|otf)$/,
					type: 'asset/inline',
				},
			],
		},
		output: {
			publicPath:
				env === 'dev'
					? 'http://localhost:3004/'
					: 'https://game.rahulteja.dev/',
		},
		plugins: [
			new HTMLWebpackPlugin({
				template: path.resolve(__dirname, '..', './src/index.html'),
			}),
			new ModuleFederationPlugin({
				name: 'game',
				filename: 'game.js',
				exposes: {
					'./Game': './src/bootstrap.tsx',
				},
				shared: {
					react: {
						singleton: true,
						requiredVersion: deps.react,
					},
					'react-dom': {
						singleton: true,
						requiredVersion: deps['react-dom'],
					},
					'styled-components': {
						singleton: true,
						requiredVersion: deps['styled-components'],
					},
				},
			}),
		],
		stats: 'errors-only',
	}
}

module.exports = {
	getWPConfig: getWPConfig,
}
