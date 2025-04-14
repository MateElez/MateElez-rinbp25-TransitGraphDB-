import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StopList.css';

const StopList = ({ onStopSelect, selectedStops, isSecondSelected }) => {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/stops');
        // Filter out empty or invalid stops
        const validStops = response.data.filter(stop => 
          stop.name && 
          stop.name.trim() !== '' && 
          stop.route_id
        );
        setStops(validStops);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch stops');
        setLoading(false);
      }
    };

    fetchStops();
  }, []);

  const handleStopClick = (stop) => {
    onStopSelect(stop);
  };

  const isStopSelected = (stop) => {
    return selectedStops.some(selected => selected.route_id === stop.route_id);
  };

  const getStopClassName = (stop) => {
    if (isStopSelected(stop)) return 'stop-card selected';
    if (selectedStops.length === 2 && !isStopSelected(stop)) return 'stop-card disabled';
    return 'stop-card';
  };

  if (loading) return <div className="stop-list loading">Loading stops...</div>;
  if (error) return <div className="stop-list error">Error: {error}</div>;

  return (
    <div className="stop-list">
      <div className="stop-list-header">
        <h2>Bus Stops</h2>
      </div>

      <div className="selected-stops-summary">
        <h3>Selected Stops ({selectedStops.length}/2)</h3>
        <div className="selected-stops-list">
          {selectedStops.map((stop, index) => (
            <div key={stop.route_id} className="selected-stop-item">
              <span>
                {index === 0 ? 'From: ' : 'To: '}{stop.name}
              </span>
              <button 
                onClick={() => onStopSelect(stop)} 
                className="remove-stop"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="stops-container">
        {stops.map(stop => (
          <div
            key={stop.route_id}
            className={getStopClassName(stop)}
            onClick={() => selectedStops.length < 2 || isStopSelected(stop) ? handleStopClick(stop) : null}
          >
            <h3>{stop.name}</h3>
            <p className="stop-type">{stop.type}</p>
            {stop.operator && <p className="stop-operator">Operator: {stop.operator}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StopList;