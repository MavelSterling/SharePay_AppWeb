import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import NotificationModal from './NotificationModal'; // Importa el nuevo componente

const NavBar = () => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [showNoMessages, setShowNoMessages] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showSesionActiva, setShowSesionActiva] = useState('');

  const usuario_Activo = localStorage.getItem('username');

  const [isNavBarFixed, setIsNavBarFixed] = useState(false);

  const handleAcceptInvitation = async (invitation) => {
    // Lógica para aceptar la invitación
    try {
      await createActivityInEvents(invitation);
      setInvitations(invitations.filter((inv) => inv !== invitation));
    } catch (error) {
      console.error('Error al aceptar la invitación:', error);
    }
  };

  const createActivityInEvents = async (invitation) => {
    // Lógica para llamar a la función createActivity en Events.js
    // ...

    // Ejemplo básico:
    const response = await axios.post(`URL_de_tu_API/events/${invitation.eventId}/activities`, {
      name: 'Nombre de la actividad',
      value: 0,
      participants: [],
      description: 'Descripción de la actividad',
    });

    console.log('Actividad creada en Events.js:', response.data);
  };

  const handleBellClick = () => {
    if (invitations.length === 0) {
      setShowNoMessages(true);
      setShowNotificationModal(true); // Mostrar el modal al hacer clic en el icono de la campana
    }
  };

  const handleLogout = () => {

    localStorage.clear()
    console.log('Usuario ha cerrado sesión');
    navigate('/');
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      // You can adjust the offset value based on your layout and styling
      setIsNavBarFixed(offset > 100); // Set to true when the user scrolls down 100 pixels
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`navbar ${isNavBarFixed ? 'fixed' : ''}`}>
      <div className="notification-container">
        <FaBell size={20} onClick={handleBellClick} />
        {invitations.length > 0 && <span className="notification-badge">{invitations.length}</span>}
        {showNoMessages && !showNotificationModal && <p> </p>}
        {invitations.map((notification, index) => (
          <div key={index} className="notification">
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


      {/* Renderiza el modal solo cuando showNotificationModal es true */}
      {showNotificationModal && (
        <NotificationModal onClose={closeNotificationModal} message="No hay mensajes nuevos" />
      )}
      {usuario_Activo && <p>Bienvenido {usuario_Activo}</p>}
      <div>
        <button onClick={handleLogout} className="logoutButton">Cerrar Sesión</button>
      </div>
    </div>
  );
  
};

export default NavBar;
