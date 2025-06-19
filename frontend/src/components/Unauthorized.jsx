import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized">
      <h2>Unauthorized Access</h2>
      <p>You don't have permission to view this page.</p>
      <button onClick={() => navigate('/')}>Return to Home</button>
    </div>
  );
};

export default Unauthorized;