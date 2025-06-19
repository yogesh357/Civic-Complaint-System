import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import DepartmentDashboard from '../components/DepartmentDashboard';
import Unauthorized from '../components/Unauthorized';

const DepartmentView = () => {
  // const { user } = useAuthContext();

  // if (!user || user.type !== 'department') {
  //   return <Unauthorized />;
  // }

  return (
    <div className="department-view">
      <DepartmentDashboard />
    </div>
  );
};

export default DepartmentView;