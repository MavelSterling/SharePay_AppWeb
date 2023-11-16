import React, { useState, useEffect , useCallback} from 'react';
import Sidebar from './Sidebar';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, darkScrollbar } from '@mui/material';
import { getUserByUsername , getContacts} from '../../api/service';

const ContactsTable = ({ Title, contacts, handleDeleteContact }) => {
  return (
    <Table style={{ marginBottom: 20, borderCollapse: 'collapse', width: '100%', border: 'none' }}>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 , border: 'none' }}>
            {Title}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell className="center-vertically" style={{ border: 'none' }}>
              <img
                src={contact.remitente.avatar}
                alt="Avatar"
                style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 30 }}
              />
              {contact.remitente.username}
            </TableCell>
            <TableCell style={{ border: 'none', textAlign: 'right' }}>
              {contact.estado === 'Pendiente' ? (
                <Button
                  style={{ background: '#f44336', color: 'white' }}
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  Cancelar Solicitud
                </Button>
              ) : (
                <Button
                  style={{ background: '#f44336', color: 'white' }}
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  Eliminar Contacto
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
        {contacts.length === 0 && (
          null
        )}
      </TableBody>

    </Table>
  );
};

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const userToken = localStorage.getItem('userToken');
    const Usuario = localStorage.getItem('username');
    
    const loadContacts = useCallback(async () => {
      const contactosDelUsuario = await getContacts(userToken, Usuario);
      const data = contactosDelUsuario.data;
      setContacts(data.user_contacts);
    }, [userToken, Usuario]);

    useEffect(() => {
      loadContacts();
    }, [loadContacts]);
    
    


    const handleSearch = async () => {
        if (!searchUser) return;
        //if(!userToken) return;
        // Llamada a la API para buscar usuarios por correo electrónico
        try {
          const responseBusqueda = await getUserByUsername(userToken, searchUser);
          const data = responseBusqueda.data;
          setSearchResults(data);
        } catch (error) {
          console.log('La búsqueda no arrojó resultados.');
          alert('La búsqueda no arrojó resultados.');
        }
    };

    const handleAddContact = (newContact) => {
        // Llamada a la API para añadir un contacto
        // Luego, podrías recargar tus contactos
        loadContacts();
    };

    const handleDeleteContact = async () => {
        
    };


    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '20px' }}>

                <h2 style={{ textAlign: 'center' }}>Dashboard de contactos</h2>

                <h3>Agregar Contactos</h3>
                <div className="search-container">
                    <input 
                        value={searchUser} 
                        onChange={e => setSearchUser(e.target.value)} 
                        placeholder="Buscar por Apodo (Nickname)" 
                        className="search-input"
                    />
                    <button className="button-search" onClick={handleSearch}>Buscar</button>
                </div>

                <ContactsTable
                  Title={'Mis contactos'}
                  contacts={contacts.filter(contact => contact.estado === 'Aceptada')}
                  handleDeleteContact={handleDeleteContact}
                />
                {contacts.filter(contact => contact.estado === 'Aceptada').length > 0 ? null : (
                  <p style={{ textAlign: 'center', marginTop: '10px', marginBottom: '60px' }}>
                    Aún no hay Contactos agregados.
                  </p>
                )}

                <ContactsTable
                  Title={'Solicitudes Enviadas'}
                  contacts={contacts.filter(contact => contact.estado === 'Pendiente')}
                  handleDeleteContact={handleDeleteContact}
                />

                {contacts.filter(contact => contact.estado === 'Pendiente').length > 0 ? null : (
                  <p style={{ textAlign: 'center', marginTop: '40px' }}>
                    Aún no hay Solicitudes Enviadas.
                  </p>
                )}


               
            </div>
        </div>
    );
}

export default Contacts;
