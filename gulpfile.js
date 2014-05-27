'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var paths = {
	scripts: ['src/*.js', 'demo/app.js'],
	html: ['demo/*.html']
};


gulp.task('default', ['build'], function () {

});

gulp.task('scripts', ['clear'], function () {
	return gulp.src(['./src/*', '!./src/bower_components'])
		.pipe(plugins.concat('ngResolve.min.js'))
		.pipe(gulp.dest('demo'))
		.pipe(plugins.ngmin())
		.pipe(plugins.uglify())
		.pipe(gulp.dest('dist'))
});

gulp.task('demo', function () {
	gulp.src('demo/ngResolver.js', {read: false})
		.pipe(plugins.clean());

	gulp.src(['./src/module.js', './src/*'])
		.pipe(plugins.concat('ngResolver.src.js'))
		.pipe(gulp.dest('demo'));
})

gulp.task('clear', function () {
	gulp.src('dist/*', {read: false})
		.pipe(plugins.clean());
});

gulp.task('serve', ['demo', 'watch'], function () {
	plugins.connect.server({
		port      : 9000,
		root      : 'demo',
		livereload: true
	});
});

gulp.task('reload', function () {
	plugins.connect.reload();
})

// Rerun the task when a file changes
gulp.task('watch', function () {
	gulp.watch(paths.scripts, ['demo', 'reload']);
	gulp.watch(paths.html, ['reload'])
});