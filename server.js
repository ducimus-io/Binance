/**
 * NOTE:
 * A single connection to stream.binance.com 
 * is only valid for 24 hours; expect to be 
 * disconnected at the 24 hour mark
 */

// Require dependencies
const binance = require('node-binance-api')();
const fs = require('fs');
const chalk = require('chalk');
const figlet = require('figlet');
const mongoose = require('mongoose');

const log = console.log;

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// MarketDepth model
const MarketDepth = require('./models/MarketDepth');

// Binance connect
binance.options({
    APIKEY: '<key>',
    APISECRET: '<secret>',
    useServerTime: true // if you get timestamp errors, synchronize to server time at startup
});

// ASCII title
figlet('Ducimus', function(err, data) {
    if (err) {
        log(chalk.red('Sth is wrong with the title!'));
        console.dir(err);
        return;
    }
    log(chalk.cyan(data))
});

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

        //-------------------------------------------------------------------
        const newMarketDepth = new MarketDepth({
            id: updateId,
            time:  eventTime,
            numA: askDepth.length,
            numB: bidDepth.length
        });

        newMarketDepth.save().then(marketDepth => res.json(marketDepth));
        //-------------------------------------------------------------------

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

/**
 * Calculate the avg volume of symbol
 * @param crypto: Market crypto
 */
function avgVolume(symb) {
    
    binance.prevDay(symb, (error, prevDay, symbol) => {
        return (parseInt(prevDay.volume) + parseInt(prevDay.quoteVolume)) /2 ;
    });
}

/*binance.prices((error, ticker) => {
    let allSymbols =  Object.keys(ticker);

    for(s=0; s < allSymbols.length; s++) {

        // TO DO: AVG VOLUME IN USD
        //wsConnection(allSymbols[s]); 
        console.log(allSymbols.length); 
    }
});*/


//Start connections
wsConnection('BTCUSDT');
wsConnection('ETHBTC');
wsConnection('ETHUSDT');




