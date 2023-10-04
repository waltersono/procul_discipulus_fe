import React, { useContext } from "react";
import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";
import { AuthContext } from '../contexts/auth';
import { LayoutProvider } from '../contexts/layout';


const Router = () => {
  const { authenticated } = useContext(AuthContext);
  return authenticated ? <LayoutProvider><AppRoutes /></LayoutProvider> : <AuthRoutes />
};

export default Router;