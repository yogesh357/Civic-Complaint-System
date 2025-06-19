import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackComplaint from './pages/TrackComplaint';
import DepartmentView from './pages/DepartmentView';
import Auth from './components/Auth';
import { AuthProvider } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
// import './assets/styles/App.css';
import './App.css'
import Login from './components/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ComplaintProvider>
          <div className="App">
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/submit-complaint" element={<SubmitComplaint />} />
                <Route path="/track-complaint" element={<TrackComplaint />} />
                <Route path="/department" element={<DepartmentView />} />
                {/* <Route path="/login" element={<Auth mode="login" />} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Auth mode="register" />} />
              </Routes>
            </div>
          </div>
        </ComplaintProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;