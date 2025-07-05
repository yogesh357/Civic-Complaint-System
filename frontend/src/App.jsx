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
import UserLogin from './components/UserLogin';
import OfficerLogin from './components/OfficerLogin';
//::::::;;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Test from './components/Test';
import LoginOptionsModal from './components/LoginOptionsModal';

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>

        <div className="App">
          {/* <Navbar isAuthenticated={true} /> */}
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/submit-complaint" element={<SubmitComplaint />} />
              <Route path="/track-complaint" element={<TrackComplaint />} />
              <Route path="/department" element={<DepartmentView />} />
              {/* <Route path="/login" element={<Auth mode="login" />} /> */}
              <Route path="/citizen-login" element={<UserLogin />} />
              <Route path="/officer-login" element={<OfficerLogin />} />
              <Route path="/register" element={<Auth mode="register" />} />
              <Route path="/login-options" element={<LoginOptionsModal />} />

              <Route path="/test" element={<Test />} />
            </Routes>
          </div>
        </div>
        {/* <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          /> */}
        <ToastContainer />
      </ComplaintProvider>
    </AuthProvider>
  );
}

export default App;