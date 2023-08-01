const mongoose = require('mongoose');

const csvSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    }
});

const CSV = mongoose.model('CSV', csvSchema);

module.exports = CSV;