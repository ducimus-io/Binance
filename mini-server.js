// Require dependencies
const binance = require('node-binance-api')();
const chalk = require('chalk');

const log = console.log;

// Binance connect
binance.options({
    APIKEY: '<key>',
    APISECRET: '<secret>',
    useServerTime: true // if you get timestamp errors, synchronize to server time at startup
});

binance.websockets.depthCache(['BNBBTC'], (symbol, depth) => {

    let bids = binance.sortBids(depth.bids);
    let asks = binance.sortAsks(depth.asks);

    console.log(symbol+" depth cache update");
    log(chalk.magenta("bids", bids));
    log(chalk.blue("asks", asks));
});