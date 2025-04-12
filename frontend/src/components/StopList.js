import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StopList = () => {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/stops');
        setStops(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch stops');
        setLoading(false);
      }
    };

    fetchStops();
  }, []);

  if (loading) return <div>Loading stops...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="stop-list">
      <h2>All Stops</h2>
      <div className="stops-container">
        {stops.map(stop => (
          <div key={stop.id} className="stop-card">
            <h3>{stop.name}</h3>
            <p>Type: {stop.type}</p>
            <p>Facilities: {stop.facilities.join(', ')}</p>
            <p>Status: {stop.status}</p>
            <p>Location: {stop.location.coordinates[1]}, {stop.location.coordinates[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StopList; 