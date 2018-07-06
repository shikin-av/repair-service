const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require ('extract-text-webpack-plugin');

module.exports = {
    entry: {
        site: path.resolve(__dirname, './src/client/pages/site.js'),
        admin: path.resolve(__dirname, './src/client/pages/admin.js'),
        login: path.resolve(__dirname, './src/client/pages/login.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    devtool: 'source-map',
    resolve: {
        modules: ['node_modules', 'src'],
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: [/node_modules/],
                options: {
                    presets: ['stage-0', 'es2015', 'es2017', 'react']
                }
            },
            {
                test: /\.s?css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            }
                        },
                        'postcss-loader',
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!autoprefixer-loader!less",
                exclude: [/node_modules/]
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
                exclude: [/node_modules/],
                options: {
                    presets: ['stage-0', 'es2015', 'es2017', 'react']
                }
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({ filename: '[name].bundle.css' })
    ]
};
