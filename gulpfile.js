var gulp = require('gulp');
var path = require('path');

// Java-Script
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// Html, Images and Styles
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var processhtml = require('gulp-processhtml');

// Utils
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var del = require('del');

// Configuration
var paths = {
    app: path.join(__dirname, 'app'),
    dist: path.join(__dirname, 'dist'),
    tmp: path.join(__dirname, '.tmp')
};

var DEBUG = (process.env.DEBUG === 'true');

gulp.task('clean', function (cb) {
	del([paths.dist, paths.tmp], cb);
});

gulp.task('copy', function () {
    var files = [ paths.app + '/*.html', paths.app + '/*.ico', paths.app + '/*.txt', paths.app + '/.htaccess', paths.app + '/styles/fonts/*' ];
    return gulp.src(files, { base: paths.app })
        .pipe(gulp.dest(paths.dist));
});

gulp.task('vendor', function () {
    var files = [ paths.app + '/bower_components/modernizr/modernizr.js' ];
    return gulp.src(files, { base: paths.app })
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('imagemin', function () {
    return gulp.src(paths.app + '/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false}
            ],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest(paths.dist + '/images'));
});

gulp.task('lint', function () {
    var jshintFiles = [
            paths.app + '/scripts/**/*.js'
    ];

    return gulp.src(jshintFiles)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish || 'default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('lint-server', function () {
    var jshintFiles = [
        './standalone-server/*.js',
        './plugin/*.js'
    ];

    return gulp.src(jshintFiles)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish || 'default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('less', function () {
    var pipe = gulp.src(paths.app + '/styles/main.less')
        .pipe(less({
            paths: [ path.join(paths.app, 'bower_components') ],
            sourceMap: DEBUG
        }));

    if (!DEBUG) {
        pipe = pipe.pipe(minifyCSS({keepBreaks: true}));
    }

    return pipe
        .pipe(gulp.dest(paths.dist + '/styles'));
});

gulp.task('processhtml', ['copy'], function () {
    return gulp.src(paths.dist + '/index.html')
        .pipe(processhtml('index.html'))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('server', function () {
    return nodemon({
        script: 'standalone-server/server.js',
        ext: 'js',
        ignore: ['app/**', 'dist/**', 'node_modules/**', 'gulpfile.js'],
        env: {
            'NODE_ENV': 'production'
        }
    })
        .on('change', ['lint-server'])
        .on('restart', function () {
            console.log('restarted!');
        });
});

gulp.task('browserify', function () {
	var bundler = browserify({
		// Required watchify args
		cache: {}, packageCache: {}, fullPaths: true,
		// Specify the entry point of your app
		entries: [paths.app + '/scripts/main.js'],
		// Add file extentions to make optional in your requires
		extensions: ['.hbs'],
		// Enable source maps!
		debug: DEBUG
	});

    var bundle = function () {
		return bundler
			.bundle()
			// Report compile errors
			//.on('error', handleErrors)
			// Use vinyl-source-stream to make the
			// stream gulp compatible. Specifiy the
			// desired output filename here.
            .pipe(source('main.js'))
			// Specify the output destination
            .pipe(gulp.dest(paths.dist + '/scripts'));
    };

	if(global.isWatching) {
		// Wrap with watchify and rebundle on changes
		bundler = watchify(bundler);
		// Rebundle on update
		bundler.on('update', bundle);
	}

    return bundle();
});


gulp.task('uglify', ['browserify', 'copy'], function () {
    if (!DEBUG) {
        gulp.src(paths.dist + '/scripts/*.js')
            .pipe(uglify())
            .pipe(gulp.dest(paths.dist + '/scripts'));
    }
});

gulp.task('livereload', ['doWatch'], function () {
    var server = livereload();

    var changed = function (file) {
        server.changed(file.path);
    };

    gulp.watch(paths.dist + '/**').on('change', changed);
});

gulp.task('setWatch', function () {
    global.isWatching = true;
});

gulp.task('doWatch', ['copy'], function () {
    global.isWatching = true;
    gulp.watch(paths.app + '/styles/**/*.less', ['less']);
    gulp.watch(paths.app + '/images/**/*', ['imagemin']);
});

gulp.task('build-dev', ['lint', 'lint-server', 'less', 'browserify', 'copy', 'imagemin', 'vendor']);
gulp.task('build', ['build-dev', 'uglify', 'processhtml']);

gulp.task('watch', ['setWatch', 'build-dev', 'server', 'doWatch', 'livereload']);

gulp.task('production', ['build', 'server', 'watch']);
gulp.task('production-watch', ['setWatch', 'build', 'server', 'doWatch']);

gulp.task('default', ['watch']);

