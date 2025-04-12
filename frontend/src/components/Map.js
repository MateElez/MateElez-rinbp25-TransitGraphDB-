import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = ({ selectedStops }) => {
    return (
        <div className="map-container">
            <MapContainer 
                center={[35.8969, 14.5125]} // Center of Malta
                zoom={11}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {selectedStops.map((stop, index) => (
                    stop.geometry && (
                        <Marker
                            key={stop.route_id}
                            position={[stop.geometry.coordinates[1], stop.geometry.coordinates[0]]}
                        >
                            <Popup>
                                <div className="stop-popup">
                                    <h3>{stop.name}</h3>
                                    <p>Stop {index + 1}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
};

export default Map;