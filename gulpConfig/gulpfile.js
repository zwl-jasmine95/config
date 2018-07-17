var gulp = require('gulp');

var gulpSass = require('gulp-sass')  //将scss预处理为css
    // gulpLess = require('gulp-less')
    cleanCss = require('gulp-clean-css')  //压缩css
    uglify = require('gulp-uglify')  //压缩js文件
    del = require('del')

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
gulp.task('css',['cleanCss'],function(){
    return gulp.src(src + 'scss/**/*.scss')
        .pipe(gulpSass())
        .pipe(cleanCss())
        .pipe(gulp.dest(dist + 'css')) //最后生成的文件路径为src/css/*.css
        .pipe(connect.reload())   //当内容发生改变时， 重新加载。
})

//压缩js
gulp.task('js',['cleanJs'],function(){
    return gulp.src(src + 'js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(dist + 'js'))
        .pipe(connect.reload())  //当内容发生改变时， 重新加载。
}) 

//html
gulp.task('html',['cleanHtml'],function(){
    return gulp.src(src + 'view/**/*.html')
        .pipe(gulp.dest(dist))
        .pipe(connect.reload())  //当内容发生改变时， 重新加载。
})

gulp.task('watch', function () {  //定义名为watchless的任务
    gulp.watch(src + 'scss/**/*.scss', ['css']);   //监听该目录下less文件的变化
    gulp.watch(src + 'js/**/*.js', ['js']);//监听该目录下js文件的变化
    gulp.watch(src + 'view/**/*.html', ['html']);//监听该目录下html文件的变化
});

gulp.task('build',['css','js','html'])

gulp.task('default',['server','watch'])