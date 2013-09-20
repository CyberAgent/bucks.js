(function (global) {

    if (typeof module !== 'undefined' && module.exports) { //node only code
        Bucks = require('../bucks');
        chai = require('chai');
        should = chai.Should();
    }

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
