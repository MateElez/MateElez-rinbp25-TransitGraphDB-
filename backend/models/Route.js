const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    route_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    operator: {
        type: String
    },
    type: {
        type: String
    },
    from: {
        type: String
    },
    to: {
        type: String
    },
    geometry: {
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
    osm_data: {
        id: String,
        version: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

routeSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('Route', routeSchema); 