/* const url = require('url').URL
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)); */
const path = require("path");
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

module.exports = ((env, args) => {
    const config = {
        context: path.resolve(__dirname, './'),
        cache: {
            type: 'filesystem',
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            clean: true, // clean the output directory before emit
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            extensionAlias: {
                '.js': ['.ts', '.js'],
                '.cjs': ['.cts', '.cjs'],
                '.mjs': ['.mts', '.mjs']
            }
        },
        module: {
            rules: [
                {
                    test: /\.([cm]?ts|tsx)$/,
                    //exclude: /node_modules/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                        }
                    }
                },
                {
                    test: /\.(sc?ss)$/,
                    use: [{
                        loader: 'css-loader', // translates CSS into CommonJS modules
                    }, {
                        loader: 'postcss-loader', // Run post css actions
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('postcss-preset-env')({ stage: 2 }),
                                ]
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
        optimization: {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        priority: 10,
                    },
                },
            },
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
    }
    return config
})()

