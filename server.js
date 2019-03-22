// Require dependencies
const binance = require('node-binance-api')();
const chalk = require('chalk');
const figlet = require('figlet');
const mongoose = require('mongoose');

// Require ws files
const wsConnection = require('./ws/wsConnection');

const log = console.log;

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => log('MongoDB Connected'))
    .catch(err => log(err));

// ASCII title
figlet('Ducimus', function(err, data) {
    if (err) {
        log(chalk.red('Sth is wrong with the title!'));
        console.dir(err);
        return;
    }
    log(chalk.cyan(data))
});

// Object of USD prices of BTC and ETH
var prices = {
    btc: '',
    eth: ''
};

// Array of filtered by volume Symbols
var filtered = [];

// Check for symbols above 20k volume
binance.prices((error, ticker) => {
    // Init USD prices of BTC and ETH
    prices.btc = ticker.BTCUSDT;
    prices.eth = ticker.ETHUSDT;

    // Get all symbols' volumes and isolate
    // btc and eth quote symbols above 20k
    binance.prevDay(false, (error, prevDay) => {
        for ( let obj of prevDay ) {

            let symbol = obj.symbol;
            let volume = obj.volume;

            if ((symbol.substr(symbol.length - 3)) === "BTC" ) {
                if ((prices.btc * volume) > 20000) {
                    filtered.push(symbol);
                }
            } else if((symbol.substr(symbol.length - 3)) === "ETH") {
                if ((prices.eth * volume) > 20000) {
                    filtered.push(symbol);
                }
            }
            
        }

        // Subscribe to all filtered symbols
        for(let f of filtered) {
            wsConnection(f);
        }
    });

});