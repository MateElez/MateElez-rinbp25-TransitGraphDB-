require('dotenv').config();
const routeRepository = require('../repositories/routeRepository');
const stopRepository = require('../repositories/stopRepository');
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASSWORD || 'password'
    )
);

class RouteService {
    constructor() {
        this.neo4jDriver = neo4j.driver(
            process.env.NEO4J_URI,
            neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
        );
    }

    async getAllRoutes() {
        return await routeRepository.findAll();
    }

    async getRouteById(id) {
        const route = await routeRepository.findById(id);
        if (!route) {
            throw new Error('Route not found');
        }
        return route;
    }

    async createRoute(routeData) {
        // Validate stops exist
        for (const stopData of routeData.stops) {
            const stop = await stopRepository.findById(stopData.stop);
            if (!stop) {
                throw new Error(`Stop ${stopData.stop} not found`);
            }
        }

        const route = await routeRepository.create(routeData);

        // Create Neo4j relationships
        const session = this.neo4jDriver.session();
        try {
            for (let i = 0; i < routeData.stops.length - 1; i++) {
                const fromStop = routeData.stops[i].stop;
                const toStop = routeData.stops[i + 1].stop;
                
                await session.run(`
                    MATCH (from:Stop {id: $fromId})
                    MATCH (to:Stop {id: $toId})
                    MERGE (from)-[r:CONNECTED_TO {route_id: $routeId}]->(to)
                    SET r.distance = $distance
                `, {
                    fromId: fromStop,
                    toId: toStop,
                    routeId: route.id,
                    distance: 1.0 // You might want to calculate actual distance
                });
            }
        } finally {
            await session.close();
        }

        return route;
    }

    async updateRoute(id, routeData) {
        const route = await routeRepository.update(id, routeData);
        if (!route) {
            throw new Error('Route not found');
        }
        return route;
    }

    async deleteRoute(id) {
        // Delete Neo4j relationships first
        const session = this.neo4jDriver.session();
        try {
            await session.run(`
                MATCH ()-[r:CONNECTED_TO {route_id: $routeId}]->()
                DELETE r
            `, { routeId: id });
        } finally {
            await session.close();
        }

        return await routeRepository.delete(id);
    }

    async findShortestPath(startStopId, endStopId) {
        const session = this.neo4jDriver.session();
        try {
            const result = await session.run(`
                MATCH (start:Stop {id: $startId})
                MATCH (end:Stop {id: $endId})
                CALL gds.shortestPath.dijkstra.stream({
                    nodeQuery: 'MATCH (n:Stop) RETURN id(n) as id',
                    relationshipQuery: 'MATCH (n:Stop)-[r:CONNECTED_TO]->(m:Stop) RETURN id(n) as source, id(m) as target, r.distance as weight',
                    sourceNode: id(start),
                    targetNode: id(end)
                })
                YIELD nodeIds, costs
                RETURN [nodeId in nodeIds | gds.util.asNode(nodeId).id] as path,
                       costs[0] as total_distance
            `, { startId: startStopId, endId: endStopId });

            const record = result.records[0];
            if (!record) {
                throw new Error('No route found');
            }

            return {
                path: record.get('path'),
                totalDistance: record.get('total_distance')
            };
        } finally {
            await session.close();
        }
    }

    async findShortestPath(start_stop_id, end_stop_id) {
        const session = driver.session();
        try {
            const cypher = `
                MATCH (start:Stop {stop_id: $start_stop_id}), (end:Stop {stop_id: $end_stop_id})
                MATCH path = shortestPath((start)-[:ROUTE*]-(end))
                RETURN [n IN nodes(path) | n.stop_id] AS stop_ids, length(path) AS hops
            `;
            const result = await session.run(cypher, { start_stop_id, end_stop_id });
            if (result.records.length === 0) {
                throw new Error('No path found between the selected stops.');
            }
            const stop_ids = result.records[0].get('stop_ids');
            return { stop_ids, hops: result.records[0].get('hops') };
        } finally {
            await session.close();
        }
    }

    async getActiveRoutes() {
        return await routeRepository.findActiveRoutes();
    }
}

module.exports = new RouteService();