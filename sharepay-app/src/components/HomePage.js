import React from 'react';
import logo from '../assets/Logo.png';  // Logo
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div style={{ 
            backgroundColor: '#ADD8E6', 
            minHeight: '100vh', 
            padding: '50px 0', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
        }}>
            {/* Contenido centralizado */}
            <div style={{ 
                textAlign: 'center', 
                margin: '0 auto', 
                maxWidth: '90%', 
                padding: '0 5%'  // Padding horizontal
            }}>
                <img 
                    src={logo} 
                    alt="SharePay Logo" 
                    width="80%"  // Usar porcentaje para adaptabilidad
                    className="rotating-logo" 
                    style={{ marginBottom: '40px' }} 
                />
                <h1 style={{ fontSize: '1.5rem' }}>Bienvenidos a SharePay App</h1>
            </div>

            {/* Cabecera: Opciones */}
            <div style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '20px',  // Disminuir espacio de margen derecho
                display: 'flex', 
                flexDirection: 'column',  // Cambiar dirección a columna para visualización vertical
                gap: '20px' 
            }}>
                <Link 
                    to="/login" 
                    style={{ textDecoration: 'none', color: '#003366', fontSize: '1rem' }}  // Reducir tamaño de fuente
                >
                    Iniciar sesión
                </Link>
                <Link 
                    to="/register" 
                    style={{ textDecoration: 'none', color: '#003366', fontSize: '1rem' }}  // Reducir tamaño de fuente
                >
                    Registrarse
                </Link>
            </div>
            
            {/* Para agregar más imágenes o contenido aquí */}
        </div>
    );
}

export default HomePage;
