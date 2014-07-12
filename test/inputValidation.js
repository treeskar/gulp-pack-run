var packRun = require('../'),
	gulp = require('gulp'),
	should = require('should');

require('mocha');

describe('Input validation', function () {

	var inputs = [undefined, null, {}, 1, 'string'],
		testInput = function (input) {
			it('Is manifest ' + typeof input, function (done) {
				packRun(input)
					.then(
					// on resolve
					function () {
						done('Promise must be rejected');
					},
					// on reject
					function (err) {
						err.should.be.eql('Manifest must be array');
						done();
					});
			});
		};

	for (var i = 0, j = inputs.length; i < j; i++) {
		testInput(inputs[i]);
	}

});