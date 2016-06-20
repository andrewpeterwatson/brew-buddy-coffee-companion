'use strict';

const gulp    = require('gulp');
const mocha   = require('gulp-mocha');
const eslint  = require('gulp-eslint');
const nodemon = require('gulp-nodemon');

const paths = ['*.js', './lib/*.js', './route/*.js', './model/*.js', './test/*.js'];

gulp.task('lint', function(){
  gulp.src(paths)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('test', function(){
  return gulp.src('./test/*-test.js', {read: false})
  .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('nodemon', function(){
  nodemon({
    ext: 'js',
    script: 'server.js'
  });
});

gulp.task('default', ['test', 'lint']);
