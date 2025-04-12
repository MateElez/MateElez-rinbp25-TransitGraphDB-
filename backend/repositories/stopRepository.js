const Stop = require('../models/Stop');

class StopRepository {
    async findAll() {
        return await Stop.find();
    }

    async findById(id) {
        return await Stop.findOne({ id });
    }

    async findByType(type) {
        return await Stop.find({ type });
    }

    async create(stopData) {
        const stop = new Stop(stopData);
        return await stop.save();
    }

    async update(id, stopData) {
        return await Stop.findOneAndUpdate({ id }, stopData, { new: true });
    }

    async delete(id) {
        return await Stop.findOneAndDelete({ id });
    }

    async findNearby(coordinates, maxDistance) {
        return await Stop.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: coordinates
                    },
                    $maxDistance: maxDistance
                }
            }
        });
    }
}

module.exports = new StopRepository(); 