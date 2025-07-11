import React, { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import DepartmentDashboard from '../components/DepartmentDashboard';
import Unauthorized from '../components/Unauthorized';
import { useComplaintContext } from '../context/ComplaintContext';

const DepartmentView = () => {

  const {complaints , setComplaint} = useComplaintContext()

  useEffect(()=>{
    
  })
  // const { user } = useAuthContext();

  // if (!user || user.type !== 'department') {
  //   return <Unauthorized />;
  // }

  return (
    <div className="department-view">
      <DepartmentDashboard initialComplaints={complaints} />
    </div>
  );
};

export default DepartmentView;