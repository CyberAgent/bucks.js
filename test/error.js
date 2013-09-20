(function (global) {

    if (typeof module !== 'undefined' && module.exports) { //node only code
        Bucks = require('../bucks');
        chai = require('chai');
        should = chai.Should();
    }

    //
    // error test
    //
    describe('#error', function () {

        it('should not be called if no error', function() {
            var b = new Bucks();
            b.then(function start() {
                return 'start';
            }).error(function onError(e, next) {
                should.fail('should not be called this method!');
            }).end();

        });

        describe('should be called on error', function() {

            it('is recoverable', function() {
                var b = new Bucks();
                b.then(function start() {
                    throw new Error('error in start');
                    return 'start';
                }).error(function onError(e, next) {
                    e.should.be.an.instanceof(Error);
                    e.message.should.equal('error in start');
                    // recover
                    return next();
                }).end(function last(err, ress) {
                    should.not.exist(err);
                    ress.should.eql([null, null]);
                });
            });

            it('can pass error to next task', function() {
                var b = new Bucks();
                b.then(function start() {
                    throw new Error('error in start');
                }).error(function onError(e, next) {
                    return next(e);
                }).end(function last(err, ress) {
                    err.should.be.an.instanceof(Error);
                    err.message.should.equal('error in start');
                    ress.should.eql([null, null]);
                });
            });

            it('can rethrow error', function() {
                var b = new Bucks();
                b.then(function start() {
                    throw new Error('error in start');
                    return 'start';
                }).error(function onError(e, next) {
                    e.should.be.an.instanceof(Error);
                    throw e; // rethrow
                }).end(function last(err, ress) {
                    err.should.be.an.instanceof(Error);
                });
            });
        });
    });


})(this);
