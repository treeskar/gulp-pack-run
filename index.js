var gulp = require('gulp'),
	gutil = require('gulp-util'),
	Q = require('q');

var PackRun = function() {
	this.init = this.init.bind(this);
	this.run = this.run.bind(this);
	this.startTask = this.startTask.bind(this);
};

PackRun.prototype = {
	manifest: new Array(),
	tasksList: new Array(),
	getActualTasks: function (manifest) {
		manifest = manifest || this.manifest;
		var result = [];
		for(var i=0, j=manifest.length; i<j; i++){
			if('string' === typeof manifest[i]) {
				result.push(manifest[i]);
				manifest[i] = {
					name: manifest[i],
					inProgress: true
				};
				continue;
			}
			if('object' !== typeof manifest[i] || 'string' !== typeof manifest[i].name) {
				manifest.splice(i,1);
				continue;
			}
			if('object' !== typeof manifest[i].dependencies || 0 === manifest[i].dependencies.length) {
				if(true !== manifest[i].inProgress) {
					result.push(manifest[i].name);
					manifest[i].inProgress = true;
				}
			}
		}
		return result;
	},
	clearManifest: function (manifest, task) {
		manifest = manifest || this.manifest;
		if('string' !== typeof task) {
			return manifest;
		}
		return manifest.filter(function (elm) {
			if('string' === typeof elm) {
				return elm === task? false: true;
			}
			if('object' === typeof elm) {
				if('object' !== typeof elm.dependencies || 0 === elm.dependencies.length) {
					return elm.name === task? false: true;
				} else if(-1 !== elm.dependencies.indexOf(task)){
					elm.dependencies.splice(elm.dependencies.indexOf(task), 1);
				}
				return true;
			} else
				return false;
		});
	},
	startTask: function (task) {
		if(gulp.hasTask(task)) {
			gulp.start(task);
		} else {
			gutil.log('Task "'+task+'" not defined in gulp');
			this.run({task: task})
		}
	},
	run: function (e) {
		if('undefined' !== typeof e && 'string' === typeof e.task) {
			this.manifest = this.clearManifest(this.manifest, e.task);
		}
		this.tasksList = this.getActualTasks(this.manifest);

		if(0 === this.tasksList.length && 0 === this.manifest.length) {
			this.deferred.resolve();
		} else {
			this.tasksList.forEach(this.startTask);
		}
	},
	init: function (manifest) {
		this.deferred = Q.defer();

		if('object' !== typeof manifest || !Array.isArray(manifest)) {
			this.deferred.reject('Manifest must be array');
			return this.deferred.promise;
		}

		this.manifest = manifest;
		gulp.on('task_stop', this.run);
		this.run();

		return this.deferred.promise;
	}
};

module.exports = new PackRun().init;