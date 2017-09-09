const path = require('path');
// clean-webpack-plugin插件，每次打包先删除以前打包的文件
//const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// 环境变量
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
var getHtmlConfig = function(name, title) {
    return {
        template: './src/view/' + name + '.html',
        filename: 'view/' + name + '.html',
        title: title,
        inject: true,
        hash: true,
        chunks: ['common', name]
    }
}

config = {
    devtool: 'inline-source-map',
    // devServer: {
    //     contentBase: './dist/view',
    //     inline: true,
    //     historyApiFallback: true,
    //     open: true
    // },
    entry: {    
        index: './src/page/index/index.js',
        login: './src/page/login/index.js',
        result: './src/page/result/index.js',
        common: ['./src/page/common/index.js'],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist',
        filename: 'js/[name].js'
    },
    externals: {
        jquery: 'window.jquery'
    },
    resolve: {
        alias: {
            util: path.join(__dirname, '/src/util'),
            page: path.join(__dirname, '/src/page'),
            service: path.join(__dirname, '/src/service'),
            image: path.join(__dirname, '/src/image'),
            node_modules: path.join(__dirname, '/node_modules')
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/, 
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(png|svg|jpg|gif|woff|eot|ttf|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'resource/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.string$/, 
                use: ['html-loader']
            },
        ]
    },
    plugins: [
        //new CleanWebpackPlugin(['dist']),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/base.js'
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css'
        }),
        new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
        new HtmlWebpackPlugin(getHtmlConfig('login', '用户登录')),
        new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果')),
    ]
}

if(WEBPACK_ENV === 'dev') {
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

module.exports = config