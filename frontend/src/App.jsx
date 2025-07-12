import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackComplaint from './pages/TrackComplaint';
import DepartmentView from './pages/DepartmentView';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { ComplaintProvider, useComplaintContext } from './context/ComplaintContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthModal from './components/AuthModal';

import Test from './components/Test';
import ComplaintList from './components/ComplaintList';
import Footer from './components/Footer'; 
import PrivateRoute from './components/PrivateRoute';
import AllUsers from './pages/AllUsers';

function App() {

  const { showAuthModal } = useAuthContext() 

  return (
    <div className="App">
      
      <Navbar />
      {
        showAuthModal ? <AuthModal /> : null
      }

      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit-complaint" element={<SubmitComplaint />} />
          <Route path="/track-complaint" element={<TrackComplaint />} />
          <Route path="/department" element={<DepartmentView />} />
          <Route path="/test" element={<Test />} />
          <Route path="/my-complaint" element={<ComplaintList  />} />
          <Route path="/all-users" element={<AllUsers  />} />

      
        </Routes>


        {/* <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/track-complaint" element={<TrackComplaint />} />


          <Route path="/" element={<HomePage />} />

          {/* USER routes */}
          {/* <Route path="/submit-complaint" element={
            <PrivateRoute allowedRoles={['USER']}>
              <SubmitComplaint />
            </PrivateRoute>
          } />

          <Route path="/my-complaint" element={
            <PrivateRoute allowedRoles={['USER']}>
              <ComplaintList />
            </PrivateRoute>
          } /> */}

          {/* ADMIN routes */}
          {/* <Route path="/department" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <DepartmentView />
            </PrivateRoute>
          } />

          <Route path="/user" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <UserCard />
            </PrivateRoute>
          } />
        </Routes> */} 

      </div>
      {/* <UserCard/> */}
      <Footer />
      <ToastContainer />


    </div>
  );
}

export default App;