const express = require('express');
const router = express.Router();
const vehicleService = require('../services/vehicleService');

// Get all vehicles
router.get('/', async (req, res) => {
    try {
        const vehicles = await vehicleService.getAllVehicles();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get vehicle by ID
router.get('/:id', async (req, res) => {
    try {
        const vehicle = await vehicleService.getVehicleById(req.params.id);
        res.json(vehicle);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Create new vehicle
router.post('/', async (req, res) => {
    try {
        const vehicle = await vehicleService.createVehicle(req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update vehicle
router.put('/:id', async (req, res) => {
    try {
        const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
        res.json(vehicle);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Delete vehicle
router.delete('/:id', async (req, res) => {
    try {
        await vehicleService.deleteVehicle(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update vehicle location
router.put('/:id/location', async (req, res) => {
    try {
        const { coordinates } = req.body;
        const vehicle = await vehicleService.updateVehicleLocation(req.params.id, coordinates);
        res.json(vehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get nearby vehicles
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, distance } = req.query;
        const vehicles = await vehicleService.findNearbyVehicles(
            parseFloat(lat),
            parseFloat(lng),
            distance ? parseFloat(distance) : undefined
        );
        res.json(vehicles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get vehicles by route
router.get('/route/:routeId', async (req, res) => {
    try {
        const vehicles = await vehicleService.getVehiclesByRoute(req.params.routeId);
        res.json(vehicles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get in-service vehicles
router.get('/status/in-service', async (req, res) => {
    try {
        const vehicles = await vehicleService.getInServiceVehicles();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update vehicle status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const vehicle = await vehicleService.updateVehicleStatus(req.params.id, status);
        res.json(vehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 