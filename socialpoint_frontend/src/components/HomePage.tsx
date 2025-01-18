import React from 'react';
import Header from './Header'; // Import your Header component
import WelcomePage from './WelcomePage'; // Import your WelcomePage component

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <WelcomePage />
    </>
  );
};

export default HomePage;
