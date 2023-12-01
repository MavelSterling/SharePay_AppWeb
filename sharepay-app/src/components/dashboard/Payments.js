import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

const Payments = () => {
  const [contacts, setContacts] = useState([]);
  const [balanceSummary, setBalanceSummary] = useState({});

  useEffect(() => {
    loadContactsAndBalances();
  }, []);

  const loadContactsAndBalances = async () => {
    try {
      const response = await axios.get('URL_de_tu_API/payments');
      setContacts(response.data.contacts);
      setBalanceSummary(response.data.balanceSummary);
    } catch (error) {
      console.error('Error al cargar los contactos y saldos:', error);
    }
  };

  const viewContactBalances = (contactId) => {
    // Filtrar los saldos del contacto por evento
    const contactBalances = contacts
      .filter((contact) => contact.id === contactId)
      .map((contact) => contact.balances);

    // Mostrar los saldos por evento
    console.log('Saldos del contacto por evento:', contactBalances);
  };

  const viewMyPendingBalances = () => {
    // Filtrar los saldos pendientes a mis contactos
    const myBalances = contacts
      .filter((contact) => contact.id === 'mi_id_de_usuario')
      .map((contact) => contact.pendingBalance);

    // Mostrar los saldos pendientes
    console.log('Mis saldos pendientes a mis contactos:', myBalances);
  };

  const getPendingPayments = () => {
    // Filtrar los contactos con saldos pendientes
    const contactsWithPendingBalances = contacts.filter((contact) => contact.pendingBalance > 0);

    // Crear una lista con los pagos pendientes
    const pendingPayments = contactsWithPendingBalances.map((contact) => {
      return {
        contactId: contact.id,
        eventId: contact.pendingBalance.eventId,
        amount: contact.pendingBalance.amount,
      };
    });

    return pendingPayments;
  };

  const renderPendingPayments = () => {
    // Obtener los pagos pendientes
    const pendingPayments = getPendingPayments();

    // Renderizar la lista de pagos pendientes
    return (
      <ul>
        {pendingPayments.map((payment) => (
          <li key={payment.contactId}>
            <strong>{payment.contactId}</strong>
            <span> - {payment.eventId}</span>
            <span> - ${payment.amount}</span>
            <button onClick={() => payPendingPayment(payment.eventId, payment.contactId, payment.amount)}>Pagar</button>
          </li>
        ))}
      </ul>
    );
  };

  const payPendingPayment = async (eventId, contactId, amount) => {
    // Redondear el monto del pago
    const roundedAmount = Math.round(amount * 100) / 100;

    // Realizar el pago
    await payBalance(eventId, contactId, roundedAmount);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <h2>Saldos y Pagos</h2>
      {renderPendingPayments()}
    </div>
  );
};

export default Payments;
