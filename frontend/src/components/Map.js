import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

// Component to update map view when markers change
function MarkerUpdater({ selectedStops }) {
    const map = useMap();

    useEffect(() => {
        if (selectedStops && selectedStops.length > 0) {
            const validStops = selectedStops.filter(stop => 
                stop && 
                typeof stop.stop_lat === 'number' && 
                typeof stop.stop_lon === 'number' && 
                !isNaN(stop.stop_lat) && 
                !isNaN(stop.stop_lon)
            );
            
            if (validStops.length > 0) {
                const bounds = L.latLngBounds(validStops.map(stop => [stop.stop_lat, stop.stop_lon]));
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [selectedStops, map]);

    return null;
}

const Map = ({ selectedStops, routePath }) => {
    // Validate coordinates before rendering markers
    const validStops = selectedStops?.filter(stop => 
        stop && 
        typeof stop.stop_lat === 'number' && 
        typeof stop.stop_lon === 'number' && 
        !isNaN(stop.stop_lat) && 
        !isNaN(stop.stop_lon)
    ) || [];

    // Find all stops in the route path
    const routeStops = routePath ? routePath.map(stopId => 
        selectedStops.find(stop => stop.stop_id === stopId)
    ).filter(stop => stop) : [];

    // Create route line coordinates if we have route stops
    const routeCoordinates = routeStops.map(stop => [stop.stop_lat, stop.stop_lon]);

    return (
        <div className="map-container">
            <MapContainer 
                center={[40.7831, -73.9712]} // Center of Manhattan
                zoom={12}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MarkerUpdater selectedStops={validStops} />
                
                {validStops.map((stop, index) => (
                    <Marker
                        key={stop.stop_id}
                        position={[stop.stop_lat, stop.stop_lon]}
                    >
                        <Popup>
                            <div className="stop-popup">
                                <h3>{stop.stop_name}</h3>
                                <p>{index === 0 ? 'Start Stop' : 'End Stop'}</p>
                                <p>Stop ID: {stop.stop_id}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {routeCoordinates.length > 1 && (
                    <Polyline 
                        positions={routeCoordinates}
                        color="blue"
                        weight={3}
                        opacity={0.7}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default Map;