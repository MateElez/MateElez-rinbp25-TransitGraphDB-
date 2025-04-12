import React, { useState } from 'react';
import Map from './Map';
import StopList from './StopList';
import './RoutePlanner.css';

const RoutePlanner = () => {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="route-planner">
      <div className="tabs">
        <button 
          className={activeTab === 'map' ? 'active' : ''}
          onClick={() => setActiveTab('map')}
        >
          Map View
        </button>
        <button 
          className={activeTab === 'list' ? 'active' : ''}
          onClick={() => setActiveTab('list')}
        >
          List View
        </button>
      </div>
      
      <div className="content">
        {activeTab === 'map' ? <Map /> : <StopList />}
      </div>
    </div>
  );
};

export default RoutePlanner; 