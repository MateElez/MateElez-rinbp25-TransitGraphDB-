const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    stop_id: {
        type: String,
        required: true,
        ref: 'Stop'
    },
    route_id: {
        type: String,
        required: true
    },
    arrival_time: {
        type: String,
        required: true
    },
    departure_time: {
        type: String,
        required: true
    },
    day_type: {
        type: String,
        required: true,
        enum: ['weekday', 'saturday', 'sunday']
    }
});

module.exports = mongoose.model('Schedule', scheduleSchema); 