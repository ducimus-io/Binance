const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MarketDepthSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    numA: {
        type: String,
        required: true
    },
    numB: {
        type: String,
        required: true
    },
    asks: [
        {
            price: {
                type: String,
                required: true
            },
            quantity: {
                type: String,
                required: true
            },
        }
    ],
    bids: [
        {
            price: {
                type: String,
                required: true
            },
            quantity: {
                type: String,
                required: true
            },
        }
    ],
});

module.exports = MarketDepth = mongoose.model('marketDepth', MarketDepthSchema);