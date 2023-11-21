// Agrega un nuevo componente de modal, NotificationModal.js

import React from 'react';

const NotificationModal = ({ onClose, message }) => {
  return (
    <div className="modal-noti">
      <div className="modal-content-noti">
        <span className="close-noti" onClick={onClose}>&times;</span>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default NotificationModal;
