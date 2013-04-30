(function (global) {

    var Bucks = require('../bucks');

    var should = require('should');


    //
    // end callback test
    //
    describe('#end callbacks', function() {

        it('should catch error in end callback', function(done) {
            var b = new Bucks();
            b.add(function throwError() {
                throw new Error('err');
            }).end(function last(err, res) {
                err.should.be.an.instanceof(Error);
                err.message.should.be.equal('err');
                done();
            });
        });

        it('should not call end errorback if no error thrown in end callback', function(done) {
            var b = new Bucks();
            b.add(function start() {
                throw new Error('err');
            }).end(function last(err, res) {
                err.should.be.an.instanceof(Error);
                done();
            }, function lastErrorback(err) {
                should.fail('should not be called this method!');
            });
        });


        it ('end errback should catch error thrown in end callback', function(done) {
            var b = new Bucks();
            b.empty()
            .end(function last(err, res) {
                throw new Error('error in end');
            }, function lastErrorback(err) {
                err.should.be.an.instanceof(Error);
                done();
            });
        });

        it ('end errback should catch error thrown in chain without end callback', function(done) {
            var b = new Bucks();
            b.add(function start() {
                throw new Error('error in task');
            }).end(null, function lastErrorback(err) {
                err.should.be.an.instanceof(Error);
                done();
            });
        });

    });


})(this);