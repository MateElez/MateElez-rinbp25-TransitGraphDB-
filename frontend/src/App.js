import React from 'react';
import './App.css';
import RoutePlanner from './components/RoutePlanner';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Transit Graph DB</h2>
        <p className="app-description">Plan your route efficiently</p>
      </header>
      <div className="App-content">
        <RoutePlanner />
      </div>
    </div>
  );
}

export default App;