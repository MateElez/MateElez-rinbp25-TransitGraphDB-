const Vehicle = require('../models/Vehicle');

class VehicleRepository {
    async findAll() {
        return await Vehicle.find();
    }

    async findById(id) {
        return await Vehicle.findOne({ id });
    }

    async findByType(type) {
        return await Vehicle.find({ type });
    }

    async create(vehicleData) {
        const vehicle = new Vehicle(vehicleData);
        return await vehicle.save();
    }

    async update(id, vehicleData) {
        return await Vehicle.findOneAndUpdate({ id }, vehicleData, { new: true });
    }

    async delete(id) {
        return await Vehicle.findOneAndDelete({ id });
    }

    async findByRoute(routeId) {
        return await Vehicle.find({ route: routeId });
    }

    async findInService() {
        return await Vehicle.find({ status: 'in_service' });
    }

    async findNearby(coordinates, maxDistance) {
        return await Vehicle.find({
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

module.exports = new VehicleRepository(); 