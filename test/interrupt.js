(function (global) {

    if (typeof module !== 'undefined' && module.exports) { //node only code
        Bucks = require('../bucks');
        chai = require('chai');
        should = chai.Should();
    }

    describe('#interrupt', function() {
        it('all cancellation', function(next) {
            var b = new Bucks();
            b
                .delay(1 * 1000) // 1ms
                .add(function f1() {
                    return 'a';
                })
                .add(function f2() {
                    return 'b';
                })
                .add(function f3() {
                    return 'c';
                })
                .end(function (err, res) {
                    res.should.have.length(0);
                    next();
                })
            ;

            b.interrupt();

            should.not.exist(b._tasks);
            b._taskcount.should.equal(0);

        });

        it('partial cancellation', function(next) {
            var b = new Bucks();
            b
                .add(function f1() {
                    return 'a';
                })
                .delay(1 * 1000) // 1ms
                .add(function f2() {
                    return 'b';
                })
                .add(function f3() {
                    return 'c';
                })
                .end(function (err, res) {
                    res.should.have.length(1);
                    next();
                })
            ;

            b.interrupt();

            should.not.exist(b._tasks);
            b._taskcount.should.equal(0);

        });

        it('not cancel', function(next) {
            var b = new Bucks();
            b
                .add(function f1() {
                    return 'a';
                })
                .add(function f2() {
                    return 'b';
                })
                .add(function f3() {
                    return 'c';
                })
                .delay(1 * 1000) // 1ms
                .end(function (err, res) {
                    res.should.have.length(3);
                    next();
                })
            ;

            b.interrupt();

            should.not.exist(b._tasks);
            b._taskcount.should.equal(0);

        });
    });



})(this);
