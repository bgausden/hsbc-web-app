const HtmlWebpackPlugin = require("html-webpack-plugin")
/* const url = require('url').URL
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)); */
const path = require("path");

module.exports = ((env, args) => {
    config = {
        context: path.resolve(__dirname, './'),
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].[contenthash].js",
            clean: true,
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
                    test: /\.css$/i,
                    use: [
                        'style-loader', 'css-loader'
                    ]
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
        ],
    }
    return config
})()

