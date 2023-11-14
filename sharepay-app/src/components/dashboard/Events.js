import React, { useState, useEffect } from 'react';
import EventModal from './EventModal';
import EventDetailModal from './EventDetailModal';
import ActivityModal from './ActivityModal'; // Importa el nuevo componente para actividades
import axios from 'axios'; // Para realizar solicitudes a la API de Django.
import Sidebar from './Sidebar';

function Events() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isActivityModalOpen, setActivityModalOpen] = useState(false);


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
      setModalOpen(false); // Cierra el modal de creación de evento.

      fetchEvents(); // Recarga la lista de eventos.
    } catch (error) {
      console.error('Error al crear un evento:', error);
    }
  };

  // Función para crear una nueva actividad.
  const createActivity = async (newActivity) => {
    try {
      await axios.post('URL_de_tu_API/activities', newActivity);
      setActivityModalOpen(false); // Cierra el modal de creación de actividad.
      fetchEvents(); // Recarga la lista de eventos y actividades.
    } catch (error) {
      console.error('Error al crear una actividad:', error);
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
        <button className="button-event" onClick={() => setModalOpen(true)}>
          Nuevo Evento
        </button>
        {isModalOpen && (
            <EventModal
              onClose={() => setModalOpen(false)} // Cierra el modal de eventos
              onSave={createEvent}
            />
          )}

          {isDetailModalOpen && (
            <EventDetailModal
              event={selectedEvent}
              onClose={() => setDetailModalOpen(false)} // Cierra el modal de detalles de eventos
            />
          )}

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
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setDetailModalOpen(true);
                    }}
                  >
                    Ver Evento
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <button className="button-act" onClick={() => setActivityModalOpen(true)}>
            Nueva Actividad
          </button>

          {isActivityModalOpen && (
            <ActivityModal
              onClose={() => setActivityModalOpen(false)} // Cierra el modal de actividades
              onCreate={createActivity}
            />
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th>Nombre de la actividad</th>
              <th>Monto total</th>
              <th>Participantes</th>
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
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setDetailModalOpen(true);
                    }}
                  >
                    Ver Evento
                  </button>
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
