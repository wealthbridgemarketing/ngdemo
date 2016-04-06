module.exports = function (grunt) {

    // measures the time each task takes
    require('time-grunt')(grunt);

    // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require('load-grunt-tasks')(grunt);

    // variables used within the tasks
    //var appBanner = '/*! <%= pkg.name %> - Copyright '+'<%= grunt.template.today("yyyy") %>'+'. All Rights Reserved. Created By: '+'<%= pkg.author.name %>'+' <%= pkg.author.url %> - build: ' + '<%= grunt.template.today("yymmdd") %> */\n';

    var appjsSrcDef = [
        'assets/js/**/*.js',
        'services/app.module.js', 'services/app.routes.js',
        'services/core/data.srvc.js', 'services/core/http.srvc.js', 'services/core/auth.srvc.js', 
        'services/base/ui.srvc.js', 'services/base/base.srvc.js',
        'services/site/app.ctrl.js', 'services/site/theme.srvc.js', 'services/site/user.srvc.js',
        'services/app/**/*.js', 'components/**/*.js', 'sections/**/*.js'
    ];

    var appjsSrcDef2 = appjsSrcDef.map(function (path) {
        return 'stage/js/app/' + path.replace(/(\.js)$/,'.min.js');
    });

    var bowerPath = 'src/assets/bower_components/';

    var imgExts = '{png,jpg,gif}';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

// JSHINT - A tool that helps to detect errors and potential problems in the JavaScript code.
        jshint: {
            grunt: ['Gruntfile.js'],
            appjs: {
                files: [{
                    expand: true,
                    cwd   : 'src/',
                    src   : appjsSrcDef,
                    extDot: 'last'
                }]
            }
        },

// UGLIFY - Javascript obfuscation, minification and sometimes concatenation
        uglify: {
            options: {
                report          : 'min',
                mangle          : false,
                preserveComments: false,
                //screwIE8: true,
                banner          : '/*! uglified via grunt - <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n',
                compress        : {
                    sequences   : true,
                    unsafe      : true,
                    conditionals: true,
                    comparisons : true,
                    booleans    : true,
                    loops       : true,
                    if_return   : true,
                    join_vars   : true,
                    drop_console: false
                }
            },
            appjs  : {
                files: [{
                    expand: true,
                    cwd   : 'src/',
                    src   : appjsSrcDef,
                    dest  : 'stage/js/app/',
                    ext   : '.min.js',
                    extDot: 'last'
                }]
            },
            hctheme: {
                files: [{
                    src : [bowerPath + 'highcharts/themes/dark-unica.js'],
                    dest: 'stage/js/vendor/highcharts/dark-unica.min.js'
                }]
            }
        },

// SASS - css preprocessor
        sass: {
            options: {
                sourcemap    : 'none',
                style        : 'compact',
                cacheLocation: 'node_modules/grunt-contrib-sass/.sass-cache'
            },
            assets : {
                files: [{
                    expand: true,
                    //flatten: true,
                    cwd   : 'src/',
                    src   : ['assets/sass/**/*.scss'],
                    dest  : 'stage/css/assets/compiled/',
                    ext   : '.css'
                }]
            },
            custom : {
                files: [{
                    expand: true,
                    cwd   : 'src/',
                    src   : ['**/*.scss', '!assets/**/*.scss'],
                    dest  : 'stage/css/custom/compiled/',
                    ext   : '.css'
                }]
            }
        },

// CONCAT - combines multiple files into one
        concat: {
            assetcss : {
                options: {separator: '\n'},
                files  : [{
                    src : ['stage/css/assets/compiled/**/*.css'],
                    dest: 'stage/css/assets/concat.css',
                    nonull: true
                }]
            },
            vendorcss: {
                options: {separator: '\n'},
                files  : [{
                    src : [
                        bowerPath + 'bootstrap/dist/css/bootstrap.min.css',
                        bowerPath + 'bootstrap/dist/css/bootstrap-theme.min.css'
                    ],
                    dest: 'stage/css/vendor/concat.css',
                    nonull: true
                }]
            },
            appjs    : {
                options: {
                    separator   : ';',
                    //banner: appBanner,
                    stripBanners: {block: true, line: true}
                },
                files  : [{
                    src : appjsSrcDef2,
                    dest: 'dist/assets/js/app.min.js',
                    nonull: true
                }]
            },
            vendorjs : {
                options: {
                    separator   : ';',
                    //banner: appBanner,
                    stripBanners: {block: true, line: true}
                },
                files  : [{
                    src : [
                        bowerPath + 'angular/angular.js', //.min
                        //bowerPath + 'angular-animate/angular-animate.min.js',
                        //bowerPath + 'angular-touch/angular-touch.min.js',
                        bowerPath + 'angular-local-storage/dist/angular-local-storage.js', // min ver creates bug
                        bowerPath + 'angular-ui-router/release/angular-ui-router.min.js',
                        bowerPath + 'angular-css/angular-css.min.js',
                        bowerPath + 'angular-bootstrap/ui-bootstrap-tpls.min.js',
                        bowerPath + 'highcharts/highcharts.js',
                        bowerPath + 'highcharts/adapters/standalone-framework.js',
                        bowerPath + 'highcharts/modules/exporting.js',
                        'stage/js/vendor/highcharts/dark-unica.min.js',
                        bowerPath + 'highcharts-ng/dist/highcharts-ng.min.js'
                    ],
                    dest: 'dist/assets/js/vendor.min.js',
                    nonull: true
                }]
            }
        },

// POSTCSS - Apply post-processors to css
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({browsers: 'last 2 versions'}) // add vendor prefixes
                ]
            },
            assets : {
                files: [{
                    src : ['stage/css/assets/concat.css'],
                    dest: 'stage/css/assets/postcss.css'
                }]
            },
            custom : {
                files: [{
                    expand: true,
                    cwd   : 'stage/css/custom/compiled/',
                    src   : ['**/*.css'],
                    dest  : 'stage/css/custom/postcss/'
                }]
            }
        },

// CSSMIN - Minimize the css files used by production
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            assets : {
                files: [{
                    src : ['stage/css/assets/postcss.css'],
                    dest: 'dist/assets/css/style.min.css'
                }]
            },
            custom : {
                files: [{
                    expand: true,
                    cwd   : 'stage/css/custom/postcss/',
                    src   : ['**/*.css'],
                    dest  : 'dist/',
                    ext   : '.min.css'
                }]
            },
            vendor : {
                files: [{
                    src : ['stage/css/vendor/concat.css'],
                    dest: 'dist/assets/css/vendor.min.css'
                }]
            }
        },

// HTMLMIN - Mininize the views and the theme
        htmlmin: {
            dist: {
                options: {
                    removeComments               : true, // Only if you don't use angular comment directives!
                    collapseWhitespace           : true,
                    collapseBooleanAttributes    : true,
                    removeRedundantAttributes    : true,
                    removeEmptyAttributes        : true,
                    removeScriptTypeAttributes   : true,
                    removeStyleLinkTypeAttributes: true,
                    caseSensitive                : true,
                    minifyJS                     : true,
                    minifyCSS                    : true
                },
                files  : [{
                    expand: true,
                    cwd   : 'src/',
                    src   : ['**/*.html', '!assets/bower_components/**/*.html'],
                    dest  : 'dist/'
                }]
            }
        },

// JSONMIN - Minimize the data.json files
        minjson: {
            dist: {
                files: [{
                    expand: true,
                    cwd   : 'src/',
                    src   : ['**/*.json', '!assets/bower_components/**/*.json'],
                    dest  : 'dist/'
                }]
            }
        },

// IMAGEMIN - Strips the metadata from images in order to reduce their filesize.
        imagemin: {
            dist: {
                options: {optimizationLevel: 3},
                files  : [{
                    expand: true,
                    cwd   : 'src/',
                    src   : ['**/*.' + imgExts, '!assets/bower_components/**/*.' + imgExts],
                    dest  : 'dist/'
                }]
            }
        },

// COPY - Copy files and folders
        copy: {
            misc  : {
                files: [{
                    dot   : true,
                    expand: true,
                    cwd   : 'src/',
                    src   : ['**/*.*', '!**/.gitkeep', '!**/*.{scss,js,html,json}', '!**/*.' + imgExts, '!__notes__/**/*.*', '!assets/bower_components/**/*.*'],
                    dest  : 'dist/'
                }]
            },
            vendor: {
                files: [
                    // bootstrap fonts
                    {expand    : true,
                        flatten: true,
                        src    : [bowerPath + 'bootstrap/dist/fonts/*'],
                        dest   : 'dist/assets/fonts/',
                        filter : 'isFile'
                    }
                ]
            }
        },

// CLEAN - Delete files and folders
        clean: {
            options         : {'no-write': false}, // When true nothing is actually deleted
            dist            : {files: [{dot: true, src: ['dist/*', '!dist/.gitkeep']}]},
            stage           : {files: [{dot: true, src: ['stage/*', '!stage/.gitkeep']}]},
            all             : {files: [{dot: true, src: ['dist/*', 'stage/*', '!dist/.gitkeep', '!stage/.gitkeep']}]},
            stage_css_assets: ['stage/css/assets'],
            stage_css_custom: ['stage/css/custom'],
            stage_css_vendor: ['stage/css/vendor'],
            stage_js_app    : ['stage/js/app'],
            stage_js_vendor : ['stage/js/vendor']
        },

// WATCH - Watches for changes in the source files and automates the build when detected.
        watch: {
            css_assets: {
                files  : ['src/assets/sass/**/*.scss'],
                tasks  : ['app-css-assets'],
                options: {interrupt: true}
            },
            css_custom: {
                files  : ['**/*.scss', '!src/assets/**/*.scss'],
                tasks  : ['app-css-custom'],
                options: {interrupt: true}
            },
            js        : {
                files  : ['src/**/*.js', 'src/!assets/bower_components/**/*.js'],
                tasks  : ['app-js'],
                options: {interrupt: true}
            },
            html      : {
                files  : ['src/**/*.html', 'src/!assets/bower_components/**/*.html'],
                tasks  : ['app-html'],
                options: {interrupt: true}
            },
            json      : {
                files  : ['src/**/*.json', 'src/!assets/bower_components/**/*.json'],
                tasks  : ['app-json'],
                options: {interrupt: true}
            },
            img       : {
                files  : ['src/**/*.' + imgExts, 'src/!assets/bower_components/**/*.' + imgExts],
                tasks  : ['app-imgs'],
                options: {interrupt: true}
            }
        },

// CONCURRENT - Run multiple tasks at the same time
        concurrent: {
            options: {limit: 8}, // num of processor cores
            app    : ['app-css', 'app-js', 'app-html', 'app-json', 'app-copy', 'app-imgs'],
            vdr    : ['vdr-js', 'vdr-css', 'vdr-copy'],
            //all: ['concurrent:app', 'concurrent:vdr'], the version below is faster
            all    : ['app-css', 'app-js', 'app-html', 'app-json', 'app-copy', 'app-imgs', 'vdr-js', 'vdr-css', 'vdr-copy']
        }
    });

    /***********************************************************************************************/
    /* BUILD TASKS                                                                                 */
    /* See the README file for instructions on using the build tasks.                              */
    /***********************************************************************************************/

    // The default grunt command launches the watcher
    grunt.registerTask('default', 'Displays helpful grunt information', grunt.help.display);

    // full build
    grunt.registerTask('build', 'Run all of the build scripts.', ['clean:dist', 'concurrent:all']);

    // app build tasks
    grunt.registerTask('app-css-assets', 'Compile sass, concant, minimize and copy app asset css to dist', ['clean:stage_css_assets', 'sass:assets', 'concat:assetcss', 'postcss:assets', 'cssmin:assets']);
    grunt.registerTask('app-css-custom', 'Compile sass, minimize and copy app custom css to dist', ['clean:stage_css_custom', 'sass:custom', 'postcss:custom', 'cssmin:custom']);
    grunt.registerTask('app-css', 'Compile sass, concant, minimize and copy all app css to dist', ['app-css-assets', 'app-css-custom']);
    grunt.registerTask('app-js', 'Uglify, concant and copy app js files to dist', ['clean:stage_js_app', 'uglify:appjs', 'concat:appjs']);
    grunt.registerTask('app-html', 'Minimize html files and copy to dist', ['htmlmin']);
    grunt.registerTask('app-json', 'Minimize json files and copy to dist', ['minjson']);
    grunt.registerTask('app-copy', 'Copy all miscellaneous app files to dist', ['copy:misc']);
    grunt.registerTask('app-imgs', 'Minimize images and copy to dist', ['imagemin']);
    grunt.registerTask('buildapp', 'Run the app tasks concurrently', ['concurrent:app']);

    // vendor build tasks
    grunt.registerTask('vdr-js', 'Uglify, concant and copy vendor js files to dist', ['clean:stage_js_vendor', 'uglify:hctheme', 'concat:vendorjs']);
    grunt.registerTask('vdr-css', 'Concant, minimize and copy vendor css to dist', ['clean:stage_css_vendor', 'concat:vendorcss', 'cssmin:vendor']);
    grunt.registerTask('vdr-copy', 'Copy the files needed by vendor libraries to dist', ['copy:vendor']);
    grunt.registerTask('buildvdr', 'Run the vendor tasks concurrently', ['concurrent:vdr']);

    /***********************************************************************************************/
    /* SPECIALTY TASKS                                                                             */
    /***********************************************************************************************/
    grunt.registerTask('lint', 'Specialty task to detect errors and potential problems in javascript files.', ['jshint']);
};