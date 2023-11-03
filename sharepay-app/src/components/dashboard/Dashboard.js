import React from 'react';
import Sidebar from './Sidebar';
import NavBar from '../Navbar';

function Dashboard() {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <NavBar />
            {/* Contenido principal */}
            <div style={{ flex: 1, padding: '20px' }}>
                {/* Aquí irá el contenido dinámico basado en la opción seleccionada en la barra lateral */}
            </div>
        </div>
    );
}

export default Dashboard;
