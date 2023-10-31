import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';


function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        // Suponiendo que tienes una función para cargar tus contactos desde el backend
        loadContacts();
    }, []);

    const loadContacts = async () => {
        // Llamada a la API para obtener tus contactos
        const response = await fetch('/api/myContacts'); 
        const data = await response.json();
        setContacts(data);
    };

    const handleSearch = async () => {
        if (!searchEmail) return;
        // Llamada a la API para buscar usuarios por correo electrónico
        const response = await fetch(`/api/searchContacts?email=${searchEmail}`);
        const data = await response.json();
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
                
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Correo Electrónico</TableCell>
                            <TableCell>Apodo</TableCell>
                            <TableCell>Estado de la Cuenta</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map(contact => (
                            <TableRow key={contact.id}>
                                <TableCell>{contact.name}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.nickname}</TableCell>
                                <TableCell>{contact.active ? 'Sí' : 'No'}</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={() => handleAddContact(contact)}>Invitar</Button>
                                    <Button color="secondary" onClick={() => handleDeleteContact(contact.id)}>Eliminar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

               
            </div>
        </div>
    );
}

export default Contacts;
