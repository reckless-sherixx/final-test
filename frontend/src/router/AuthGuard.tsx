import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const AuthGuard = ({ children } : { children: React.ReactNode }) => {
  const { isLoggedIn } = useSelector((state:any) => state.auth);
  const location = useLocation();

  if (isLoggedIn) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AuthGuard;