import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Ping your backend to see if the HTTP-only cookie is valid
        const response = await fetch('https://dashboard-backend-2-a1qg.onrender.com/check', {
          credentials: 'include', // Must send the cookie!
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Show nothing (or a full-page spinner) while checking
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Verifying session...</div>
      </div>
    );
  }

  // If they are NOT logged in, kick them back to the login page
  if (isAuthenticated === false) {
    return <Navigate to="/" replace />;
  }

  // If they ARE logged in, render the protected component (like Dashboard)
  return children;
};

export default ProtectedRoute;