gulp-pack-run
=============

This plugin allows you to run your gulp task in the specified order

Usage
-----

First, install pack-run as a dev dependency:

```javascript
npm install --save-dev gulp-pack-run
```
Usage:

```javascript
var gulp = require('gulp'),
	packRun = require('gulp-pack-run');

// This will run in this order:
gulp.task('build', function(callback) {
	var manifest = [
		'bower',
		'templates',
		{
			name: 'concat-js',
			dependencies: ['bower', 'templates']
		},
		{
			name: 'sass',
			dependencies: ['bower']
		}
	];

	return packRun(manifest);
});
```
