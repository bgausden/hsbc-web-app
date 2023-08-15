import {CleanWebpackPlugin} from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import process from "process";
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import path from "path";

export default async (env, options) => {
  const dev = options.mode === "development";
  const buildType = dev ? "dev" : "prod";
  const config = {
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: 'bundle.js',
    },
    devtool: "inline-source-map",
    entry: "./src/index.ts",
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"],
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
          exclude: [/node_modules/],
          use: "ts-loader"
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader"
        },
        {
          test: /\.(css|svg|jpg|jpeg|gif|png)$/,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "src/index.html"
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            to: "index.css",
            from: "./src/index.css"
          }
        ]
      }),
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      /*       server: {
              type: "https",
              options: {
                ...await getHttpsServerOptions()
              }
      
            }, */
      port: process.env.npm_package_config_dev_server_port || "8080",
      host: process.env.npm_package_config_dev_server_host || "127.0.0.1"
    }
  }
  return config;
}
