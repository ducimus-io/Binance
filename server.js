// Require dependencies
const binance = require('node-binance-api')();
const chalk = require('chalk');
const figlet = require('figlet');
const mongoose = require('mongoose');

// Require ws files
const wsConnection = require('./ws/wsConnection');
const quotePrices = require('./ws/quotePrices');
//const volumeChecker = require('./ws/volumeChecker');

// Bring in QuoteCrypto model
const QuoteCrypto = require('./models/QuoteCrypto');

const log = console.log;

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

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
 * Get quote prices in USD
 * */
//quotePrices();

// Check volume above 20K
function volumeChecker() { 

    binance.prices((error, ticker) => {
        // Get all the symbols on the market
        let allSymbols = Object.keys(ticker);

        // Check if the quote part is BTC or ETH
        for (s=0; s<allSymbols.length; s++) {
            if ((allSymbols[s].substr(allSymbols[s].length - 3)) === "BTC" ) {

                // Get symbol's volume
                binance.prevDay(allSymbols[s], (error, prevDay, symbol) => {
                    
                    // Find the USD price of BTC * volume of symbol
                    QuoteCrypto.findOne({ name: 'BTCUSDT' }, function (err, quote) {
                        if ((quote.price * prevDay.quoteVolume) >= 20000) {
                            //SUBSCRIBE TO SYMBOL
                            console.log("SUBSCRIBED");
                        }
                    });

                });

            } else if((allSymbols[s].substr(allSymbols[s].length - 3)) === "ETH") {
                
                // Get symbol's volume
                binance.prevDay(allSymbols[s], (error, prevDay, symbol) => {
                    
                    // Find the USD price of ETH * volume of symbol
                    QuoteCrypto.findOne({ name: 'ETHUSDT' }, function (err, quote) {
                        if ((quote.price * prevDay.quoteVolume) > 20000) {
                            //SUBSCRIBE TO SYMBOL
                            console.log("SUBSCRIBED");
                        }
                    });

                });
                
            }
        } 

    });

}

// Call volumeChecker
volumeChecker();


//Start connections
/*wsConnection('BTCUSDT');
wsConnection('ETHBTC');
wsConnection('ETHUSDT');
wsConnection('BNBBTC');
wsConnection('BNBUSDT');*/




