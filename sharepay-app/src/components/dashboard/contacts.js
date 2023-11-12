import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { getUserByEmail , getContacts} from '../../api/service';


function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {

        // Suponiendo que tienes una función para cargar tus contactos desde el backend
        loadContacts();
    }, []);

    const userToken = localStorage.getItem('userToken');
    const UsuarioID = localStorage.getItem('userId')

    const loadContacts = async () => {

        // Llamada a la API para obtener tus contactos
        const contactosDelUsuario = await getContacts(userToken, UsuarioID);
        const data = contactosDelUsuario.data;
        setContacts(data);
    };

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
                <h2 style={{ textAlign: 'center' }}>Mis Contactos</h2>
                <h3>Buscar Contactos</h3>
                <div className="search-container" style={{ marginBottom: '20px' }}>
                    <input 
                        value={searchEmail} 
                        onChange={e => setSearchEmail(e.target.value)} 
                        placeholder="Buscar por correo electrónico" 
                        className="search-input"
                    />
                    <button className="button-search" onClick={handleSearch}>Buscar</button >
                </div>

    
                {contacts.length >= 0 && (
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
                )}
    
                {contacts.length === 0 && (
                    <p style={{ textAlign: 'center' , marginTop:'40px'}}>No hay contactos.</p>
                )}
            </div>
        </div>
    );
}

export default Contacts;
