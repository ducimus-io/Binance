const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const QuoteCryptoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
});

module.exports = QuoteCrypto = mongoose.model('quoteCrypto', QuoteCryptoSchema);