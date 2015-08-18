var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var karmaServer = require("karma").server;

// minify copy to dist/example dirs
gulp.task("build", function() {
	gulp.src("src/**/*.js")
		.pipe(gulp.dest("dist")) // copy unminified to dist too
        .pipe(gulp.dest("example/www/js"))    // copy unminified to example folders
        .pipe(gulp.dest("example-storage/www/js"))
		.pipe(uglify())
		.pipe(rename(function(path) {
			path.extname = ".min.js"
		}))
		.pipe(gulp.dest("dist"))
		.pipe(gulp.dest("example/www/js"))
		.pipe(gulp.dest("example-storage/www/js"));
});

// test single run
gulp.task("test", function() {
	new karmaServer.start({
		configFile: __dirname + "/karma.conf.js",
		singleRun: true,
		autoWatch : false,
	});
});


gulp.task("tdd", function() {
	new karmaServer.start({
		configFile: __dirname + "/karma.conf.js"
	})
});