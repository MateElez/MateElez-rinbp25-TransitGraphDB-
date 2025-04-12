const Route = require('../models/Route');

class RouteRepository {
    async findAll() {
        return await Route.find();
    }

    async findById(id) {
        return await Route.findOne({ id });
    }

    async findByType(type) {
        return await Route.find({ type });
    }

    async create(routeData) {
        const route = new Route(routeData);
        return await route.save();
    }

    async update(id, routeData) {
        return await Route.findOneAndUpdate({ id }, routeData, { new: true });
    }

    async delete(id) {
        return await Route.findOneAndDelete({ id });
    }

    async findByStop(stopId) {
        return await Route.find({
            'stops.stop': stopId
        });
    }

    async findActiveRoutes() {
        return await Route.find({ status: 'active' });
    }
}

module.exports = new RouteRepository(); 