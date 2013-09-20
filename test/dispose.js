(function (global) {

    if (typeof module !== 'undefined' && module.exports) { //node only code
        Bucks = require('../bucks');
        chai = require('chai');
        should = chai.Should();
    }

    describe('#add #end #parallel #dispose', function() {
        it('Run the dispose', function() {
            var b = new Bucks();
            b.add(function f1() {
                b.adummy = "aaaa"; // b member variable!!
                return 'a';
            }).add(function f2(err, res) {
                res.should.equal('a');
            }).end(null, null, function () {
                delete b.adummy;
                (!!b.adummy).should.not.be.ok
            });
        });

        it('Run the dispose with end', function() {
            var b = new Bucks();
            b.add(function f1() {
                return 'a';
            }).end(function last(err, ress) {
                b.adummy = "aaaa"; // b member variable!!
                ress[0].should.equal('a');
            }, null, function () {
                delete b.adummy;
                (!!b.adummy).should.not.be.ok
            });
        });
        it('Run the dispose with parallel/add/end', function(done) {
            var b = new Bucks();
            b.parallel([
                function task1(err, res) {
                    b.pdummy = "dummy"; // b member variable!!
                    return "task1";
                },
                function task2(err, res, next) {
                    return next(null, "task2");
                },
                function task3(err, res, next) {
                    return next(new Error('passed error in task3'));
                },
                function task4(err, res, next) {
                    throw new Error('thrown error in task4');
                }
            ]).add(function getResults(err, res, next) {

                b.adummy = "aaaa"; // b member variable!!

                res.should.eql({
                    err: [
                        null,
                        null,
                        new Error('passed error in task3'),
                        new Error('thrown error in task4')
                    ],
                    res: [
                        'task1',
                        'task2',
                        null,
                        null
                    ]
                });
                return next();
            }).end(function last(err, res) {
                res.length.should.eq(2).be.ok;
            }, null, function () {
                delete b.pdummy;
                delete b.adummy;
                (!!b.pdummy).should.not.be.ok;
                (!!b.adummy).should.not.be.ok;
                done();
            });
        });
        //
    });
})(this);
