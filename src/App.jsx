import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Layout from './components/layout';
import DetailView from './components/detailview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index={true} element={<Dashboard />} />
          {/* Add a route that captures dynamic URLs */}
          <Route
            path=":animalName" // :animalName is a route parameter
            element={<DetailView />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
