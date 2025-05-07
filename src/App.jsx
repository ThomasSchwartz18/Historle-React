import React from 'react';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="app-container">
      {/* maybe a <Nav /> goes here */}
      <Outlet />
    </div>
  );
}
