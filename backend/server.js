const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db/mongodb');
const Stop = require('./models/Stop');
const routeController = require('./controllers/routeController');

const app = express();
const port = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Direct route for stops
app.get('/api/stops', async (req, res) => {
    try {
        const stops = await Stop.find({}).lean();
        console.log('Total Manhattan stops found:', stops.length);
        if (stops.length > 0) {
            console.log('Sample Manhattan stop:', JSON.stringify(stops[0], null, 2));
        }
        res.json(stops);
    } catch (error) {
        console.error('Error fetching stops:', error);
        res.status(500).json({ error: error.message });
    }
});

app.use('/api/routes', routeController);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});