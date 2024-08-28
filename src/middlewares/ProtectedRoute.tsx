import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// Define the type for the props
interface ProtectedRouteProps {
  children: ReactNode; // Expecting children to be React nodes
}

// Assume you have some kind of authentication check function
const isAuthenticated = (): boolean => {
  // Implement your authentication logic here
  return localStorage.getItem("authToken") !== null;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    // If the user is not authenticated, redirect them to the login page
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the child components
  return <>{children}</>;
};

export default ProtectedRoute;
