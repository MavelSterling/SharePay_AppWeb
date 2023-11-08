import React, { useState } from 'react';

function ActivityModal({ isOpen, onClose, onSave }) {
  const [activityName, setActivityName] = useState('');
  const [activityValue, setActivityValue] = useState(0);
  const [activityDescription, setActivityDescription] = useState('');

  const handleSave = () => {
    if (!activityName || activityValue <= 0) {
      // Valida que los campos obligatorios estén completados
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const newActivity = {
      name: activityName,
      value: activityValue,
      description: activityDescription,
    };

    onSave(newActivity); // Llama a la función onSave para guardar la nueva actividad.
    onClose(); // Cierra el modal.
  };

  return (
    <div className={`activity-modal ${isOpen ? 'open' : ''}`}>
      <div style={{ flex: 3, padding: '20px', textAlign: 'center' }}>
        <span className="close" onClick={onClose}>
          &times;
        </span>

        <h3>Añadir actividad</h3>

        <div className="modal-content">
          <div className="column-event">
        <input
          type="text"
          placeholder="Nombre de la actividad"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor total"
          value={activityValue}
          onChange={(e) => setActivityValue(Number(e.target.value))}
        />
      </div>
      <div className="column-event">

        <textarea
          placeholder="Descripción"
          value={activityDescription}
          onChange={(e) => setActivityDescription(e.target.value)}
        />
        </div>

        <button className="button-event-modal" onClick={handleSave}>Crear</button>
        </div>
      </div>
    </div>
  );
}

export default ActivityModal;
