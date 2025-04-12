const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
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
    type: {
        type: String,
        enum: ['bus', 'tram', 'train'],
        required: true
    },
    routes: [{
        type: String,
        ref: 'Route'
    }],
    facilities: [{
        type: String,
        enum: ['shelter', 'bench', 'ticket_machine', 'accessibility']
    }],
    status: {
        type: String,
        enum: ['active', 'maintenance', 'closed'],
        default: 'active'
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    }
});

stopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Stop', stopSchema); 