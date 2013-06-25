(function (global) {

    var Bucks = require('../bucks');
    var should = require('should');

    var onError = function (e, bucks) {
        Bucks._onError.should.be.ok;
        Bucks._isOnError.should.be.ok
        //console.log("Custom onError");
    };


    describe('#onError', function () {
        before(function() {
            // Bucks.onError!!
            Bucks.onError(onError);
        });

        it('case #0', function() {
            try {
                var b0 = new Bucks();
                b0
                    .add(function(err, next) {
                        //console.log("case b0:", err, next);
                        throw new Error('b0');
                    })
                    .end()
                ;
            } catch (e) {
                console.log("-----------")
                console.log(e.stack)
                should.fail();
            }
        });

        it('case #1', function() {
            try {
                var b1 = new Bucks();
                b1
                    .add(function() {
                        throw new Error('b1');
                    })
                    .then(function then(err, next) {
                        //console.log("case b1:", err, next);
                        throw err;
                    })
                    .end()
                ;
            } catch (e) {
                should.fail();
            }
        });

        it('case #2', function() {
            try {
                var b2 = new Bucks();
                b2
                    .add(function() {
                        throw new Error('b2');
                    })
                    .error(function error(err, next) {
                        //console.log("case b2:", err, next);
                        throw err;
                    })
                    .end()
                ;
            } catch (e) {
                should.fail();
            }
        });

        it('case #3', function() {
            try {
                var b3 = new Bucks();
                b3
                    .add(function() {
                        throw new Error('b3');
                    })
                    .end(function (err, ress) {
                        throw err;
                    }, function (err) {
                        //console.log("case b3:", err);
                        throw err;
                    })
                ;
            } catch (e) {
                should.fail();
            }
        });

        it('case #4', function() {
            try {
                var b4 = new Bucks();
                b4
                    .then(function(err, next) {
                        next(new Error('b4'));
                    })
                    .end(function (err, ress) {
                        //console.log("case b4:", err, ress);
                        throw err;
                    })
                ;
            } catch (e) {
                should.fail();
            }
        });

        it('case #5', function() {
            try {
                var b5 = new Bucks();
                b5
                    .add(function(err, next) {
                        throw new Error('b4');
                    })
                    .then(function(err, next) {
                        throw new Error('Not assumed!!!');
                    })
                    .end(function (err, ress) {
                        //console.log("case b4:", err, ress);
                        throw err;
                    })
                ;
            } catch (e) {
                should.fail();
            }
        });

        it('logs error when DEBUG is true, not be thrown', function() {
            Bucks.DEBUG = true;
            console.log('This is error-logging test. error will be logged.');
            try {
                var b = new Bucks();
                b.then(function() {
                    throw new Error('err');
                }).end();
            } catch(e) {
                should.fail('should not be called this method!');
            }
            Bucks.DEBUG = false;

        });

        after(function() {
            Bucks._onError = function () {};
            Bucks._isOnError = false;
        });
    });
})(this);
