import React from 'react';
import { AuthProvider } from './authContext';
import ProjectRoutes from './routes';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <ProjectRoutes />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;