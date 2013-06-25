(function(global) {

    var Bucks = require('../bucks');

    var should = require('should');


    describe('uncaught error', function() {
        it('should throw error when error in task if no end callback exists', function() {
            var b = new Bucks();
            var through = false;
            try {
                b.add(function task(err, res, next) {
                    throw Error('error in task');
                }).end();
            } catch (e) {
                e.should.be.an.instanceof(Error);
                e.message.should.be.equal('error in task');
                through = true;
            }
            through.should.be.true;
        });

        it('should throw error if an error thrown in end callback without errback', function() {
            var b = new Bucks();
            var through = false;
            try {
                b.add(function task(err, res, next) {
                    throw Error('error in task');
                }).end(function callback(err, ress) {
                    if (err) {
                       throw err;
                    }
                });
            } catch (e) {
                e.should.be.an.instanceof(Error);
                e.message.should.be.equal('error in task');
                through = true;
            }
            through.should.be.true;
        });

        it('should throw error if an error thrown in end errback', function() {
            var b = new Bucks();
            var through = false;
            try {
                b.add(function task(err, res, next) {
                    throw Error('error in task');
                }).end(function callback(err, ress) {
                    if (err) {
                       throw err;
                    }
                }, function errback(ex) {
                    throw ex;
                });
            } catch (e) {
                through = true;
                e.should.be.an.instanceof(Error);
                e.message.should.be.equal('error in task');
            }
            through.should.be.true;
        });
    });

    describe('less args error', function() {
        describe('less args of #error', function() {
            it('should throw error when no args specified', function() {
                var b = new Bucks();
                    var through = false;
                try {
                    b.error(function lessArgs() {
                        return 'not called';
                    }).end();
                } catch(e) {
                    e.should.be.an.instanceof(Error);
                    through = true;
                };
                through.should.be.true;
            });
        });

        describe('less args of #end callback', function() {
            it('should throw error when no args specified', function() {
                var b = new Bucks();
                var through = false;
                try {
                    b.empty().end(function() {
                        // no args
                    });
                } catch(e) {
                    e.should.be.an.instanceof(Error);
                    through = true;
                };
                through.should.be.true;
            });

            it('should Not throw error when 1 arg specified', function() {
                var b = new Bucks();
                var through = false;
                try {
                    b.empty().end(function(err) {
                        if (err) {
                            // explicit ignore
                        }
                    });
                } catch(e) {
                    should.fail();
                };
            });
        });
    });

    describe('uncaught error when DEBUG', function() {
        before(function() {
            Bucks.DEBUG = true;
        });

        it('logs error when DEBUG is true, not be thrown', function() {
            console.log('This is error-logging test. error will be logged.');
            try {
                var b = new Bucks();
                b.then(function() {
                    throw new Error('err');
                }).end();
            } catch(e) {
                e.message.should.equal("err").be.ok;
            }

        });


        after(function() {
            Bucks.DEBUG = false;
        });

    });

})(this);
