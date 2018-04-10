const path = require('path')
const webpack = require('webpack')
const glob = require('glob') //匹配文件路径
//为html文件中引入的外部资源;可以生成创建html入口文件
const HtmlWebpackPlugin = require('html-webpack-plugin')
//该插件的主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//在每次构建前清理 /dist 文件夹
const CleanWebpackPlugin = require('clean-webpack-plugin')

const resolve = function resolve(...dir) {   //拼接路径
    return path.resolve(__dirname, ...dir)
}

const globPath = {
    js: resolve('src/js/*.js'),
    html: resolve('src/view/*.html')
}

const pathJs = getEntry(globPath.js)
const pathHtml = getEntry(globPath.html)

const webpackConf = {
    entry: pathJs,
    output: {
        filename: 'js/[name].min.js',
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
            // {
            //     test: require.resolve('jquery'),
            //     use: [{
            //         loader: 'expose-loader',
            //         options: 'jQuery'
            //     },{
            //         loader: 'expose-loader',
            //         options: '$'
            //     }]
            // },
            {
                test:/\.js$/,
                use:'babel-loader'
            }
        ]
    },
    // optimization:{
    //     splitChunks:{
    //         cacheGroups:{
    //             commons:{
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: "vendors",
    //                 chunks: "all"
    //             }
    //         }
    //     }
    // },
    plugins:[
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin({
            filename:'css/[name].min.css'
        }),
        // new HtmlWebpackPlugin({
        //     filename: 'hello.html',
        //     template: './src/view/hello.html'
        // })
        // ,
        // new webpack.ProvidePlugin({
        //     $:"jquery",
        //     jQuery:"jquery"
        // })
    ],
    devServer:{
        host: '172.16.1.147',
        port: '8090',
        proxy: {
            '/api': {
                target: 'http://172.16.0.59:8081',
                secure: false
            }
        }
    }
}
  
/**
 * 入口entry()的值 {}
 * @param {obj} globPath js查找路径
 * @param {obj} entries 文件名与文件路径的值键对
 * eg:{'hello','src/js/hello.js'}
 */
function getEntry(path){
    let entries = {}
    glob.sync(path).forEach(entry => {
        let arr = entry.split('/')
        let name = arr[arr.length - 1].split('.')[0]
        entries[name] = entry
    })
    return entries
}

//html、css、js一一对应
for (let html in pathHtml) {
    let htmlWebpack = {
        filename: html + '.html',
        template: pathHtml[html],
        chunks: [html]  //忽略的话所有入口都会被注入
    }
    webpackConf.plugins.push(new HtmlWebpackPlugin(htmlWebpack))
}

module.exports = webpackConf