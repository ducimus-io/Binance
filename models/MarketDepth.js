const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create MarketDepth Schema
const MarketDepthSchema = new Schema({
    name: {
        type: String,
        required: true
    },
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
    asks: {
        type: String,
    },
    bids: {
        type: String,
    }
});

module.exports = MarketDepth = mongoose.model('marketDepth', MarketDepthSchema);