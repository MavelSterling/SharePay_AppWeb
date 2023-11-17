import React, { useState, useEffect , useCallback} from 'react';
import Sidebar from './Sidebar';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, darkScrollbar } from '@mui/material';
import {createCotnact , checkCommonEvents , updateContactInfo , getUserByUsername , getContacts, searchProfileByUsername} from '../../api/service';

const ContactsTable = ({ Title, contacts, handleAddContact, handleDeleteContact, Outgoing }) => {
  return (
    <Table style={{ marginBottom: 20, borderCollapse: 'collapse', width: '100%', border: 'none' }}>
      <TableHead>
        <TableRow>
          <TableCell colSpan={3} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, border: 'none' }}>
            {Title}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Outgoing ? (
          contacts.map((contact) => (
            <TableRow key={contact.ContactID}>
              <TableCell className="center-vertically" style={{ border: 'none', maxWidth: 0 }}>
                <img
                  src={contact.remitente.avatar}
                  alt="Avatar"
                  style={{ width: 40, height: 40, borderRadius: '50%' }}
                />
              </TableCell>
              <TableCell className="center-vertically" style={{ border: 'none', paddingTop: '5px', paddingLeft: '1px', textAlign: 'left' }}>
                {contact.remitente.username}
              </TableCell>
              <TableCell style={{ border: 'none', textAlign: 'right' }}>
                {contact.estado === 'Pendiente' ? (
                  <Button
                    style={{ background: '#f44336', color: 'white' }}
                    onClick={() => handleDeleteContact(contact.remitente.username)}
                  >
                    Cancelar Solicitud
                  </Button>
                ) : (
                  <Button
                    style={{ background: '#f44336', color: 'white' }}
                    onClick={() => handleDeleteContact(contact.remitente.username)}
                  >
                    Eliminar Contacto
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          contacts.map((contact) => (
            <TableRow key={contact.ContactID}>
              <TableCell className="center-vertically" style={{ border: 'none', maxWidth: 0 }}>
                <img
                  src={contact.emisor.avatar}
                  alt="Avatar"
                  style={{ width: 40, height: 40, borderRadius: '50%' }}
                />
              </TableCell>
              <TableCell className="center-vertically" style={{ border: 'none', paddingTop: '5px', paddingLeft: '1px', textAlign: 'left' }}>
                {contact.emisor.username}
              </TableCell>
              <TableCell style={{ border: 'none', textAlign: 'right' }}>
                <Button
                  style={{ background: '#8fce00', color: 'white' }}
                  onClick={() => handleAddContact(contact.emisor.username)}
                >
                  Aceptar
                </Button>
                <Button
                  style={{ background: '#f44336', color: 'white' , marginLeft: '10px'}}
                  onClick={() => handleDeleteContact(contact.emisor.username)}
                >
                  Rechazar
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}

        {contacts.length === 0 && (
          null
        )}

      </TableBody>
    </Table>
  );
};
const ResultsTable = ({ contacts, handleAddContact }) => {
  const usuarioActivo = localStorage.getItem('username');
  console.log('la informacion contacts que les entra a las tablas es: ', contacts)

  const myAvailableContacts = contacts.filter(contact => contact.user !== usuarioActivo)

  const filteredContacts = contacts.filter(contact => contact.emisor !== usuarioActivo);


  return (
    <Table style={{ marginBottom: 20, borderCollapse: 'collapse', width: '100%', border: 'none' }}>
      <TableHead>
        <TableRow>
          <TableCell colSpan={3} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, border: 'none' }}>
            Resultados de la busqueda
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {contacts.map((perfil) => (
          <TableRow key={perfil.user.id}>
           <TableCell className="center-vertically" style={{ border: 'none', maxWidth: 0 }}>
                <img
                  src={perfil.FotoOAvatar}
                  alt="Avatar"
                  style={{ width: 40, height: 40, borderRadius: '50%' }}
                />
              </TableCell>
              <TableCell className="center-vertically" style={{ border: 'none', paddingTop: '5px', paddingLeft: '1px', textAlign: 'left' }}>
                {perfil.user}
              </TableCell>
            <TableCell style={{ border: 'none', textAlign: 'right' }}>
              <Button
                style={{ background: '#8fce00', color: 'white' }}
                onClick={() => handleAddContact(perfil.user)}
              >
                Enviar solicitud
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {contacts.length === 0 && (
          null
        )}
      </TableBody>
    </Table>
  );
}

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const Token_Activo = localStorage.getItem('userToken');
    const Usuario_Activo = localStorage.getItem('username');
    
    const loadContacts = useCallback(async () => {
      const contactosDelUsuario = await getContacts(Token_Activo, Usuario_Activo);
      const data = contactosDelUsuario.data;
      console.log('la data de que buscas es: ' , data.user_contacts.filter(contact => contact.estado === 'Pendiente' && contact.remitente.username === Usuario_Activo))
      setContacts(data.user_contacts);
    }, [Token_Activo, Usuario_Activo]);

    useEffect(() => {
      loadContacts();
    }, [loadContacts]);
    
    


    const handleSearch = async () => {
      if (!searchUser) return alert('Ingresa el Apodo o Nickname del contacto que deseas buscar');
      //if(!userToken) return;
      // Llamada a la API para buscar usuarios por correo electrónico

      const usuario_activo = localStorage.getItem('userToken')

      try {
        const responseBusqueda = await searchProfileByUsername(Token_Activo, searchUser);
        if(responseBusqueda.data.length < 1) {
          throw('error')
        } else {
          setSearchResults(responseBusqueda.data.filter((perfil) => perfil.user !== usuario_activo));
        }
      } catch (error) {
        console.log('El usuario no existe.');
        alert('El usuario no existe.');
      }
      loadContacts();
      console.log(searchResults)
    };

    const handleAddContact = async (newContact) => {

      // Llamada a la API para buscar usuarios por correo electrónico
      try {
        const responseBusqueda = await searchProfileByUsername(Token_Activo, newContact);
        if(responseBusqueda.data.length < 1) {
          throw('error')
        } else {
          const contacto_Perfil = responseBusqueda.data[0];
          console.log('Perfil encontrado: ', contacto_Perfil.user);
          const jsonContact = {
            Emisor: Usuario_Activo,
            Remitente: contacto_Perfil.user,
            Estado: 'Pendiente',
          };
          const responseCreateContact = await createCotnact(Token_Activo , jsonContact);
          if (responseCreateContact.status === 200) {
            console.log('Solocitud enviada exitosamente.');
            alert('Solocitud enviada exitosamente.');
          }
        }
      } catch (error) {
        console.log('Hubo un error al agregar el usuario.', error.response.data.message);
        alert(error.response.data.message);
      }
      loadContacts();
    };

    const handleDeleteContact = async (contact_to_delete) => {
      console.log('contacto a borrar' , contact_to_delete)
      console.log('usuario :' , Usuario_Activo)
      try {
        const usuarios = {
          Emisor: Usuario_Activo,
          Remitente: contact_to_delete,
        };
    
        // Verificar si tienen eventos activos en común antes de eliminar
        const responseEvents = await checkCommonEvents(Token_Activo, usuarios);
        const eventosEnComun = responseEvents.data;
    
        if (eventosEnComun.length > 0) {
          alert('No se pudo eliminar debido a eventos en común');
        } else {
          // Actualizar la información del contacto a 'Rechazada'
          const jsonContact = {
            Emisor: Usuario_Activo,
            Remitente: contact_to_delete,
            Estado: 'Rechazada',
          };
    
          const responseUpdate = await updateContactInfo(Token_Activo, jsonContact);
    
          if (responseUpdate.status === 200) {
            alert('Información actualizada correctamente');
            //window.location.reload();
          } else {
            console.error('No se pudo actualizar la información.');
            alert('No se pudo actualizar la información.');
          }
        }
      } catch (error) {
        console.error('Hubo un error al intentar contactar con el servidor.', error);
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
                {searchResults.length < 1 ? (
                  <p style={{ textAlign: 'center', marginTop: '10px', marginTop: '30px' , marginBottom: '90px' }}>
                    Resultados de busqueda.
                  </p>
                ) : (<ResultsTable
                      contacts={searchResults.filter((contact) => contact.user !== Usuario_Activo)}
                      handleAddContact={handleAddContact}
                      //Outgoing={true}
                    />)}

                <ContactsTable
                  Title={'Mis contactos'}
                  contacts={contacts.filter(contact => contact.estado === 'Aceptada' && contact.emisor.username === Usuario_Activo)}
                  handleDeleteContact={handleDeleteContact}
                  Outgoing={true}
                />
                {contacts.filter(contact => contact.estado === 'Aceptada').length > 0 ? null : (
                  <p style={{ textAlign: 'center', marginTop: '10px', marginBottom: '60px' }}>
                    Aún no hay Contactos agregados.
                  </p>
                )}

                <ContactsTable
                  Title={'Solicitudes recibidas'}
                  contacts={contacts.filter(contact => contact.estado === 'Pendiente' && contact.remitente.username === Usuario_Activo)}
                  handleDeleteContact={handleDeleteContact}
                  Outgoing={false}
                />
                {contacts.filter(contact => contact.estado === 'Pendiente' && contact.remitente.username === Usuario_Activo).length > 0 ? null : (
                  <p style={{ textAlign: 'center', marginTop: '40px' }}>
                    Aún no hay Solicitudes Recibidas.
                  </p>
                )}

                <ContactsTable
                  Title={'Solicitudes enviadas'}
                  contacts={contacts.filter(contact => contact.estado === 'Pendiente' && contact.emisor.username === Usuario_Activo)}
                  handleDeleteContact={handleDeleteContact}
                  Outgoing={true}
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
