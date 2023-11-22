import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { textAlign } from '@mui/system';

function EventModal({ isOpen, onClose, onSave }) {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formError, setFormError] = useState(''); // Mensaje de error del formulario

  const handleSave = () => {
    // Verificar si los campos requeridos están completos
    if (!eventName || !eventDescription || !eventType) {
      setFormError('Por favor, complete todos los campos obligatorios.');
      return; // No se crea el evento si falta algún campo.
    }

    // Aquí podrías realizar la validación de los campos y enviar los datos al servidor.
    const newEvent = {
      name: eventName,
      description: eventDescription,
      type: eventType,
      image: eventImage,
    };

    onSave(newEvent); // Llama a la función onSave para guardar el nuevo evento.
    onClose(); // Cierra el modal.
  };

  return (
    <div className={`event-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-container">
        <span className="close" onClick={onClose}>&times;</span>

        <h3>Crear Nuevo Evento</h3>

        <div className="modal-content">
          <div className="column-event">
            <input
              type="text"
              placeholder="Nombre del Evento"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <textarea
              placeholder="Descripción"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tipo"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            />
            <p className="error-message">{formError}</p>
          </div>

          <div className="column-event">
            <div className="avatar-container-event">
              <div className="avatar-preview" style={{ marginBottom: '10px' }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" />
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
                  setEventImage(e.target.files[0]);
                  setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                }}
              />
              <label htmlFor="avatar-upload-event">
                <Button variant="contained" color="primary" component="span">
                  Subir Avatar
                </Button>
              </label>
            </div>
          </div>
        </div>

        <div className="button-container">
          <button className="button-event-modal" onClick={handleSave} style={{ margin: '0 auto' }}>
            Crear evento
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventModal;
