const {src, dest, watch, parallel, series} = require('gulp') // require package for scss/sass
const scss = require('gulp-sass')(require('sass'));// require package for scss/sass
const concat = require('gulp-concat');// require package for concat all files in one
const autoprefixer = require('gulp-autoprefixer');// require package for concat all files in one
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
// require package for concat all files in one
const browserSync = require('browser-sync').create();// require package for concat all files in one

//  * Прикольная функция бровсер синк просмотр страницы локально сети
function browswersync() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
        notify: false
    })
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({outputStyle: 'compressed'})) // вид файла
        .pipe(concat('style.min.css')) // один выходной файл
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'], // поддержка префиксов для браузеровы
            grid: true
        }))
        .pipe(dest('app/css')) // папка выхода ксс
        .pipe(browserSync.stream())
}

function scripts() {
    return src(['node_modules/jquery/dist/jquery.js', 'app/js/main.js']).pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function images() {
    return src('app/images/**/*.*')
        .pipe(imagemin([imagemin.gifsicle({interlaced: true}), imagemin.mozjpeg({
            quality: 75,
            progressive: true
        }), imagemin.optipng({optimizationLevel: 5}), imagemin.svgo({
            plugins: [{removeViewBox: true}, {cleanupIDs: false}]
        })]))
        .pipe(dest('data/images'))
}


function build() {
    return src(['app/**/*.html', 'app/css/style.min.css', 'app/js/main.min.js',], {base: 'app'})
        .pipe(dest('dist'))
}


function cleanDist() {
    return src('dist')
}

function watching() {
    watch(['app/scss/**/*.scss'], styles) // следит за изменениями
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts) // следит за изменениями
    watch(['app/**/*.html']).on('change', browserSync.reload) // следит за изменениями
}

exports.styles = styles
exports.scripts = scripts
exports.browswersync = browswersync
exports.watching = watching
exports.build = build
exports.cleanDist = cleanDist
exports.build = series(cleanDist, images, build)

exports.default = parallel(styles, scripts, browswersync, watching) // def gulp