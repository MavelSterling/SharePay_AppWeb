import React, { useState, useEffect , useCallback} from 'react';
import Sidebar from './Sidebar';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, darkScrollbar } from '@mui/material';
import {checkCommonEvents , updateContactInfo , getUserByUsername , getContacts} from '../../api/service';

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

    const Token_Activo = localStorage.getItem('userToken');
    const Usuario_Activo = localStorage.getItem('username');
    
    const loadContacts = useCallback(async () => {
      const contactosDelUsuario = await getContacts(Token_Activo, Usuario_Activo);
      const data = contactosDelUsuario.data;
      setContacts(data.user_contacts);
    }, [Token_Activo, Usuario_Activo]);

    useEffect(() => {
      loadContacts();
    }, [loadContacts]);
    
    


    const handleSearch = async () => {
        if (!searchUser) return;
        //if(!userToken) return;
        // Llamada a la API para buscar usuarios por correo electrónico
        try {
          const responseBusqueda = await getUserByUsername(Token_Activo, searchUser);
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
        
      // Verificar si no tienen eventos activos juntos antes de eliminar
      try {
        const buscar = {
          Emisor: Usuario_Activo,
          Remitente: searchUser,
        };

        const EventosEnComun = await checkCommonEvents(Token_Activo, buscar);
        console.log('eventos: ', EventosEnComun , EventosEnComun.data)

        if (EventosEnComun){
          alert('No se pudo eliminar debido a eventos en común');
        } else {

          const jsonDataContact = {
            Emisor: Usuario_Activo,
            Remitente: searchUser,
            Estado: 'Rechazada',
          }

          const responseUpdate = await updateContactInfo(Token_Activo, jsonDataContact);

          if (responseUpdate.status === 200){
            alert('Información actualizada correctamente');
            window.location.reload();
          } else {
            console.error('No se pudo actualizar la información.');
            alert('No se pudo actualizar la información.');
          }
        }
      } catch (error) {
        console.error('Hubo un error al intentar contactar con el servidor.');
        alert('Hubo un error al intentar contactar con el servidor.');
        }

        // Luego, podrías recargar tus contactos
        loadContacts();
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
