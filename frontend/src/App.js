import React, { useState } from 'react';
import './App.css';
import Map from './components/Map';
import StopList from './components/StopList';

function App() {
  const [selectedStops, setSelectedStops] = useState([]);

  const handleStopSelect = (stop) => {
    setSelectedStops(prevStops => {
      // Check if stop is already selected
      const isAlreadySelected = prevStops.some(s => s.stop_id === stop.stop_id);
      
      if (isAlreadySelected) {
        // Remove the stop if it's already selected
        const newStops = prevStops.filter(s => s.stop_id !== stop.stop_id);
        return newStops;
      }
      
      // Add new stop
      if (prevStops.length < 2) {
        return [...prevStops, stop];
      }
      
      // If we already have 2 stops, replace the second one
      return [prevStops[0], stop];
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Transit Graph DB</h2>
        <p className="app-description">Plan your route efficiently</p>
      </header>
      <div className="App-content">
        <StopList 
          onStopSelect={handleStopSelect}
          selectedStops={selectedStops}
        />
        <div className="main-content">
          <Map selectedStops={selectedStops} />
        </div>
      </div>
    </div>
  );
}

export default App;