import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = () => {
  const [stops, setStops] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStops();
  }, []);

  const fetchStops = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/stops');
      if (!response.ok) {
        throw new Error('Failed to fetch stops');
      }
      const data = await response.json();
      setStops(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStopSelect = (stop) => {
    if (selectedStops.length < 2) {
      setSelectedStops([...selectedStops, stop]);
    }
  };

  const handleStopDeselect = (stop) => {
    setSelectedStops(selectedStops.filter(s => s.id !== stop.id));
    setRoute(null);
  };

  const createRoute = async () => {
    if (selectedStops.length !== 2) {
      setError('Please select exactly 2 stops');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/route/${selectedStops[0].id}/${selectedStops[1].id}`);
      if (!response.ok) {
        throw new Error('Failed to create route');
      }
      const data = await response.json();
      setRoute(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerIcon = (stop) => {
    const isSelected = selectedStops.some(s => s.id === stop.id);
    const isStart = selectedStops[0]?.id === stop.id;
    const isEnd = selectedStops[1]?.id === stop.id;

    return L.divIcon({
      className: `custom-marker ${isSelected ? (isStart ? 'start-marker' : 'end-marker') : ''}`,
      html: `<div class="marker-content">${stop.name}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  };

  if (loading) {
    return <div className="loading">Loading stops...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="map-container">
      <div className="controls">
        <button
          className="create-route-btn"
          onClick={createRoute}
          disabled={selectedStops.length !== 2 || loading}
        >
          {loading ? 'Creating Route...' : 'Create Route'}
        </button>
        <div className="stops-list">
          <h3>Select Stops (max 2)</h3>
          {stops && stops.map(stop => (
            <button
              key={stop.id}
              className={`select-stop-btn ${selectedStops.some(s => s.id === stop.id) ? 'selected' : ''}`}
              onClick={() => selectedStops.some(s => s.id === stop.id) ? handleStopDeselect(stop) : handleStopSelect(stop)}
            >
              {stop.name}
              {stop.routes && (
                <div className="route-badges">
                  {stop.routes.map(route => (
                    <span key={route} className="route-badge">{route}</span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
        {error && <div className="error">{error}</div>}
        {route && (
          <div className="route-report">
            <h3>Route Report</h3>
            <div className="route-summary">
              <p><strong>Total Duration:</strong> {route.duration} minutes</p>
              <p><strong>Total Distance:</strong> {route.distance} km</p>
              <p><strong>Transfers:</strong> {route.transfers}</p>
              <p><strong>Next Departure:</strong> {route.nextDeparture}</p>
            </div>
            <div className="route-details">
              <h4>Bus Routes:</h4>
              {route.busRoutes.map((busRoute, index) => (
                <div key={index} className="bus-route">
                  <p><strong>Bus {busRoute.number}</strong></p>
                  <p>Duration: {busRoute.duration} minutes</p>
                  <p>Distance: {busRoute.distance} km</p>
                </div>
              ))}
            </div>
            <div className="route-stops">
              <h4>Stops:</h4>
              <ol>
                {route.stops.map((stop, index) => (
                  <li
                    key={index}
                    className={index === 0 ? 'start-stop' : index === route.stops.length - 1 ? 'end-stop' : ''}
                  >
                    {stop.name}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
      <MapContainer
        center={[35.9375, 14.3754]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {stops && stops.map(stop => (
          <Marker
            key={stop.id}
            position={[stop.latitude, stop.longitude]}
            icon={getMarkerIcon(stop)}
          >
            <Popup>
              <div className="stop-popup">
                <h3>{stop.name}</h3>
                <p>{stop.description}</p>
                {stop.routes && (
                  <div className="route-badges">
                    {stop.routes.map(route => (
                      <span key={route} className="route-badge">{route}</span>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {route && (
          <>
            {route.path.map((segment, index) => (
              <Polyline
                key={index}
                positions={segment.map(point => [point.latitude, point.longitude])}
                color="#2196f3"
                weight={3}
                opacity={0.7}
              />
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default Map; 