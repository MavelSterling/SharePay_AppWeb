import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';  // Importar useNavigate

const NavBar = () => {
    const navigate = useNavigate();  // Usa el hook useNavigate

    const handleLogout = () => {
        // Aquí se puede agregar la lógica para cerrar sesión, como:
        // - Llamar a una API para cerrar sesión

        // - Limpiar tokens o información de usuario del localStorage o context
        localStorage.removeItem('CorreoElectronicoActivo');
        
        console.log('Usuario ha cerrado sesión');

        // Redirige al usuario a la página de inicio
        navigate('/');
    }

    return (
        <div className="navbar">
            <button onClick={handleLogout} className="logoutButton">Cerrar Sesión</button>
        </div>
    )
}


export default NavBar;
