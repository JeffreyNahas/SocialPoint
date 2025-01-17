import React from 'react';
import Header from './components/Header';
import WelcomePage from './components/WelcomePage';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <WelcomePage />
    </div>
  );
};

export default App;
