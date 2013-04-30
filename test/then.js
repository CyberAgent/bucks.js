(function (global) {

    var Bucks = require('../bucks');

    var should = require('should');

    //
    // then test
    //
    describe('#then', function () {

        it('should pass results to next function', function() {
            var b = new Bucks();
            b.then(function start() {
                return 'start';
            }).end(function last(err, ress) {
                ress[0].should.equal('start');
            });

            b = new Bucks();
            b.then(function start() {
                return 'start';
            }).then(function f2(result) {
                result.should.equal('start');
                return "return in then";
            }).end(function last(err, ress) {
                ress[0].should.equal('start');
                ress[1].should.equal('return in then');
            });
        });

        it('should ignore task when previous task cause error', function() {
            var b = new Bucks();
            b.then(function start() {
                throw new Error('error in then of 9th chain');
            }).then(function f2(result) {
                should.fail('should not be called this method!');
            }).end(function last(err, ress) {
                err.should.be.an.instanceof(Error);
            });

            b = new Bucks();
            b.then(function start(result, next) {
                throw new Error('throw error in then');
                return next(null, 'sample');
            }).then(function f2(result) {
                should.fail('should not be called this method!');
                return "return in then";
            }).end(function last(err, ress) {
                err.should.be.an.instanceof(Error);
                err.message.should.equal('throw error in then');
            });

            b = new Bucks();
            b.then(function start(result, next) {
                return next(Error('passed error in then'));
            }).then(function f2(result) {
                should.fail('should not be called this method!');
                return "return in then";
            }).end(function last(err, ress) {
                err.should.be.an.instanceof(Error);
                err.message.should.equal('passed error in then');
            });
        });
    });

})(this);