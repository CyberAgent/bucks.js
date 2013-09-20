(function(global) {

    if (typeof module !== 'undefined' && module.exports) { //node only code
        Bucks = require('../bucks');
        chai = require('chai');
        should = chai.Should();
    }

    describe('#parallel', function() {

        it('should exec each task in async, then get all results and errors', function(done) {
            var b = new Bucks();
            b.parallel([
                function task1(err, res) {
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
                done();
            });
        });
    });

})(this);
