import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Scriptorium from './components/Scriptorium';
import Sanctum from './components/Sanctum';

function App() {
  // This state monitors which page is active: 'landing', 'weaver', or 'scholar'
  const [currentPage, setCurrentPage] = useState('landing');

  if (currentPage === 'weaver') {
    return <Scriptorium onBack={() => setCurrentPage('landing')} />;
  }

  if (currentPage === 'scholar') {
    return <Sanctum onBack={() => setCurrentPage('landing')} />;
  }

  // If none of the interiors match, show the main Landing Page
  return (
    <LandingPage 
      onSelectWeaver={() => setCurrentPage('weaver')} 
      onSelectScholar={() => setCurrentPage('scholar')} 
    />
  );
}

export default App;