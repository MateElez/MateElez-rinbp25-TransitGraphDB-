const Stop = require('../models/Stop');

class StopRepository {
    async findAll() {
        return await Stop.find().lean();
    }

    async findById(stopId) {
        return await Stop.findOne({ stop_id: stopId }).lean();
    }

    async create(stopData) {
        const stop = new Stop(stopData);
        return await stop.save();
    }

    async update(stopId, stopData) {
        return await Stop.findOneAndUpdate(
            { stop_id: stopId }, 
            stopData, 
            { new: true }
        ).lean();
    }

    async delete(stopId) {
        return await Stop.findOneAndDelete({ stop_id: stopId });
    }
}

module.exports = new StopRepository();