const binance = require('node-binance-api')();

// Bring in QuoteCrypto model
const QuoteCrypto = require('../models/QuoteCrypto');

// Get Quotes prices to USD
function quotePrices() { 

    binance.prices('BTCUSDT', (error, ticker) => {
        console.log("Price of BTC: ", ticker.BTCUSDT);

            // Create new mongoose model
            const newQuoteCrypto = new QuoteCrypto({
                name: 'BTCUSDT',
                price: ticker.BTCUSDT
            });

            // Save model to mongoDB
            newQuoteCrypto.save().then(quoteCrypto => quoteCrypto);
    });
    binance.prices('ETHUSDT', (error, ticker) => {
        console.log("Price of ETH: ", ticker.ETHUSDT);

        // Create new mongoose model
        const newQuoteCrypto = new QuoteCrypto({
            name: 'ETHUSDT',
            price: ticker.ETHUSDT
        });

        // Save model to mongoDB
        newQuoteCrypto.save().then(quoteCrypto => quoteCrypto);
    });

}

module.exports = quotePrices;