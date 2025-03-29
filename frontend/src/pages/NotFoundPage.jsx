import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100">
        <h1 className="text-2xl font-bold text-red-500">404 - Page Not Found</h1>
      </div>
    );
  };
  
  export default NotFoundPage;