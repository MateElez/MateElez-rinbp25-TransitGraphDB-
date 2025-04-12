const vehicleRepository = require('../repositories/vehicleRepository');
const routeRepository = require('../repositories/routeRepository');

class VehicleService {
    async getAllVehicles() {
        return await vehicleRepository.findAll();
    }

    async getVehicleById(id) {
        const vehicle = await vehicleRepository.findById(id);
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }
        return vehicle;
    }

    async createVehicle(vehicleData) {
        // Validate route exists if provided
        if (vehicleData.route) {
            const route = await routeRepository.findById(vehicleData.route);
            if (!route) {
                throw new Error('Route not found');
            }
        }

        // Validate location coordinates
        if (!vehicleData.location || !vehicleData.location.coordinates) {
            throw new Error('Vehicle location coordinates are required');
        }

        return await vehicleRepository.create(vehicleData);
    }

    async updateVehicle(id, vehicleData) {
        const vehicle = await vehicleRepository.update(id, vehicleData);
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }
        return vehicle;
    }

    async deleteVehicle(id) {
        return await vehicleRepository.delete(id);
    }

    async updateVehicleLocation(id, coordinates) {
        const vehicle = await vehicleRepository.update(id, {
            location: {
                type: 'Point',
                coordinates: coordinates
            },
            lastUpdate: new Date()
        });

        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        return vehicle;
    }

    async findNearbyVehicles(lat, lng, maxDistance = 1000) {
        return await vehicleRepository.findNearby([lng, lat], maxDistance);
    }

    async getVehiclesByRoute(routeId) {
        return await vehicleRepository.findByRoute(routeId);
    }

    async getInServiceVehicles() {
        return await vehicleRepository.findInService();
    }

    async updateVehicleStatus(id, status) {
        if (!['in_service', 'maintenance', 'out_of_service'].includes(status)) {
            throw new Error('Invalid vehicle status');
        }

        const vehicle = await vehicleRepository.update(id, { status });
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        return vehicle;
    }
}

module.exports = new VehicleService(); 