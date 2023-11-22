import React, { useState, useEffect } from 'react';
import ActivityModal from './ActivityModal';
import Sidebar from './Sidebar';
import { TextField, TextareaAutosize, Table, TableBody, TableCell, TableRow, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { getAllEvents, getParticipantByUser, createEvent } from '../../api/service';
import axios from 'axios';

const Overlay = ({ isOpen, onClick }) => (
  <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={onClick}></div>
);

const EventInfoPopup = ({ isOpen, onClose, eventInfo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [eventName, setEventName] = useState(eventInfo ? eventInfo.Nombre : '');
  const [eventDescription, setEventDescription] = useState(eventInfo ? eventInfo.Descripcion : '');
  const [eventType, setEventType] = useState(eventInfo ? eventInfo.Tipo : '');
  const handleUpdate = () => {
    const updatedEvent = {
      id: eventInfo.EventoID,
      nombre: eventName,
      descripcion: eventDescription,
      tipo: eventType,
    };

    // Llama a la función de actualización proporcionada por el padre
    onUpdate(updatedEvent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    // Llama a la función de eliminación proporcionada por el padre
    onDelete(eventInfo.id);
    onClose();
  };

  if (!eventInfo) {
    return (
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Información del Evento</DialogTitle>
        <DialogContent>
          <p>La información del evento no está disponible.</p>
        </DialogContent>
        <Button onClick={onClose}>Cerrar</Button>
      </Dialog>
    );
  }

  console.log('event info: ',eventInfo)

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Evento: {eventInfo.Nombre}</DialogTitle>
      <DialogContent>
        {isEditing ? (
          <>
          <div style={{ marginBottom: '16px' }}>
            <h3>Editar Evento</h3>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <TextField
              label="Descripción"
              rows={3}
              variant="outlined"
              fullWidth
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <TextField
              label="Tipo"
              variant="outlined"
              fullWidth
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            />
          </div>
          <div>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Actualizar evento
            </Button>
          </div>
        </>
        ) : (
          <>
            <div className="button-container">
              <img
                    src={eventInfo.Avatar}
                    alt="Avatar"
                    style={{ width: 100, height: 100, borderRadius: '50%' , margin: '0 auto'}}
                  />
            </div>
            <div className="button-container">
              <p style={{ marginTop:20, marginBottom:20,  margin: '0 auto'}}>Creado por {eventInfo.Creador}</p>
            </div>
            <p>Nombre: {eventInfo.Nombre}</p>
            <p>Descripción: {eventInfo.Descripcion}</p>
            <p>Tipo: {eventInfo.Tipo}</p>
            <Button onClick={() => setIsEditing(true)}>Editar</Button>
          </>
        )}
        <Button onClick={handleDelete}>Eliminar evento</Button>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogContent>
    </Dialog>
  );
};

const CreateEventPopup = ({ isOpen, onClose, onCreate }) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const handleCreate = () => {
    const newEvent = {
      nombre: eventName,
      descripcion: eventDescription,
      tipo: eventType,
      avatar: avatar,
      // Otros campos necesarios para la creación del evento
    };

    // Llama a la función de creación proporcionada por el padre
    onCreate(newEvent);
    // Limpia los campos después de la creación
    setEventName('');
    setEventDescription('');
    setEventType('');
    setAvatar('')
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setAvatar(file);
        const previewURL = URL.createObjectURL(file);
        setAvatarPreview(previewURL);
    }
};

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
  <DialogTitle>Crear Nuevo Evento</DialogTitle>
  <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
    {/* Contenedor de Filas */}
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {/* Columna Izquierda */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginRight: '16px' }}>
        <div style={{ marginBottom: '16px', marginTop: '16px' }}>
          <TextField
            label="Nombre del evento"
            variant="outlined"
            fullWidth
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <TextField
            label="Descripción"
            rows={3}
            variant="outlined"
            fullWidth
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <TextField
            label="Tipo"
            variant="outlined"
            fullWidth
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          />
        </div>
      </div>

      {/* Columna Derecha */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '100px' }}>
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar Preview" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '50%' }} />
          ) : (
            "No image uploaded"
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="avatar-upload-event"
          onChange={(e) => {
            setAvatar(e.target.files[0]);
            setAvatarPreview(e.target.files[0]);
          }}
        />
        <label htmlFor="avatar-upload-event">
          <Button variant="contained" color="primary" component="span" style={{ display: 'flex', justifyContent: 'center' , marginBottom: '16px', marginTop: '16px' }}>
            Subir Avatar
          </Button>
        </label>
      </div>
    </div>

    {/* Centro */}
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Crear evento
      </Button>
    </div>

    {/* Botón Cerrar */}
    <Button style={{ marginTop: '16px' }} onClick={onClose}>
      Cerrar
    </Button>
  </DialogContent>
</Dialog>
  );
};

const EventsTable = ({ events, setEventInfoPopupOpen, setSelectedEventInfo }) => (
  <Table style={{ marginBottom: 20, borderCollapse: 'collapse', width: '100%', border: 'none' }}>
    <TableBody>
    {events.map((event) => (
          <TableRow key={event.Evento.EventoID}>
            <TableCell className="center-vertically" style={{ border: 'none', maxWidth: 0 }}>
              <img
                src={event.Evento.Avatar}
                alt="Avatar"
                style={{ width: 40, height: 40, borderRadius: '50%' }}
              />
            </TableCell>
            <TableCell className="center-vertically" style={{ border: 'none', paddingTop: '5px', paddingLeft: '30px', textAlign: 'left' }}>
              {event.Evento.Nombre}
            </TableCell>
            <TableCell className="center-vertically" style={{ border: 'none', paddingTop: '5px', paddingLeft: '1px', textAlign: 'left' }}>
              Tipo: {event.Evento.Tipo}
            </TableCell>
            <TableCell className="center-vertically" style={{ border: 'none', paddingTop: '5px', paddingLeft: '1px', textAlign: 'left' }}>
              <Button
                className='button-normal'
                style={{ background: 'green', color: 'white' }}
                onClick={() => {
                  setEventInfoPopupOpen(true);
                  console.log('imprimiendo event: ',event);
                  setSelectedEventInfo(event.Evento);
                }}
              >
                Más información
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {(events.length === 0) && (
          <TableRow>
            <TableCell colSpan={3} style={{ textAlign: 'center', border: 'none' }}>
              Aún no hay Eventos.
            </TableCell>
          </TableRow>
        )}
    </TableBody>
  </Table>
);

function Events() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isActivityModalOpen, setActivityModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [saveActivity, setSaveActivity] = useState(null);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isEventInfoPopupOpen, setEventInfoPopupOpen] = useState(false);
  const [isEventCreatePopupOpen, setEventCreatePopupOpen] = useState(false);
  const [selectedEventInfo, setSelectedEventInfo] = useState(null);

  const tokenActivo = localStorage.getItem('userToken');
  const usuarioActivo = localStorage.getItem('username');

  const fetchEvents = async () => {
    try {
      const response = await getParticipantByUser(tokenActivo, usuarioActivo);
      setEvents(response.data.participants);
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

  const handleCreateEvent = async (newEvent) => {
    try {
      const response = await createEvent(tokenActivo, newEvent);
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
        <button className="button-event" onClick={() => setEventCreatePopupOpen(true)}>
          Nuevo Evento
        </button>

        <Overlay isOpen={isModalOpen || isEventInfoPopupOpen || isActivityModalOpen} onClick={() => {
          setModalOpen(false);
          setEventInfoPopupOpen(false);
          setActivityModalOpen(false);
          setEventCreatePopupOpen(false);
        }} />

        {isEventCreatePopupOpen && (
          <CreateEventPopup
            isOpen={isEventCreatePopupOpen}
            onClose={() => setEventCreatePopupOpen(false)}
            onSave={createEvent} // Cambiado a selectedEventInfo con minúscula inicial
          />
        )}

        {isEventInfoPopupOpen && (
            <EventInfoPopup
            isOpen={isEventInfoPopupOpen}
            onClose={() => setEventInfoPopupOpen(false)}
            eventInfo={selectedEventInfo}  // Cambiado a selectedEventInfo con minúscula inicial
          />
        )}


        

        <h3>Mis eventos</h3>
          <EventsTable
            events={events}
            setEventInfoPopupOpen={setEventInfoPopupOpen}
            setSelectedEventInfo={setSelectedEventInfo}
          />
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
