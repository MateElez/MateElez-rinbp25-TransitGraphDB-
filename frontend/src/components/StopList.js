import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StopList.css';

const StopList = ({ onStopSelect, selectedStops = [] }) => {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/stops');
        if (response.data && Array.isArray(response.data)) {
          // Log first stop for debugging
          console.log('First stop:', response.data[0]);
          setStops(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stops:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStops();
  }, []);

  if (loading) return <div className="stop-list loading">Loading stops...</div>;
  if (error) return <div className="stop-list error">Error: {error}</div>;

  return (
    <div className="stop-list">
      <div className="stop-list-header">
        <h2>Manhattan Bus Stops ({stops.length})</h2>
      </div>

      <div className="stops-container">
        {stops.map((stop) => (
          <div
            key={stop._id}
            className="stop-card"
            onClick={() => onStopSelect(stop)}
          >
            <h3>{stop.stop_name || 'No name available'}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StopList;