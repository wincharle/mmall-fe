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
    //     open: true,
    //     publicPath: '/dist/'
    // },
    entry: {
        'index': './src/page/index/index.js',
        'list': './src/page/list/index.js',
        'detail': './src/page/detail/index.js',
        'cart': './src/page/cart/index.js',
        'order-confirm': './src/page/order-confirm/index.js',
        'order-list': './src/page/order-list/index.js',
        'order-detail': './src/page/order-detail/index.js',
        'user-login': './src/page/user-login/index.js',
        'payment': './src/page/payment/index.js',
        'user-register': './src/page/user-register/index.js',
        'user-pass-reset': './src/page/user-pass-reset/index.js',
        'result': './src/page/result/index.js',
        'user-center': './src/page/user-center/index.js',
        'user-center-update': './src/page/user-center-update/index.js',
        'user-pass-update': './src/page/user-pass-update/index.js',
        'common': ['./src/page/common/index.js'],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist/',
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
        new HtmlWebpackPlugin(getHtmlConfig('list', '商品列表')),
        new HtmlWebpackPlugin(getHtmlConfig('detail', '商品详情')),
        new HtmlWebpackPlugin(getHtmlConfig('cart', '购物车')),
        new HtmlWebpackPlugin(getHtmlConfig('order-confirm', '订单确认')),
        new HtmlWebpackPlugin(getHtmlConfig('order-list', '订单列表')),
        new HtmlWebpackPlugin(getHtmlConfig('order-detail', '订单详情')),
        new HtmlWebpackPlugin(getHtmlConfig('payment', '订单支付')),
        new HtmlWebpackPlugin(getHtmlConfig('user-login', '用户登录')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register', '用户注册')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset', '找回密码')),
        new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center', '个人中心')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center-update', '修改个人信息')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-update', '修改密码')),
    ]
}

if(WEBPACK_ENV === 'dev') {
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

module.exports = config