const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/assets/script.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {rules: [
        {
            test: /\.(png|jpe?g|gif|svg)$/i,
            test: /\.css$/i, 
            use: ["style-loader", "css-loader"]
        },
    ]},
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        })
    ],
    devServer: {
        static: path.resolve(__dirname, "dist"),
        port: 9000,
        open: true
    },
    mode: "production"
}