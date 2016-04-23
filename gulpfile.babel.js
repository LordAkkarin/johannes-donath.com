/*
 * Copyright 2016 Johannes Donath <johannesd@torchmind.com>
 * and other copyright owners as documented in the project's IP log.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import path from 'path';

/**
 * Build
 *
 * A task which performs all relevant operations to copy and transpile the application resources into a browser friendly
 * format.
 */
gulp.task('build', ['html']);

/**
 * Default
 *
 * An entry point for gulp when invoking without specifying a target.
 */
gulp.task('default', ['build']);

/**
 * HTML
 *
 * Copies all static HTML files to the distribution directory and strips unnecessary characters such as whitespaces and
 * newlines.
 */
gulp.task('html', () => {
        return gulp.src(path.join(__dirname, 'src/html/**/*.html'))
                .pipe(htmlmin({
                        caseSensitive:      true,
                        collapseWhitespace: true,
                        minifyCSS:          true,
                        minifyJS:           true,
                        removeComments:     true
                }))
                .pipe(gulp.dest(path.join(__dirname, 'dist/')));
});
