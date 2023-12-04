// DashboardWrapper.js

import React from 'react';
import NavBar from './Navbar';
import { Outlet } from 'react-router-dom';

const DashboardWrapper = () => {
    var respuesta = null;
  
    if (localStorage.getItem('userToken') == null) {
      respuesta = (
        <div style={{ display: 'flex' }}>
          Usted no tiene permisos para ver esta página, por favor inicie sesión.
        </div>
      );
    } else {
      respuesta = (
        <div style={{ overflowX: 'hidden' }}>
          <NavBar style={{ position: 'sticky', top: 0, zIndex: 1000 }} />
          <div className="dashboard-content">
            <Outlet /> {/* Aquí es donde se renderizarán las rutas hijas */}
          </div>
        </div>
      );
    }
  
    return respuesta;
  };
  
      

export default DashboardWrapper;

