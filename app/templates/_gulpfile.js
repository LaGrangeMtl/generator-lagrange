var gulp = require('gulp');


var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');

var sass = require('gulp-sass');

var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var bowerResolve = require('bower-resolve');
var nodeResolve = require('resolve');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var gutil = require('gulp-util');
var colors = require('colors');

var autoprefixer = require('gulp-autoprefixer');


var JSCONF = (function(){

	//les libs définies dans package.json et bower.json -> dependencies seront toutes externes. On peut aussi en ajouter ici au besoin.
	var external = getAllExternalPackageIds([
		':greensock'
	]);
	//deépendances qui ne sont addées qu'en dev
	var devTools = getDependenciesPaths([
		':source-map-support',
	]);

	return {
		src: './src/app/',
		dest: 'js',
		app:{
			src: 'Main.js',
			dest: 'app.js',
			external: external,
			devTools: devTools,
		},
		vendor: {
			src: 'VendorShim.js',
			dest: 'common.js',
			require: external,
		}
	};
}());

var CSSCONF = {
	src: './scss/',
	dest: './css',
	mainFile: 'main.scss',
};


gulp.task('libcopy', function(){
	return gulp.src('bower_components/bootstrap-sass/assets/stylesheets/bootstrap/**/*.scss')
	.pipe(gulp.dest('./scss/common/bootstrap'));
});

// Without watchify
gulp.task('browserify', function () {
	return bundleJs(getBundler(JSCONF.app, true));
});
gulp.task('browserify:vendor', function () {
	return bundleJs(getBundler(JSCONF.vendor, false));
});

// Without sourcemaps
gulp.task('browserify:production', function () {
	bundleJs(getBundler(JSCONF.app, false));
	return bundleJs(getBundler(JSCONF.vendor, false));
});

gulp.task('scss', compileScss);

gulp.task('watch', function () {

	var bundler = getBundler(JSCONF.app, true);
	bundler.bundler = watchify(bundler.bundler);
	bundleJs(bundler);

	bundler.bundler.on('update', function () {
		bundleJs(bundler);
	});

	gulp.watch(CSSCONF.src + '**/*.scss').on('change', compileScss);

});


gulp.task('debug', function(){
	console.log(JSCONF.app.external);
});


//***************************************************

function compileScss(){
	return gulp.src(CSSCONF.src + CSSCONF.mainFile)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(CSSCONF.dest).on('end',function(){
			gutil.log('Sass compiled.');
		}));
}

function getBundler(cnf, isDev){
	var bundler = browserify(JSCONF.src + cnf.src, { debug: true }).transform(babelify, { presets: ["es2015"]});

	if(cnf.external) {
		bundler = cnf.external.reduce(function(b, lib){
			return b.external(lib.alias || lib.id);
		}, bundler);
	}

	if(cnf.require){
		bundler = cnf.require.reduce(function(b, lib){
			return b.require(lib.path, {
				expose: lib.alias || lib.id
			});
		}, bundler);
	}

	//les devtools sont excludés si on est pas en dev
	if(cnf.devTools && !isDev){
		bundler = cnf.devTools.reduce(function(b, lib){
			return b.exclude(lib.alias || lib.id);
		}, bundler);
	}



	return {
		src: cnf.src,
		dest: cnf.dest,
		bundler: bundler,
		isDev: isDev,
	};
};


function bundleJs(cnf) {
	var ofile = JSCONF.dest+'/'+cnf.dest;
	gutil.log('Compiling '+ofile.magenta+'...');
	var start = new Date();
	var stream = cnf.bundler.bundle()
		.on('error', mapError)
		.pipe(source(cnf.src))
		.pipe(buffer())
		.pipe(rename(cnf.dest))
		.pipe(gulp.dest(JSCONF.dest));

	if(cnf.isDev){
		stream = stream.pipe(sourcemaps.init({ loadMaps: true }));
		stream = stream.pipe(sourcemaps.write('./'));
	} else {
		stream = stream.pipe(uglify());
	}

	stream = stream.pipe(gulp.dest(JSCONF.dest));

	stream.on('end', function(){
		var duration = new Date() - start;
		gutil.log(ofile.green+' done in '+(duration+' ms').magenta);
	});

	return stream;
}

/**
resolve le path dependant du type de dependency (package.json ou bower.json)
*/
function resolveDependency(id){
	try {
		return nodeResolve.sync(id);
	} catch(e){
		try {
			return bowerResolve.fastReadSync(id);
		} catch(e){
			return false;
		}
	}
}

/**
retourne les paths resolvés d'ne liste de dépendances
*/
var packageJson;
function getDependenciesPaths(list) {
	packageJson = packageJson || require('./package.json');
	return list.map(function(dep){
		var id, alias;
		dep = dep.split(':');
		id = dep[0];
		alias = dep[1];
		id = id || alias;

		//trouve si la dépendance est aliasée dans le browser de package.json
		if(packageJson.browser){
			var aliases = Object.keys(packageJson.browser);
			alias = aliases.reduce(function(carry, cur){
				return (packageJson.browser[cur] === id && cur) || carry;  
			}, alias);
		}
		
		var path = ( packageJson.browser && packageJson.browser[alias] ) || resolveDependency(id);

		// console.log(path.blue);
		return path && {
			id: id,
			path: path,
			alias: alias
		}
	});
};

/**
	get toutes les dépendances package.json, bower.json + une liste user defined (opt)
*/
function getAllExternalPackageIds(additionnal) {
	var res = getDependenciesPaths(additionnal || []);

	res = ['package', 'bower'].reduce(function(packages, dependencyOrigin){

		var dependencies = [];
		var manifest;
		try {
			manifest = require('./'+dependencyOrigin+'.json');
		} catch (e) {
			// does not have a xx.json manifest
		}

		// console.log(Object.keys(manifest.dependencies));
		if(manifest && manifest.dependencies) {
			// console.log(dependencies);
			dependencies = getDependenciesPaths(Object.keys(manifest.dependencies));
		}

		return packages.concat(dependencies);
	}, res).filter(function(val, idx, arr){
		return val;
	});

	//unique
	return res.reduce(function(carry, candidate){
		var id = candidate.id;
		var has = carry.filter(function(el){
			return el.id === id;
		});
		if(has.length === 0) carry.push(candidate);

		return carry;
	}, []);
}



function mapError(err) {
	if (err.fileName) {
		// regular error
		gutil.log(err.name.red
			+ ': '
			+ err.fileName.replace(__dirname + '/' + JSCONF.src, '').yellow
			+ ': '
			+ 'Line '
			+ err.lineNumber.magenta
			+ ' & '
			+ 'Column '
			+ (err.columnNumber || err.column).magenta
			+ ': '
			+ err.description.blue);
	} else {
		// browserify error..
		gutil.log(err.name.red
			+ ': '
			+ err.message.yellow)
	}

	this.emit('end');
}
