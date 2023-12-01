// Importa los módulos necesarios de React y otras librerías
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa el cliente HTTP Axios
import Sidebar from './Sidebar'; // Importa el componente Sidebar

// Define el componente funcional Payments
const Payments = () => {
  // Utiliza hooks de estado para manejar variables de estado
  const [contacts, setContacts] = useState([]); // Almacena los contactos
  const [balanceSummary, setBalanceSummary] = useState({}); // Almacena el resumen de saldos
  const [selectedContact, setSelectedContact] = useState(''); // Almacena el contacto seleccionado
  const [paymentAmount, setPaymentAmount] = useState(0); // Almacena la cantidad de pago

  // useEffect se utiliza para realizar acciones después de que el componente ha sido renderizado
  useEffect(() => {
    loadContactsAndBalances(); // Llama a la función para cargar contactos y saldos
  }, []); // El segundo parámetro [] asegura que useEffect se ejecute solo una vez al montar el componente

  // Función para cargar contactos y saldos desde la API
  const loadContactsAndBalances = async () => {
    try {
      // Realiza una solicitud GET a la URL de la API para obtener contactos y saldos
      const response = await axios.get('URL_de_tu_API/payments');
      // Actualiza los estados con la respuesta de la API
      setContacts(response.data.contacts);
      setBalanceSummary(response.data.balanceSummary);
    } catch (error) {
      console.error('Error al cargar los contactos y saldos:', error);
    }
  };

  // Función para ver los saldos de un contacto por evento
  const viewContactBalances = (contactId) => {
    const contactBalances = contacts && Array.isArray(contacts)
      ? contacts
        .filter((contact) => contact.id === contactId)
        .map((contact) => contact.balances)
      : [];

    console.log('Saldos del contacto por evento:', contactBalances);
  };

  // Función para ver los saldos pendientes a los contactos del usuario
  const viewMyPendingBalances = () => {
    const myBalances = contacts && Array.isArray(contacts)
      ? contacts
        .filter((contact) => contact.id === 'mi_id_de_usuario')
        .map((contact) => contact.pendingBalance)
      : [];

    console.log('Mis saldos pendientes a mis contactos:', myBalances);
  };

  // Función para realizar un pago de saldo a un contacto
  const payBalance = async (eventId, contactId, amount) => {
    try {
      // Realiza una solicitud POST a la URL de la API para realizar el pago
      await axios.post('URL_de_tu_API/payments/pay', {
        eventId,
        contactId,
        amount,
      });

      // Recarga contactos y saldos después de realizar el pago
      loadContactsAndBalances();
    } catch (error) {
      console.error('Error al pagar el saldo:', error);
    }
  };

  // Función para ver el resumen de saldos
  const viewSummary = () => {
    console.log('Resumen de saldos:', balanceSummary);
  };

  // Función para realizar un pago parcial
  const makePartialPayment = async (eventId, contactId, amount) => {
    try {
      // Realiza una solicitud POST a la URL de la API para realizar el pago parcial
      await axios.post('URL_de_tu_API/payments/partial-payment', {
        eventId,
        contactId,
        amount,
      });

      // Recarga contactos y saldos después de realizar el pago parcial
      loadContactsAndBalances();
    } catch (error) {
      console.error('Error al realizar el pago parcial:', error);
    }
  };

  // Función para manejar la selección de un contacto desde el dropdown
  const handleContactSelect = (contactId) => {
    setSelectedContact(contactId);
  };

  // Renderiza la estructura del componente
  return (
    <div style={{ display: 'flex' }}>
    <Sidebar /> {/* Renderiza el componente Sidebar */}
    <div>
      <h2>Saldos y Pagos</h2>
      <div>
        {/* Dropdown para seleccionar un contacto */}
        <select onChange={(e) => handleContactSelect(e.target.value)}>
          <option value="" disabled selected>
            Selecciona un contacto
          </option>
          {/* Mapea los contactos para mostrar opciones en el dropdown */}
          {contacts && Array.isArray(contacts) &&
            contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
        </select>
      </div>
      <div>
        {/* Botones para realizar diversas acciones */}
        <button onClick={() => viewContactBalances(selectedContact)}>
          Ver saldos del contacto
        </button>
        <button onClick={viewMyPendingBalances}>
          Ver saldos pendientes a mis contactos
        </button>
        <button onClick={viewSummary}>Ver resumen de saldos</button>
        <button onClick={() => makePartialPayment(1, selectedContact, paymentAmount)}>
          Pago parcial
        </button>
        {/* Botón "Pagar saldo" y campo de entrada debajo de los otros botones */}
        <button onClick={() => payBalance(1, selectedContact, paymentAmount)}>
          Pagar saldo
        </button>
        <input
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
        />
      </div>
      <div>
          {/* Renderiza la tabla de pagos */}
          <h3>Tabla de Pagos</h3>
          <table>
            <thead>
              <tr>
                <th>Contacto</th>
                <th>Saldo Pendiente</th>
                <th>Realizar Pago</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapea los contactos para renderizar filas en la tabla */}
              {contacts && Array.isArray(contacts) &&
                contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>{contact.name}</td>
                    <td>{contact.pendingBalance}</td>
                    <td>
                      {/* Botón para realizar el pago desde la tabla */}
                      <button onClick={() => payBalance(1, contact.id, paymentAmount)}>
                        Pagar
                      </button>
                      {/* Campo de entrada para la cantidad del pago */}
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Exporta el componente Payments para su uso en otros lugares
export default Payments;
