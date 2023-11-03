// DashboardWrapper.js

import React from 'react';
import NavBar from './Navbar';
import { Outlet } from 'react-router-dom';

const DashboardWrapper = () => {
    return (
        <div>
            <NavBar />
            <div className="dashboard-content">
                <Outlet /> {/* Aquí es donde se renderizarán las rutas hijas */}
            </div>
        </div>
    );
}

export default DashboardWrapper;

