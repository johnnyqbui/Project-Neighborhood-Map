var gulp = require('gulp'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    uglifycss = require('gulp-uglifycss'),
    uglify = require('gulp-uglify'),
    htmlreplace = require('gulp-html-replace'),
    ghPages = require('gulp-gh-pages');

// Minify CSS file
gulp.task('styles', function() {
    return gulp.src('app/css/style.css')
    	.pipe(uglifycss())
    	.pipe(rename({ suffix: '.min'}))
    	.pipe(gulp.dest('dist/css/'));
});

// Minify JS file
gulp.task('scripts', function() {
    return gulp.src('app/js/app.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js/'));
});

// Rename JS and CSS source files inside index.html to it's minified file's names
gulp.task('replace', function() {
	return gulp.src('app/index.html')
		.pipe(htmlreplace({
			'css': 'css/style.min.css',
			'js': 'js/app.min.js'
		}))
		.pipe(gulp.dest('dist'));
});

// Minify HTML file
gulp.task('minify-html', ['replace'], function() {
	return gulp.src('dist/index.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('dist'));
});

// Move neccesary bower component files to distribution folder
gulp.task('vendor-scripts', function() {
	gulp.src([
		'app/bower_components/jquery/dist/jquery.min.js',
		])
	.pipe(gulp.dest('dist/bower_components/jquery/dist/'));
		gulp.src([
		'app/bower_components/knockout/dist/knockout.js'
		])
	.pipe(gulp.dest('dist/bower_components/knockout/dist/'));
});

// If any changes are made then run the specified gulp tasks
gulp.task('watch', function() {
    gulp.watch('app/css/*.css', ['styles']);
    gulp.watch('app/js/*.js', ['scripts']);
    gulp.watch('app/index.html', ['minify-html']);
});

// Run these tasks by default
gulp.task('default', ['styles', 'scripts', 'replace', 'minify-html', 'vendor-scripts', 'watch']);
