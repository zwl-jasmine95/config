const webpack = require('webpack')
//会自动帮你生成一个 html 文件，并且引用相关的 assets 文件(如 css, js)
const htmlWebpackPlugin = require('html-webpack-plugin')
//提取css文件,否则css会写在js代码里面
const extractTextPlugin = require('extract-text-webpack-plugin')

const path = require('path')
const glob = require('glob'); //匹配文件路径
const globPath = {
    js:resolve('src/js/**/*.js'),
    // js:resolve('src/js/**/*.+(t|j)s'),
    pug:resolve('src/view/page/**/*.pug')
}
const pathJs = getEntry(globPath.js);
const pathPug = getEntry(globPath.pug);

function resolve(...dir) {  //拼接
   return path.resolve(__dirname, '..', ...dir)
}

const webpackConf = {
   entry: pathJs,
   output: {
       filename: 'js/[name].[hash:8].js',
       path: resolve('dist'),
       publicPath: '/'   //发布路径配置
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
    //start 提取公共js
    new webpack.optimize.CommonsChunkPlugin({
        name: "common",
        minChunks: 2
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: "common",
        chunks:['common']
    }),
    //end 提取公共js

    new extractTextPlugin({
        filename:'css/[name].css',
        allChunks:true
    })
   ],
   devServer:{
       host:'172.16.0.105',  //代理地址-本机ip地址
       port:80,  //端口号
       proxy:{
           '/api':{
               target:''   //跨域访问地址
           }
       }
   }

}
/**
 * 入口entry的值：{}
 * @param {obj} globPath js->js查找路径
 * @return {obj} entries 文件名与文件路径的值键对 
 * {'a','src/js/page/a.js'}
 */
function getEntry(globPath){
    let entries = {};
    glob.sync(globPath).forEach(entry=>{
        let name = entry.split('page/')[1].split('.')[0];
        entries[name] = entry;
    });
    return entries;
}

//pug、sass、js一一对应
for(let pug in pathPug){
    let htmlWebpack = new htmlWebpackPlugin({
        filename: pug + '.html',
        template: pathPug[pug],
        chunks:[pug, 'common']  //忽略的话所有入口都会被注入
    })
    webpackConf.plugins.push(htmlWebpack);
}

module.exports = webpackConf;