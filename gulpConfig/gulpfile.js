var gulp = require('gulp');

var gulpSass = require('gulp-sass')  //将scss预处理为css
    // gulpLess = require('gulp-less')
    cleanCss = require('gulp-clean-css')  //压缩css
    uglify = require('gulp-uglify')  //压缩js文件

// 项目目录
var lib = './lib/'
    src = './src/'
    dist = './dist/'


/***** 任务 ******/

// 将scss预处理为css，并压缩css
gulp.task('css',function(){
    gulp.src(src + 'scss/**/*.scss')
        .pipe(gulpSass())
        .pipe(cleanCss())
        .pipe(gulp.dest(dist + 'css')) //最后生成的文件路径为src/css/*.css
})

//压缩js
gulp.task('js',function(){
    gulp.src(src + 'js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(dist + 'js'))
})

//html
gulp.task('html',function(){
    gulp.src(src + 'view/**/*.html')
        .pipe(gulp.dest(dist))
})

gulp.task('watch', function () {  //定义名为watchless的任务
    gulp.watch(src + 'scss/**/*.scss', ['css']);   //监听该目录下less文件的变化
    gulp.watch(src + 'js/**/*.js', ['js']);//监听该目录下js文件的变化
    gulp.watch(src + 'view/**/*.html', ['html']);//监听该目录下html文件的变化
});

gulp.task('default',['css','js','html'])