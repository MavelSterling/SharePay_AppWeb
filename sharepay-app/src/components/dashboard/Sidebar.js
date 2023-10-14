import React from 'react';
import logo from '../../assets/Logo.png';  // Logo
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div style={{ backgroundColor: '#ADD8E6', width: '250px', minHeight: '100vh' }}>
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <img src={logo} alt="SharePay Logo" width={100} />
                <h2>SharePay App</h2>
            </div>
            <ul>
                <li><Link to="/user-information">Información del usuario</Link></li>
                <li><Link to="/events">Eventos</Link></li>
                <li><Link to="/payments">Pagos</Link></li>
                <li><Link to="/contacts">Contactos</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;
