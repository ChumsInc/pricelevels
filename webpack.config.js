/**
 * Created by steve on 12/2/2016.
 */
const webpack = require('webpack');
const path = require('path');
const WebpackChunkHash = require("webpack-chunk-hash");
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let args = process.argv;

let production = false;
if (args.indexOf('-p') > -1) {
    console.log('*** building in production mode ***');
    production = true;
}

const localProxy = {
    target: {
        host: 'localhost',
        protocol: 'http:',
        port: 8081
    },
    ignorePath: false,
    changeOrigin: true,
    secure: false,
};
module.exports = production
    ? {
        devtool: 'source-map',
        entry: {
            app: './src/index.js',
            // vendor: ['bluebird', 'classnames','mobx', 'mobx-react', 'moment', 'react', 'react-dom', 'whatwg-fetch'],
        },
        output: {
            path: path.join(__dirname, 'public/js'),
            filename: "[name].[chunkhash].js",
            chunkFilename: "[name].[chunkhash].js",
            sourceMapFilename: '[file].map',
            publicPath: '/js/',
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: ['react-hot-loader/webpack', 'babel-loader'],
                    include: path.join(__dirname, 'src')
                    // include: [path.join(__dirname, 'src')]
                },
                {
                    test: /\.css$/,
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader', options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: '[local]__[hash:base64:5]'
                        }}],
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new ManifestPlugin(),
            new BundleAnalyzerPlugin(),
        ],
        target: 'web',
    }
    : {
        devtool: 'eval-source-map',
        entry: {
            app: './src/index',
            // vendor: ['bluebird', 'classnames','mobx', 'mobx-react', 'react', 'react-dom', 'whatwg-fetch']
        },
        output: {
            path: path.join(__dirname, './public/js'),
            filename: production ? 'bundle.[hash].js' : 'bundle.js',
            sourceMapFilename: '[file].map',
            publicPath: '/js/',
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: ['react-hot-loader/webpack', 'babel-loader'],
                    include: path.join(__dirname, 'src')
                },
                {
                    test: /\.css$/,
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader', options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: '[local]__[hash:base64:5]'
                        }}],
                }
            ]
        },
        plugins: [
                // new webpack.optimize.CommonsChunkPlugin({name: "vendor", filename: "vendor.bundle.js"}),
                new webpack.HotModuleReplacementPlugin(),
                new BundleAnalyzerPlugin(),
            ],
        target: 'web',
        devServer: {
            hot: true,
            proxy: {
                '/node-dev': Object.assign({}, localProxy),
                '/node/': Object.assign({}, localProxy),
                '/node_modules/': Object.assign({}, localProxy),
                '/sage/': Object.assign({}, localProxy),
                '/node-sage': Object.assign({}, localProxy),
                '/node-chums': Object.assign({}, localProxy),
                '/node-bc': Object.assign({}, localProxy),
                '/node-safety': Object.assign({}, localProxy),
                '/intranet': Object.assign({}, localProxy),
            }
        },
    };

