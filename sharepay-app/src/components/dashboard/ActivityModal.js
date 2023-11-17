import React, { useState } from 'react';

function ActivityModal({ isOpen, onClose, onSave, availableEvents }) {
  const [activityDescription, setActivityDescription] = useState('');
  const [activityValue, setActivityValue] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [participantShares, setParticipantShares] = useState([]);
  const [defaultShares, setDefaultShares] = useState(true);

  const handleSave = () => {
    if (!activityDescription || activityValue <= 0) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const calculatedShares = defaultShares
      ? participants.map(() => (100 / participants.length).toFixed(2))
      : participantShares;

    const totalPercentage = calculatedShares.reduce((sum, share) => sum + parseFloat(share), 0);
    if (totalPercentage !== 100) {
      alert('La sumatoria de porcentajes debe ser igual al 100%.');
      return;
    }

    const newActivity = {
      description: activityDescription,
      value: activityValue,
      participants: participants.map((participant, index) => ({
        name: participant,
        share: parseFloat(calculatedShares[index]),
      })),
    };

    onSave(newActivity);
    onClose();
  };

  return (
    <div className={`event-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-container">
        <span className="close" onClick={onClose}>
          &times;
        </span>

        <h3>Añadir actividad</h3>

        <div className="modal-content">
          <div className="column-event">
            <label>Descripción:</label>
            <textarea
              placeholder="Descripción de la actividad"
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
            />

            <label>Valor total:</label>
            <input
              type="number"
              placeholder="0"
              value={activityValue}
              onChange={(e) => setActivityValue(Number(e.target.value))}
            />
          </div>

          <div className="column-event">
            <label>Seleccionar evento:</label>
            <select
              onChange={() => {
                setParticipants([]); // Limpiar participantes al cambiar de evento
                setDefaultShares(true); // Restaurar configuración predeterminada al cambiar de evento
              }}
            >
               <option value="" disabled>
                Seleccionar evento
              </option>
             {availableEvents.map((event) => (
               <option key={event.id} value={event.id}>
             {event.name}
               </option>
                ))}
           </select>

            <label>Seleccionar participantes:</label>
            <select
              multiple
              value={participants}
              onChange={(e) => setParticipants(Array.from(e.target.selectedOptions, (option) => option.value))}
            >
              {/* Aquí se debe mapear los participantes disponibles para el evento seleccionado */}
              <option value="contacto1">Contacto 1</option>
              <option value="contacto2">Contacto 2</option>
              {/* ...otros contactos */}
            </select>

            <label>Configuración de participación:</label>
            <div>
              <input
                type="checkbox"
                id="defaultShares"
                checked={defaultShares}
                onChange={() => setDefaultShares(!defaultShares)}
              />
              <label htmlFor="defaultShares">Usar porcentajes predeterminados</label>
            </div>

            {!defaultShares && (
              <div>
                <label>Porcentaje de participación por participante:</label>
                {participants.map((participant, index) => (
                  <div key={index}>
                    <span>{participant}: </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={participantShares[index] || ''}
                      onChange={(e) => {
                        const sharesCopy = [...participantShares];
                        sharesCopy[index] = e.target.value;
                        setParticipantShares(sharesCopy);
                      }}
                    />
                    %
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="button-container">
          <button className="button-event-modal-create" onClick={handleSave}>
            Crear actividad
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityModal;
