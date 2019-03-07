const binance = require('node-binance-api')();

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
                    console.log(prevDay.quoteVolume);
                });

            } else if((allSymbols[s].substr(allSymbols[s].length - 3)) === "ETH") {
                
                // Get symbol's volume
                binance.prevDay(allSymbols[s], (error, prevDay, symbol) => {
                    console.log(prevDay.quoteVolume);
                });
                
            }
        } 

        //console.log(allSymbols[300]);
    });

}

volumeChecker();



module.exports = volumeChecker;