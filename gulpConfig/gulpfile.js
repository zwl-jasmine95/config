var gulp = require('gulp');

var gulpSass = require('gulp-sass'),  //将scss预处理为css
    // gulpLess = require('gulp-less'),
    cleanCss = require('gulp-clean-css'),  //压缩css
    uglify = require('gulp-uglify'),  //压缩js文件
    del = require('del'),  //文件删除
    watch = require('gulp-watch'),   //监听文件的新建和删除。
    imageMin = require('gulp-imagemin'),  //压缩图片
    autoprefixer = require('gulp-autoprefixer')  //根据设置浏览器版本自动处理浏览器前缀

// 跨域与代理
const proxy = require('http-proxy-middleware')
const connect = require('gulp-connect')

// 项目目录
var lib = './lib/'
    src = './src/'
    dist = './dist/'


/***** 任务 ******/
gulp.task('cleanCss',function(cb){
    return del(dist + '**/*.css',cb)
})

gulp.task('cleanJs',function(cb){
    return del(dist + '**/*.js',cb)
})

gulp.task('cleanHtml',function(cb){
    return del(dist + '**/*.html',cb)
})

gulp.task('server',['build'], function() {
    return connect.server({
        livereload: true,
        root: './dist',
        port: 8080,
        middleware: function(connect, opt) {
            return [
                proxy('/api',{
                    target: 'http://172.16.0.100:8080',
                    changeOrigin: true,
                }),
                proxy('/system',{
                    target: 'http://172.16.1.185:8888',
                    changeOrigin: true,
                })
            ]
        }
    });
});

// 将scss预处理为css，并压缩css
gulp.task('css',function(){
    return gulp.src(src + 'scss/**/*.scss')
        .pipe(gulpSass())
        .pipe(autoprefixer({
            browsers: ['last 5 versions']
        }))
        .pipe(cleanCss({compatibility: 'ie8'})) //保留ie8兼容写法
        .pipe(gulp.dest(dist + 'css')) 
        .pipe(connect.reload())   //当内容发生改变时， 重新加载。
})

//压缩js
gulp.task('js',function(){
    return gulp.src(src + 'js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(dist + 'js'))
        .pipe(connect.reload())  //当内容发生改变时， 重新加载。
}) 

//html
gulp.task('html',function(){
    return gulp.src(src + 'view/**/*.html')
        .pipe(gulp.dest(dist))
        .pipe(connect.reload())  //当内容发生改变时， 重新加载。
})

//img
gulp.task('imagemin',function(){
    return gulp.src(src + 'images/**/*.{png,jpg,gif,ico}')
        .pipe(imageMin({
            optimizationLevel: 5, // 取值范围：0-7（优化等级）
            progressive: true    //无损压缩jpg图片
        }))   
        .pipe(gulp.dest(dist + 'images'))
        .pipe(connect.reload())  //当内容发生改变时， 重新加载。
})

gulp.task('watch', function () {  //定义名为watchless的任务
    gulp.watch(src + 'scss/**/*.scss', ['css']);   //监听该目录下less文件的变化
    gulp.watch(src + 'js/**/*.js', ['js']);//监听该目录下js文件的变化
    gulp.watch(src + 'view/**/*.html', ['html']);//监听该目录下html文件的变化
});

gulp.task('build',['css','js','html'])

gulp.task('default',['server','watch'])