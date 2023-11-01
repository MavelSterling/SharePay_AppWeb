import React, { useState, useEffect } from 'react';
import EventModal from './EventModal';
import EventDetailModal from './EventDetailModal';
import axios from 'axios'; // Para realizar solicitudes a la API de Django.
import Sidebar from './Sidebar';

function Events() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Función para cargar los eventos desde la API de Django.
  const fetchEvents = async () => {
    try {
      const response = await axios.get('URL_de_tu_API/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
    }
  };

  // Función para crear un nuevo evento.
  const createEvent = async (newEvent) => {
    try {
      await axios.post('URL_de_tu_API/events', newEvent);
      setModalOpen(false); // Cierra el modal de creación.
      fetchEvents(); // Recarga la lista de eventos.
    } catch (error) {
      console.error('Error al crear un evento:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []); // Cargar eventos al cargar la página.

  return (
    <div style={{ display: 'flex' }}>
         <Sidebar />
    <div style={{ flex: 1, padding: '20px' }}> 
     
      <h2>Eventos y Actividades</h2>
      <div>
      <button className="button-event"  onClick={() => setModalOpen(true)}>Nuevo Evento</button>

      {isModalOpen && (
        <EventModal
          onClose={() => setModalOpen(false)}
          onSave={createEvent}
        />
      )}
      {isDetailModalOpen && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setDetailModalOpen(false)}
        />
      )}

    </div>

      <h3>Mis eventos</h3>
      <table>
        <thead>
          <tr>
            <th>Creador de Evento</th>
            <th>Fecha</th>
            <th>Nombre del Evento</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.creator}</td>
              <td>{event.date}</td>
              <td>{event.name}</td>
              <td>{event.type}</td>
              <td>
                <button onClick={() => {
                  setSelectedEvent(event);
                  setDetailModalOpen(true);
                }}>Ver Evento</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default Events;
