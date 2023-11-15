import React, { useState, useEffect } from 'react';
import EventModal from './EventModal';
import EventDetailModal from './EventDetailModal';
import ActivityModal from './ActivityModal';
import axios from 'axios';
import Sidebar from './Sidebar';

function Events() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isActivityModalOpen, setActivityModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [saveActivity, setSaveActivity] = useState(null);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [activities, setActivities] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('URL_de_tu_API/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
    }
  };

  const fetchActivities = async (eventId) => {
    try {
      const response = await axios.get(`URL_de_tu_API/events/${eventId}/activities`);
      setActivities(response.data);
    } catch (error) {
      console.error('Error al cargar las actividades:', error);
    }
  };

  const createEvent = async (newEvent) => {
    try {
      const response = await axios.post('URL_de_tu_API/events', newEvent);
      setModalOpen(false);
      fetchEvents();
      setSelectedEvent(response.data);
      setSaveActivity(createActivity);
      setAvailableEvents(events);
      // Limpiar actividades al crear un nuevo evento
      setActivities([]);
    } catch (error) {
      console.error('Error al crear un evento:', error);
    }
  };

  const createActivity = async (newActivity, eventId) => {
    try {
      await axios.post(`URL_de_tu_API/events/${eventId}/activities`, newActivity);
      setActivityModalOpen(false);
      // Recargar la lista de actividades después de crear una nueva actividad
      fetchActivities(eventId);
    } catch (error) {
      console.error('Error al crear una actividad:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Cuando se selecciona un evento, cargar las actividades correspondientes
    if (selectedEvent) {
      fetchActivities(selectedEvent.id);
    }
  }, [selectedEvent]);

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

        <h3>Mis eventos</h3>
        <table>
          {/* ... (tu tabla de eventos actual) */}
        </table>

        <div>
          <button className="button-act" onClick={() => setActivityModalOpen(true)}>
            Nueva Actividad
          </button>

          {isActivityModalOpen && (
            <ActivityModal
              onClose={() => setActivityModalOpen(false)}
              onSave={saveActivity}
              selectedEvent={selectedEvent}
              availableEvents={availableEvents}
            />
          )}
        </div>

        {selectedEvent && (
          <div>
            <h3>Actividades del evento "{selectedEvent.name}"</h3>
            <table>
              <thead>
                <tr>
                  <th>Nombre de la actividad</th>
                  <th>Monto total</th>
                  <th>Participantes</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.name}</td>
                    <td>{activity.value}</td>
                    <td>{activity.participants.map((participant) => participant.name).join(', ')}</td>
                    <td>{activity.description}</td>
                    <td>
                      <button
                        onClick={() => {
                          // Abrir la ventana modal con la información de la actividad para actualizar
                          setActivityModalOpen(true);
                          // Configurar la función para actualizar la actividad
                        }}
                      >
                        Actualizar
                      </button>
                      <button
                        onClick={() => {
                          // Lógica para eliminar la actividad
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
