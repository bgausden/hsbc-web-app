const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
/* const url = require('url').URL
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)); */
const path = require("path");

module.exports = ((env, args) => {
    config = {
        context: path.resolve(__dirname, './'),
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, "dist"),
            //filename: "[name].[contenthash].js",
            clean: true, // clean the output directory before emit
        },
        resolve: {
            extensionAlias: {
                ".js": [".js", ".ts"],
                ".cjs": [".cjs", ".cts"],
                ".mjs": [".mjs", ".mts"]
            }
        },
        module: {
            rules: [
                {
                    test: /\.([cm]?ts|tsx)$/,
                    //exclude: /node_modules/,
                    use: "ts-loader"
                },
                /* { // obsoleted by configuring SCSS support below
                    test: /\.css$/i,
                    use: [
                        'style-loader', 'css-loader'
                    ]
                }, */
                {
                    test: /\.(s?css)$/,
                    use: [{
                        loader: 'style-loader', // inject CSS to page
                        //loader: MiniCssExtractPlugin.loader // optionally extract CSS into separate files and inject into page
                    }, {
                        loader: 'css-loader', // translates CSS into CommonJS modules
                    }, {
                        loader: 'postcss-loader', // Run post css actions
                        options: {
                            postcssOptions: {
                                plugins: function() { // post css plugins, can be exported to postcss.config.js
                                    return [
                                        require('precss'),
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        }
                    }, {
                        loader: 'sass-loader' // compiles Sass to CSS
                    }]
                },
                {
                    test: /\.html$/,
                    //exclude: /node_modules/,
                    loader: "html-loader",
                    options: {
                        minimize: false
                    }
                },
                {
                    test: /\.(svg|jpg|jpeg|gif|png)$/,
                    type: 'asset/resource',
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html",
                filename: "./index.html"
            }),
            /* new MiniCssExtractPlugin({ // only needed if MiniCssExtractPlugin.loader (above) is enabled
                filename: 'main.css',
            }), */
        ],
    }
    return config
})()

