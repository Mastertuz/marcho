const { src,dest,watch,parallel,series } = require('gulp');

const scss              = require('gulp-sass')(require('sass'));
const concat            = require('gulp-concat');
const autoprefixer      = require('gulp-autoprefixer');
const uglify            = require('gulp-uglify');
const del          = require('del');
const image = require('gulp-image');
const browserSync       = require('browser-sync').create();

function browsersync (){
browserSync.init({
    server: {
        baseDir: 'app/'
    },
    notify:false
})
}

function styles() {
    return src('app/scss/style.scss')
    .pipe(scss({outputStyle:'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 version'],
        grid:true
    }))
    .pipe(dest('app/css'))
}



function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
     .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
} 
function images(){
    return src('app/images/**/*.*')
    .pipe(image())
    .pipe(dest('dist/images'))
}

function build() {
    return scripts([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js'
    ], {base:'app'})
    .pipe(dest('dist'))
}

function watching() {
    watch(['app/scss/**/*.scss'],styles );
     watch(['app/js/**/*.js','!app/js/main.min.js'],scripts);
     watch(['app/*.html']).on('change', browserSync.reload)
    }

    function cleanDist(){
return del('dist')
    }
   
    

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist,images,build);

exports.default = parallel(styles,scripts,browsersync,watching) ;