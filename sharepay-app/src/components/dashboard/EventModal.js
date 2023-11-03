import React, { useState } from 'react';
import Button from '@mui/material/Button';

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
      <div style={{ flex: 3, padding: '20px', textAlign: 'center' }}>

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
            <p style={{ color: 'red' }}>{formError}</p>
          </div>

          <div className="column-event">
            <div className="avatar-container-event">
              <div style={{ width: '150px', height: '150px', border: '1px solid black', marginBottom: '10px' }}>
                {avatarPreview ? <img src={avatarPreview} alt="Avatar Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : "No image uploaded"}
              </div>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload-event"
                onChange={(e) => {
                  setEventImage(e.target.files[0]);
                  setAvatarPreview(URL.createObjectURL(e.target.files[0])); // Actualiza la vista previa
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

        <button className="button-event-modal" onClick={handleSave}>Crear evento</button>

      </div>
    </div>
  );
}

export default EventModal;
