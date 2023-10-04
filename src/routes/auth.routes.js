import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/*Pages*/
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Register from "../pages/auth/Register";

const AuthRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route path="/recover_password" element={<ForgotPassword />} />
            <Route path="/reset_password" element={<ResetPassword />} />
            <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
    </BrowserRouter>
)

export default AuthRoutes;