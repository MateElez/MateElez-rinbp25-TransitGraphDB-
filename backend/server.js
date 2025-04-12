const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db/mongodb');
const mongoose = require('mongoose');
const neo4j = require('neo4j-driver');

// Define the schema for stops
const stopSchema = new mongoose.Schema({
    route_id: String,
    name: String,
    operator: String,
    type: String,
    from: String,
    to: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number]
    },
    osm_data: {
        id: String,
        version: String
    },
    timestamp: Date
});

// Create the model
const Stop = mongoose.model('stops', stopSchema);

const app = express();
const port = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/stops', async (req, res) => {
    try {
        const stops = await Stop.find();
        res.json(stops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/stops/:routeId', async (req, res) => {
    try {
        const stop = await Stop.findOne({ route_id: req.params.routeId });
        if (!stop) {
            return res.status(404).json({ error: 'Stop not found' });
        }
        res.json(stop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/stops/nearby', async (req, res) => {
    try {
        const { lat, lng, maxDistance = 1000 } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const stops = await Stop.find({
            geometry: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        });

        res.json(stops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const driver = neo4j.driver('bolt://127.0.0.1:7687', neo4j.auth.basic('neo4j', 'password'));
const session = driver.session();

async function findShortestPath(startId, endId) {
    const result = await session.run(
        'MATCH (start:Stop {id: $startId}), (end:Stop {id: $endId}), ' +
        'p = shortestPath((start)-[:CONNECTED_TO*]->(end)) ' +
        'RETURN p',
        { startId, endId }
    );
    return result.records.map(record => record.get('p'));
}

app.get('/api/routes/shortest', async (req, res) => {
    const { startId, endId } = req.query;
    try {
        const path = await findShortestPath(startId, endId);
        res.json(path);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function syncStopsToNeo4j() {
    try {
        const stops = await Stop.find(); // Preuzmite sve stanice iz MongoDB
        for (const stop of stops) {
            await session.run(`
                CREATE (s:Stop {id: $id, name: $name, operator: $operator, type: $type, from: $from, to: $to})
            `, {
                id: stop.route_id,
                name: stop.name,
                operator: stop.operator,
                type: stop.type,
                from: stop.from,
                to: stop.to
            });
        }
        console.log('All stops synced to Neo4j');
    } catch (error) {
        console.error('Error syncing stops to Neo4j:', error);
    }
}

async function connectStopsInNeo4j(startId, endId) {
    await session.run(`
        MATCH (start:Stop {id: $startId}), (end:Stop {id: $endId})
        CREATE (start)-[:CONNECTED_TO]->(end)
    `, { startId, endId });
}

app.post('/api/connect', async (req, res) => {
    const { startId, endId } = req.body;
    try {
        await connectStopsInNeo4j(startId, endId);
        res.status(200).json({ message: 'Stops connected successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await syncStopsToNeo4j(); // Sinhronizujte stanice sa Neo4j
});