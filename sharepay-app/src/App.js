// App.js

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Dashboard from './components/dashboard/Dashboard';
import UserInformation from './components/dashboard/UserInformation';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import './App.css';
import Contacts from './components/dashboard/Contacts';
import DashboardWrapper from './components/DashboardWrapper';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardWrapper />}>
            <Route index element={<Dashboard />} />
            <Route path="user-information" element={<UserInformation />} />
            <Route path="contacts" element={<Contacts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
