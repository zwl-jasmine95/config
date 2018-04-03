const path = require('path')
const webpack = require('webpack')
//为html文件中引入的外部资源;可以生成创建html入口文件
const HtmlWebpackPlugin = require('html-webpack-plugin')
//该插件的主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//在每次构建前清理 /dist 文件夹
const CleanWebpackPlugin = require('clean-webpack-plugin')

const resolve = function resolve(...dir) {   //拼接路径
    return path.resolve(__dirname, ...dir)
}

module.exports = {
    entry: resolve('src/js/hello.js'),
    output: {
        filename: 'js/hello.min.js',
        path: resolve('dist')
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            },
            {
                test:/\.scss$/,
                use:ExtractTextPlugin.extract({
                    use: ['css-loader','sass-loader']
                })
            },
            {
                test:/\.js$/,
                use:'babel-loader'
            },
            {
                test:require.resolve('jquery'),
                loader:'expose?jQuery!expose?$'
            }
        ]
    },
    plugins:[
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin({
            filename:'css/hello.min.css'
        }),
        new HtmlWebpackPlugin({
            filename: 'hello.html',
            template: './src/view/hello.html'
        })
    ],
    devServer:{
        host: '172.16.1.147',
        port: '8090',
        proxy: {
            '/api': {
                target: 'http://www.bonday.cn',
                secure: false
            }
        }
    }
}