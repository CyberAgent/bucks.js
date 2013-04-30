(function (global) {

    var Bucks = require('../bucks');

    var should = require('should');


    describe('#then #error mixed call', function() {
        var b = new Bucks();
        b.then(function start() {
            throw new Error('error in start');
            return 'start';
        }).then(function notCalled() {
            should.fail('should not be called this method!');
        }).error(function onError(e, next) {
            e.should.be.an.instanceof(Error);
            return next(null, "recover");
        }).error(function notCalled2(e, next) {
            should.fail('should not be called this method!');
        }).end(function last(err, ress) {
            ress.should.eql([
                null,
                null,
                'recover',
                'recover'
            ]);
        });


        b = new Bucks();
        b.then(function start() {
            throw new Error('error in start');
            return 'start';
        }).then(function notCalled() {
            should.fail('should not be called this method!');
        }).error(function onError(e, next) {
            e.should.be.an.instanceof(Error);
            return next(null, "recover");
        }).error(function notCalled2(e, next) {
            should.fail('should not be called this method!');
        }).end(function last(err, ress) {
            ress.should.eql([
                null,
                null,
                'recover',
                'recover'
            ]);
        });


        b = new Bucks();
        b.then(function start() {
            return 'start';
        }).error(function notCalled(e, next) {
            should.fail('should not be called this method!');
        }).then(function second() {
            throw new Error('error in second');
            return 'second';
        }).then(function notCalled() {
            should.fail('should not be called this method!');
        }).error(function onError(e, next) {
            e.should.be.an.instanceof(Error);
            return next(null, "recover");
        }).error(function notCalled2(e, next) {
            should.fail('should not be called this method!');
        }).end(function last(err, ress) {
            ress.should.eql([
                'start',
                'start',
                null,
                null,
                'recover',
                'recover'
            ]);
        });

    });

})(this);