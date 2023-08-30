/* const url = require('url').URL
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)); */
const path = require("path");
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

module.exports = ((env, args) => {
    config = {
        context: path.resolve(__dirname, './'),
        output: {
            path: path.resolve(__dirname, "dist"),
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
                {
                    test: /\.(sc?ss)$/,
                    use: [{
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
                    test: /\.(svg|jpg|jpeg|gif|png)$/,
                    type: 'asset/resource',
                },
            ]
        },
        plugins: [
            new HtmlBundlerPlugin({
                entry: {
                    // define templates here
                    index: './src/index.html', // => dist/index.html
                },
                js: {
                    // output filename of compiled JavaScript, used if `inline` option is false (defaults)
                    filename: '[name].[contenthash:8].js',
                    //inline: true, // inlines JS into HTML
                },
                css: {
                    // output filename of extracted CSS, used if `inline` option is false (defaults)
                    filename: '[name].[contenthash:8].css',
                    inline: false, // inlines CSS into HTML
                },
            }),
        ],
        // enable live reload
        devServer: {
            static: path.join(__dirname, 'dist'),
            watchFiles: {
                paths: ['src/**/*.*'],
                options: {
                    usePolling: true,
                },
            },
            client: {
                overlay: {
                    warnings: false, // disable warnings popup windows in browser
                }
            },
        },
    }
    return config
})()

