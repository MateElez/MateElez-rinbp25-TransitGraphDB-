import React, { useState } from 'react';
import './App.css';
import Map from './components/Map';
import StopList from './components/StopList';

function App() {
  const [selectedStops, setSelectedStops] = useState([]);

  const handleStopSelect = (stop) => {
    // Ako je stanica već odabrana, ukloni je
    if (selectedStops.find(s => s.route_id === stop.route_id)) {
      setSelectedStops(selectedStops.filter(s => s.route_id !== stop.route_id));
    } else if (selectedStops.length < 2) { // Dozvoli odabir samo ako imamo manje od 2 stanice
      setSelectedStops([...selectedStops, stop]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Transit Planner</h2>
        <p className="app-description">Planirajte svoje putovanje javnim prijevozom - odaberite polazište i odredište</p>
      </header>
      <main className="App-content">
        <StopList 
          onStopSelect={handleStopSelect} 
          selectedStops={selectedStops}
          isSecondSelected={selectedStops.length === 2}
        />
        <Map selectedStops={selectedStops} />
      </main>
    </div>
  );
}

export default App;