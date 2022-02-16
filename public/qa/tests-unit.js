// fortune cookie test

var fortune = require('../../lib/fortune.js');
var expect = require('chai').expect;

suite('Fortune cookie tests', function() {

//test 1 - to run enter command: mocha -u tdd -R spec qa/tests-unit.js
	test('getFortune() should return a fortune', function() {
		expect(typeof fortune.getFortune() ==='string');
	});
});
