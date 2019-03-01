/**
 * NOTE:
 * A single connection to stream.binance.com 
 * is only valid for 24 hours; expect to be 
 * disconnected at the 24 hour mark
 */

// Require dependencies
const binance = require('node-binance-api')();
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const figlet = require('figlet');

const log = console.log;

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

        // Keep track of event time
        log(chalk.magenta("Update id: ") + updateId, chalk.magenta("\nEvent time: ") + eventTime);

        // Save event time & update id to txt
        fs.appendFile(`data/${lowCurrency}/${lowCurrency}-md-t.txt`, "\ntime:"+eventTime+"\nid:"+updateId, 'utf-8', 
            function(err) {
                if(err) {
                    return  log(chalk.red(err));
                }
        
                log(chalk.green(`${currency} time & id saved!`));
            });

        // Check if ask aarray is empty
        if (askDepth.length === 0) {
            log(chalk.magenta("ask: ") + chalk.red("EMPTY"));
        } else {
            log(chalk.magenta("ask: ") + askDepth);
        }

        // Write ask on txt
        fs.appendFile(`data/${lowCurrency}/${lowCurrency}-md-a.txt`, util.inspect(askDepth, { compact: false}), 'utf-8', 
            function(err) {
                if(err) {
                    return  log(chalk.red(err));
                }
        
                log(chalk.green(`${currency} ask saved!`));
            });

        // Check if bid aarray is empty
        if (bidDepth.length === 0) {
            log(chalk.magenta("bid: ") + chalk.red("EMPTY"));
        } else {
            log(chalk.magenta("bid: ") + bidDepth);
        }

        // Write bid on txt
        fs.appendFile(`data/${lowCurrency}/${lowCurrency}-md-b.txt`, util.inspect(bidDepth, { compact: false}), 'utf-8', 
            function(err) {
                if(err) {
                    return  log(chalk.red(err));
                }
            
                log(chalk.green(`${currency} bid saved!`));
            });
    });
}

// Start connections
wsConnection('BTCUSDT');
wsConnection('ETHBTC');
wsConnection('ETHUSDT');




