const stopRepository = require('../repositories/stopRepository');
const routeRepository = require('../repositories/routeRepository');

class StopService {
    async getAllStops() {
        return await stopRepository.findAll();
    }

    async getStopById(id) {
        const stop = await stopRepository.findById(id);
        if (!stop) {
            throw new Error('Stop not found');
        }
        return stop;
    }

    async createStop(stopData) {
        // Validate coordinates
        if (!stopData.location || !stopData.location.coordinates) {
            throw new Error('Stop location coordinates are required');
        }
        return await stopRepository.create(stopData);
    }

    async updateStop(id, stopData) {
        const stop = await stopRepository.update(id, stopData);
        if (!stop) {
            throw new Error('Stop not found');
        }
        return stop;
    }

    async deleteStop(id) {
        // Check if stop is used in any routes
        const routes = await routeRepository.findByStop(id);
        if (routes.length > 0) {
            throw new Error('Cannot delete stop that is used in routes');
        }
        return await stopRepository.delete(id);
    }

    async findNearbyStops(lat, lng, maxDistance = 1000) {
        return await stopRepository.findNearby([lng, lat], maxDistance);
    }

    async getStopsByType(type) {
        if (!['bus', 'tram', 'train'].includes(type)) {
            throw new Error('Invalid stop type');
        }
        return await stopRepository.findByType(type);
    }
}

module.exports = new StopService(); 