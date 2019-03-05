/**
 * NOTE:
 * A single connection to stream.binance.com 
 * is only valid for 24 hours; expect to be 
 * disconnected at the 24 hour mark
 */
const binance = require('node-binance-api')();
const fs = require('fs');
const chalk = require('chalk');

const log = console.log;

// Binance connect
binance.options({
    APIKEY: '<key>',
    APISECRET: '<secret>',
    useServerTime: true // if you get timestamp errors, synchronize to server time at startup
});

// MarketDepth model
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

        // Write event time, id and number of asks/bids in txt
        const timeFile = fs.createWriteStream(`data/${lowCurrency}/${lowCurrency}-md-t.txt`, {flags:'a'});
        timeFile.on('error', function(err) {
            log(chalk.red("There is a problem with the file writting."));
        });
        timeFile.write("time:"+eventTime+"\nid:"+updateId+"\nask-num:"+askDepth.length+"\nbid-num:"+bidDepth.length+"\n"); 
        timeFile.end();

        // Write asks in txt
        const askFile = fs.createWriteStream(`data/${lowCurrency}/${lowCurrency}-md-a.txt`, {flags:'a'});
        askFile.on('error', function(err) {
            log(chalk.red("There is a problem with the file writting."));
        });
        // Check if ask array is empty
        if (askDepth.length === 0) {
            
            askFile.write('EMPTY\n'); 
            
            log(chalk.magenta("ask: ") + chalk.red("EMPTY"));
        } else {
            askDepth.forEach(function(a) {
                // format the file
                askFile.write(a.join(', ') + '\n'); 
                log(chalk.magenta("ask: ") + a);
            });
        }
        askFile.end();

        // Write bids in txt        
        const bidFile = fs.createWriteStream(`data/${lowCurrency}/${lowCurrency}-md-b.txt`, {flags:'a'});
        bidFile.on('error', function(err) {
            log(chalk.red("There is a problem with the file writting."));
        });
        // Check if bid aarray is empty
        if (bidDepth.length === 0) {
            log(chalk.magenta("bid: ") + chalk.red("EMPTY"));
        } else {
            bidDepth.forEach(function(b) {
                // format the file
                bidFile.write(b.join(', ') + '\n'); 
                log(chalk.magenta("bid: ") + b);
            });
            
        }
        bidFile.end();
        
    });
    
}

module.exports = wsConnection;