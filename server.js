// Require dependencies
const binance = require('node-binance-api')();
const chalk = require('chalk');
const figlet = require('figlet');
const mongoose = require('mongoose');

// Require ws files
const wsConnection = require('./ws/wsConnection');
const quotePrices = require('./ws/quotePrices');
const volumeChecker = require('./ws/volumeChecker');

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

// Get quote prices in USD
quotePrices();


//Start connections
/*wsConnection('BTCUSDT');
wsConnection('ETHBTC');
wsConnection('ETHUSDT');*/




