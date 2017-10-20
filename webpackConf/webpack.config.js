const webpack = require('webpack')
 //会自动帮你生成一个 html 文件，并且引用相关的 assets 文件(如 css, js)
const htmlWebpackPlugin = require('html-webpack-plugin')
//提取css文件,否则css会写在js代码里面
const extractTextPlugin = require('extract-text-webpack-plugin')

const path = require('path')

function resolve(...dir) {  //拼接
    return path.resolve(__dirname, ...dir)
}

module.exports = {
    entry: resolve('src/js/index.js'),
    output: {
        filename: 'js/[name].[hash:8].js',
        path: resolve('dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test:/\.css$/,
                loader:['css-loader','style-loader']
            },
            {
                test:/\.scss$/,
                use: extractTextPlugin.extract({
                    use: ['css-loader','postcss-loader','sass-loader'] 
                }) 
                //sass-loader依赖于node-sass
            },
            {
                test:/\.pug$/,
                use:[
                    'raw-loader',
                    {
                        loader:'pug-html-loader',
                        options:{
                            doctype:'html'
                        }
                    }
                ]
            }
        ]
    },
    plugins:[
        new htmlWebpackPlugin({
            template:'src/view/a.pug'
        }),
        new extractTextPlugin({
            filename:'css/[name].css',
            allChunks:true
        })
    ]
}
