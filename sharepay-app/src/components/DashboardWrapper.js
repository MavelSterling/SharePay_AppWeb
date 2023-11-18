// DashboardWrapper.js

import React from 'react';
import NavBar from './Navbar';
import { Outlet } from 'react-router-dom';

const DashboardWrapper = () => {

    var respuesta = null;

    if(localStorage.getItem('userToken') == null){
        respuesta = (
            <div style={{ display: 'flex' }}>usted no tiene permisos para ver esta pagina, por favor inicie sesion</div>
        )
    }else{
        respuesta = (
            <div>
                <NavBar />
                <div className="dashboard-content">
                    <Outlet /> {/* Aquí es donde se renderizarán las rutas hijas */}
                </div>
            </div>
        );
    }


    return(respuesta);
}

export default DashboardWrapper;

