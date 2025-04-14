const express = require('express');
const router = express.Router();
const stopService = require('../services/stopService');

// Get all stops
router.get('/', async (req, res) => {
    try {
        const stops = await stopService.getAllStops();
        // Ensure all stops have valid IDs and coordinates
        const validatedStops = stops
            .map(stop => stop.toObject())
            .filter(stop => stop && stop.stop_id && stop.stop_name)
            .map(stop => ({
                ...stop,
                stop_lat: parseFloat(stop.stop_lat),
                stop_lon: parseFloat(stop.stop_lon)
            }));
        res.json(validatedStops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get stop by ID
router.get('/:id', async (req, res) => {
    try {
        const stop = await stopService.getStopById(req.params.id);
        res.json(stop);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Create new stop
router.post('/', async (req, res) => {
    try {
        const stop = await stopService.createStop(req.body);
        res.status(201).json(stop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update stop
router.put('/:id', async (req, res) => {
    try {
        const stop = await stopService.updateStop(req.params.id, req.body);
        res.json(stop);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Delete stop
router.delete('/:id', async (req, res) => {
    try {
        await stopService.deleteStop(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get nearby stops
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, distance } = req.query;
        const stops = await stopService.findNearbyStops(
            parseFloat(lat),
            parseFloat(lng),
            distance ? parseFloat(distance) : undefined
        );
        res.json(stops);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get stops by type
router.get('/type/:type', async (req, res) => {
    try {
        const stops = await stopService.getStopsByType(req.params.type);
        res.json(stops);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;