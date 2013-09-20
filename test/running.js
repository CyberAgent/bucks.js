(function (global) {

    if (typeof module !== 'undefined' && module.exports) { //node only code
        Bucks = require('../bucks');
        chai = require('chai');
        should = chai.Should();
    }

    describe('check running', function(done) {

        var b = new Bucks();
        b.then(function(res, next) {
            Bucks.running[b.__id].should.be.equal(b);
            Bucks.living[b.__id].should.be.equal(b);
            next();
        }).end();

        should.not.exist(Bucks.running[b.__id]);
        should.not.exist(Bucks.living[b.__id]);


        var forgot = new Bucks();
        forgot.then(function() {});

        // if end not called
        Bucks.living[forgot.__id].should.be.equal(forgot);
        should.not.exist(Bucks.running[forgot.__id]);

        forgot.end();
        should.not.exist(Bucks.living[forgot.__id]);
    });


})(this);
