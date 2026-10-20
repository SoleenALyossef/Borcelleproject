import React, { createContext, useContext, useState } from 'react';
import { AdminAPI_Config } from '../Config/AdminAPI-Config';

const AdminAuthContext = createContext();
export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [adminUser, setAdminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('adminUser')) || null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    return fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || 'Login failed');
          });
        }
        return res.json();
      })
      .then((data) => {
      
        const token = data?.data?.token || data?.token;
        const user = data?.data?.user || { email, name: 'Admin' };
        
        if (!token) throw new Error('No token received from server');

        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        setAdminToken(token);
        setAdminUser(user);
        return user;
      });
  };

  const logout = () => {
   
    if (adminToken) {
      fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.LOGOUT}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
      }).catch(() => {});
    }
    
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminToken('');
    setAdminUser(null);
  };

  const isAuthenticated = !!adminToken;

  return (
    <AdminAuthContext.Provider value={{ adminToken, adminUser, login, logout, isAuthenticated }}>
      {children}
    </AdminAuthContext.Provider>
  );
};