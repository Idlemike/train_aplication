// process.traceDeprecation = true;
const path = require('path');
// подключаем path к конфигу вебпак

const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Подключили к проекту плагин
// webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// подключаем плагин
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
// создаем переменную для development-сборки

module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    devServer: {
        disableHostCheck: true
    },
    devtool: isDev ? 'source-map' : '',
    module: {
        rules: [{
            enforce: "pre",
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "eslint-loader",

            options: {
                "extends": "eslint:recommended",
                // eslint options (if necessary)
            },
        },
            { // тут описываются правила
                test: /\.js$/, // регулярное выражение, которое ищет все js файлы
                use:
                    {
                        loader: "babel-loader",


                    },

                // весь JS обрабатывается пакетом babel-loader
                exclude: /node_modules/ // исключает папку node_modules
            },
            // пример настройки плагина image-webpack-loader
            {
                test: /\.(png|jpe?g|gif|ico|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            esModule: false
                        },
                    },
                    // 'file-loader?name=./images/[name].[ext]', // указали папку, куда складывать изображения
                    {
                        loader: 'image-webpack-loader',
                        options: {
                        }
                    },
                ]
            },
            {// в правилах укажите, что если вы собираете в режиме dev, то плагин MiniCssExtractPlugin загружать не нужно.
                test: /\.css$/i,
                use: [
                    (isDev ? 'style-loader' : MiniCssExtractPlugin.loader),
                    {
                        loader:'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: './fonts/[name].[ext]'
                }
                /*               loader: 'file-loader?name=./vendor/[name].[ext]'*/
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css',
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default'],
            },
            canPrint: true
        }), // подключите плагин после MiniCssExtractPlugin
        new HtmlWebpackPlugin({ // настроили плагин
            inject: false,
            minify: {
                collapseWhitespace: isProd
            },
            template: './index.html',
            filename: 'index.html'
        }),
        new WebpackMd5Hash()
    ]
};