// NavBar.js

import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';

const NavBar = () => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [showNoMessages, setShowNoMessages] = useState(false);
  const [showSesionActiva, setShowSesionActiva] = useState('');

  const usuario_Activo = localStorage.getItem('username');

  const handleAcceptInvitation = async (invitation) => {
    // Lógica para aceptar la invitación (puedes realizar una acción específica aquí)
    console.log(`Invitación de ${invitation.contact} aceptada.`);

    try {
      // Llama a la función en Events.js para crear la actividad
      await createActivityInEvents(invitation);

      // Puedes eliminar la invitación de la lista después de procesarla
      setInvitations(invitations.filter((inv) => inv !== invitation));
    } catch (error) {
      console.error('Error al aceptar la invitación:', error);
      // Maneja los errores según tu necesidad
    }
  };

  const createActivityInEvents = async (invitation) => {
    // Lógica para llamar a la función createActivity en Events.js
    // Puedes usar axios u otra forma de hacer la solicitud a tu API

    // Ejemplo básico:
    const response = await axios.post(
      `URL_de_tu_API/events/${invitation.eventId}/activities`,
      {
        name: 'Nombre de la actividad',
        value: 0,  // Proporciona el valor correcto
        participants: [],  // Proporciona los participantes correctos
        description: 'Descripción de la actividad',
      }
    );

    // Imprime la respuesta (ajusta según la estructura de tu API)
    console.log('Actividad creada en Events.js:', response.data);
  };

  const handleBellClick = () => {
    if (invitations.length === 0) {
      setShowNoMessages(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');

    console.log('Usuario ha cerrado sesión');
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="notification-container">
        <FaBell size={20} onClick={handleBellClick} />
        {invitations.length > 0 && <span className="notification-badge">{invitations.length}</span>}
        {showNoMessages && <p>No hay mensajes nuevos</p>}
        {invitations.map((notification, index) => (
          <div key={index} className="notification">
            {/* Mostrar la notificación solo si es una actividad */}
            {notification.type === 'invitation' && notification.isActivity && (
              <div>
                <p>{`¡Tienes una invitación de ${notification.contact} para una actividad!`}</p>
                <button onClick={() => handleAcceptInvitation(notification)}>Aceptar</button>
                <button>Rechazar</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {usuario_Activo && <p>Bienvenido {usuario_Activo}</p>}
      <div>
        <label>{usuario_Activo}</label>
        <button onClick={handleLogout} className="logoutButton">Cerrar Sesión</button>
      </div>
    </div>
  );
  
};

export default NavBar;
