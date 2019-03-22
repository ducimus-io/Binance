// Require dependencies
const binance = require('node-binance-api')();
const chalk = require('chalk');
const figlet = require('figlet');
const mongoose = require('mongoose');
const axios = require('axios');

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
                            console.log("SUBSCRIBED: " + allSymbols[s]);
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
                            console.log("SUBSCRIBED: " + allSymbols[s]);
                        }
                    });

                });
                
            }
        } 

    });

}

// Call volumeChecker
//volumeChecker();

/*
TO DO, SUBSCRIBE TO ALL SYMBOLS 
TO DO, COUNT HOW MANY SYMBOLS HAVE BEEN SAVED TO MONGO
        AND HOW MANY HAVE BEEN WRITTEN TO TERMINAL
*/
/*binance.prices((error, ticker) => {
    // Get all the symbols on the market
    let allSymbols = Object.keys(ticker);
    
    // Subscribe to every symbol
    for (s=0; s<allSymbols.length; s++) {
        wsConnection(allSymbols[s]);
    }
});*/


//Start connections
/*wsConnection('BTCUSDT');
wsConnection('ETHBTC');
wsConnection('ETHUSDT');*/

var prices = {
    btc: '',
    eth: ''
};

var filtered = [];

binance.prices((error, ticker) => {
    prices.btc = ticker.BTCUSDT;
    prices.eth = ticker.ETHUSDT;
    
    // Get all the symbols on the market
    let allSymbols = Object.keys(ticker);
        
    // Check if the quote part is BTC or ETH
    for (s=0; s<allSymbols.length; s++) {
        if ((allSymbols[Object.keys(allSymbols)[s]].substr(allSymbols[Object.keys(allSymbols)[1]].length - 3)) === "BTC" ) {

        

            // Get symbol's volume
            binance.prevDay(allSymbols[Object.keys(allSymbols)[s]], (error, prevDay, symbol) => {
                
                

                // Find the USD price of BTC * volume of symbol
                if ((prices.btc * prevDay.quoteVolume) >= 20000) {
                    filtered.push(allSymbols[Object.keys(allSymbols)[s]]);
                }

            });

        } else if((allSymbols[Object.keys(allSymbols)[s]].substr(allSymbols[Object.keys(allSymbols)[1]].length - 3)) === "ETH") {
            
            // Get symbol's volume
            binance.prevDay(allSymbols[Object.keys(allSymbols)[s]], (error, prevDay, symbol) => {
                
                // Find the USD price of ETH * volume of symbol
                if ((prices.eth * prevDay.quoteVolume) > 20000) {
                    filtered.push(allSymbols[Object.keys(allSymbols)[s]]);
                }

            });
            
        }
    } 

});



