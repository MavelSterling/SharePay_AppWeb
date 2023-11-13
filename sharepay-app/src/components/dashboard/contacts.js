import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { getUserByEmail , getContacts} from '../../api/service';


const ContactsTable = ({ contacts, handleAddContact, handleDeleteContact }) => {
  return (
    <Table style={{ minWidth: 650, marginBottom: 20 }}>
      <TableHead >
        <TableRow>
          <TableCell style={{ fontWeight: 'bold', fontSize: 16 }}>Apodo</TableCell>
          <TableCell style={{ fontWeight: 'bold', fontSize: 16 }}>Estado de la solicitud</TableCell>
          <TableCell style={{ fontWeight: 'bold', fontSize: 16 }}>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {contacts.map(contact => (
          <TableRow key={contact.id}>
            <TableCell>{contact.remitente}</TableCell>
            <TableCell>{contact.estado}</TableCell>
            <TableCell>
              <Button
                style={{ marginRight: 10, background: '#4CAF50', color: 'white' }}
                onClick={() => handleAddContact(contact)}
              >
                Invitar
              </Button>
              <Button
                style={{ background: '#f44336', color: 'white' }}
                onClick={() => handleDeleteContact(contact.id)}
              >
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};



function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        const contactosDelUsuario = await getContacts(userToken, Usuario);
        const data = contactosDelUsuario.data;
        setContacts(data.user_contacts);
    };

    const userToken = localStorage.getItem('userToken');
    const Usuario = localStorage.getItem('username');


    const handleSearch = async () => {
        if (!searchEmail) return;
        //if(!userToken) return;
        // Llamada a la API para buscar usuarios por correo electrónico
        const responseBusqueda = await getUserByEmail(userToken, searchEmail);
        const data = responseBusqueda.data;
        setSearchResults(data);
    };

    const handleAddContact = (newContact) => {
        // Llamada a la API para añadir un contacto
        // Luego, podrías recargar tus contactos
        loadContacts();
    };

    const handleDeleteContact = async (contactId) => {
        // Llamada a la API para eliminar un contacto
        // Verificar si no tienen eventos activos juntos antes de eliminar
        // Luego, podrías recargar tus contactos
        loadContacts();
    };


    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '20px' }}>

                <h2 style={{ textAlign: 'center' }}> Mis Contactos</h2>

                <h3>Buscar Contactos</h3>
                <div className="search-container">
                    <input 
                        value={searchEmail} 
                        onChange={e => setSearchEmail(e.target.value)} 
                        placeholder="Buscar por correo electrónico" 
                        className="search-input"
                    />
                    <button className="button-search" onClick={handleSearch}>Buscar</button>


                </div>

                <ul>
                    {searchResults.map(user => (
                        <li key={user.id}>
                            {user.name} - {user.email}
                            <button onClick={() => handleAddContact(user)}>Añadir</button>
                        </li>
                    ))}
                </ul>
                
                {contacts && contacts.length > 0 ? (
                <ContactsTable
                    contacts={contacts}
                    handleAddContact={handleAddContact}
                    handleDeleteContact={handleDeleteContact}
                />
                ) : (
                <p style={{ textAlign: 'center', marginTop: '40px' }}>
                    Aún no hay contactos agregados.
                </p>
                )}

               
            </div>
        </div>
    );
}

export default Contacts;
