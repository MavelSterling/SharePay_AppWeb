import React from 'react';
import logo from '../assets/Logo.png';  // Logo
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div style={{ backgroundColor: '#ADD8E6', minHeight: '100vh', padding: '50px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            {/* Contenido centralizado */}
            <div style={{ textAlign: 'center', margin: '0 auto', maxWidth: '500px' }}>
                <img src={logo} alt="SharePay Logo" width={300} style={{ marginBottom: '40px' }} />
                <h1>Bienvenidos a SharePay App</h1>
            </div>

            {/* Cabecera: Opciones */}
            <div style={{ position: 'absolute', top: '20px', right: '50px', display: 'flex', gap: '20px' }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    Iniciar sesión
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                    Registrarse
                </Link>
            </div>
            
            {/* Para agregar más imágenes o contenido aquí */}
        </div>
    );
}

export default HomePage;
