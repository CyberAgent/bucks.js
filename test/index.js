(function (global) {

    if (typeof module !== 'undefined' && module.exports) { //node only code
        Bucks = require('../bucks');
        chai = require('chai');
        should = chai.Should();
    }

    describe('#add, #end', function() {
        it('should pass results to next function', function() {
            var b = new Bucks();
            b.add(function f1() {
                return 'a';
            }).add(function f2(err, res) {
                res.should.equal('a');
            }).end();


            b = new Bucks();
            b.add(function f1(err, res) {
                // nothing
            }).add(function f2(err, res) {
                should.not.exist(res);
            }).end();


            b = new Bucks();
            b.add(function f1(err, res, next) {
                return next(null, 'a');
            }).add(function f2(err, res) {
                res.should.equal('a');
            }).end();


            b = new Bucks();
            b.add(function f1(err, res, next) {
                return next(new Error('error'), 'a');
            }).add(function f2(err, res) {
                res.should.equal('a');
            }).end();
        });

        it('should pass results to end function', function() {
            var b = new Bucks();
            b.add(function f1() {
                return 'a';
            }).end(function last(err, ress) {
                ress[0].should.equal('a');
            });

            b = new Bucks();
            b.add(function f1(err, res, next) {
                return next(null, 'a');
            }).end(function last(err, ress) {
                ress[0].should.equal('a');
            });

            b = new Bucks();
            b.add(function f1(err, res, next) {
                return next(new Error('error'), 'a');
            }).end(function last(err, ress) {
                ress[0].should.equal('a');
            });

            b = new Bucks();
            b.add(function f1() {
                return 'a';
            }).add(function f2() {
                return 'b';
            }).end(function last(err, ress) {
                ress[0].should.equal('a');
                ress[1].should.equal('b');
            });

            b = new Bucks();
            b.add(function f1() {
                return 'a';
            }).add(function f2() {
                return 'b';
            }).add(function f3(err, res, next) {
                return next(new Error('error'), 'c');
            }).end(function last(err, ress) {
                ress[0].should.equal('a');
                ress[1].should.equal('b');
                ress[2].should.equal('c');
                err.should.be.an.instanceof(Error);
            });

        });


        it('should pass errors to next function', function() {

            var b = new Bucks();
            b.add(function f1() {
                throw new Error('error');
                return 'a';
            }).add(function f2(err, res) {
                // if error thrown in task,
                // only err passed to next task.
                err.should.be.an.instanceof(Error);
                should.not.exist(res);
            }).end();

            b = new Bucks();
            b.add(function f1(err, res, next) {
                throw new Error('error');
                return next(null, 'f1 result');
            }).add(function f2(err, res) {
                // if error thrown in task,
                // only err passed to next task.
                err.should.be.an.instanceof(Error);
                should.not.exist(res);
            }).end();

            var through = false;
            try{
                b = new Bucks();
                b.add(function f1(err, res, next) {
                    next(null, 'f1 result');  // simply exec `next`
                    throw new Error('error'); // error after `next`
                }).add(function f2(err, res) {
                    // if error thrown after call `next`,
                    // it's no effect to folloing tasks
                    should.not.exist(err);
                    res.should.equal('f1 result');
                }).end();
            } catch(e) {
                // however, finally cause error
                // as of this bucks object
                e.should.be.an.instanceof(Error);
                through = true;
            }
            through.should.be.true;


            b = new Bucks();
            b.add(function f1(err, res, next) {

                // to avoid unexpected error after `next`,
                // you can return `next` function.
                return next(null, 'f1 result');
                throw new Error('error');

            }).add(function f2(err, res) {
                // if error thrown after call `next`,
                // it's no effect to folloing tasks
                should.not.exist(err);
                res.should.equal('f1 result');
            }).end();


            b = new Bucks();
            b.add(function f1(err, res, next) {
                return next(new Error('error'), 'a');
            }).add(function f2(err, res) {
                // if `next` function called with both
                // err and res, both of them passed.
                err.should.be.an.instanceof(Error);
                res.should.equal('a');
            }).end();


            b = new Bucks();
            b.add(function f1(err, res, next) {
                return next(new Error('error'), 'a');
            }).add(function f2(err, res) {
                res.should.equal('a');
            }).end();
        });


        it('should pass error to end function', function() {

            var b = new Bucks();
            b.add(function f1() {
                throw new Error('error');
                return 'a';
            }).end(function f2(err, ress) {
                // if error thrown in task,
                // only err passed to next task.
                err.should.be.an.instanceof(Error);
                ress.should.be.eql([null]);
            });

            b = new Bucks();
            b.add(function f1(err, res, next) {
                return next(new Error('error'), 'a');
            }).end(function f2(err, ress) {
                // if `next` function called with both
                // err and res, both of them passed.
                err.should.be.an.instanceof(Error);
                ress[0].should.equal('a');
            });


            b = new Bucks();
            b.add(function f1(err, res, next) {
                return next(new Error('error'), 'a');
            }).end(function f2(err, ress) {
                ress[0].should.equal('a');
            });
        });
    });



})(this);
