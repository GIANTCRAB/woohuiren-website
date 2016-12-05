const config = function () {
    "use strict";

    const Webpack = require("webpack");
    const CompressionPlugin = require("compression-webpack-plugin");
    const ExtractTextPlugin = require("extract-text-webpack-plugin");
    const PurifycssPlugin = require("purifycss-webpack-plugin");
    let extractHTML = new ExtractTextPlugin("./index.html");
    let extractCSS = new ExtractTextPlugin("./bundle.css");

    return {
        target: "web",
        entry: "./app.js",
        output: {
            path: "./dist",
            filename: "bundle.js"
        },
        module: {
            loaders: [
                {
                    test: /\.html$/,
                    loader: extractHTML.extract({
                        fallbackLoader: "file-loader",
                        loader: "html-loader",
                        query: {
                            minimize: true
                        }
                    })
                },
                {
                    test: /\.css$/,
                    loader: extractCSS.extract({
                        fallbackLoader: "style-loader",
                        loader: "css-loader"
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
            extractHTML,
            extractCSS,
            new PurifycssPlugin({
                basePath: __dirname,
                paths: [
                    "./*.html"
                ],
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
};

module.exports = config;