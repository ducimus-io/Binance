// Require dependencies
const binance = require('node-binance-api')();
const chalk = require('chalk');
const figlet = require('figlet');
const mongoose = require('mongoose');

// Require wsConnection
const wsConnection = require('./ws/wsConnection');

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




