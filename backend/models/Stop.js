const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    stop_id: {
        type: String,
        required: true
    },
    stop_name: {
        type: String,
        required: true
    },
    stop_lat: {
        type: Number,
        required: true
    },
    stop_lon: {
        type: Number,
        required: true
    },
    location_type: {
        type: Number,
        default: 0
    }
}, {
    collection: 'stops'  // Explicitly set collection name
});

module.exports = mongoose.model('Stop', stopSchema, 'stops');