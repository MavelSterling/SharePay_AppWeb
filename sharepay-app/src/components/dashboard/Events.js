import React, { useState, useEffect } from 'react';
import ActivityModal from './ActivityModal';
import Sidebar from './Sidebar';
import { TextField, TextareaAutosize, Table, TableBody, TableCell, TableRow, Button, Dialog, DialogTitle, DialogContent , FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import {deleteEvent, updateEventInfo, getEventActivities, getAllEvents, getParticipantByUser, createEvent } from '../../api/service';
import axios from 'axios';

const Overlay = ({ isOpen, onClick }) => (
  <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={onClick}></div>
);

const EventInfoPopup = ({ isOpen, onClose, eventInfo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [eventName, setEventName] = useState(eventInfo.Evento ? eventInfo.Evento.Nombre : '');
  const [eventDescription, setEventDescription] = useState(eventInfo.Evento ? eventInfo.Evento.Descripcion : '');
  const [eventType, setEventType] = useState(eventInfo.Evento ? eventInfo.Evento.Tipo : '');
  
  const handleUpdate = async () => {
    const updatedEvent = {
      id: eventInfo.Evento.EventoID,
      nombre: eventName,
      descripcion: eventDescription,
      tipo: eventType,
    };


    try {
      const updateEventResponse = await updateEventInfo(localStorage.getItem('userToken'), updatedEvent)
    } catch (error) {
      alert('Hubo un error al actualizar los datos del evento.')
    }
    setIsEditing(false);
  };

  const validateEditing = async (eventID) => {
    try {
      const activities = await getEventActivities(localStorage.getItem('userToken'),eventID);
      if (activities.data.activities.length > 0) {
        alert('No se puede editar el evento, ya tiene actividades registradas')
        setIsEditing(false);
      }
    } catch (error) {
      setIsEditing(true);
    }
  };  

  const handleDelete = async (eventID) => {
    try {
      const activities = await getEventActivities(localStorage.getItem('userToken'), eventID);
  
      if (activities.data.activities) {
        alert('No se puede eliminar el evento ya que tiene actividades pendientes');
      } else {
        const deleteResponse = await deleteEvent(localStorage.getItem('userToken'), eventID);
        onClose();  // Close the dialog or perform any other necessary actions on success
      }
    } catch (error) {
      console.error('Error deleting event:', error);
  
      // Handle the error (display an error message, log it, etc.)
      // Example: alert('Error deleting event. Please try again.');
  
      // You may choose to close the dialog even if an error occurs
      onClose();
    }
  };
  

  if (!eventInfo.Evento) {
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


  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm">
      <DialogTitle>Evento: {eventInfo.Evento.Nombre}</DialogTitle>
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
                    src={eventInfo.Evento.Avatar}
                    alt="Avatar"
                    style={{ width: 100, height: 100, borderRadius: '50%' , margin: '0 auto'}}
                  />
            </div>
            <div className="button-container">
              <p style={{ marginTop:20, marginBottom:20,  margin: '0 auto'}}>Creado por {eventInfo.Evento.Creador}</p>
            </div>
            <p>Descripción: {eventInfo.Evento.Descripcion}</p>
            <p>Tipo: {eventInfo.Evento.Tipo}</p>
            <Button onClick={() => validateEditing(eventInfo.Evento.EventoID)}>Editar</Button>
          </>
        )}
        <Button onClick={() => handleDelete(eventInfo.Evento.EventoID)}>Eliminar evento</Button>
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
      creador: localStorage.getItem('username'),
      evento: eventName,
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

  const OPCIONES_FOTO_AVATAR = [
    ['https://w7.pngwing.com/pngs/980/935/png-transparent-clapperboard-architecture-sports-activities-text-fashion-logo-thumbnail.png', 'avatar 1'],
    ['https://png.pngtree.com/png-clipart/20220628/original/pngtree-food-logo-png-image_8239850.png', 'avatar 2'],
    ['https://logo.com/image-cdn/images/kts928pd/production/cbe600c9fc90afe063527b300816e390f57a8915-349x346.png', 'avatar 3'],
    ['https://assets.stickpng.com/images/590605810cbeef0acff9a63c.png', 'avatar 4'],
    ['https://logowik.com/content/uploads/images/google-shopping.jpg', 'avatar 5'],
    ['https://png.pngtree.com/png-clipart/20230921/original/pngtree-swimming-logo-logo-pool-white-vector-png-image_12645079.png', 'avatar 6']
  ];

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
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '20px' }}>
              {/* Mostrar la vista previa del avatar seleccionado */}
              <img src={avatarPreview} alt="Avatar Preview" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '50%' }} />
            </div>
            {/* Lista de opciones de avatares */}
            <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px', marginTop: '16px' }}>
              <InputLabel>Seleccionar Avatar</InputLabel>
              <Select
                value={avatarPreview}
                onChange={(e) => setAvatarPreview(e.target.value) & setAvatar(e.target.value)}
                label="Seleccionar Avatar"
                renderValue={(selected) => {
                  const selectedOption = OPCIONES_FOTO_AVATAR.find((option) => option[0] === selected);
                  return (
                    <>
                      {selectedOption && (
                        <>
                          <img
                            src={selectedOption[0]}
                            alt={`Avatar ${selectedOption[1]}`}
                            style={{ width: '30px', height: '30px', marginRight: '8px', borderRadius: '50%' }}
                          />
                          {`  ${selectedOption[1]}`}
                        </>
                      )}
                    </>
                  );
                }}
              >
                {OPCIONES_FOTO_AVATAR.map((option) => (
                  <MenuItem key={option[1]} value={option[0]}>
                    <>
                      <img
                        src={option[0]}
                        alt={`Avatar ${option[1]}`}
                        style={{ width: '30px', height: '30px', marginRight: '8px', borderRadius: '50%' }}
                      />
                      {`Opción número ${option[1]}`}
                    </>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          </div>
        </div>

        {/* Centro */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <Button variant="contained" color="primary" onClick={() => { handleCreate(); onClose(); }}>
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
            <TableCell className="center-vertically" style={{ border: 'none', maxWidth: 0 , flex: 'center'  }}>
              <img
                src={event.Evento.Avatar}
                alt="Avatar"
                style={{ width: 40, height: 40, borderRadius: '50%' }}
              />
            </TableCell>
            <TableCell className="center-vertically" style={{ border: 'none', paddingTop: '5px', paddingLeft: '30px', textAlign: 'left' }}>
              {event.Evento.Nombre}
            </TableCell>
            <TableCell className="center-vertically" style={{ border: 'none', paddingTop: '5px', paddingLeft: '1px', textAlign: 'center' }}>
              Tipo: {event.Evento.Tipo}
            </TableCell>
            <TableCell className="center-vertically" style={{ border: 'none', paddingTop: '5px', paddingLeft: '1px', textAlign: 'center' }}>
              <Button
                className='button-normal'
                style={{ background: 'blue', color: 'white' }}
                onClick={() => {
                  setEventInfoPopupOpen(true);
                  
                  setSelectedEventInfo(event);
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
 //const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isActivityModalOpen, setActivityModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [saveActivity, setSaveActivity] = useState(null);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isEventInfoPopupOpen, setEventInfoPopupOpen] = useState(false);
  const [isEventCreatePopupOpen, setEventCreatePopupOpen] = useState(false);
  const [isActivitiesInfoPopupOpen, setActivitiesInfoPopupOpen] = useState(false);
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
      const response = await createEvent(localStorage.getItem('userToken'), newEvent);
      setModalOpen(false);
      fetchEvents();
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

        <Overlay isOpen={isModalOpen || isEventInfoPopupOpen || isActivityModalOpen || isActivitiesInfoPopupOpen} onClick={() => {
          setModalOpen(false);
          setEventInfoPopupOpen(false);
          setActivityModalOpen(false);
          setEventCreatePopupOpen(false);
          setActivitiesInfoPopupOpen(false);
        }} />

        {isEventCreatePopupOpen && (
          <CreateEventPopup
            isOpen={isEventCreatePopupOpen}
            onClose={() => setEventCreatePopupOpen(false)}
            onCreate={handleCreateEvent} // Cambiado a selectedEventInfo con minúscula inicial
          />
        )}

        {isEventInfoPopupOpen && (
            <EventInfoPopup
            isOpen={isEventInfoPopupOpen}
            onClose={() => setEventInfoPopupOpen(false)}
            eventInfo={selectedEventInfo}  // Cambiado a selectedEventInfo con minúscula inicial
          />
        )}

        {isActivitiesInfoPopupOpen && (
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
            <h3>Actividades en las que participo</h3>
            <table>
              <thead>
                <tr>
                  <th>Nombre de la actividad</th>
                  <th>Evento</th>
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
