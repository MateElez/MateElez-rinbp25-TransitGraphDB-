import React, { useState } from 'react';
import './App.css';
import Map from './components/Map';
import StopList from './components/StopList';

function App() {
  const [selectedStops, setSelectedStops] = useState([]);

  const handleStopSelect = (stop) => {
    setSelectedStops(prevStops => {
      const isAlreadySelected = prevStops.some(s => s.route_id === stop.route_id);
      if (isAlreadySelected) {
        return prevStops.filter(s => s.route_id !== stop.route_id);
      }
      if (prevStops.length >= 2) {
        return prevStops;
      }
      return [...prevStops, stop];
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