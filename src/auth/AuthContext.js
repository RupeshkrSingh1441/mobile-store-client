import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log('Decoded JWT:', decoded); // Check for 'name' property
                //setUser(decoded);
                setUser({...decoded, token}); // Store token in user state for future use
            } catch (error) {
                console.error("Invalid token:", error);
                //localStorage.removeItem('token');
                logout(); // Clear invalid token
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        console.log('Decoded JWT:', decoded); // Check for 'name' property
        //setUser(decoded);
        setUser({...decoded, token}); // Store token in user state for future use
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}