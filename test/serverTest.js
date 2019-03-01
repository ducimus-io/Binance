const expect = require('chai').expect;
const assert = require('chai').assert;
const fs = require('fs');

// Data directories test
describe('Data directories', function() {

    it("Expect a btcusdt directory", (done) => {
        expect(fs.existsSync('./data/btcusdt')).to.be.true;
        done();
    });

    it("Expect a ethbtc directory", (done) => {
        expect(fs.existsSync('./data/ethbtc')).to.be.true;
        done();
    });

    it("Expect a ethusdt directory", (done) => {
        expect(fs.existsSync('./data/ethusdt')).to.be.true;
        done();
    });
});
