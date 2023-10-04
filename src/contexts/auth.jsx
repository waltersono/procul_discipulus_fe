import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("@techworks-Token");
        const storedUser = localStorage.getItem("@techworks-User");

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
            api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }else{
            //window.location.href="/login";
        }

    }, []);
    
    async function signIn(data) {
        const {user, access_token} = data;
        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        localStorage.setItem("@techworks-User", JSON.stringify(user));
        localStorage.setItem("@techworks-Token", access_token);
        setUser(user);
    }

    function signOut() {
        localStorage.removeItem("@techworks-User");
        localStorage.removeItem("@techworks-Token");
        setUser(null);
    }
    
    return (
        <AuthContext.Provider
            value={{ authenticated: !!user, user, signIn, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext,AuthProvider }