import React from 'react';
import '../App.css';


const NavBar = () => {

    const handleLogout = () => {
        // Aquí puedes agregar la lógica para cerrar sesión, como:
        // - Llamar a una API para cerrar sesión
        // - Limpiar tokens o información de usuario del localStorage o context
        // - Redirigir al usuario a la página de inicio o de inicio de sesión
        console.log('Usuario ha cerrado sesión');
    }

    return (
        <div className="navbar">
            <button onClick={handleLogout} className="logoutButton">Cerrar Sesión</button>
        </div>
    )
}

export default NavBar;
