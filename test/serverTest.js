const expect = require('chai').expect;
const fs = require('fs');

// Data files test
describe('Data files', function() {

    it("Expect a market-depth-time.txt file", (done) => {
        expect(fs.existsSync('./data/market-depth-time.txt')).to.be.true;
        done();
    });

    it("Expect a market-depth-ask.txt file", (done) => {
        expect(fs.existsSync('./data/market-depth-ask.txt')).to.be.true;
        done();
    });

    it("Expect a market-depth-bid.txt file", (done) => {
        expect(fs.existsSync('./data/market-depth-bid.txt')).to.be.true;
        done();
    });
});
