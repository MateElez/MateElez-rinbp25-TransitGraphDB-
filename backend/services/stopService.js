const stopRepository = require('../repositories/stopRepository');

class StopService {
    async getAllStops() {
        const stops = await stopRepository.findAll();
        return stops.map(stop => ({
            ...stop,
            stop_lat: parseFloat(stop.stop_lat),
            stop_lon: parseFloat(stop.stop_lon)
        }));
    }

    async getStopById(stopId) {
        const stop = await stopRepository.findById(stopId);
        if (!stop) {
            throw new Error('Stop not found');
        }
        return {
            ...stop,
            stop_lat: parseFloat(stop.stop_lat),
            stop_lon: parseFloat(stop.stop_lon)
        };
    }
}

module.exports = new StopService();