/**
 * NOTE:
 * A single connection to stream.binance.com 
 * is only valid for 24 hours; expect to be 
 * disconnected at the 24 hour mark
 */
const binance = require('node-binance-api')();
const chalk = require('chalk');

const log = console.log;

// Binance connect
binance.options({
    APIKEY: '<key>',
    APISECRET: '<secret>',
    useServerTime: true // if you get timestamp errors, synchronize to server time at startup
});

// Bring in MarketDepth model
const MarketDepth = require('../models/MarketDepth');

/**
 * Establish a websocket connection for a symbol
 * @param currency: Market symbol 
 */
function wsConnection(currency) {

    const lowCurrency = currency.toLowerCase();

    /** 
     * Open a websocket connection with Binance Websocket API 
     * and get the market depth updates
     */ 
    binance.websockets.depth([currency], (depth) => {
        let {e:eventType, E:eventTime, s:symbol, u:updateId, b:bidDepth, a:askDepth} = depth;

        // update of market depth
        log(chalk.blue(symbol + " market depth update"));

        // Create new mongoose model
        const newMarketDepth = new MarketDepth({
            name: lowCurrency,
            id: updateId,
            time:  eventTime,
            numA: askDepth.length,
            numB: bidDepth.length,
            asks: askDepth,
            bids: bidDepth
        });

        // Save model to mongoDB
        newMarketDepth.save().then(marketDepth => marketDepth);

        // Keep track of event time, id and number of asks/bids
        log(chalk.magenta("Update id: ") + updateId, chalk.magenta("\nEvent time: ") + eventTime, chalk.magenta("\nAsk num: ") 
        + chalk.yellow(askDepth.length), chalk.magenta("\nBid num: ") +  chalk.yellow(bidDepth.length));
        
    });
    
}

module.exports = wsConnection;