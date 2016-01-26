/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({ lazy: false }),
    noop = g.util.noop,
    es = require('event-stream'),
    bowerFiles = require('main-bower-files'),
    rimraf = require('rimraf'),
    Queue = require('streamqueue'),
    lazypipe = require('lazypipe'),
    stylish = require('jshint-stylish'),
    bower = require('./bower'),
    isWatching = false;

var htmlminOpts = {
    removeComments: true,
    collapseWhitespace: true,
    removeEmptyAttributes: false,
    collapseBooleanAttributes: true,
    removeRedundantAttributes: true
};

/**
 * JS Hint
 */
gulp.task('jshint', function () {
    return gulp.src([
        './gulpfile.js',
        './app/**/*.js'
    ])
        .pipe(g.cached('jshint'))
        .pipe(jshint('./.jshintrc'))
        .pipe(livereload());
});

/**
 * CSS
 */
gulp.task('clean-css', function (done) {
    rimraf('./.tmp/css', done);
});

gulp.task('styles', ['clean-css'], function () {
    return gulp.src([
        './app/**/*.less',
        '!./app/**/_*.less'
    ])
        .pipe(g.less())
        .pipe(gulp.dest('./.tmp/css/'))
        .pipe(g.cached('built-css'))
        .pipe(livereload());
});

gulp.task('styles-dist', ['styles'], function () {
    return cssFiles().pipe(dist('css', bower.name));
});

gulp.task('csslint', ['styles'], function () {
    return cssFiles()
        .pipe(g.cached('csslint'))
        .pipe(g.csslint('./.csslintrc'))
        .pipe(g.csslint.reporter());
});

/**
 * Scripts
 */
gulp.task('scripts-dist', ['templates-dist'], function () {
    return appFiles().pipe(dist('js', bower.name, { ngAnnotate: true }));
});

/**
 * Templates
 */
gulp.task('templates', function () {
    return templateFiles().pipe(buildTemplates());
});

gulp.task('templates-dist', function () {
    return templateFiles({ min: true }).pipe(buildTemplates());
});

/**
 * Vendors
 */
gulp.task('vendors', function () {
    var files = bowerFiles();
    var vendorJs = fileTypeFilter(files, 'js');
    var vendorCss = fileTypeFilter(files, 'css');
    var q = new Queue({ objectMode: true });
    if (vendorJs.length) {
        q.queue(gulp.src(vendorJs).pipe(dist('js', 'vendors')));
    }
    if (vendorCss.length) {
        q.queue(gulp.src(vendorCss).pipe(dist('css', 'vendors')));
    }
    return q.done();
});

/**
 * Index
 */
gulp.task('index', index);
gulp.task('build-all', ['styles', 'templates'], index);

function index() {
    var opt = { read: false };
    return gulp.src('./app/index.html')
        .pipe(g.inject(gulp.src(bowerFiles(), opt),
            {
                ignorePath: 'bower_components',
                starttag: '<!-- inject:vendor:{{ext}} -->'
            }))
        .pipe(g.inject(es.merge(appFiles(), cssFiles(opt)), { ignorePath: ['.tmp', 'src/app'] }))
        .pipe(gulp.dest('./app/'))
        .pipe(g.embedlr())
        .pipe(gulp.dest('./.tmp/'))
        .pipe(livereload());
}

/**
 * Assets
 */
gulp.task('assets', function () {
    return gulp.src('./app/assets/**')
        .pipe(gulp.dest('./dist/assets'));
});

/**
 * Dist
 */
gulp.task('dist', ['vendors', 'assets', 'styles-dist', 'scripts-dist'], function () {
    return gulp.src('./app/index.html')
        .pipe(g.inject(gulp.src('./dist/vendors.min.{js,css}'), {
            ignorePath: 'dist',
            starttag: '<!-- inject:vendor:{{ext}} -->'
        }))
        .pipe(g.inject(gulp.src('./dist/' + bower.name + '.min.{js,css}'), { ignorePath: 'dist' }))
        .pipe(g.htmlmin(htmlminOpts))
        .pipe(gulp.dest('./dist/'));
});

/**
 * Static file server
 */
gulp.task('statics', g.serve({
    port: 3000,
    root: ['./.tmp', './.tmp/app/', './app/', './bower_components']
}));

/**
 * Watch
 */
gulp.task('serve', ['watch']);
gulp.task('watch', ['statics', 'default'], function () {
    isWatching = true;
    // Initiate livereload server:
    g.livereload.listen();
    gulp.watch('./app/**/*.js', ['jshint']).on('change', function (evt) {
        if (evt.type !== 'changed') {
            gulp.start('index');
        } else {
            g.livereload.changed(evt);
        }
    });
    gulp.watch('./app/index.html', ['index']);
    gulp.watch(['./app/**/*.html', '!./app/index.html'], ['templates']);
    gulp.watch(['./app/**/*.less'], ['csslint']).on('change', function (evt) {
        if (evt.type !== 'changed') {
            gulp.start('index');
        } else {
            g.livereload.changed(evt);
        }
    });
});

/**
 * Default task
 */
gulp.task('default', ['lint', 'build-all']);

/**
 * Lint everything
 */
gulp.task('lint', ['jshint', 'csslint']);

/**
 * Test
 */
gulp.task('test', ['templates'], function () {
    return testFiles()
        .pipe(g.karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }));
});

/**
 * Inject all files for tests into karma.conf.js
 * to be able to run `karma` without gulp.
 */
gulp.task('karma-conf', ['templates'], function () {
    return gulp.src('./karma.conf.js')
        .pipe(g.inject(testFiles(), {
            starttag: 'files: [',
            endtag: ']',
            addRootSlash: false,
            transform: function (filepath, file, i, length) {
                return '  \'' + filepath + '\'' + (i + 1 < length ? ',' : '');
            }
        }))
        .pipe(gulp.dest('./'));
});

/**
 * Test files
 */
function testFiles() {
    return new Queue({ objectMode: true })
        .queue(gulp.src(fileTypeFilter(bowerFiles(), 'js')))
        .queue(gulp.src('./bower_components/angular-mocks/angular-mocks.js'))
        .queue(appFiles())
        .queue(gulp.src(['./app/**/*_test.js', './.tmp/app/**/*_test.js']))
        .done();
}

/**
 * All CSS files as a stream
 */
function cssFiles(opt) {
    return gulp.src('./.tmp/css/**/*.css', opt);
}

/**
 * All AngularJS application files as a stream
 */
function appFiles() {
    var files = [
        './.tmp/' + bower.name + '-templates.js',
        './.tmp/app/**/*.js',
        '!./.tmp/app/**/*_test.js',
        './app/**/*.js',
        '!./app/**/*_test.js'
    ];
    return gulp.src(files)
        .pipe(g.angularFilesort());
}

/**
 * All AngularJS templates/partials as a stream
 */
function templateFiles(opt) {
    return gulp.src(['./app/**/*.html', '!./app/index.html'], opt)
        .pipe(opt && opt.min ? g.htmlmin(htmlminOpts) : noop());
}

/**
 * Build AngularJS templates/partials
 */
function buildTemplates() {
    return lazypipe()
        .pipe(g.ngHtml2js, {
            moduleName: bower.name,
            prefix: '/' + bower.name + '/',
            stripPrefix: '/app/'
        })
        .pipe(g.concat, bower.name + '-templates.js')
        .pipe(gulp.dest, './.tmp')
        .pipe(livereload)();
}

/**
 * Filter an array of files according to file type
 *
 * @param {Array} files
 * @param {String} extension
 * @return {Array}
 */
function fileTypeFilter(files, extension) {
    var regExp = new RegExp('\\.' + extension + '$');
    return files.filter(regExp.test.bind(regExp));
}

/**
 * Concat, rename, minify
 *
 * @param {String} ext
 * @param {String} name
 * @param {Object} opt
 */
function dist(ext, name, opt) {
    opt = opt || {};
    return lazypipe()
        .pipe(g.concat, name + '.' + ext)
        .pipe(gulp.dest, './dist')
        .pipe(opt.ngAnnotate ? g.ngAnnotate : noop)
        .pipe(opt.ngAnnotate ? g.rename : noop, name + '.annotated.' + ext)
        .pipe(opt.ngAnnotate ? gulp.dest : noop, './dist')
        .pipe(ext === 'js' ? g.uglify : g.minifyCss)
        .pipe(g.rename, name + '.min.' + ext)
        .pipe(gulp.dest, './dist')();
}

/**
 * Livereload (or noop if not run by watch)
 */
function livereload() {
    return lazypipe()
        .pipe(isWatching ? g.livereload : noop)();
}

/**
 * Jshint with stylish reporter
 */
function jshint(jshintfile) {
    return lazypipe()
        .pipe(g.jshint, jshintfile)
        .pipe(g.jshint.reporter, stylish)();
}
