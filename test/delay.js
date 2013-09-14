(function (global) {

    var Bucks = require('../bucks');

    var should = require('should');

    describe('#delay', function() {
        it('basic', function(next) {
            var b = new Bucks();
            b
                .add(function f1() {
                    return 'a';
                })
                .delay(1 * 1000) // 1ms
                .add(function f2(err, res) {
                    res.should.equal('a');
                    next();
                })
                .end()
            ;
        });
    });



})(this);
