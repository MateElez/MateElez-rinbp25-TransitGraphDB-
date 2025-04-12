const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['bus', 'tram', 'train'],
        required: true
    },
    route: {
        type: String,
        ref: 'Route'
    },
    currentStop: {
        type: String,
        ref: 'Stop'
    },
    nextStop: {
        type: String,
        ref: 'Stop'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    status: {
        type: String,
        enum: ['in_service', 'maintenance', 'out_of_service'],
        default: 'in_service'
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    }
});

vehicleSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Vehicle', vehicleSchema); 