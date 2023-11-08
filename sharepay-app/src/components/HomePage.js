import React, { useEffect } from 'react';
import logo from '../assets/Logo.png';
import { Link } from 'react-router-dom';

function HomePage() {
    useEffect(() => {
        const bubbleCount = 20;
        const bubbleContainer = document.querySelector('.animated-background');

        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            bubble.style.width = `${Math.random() * 100}px`;
            bubble.style.height = bubble.style.width;
            bubble.style.left = `${Math.random() * 100}vw`;
            bubble.style.animationDuration = `${Math.random() * 2 + 3}s`;
            bubbleContainer.appendChild(bubble);
        }
    }, []);

    return (
        <div className="animated-background elevated-element" style={{ 
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
                padding: '0 5%'
            }}>
                <img 
                    src={logo} 
                    alt="SharePay Logo" 
                    width="50%"
                    class="swinging-logo" 
                    style={{ marginBottom: '30px' }} 
                />
                <h1 style={{ fontSize: '2.5rem' }}>Bienvenidos a SharePay App</h1>
            </div>

            {/* Cabecera: Opciones */}
            <div style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '20px',
                display: 'flex',
                gap: '15px'  // Pequeño espacio entre botones
            }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <button style={{ padding: '10px 15px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Iniciar sesión
                    </button>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                    <button style={{ padding: '10px 15px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Registrarse
                    </button>
                </Link>
            </div>
            
            {/* Para agregar más imágenes o contenido aquí */}
        </div>
    );
}

export default HomePage;
