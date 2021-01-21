const { src, dest, lastRun, series, parallel, watch } = require('gulp');
const reload = require('require-reload')(require);
const async = require('async');
const fs = require('fs');
const path = require('path');
const globby = require('globby');
const browserSync = require('browser-sync').create();
const del = require('del');
const gulpif = require('gulp-if');
const argv = require('yargs').argv;
const newer = require('gulp-newer');
const htmlbeautify = require('gulp-html-beautify');
const sassGlob = require('gulp-sass-glob');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const concat = require('gulp-concat-multi');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const packageJSON = require('./package.json');

var source = {
	templates: '*.html',
	jshint: 'src/js/modules/*.js',
	images: 'src/images/*'
};

function prettyhtml() {
	return src(source.templates)
		.pipe(htmlbeautify({
			"indent_size": 1,
			"indent_char": "	",
			"preserve_newlines": false
		}))
		.pipe(dest('./'));
}

function compileSass() {
	return src(packageJSON.css)
		.pipe(sassGlob())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([
			require('autoprefixer')()
		]))
		.pipe(gulpif(argv.production, postcss([
			require('postcss-pxtorem')({
				propList: [
					'font-size',
					'line-height',
					'letter-spacing',
					'*margin*',
					'*padding*',
					'*width*',
					'*height*'
				],
				replace: false,
				rootValue: 16
			})
		])))
		.pipe(gulpif(argv.production, cssnano()))
		.pipe(dest('css'))
		.pipe(browserSync.stream());
}

function compileJs() {
	return concat(packageJSON.js)
		.pipe(gulpif(argv.production, uglify()))
		.pipe(dest('js'))
		.pipe(browserSync.stream());
}

function compressImages() {
	return src(source.images)
		.pipe(newer('images'))
		.pipe(imagemin())
		.pipe(dest('images'));
}

function clean(done) {
	del('css');
	del('images');
	del('js');
	done();
}

function runBrowserSync(done) {
	browserSync.init({
		logPrefix: packageJSON.name,
		notify: {
			styles: {
				top: 'auto',
				bottom: '0',
				padding: '4px',
				fontSize: '12px',
				borderBottomLeftRadius: '0'
			}
		},
		open: true,
		server: './',
		startPath: 'index.html',
		ui: false
	});

	done();
}

function reloadSystem(done) {
	browserSync.reload();

	done();
}

function resetPackage(done) {
	try {
		packageJSON = reload('./package.json');
	} catch (e) {
		console.error('Failed to reload package.json! Error: ', e);
	}
	done();
}

function watchFileSystem(done) {
	watch('package.json', series(
		resetPackage,
		reloadSystem
	));

	watch('src/css/**/**', series(
		compileSass
	));

	watch('src/js/**/*.js', series(
		compileJs
	));

	watch('src/icons/*', series(
		reloadSystem
	));

	watch('src/images/*', series(
		compressImages,
		reloadSystem
	));

	done();
}

exports.compileSass = compileSass;
exports.compileJs = compileJs;
exports.clean = clean;

exports.default = series(
	compileSass,
	compileJs,
	compressImages,
	watchFileSystem,
	runBrowserSync
);

exports.build = parallel(
	compileSass,
	compileJs,
	compressImages,
);

exports.dev = parallel(
	watchFileSystem,
	runBrowserSync
);
