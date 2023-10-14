// src/components/dashboard/UserInformation.js

import React, { useState } from 'react';
import Sidebar from './Sidebar';


function UserInformation() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [nickname, setNickname] = useState('');
    const [avatar, setAvatar] = useState(null);

    const handleUpdate = (e) => {
        e.preventDefault();
        // Aquí se maneja la lógica de actualización con el backend
        console.log('Actualizando información:', email, fullName, nickname, avatar);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
        }
    };

    return (
        
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <h2>Información del usuario</h2>
                <form onSubmit={handleUpdate} style={{ width: '100%', maxWidth: '400px' }}>
                    <div style={{ margin: '10px 0' }}>
                        <label>
                            Correo electrónico:
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                            />
                        </label>
                    </div>
                    <div style={{ margin: '10px 0' }}>
                        <label>
                            Nombre completo:
                            <input 
                                type="text" 
                                value={fullName} 
                                onChange={(e) => setFullName(e.target.value)} 
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                            />
                        </label>
                    </div>
                    <div style={{ margin: '10px 0' }}>
                        <label>
                            Apodo:
                            <input 
                                type="text" 
                                value={nickname} 
                                onChange={(e) => setNickname(e.target.value)} 
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                            />
                        </label>
                    </div>
                    <div style={{ margin: '10px 0' }}>
                        <input
                            accept="image/*"
                            id="avatar-upload"
                            type="file"
                            onChange={handleAvatarChange}
                        />
                        <label htmlFor="avatar-upload" style={{ display: 'block', marginTop: '5px' }}>
                            Subir Avatar
                        </label>
                    </div>
                    <div style={{ margin: '10px 0' }}>
                        <button type="submit">Actualizar información</button>
                    </div>
                </form>

                <div style={{ margin: '10px 0' }}>
                    <button onClick={() => { /* Lógica para desactivar cuenta */ }}>
                        Desactivar cuenta
                    </button>
                </div>

            </div>
        </div>

    );
}

export default UserInformation;
