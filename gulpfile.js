'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

const gulp        = require('gulp');
const htmlMin     = require('gulp-htmlmin');
const inject      = require('gulp-inject');
const imageMin    = require('gulp-imagemin');
const minifyCss   = require('gulp-clean-css');
const rename      = require('gulp-rename');
const rmdir       = require('rmdir');
const runSequence = require('run-sequence');
const uglify      = require('gulp-uglify');

//copy across the index.html
gulp.task('copyhtml', () => {
  gulp.src('index.html')
    .pipe(gulp.dest('build/'));
});

//copy across skeleton.css
gulp.task('copycss', () => {
  gulp.src('css/skeleton.css')
    .pipe(gulp.dest('build/css'));
});

//inject inline css into the index.html
gulp.task('injectcss', () => {
  gulp.src('./build/index.html')
    .pipe(inject(gulp.src(['./build/css/bundle.min.css']), {
      starttag: '<!-- inject:head:css -->',
      transform: (filePath, file) => {
        // return file contents as string
        return '<style>' + file.contents.toString('utf8') + '</style>';
      }
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('minifycss', () => {
  gulp.src(['css/site.css'])
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rename('bundle.min.css'))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('minifyhtml', () => {
  gulp.src('build/index.html')
    .pipe(htmlMin({collapseWhitespace: true}))
    .pipe(gulp.dest(function(data){ return data.base; }));
});

gulp.task('minifyimages', () =>
    gulp.src('img/*')
        .pipe(imageMin())
        .pipe(gulp.dest('build/img'))
);

gulp.task('cleanbuild', () => {
  rmdir('./build', function (err, dirs, files) {
      console.log(dirs);
      console.log(files);
      console.log('all files are removed');
   });
});

gulp.task('build', function(callback) {
  runSequence(['cleanbuild', 'minifycss', 'copyhtml', 'minifyimages', 'injectcss', 'minifyhtml'], callback);
});
gulp.task('default', ['build']);
