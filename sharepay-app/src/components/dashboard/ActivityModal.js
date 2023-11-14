import React, { useState } from 'react';

function ActivityModal({ isOpen, onClose, onSave }) {
  const [activityName, setActivityName] = useState('');
  const [activityValue, setActivityValue] = useState(0);
  const [activityDescription, setActivityDescription] = useState('');

  const handleSave = () => {
    if (!activityName || activityValue <= 0) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const newActivity = {
      name: activityName,
      value: activityValue,
      description: activityDescription,
    };

    onSave(newActivity);
    onClose();
  };

  return (
    <div className={`event-modal ${isOpen ? 'open' : ''}`}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <span className="close" onClick={onClose}>
          &times;
        </span>

        <h3>Añadir actividad</h3>

        <div className="modal-content">
          <div className="column-event">
            <label>Nombre de la actividad:</label>
            <input
              type="text"
              placeholder=""
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
            />

            
            <label>Descripción:</label>
            <textarea
              placeholder=""
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
            />
          </div>

          <div className="column-event">
          <label>Valor total:</label>
            <input
              type="number"
              placeholder="0"
              value={activityValue}
              onChange={(e) => setActivityValue(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button className="button-event-modal-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="button-event-modal-create" onClick={handleSave}>
            Crear actividad
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityModal;


