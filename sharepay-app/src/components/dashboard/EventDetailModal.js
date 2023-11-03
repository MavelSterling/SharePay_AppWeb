import React, { useState } from 'react';
import axios from 'axios'; // Importa Axios

function EventDetailModal({ isOpen, event, onUpdate, onDelete, onClose }) {
  const [eventName, setEventName] = useState(event.name);
  const [eventDescription, setEventDescription] = useState(event.description);
  const [eventType, setEventType] = useState(event.type);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = () => {
    const updatedEvent = {
      id: event.id,
      name: eventName,
      description: eventDescription,
      type: eventType,
    };

    // Realiza una solicitud PUT para actualizar el evento en el backend
    axios.put(`/api/events/${event.id}/`, updatedEvent)
      .then((response) => {
        onUpdate(response.data); // Actualiza la representación del evento con los datos recibidos
        setIsEditing(false);
      })
      .catch((error) => {
        // Maneja errores si es necesario
      });
  };

  const handleDelete = () => {
    // Realiza una solicitud DELETE para eliminar el evento en el backend
    axios.delete(`/api/events/${event.id}/`)
      .then(() => {
        onDelete(event.id); // Elimina el evento de la lista en el frontend
        onClose();
      })
      .catch((error) => {
        // Maneja errores si es necesario
      });
  };

  return (
    <div className={`event-detail-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        {isEditing ? (
          <>
            <h3>Editar Evento</h3>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <input
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            />
            <button className="button-event-modal-update" onClick={handleUpdate}>Actualizar evento</button>
          </>
        ) : (
          <>
            <h3>Detalles del Evento</h3>
            <p>Nombre: {event.name}</p>
            <p>Descripción: {event.description}</p>
            <p>Tipo: {event.type}</p>
            <button onClick={() => setIsEditing(true)}>Editar</button>
          </>
        )}
        <button className="button-event-modal-delete" onClick={handleDelete}>Eliminar evento</button>
      </div>
    </div>
  );
}

export default EventDetailModal;
