var gulp = require('gulp');
var browserify = require('browserify');
var stringify = require('stringify');
var source = require('vinyl-source-stream');
var nodemon = require('gulp-nodemon');
var typescript = require('gulp-tsc');
var less = require('gulp-less');

var root = require('path').normalize(__dirname);
var paths = {
	ts: {
		client: root + '/client/**/*.ts',
		server: root + '/server/**/*.ts'
	},
	less: root + '/client/styles/**/*.less',
	dist: root + '/client/dist'
};

gulp.task('browserify', function() {
	var bundler = browserify({
		entries: './client/app/main.js'
	});

	var bundle = function() {
		return bundler
			.transform(stringify(['.html']))
			.bundle()
			.pipe(source('main.js'))
			.pipe(gulp.dest(paths.dist));
	};

	return bundle();
});

gulp.task('less', function() {
	return gulp.src('./client/styles/main.less')
		.pipe(less())
		.pipe(gulp.dest(paths.dist));
});

gulp.task('ts:server', function() {
	return gulp.src([paths.ts.server])
		.pipe(typescript())
		.pipe(gulp.dest('server'));
});

gulp.task('ts:client', function() {
	return gulp.src([paths.ts.client])
		.pipe(typescript())
		.pipe(gulp.dest('client'));
});

gulp.task('watch', function() {
	gulp.watch([paths.ts.server], ['ts:server']);
	gulp.watch([paths.ts.client], ['ts:client', 'browserify']);
	gulp.watch([paths.less], ['less']);
});

gulp.task('nodemon', function() {
	nodemon({
		script: './server/index.js',
		ext: 'js'
	})
});

gulp.task('default', ['watch', 'nodemon']);
