import React, { useState, useEffect } from 'react';
import ActivityModal from './ActivityModal';
import Sidebar from './Sidebar';
import { TextField,Input , TextareaAutosize, Table, TableBody, TableCell, TableRow, Button, Dialog, DialogTitle, DialogContent , FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import {deleteEvent, updateEventInfo, getEventActivities, getAllEvents, getMyEvents, createEvent, createActivity , createEventParticipant, getContacts, getEventParticipants} from '../../api/service';
import axios from 'axios';

const Overlay = ({ isOpen, onClick }) => (
  <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={onClick}></div>
);

const EventInfoPopup = ({ isOpen, onClose, eventInfo, myContacts, onUpdate, onDelete , setCreateActivityPopupOpen, setAgregarInvitadosPopupOpen}) => {
  const [showActivities, setShowActivities] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [eventName, setEventName] = useState(eventInfo.Evento ? eventInfo.Evento.Nombre : '');
  const [eventDescription, setEventDescription] = useState(eventInfo.Evento ? eventInfo.Evento.Descripcion : '');
  const [eventType, setEventType] = useState(eventInfo.Evento ? eventInfo.Evento.Tipo : '');
  const [currentActivities, setCurrentActivities] = useState([]);
  const [currentParticipants, setCurrentParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const [searchUser, setSearchUser] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
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

  const handleSearch = async (user) => {
    try {
      const responseContactos = await getContacts(localStorage.getItem('userToken'),localStorage.getItem('username'));
      const userContacts = responseContactos.data.user_contacts;
      const resultado_Contactos = userContacts.filter(contacto => contacto.estado === 'Aceptada' && (contacto.emisor.username.includes(user) || contacto.remitente.username.includes(user)));
      setSearchResults(resultado_Contactos)
    } catch (error) {
      console.log('Error obteniendo los resultados: ', error)
      setSearchUser('')
      setSearchResults([])
    }
  }

  const handleAddParticipants = async (eventID, participant) => {
    try {

      const newParticipant = {
        Apodo: participant,
        EventoID: eventID,
        Estado: 'Pendiente',
      };
      
      const participante = await createEventParticipant(localStorage.getItem('userToken'),newParticipant);
      console.log('Solicitud del evento enviada al participante.')
    } catch (error) {
      alert(error.response.data.message)
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
        <DialogTitle><h3>Información del Evento</h3></DialogTitle>
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

  const handleShowParticipants = async (eventID) => {
    try {
      const eventParticipants = await getEventParticipants(localStorage.getItem('userToken'), eventID);

      console.log(eventParticipants.data.participantes)
      
      if (eventParticipants.data.participantes) {
        setCurrentParticipants(eventParticipants.data.participantes);
        setShowParticipants(true);
      } else {
        console.log('El evento no tiene Participantes');
      }
    } catch (error) {
      console.log('El evento no tiene Participantes:', error);
      alert('El evento no tiene Participantes.');
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
      <div style={{ marginBottom: '46px' }}>
        <TextField
          label="Tipo"
          variant="outlined"
          fullWidth
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginRight: '5px' }}>
          Actualizar evento
        </Button>
        <Button variant="contained" color="secondary" onClick={() => {
            handleDelete(eventInfo.Evento.EventoID);
        }} style={{ marginLeft: '5px' }}>Eliminar evento</Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Button onClick={() => {
        setIsEditing(false);
        setEventName(eventInfo.Evento.Nombre);
        setEventDescription(eventInfo.Evento.Descripcion);
        setEventType(eventInfo.Evento.Tipo);
        }}>
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
            <div style={{display:'flex', justifyContent:'center'}}>
              {(localStorage.getItem('username') === eventInfo.Evento.Creador ? (
              <>
              <Button onClick={() => {
                validateEditing(eventInfo.Evento.EventoID);
              }}>Editar</Button>
              
              </>
              
            ) : (<></>))}
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
            <Button onClick={() => {
                setIsInviting(true);
                handleSearch('');
                handleShowParticipants(eventInfo.Evento.EventoID);
              }}>Participantes</Button>
            <Button onClick={() => {
              setShowActivities(true);
              handleShowActivities(eventInfo.Evento.EventoID); // Pasar el ID del evento
              //onClose();
            }}>Actividades</Button>
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
              <Button onClick={onClose}>Cerrar</Button>
            </div>
          </>
  );

  

  const contentInvitar_Evento = (
    <>
      <div style={{ marginBottom: '16px' }}>
        <h2>Participando</h2>
      </div>

      {/* Mapea la lista de participantes */}
      {currentParticipants.map((participant, index) => (
        <div key={index} className="participant-item" style={{ display: 'flex', alignItems: 'center' , justifyContent: 'left' ,marginBottom: '20px'}}>
          <>
            <img
              src={participant.Avatar_participante}
              alt="Avatar"
              style={{ width: 35, height: 35, borderRadius: '50%' , marginRight: '20px'}}
            />
            {participant.Apodo}
          </>
        </div>
      ))}
      
      {eventInfo.Evento.Creador === localStorage.getItem('username') ? (
        <>
        <div style={{ marginBottom: '16px' }}>
        <h3>Agregar participantes</h3>
      </div>
      <div className="search-container">
          <input 
              value={searchUser} 
              onChange={e => {
                setSearchUser(e.target.value)
                handleSearch(e.target.value)
              }} 
              placeholder="Filtrar por Apodo (Nickname)" 
              className="search-input"
          />
          <button className="button-search" onClick={()=>{handleSearch(searchUser)}}>Filtrar</button>
      </div>
      
      <div style={{ marginBottom: '16px',  marginTop: '16px' }}>
      
      </div>
      <div style={{ marginBottom: '16px' }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Mis contactos</InputLabel>
          <Select
            multiple
            value={selectedParticipants}
            onChange={(e) => {}}
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
            {searchResults.map((participant, index) => (
              <MenuItem key={index} value={participant}>
                {(localStorage.getItem('username') === participant.remitente.username ? (
                  <>
                  <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center'}}>
                  <img
                    src={participant.emisor.avatar}
                    alt={`Avatar ${participant.emisor.avatar}`}
                    style={{ width: '30px', height: '30px', marginRight: '8px', borderRadius: '50%' }}
                  />
                    
                  {participant.emisor.username}
                  <Button variant="contained" color="primary" onClick={()=>{
                    //console.log(participant.emisor.username)
                    handleAddParticipants(eventInfo.Evento.EventoID, participant.emisor.username)
                  }} style={{justifyContent: 'right' }}>Invitar</Button>

                  </div>
                  </>
                ) : (
                  <>
                <img
                  src={participant.remitente.avatar}
                  alt={`Avatar ${participant.remitente.avatar}`}
                  style={{ width: '30px', height: '30px', marginRight: '8px', borderRadius: '50%' }}
                />
                  
                {participant.remitente.username}
                <Button variant="contained" color="primary" onClick={()=>{
                    //console.log(participant.emisor.username)
                    handleAddParticipants(eventInfo.Evento.EventoID, participant.emisor.username)
                  }} style={{justifyContent: 'right' }}>Invitar</Button>
                </>
                ))}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
        </>
      ) : ('')}
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Button onClick={() => {
        setIsInviting(false);
        setEventName(eventInfo.Evento.Nombre);
        setEventDescription(eventInfo.Evento.Descripcion);
        setEventType(eventInfo.Evento.Tipo);
        }}>
          Volver
        </Button>
      </div>
    </>
  );

  const contentActividades = currentActivities.length > 0 ? (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle><h3>Actividades del Evento {eventInfo.Evento.Nombre}</h3></DialogTitle>
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
                  <div><Button
                  onClick={() => {
                    onClose();
                    setAgregarInvitadosPopupOpen(true);
                  }}>Agregar Invitados</Button></div>
                </div>
              )}
              {eventInfo.Evento.Creador !== localStorage.getItem('username') && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' , marginLeft: '25px' }}>
                  <div><Button>Quienes van?</Button></div>
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
      <DialogTitle><h3>No hay actividades en el evento '{eventInfo.Evento.Nombre}'</h3></DialogTitle>
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

 

  const contenido = () => {
    if(isEditing){
      return contentEditar
    }
    if(showActivities){
      return contentActividades
    }
    if(isInviting){
      return contentInvitar_Evento
    }

    return contentEvento
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm">
      <DialogTitle><h3>Evento: {eventInfo.Evento.Nombre}</h3></DialogTitle>
      <DialogContent>
        {contenido()}
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
      <DialogTitle style={{ display: 'flex', justifyContent: 'center' }}><h3>Crear Nuevo Evento</h3></DialogTitle>
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

const CreateInvitadosPopup = ({ isOpen, onClose, onCreate, activitytInfo, eventParticipants, setEventInfoPopupOpen}) => {
  const [activityEventID, setActivityEventID] = useState('');
  const [activityName, setActivityName] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [activityValue, setActivityValue] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const handleCreate = () => {
    
    const newEvent = {
      creador: localStorage.getItem('username'),
      evento: activityName,
      descripcion: activityDescription,
      tipo: activityValue,
      avatar: avatar,
      // Otros campos necesarios para la creación del evento
    };

    // Llama a la función de creación proporcionada por el padre
    onCreate(newEvent);
    // Limpia los campos después de la creación
    setActivityName('');
    setActivityDescription('');
    setActivityValue('');
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
      <DialogTitle style={{ display: 'flex', justifyContent: 'center' }}><h3>Crear Nuevo Evento</h3></DialogTitle>
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
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <TextField
                label="Descripción"
                rows={3}
                variant="outlined"
                fullWidth
                value={activityDescription}
                onChange={(e) => setActivityDescription(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <TextField
                label="Tipo"
                variant="outlined"
                fullWidth
                value={activityValue}
                onChange={(e) => setActivityValue(e.target.value)}
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

const CreateActivityPopup = ({ isOpen, onClose, onCreate, eventInfo, myContacts, volver, setEventInfoPopupOpen}) => {
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
    // Validación de campos requeridos
    if (!eventName || !eventDescription || !valorTotal) {
      // Mostrar mensaje de error, por ejemplo, alert o console.error
      alert('Todos los campos son obligatorios');
    } else {
      const newActivity = {
        EventoID: eventInfo.Evento.EventoID,
        Nombre: eventName,
        Descripcion: eventDescription,
        ValorTotal: valorTotal,
        Creador: eventInfo.Evento.Creador
        // Otros campos necesarios para la creación del evento
      };
  
      // Llama a la función de creación proporcionada por el padre
      onCreate(newActivity);
      // Limpia los campos después de la creación
      setEventName('');
      setEventDescription('');
      setValorTotal('');
      onClose(); 
      setEventInfoPopupOpen(true);
    }

  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle style={{ display: 'flex', justifyContent: 'center' }}><h3>Crear Nueva Actividad</h3></DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Contenedor de Filas */}
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {/* Columna Izquierda */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginRight: '16px' }}>
            <div style={{ marginBottom: '16px', marginTop: '16px' }}>
              <TextField
                label="Nombre de la actividad"
                required
                variant="outlined"
                fullWidth
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <TextField
                label="Descripción"
                required
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
                required
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
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 , justifyContent: 'center'}}>
            
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1 , justifyContent: 'center'}}>
              Evento {eventInfo.Evento.Nombre}
            </div>
            <img src={eventInfo.Evento.Avatar} alt="Avatar Preview" style={{ maxWidth: '80%', maxHeight: '80%', borderRadius: '50%' , display: 'flex', flexDirection: 'row', flex: 1 , justifyContent: 'center'}} />

          </div>
        </div>

        {/* Centro */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <Button variant="contained" color="primary" onClick={() => { 
            handleCreate()
            }}>
            Crear Nueva Actividad
          </Button>
        </div>

        {/* Botón Cerrar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
          <Button style={{ marginTop: '6px' }} onClick={() => {
              onClose();
              setEventInfoPopupOpen(true);
            }}>
            Volver
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
  const [isAgregarInvitadosPopupOpen, setAgregarInvitadosPopupOpen] = useState(false);
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
      const response = await getMyEvents(tokenActivo, usuarioActivo);
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
      setSaveActivity(handleCreateActivity);
      setAvailableEvents(events);
    } catch (error) {
      console.error('Error al crear un evento:', error);
    }
  };

  const handleCreateActivity = async (newActivity) => {
    try {
      const response = await createActivity(localStorage.getItem('userToken'), newActivity);
      alert('Evento creado con exito.')

      const newParticipant = {
        Apodo: localStorage.getItem('username'),
        EventoID: selectedEventInfo.Evento.EventoID,
        Estado: 'Activo',
      };

      const responseparticipante = await createEventParticipant(localStorage.getItem('userToken'), newParticipant);
      setCreateActivityPopupOpen(false);
    } catch (error) {
      console.error('Error al crear una actividad:', error);
    }
  };
  

  useEffect(() => {
    if(selectedEventInfo){
      //console.log(selectedEventInfo)
    }
    fetchEvents();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }} >Eventos y Actividades</h2>
        <button className="button-event" onClick={() => setEventCreatePopupOpen(true)}>
          Nuevo Evento
        </button>

        <Overlay isOpen={ isEventInfoPopupOpen || isCreateActivityPopupOpen || isActivitiesInfoPopupOpen || isAgregarInvitadosPopupOpen} onClick={() => {
          setEventInfoPopupOpen(false);
          setCreateActivityPopupOpen(false);
          setEventCreatePopupOpen(false);
          setActivitiesInfoPopupOpen(false);
          setAgregarInvitadosPopupOpen(false);
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
            onCreate={handleCreateActivity}
            eventInfo={selectedEventInfo}
            myContacts={misContactos}
            setEventInfoPopupOpen={setEventInfoPopupOpen}
          />
        )}

        {isEventInfoPopupOpen && (
          <EventInfoPopup
            isOpen={isEventInfoPopupOpen}
            onClose={() => setEventInfoPopupOpen(false)}
            eventInfo={selectedEventInfo} 
            myContacts={misContactos}
            setCreateActivityPopupOpen = {setCreateActivityPopupOpen}
            setAgregarInvitadosPopupOpen = {setAgregarInvitadosPopupOpen}
          />
        )}
        

        <h3 style={{ textAlign: 'center' }}>Mis eventos</h3>
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
