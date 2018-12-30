const path = require('path')

const gulp = require('gulp')
const browserify = require('browserify')
const del = require('del')
const exorcist = require('exorcist')
const source = require('vinyl-source-stream')
const uglify = require('gulp-uglify-es').default
const rename = require('gulp-rename')
const streamify = require('gulp-streamify')

const DEST = path.join(__dirname, 'dist/')
const OUT = 'plasma-utils'

gulp.task('clean', (done) => {
  del(DEST).then(done)
})

gulp.task('standalone', (done) => {
  browserify({
    entries: './index.js',
    debug: true
  }).bundle()
    .pipe(exorcist(path.join(DEST, OUT + '.js.map')))
    .pipe(source(OUT + '.js'))
    .pipe(gulp.dest(DEST))
    .pipe(streamify(uglify()))
    .pipe(rename(OUT + '.min.js'))
    .pipe(gulp.dest(DEST))

  done()
})

gulp.task('default', gulp.series('standalone'))
