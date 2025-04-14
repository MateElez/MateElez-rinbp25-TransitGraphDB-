# Public Transportation Planning Tool

## Features

- **MongoDB**: Stores transit schedules and stops.
- **Neo4j**: Analyzes and optimizes routes.
- **Shortest Path & TSP**: Computes the best travel routes.
- **REST API**: Fetch schedules and route information.

## Architecture

The system consists of:
- **MongoDB**: NoSQL database for transit schedules.
- **Neo4j**: Graph database for route calculations.
- **Backend (Node.js)**: Handles API requests and logic.
- **Frontend (React)**: Simple UI for trip planning.

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18.16.0 recommended)
- npm (v9 or higher)
- MongoDB (v4.4 or higher)
- Neo4j (v4.4 or higher)
- Neo4j APOC Plugin (required for advanced graph operations)

### Neo4j Setup
1. Install Neo4j Desktop from https://neo4j.com/download/
2. Create a new database
3. Install APOC Plugin:
   - In Neo4j Desktop, click on your project
   - Click on the three dots on your database
   - Select 'Manage'
   - Click on 'Plugins'
   - Install 'APOC'
4. Start the database

## Required Dependencies

### Backend
- Express.js
- Mongoose for MongoDB
- Neo4j Driver
- CORS
- dotenv

### Frontend
- React 18
- React Leaflet for mapping
- Axios for API requests

## Getting Started

### 1. Clone the Repository
```bash
git clone <https://github.com/MateElez/MateElez-rinbp25-TransitGraphDB-.git>
cd TransitGraphDB
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create a .env file with your database configurations
# Example .env content:
# MONGODB_URI=mongodb://localhost:27017/transitdb
# NEO4J_URI=neo4j://localhost:7687
# NEO4J_USER=neo4j
# NEO4J_PASSWORD=your_password
# PORT=8000

# Start the backend server
npm start
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Environment Setup

### Backend (.env file)
Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/transitdb
NEO4J_URI=neo4j://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
PORT=8000
```

### Frontend
The frontend will automatically connect to the backend at `http://localhost:8000`. If you need to change this, update the API base URL in the frontend configuration.

## Development

To start the application in development mode:

1. Start MongoDB and Neo4j services
2. Start the backend server: `cd backend && npm start`
3. In a new terminal, start the frontend: `cd frontend && npm start`

## Key Capabilities

- **Route Optimization**: Finds shortest paths and optimal routes.
- **Transit Schedule Management**: Stores and retrieves schedules.
- **Graph Algorithms**: Uses shortest path and TSP for routing.
- **API Accessibility**: Exposes RESTful endpoints.

## Security

- **Database Security**: Uses authentication and role-based access.
- **API Protection**: Implements rate limiting and input validation.
- **Data Encryption**: Encrypts sensitive transit data.

## Troubleshooting

If you encounter any issues:

1. Ensure all prerequisites are installed correctly
2. Check if MongoDB and Neo4j services are running
3. Verify your .env configuration
4. Check if all dependencies are installed (run `npm install` again)
5. Clear npm cache: `npm cache clean --force`

## License

Coming soon!

