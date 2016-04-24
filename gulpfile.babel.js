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
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import cleanCSS from 'gulp-clean-css';
import del from 'del';
import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import less from 'gulp-less';
import path from 'path';
import semanticBuild from './semantic/tasks/build';
import semanticBuildCss from './semantic/tasks/build/css';
import sourcemaps from 'gulp-sourcemaps';
import tsc from 'gulp-typescript';
import uglify from 'gulp-uglify';

// generally prepare external libraries regardless of which task is actually executed
const sync = browserSync.create();
const typescriptProject = tsc.createProject(path.join(__dirname, 'tsconfig.json'));

/**
 * Build
 *
 * A task which performs all relevant operations to copy and transpile the application resources into a browser friendly
 * format.
 */
gulp.task('build', ['dependencies', 'data', 'image', 'html', 'semantic-copy', 'script', 'stylesheet']);

/**
 * Default
 *
 * An entry point for gulp when invoking without specifying a target.
 */
gulp.task('default', ['build']);

/**
 * Development
 *
 * An entry point for users who wish to tinker with the application without worrying about manually invoking the
 * compiler or reloading the website.
 */
gulp.task('development', ['serve']);

/**
 * Clean
 *
 * Empties the distribution directory to ensure a clean build.
 */
gulp.task('clean', () => {
        return del(path.join(__dirname, 'dist'));
});

/**
 * Data
 *
 * Copies a set of mock data which is used in random parts of the website to the distribution directory.
 */
gulp.task('data', () => {
        return gulp.src(path.join(__dirname, 'src/data/**/*'))
                .pipe(gulp.dest(path.join(__dirname, 'dist/data')));
});

/**
 * Dependencies
 *
 * Copies a set of known application dependencies to their respective directory within the distribution.
 */
gulp.task('dependencies', () => {
        return gulp.src([
                        'es6-shim/es6-shim.min.js',
                        'systemjs/dist/system-polyfills.js',
                        'angular2/bundles/angular2-polyfills.js',
                        'angular2/es6/dev/src/testing/shims_for_IE.js',
                        'systemjs/dist/system.src.js',
                        'rxjs/bundles/Rx.js',
                        'angular2/bundles/angular2.dev.js',
                        'angular2/bundles/angular2-polyfills.js',
                        'angular2/bundles/router.dev.js',
                        'jquery/dist/jquery.min.js',
                        'jquery/dist/jquery.min.map'
                ], {
                        cwd: "node_modules/**"
                })
                .pipe(gulp.dest("dist/3rdParty/"));
});

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
                .pipe(gulp.dest(path.join(__dirname, 'dist/')))
                .pipe(sync.stream());
});

/**
 * Image
 *
 * Copies all static images to the distribution directory.
 */
gulp.task('image', () => {
        return gulp.src([
                        path.join(__dirname, 'src/image/**/*.png'),
                        path.join(__dirname, 'src/image/**/*.jpg')
                ])
                .pipe(gulp.dest(path.join(__dirname, 'dist/image/')))
                .pipe(sync.stream());
});

/**
 * Script
 *
 * Transpiles all local Typescript files and copies them into the distribution directory.
 */
gulp.task('script', () => {
        return gulp.src(path.join(__dirname, 'src/app/**/*.ts'))
                .pipe(sourcemaps.init())
                .pipe(tsc(typescriptProject))
                .pipe(uglify())
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(path.join(__dirname, 'dist/app')))
                .pipe(sync.stream());
});

/**
 * Semantic Build
 *
 * Provides a task which compiles semantic-ui using its built-in tasks.
 *
 * Note: Due to the way these integration tasks are written, a call to this task may only occur once per gulp session
 * and thus it may not be used in combination with a watcher.
 */
gulp.task('semantic', semanticBuild);

/**
 * Semantic CSS
 *
 * Provides an imported task which builds the Semantic UI stylesheets.
 */
gulp.task('semantic-css', semanticBuildCss);

/**
 * Semantic Copy
 *
 * Copies all compiled semantic resources to the distribution directory.
 */
gulp.task('semantic-copy', ['semantic'], () => {
        return gulp.src([
                        path.join(__dirname, 'semantic/dist/**/*'),
                        '!' + path.join(__dirname, 'semantic/dist/semantic.css'),
                        '!' + path.join(__dirname, 'semantic/dist/semantic.js'),
                        '!' + path.join(__dirname, 'semantic/dist/components'),
                        '!' + path.join(__dirname, 'semantic/dist/components/**/*'),
                        '!' + path.join(__dirname, 'semantic/dist/themes/github'),
                        '!' + path.join(__dirname, 'semantic/dist/themes/github/**/*')
                ])
                .pipe(gulp.dest(path.join(__dirname, 'dist/semantic/')))
                .pipe(sync.stream());
});

/**
 * Semantic Copy CSS
 *
 * Copies all compiled semantic stylesheets to the distribution directory.
 */
gulp.task('semantic-copy-css', ['semantic-css'], () => {
        return gulp.src([
                        path.join(__dirname, 'semantic/dist/*.min.css')
                ])
                .pipe(gulp.dest(path.join(__dirname, 'dist/semantic/')))
                .pipe(sync.stream());
});

/**
 * Serve
 *
 * Provides a local web server which automatically reloads the website on all viewing browsers when a change to the
 * source is detected. Also transpiles and copies all application resources to the dist directory when changed.
 */
gulp.task('serve', ['build'], () => {
        // Initialize Browser Sync to handle automatic updates within the developer's browser.
        sync.init({
                server: path.join(__dirname, 'dist/')
        });

        // Instruct Gulp to watch for file changes and issue their corresponding tasks
        gulp.watch(path.join(__dirname, 'src/html/**/*.html'), ['html']);
        gulp.watch(path.join(__dirname, 'semantic/src/site/**/*'), ['semantic-copy-css']);
        gulp.watch(path.join(__dirname, 'src/less/**/*.less'), ['stylesheet']);
        gulp.watch(path.join(__dirname, 'src/app/**/*.ts'), ['script']);
        gulp.watch(path.join(__dirname, 'src/data/**/*'), ['data']);
        gulp.watch([
                path.join(__dirname, 'src/image/**/*.png'),
                path.join(__dirname, 'src/image/**/*.jpg')
        ], ['image']);
});

/**
 * Stylesheet
 *
 * Transpiles a set of application specific less stylesheets and copies them into the distribution directory.
 */
gulp.task('stylesheet', () => {
        return gulp.src(path.join(__dirname, 'src/less/**/*.less'))
                .pipe(sourcemaps.init())
                .pipe(less())
                .pipe(autoprefixer({
                        browsers: ['last 2 versions'],
                        cascade:  false
                }))
                .pipe(cleanCSS({debug: true}, function (details) {
                        console.log('Compressed ' + details.name + ' from ' + details.stats.originalSize + ' to ' + details.stats.minifiedSize + ' bytes');
                }))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(path.join(__dirname, 'dist/style/')))
                .pipe(sync.stream());
});
