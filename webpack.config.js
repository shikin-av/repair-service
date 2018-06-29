const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        index: path.resolve(__dirname, './src/client/index.js'),
        admin: path.resolve(__dirname, './src/client/admin.js'),
        login: path.resolve(__dirname, './src/client/login.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: [/node_modules/, /public/],
                options: {
                    presets: ['stage-0', 'es2015', 'es2017', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!autoprefixer-loader!less",
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.gif$/,
                loader: "url-loader?limit=10000&mimetype=image/gif"
            },
            {
                test: /\.jpg$/,
                loader: "url-loader?limit=10000&mimetype=image/jpg"
            },
            {
                test: /\.png$/,
                loader: "url-loader?limit=10000&mimetype=image/png"
            },
            {
                test: /\.svg/,
                loader: "url-loader?limit=26000&mimetype=image/svg+xml"
            },
            {
                test: /\.jsx$/,
                loader: "babel-loader",
                exclude: [/node_modules/, /public/],
                options: {
                    presets: ['stage-0', 'es2015', 'react']
                }
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    }
};
