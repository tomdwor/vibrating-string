const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

module.exports = {
    mode: 'production',
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader","css-loader"]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
           },
        ]
    },
    plugins : [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            favicon: "./src/favicon.png",
            inject : "body",
        })
    ]
};
