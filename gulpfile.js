var browserify = require('browserify');
var gulp = require('gulp');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var source = require('vinyl-source-stream');
var stringify = require('stringify');
var typescript = require('gulp-tsc');
var tsd = require('gulp-tsd');

var root = require('path').normalize(__dirname);
var paths = {
    ts: {
        client: root + '/client/**/*.ts',
        server: root + '/server/**/*.ts'
    },
    less: root + '/client/styles/**/*.less',
    html: root + '/client/app/**/*.html',
    dist: root + '/client/dist'
};

gulp.task('browserify', ['ts:client'], function() {
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

gulp.task('ts:client', function(cb) {
    return gulp.src([paths.ts.client])
        .pipe(typescript())
        .pipe(gulp.dest('client'));

    // task must finish successfully for browserify to run
    cb(err);
});

gulp.task('watch', function() {
    gulp.watch([paths.ts.server], ['ts:server']);
    gulp.watch([paths.ts.client], ['ts:client', 'browserify']);
    gulp.watch([paths.html], ['browserify']);
    gulp.watch([paths.less], ['less']);
});

gulp.task('nodemon', function() {
    nodemon({
        script: './server/index.js',
        ignore: ['client/*'],
        ext: 'js'
    })
});

gulp.task('tsd:client', function(callback) {
    tsd({
        command: 'reinstall',
        config: './tsd.client.json'
    }, callback);
});

gulp.task('tsd:server', function(callback) {
    tsd({
        command: 'reinstall',
        config: './tsd.server.json'
    }, callback);
});

gulp.task('default', ['watch', 'nodemon']);
gulp.task('postinstall', ['tsd:client', 'tsd:server', 'ts:client', 'ts:server']);
