"use strict";

const path = require('path');
const glob = require('glob');
const Webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifycssPlugin = require("purifycss-webpack");
const extractHtml = new ExtractTextPlugin("./index.html");
const extractCss = new ExtractTextPlugin("./bundle.css");

module.exports = {
    target: "web",
    entry: "./app.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: extractHtml.extract({
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                })
            },
            {
                test: /\.css$/,
                use: extractCss.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader'
                })
            },
            {
                test: /.*\.(gif|png|jpe?g|svg)$/i,
                loaders: [
                    "file-loader",
                    {
                        loader: "image-webpack-loader",
                        query: {
                            progressive: true,
                            optimizationLevel: 7,
                            interlaced: false,
                            pngquant: {
                                quality: "90-100",
                                speed: 4
                            }
                        }
                    }
                ]
            },
            {
                test: /\.ico$/,
                loader: "file-loader?name=[name].[ext]"
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=1000000&mimetype=application/font-woff"
            }
        ]
    },
    plugins: [
        extractHtml,
        extractCss,
        new PurifycssPlugin({
            paths: glob.sync(path.join(__dirname, './*.html')),
            purifyOptions: {
                minify: true
            }
        }),
        new Webpack.optimize.UglifyJsPlugin({minimize: true}),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
};
