const express = require('express');
const router = express.Router();
const routeService = require('../services/routeService');

// Get all routes
router.get('/', async (req, res) => {
    try {
        const routes = await routeService.getAllRoutes();
        res.json(routes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get route by ID
router.get('/:id', async (req, res) => {
    try {
        const route = await routeService.getRouteById(req.params.id);
        res.json(route);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Create new route
router.post('/', async (req, res) => {
    try {
        const route = await routeService.createRoute(req.body);
        res.status(201).json(route);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update route
router.put('/:id', async (req, res) => {
    try {
        const route = await routeService.updateRoute(req.params.id, req.body);
        res.json(route);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Delete route
router.delete('/:id', async (req, res) => {
    try {
        await routeService.deleteRoute(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST /api/routes/shortest
router.post('/shortest', async (req, res) => {
    const { start_stop_id, end_stop_id } = req.body;
    if (!start_stop_id || !end_stop_id) {
        return res.status(400).json({ error: 'start_stop_id and end_stop_id are required' });
    }
    try {
        const path = await routeService.findShortestPath(start_stop_id, end_stop_id);
        res.json(path);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get active routes
router.get('/status/active', async (req, res) => {
    try {
        const routes = await routeService.getActiveRoutes();
        res.json(routes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;