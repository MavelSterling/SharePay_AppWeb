import React, { useState, useEffect } from 'react';
import ActivityModal from './ActivityModal';
import Sidebar from './Sidebar';
import { TextField,Input , TextareaAutosize, Table, TableBody, TableCell, TableRow, Button, Dialog, DialogTitle, DialogContent , FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import {deleteEvent, updateEventInfo, getEventActivities, getAllEvents, getParticipantByUser, createEvent } from '../../api/service';
import axios from 'axios';

const Overlay = ({ isOpen, onClick }) => (
  <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={onClick}></div>
);

const EventInfoPopup = ({ isOpen, onClose, eventInfo, myContacts, onUpdate, onDelete , setCreateActivityPopupOpen}) => {
  const [showActivities, setShowActivities] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [eventName, setEventName] = useState(eventInfo.Evento ? eventInfo.Evento.Nombre : '');
  const [eventDescription, setEventDescription] = useState(eventInfo.Evento ? eventInfo.Evento.Descripcion : '');
  const [eventType, setEventType] = useState(eventInfo.Evento ? eventInfo.Evento.Tipo : '');
  const [currentActivities, setCurrentActivities] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([])
  
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
        alert('Ya no puedes editar el evento, tiene actividades registradas')
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


  const handleShowActivities = async (eventID) => {
    try {
      const activities = await getEventActivities(localStorage.getItem('userToken'), eventID);
      
      if (activities.data.activities) {
        setCurrentActivities(activities.data.activities);
        setShowActivities(true);
      } else {
        console.log('El evento no tiene actividades');
      }
    } catch (error) {
      console.log('El evento no tiene actividades:', error);
      alert('El evento no tiene actividades registradas.');
    }
  };
  
  const contentEditar = (
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
      <div style={{ marginBottom: '16px' }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Seleccionar Participantes</InputLabel>
          <Select
            multiple
            value={selectedParticipants}
            onChange={(e) => setSelectedParticipants(e.target.value)}
            label="Seleccionar Participantes"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300, // Set the max height of the dropdown list
                },
              },
            }}
          >
            {/* Add your participant options dynamically */}
            {myContacts.map((participant, index) => (
              <MenuItem key={index} value={participant}>
                Contacto {participant.Nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginRight: '5px' }}>
          Actualizar evento
        </Button>
        <Button variant="contained" color="secondary" onClick={() => {
          if (localStorage.getItem('username') === eventInfo.Evento.Creador) {
            handleDelete(eventInfo.Evento.EventoID);
          } else {
            alert('Solamente el creador puede eliminar el evento')
            onClose()
          }
        }} style={{ marginLeft: '5px' }}>Eliminar evento</Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Button onClick={handleUpdate}>
          Volver
        </Button>
      </div>
    </>
  );

  const contentEvento = (
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
            <Button onClick={() => {
              if (localStorage.getItem('username') === eventInfo.Evento.Creador) {
                validateEditing(eventInfo.Evento.EventoID);
              } else {
                alert('Solamente el creador del evento puede modificar los parametros')
              }
            }}>Editar</Button>
            <Button onClick={() => {
              setShowActivities(true);
              handleShowActivities(eventInfo.Evento.EventoID); // Pasar el ID del evento
              //onClose();
            }}>Ver Actividades</Button>
            <Button onClick={onClose}>Cerrar</Button>
          </>
  );

  const contentActividades = currentActivities.length > 0 ? (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Actividades del Evento {eventInfo.Evento.Nombre}</DialogTitle>
      <DialogContent>
        <div>
          {currentActivities.map((activity, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px',marginRight:'10px',  display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <p>Actividad: {activity.Nombre}</p>
                <p>Descripción: {activity.Descripcion}</p>
                <p>Valor: {activity.Valor} COP</p>
              </div>
              {eventInfo.Evento.Creador === localStorage.getItem('username') && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' , marginLeft: '25px' }}>
                  <div><Button>Agregar Invitados</Button></div>
                </div>
              )}
              {eventInfo.Evento.Creador !== localStorage.getItem('username') && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' , marginLeft: '25px' }}>
                  <div><Button>Ver Invitados</Button></div>
                </div>
              )}
            </div>
          
          ))}
        </div>
      </DialogContent>
      <div style={{ display: 'flex', justifyContent: 'center' , marginBottom:'25px'}}>
        <Button onClick={() => setShowActivities(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' , marginLeft: '10px', marginRight: '10px' }}>Volver</Button>
        {eventInfo.Evento.Creador === localStorage.getItem('username') && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' , marginLeft: '10px', marginRight: '10px' }}>
                    <div><Button onClick={() => {
                      onClose();
                      setCreateActivityPopupOpen(true);
                    }}>Crear Actividad</Button></div>
                  </div>
                )}
        <Button onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' , marginLeft: '10px', marginRight: '10px' }}>Cerrar</Button>
      </div>
    </Dialog>
    ) : (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>No hay actividades en el evento '{eventInfo.Evento.Nombre}'</DialogTitle>
      <DialogContent style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' , marginBottom:'10px', marginTop:'25px'}}>
          <Button onClick={() => setShowActivities(false)}>Volver</Button>
          {eventInfo.Evento.Creador === localStorage.getItem('username') && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' , marginLeft: '10px', marginRight: '10px' }}>
                    <div><Button onClick={() => {
                      onClose();
                      setCreateActivityPopupOpen(true);
                    }}>Crear Actividad</Button></div>
                  </div>
                )}
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );


  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm">
      <DialogTitle>Evento: {eventInfo.Evento.Nombre}</DialogTitle>
      <DialogContent>
        {isEditing ? (
          <>
          {contentEditar}
        </>
        ) : (
          <>
            {showActivities ? (contentActividades) : (contentEvento)}
          </>
        )}
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
    ['https://png.pngtree.com/element_our/png/20181119/cinema-vector-illustration-png_242108.jpg', 'avatar 4'],
    ['https://logowik.com/content/uploads/images/google-shopping.jpg', 'avatar 5'],
    ['https://png.pngtree.com/png-clipart/20230921/original/pngtree-swimming-logo-logo-pool-white-vector-png-image_12645079.png', 'avatar 6']
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle style={{ display: 'flex', justifyContent: 'center' }}>Crear Nuevo Evento</DialogTitle>
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
              <img src={avatarPreview} alt="Avatar Preview" style={{ maxWidth: '80%', maxHeight: '80%', borderRadius: '50%' }} />
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

const CreateActivityPopup = ({ isOpen, onClose, onCreate, eventInfo, myContacts}) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [valorTotal, setValorTotal] = useState('');

  const handleValorTotalChange = (e) => {
    const nuevoValor = e.target.value;
    if (!isNaN(nuevoValor)) {
      setValorTotal(nuevoValor);
    }
  };

  const handleCreate = () => {
    
    const newActivity = {
      EventoID: eventInfo.Evento.EventoID,
      Nombre: eventName,
      Descripcion: eventDescription,
      ValorTotal: valorTotal,
      // Otros campos necesarios para la creación del evento
    };

    const newActivityParticipants = {

    };

    // Llama a la función de creación proporcionada por el padre
    onCreate(newActivity);
    // Limpia los campos después de la creación
    setEventName('');
    setEventDescription('');
    setValorTotal('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle style={{ display: 'flex', justifyContent: 'center' }}>Crear Nueva Actividad</DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Contenedor de Filas */}
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {/* Columna Izquierda */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginRight: '16px' }}>
            <div style={{ marginBottom: '16px', marginTop: '16px' }}>
              <TextField
                label="Nombre de la actividad"
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
                label="Valor"
                type="number"
                variant="outlined"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                fullWidth
                value={valorTotal}
                onChange={(e) => setValorTotal(e.target.value)}
              />
            </div>
          </div>

          {/* Columna Derecha */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            
            {/* Lista de participantes de avatares */}
            <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px', marginTop: '16px' }}>
              <InputLabel>Invitar Contactos</InputLabel>
              
            </FormControl>

          </div>
        </div>

        {/* Centro */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <Button variant="contained" color="primary" onClick={() => { handleCreate(); onClose(); }}>
            Crear Actividad
          </Button>
        </div>

        {/* Botón Cerrar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
          <Button style={{ marginTop: '6px' }} onClick={onClose}>
            Cerrar
          </Button>
        </div>
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
              {event.Evento.Nombre} creado por {event.Evento.Creador}
            </TableCell>
            <TableCell className="center-vertically" style={{ border: 'none', paddingTop: '5px', paddingLeft: '1px', textAlign: 'center' }}>
              Tipo: {event.Evento.Tipo}
            </TableCell>
            <TableCell className="center-vertically" style={{ border: 'none', paddingTop: '5px', paddingLeft: '1px', textAlign: 'center' }}>
              <Button
                className='button-normal'
                style={{ background: 'green', color: 'white' ,marginLeft: '25px'}}
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
  //const [isModalOpen, setModalOpen] = useState(false);
 //const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isCreateActivityPopupOpen, setCreateActivityPopupOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [saveActivity, setSaveActivity] = useState(null);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isEventInfoPopupOpen, setEventInfoPopupOpen] = useState(false);
  const [isEventCreatePopupOpen, setEventCreatePopupOpen] = useState(false);
  const [isActivitiesInfoPopupOpen, setActivitiesInfoPopupOpen] = useState(false);
  const [selectedEventInfo, setSelectedEventInfo] = useState(null);
  const [misContactos, setMisContactos] = useState([]);

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
      setCreateActivityPopupOpen(false);
      // Recargar la lista de actividades después de crear una nueva actividad
      fetchActivities(eventId);
    } catch (error) {
      console.error('Error al crear una actividad:', error);
    }
  };
  

  useEffect(() => {
    if(selectedEventInfo){
      console.log(selectedEventInfo)
    }
    fetchEvents();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Eventos y Actividades</h2>
        <button className="button-event" onClick={() => setEventCreatePopupOpen(true)}>
          Nuevo Evento
        </button>

        <Overlay isOpen={ isEventInfoPopupOpen || isCreateActivityPopupOpen || isActivitiesInfoPopupOpen} onClick={() => {
          setEventInfoPopupOpen(false);
          setCreateActivityPopupOpen(false);
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

        {isCreateActivityPopupOpen && (
          <CreateActivityPopup
            isOpen={isCreateActivityPopupOpen}
            onClose={() => setCreateActivityPopupOpen(false)}
            onSave={saveActivity}
            eventInfo={selectedEventInfo}
            myContacts={misContactos}
          />
        )}

        {isEventInfoPopupOpen && (
          <EventInfoPopup
            isOpen={isEventInfoPopupOpen}
            onClose={() => setEventInfoPopupOpen(false)}
            eventInfo={selectedEventInfo} 
            myContacts={misContactos}
            setCreateActivityPopupOpen = {setCreateActivityPopupOpen}
          />
        )}

        {isActivitiesInfoPopupOpen && (
            <CreateActivityPopup
            isOpen={isEventInfoPopupOpen}
            onClose={() => setEventInfoPopupOpen(false)}
            eventInfo={selectedEventInfo}  // Cambiado a selectedEventInfo con minúscula inicial
          />
        )}


        

        <h3>Eventos en los que participo</h3>
          <EventsTable
            events={events}
            setEventInfoPopupOpen={setEventInfoPopupOpen}
            setSelectedEventInfo={setSelectedEventInfo}
          />
      </div>
    </div>
  );
}

export default Events;
