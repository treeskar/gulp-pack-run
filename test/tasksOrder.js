var packRun = require('../'),
	gulp = require('gulp'),
	Q = require('q'),
	should = require('should');

require('mocha');

describe('sequence', function () {

	var orderOfRunnigtasks = [];

	beforeEach(function(){
		orderOfRunnigtasks = [];
	});

	describe('Task running' , function () {
		gulp.task('task1', function () {
			orderOfRunnigtasks.push('task1');
			return;
		});

		it('Run single task', function (done) {
			packRun(['task1'])
				.then(
				function () {
					orderOfRunnigtasks.should.be.eql(['task1']);
					done();
				},
				function (err) {
					done(err);
				});
		});

	});

	describe('Run tasks tests', function () {

		gulp.task('task2', function () {
			orderOfRunnigtasks.push('task2');
			return;
		});
		gulp.task('task3', function () {
			orderOfRunnigtasks.push('task3');
			return;
		});

		it('Run multiple tasks', function () {
			packRun([
				{ name: 'task2', dependencies: [] },
				'task3'
			]);
			orderOfRunnigtasks.should.be.eql(['task2', 'task3']);
		});

		it('Run tasks with dependencies', function () {
			packRun([
				{ name: 'task2', dependencies: ['task3'] },
				'task3'
			]);
			orderOfRunnigtasks.should.be.eql(['task3', 'task2']);
		});

	});

	describe('Run async tasks', function () {
		var orderOfRunnigtasks = [];

		gulp.task('task4', function () {
			orderOfRunnigtasks.push('task4');
			return;
		});

		gulp.task('task5', function () {
			var deferred = Q.defer();
			setTimeout(function () {
				orderOfRunnigtasks.push('task5');
				deferred.resolve();
			}, 200);
			return deferred.promise;
		});

		it('Run tasks with dependencies', function (done) {
			packRun([
				{name: 'task4', dependencies: ['task5']},
				'task5'
			])
			.then(
				function () {
					orderOfRunnigtasks.should.be.eql(['task5', 'task4']);
					done();
				},
				function (err) {
					done(err);
				}
			);
		});
	});

});