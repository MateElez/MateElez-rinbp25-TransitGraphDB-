import React, { useState } from 'react';
import axios from 'axios';
import Map from './Map';
import StopList from './StopList';
import './RoutePlanner.css';

const RoutePlanner = () => {
  const [selectedStops, setSelectedStops] = useState([]);
  const [routePath, setRoutePath] = useState([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState(null);

  const handleStopSelect = (stop) => {
    setSelectedStops(prevStops => {
      const isAlreadySelected = prevStops.some(s => s.stop_id === stop.stop_id);
      
      if (isAlreadySelected) {
        return prevStops.filter(s => s.stop_id !== stop.stop_id);
      }
      
      if (prevStops.length < 2) {
        return [...prevStops, stop];
      }
      
      return [prevStops[0], stop];
    });
  };

  const handleCreateRoute = async () => {
    console.log('handleCreateRoute called with stops:', selectedStops);
    if (selectedStops.length !== 2) return;

    setLoadingRoute(true);
    setRouteError(null);

    try {
      console.log('Sending request with:', {
        start_stop_id: selectedStops[0].stop_id,
        end_stop_id: selectedStops[1].stop_id
      });

      const res = await axios.post('http://localhost:8000/api/routes/shortest', {
        start_stop_id: selectedStops[0].stop_id,
        end_stop_id: selectedStops[1].stop_id
      });

      console.log('Got response:', res.data);
      setRoutePath(res.data.stop_ids || []);
    } catch (err) {
      console.error('Route error:', err);
      setRouteError(err.response?.data?.error || 'Failed to find route');
      setRoutePath([]);
    } finally {
      setLoadingRoute(false);
    }
  };

  return (
    <div className="route-planner">
      <StopList 
        onStopSelect={handleStopSelect}
        selectedStops={selectedStops}
        onCreateRoute={handleCreateRoute}
        isLoading={loadingRoute}
        error={routeError}
      />
      <div className="content">
        <Map selectedStops={selectedStops} routePath={routePath} />
      </div>
    </div>
  );
};

export default RoutePlanner;