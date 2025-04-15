import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StopList.css';

const StopList = ({ onStopSelect, selectedStops = [], onCreateRoute, isLoading }) => {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/stops');
        if (response.data && Array.isArray(response.data)) {
          setStops(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stops:', err);
        setFetchError(err.message);
        setLoading(false);
      }
    };

    fetchStops();
  }, []);

  const filteredStops = stops.filter(stop =>
    stop.stop_name && stop.stop_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="stop-list loading">Loading stops...</div>;
  if (fetchError) return <div className="stop-list error">Error: {fetchError}</div>;

  return (
    <div className="stop-list">
      <div className="stop-list-header">
        <h2>Manhattan Stops</h2>
        <input
          type="text"
          placeholder="Search stops..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="stops-container">
        {filteredStops.map((stop) => (
          <div
            key={stop._id}
            className={`stop-card${selectedStops.some(s => s.stop_id === stop.stop_id) ? ' selected' : ''}`}
            onClick={() => onStopSelect(stop)}
          >
            <h3>{stop.stop_name || 'No name available'}</h3>
          </div>
        ))}
      </div>

      <div className="route-controls">
        <button 
          onClick={onCreateRoute} 
          disabled={selectedStops.length !== 2 || isLoading} 
          className="create-route-btn"
        >
          {isLoading ? 'Creating Route...' : 'Create Route'}
        </button>
      </div>
    </div>
  );
};

export default StopList;